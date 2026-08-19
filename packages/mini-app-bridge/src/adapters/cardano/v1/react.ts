import { useCallback, useState } from "react"
import { createRemoteStore, useRemoteStore } from "../../../react/remote-store.js"
import * as client from "./client.js"

const required = async <Value>(load: () => Promise<{ payload: Value } | null>) => {
  const response = await load()
  if (!response) throw new Error("XRAY Cardano host is unavailable")
  return response.payload
}

const tipStore = createRemoteStore(
  () => required(client.getTip),
  (receive) => client.listen("tip", ({ payload }) => receive(payload))
)
const accountStateStore = createRemoteStore(
  () => required(client.getAccountState),
  (receive) => client.listen("accountState", ({ payload }) => receive(payload))
)
const explorerStore = createRemoteStore(
  () => required(client.getExplorer),
  (receive) => client.listen("explorer", ({ payload }) => receive(payload))
)

export const useTip = () => useRemoteStore(tipStore)
export const useAccountState = () => useRemoteStore(accountStateStore)
export const useExplorer = () => useRemoteStore(explorerStore)

const useInteractive = <Args extends unknown[], Result>(operation: (...args: Args) => Promise<Result>) => {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | undefined>()
  const [error, setError] = useState<unknown>()
  const execute = useCallback(
    async (...args: Args) => {
      setPending(true)
      setError(undefined)
      try {
        const value = await operation(...args)
        setResult(value)
        return value
      } catch (cause) {
        setError(cause)
        throw cause
      } finally {
        setPending(false)
      }
    },
    [operation]
  )
  return { execute, pending, result, error, reset: useCallback(() => setResult(undefined), []) }
}

const responsePayload = async <Value>(response: Promise<{ payload: Value } | null>) => {
  const resolved = await response
  if (!resolved) throw new Error("XRAY Cardano host is unavailable")
  return resolved.payload
}

export const useSignTx = () => {
  const operation = useCallback((tx: string) => responsePayload(client.signTx(tx)), [])
  const { execute, ...state } = useInteractive(operation)
  return { signTx: execute, ...state }
}
export const useSubmitTx = () => {
  const operation = useCallback((tx: string) => responsePayload(client.submitTx(tx)), [])
  const { execute, ...state } = useInteractive(operation)
  return { submitTx: execute, ...state }
}
export const useSignAndSubmitTx = () => {
  const operation = useCallback((tx: string) => responsePayload(client.signAndSubmitTx(tx)), [])
  const { execute, ...state } = useInteractive(operation)
  return { signAndSubmitTx: execute, ...state }
}
export const useSignData = () => {
  const operation = useCallback((address: string, data: string) => responsePayload(client.signData(address, data)), [])
  const { execute, ...state } = useInteractive(operation)
  return { signData: execute, ...state }
}

export const stores = { tip: tipStore, accountState: accountStateStore, explorer: explorerStore }
