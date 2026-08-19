import type { AdapterEventName, ClientEvent, EventPayload } from "../../types.js"
import {
  DEFAULT_REQUEST_TIMEOUT,
  listen as listenEvent,
  listenAll as listenAllEvents,
  notify,
  request,
} from "../../../transport/client.js"
import { platformV1Contract, type PlatformContext, type PlatformV1Contract } from "./contract.js"

export const scope = platformV1Contract.scope
export const version = platformV1Contract.version

export const getTheme = (timeout = DEFAULT_REQUEST_TIMEOUT) => request(platformV1Contract, "getTheme", null, timeout)
export const getCurrency = (timeout = DEFAULT_REQUEST_TIMEOUT) =>
  request(platformV1Contract, "getCurrency", null, timeout)
export const getHideBalances = (timeout = DEFAULT_REQUEST_TIMEOUT) =>
  request(platformV1Contract, "getHideBalances", null, timeout)
export const getStatus = (timeout = DEFAULT_REQUEST_TIMEOUT) =>
  request(platformV1Contract, "getStatus", null, timeout).then((response) => response?.payload ?? null)
export const routeChanged = (route: string) => notify(platformV1Contract, "routeChanged", route)

export const listen = <Event extends AdapterEventName<PlatformV1Contract>>(
  event: Event,
  handler: (message: ClientEvent<Event, EventPayload<PlatformV1Contract, Event>, PlatformContext>) => void
) => listenEvent(platformV1Contract, event, handler)

export const listenAll = (handler: Parameters<typeof listenAllEvents<PlatformV1Contract>>[1]) =>
  listenAllEvents(platformV1Contract, handler)

export type { AccountType, Currency, PlatformContext, PlatformStatus, Theme } from "./contract.js"
