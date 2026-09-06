# Cardano implementation 0001 result

Result-Version: v1
Implementation-ID: cardano/0001
Instruction: ./0001-IMPL-INSTR.md
Evidence-Mode: DERIVED

## Change dispositions

| Change ID | Disposition   | Implementation                                                                                                                                                                                                                                                 | Validation                                                                                                                                                     |
| --------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `C01`     | `IMPLEMENTED` | Replaced local CIP-14 hashing, permissive DRep header parsing, generic standard account derivation, and Bech32 prefix rewriting with `AssetFingerprint`, focused CIP-129 identities, CIP-1852 paths/derivation, and Cardano key codecs.                        | Existing account/address/fingerprint fixtures pass; focused key-codec and strict DRep-role tests pass.                                                         |
| `C02`     | `IMPLEMENTED` | Replaced numeric ledger-script construction, manual tag-24 encoding, and heuristic CBOR wrapping with typed `Script`, `ScriptRef`, and explicit `SerializedPlutusScript` ownership.                                                                            | Raw Flat, single-CBOR, and double-CBOR inputs normalize to one double envelope and produce an identical ledger hash; parameter application passes.             |
| `C03`     | `IMPLEMENTED` | Replaced manual transaction CBOR decomposition and local signing-key inference with `Transaction` accessors and `discover_required_witnesses`; builders retain resolved inputs for finalizer signing.                                                          | Deterministic builder/finalizer test signs an account transaction without the caller repeating the already-resolved input; all transaction compilation passes. |
| `C04`     | `IMPLEMENTED` | Replaced numeric DRep, certificate, and empty-signer encodings with named Conway factories; corrected vote delegation and DRep register/unregister/update to certificate kinds 9, 16, 17, and 18; stopped native-script witness branches from falling through. | Focused local builds assert all four Conway DRep certificate kinds; complete SDK tests pass.                                                                   |
| `C05`     | `IMPLEMENTED` | Replaced hand-built cost-model maps and raw phase-two redeemer decoding with `CostModels.from_json` and typed `evaluatePhaseTwo` results.                                                                                                                      | Cardano SDK build/typecheck and the complete repository check pass.                                                                                            |
| `C06`     | `IMPLEMENTED` | Removed direct `@noble/hashes` and `@scure/base` dependencies, added the focused CIP package, updated the lockfile, and added deterministic ownership regressions.                                                                                             | Static scan finds none of the removed protocol workarounds in production SDK source; 51 tests pass.                                                            |

## Outcome

The re-analysis found protocol features that still had to move out of SDK ownership, but no
application feature that should move out of `xray-cardano-lib`. The updated library already owned
all required protocol implementations, so this change completed the move by deleting or replacing
the SDK-side implementations and delegating to the accepted owners.

The ownership boundary is now:

- `xray-cardano-lib`: CIP-14 fingerprints, CIP-129 governance identifiers, Cardano key codecs and
  CIP-1852 derivation, Conway DRep/certificate/script/transaction models, serialized Plutus
  envelopes, required-witness discovery, cost-model ingestion, and phase-two evaluation.
- `xray-js`: mnemonic UX, SDK DTO adaptation, account/wallet/connector state, providers, UTxO
  resolution, transaction workflow orchestration, signing coordination, submission, and network
  configuration.
- Reverse move from `xray-cardano-lib` to `xray-js`: none. Its production packages contain no
  provider, wallet, account-state, storage, submission, or network-orchestration implementation;
  CIP-30 mock boundaries remain library tests rather than an SDK feature.

## Inputs consumed

- Current human request and `cardano/0001` instruction
- Accepted adjacent results `typescript/0006`, `0007`, `0008`, `0017`, `0018`, `0019`, `0020`, and `0021`
- Current production and test source under `packages/cardano-sdk/`
- Read-only ownership scan of the adjacent `xray-cardano-lib` TypeScript packages

## Project changes

- Migrated asset, governance, key, address, script, transaction, and evaluation utilities to typed
  library owners.
- Migrated transaction-builder certificate and required-signer construction to named owners.
- Made `TxFinalizer` consume the resolved inputs already known by `TxBuilder`, while retaining its
  existing optional caller-supplied UTxO list.
- Removed obsolete direct hashing and Bech32 dependencies and added the focused CIP dependency.
- Added regression coverage for key conversion, strict governance roles, Plutus envelope identity,
  required-witness signing, and corrected Conway governance certificate kinds.

## Exported change contract

| Change ID | Semantic change                                                                                      | Compatibility                                                                                                                                                                        | Downstream action                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `C01`     | Protocol identities and standard derivation are validated by nominal library owners.                 | Existing valid fixtures and public SDK signatures are preserved; malformed or wrong-role governance identifiers are rejected strictly.                                               | Use valid CIP-129 DRep identifiers and supported Cardano extended-key role prefixes. |
| `C02`     | Plutus serialization form is explicitly identified and normalized before ledger use.                 | Valid raw, single-CBOR, and double-CBOR scripts remain accepted; malformed, over-wrapped, or ambiguous values are rejected instead of guessed.                                       | Correct invalid script payloads rather than relying on permissive wrapping.          |
| `C03`     | Witness discovery uses the complete typed transaction and its resolved inputs.                       | Builder-created finalizers preserve signing behavior and no longer require repeated builder inputs; imported transactions must still supply every input needed for typed resolution. | Supply resolved inputs when signing an externally imported transaction.              |
| `C04`     | Governance methods now emit Conway certificate kinds 9 and 16–18 instead of stale numeric encodings. | Fluent SDK method signatures are unchanged; produced ledger data is corrected.                                                                                                       | Rebuild any previously generated unsigned governance transaction.                    |
| `C05`     | Evaluation consumes typed transactions, UTxOs, cost models, and redeemer keys.                       | Budget ordering and ex-unit assignment are preserved.                                                                                                                                | None.                                                                                |
| `C06`     | The SDK no longer directly depends on Noble hashes or Scure base.                                    | `@scure/bip39` remains and still supplies mnemonic UX; the focused CIP package is a direct runtime dependency.                                                                       | Install from the updated lockfile.                                                   |

## Validation

- `npm run build --workspace @xray-network/xray-js-cardano` passed.
- `npm test --workspace @xray-network/xray-js-cardano` passed: 51 tests, 12 suites.
- `npm run typecheck --workspace @xray-network/xray-js-cardano` passed.
- `npm run check` passed for all workspaces: all builds, tests, and typechecks completed.
- `git diff --check` passed.
- Production-source scan passed: no direct Noble/Scure imports, raw phase-two call, hard-coded empty
  signer CBOR, numeric certificate construction, manual ScriptRef decoding, or `decodeCbor` remains
  in `packages/cardano-sdk/src`.
- Offline lockfile reconciliation passed under npm 10.8.2; it emitted only the repository's expected
  Node 20.18.1 versus `>=20.19.0` engine warnings.

## Deviations from instruction

None.

## Remaining human review

Review the stricter malformed-input behavior, the corrected Conway governance certificates, and
the conclusion that no provider/wallet/orchestration feature belongs in `xray-cardano-lib`, then
decide whether this result should move from `REVIEW` to `ACCEPTED`.

## Reproducibility

From the repository root, ensure the adjacent updated `xray-cardano-lib` workspace links are
installed, run `npm run check`, run `git diff --check`, and repeat the production-source scan listed
in the instruction validation section.
