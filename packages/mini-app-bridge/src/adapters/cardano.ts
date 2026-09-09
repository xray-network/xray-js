import { z } from "zod"
import type { Contract, Request, Response, Event, MethodName, EventName } from "../types.js"
import { bindHost } from "../host.js"
import {
  DEFAULT_INTERACTIVE_TIMEOUT,
  DEFAULT_REQUEST_TIMEOUT,
  listen as listenEvent,
  listenAll as listenAllEvents,
  request,
} from "../client.js"

export const cardanoContextSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})

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

export const explorerSchema = z.string().min(1)

export const signTxResultSchema = z
  .object({ hash: z.string().min(1), cbor: z.string().min(1), witnessSet: z.string().min(1) })
  .strict()

export const submitTxResultSchema = z.object({ hash: z.string().min(1) }).strict()

export const signDataResultSchema = z.object({ data: z.string().min(1) }).strict()

export const cardanoV1Contract = {
  scope: "cardano",
  version: "v1",
  methods: {
    getTip: { request: z.null(), result: tipSchema },
    getAccountState: { request: z.null(), result: accountStateSchema },
    getExplorer: { request: z.null(), result: explorerSchema },
    signTx: { request: z.string(), result: signTxResultSchema },
    submitTx: { request: z.string(), result: submitTxResultSchema },
    signData: { request: z.object({ address: z.string(), data: z.string() }), result: signDataResultSchema },
  },
  events: {
    tip: tipSchema,
    accountState: accountStateSchema,
    explorer: explorerSchema,
  },
  context: cardanoContextSchema,
} as const satisfies Contract

export type CardanoContext = z.infer<typeof cardanoContextSchema>
export type Tip = z.infer<typeof tipSchema>
export type AccountState = z.infer<typeof accountStateSchema>
export type Explorer = z.infer<typeof explorerSchema>
export type SignTxResult = z.infer<typeof signTxResultSchema>
export type SubmitTxResult = z.infer<typeof submitTxResultSchema>
export type SignDataResult = z.infer<typeof signDataResultSchema>
export type CardanoV1Contract = typeof cardanoV1Contract
export type CardanoRequest<M extends MethodName<CardanoV1Contract> = MethodName<CardanoV1Contract>> = Request<
  CardanoV1Contract,
  M
>
export type CardanoResponse<M extends MethodName<CardanoV1Contract> = MethodName<CardanoV1Contract>> = Response<
  CardanoV1Contract,
  M
>
export type CardanoEvent<E extends EventName<CardanoV1Contract> = EventName<CardanoV1Contract>> = Event<
  CardanoV1Contract,
  E
>

export const client = {
  scope: cardanoV1Contract.scope,
  version: cardanoV1Contract.version,
  getTip: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<CardanoResponse<"getTip">> =>
    request(cardanoV1Contract, "getTip", null, timeout),
  getAccountState: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<CardanoResponse<"getAccountState">> =>
    request(cardanoV1Contract, "getAccountState", null, timeout),
  getExplorer: (timeout = DEFAULT_REQUEST_TIMEOUT): Promise<CardanoResponse<"getExplorer">> =>
    request(cardanoV1Contract, "getExplorer", null, timeout),
  signTx: (tx: string, timeout = DEFAULT_INTERACTIVE_TIMEOUT): Promise<CardanoResponse<"signTx">> =>
    request(cardanoV1Contract, "signTx", tx, timeout),
  submitTx: (tx: string, timeout = DEFAULT_INTERACTIVE_TIMEOUT): Promise<CardanoResponse<"submitTx">> =>
    request(cardanoV1Contract, "submitTx", tx, timeout),
  signData: (
    address: string,
    data: string,
    timeout = DEFAULT_INTERACTIVE_TIMEOUT
  ): Promise<CardanoResponse<"signData">> => request(cardanoV1Contract, "signData", { address, data }, timeout),
  listen: <E extends EventName<CardanoV1Contract>>(event: E, handler: (message: Event<CardanoV1Contract, E>) => void) =>
    listenEvent(cardanoV1Contract, event, handler),
  listenAll: (handler: Parameters<typeof listenAllEvents<CardanoV1Contract>>[1]) =>
    listenAllEvents(cardanoV1Contract, handler),
} as const

export const host: ReturnType<typeof bindHost<CardanoV1Contract>> = bindHost(cardanoV1Contract)
