import { z } from "zod"
import type { AdapterContract } from "../../types.js"

export const cardanoContextSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})
export type CardanoContext = z.infer<typeof cardanoContextSchema>

export const tipSchema = z
  .object({
    hash: z.string(),
    epochNo: z.number(),
    absSlot: z.number(),
    epochSlot: z.number(),
    blockNo: z.number(),
    blockTime: z.number(),
  })
  .nullable()
export type Tip = z.infer<typeof tipSchema>

export const utxoAssetSchema = z.object({
  policyId: z.string(),
  assetName: z.string(),
  quantity: z.bigint(),
  decimals: z.number().optional(),
})

export const utxoSchema = z.object({
  transaction: z.object({ id: z.string() }),
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

const accountIdentitySchema = z.object({
  paymentAddress: z.string(),
  stakingAddress: z.string().nullable(),
})

const unavailableAccountStateSchema = (balanceStatus: "initializing" | "error") =>
  accountIdentitySchema.extend({
    balanceStatus: z.literal(balanceStatus),
    state: z.null(),
    delegation: z.null(),
  })

const readyAccountStateSchema = accountIdentitySchema.extend({
  balanceStatus: z.literal("ready"),
  state: z.object({
    utxos: z.array(utxoSchema),
    balance: z.object({ value: z.bigint(), assets: z.array(balanceAssetSchema) }),
  }),
  delegation: z.object({ delegation: z.string().nullable(), rewards: z.bigint() }).nullable(),
})

export const accountStateSchema = z
  .discriminatedUnion("balanceStatus", [
    unavailableAccountStateSchema("initializing"),
    readyAccountStateSchema,
    unavailableAccountStateSchema("error"),
  ])
  .nullable()
export type AccountState = z.infer<typeof accountStateSchema>

export const explorerSchema = z.string().min(1)
export type Explorer = z.infer<typeof explorerSchema>

export const signTxResultSchema = z.discriminatedUnion("success", [
  z
    .object({
      success: z.literal(true),
      hash: z.string().min(1),
      cbor: z.string().min(1),
    })
    .strict(),
  z
    .object({
      success: z.literal(false),
      error: z.string().min(1),
    })
    .strict(),
])
export type SignTxResult = z.infer<typeof signTxResultSchema>

export const submitTxResultSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), hash: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
])
export type SubmitTxResult = z.infer<typeof submitTxResultSchema>

export const signDataResultSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), data: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
])
export type SignDataResult = z.infer<typeof signDataResultSchema>

export const cardanoV1Contract = {
  scope: "cardano",
  version: "v1",
  methods: {
    getTip: { request: z.null(), result: tipSchema },
    getAccountState: { request: z.null(), result: accountStateSchema },
    getExplorer: { request: z.null(), result: explorerSchema },
    signTx: { request: z.string(), result: signTxResultSchema },
    submitTx: { request: z.string(), result: submitTxResultSchema },
    signAndSubmitTx: { request: z.string(), result: submitTxResultSchema },
    signData: { request: z.object({ address: z.string(), data: z.string() }), result: signDataResultSchema },
  },
  events: {
    tip: tipSchema,
    accountState: accountStateSchema,
    explorer: explorerSchema,
  },
  context: cardanoContextSchema,
} as const satisfies AdapterContract

export type CardanoV1Contract = typeof cardanoV1Contract
