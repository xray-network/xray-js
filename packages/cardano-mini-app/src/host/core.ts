import type {
  HostHandshakePayload,
  HostAccountStatePayload,
  HostTipPayload,
  HostNetworkPayload,
  HostThemePayload,
  HostCurrencyPayload,
  HostHideBalancesPayload,
  HostExplorerPayload,
  HostRouteChangedPayload,
  HostSignTxPayload,
  HostSubmitTxPayload,
  HostSignAndSubmitTxPayload,
  HostSignDataPayload,
  ClientMessagePayloadMap,
  ClientMessage,
} from "../protocol"
import { sendMessage, listenToWindow, listenAllFromWindow } from "./messaging"

/** Confirm to the mini-app that the host is reachable and ready. */
export const sendHandshake = (iframe: Window | null | undefined, payload: HostHandshakePayload, requestId: string) => {
  sendMessage(iframe, "xray.host.handshake", payload, requestId)
}

/** Provide current chain tip metadata. */
export const sendTip = (iframe: Window | null | undefined, payload: HostTipPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.tip", payload, requestId)
}

/** Provide account state (balance, nonce, etc) to the mini-app. */
export const sendAccountState = (
  iframe: Window | null | undefined,
  payload: HostAccountStatePayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.host.accountState", payload, requestId)
}

/** Provide network information to the mini-app. */
export const sendNetwork = (iframe: Window | null | undefined, payload: HostNetworkPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.network", payload, requestId)
}

/** Tell the mini-app which theme to use. */
export const sendTheme = (iframe: Window | null | undefined, payload: HostThemePayload, requestId: string) => {
  sendMessage(iframe, "xray.host.theme", payload, requestId)
}

/** Tell the mini-app which display currency to use. */
export const sendCurrency = (iframe: Window | null | undefined, payload: HostCurrencyPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.currency", payload, requestId)
}

/** Tell the mini-app whether to hide balances. */
export const sendHideBalances = (
  iframe: Window | null | undefined,
  payload: HostHideBalancesPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.host.hideBalances", payload, requestId)
}

/** Provide explorer type to the mini-app. */
export const sendExplorer = (iframe: Window | null | undefined, payload: HostExplorerPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.explorer", payload, requestId)
}

/** Inform the mini-app that the host route has changed (mirrors client -> host call). */
export const sendRouteChanged = (
  iframe: Window | null | undefined,
  payload: HostRouteChangedPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.host.routeChanged", payload, requestId)
}

/** Return the result of a signTx request, including any host-provided error message. */
export const sendSignTx = (iframe: Window | null | undefined, payload: HostSignTxPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.signTx", payload, requestId)
}

/** Return the result of a submitTx request, including any host-provided error message. */
export const sendSubmitTx = (iframe: Window | null | undefined, payload: HostSubmitTxPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.submitTx", payload, requestId)
}

/** Return the result of a signAndSubmitTx request, including any host-provided error message. */
export const sendSignAndSubmitTx = (
  iframe: Window | null | undefined,
  payload: HostSignAndSubmitTxPayload,
  requestId: string
) => {
  sendMessage(iframe, "xray.host.signAndSubmitTx", payload, requestId)
}

/** Return the result of a signData request, including any host-provided error message. */
export const sendSignData = (iframe: Window | null | undefined, payload: HostSignDataPayload, requestId: string) => {
  sendMessage(iframe, "xray.host.signData", payload, requestId)
}

/**
 * Subscribe to a specific client-originated message. Returns an unsubscribe
 * function for easy cleanup when the embedding page is torn down.
 */
export const listen = <MessageType extends keyof ClientMessagePayloadMap>(
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: ({
    type,
    payload,
    requestId,
  }: {
    type: MessageType
    payload: ClientMessagePayloadMap[MessageType]
    requestId: string
  }) => void
) => {
  return listenToWindow(iframe, messageType, handler)
}

/** Listen for all client messages and delegate handling to caller. */
export const listenAll = (iframe: Window | null | undefined, handler: (message: ClientMessage) => void) => {
  return listenAllFromWindow(iframe, handler)
}
