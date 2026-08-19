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
import { platformV1Contract, type PlatformContext, type PlatformV1Contract } from "./contract.js"

export const scope = platformV1Contract.scope
export const version = platformV1Contract.version

export const listen = (
  iframe: Window | null | undefined,
  handler: Parameters<typeof listenRequests<PlatformV1Contract>>[2]
) => listenRequests(platformV1Contract, iframe, handler)

export const handle = <Method extends AdapterMethodName<PlatformV1Contract>>(
  iframe: Window | null | undefined,
  method: Method,
  handler: (
    request: HostRequest<Method, MethodPayload<PlatformV1Contract, Method>>
  ) =>
    | HostResult<MethodResult<PlatformV1Contract, Method>, PlatformContext>
    | Promise<HostResult<MethodResult<PlatformV1Contract, Method>, PlatformContext>>
) => handleRequest(platformV1Contract, iframe, method, handler)

export const respond = <Method extends AdapterMethodName<PlatformV1Contract>>(
  iframe: Window | null | undefined,
  method: Method,
  requestId: string,
  result: MethodResult<PlatformV1Contract, Method>,
  context: PlatformContext
) => respondRequest(platformV1Contract, iframe, method, requestId, result, context)

export const publish = <Event extends AdapterEventName<PlatformV1Contract>>(
  iframe: Window | null | undefined,
  event: Event,
  payload: EventPayload<PlatformV1Contract, Event>,
  context: PlatformContext
) => publishEvent(platformV1Contract, iframe, event, payload, context)

export type { AccountType, Currency, PlatformContext, PlatformIdentity, PlatformStatus, Theme } from "./contract.js"
