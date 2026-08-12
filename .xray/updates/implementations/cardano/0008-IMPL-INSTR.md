# Cardano implementation 0008 instruction

Implementation-Version: v1
Implementation-ID: cardano/0008
Created: 20260812T114643Z
Evidence-Mode: LOCAL
Depends-On: cardano/0007
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-approved `utilities` grouping and naming design | `LOCAL` | Yes | Replace seven application-root helper namespaces with one coherent group. |
| Cardano source/tests, README, and active local consumers | `LOCAL` | Yes | Define and validate the coordinated breaking migration. |

## Objective

Group stateless Cardano application helpers under one well-named `utilities` namespace.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Replace root `addresses`, `assets`, `encoding`, `governance`, `keys`, `scripts`, and `slots` exports with `utilities`. | Intentional breaking cleanup; preserve helper behavior. | Cardano public index | Export audit, tests, and declarations. |
| C02 | Replace the internal `primitives` directory with domain-specific `utilities`, `accounts/primitives`, and `transactions/primitives` ownership. | Internal-only source move. | Cardano source | Build, typecheck, and source scan. |
| C03 | Split `misc.ts` into `encoding`, `security`, and key hardening; rename password helpers to `encryptWithPassword` and `decryptWithPassword`. | Intentional helper rename; preserve cryptographic behavior. | Cardano utilities | Tests and downstream verification. |
| C04 | Migrate README, package tests, and every active local consumer to `utilities.<domain>`. | Coordinated breaking migration before publication. | xray-js and sibling apps | Full repository/downstream validation. |

## Implementation steps

1. Move internal helper modules into their owning directories.
2. Add the `utilities` barrel and split miscellaneous helpers.
3. Update internal imports, public tests, and documentation.
4. Migrate every active consumer and run completion checks.

## Validation

- `npm run check`
- public export/declaration and retired-path audits
- `npm run format:check`
- downstream typechecks/builds and XRAY App verification
- `git diff --check`

## Compatibility and human review

This removes seven root helper namespaces and renames two password helpers. Review namespace depth and names.

## Completion criteria

Only `utilities` exposes application helpers, the obsolete `primitives` tree is absent, consumers migrate, and all validations pass.

## Out of scope

Changing helper algorithms, Cardano Lib APIs, or blockchain behavior.

## Blockers

None.
