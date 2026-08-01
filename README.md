# XRAY JavaScript SDK

`@xray-network/xray-js` is the JavaScript SDK for XRAY/Network. The current release contains the Cardano SDK and cross-chain mini-app APIs behind one public package.

## Installation

```bash
npm install @xray-network/xray-js
```

Use the Cardano subpaths in application code:

```ts
import { CardanoWeb3 } from "@xray-network/xray-js/cardano"
import { Address } from "@xray-network/xray-js/cardano/lib"
```

The root entry provides namespaces for discovery and scripts:

```ts
import { Cardano } from "@xray-network/xray-js"

const web3 = new Cardano.CardanoWeb3()
```

## Packages

| Workspace              | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `packages/runtime`     | Public `@xray-network/xray-js` runtime package  |
| `packages/cardano-sdk` | Cardano SDK, previously `cardano-web3-js`       |
| `packages/mini-app`    | Cross-chain XRAY Mini App SDK and CIP-30 bridge |

Shared XRAY primitives are available from the package root:

```ts
import { XrayError, type XrayChain, type RequestOptions } from "@xray-network/xray-js"
```

## Mini-app imports

The chain-neutral mini-app protocol lives in `packages/mini-app`, with Cardano support provided by its CIP-30 modules.

```ts
import { miniAppClient } from "@xray-network/xray-js/mini-app/client"
import { miniAppHost } from "@xray-network/xray-js/mini-app/host"
import { MiniAppProvider } from "@xray-network/xray-js/mini-app/react"
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

`npm test` compiles and runs the deterministic offline suite with Node's built-in test runner. Cardano explorer and provider tests call live XRAY endpoints and are available separately:

```bash
npm run test:integration
```

## Cardano library

Cardano primitives, cryptography, ledger types, CIP implementations, transaction builders, Plutus Data, and UPLC are provided by the universal pure-JavaScript [`@xray-network/xray-cardano-lib`](https://github.com/xray-network/xray-cardano-lib) package. No WebAssembly initialization or environment-specific build is required.

```ts
import { CardanoLib } from "@xray-network/xray-js/cardano"
import { Address, TransactionBuilder } from "@xray-network/xray-js/cardano/lib"
```
