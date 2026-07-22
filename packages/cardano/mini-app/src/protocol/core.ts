import { z } from "zod"
import type { Envelope } from "./envelope"

// Core protocol: zod schemas are the source of truth, payload types are
// inferred from them so runtime validation and typings can never drift apart.

export const hostHandshakeSchema = z.boolean()
export type HostHandshakePayload = z.infer<typeof hostHandshakeSchema>

export const hostTipSchema = z
  .object({
    hash: z.string(),
    epochNo: z.number(),
    absSlot: z.number(),
    epochSlot: z.number(),
    blockNo: z.number(),
    blockTime: z.number(),
  })
  .nullable()
export type HostTipPayload = z.infer<typeof hostTipSchema>

export const utxoAssetSchema = z.object({
  policyId: z.string(),
  assetName: z.string(),
  quantity: z.bigint(),
  decimals: z.number().optional(),
})

export const utxoSchema = z.object({
  transaction: z.object({
    id: z.string(),
  }),
  index: z.number(),
  address: z.string(),
  value: z.bigint(),
  assets: z.array(utxoAssetSchema),
  datumHash: z.string().nullable(),
  datumType: z.enum(["inline", "hash"]).nullable(),
  scriptHash: z.string().nullable(),
  datum: z.string().nullable().optional(),
  script: z
    .object({
      language: z.enum(["PlutusV1", "PlutusV2", "PlutusV3", "Native"]),
      script: z.string(),
    })
    .nullable()
    .optional(),
})

export const balanceAssetSchema = utxoAssetSchema.extend({
  fingerprint: z.string(),
  assetNameAscii: z.string(),
})

export const hostAccountStateSchema = z
  .object({
    paymentAddress: z.string(),
    stakingAddress: z.string().nullable(),
    state: z
      .object({
        utxos: z.array(utxoSchema),
        balance: z.object({
          value: z.bigint(),
          assets: z.array(balanceAssetSchema),
        }),
      })
      .nullable(),
    delegation: z
      .object({
        delegation: z.string().nullable(),
        rewards: z.bigint(),
      })
      .nullable(),
  })
  .nullable()
export type HostAccountStatePayload = z.infer<typeof hostAccountStateSchema>

export const hostNetworkSchema = z.enum(["mainnet", "preprod", "preview"])
export type HostNetworkPayload = z.infer<typeof hostNetworkSchema>

export const hostThemeSchema = z.enum(["light", "dark"])
export type HostThemePayload = z.infer<typeof hostThemeSchema>

export const hostCurrencySchema = z.enum(["usd", "eur", "gbp", "jpy", "cny"])
export type HostCurrencyPayload = z.infer<typeof hostCurrencySchema>

export const hostHideBalancesSchema = z.boolean()
export type HostHideBalancesPayload = z.infer<typeof hostHideBalancesSchema>

export const hostExplorerSchema = z.enum(["cardanoscan", "cexplorer", "adastat", "xray"])
export type HostExplorerPayload = z.infer<typeof hostExplorerSchema>

export const hostRouteChangedSchema = z.string()
export type HostRouteChangedPayload = z.infer<typeof hostRouteChangedSchema>

export const hostSignTxSchema = z.object({
  success: z.boolean(),
  hash: z.string(),
})
export type HostSignTxPayload = z.infer<typeof hostSignTxSchema>

export const hostSubmitTxSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), hash: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
])
export type HostSubmitTxPayload = z.infer<typeof hostSubmitTxSchema>

export const hostSignAndSubmitTxSchema = hostSubmitTxSchema
export type HostSignAndSubmitTxPayload = z.infer<typeof hostSignAndSubmitTxSchema>

export const hostSignDataSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), data: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
])
export type HostSignDataPayload = z.infer<typeof hostSignDataSchema>

// Host -> client routing map
export const hostMessageSchemas = {
  "xray.host.handshake": hostHandshakeSchema,
  "xray.host.tip": hostTipSchema,
  "xray.host.accountState": hostAccountStateSchema,
  "xray.host.network": hostNetworkSchema,
  "xray.host.theme": hostThemeSchema,
  "xray.host.currency": hostCurrencySchema,
  "xray.host.hideBalances": hostHideBalancesSchema,
  "xray.host.explorer": hostExplorerSchema,
  "xray.host.routeChanged": hostRouteChangedSchema,
  "xray.host.signTx": hostSignTxSchema,
  "xray.host.submitTx": hostSubmitTxSchema,
  "xray.host.signAndSubmitTx": hostSignAndSubmitTxSchema,
  "xray.host.signData": hostSignDataSchema,
} as const

export type HostMessagePayloadMap = {
  [K in keyof typeof hostMessageSchemas]: z.infer<(typeof hostMessageSchemas)[K]>
}

export type HostMessageType = keyof HostMessagePayloadMap

export type HostMessage = {
  [K in HostMessageType]: Envelope<K, HostMessagePayloadMap[K]>
}[HostMessageType]

export const clientRouteChangedSchema = z.string()
export type ClientRouteChangedPayload = z.infer<typeof clientRouteChangedSchema>

export const clientSignTxSchema = z.string()
export type ClientSignTxPayload = z.infer<typeof clientSignTxSchema>

export const clientSubmitTxSchema = z.string()
export type ClientSubmitTxPayload = z.infer<typeof clientSubmitTxSchema>

export const clientSignAndSubmitTxSchema = z.string()
export type ClientSignAndSubmitTxPayload = z.infer<typeof clientSignAndSubmitTxSchema>

export const clientSignDataSchema = z.object({
  address: z.string(),
  data: z.string(),
})
export type ClientSignDataPayload = z.infer<typeof clientSignDataSchema>

// Client -> host routing map
export const clientMessageSchemas = {
  "xray.client.handshake": z.null(),
  "xray.client.getTip": z.null(),
  "xray.client.getNetwork": z.null(),
  "xray.client.getAccountState": z.null(),
  "xray.client.getTheme": z.null(),
  "xray.client.getCurrency": z.null(),
  "xray.client.getHideBalances": z.null(),
  "xray.client.getExplorer": z.null(),
  "xray.client.routeChanged": clientRouteChangedSchema,
  "xray.client.signTx": clientSignTxSchema,
  "xray.client.submitTx": clientSubmitTxSchema,
  "xray.client.signAndSubmitTx": clientSignAndSubmitTxSchema,
  "xray.client.signData": clientSignDataSchema,
} as const

export type ClientMessagePayloadMap = {
  [K in keyof typeof clientMessageSchemas]: z.infer<(typeof clientMessageSchemas)[K]>
}

export type ClientMessageType = keyof ClientMessagePayloadMap

export type ClientMessage = {
  [K in ClientMessageType]: Envelope<K, ClientMessagePayloadMap[K]>
}[ClientMessageType]
