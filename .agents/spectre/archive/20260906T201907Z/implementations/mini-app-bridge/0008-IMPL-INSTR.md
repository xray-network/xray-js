# Mini App Bridge implementation 0008 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0008
Created: 20260812T111145Z
Evidence-Mode: LOCAL
Depends-On: mini-app-bridge/0007
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Repository README and the compact Mini App Bridge API from `mini-app-bridge/0007` | `LOCAL` | Yes | Define distinct examples for framework-free and React consumers. |

## Objective

Separate Mini App Bridge documentation into JavaScript client, JavaScript host, and React examples.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Replace the mixed bridge snippets with distinct framework-free client and host/relay examples. | Keep the documented root `client` and `host` namespaces unchanged. | README | Formatting and import audit. |
| C02 | Add a valid React component example using the separate `/react` entry and Cardano hook namespace. | Keep React optional and separate from the bridge root. | README | Formatting and API audit. |

## Implementation steps

1. Reorganize the Mini App Bridge README section by consumer type and execution role.
2. Show protocol discovery and Cardano usage in the framework-free example.
3. Show hooks inside a React component and provider boundary.
4. Validate formatting, documented imports, and the resulting diff.

## Validation

- `npm run format:check`
- documented import/API audit
- `git diff --check`

## Compatibility and human review

This is a documentation-only change. Review whether the examples make the JavaScript, host, and React boundaries clear.

## Completion criteria

The README has separate, internally consistent examples for each supported consumption style and all local validation passes.

## Out of scope

Changing exports, runtime behavior, protocol names, or authorization semantics.

## Blockers

None.
