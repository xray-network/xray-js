import { z } from "zod"

// Every postMessage payload travels inside an envelope carrying its routing
// `type` and a `requestId` used to correlate responses with requests.

export const messageEnvelopeSchema = z.object({
  type: z.string(),
  payload: z.unknown(),
  requestId: z.string(),
})

export type MessageEnvelope = z.infer<typeof messageEnvelopeSchema>

export type Envelope<Type extends string, Payload> = {
  type: Type
  payload: Payload
  requestId: string
}

/**
 * Validate an unknown value (e.g. `event.data`) against a map of payload
 * schemas keyed by message type. Returns the typed message or null when the
 * value is not a well-formed message of one of the given types.
 */
export const parseMessage = <Schemas extends Record<string, z.ZodTypeAny>>(
  schemas: Schemas,
  data: unknown
): { [K in keyof Schemas & string]: Envelope<K, z.infer<Schemas[K]>> }[keyof Schemas & string] | null => {
  const envelope = messageEnvelopeSchema.safeParse(data)
  if (!envelope.success) return null
  const schema = schemas[envelope.data.type]
  if (!schema) return null
  const payload = schema.safeParse(envelope.data.payload)
  if (!payload.success) return null
  return { type: envelope.data.type, payload: payload.data, requestId: envelope.data.requestId } as never
}
