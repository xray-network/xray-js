# Runtime implementation 0005 instruction

Implementation-Version: v1
Implementation-ID: runtime/0005
Created: 20260812T120134Z
Evidence-Mode: LOCAL
Depends-On: mini-app-bridge/0010
Provider-Evidence: NONE

## Objective

Mirror the compact Mini App Bridge Cardano contract entry and remove the redundant runtime `/mini-app-bridge/cardano/cip30` path.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Remove the nested CIP-30 export mapping and wrapper module. | Intentional breaking path cleanup. | Runtime facade | Build and negative resolution audit. |
| C02 | Ensure `/mini-app-bridge/cardano` exposes both bridge and CIP-30 contracts. | Preserve all shared contract values and types. | Runtime facade | Runtime tests and declarations. |

## Validation

- runtime build, tests, and typecheck
- package export audit
- `git diff --check`

## Completion criteria

Runtime exposes one Cardano bridge contract subpath and validates.

## Out of scope

Operational client or host namespace changes.

## Blockers

None.
