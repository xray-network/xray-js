import { cip30ClientMessageSchemas } from "../cardano/cip30/protocol.js"
import { cardanoClientMessageSchemas } from "../cardano/protocol.js"
import { platformClientMessageSchemas } from "../platform/protocol.js"
import { listenAllClient } from "../transport/host.js"

export * as bridge from "../cardano/host.js"
export * as cip30 from "../cardano/cip30/host.js"

const clientMessageSchemas = {
  ...platformClientMessageSchemas,
  ...cardanoClientMessageSchemas,
  ...cip30ClientMessageSchemas,
}

/** Listen to every validated platform, Cardano Bridge, and CIP-30 client message. */
export const listenAll = (
  iframe: Window | null | undefined,
  handler: Parameters<typeof listenAllClient<typeof clientMessageSchemas>>[2]
) => listenAllClient(clientMessageSchemas, iframe, handler)
