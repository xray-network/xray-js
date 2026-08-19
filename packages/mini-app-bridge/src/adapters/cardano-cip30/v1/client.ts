import type { AdapterEventName, ClientEvent, EventPayload } from "../../types.js"
import { BridgeError } from "../../../transport/errors.js"
import {
  DEFAULT_INTERACTIVE_TIMEOUT,
  DEFAULT_REQUEST_TIMEOUT,
  listen as listenEvent,
  listenAll as listenAllEvents,
  request,
} from "../../../transport/client.js"
import { createConnector } from "./connector.js"
import {
  cardanoCip30V1Contract,
  cip30ErrorSchema,
  type CardanoCip30Context,
  type CardanoCip30V1Contract,
  type Cip30Extension,
  type Cip30Pagination,
} from "./contract.js"

export const scope = cardanoCip30V1Contract.scope
export const version = cardanoCip30V1Contract.version

const createCip30Error = ({ code, info }: { code: number; info: string }) =>
  Object.assign(new Error(info), { code, info })

const payload = async <Method extends keyof typeof cardanoCip30V1Contract.methods>(
  method: Method,
  value: Parameters<typeof request<typeof cardanoCip30V1Contract, Method>>[2],
  timeout = DEFAULT_INTERACTIVE_TIMEOUT
) => {
  try {
    const response = await request(cardanoCip30V1Contract, method, value, timeout)
    if (!response) throw new Error(`XRAY CIP-30 host did not respond to ${method}`)
    return response.payload
  } catch (error) {
    if (error instanceof BridgeError) {
      const parsed = cip30ErrorSchema.safeParse(error.data)
      if (parsed.success) throw createCip30Error(parsed.data)
    }
    throw error
  }
}

export const isEnabled = () => payload("isEnabled", null, DEFAULT_REQUEST_TIMEOUT)

export const enable = async ({ extensions = [] }: { extensions?: Cip30Extension[] } = {}) => {
  const enabled = await payload("enable", { extensions })
  if (!enabled) throw createCip30Error({ code: -3, info: "XRAY CIP-30 access was refused by the host" })
  return api
}

const getExtensions = () => payload("getExtensions", null)
const getNetworkId = () => payload("getNetworkId", null)
const getUtxos = (amount?: string, paginate?: Cip30Pagination) => payload("getUtxos", { amount, paginate })
const getCollateral = (params: { amount: string }) => payload("getCollateral", params)
const getBalance = () => payload("getBalance", null)
const getUsedAddresses = (paginate?: Cip30Pagination) => payload("getUsedAddresses", { paginate })
const getUnusedAddresses = () => payload("getUnusedAddresses", null)
const getChangeAddress = () => payload("getChangeAddress", null)
const getRewardAddresses = () => payload("getRewardAddresses", null)
const signTx = (tx: string, partialSign = false) => payload("signTx", { tx, partialSign })
const signData = (address: string, data: string) => payload("signData", { address, data })
const submitTx = (tx: string) => payload("submitTx", tx)

const experimental = {}
export const api = {
  experimental,
  getExtensions,
  getNetworkId,
  getUtxos,
  getCollateral,
  getBalance,
  getUsedAddresses,
  getUnusedAddresses,
  getChangeAddress,
  getRewardAddresses,
  signTx,
  signData,
  submitTx,
}

const connectorState = createConnector({ api, isEnabled, enable })
export const connector = connectorState.connector
export const installConnector = connectorState.installConnector
export const apiVersion = connectorState.apiVersion
export const name = connectorState.name
export const icon = connectorState.icon
export const supportedExtensions = connectorState.supportedExtensions

export const listen = <Event extends AdapterEventName<CardanoCip30V1Contract>>(
  event: Event,
  handler: (message: ClientEvent<Event, EventPayload<CardanoCip30V1Contract, Event>, CardanoCip30Context>) => void
) => listenEvent(cardanoCip30V1Contract, event, handler)

export const listenAll = (handler: Parameters<typeof listenAllEvents<CardanoCip30V1Contract>>[1]) =>
  listenAllEvents(cardanoCip30V1Contract, handler)

export type { CardanoCip30Context, Cip30Extension, Cip30Pagination } from "./contract.js"
