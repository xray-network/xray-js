# XRAY JavaScript SDK

`@xray-network/xray-js` is the multi-chain JavaScript SDK for XRAY/Network. The repository uses Yarn Classic workspaces and keeps blockchain implementations isolated behind one public package.

## Installation

```bash
yarn add @xray-network/xray-js
```

Use chain subpaths in application code so bundlers only include the selected implementation:

```ts
import { CardanoWeb3 } from "@xray-network/xray-js/cardano"
import { CML } from "@xray-network/xray-js/cardano/wasm"

import { BITCOIN_CHAIN } from "@xray-network/xray-js/bitcoin"
import { BASE_CHAIN } from "@xray-network/xray-js/base"
import { MIDNIGHT_CHAIN } from "@xray-network/xray-js/midnight"
```

The root entry provides namespaces for discovery and scripts:

```ts
import { Cardano, Bitcoin, Base, Midnight } from "@xray-network/xray-js"

const web3 = new Cardano.CardanoWeb3()
```

## Packages

| Workspace                   | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `packages/xray-js`          | Public `@xray-network/xray-js` umbrella package |
| `packages/cardano-sdk`      | Cardano SDK, previously `cardano-web3-js`       |
| `packages/cardano-wasm`     | Cardano WASM libraries and Rust build scripts   |
| `packages/cardano-mini-app` | XRAY Mini App and CIP-30 APIs                   |
| `packages/bitcoin-sdk`      | Bitcoin SDK workspace scaffold                  |
| `packages/base-sdk`         | Base blockchain SDK workspace scaffold          |
| `packages/midnight-sdk`     | Midnight SDK workspace scaffold                 |

Chain-neutral errors and request primitives live directly in `packages/xray-js`. `packages/base-sdk` refers to the Base L2 blockchain. Chain packages must not depend on another chain package.

## Base blockchain

The Base blockchain implementation lives in `packages/base-sdk` and is exposed publicly through the umbrella package:

```ts
import { BASE_CHAIN, type BaseNetwork } from "@xray-network/xray-js/base"

const chain = BASE_CHAIN // "base"
const network: BaseNetwork = "mainnet" // "mainnet" | "sepolia"
```

It is also available from the root namespace:

```ts
import { Base } from "@xray-network/xray-js"

console.log(Base.BASE_CHAIN)
```

The Base package is currently a scaffold, like the Bitcoin and Midnight packages. Providers, accounts, and transaction APIs will be added without changing the `@xray-network/xray-js/base` import path.

Shared XRAY primitives are not part of the Base blockchain namespace. Import them from the package root:

```ts
import { XrayError, type XrayChain, type RequestOptions } from "@xray-network/xray-js"
```

## Mini-app imports

Mini-app protocols are owned by their blockchain package. Cardano-specific handshake capabilities and post-handshake payloads live in `packages/cardano-mini-app`; future integrations should use flat workspaces such as `packages/bitcoin-mini-app` and `packages/base-mini-app`.

```ts
import { miniAppClient } from "@xray-network/xray-js/cardano/mini-app/client"
import { miniAppHost } from "@xray-network/xray-js/cardano/mini-app/host"
import { MiniAppProvider } from "@xray-network/xray-js/cardano/mini-app/react"
```

React is an optional peer dependency and is only needed for the `/react` entry.

## Development

This repository requires Yarn 1.22.x.

```bash
yarn install
yarn build
yarn typecheck
yarn test
```

`yarn test` runs the deterministic offline suite. Cardano explorer and provider tests call live XRAY endpoints and are available separately:

```bash
yarn test:integration
```

## Cardano WASM

Generated Node, browser, and web WASM artifacts are committed under `packages/cardano-wasm/src`. To rebuild them, initialize the Rust submodules first:

```bash
git submodule update --init --recursive
yarn workspace @xray-network/xray-cardano-wasm cml-build
yarn workspace @xray-network/xray-cardano-wasm msl-build
yarn workspace @xray-network/xray-cardano-wasm uplc-build
```

## Releasing

All public workspaces use a fixed Changesets version group.

```bash
yarn changeset
yarn version-packages
yarn release
```
