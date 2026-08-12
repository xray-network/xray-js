import * as miniAppClient from "../platform/client.js"
import type {
  PlatformHostCurrencyPayload,
  PlatformHostHideBalancesPayload,
  PlatformHostThemePayload,
} from "../platform/protocol.js"
import type { HostContext } from "../transport/context.js"

// Framework-free connection store backing the React hooks. Hooks read from the
// module-level `defaultMiniAppStore` unless a <MiniAppProvider> supplies its
// own instance, so the provider stays strictly optional.

export type MiniAppValues = {
  hostContext: HostContext | null
  protocols: string[]
  theme: PlatformHostThemePayload | null
  currency: PlatformHostCurrencyPayload | null
  hideBalances: PlatformHostHideBalancesPayload | null
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
  hostContext: null,
  protocols: [],
  theme: null,
  currency: null,
  hideBalances: null,
})

const getters: Partial<{
  [K in MiniAppValueKey]: () => Promise<{ payload: MiniAppValues[K]; context: HostContext } | null>
}> = {
  theme: miniAppClient.getTheme,
  currency: miniAppClient.getCurrency,
  hideBalances: miniAppClient.getHideBalances,
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
    const receive = <K extends Exclude<MiniAppValueKey, "hostContext" | "protocols">>(
      key: K,
      message: { payload: MiniAppValues[K]; context: HostContext }
    ) => {
      setValue("hostContext", message.context)
      setValue(key, message.payload)
    }
    stopListening = [
      miniAppClient.listen("xray.host.theme", (message) => receive("theme", message)),
      miniAppClient.listen("xray.host.currency", (message) => receive("currency", message)),
      miniAppClient.listen("xray.host.hideBalances", (message) => receive("hideBalances", message)),
    ]
  }

  const connect = () =>
    (handshakePromise ??= miniAppClient.handshake().then((response) => {
      connected = response !== null
      if (response) {
        setValue("hostContext", response.context)
        setValue("protocols", response.payload.protocols)
      }
      if (connected) startListening()
      notify("connected")
      return connected
    }))

  const refresh = async (key: MiniAppValueKey) => {
    if (key === "hostContext" || key === "protocols") {
      const response = await miniAppClient.handshake()
      if (response) {
        setValue("hostContext", response.context)
        setValue("protocols", response.payload.protocols)
      }
      return
    }
    const getter = getters[key]
    const response = await getter?.()
    if (response) {
      setValue("hostContext", response.context)
      setValue(key, response.payload as MiniAppValues[typeof key])
    }
  }

  return {
    connect,
    isConnected: () => connected,
    get: (key) => values[key],
    ensure: (key) => {
      if (fetched.has(key)) return
      fetched.add(key)
      if (key === "hostContext" || key === "protocols") void connect()
      else {
        void connect().then((isConnected) => {
          if (isConnected) return refresh(key)
        })
      }
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
