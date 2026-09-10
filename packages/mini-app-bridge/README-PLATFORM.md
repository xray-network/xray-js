# Mini App Bridge Platform v1

Platform owns host settings and identity. Its route remains `scope: "platform"`, `version: "v1"`.

## Client

```ts
import { clientPlatformV1, type PlatformResponse } from "@xray-network/xray-js/mini-app-bridge"

const status: PlatformResponse<"getStatus"> = await clientPlatformV1.getStatus()
if (status.ok) {
  console.log(status.payload.host) // xray.app
  console.log(status.context) // Selected blockchain/network, or null.
} else {
  console.error(status.error.code, status.error.message)
}

const locale = await clientPlatformV1.getLocale()
if (locale.ok) console.log(locale.payload)

clientPlatformV1.routeChanged("/swap")
const stop = clientPlatformV1.listen("theme", (event) => {
  console.log(event.scope, event.version, event.event, event.payload)
})
```

Methods are `getTheme`, `getCurrency`, `getLocale`, `getHideBalances`, `getStatus`, and `routeChanged`.
Use named `PlatformRequest<M>`, `PlatformResponse<M>`, and `PlatformEvent<E>` imports for message types.
Getters return the complete correlated `ok` outcome. `getStatus` success payload is `{ host: "xray.app" }`; selected
account information is in `context`. `context: null` is distinct from a failed request.

`routeChanged` is a send-only notification: its boolean reports whether sending succeeded, not whether the host accepted
the route. Events are `theme`, `currency`, `hideBalances`, `status`, and `routeChanged`. Locale is a nonempty host-owned
identifier such as `en-US`; it is request-only and has no event or React hook.

## Host

```ts
import { hostPlatformV1 } from "@xray-network/xray-js/mini-app-bridge"

declare const iframe: HTMLIFrameElement
const context = { blockchain: "cardano", network: "preview" } as const
const stop = hostPlatformV1.handle(iframe.contentWindow, "getStatus", () => ({
  ok: true,
  payload: { host: "xray.app" },
  context,
}))
hostPlatformV1.publish(iframe.contentWindow, "status", { host: "xray.app" }, context)
```

`listen` supports manual relays. `respond(iframe, method, requestId, outcome)` accepts the same success/failure outcome
as `handle`. Registering a listener or handler marks this adapter route as supported. Unknown methods and routes receive
typed errors. A supported method with only a manual listener waits for that listener to respond.

## React

```ts
import { platformV1 } from "@xray-network/xray-js/mini-app-bridge/react"

export function useHostStatus() {
  const { data, loading, error, refresh } = platformV1.useStatus()
  return { host: data?.host, account: data?.account, loading, error, refresh }
}
```

`useTheme`, `useCurrency`, `useHideBalances`, and `useStatus` expose `{ data, loading, error, refresh }`. Stores load
lazily, share subscriptions, and stop remote listeners after the last consumer unsubscribes. Status data projects
`{ host, account: context }`. `data.account: null` means no selected account; `data: undefined` means not loaded.
Failures expose their bridge code/message/data in `error`.

The host marker and route metadata do not prove trust or grant access. See the [shared contract and prerelease update](./README.md).
