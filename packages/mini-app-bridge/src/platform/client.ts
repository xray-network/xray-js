import { DEFAULT_REQUEST_TIMEOUT } from "../transport/constants.js"
import { listenAllHost, listenHost, requestHost } from "../transport/client.js"
import {
  platformClientMessageSchemas,
  platformHostMessageSchemas,
  type PlatformClientRouteChangedPayload,
  type PlatformHostMessagePayloadMap,
} from "./protocol.js"

export const handshake = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  requestHost({
    clientSchemas: platformClientMessageSchemas,
    hostSchemas: platformHostMessageSchemas,
    requestType: "xray.client.handshake",
    payload: null,
    responseType: "xray.host.handshake",
    timeout,
    requestId,
  })

export const getTheme = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  requestHost({
    clientSchemas: platformClientMessageSchemas,
    hostSchemas: platformHostMessageSchemas,
    requestType: "xray.client.getTheme",
    payload: null,
    responseType: "xray.host.theme",
    timeout,
    requestId,
  })

export const getCurrency = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  requestHost({
    clientSchemas: platformClientMessageSchemas,
    hostSchemas: platformHostMessageSchemas,
    requestType: "xray.client.getCurrency",
    payload: null,
    responseType: "xray.host.currency",
    timeout,
    requestId,
  })

export const getHideBalances = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  requestHost({
    clientSchemas: platformClientMessageSchemas,
    hostSchemas: platformHostMessageSchemas,
    requestType: "xray.client.getHideBalances",
    payload: null,
    responseType: "xray.host.hideBalances",
    timeout,
    requestId,
  })

export const routeChanged = async (route: PlatformClientRouteChangedPayload, requestId?: string) =>
  requestHost({
    clientSchemas: platformClientMessageSchemas,
    hostSchemas: platformHostMessageSchemas,
    requestType: "xray.client.routeChanged",
    payload: route,
    responseType: "xray.host.routeChanged",
    timeout: DEFAULT_REQUEST_TIMEOUT,
    requestId,
    expectResponse: false,
  })

export const listen = <MessageType extends keyof PlatformHostMessagePayloadMap>(
  messageType: MessageType,
  handler: Parameters<typeof listenHost<typeof platformHostMessageSchemas, MessageType>>[2]
) => listenHost(platformHostMessageSchemas, messageType, handler)

export const listenAll = (handler: Parameters<typeof listenAllHost<typeof platformHostMessageSchemas>>[1]) =>
  listenAllHost(platformHostMessageSchemas, handler)
