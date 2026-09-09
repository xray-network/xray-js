import type { Context, Request, Contract, EventName, MethodName, EventPayload, Outcome, MethodResult } from "./types.js"
import {
  BridgeError,
  toBridgeErrorPayload,
  requestMessageSchema,
  type RequestMessage,
  parseRequest,
  createResponse,
  createErrorResponse,
  createEvent,
} from "./messages.js"

type RequestListener = (request: Request<Contract>) => void
type RequestHandler = (request: Request<Contract>) => Promise<Outcome<unknown, unknown>>

type Registration = {
  contract: Contract
  refs: number
  listeners: Set<RequestListener>
  handlers: Map<string, Set<RequestHandler>>
}

type Router = {
  registrations: Map<string, Registration>
  receive: (event: MessageEvent) => void
}

const routers = new WeakMap<Window, Router>()
const keyOf = (contract: Contract) => `${contract.scope}\u0000${contract.version}`

const postError = (iframe: Window, request: RequestMessage, error: unknown) => {
  try {
    iframe.postMessage(createErrorResponse(request, toBridgeErrorPayload(error)), "*")
  } catch {
    /* The frame may have closed or become unavailable. */
  }
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
    let typedRequest: Request<Contract>
    try {
      typedRequest = parseRequest(registration.contract, request)
    } catch (error) {
      postError(iframe, request, error)
      return
    }
    try {
      registration.listeners.forEach((listener) => listener(typedRequest))
    } catch (error) {
      postError(iframe, request, error)
      return
    }
    const handler = registration.handlers.get(request.method)?.values().next().value
    if (!handler) return
    void handler(typedRequest)
      .then((outcome) => iframe.postMessage(createResponse(registration.contract, typedRequest, outcome), "*"))
      .catch((error: unknown) => postError(iframe, request, error))
  }
  window.addEventListener("message", router.receive)
  routers.set(iframe, router)
  return router
}

const acquire = (iframe: Window, contract: Contract) => {
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

export const listen = <C extends Contract>(
  contract: C,
  iframe: Window | null | undefined,
  handler: (request: Request<C>) => void
) => {
  if (!iframe || typeof window === "undefined") return () => undefined
  const { registration, release } = acquire(iframe, contract)
  registration.listeners.add(handler as RequestListener)
  return () => {
    registration.listeners.delete(handler as RequestListener)
    release()
  }
}

export const handle = <C extends Contract, Method extends MethodName<C>>(
  contract: C,
  iframe: Window | null | undefined,
  method: Method,
  handler: (
    request: Request<C, Method>
  ) => Outcome<MethodResult<C, Method>, Context<C>> | Promise<Outcome<MethodResult<C, Method>, Context<C>>>
) => {
  if (!iframe || typeof window === "undefined") return () => undefined
  const { registration, release } = acquire(iframe, contract)
  const handlers = registration.handlers.get(method) ?? new Set<RequestHandler>()
  const typedHandler: RequestHandler = async (request) => handler(request as Request<C, Method>)
  handlers.add(typedHandler)
  registration.handlers.set(method, handlers)
  return () => {
    handlers.delete(typedHandler)
    if (handlers.size === 0) registration.handlers.delete(method)
    release()
  }
}

export const respond = <C extends Contract, Method extends MethodName<C>>(
  contract: C,
  iframe: Window | null | undefined,
  method: Method,
  requestId: string,
  outcome: Outcome<MethodResult<C, Method>, Context<C>>
) => {
  if (!iframe) return false
  iframe.postMessage(createResponse(contract, { method, requestId }, outcome), "*")
  return true
}

export const publish = <C extends Contract, Event extends EventName<C>>(
  contract: C,
  iframe: Window | null | undefined,
  event: Event,
  payloadValue: EventPayload<C, Event>,
  contextValue: Context<C>
) => {
  if (!iframe) return false
  iframe.postMessage(createEvent(contract, event, payloadValue, contextValue), "*")
  return true
}

/** Bind one adapter to the shared router and validation paths. */
export const bindHost = <C extends Contract>(contract: C) => ({
  scope: contract.scope as C["scope"],
  version: contract.version as C["version"],
  listen: (iframe: Window | null | undefined, handler: (request: Request<C>) => void) =>
    listen(contract, iframe, handler),
  handle: <M extends MethodName<C>>(
    iframe: Window | null | undefined,
    method: M,
    handler: (
      request: Request<C, M>
    ) => Outcome<MethodResult<C, M>, Context<C>> | Promise<Outcome<MethodResult<C, M>, Context<C>>>
  ) => handle(contract, iframe, method, handler),
  respond: <M extends MethodName<C>>(
    iframe: Window | null | undefined,
    method: M,
    requestId: string,
    outcome: Outcome<MethodResult<C, M>, Context<C>>
  ) => respond(contract, iframe, method, requestId, outcome),
  publish: <E extends EventName<C>>(
    iframe: Window | null | undefined,
    event: E,
    payload: EventPayload<C, E>,
    context: Context<C>
  ) => publish(contract, iframe, event, payload, context),
})
