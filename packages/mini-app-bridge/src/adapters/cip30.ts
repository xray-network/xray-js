import { z } from "zod"
import type {
  Contract,
  Request,
  Response,
  Event,
  MethodName,
  EventName,
  MethodResult,
  MethodPayload,
} from "../types.js"
import { bindHost } from "../host.js"
import {
  DEFAULT_INTERACTIVE_TIMEOUT,
  DEFAULT_REQUEST_TIMEOUT,
  listen as listenEvent,
  listenAll as listenAllEvents,
  request,
} from "../client.js"
import { BridgeError } from "../messages.js"

export const cardanoCip30ContextSchema = z.object({
  blockchain: z.literal("cardano"),
  network: z.enum(["mainnet", "preprod", "preview"]),
})

export const extensionSchema = z.object({ cip: z.number() })
export const extensionsSchema = z.array(z.record(z.number()))
export const utxosSchema = z.array(z.string()).nullable()
export const collateralSchema = z.array(z.string()).nullable()
export const addressesSchema = z.array(z.string())
export const signDataResultSchema = z.object({ key: z.string(), signature: z.string() })
export const cip30ErrorSchema = z.object({ code: z.number(), info: z.string() })

export const paginationSchema = z.object({ page: z.number(), limit: z.number() })

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
} as const satisfies Contract

export type CardanoCip30Context = z.infer<typeof cardanoCip30ContextSchema>
export type Cip30Extension = z.infer<typeof extensionSchema>
export type Cip30Error = z.infer<typeof cip30ErrorSchema>
export type Cip30Pagination = z.infer<typeof paginationSchema>
export type CardanoCip30V1Contract = typeof cardanoCip30V1Contract
export type Cip30Request<M extends MethodName<CardanoCip30V1Contract> = MethodName<CardanoCip30V1Contract>> = Request<
  CardanoCip30V1Contract,
  M
>
export type Cip30Response<M extends MethodName<CardanoCip30V1Contract> = MethodName<CardanoCip30V1Contract>> = Response<
  CardanoCip30V1Contract,
  M
>
export type Cip30Event<E extends EventName<CardanoCip30V1Contract> = EventName<CardanoCip30V1Contract>> = Event<
  CardanoCip30V1Contract,
  E
>

const scope = cardanoCip30V1Contract.scope
const version = cardanoCip30V1Contract.version

const createCip30Error = ({ code, info }: { code: number; info: string }) =>
  Object.assign(new Error(info), { code, info })

const payload = async <Method extends keyof typeof cardanoCip30V1Contract.methods>(
  method: Method,
  value: MethodPayload<CardanoCip30V1Contract, Method>,
  timeout = DEFAULT_INTERACTIVE_TIMEOUT
): Promise<MethodResult<CardanoCip30V1Contract, Method>> => {
  const response = await request(cardanoCip30V1Contract, method, value, timeout)
  if (response.ok) return response.payload
  const parsed = cip30ErrorSchema.safeParse(response.error.data)
  if (parsed.success) throw createCip30Error(parsed.data)
  throw new BridgeError(response.error.code, response.error.message, response.error.data)
}

const isEnabled = () => payload("isEnabled", null, DEFAULT_REQUEST_TIMEOUT)

const enable = async ({ extensions = [] }: { extensions?: Cip30Extension[] } = {}) => {
  const enabled = await payload("enable", { extensions })
  if (!enabled) throw createCip30Error({ code: -3, info: "XRAY CIP-30 access was refused by the host" })
  return api
}

const api = {
  experimental: {},
  getExtensions: () => payload("getExtensions", null),
  getNetworkId: () => payload("getNetworkId", null),
  getUtxos: (amount?: string, paginate?: Cip30Pagination) => payload("getUtxos", { amount, paginate }),
  getCollateral: (params: { amount: string }) => payload("getCollateral", params),
  getBalance: () => payload("getBalance", null),
  getUsedAddresses: (paginate?: Cip30Pagination) => payload("getUsedAddresses", { paginate }),
  getUnusedAddresses: () => payload("getUnusedAddresses", null),
  getChangeAddress: () => payload("getChangeAddress", null),
  getRewardAddresses: () => payload("getRewardAddresses", null),
  signTx: (tx: string, partialSign = false) => payload("signTx", { tx, partialSign }),
  signData: (address: string, data: string) => payload("signData", { address, data }),
  submitTx: (tx: string) => payload("submitTx", tx),
}

const apiVersion = "1"
const name = "XRAY"
const icon = ""
const supportedExtensions: Cip30Extension[] = []
const connector = { apiVersion, name, icon, supportedExtensions, experimental: {}, isEnabled, enable }
const installConnector = (key = "xrayBridge") => {
  if (typeof window === "undefined") return connector
  const target = window as Window & { cardano?: Record<string, unknown> }
  target.cardano ??= {}
  target.cardano[key] = connector
  return connector
}

const listen = <E extends EventName<CardanoCip30V1Contract>>(
  event: E,
  handler: (message: Event<CardanoCip30V1Contract, E>) => void
) => listenEvent(cardanoCip30V1Contract, event, handler)

const listenAll = (handler: Parameters<typeof listenAllEvents<CardanoCip30V1Contract>>[1]) =>
  listenAllEvents(cardanoCip30V1Contract, handler)

export const client = {
  scope,
  version,
  isEnabled,
  enable,
  api,
  connector,
  installConnector,
  apiVersion,
  name,
  icon,
  supportedExtensions,
  listen,
  listenAll,
} as const

export const host: ReturnType<typeof bindHost<CardanoCip30V1Contract>> = bindHost(cardanoCip30V1Contract)
