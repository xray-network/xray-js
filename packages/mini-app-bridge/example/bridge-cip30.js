/**
 * Copy this file together with bridge.js; no npm package or build step is needed.
 *
 * import { createCip30 } from "./bridge-cip30.js"
 * const connector = createCip30("https://your-xray-host.example")
 * const wallet = await connector.enable() // Call from your Connect button.
 * console.log(await wallet.getNetworkId(), await wallet.getBalance())
 *
 * Unlike the native bridge, wallet methods return payloads and throw errors.
 */
import { createBridge } from "./bridge.js"

export function createCip30(hostOrigin) {
  const bridge = createBridge(hostOrigin)
  const walletError = ({ code, info }) => Object.assign(new Error(info), { code, info })

  async function request(method, payload = null, timeout = 120_000) {
    const response = await bridge.request("cardano-cip30", method, payload, timeout)
    if (response.ok) return response.payload
    const { code, message, data } = response.error
    if (data && typeof data.code === "number" && typeof data.info === "string") throw walletError(data)
    throw Object.assign(new Error(message), { name: "BridgeError", code, data })
  }

  const api = {
    experimental: {},
    getExtensions: () => request("getExtensions"),
    getNetworkId: () => request("getNetworkId"),
    getBalance: () => request("getBalance"),
    getUtxos: (amount, paginate) => request("getUtxos", { amount, paginate }),
    getCollateral: (params) => request("getCollateral", params),
    getUsedAddresses: (paginate) => request("getUsedAddresses", { paginate }),
    getUnusedAddresses: () => request("getUnusedAddresses"),
    getChangeAddress: () => request("getChangeAddress"),
    getRewardAddresses: () => request("getRewardAddresses"),
    signTx: (tx, partialSign = false) => request("signTx", { tx, partialSign }),
    signData: (address, data) => request("signData", { address, data }),
    submitTx: (tx) => request("submitTx", tx),
  }

  return {
    apiVersion: "1",
    name: "XRAY",
    icon: "",
    supportedExtensions: [],
    experimental: {},
    isEnabled: () => request("isEnabled", null, 5_000),
    async enable({ extensions = [] } = {}) {
      const enabled = await request("enable", { extensions })
      if (enabled !== true) throw walletError({ code: -3, info: "XRAY CIP-30 access was refused by the host" })
      return api
    },
  }
}
