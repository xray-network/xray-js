import * as cardanoClient from "../client.js"
import type { CardanoHostAccountStatePayload, CardanoHostExplorerPayload, CardanoHostTipPayload } from "../protocol.js"

export type CardanoMiniAppValues = {
  explorer: CardanoHostExplorerPayload | null
  tip: CardanoHostTipPayload
  accountState: CardanoHostAccountStatePayload
}
export type CardanoMiniAppValueKey = keyof CardanoMiniAppValues

export type CardanoMiniAppStore = {
  get: <K extends CardanoMiniAppValueKey>(key: K) => CardanoMiniAppValues[K]
  ensure: (key: CardanoMiniAppValueKey) => void
  refresh: (key: CardanoMiniAppValueKey) => Promise<void>
  subscribe: (key: CardanoMiniAppValueKey, listener: () => void) => () => void
  reset: () => void
}

const emptyValues = (): CardanoMiniAppValues => ({ explorer: null, tip: null, accountState: null })

const getters = {
  explorer: cardanoClient.getExplorer,
  tip: cardanoClient.getTip,
  accountState: cardanoClient.getAccountState,
}

export const createCardanoMiniAppStore = (): CardanoMiniAppStore => {
  let values = emptyValues()
  const fetched = new Set<CardanoMiniAppValueKey>()
  const listeners = new Map<CardanoMiniAppValueKey, Set<() => void>>()
  let stopListening: (() => void)[] = []

  const notify = (key: CardanoMiniAppValueKey) => listeners.get(key)?.forEach((listener) => listener())
  const setValue = <K extends CardanoMiniAppValueKey>(key: K, value: CardanoMiniAppValues[K]) => {
    values[key] = value
    notify(key)
  }
  const startListening = () => {
    if (stopListening.length > 0) return
    stopListening = [
      cardanoClient.listen("xray.cardano.host.explorer", ({ payload }) => setValue("explorer", payload)),
      cardanoClient.listen("xray.cardano.host.tip", ({ payload }) => setValue("tip", payload)),
      cardanoClient.listen("xray.cardano.host.accountState", ({ payload }) => setValue("accountState", payload)),
    ]
  }
  const refresh = async (key: CardanoMiniAppValueKey) => {
    const response = await getters[key]()
    if (response) setValue(key, response.payload as CardanoMiniAppValues[typeof key])
  }

  return {
    get: (key) => values[key],
    ensure: (key) => {
      startListening()
      if (fetched.has(key)) return
      fetched.add(key)
      void refresh(key)
    },
    refresh,
    subscribe: (key, listener) => {
      const set = listeners.get(key) ?? new Set()
      listeners.set(key, set)
      set.add(listener)
      return () => set.delete(listener)
    },
    reset: () => {
      stopListening.forEach((stop) => stop())
      stopListening = []
      values = emptyValues()
      fetched.clear()
      ;(Object.keys(values) as CardanoMiniAppValueKey[]).forEach(notify)
    },
  }
}

export const defaultCardanoMiniAppStore = createCardanoMiniAppStore()
