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

Use the Cardano subpath for direct factories, providers, primitives, and types:

```ts
import { createCardano, createKoiosProvider, type Utxo } from "@xray-network/xray-js/cardano"
import { Address } from "@xray-network/xray-js/cardano/lib"
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

## Mini App Bridge imports

The chain-neutral Mini App Bridge lives in `packages/mini-app-bridge`, with Cardano support provided by its CIP-30 modules.

```ts
import { miniAppClient } from "@xray-network/xray-js/mini-app-bridge/client"
import { miniAppHost } from "@xray-network/xray-js/mini-app-bridge/host"
import { MiniAppProvider } from "@xray-network/xray-js/mini-app-bridge/react"
```

React is an optional peer dependency and is only needed for the `/react` entry.

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

```ts
import { CardanoLib } from "@xray-network/xray-js/cardano"
import { Address, TransactionBuilder } from "@xray-network/xray-js/cardano/lib"
```
