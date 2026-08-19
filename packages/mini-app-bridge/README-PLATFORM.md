# Mini App Bridge Platform v1

Platform v1 owns XRAY host state that is independent of wallet operations. Its wire route is `scope: "platform"` and
`version: "v1"`.

## Client

```ts
import { clientPlatformV1 } from "@xray-network/xray-js/mini-app-bridge"

const status = await clientPlatformV1.getStatus()
const theme = await clientPlatformV1.getTheme()
const currency = await clientPlatformV1.getCurrency()
const hideBalances = await clientPlatformV1.getHideBalances()

clientPlatformV1.routeChanged("/swap")
const stop = clientPlatformV1.listen("status", ({ payload, context }) => {
  console.log(payload, context)
})
```

`getStatus()` returns the same correlated envelope as the other getters: `{ payload: { host: "xray.app" }, context,
requestId }`. `context` is the selected `{ blockchain: "cardano", network }` or `null`; only the context is nullable.
A `null` response means the platform host did not answer before the timeout. The status selects application behavior
only; it is not a handshake, proof of trust, wallet grant, or operation authorization.

## Host

```ts
import { hostPlatformV1 } from "@xray-network/xray-js/mini-app-bridge"

const account = { blockchain: "cardano", network: "preview" } as const
const identity = { host: "xray.app" } as const

const stop = hostPlatformV1.handle(iframe.contentWindow, "getStatus", () => ({
  result: identity,
  context: account,
}))

hostPlatformV1.publish(iframe.contentWindow, "status", identity, account)
```

`listen()` receives all validated platform requests for manual relays. `handle()` installs an automatic typed handler,
`respond()` sends a manual correlated result, and `publish()` sends an event. Registering any platform listener or
handler marks `platform/v1` as supported for that iframe. Unknown methods receive `UNSUPPORTED_METHOD`; unknown
scope/version pairs receive `UNSUPPORTED_SCOPE_VERSION`.

Platform methods are `getTheme`, `getCurrency`, `getHideBalances`, `getStatus`, and `routeChanged`. Events are `theme`,
`currency`, `hideBalances`, `status`, and `routeChanged`.

## React

```tsx
import { platformV1 } from "@xray-network/xray-js/mini-app-bridge/react"

const { data, loading, error, refresh } = platformV1.useStatus()
```

`useTheme`, `useCurrency`, `useHideBalances`, and `useStatus` request lazily, share one store per value, subscribe only
to platform v1 events, and clean up the host listener after the last component unmounts. React projects the wire
envelope into `{ host, account: context }` for convenience. `data.account: null` means the
XRAY host answered without a selected account; `data: undefined` is not loaded, while `error` records an unavailable or
failed host request.

Scope, version, and the self-reported `host` marker are routing or identification metadata, not consent or trust. The
embedding XRAY App must validate origins and enforce permissions.
