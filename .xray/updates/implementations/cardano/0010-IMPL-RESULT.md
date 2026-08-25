# Cardano implementation 0010 result

Result-Version: v1
Implementation-ID: cardano/0010
Instruction: ./0010-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| `C01` | `IMPLEMENTED` | Added synchronous `transactions.inspect(cbor)` and client-bound identity, with one Cardano Lib envelope parse, exact caller CBOR, body hash, and deep immutability. | Functional/client, malformed, empty, and witnessed tests pass. |
| `C02` | `IMPLEMENTED` | Added exported readonly inspection types using `bigint` for ledger integers and explicit validity slots without JSON conversion. | Typecheck and exact-integer tests pass. |
| `C03` | `IMPLEMENTED` | Added ordered reference-only inputs plus complete outputs, assets, datum, scripts, collateral, and reference inputs. | Transaction and downstream app tests pass. |
| `C04` | `IMPLEMENTED` | Normalized all known body fields into SDK-owned semantic models and retained unknown field CBOR. | Sparse/current fixtures, build, and repository checks pass. |
| `C05` | `IMPLEMENTED` | Normalized certificate tags `0..18`, historical/pool/governance fields, exact deposits/refunds, and unknown future tags. | Certificate paths pass Cardano Lib and SDK validation. |
| `C06` | `IMPLEMENTED` | Added factual witness state, typed witness components, auxiliary metadata/scripts, and unsupported-field retention. | Empty and populated witness tests pass. |
| `C07` | `IMPLEMENTED` | Exported the function/model through Cardano and runtime facades, documented boundaries, and validated the linked app. | Full workspace check, formatting, and downstream wallet verification pass. |

## Outcome

xray-js now provides a synchronous, provider-free transaction inspection contract that preserves
exact CBOR and integers, exposes complete intrinsic detail, and never classifies signature completeness.

## Inputs consumed

- The 2026-08-25 human request and every local path named by the instruction.
- Current linked Cardano Lib transaction/body/witness/auxiliary bindings.
- Existing Cardano transaction tests, runtime facade, README, and XRAY App consumer.

## Project changes

- Added `transactions/inspection.ts` with public immutable types and semantic adapters.
- Added functional and created-client exports by identity.
- Added deterministic inspection tests and intrinsic-only documentation.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| `C01` | One synchronous inspection API serves functional and client namespaces. | Existing construction/signing remains unchanged. | Call `transactions.inspect(cbor)`. |
| `C02` | All ledger integers are `bigint`. | No inspection JSON serializer exists. | Format explicitly at UI boundaries. |
| `C03` | Inputs are references and outputs are complete intrinsic records. | No resolution options exist. | Do not expect input values or ownership. |
| `C04` | Known body semantics are SDK-owned and unknown fields retain CBOR. | Future fields are observable, not interpreted. | Render or log opaque fields explicitly. |
| `C05` | Certificate kinds use stable semantic names. | Tags `0/1` remain distinct from `7/8`. | Switch on `kind`, retaining `unknown`. |
| `C06` | Witness state is `empty` or `present`. | Presence is not complete signing. | Never relabel it as signed. |
| `C07` | Cardano package/runtime exports share binding identity. | No new subpath or dependency. | Existing Cardano import paths work. |

## Validation

- `npm run build --workspace @xray-network/xray-js-cardano` — passed.
- `npm test --workspace @xray-network/xray-js-cardano` — 31 passed, 1 live test skipped.
- `npm run typecheck --workspace @xray-network/xray-js-cardano` — passed.
- `npm run check` — passed for all workspaces.
- `npm run format:check` — passed.
- Linked XRAY App `npm run verify:wallet` — passed.
- `git diff --check` — passed.

## Deviations from instruction

None.

## Remaining human review

Review public names/discriminants, deep immutability, exact bigint display expectations, and future-field behavior.

## Reproducibility

Run `npm run check && npm run format:check` from the xray-js repository root.
