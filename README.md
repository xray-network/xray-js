# XRAY JavaScript SDK

This repository contains the modular JavaScript SDK for XRAY/Network. It provides the public aggregate runtime,
Cardano application APIs and low-level primitives, and the scope-versioned Mini App Bridge used by embedded mini apps
and XRAY hosts.

The SDK is an ESM-only npm workspace. Public APIs use explicit feature and blockchain subpaths so applications load
only the modules they select. The `@xray-network/xray-js` package root intentionally exports nothing.

## Package documentation

| Package                                 | Documentation                                           | Purpose                                                                     |
| --------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `@xray-network/xray-js`                 | [Runtime](./packages/runtime/README.md)                 | Public aggregate package and supported subpaths                             |
| `@xray-network/xray-js-cardano`         | [Cardano](./packages/cardano/README.md)                 | Cardano application client and runtime examples                             |
| `@xray-network/xray-js-mini-app-bridge` | [Mini App Bridge](./packages/mini-app-bridge/README.md) | Versioned iframe transport, adapters, React bindings, and testing utilities |

The Mini App Bridge documentation includes focused guides for
[Platform v1](./packages/mini-app-bridge/README-PLATFORM.md),
[Cardano v1](./packages/mini-app-bridge/README-CARDANO.md), and
[Cardano CIP-30 v1](./packages/mini-app-bridge/README-CARDANO-CIP30.md).

The standalone Rspress website package lives in [`docs/`](./docs/).

## Repository requirements

Development requires Node.js 20.19 or newer and npm 10.8.x. Builds, typechecks, and tests are deterministic and run
through the root workspace scripts.
