import type { Outcome } from "../types.js"
import { useCallback, useState } from "react"
import { createRemoteStore, useRemoteStore } from "./store.js"
import { client } from "../adapters/cardano.js"
import type { AccountState } from "../adapters/cardano.js"

const required = async <Value>(load: () => Promise<Outcome<Value, unknown>>) => {
  const response = await load()
  if (!response.ok) throw response.error
  return response.payload
}

const tipStore = createRemoteStore(
  () => required(client.getTip),
  (receive) => client.listen("tip", ({ payload }) => receive(payload))
)

const equalAccountStateValue = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => equalAccountStateValue(value, right[index]))
    )
  }
  if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) return false
  const leftRecord = left as Record<string, unknown>
  const rightRecord = right as Record<string, unknown>
  const leftKeys = Object.keys(leftRecord)
  const rightKeys = Object.keys(rightRecord)
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(rightRecord, key) &&
        equalAccountStateValue(leftRecord[key], rightRecord[key])
    )
  )
}

const ACCOUNT_STATE_RETRY_DELAYS = [250, 500, 1_000, 2_000] as const

const accountStateStore = createRemoteStore(
  () => required(client.getAccountState),
  (receive) => client.listen("accountState", ({ payload }) => receive(payload)),
  {
    equals: equalAccountStateValue,
    retry: {
      delays: ACCOUNT_STATE_RETRY_DELAYS,
      shouldRetry: (value: AccountState) => value?.balanceStatus === "initializing",
      exhaustedError: () => new Error("XRAY Cardano account balance did not become ready"),
    },
  }
)
const explorerStore = createRemoteStore(
  () => required(client.getExplorer),
  (receive) => client.listen("explorer", ({ payload }) => receive(payload))
)

export const useTip = () => useRemoteStore(tipStore)
export const useAccountState = () => useRemoteStore(accountStateStore)
export const useExplorer = () => useRemoteStore(explorerStore)

/** Keep the asynchronous outcome transition shared by interactive hooks. */
export const runInteractive = async <Result extends Outcome<unknown, unknown>>(
  operation: () => Promise<Result>,
  state: {
    setPending: (pending: boolean) => void
    setResult: (result: Result) => void
    setError: (error: unknown) => void
  }
): Promise<Result> => {
  state.setPending(true)
  state.setError(undefined)
  try {
    const result = await operation()
    state.setResult(result)
    state.setError(result.ok ? undefined : result.error)
    return result
  } catch (error) {
    state.setError(error)
    throw error
  } finally {
    state.setPending(false)
  }
}

const useInteractive = <Args extends unknown[], Result extends Outcome<unknown, unknown>>(
  operation: (...args: Args) => Promise<Result>
) => {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | undefined>()
  const [error, setError] = useState<unknown>()
  const execute = useCallback(
    (...args: Args) => runInteractive(() => operation(...args), { setPending, setResult, setError }),
    [operation]
  )
  return { execute, pending, result, error, reset: useCallback(() => setResult(undefined), []) }
}

export const useSignTx = () => {
  const operation = useCallback((tx: string) => client.signTx(tx), [])
  const { execute, ...state } = useInteractive(operation)
  return { signTx: execute, ...state }
}
export const useSubmitTx = () => {
  const operation = useCallback((tx: string) => client.submitTx(tx), [])
  const { execute, ...state } = useInteractive(operation)
  return { submitTx: execute, ...state }
}
export const useSignData = () => {
  const operation = useCallback((address: string, data: string) => client.signData(address, data), [])
  const { execute, ...state } = useInteractive(operation)
  return { signData: execute, ...state }
}

export const stores = { tip: tipStore, accountState: accountStateStore, explorer: explorerStore }
