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
import { MIDNIGHT_CHAIN } from "@xray-network/xray-js/midnight"
```

The root entry provides namespaces for discovery and scripts:

```ts
import { Cardano, Bitcoin, Midnight } from "@xray-network/xray-js"

const web3 = new Cardano.CardanoWeb3()
```

## Packages

| Workspace                   | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `packages/xray-js`          | Public `@xray-network/xray-js` umbrella package |
| `packages/base/core`        | Chain-neutral errors and request primitives     |
| `packages/cardano/sdk`      | Cardano SDK, previously `cardano-web3-js`       |
| `packages/cardano/wasm`     | Cardano WASM libraries and Rust build scripts   |
| `packages/cardano/mini-app` | XRAY Mini App and CIP-30 APIs                   |
| `packages/bitcoin/sdk`      | Bitcoin SDK workspace scaffold                  |
| `packages/midnight/sdk`     | Midnight SDK workspace scaffold                 |

Chain packages may depend on `base`, but must not depend on another chain package.

## Mini-app imports

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

Generated Node, browser, and web WASM artifacts are committed under `packages/cardano/wasm/src`. To rebuild them, initialize the Rust submodules first:

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
