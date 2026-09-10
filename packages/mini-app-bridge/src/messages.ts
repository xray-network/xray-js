import type {
  Contract,
  MethodName,
  EventName,
  Request,
  Response,
  Event,
  Context,
  MethodResult,
  EventPayload,
  Outcome,
} from "./types.js"
import { z } from "zod"

const routeSchema = {
  scope: z.string().min(1),
  version: z.string().min(1),
} as const

export const requestMessageSchema = z
  .object({
    type: z.literal("xray.bridge.request"),
    ...routeSchema,
    method: z.string().min(1),
    requestId: z.string().min(1),
    payload: z.unknown().refine((value) => value !== undefined),
  })
  .strict()

export const bridgeErrorPayloadSchema = z
  .object({
    code: z.enum([
      "UNSUPPORTED_SCOPE_VERSION",
      "UNSUPPORTED_METHOD",
      "INVALID_REQUEST",
      "INVALID_RESPONSE",
      "HOST_ERROR",
      "HOST_UNAVAILABLE",
      "TIMEOUT",
      "TRANSPORT_ERROR",
      "USER_REJECTED",
      "OPERATION_FAILED",
    ]),
    message: z.string(),
    data: z.unknown().optional(),
  })
  .strict()

export const successResponseMessageSchema = z
  .object({
    type: z.literal("xray.bridge.response"),
    ...routeSchema,
    requestId: z.string().min(1),
    method: z.string().min(1),
    ok: z.literal(true),
    payload: z.unknown().refine((value) => value !== undefined),
    context: z.unknown().refine((value) => value !== undefined),
  })
  .strict()

export const errorResponseMessageSchema = z
  .object({
    type: z.literal("xray.bridge.response"),
    ...routeSchema,
    requestId: z.string().min(1),
    method: z.string().min(1),
    ok: z.literal(false),
    error: bridgeErrorPayloadSchema,
  })
  .strict()

export const responseMessageSchema = z.discriminatedUnion("ok", [
  successResponseMessageSchema,
  errorResponseMessageSchema,
])

export const eventMessageSchema = z
  .object({
    type: z.literal("xray.bridge.event"),
    ...routeSchema,
    event: z.string().min(1),
    payload: z.unknown().refine((value) => value !== undefined),
    context: z.unknown().refine((value) => value !== undefined),
  })
  .strict()

export type RequestMessage = z.infer<typeof requestMessageSchema>
export type BridgeErrorPayload = z.infer<typeof bridgeErrorPayloadSchema>
export type SuccessResponseMessage = z.infer<typeof successResponseMessageSchema>
export type ErrorResponseMessage = z.infer<typeof errorResponseMessageSchema>
export type ResponseMessage = z.infer<typeof responseMessageSchema>
export type EventMessage = z.infer<typeof eventMessageSchema>

export type BridgeErrorCode = BridgeErrorPayload["code"]

export class BridgeError extends Error {
  readonly code: BridgeErrorCode
  readonly data?: unknown

  constructor(code: BridgeErrorCode, message: string, data?: unknown) {
    super(message)
    this.name = "BridgeError"
    this.code = code
    this.data = data
  }
}

export const toBridgeErrorPayload = (error: unknown): BridgeErrorPayload => {
  if (error instanceof BridgeError) {
    let data: unknown
    try {
      data = error.data === undefined ? undefined : structuredClone(error.data)
    } catch {
      data = undefined
    }
    return { code: error.code, message: error.message, ...(data === undefined ? {} : { data }) }
  }
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "number") {
    const info = "info" in error && typeof error.info === "string" ? error.info : "Host request failed"
    return { code: "HOST_ERROR", message: info, data: { code: error.code, info } }
  }
  return {
    code: "HOST_ERROR",
    message: error instanceof Error ? error.message : "Host request failed",
  }
}

const owns = (record: object, key: string) => Object.prototype.hasOwnProperty.call(record, key)

export const parseRequest = <C extends Contract>(contract: C, value: unknown): Request<C> => {
  const parsed = requestMessageSchema.safeParse(value)
  if (!parsed.success) throw new BridgeError("INVALID_REQUEST", "Invalid request envelope")
  const request = parsed.data
  if (request.scope !== contract.scope || request.version !== contract.version)
    throw new BridgeError("UNSUPPORTED_SCOPE_VERSION", `Unsupported bridge route: ${request.scope}/${request.version}`)
  if (!owns(contract.methods, request.method))
    throw new BridgeError("UNSUPPORTED_METHOD", `Unsupported method: ${request.method}`)
  const payload = contract.methods[request.method].request.safeParse(request.payload)
  if (!payload.success) throw new BridgeError("INVALID_REQUEST", `Invalid request payload: ${request.method}`)
  return { ...request, payload: payload.data } as Request<C>
}

export const parseResponse = <C extends Contract>(contract: C, value: unknown): Response<C> => {
  const parsed = responseMessageSchema.safeParse(value)
  if (!parsed.success) throw new BridgeError("INVALID_RESPONSE", "Invalid response envelope")
  const response = parsed.data
  if (
    response.scope !== contract.scope ||
    response.version !== contract.version ||
    !owns(contract.methods, response.method)
  )
    throw new BridgeError("INVALID_RESPONSE", "Invalid response route or method")
  if (!response.ok) return response as Response<C>
  const payload = contract.methods[response.method].result.safeParse(response.payload)
  const context = contract.context.safeParse(response.context)
  if (!payload.success || !context.success)
    throw new BridgeError("INVALID_RESPONSE", `Invalid response payload or context: ${response.method}`)
  return { ...response, payload: payload.data, context: context.data } as Response<C>
}

export const createResponse = <C extends Contract, M extends MethodName<C>>(
  contract: C,
  request: { method: M; requestId: string },
  outcome: Outcome<MethodResult<C, M>, Context<C>>
): Response<C, M> =>
  parseResponse(contract, {
    ...outcome,
    type: "xray.bridge.response",
    scope: contract.scope,
    version: contract.version,
    method: request.method,
    requestId: request.requestId,
  }) as Response<C, M>

export const createErrorResponse = (
  request: Pick<RequestMessage, "scope" | "version" | "method" | "requestId">,
  error: BridgeErrorPayload
) =>
  errorResponseMessageSchema.parse({
    type: "xray.bridge.response",
    scope: request.scope,
    version: request.version,
    method: request.method,
    requestId: request.requestId,
    ok: false,
    error,
  })

export const parseEvent = <C extends Contract>(contract: C, value: unknown): Event<C> => {
  const parsed = eventMessageSchema.safeParse(value)
  if (!parsed.success) throw new BridgeError("INVALID_RESPONSE", "Invalid event envelope")
  const event = parsed.data
  if (event.scope !== contract.scope || event.version !== contract.version || !owns(contract.events, event.event))
    throw new BridgeError("INVALID_RESPONSE", "Invalid event route or name")
  const payload = contract.events[event.event].safeParse(event.payload)
  const context = contract.context.safeParse(event.context)
  if (!payload.success || !context.success)
    throw new BridgeError("INVALID_RESPONSE", `Invalid event payload or context: ${event.event}`)
  return { ...event, payload: payload.data, context: context.data } as Event<C>
}

export const createEvent = <C extends Contract, E extends EventName<C>>(
  contract: C,
  event: E,
  payload: EventPayload<C, E>,
  context: Context<C>
): Event<C, E> =>
  parseEvent(contract, {
    type: "xray.bridge.event",
    scope: contract.scope,
    version: contract.version,
    event,
    payload,
    context,
  }) as Event<C, E>
