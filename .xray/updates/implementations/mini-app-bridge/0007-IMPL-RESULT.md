# Mini App Bridge implementation 0007 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0007
Instruction: ./0007-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Added root `client.platform`, `client.cardano.bridge`, and `client.cardano.cip30` namespaces. | Package build, namespace tests, and downstream builds passed. |
| C02 | `IMPLEMENTED` | Added symmetric root `host.platform`, `host.cardano.bridge`, and `host.cardano.cip30` namespaces. | Package build and namespace tests passed. |
| C03 | `IMPLEMENTED` | Added `cardano.bridge` to the separate React entry while retaining all platform hooks. | Package typecheck, namespace test, and React consumer builds passed. |
| C04 | `IMPLEMENTED` | Reduced package exports from 15 to 6, consolidated mocks under `/testing`, migrated tests/docs, and declared side-effect-free ESM. | Export/import audit, full repository check, formatting, and all local consumer validations passed. |

## Outcome

Mini App Bridge now presents compact role namespaces while React remains an optional separate entry and protocol/type entry points remain explicit.

## Inputs consumed

- `packages/mini-app-bridge/src` and package manifest.
- Bridge tests and repository README.
- Active local consumers and the human-approved export design.

## Project changes

- Added client, host, and React Cardano namespace barrels.
- Consolidated testing exports and removed the redundant Cardano testing shim.
- Removed obsolete deep role subpaths from the export map.
- Updated tests and documentation to the compact API.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Mini-app operations are selected by `client.<domain>` from the bridge root. | Wire behavior and payloads are unchanged. | Replace deep client imports with root `client` namespaces. |
| C02 | Host operations are selected by `host.<domain>` from the bridge root. | Wire behavior and payloads are unchanged. | Replace deep host imports with root `host` namespaces. |
| C03 | Cardano React hooks are under `cardano.bridge` on `/react`. | Platform hook names remain top-level. | Replace `/cardano/react` imports with the React namespace. |
| C04 | Deep role and transport subpaths are no longer exported. | Root, React, testing, Cardano protocol, and CIP-30 protocol paths remain. | Migrate before upgrading to this breaking surface. |

## Validation

- `npm run check` under Node 24.18.0 — passed; 32 tests passed and one live integration test skipped.
- `npm run format:check` — passed.
- All local consumer typechecks/builds and XRAY App verification — passed.
- Obsolete-import and export-map audits — passed.
- `git diff --check` — passed.

## Deviations from instruction

None.

## Remaining human review

Review the intentional removal of deep runtime-role subpaths and the namespace naming.

## Reproducibility

Run `npm run check`, import `client`/`host` from the bridge root, and import React APIs from `/react`.
