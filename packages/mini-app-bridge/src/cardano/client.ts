import { DEFAULT_INTERACTIVE_TIMEOUT, DEFAULT_REQUEST_TIMEOUT } from "../transport/constants.js"
import { listenAllHost, listenHost, requestHost } from "../transport/client.js"
import { cardanoHostContextSchema, type CardanoHostContext } from "../transport/context.js"
import {
  cardanoClientMessageSchemas,
  cardanoHostMessageSchemas,
  type CardanoClientSignAndSubmitTxPayload,
  type CardanoClientMessagePayloadMap,
  type CardanoClientSignDataPayload,
  type CardanoClientSignTxPayload,
  type CardanoClientSubmitTxPayload,
  type CardanoHostMessagePayloadMap,
} from "./protocol.js"

const request = <
  RequestType extends keyof typeof cardanoClientMessageSchemas,
  ResponseType extends keyof typeof cardanoHostMessageSchemas,
>(
  requestType: RequestType,
  payload: CardanoClientMessagePayloadMap[RequestType],
  responseType: ResponseType,
  timeout: number,
  requestId?: string
) =>
  requestHost({
    clientSchemas: cardanoClientMessageSchemas,
    hostSchemas: cardanoHostMessageSchemas,
    requestType,
    payload,
    responseType,
    timeout,
    requestId,
    contextSchema: cardanoHostContextSchema,
  })

export const getTip = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  request("xray.cardano.client.getTip", null, "xray.cardano.host.tip", timeout, requestId)

export const getAccountState = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  request("xray.cardano.client.getAccountState", null, "xray.cardano.host.accountState", timeout, requestId)

export const getExplorer = async (requestId?: string, timeout: number = DEFAULT_REQUEST_TIMEOUT) =>
  request("xray.cardano.client.getExplorer", null, "xray.cardano.host.explorer", timeout, requestId)

export const signTx = async (
  tx: CardanoClientSignTxPayload,
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => request("xray.cardano.client.signTx", tx, "xray.cardano.host.signTx", timeout, requestId)

export const submitTx = async (
  tx: CardanoClientSubmitTxPayload,
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => request("xray.cardano.client.submitTx", tx, "xray.cardano.host.submitTx", timeout, requestId)

export const signAndSubmitTx = async (
  tx: CardanoClientSignAndSubmitTxPayload,
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => request("xray.cardano.client.signAndSubmitTx", tx, "xray.cardano.host.signAndSubmitTx", timeout, requestId)

export const signData = async (
  address: CardanoClientSignDataPayload["address"],
  data: CardanoClientSignDataPayload["data"],
  requestId?: string,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => request("xray.cardano.client.signData", { address, data }, "xray.cardano.host.signData", timeout, requestId)

export const listen = <MessageType extends keyof CardanoHostMessagePayloadMap>(
  messageType: MessageType,
  handler: Parameters<typeof listenHost<typeof cardanoHostMessageSchemas, MessageType, CardanoHostContext>>[2]
) => listenHost(cardanoHostMessageSchemas, messageType, handler, cardanoHostContextSchema)

export const listenAll = (
  handler: Parameters<typeof listenAllHost<typeof cardanoHostMessageSchemas, CardanoHostContext>>[1]
) => listenAllHost(cardanoHostMessageSchemas, handler, cardanoHostContextSchema)
