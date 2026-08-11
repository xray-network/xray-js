import { z } from "zod"

export const cardanoHostContextSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})

export const bitcoinHostContextSchema = z.object({
  blockchain: z.literal("bitcoin"),
  network: z.enum(["mainnet", "testnet"]),
})

export const midnightHostContextSchema = z.object({
  blockchain: z.literal("midnight"),
  network: z.enum(["mainnet", "testnet"]),
})

/** Authoritative chain and network selected by the embedding XRAY host. */
export const hostContextSchema = z.discriminatedUnion("blockchain", [
  cardanoHostContextSchema,
  bitcoinHostContextSchema,
  midnightHostContextSchema,
])

export type HostContext = z.infer<typeof hostContextSchema>
export type CardanoHostContext = z.infer<typeof cardanoHostContextSchema>
export type HostBlockchain = HostContext["blockchain"]
export type HostNetwork = HostContext["network"]
