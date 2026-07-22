import type { HostMessage, Cip30HostMessage } from "../protocol"
import { dispatchMessageEvent } from "./events"

export type MockClient = {
  /** Fake iframe window; pass it to host SDK helpers as the `iframe` argument. */
  clientWindow: Window
  /** Every host -> client message received, in order. */
  received: (HostMessage | Cip30HostMessage)[]
  /** Emit a client -> host message as if the mini app posted it. Returns the requestId. */
  send: (type: string, payload: unknown, requestId?: string) => string
  /** Resolve once a host -> client message of the given type arrives. */
  waitFor: (type: string, timeout?: number) => Promise<HostMessage | Cip30HostMessage>
}

export type MockClientOptions = {
  /** Window the host app code is listening on. Defaults to the global window. */
  target?: Window
}

/**
 * Create a fake mini app for testing host apps (host SDK consumers) without an
 * iframe. Host code treats `clientWindow` as the iframe's contentWindow: SDK
 * `send*` helpers deliver into `received`, and `send()` fires client messages
 * at the host's `listen`/`listenAll` subscriptions.
 */
export const createMockClient = (options: MockClientOptions = {}): MockClient => {
  const target = options.target ?? window
  const received: (HostMessage | Cip30HostMessage)[] = []
  const waiters: { type: string; resolve: (message: HostMessage | Cip30HostMessage) => void }[] = []

  const clientWindow = {
    postMessage: (data: unknown) => {
      const { type, payload, requestId } = (data ?? {}) as { type?: string; payload?: unknown; requestId?: string }
      if (typeof type !== "string") return
      const message = { type, payload, requestId } as HostMessage | Cip30HostMessage
      received.push(message)
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (waiters[i].type === type) {
          waiters[i].resolve(message)
          waiters.splice(i, 1)
        }
      }
    },
  } as unknown as Window

  let requestCounter = 0

  return {
    clientWindow,
    received,
    send: (type, payload, requestId = `mock-client-${++requestCounter}`) => {
      dispatchMessageEvent(target, { type, payload, requestId }, clientWindow)
      return requestId
    },
    waitFor: (type, timeout = 1_000) => {
      const existing = received.find((message) => message.type === type)
      if (existing) return Promise.resolve(existing)
      return new Promise((resolve, reject) => {
        const waiter = { type, resolve: (message: HostMessage | Cip30HostMessage) => resolve(message) }
        waiters.push(waiter)
        setTimeout(() => {
          const index = waiters.indexOf(waiter)
          if (index === -1) return
          waiters.splice(index, 1)
          reject(new Error(`Timeout waiting for host message ${type}`))
        }, timeout)
      })
    },
  }
}
