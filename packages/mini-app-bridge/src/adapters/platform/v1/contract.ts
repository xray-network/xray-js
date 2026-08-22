import { z } from "zod"
import type { AdapterContract } from "../../types.js"

export const accountTypeSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})
export type AccountType = z.infer<typeof accountTypeSchema>

export const platformContextSchema = accountTypeSchema.nullable()
export type PlatformContext = z.infer<typeof platformContextSchema>

export const platformIdentitySchema = z.object({
  host: z.literal("xray.app"),
})
export type PlatformIdentity = z.infer<typeof platformIdentitySchema>

export type PlatformStatus = PlatformIdentity & { account: PlatformContext }

export const themeSchema = z.enum(["light", "dark"])
export type Theme = z.infer<typeof themeSchema>

export const currencySchema = z.enum(["usd", "eur", "gbp", "jpy", "cny"])
export type Currency = z.infer<typeof currencySchema>

export const localeSchema = z.string().min(1)
export type Locale = z.infer<typeof localeSchema>

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
} as const satisfies AdapterContract

export type PlatformV1Contract = typeof platformV1Contract
