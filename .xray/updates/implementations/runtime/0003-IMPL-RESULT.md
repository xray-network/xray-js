# Runtime implementation 0003 result

Result-Version: v1
Implementation-ID: runtime/0003
Instruction: ./0003-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Retained runtime wrappers for the bridge root, React, testing, Cardano protocol, and CIP-30 protocol entries. | Runtime build/typecheck and all consumer builds passed. |
| C02 | `IMPLEMENTED` | Removed nine obsolete wrapper files and their deep role/transport export-map entries. | Export audit, full repository check, and downstream validation passed. |

## Outcome

`@xray-network/xray-js` now mirrors only the compact supported Mini App Bridge surface.

## Inputs consumed

- Runtime sources and manifest.
- Local Mini App Bridge package.
- Human-approved compact export design.

## Project changes

- Reduced mirrored bridge entries from fourteen to five.
- Removed obsolete role, transport, Cardano React, and Cardano testing wrapper files.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Compact bridge namespaces are available from `@xray-network/xray-js/mini-app-bridge`. | Package identity and retained paths are unchanged. | Use the bridge root or retained specialized entries. |
| C02 | Deep role wrappers are no longer published by the runtime. | Coordinated local consumers were migrated. | Replace old imports before upgrading. |

## Validation

- `npm run check` under Node 24.18.0 — passed.
- All local consumer typechecks/builds and XRAY App verification — passed.
- Runtime export audit and `git diff --check` — passed.

## Deviations from instruction

None.

## Remaining human review

Review the breaking export-map reduction.

## Reproducibility

Build the workspace and inspect `packages/runtime/package.json` bridge exports.
