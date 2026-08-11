import { z } from "zod"

export const messageEnvelopeSchema = z.object({
  type: z.string(),
  payload: z.unknown(),
  requestId: z.string(),
})

export type MessageEnvelope = z.infer<typeof messageEnvelopeSchema>

export type Envelope<Type extends string, Payload, Context = never> = {
  type: Type
  payload: Payload
  requestId: string
} & ([Context] extends [never] ? object : { context: Context })

export type PayloadMap<Schemas extends Record<string, z.ZodTypeAny>> = {
  [K in keyof Schemas]: z.infer<Schemas[K]>
}

export type MessageFromSchemas<Schemas extends Record<string, z.ZodTypeAny>, Context = never> = {
  [K in keyof Schemas & string]: Envelope<K, z.infer<Schemas[K]>, Context>
}[keyof Schemas & string]

export function parseMessage<Schemas extends Record<string, z.ZodTypeAny>, Context>(
  schemas: Schemas,
  data: unknown,
  contextSchema: z.ZodType<Context>
): MessageFromSchemas<Schemas, Context> | null
export function parseMessage<Schemas extends Record<string, z.ZodTypeAny>>(
  schemas: Schemas,
  data: unknown
): MessageFromSchemas<Schemas> | null
export function parseMessage<Schemas extends Record<string, z.ZodTypeAny>>(
  schemas: Schemas,
  data: unknown,
  contextSchema?: z.ZodTypeAny
): MessageFromSchemas<Schemas, unknown> | MessageFromSchemas<Schemas> | null {
  const envelope = messageEnvelopeSchema.safeParse(data)
  if (!envelope.success) return null
  const schema = schemas[envelope.data.type]
  if (!schema) return null
  const payload = schema.safeParse(envelope.data.payload)
  if (!payload.success) return null
  if (!contextSchema) {
    return { type: envelope.data.type, payload: payload.data, requestId: envelope.data.requestId } as never
  }
  const context = contextSchema.safeParse((data as { context?: unknown }).context)
  if (!context.success) return null
  return {
    type: envelope.data.type,
    payload: payload.data,
    requestId: envelope.data.requestId,
    context: context.data,
  } as never
}
