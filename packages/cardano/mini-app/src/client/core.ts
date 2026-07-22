import {
  DEFAULT_REQUEST_TIMEOUT,
  DEFAULT_INTERACTIVE_TIMEOUT,
  type ClientMessagePayloadMap,
  type HostMessage,
  type HostMessagePayloadMap,
  type ClientSignTxPayload,
  type ClientRouteChangedPayload,
  type ClientSubmitTxPayload,
  type ClientSignAndSubmitTxPayload,
  type ClientSignDataPayload,
} from "../protocol"
import { getHostWindow, getRequestId } from "./messaging"

/**
 * Post a message to the host window and (optionally) resolve when a correlated
 * response arrives. A timeout returns null to avoid hanging the caller.
 */
const sendMessageAsync = async <
  RequestType extends keyof ClientMessagePayloadMap,
  ResponseType extends keyof HostMessagePayloadMap,
>(
  requestType: RequestType,
  payload: ClientMessagePayloadMap[RequestType],
  responseType: ResponseType,
  timeout: number,
  requestId: string = getRequestId(),
  expectResponse: boolean = true
): Promise<{ type: ResponseType; payload: HostMessagePayloadMap[ResponseType]; requestId: string } | null> => {
  const hostWindow = getHostWindow()
  if (!hostWindow) return null

  return new Promise((resolve) => {
    if (expectResponse) {
      const handleMessage = (event: MessageEvent) => {
        if (event.source !== hostWindow) return
        const { type, payload: responsePayload, requestId: responseId } = event.data ?? {}
        if (responseId !== requestId || type !== responseType) return
        window.removeEventListener("message", handleMessage)
        clearTimeout(timer)
        resolve({ type, payload: responsePayload, requestId: responseId })
      }
      const timer = setTimeout(() => {
        window.removeEventListener("message", handleMessage)
        resolve(null)
        console.log(`MiniAppSDKTimeout: ${requestType} :: ${timeout}ms :: ${requestId}`)
      }, timeout)
      window.addEventListener("message", handleMessage)
    } else {
      resolve(null)
    }
    hostWindow.postMessage({ type: requestType, payload, requestId }, "*")
  })
}

/**
 * Initiate handshake with the host mini-app container. Returns host info.
 */
export const sendHandshake = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.handshake", "xray.host.handshake">(
    "xray.client.handshake",
    null,
    "xray.host.handshake",
    timeout,
    requestId
  )
}

/**
 * Ask the host wallet for the latest chain tip. Returns block metadata or null
 * when the host did not respond in time.
 */
export const getTip = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getTip", "xray.host.tip">(
    "xray.client.getTip",
    null,
    "xray.host.tip",
    timeout,
    requestId
  )
}

/**
 * Fetch the wallet's current account state (UTxOs, balance, delegation).
 */
export const getAccountState = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getAccountState", "xray.host.accountState">(
    "xray.client.getAccountState",
    null,
    "xray.host.accountState",
    timeout,
    requestId
  )
}

/** Resolve which Cardano network the host is connected to. */
export const getNetwork = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getNetwork", "xray.host.network">(
    "xray.client.getNetwork",
    null,
    "xray.host.network",
    timeout,
    requestId
  )
}

/** Retrieve the host's active theme so the mini-app can mirror UI styling. */
export const getTheme = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getTheme", "xray.host.theme">(
    "xray.client.getTheme",
    null,
    "xray.host.theme",
    timeout,
    requestId
  )
}

/** Retrieve the user's preferred display currency (usd, eur, etc.). */
export const getCurrency = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getCurrency", "xray.host.currency">(
    "xray.client.getCurrency",
    null,
    "xray.host.currency",
    timeout,
    requestId
  )
}

/** Determine whether balances should be hidden for privacy. */
export const getHideBalances = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getHideBalances", "xray.host.hideBalances">(
    "xray.client.getHideBalances",
    null,
    "xray.host.hideBalances",
    timeout,
    requestId
  )
}

/** Discover which explorer base URL the host prefers the app to link to. */
export const getExplorer = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) => {
  return await sendMessageAsync<"xray.client.getExplorer", "xray.host.explorer">(
    "xray.client.getExplorer",
    null,
    "xray.host.explorer",
    timeout,
    requestId
  )
}

/**
 * Inform the host that the mini-app navigated to a new route. Fire-and-forget.
 */
export const routeChanged = async (newRoute: ClientRouteChangedPayload, requestId?: string) => {
  return await sendMessageAsync<"xray.client.routeChanged", "xray.host.routeChanged">(
    "xray.client.routeChanged",
    newRoute,
    "xray.host.routeChanged",
    DEFAULT_REQUEST_TIMEOUT,
    requestId,
    false
  )
}

/**
 * Request the host to sign a transaction. Returns signed tx cbor hex or null on timeout.
 */
export const signTx = async (
  tx: ClientSignTxPayload,
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => {
  return await sendMessageAsync<"xray.client.signTx", "xray.host.signTx">(
    "xray.client.signTx",
    tx,
    "xray.host.signTx",
    timeout,
    requestId
  )
}

/**
 * Request the host to submit a transaction. Returns tx hash or null on timeout.
 */
export const submitTx = async (
  tx: ClientSubmitTxPayload,
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => {
  return await sendMessageAsync<"xray.client.submitTx", "xray.host.submitTx">(
    "xray.client.submitTx",
    tx,
    "xray.host.submitTx",
    timeout,
    requestId
  )
}

/**
 * Request the host to sign and submit a transaction. Returns hash or null on timeout.
 */
export const signAndSubmitTx = async (
  tx: ClientSignAndSubmitTxPayload,
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => {
  return await sendMessageAsync<"xray.client.signAndSubmitTx", "xray.host.signAndSubmitTx">(
    "xray.client.signAndSubmitTx",
    tx,
    "xray.host.signAndSubmitTx",
    timeout,
    requestId
  )
}

/**
 * Request the host to sign arbitrary data using a specific address. Caller is
 * responsible for encoding data as hex/base64 per host expectations.
 */
export const signData = async (
  address: ClientSignDataPayload["address"],
  data: ClientSignDataPayload["data"],
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => {
  return await sendMessageAsync<"xray.client.signData", "xray.host.signData">(
    "xray.client.signData",
    { address, data },
    "xray.host.signData",
    timeout,
    requestId
  )
}

/**
 * Subscribe to a specific host message. Returns an unsubscribe function to
 * simplify lifecycle management in SPA frameworks.
 */
export const listen = <MessageType extends keyof HostMessagePayloadMap>(
  messageType: MessageType,
  handler: ({
    type,
    payload,
    requestId,
  }: {
    type: MessageType
    payload: HostMessagePayloadMap[MessageType]
    requestId?: string
  }) => void
) => {
  const hostWindow = getHostWindow()
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== hostWindow) return
    const { type, payload, requestId } = event.data ?? {}
    if (type !== messageType) return
    handler({ type, payload, requestId })
  }
  if (hostWindow) {
    window.addEventListener("message", handleMessage)
  }
  return () => {
    window.removeEventListener("message", handleMessage)
  }
}

/**
 * Listen for any host message regardless of type. Handy for debugging or when
 * the consumer implements its own dispatching logic.
 */
export const listenAll = (handler: (message: HostMessage) => void) => {
  const hostWindow = getHostWindow()
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== hostWindow) return
    const { type, payload, requestId } = event.data ?? {}
    if (typeof type !== "string") return
    handler({ type, payload, requestId } as HostMessage)
  }
  if (hostWindow) {
    window.addEventListener("message", handleMessage)
  }
  return () => {
    window.removeEventListener("message", handleMessage)
  }
}
