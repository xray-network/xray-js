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

const context = { blockchain: "cardano", network: "preview" } as const

const stop = hostCardanoCip30V1.handle(iframe.contentWindow, "enable", async ({ payload }) => ({
  result: await authorizeWallet(payload.extensions),
  context,
}))
```

Use `listen()` for a manual relay, `handle()` for an automatic typed result, `respond()` for a manual correlated result,
and `publish()` for supported state events. Unknown methods or adapter versions receive immediate typed bridge errors.
The host must still enforce iframe origin, trust, account access, and per-operation permissions.

## React

```tsx
import { cardanoCip30V1 } from "@xray-network/xray-js/mini-app-bridge/react"

const connector = cardanoCip30V1.useConnector()
```

`useConnector()` installs the same connector idempotently after subscription. CIP-30 operations remain event-handler
calls on `clientCardanoCip30V1`; they do not require a Provider or handshake.
