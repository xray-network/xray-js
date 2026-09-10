import type { PlatformEvent, PlatformRequest } from "@xray-network/xray-js-mini-app-bridge"
import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import {
  BridgeError,
  clientPlatformV1,
  clientCardanoV1,
  clientCardanoCip30V1,
  hostPlatformV1,
  hostCardanoV1,
  hostCardanoCip30V1,
  protocol,
} from "@xray-network/xray-js-mini-app-bridge"
import { platformV1 } from "@xray-network/xray-js-mini-app-bridge/react"
import {
  createMockHost,
  createMockClient,
  dispatchMessageEvent,
  setHostWindow,
  mockAccountState,
} from "@xray-network/xray-js-mini-app-bridge/testing"
import { toBridgeErrorPayload } from "../src/messages.js"

const context = { blockchain: "cardano", network: "preview" } as const
const installWindow = () => {
  const target = new EventTarget() as unknown as Window
  Object.defineProperty(globalThis, "window", { configurable: true, value: target })
  return target
}
const errorCode = (response: { ok: true } | { ok: false; error: { code: string } }) => {
  assert(!response.ok)
  return response.error.code
}
const themeRequest: PlatformRequest<"getTheme"> = {
  type: "xray.bridge.request",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId: "theme",
  payload: null,
}
const themeResponse = protocol.createResponse(protocol.platformV1Contract, themeRequest, {
  ok: true,
  payload: "dark",
  context: null,
})

afterEach(() => {
  platformV1.stores.theme.reset()
  setHostWindow(null)
  Reflect.deleteProperty(globalThis, "window")
})

describe("explicit bridge outcomes", () => {
  it("rejects obsolete envelopes, missing fields, and mixed success/error branches", () => {
    const { ok: _ok, ...withoutOk } = themeResponse
    const { method: _method, ...withoutMethod } = themeResponse
    const invalid = [
      withoutOk,
      withoutMethod,
      { ...themeResponse, result: "dark" },
      { ...themeResponse, error: { code: "HOST_ERROR", message: "bad" } },
      { ...themeResponse, payload: undefined },
      { ...themeResponse, context: undefined },
      {
        type: "xray.bridge.response",
        scope: "platform",
        version: "v1",
        requestId: "theme",
        result: "dark",
        context: null,
      },
      { ...themeResponse, ok: false, error: { code: "HOST_ERROR", message: "bad" } },
    ]
    invalid.forEach((value) => assert(!protocol.responseMessageSchema.safeParse(value).success))
    assert(protocol.responseMessageSchema.safeParse(themeResponse).success)
    assert(!protocol.requestMessageSchema.safeParse({ ...themeRequest, payload: undefined }).success)
    assert(
      !protocol.eventMessageSchema.safeParse({
        type: "xray.bridge.event",
        scope: "platform",
        version: "v1",
        event: "theme",
      }).success
    )
  })

  it("distinguishes missing host, timeout, invalid input, and valid null data", async () => {
    assert.equal(errorCode(await clientPlatformV1.getTheme()), "HOST_UNAVAILABLE")
    const target = installWindow()
    Object.defineProperty(target, "parent", { value: target })
    assert.equal(errorCode(await clientPlatformV1.getTheme()), "HOST_UNAVAILABLE")
    const host = createMockHost({ autoRespond: false })
    assert.equal(errorCode(await clientPlatformV1.getTheme(1)), "TIMEOUT")
    const bad = clientCardanoV1.signTx(42 as never, 100)
    assert.equal(errorCode(await bad), "INVALID_REQUEST")
    assert.equal(host.sent.length, 1)
    host.destroy()
    const available = createMockHost({ state: { tip: null, accountState: null, context } })
    const tip = await clientCardanoV1.getTip()
    const account = await clientCardanoV1.getAccountState()
    assert(tip.ok && account.ok)
    assert.equal(tip.payload, null)
    assert.equal(account.payload, null)
    available.destroy()
  })

  it("correlates concurrent identical methods out of order and ignores late duplicates", async () => {
    const target = installWindow()
    const host = createMockHost({ autoRespond: false })
    const first = clientPlatformV1.getTheme(100)
    const second = clientPlatformV1.getTheme(100)
    const [a, b] = host.sent
    assert.notEqual(a.requestId, b.requestId)
    const emit = (id: string, payload: "dark" | "light") =>
      dispatchMessageEvent(target, { ...themeResponse, requestId: id, payload }, host.hostWindow)
    emit(b.requestId, "dark")
    emit(b.requestId, "light")
    emit(a.requestId, "light")
    const [left, right] = await Promise.all([first, second])
    assert(left.ok && right.ok)
    assert.equal(left.payload, "light")
    assert.equal(right.payload, "dark")
    assert.equal(left.requestId, a.requestId)
    assert.equal(right.method, "getTheme")
    host.destroy()
  })

  it("ignores unrelated messages but completes immediately on malformed correlated replies", async () => {
    const target = installWindow()
    const host = createMockHost({ autoRespond: false })
    const invalidPatches: Record<string, unknown>[] = [
      { method: "getLocale" },
      { method: undefined },
      { ok: undefined },
      { payload: 42 },
      { context: { blockchain: "wrong" } },
      { ok: false, error: { code: "UNKNOWN", message: "bad" } },
    ]
    for (const patch of invalidPatches) {
      const pending = clientPlatformV1.getTheme(1000)
      const base = { ...themeResponse, requestId: host.sent.at(-1)!.requestId }
      dispatchMessageEvent(target, base, {})
      for (const unrelated of [
        { scope: "cardano" },
        { version: "future" },
        { requestId: "other" },
        { type: "xray.bridge.event" },
      ]) {
        dispatchMessageEvent(target, { ...base, ...unrelated }, host.hostWindow)
      }
      dispatchMessageEvent(target, { ...base, ...patch }, host.hostWindow)
      assert.equal(errorCode(await pending), "INVALID_RESPONSE")
    }
    host.destroy()
  })

  it("cleans up listeners and timers after send failure, reply, invalid reply, and timeout", async (t) => {
    const target = installWindow()
    const listeners = new Set<EventListenerOrEventListenerObject>()
    const add = target.addEventListener.bind(target)
    const remove = target.removeEventListener.bind(target)
    t.mock.method(target, "addEventListener", (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "message") listeners.add(listener)
      add(type, listener)
    })
    t.mock.method(target, "removeEventListener", (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "message") listeners.delete(listener)
      remove(type, listener)
    })
    const clear = t.mock.method(globalThis, "clearTimeout")
    setHostWindow({
      postMessage: () => {
        throw new DOMException("Cannot clone", "DataCloneError")
      },
    } as unknown as Window)
    assert.equal(errorCode(await clientPlatformV1.getTheme(1000)), "TRANSPORT_ERROR")
    assert.equal(listeners.size, 0)
    const host = createMockHost({ autoRespond: false })
    for (const valid of [true, false]) {
      const pending = clientPlatformV1.getTheme(1000)
      assert.equal(listeners.size, 1)
      dispatchMessageEvent(
        target,
        { ...themeResponse, requestId: host.sent.at(-1)!.requestId, payload: valid ? "dark" : 42 },
        host.hostWindow
      )
      const response = await pending
      assert.equal(response.ok, valid)
      assert.equal(listeners.size, 0)
    }
    assert.equal(errorCode(await clientPlatformV1.getTheme(1)), "TIMEOUT")
    assert.equal(listeners.size, 0)
    assert.equal(clear.mock.callCount(), 4)
    host.destroy()
  })

  it("shares validation between manual responses, automatic hosts, and external relays", async () => {
    const target = installWindow()
    const client = createMockClient({ target })
    const stop = hostPlatformV1.listen(client.clientWindow, (request) => {
      assert.equal(request.type, "xray.bridge.request")
      assert.equal(request.scope, "platform")
      if (request.method === "getTheme")
        hostPlatformV1.respond(client.clientWindow, request.method, request.requestId, {
          ok: true,
          payload: "dark",
          context: null,
        })
    })
    client.send("platform", "getTheme", null, "theme")
    assert.deepEqual(await client.waitFor((m) => m.type === "xray.bridge.response"), themeResponse)
    assert.throws(
      () =>
        hostPlatformV1.respond(client.clientWindow, "getTheme", "bad", {
          ok: true,
          payload: 42 as never,
          context: null,
        }),
      (e: unknown) => e instanceof BridgeError && e.code === "INVALID_RESPONSE"
    )
    assert.throws(
      () =>
        protocol.createResponse(protocol.platformV1Contract, themeRequest, {
          ok: true,
          payload: 42 as never,
          context: null,
        }),
      (e: unknown) => e instanceof BridgeError && e.code === "INVALID_RESPONSE"
    )
    stop()
    const stopInvalid = hostPlatformV1.handle(client.clientWindow, "getTheme", () => ({
      ok: true,
      payload: 42 as never,
      context: null,
    }))
    const id = client.send("platform", "getTheme", null)
    const invalid = await client.waitFor((m) => m.type === "xray.bridge.response" && m.requestId === id)
    assert(invalid.type === "xray.bridge.response")
    assert.equal(errorCode(invalid), "INVALID_RESPONSE")
    stopInvalid()
  })

  it("runs real client/host round trips for all three scopes with structured-cloned bigint data", async () => {
    const parent = new EventTarget() as unknown as Window
    const child = installWindow()
    const hostWindow = {
      postMessage: (value: unknown) => dispatchMessageEvent(parent, structuredClone(value), childWindow),
    } as Window
    const childWindow = {
      postMessage: (value: unknown) => dispatchMessageEvent(child, structuredClone(value), hostWindow),
    } as Window
    Object.defineProperty(globalThis, "window", { configurable: true, value: parent })
    const stops = [
      hostPlatformV1.handle(childWindow, "getTheme", () => ({ ok: true, payload: "dark", context: null })),
      hostCardanoV1.handle(childWindow, "getAccountState", () => ({ ok: true, payload: mockAccountState, context })),
      hostCardanoCip30V1.handle(childWindow, "getNetworkId", () => ({ ok: true, payload: 0, context })),
    ]
    Object.defineProperty(globalThis, "window", { configurable: true, value: child })
    setHostWindow(hostWindow)
    const [theme, account, network] = await Promise.all([
      clientPlatformV1.getTheme(),
      clientCardanoV1.getAccountState(),
      clientCardanoCip30V1.api.getNetworkId(),
    ])
    assert(theme.ok && account.ok)
    assert.equal(theme.payload, "dark")
    assert(account.payload?.balanceStatus === "ready")
    assert.equal(account.payload.state.balance.value, 1_000_000_000n)
    assert.equal(network, 0)
    Object.defineProperty(globalThis, "window", { configurable: true, value: parent })
    stops.forEach((stop) => stop())
  })

  it("returns host operation errors and preserves CIP-30 exceptions", async () => {
    const target = installWindow()
    const client = createMockClient({ target })
    for (const code of ["USER_REJECTED", "OPERATION_FAILED"] as const) {
      const stop = hostCardanoV1.handle(client.clientWindow, "signTx", () => ({
        ok: false,
        error: { code, message: "Signing failed", data: { reason: 1 } },
      }))
      const id = client.send("cardano", "signTx", "cbor")
      const response = await client.waitFor((m) => m.type === "xray.bridge.response" && m.requestId === id)
      assert(response.type === "xray.bridge.response" && !response.ok)
      assert.equal(response.error.code, code)
      assert.equal(response.method, "signTx")
      assert(!("payload" in response))
      stop()
    }
    const stop = hostCardanoCip30V1.handle(client.clientWindow, "getBalance", () => {
      throw { code: -3, info: "Denied" }
    })
    const id = client.send("cardano-cip30", "getBalance", null)
    const response = await client.waitFor((m) => m.type === "xray.bridge.response" && m.requestId === id)
    assert(response.type === "xray.bridge.response" && !response.ok)
    assert.deepEqual(response.error.data, { code: -3, info: "Denied" })
    stop()
    assert.equal(toBridgeErrorPayload(new BridgeError("HOST_ERROR", "bad", () => null)).data, undefined)
    assert(!("stack" in toBridgeErrorPayload(new Error("Unexpected"))))
    const host = createMockHost({ autoRespond: false })
    const pending = clientCardanoCip30V1.api.getBalance()
    host.fail(host.sent.at(-1)!.requestId, {
      code: "HOST_ERROR",
      message: "Denied",
      data: { code: -3, info: "Denied" },
    })
    await assert.rejects(
      pending,
      (e: unknown) =>
        typeof e === "object" && e !== null && "code" in e && e.code === -3 && "info" in e && e.info === "Denied"
    )
    host.destroy()
    await assert.rejects(
      clientCardanoCip30V1.isEnabled(),
      (e: unknown) => e instanceof BridgeError && e.code === "HOST_UNAVAILABLE"
    )
  })

  it("projects structured errors into React read stores and preserves full event metadata", async () => {
    installWindow()
    const host = createMockHost({ autoRespond: false })
    const store = platformV1.stores.theme
    const stop = store.subscribe(() => undefined)
    const pending = store.refresh()
    const error = { code: "HOST_ERROR", message: "Unavailable", data: { reason: "offline" } } as const
    host.fail(host.sent.at(-1)!.requestId, error)
    await pending
    assert.deepEqual(store.getSnapshot().error, error)
    assert.equal(store.getSnapshot().loading, false)
    let event: PlatformEvent<"theme"> | undefined
    const stopEvent = clientPlatformV1.listen("theme", (value) => {
      event = value
    })
    host.emit("platform", "theme", "light", null)
    assert.deepEqual(event, {
      type: "xray.bridge.event",
      scope: "platform",
      version: "v1",
      event: "theme",
      payload: "light",
      context: null,
    })
    assert.equal(store.getSnapshot().data, "light")
    assert.equal(store.getSnapshot().error, undefined)
    stopEvent()
    stop()
    host.destroy()
  })
})

it("keeps bound manual responders and event publishers isolated across adapters", async () => {
  const target = installWindow()
  const client = createMockClient({ target })
  const stops = [
    hostPlatformV1.listen(client.clientWindow, (request) => {
      if (request.method === "getTheme")
        hostPlatformV1.respond(client.clientWindow, request.method, request.requestId, {
          ok: true,
          payload: "dark",
          context: null,
        })
    }),
    hostCardanoV1.listen(client.clientWindow, (request) => {
      if (request.method === "getExplorer")
        hostCardanoV1.respond(client.clientWindow, request.method, request.requestId, {
          ok: true,
          payload: "explorer",
          context,
        })
    }),
    hostCardanoCip30V1.listen(client.clientWindow, (request) => {
      if (request.method === "getNetworkId")
        hostCardanoCip30V1.respond(client.clientWindow, request.method, request.requestId, {
          ok: true,
          payload: 0,
          context,
        })
    }),
  ]
  try {
    const calls = [
      ["platform", "getTheme"],
      ["cardano", "getExplorer"],
      ["cardano-cip30", "getNetworkId"],
    ] as const
    for (const [scope, method] of calls) {
      const requestId = client.send(scope, method, null)
      const response = await client.waitFor(
        (message) => message.type === "xray.bridge.response" && message.requestId === requestId
      )
      assert(response.type === "xray.bridge.response" && response.ok)
      assert.equal(response.scope, scope)
      assert.equal(response.method, method)
      assert.equal(response.version, "v1")
    }
    hostPlatformV1.publish(client.clientWindow, "theme", "dark", null)
    hostCardanoV1.publish(client.clientWindow, "explorer", "explorer", context)
    hostCardanoCip30V1.publish(client.clientWindow, "networkId", 0, context)
    assert.deepEqual(
      client.received
        .filter((message) => message.type === "xray.bridge.event")
        .map(({ scope, event, payload }) => ({ scope, event, payload })),
      [
        { scope: "platform", event: "theme", payload: "dark" },
        { scope: "cardano", event: "explorer", payload: "explorer" },
        { scope: "cardano-cip30", event: "networkId", payload: 0 },
      ]
    )
  } finally {
    stops.forEach((stop) => stop())
  }
})
