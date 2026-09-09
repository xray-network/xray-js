import { z } from "zod"
import type { Contract, Request, Response, Event, MethodName, EventName } from "../types.js"
import { bindHost } from "../host.js"
import {
  DEFAULT_REQUEST_TIMEOUT,
  listen as listenEvent,
  listenAll as listenAllEvents,
  notify,
  request,
} from "../client.js"

export const accountTypeSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})

export const platformContextSchema = accountTypeSchema.nullable()

export const platformIdentitySchema = z.object({
  host: z.literal("xray.app"),
})

export const themeSchema = z.enum(["light", "dark"])

export const currencySchema = z.enum(["usd", "eur", "gbp", "jpy", "cny"])

export const localeSchema = z.string().min(1)

export const hideBalancesSchema = z.boolean()
export const routeSchema = z.string()

export const platformV1Contract = {
  scope: "platform",
  version: "v1",
  methods: {
    getTheme: { request: z.null(), result: themeSchema },
    getCurrency: { request: z.null(), result: currencySchema },
    getLocale: { request: z.null(), result: localeSchema },
    getHideBalances: { request: z.null(), result: hideBalancesSchema },
    getStatus: { request: z.null(), result: platformIdentitySchema },
    routeChanged: { request: routeSchema, result: z.null() },
  },
  events: {
    theme: themeSchema,
    currency: currencySchema,
    hideBalances: hideBalancesSchema,
    status: platformIdentitySchema,
    routeChanged: routeSchema,
  },
  context: platformContextSchema,
} as const satisfies Contract

export type AccountType = z.infer<typeof accountTypeSchema>
export type PlatformContext = z.infer<typeof platformContextSchema>
export type PlatformIdentity = z.infer<typeof platformIdentitySchema>
export type PlatformStatus = PlatformIdentity & { account: PlatformContext }
export type Theme = z.infer<typeof themeSchema>
export type Currency = z.infer<typeof currencySchema>
export type Locale = z.infer<typeof localeSchema>
export type PlatformV1Contract = typeof platformV1Contract
export type PlatformRequest<M extends MethodName<PlatformV1Contract> = MethodName<PlatformV1Contract>> = Request<
  PlatformV1Contract,
  M
>
export type PlatformResponse<M extends MethodName<PlatformV1Contract> = MethodName<PlatformV1Contract>> = Response<
  PlatformV1Contract,
  M
>
export type PlatformEvent<E extends EventName<PlatformV1Contract> = EventName<PlatformV1Contract>> = Event<
  PlatformV1Contract,
  E
>

export const client = {
  scope: platformV1Contract.scope,
  version: platformV1Contract.version,
  getTheme: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<PlatformResponse<"getTheme">> =>
    request(platformV1Contract, "getTheme", null, timeout),
  getCurrency: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<PlatformResponse<"getCurrency">> =>
    request(platformV1Contract, "getCurrency", null, timeout),
  getLocale: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<PlatformResponse<"getLocale">> =>
    request(platformV1Contract, "getLocale", null, timeout),
  getHideBalances: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<PlatformResponse<"getHideBalances">> =>
    request(platformV1Contract, "getHideBalances", null, timeout),
  getStatus: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<PlatformResponse<"getStatus">> =>
    request(platformV1Contract, "getStatus", null, timeout),
  routeChanged: (route: string) => notify(platformV1Contract, "routeChanged", route),
  listen: <E extends EventName<PlatformV1Contract>>(
    event: E,
    handler: (message: Event<PlatformV1Contract, E>) => void
  ) => listenEvent(platformV1Contract, event, handler),
  listenAll: (handler: Parameters<typeof listenAllEvents<PlatformV1Contract>>[1]) =>
    listenAllEvents(platformV1Contract, handler),
} as const

export const host: ReturnType<typeof bindHost<PlatformV1Contract>> = bindHost(platformV1Contract)
