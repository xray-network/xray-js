# Cardano implementation 0007 instruction

Implementation-Version: v1
Implementation-ID: cardano/0007
Created: 20260812T112201Z
Evidence-Mode: LOCAL
Depends-On: cardano/0006
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-approved strict Cardano application/library boundary | `LOCAL` | Yes | Assign all raw Cardano Lib namespaces exclusively to `/cardano/lib`. |
| Cardano source, runtime facade/tests, README, and active local consumers | `LOCAL` | Yes | Define and validate the breaking export migration. |

## Objective

Export Cardano Lib namespaces only from `@xray-network/xray-js/cardano/lib`.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Remove `cips` and `plutus` from the Cardano application package root. | Breaking by request; application operations remain unchanged. | packages/cardano | Build, declarations, tests, and export audit. |
| C02 | Keep `/cardano/lib` as the sole aggregate owner of `chain`, `core`, `crypto`, `cips`, and `plutus`. | Preserve all five low-level namespaces and binding behavior. | packages/runtime | Runtime contract tests and import smoke. |
| C03 | Update README examples to use `cardanoLib.cips` and `cardanoLib.plutus` only through `/cardano/lib`. | Remove documentation of retired application-root aliases. | README | Documentation scan and formatting. |
| C04 | Migrate every active local consumer from application-root `cips`/`plutus` imports to `/cardano/lib`. | Coordinated breaking migration before publication. | sibling applications | Downstream typechecks/builds. |

## Implementation steps

1. Remove the duplicate application-root namespace exports and obsolete barrel.
2. Update package and runtime contract tests.
3. Update documentation and all active consumers.
4. Run repository and downstream validation.

## Validation

- `npm run check`
- application/low-level export audit
- downstream consumer typechecks and builds
- `npm run format:check`
- `git diff --check`

## Compatibility and human review

This intentionally removes `cips` and `plutus` from `/cardano`. Review the strict application-versus-library boundary.

## Completion criteria

Only `/cardano/lib` exposes Cardano Lib namespaces, retired imports are absent, and all affected consumers validate.

## Out of scope

Changing Cardano Lib behavior, application operations, or package versions.

## Blockers

None.
