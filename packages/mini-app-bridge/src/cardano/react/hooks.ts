import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useMiniApp } from "../../react/hooks.js"
import * as cardanoClient from "../client.js"
import { CARDANO_NATIVE_PROTOCOL, type CardanoHostMessagePayloadMap } from "../protocol.js"
import { useCardanoMiniAppStore } from "./context.js"
import type { CardanoMiniAppValueKey, CardanoMiniAppValues } from "./store.js"

const useCardanoValue = <K extends CardanoMiniAppValueKey>(key: K): CardanoMiniAppValues[K] => {
  const store = useCardanoMiniAppStore()
  const { context, protocols } = useMiniApp()
  const enabled = context?.blockchain === "cardano" && protocols.includes(CARDANO_NATIVE_PROTOCOL)
  useEffect(() => {
    if (enabled) store.ensure(key)
  }, [enabled, key, store])
  const value = useSyncExternalStore(
    useCallback((listener: () => void) => store.subscribe(key, listener), [key, store]),
    () => store.get(key),
    () => store.get(key)
  )
  return enabled ? value : (null as CardanoMiniAppValues[K])
}

export const useExplorer = () => useCardanoValue("explorer")

export const useTip = () => {
  const store = useCardanoMiniAppStore()
  const tip = useCardanoValue("tip")
  return { tip, refresh: useCallback(() => store.refresh("tip"), [store]) }
}

export const useAccountState = () => {
  const store = useCardanoMiniAppStore()
  const accountState = useCardanoValue("accountState")
  return { accountState, refresh: useCallback(() => store.refresh("accountState"), [store]) }
}

export const useCardanoHostMessage = <MessageType extends keyof CardanoHostMessagePayloadMap>(
  messageType: MessageType,
  handler: (payload: CardanoHostMessagePayloadMap[MessageType]) => void
) => {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })
  useEffect(() => cardanoClient.listen(messageType, ({ payload }) => handlerRef.current(payload)), [messageType])
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
  return { execute, pending, result, reset: useCallback(() => setResult(null), []) }
}

export const useSignTx = () => {
  const { execute, ...rest } = useInteractive(
    useCallback((tx: string) => cardanoClient.signTx(tx).then((response) => response?.payload ?? null), [])
  )
  return { signTx: execute, ...rest }
}

export const useSubmitTx = () => {
  const { execute, ...rest } = useInteractive(
    useCallback((tx: string) => cardanoClient.submitTx(tx).then((response) => response?.payload ?? null), [])
  )
  return { submitTx: execute, ...rest }
}

export const useSignAndSubmitTx = () => {
  const { execute, ...rest } = useInteractive(
    useCallback((tx: string) => cardanoClient.signAndSubmitTx(tx).then((response) => response?.payload ?? null), [])
  )
  return { signAndSubmitTx: execute, ...rest }
}

export const useSignData = () => {
  const { execute, ...rest } = useInteractive(
    useCallback(
      (address: string, data: string) =>
        cardanoClient.signData(address, data).then((response) => response?.payload ?? null),
      []
    )
  )
  return { signData: execute, ...rest }
}
