# Mini App Bridge Cardano v1

The native Cardano adapter uses `scope: "cardano"`, `version: "v1"`. It is separate from the standard CIP-30 wallet API.

## Client

```ts
import { clientCardanoV1, type CardanoResponse } from "@xray-network/xray-js/mini-app-bridge"

declare const transactionCbor: string
const signed: CardanoResponse<"signTx"> = await clientCardanoV1.signTx(transactionCbor)
if (signed.ok) {
  const submitted = await clientCardanoV1.submitTx(signed.payload.cbor)
  if (submitted.ok) console.log(submitted.payload.hash)
  else console.error(submitted.error.code, submitted.error.message)
} else {
  console.error(signed.error.code, signed.error.message)
}

const account = await clientCardanoV1.getAccountState()
if (account.ok) console.log(account.payload, account.context.network)
const stop = clientCardanoV1.listen("accountState", (event) => console.log(event.payload, event.context.network))
```

Methods are `getTip`, `getAccountState`, `getExplorer`, `signTx`, `submitTx`, and `signData`.
Use named `CardanoRequest<M>`, `CardanoResponse<M>`, and `CardanoEvent<E>` imports for message types.
All methods resolve to correlated responses with `ok`; errors have code/message/data and no success payload. There is no
nested `success` flag. Success payloads are:

| Operation  | Payload                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `signTx`   | `{ hash, cbor, witnessSet }`, the signed transaction and its witnesses. |
| `submitTx` | `{ hash }`. Submission does not request another signing approval.       |
| `signData` | `{ data }`.                                                             |

Pass native `signTx`'s `payload.cbor` to `submitTx`. The separate CIP-30 `signTx` returns only a witness set, which the
caller must merge with the original transaction.

Successful responses/events require a Cardano context. Account and tip payloads can be null. A non-null account has
`balanceStatus: "initializing"`, `"ready"`, or `"error"`. Initializing/error snapshots have account addresses but null
state/delegation; ready snapshots have state and nullable delegation. A delivered error snapshot is still `ok: true`.
Account quantities retain bigint values through structured cloning.

Explorer identifiers are nonempty host-owned strings; handle unfamiliar values generically.

## Host

```ts
import { hostCardanoV1 } from "@xray-network/xray-js/mini-app-bridge"

declare const iframe: HTMLIFrameElement
const context = { blockchain: "cardano", network: "preview" } as const
const stop = hostCardanoV1.handle(iframe.contentWindow, "getTip", () => ({ ok: true, payload: null, context }))
const stopSigning = hostCardanoV1.handle(iframe.contentWindow, "signTx", () => ({
  ok: false,
  error: { code: "USER_REJECTED", message: "Signing was rejected" },
}))
hostCardanoV1.publish(iframe.contentWindow, "accountState", null, context)
```

Use `USER_REJECTED` only when the host explicitly identifies refusal; use `OPERATION_FAILED` for another known native
operation failure. Do not infer error codes from message strings. Unexpected handler exceptions become `HOST_ERROR`.
Manual `respond` takes the same outcome as `handle`. Events are `tip`, `accountState`, and `explorer`.

## React

```ts
import { cardanoV1 } from "@xray-network/xray-js/mini-app-bridge/react"

export function useSigningAction() {
  const { signTx, pending, result, error, reset } = cardanoV1.useSignTx()
  return { signTx, pending, signedCbor: result?.ok ? result.payload.cbor : undefined, error, reset }
}
```

Read hooks expose `{ data, loading, error, refresh }`. Interactive hooks expose their named method plus
`pending`, `result`, `error`, and `reset`. Their method resolves to the complete response union; `result` retains it,
and a failed outcome also populates `error`. Expected failures do not require try/catch.

`useAccountState` subscribes before loading, shares retries of initializing snapshots at 250, 500, 1000, and 2000 ms,
and stops on ready/error or unmount. Retry exhaustion appears in hook error. Newer events take precedence over older
request results. Interactive operations are never automatically retried.

XRAY App remains responsible for trusted origins, account validity, and operation authorization.
See the [shared contract and prerelease update](./README.md).
