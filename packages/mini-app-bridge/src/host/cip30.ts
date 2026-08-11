import type {
  Cip30HostHandshakePayload,
  Cip30HostExtensionsPayload,
  Cip30HostNetworkIdPayload,
  Cip30HostUtxosPayload,
  Cip30HostCollateralPayload,
  Cip30HostBalancePayload,
  Cip30HostUsedAddressesPayload,
  Cip30HostUnusedAddressesPayload,
  Cip30HostChangeAddressPayload,
  Cip30HostRewardAddressesPayload,
  Cip30HostSignTxPayload,
  Cip30HostSignDataPayload,
  Cip30HostSubmitTxPayload,
  Cip30ClientMessagePayloadMap,
  Cip30ClientMessage,
  HostContext,
} from "../protocol/index.js"
import { sendMessage, listenToWindow, listenAllFromWindow } from "./messaging.js"

/** Confirm to the mini-app that the host is reachable and ready. */
export const sendHandshake = (
  iframe: Window | null | undefined,
  payload: Cip30HostHandshakePayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.handshake", payload, requestId, context)
}

/** Provide supported CIP-30 extensions to the mini-app. */
export const sendExtensions = (
  iframe: Window | null | undefined,
  payload: Cip30HostExtensionsPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.extensions", payload, requestId, context)
}

/** Provide current network id to the mini-app. */
export const sendNetworkId = (
  iframe: Window | null | undefined,
  payload: Cip30HostNetworkIdPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.networkId", payload, requestId, context)
}

/** Provide UTXOs to the mini-app. */
export const sendUtxos = (
  iframe: Window | null | undefined,
  payload: Cip30HostUtxosPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.utxos", payload, requestId, context)
}

/** Provide collateral UTXOs to the mini-app. */
export const sendCollateral = (
  iframe: Window | null | undefined,
  payload: Cip30HostCollateralPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.collateral", payload, requestId, context)
}

/** Provide balance to the mini-app. */
export const sendBalance = (
  iframe: Window | null | undefined,
  payload: Cip30HostBalancePayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.balance", payload, requestId, context)
}

/** Provide used addresses to the mini-app. */
export const sendUsedAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostUsedAddressesPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.usedAddresses", payload, requestId, context)
}

/** Provide unused addresses to the mini-app. */
export const sendUnusedAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostUnusedAddressesPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.unusedAddresses", payload, requestId, context)
}

/** Provide change address to the mini-app. */
export const sendChangeAddress = (
  iframe: Window | null | undefined,
  payload: Cip30HostChangeAddressPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.changeAddress", payload, requestId, context)
}

/** Provide reward addresses to the mini-app. */
export const sendRewardAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostRewardAddressesPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.rewardAddresses", payload, requestId, context)
}

/** Provide signed transaction to the mini-app. */
export const sendSignTx = (
  iframe: Window | null | undefined,
  payload: Cip30HostSignTxPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.signTx", payload, requestId, context)
}

/** Provide signed data to the mini-app. */
export const sendSignData = (
  iframe: Window | null | undefined,
  payload: Cip30HostSignDataPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.signData", payload, requestId, context)
}

/** Provide submitted transaction hash to the mini-app. */
export const sendSubmitTx = (
  iframe: Window | null | undefined,
  payload: Cip30HostSubmitTxPayload,
  requestId: string,
  context: HostContext
) => {
  sendMessage(iframe, "xray.cip30.host.submitTx", payload, requestId, context)
}

/**
 * Subscribe to a specific client-originated message. Returns an unsubscribe
 * function for easy cleanup when the embedding page is torn down.
 */
export const listen = <MessageType extends keyof Cip30ClientMessagePayloadMap>(
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: ({
    type,
    payload,
    requestId,
  }: {
    type: MessageType
    payload: Cip30ClientMessagePayloadMap[MessageType]
    requestId: string
  }) => void
) => {
  return listenToWindow(iframe, messageType, handler)
}

/** Listen for all client messages and delegate handling to caller. */
export const listenAll = (iframe: Window | null | undefined, handler: (message: Cip30ClientMessage) => void) => {
  return listenAllFromWindow(iframe, handler)
}
