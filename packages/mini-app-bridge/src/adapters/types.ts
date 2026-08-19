import type { z } from "zod"

export type MethodContract = Readonly<{
  request: z.ZodTypeAny
  result: z.ZodTypeAny
}>

export type AdapterContract<
  Scope extends string = string,
  Version extends string = string,
  Methods extends Record<string, MethodContract> = Record<string, MethodContract>,
  Events extends Record<string, z.ZodTypeAny> = Record<string, z.ZodTypeAny>,
  Context = unknown,
> = Readonly<{
  scope: Scope
  version: Version
  methods: Methods
  events: Events
  context: z.ZodType<Context>
}>

export type AdapterMethodName<Contract extends AdapterContract> = keyof Contract["methods"] & string
export type AdapterEventName<Contract extends AdapterContract> = keyof Contract["events"] & string

export type MethodPayload<Contract extends AdapterContract, Method extends AdapterMethodName<Contract>> = z.infer<
  Contract["methods"][Method]["request"]
>

export type MethodResult<Contract extends AdapterContract, Method extends AdapterMethodName<Contract>> = z.infer<
  Contract["methods"][Method]["result"]
>

export type EventPayload<Contract extends AdapterContract, Event extends AdapterEventName<Contract>> = z.infer<
  Contract["events"][Event]
>

export type AdapterContext<Contract extends AdapterContract> = z.infer<Contract["context"]>

export type ClientResponse<Payload, Context> = Readonly<{
  payload: Payload
  context: Context
  requestId: string
}>

export type ClientEvent<Event extends string, Payload, Context> = Readonly<{
  event: Event
  payload: Payload
  context: Context
}>

export type HostRequest<Method extends string, Payload> = Readonly<{
  method: Method
  payload: Payload
  requestId: string
}>

export type HostResult<Payload, Context> = Readonly<{
  result: Payload
  context: Context
}>
