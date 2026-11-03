import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { hostCardanoV1, hostPlatformV1 } from "@xray-network/xray-js-mini-app-bridge"
import { dispatchMessageEvent } from "@xray-network/xray-js-mini-app-bridge/testing"

const ORIGIN = "https://mini-app.test"
const context = { blockchain: "cardano", network: "preview" } as const
const request = (requestId: string) => ({
  type: "xray.bridge.request",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId,
  payload: null,
})

const setup = () => {
  const target = new EventTarget() as unknown as Window
  Object.defineProperty(globalThis, "window", { configurable: true, value: target })
  const posted: { data: unknown; targetOrigin: string }[] = []
  const frame = {
    postMessage: (data: unknown, targetOrigin: string) => posted.push({ data, targetOrigin }),
  } as unknown as Window
  return { target, frame, posted }
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

describe("host frame origin boundary", () => {
  it("serves only the bound origin and addresses every reply to it", async () => {
    const { target, frame, posted } = setup()
    const stop = hostPlatformV1.handle(frame, ORIGIN, "getTheme", () => ({ ok: true, payload: "dark", context: null }))

    // Same window after navigating elsewhere: ignored, no reply of any kind.
    dispatchMessageEvent(target, request("navigated"), frame, "https://attacker.test")
    dispatchMessageEvent(target, request("opaque"), frame, "null")
    dispatchMessageEvent(target, request("unset"), frame)
    await settle()
    assert.equal(posted.length, 0)

    dispatchMessageEvent(target, request("bound"), frame, ORIGIN)
    dispatchMessageEvent(target, { ...request("unsupported"), scope: "cardano" }, frame, ORIGIN)
    await settle()
    assert.deepEqual(
      posted.map(({ data, targetOrigin }) => [(data as { requestId: string }).requestId, targetOrigin]),
      [
        ["unsupported", ORIGIN],
        ["bound", ORIGIN],
      ]
    )

    assert.equal(hostCardanoV1.publish(frame, ORIGIN, "explorer", "cexplorer", context), true)
    assert.equal(
      hostPlatformV1.respond(frame, ORIGIN, "getTheme", "late", { ok: true, payload: "light", context: null }),
      true
    )
    assert(posted.every(({ targetOrigin }) => targetOrigin === ORIGIN))
    stop()
  })

  it("refuses wildcard, opaque, and non-origin targets", () => {
    const { frame } = setup()
    for (const origin of ["*", "null", "", "mini-app.test", "https://mini-app.test/", "https://mini-app.test/path"]) {
      assert.throws(
        () => hostPlatformV1.handle(frame, origin, "getTheme", () => ({ ok: true, payload: "dark", context: null })),
        TypeError
      )
      assert.throws(() => hostPlatformV1.listen(frame, origin, () => undefined), TypeError)
      assert.throws(() => hostCardanoV1.publish(frame, origin, "explorer", "cexplorer", context), TypeError)
      assert.throws(
        () => hostPlatformV1.respond(frame, origin, "getTheme", "id", { ok: true, payload: "dark", context: null }),
        TypeError
      )
    }
    assert.doesNotThrow(() => hostPlatformV1.listen(frame, "http://localhost:7220", () => undefined)())
  })

  it("keeps one origin per frame across scopes", () => {
    const { frame } = setup()
    const stop = hostPlatformV1.listen(frame, ORIGIN, () => undefined)
    assert.throws(() => hostCardanoV1.listen(frame, "https://other.test", () => undefined), /already bound/)
    const sameOrigin = hostCardanoV1.listen(frame, ORIGIN, () => undefined)
    sameOrigin()
    stop()
    // Once every registration is released the frame can be rebound.
    assert.doesNotThrow(() => hostCardanoV1.listen(frame, "https://other.test", () => undefined)())
  })
})
