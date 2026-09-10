import type { z } from "zod"
import type { BridgeErrorPayload } from "./messages.js"

export type Contract = Readonly<{
  scope: string
  version: string
  methods: Record<string, { request: z.ZodTypeAny; result: z.ZodTypeAny }>
  events: Record<string, z.ZodTypeAny>
  context: z.ZodTypeAny
}>

export type MethodName<C extends Contract> = keyof C["methods"] & string
export type EventName<C extends Contract> = keyof C["events"] & string
export type MethodPayload<C extends Contract, M extends MethodName<C>> = z.infer<C["methods"][M]["request"]>
export type MethodResult<C extends Contract, M extends MethodName<C>> = z.infer<C["methods"][M]["result"]>
export type EventPayload<C extends Contract, E extends EventName<C>> = z.infer<C["events"][E]>
export type Context<C extends Contract> = z.infer<C["context"]>

export type Outcome<Payload, Context> = Readonly<
  { ok: true; payload: Payload; context: Context } | { ok: false; error: BridgeErrorPayload }
>

export type Request<C extends Contract, M extends MethodName<C> = MethodName<C>> = {
  [K in M]: Readonly<{
    type: "xray.bridge.request"
    scope: C["scope"]
    version: C["version"]
    method: K
    requestId: string
    payload: z.infer<C["methods"][K]["request"]>
  }>
}[M]

export type Response<C extends Contract, M extends MethodName<C> = MethodName<C>> = {
  [K in M]: Readonly<
    | {
        type: "xray.bridge.response"
        scope: C["scope"]
        version: C["version"]
        method: K
        requestId: string
        ok: true
        payload: z.infer<C["methods"][K]["result"]>
        context: z.infer<C["context"]>
      }
    | {
        type: "xray.bridge.response"
        scope: C["scope"]
        version: C["version"]
        method: K
        requestId: string
        ok: false
        error: BridgeErrorPayload
      }
  >
}[M]

export type Event<C extends Contract, E extends EventName<C> = EventName<C>> = {
  [K in E]: Readonly<{
    type: "xray.bridge.event"
    scope: C["scope"]
    version: C["version"]
    event: K
    payload: z.infer<C["events"][K]>
    context: z.infer<C["context"]>
  }>
}[E]
