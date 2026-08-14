import { z } from "zod"
import { hostContextSchema } from "../transport/context.js"
import type { MessageFromSchemas } from "../transport/envelope.js"

export const BRIDGE_PROTOCOL_VERSION = 1 as const

/** Selected XRAY account context, or null when the host has no selected account. */
export const platformHostContextSchema = hostContextSchema.nullable()
export type PlatformHostContext = z.infer<typeof platformHostContextSchema>

export const platformHostHandshakeSchema = z.object({
  protocolVersion: z.literal(BRIDGE_PROTOCOL_VERSION),
  protocols: z.array(z.string()),
})
export type PlatformHostHandshakePayload = z.infer<typeof platformHostHandshakeSchema>

export const platformHostThemeSchema = z.enum(["light", "dark"])
export type PlatformHostThemePayload = z.infer<typeof platformHostThemeSchema>

export const platformHostCurrencySchema = z.enum(["usd", "eur", "gbp", "jpy", "cny"])
export type PlatformHostCurrencyPayload = z.infer<typeof platformHostCurrencySchema>

export const platformHostHideBalancesSchema = z.boolean()
export type PlatformHostHideBalancesPayload = z.infer<typeof platformHostHideBalancesSchema>

export const platformHostRouteChangedSchema = z.string()
export type PlatformHostRouteChangedPayload = z.infer<typeof platformHostRouteChangedSchema>

export const platformHostMessageSchemas = {
  "xray.host.handshake": platformHostHandshakeSchema,
  "xray.host.theme": platformHostThemeSchema,
  "xray.host.currency": platformHostCurrencySchema,
  "xray.host.hideBalances": platformHostHideBalancesSchema,
  "xray.host.routeChanged": platformHostRouteChangedSchema,
} as const

export type PlatformHostMessagePayloadMap = {
  [K in keyof typeof platformHostMessageSchemas]: z.infer<(typeof platformHostMessageSchemas)[K]>
}
export type PlatformHostMessage = MessageFromSchemas<typeof platformHostMessageSchemas, PlatformHostContext>

export const platformClientRouteChangedSchema = z.string()
export type PlatformClientRouteChangedPayload = z.infer<typeof platformClientRouteChangedSchema>

export const platformClientMessageSchemas = {
  "xray.client.handshake": z.null(),
  "xray.client.getTheme": z.null(),
  "xray.client.getCurrency": z.null(),
  "xray.client.getHideBalances": z.null(),
  "xray.client.routeChanged": platformClientRouteChangedSchema,
} as const

export type PlatformClientMessagePayloadMap = {
  [K in keyof typeof platformClientMessageSchemas]: z.infer<(typeof platformClientMessageSchemas)[K]>
}
export type PlatformClientMessage = MessageFromSchemas<typeof platformClientMessageSchemas>
