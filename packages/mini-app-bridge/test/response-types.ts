import type {
  Cip30Event,
  Cip30Request,
  Cip30Response,
  Contract,
  Request,
  Response,
  Event,
  Outcome,
  CardanoEvent,
  CardanoRequest,
  CardanoResponse,
  PlatformEvent,
  PlatformRequest,
  PlatformResponse,
} from "@xray-network/xray-js-mini-app-bridge"
import {
  clientPlatformV1,
  clientCardanoV1,
  hostPlatformV1,
  hostCardanoV1,
  hostCardanoCip30V1,
  clientCardanoCip30V1,
  protocol,
} from "@xray-network/xray-js-mini-app-bridge"
import {
  type PlatformRequest as AggregatePlatformRequest,
  type PlatformResponse as AggregatePlatformResponse,
  type CardanoResponse as AggregateCardanoResponse,
  protocol as aggregateProtocol,
} from "@xray-network/xray-js/mini-app-bridge"

export const narrowResponse = (response: PlatformResponse | CardanoResponse | Cip30Response) => {
  if (!response.ok) {
    const code: string = response.error.code
    // @ts-expect-error Failures do not carry a success payload.
    response.payload
    return code
  }
  // @ts-expect-error Successes do not carry an error.
  response.error
  if (response.scope === "platform" && response.method === "getTheme") {
    const theme: "light" | "dark" = response.payload
    const version: "v1" = response.version
    return { theme, version }
  }
  if (response.scope === "cardano" && response.method === "signTx") {
    const signed: { hash: string; cbor: string; witnessSet: string } = response.payload
    // @ts-expect-error Native signing has no nested success flag.
    signed.success
    return signed.cbor
  }
}

// All three scopes preserve the method-specific payload after narrowing.
export const narrowCip30 = (response: PlatformResponse | CardanoResponse | Cip30Response) => {
  if (response.scope === "cardano-cip30" && response.method === "signTx" && response.ok) {
    const witnessSet: string = response.payload
    return witnessSet
  }
}

export const narrowRequest = (request: PlatformRequest | CardanoRequest | Cip30Request) => {
  if (request.scope === "cardano-cip30" && request.method === "signTx") {
    const tx: string = request.payload.tx
    const partial: boolean | undefined = request.payload.partialSign
    return { tx, partial }
  }
  if (request.scope === "cardano" && request.method === "signData") {
    const data: { address: string; data: string } = request.payload
    return data
  }
  if (request.scope === "platform" && request.method === "getTheme") {
    const empty: null = request.payload
    return empty
  }
}

export const narrowEvent = (event: PlatformEvent | CardanoEvent | Cip30Event) => {
  if (event.scope === "platform" && event.event === "theme") {
    const theme: "light" | "dark" = event.payload
    return theme
  }
  if (event.scope === "cardano" && event.event === "explorer") {
    const explorer: string = event.payload
    return explorer
  }
  if (event.scope === "cardano-cip30" && event.event === "networkId") {
    const network: number = event.payload
    return network
  }
  // @ts-expect-error Events are not correlated replies.
  event.requestId
}

export const examples = async (iframe: Window, unsignedCbor: string) => {
  type GetThemeRequest = PlatformRequest<"getTheme">
  type GetThemeResponse = PlatformResponse<"getTheme">
  const request: GetThemeRequest = {
    type: "xray.bridge.request",
    scope: "platform",
    version: "v1",
    method: "getTheme",
    requestId: "req-123",
    payload: null,
  }
  const response: GetThemeResponse = {
    type: "xray.bridge.response",
    scope: "platform",
    version: "v1",
    method: "getTheme",
    requestId: "req-123",
    ok: true,
    payload: "dark",
    context: null,
  }
  const aggregateRequest: AggregatePlatformRequest<"getTheme"> = request
  const aggregateResponse: AggregatePlatformResponse<"getTheme"> = response
  const native: AggregateCardanoResponse<"signTx"> = await clientCardanoV1.signTx(unsignedCbor)
  if (native.ok) console.log(native.payload.cbor)
  else console.error(native.error.code, native.error.message)
  const context = { blockchain: "cardano", network: "preview" } as const
  const stop = hostPlatformV1.handle(iframe, "getTheme", () => ({ ok: true, payload: "dark", context }))
  hostCardanoV1.handle(iframe, "signTx", () => ({
    ok: false,
    error: { code: "USER_REJECTED", message: "Signing was rejected" },
  }))
  const shared = protocol.createResponse(protocol.platformV1Contract, request, { ok: true, payload: "dark", context })
  aggregateProtocol.parseResponse(aggregateProtocol.platformV1Contract, shared)
  // @ts-expect-error getTheme requires a null request payload.
  const badRequest: GetThemeRequest = { ...request, payload: "dark" }
  // @ts-expect-error getTheme does not return a number.
  const badResponse: GetThemeResponse = { ...response, payload: 42 }
  // @ts-expect-error No additional adapter version is introduced.
  const badVersion: GetThemeRequest = { ...request, version: "v2" }
  // @ts-expect-error A host must return the selected method's payload.
  hostPlatformV1.handle(iframe, "getTheme", () => ({ ok: true, payload: "usd", context }))
  // @ts-expect-error Shared response construction also enforces method payload types.
  protocol.createResponse(protocol.platformV1Contract, request, { ok: true, payload: "usd", context })
  return { aggregateRequest, aggregateResponse, badRequest, badResponse, badVersion, stop }
}

// Namespace objects carry runtime operations; types are named imports.
// @ts-expect-error Removed client namespace type.
type RetiredClientResponse = clientCardanoV1.Response<"signTx">
// @ts-expect-error Removed host namespace type.
type RetiredHostRequest = hostPlatformV1.Request<"getTheme">
// @ts-expect-error Removed generic response alias.
import type { ClientResponse } from "@xray-network/xray-js-mini-app-bridge"
// @ts-expect-error Removed protocol alias.
type RetiredAdapterResponse = protocol.AdapterResponse<typeof protocol.platformV1Contract>

export const contractTypes = (iframe: Window) => {
  const contract: Contract = protocol.platformV1Contract
  const request: Request<typeof protocol.cardanoV1Contract, "signTx"> = {
    type: "xray.bridge.request",
    scope: "cardano",
    version: "v1",
    method: "signTx",
    requestId: "sign",
    payload: "cbor",
  }
  const response: Response<typeof protocol.cardanoV1Contract, "signTx"> = protocol.createResponse(
    protocol.cardanoV1Contract,
    request,
    {
      ok: true,
      payload: { hash: "hash", cbor: "cbor", witnessSet: "witnesses" },
      context: { blockchain: "cardano", network: "preview" },
    }
  )
  const event: Event<typeof protocol.platformV1Contract, "theme"> = protocol.createEvent(
    protocol.platformV1Contract,
    "theme",
    "dark",
    null
  )
  const outcome: Outcome<string, null> = { ok: true, payload: "data", context: null }
  const scope: "platform" = clientPlatformV1.scope
  const version: "v1" = hostCardanoV1.version
  const cip30Scope: "cardano-cip30" = clientCardanoCip30V1.scope
  // @ts-expect-error Message metadata is readonly.
  request.requestId = "other"
  // @ts-expect-error Wrong scope for a Cardano request.
  const wrongScope: CardanoRequest<"signTx"> = { ...request, scope: "platform" }
  // @ts-expect-error A union must preserve method/payload correlation.
  const wrongPair: CardanoRequest = { ...request, method: "getTip" }
  // @ts-expect-error Theme events do not carry network numbers.
  const wrongEvent: PlatformEvent = { ...event, payload: 0 }
  const context = { blockchain: "cardano", network: "preview" } as const
  const stop = hostCardanoCip30V1.handle(iframe, "signTx", ({ payload }) => {
    const tx: string = payload.tx
    return { ok: true, payload: tx, context }
  })
  hostCardanoCip30V1.respond(iframe, "signTx", "sign", {
    ok: true,
    // @ts-expect-error CIP-30 signing returns a witness string, not the native result.
    payload: { hash: "hash", cbor: "cbor", witnessSet: "witnesses" },
    context,
  })
  // @ts-expect-error Cardano events require Cardano context.
  hostCardanoV1.publish(iframe, "tip", null, null)
  return { contract, response, event, outcome, scope, version, cip30Scope, wrongScope, wrongPair, wrongEvent, stop }
}
