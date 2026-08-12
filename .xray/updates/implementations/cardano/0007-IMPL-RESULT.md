# Cardano implementation 0007 result

Result-Version: v1
Implementation-ID: cardano/0007
Instruction: ./0007-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Removed application-root `cips` and `plutus` exports and deleted the obsolete CIP aggregate barrel. | Cardano build, declarations, tests, and export scan passed. |
| C02 | `IMPLEMENTED` | Retained exactly `chain`, `core`, `crypto`, `cips`, and `plutus` on `/cardano/lib`. | Runtime contract tests and public import smoke passed. |
| C03 | `IMPLEMENTED` | Updated blockchain examples to keep application imports and the `cardanoLib` namespace separate. | Repository formatting and documentation scan passed. |
| C04 | `IMPLEMENTED` | Migrated XRAY App, Assets, Wallet, Transactions, and Graph consumers to `/cardano/lib`. | All downstream typechecks, builds, and XRAY App verification passed. |

## Outcome

The Cardano application entry contains only XRAY application domains; all raw Cardano Lib namespaces are exclusive to `/cardano/lib`.

## Inputs consumed

- Cardano application source and tests.
- Runtime facade and package-boundary tests.
- Repository README.
- All active local `cips` consumers.

## Project changes

- Removed `cips` and `plutus` from `@xray-network/xray-js/cardano`.
- Deleted `packages/cardano/src/cips.ts`.
- Strengthened runtime assertions for the strict export boundary.
- Migrated application imports to a local `cardanoLib` namespace.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | `/cardano` no longer exports `cips` or `plutus`. | Intentional breaking cleanup. | Import low-level namespaces from `/cardano/lib`. |
| C02 | `/cardano/lib` remains the sole five-namespace Cardano Lib facade. | Low-level API behavior is unchanged. | Use `import * as cardanoLib` for raw APIs. |

## Validation

- `npm run check` — passed; 32 deterministic tests passed and one live integration test skipped.
- `npm run format:check` — passed.
- Public export and built declaration audits — passed.
- XRAY App `npm run verify` — passed.
- Assets, Wallet, and Transactions typechecks/builds — passed.
- Graph monorepo typecheck and build — passed.
- Retired-import scan and all repository `git diff --check` commands — passed.

## Deviations from instruction

The available Node runtime was 20.18.1, below current React Router consumer requirements. Typechecks and builds still passed; production builds were rerun outside the sandbox to permit their local prerender preview servers.

## Remaining human review

Review the intentional removal of `cips` and `plutus` from the application entry.

## Reproducibility

Run `npm run check`, inspect both public entry objects, scan active consumers, and run the recorded downstream checks.
