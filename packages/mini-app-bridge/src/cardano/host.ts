import type { CardanoHostContext } from "../transport/context.js"
import { listenAllClient, listenClient, sendHost } from "../transport/host.js"
import {
  cardanoClientMessageSchemas,
  cardanoHostMessageSchemas,
  type CardanoClientMessage,
  type CardanoClientMessagePayloadMap,
  type CardanoHostAccountStatePayload,
  type CardanoHostExplorerPayload,
  type CardanoHostSignAndSubmitTxPayload,
  type CardanoHostSignDataPayload,
  type CardanoHostSignTxPayload,
  type CardanoHostSubmitTxPayload,
  type CardanoHostTipPayload,
  type CardanoHostMessagePayloadMap,
} from "./protocol.js"

const send = <MessageType extends keyof typeof cardanoHostMessageSchemas>(
  iframe: Window | null | undefined,
  type: MessageType,
  payload: CardanoHostMessagePayloadMap[MessageType],
  requestId: string,
  context: CardanoHostContext
) => sendHost(cardanoHostMessageSchemas, iframe, type, payload, requestId, context)

export const sendTip = (
  iframe: Window | null | undefined,
  payload: CardanoHostTipPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.tip", payload, requestId, context)

export const sendAccountState = (
  iframe: Window | null | undefined,
  payload: CardanoHostAccountStatePayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.accountState", payload, requestId, context)

export const sendExplorer = (
  iframe: Window | null | undefined,
  payload: CardanoHostExplorerPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.explorer", payload, requestId, context)

export const sendSignTx = (
  iframe: Window | null | undefined,
  payload: CardanoHostSignTxPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.signTx", payload, requestId, context)

export const sendSubmitTx = (
  iframe: Window | null | undefined,
  payload: CardanoHostSubmitTxPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.submitTx", payload, requestId, context)

export const sendSignAndSubmitTx = (
  iframe: Window | null | undefined,
  payload: CardanoHostSignAndSubmitTxPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.signAndSubmitTx", payload, requestId, context)

export const sendSignData = (
  iframe: Window | null | undefined,
  payload: CardanoHostSignDataPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.host.signData", payload, requestId, context)

export const listen = <MessageType extends keyof CardanoClientMessagePayloadMap>(
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: Parameters<typeof listenClient<typeof cardanoClientMessageSchemas, MessageType>>[3]
) => listenClient(cardanoClientMessageSchemas, iframe, messageType, handler)

export const listenAll = (iframe: Window | null | undefined, handler: (message: CardanoClientMessage) => void) =>
  listenAllClient(cardanoClientMessageSchemas, iframe, handler)
