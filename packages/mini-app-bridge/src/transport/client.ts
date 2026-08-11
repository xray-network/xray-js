import type { z } from "zod"
import { hostContextSchema, type HostContext } from "./context.js"
import { parseMessage, type Envelope, type MessageFromSchemas, type PayloadMap } from "./envelope.js"

let hostWindowOverride: Window | null = null

export const setHostWindow = (win: Window | null) => {
  hostWindowOverride = win
}

export const getHostWindow = () => {
  if (hostWindowOverride) return hostWindowOverride
  if (typeof window === "undefined") return null
  if (!window.parent || window.parent === window) return null
  return window.parent
}

export const getRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const requestHost = async <
  ClientSchemas extends Record<string, z.ZodTypeAny>,
  HostSchemas extends Record<string, z.ZodTypeAny>,
  RequestType extends keyof PayloadMap<ClientSchemas> & string,
  ResponseType extends keyof PayloadMap<HostSchemas> & string,
  Context = HostContext,
  ErrorType extends keyof PayloadMap<HostSchemas> & string = never,
>(options: {
  clientSchemas: ClientSchemas
  hostSchemas: HostSchemas
  requestType: RequestType
  payload: PayloadMap<ClientSchemas>[RequestType]
  responseType: ResponseType
  timeout: number
  requestId?: string
  expectResponse?: boolean
  contextSchema?: z.ZodType<Context>
  errorResponseType?: ErrorType
  mapError?: (payload: PayloadMap<HostSchemas>[ErrorType]) => unknown
}): Promise<Envelope<ResponseType, PayloadMap<HostSchemas>[ResponseType], Context> | null> => {
  const hostWindow = getHostWindow()
  if (!hostWindow) return null
  const requestId = options.requestId ?? getRequestId()
  const request = parseMessage(options.clientSchemas, {
    type: options.requestType,
    payload: options.payload,
    requestId,
  })
  if (!request) throw new Error(`Invalid mini-app request payload: ${options.requestType}`)

  return new Promise((resolve, reject) => {
    if (options.expectResponse !== false) {
      const handleMessage = (event: MessageEvent) => {
        if (event.source !== hostWindow) return
        const contextSchema = options.contextSchema ?? (hostContextSchema as unknown as z.ZodType<Context>)
        const message = parseMessage(options.hostSchemas, event.data, contextSchema)
        if (!message || message.requestId !== requestId) return
        if (message.type === options.errorResponseType) {
          window.removeEventListener("message", handleMessage)
          clearTimeout(timer)
          reject(options.mapError?.(message.payload as PayloadMap<HostSchemas>[ErrorType]) ?? message.payload)
          return
        }
        if (message.type !== options.responseType) return
        window.removeEventListener("message", handleMessage)
        clearTimeout(timer)
        resolve(message as never)
      }
      const timer = setTimeout(() => {
        window.removeEventListener("message", handleMessage)
        resolve(null)
        console.log(`MiniAppSDKTimeout: ${options.requestType} :: ${options.timeout}ms :: ${requestId}`)
      }, options.timeout)
      window.addEventListener("message", handleMessage)
    } else {
      resolve(null)
    }
    hostWindow.postMessage(request, "*")
  })
}

export const listenHost = <
  HostSchemas extends Record<string, z.ZodTypeAny>,
  MessageType extends keyof PayloadMap<HostSchemas> & string,
  Context = HostContext,
>(
  schemas: HostSchemas,
  messageType: MessageType,
  handler: (message: Envelope<MessageType, PayloadMap<HostSchemas>[MessageType], Context>) => void,
  contextSchema: z.ZodType<Context> = hostContextSchema as unknown as z.ZodType<Context>
) => {
  const hostWindow = getHostWindow()
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== hostWindow) return
    const message = parseMessage(schemas, event.data, contextSchema)
    if (!message || message.type !== messageType) return
    handler(message as never)
  }
  if (hostWindow) window.addEventListener("message", handleMessage)
  return () => window.removeEventListener("message", handleMessage)
}

export const listenAllHost = <HostSchemas extends Record<string, z.ZodTypeAny>, Context = HostContext>(
  schemas: HostSchemas,
  handler: (message: MessageFromSchemas<HostSchemas, Context>) => void,
  contextSchema: z.ZodType<Context> = hostContextSchema as unknown as z.ZodType<Context>
) => {
  const hostWindow = getHostWindow()
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== hostWindow) return
    const message = parseMessage(schemas, event.data, contextSchema)
    if (message) handler(message)
  }
  if (hostWindow) window.addEventListener("message", handleMessage)
  return () => window.removeEventListener("message", handleMessage)
}
