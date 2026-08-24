import { useSyncExternalStore } from "react"

export type RemoteState<Value> = Readonly<{
  data: Value | undefined
  loading: boolean
  error: unknown
  refresh: () => Promise<void>
}>

export type RemoteStore<Value> = Readonly<{
  getSnapshot: () => RemoteState<Value>
  subscribe: (listener: () => void) => () => void
  refresh: () => Promise<void>
  reset: () => void
}>

export type RemoteStoreScheduler = Readonly<{
  setTimeout: (callback: () => void, delay: number) => unknown
  clearTimeout: (handle: unknown) => void
}>

export type RemoteStoreOptions<Value> = Readonly<{
  equals?: (left: Value, right: Value) => boolean
  retry?: Readonly<{
    delays: readonly number[]
    shouldRetry: (value: Value) => boolean
    exhaustedError: () => unknown
  }>
  scheduler?: RemoteStoreScheduler
}>

const defaultScheduler: RemoteStoreScheduler = {
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
}

export const createRemoteStore = <Value>(
  load: () => Promise<Value>,
  listen: (receive: (value: Value) => void) => () => void,
  options: RemoteStoreOptions<Value> = {}
): RemoteStore<Value> => {
  const listeners = new Set<() => void>()
  const scheduler = options.scheduler ?? defaultScheduler
  let stopRemote: (() => void) | null = null
  let pending: Promise<void> | null = null
  let pendingId = 0
  let retryTimer: unknown
  let retryIndex = 0
  let retryExhausted = false
  let generation = 0
  let remoteRevision = 0
  let snapshot: RemoteState<Value>

  const notify = () => listeners.forEach((listener) => listener())
  const valuesEqual = (left: Value | undefined, right: Value | undefined) => {
    if (left === undefined || right === undefined) return left === right
    return options.equals ? options.equals(left, right) : Object.is(left, right)
  }
  const set = (next: Omit<RemoteState<Value>, "refresh">) => {
    if (
      valuesEqual(snapshot.data, next.data) &&
      snapshot.loading === next.loading &&
      Object.is(snapshot.error, next.error)
    ) {
      return false
    }
    snapshot = { ...next, refresh }
    notify()
    return true
  }

  const cancelRetry = () => {
    if (retryTimer === undefined) return
    scheduler.clearTimeout(retryTimer)
    retryTimer = undefined
  }

  const resetRetry = () => {
    cancelRetry()
    retryIndex = 0
    retryExhausted = false
  }

  const scheduleRetry = (value: Value) => {
    const retry = options.retry
    if (!retry || !retry.shouldRetry(value)) {
      resetRetry()
      return
    }
    if (retryExhausted || retryTimer !== undefined || listeners.size === 0) return
    const delay = retry.delays[retryIndex]
    if (delay === undefined) {
      retryExhausted = true
      set({ data: snapshot.data, loading: false, error: retry.exhaustedError() })
      return
    }
    retryIndex += 1
    retryTimer = scheduler.setTimeout(() => {
      retryTimer = undefined
      void loadSnapshot(false)
    }, delay)
  }

  const receive = (data: Value, source: "request" | "event") => {
    const changed = !valuesEqual(snapshot.data, data)
    if (source === "event") {
      remoteRevision += 1
      if (changed) resetRetry()
    }
    const error = retryExhausted && options.retry?.shouldRetry(data) ? snapshot.error : undefined
    set({ data, loading: false, error })
    scheduleRetry(data)
  }

  const loadSnapshot = (manual: boolean): Promise<void> => {
    if (pending) return pending
    if (manual) {
      resetRetry()
      set({ data: snapshot.data, loading: true, error: undefined })
    }
    const operationGeneration = generation
    const operationRevision = remoteRevision
    const operationId = ++pendingId
    const operation = (async () => {
      try {
        const data = await load()
        if (generation !== operationGeneration || remoteRevision !== operationRevision) return
        receive(data, "request")
      } catch (error) {
        if (generation !== operationGeneration || remoteRevision !== operationRevision) return
        cancelRetry()
        set({ data: snapshot.data, loading: false, error })
      } finally {
        if (pendingId === operationId) pending = null
      }
    })()
    pending = operation
    return operation
  }

  const refresh = () => loadSnapshot(true)

  snapshot = { data: undefined, loading: false, error: undefined, refresh }

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      if (!stopRemote) {
        stopRemote = listen((data) => receive(data, "event"))
        if (snapshot.data === undefined || (options.retry?.shouldRetry(snapshot.data) && !snapshot.loading)) {
          void refresh()
        }
      }
      return () => {
        listeners.delete(listener)
        if (listeners.size > 0) return
        stopRemote?.()
        stopRemote = null
        generation += 1
        pending = null
        resetRetry()
        set({ data: snapshot.data, loading: false, error: snapshot.error })
      }
    },
    refresh,
    reset: () => {
      stopRemote?.()
      stopRemote = null
      generation += 1
      pending = null
      resetRetry()
      set({ data: undefined, loading: false, error: undefined })
    },
  }
}

export const useRemoteStore = <Value>(store: RemoteStore<Value>) =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
