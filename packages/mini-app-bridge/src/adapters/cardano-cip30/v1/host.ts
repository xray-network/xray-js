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
import { cardanoCip30V1Contract, type CardanoCip30Context, type CardanoCip30V1Contract } from "./contract.js"

export const scope = cardanoCip30V1Contract.scope
export const version = cardanoCip30V1Contract.version

export const listen = (
  iframe: Window | null | undefined,
  handler: Parameters<typeof listenRequests<CardanoCip30V1Contract>>[2]
) => listenRequests(cardanoCip30V1Contract, iframe, handler)

export const handle = <Method extends AdapterMethodName<CardanoCip30V1Contract>>(
  iframe: Window | null | undefined,
  method: Method,
  handler: (
    request: HostRequest<Method, MethodPayload<CardanoCip30V1Contract, Method>>
  ) =>
    | HostResult<MethodResult<CardanoCip30V1Contract, Method>, CardanoCip30Context>
    | Promise<HostResult<MethodResult<CardanoCip30V1Contract, Method>, CardanoCip30Context>>
) => handleRequest(cardanoCip30V1Contract, iframe, method, handler)

export const respond = <Method extends AdapterMethodName<CardanoCip30V1Contract>>(
  iframe: Window | null | undefined,
  method: Method,
  requestId: string,
  result: MethodResult<CardanoCip30V1Contract, Method>,
  context: CardanoCip30Context
) => respondRequest(cardanoCip30V1Contract, iframe, method, requestId, result, context)

export const publish = <Event extends AdapterEventName<CardanoCip30V1Contract>>(
  iframe: Window | null | undefined,
  event: Event,
  payload: EventPayload<CardanoCip30V1Contract, Event>,
  context: CardanoCip30Context
) => publishEvent(cardanoCip30V1Contract, iframe, event, payload, context)

export type { CardanoCip30Context, Cip30Error, Cip30Extension, Cip30Pagination } from "./contract.js"
