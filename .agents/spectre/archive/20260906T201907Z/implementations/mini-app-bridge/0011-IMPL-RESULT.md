# Mini App Bridge implementation 0011 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0011
Instruction: ./0011-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Added exported `PlatformHostContext` and `platformHostContextSchema` contracts equal to `HostContext \| null`, and applied them to every platform response parser. | Bridge build, typecheck, and accountless handshake test passed. |
| C02 | `IMPLEMENTED` | Platform host helpers and generic host delivery accept nullable platform context without changing Cardano helper signatures. | Complete monorepo build and typecheck passed. |
| C03 | `IMPLEMENTED` | React state now treats a valid handshake as connected even when its context is null; getters and publications retain the nullable context. | Accountless React-store test passed with theme access and an empty protocol list. |
| C04 | `IMPLEMENTED` | Mock-host state, deterministic tests, and public documentation define `connected: true, context: null`. | Complete SDK check, formatting, and source audits passed. |

## Outcome

Mini apps can remain connected to XRAY platform services without a selected account. Platform
messages carry either the host-selected account context or null; Cardano Bridge and CIP-30 remain
strictly Cardano-contextual.

## Exported change contract

| Semantic change | Compatibility | Downstream action |
| --- | --- | --- |
| Platform host envelopes accept `context: null`. | Existing non-null contexts remain valid and protocol version stays at 1. | Determine host connectivity from handshake/`connected`, not context presence. |
| Platform client and listener results expose `PlatformHostContext`. | This widens platform context from `HostContext` to `HostContext \| null`. | Handle the accountless case before using blockchain/network fields. |
| Chain-specific contexts remain non-null. | Cardano Bridge and CIP-30 behavior is unchanged. | Continue using their strict Cardano context contracts. |

## Validation

- `npm run check` — passed; all deterministic package tests passed and the existing live Cardano integration test remained skipped.
- Mini App Bridge tests — passed, including accountless handshake, empty protocols, React connectivity, and platform theme access.
- `npm run format:check` — passed.
- Platform-versus-Cardano context source audit — passed.
- `git diff --check` — passed.

## Deviations from instruction

The human explicitly requested planning and implementation together, so the instruction and result
were created in one working session. No implementation was marked accepted; it remains in REVIEW.

## Remaining human review

Review downstream mini apps that may still use `context === null` as a proxy for host disconnection.

## Reproducibility

From the xray-js repository root, run `npm run check`, `npm run format:check`, and
`git diff --check`.
