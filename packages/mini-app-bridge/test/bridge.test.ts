import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { client, host as bridgeHost, setHostWindow } from "@xray-network/xray-js-mini-app-bridge"
import * as cardanoProtocol from "@xray-network/xray-js-mini-app-bridge/cardano"
import * as bridgeReact from "@xray-network/xray-js-mini-app-bridge/react"
import { createMockHost, dispatchMessageEvent } from "@xray-network/xray-js-mini-app-bridge/testing"

const miniAppClient = client.platform
const cardanoClient = client.cardano.bridge
const cardanoCip30Client = client.cardano.cip30

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
  it("exposes compact client, host, and React namespaces", () => {
    assert.equal(typeof client.platform.handshake, "function")
    assert.equal(typeof client.cardano.bridge.getTip, "function")
    assert.equal(typeof client.cardano.cip30.enable, "function")
    assert.equal(typeof client.cardano.listenAll, "function")
    assert.equal(typeof bridgeHost.platform.sendHandshake, "function")
    assert.equal(typeof bridgeHost.cardano.bridge.sendTip, "function")
    assert.equal(typeof bridgeHost.cardano.cip30.sendEnable, "function")
    assert.equal(typeof bridgeHost.cardano.listenAll, "function")
    assert.equal(typeof bridgeReact.useMiniApp, "function")
    assert.equal(typeof bridgeReact.cardano.bridge.useAccountState, "function")
    assert.equal(cardanoProtocol.CARDANO_BRIDGE_PROTOCOL, "cardano.bridge")
    assert.equal(cardanoProtocol.CARDANO_CIP30_PROTOCOL, "cardano.cip30")
    assert.equal(typeof cardanoProtocol.cardanoClientMessageSchemas, "object")
    assert.equal(typeof cardanoProtocol.cip30ClientMessageSchemas, "object")
  })

  it("listens to every Cardano-scoped host and client protocol through one facade", () => {
    const target = installWindow()
    const hostWindow = new EventTarget() as unknown as Window
    const miniAppWindow = new EventTarget() as unknown as Window
    const context = { blockchain: "cardano", network: "mainnet" } as const
    const receivedHostTypes: string[] = []
    const receivedClientTypes: string[] = []
    setHostWindow(hostWindow)

    const stopClient = client.cardano.listenAll((message) => receivedHostTypes.push(message.type))
    const stopHost = bridgeHost.cardano.listenAll(miniAppWindow, (message) => receivedClientTypes.push(message.type))

    dispatchMessageEvent(
      target,
      { type: "xray.host.theme", payload: "dark", requestId: "host-platform", context },
      hostWindow
    )
    dispatchMessageEvent(
      target,
      { type: "xray.cardano.host.tip", payload: null, requestId: "host-bridge", context },
      hostWindow
    )
    dispatchMessageEvent(
      target,
      { type: "xray.cardano.cip30.host.isEnabled", payload: true, requestId: "host-cip30", context },
      hostWindow
    )
    dispatchMessageEvent(
      target,
      { type: "xray.client.getTheme", payload: null, requestId: "client-platform" },
      miniAppWindow
    )
    dispatchMessageEvent(
      target,
      { type: "xray.cardano.client.getTip", payload: null, requestId: "client-bridge" },
      miniAppWindow
    )
    dispatchMessageEvent(
      target,
      { type: "xray.cardano.cip30.client.isEnabled", payload: null, requestId: "client-cip30" },
      miniAppWindow
    )

    assert.deepEqual(receivedHostTypes, [
      "xray.host.theme",
      "xray.cardano.host.tip",
      "xray.cardano.cip30.host.isEnabled",
    ])
    assert.deepEqual(receivedClientTypes, [
      "xray.client.getTheme",
      "xray.cardano.client.getTip",
      "xray.cardano.cip30.client.isEnabled",
    ])

    stopClient()
    stopHost()
  })

  it("requests selected platform state only after a successful handshake", async () => {
    installWindow()
    const host = createMockHost({ autoRespond: false })
    const store = bridgeReact.createMiniAppStore()

    store.ensure("theme")
    store.ensure("currency")
    store.ensure("hideBalances")

    assert.deepEqual(
      host.sent.map((message) => message.type),
      ["xray.client.handshake"]
    )

    host.emit("xray.host.handshake", host.state.handshake, host.sent[0]?.requestId)
    assert.equal(await store.connect(), true)
    assert.deepEqual(
      host.sent.map((message) => message.type),
      ["xray.client.handshake", "xray.client.getTheme", "xray.client.getCurrency", "xray.client.getHideBalances"]
    )

    host.emit("xray.host.theme", host.state.theme, host.sent[1]?.requestId)
    host.emit("xray.host.currency", host.state.currency, host.sent[2]?.requestId)
    host.emit("xray.host.hideBalances", host.state.hideBalances, host.sent[3]?.requestId)
    await new Promise((resolve) => setTimeout(resolve, 0))

    store.reset()
    host.destroy()
  })

  it("keeps the platform connected without a selected account", async () => {
    installWindow()
    const host = createMockHost({
      state: {
        context: null,
        handshake: { protocolVersion: 1, protocols: [] },
      },
    })
    const store = bridgeReact.createMiniAppStore()

    assert.equal(await store.connect(), true)
    assert.equal(store.isConnected(), true)
    assert.equal(store.get("hostContext"), null)
    assert.deepEqual(store.get("protocols"), [])

    await store.refresh("theme")
    assert.equal(store.get("theme"), "light")
    assert.equal(store.get("hostContext"), null)

    const accountlessHandshake = await miniAppClient.handshake()
    assert.equal(accountlessHandshake?.context, null)
    assert.deepEqual(accountlessHandshake?.payload.protocols, [])

    store.reset()
    host.destroy()
  })

  it("separates platform, Cardano bridge, and CIP-30 requests", async () => {
    installWindow()
    const host = createMockHost()

    const handshake = await miniAppClient.handshake()
    assert.deepEqual(handshake?.payload, {
      protocolVersion: 1,
      protocols: ["cardano.bridge", "cardano.cip30"],
    })
    assert.equal(handshake?.context?.blockchain, "cardano")

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
