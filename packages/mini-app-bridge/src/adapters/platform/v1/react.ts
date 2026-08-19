import { createRemoteStore, useRemoteStore } from "../../../react/remote-store.js"
import * as client from "./client.js"
import type { PlatformContext, PlatformIdentity, PlatformStatus } from "./contract.js"

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

const toPlatformStatus = ({
  payload,
  context,
}: {
  payload: PlatformIdentity
  context: PlatformContext
}): PlatformStatus => ({ ...payload, account: context })

const statusStore = createRemoteStore(
  async () => {
    const response = await client.getStatus()
    if (!response) throw new Error("XRAY platform host is unavailable")
    return toPlatformStatus(response)
  },
  (receive) => client.listen("status", (message) => receive(toPlatformStatus(message)))
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
