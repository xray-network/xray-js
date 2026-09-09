# XRAY Mini App Bridge

`@xray-network/xray-js-mini-app-bridge` connects iframe mini apps and embedding hosts. The same exports are available
from `@xray-network/xray-js/mini-app-bridge`. React and testing utilities have separate optional entries.

Requests, responses, and events carry an adapter `scope` and `version`. Responses also retain `method` and `requestId`,
so they identify both the operation and the particular call. The bridge has no handshake, Provider, capability list,
or version negotiation. The embedding host owns origin checks, trust, selected-account validity, and authorization.

## Client

Platform and native Cardano methods resolve to one outcome. Check `ok` before reading `payload` or `error`:

```ts
import { clientPlatformV1, clientCardanoV1 } from "@xray-network/xray-js/mini-app-bridge"

declare const unsignedCbor: string
const theme = await clientPlatformV1.getTheme()
if (theme.ok)
  console.log(theme.method, theme.payload) // getTheme, light | dark
else console.error(theme.error.code, theme.error.message)

const signed = await clientCardanoV1.signTx(unsignedCbor)
if (signed.ok) {
  console.log(signed.payload.hash, signed.payload.cbor)
} else {
  console.error(signed.error.code, signed.error.message)
}
```

An absent host, timeout, invalid request, invalid reply, or operation failure returns `ok: false`. A successful query
can still return `payload: null` when no account or tip is available. Platform success context can be null when no
account is selected; Cardano success context always contains the blockchain and network.

## Request and response types

Import message types directly from the package. Each adapter has schema-derived request, response, and event types:

| Adapter        | Request              | Response              | Event              |
| -------------- | -------------------- | --------------------- | ------------------ |
| Platform       | `PlatformRequest<M>` | `PlatformResponse<M>` | `PlatformEvent<E>` |
| Native Cardano | `CardanoRequest<M>`  | `CardanoResponse<M>`  | `CardanoEvent<E>`  |
| CIP-30 wire    | `Cip30Request<M>`    | `Cip30Response<M>`    | `Cip30Event<E>`    |

Omit the parameter to get a union of all methods/events. Narrow collections by `scope`, `method` or `event`, and `ok`.
Domain types such as `AccountState`, `Theme`, and `Cip30Pagination` are also named exports. Host handlers use the
small `Outcome<Payload, Context>` union; generic integrations can use `Contract`, `Request<C, M>`, `Response<C, M>`,
and `Event<C, E>` from the root or `protocol` namespace.

```ts
import type { PlatformRequest, PlatformResponse } from "@xray-network/xray-js/mini-app-bridge"

type GetThemeRequest = PlatformRequest<"getTheme">
type GetThemeResponse = PlatformResponse<"getTheme">

const request: GetThemeRequest = {
  type: "xray.bridge.request",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId: "req-123",
  payload: null,
}

const response: GetThemeResponse = {
  type: "xray.bridge.response",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId: "req-123",
  ok: true,
  payload: "dark",
  context: null,
}

const failure: GetThemeResponse = {
  type: "xray.bridge.response",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId: "req-123",
  ok: false,
  error: { code: "TIMEOUT", message: "XRAY host did not respond to getTheme" },
}
```

The wire and native SDK response use the same shape. A failure has no `payload` or `context`. Events carry `type`,
`scope`, `version`, `event`, `payload`, and `context`; events have neither `ok` nor `requestId`.

## Host and shared protocol

Automatic handlers and manual responses use `{ ok: true, payload, context }` or `{ ok: false, error }`. The SDK adds
correlation metadata and validates the result. `listen` receives complete validated requests; `respond` sends a
manual outcome; `publish` sends an event.

```ts
import { hostPlatformV1, hostCardanoV1 } from "@xray-network/xray-js/mini-app-bridge"

declare const iframe: HTMLIFrameElement
const context = { blockchain: "cardano", network: "preview" } as const
const stopTheme = hostPlatformV1.handle(iframe.contentWindow, "getTheme", () => ({
  ok: true,
  payload: "dark",
  context,
}))
const stopSigning = hostCardanoV1.handle(iframe.contentWindow, "signTx", () => ({
  ok: false,
  error: { code: "USER_REJECTED", message: "Signing was rejected" },
}))
hostPlatformV1.publish(iframe.contentWindow, "theme", "dark", context)
```

Hosts that own their message listener can reuse the `protocol` namespace instead of defining duplicate envelopes:

```ts
import { protocol } from "@xray-network/xray-js/mini-app-bridge"

declare const incoming: unknown // Supplied by the host after checking source and trusted origin.
const contract = protocol.platformV1Contract
const request = protocol.parseRequest(contract, incoming)
if (request.method === "getTheme") {
  const response = protocol.createResponse(contract, request, { ok: true, payload: "dark", context: null })
  console.log(response)
}
```

`protocol` exports all three contracts, envelope schemas/types, `parseRequest`, `parseResponse`, `parseEvent`,
`createResponse`, `createErrorResponse`, and `createEvent`. Contract-aware parsers and constructors throw for invalid
input; client calls convert expected failures into outcomes. Hosts must validate the trusted origin as well as the
source window. The SDK's default transport performs the source check and does not replace host authorization.

## Errors

| Code                        | Meaning                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `HOST_UNAVAILABLE`          | No browser or parent host is available.                          |
| `TIMEOUT`                   | The host did not reply before the deadline.                      |
| `TRANSPORT_ERROR`           | Sending the request failed.                                      |
| `INVALID_REQUEST`           | The request does not satisfy the contract.                       |
| `INVALID_RESPONSE`          | A correlated reply or host result does not satisfy the contract. |
| `UNSUPPORTED_SCOPE_VERSION` | The host does not support the adapter route.                     |
| `UNSUPPORTED_METHOD`        | The host does not support the requested method.                  |
| `USER_REJECTED`             | The host explicitly identified a user refusal.                   |
| `OPERATION_FAILED`          | A known native operation failed.                                 |
| `HOST_ERROR`                | The host encountered another error.                              |

Normal requests default to 5 seconds; interactive requests default to 120 seconds. A timeout does not establish
whether a signing/submission operation executed. The bridge does not retry these operations automatically.

CIP-30 uses this envelope internally but its public wallet API returns standard values and throws wallet/bridge errors.

## Source structure

The SDK has 17 source files. Each flat adapter module keeps its schemas, inferred types, explicit client methods,
and bound host together. The shared host binder uses one router and the same validation paths for every adapter.

```text
src/
  index.ts          # Public core exports
  protocol.ts       # Public schemas and message helpers
  types.ts          # Plain contract and direct message types
  messages.ts       # Envelope schemas, errors, parsers, and constructors
  client.ts         # Client transport
  host.ts           # Host router and adapter binding
  adapters/
    platform.ts
    cardano.ts
    cip30.ts        # Includes the wallet connector
  react/
    index.ts
    store.ts
    platform.ts
    cardano.ts      # Includes interactive state transitions
    cip30.ts        # Includes connector subscription
  testing/
    index.ts
    client.ts      # Includes message-event dispatch
    host.ts
```

Core imports do not load React. The `react` and `testing` entries remain separate. Internal transport imports
`messages.ts` directly; `protocol.ts` is the public barrel and imports adapter contracts.

## Guides and prerelease update

- [Platform v1](./README-PLATFORM.md)
- [Native Cardano v1](./README-CARDANO.md)
- [Cardano CIP-30 v1](./README-CARDANO-CIP30.md)

This is an in-place change to an unreleased library. Existing `V1` exports, `version: "v1"`, and package versions are
unchanged. The old wire `result`, top-level null responses, and nested native `payload.success` format are removed.
There is no legacy parser, fallback, or parallel adapter version.

Before release or combined use, update XRAY App's handlers/publications and mini-app response handling to this
contract. Runtime imports stay the same. Replace namespace type imports such as `clientCardanoV1.Response<"signTx">`
with the named import `CardanoResponse<"signTx">`; use the same named types for clients and hosts. The former
`ClientResponse`, `ClientEvent`, `HostRequest`, `HostResult`, and `Adapter*` message aliases are removed without shims.
XRAY App should reuse the shared protocol helpers and retain its origin, trust,
account, and permission checks. This SDK change does not update XRAY App or consumer repositories.

## Use without installing the SDK

Copy [bridge.js](./example/bridge.js) into your dapp for Platform/native Cardano communication. For the wallet API,
copy [bridge-cip30.js](./example/bridge-cip30.js) alongside it. These are plain browser ES modules with no npm
dependencies, TypeScript, or build step. Serve them with your dapp and use `type="module"` or import them from an
existing module. Replace the sample origin with the exact origin of the XRAY host embedding your iframe, including
its port in development.

```html
<script type="module">
  import { createBridge } from "./bridge.js"

  const bridge = createBridge("https://your-xray-host.example")
  const account = await bridge.cardano.getAccountState()
  if (account.ok) console.log(account.payload, account.context)
  else console.error(account.error.code, account.error.message)

  const stop = bridge.listen("platform", "theme", ({ payload }) => {
    document.documentElement.dataset.theme = payload
  })
  window.addEventListener("pagehide", stop, { once: true })
</script>
```

For an existing CIP-30 dapp, enable the connector from your Connect button and use the returned wallet API:

```html
<button id="connect">Connect XRAY</button>
<script type="module">
  import { createCip30 } from "./bridge-cip30.js"

  const connector = createCip30("https://your-xray-host.example")
  document.getElementById("connect").onclick = async () => {
    try {
      const wallet = await connector.enable()
      console.log(await wallet.getNetworkId(), await wallet.getBalance())
    } catch (error) {
      console.error(error.code, error.message)
    }
  }

  // Optional: register before your dapp scans for browser wallets.
  window.cardano ??= {}
  window.cardano.xrayBridge = connector
</script>
```

`bridge.platform` and `bridge.cardano` expose the methods shown in the adapter guides. For direct messages or a
custom deadline, use `bridge.request(scope, method, payload, timeoutMs)`; parameterless requests use `null`.
`bridge.listen(scope, eventName, handler)` returns an unsubscribe function. Native calls resolve to the full `ok`
response; CIP-30 calls return payloads and throw wallet/bridge errors. No handshake or wallet registration is needed
for native calls. Outside an iframe, calls report `HOST_UNAVAILABLE`.

The scripts check the parent window, configured origin, correlation metadata, and basic response/event envelopes.
They intentionally omit the SDK's full domain schema validation; validate the payload fields your dapp uses.
They require a host implementing the current v1 envelope described below. Requests default to 5 seconds, interactive
requests to 120 seconds; the CIP-30 example follows the adapter's existing deadlines. A timeout does not establish
whether an operation ran, so the scripts never retry signing or submission. Native `signTx` returns a complete signed
transaction in `payload.cbor` and its witness set in `payload.witnessSet`; CIP-30 `signTx` returns only the witness set
to merge into the original transaction.
