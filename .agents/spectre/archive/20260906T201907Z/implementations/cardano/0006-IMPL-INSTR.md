# Cardano implementation 0006 instruction

Implementation-Version: v1
Implementation-ID: cardano/0006
Created: 20260807T105137Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human request to restructure unreleased Cardano Lib and xray-js exports without compatibility aliases | `LOCAL` | Yes | Authorizes a breaking application-facade cleanup before publication. |
| `packages/cardano/src`, manifest, tests, and README | `LOCAL` | Yes | Define the Cardano SDK implementation and public contract. |
| `packages/runtime` facade source, manifest, and tests | `LOCAL` | Yes | Define the canonical `@xray-network/xray-js/cardano` package boundary. |
| Sibling Cardano Lib domain packages and focused entry points | `LOCAL` | Yes | Own protocol types and behavior re-exported through application namespaces. |
| Local XRAY App and mini-app consumers | `LOCAL` | Yes | Identify application imports requiring migration to the unreleased facade. |

## Objective

Group Cardano application exports into predictable domain namespaces.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| `C01` | Keep only `createCardano` and `Cardano` as central Cardano-root operations; group configuration, accounts, wallets, transactions, providers, and primitives by domain. | Breaking by request; remove flat wallet, transaction, provider, configuration, and type exports. | Cardano source and public index | Declaration inspection and contract tests. |
| `C02` | Add a complete stable `cips` namespace and a structured `plutus` namespace backed by focused Cardano Lib owners. | Replace direct `cip8`, `cip67`, and `uplc` exports; exclude provisional CIP-129. | Cardano protocol facade modules | Binding-identity and focused behavior tests. |
| `C03` | Remove `CardanoLib`, `Message`, `PlutusData`, and `PlutusConstr`; retain the explicit `@xray-network/xray-js/cardano/lib` low-level entry point. | Intentionally breaking before release; no compatibility aliases. | Cardano and runtime facades | Retired-export scan and package import smoke. |
| `C04` | Merge transaction primitives into `transactions`, move CIP-30 operations into `wallets.cip30`, and group vendor clients/types under `providers`. | One canonical domain path for each application concern. | Cardano accounts, wallets, transactions, primitives, and providers | Typecheck and behavioral tests. |
| `C05` | Migrate repository tests, docs, and local application consumers to the grouped namespace contract. | No legacy import form remains in active local source. | xray-js tests/docs and sibling consumers | Full checks in xray-js and affected consumers. |

## Implementation steps

1. Create domain barrels for config, wallets, transactions, providers, CIPs, and Plutus.
2. Replace the Cardano root barrel with the grouped facade and remove aliases.
3. Update the runtime facade declarations and public-contract tests.
4. Migrate local consumers and documentation.
5. Run repository and downstream completion checks and record the result.

## Validation

- `npm run check`
- Import-smoke `@xray-network/xray-js/cardano` and `/cardano/lib`.
- Confirm all stable CIPs, Plutus subdomains, wallet, transaction, provider, config, and primitive namespaces resolve.
- Scan active source and built declarations for retired exports and direct old consumer imports.
- Run affected XRAY App and mini-app typecheck/build commands.
- `git diff --check`

## Compatibility and human review

This deliberately defines a new unreleased API with no compatibility aliases. Review namespace
ergonomics, provider grouping, the explicit low-level escape hatch, and the CIP-129 exclusion.

## Completion criteria

The Cardano facade has one predictable grouped public surface, local consumers compile against it,
retired aliases are absent, and all required repository checks pass.

## Out of scope

- New Cardano behavior, new provider implementations, mini-app protocol changes, or npm publication

## Blockers

None.
