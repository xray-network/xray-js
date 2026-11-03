# XRAY JavaScript SDK

`@xray-network/xray-js` is the aggregate package for the Cardano application SDK, low-level
Cardano library, and iframe Mini App Bridge. Choose explicit feature imports for the APIs you use.

## Installation

```sh
npm install @xray-network/xray-js
```

## Requirements

ESM-only, with TypeScript declarations included. Use Node.js 20.19 or newer or a modern browser
with `fetch`, `Uint8Array`, `bigint`, and Web Crypto. Mini app client/host helpers require browser
windows. React 18 or 19 is needed only for the `/mini-app-bridge/react` entry; install React in
your application when using those hooks.

The package has no root entry point. Import a subpath such as `@xray-network/xray-js/cardano`;
a bare `import "@xray-network/xray-js"` is unsupported.

## Quickstart

```ts
import { createCardano } from "@xray-network/xray-js/cardano"

const cardano = createCardano({ network: "preview" })
const tip = await cardano.chain.getTip()
console.log(tip)
```

This reads the preview network through the default remote provider. Handle network failures in
the calling application. See the Cardano guide for custom providers, accounts, and transactions.

## Entry points

| Entry point                                     | Contents                                                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `@xray-network/xray-js/cardano`                 | Cardano client, accounts, providers, wallets, transactions, utilities, and types |
| `@xray-network/xray-js/cardano/lib`             | Low-level `core`, `crypto`, `chain`, `cips`, and `plutus` namespaces             |
| `@xray-network/xray-js/cardano/testing`         | In-memory Cardano provider and test helpers                                      |
| `@xray-network/xray-js/mini-app-bridge`         | Platform, native Cardano, and CIP-30 clients/hosts and shared protocol           |
| `@xray-network/xray-js/mini-app-bridge/react`   | Optional bridge hooks and stores                                                 |
| `@xray-network/xray-js/mini-app-bridge/testing` | Mock bridge clients/hosts and message helpers                                    |
| `@xray-network/xray-js/package.json`            | Package metadata                                                                 |

The aggregate re-exports its owning libraries. You can instead install
`@xray-network/xray-js-cardano`, `@xray-network/xray-js-mini-app-bridge`, or the focused
`@xray-network/xray-cardano-lib-*` packages when you need only one domain.

## Documentation

- [Cardano application SDK](https://github.com/xray-network/xray-js/blob/main/packages/cardano/README.md)
- [Low-level Cardano library](https://github.com/xray-network/xray-cardano-lib/blob/main/libs/typescript/packages/runtime/README.md)
- [Mini App Bridge](https://github.com/xray-network/xray-js/blob/main/packages/mini-app-bridge/README.md)
- [Platform v1](https://github.com/xray-network/xray-js/blob/main/packages/mini-app-bridge/README-PLATFORM.md)
- [Native Cardano v1](https://github.com/xray-network/xray-js/blob/main/packages/mini-app-bridge/README-CARDANO.md)
- [Cardano CIP-30 v1](https://github.com/xray-network/xray-js/blob/main/packages/mini-app-bridge/README-CARDANO-CIP30.md)

## Development

From a repository checkout, build the linked Cardano library first, then run at the SDK
repository root:

```sh
npm run check
```

This builds all three SDK packages and runs their tests and typechecks. Live integration tests
are separate from the default offline checks.

## License

MIT. See [LICENSE](./LICENSE).
