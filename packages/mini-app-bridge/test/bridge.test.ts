import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import * as miniAppClient from "@xray-network/xray-js-mini-app-bridge/client"
import * as cardanoClient from "@xray-network/xray-js-mini-app-bridge/cardano/client"
import * as cardanoCip30Client from "@xray-network/xray-js-mini-app-bridge/cardano/cip30/client"
import { setHostWindow } from "@xray-network/xray-js-mini-app-bridge/transport"
import { createMockHost } from "@xray-network/xray-js-mini-app-bridge/cardano/testing"

const installWindow = () => {
  const target = new EventTarget() as unknown as Window
  Object.defineProperty(globalThis, "window", { configurable: true, value: target })
  return target
}

afterEach(() => {
  setHostWindow(null)
  Reflect.deleteProperty(globalThis, "window")
})

describe("multiblockchain mini-app bridge", () => {
  it("separates platform, Cardano bridge, and CIP-30 requests", async () => {
    installWindow()
    const host = createMockHost()

    const handshake = await miniAppClient.handshake()
    assert.deepEqual(handshake?.payload, {
      protocolVersion: 1,
      protocols: ["cardano.bridge", "cardano.cip30"],
    })
    assert.equal(handshake?.context.blockchain, "cardano")

    const tip = await cardanoClient.getTip()
    assert.equal(tip?.payload?.blockNo, 10_000_000)
    assert.equal(tip?.context.blockchain, "cardano")

    assert.equal(await cardanoCip30Client.isEnabled(), true)
    assert.deepEqual(cardanoCip30Client.supportedExtensions, [])
    assert.equal(cardanoCip30Client.installConnector(), cardanoCip30Client.connector)
    assert.equal(
      (window as Window & { cardano?: { xrayBridge?: unknown } }).cardano?.xrayBridge,
      cardanoCip30Client.connector
    )
    await cardanoCip30Client.api.getCollateral({ amount: "1a4c4b40" })
    assert.deepEqual(host.sent.at(-1)?.payload, { amount: "1a4c4b40" })

    host.destroy()
  })

  it("maps correlated host failures to CIP-30 errors", async () => {
    installWindow()
    const host = createMockHost({ autoRespond: false })

    const balance = cardanoCip30Client.api.getBalance()
    const requestId = host.sent.at(-1)?.requestId
    assert.equal(typeof requestId, "string")
    host.emit("xray.cardano.cip30.host.error", { code: -3, info: "Access refused" }, requestId)

    await assert.rejects(balance, (error: unknown) => {
      assert.equal((error as { code?: number }).code, -3)
      assert.equal((error as { info?: string }).info, "Access refused")
      return true
    })

    host.destroy()
  })
})
