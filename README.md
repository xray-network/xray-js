# XRAY JavaScript SDK

`@xray-network/xray-js` is the multi-chain JavaScript SDK for XRAY/Network. The uppercase `XRAY` facade exposes isolated clients through lower-case chain modules such as `XRAY.cardano`; future Bitcoin, Midnight, and other modules follow the same shape without being coupled to Cardano.

## Installation

```bash
npm install @xray-network/xray-js
```

Create a Cardano client through the root facade:

```ts
import { XRAY } from "@xray-network/xray-js"

const cardano = XRAY.cardano.create({
  network: "preview",
  protocolParameters: {
    source: "remote",
    cacheDurationMs: 5 * 60 * 1000,
  },
})

const account = cardano.accounts.fromMnemonic(mnemonic)
const tip = await cardano.chain.getTip()
```

Use the Cardano subpath for grouped providers, primitives, CIPs, Plutus utilities, and types:

```ts
import { cips, createCardano, providers, type types } from "@xray-network/xray-js/cardano"
import { chain } from "@xray-network/xray-js/cardano/lib"

const provider: types.Provider = providers.koios.createKoiosProvider(koiosUrl)
const assetLabel = cips.cip67.decode_asset_name_label(Uint8Array.from([0x00, 0x0d, 0xe1, 0x40])) // 222
const address = chain.Address.from_bech32(addressBech32)
```

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

## Packages

| Workspace                  | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `packages/runtime`         | Public `@xray-network/xray-js` runtime package       |
| `packages/cardano`         | Cardano client and future-facing XRAY chain module   |
| `packages/mini-app-bridge` | Cross-chain XRAY Mini App Bridge with CIP-30 support |

Shared XRAY primitives are available from the package root:

```ts
import { XrayError, type XrayChain, type RequestOptions } from "@xray-network/xray-js"
```

## Mini App Bridge

The Mini App Bridge is blockchain-neutral at its core. Transport owns contextual request/response delivery, while the
platform layer owns only XRAY host concerns such as handshake, theme, currency, privacy settings, and routing. The
handshake advertises which independent blockchain protocols the current host can execute.

```ts
import * as miniAppClient from "@xray-network/xray-js/mini-app-bridge/client"
import * as miniAppHost from "@xray-network/xray-js/mini-app-bridge/host"
import { MiniAppProvider } from "@xray-network/xray-js/mini-app-bridge/react"

const handshake = await miniAppClient.handshake()
console.log(handshake?.context.blockchain, handshake?.payload.protocols)
```

Blockchain-specific models and wallet standards live in adapter subpaths rather than the shared bridge. Cardano is the
first adapter; future adapters can add their own native and compatibility protocols without changing platform APIs.

```ts
import * as cardanoClient from "@xray-network/xray-js/mini-app-bridge/cardano/client"
import * as cardanoCip30Client from "@xray-network/xray-js/mini-app-bridge/cardano/cip30/client"
import { useAccountState } from "@xray-network/xray-js/mini-app-bridge/cardano/react"

cardanoCip30Client.installConnector() // window.cardano.xrayBridge -> XRAY App iframe host
```

React is an optional peer dependency and is needed only for React entrypoints.

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

## Cardano library

Cardano primitives, cryptography, ledger types, CIP implementations, transaction builders, Plutus Data, and UPLC are provided by the universal pure-JavaScript [`@xray-network/xray-cardano-lib`](https://github.com/xray-network/xray-cardano-lib) package. No WebAssembly initialization or environment-specific build is required.

The application API groups capabilities under stable lowercase domains such as `accounts`, `wallets`, `transactions`, `providers`, `cips`, and `plutus`. Stable CIPs are available through `cips.cipN`; provisional CIP-129 remains available only from its focused Cardano Lib subpath.

```ts
import { cips, plutus } from "@xray-network/xray-js/cardano"
import { chain, core, crypto } from "@xray-network/xray-js/cardano/lib"

const address = chain.Address.from_bech32(addressBech32)
const key = crypto.PrivateKey.from_bech32(privateKeyBech32)
```
