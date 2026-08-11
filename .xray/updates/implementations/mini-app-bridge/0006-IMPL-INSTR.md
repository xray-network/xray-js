# Mini App Bridge implementation 0006 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0006
Created: 20260811T195803Z
Evidence-Mode: LOCAL
Depends-On: mini-app-bridge/0005
Provider-Evidence: NONE

## Inputs and authority

| Input                                      | Kind    | Required | Purpose                                  |
| ------------------------------------------ | ------- | -------- | ---------------------------------------- |
| Human request on 2026-08-11                | `LOCAL` | Yes      | Rename the Cardano protocol identifier. |
| `packages/mini-app-bridge/src/cardano/`    | `LOCAL` | Yes      | Owns the protocol constant and hooks.    |
| `packages/mini-app-bridge/src/testing/`    | `LOCAL` | Yes      | Owns the mock handshake contract.        |

## Objective

Rename the Cardano protocol contract from `cardano.native` to `cardano.bridge`.

## Changes to implement

| Change ID | Requirement                                                                 | Compatibility                                    | Local owner     | Validation                     |
| --------- | --------------------------------------------------------------------------- | ------------------------------------------------ | --------------- | ------------------------------ |
| C01       | Rename the exported protocol constant and identifier to Cardano Bridge.     | Coordinated pre-release breaking contract rename. | Cardano protocol | Bridge build, types, and tests. |
| C02       | Update React protocol discovery, mock handshakes, and contract assertions.  | Do not retain the old protocol identifier.        | Hooks/testing    | Bridge tests.                  |
| C03       | Document Cardano Bridge and CIP-30 discovery and usage in the root README. | Keep examples aligned with public package exports. | Documentation    | README formatting audit.       |

## Implementation steps

1. Rename the public constant and protocol string.
2. Migrate React hooks, mock-host defaults, and tests.
3. Document both Cardano protocols and their distinct activation flows.
4. Validate the bridge package and active consumers.

## Validation

- `npm run check`
- Active consumer verification
- `git diff --check`

## Compatibility and human review

Review consumers together because hosts and mini apps must advertise and check the same protocol identifier.

## Completion criteria

The renamed contract and consumers validate and implementation mini-app-bridge/0006 has a result in `REVIEW`.

## Out of scope

Wire message type renames or client architecture changes.

## Blockers

None.
