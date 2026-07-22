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
} from "../protocol"
import { sendMessage, listenToWindow, listenAllFromWindow } from "./messaging"

/** Confirm to the mini-app that the host is reachable and ready. */
export const sendHandshake = (
  iframe: Window | null | undefined,
  payload: Cip30HostHandshakePayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.handshake", payload, requestId)
}

/** Provide supported CIP-30 extensions to the mini-app. */
export const sendExtensions = (
  iframe: Window | null | undefined,
  payload: Cip30HostExtensionsPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.extensions", payload, requestId)
}

/** Provide current network id to the mini-app. */
export const sendNetworkId = (
  iframe: Window | null | undefined,
  payload: Cip30HostNetworkIdPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.networkId", payload, requestId)
}

/** Provide UTXOs to the mini-app. */
export const sendUtxos = (iframe: Window | null | undefined, payload: Cip30HostUtxosPayload, requestId: string) => {
  sendMessage(iframe, "xray.cip30.host.utxos", payload, requestId)
}

/** Provide collateral UTXOs to the mini-app. */
export const sendCollateral = (
  iframe: Window | null | undefined,
  payload: Cip30HostCollateralPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.collateral", payload, requestId)
}

/** Provide balance to the mini-app. */
export const sendBalance = (iframe: Window | null | undefined, payload: Cip30HostBalancePayload, requestId: string) => {
  sendMessage(iframe, "xray.cip30.host.balance", payload, requestId)
}

/** Provide used addresses to the mini-app. */
export const sendUsedAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostUsedAddressesPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.usedAddresses", payload, requestId)
}

/** Provide unused addresses to the mini-app. */
export const sendUnusedAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostUnusedAddressesPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.unusedAddresses", payload, requestId)
}

/** Provide change address to the mini-app. */
export const sendChangeAddress = (
  iframe: Window | null | undefined,
  payload: Cip30HostChangeAddressPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.changeAddress", payload, requestId)
}

/** Provide reward addresses to the mini-app. */
export const sendRewardAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostRewardAddressesPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.rewardAddresses", payload, requestId)
}

/** Provide signed transaction to the mini-app. */
export const sendSignTx = (iframe: Window | null | undefined, payload: Cip30HostSignTxPayload, requestId: string) => {
  sendMessage(iframe, "xray.cip30.host.signTx", payload, requestId)
}

/** Provide signed data to the mini-app. */
export const sendSignData = (
  iframe: Window | null | undefined,
  payload: Cip30HostSignDataPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.signData", payload, requestId)
}

/** Provide submitted transaction hash to the mini-app. */
export const sendSubmitTx = (
  iframe: Window | null | undefined,
  payload: Cip30HostSubmitTxPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.cip30.host.submitTx", payload, requestId)
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
