import { z } from "zod"
import type { CardanoHostContext } from "../transport/context.js"
import type { MessageFromSchemas } from "../transport/envelope.js"

export const CARDANO_NATIVE_PROTOCOL = "cardano.native" as const

export const cardanoHostTipSchema = z
  .object({
    hash: z.string(),
    epochNo: z.number(),
    absSlot: z.number(),
    epochSlot: z.number(),
    blockNo: z.number(),
    blockTime: z.number(),
  })
  .nullable()
export type CardanoHostTipPayload = z.infer<typeof cardanoHostTipSchema>

export const cardanoUtxoAssetSchema = z.object({
  policyId: z.string(),
  assetName: z.string(),
  quantity: z.bigint(),
  decimals: z.number().optional(),
})

export const cardanoUtxoSchema = z.object({
  transaction: z.object({ id: z.string() }),
  index: z.number(),
  address: z.string(),
  value: z.bigint(),
  assets: z.array(cardanoUtxoAssetSchema),
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

export const cardanoBalanceAssetSchema = cardanoUtxoAssetSchema.extend({
  fingerprint: z.string(),
  assetNameAscii: z.string(),
})

export const cardanoHostAccountStateSchema = z
  .object({
    paymentAddress: z.string(),
    stakingAddress: z.string().nullable(),
    state: z
      .object({
        utxos: z.array(cardanoUtxoSchema),
        balance: z.object({
          value: z.bigint(),
          assets: z.array(cardanoBalanceAssetSchema),
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
export type CardanoHostAccountStatePayload = z.infer<typeof cardanoHostAccountStateSchema>

export const cardanoHostExplorerSchema = z.enum(["cardanoscan", "cexplorer", "adastat", "xray"])
export type CardanoHostExplorerPayload = z.infer<typeof cardanoHostExplorerSchema>

export const cardanoHostSignTxSchema = z.object({ success: z.boolean(), hash: z.string() })
export type CardanoHostSignTxPayload = z.infer<typeof cardanoHostSignTxSchema>

export const cardanoHostSubmitTxSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), hash: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
])
export type CardanoHostSubmitTxPayload = z.infer<typeof cardanoHostSubmitTxSchema>

export const cardanoHostSignAndSubmitTxSchema = cardanoHostSubmitTxSchema
export type CardanoHostSignAndSubmitTxPayload = z.infer<typeof cardanoHostSignAndSubmitTxSchema>

export const cardanoHostSignDataSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), data: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
])
export type CardanoHostSignDataPayload = z.infer<typeof cardanoHostSignDataSchema>

export const cardanoHostMessageSchemas = {
  "xray.cardano.host.tip": cardanoHostTipSchema,
  "xray.cardano.host.accountState": cardanoHostAccountStateSchema,
  "xray.cardano.host.explorer": cardanoHostExplorerSchema,
  "xray.cardano.host.signTx": cardanoHostSignTxSchema,
  "xray.cardano.host.submitTx": cardanoHostSubmitTxSchema,
  "xray.cardano.host.signAndSubmitTx": cardanoHostSignAndSubmitTxSchema,
  "xray.cardano.host.signData": cardanoHostSignDataSchema,
} as const

export type CardanoHostMessagePayloadMap = {
  [K in keyof typeof cardanoHostMessageSchemas]: z.infer<(typeof cardanoHostMessageSchemas)[K]>
}
export type CardanoHostMessage = MessageFromSchemas<typeof cardanoHostMessageSchemas, CardanoHostContext>

export const cardanoClientSignTxSchema = z.string()
export type CardanoClientSignTxPayload = z.infer<typeof cardanoClientSignTxSchema>
export const cardanoClientSubmitTxSchema = z.string()
export type CardanoClientSubmitTxPayload = z.infer<typeof cardanoClientSubmitTxSchema>
export const cardanoClientSignAndSubmitTxSchema = z.string()
export type CardanoClientSignAndSubmitTxPayload = z.infer<typeof cardanoClientSignAndSubmitTxSchema>
export const cardanoClientSignDataSchema = z.object({ address: z.string(), data: z.string() })
export type CardanoClientSignDataPayload = z.infer<typeof cardanoClientSignDataSchema>

export const cardanoClientMessageSchemas = {
  "xray.cardano.client.getTip": z.null(),
  "xray.cardano.client.getAccountState": z.null(),
  "xray.cardano.client.getExplorer": z.null(),
  "xray.cardano.client.signTx": cardanoClientSignTxSchema,
  "xray.cardano.client.submitTx": cardanoClientSubmitTxSchema,
  "xray.cardano.client.signAndSubmitTx": cardanoClientSignAndSubmitTxSchema,
  "xray.cardano.client.signData": cardanoClientSignDataSchema,
} as const

export type CardanoClientMessagePayloadMap = {
  [K in keyof typeof cardanoClientMessageSchemas]: z.infer<(typeof cardanoClientMessageSchemas)[K]>
}
export type CardanoClientMessage = MessageFromSchemas<typeof cardanoClientMessageSchemas>
