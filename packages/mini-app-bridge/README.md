# XRAY Mini App Bridge

`@xray-network/xray-js-mini-app-bridge` is the scope-versioned iframe bridge used by XRAY mini apps and embedding
hosts. The same API is available from `@xray-network/xray-js/mini-app-bridge`.

The bridge has no handshake, session, capability list, or version negotiation. Each request, response, and event
carries an independent adapter `scope` and string `version`. These values select schemas and handlers; XRAY App still
owns iframe trust, origin checks, user consent, and operation authorization.

## Core adapters

```ts
import {
  clientPlatformV1,
  clientCardanoV1,
  clientCardanoCip30V1,
  hostPlatformV1,
  hostCardanoV1,
  hostCardanoCip30V1,
} from "@xray-network/xray-js/mini-app-bridge"
```

### Client

```ts
const status = await clientPlatformV1.getStatus()

if (status?.context?.blockchain === "cardano") {
  const tip = await clientCardanoV1.getTip()
  console.log(tip?.payload)
}

const wallet = await clientCardanoCip30V1.enable()
console.log(await wallet.getNetworkId())
```

### Host

```ts
const account = { blockchain: "cardano", network: "preview" } as const
const identity = { host: "xray.app" } as const

const stopTheme = hostPlatformV1.handle(iframe.contentWindow, "getTheme", () => ({
  result: "dark",
  context: account,
}))

const stopTip = hostCardanoV1.handle(iframe.contentWindow, "getTip", async () => ({
  result: await loadTip(),
  context: account,
}))

hostPlatformV1.publish(iframe.contentWindow, "status", identity, account)
```

A production host must validate the trusted iframe origin in addition to the SDK's source-window check.

## React

React is an optional subpath with direct versioned adapters and no Provider:

```tsx
import { platformV1, cardanoV1 } from "@xray-network/xray-js/mini-app-bridge/react"

export function Status() {
  const status = platformV1.useStatus()
  const tip = cardanoV1.useTip()

  if (status.loading) return <p>Loading…</p>
  if (status.error) return <p>XRAY host is unavailable</p>
  if (status.data?.account?.blockchain !== "cardano") return <p>Select a Cardano account</p>
  return <p>Block {tip.data?.blockNo ?? "loading"}</p>
}
```

## Adapter guides

- [Platform v1](./README-PLATFORM.md)
- [Cardano v1](./README-CARDANO.md)
- [Cardano CIP-30 v1](./README-CARDANO-CIP30.md)

XRAY App and deployed mini apps require a coordinated migration before using this wire protocol.
