import { miniAppClient } from "../client"
import type {
  HostThemePayload,
  HostNetworkPayload,
  HostCurrencyPayload,
  HostHideBalancesPayload,
  HostExplorerPayload,
  HostTipPayload,
  HostAccountStatePayload,
} from "../protocol"

// Framework-free connection store backing the React hooks. Hooks read from the
// module-level `defaultMiniAppStore` unless a <MiniAppProvider> supplies its
// own instance, so the provider stays strictly optional.

export type MiniAppValues = {
  theme: HostThemePayload | null
  network: HostNetworkPayload | null
  currency: HostCurrencyPayload | null
  hideBalances: HostHideBalancesPayload | null
  explorer: HostExplorerPayload | null
  tip: HostTipPayload | null
  accountState: HostAccountStatePayload | null
}

export type MiniAppValueKey = keyof MiniAppValues

export type MiniAppStore = {
  /** Run the handshake (memoized — concurrent callers share one request). */
  connect: () => Promise<boolean>
  /** null while the handshake is pending or not started, then the result. */
  isConnected: () => boolean | null
  /** Current cached value for a key (null until first fetched/pushed). */
  get: <K extends MiniAppValueKey>(key: K) => MiniAppValues[K]
  /** Fetch a key from the host once; later calls are no-ops (use refresh to refetch). */
  ensure: (key: MiniAppValueKey) => void
  /** Refetch a key from the host and update the cache. */
  refresh: (key: MiniAppValueKey) => Promise<void>
  /** Watch a value key (or "connected") for changes. Returns an unsubscribe function. */
  subscribe: (key: MiniAppValueKey | "connected", listener: () => void) => () => void
  /** Drop all cached state and host subscriptions (for tests). */
  reset: () => void
}

const emptyValues = (): MiniAppValues => ({
  theme: null,
  network: null,
  currency: null,
  hideBalances: null,
  explorer: null,
  tip: null,
  accountState: null,
})

const getters: { [K in MiniAppValueKey]: () => Promise<{ payload: MiniAppValues[K] } | null> } = {
  theme: miniAppClient.getTheme,
  network: miniAppClient.getNetwork,
  currency: miniAppClient.getCurrency,
  hideBalances: miniAppClient.getHideBalances,
  explorer: miniAppClient.getExplorer,
  tip: miniAppClient.getTip,
  accountState: miniAppClient.getAccountState,
}

export const createMiniAppStore = (): MiniAppStore => {
  let handshakePromise: Promise<boolean> | null = null
  let connected: boolean | null = null
  let values = emptyValues()
  const fetched = new Set<MiniAppValueKey>()
  const listeners = new Map<string, Set<() => void>>()
  let stopListening: (() => void)[] = []

  const notify = (key: string) => {
    listeners.get(key)?.forEach((listener) => listener())
  }

  const setValue = <K extends MiniAppValueKey>(key: K, value: MiniAppValues[K]) => {
    values[key] = value
    notify(key)
  }

  // Host pushes reuse the same message types as request responses, so these
  // subscriptions keep the cache fresh for both unsolicited updates (theme
  // toggles, network switches) and any in-flight getter responses.
  const startListening = () => {
    if (stopListening.length > 0) return
    stopListening = [
      miniAppClient.listen("xray.host.theme", ({ payload }) => setValue("theme", payload)),
      miniAppClient.listen("xray.host.network", ({ payload }) => setValue("network", payload)),
      miniAppClient.listen("xray.host.currency", ({ payload }) => setValue("currency", payload)),
      miniAppClient.listen("xray.host.hideBalances", ({ payload }) => setValue("hideBalances", payload)),
      miniAppClient.listen("xray.host.explorer", ({ payload }) => setValue("explorer", payload)),
      miniAppClient.listen("xray.host.tip", ({ payload }) => setValue("tip", payload)),
      miniAppClient.listen("xray.host.accountState", ({ payload }) => setValue("accountState", payload)),
    ]
  }

  const connect = () =>
    (handshakePromise ??= miniAppClient.sendHandshake().then((response) => {
      connected = !!response?.payload
      if (connected) startListening()
      notify("connected")
      return connected
    }))

  const refresh = async (key: MiniAppValueKey) => {
    const response = await getters[key]()
    if (response) setValue(key, response.payload as MiniAppValues[typeof key])
  }

  return {
    connect,
    isConnected: () => connected,
    get: (key) => values[key],
    ensure: (key) => {
      if (fetched.has(key)) return
      fetched.add(key)
      void refresh(key)
    },
    refresh,
    subscribe: (key, listener) => {
      const set = listeners.get(key) ?? new Set()
      listeners.set(key, set)
      set.add(listener)
      return () => {
        set.delete(listener)
      }
    },
    reset: () => {
      stopListening.forEach((stop) => stop())
      stopListening = []
      handshakePromise = null
      connected = null
      values = emptyValues()
      fetched.clear()
      notify("connected")
      ;(Object.keys(values) as MiniAppValueKey[]).forEach(notify)
    },
  }
}

/** Store used by hooks when no <MiniAppProvider> is mounted. */
export const defaultMiniAppStore = createMiniAppStore()
