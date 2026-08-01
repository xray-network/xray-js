import { z } from "zod"
import type { Envelope } from "./envelope"

// CIP-30 protocol: the wallet-style API surface exposed to mini apps that
// expect a standard Cardano dApp connector. Kept separate from the core
// protocol so hosts can implement either surface independently.

export const cip30HostHandshakeSchema = z.boolean()
export type Cip30HostHandshakePayload = z.infer<typeof cip30HostHandshakeSchema>

export const cip30HostExtensionsSchema = z.array(z.record(z.number()))
export type Cip30HostExtensionsPayload = z.infer<typeof cip30HostExtensionsSchema>

export const cip30HostNetworkIdSchema = z.number()
export type Cip30HostNetworkIdPayload = z.infer<typeof cip30HostNetworkIdSchema>

export const cip30HostUtxosSchema = z.array(z.string()).nullable()
export type Cip30HostUtxosPayload = z.infer<typeof cip30HostUtxosSchema>

export const cip30HostCollateralSchema = z.array(z.string()).nullable()
export type Cip30HostCollateralPayload = z.infer<typeof cip30HostCollateralSchema>

export const cip30HostBalanceSchema = z.string()
export type Cip30HostBalancePayload = z.infer<typeof cip30HostBalanceSchema>

export const cip30HostUsedAddressesSchema = z.array(z.string())
export type Cip30HostUsedAddressesPayload = z.infer<typeof cip30HostUsedAddressesSchema>

export const cip30HostUnusedAddressesSchema = z.array(z.string())
export type Cip30HostUnusedAddressesPayload = z.infer<typeof cip30HostUnusedAddressesSchema>

export const cip30HostChangeAddressSchema = z.string()
export type Cip30HostChangeAddressPayload = z.infer<typeof cip30HostChangeAddressSchema>

export const cip30HostRewardAddressesSchema = z.array(z.string())
export type Cip30HostRewardAddressesPayload = z.infer<typeof cip30HostRewardAddressesSchema>

export const cip30HostSignTxSchema = z.string()
export type Cip30HostSignTxPayload = z.infer<typeof cip30HostSignTxSchema>

export const cip30HostSignDataSchema = z.object({
  key: z.string(),
  signature: z.string(),
})
export type Cip30HostSignDataPayload = z.infer<typeof cip30HostSignDataSchema>

export const cip30HostSubmitTxSchema = z.string()
export type Cip30HostSubmitTxPayload = z.infer<typeof cip30HostSubmitTxSchema>

// Host -> client routing map
export const cip30HostMessageSchemas = {
  "xray.cip30.host.handshake": cip30HostHandshakeSchema,
  "xray.cip30.host.extensions": cip30HostExtensionsSchema,
  "xray.cip30.host.networkId": cip30HostNetworkIdSchema,
  "xray.cip30.host.utxos": cip30HostUtxosSchema,
  "xray.cip30.host.collateral": cip30HostCollateralSchema,
  "xray.cip30.host.balance": cip30HostBalanceSchema,
  "xray.cip30.host.usedAddresses": cip30HostUsedAddressesSchema,
  "xray.cip30.host.unusedAddresses": cip30HostUnusedAddressesSchema,
  "xray.cip30.host.changeAddress": cip30HostChangeAddressSchema,
  "xray.cip30.host.rewardAddresses": cip30HostRewardAddressesSchema,
  "xray.cip30.host.signTx": cip30HostSignTxSchema,
  "xray.cip30.host.signData": cip30HostSignDataSchema,
  "xray.cip30.host.submitTx": cip30HostSubmitTxSchema,
} as const

export type Cip30HostMessagePayloadMap = {
  [K in keyof typeof cip30HostMessageSchemas]: z.infer<(typeof cip30HostMessageSchemas)[K]>
}

export type Cip30HostMessageType = keyof Cip30HostMessagePayloadMap

export type Cip30HostMessage = {
  [K in Cip30HostMessageType]: Envelope<K, Cip30HostMessagePayloadMap[K]>
}[Cip30HostMessageType]

export const cip30PaginateSchema = z.object({
  page: z.number(),
  limit: z.number(),
})
export type Cip30Paginate = z.infer<typeof cip30PaginateSchema>

export const cip30ClientUtxosSchema = z.object({
  amount: z.string().optional(),
  paginate: cip30PaginateSchema.optional(),
})
export type Cip30ClientUtxosPayload = z.infer<typeof cip30ClientUtxosSchema>

export const cip30ClientUsedAddressesSchema = z.object({
  paginate: cip30PaginateSchema.optional(),
})
export type Cip30ClientUsedAddressesPayload = z.infer<typeof cip30ClientUsedAddressesSchema>

export const cip30ClientSignTxSchema = z.object({
  tx: z.string(),
  partialSign: z.boolean().optional(),
})
export type Cip30ClientSignTxPayload = z.infer<typeof cip30ClientSignTxSchema>

export const cip30ClientSignDataSchema = z.object({
  address: z.string(),
  data: z.string(),
})
export type Cip30ClientSignDataPayload = z.infer<typeof cip30ClientSignDataSchema>

export const cip30ClientSubmitTxSchema = z.string()
export type Cip30ClientSubmitTxPayload = z.infer<typeof cip30ClientSubmitTxSchema>

// Client -> host routing map
export const cip30ClientMessageSchemas = {
  "xray.cip30.client.handshake": z.null(),
  "xray.cip30.client.getExtensions": z.null(),
  "xray.cip30.client.getNetworkId": z.null(),
  "xray.cip30.client.getUtxos": cip30ClientUtxosSchema,
  "xray.cip30.client.getCollateral": z.null(),
  "xray.cip30.client.getBalance": z.null(),
  "xray.cip30.client.getUsedAddresses": cip30ClientUsedAddressesSchema,
  "xray.cip30.client.getUnusedAddresses": z.null(),
  "xray.cip30.client.getChangeAddress": z.null(),
  "xray.cip30.client.getRewardAddresses": z.null(),
  "xray.cip30.client.signTx": cip30ClientSignTxSchema,
  "xray.cip30.client.signData": cip30ClientSignDataSchema,
  "xray.cip30.client.submitTx": cip30ClientSubmitTxSchema,
} as const

export type Cip30ClientMessagePayloadMap = {
  [K in keyof typeof cip30ClientMessageSchemas]: z.infer<(typeof cip30ClientMessageSchemas)[K]>
}

export type Cip30ClientMessageType = keyof Cip30ClientMessagePayloadMap

export type Cip30ClientMessage = {
  [K in Cip30ClientMessageType]: Envelope<K, Cip30ClientMessagePayloadMap[K]>
}[Cip30ClientMessageType]
