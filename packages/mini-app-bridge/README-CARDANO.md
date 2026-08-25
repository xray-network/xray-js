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
if (!signed) throw new Error("XRAY Cardano host is unavailable")
if (!signed.payload.success) throw new Error(signed.payload.error)

const submitted = await clientCardanoV1.submitTx(signed.payload.cbor)
const result = await clientCardanoV1.signAndSubmitTx(transactionCbor)
const signature = await clientCardanoV1.signData(address, data)

const stop = clientCardanoV1.listen("accountState", ({ payload, context }) => {
  console.log(payload, context.network)
})
```

Calls return correlated `{ payload, context, requestId }` responses or `null` on timeout. Every successful Cardano
response and event has a non-null Cardano context.

Native Cardano `signTx` returns the complete signed transaction CBOR and its hash. The hash is only the transaction
identifier; pass `payload.cbor` to a later `submitTx` call. `signAndSubmitTx` keeps both steps inside XRAY and returns
the submission result. The independent Cardano CIP-30 adapter follows CIP-30 instead: its `signTx` returns only a
witness set, which the caller must merge into the original transaction before submission.

Every non-null account snapshot has a required `balanceStatus` discriminator. `initializing` and `error` carry the
account addresses with null `state` and `delegation`; `ready` carries non-null `state` and nullable `delegation`.
Hosts answer `getAccountState` with the current snapshot and use `accountState` events only for future changes; an
initial event is not required.

Explorer identifiers are host-controlled nonempty strings. Existing values include `cardanoscan`, `cexplorer`,
`adastat`, and `xray`, but clients must handle unfamiliar identifiers generically. Adding another identifier does not
change the Cardano v1 schema or require a new protocol version.

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

if (account.data?.balanceStatus === "initializing") return <Spinner />
if (account.data?.balanceStatus === "error" || account.error) return <AccountError />
if (account.data?.balanceStatus === "ready") return <Balance state={account.data.state} />
```

Remote hooks expose `{ data, loading, error, refresh }`. Interactive hooks expose their named operation plus
`pending`, `result`, `error`, and `reset`. `useAccountState()` subscribes before its initial request and retries only an
`initializing` balance after 250, 500, 1000, and 2000 milliseconds. It shares that bounded sequence across consumers,
stops on ready/error or unmount, and reports exhaustion through `error`; components must not add timers or a separate
bootstrap listener. No handshake, Provider, capability check, or adapter factory is required.

The XRAY App host remains responsible for trusted origins, selected-account validity, and authorization of signing and
submission requests.
