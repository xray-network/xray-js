# Cardano implementation 0006 result

Result-Version: v1
Implementation-ID: cardano/0006
Instruction: ./0006-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| `C01` | Implemented | Cardano now keeps `createCardano` and `Cardano` central and groups config, types, accounts, wallets, transactions, providers, and primitives. | Declarations, tests, and downstream typechecks pass. |
| `C02` | Implemented | Added complete stable `cips` and structured `plutus` namespaces backed by focused Cardano Lib owners. | CIP-67 and Plutus runtime assertions pass; CIP-129 is absent. |
| `C03` | Implemented | Removed `CardanoLib`, `Message`, `PlutusData`, `PlutusConstr`, direct CIP, and UPLC aliases; `/cardano/lib` remains the namespace-only low-level boundary. | Package-boundary runtime test and retired-export scans pass. |
| `C04` | Implemented | Transactions include transaction primitives, CIP-30 is under `wallets.cip30`, and generated clients/types are grouped by provider. | Cardano behavioral and strict type suites pass. |
| `C05` | Implemented | Migrated xray-js docs/tests plus XRAY App and all active mini-app consumers. | Full xray-js check and all downstream typechecks/builds pass. |

## Outcome

The Cardano SDK now exposes a predictable application-level facade while keeping raw ledger,
crypto, CIP, and Plutus access behind the explicit `/cardano/lib` entry point.

## Project changes

- Added domain barrels for accounts, wallets, transactions, providers, and CIPs.
- Migrated implementation imports to their owning Cardano Lib packages.
- Updated package dependencies, lock metadata, tests, and README examples.
- Added self-referenced application and low-level boundary assertions.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| `C01` | Application concerns are grouped namespaces. | Flat config/types/operations removed. | Use `config`, `types`, `accounts`, `wallets`, `transactions`, or `providers`. |
| `C02` | Protocol access is `cips.cipN` and `plutus.*`. | Direct `cip8`, `cip67`, and `uplc` removed. | Select the protocol namespace. |
| `C03` | Low-level access is `/cardano/lib` domain namespaces. | `CardanoLib` and aliases removed. | Import `chain`, `crypto`, `core`, `cips`, or `plutus` from the low-level subpath. |
| `C04` | Clients and operations live with their domain. | Vendor client globals removed. | Use e.g. `providers.koios.Client` and `wallets.cip30.connectCip30Wallet`. |
| `C05` | Active consumers use only the new surface. | No compatibility layer. | Publish coordinated package versions before external use. |

## Validation

- `npm run check`: PASS; Cardano 27 passed/1 opt-in live skipped, Runtime 2 passed, all workspace typechecks passed.
- XRAY App typecheck and main/extension/Telegram builds: PASS.
- Template, Builder, Wallet, Assets, and Transactions typechecks/builds: PASS.
- Graph backend/client/frontend monorepo typecheck/build: PASS.
- `git diff --check`: PASS.

## Deviations from instruction

None. The available Node runtime is `v20.18.1` while package engines request `>=20.19.0`; all required
offline checks completed successfully.

## Remaining human review

Review grouping ergonomics and the deliberate lack of compatibility aliases before acceptance.

## Reproducibility

Run `npm run check` from the xray-js root, then the recorded downstream typecheck/build commands.
