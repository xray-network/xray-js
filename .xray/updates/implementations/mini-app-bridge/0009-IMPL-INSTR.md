# Mini App Bridge implementation 0009 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0009
Created: 20260812T111418Z
Evidence-Mode: LOCAL
Depends-On: mini-app-bridge/0008
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Repository README, compact bridge exports, and CIP-30 client API | `LOCAL` | Yes | Separate native Cardano Bridge and CIP-30 documentation by API model. |

## Objective

Give Cardano Bridge and CIP-30 independent JavaScript and React examples.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Split the framework-free Cardano Bridge and CIP-30 flows into independent examples. | Preserve protocol discovery and the existing `client.cardano` namespaces. | README | Formatting and API audit. |
| C02 | Separate native Cardano React hooks from CIP-30 usage in React event handlers. | Do not introduce or imply a CIP-30 hook API. | README | Formatting and API audit. |
| C03 | Explain that `enable()` is the CIP-30 authorization boundary and that the browser connector is optional compatibility. | Preserve current authorization semantics. | README | Documentation review. |

## Implementation steps

1. Split JavaScript examples by Cardano protocol.
2. Label the native Cardano React hook example explicitly.
3. Add a separate CIP-30 React component using the framework-free client API.
4. Validate formatting, documented imports, and the resulting diff.

## Validation

- `npm run format:check`
- documented import/API audit
- `git diff --check`

## Compatibility and human review

This is a documentation-only clarification. Review the Cardano Bridge versus CIP-30 boundary.

## Completion criteria

Neither JavaScript nor React documentation mixes native Cardano Bridge operations with CIP-30 authorization and API usage.

## Out of scope

Adding CIP-30 hooks, changing exports, or changing protocol behavior.

## Blockers

None.
