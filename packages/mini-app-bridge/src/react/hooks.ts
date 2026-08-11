import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import * as miniAppClient from "../platform/client.js"
import type { PlatformHostMessagePayloadMap } from "../platform/protocol.js"
import { useMiniAppStore } from "./context.js"
import type { MiniAppValueKey, MiniAppValues } from "./store.js"

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
  const context = useStoreValue("hostContext")
  const protocols = useStoreValue("protocols")
  return { connected, connecting: connected === null, context, protocols }
}

/** Authoritative blockchain and network selected by the embedding host. */
export const useHostContext = () => useStoreValue("hostContext")

/** Host blockchain, derived from the discriminated host context. */
export const useBlockchain = () => useHostContext()?.blockchain ?? null

/** Host theme, fetched once and kept live via host pushes. Null until known. */
export const useTheme = () => useStoreValue("theme")

/** Host network, derived from the discriminated host context. Null until known. */
export const useNetwork = () => useHostContext()?.network ?? null

/** Preferred display currency, fetched once and kept live. Null until known. */
export const useCurrency = () => useStoreValue("currency")

/** Privacy flag for hiding balances, fetched once and kept live. Null until known. */
export const useHideBalances = () => useStoreValue("hideBalances")

/**
 * Subscribe to a host message for the component's lifetime. The handler is
 * kept in a ref, so re-renders never resubscribe.
 */
export const useHostMessage = <MessageType extends keyof PlatformHostMessagePayloadMap>(
  messageType: MessageType,
  handler: (payload: PlatformHostMessagePayloadMap[MessageType]) => void
) => {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })
  useEffect(() => {
    return miniAppClient.listen(messageType, ({ payload }) => handlerRef.current(payload))
  }, [messageType])
}
