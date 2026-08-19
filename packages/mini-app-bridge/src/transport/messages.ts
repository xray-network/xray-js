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
    payload: z.unknown(),
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
    result: z.unknown(),
    context: z.unknown(),
  })
  .strict()

export const errorResponseMessageSchema = z
  .object({
    type: z.literal("xray.bridge.response"),
    ...routeSchema,
    requestId: z.string().min(1),
    error: bridgeErrorPayloadSchema,
  })
  .strict()

export const responseMessageSchema = z.union([successResponseMessageSchema, errorResponseMessageSchema])

export const eventMessageSchema = z
  .object({
    type: z.literal("xray.bridge.event"),
    ...routeSchema,
    event: z.string().min(1),
    payload: z.unknown(),
    context: z.unknown(),
  })
  .strict()

export type RequestMessage = z.infer<typeof requestMessageSchema>
export type BridgeErrorPayload = z.infer<typeof bridgeErrorPayloadSchema>
export type SuccessResponseMessage = z.infer<typeof successResponseMessageSchema>
export type ErrorResponseMessage = z.infer<typeof errorResponseMessageSchema>
export type ResponseMessage = z.infer<typeof responseMessageSchema>
export type EventMessage = z.infer<typeof eventMessageSchema>
