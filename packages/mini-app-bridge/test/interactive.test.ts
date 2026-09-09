import type { CardanoResponse } from "@xray-network/xray-js-mini-app-bridge"
import assert from "node:assert/strict"
import { afterEach, it } from "node:test"
import { clientCardanoV1 } from "@xray-network/xray-js-mini-app-bridge"
import { createMockHost, setHostWindow } from "@xray-network/xray-js-mini-app-bridge/testing"
import { runInteractive } from "../src/react/cardano.js"

afterEach(() => {
  setHostWindow(null)
  Reflect.deleteProperty(globalThis, "window")
})

it("interactive state retains complete signing outcomes and resolves expected failures", async () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: new EventTarget() })
  const host = createMockHost({ autoRespond: false })
  const pending: boolean[] = []
  let result: CardanoResponse<"signTx"> | undefined
  let error: unknown = "previous error"
  const state = {
    setPending: (value: boolean) => pending.push(value),
    setResult: (value: CardanoResponse<"signTx">) => {
      result = value
    },
    setError: (value: unknown) => {
      error = value
    },
  }
  const operation = runInteractive(() => clientCardanoV1.signTx("cbor"), state)
  assert.deepEqual(pending, [true])
  assert.equal(error, undefined)
  const failure = { code: "USER_REJECTED", message: "Rejected", data: { reason: "user" } } as const
  host.fail(host.sent.at(-1)!.requestId, failure)
  const response = await operation
  assert(!response.ok)
  assert.equal(result, response)
  assert.equal(error, response.error)
  assert.deepEqual(error, failure)
  assert.equal(result.method, "signTx")
  assert.deepEqual(pending, [true, false])
  host.destroy()
  const answering = createMockHost()
  const signed = await runInteractive(() => clientCardanoV1.signTx("cbor"), state)
  assert(signed.ok)
  assert.equal(result, signed)
  assert.equal(error, undefined)
  assert.equal(signed.payload.cbor, "84a300")
  assert.deepEqual(pending, [true, false, true, false])
  answering.destroy()
})
