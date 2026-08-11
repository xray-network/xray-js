import type { PlatformClientMessage, PlatformHostMessagePayloadMap } from "../platform/protocol.js"
import type {
  CardanoClientMessage,
  CardanoHostAccountStatePayload,
  CardanoHostMessagePayloadMap,
  CardanoHostTipPayload,
} from "../cardano/protocol.js"
import type { Cip30ClientMessage, Cip30HostMessagePayloadMap } from "../cardano/cip30/protocol.js"
import type { CardanoHostContext } from "../transport/context.js"
import { setHostWindow } from "../transport/client.js"
import { dispatchMessageEvent } from "./events.js"

/** Canned responses the mock host serves for each request type. */
export type MockHostState = {
  context: CardanoHostContext
  handshake: PlatformHostMessagePayloadMap["xray.host.handshake"]
  tip: CardanoHostMessagePayloadMap["xray.cardano.host.tip"]
  accountState: CardanoHostMessagePayloadMap["xray.cardano.host.accountState"]
  theme: PlatformHostMessagePayloadMap["xray.host.theme"]
  currency: PlatformHostMessagePayloadMap["xray.host.currency"]
  hideBalances: PlatformHostMessagePayloadMap["xray.host.hideBalances"]
  explorer: CardanoHostMessagePayloadMap["xray.cardano.host.explorer"]
  signTx: CardanoHostMessagePayloadMap["xray.cardano.host.signTx"]
  submitTx: CardanoHostMessagePayloadMap["xray.cardano.host.submitTx"]
  signAndSubmitTx: CardanoHostMessagePayloadMap["xray.cardano.host.signAndSubmitTx"]
  signData: CardanoHostMessagePayloadMap["xray.cardano.host.signData"]
  cip30: {
    isEnabled: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.isEnabled"]
    enable: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.enable"]
    extensions: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.extensions"]
    networkId: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.networkId"]
    utxos: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.utxos"]
    collateral: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.collateral"]
    balance: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.balance"]
    usedAddresses: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.usedAddresses"]
    unusedAddresses: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.unusedAddresses"]
    changeAddress: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.changeAddress"]
    rewardAddresses: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.rewardAddresses"]
    signTx: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.signTx"]
    signData: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.signData"]
    submitTx: Cip30HostMessagePayloadMap["xray.cardano.cip30.host.submitTx"]
  }
}

export const mockTip: CardanoHostTipPayload = {
  hash: "a".repeat(64),
  epochNo: 500,
  absSlot: 120_000_000,
  epochSlot: 100_000,
  blockNo: 10_000_000,
  blockTime: 1_750_000_000,
}

export const mockAccountState: CardanoHostAccountStatePayload = {
  paymentAddress: "addr1_mock_payment_address",
  stakingAddress: "stake1_mock_staking_address",
  state: {
    utxos: [],
    balance: {
      value: 1_000_000_000n,
      assets: [],
    },
  },
  delegation: {
    delegation: "pool1_mock_pool",
    rewards: 5_000_000n,
  },
}

export const defaultMockHostState: MockHostState = {
  context: { blockchain: "cardano", network: "preprod" },
  handshake: { protocolVersion: 1, protocols: ["cardano.bridge", "cardano.cip30"] },
  tip: mockTip,
  accountState: mockAccountState,
  theme: "light",
  currency: "usd",
  hideBalances: false,
  explorer: "cexplorer",
  signTx: { success: true, hash: "b".repeat(64) },
  submitTx: { success: true, hash: "c".repeat(64) },
  signAndSubmitTx: { success: true, hash: "d".repeat(64) },
  signData: { success: true, data: "deadbeef" },
  cip30: {
    isEnabled: true,
    enable: true,
    extensions: [{ cip: 30 }],
    networkId: 0,
    utxos: [],
    collateral: [],
    balance: "1a3b9aca00",
    usedAddresses: ["addr1_mock_used"],
    unusedAddresses: ["addr1_mock_unused"],
    changeAddress: "addr1_mock_change",
    rewardAddresses: ["stake1_mock_reward"],
    signTx: "84a300_mock_signed_tx",
    signData: { key: "mock_key", signature: "mock_signature" },
    submitTx: "e".repeat(64),
  },
}

export type MockHost = {
  /** The fake host window; client SDK calls are routed to it via `setHostWindow`. */
  hostWindow: Window
  /** Every client -> host message received, in order. */
  sent: (PlatformClientMessage | CardanoClientMessage | Cip30ClientMessage)[]
  /** The mutable response state; edit to change subsequent responses. */
  state: MockHostState
  /** Push an unsolicited host -> client message (e.g. a theme change event). */
  emit: (type: string, payload: unknown, requestId?: string) => void
  /** Detach the mock and restore normal parent-window resolution. */
  destroy: () => void
}

export type MockHostOptions = {
  /** Overrides merged over `defaultMockHostState`. */
  state?: Partial<Omit<MockHostState, "cip30">> & { cip30?: Partial<MockHostState["cip30"]> }
  /** Window the mini app code is listening on. Defaults to the global window. */
  target?: Window
  /** When false, requests are recorded but never answered (for timeout tests). */
  autoRespond?: boolean
}

/**
 * Create a fake host for testing mini apps (client SDK consumers) without an
 * iframe. It registers itself as the client SDK's host window, records every
 * outgoing client message, and answers requests from `state`.
 */
export const createMockHost = (options: MockHostOptions = {}): MockHost => {
  const target = options.target ?? window
  const autoRespond = options.autoRespond ?? true
  const state: MockHostState = {
    ...defaultMockHostState,
    ...options.state,
    cip30: { ...defaultMockHostState.cip30, ...options.state?.cip30 },
  }
  const sent: (PlatformClientMessage | CardanoClientMessage | Cip30ClientMessage)[] = []

  const respond = (type: string, payload: unknown, requestId: string) => {
    setTimeout(() => dispatchMessageEvent(target, { type, payload, requestId, context: state.context }, hostWindow), 0)
  }

  const responseFor = (type: string): { type: string; payload: unknown } | null => {
    switch (type) {
      case "xray.client.handshake":
        return { type: "xray.host.handshake", payload: state.handshake }
      case "xray.client.getTheme":
        return { type: "xray.host.theme", payload: state.theme }
      case "xray.client.getCurrency":
        return { type: "xray.host.currency", payload: state.currency }
      case "xray.client.getHideBalances":
        return { type: "xray.host.hideBalances", payload: state.hideBalances }
      case "xray.cardano.client.getTip":
        return { type: "xray.cardano.host.tip", payload: state.tip }
      case "xray.cardano.client.getAccountState":
        return { type: "xray.cardano.host.accountState", payload: state.accountState }
      case "xray.cardano.client.getExplorer":
        return { type: "xray.cardano.host.explorer", payload: state.explorer }
      case "xray.cardano.client.signTx":
        return { type: "xray.cardano.host.signTx", payload: state.signTx }
      case "xray.cardano.client.submitTx":
        return { type: "xray.cardano.host.submitTx", payload: state.submitTx }
      case "xray.cardano.client.signAndSubmitTx":
        return { type: "xray.cardano.host.signAndSubmitTx", payload: state.signAndSubmitTx }
      case "xray.cardano.client.signData":
        return { type: "xray.cardano.host.signData", payload: state.signData }
      case "xray.cardano.cip30.client.isEnabled":
        return { type: "xray.cardano.cip30.host.isEnabled", payload: state.cip30.isEnabled }
      case "xray.cardano.cip30.client.enable":
        return { type: "xray.cardano.cip30.host.enable", payload: state.cip30.enable }
      case "xray.cardano.cip30.client.getExtensions":
        return { type: "xray.cardano.cip30.host.extensions", payload: state.cip30.extensions }
      case "xray.cardano.cip30.client.getNetworkId":
        return { type: "xray.cardano.cip30.host.networkId", payload: state.cip30.networkId }
      case "xray.cardano.cip30.client.getUtxos":
        return { type: "xray.cardano.cip30.host.utxos", payload: state.cip30.utxos }
      case "xray.cardano.cip30.client.getCollateral":
        return { type: "xray.cardano.cip30.host.collateral", payload: state.cip30.collateral }
      case "xray.cardano.cip30.client.getBalance":
        return { type: "xray.cardano.cip30.host.balance", payload: state.cip30.balance }
      case "xray.cardano.cip30.client.getUsedAddresses":
        return { type: "xray.cardano.cip30.host.usedAddresses", payload: state.cip30.usedAddresses }
      case "xray.cardano.cip30.client.getUnusedAddresses":
        return { type: "xray.cardano.cip30.host.unusedAddresses", payload: state.cip30.unusedAddresses }
      case "xray.cardano.cip30.client.getChangeAddress":
        return { type: "xray.cardano.cip30.host.changeAddress", payload: state.cip30.changeAddress }
      case "xray.cardano.cip30.client.getRewardAddresses":
        return { type: "xray.cardano.cip30.host.rewardAddresses", payload: state.cip30.rewardAddresses }
      case "xray.cardano.cip30.client.signTx":
        return { type: "xray.cardano.cip30.host.signTx", payload: state.cip30.signTx }
      case "xray.cardano.cip30.client.signData":
        return { type: "xray.cardano.cip30.host.signData", payload: state.cip30.signData }
      case "xray.cardano.cip30.client.submitTx":
        return { type: "xray.cardano.cip30.host.submitTx", payload: state.cip30.submitTx }
      default:
        return null
    }
  }

  const hostWindow = {
    postMessage: (data: unknown) => {
      const { type, payload, requestId } = (data ?? {}) as { type?: string; payload?: unknown; requestId?: string }
      if (typeof type !== "string" || typeof requestId !== "string") return
      sent.push({ type, payload, requestId } as PlatformClientMessage | CardanoClientMessage | Cip30ClientMessage)
      if (!autoRespond) return
      const response = responseFor(type)
      if (response) respond(response.type, response.payload, requestId)
    },
  } as unknown as Window

  setHostWindow(hostWindow)

  return {
    hostWindow,
    sent,
    state,
    emit: (type, payload, requestId = "mock-host-event") => {
      dispatchMessageEvent(target, { type, payload, requestId, context: state.context }, hostWindow)
    },
    destroy: () => {
      setHostWindow(null)
    },
  }
}
