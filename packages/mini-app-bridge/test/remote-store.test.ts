import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createRemoteStore, type RemoteStoreScheduler } from "../src/react/store.js"

type State = Readonly<{ status: "initializing" | "ready" | "error"; value: number | null }>

class TestScheduler implements RemoteStoreScheduler {
  readonly delays: number[] = []
  readonly cleared: number[] = []
  private nextId = 1
  private tasks = new Map<number, { callback: () => void; delay: number }>()

  setTimeout = (callback: () => void, delay: number) => {
    const id = this.nextId++
    this.delays.push(delay)
    this.tasks.set(id, { callback, delay })
    return id
  }

  clearTimeout = (handle: unknown) => {
    const id = handle as number
    this.cleared.push(id)
    this.tasks.delete(id)
  }

  runNext() {
    const task = [...this.tasks.entries()].sort((left, right) => left[1].delay - right[1].delay)[0]
    assert(task, "expected a scheduled task")
    this.tasks.delete(task[0])
    task[1].callback()
  }

  get size() {
    return this.tasks.size
  }
}

const initializing = (value: number | null = null): State => ({ status: "initializing", value })
const ready = (value: number): State => ({ status: "ready", value })
const settle = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

const createRetryStore = (
  load: () => Promise<State>,
  scheduler: TestScheduler,
  setReceiver: (receive: (value: State) => void) => void = () => undefined
) =>
  createRemoteStore(
    load,
    (receive) => {
      setReceiver(receive)
      return () => undefined
    },
    {
      equals: (left, right) => left.status === right.status && left.value === right.value,
      retry: {
        delays: [250, 500, 1_000, 2_000],
        shouldRetry: (value) => value.status === "initializing",
        exhaustedError: () => new Error("not ready"),
      },
      scheduler,
    }
  )

describe("remote store readiness policy", () => {
  it("preserves an initial request during Strict Mode subscription replay", async () => {
    const scheduler = new TestScheduler()
    let loads = 0
    let remoteStops = 0
    let resolveLoad: ((value: number) => void) | undefined
    const store = createRemoteStore(
      () => {
        loads += 1
        return new Promise<number>((resolve) => {
          resolveLoad = resolve
        })
      },
      () => () => {
        remoteStops += 1
      },
      { scheduler }
    )

    const stopFirst = store.subscribe(() => undefined)
    assert.equal(loads, 1)

    stopFirst()
    assert.equal(scheduler.size, 1)

    const stopSecond = store.subscribe(() => undefined)
    assert.equal(scheduler.size, 0)
    assert.equal(loads, 1)
    assert.equal(remoteStops, 0)

    resolveLoad?.(42)
    await settle()
    assert.equal(store.getSnapshot().data, 42)

    stopSecond()
    scheduler.runNext()
    assert.equal(remoteStops, 1)
  })

  it("uses the exact bounded schedule and exposes retry exhaustion", async () => {
    const scheduler = new TestScheduler()
    let loads = 0
    const store = createRetryStore(async () => {
      loads += 1
      return initializing()
    }, scheduler)
    const stop = store.subscribe(() => undefined)
    await settle()

    for (const expectedLoads of [2, 3, 4, 5]) {
      scheduler.runNext()
      await settle()
      assert.equal(loads, expectedLoads)
    }

    assert.deepEqual(scheduler.delays, [250, 500, 1_000, 2_000])
    assert.equal(scheduler.size, 0)
    assert.match(String(store.getSnapshot().error), /not ready/)
    stop()
  })

  it("shares one sequence, cancels it on last unsubscribe, and restarts on subscribe", async () => {
    const scheduler = new TestScheduler()
    let loads = 0
    const store = createRetryStore(async () => {
      loads += 1
      return initializing()
    }, scheduler)
    const stopFirst = store.subscribe(() => undefined)
    const stopSecond = store.subscribe(() => undefined)
    await settle()
    assert.equal(loads, 1)
    assert.equal(scheduler.size, 1)

    stopFirst()
    assert.equal(scheduler.size, 1)
    stopSecond()
    assert.equal(scheduler.size, 2)
    scheduler.runNext()
    assert.equal(scheduler.size, 0)

    const stopThird = store.subscribe(() => undefined)
    await settle()
    assert.equal(loads, 2)
    assert.deepEqual(scheduler.delays, [250, 0, 250])
    stopThird()
  })

  it("keeps a newer event over an older request and suppresses equivalent snapshots", async () => {
    const scheduler = new TestScheduler()
    let resolveLoad: ((value: State) => void) | undefined
    let receive: ((value: State) => void) | undefined
    const store = createRetryStore(
      () =>
        new Promise<State>((resolve) => {
          resolveLoad = resolve
        }),
      scheduler,
      (next) => {
        receive = next
      }
    )
    let notifications = 0
    const stop = store.subscribe(() => {
      notifications += 1
    })
    assert(resolveLoad)
    assert(receive)

    receive(ready(2))
    const afterReady = notifications
    receive(ready(2))
    assert.equal(notifications, afterReady)

    resolveLoad(initializing(1))
    await settle()
    assert.deepEqual(store.getSnapshot().data, ready(2))
    assert.equal(scheduler.size, 0)
    stop()
  })

  it("stops on host error state and lets manual refresh start a fresh bounded attempt", async () => {
    const scheduler = new TestScheduler()
    const values = [initializing(), initializing(), initializing(), initializing(), initializing(), ready(7)]
    const store = createRetryStore(async () => values.shift() ?? ready(7), scheduler)
    const stop = store.subscribe(() => undefined)
    await settle()
    for (let index = 0; index < 4; index += 1) {
      scheduler.runNext()
      await settle()
    }
    assert(store.getSnapshot().error)

    await store.refresh()
    assert.deepEqual(store.getSnapshot().data, ready(7))
    assert.equal(store.getSnapshot().error, undefined)
    assert.equal(scheduler.size, 0)
    stop()

    const errorScheduler = new TestScheduler()
    const errorStore = createRetryStore(async () => ({ status: "error", value: null }), errorScheduler)
    const stopError = errorStore.subscribe(() => undefined)
    await settle()
    assert.equal(errorScheduler.size, 0)
    assert.deepEqual(errorStore.getSnapshot().data, { status: "error", value: null })
    stopError()
  })

  it("reset cancels pending retry work", async () => {
    const scheduler = new TestScheduler()
    let loads = 0
    const store = createRetryStore(async () => {
      loads += 1
      return initializing()
    }, scheduler)
    store.subscribe(() => undefined)
    await settle()
    assert.equal(scheduler.size, 1)
    store.reset()
    assert.equal(scheduler.size, 0)
    assert.equal(store.getSnapshot().data, undefined)
    assert.equal(loads, 1)
  })

  it("surfaces transport failures without scheduling an account-state retry", async () => {
    const scheduler = new TestScheduler()
    const failure = new Error("host unavailable")
    const store = createRetryStore(async () => Promise.reject(failure), scheduler)
    const stop = store.subscribe(() => undefined)
    await settle()

    assert.strictEqual(store.getSnapshot().error, failure)
    assert.equal(store.getSnapshot().loading, false)
    assert.equal(scheduler.size, 0)
    stop()
  })
})
