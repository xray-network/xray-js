import type {
  AdapterContext,
  AdapterContract,
  AdapterEventName,
  AdapterMethodName,
  ClientEvent,
  ClientResponse,
  EventPayload,
  MethodPayload,
  MethodResult,
} from "../adapters/types.js"
import { BridgeError } from "./errors.js"
import { eventMessageSchema, responseMessageSchema, type RequestMessage } from "./messages.js"

export const DEFAULT_REQUEST_TIMEOUT = 5_000
export const DEFAULT_INTERACTIVE_TIMEOUT = 120_000

let hostWindowOverride: Window | null = null

export const setHostWindow = (hostWindow: Window | null) => {
  hostWindowOverride = hostWindow
}

export const getHostWindow = () => {
  if (hostWindowOverride) return hostWindowOverride
  if (typeof window === "undefined" || !window.parent || window.parent === window) return null
  return window.parent
}

const getRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const request = <Contract extends AdapterContract, Method extends AdapterMethodName<Contract>>(
  contract: Contract,
  method: Method,
  payload: MethodPayload<Contract, Method>,
  timeout: number
): Promise<ClientResponse<MethodResult<Contract, Method>, AdapterContext<Contract>> | null> => {
  const hostWindow = getHostWindow()
  if (!hostWindow || typeof window === "undefined") return Promise.resolve(null)
  const requestPayload = contract.methods[method].request.safeParse(payload)
  if (!requestPayload.success) throw new BridgeError("INVALID_REQUEST", `Invalid ${contract.scope}/${method} payload`)
  const requestId = getRequestId()
  const message: RequestMessage = {
    type: "xray.bridge.request",
    scope: contract.scope,
    version: contract.version,
    method,
    requestId,
    payload: requestPayload.data,
  }

  return new Promise((resolve, reject) => {
    const stop = () => {
      window.removeEventListener("message", receive)
      clearTimeout(timer)
    }
    const receive = (event: MessageEvent) => {
      if (event.source !== hostWindow) return
      const parsed = responseMessageSchema.safeParse(event.data)
      if (!parsed.success) return
      const response = parsed.data
      if (
        response.scope !== contract.scope ||
        response.version !== contract.version ||
        response.requestId !== requestId
      )
        return
      if ("error" in response) {
        stop()
        reject(new BridgeError(response.error.code, response.error.message, response.error.data))
        return
      }
      const result = contract.methods[method].result.safeParse(response.result)
      const context = contract.context.safeParse(response.context)
      if (!result.success || !context.success) return
      stop()
      resolve({ payload: result.data, context: context.data, requestId } as never)
    }
    const timer = setTimeout(() => {
      window.removeEventListener("message", receive)
      resolve(null)
    }, timeout)
    window.addEventListener("message", receive)
    hostWindow.postMessage(message, "*")
  })
}

export const notify = <Contract extends AdapterContract, Method extends AdapterMethodName<Contract>>(
  contract: Contract,
  method: Method,
  payload: MethodPayload<Contract, Method>
) => {
  const hostWindow = getHostWindow()
  if (!hostWindow) return false
  const requestPayload = contract.methods[method].request.safeParse(payload)
  if (!requestPayload.success) throw new BridgeError("INVALID_REQUEST", `Invalid ${contract.scope}/${method} payload`)
  hostWindow.postMessage(
    {
      type: "xray.bridge.request",
      scope: contract.scope,
      version: contract.version,
      method,
      requestId: getRequestId(),
      payload: requestPayload.data,
    } satisfies RequestMessage,
    "*"
  )
  return true
}

export const listen = <Contract extends AdapterContract, Event extends AdapterEventName<Contract>>(
  contract: Contract,
  eventName: Event,
  handler: (event: ClientEvent<Event, EventPayload<Contract, Event>, AdapterContext<Contract>>) => void
) => {
  const hostWindow = getHostWindow()
  if (!hostWindow || typeof window === "undefined") return () => undefined
  const receive = (event: MessageEvent) => {
    if (event.source !== hostWindow) return
    const parsed = eventMessageSchema.safeParse(event.data)
    if (!parsed.success) return
    const message = parsed.data
    if (message.scope !== contract.scope || message.version !== contract.version || message.event !== eventName) return
    const payload = contract.events[eventName].safeParse(message.payload)
    const context = contract.context.safeParse(message.context)
    if (!payload.success || !context.success) return
    handler({ event: eventName, payload: payload.data, context: context.data } as never)
  }
  window.addEventListener("message", receive)
  return () => window.removeEventListener("message", receive)
}

export const listenAll = <Contract extends AdapterContract>(
  contract: Contract,
  handler: (
    event: {
      [Event in AdapterEventName<Contract>]: ClientEvent<Event, EventPayload<Contract, Event>, AdapterContext<Contract>>
    }[AdapterEventName<Contract>]
  ) => void
) => {
  const stops = (Object.keys(contract.events) as AdapterEventName<Contract>[]).map((event) =>
    listen(contract, event, handler as never)
  )
  return () => stops.forEach((stop) => stop())
}
