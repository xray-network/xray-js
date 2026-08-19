import { z } from "zod"
import type { AdapterContract } from "../../types.js"

export const cardanoCip30ContextSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})
export type CardanoCip30Context = z.infer<typeof cardanoCip30ContextSchema>

export const extensionSchema = z.object({ cip: z.number() })
export type Cip30Extension = z.infer<typeof extensionSchema>
export const extensionsSchema = z.array(z.record(z.number()))
export const utxosSchema = z.array(z.string()).nullable()
export const collateralSchema = z.array(z.string()).nullable()
export const addressesSchema = z.array(z.string())
export const signDataResultSchema = z.object({ key: z.string(), signature: z.string() })
export const cip30ErrorSchema = z.object({ code: z.number(), info: z.string() })
export type Cip30Error = z.infer<typeof cip30ErrorSchema>

export const paginationSchema = z.object({ page: z.number(), limit: z.number() })
export type Cip30Pagination = z.infer<typeof paginationSchema>

export const cardanoCip30V1Contract = {
  scope: "cardano-cip30",
  version: "v1",
  methods: {
    isEnabled: { request: z.null(), result: z.boolean() },
    enable: { request: z.object({ extensions: z.array(extensionSchema) }), result: z.boolean() },
    getExtensions: { request: z.null(), result: extensionsSchema },
    getNetworkId: { request: z.null(), result: z.number() },
    getUtxos: {
      request: z.object({ amount: z.string().optional(), paginate: paginationSchema.optional() }),
      result: utxosSchema,
    },
    getCollateral: { request: z.object({ amount: z.string() }), result: collateralSchema },
    getBalance: { request: z.null(), result: z.string() },
    getUsedAddresses: { request: z.object({ paginate: paginationSchema.optional() }), result: addressesSchema },
    getUnusedAddresses: { request: z.null(), result: addressesSchema },
    getChangeAddress: { request: z.null(), result: z.string() },
    getRewardAddresses: { request: z.null(), result: addressesSchema },
    signTx: { request: z.object({ tx: z.string(), partialSign: z.boolean().optional() }), result: z.string() },
    signData: { request: z.object({ address: z.string(), data: z.string() }), result: signDataResultSchema },
    submitTx: { request: z.string(), result: z.string() },
  },
  events: {
    enabled: z.boolean(),
    extensions: extensionsSchema,
    networkId: z.number(),
  },
  context: cardanoCip30ContextSchema,
} as const satisfies AdapterContract

export type CardanoCip30V1Contract = typeof cardanoCip30V1Contract
