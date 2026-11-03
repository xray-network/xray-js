import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import {
  clientCardanoCip30V1,
  clientCardanoV1,
  clientPlatformV1,
  protocol,
} from "@xray-network/xray-js-mini-app-bridge"
import { createMockHost, setHostWindow } from "@xray-network/xray-js-mini-app-bridge/testing"

const { cardanoV1Contract, cardanoCip30V1Contract, platformV1Contract, parseRequest } = protocol
const HEX_LIMIT = 131_072

const envelope = (scope: string, method: string, payload: unknown, overrides: Record<string, unknown> = {}) => ({
  type: "xray.bridge.request",
  scope,
  version: "v1",
  method,
  requestId: "limits",
  payload,
  ...overrides,
})
const rejects = (contract: protocol.Contract, value: unknown, code = "INVALID_REQUEST") =>
  assert.throws(() => parseRequest(contract, value), { code })

describe("bridge payload limits", () => {
  afterEach(() => setHostWindow(null))

  it("bounds envelope identifiers before routing", () => {
    rejects(platformV1Contract, envelope("platform", "getTheme", null, { requestId: "r".repeat(129) }))
    rejects(platformV1Contract, envelope("platform", "x".repeat(65), null))
    rejects(platformV1Contract, envelope("p".repeat(65), "getTheme", null))
    assert.equal(
      parseRequest(platformV1Contract, envelope("platform", "getTheme", null, { requestId: "r".repeat(128) })).requestId
        .length,
      128
    )
  })

  it("accepts transaction and message hex up to the limit and rejects anything larger or malformed", () => {
    const atLimit = "a".repeat(HEX_LIMIT)
    assert.equal(parseRequest(cardanoV1Contract, envelope("cardano", "signTx", atLimit)).payload, atLimit)
    for (const tx of ["a".repeat(HEX_LIMIT + 2), "", "abc", "zz", "84a0 "]) {
      rejects(cardanoV1Contract, envelope("cardano", "signTx", tx))
      rejects(cardanoV1Contract, envelope("cardano", "submitTx", tx))
      rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "signTx", { tx }))
      rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "submitTx", tx))
    }
    // Message data may be empty, but never oversized or non-hex; addresses are length-bounded.
    assert.doesNotThrow(() =>
      parseRequest(cardanoV1Contract, envelope("cardano", "signData", { address: "addr", data: "" }))
    )
    rejects(cardanoV1Contract, envelope("cardano", "signData", { address: "addr", data: "hello" }))
    rejects(cardanoV1Contract, envelope("cardano", "signData", { address: "a".repeat(257), data: "00" }))
    rejects(
      cardanoCip30V1Contract,
      envelope("cardano-cip30", "signData", { address: "addr", data: "0".repeat(HEX_LIMIT + 2) })
    )
  })

  it("bounds routes, CIP-30 amounts, pagination, and extensions", () => {
    assert.doesNotThrow(() =>
      parseRequest(platformV1Contract, envelope("platform", "routeChanged", `/${"r".repeat(2_047)}`))
    )
    rejects(platformV1Contract, envelope("platform", "routeChanged", `/${"r".repeat(2_048)}`))

    rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "getCollateral", { amount: "dummy" }))
    assert.doesNotThrow(() =>
      parseRequest(cardanoCip30V1Contract, envelope("cardano-cip30", "getCollateral", { amount: "1a004c4b40" }))
    )
    rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "getUtxos", { amount: "x" }))

    for (const paginate of [
      { page: -1, limit: 10 },
      { page: 0, limit: 0 },
      { page: 0.5, limit: 10 },
      { page: 0, limit: Infinity },
    ]) {
      rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "getUtxos", { paginate }))
      rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "getUsedAddresses", { paginate }))
    }
    assert.doesNotThrow(() =>
      parseRequest(cardanoCip30V1Contract, envelope("cardano-cip30", "getUtxos", { paginate: { page: 0, limit: 10 } }))
    )

    const extensions = Array.from({ length: 33 }, () => ({ cip: 30 }))
    rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "enable", { extensions }))
    rejects(cardanoCip30V1Contract, envelope("cardano-cip30", "enable", { extensions: [{ cip: -1 }] }))
  })

  it("rejects oversized client calls locally without posting them to the host", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: new EventTarget() })
    const host = createMockHost()
    const oversized = "0".repeat(HEX_LIMIT + 2)
    const native = await clientCardanoV1.signTx(oversized)
    assert(!native.ok)
    assert.equal(native.error.code, "INVALID_REQUEST")
    await assert.rejects(clientCardanoCip30V1.api.submitTx(oversized), { code: "INVALID_REQUEST" })
    assert.equal(clientPlatformV1.routeChanged(`/${"r".repeat(4_096)}`), false)
    assert.equal(host.sent.length, 0)
    host.destroy()
  })
})
