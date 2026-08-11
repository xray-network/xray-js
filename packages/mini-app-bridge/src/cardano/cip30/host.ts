import type { CardanoHostContext } from "../../transport/context.js"
import { listenAllClient, listenClient, sendHost } from "../../transport/host.js"
import {
  cip30ClientMessageSchemas,
  cip30HostMessageSchemas,
  type Cip30ClientMessage,
  type Cip30ClientMessagePayloadMap,
  type Cip30HostBalancePayload,
  type Cip30HostChangeAddressPayload,
  type Cip30HostCollateralPayload,
  type Cip30HostEnabledPayload,
  type Cip30HostExtensionsPayload,
  type Cip30HostErrorPayload,
  type Cip30HostNetworkIdPayload,
  type Cip30HostRewardAddressesPayload,
  type Cip30HostSignDataPayload,
  type Cip30HostSignTxPayload,
  type Cip30HostSubmitTxPayload,
  type Cip30HostUnusedAddressesPayload,
  type Cip30HostUsedAddressesPayload,
  type Cip30HostUtxosPayload,
  type Cip30HostMessagePayloadMap,
} from "./protocol.js"

const send = <MessageType extends keyof typeof cip30HostMessageSchemas>(
  iframe: Window | null | undefined,
  type: MessageType,
  payload: Cip30HostMessagePayloadMap[MessageType],
  requestId: string,
  context: CardanoHostContext
) => sendHost(cip30HostMessageSchemas, iframe, type, payload, requestId, context)

export const sendIsEnabled = (
  iframe: Window | null | undefined,
  payload: Cip30HostEnabledPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.isEnabled", payload, requestId, context)
export const sendEnable = (
  iframe: Window | null | undefined,
  payload: Cip30HostEnabledPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.enable", payload, requestId, context)
export const sendExtensions = (
  iframe: Window | null | undefined,
  payload: Cip30HostExtensionsPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.extensions", payload, requestId, context)
export const sendNetworkId = (
  iframe: Window | null | undefined,
  payload: Cip30HostNetworkIdPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.networkId", payload, requestId, context)
export const sendUtxos = (
  iframe: Window | null | undefined,
  payload: Cip30HostUtxosPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.utxos", payload, requestId, context)
export const sendCollateral = (
  iframe: Window | null | undefined,
  payload: Cip30HostCollateralPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.collateral", payload, requestId, context)
export const sendBalance = (
  iframe: Window | null | undefined,
  payload: Cip30HostBalancePayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.balance", payload, requestId, context)
export const sendUsedAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostUsedAddressesPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.usedAddresses", payload, requestId, context)
export const sendUnusedAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostUnusedAddressesPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.unusedAddresses", payload, requestId, context)
export const sendChangeAddress = (
  iframe: Window | null | undefined,
  payload: Cip30HostChangeAddressPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.changeAddress", payload, requestId, context)
export const sendRewardAddresses = (
  iframe: Window | null | undefined,
  payload: Cip30HostRewardAddressesPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.rewardAddresses", payload, requestId, context)
export const sendSignTx = (
  iframe: Window | null | undefined,
  payload: Cip30HostSignTxPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.signTx", payload, requestId, context)
export const sendSignData = (
  iframe: Window | null | undefined,
  payload: Cip30HostSignDataPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.signData", payload, requestId, context)
export const sendSubmitTx = (
  iframe: Window | null | undefined,
  payload: Cip30HostSubmitTxPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.submitTx", payload, requestId, context)
export const sendError = (
  iframe: Window | null | undefined,
  payload: Cip30HostErrorPayload,
  requestId: string,
  context: CardanoHostContext
) => send(iframe, "xray.cardano.cip30.host.error", payload, requestId, context)

export const listen = <MessageType extends keyof Cip30ClientMessagePayloadMap>(
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: Parameters<typeof listenClient<typeof cip30ClientMessageSchemas, MessageType>>[3]
) => listenClient(cip30ClientMessageSchemas, iframe, messageType, handler)
export const listenAll = (iframe: Window | null | undefined, handler: (message: Cip30ClientMessage) => void) =>
  listenAllClient(cip30ClientMessageSchemas, iframe, handler)
