# Cardano implementation 0009 instruction

Implementation-Version: v1
Implementation-ID: cardano/0009
Created: 20260824T092633Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-provided Eternl transaction diagnostic | `LOCAL` | Yes | Identifies the rejected ADA-only output form `[coin, {}]` produced by an XRAY transaction. |
| `packages/cardano/src/transactions/primitives.ts` and transaction builder consumers | `LOCAL` | Yes | Define application values, UTxO conversion, explicit outputs, collateral return, and transaction construction. |
| Cardano package tests, README, and active XRAY App consumer | `LOCAL` | Yes | Define public behavior, interoperability coverage, and downstream verification. |

## Objective

Construct canonical ADA-only values at xray-js transaction conversion boundaries.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| `C01` | Make `assetsToValue` use the coin-only Cardano Lib value path when assets are absent or empty, and create a `MultiAsset` only when at least one asset is present. | Behavioral correction with no public API, export, or type change. | Cardano transaction primitives | Exact-CBOR tests for undefined, empty, and non-empty assets. |
| `C02` | Apply the invariant to every direct consumer, including UTxO conversion, explicit transaction outputs, and explicit collateral-return values. | SDK-authored ADA-only values become accepted by strict wallet parsers; token-bearing behavior remains unchanged. | Cardano transaction builder | Primitive and transaction-output regressions across direct consumer paths. |
| `C03` | Add an Eternl-shaped regression proving no ADA-only value created by xray-js transaction primitives contains `[coin, {}]`, while token-bearing outputs still encode their complete multi-asset map and bigint quantities. | Test-only contract expansion. | Cardano package tests | Decode converted and explicit-output CBOR and assert semantic value forms. |
| `C04` | Keep sign, submit, and inspection paths lossless for caller-supplied CBOR; do not repair an already built transaction or alter its hash, and document that malformed inputs must be rebuilt. | Preserves transaction identity and existing signing semantics. | Cardano transaction API and README | Round-trip/hash assertions, documentation scan, and downstream XRAY App verification. |

## Implementation steps

1. Short-circuit `assetsToValue` to a coin-only value before allocating an empty `MultiAsset`.
2. Exercise every direct value-construction consumer with ADA-only and token-bearing fixtures.
3. Add conversion and explicit-output regressions based on the Eternl rejection and retain lossless signing coverage.
4. Document the construction boundary and run repository and downstream checks.

## Validation

- `npm run check`
- `npm run format:check`
- Confirm absent and empty asset arrays produce the coin-only `4_000_000` CBOR form `1a003d0900`, never `821a003d0900a0`.
- Decode converted UTxOs, explicit payments, and explicit collateral-return values and confirm no optional empty multi-asset maps are present.
- Confirm non-empty token maps and exact bigint quantities are unchanged.
- Run the XRAY App typecheck/build verification against the local SDK workspace.
- `git diff --check`

## Compatibility and human review

Review the two-layer defense with Cardano Lib: xray-js owns direct conversions, Cardano Lib owns builder arithmetic and generated change, and neither layer normalizes externally supplied transaction bytes during signing.

## Completion criteria

Every ADA-only value created by xray-js transaction primitives uses coin-only CBOR, strict wallet parsers can decode the regression outputs, token-bearing values are unchanged, signing remains lossless, and repository/downstream checks pass.

## Out of scope

- Repairing existing transaction CBOR, changing transaction hashes during signing, Cardano Lib builder arithmetic or generated-change normalization, Cardano Lib publication, dependency upgrades, wallet-specific UI changes, or network submission

## Blockers

None.
