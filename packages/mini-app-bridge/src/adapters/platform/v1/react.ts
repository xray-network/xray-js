import { createRemoteStore, useRemoteStore } from "../../../react/remote-store.js"
import * as client from "./client.js"

const required = async <Value>(load: () => Promise<{ payload: Value } | null>) => {
  const response = await load()
  if (!response) throw new Error("XRAY platform host is unavailable")
  return response.payload
}

const themeStore = createRemoteStore(
  () => required(client.getTheme),
  (receive) => client.listen("theme", ({ payload }) => receive(payload))
)
const currencyStore = createRemoteStore(
  () => required(client.getCurrency),
  (receive) => client.listen("currency", ({ payload }) => receive(payload))
)
const hideBalancesStore = createRemoteStore(
  () => required(client.getHideBalances),
  (receive) => client.listen("hideBalances", ({ payload }) => receive(payload))
)
const statusStore = createRemoteStore(
  async () => {
    const status = await client.getStatus()
    if (!status) throw new Error("XRAY platform host is unavailable")
    return status
  },
  (receive) => client.listen("status", ({ payload }) => receive(payload))
)

export const useTheme = () => useRemoteStore(themeStore)
export const useCurrency = () => useRemoteStore(currencyStore)
export const useHideBalances = () => useRemoteStore(hideBalancesStore)
export const useStatus = () => useRemoteStore(statusStore)

export const stores = {
  theme: themeStore,
  currency: currencyStore,
  hideBalances: hideBalancesStore,
  status: statusStore,
}
