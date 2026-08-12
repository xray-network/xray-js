# Mini App Bridge implementation 0010 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0010
Created: 20260812T120134Z
Evidence-Mode: LOCAL
Depends-On: mini-app-bridge/0009
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Public bridge exports and active CIP-30 consumers | `LOCAL` | Yes | Collapse the redundant nested protocol subpath. |

## Objective

Publish all shared Cardano and CIP-30 protocol contracts from `/mini-app-bridge/cardano` while retaining role-specific operations under `client.cardano.cip30` and `host.cardano.cip30`.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Re-export CIP-30 constants, schemas, and types from the Cardano contract entry. | Preserve protocol values and schemas. | Cardano bridge contract | Build, tests, and declaration audit. |
| C02 | Remove the public `/cardano/cip30` package export and obsolete barrel. | Intentional breaking path cleanup. | Package exports | Negative resolution and export audit. |
| C03 | Update documentation and every active consumer. | Preserve host and mini-app behavior. | Repository and downstream apps | Full downstream validation. |

## Validation

- `npm run check`
- `npm run format:check`
- public export and retired-path audits
- downstream typechecks/builds
- `git diff --check`

## Completion criteria

The Cardano contract entry is the sole public protocol path and all consumers validate.

## Out of scope

Internal CIP-30 implementation layout or wire protocol changes.

## Blockers

None.
