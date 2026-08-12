import { cip30HostMessageSchemas } from "../cardano/cip30/protocol.js"
import { cardanoHostMessageSchemas } from "../cardano/protocol.js"
import { platformHostMessageSchemas } from "../platform/protocol.js"
import { listenAllHost } from "../transport/client.js"
import { cardanoHostContextSchema, type CardanoHostContext } from "../transport/context.js"

export * as bridge from "../cardano/client.js"
export * as cip30 from "../cardano/cip30/client.js"

const hostMessageSchemas = {
  ...platformHostMessageSchemas,
  ...cardanoHostMessageSchemas,
  ...cip30HostMessageSchemas,
}

/** Listen to every validated platform, Cardano Bridge, and CIP-30 host message. */
export const listenAll = (
  handler: Parameters<typeof listenAllHost<typeof hostMessageSchemas, CardanoHostContext>>[1]
) => listenAllHost(hostMessageSchemas, handler, cardanoHostContextSchema)
