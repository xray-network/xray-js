import {
  eventMessageSchema,
  responseMessageSchema,
  type EventMessage,
  type RequestMessage,
  type ResponseMessage,
} from "../transport/messages.js"
import { dispatchMessageEvent } from "./events.js"

export type MockClientMessage = ResponseMessage | EventMessage

export type MockClient = {
  clientWindow: Window
  received: MockClientMessage[]
  send: (scope: string, method: string, payload: unknown, requestId?: string, version?: string) => string
  waitFor: (predicate: (message: MockClientMessage) => boolean, timeout?: number) => Promise<MockClientMessage>
}

export type MockClientOptions = { target?: Window }

export const createMockClient = ({ target = window }: MockClientOptions = {}): MockClient => {
  const received: MockClientMessage[] = []
  const waiters: {
    predicate: (message: MockClientMessage) => boolean
    resolve: (message: MockClientMessage) => void
  }[] = []
  const clientWindow = {
    postMessage: (data: unknown) => {
      const response = responseMessageSchema.safeParse(data)
      const event = eventMessageSchema.safeParse(data)
      const message = response.success ? response.data : event.success ? event.data : null
      if (!message) return
      received.push(message)
      for (let index = waiters.length - 1; index >= 0; index--) {
        const waiter = waiters[index]
        if (!waiter.predicate(message)) continue
        waiter.resolve(message)
        waiters.splice(index, 1)
      }
    },
  } as unknown as Window
  let counter = 0
  return {
    clientWindow,
    received,
    send: (scope, method, payload, requestId = `mock-client-${++counter}`, version = "v1") => {
      dispatchMessageEvent(
        target,
        { type: "xray.bridge.request", scope, version, method, requestId, payload } satisfies RequestMessage,
        clientWindow
      )
      return requestId
    },
    waitFor: (predicate, timeout = 1_000) => {
      const existing = received.find(predicate)
      if (existing) return Promise.resolve(existing)
      return new Promise((resolve, reject) => {
        const waiter = { predicate, resolve }
        waiters.push(waiter)
        setTimeout(() => {
          const index = waiters.indexOf(waiter)
          if (index < 0) return
          waiters.splice(index, 1)
          reject(new Error("Timeout waiting for bridge message"))
        }, timeout)
      })
    },
  }
}
