import {
  DEFAULT_REQUEST_TIMEOUT,
  DEFAULT_INTERACTIVE_TIMEOUT,
  type Cip30ClientMessagePayloadMap,
  type Cip30HostMessagePayloadMap,
  type Cip30ClientUtxosPayload,
  type Cip30ClientUsedAddressesPayload,
  type Cip30ClientSignTxPayload,
  type Cip30ClientSignDataPayload,
  type Cip30ClientSubmitTxPayload,
} from "../protocol"
import { getHostWindow, getRequestId } from "./messaging"

export const version: string = "3.0.0"
export const name: string = "xrayIframeConnector"
export const icon: string = ""
export const supportedExtensions: { [key: string]: number }[] = [{ cip: 30 }]

/**
 * Post a message to the host window and resolve when a correlated response
 * arrives. A timeout rejects to match CIP-30's error-throwing semantics.
 */
const sendMessageAsync = async <
  RequestType extends keyof Cip30ClientMessagePayloadMap,
  ResponseType extends keyof Cip30HostMessagePayloadMap,
>(
  requestType: RequestType,
  payload: Cip30ClientMessagePayloadMap[RequestType],
  responseType: ResponseType,
  requestId: string = getRequestId(),
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
): Promise<Cip30HostMessagePayloadMap[ResponseType]> => {
  const hostWindow = getHostWindow()
  if (!hostWindow) throw new Error("No parent window found")

  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== hostWindow) return
      const { type, payload: responsePayload, requestId: responseId } = event.data ?? {}
      if (responseId !== requestId || type !== responseType) return
      window.removeEventListener("message", handleMessage)
      clearTimeout(timer)
      resolve(responsePayload)
    }
    const timer = setTimeout(() => {
      window.removeEventListener("message", handleMessage)
      reject(new Error(`Timeout waiting for response to ${requestType}. Request ID: ${requestId}`))
      console.log(`MiniAppSDKTimeout: ${requestType} :: ${timeout}ms :: ${requestId}`)
    }, timeout)
    window.addEventListener("message", handleMessage)
    hostWindow.postMessage({ type: requestType, payload, requestId }, "*")
  })
}

export const isEnabled = async () => {
  return await sendMessageAsync<"xray.cip30.client.handshake", "xray.cip30.host.handshake">(
    "xray.cip30.client.handshake",
    null,
    "xray.cip30.host.handshake",
    undefined,
    DEFAULT_REQUEST_TIMEOUT
  )
}

export const enable = async () => {
  const enabled = await isEnabled()
  if (!enabled) {
    throw new Error("XRAY CIP-30 extension not enabled in host wallet")
  }
  return {
    experimental,
    getExtensions,
    getNetworkId,
    getUtxos,
    getCollateral,
    getBalance,
    getUsedAddresses,
    getUnusedAddresses,
    getChangeAddress,
    getRewardAddresses,
    signTx,
    signData,
    submitTx,
  }
}

const experimental = {}

const getExtensions = async () => {
  return await sendMessageAsync<"xray.cip30.client.getExtensions", "xray.cip30.host.extensions">(
    "xray.cip30.client.getExtensions",
    null,
    "xray.cip30.host.extensions"
  )
}

const getNetworkId = async () => {
  return await sendMessageAsync<"xray.cip30.client.getNetworkId", "xray.cip30.host.networkId">(
    "xray.cip30.client.getNetworkId",
    null,
    "xray.cip30.host.networkId"
  )
}

const getUtxos = async (amount?: Cip30ClientUtxosPayload["amount"], paginate?: Cip30ClientUtxosPayload["paginate"]) => {
  return await sendMessageAsync<"xray.cip30.client.getUtxos", "xray.cip30.host.utxos">(
    "xray.cip30.client.getUtxos",
    { amount, paginate },
    "xray.cip30.host.utxos"
  )
}

const getCollateral = async () => {
  return await sendMessageAsync<"xray.cip30.client.getCollateral", "xray.cip30.host.collateral">(
    "xray.cip30.client.getCollateral",
    null,
    "xray.cip30.host.collateral"
  )
}

const getBalance = async () => {
  return await sendMessageAsync<"xray.cip30.client.getBalance", "xray.cip30.host.balance">(
    "xray.cip30.client.getBalance",
    null,
    "xray.cip30.host.balance"
  )
}

const getUsedAddresses = async (paginate?: Cip30ClientUsedAddressesPayload["paginate"]) => {
  return await sendMessageAsync<"xray.cip30.client.getUsedAddresses", "xray.cip30.host.usedAddresses">(
    "xray.cip30.client.getUsedAddresses",
    { paginate },
    "xray.cip30.host.usedAddresses"
  )
}

const getUnusedAddresses = async () => {
  return await sendMessageAsync<"xray.cip30.client.getUnusedAddresses", "xray.cip30.host.unusedAddresses">(
    "xray.cip30.client.getUnusedAddresses",
    null,
    "xray.cip30.host.unusedAddresses"
  )
}

const getChangeAddress = async () => {
  return await sendMessageAsync<"xray.cip30.client.getChangeAddress", "xray.cip30.host.changeAddress">(
    "xray.cip30.client.getChangeAddress",
    null,
    "xray.cip30.host.changeAddress"
  )
}

const getRewardAddresses = async () => {
  return await sendMessageAsync<"xray.cip30.client.getRewardAddresses", "xray.cip30.host.rewardAddresses">(
    "xray.cip30.client.getRewardAddresses",
    null,
    "xray.cip30.host.rewardAddresses"
  )
}

const signTx = async (
  tx: Cip30ClientSignTxPayload["tx"],
  partialSign: Cip30ClientSignTxPayload["partialSign"] = false
) => {
  return await sendMessageAsync<"xray.cip30.client.signTx", "xray.cip30.host.signTx">(
    "xray.cip30.client.signTx",
    { tx, partialSign },
    "xray.cip30.host.signTx"
  )
}

const signData = async (address: Cip30ClientSignDataPayload["address"], data: Cip30ClientSignDataPayload["data"]) => {
  return await sendMessageAsync<"xray.cip30.client.signData", "xray.cip30.host.signData">(
    "xray.cip30.client.signData",
    { address, data },
    "xray.cip30.host.signData"
  )
}

const submitTx = async (tx: Cip30ClientSubmitTxPayload) => {
  return await sendMessageAsync<"xray.cip30.client.submitTx", "xray.cip30.host.submitTx">(
    "xray.cip30.client.submitTx",
    tx,
    "xray.cip30.host.submitTx"
  )
}
