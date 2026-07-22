import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { miniAppClient } from "../client"
import type { HostMessagePayloadMap } from "../protocol"
import { useMiniAppStore } from "./context"
import type { MiniAppValueKey, MiniAppValues } from "./store"

const useStoreValue = <K extends MiniAppValueKey>(key: K): MiniAppValues[K] => {
  const store = useMiniAppStore()
  useEffect(() => {
    void store.connect()
    store.ensure(key)
  }, [store, key])
  return useSyncExternalStore(
    useCallback((listener: () => void) => store.subscribe(key, listener), [store, key]),
    () => store.get(key),
    () => store.get(key)
  )
}

/**
 * Establish the host connection. `connected` is null while the handshake is
 * in flight, then true/false.
 */
export const useMiniApp = () => {
  const store = useMiniAppStore()
  useEffect(() => {
    void store.connect()
  }, [store])
  const connected = useSyncExternalStore(
    useCallback((listener: () => void) => store.subscribe("connected", listener), [store]),
    () => store.isConnected(),
    () => store.isConnected()
  )
  return { connected, connecting: connected === null }
}

/** Host theme, fetched once and kept live via host pushes. Null until known. */
export const useTheme = () => useStoreValue("theme")

/** Host network, fetched once and kept live via host pushes. Null until known. */
export const useNetwork = () => useStoreValue("network")

/** Preferred display currency, fetched once and kept live. Null until known. */
export const useCurrency = () => useStoreValue("currency")

/** Privacy flag for hiding balances, fetched once and kept live. Null until known. */
export const useHideBalances = () => useStoreValue("hideBalances")

/** Preferred explorer, fetched once and kept live. Null until known. */
export const useExplorer = () => useStoreValue("explorer")

/** Chain tip, fetched once; call `refresh` to refetch. */
export const useTip = () => {
  const store = useMiniAppStore()
  const tip = useStoreValue("tip")
  return { tip, refresh: useCallback(() => store.refresh("tip"), [store]) }
}

/** Wallet account state, fetched once; call `refresh` to refetch. */
export const useAccountState = () => {
  const store = useMiniAppStore()
  const accountState = useStoreValue("accountState")
  return { accountState, refresh: useCallback(() => store.refresh("accountState"), [store]) }
}

/**
 * Subscribe to a host message for the component's lifetime. The handler is
 * kept in a ref, so re-renders never resubscribe.
 */
export const useHostMessage = <MessageType extends keyof HostMessagePayloadMap>(
  messageType: MessageType,
  handler: (payload: HostMessagePayloadMap[MessageType]) => void
) => {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })
  useEffect(() => {
    return miniAppClient.listen(messageType, ({ payload }) => handlerRef.current(payload))
  }, [messageType])
}

const useInteractive = <Args extends unknown[], Result>(request: (...args: Args) => Promise<Result | null>) => {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const execute = useCallback(
    async (...args: Args) => {
      setPending(true)
      try {
        const response = await request(...args)
        setResult(response)
        return response
      } finally {
        setPending(false)
      }
    },
    [request]
  )
  const reset = useCallback(() => setResult(null), [])
  return { execute, pending, result, reset }
}

/** Request a tx signature. `result` is null until resolved (or on timeout). */
export const useSignTx = () => {
  const { execute, ...rest } = useInteractive(
    useCallback((tx: string) => miniAppClient.signTx(tx).then((response) => response?.payload ?? null), [])
  )
  return { signTx: execute, ...rest }
}

/** Request a tx submission. `result` is null until resolved (or on timeout). */
export const useSubmitTx = () => {
  const { execute, ...rest } = useInteractive(
    useCallback((tx: string) => miniAppClient.submitTx(tx).then((response) => response?.payload ?? null), [])
  )
  return { submitTx: execute, ...rest }
}

/** Request sign-and-submit. `result` is null until resolved (or on timeout). */
export const useSignAndSubmitTx = () => {
  const { execute, ...rest } = useInteractive(
    useCallback((tx: string) => miniAppClient.signAndSubmitTx(tx).then((response) => response?.payload ?? null), [])
  )
  return { signAndSubmitTx: execute, ...rest }
}

/** Request an arbitrary data signature. `result` is null until resolved (or on timeout). */
export const useSignData = () => {
  const { execute, ...rest } = useInteractive(
    useCallback(
      (address: string, data: string) =>
        miniAppClient.signData(address, data).then((response) => response?.payload ?? null),
      []
    )
  )
  return { signData: execute, ...rest }
}
