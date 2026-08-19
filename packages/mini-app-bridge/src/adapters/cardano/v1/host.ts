import type {
  AdapterEventName,
  AdapterMethodName,
  EventPayload,
  HostRequest,
  HostResult,
  MethodPayload,
  MethodResult,
} from "../../types.js"
import {
  handle as handleRequest,
  listen as listenRequests,
  publish as publishEvent,
  respond as respondRequest,
} from "../../../transport/host.js"
import { cardanoV1Contract, type CardanoContext, type CardanoV1Contract } from "./contract.js"

export const scope = cardanoV1Contract.scope
export const version = cardanoV1Contract.version

export const listen = (
  iframe: Window | null | undefined,
  handler: Parameters<typeof listenRequests<CardanoV1Contract>>[2]
) => listenRequests(cardanoV1Contract, iframe, handler)

export const handle = <Method extends AdapterMethodName<CardanoV1Contract>>(
  iframe: Window | null | undefined,
  method: Method,
  handler: (
    request: HostRequest<Method, MethodPayload<CardanoV1Contract, Method>>
  ) =>
    | HostResult<MethodResult<CardanoV1Contract, Method>, CardanoContext>
    | Promise<HostResult<MethodResult<CardanoV1Contract, Method>, CardanoContext>>
) => handleRequest(cardanoV1Contract, iframe, method, handler)

export const respond = <Method extends AdapterMethodName<CardanoV1Contract>>(
  iframe: Window | null | undefined,
  method: Method,
  requestId: string,
  result: MethodResult<CardanoV1Contract, Method>,
  context: CardanoContext
) => respondRequest(cardanoV1Contract, iframe, method, requestId, result, context)

export const publish = <Event extends AdapterEventName<CardanoV1Contract>>(
  iframe: Window | null | undefined,
  event: Event,
  payload: EventPayload<CardanoV1Contract, Event>,
  context: CardanoContext
) => publishEvent(cardanoV1Contract, iframe, event, payload, context)

export type {
  AccountState,
  CardanoContext,
  Explorer,
  SignDataResult,
  SignTxResult,
  SubmitTxResult,
  Tip,
} from "./contract.js"
