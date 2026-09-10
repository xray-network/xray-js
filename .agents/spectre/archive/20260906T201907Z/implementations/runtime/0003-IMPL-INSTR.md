# Runtime implementation 0003 instruction

Implementation-Version: v1
Implementation-ID: runtime/0003
Created: 20260812T110024Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| `packages/runtime/src`, runtime manifest, Mini App Bridge local package, and the human-approved compact export design | `LOCAL` | Yes | Mirror only the supported bridge entry points through `@xray-network/xray-js`. |

## Objective

Mirror the compact Mini App Bridge facade through the public XRAY JavaScript runtime.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Retain root bridge, React, testing, and protocol entry wrappers. | Preserve the public `@xray-network/xray-js` package identity. | runtime | Build and typecheck. |
| C02 | Remove obsolete deep role, transport, Cardano React, and Cardano testing wrapper exports. | Consumers migrate to namespaces in the same coordinated change. | runtime manifest/source | Export audit and downstream builds. |

## Implementation steps

1. Reduce runtime bridge wrappers and manifest exports.
2. Build against the local bridge package.
3. Validate every local consumer.

## Validation

- `npm run check`
- runtime export audit
- downstream application validation
- `git diff --check`

## Compatibility and human review

Review the intentional breaking removal of deep runtime-role paths.

## Completion criteria

Only the supported compact bridge entry points are mirrored and all consumers validate.

## Out of scope

Changing non-bridge runtime exports or package versions.

## Blockers

None.
