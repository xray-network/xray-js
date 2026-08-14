# Mini App Bridge implementation 0011 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0011
Created: 20260814T112318Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request and clarified V1 contract | `LOCAL` | Yes | Define account-derived host context, including a null context when no account is selected. |
| `packages/mini-app-bridge/src/platform/` | `LOCAL` | Yes | Own platform handshake, settings, route messages, and their public context type. |
| `packages/mini-app-bridge/src/transport/` | `LOCAL` | Yes | Own contextual envelope parsing and host/client delivery. |
| `packages/mini-app-bridge/src/react/` | `LOCAL` | Yes | Own connected host state and nullable context exposure to React consumers. |
| `packages/mini-app-bridge/src/testing/` and `packages/mini-app-bridge/test/` | `LOCAL` | Yes | Own deterministic mock behavior and bridge contract verification. |

## Objective

Allow every platform host message to carry a nullable account context so an embedded mini app remains connected to XRAY platform services when no account is selected, while preserving non-null blockchain contexts for chain-specific protocols.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Add and export a platform context schema/type equal to `HostContext | null`, and use it for every platform host message type and client parser. | This intentionally changes the platform envelope contract; Cardano Bridge and CIP-30 contexts remain strict and non-null. | Platform protocol/client | Package typecheck and tests. |
| C02 | Accept nullable context in platform host send helpers and the generic host transport without weakening public chain-specific helper signatures. | Existing non-null host callers remain valid; platform hosts may now send `null`. | Platform host and transport | Package build and typecheck. |
| C03 | Keep React `connected` based on receipt of a valid handshake rather than context presence, and allow platform getters/pushes to retain a null context. | `connected: true, context: null` means XRAY host available with no selected account. | React store | Focused accountless-host test. |
| C04 | Extend mocks, tests, and bridge documentation with the accountless platform-host contract and prove chain-specific parsing remains context-strict. | Protocol version remains 1; no account-presence boolean is added. | Testing and README | Package and monorepo checks. |

## Implementation steps

1. Define the nullable platform context beside the platform protocol and thread it through client and host wrappers.
2. Generalize host envelope delivery only enough to carry a valid nullable platform context.
3. Update React store message typing without conflating null context with a failed handshake.
4. Add accountless mock coverage and document host connectivity versus account context.
5. Run package tests, complete monorepo checks, formatting checks, and diff validation.

## Validation

- `npm test --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run check`
- `npm run format:check`
- Confirm platform handshake/theme messages parse with `context: null` and `connected` remains true.
- Confirm Cardano Bridge and CIP-30 types and parsers still require `CardanoHostContext`.
- `git diff --check`

## Compatibility and human review

This is a deliberate platform contract expansion within protocol version 1. Existing hosts sending a non-null context remain valid. Review consumers that previously treated null context as host disconnection; they must use the handshake result or React `connected` state instead.

## Completion criteria

- Platform clients and React bindings accept a valid host handshake and platform settings with null context.
- Platform host helpers can emit null context.
- Chain-specific protocols still reject or exclude null context.
- Tests and documentation define `connected: true, context: null` as the accountless embedded state.

## Out of scope

- Adding an account-presence boolean.
- Making Cardano Bridge or CIP-30 contexts nullable.
- Changing blockchain protocol names, payloads, authorization, or protocol version.
- Changing XRAY App routes or persistence.

## Blockers

None.
