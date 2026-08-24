# Cardano implementation 0009 result

Result-Version: v1
Implementation-ID: cardano/0009
Instruction: ./0009-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| `C01` | IMPLEMENTED | `assetsToValue` now returns `Value.from_coin` before allocating `MultiAsset` when assets are absent or empty; non-empty assets retain their existing map construction. | Exact absent/empty `4_000_000n` assertions produce `1a003d0900`; token-bearing values remain tuples. |
| `C02` | IMPLEMENTED | UTxO conversion, explicit outputs, and collateral-return construction all consume the normalized primitive boundary. | Decoded converted UTxO, payment, change, and collateral-return amount nodes are coin-only. |
| `C03` | IMPLEMENTED | Added an Eternl-shaped regression plus token-map coverage with a quantity above JavaScript's safe-integer limit. | ADA-only values never contain an empty map; the non-empty policy/asset map and exact bigint quantity survive a built transaction. |
| `C04` | IMPLEMENTED | Caller-supplied transaction CBOR remains unchanged through import, local signing, and submission; the README requires explicit rebuilding to repair malformed input. | Received `[coin, {}]` bytes and body hash remain stable through signing, and the submitted CBOR equals the signed CBOR. |

## Outcome

xray-js now creates coin-only ADA values at its transaction conversion boundary and never allocates
an empty multi-asset map for SDK-authored outputs. Token-bearing construction is unchanged, while
inspection, signing, and submission preserve caller-supplied transaction identity.

## Inputs consumed

- Human-provided Eternl diagnostic recorded in the instruction.
- `packages/cardano/src/transactions/primitives.ts` and its direct builder consumers.
- Cardano package tests and README.
- The active XRAY App workspace for downstream typecheck and production-build validation.

## Project changes

- Short-circuited absent and empty asset arrays to `Value.from_coin`.
- Added CBOR helpers and regressions for value, UTxO, payment, change, collateral return, token maps,
  signing, hashing, and submission.
- Documented canonical SDK construction and lossless caller-supplied transaction handling.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| `C01` | Absent and empty asset arrays create the same coin-only Cardano value. | Public API, exports, and types are unchanged. | Remove application workarounds for empty `MultiAsset` construction. |
| `C02` | All xray-js value-conversion consumers inherit coin-only ADA construction. | Token-bearing transaction behavior is unchanged. | Wallets may parse SDK-authored ADA-only outputs without accepting `[coin, {}]`. |
| `C03` | Regression coverage fixes exact CBOR form and bigint token semantics. | Test contract only. | Preserve these assertions when changing transaction construction. |
| `C04` | Imported transaction bytes and hashes are never repaired during signing or submission. | Existing signing identity is preserved. | Explicitly rebuild malformed caller-supplied transactions to canonicalize them. |

## Validation

- `npm run test --workspace @xray-network/xray-js-cardano`: PASS; 30 tests passed and one live integration test skipped.
- `npm run check`: PASS; all package builds, 46 deterministic tests, one skipped live test, and all workspace typechecks.
- `npm run format:check`: PASS.
- Exact absent/empty `4_000_000n` CBOR: PASS; `1a003d0900`, never `821a003d0900a0`.
- Converted UTxO, explicit payment/change, and collateral-return amount-node checks: PASS.
- Non-empty token map and exact `9_007_199_254_740_993n` quantity: PASS.
- Received `[coin, {}]` import/sign/submit byte and hash preservation: PASS.
- XRAY App `npm run typecheck --workspace @xray-network/xray-app`: PASS against the local SDK workspace.
- XRAY App `npm run build:main --workspace @xray-network/xray-app`: PASS against the local SDK workspace.
- `git diff --check`: PASS.

## Deviations from instruction

None.

## Remaining human review

Review the two-layer construction boundary and confirm that imported malformed transaction CBOR
must remain untouched until a caller explicitly rebuilds it.

## Reproducibility

Run `npm run check`, `npm run format:check`, and `git diff --check` from xray-js, then run the XRAY
App typecheck and main production build from the linked downstream workspace.
