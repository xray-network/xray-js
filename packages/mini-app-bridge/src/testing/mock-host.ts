import type { AccountState, CardanoContext, Explorer, Tip } from "../adapters/cardano/v1/contract.js"
import type { Currency, Locale, PlatformIdentity, Theme } from "../adapters/platform/v1/contract.js"
import { setHostWindow } from "../transport/client.js"
import {
  requestMessageSchema,
  type BridgeErrorPayload,
  type RequestMessage,
  type SuccessResponseMessage,
} from "../transport/messages.js"
import { dispatchMessageEvent } from "./events.js"

export type MockHostState = {
  status: PlatformIdentity
  context: CardanoContext | null
  theme: Theme
  currency: Currency
  locale: Locale
  hideBalances: boolean
  tip: Tip
  accountState: AccountState
  explorer: Explorer
  signTx: { success: boolean; hash: string }
  submitTx: { success: true; hash: string } | { success: false; error: string }
  signAndSubmitTx: { success: true; hash: string } | { success: false; error: string }
  signData: { success: true; data: string } | { success: false; error: string }
  cip30: {
    isEnabled: boolean
    enable: boolean
    extensions: Record<string, number>[]
    networkId: number
    utxos: string[] | null
    collateral: string[] | null
    balance: string
    usedAddresses: string[]
    unusedAddresses: string[]
    changeAddress: string
    rewardAddresses: string[]
    signTx: string
    signData: { key: string; signature: string }
    submitTx: string
  }
}

export const mockTip: Tip = {
  hash: "a".repeat(64),
  epochNo: 500,
  absSlot: 120_000_000,
  epochSlot: 100_000,
  blockNo: 10_000_000,
  blockTime: 1_750_000_000,
}

export const mockAccountState: AccountState = {
  paymentAddress: "addr1_mock_payment_address",
  stakingAddress: "stake1_mock_staking_address",
  state: { utxos: [], balance: { value: 1_000_000_000n, assets: [] } },
  delegation: { delegation: "pool1_mock_pool", rewards: 5_000_000n },
}

export const defaultMockHostState: MockHostState = {
  status: {
    host: "xray.app",
  },
  context: { blockchain: "cardano", network: "preprod" },
  theme: "light",
  currency: "usd",
  locale: "en",
  hideBalances: false,
  tip: mockTip,
  accountState: mockAccountState,
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

const responseFor = (state: MockHostState, request: RequestMessage): unknown => {
  if (request.scope === "platform") {
    const values = {
      getTheme: state.theme,
      getCurrency: state.currency,
      getLocale: state.locale,
      getHideBalances: state.hideBalances,
      getStatus: state.status,
      routeChanged: null,
    } as const
    return values[request.method as keyof typeof values]
  }
  if (request.scope === "cardano") {
    const values = {
      getTip: state.tip,
      getAccountState: state.accountState,
      getExplorer: state.explorer,
      signTx: state.signTx,
      submitTx: state.submitTx,
      signAndSubmitTx: state.signAndSubmitTx,
      signData: state.signData,
    } as const
    return values[request.method as keyof typeof values]
  }
  if (request.scope === "cardano-cip30") {
    const values = {
      isEnabled: state.cip30.isEnabled,
      enable: state.cip30.enable,
      getExtensions: state.cip30.extensions,
      getNetworkId: state.cip30.networkId,
      getUtxos: state.cip30.utxos,
      getCollateral: state.cip30.collateral,
      getBalance: state.cip30.balance,
      getUsedAddresses: state.cip30.usedAddresses,
      getUnusedAddresses: state.cip30.unusedAddresses,
      getChangeAddress: state.cip30.changeAddress,
      getRewardAddresses: state.cip30.rewardAddresses,
      signTx: state.cip30.signTx,
      signData: state.cip30.signData,
      submitTx: state.cip30.submitTx,
    } as const
    return values[request.method as keyof typeof values]
  }
  return undefined
}

export type MockHost = {
  hostWindow: Window
  sent: RequestMessage[]
  state: MockHostState
  emit: (scope: string, event: string, payload: unknown, context?: unknown) => void
  fail: (requestId: string, error: BridgeErrorPayload, scope?: string, version?: string) => void
  destroy: () => void
}

export type MockHostOptions = {
  state?: Partial<Omit<MockHostState, "cip30">> & { cip30?: Partial<MockHostState["cip30"]> }
  target?: Window
  autoRespond?: boolean
}

export const createMockHost = (options: MockHostOptions = {}): MockHost => {
  const target = options.target ?? window
  const state: MockHostState = {
    ...defaultMockHostState,
    ...options.state,
    cip30: { ...defaultMockHostState.cip30, ...options.state?.cip30 },
  }
  const sent: RequestMessage[] = []
  const hostWindow = {
    postMessage: (data: unknown) => {
      const parsed = requestMessageSchema.safeParse(data)
      if (!parsed.success) return
      const request = parsed.data
      sent.push(request)
      if (options.autoRespond === false || request.method === "routeChanged") return
      const result = responseFor(state, request)
      if (result === undefined) return
      const context = state.context
      setTimeout(
        () =>
          dispatchMessageEvent(
            target,
            {
              type: "xray.bridge.response",
              scope: request.scope,
              version: request.version,
              requestId: request.requestId,
              result,
              context,
            } satisfies SuccessResponseMessage,
            hostWindow
          ),
        0
      )
    },
  } as unknown as Window
  setHostWindow(hostWindow)

  return {
    hostWindow,
    sent,
    state,
    emit: (scope, event, payload, context = state.context) =>
      dispatchMessageEvent(
        target,
        { type: "xray.bridge.event", scope, version: "v1", event, payload, context },
        hostWindow
      ),
    fail: (requestId, error, scope = "cardano-cip30", version = "v1") =>
      dispatchMessageEvent(target, { type: "xray.bridge.response", scope, version, requestId, error }, hostWindow),
    destroy: () => setHostWindow(null),
  }
}
