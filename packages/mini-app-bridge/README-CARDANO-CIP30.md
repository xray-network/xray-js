# Mini App Bridge Cardano CIP-30 v1

Cardano CIP-30 v1 owns the browser-wallet-compatible API. Its wire route is `scope: "cardano-cip30"` and
`version: "v1"`; support for native Cardano bridge methods does not imply CIP-30 support or access.

## Client

```ts
import { clientCardanoCip30V1 } from "@xray-network/xray-js/mini-app-bridge"

const wallet = await clientCardanoCip30V1.enable()
const networkId = await wallet.getNetworkId()
const balance = await wallet.getBalance()

clientCardanoCip30V1.installConnector() // optional window.cardano.xrayBridge compatibility
```

The direct adapter exposes `isEnabled`, `enable`, connector metadata, and the enabled API methods: `getExtensions`,
`getNetworkId`, `getUtxos`, `getCollateral`, `getBalance`, `getUsedAddresses`, `getUnusedAddresses`,
`getChangeAddress`, `getRewardAddresses`, `signTx`, `signData`, and `submitTx`.

`enable()` is the authorization request. A host can reject it even when the adapter is registered. Correlated host
failures with CIP-30 `{ code, info }` data are rethrown with those CIP-30 fields; generic routing errors use
`BridgeError`.

## Host

```ts
import { hostCardanoCip30V1 } from "@xray-network/xray-js/mini-app-bridge"

declare const iframe: HTMLIFrameElement
declare function authorizeWallet(extensions: { cip: number }[]): Promise<boolean>
const context = { blockchain: "cardano", network: "preview" } as const

const stop = hostCardanoCip30V1.handle(iframe.contentWindow, "enable", async ({ payload }) => ({
  ok: true,
  payload: await authorizeWallet(payload.extensions),
  context,
}))
```

Use `listen()` for a manual relay, `handle()` for an automatic typed result, `respond()` for a manual correlated result,
and `publish()` for supported state events. Unknown methods or adapter versions receive immediate typed bridge errors.
The host must still enforce iframe origin, trust, account access, and per-operation permissions.

## React

```tsx
import { cardanoCip30V1 } from "@xray-network/xray-js/mini-app-bridge/react"

export function useWalletConnector() {
  return cardanoCip30V1.useConnector()
}
```

`useConnector()` installs the same connector idempotently after subscription. CIP-30 operations remain event-handler
calls on `clientCardanoCip30V1`; they do not require a Provider or handshake.

## Shared transport

Use named `Cip30Request<M>`, `Cip30Response<M>`, and `Cip30Event<E>` imports to describe bridge messages.
For example, a successful network query has this wire response:

```ts
import type { Cip30Response } from "@xray-network/xray-js/mini-app-bridge"

const response: Cip30Response<"getNetworkId"> = {
  type: "xray.bridge.response",
  scope: "cardano-cip30",
  version: "v1",
  method: "getNetworkId",
  requestId: "network-1",
  ok: true,
  payload: 0,
  context: { blockchain: "cardano", network: "preview" },
}
```

CIP-30 uses the same `ok` response envelope internally. The public wallet methods return standard payloads on success;
failures containing validated `{ code, info }` data become CIP-30 exceptions, and other failures become `BridgeError`
with the original bridge code/message/data. Native Cardano methods expose the envelope directly.

CIP-30 host handlers and manual `respond` calls use `{ ok: true, payload, context }` or `{ ok: false, error }`.
Its wire version and export names stay unchanged. See the [shared contract and prerelease update](./README.md).
