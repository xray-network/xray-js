import { DEFAULT_INTERACTIVE_TIMEOUT, DEFAULT_REQUEST_TIMEOUT } from "../../transport/constants.js"
import { requestHost } from "../../transport/client.js"
import { cardanoHostContextSchema } from "../../transport/context.js"
import {
  cip30ClientMessageSchemas,
  cip30HostMessageSchemas,
  type Cip30ClientSignDataPayload,
  type Cip30ClientCollateralPayload,
  type Cip30ClientMessagePayloadMap,
  type Cip30ClientSignTxPayload,
  type Cip30ClientSubmitTxPayload,
  type Cip30ClientUsedAddressesPayload,
  type Cip30ClientUtxosPayload,
  type Cip30Extension,
} from "./protocol.js"

export const apiVersion = "1"
export const name = "XRAY"
export const icon = ""
export const supportedExtensions: Cip30Extension[] = []

const createCip30Error = ({ code, info }: { code: number; info: string }) =>
  Object.assign(new Error(info), { code, info })

const request = async <
  RequestType extends keyof typeof cip30ClientMessageSchemas,
  ResponseType extends keyof typeof cip30HostMessageSchemas,
>(
  requestType: RequestType,
  payload: Cip30ClientMessagePayloadMap[RequestType],
  responseType: ResponseType,
  timeout: number = DEFAULT_INTERACTIVE_TIMEOUT
) => {
  const response = await requestHost({
    clientSchemas: cip30ClientMessageSchemas,
    hostSchemas: cip30HostMessageSchemas,
    requestType,
    payload,
    responseType,
    timeout,
    contextSchema: cardanoHostContextSchema,
    errorResponseType: "xray.cardano.cip30.host.error",
    mapError: createCip30Error,
  })
  if (!response) throw new Error(`XRAY CIP-30 host did not respond to ${requestType}`)
  return response.payload
}

export const isEnabled = async () =>
  request("xray.cardano.cip30.client.isEnabled", null, "xray.cardano.cip30.host.isEnabled", DEFAULT_REQUEST_TIMEOUT)

export const enable = async ({ extensions = [] }: { extensions?: Cip30Extension[] } = {}) => {
  const enabled = await request(
    "xray.cardano.cip30.client.enable",
    { extensions },
    "xray.cardano.cip30.host.enable",
    DEFAULT_INTERACTIVE_TIMEOUT
  )
  if (!enabled) throw createCip30Error({ code: -3, info: "XRAY CIP-30 access was refused by the host" })
  return api
}

const getExtensions = () =>
  request("xray.cardano.cip30.client.getExtensions", null, "xray.cardano.cip30.host.extensions")
const getNetworkId = () => request("xray.cardano.cip30.client.getNetworkId", null, "xray.cardano.cip30.host.networkId")
const getUtxos = (amount?: Cip30ClientUtxosPayload["amount"], paginate?: Cip30ClientUtxosPayload["paginate"]) =>
  request("xray.cardano.cip30.client.getUtxos", { amount, paginate }, "xray.cardano.cip30.host.utxos")
const getCollateral = (params: Cip30ClientCollateralPayload) =>
  request("xray.cardano.cip30.client.getCollateral", params, "xray.cardano.cip30.host.collateral")
const getBalance = () => request("xray.cardano.cip30.client.getBalance", null, "xray.cardano.cip30.host.balance")
const getUsedAddresses = (paginate?: Cip30ClientUsedAddressesPayload["paginate"]) =>
  request("xray.cardano.cip30.client.getUsedAddresses", { paginate }, "xray.cardano.cip30.host.usedAddresses")
const getUnusedAddresses = () =>
  request("xray.cardano.cip30.client.getUnusedAddresses", null, "xray.cardano.cip30.host.unusedAddresses")
const getChangeAddress = () =>
  request("xray.cardano.cip30.client.getChangeAddress", null, "xray.cardano.cip30.host.changeAddress")
const getRewardAddresses = () =>
  request("xray.cardano.cip30.client.getRewardAddresses", null, "xray.cardano.cip30.host.rewardAddresses")
const signTx = (tx: Cip30ClientSignTxPayload["tx"], partialSign = false) =>
  request("xray.cardano.cip30.client.signTx", { tx, partialSign }, "xray.cardano.cip30.host.signTx")
const signData = (address: Cip30ClientSignDataPayload["address"], data: Cip30ClientSignDataPayload["data"]) =>
  request("xray.cardano.cip30.client.signData", { address, data }, "xray.cardano.cip30.host.signData")
const submitTx = (tx: Cip30ClientSubmitTxPayload) =>
  request("xray.cardano.cip30.client.submitTx", tx, "xray.cardano.cip30.host.submitTx")

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

export const connector = { apiVersion, name, icon, supportedExtensions, experimental, isEnabled, enable }

export const installConnector = (key = "xrayBridge") => {
  if (typeof window === "undefined") return connector
  const target = window as Window & { cardano?: Record<string, unknown> }
  target.cardano ??= {}
  target.cardano[key] = connector
  return connector
}
