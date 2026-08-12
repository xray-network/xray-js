# Repository implementation 0002 instruction

Implementation-Version: v1
Implementation-ID: repository/0002
Created: 20260812T111739Z
Evidence-Mode: LOCAL
Depends-On: cardano/0006
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Repository README and current public runtime exports | `LOCAL` | Yes | Organize examples by blockchain without documenting unavailable APIs as live. |

## Objective

Create a dedicated blockchain examples section with Cardano documentation and Bitcoin/Midnight placeholders.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Group the working Cardano facade, application API, and low-level library examples beneath one Cardano heading. | Keep documented Cardano imports and behavior unchanged. | README | Formatting and import audit. |
| C02 | Add Bitcoin and Midnight example placeholders with explicit availability status. | Do not imply that unavailable runtime modules can currently be imported. | README | Runtime export and documentation audit. |
| C03 | Keep packages, Mini App Bridge, and development guidance outside blockchain-specific examples. | Preserve existing cross-chain documentation. | README | Structure review and diff check. |

## Implementation steps

1. Add a blockchain availability table and dedicated headings.
2. Consolidate existing Cardano material under the Cardano heading.
3. Add clearly commented planned examples for Bitcoin and Midnight.
4. Validate formatting, live imports, placeholder accuracy, and the diff.

## Validation

- `npm run format:check`
- documented live import/API audit
- unavailable-module placeholder audit
- `git diff --check`

## Compatibility and human review

This is documentation-only. Review the hierarchy and placeholder wording.

## Completion criteria

Readers can distinguish live Cardano examples from planned Bitcoin and Midnight examples at a glance.

## Out of scope

Implementing Bitcoin or Midnight modules or changing package exports.

## Blockers

None.
