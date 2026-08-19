import type {
  AdapterContext,
  AdapterContract,
  AdapterEventName,
  AdapterMethodName,
  EventPayload,
  HostRequest,
  HostResult,
  MethodPayload,
  MethodResult,
} from "../adapters/types.js"
import { BridgeError, toBridgeErrorPayload } from "./errors.js"
import { requestMessageSchema, type ErrorResponseMessage, type SuccessResponseMessage } from "./messages.js"

type RequestListener = (request: HostRequest<string, unknown>) => void
type RequestHandler = (request: HostRequest<string, unknown>) => Promise<HostResult<unknown, unknown>>

type Registration = {
  contract: AdapterContract
  refs: number
  listeners: Set<RequestListener>
  handlers: Map<string, Set<RequestHandler>>
}

type Router = {
  registrations: Map<string, Registration>
  receive: (event: MessageEvent) => void
}

const routers = new WeakMap<Window, Router>()
const keyOf = (contract: AdapterContract) => `${contract.scope}\u0000${contract.version}`

const postError = (iframe: Window, request: { scope: string; version: string; requestId: string }, error: unknown) => {
  iframe.postMessage(
    {
      type: "xray.bridge.response",
      scope: request.scope,
      version: request.version,
      requestId: request.requestId,
      error: toBridgeErrorPayload(error),
    } satisfies ErrorResponseMessage,
    "*"
  )
}

const createRouter = (iframe: Window): Router => {
  const router: Router = {
    registrations: new Map(),
    receive: () => undefined,
  }
  router.receive = (event: MessageEvent) => {
    if (event.source !== iframe) return
    const parsed = requestMessageSchema.safeParse(event.data)
    if (!parsed.success) return
    const request = parsed.data
    const registration = router.registrations.get(`${request.scope}\u0000${request.version}`)
    if (!registration) {
      postError(
        iframe,
        request,
        new BridgeError(
          "UNSUPPORTED_SCOPE_VERSION",
          `Unsupported bridge scope/version: ${request.scope}/${request.version}`
        )
      )
      return
    }
    const method = registration.contract.methods[request.method]
    if (!method) {
      postError(iframe, request, new BridgeError("UNSUPPORTED_METHOD", `Unsupported method: ${request.method}`))
      return
    }
    const payload = method.request.safeParse(request.payload)
    if (!payload.success) {
      postError(iframe, request, new BridgeError("INVALID_REQUEST", `Invalid request payload: ${request.method}`))
      return
    }
    const typedRequest = { method: request.method, payload: payload.data, requestId: request.requestId }
    registration.listeners.forEach((listener) => listener(typedRequest))
    const handler = registration.handlers.get(request.method)?.values().next().value
    if (!handler) return
    void Promise.resolve(handler(typedRequest))
      .then((value) => {
        const result = method.result.safeParse(value.result)
        const context = registration.contract.context.safeParse(value.context)
        if (!result.success || !context.success) {
          throw new BridgeError("INVALID_RESPONSE", `Invalid response payload: ${request.method}`)
        }
        iframe.postMessage(
          {
            type: "xray.bridge.response",
            scope: request.scope,
            version: request.version,
            requestId: request.requestId,
            result: result.data,
            context: context.data,
          } satisfies SuccessResponseMessage,
          "*"
        )
      })
      .catch((error: unknown) => postError(iframe, request, error))
  }
  window.addEventListener("message", router.receive)
  routers.set(iframe, router)
  return router
}

const acquire = (iframe: Window, contract: AdapterContract) => {
  const router = routers.get(iframe) ?? createRouter(iframe)
  const key = keyOf(contract)
  const registration = router.registrations.get(key) ?? {
    contract,
    refs: 0,
    listeners: new Set<RequestListener>(),
    handlers: new Map<string, Set<RequestHandler>>(),
  }
  registration.refs++
  router.registrations.set(key, registration)
  const release = () => {
    registration.refs--
    if (registration.refs > 0) return
    router.registrations.delete(key)
    if (router.registrations.size > 0) return
    window.removeEventListener("message", router.receive)
    routers.delete(iframe)
  }
  return { registration, release }
}

export const listen = <Contract extends AdapterContract>(
  contract: Contract,
  iframe: Window | null | undefined,
  handler: (
    request: {
      [Method in AdapterMethodName<Contract>]: HostRequest<Method, MethodPayload<Contract, Method>>
    }[AdapterMethodName<Contract>]
  ) => void
) => {
  if (!iframe || typeof window === "undefined") return () => undefined
  const { registration, release } = acquire(iframe, contract)
  registration.listeners.add(handler as RequestListener)
  return () => {
    registration.listeners.delete(handler as RequestListener)
    release()
  }
}

export const handle = <Contract extends AdapterContract, Method extends AdapterMethodName<Contract>>(
  contract: Contract,
  iframe: Window | null | undefined,
  method: Method,
  handler: (
    request: HostRequest<Method, MethodPayload<Contract, Method>>
  ) =>
    | HostResult<MethodResult<Contract, Method>, AdapterContext<Contract>>
    | Promise<HostResult<MethodResult<Contract, Method>, AdapterContext<Contract>>>
) => {
  if (!iframe || typeof window === "undefined") return () => undefined
  const { registration, release } = acquire(iframe, contract)
  const handlers = registration.handlers.get(method) ?? new Set<RequestHandler>()
  const typedHandler: RequestHandler = async (request) => handler(request as never)
  handlers.add(typedHandler)
  registration.handlers.set(method, handlers)
  return () => {
    handlers.delete(typedHandler)
    if (handlers.size === 0) registration.handlers.delete(method)
    release()
  }
}

export const respond = <Contract extends AdapterContract, Method extends AdapterMethodName<Contract>>(
  contract: Contract,
  iframe: Window | null | undefined,
  method: Method,
  requestId: string,
  resultValue: MethodResult<Contract, Method>,
  contextValue: AdapterContext<Contract>
) => {
  if (!iframe) return false
  const result = contract.methods[method].result.safeParse(resultValue)
  const context = contract.context.safeParse(contextValue)
  if (!result.success || !context.success)
    throw new BridgeError("INVALID_RESPONSE", `Invalid ${contract.scope}/${method} response`)
  iframe.postMessage(
    {
      type: "xray.bridge.response",
      scope: contract.scope,
      version: contract.version,
      requestId,
      result: result.data,
      context: context.data,
    } satisfies SuccessResponseMessage,
    "*"
  )
  return true
}

export const publish = <Contract extends AdapterContract, Event extends AdapterEventName<Contract>>(
  contract: Contract,
  iframe: Window | null | undefined,
  event: Event,
  payloadValue: EventPayload<Contract, Event>,
  contextValue: AdapterContext<Contract>
) => {
  if (!iframe) return false
  const payload = contract.events[event].safeParse(payloadValue)
  const context = contract.context.safeParse(contextValue)
  if (!payload.success || !context.success)
    throw new BridgeError("INVALID_RESPONSE", `Invalid ${contract.scope}/${event} event`)
  iframe.postMessage(
    {
      type: "xray.bridge.event",
      scope: contract.scope,
      version: contract.version,
      event,
      payload: payload.data,
      context: context.data,
    },
    "*"
  )
  return true
}
