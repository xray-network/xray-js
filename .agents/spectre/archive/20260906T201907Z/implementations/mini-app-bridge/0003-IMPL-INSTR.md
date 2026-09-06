# Mini App Bridge implementation 0003 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0003
Created: 20260811T085802Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request | `LOCAL` | Yes | Refactor the bridge for multiple blockchains with Cardano as the first chain adapter. |
| `packages/mini-app-bridge/src/` | `LOCAL` | Yes | Existing mixed platform, Cardano-native, and CIP-30 implementation. |
| `packages/runtime/` | `LOCAL` | Yes | Public xray-js bridge facade and subpath exports. |

## Objective

Separate blockchain-neutral bridge transport/platform APIs from explicit Cardano-native and CIP-30 adapters.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Create transport and platform boundaries containing contextual envelopes, generic request/listen plumbing, connection handshake, settings, and routing only. | Breaking reorganization is allowed before release; remove redundant network messaging. | `packages/mini-app-bridge/src/{transport,platform,react}/` | Build and typecheck. |
| C02 | Move Cardano tip/account/explorer/transaction APIs and React state under a Cardano adapter with `xray.cardano.*` wire namespaces. | No compatibility aliases for old chain-ambiguous messages. | `packages/mini-app-bridge/src/cardano/` | Build and typecheck. |
| C03 | Move CIP-30 under Cardano with `xray.cardano.cip30.*` wire namespaces and an injectable Cardano connector surface. | CIP-30 remains an iframe adapter to xray-app, not an external-wallet proxy. | `packages/mini-app-bridge/src/cardano/cip30/` | Build and typecheck. |
| C04 | Publish explicit transport/platform/Cardano/CIP-30 subpaths through both packages. | Old protocol aggregation exports may be removed. | Package manifests and runtime facade | Runtime tests and typecheck. |
| C05 | Align testing utilities with the separated protocol maps. | Cardano mock behavior remains available through a Cardano testing subpath. | Bridge testing sources | Build and typecheck. |

## Implementation steps

1. Extract generic transport and platform protocol/client/host layers.
2. Create Cardano-native protocol, clients, hosts, React store/hooks, and testing adapter.
3. Nest and namespace CIP-30 under Cardano, including connector installation.
4. Replace package/runtime exports and remove obsolete mixed files.
5. Build, test, and typecheck xray-js.

## Validation

- `npm run check`
- `npm test --workspace @xray-network/xray-js`

## Compatibility and human review

Review public subpaths, wire namespaces, handshake protocol advertising, and the absence of chain-specific models from platform core.

## Completion criteria

Shared layers contain no Cardano data model, Cardano APIs are explicitly namespaced, public exports resolve, and validation outcomes are recorded.

## Out of scope

Ethereum/EIP-1193 implementation, native xray-app CIP-30 execution, and Bitcoin or Midnight chain adapters.

## Blockers

None.
