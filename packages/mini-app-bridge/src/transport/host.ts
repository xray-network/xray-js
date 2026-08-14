import type { z } from "zod"
import type { HostContext } from "./context.js"
import { parseMessage, type Envelope, type MessageFromSchemas, type PayloadMap } from "./envelope.js"

export const sendHost = <
  HostSchemas extends Record<string, z.ZodTypeAny>,
  MessageType extends keyof PayloadMap<HostSchemas> & string,
  Context extends HostContext | null = HostContext,
>(
  schemas: HostSchemas,
  iframe: Window | null | undefined,
  type: MessageType,
  payload: PayloadMap<HostSchemas>[MessageType],
  requestId: string,
  context: Context
) => {
  if (!iframe) return
  const message = parseMessage(schemas, { type, payload, requestId })
  // `parseMessage` without a context schema validates routing and payload; the
  // context is already statically constrained and remains attached below.
  if (!message) throw new Error(`Invalid mini-app host payload: ${type}`)
  iframe.postMessage({ ...message, context }, "*")
}

export const listenClient = <
  ClientSchemas extends Record<string, z.ZodTypeAny>,
  MessageType extends keyof PayloadMap<ClientSchemas> & string,
>(
  schemas: ClientSchemas,
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: (message: Envelope<MessageType, PayloadMap<ClientSchemas>[MessageType]>) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== iframe) return
    const message = parseMessage(schemas, event.data)
    if (!message || message.type !== messageType) return
    handler(message as never)
  }
  if (iframe) window.addEventListener("message", handleMessage)
  return () => window.removeEventListener("message", handleMessage)
}

export const listenAllClient = <ClientSchemas extends Record<string, z.ZodTypeAny>>(
  schemas: ClientSchemas,
  iframe: Window | null | undefined,
  handler: (message: MessageFromSchemas<ClientSchemas>) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== iframe) return
    const message = parseMessage(schemas, event.data)
    if (message) handler(message)
  }
  if (iframe) window.addEventListener("message", handleMessage)
  return () => window.removeEventListener("message", handleMessage)
}
