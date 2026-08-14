# XRAY JavaScript SDK

`@xray-network/xray-js` is the multi-chain JavaScript SDK for XRAY/Network. Its public APIs use explicit blockchain and feature subpaths so implementations remain independent and applications load only the modules they select. The package root intentionally exports nothing.

## Installation

```bash
npm install @xray-network/xray-js
```

## Blockchain examples

| Blockchain | Status      | Public API                                                     |
| ---------- | ----------- | -------------------------------------------------------------- |
| Cardano    | Available   | `/cardano` and `/cardano/lib`                                  |
| Bitcoin    | Placeholder | Planned; no Bitcoin runtime entry point is currently exported  |
| Midnight   | Placeholder | Planned; no Midnight runtime entry point is currently exported |

### Cardano

#### Application client

Create a Cardano client through the explicit Cardano entry point:

```ts
import { createCardano } from "@xray-network/xray-js/cardano"

const cardano = createCardano({
  network: "preview",
  protocolParameters: {
    source: "remote",
    cacheDurationMs: 5 * 60 * 1000,
  },
})

const account = cardano.accounts.fromMnemonic(mnemonic)
const tip = await cardano.chain.getTip()
```

#### Application namespaces

Use the Cardano subpath for grouped application providers, utilities, operations, and types:

```ts
import { providers, utilities, type types } from "@xray-network/xray-js/cardano"

const provider: types.Provider = providers.koios.createKoiosProvider(koiosUrl)
const addressIsValid = utilities.addresses.validateAddress(address)
const assetName = utilities.assets.assetNameToAssetNameAscii(assetNameHex)
```

The `utilities` namespace contains `addresses`, `assets`, `encoding`, `governance`, `keys`, `scripts`, `security`,
and `slots`. Password-based encryption helpers live under `utilities.security`; text/hex conversion stays under
`utilities.encoding`.

#### Functional workflow

The Cardano API is classless: factories create frozen clients, accounts, wallets, transaction plans, and transaction values. Client and transaction-plan creation are synchronous. Promises are reserved for APIs that may cross a provider or wallet boundary:

```ts
const cardano = createCardano({ network: "preview", provider })
const account = cardano.accounts.fromMnemonic(mnemonic)

const plan = cardano.transactions
  .create()
  .setChangeAddress(account.paymentAddress)
  .spend(utxos)
  .payTo([{ address: recipient, value: 2_000_000n }])

const unsigned = await plan.build() // provider/protocol resolution
const signed = cardano.transactions.signWithPrivateKey(unsigned, account.getPrivateKey()) // local
const transactionHash = await cardano.transactions.submit(signed) // provider request
```

#### Low-level Cardano library

Raw Cardano primitives, cryptography, ledger types, CIP implementations, transaction builders, Plutus Data, and UPLC
are available through the universal pure-JavaScript
[`@xray-network/xray-cardano-lib`](https://github.com/xray-network/xray-cardano-lib) facade. No WebAssembly
initialization or environment-specific build is required.

The `/cardano/lib` entry point is an opt-in low-level escape hatch. Import it as one local namespace when raw ledger or
cryptographic types are required:

```ts
import * as cardanoLib from "@xray-network/xray-js/cardano/lib"

const address = cardanoLib.chain.Address.from_bech32(addressBech32)
const key = cardanoLib.crypto.PrivateKey.from_bech32(privateKeyBech32)
const assetLabel = cardanoLib.cips.cip67.decode_asset_name_label(Uint8Array.from([0x00, 0x0d, 0xe1, 0x40])) // 222
const datumSchema = cardanoLib.plutus.data.Data.Integer()
```

The application and low-level entry points do not duplicate exports: `cips` and `plutus` exist only in `/cardano/lib`.
Provisional CIP-129 remains available only from its focused Cardano Lib package subpath.

### Bitcoin

Bitcoin support is a placeholder. The intended facade shape is shown only for planning and is not currently available:

```ts
// Planned API — not exported yet:
// import { createBitcoin } from "@xray-network/xray-js/bitcoin"
// const bitcoin = createBitcoin({ network: "mainnet" })
```

### Midnight

Midnight support is a placeholder. The intended facade shape is shown only for planning and is not currently available:

```ts
// Planned API — not exported yet:
// import { createMidnight } from "@xray-network/xray-js/midnight"
// const midnight = createMidnight({ network: "mainnet" })
```

## Packages

| Workspace                  | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `packages/runtime`         | Public explicit-subpath `@xray-network/xray-js` package |
| `packages/cardano`         | Cardano client and future-facing XRAY chain module      |
| `packages/mini-app-bridge` | Cross-chain XRAY Mini App Bridge with CIP-30 support    |

## Mini App Bridge

The Mini App Bridge is blockchain-neutral at its core. Transport owns contextual request/response delivery, while the
platform layer owns only XRAY host concerns such as handshake, theme, currency, privacy settings, and routing. The
handshake advertises which independent blockchain protocols the current host can execute.

Platform messages carry the selected account context. The context is `null` when XRAY has no selected account; this
still represents a successful platform connection, so handshake, theme, currency, privacy, and routing remain
available. Blockchain adapter messages retain their non-null chain-specific contexts.

Blockchain-specific models and wallet standards live in adapter subpaths rather than the shared bridge. Cardano is the
first adapter and exposes two independently advertised protocols:

- `cardano.bridge` provides XRAY Cardano context and wallet operations such as tip, account state, explorer, signing,
  and submission.
- `cardano.cip30` provides the CIP-30-compatible wallet API; call `enable()` before using its methods.

### JavaScript mini app

Use the framework-free `client` namespace inside an embedded mini app. Cardano Bridge and CIP-30 are independent
protocols, so check and use each one separately.

#### Cardano Bridge

```js
import { client } from "@xray-network/xray-js/mini-app-bridge"
import { CARDANO_BRIDGE_PROTOCOL } from "@xray-network/xray-js/mini-app-bridge/cardano"

const handshake = await client.platform.handshake()
if (!handshake) throw new Error("XRAY host is unavailable")
if (!handshake.payload.protocols.includes(CARDANO_BRIDGE_PROTOCOL)) {
  throw new Error("Cardano Bridge is unavailable")
}

const tip = await client.cardano.bridge.getTip()
console.log(tip?.payload)

const stop = client.cardano.listenAll((message) => {
  console.log(message.type, message.payload)
})
```

`client.cardano.listenAll` validates and receives every platform, Cardano Bridge, and CIP-30 host
message for the active Cardano context through one subscription. Call `stop()` when the listener
is no longer needed.

#### CIP-30

```js
import { client } from "@xray-network/xray-js/mini-app-bridge"
import { CARDANO_CIP30_PROTOCOL } from "@xray-network/xray-js/mini-app-bridge/cardano"

// Optional: attach the compatibility connector to window.cardano.xrayBridge
// client.cardano.cip30.installConnector()

const handshake = await client.platform.handshake()
if (!handshake) throw new Error("XRAY host is unavailable")
if (!handshake.payload.protocols.includes(CARDANO_CIP30_PROTOCOL)) {
  throw new Error("CIP-30 is unavailable")
}

const wallet = await client.cardano.cip30.enable()
console.log(await wallet.getNetworkId())
```

Advertising `cardano.cip30` means the host supports the protocol; it does not grant wallet access. `enable()` is the
explicit authorization request and may be refused by the host. The browser connector is optional compatibility for
mini apps designed around `window.cardano` and is not required when using `client.cardano.cip30` directly:

```js
import { client } from "@xray-network/xray-js/mini-app-bridge"

client.cardano.cip30.installConnector() // optional window.cardano.xrayBridge compatibility connector
```

### JavaScript host or relay

Embedding hosts and bridge relays use the `host` namespace. For example, a Cardano host can advertise both Cardano
protocols when it answers the platform handshake:

```js
import { BRIDGE_PROTOCOL_VERSION, host } from "@xray-network/xray-js/mini-app-bridge"
import { CARDANO_BRIDGE_PROTOCOL, CARDANO_CIP30_PROTOCOL } from "@xray-network/xray-js/mini-app-bridge/cardano"

const iframe = document.querySelector("#mini-app")
if (!(iframe instanceof HTMLIFrameElement)) throw new Error("Mini app iframe is unavailable")

const miniAppWindow = iframe.contentWindow
const context = { blockchain: "cardano", network: "mainnet" }

host.platform.listen(miniAppWindow, "xray.client.handshake", ({ requestId }) => {
  host.platform.sendHandshake(
    miniAppWindow,
    {
      protocolVersion: BRIDGE_PROTOCOL_VERSION,
      protocols: [CARDANO_BRIDGE_PROTOCOL, CARDANO_CIP30_PROTOCOL],
    },
    requestId,
    context
  )
})

const stop = host.cardano.listenAll(miniAppWindow, (message) => {
  console.log(message.type, message.payload)
})
```

`host.cardano.listenAll` provides the matching single subscription for validated platform,
Cardano Bridge, and CIP-30 requests received from that iframe.

### React mini app

React bindings are an optional, separate entry point. Platform hooks remain top-level, while Cardano hooks live under
`cardano.bridge`:

Platform value hooks first complete the shared handshake, then request only the values used by the
mounted React tree. `useTheme`, `useCurrency`, and `useHideBalances` therefore never race their
getter requests ahead of host discovery, and later host messages keep the cached values current.

#### Cardano Bridge

```tsx
import { MiniAppProvider, cardano, useMiniApp } from "@xray-network/xray-js/mini-app-bridge/react"

function WalletStatus() {
  const { connected, context } = useMiniApp()
  const { accountState, refresh } = cardano.bridge.useAccountState()

  if (connected === null) return <p>Connecting…</p>
  if (!connected) return <p>XRAY host is unavailable</p>
  if (context?.blockchain !== "cardano") return <p>Open this mini app on Cardano</p>

  return (
    <section>
      <p>{accountState?.paymentAddress ?? "No account connected"}</p>
      <button onClick={() => void refresh()}>Refresh</button>
    </section>
  )
}

export function App() {
  return (
    <MiniAppProvider>
      <WalletStatus />
    </MiniAppProvider>
  )
}
```

#### CIP-30

CIP-30 does not need a parallel React hook API. Discover it with the platform hook, then request access through the
framework-free CIP-30 client from an event handler:

```tsx
import { useState } from "react"
import { client } from "@xray-network/xray-js/mini-app-bridge"
import { CARDANO_CIP30_PROTOCOL } from "@xray-network/xray-js/mini-app-bridge/cardano"
import { MiniAppProvider, useMiniApp } from "@xray-network/xray-js/mini-app-bridge/react"

// Optional: attach the compatibility connector to window.cardano.xrayBridge
// client.cardano.cip30.installConnector()

function ConnectCip30() {
  const { protocols } = useMiniApp()
  const [networkId, setNetworkId] = useState<number | null>(null)
  const available = protocols.includes(CARDANO_CIP30_PROTOCOL)

  const connect = async () => {
    const wallet = await client.cardano.cip30.enable()
    setNetworkId(await wallet.getNetworkId())
  }

  return (
    <button disabled={!available} onClick={() => void connect()}>
      {networkId === null ? "Connect CIP-30" : `Connected to network ${networkId}`}
    </button>
  )
}

export function App() {
  return (
    <MiniAppProvider>
      <ConnectCip30 />
    </MiniAppProvider>
  )
}
```

Future blockchain adapters can add their own bridge and wallet-standard protocols without changing the shared platform
APIs.

The provider is useful for isolating a React subtree, but the hooks also work without it through their shared default
store. React is an optional peer dependency and is needed only for the React entry point.

## Development

This repository requires Node.js 20.19 or newer and npm 10.8.x.
Published packages are ESM-only and compile directly with TypeScript into `dist/esm`; CommonJS `require()` is not supported.

```bash
npm ci
npm run build
npm run typecheck
npm test
```

`npm test` compiles and runs the deterministic offline suite with Node's built-in test runner. The live Cardano provider smoke test calls an XRAY endpoint and is available separately:

```bash
npm run test:integration
```
