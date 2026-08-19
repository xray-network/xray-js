import type { AdapterEventName, ClientEvent, EventPayload } from "../../types.js"
import {
  DEFAULT_INTERACTIVE_TIMEOUT,
  DEFAULT_REQUEST_TIMEOUT,
  listen as listenEvent,
  listenAll as listenAllEvents,
  request,
} from "../../../transport/client.js"
import { cardanoV1Contract, type CardanoContext, type CardanoV1Contract } from "./contract.js"

export const scope = cardanoV1Contract.scope
export const version = cardanoV1Contract.version

export const getTip = (timeout = DEFAULT_REQUEST_TIMEOUT) => request(cardanoV1Contract, "getTip", null, timeout)
export const getAccountState = (timeout = DEFAULT_REQUEST_TIMEOUT) =>
  request(cardanoV1Contract, "getAccountState", null, timeout)
export const getExplorer = (timeout = DEFAULT_REQUEST_TIMEOUT) =>
  request(cardanoV1Contract, "getExplorer", null, timeout)
export const signTx = (tx: string, timeout = DEFAULT_INTERACTIVE_TIMEOUT) =>
  request(cardanoV1Contract, "signTx", tx, timeout)
export const submitTx = (tx: string, timeout = DEFAULT_INTERACTIVE_TIMEOUT) =>
  request(cardanoV1Contract, "submitTx", tx, timeout)
export const signAndSubmitTx = (tx: string, timeout = DEFAULT_INTERACTIVE_TIMEOUT) =>
  request(cardanoV1Contract, "signAndSubmitTx", tx, timeout)
export const signData = (address: string, data: string, timeout = DEFAULT_INTERACTIVE_TIMEOUT) =>
  request(cardanoV1Contract, "signData", { address, data }, timeout)

export const listen = <Event extends AdapterEventName<CardanoV1Contract>>(
  event: Event,
  handler: (message: ClientEvent<Event, EventPayload<CardanoV1Contract, Event>, CardanoContext>) => void
) => listenEvent(cardanoV1Contract, event, handler)

export const listenAll = (handler: Parameters<typeof listenAllEvents<CardanoV1Contract>>[1]) =>
  listenAllEvents(cardanoV1Contract, handler)

export type {
  AccountState,
  CardanoContext,
  Explorer,
  SignDataResult,
  SignTxResult,
  SubmitTxResult,
  Tip,
} from "./contract.js"
