import type { HostContext } from "../transport/context.js"
import { listenAllClient, listenClient, sendHost } from "../transport/host.js"
import {
  platformClientMessageSchemas,
  platformHostMessageSchemas,
  type PlatformClientMessage,
  type PlatformClientMessagePayloadMap,
  type PlatformHostCurrencyPayload,
  type PlatformHostHandshakePayload,
  type PlatformHostHideBalancesPayload,
  type PlatformHostRouteChangedPayload,
  type PlatformHostThemePayload,
} from "./protocol.js"

export const sendHandshake = (
  iframe: Window | null | undefined,
  payload: PlatformHostHandshakePayload,
  requestId: string,
  context: HostContext
) => sendHost(platformHostMessageSchemas, iframe, "xray.host.handshake", payload, requestId, context)

export const sendTheme = (
  iframe: Window | null | undefined,
  payload: PlatformHostThemePayload,
  requestId: string,
  context: HostContext
) => sendHost(platformHostMessageSchemas, iframe, "xray.host.theme", payload, requestId, context)

export const sendCurrency = (
  iframe: Window | null | undefined,
  payload: PlatformHostCurrencyPayload,
  requestId: string,
  context: HostContext
) => sendHost(platformHostMessageSchemas, iframe, "xray.host.currency", payload, requestId, context)

export const sendHideBalances = (
  iframe: Window | null | undefined,
  payload: PlatformHostHideBalancesPayload,
  requestId: string,
  context: HostContext
) => sendHost(platformHostMessageSchemas, iframe, "xray.host.hideBalances", payload, requestId, context)

export const sendRouteChanged = (
  iframe: Window | null | undefined,
  payload: PlatformHostRouteChangedPayload,
  requestId: string,
  context: HostContext
) => sendHost(platformHostMessageSchemas, iframe, "xray.host.routeChanged", payload, requestId, context)

export const listen = <MessageType extends keyof PlatformClientMessagePayloadMap>(
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: Parameters<typeof listenClient<typeof platformClientMessageSchemas, MessageType>>[3]
) => listenClient(platformClientMessageSchemas, iframe, messageType, handler)

export const listenAll = (iframe: Window | null | undefined, handler: (message: PlatformClientMessage) => void) =>
  listenAllClient(platformClientMessageSchemas, iframe, handler)
