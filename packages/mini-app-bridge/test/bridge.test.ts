import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import * as bridge from "@xray-network/xray-js-mini-app-bridge"
import {
  BridgeError,
  clientCardanoCip30V1,
  clientCardanoV1,
  clientPlatformV1,
  hostCardanoV1,
  hostPlatformV1,
} from "@xray-network/xray-js-mini-app-bridge"
import * as bridgeReact from "@xray-network/xray-js-mini-app-bridge/react"
import {
  createMockClient,
  createMockHost,
  dispatchMessageEvent,
  setHostWindow,
} from "@xray-network/xray-js-mini-app-bridge/testing"

const installWindow = () => {
  const target = new EventTarget() as unknown as Window
  Object.defineProperty(globalThis, "window", { configurable: true, value: target })
  return target
}

afterEach(() => {
  setHostWindow(null)
  bridgeReact.platformV1.stores.theme.reset()
  bridgeReact.platformV1.stores.currency.reset()
  bridgeReact.platformV1.stores.hideBalances.reset()
  bridgeReact.platformV1.stores.status.reset()
  bridgeReact.cardanoV1.stores.tip.reset()
  bridgeReact.cardanoV1.stores.accountState.reset()
  bridgeReact.cardanoV1.stores.explorer.reset()
  Reflect.deleteProperty(globalThis, "window")
})

describe("scope-versioned Mini App Bridge", () => {
  it("exports only direct core and React adapter namespaces", () => {
    assert.deepEqual(Object.keys(bridge).sort(), [
      "BridgeError",
      "clientCardanoCip30V1",
      "clientCardanoV1",
      "clientPlatformV1",
      "hostCardanoCip30V1",
      "hostCardanoV1",
      "hostPlatformV1",
    ])
    assert.deepEqual(Object.keys(bridgeReact).sort(), ["cardanoCip30V1", "cardanoV1", "platformV1"])
    assert.equal("client" in bridge, false)
    assert.equal("host" in bridge, false)
    assert.equal("react" in bridgeReact, false)
    assert.equal(typeof clientPlatformV1.getTheme, "function")
    assert.equal(typeof clientPlatformV1.getLocale, "function")
    assert.equal(typeof clientCardanoV1.getTip, "function")
    assert.equal(typeof clientCardanoCip30V1.enable, "function")
    assert.equal(typeof hostPlatformV1.handle, "function")
    assert.equal(typeof hostCardanoV1.publish, "function")
  })

  it("stamps each client request with its independent scope and version", async () => {
    installWindow()
    const host = createMockHost()

    assert.equal((await clientPlatformV1.getTheme())?.payload, "light")
    assert.equal((await clientPlatformV1.getLocale())?.payload, "en")
    const status = await clientPlatformV1.getStatus()
    assert.deepEqual(status?.payload, { host: "xray.app" })
    assert.deepEqual(status?.context, { blockchain: "cardano", network: "preprod" })
    assert.equal(typeof status?.requestId, "string")
    assert.equal((await clientCardanoV1.getTip())?.payload?.blockNo, 10_000_000)
    assert.equal(await clientCardanoCip30V1.isEnabled(), true)

    assert.deepEqual(
      host.sent.map(({ type, scope, version, method }) => ({ type, scope, version, method })),
      [
        { type: "xray.bridge.request", scope: "platform", version: "v1", method: "getTheme" },
        { type: "xray.bridge.request", scope: "platform", version: "v1", method: "getLocale" },
        { type: "xray.bridge.request", scope: "platform", version: "v1", method: "getStatus" },
        { type: "xray.bridge.request", scope: "cardano", version: "v1", method: "getTip" },
        { type: "xray.bridge.request", scope: "cardano-cip30", version: "v1", method: "isEnabled" },
      ]
    )
    host.destroy()
  })

  it("retains every platform, Cardano, and CIP-30 operation without a handshake", async () => {
    installWindow()
    const host = createMockHost()

    const [theme, currency, locale, hideBalances, tip, account, explorer, signedAndSubmitted, signedData] =
      await Promise.all([
        clientPlatformV1.getTheme(),
        clientPlatformV1.getCurrency(),
        clientPlatformV1.getLocale(),
        clientPlatformV1.getHideBalances(),
        clientCardanoV1.getTip(),
        clientCardanoV1.getAccountState(),
        clientCardanoV1.getExplorer(),
        clientCardanoV1.signAndSubmitTx("tx"),
        clientCardanoV1.signData("addr", "data"),
      ])
    assert.equal(theme?.payload, "light")
    assert.equal(currency?.payload, "usd")
    assert.equal(locale?.payload, "en")
    assert.equal(hideBalances?.payload, false)
    assert.equal(tip?.payload?.blockNo, 10_000_000)
    assert.equal(account?.payload?.paymentAddress, "addr1_mock_payment_address")
    assert.equal(account?.payload?.balanceStatus, "ready")
    assert.equal(explorer?.payload, "cexplorer")
    assert.equal(signedAndSubmitted?.payload.success, true)
    assert.equal(signedData?.payload.success, true)
    assert.equal(clientPlatformV1.routeChanged("/swap"), true)

    const signed = await clientCardanoV1.signTx("unsigned-transaction-cbor")
    assert.equal(signed?.payload.success, true)
    assert(signed?.payload.success)
    assert.equal(signed.payload.hash, "b".repeat(64))
    assert.equal(signed.payload.cbor, "84a300")
    const submitted = await clientCardanoV1.submitTx(signed.payload.cbor)
    assert.equal(submitted?.payload.success, true)
    const submitRequest = host.sent.find(({ scope, method }) => scope === "cardano" && method === "submitTx")
    assert.equal(submitRequest?.payload, signed.payload.cbor)

    assert.equal(await clientCardanoCip30V1.isEnabled(), true)
    const wallet = await clientCardanoCip30V1.enable()
    assert.deepEqual(await wallet.getExtensions(), [{ cip: 30 }])
    assert.equal(await wallet.getNetworkId(), 0)
    assert.deepEqual(await wallet.getUtxos(), [])
    assert.deepEqual(await wallet.getCollateral({ amount: "1a" }), [])
    assert.equal(await wallet.getBalance(), "1a3b9aca00")
    assert.deepEqual(await wallet.getUsedAddresses(), ["addr1_mock_used"])
    assert.deepEqual(await wallet.getUnusedAddresses(), ["addr1_mock_unused"])
    assert.equal(await wallet.getChangeAddress(), "addr1_mock_change")
    assert.deepEqual(await wallet.getRewardAddresses(), ["stake1_mock_reward"])
    assert.equal(await wallet.signTx("tx"), "84a300_mock_signed_tx")
    assert.deepEqual(await wallet.signData("addr", "data"), {
      key: "mock_key",
      signature: "mock_signature",
    })
    assert.equal(await wallet.submitTx("tx"), "e".repeat(64))
    assert.equal(
      host.sent.some(({ method }) => method === "enable"),
      true
    )
    assert.equal(
      host.sent.some(({ type }) => type.includes("handshake")),
      false
    )
    host.destroy()
  })

  it("returns typed native Cardano signing failures", async () => {
    installWindow()
    const host = createMockHost({ state: { signTx: { success: false, error: "Signing was rejected" } } })

    const signed = await clientCardanoV1.signTx("unsigned-transaction-cbor")

    assert.deepEqual(signed?.payload, { success: false, error: "Signing was rejected" })
    host.destroy()
  })

  it("routes host handlers and publications through exact adapter versions", async () => {
    const target = installWindow()
    const client = createMockClient({ target })
    const context = { blockchain: "cardano", network: "preview" } as const
    const stops = [
      hostPlatformV1.handle(client.clientWindow, "getTheme", () => ({ result: "dark", context })),
      hostPlatformV1.handle(client.clientWindow, "getLocale", () => ({ result: "en", context })),
      hostCardanoV1.handle(client.clientWindow, "getTip", () => ({
        result: {
          hash: "a".repeat(64),
          epochNo: 1,
          absSlot: 2,
          epochSlot: 3,
          blockNo: 4,
          blockTime: 5,
        },
        context,
      })),
    ]

    const themeRequestId = client.send("platform", "getTheme", null)
    const theme = await client.waitFor(
      (message) => message.type === "xray.bridge.response" && message.requestId === themeRequestId
    )
    assert.deepEqual(theme, {
      type: "xray.bridge.response",
      scope: "platform",
      version: "v1",
      requestId: themeRequestId,
      result: "dark",
      context,
    })

    const localeRequestId = client.send("platform", "getLocale", null)
    const locale = await client.waitFor(
      (message) => message.type === "xray.bridge.response" && message.requestId === localeRequestId
    )
    assert.deepEqual(locale, {
      type: "xray.bridge.response",
      scope: "platform",
      version: "v1",
      requestId: localeRequestId,
      result: "en",
      context,
    })

    hostCardanoV1.publish(client.clientWindow, "tip", null, context)
    const event = await client.waitFor((message) => message.type === "xray.bridge.event")
    assert.deepEqual(event, {
      type: "xray.bridge.event",
      scope: "cardano",
      version: "v1",
      event: "tip",
      payload: null,
      context,
    })
    stops.forEach((stop) => stop())
  })

  it("returns immediate typed routing errors and ignores wrong sources", async () => {
    const target = installWindow()
    const client = createMockClient({ target })
    const stop = hostPlatformV1.listen(client.clientWindow, () => undefined)

    const unsupportedScope = client.send("cardano", "getTip", null)
    const scopeError = await client.waitFor(
      (message) => message.type === "xray.bridge.response" && message.requestId === unsupportedScope
    )
    assert.equal(scopeError.type, "xray.bridge.response")
    assert.equal("error" in scopeError && scopeError.error.code, "UNSUPPORTED_SCOPE_VERSION")

    const unsupportedMethod = client.send("platform", "missing", null)
    const methodError = await client.waitFor(
      (message) => message.type === "xray.bridge.response" && message.requestId === unsupportedMethod
    )
    assert.equal(methodError.type, "xray.bridge.response")
    assert.equal("error" in methodError && methodError.error.code, "UNSUPPORTED_METHOD")

    const invalidPayload = client.send("platform", "getTheme", "invalid")
    const invalidError = await client.waitFor(
      (message) => message.type === "xray.bridge.response" && message.requestId === invalidPayload
    )
    assert.equal(invalidError.type, "xray.bridge.response")
    assert.equal("error" in invalidError && invalidError.error.code, "INVALID_REQUEST")

    dispatchMessageEvent(
      target,
      {
        type: "xray.bridge.request",
        scope: "platform",
        version: "v1",
        method: "getTheme",
        requestId: "wrong-source",
        payload: null,
      },
      {} as Window
    )
    await new Promise((resolve) => setTimeout(resolve, 0))
    assert.equal(
      client.received.some(
        (message) => message.type === "xray.bridge.response" && message.requestId === "wrong-source"
      ),
      false
    )
    stop()
  })

  it("accepts supported unhandled methods without manufacturing a response", async () => {
    const target = installWindow()
    const client = createMockClient({ target })
    const stop = hostPlatformV1.listen(client.clientWindow, () => undefined)
    client.send("platform", "getTheme", null, "accepted-unanswered")
    await new Promise((resolve) => setTimeout(resolve, 10))
    assert.equal(client.received.length, 0)
    stop()
  })

  it("preserves client timeout behavior for a host that does not answer", async () => {
    installWindow()
    const host = createMockHost({ autoRespond: false })
    assert.equal(await clientPlatformV1.getTheme(5), null)
    assert.equal(await clientPlatformV1.getLocale(5), null)
    host.destroy()
  })

  it("accepts nonempty locales and rejects invalid locale results", async () => {
    const target = installWindow()
    const host = createMockHost({ target, state: { locale: "en-US" } })
    assert.equal((await clientPlatformV1.getLocale())?.payload, "en-US")
    host.destroy()

    const invalidHost = createMockHost({ target, autoRespond: false })
    const expectInvalidResultToTimeout = async (result: unknown) => {
      const pending = clientPlatformV1.getLocale(10)
      const requestId = invalidHost.sent.at(-1)?.requestId
      assert.equal(typeof requestId, "string")
      dispatchMessageEvent(
        target,
        {
          type: "xray.bridge.response",
          scope: "platform",
          version: "v1",
          requestId: requestId!,
          result,
          context: invalidHost.state.context,
        },
        invalidHost.hostWindow
      )
      assert.equal(await pending, null)
    }
    await expectInvalidResultToTimeout("")
    await expectInvalidResultToTimeout(42)
    invalidHost.destroy()
  })

  it("filters events by source, scope, version, event, payload, and context", () => {
    const target = installWindow()
    const host = createMockHost({ target })
    const themes: string[] = []
    const stop = clientPlatformV1.listen("theme", ({ payload }) => themes.push(payload))

    host.emit("platform", "theme", "dark")
    host.emit("cardano", "theme", "light")
    dispatchMessageEvent(
      target,
      {
        type: "xray.bridge.event",
        scope: "platform",
        version: "v2",
        event: "theme",
        payload: "light",
        context: host.state.context,
      },
      host.hostWindow
    )
    dispatchMessageEvent(
      target,
      {
        type: "xray.bridge.event",
        scope: "platform",
        version: "v1",
        event: "theme",
        payload: "invalid",
        context: host.state.context,
      },
      host.hostWindow
    )
    assert.deepEqual(themes, ["dark"])
    stop()
    host.destroy()
  })

  it("accepts future explorer identifiers and rejects invalid explorer values", async () => {
    const target = installWindow()
    const host = createMockHost({ target, state: { explorer: "future-explorer" } })

    assert.equal((await clientCardanoV1.getExplorer())?.payload, "future-explorer")

    const store = bridgeReact.cardanoV1.stores.explorer
    const stop = store.subscribe(() => undefined)
    await new Promise((resolve) => setTimeout(resolve, 5))
    assert.equal(store.getSnapshot().data, "future-explorer")

    host.emit("cardano", "explorer", "another-explorer")
    assert.equal(store.getSnapshot().data, "another-explorer")
    host.emit("cardano", "explorer", "")
    host.emit("cardano", "explorer", 42)
    assert.equal(store.getSnapshot().data, "another-explorer")
    stop()
    host.destroy()

    const invalidHost = createMockHost({ target, autoRespond: false })
    const expectInvalidResultToTimeout = async (result: unknown) => {
      const pending = clientCardanoV1.getExplorer(10)
      const requestId = invalidHost.sent.at(-1)?.requestId
      assert.equal(typeof requestId, "string")
      dispatchMessageEvent(
        target,
        {
          type: "xray.bridge.response",
          scope: "cardano",
          version: "v1",
          requestId: requestId!,
          result,
          context: invalidHost.state.context,
        },
        invalidHost.hostWindow
      )
      assert.equal(await pending, null)
    }
    await expectInvalidResultToTimeout("")
    await expectInvalidResultToTimeout(42)
    invalidHost.destroy()
  })

  it("preserves CIP-30 connector behavior and maps typed host failures", async () => {
    installWindow()
    const host = createMockHost({ autoRespond: false })
    assert.equal(clientCardanoCip30V1.installConnector(), clientCardanoCip30V1.connector)
    assert.equal(clientCardanoCip30V1.installConnector(), clientCardanoCip30V1.connector)
    assert.equal(
      (window as Window & { cardano?: Record<string, unknown> }).cardano?.xrayBridge,
      clientCardanoCip30V1.connector
    )

    const pending = clientCardanoCip30V1.api.getBalance()
    const requestId = host.sent.at(-1)?.requestId
    assert.equal(typeof requestId, "string")
    host.fail(requestId!, {
      code: "HOST_ERROR",
      message: "Access refused",
      data: { code: -3, info: "Access refused" },
    })
    await assert.rejects(pending, (error: unknown) => {
      assert.equal((error as { code?: number }).code, -3)
      assert.equal((error as { info?: string }).info, "Access refused")
      return true
    })
    host.destroy()
  })

  it("loads React stores lazily, deduplicates refreshes, and identifies an accountless XRAY host", async () => {
    installWindow()
    const host = createMockHost({ state: { status: { host: "xray.app" }, context: null } })
    const store = bridgeReact.platformV1.stores.status
    assert.deepEqual(store.getSnapshot().data, undefined)
    assert.equal(host.sent.length, 0)

    const stopFirst = store.subscribe(() => undefined)
    const stopSecond = store.subscribe(() => undefined)
    assert.equal(host.sent.length, 1)
    await new Promise((resolve) => setTimeout(resolve, 5))
    assert.deepEqual(store.getSnapshot().data, { host: "xray.app", account: null })
    assert.equal(store.getSnapshot().loading, false)
    assert.equal(store.getSnapshot().error, undefined)

    const firstRefresh = store.refresh()
    const secondRefresh = store.refresh()
    assert.equal(firstRefresh, secondRefresh)
    await firstRefresh
    host.emit("platform", "status", { host: "xray.app" }, { blockchain: "cardano", network: "mainnet" })
    assert.deepEqual(store.getSnapshot().data, {
      host: "xray.app",
      account: { blockchain: "cardano", network: "mainnet" },
    })
    stopFirst()
    stopSecond()
    host.emit("platform", "status", { host: "xray.app" }, null)
    assert.deepEqual(store.getSnapshot().data, {
      host: "xray.app",
      account: { blockchain: "cardano", network: "mainnet" },
    })
    host.destroy()
  })

  it("bootstraps a directly opened Cardano account through one React store", async () => {
    installWindow()
    const host = createMockHost({
      state: {
        accountState: {
          paymentAddress: "addr1_mock_payment_address",
          stakingAddress: "stake1_mock_staking_address",
          balanceStatus: "initializing",
          state: null,
          delegation: null,
        },
      },
    })
    const store = bridgeReact.cardanoV1.stores.accountState
    let notifications = 0
    const stop = store.subscribe(() => {
      notifications += 1
    })
    await new Promise((resolve) => setTimeout(resolve, 20))
    assert.equal(store.getSnapshot().data?.balanceStatus, "initializing")

    host.state.accountState = {
      paymentAddress: "addr1_mock_payment_address",
      stakingAddress: "stake1_mock_staking_address",
      balanceStatus: "ready",
      state: { utxos: [], balance: { value: 2_000_000n, assets: [] } },
      delegation: null,
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
    const readySnapshot = store.getSnapshot().data
    assert(readySnapshot?.balanceStatus === "ready")
    assert.equal(readySnapshot.state.balance.value, 2_000_000n)
    assert.equal(host.sent.filter(({ method }) => method === "getAccountState").length, 2)

    const beforeDuplicate = notifications
    host.emit("cardano", "accountState", {
      paymentAddress: "addr1_mock_payment_address",
      stakingAddress: "stake1_mock_staking_address",
      balanceStatus: "ready",
      state: { utxos: [], balance: { value: 2_000_000n, assets: [] } },
      delegation: null,
    })
    assert.equal(notifications, beforeDuplicate)
    stop()
    host.destroy()
  })

  it("uses BridgeError for generic host routing failures", () => {
    const error = new BridgeError("UNSUPPORTED_METHOD", "unsupported")
    assert.equal(error.name, "BridgeError")
    assert.equal(error.code, "UNSUPPORTED_METHOD")
  })
})
