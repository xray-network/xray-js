import type { Contract, MethodName, EventName, Response, Event, MethodPayload } from "./types.js"
import {
  BridgeError,
  type BridgeErrorCode,
  parseRequest,
  parseResponse,
  parseEvent,
  createErrorResponse,
} from "./messages.js"

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

export const request = <C extends Contract, M extends MethodName<C>>(
  contract: C,
  method: M,
  payload: MethodPayload<C, M>,
  timeout: number
): Promise<Response<C, M>> => {
  const message = {
    type: "xray.bridge.request" as const,
    scope: contract.scope,
    version: contract.version,
    method,
    requestId: getRequestId(),
    payload,
  }
  const failure = (code: BridgeErrorCode, text: string) =>
    createErrorResponse(message, { code, message: text }) as Response<C, M>
  const host = getHostWindow()
  if (!host || typeof window === "undefined")
    return Promise.resolve(failure("HOST_UNAVAILABLE", "XRAY host is unavailable"))
  let parsedRequest
  try {
    parsedRequest = parseRequest(contract, message)
  } catch {
    return Promise.resolve(failure("INVALID_REQUEST", `Invalid ${contract.scope}/${method} payload`))
  }
  const target = window
  return new Promise((resolve) => {
    let settled = false
    const finish = (response: Response<C, M>) => {
      if (settled) return
      settled = true
      target.removeEventListener("message", receive)
      clearTimeout(timer)
      resolve(response)
    }
    const receive = (event: MessageEvent<unknown>) => {
      if (event.source !== host) return
      const value = event.data
      if (
        typeof value !== "object" ||
        value === null ||
        !("type" in value) ||
        value.type !== "xray.bridge.response" ||
        !("scope" in value) ||
        value.scope !== contract.scope ||
        !("version" in value) ||
        value.version !== contract.version ||
        !("requestId" in value) ||
        value.requestId !== message.requestId
      )
        return
      try {
        const response = parseResponse(contract, value)
        if (response.method !== method)
          throw new BridgeError("INVALID_RESPONSE", "Response method does not match request")
        finish(response as Response<C, M>)
      } catch {
        finish(failure("INVALID_RESPONSE", `Invalid ${contract.scope}/${method} response`))
      }
    }
    const timer = setTimeout(() => finish(failure("TIMEOUT", `XRAY host did not respond to ${method}`)), timeout)
    target.addEventListener("message", receive)
    try {
      host.postMessage(parsedRequest, "*")
    } catch {
      finish(failure("TRANSPORT_ERROR", `Unable to send ${method} request`))
    }
  })
}

export const notify = <C extends Contract, M extends MethodName<C>>(
  contract: C,
  method: M,
  payload: MethodPayload<C, M>
) => {
  const host = getHostWindow()
  if (!host) return false
  try {
    host.postMessage(
      parseRequest(contract, {
        type: "xray.bridge.request",
        scope: contract.scope,
        version: contract.version,
        method,
        requestId: getRequestId(),
        payload,
      }),
      "*"
    )
    return true
  } catch {
    return false
  }
}

export const listen = <C extends Contract, E extends EventName<C>>(
  contract: C,
  eventName: E,
  handler: (event: Event<C, E>) => void
) => {
  const host = getHostWindow()
  if (!host || typeof window === "undefined") return () => undefined
  const target = window
  const receive = (event: MessageEvent<unknown>) => {
    if (event.source !== host) return
    let message: Event<C>
    try {
      message = parseEvent(contract, event.data)
    } catch {
      return
    }
    if (message.event === eventName) handler(message as Event<C, E>)
  }
  target.addEventListener("message", receive)
  return () => target.removeEventListener("message", receive)
}

export const listenAll = <C extends Contract>(contract: C, handler: (event: Event<C>) => void) => {
  const stops = (Object.keys(contract.events) as EventName<C>[]).map((event) => listen(contract, event, handler))
  return () => stops.forEach((stop) => stop())
}
