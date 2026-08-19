# Mini App Bridge Cardano v1

Cardano v1 owns XRAY's native Cardano operations. Its wire route is `scope: "cardano"` and `version: "v1"`; it is
independent from the Cardano CIP-30 adapter.

## Client

```ts
import { clientCardanoV1 } from "@xray-network/xray-js/mini-app-bridge"

const tip = await clientCardanoV1.getTip()
const account = await clientCardanoV1.getAccountState()
const explorer = await clientCardanoV1.getExplorer()

const signed = await clientCardanoV1.signTx(transactionCbor)
const submitted = await clientCardanoV1.submitTx(transactionCbor)
const result = await clientCardanoV1.signAndSubmitTx(transactionCbor)
const signature = await clientCardanoV1.signData(address, data)

const stop = clientCardanoV1.listen("accountState", ({ payload, context }) => {
  console.log(payload, context.network)
})
```

Calls return correlated `{ payload, context, requestId }` responses or `null` on timeout. Every successful Cardano
response and event has a non-null Cardano context.

## Host

```ts
import { hostCardanoV1 } from "@xray-network/xray-js/mini-app-bridge"

const context = { blockchain: "cardano", network: "mainnet" } as const

const stop = hostCardanoV1.handle(iframe.contentWindow, "getTip", async () => ({
  result: await loadTip(),
  context,
}))

hostCardanoV1.publish(iframe.contentWindow, "accountState", accountState, context)
```

`listen()` supports manual relays; `handle()` sends validated correlated results; `respond()` sends a result manually;
and `publish()` emits `tip`, `accountState`, or `explorer` changes. Unsupported methods and scope/version pairs receive
typed bridge errors immediately. A handler may throw `BridgeError` to return a typed host failure.

## React

```tsx
import { cardanoV1 } from "@xray-network/xray-js/mini-app-bridge/react"

const tip = cardanoV1.useTip()
const account = cardanoV1.useAccountState()
const explorer = cardanoV1.useExplorer()
const signing = cardanoV1.useSignTx()
```

Remote hooks expose `{ data, loading, error, refresh }`. Interactive hooks expose their named operation plus
`pending`, `result`, `error`, and `reset`. No handshake, Provider, capability check, or adapter factory is required.

The XRAY App host remains responsible for trusted origins, selected-account validity, and authorization of signing and
submission requests.
