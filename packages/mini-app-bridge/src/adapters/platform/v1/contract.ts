import { z } from "zod"
import type { AdapterContract } from "../../types.js"

export const accountTypeSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})
export type AccountType = z.infer<typeof accountTypeSchema>

export const platformContextSchema = accountTypeSchema.nullable()
export type PlatformContext = z.infer<typeof platformContextSchema>

export const platformStatusSchema = z.object({
  host: z.literal("xray.app"),
  account: platformContextSchema,
})
export type PlatformStatus = z.infer<typeof platformStatusSchema>

export const themeSchema = z.enum(["light", "dark"])
export type Theme = z.infer<typeof themeSchema>

export const currencySchema = z.enum(["usd", "eur", "gbp", "jpy", "cny"])
export type Currency = z.infer<typeof currencySchema>

export const hideBalancesSchema = z.boolean()
export const routeSchema = z.string()

export const platformV1Contract = {
  scope: "platform",
  version: "v1",
  methods: {
    getTheme: { request: z.null(), result: themeSchema },
    getCurrency: { request: z.null(), result: currencySchema },
    getHideBalances: { request: z.null(), result: hideBalancesSchema },
    getStatus: { request: z.null(), result: platformStatusSchema },
    routeChanged: { request: routeSchema, result: z.null() },
  },
  events: {
    theme: themeSchema,
    currency: currencySchema,
    hideBalances: hideBalancesSchema,
    status: platformStatusSchema,
    routeChanged: routeSchema,
  },
  context: platformContextSchema,
} as const satisfies AdapterContract

export type PlatformV1Contract = typeof platformV1Contract
