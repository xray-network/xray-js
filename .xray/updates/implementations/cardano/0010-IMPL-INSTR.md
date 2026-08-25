# Cardano implementation 0010 instruction

Implementation-Version: v1
Implementation-ID: cardano/0010
Created: 20260825T084339Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human request dated 2026-08-25 for synchronous `transactions.inspect(cbor)` without UTxO resolution or JSON conversion | `LOCAL` | Yes | Defines the public API, exact-integer, signedness, and non-resolution boundaries. |
| `packages/cardano/src/transactions/{transaction,index}.ts` and `packages/cardano/src/internal/transaction.ts` | `LOCAL` | Yes | Define current transaction parsing, hashing, signing wrappers, and public transaction namespace. |
| `packages/cardano/src/types.ts`, transaction primitives, and current Cardano Lib bindings | `LOCAL` | Yes | Define application DTO ownership and available typed ledger owners. |
| `packages/cardano/test/transaction.test.ts`, package README, runtime facade, and active XRAY App consumer | `LOCAL` | Yes | Define deterministic transaction coverage, documentation, public export identity, and downstream use. |

## Objective

Add a complete synchronous intrinsic Cardano transaction inspection API without UTxO resolution or signedness inference.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| `C01` | Add `transactions.inspect(cbor)` to the functional transaction namespace and `cardano.transactions.inspect(cbor)` to created clients. Parse the ordinary transaction envelope once through Cardano Lib, preserve caller CBOR, compute the body hash, and return one deeply immutable inspection model for empty, partial, or populated witness sets. | Additive public API. It accepts only CBOR and has no `kind`, `resolvedUtxos`, provider, account, network, or JSON options. Existing unsigned/signed construction and signing wrappers remain operational and are not used to classify inspection input. | Cardano transaction API and client facade | Functional/client identity, strict malformed input, empty/partial/populated witnesses, and lossless hash/CBOR tests. |
| `C02` | Define exported readonly inspection types whose ledger integers are always `bigint`; identifiers, addresses, hashes, asset names, script/data bytes, and CBOR are lowercase hex or Cardano text strings; small closed tags/counts may be `number`. Expose validity as `{ invalidBefore?: bigint, invalidHereafter?: bigint }`, where `invalidHereafter` is body key 3/legacy TTL. Do not add `inspectionToJSON`, `toJSON`, or `number | string` numeric unions. | Exact runtime TypeScript contract; no implicit JSON serialization. | Transaction inspection model | Type assertions above `Number.MAX_SAFE_INTEGER`, signed mint quantities, optional validity bounds, and public declaration tests. |
| `C03` | Return every ordered spending input as `{ transactionId, index }` and every ordered output with index, address, lovelace, all native assets, datum hash or inline datum, and reference script. Include collateral/reference input references and collateral return with the same intrinsic detail. | Transaction CBOR contains references only: do not look up, accept, or attach resolved UTxOs and do not expose input address/value/assets fields. | Transaction body inspection adapter | Ordered multi-input/output, Byron/Shelley address, multi-asset, datum, reference-script, collateral, and reference-input fixtures. |
| `C04` | Normalize every body field: fee; validity; certificates; withdrawals; protocol update; auxiliary/script-data hashes; mint/burn; required signers; network ID; total collateral; voting/proposal procedures; current treasury value; donation; and unknown body fields with preserved key/CBOR. Use semantic credential, DRep, pool, anchor, governance, value, and script structures owned by the SDK model rather than exposing Cardano Lib classes or generic CBOR nodes. | Inspection is read-only and protocol-complete for known fields; unsupported future fields remain observable without becoming accepted semantics. | Transaction body and value adapters | Sparse/full bodies, exact bigint, malformed known fields, governance, update, and unknown-field preservation tests. |
| `C05` | Normalize certificate tags `0..18` to the required discriminants below, include every available field, distinguish implicit amount tags `0/1` from explicit amount tags `7/8`, and return `{ kind: "unknown", tag, cbor }` for future unsupported tags rather than failing the complete transaction. | Stable semantic SDK names replace raw constructor names only in the new inspection model; existing builder APIs are unchanged. | Certificate inspection adapter | One deterministic fixture per known tag plus unknown-tag, malformed payload, optional anchor, pool parameters, and bigint amount tests. |
| `C06` | Return `isValid`, a factual `witnessState: "empty" | "present"`, typed witness components (vkeys, bootstrap witnesses, native/Plutus scripts, datums, redeemers), typed auxiliary metadata/scripts, and unsupported witness/auxiliary fields with CBOR. Never call witness presence `signed` or claim completeness. | No cryptographic verification, required-witness calculation, signature completeness, script execution, or metadata fetching. | Witness and auxiliary-data inspection adapters | Empty, vkey-only partial, script/redeemer/data, bootstrap, metadata, and unknown-field fixtures. |
| `C07` | Export the model and function through `@xray-network/xray-js-cardano`, `@xray-network/xray-js/cardano`, and created-client types by binding identity; document intrinsic-only semantics and add focused plus downstream XRAY App validation. | No new dependency, provider request, runtime root export, bridge contract, or package subpath. | Cardano/runtime exports, tests, and README | Package tests, declaration/typecheck, repository check/format, packed runtime imports, downstream app typecheck/build, and `git diff --check`. |

## Required certificate discriminants

| Tag | `kind` | Required semantic fields |
| ---: | --- | --- |
| `0` | `stake-registration` | Stake credential |
| `1` | `stake-deregistration` | Stake credential |
| `2` | `stake-delegation` | Stake credential and pool ID |
| `3` | `pool-registration` | Complete pool parameters |
| `4` | `pool-retirement` | Pool ID and retirement epoch |
| `5` | `genesis-key-delegation` | Genesis hash, delegate hash, and VRF key hash |
| `6` | `move-instantaneous-rewards` | Reserves/treasury pot and reward payload |
| `7` | `stake-registration-with-deposit` | Stake credential and explicit deposit |
| `8` | `stake-deregistration-with-refund` | Stake credential and explicit refund |
| `9` | `vote-delegation` | Stake credential and DRep |
| `10` | `stake-vote-delegation` | Stake credential, pool ID, and DRep |
| `11` | `stake-registration-pool-delegation` | Stake credential, pool ID, and deposit |
| `12` | `stake-registration-vote-delegation` | Stake credential, DRep, and deposit |
| `13` | `stake-registration-pool-vote-delegation` | Stake credential, pool ID, DRep, and deposit |
| `14` | `committee-hot-authorization` | Cold and hot credentials |
| `15` | `committee-cold-resignation` | Cold credential and optional anchor |
| `16` | `drep-registration` | DRep credential, deposit, and optional anchor |
| `17` | `drep-deregistration` | DRep credential and explicit refund |
| `18` | `drep-update` | DRep credential and optional anchor |

## Implementation steps

1. Add the immutable public inspection model and one generic transaction-envelope parser.
2. Normalize ordered input/output/value/body fields without accepting resolution context.
3. Implement the complete certificate mapping and witness/auxiliary projections.
4. Preserve unknown future fields as tagged CBOR fallbacks and keep malformed known fields strict.
5. Export through the Cardano package, runtime facade, and client instance; document and validate downstream use.

## Validation

- `npm run build --workspace @xray-network/xray-js-cardano`
- `npm test --workspace @xray-network/xray-js-cardano`
- `npm run typecheck --workspace @xray-network/xray-js-cardano`
- `npm run check`
- `npm run format:check`
- Confirm `inspect` has exactly one `cbor: string` argument and no overload/options for transaction kind, UTxOs, providers, accounts, networks, or JSON conversion.
- Confirm every known body field and certificate tag has a deterministic fixture and unknown fields retain CBOR.
- Confirm a witness-bearing transaction reports `present` but never `signed` or `complete`.
- Run XRAY App typecheck and main production build against the linked SDK workspace.
- `git diff --check`

## Compatibility and human review

Review the public discriminants and field names, exact bigint behavior, legacy TTL naming, strict-known/opaque-unknown boundary, complete certificate mapping, witness wording, deep immutability, and absence of any input-resolution or JSON API.

## Completion criteria

- Both functional and created-client Cardano transaction namespaces expose the same synchronous `inspect(cbor)` behavior.
- The inspection covers every intrinsic known transaction body, output, certificate, witness, and auxiliary-data field and preserves unknown fields.
- Inputs remain ordered references only; no UTxO or provider resolution path exists.
- All ledger integers are `bigint`, witness state is factual, and no inspection JSON serializer exists.
- Cardano package, repository, public-export, and downstream app validation passes.

## Out of scope

- UTxO resolution, provider/network requests, input address/value/assets, transaction balancing, fee validation, signature or script verification, signed/unsigned classification, asset metadata/decimals, JSON serialization, transaction mutation, submission, bridge changes, or UI implementation

## Blockers

None.
