# Mini App Bridge implementation 0007 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0007
Created: 20260812T110024Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| `packages/mini-app-bridge/src`, its manifest/tests, repository README, active local consumers, and the human-approved compact export design | `LOCAL` | Yes | Define the public role namespaces and compatibility boundary. |

## Objective

Compact Mini App Bridge runtime exports into root client/host namespaces and one namespaced React entry.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Export `client.platform`, `client.cardano.bridge`, and `client.cardano.cip30` from the bridge root. | Preserve every existing client operation and protocol schema. | mini-app-bridge | Build, tests, and typecheck. |
| C02 | Export matching `host` namespaces from the bridge root. | Preserve every existing host send/listen operation. | mini-app-bridge | Build, tests, and typecheck. |
| C03 | Expose Cardano Bridge hooks as `cardano.bridge` from `/react`; keep React separate and optional. | Preserve platform hook names and behavior. | mini-app-bridge/react | Build and consumer typechecks. |
| C04 | Remove obsolete role, transport, Cardano React, and Cardano testing subpath exports after migrating owned tests/docs. | Retain root, protocol, `/react`, `/testing`, `/cardano`, and `/cardano/cip30` entry points. | mini-app-bridge manifest/docs/tests | Export audit and full repository check. |

## Implementation steps

1. Add client, host, and React namespace barrels.
2. Update the package export map and mark ESM modules side-effect-free.
3. Migrate bridge tests and documentation.
4. Validate package behavior and downstream consumers.

## Validation

- `npm run check`
- public export/import audit
- downstream application validation
- `git diff --check`

## Compatibility and human review

This intentionally removes deep runtime-role import paths. Review namespace ergonomics and retained protocol/type paths.

## Completion criteria

The compact namespace API builds, tests pass, obsolete imports are absent, and all local consumers validate.

## Out of scope

Replacing Zod, changing wire messages, changing CIP-30 authorization semantics, or combining React into the root entry.

## Blockers

None.
