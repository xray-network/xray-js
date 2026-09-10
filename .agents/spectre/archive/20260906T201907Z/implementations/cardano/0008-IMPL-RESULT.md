# Cardano implementation 0008 result

Result-Version: v1
Implementation-ID: cardano/0008
Instruction: ./0008-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Replaced seven root helper exports with one `utilities` namespace containing eight focused domains. | Package and runtime export-contract tests passed. |
| C02 | `IMPLEMENTED` | Moved reusable helpers into `utilities/` and account/transaction-only helpers into their owning domains; removed `primitives/`. | Build, declarations, tests, and source audits passed. |
| C03 | `IMPLEMENTED` | Split `misc.ts` into encoding and security modules, moved `harden` to keys, and renamed password helpers. | Account encryption tests and downstream lock verification passed. |
| C04 | `IMPLEMENTED` | Updated tests, documentation, XRAY App, and all active mini-app consumers. | All downstream typechecks and production builds passed. |

## Outcome

The Cardano application entry now exposes reusable helpers only through `utilities`, with names and file ownership that reflect each helper's purpose.

## Project changes

- Added `utilities.addresses`, `assets`, `encoding`, `governance`, `keys`, `scripts`, `security`, and `slots`.
- Removed the equivalent root helper namespaces.
- Renamed `encryptDataWithPass` and `decryptDataWithPass` to `encryptWithPassword` and `decryptWithPassword`.
- Rehomed private account and transaction primitives under their owning domains.
- Updated the README and runtime boundary assertions.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Cardano helpers moved from root exports to `utilities.<domain>`. | Intentional breaking organization cleanup. | Import `utilities` and select the required domain. |
| C03 | Password security helpers have clearer names and their own namespace. | Algorithms and encrypted-data format are unchanged. | Use `utilities.security.encryptWithPassword` and `decryptWithPassword`. |

## Validation

- `npm run check` — passed; 32 deterministic tests passed and one live integration test skipped.
- Runtime package-boundary assertions — passed.
- XRAY App `npm run verify` — passed.
- Assets, Wallet, Transactions, and Graph typechecks/builds — passed.
- Retired-import scan and all repository `git diff --check` commands — passed.

## Deviations from instruction

The available Node runtime was 20.18.1, below current React Router consumer requirements. Typechecks and builds still passed; production builds ran outside the sandbox to permit local prerender sockets.

## Remaining human review

Review the intentional application-root export removal and the `utilities.security` naming.

## Reproducibility

Run `npm run check`, inspect the Cardano application entry, scan active consumers, and run the recorded downstream checks.
