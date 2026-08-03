# Cardano SDK implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: cardano-sdk/0001
Created: 20260803T141031Z
Evidence-Mode: DERIVED
Depends-On: [xray-cardano-lib typescript/0006](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0006-IMPL-RESULT.md), [typescript/0007](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0007-IMPL-RESULT.md), [typescript/0008](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0008-IMPL-RESULT.md), [typescript/0017](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0017-IMPL-RESULT.md), [typescript/0018](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0018-IMPL-RESULT.md), [typescript/0019](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0019-IMPL-RESULT.md), [typescript/0020](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0020-IMPL-RESULT.md), [typescript/0021](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0021-IMPL-RESULT.md)
Provider-Evidence: NONE

## Inputs and authority

| Input                                                                                                                              | Kind                    | Required | Purpose                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| [`xray-cardano-lib/typescript/0006`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0006-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Typed Conway certificate and DRep construction with corrected discriminants.       |
| [`xray-cardano-lib/typescript/0007`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0007-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Canonical CIP-14 asset fingerprint ownership.                                      |
| [`xray-cardano-lib/typescript/0008`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0008-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Typed CIP-1852 derivation and focused CIP-129 identity parsing.                    |
| [`xray-cardano-lib/typescript/0017`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0017-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Typed transaction decomposition and reconstruction.                                |
| [`xray-cardano-lib/typescript/0018`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0018-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Required-witness discovery and canonical empty required signers.                   |
| [`xray-cardano-lib/typescript/0019`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0019-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Typed ledger scripts, script references, and explicit serialized Plutus envelopes. |
| [`xray-cardano-lib/typescript/0020`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0020-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Typed phase-two evaluation and redeemer identity.                                  |
| [`xray-cardano-lib/typescript/0021`](../../../../../xray-cardano-lib/.xray/updates/implementations/typescript/0021-IMPL-RESULT.md) | `IMPLEMENTATION_RESULT` | Yes      | Public CostModels JSON consumption identity.                                       |
| `packages/cardano-sdk/src/` and `packages/cardano-sdk/test/`                                                                       | `LOCAL`                 | Yes      | Existing SDK public compatibility boundary and validation.                         |
| Current human request to adopt the updated library without moving application orchestration into it                                | `LOCAL`                 | Yes      | Ownership and implementation authorization.                                        |

## Objective

Replace Cardano protocol interpretation in the SDK with accepted typed xray-cardano-lib APIs while
preserving the SDK's account, provider, connector, DTO, and orchestration boundaries.

## Changes to implement

| Change ID | Requirement                                                                                                                                                   | Compatibility                                                                                                                                                              | Local owner                                                                                                                                 | Validation                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `C01`     | Delegate asset fingerprints, DRep identities, and standard CIP-1852 derivation to their accepted library owners.                                              | Preserve existing SDK utility signatures and account outputs; retain generic legacy derivation only where the typed CIP-1852 API cannot represent an existing public path. | `packages/cardano-sdk/src/utils/{asset,governance,keys,address}.ts`                                                                         | Existing fixtures plus strict malformed identity and standard derivation coverage.                                |
| `C02`     | Replace numeric script construction, tag-24 encoding, and heuristic serialized-script handling with typed Script, ScriptRef, and SerializedPlutusScript APIs. | Preserve SDK Script DTOs and public utility results; reject ambiguous or malformed script envelopes instead of guessing.                                                   | `packages/cardano-sdk/src/utils/script.ts`                                                                                                  | Native/Plutus hash, address, reference, envelope, and parameter-application tests.                                |
| `C03`     | Replace manual transaction decomposition and signing-key discovery with Transaction accessors and discover_required_witnesses.                                | Preserve TxFinalizer public behavior and intersect nominal required hashes with account-owned keys.                                                                        | `packages/cardano-sdk/src/core/txFinalizer.ts`, `packages/cardano-sdk/src/utils/tx.ts`, `packages/cardano-sdk/src/libs/cardanoLib/index.ts` | Typed transaction round trips and required payment/stake signature coverage.                                      |
| `C04`     | Replace raw numeric certificate/DRep construction and hard-coded empty required-signer CBOR with named Conway factories.                                      | Correct post-pool Conway certificate discriminants while preserving SDK fluent method signatures.                                                                          | `packages/cardano-sdk/src/core/txBuilder.ts`, `packages/cardano-sdk/src/utils/governance.ts`                                                | Stake and governance construction assertions, including vote delegation and DRep register/unregister/update tags. |
| `C05`     | Replace manual CostModels maps and raw phase-two redeemer decoding with CostModels.from_json and evaluatePhaseTwo.                                            | Preserve protocol-parameter DTOs, budget ordering, logs, and ex-unit assignment.                                                                                           | `packages/cardano-sdk/src/utils/tx.ts`, `packages/cardano-sdk/src/core/txBuilder.ts`                                                        | Cost-model conversion and typed evaluation compilation/regression tests.                                          |
| `C06`     | Remove production dependencies made unnecessary by the typed library adoption and add focused regression tests.                                               | Keep BIP-39 as an SDK-owned mnemonic dependency and retain browser-compatible ESM.                                                                                         | `packages/cardano-sdk/package.json`, `package-lock.json`, `packages/cardano-sdk/test/`                                                      | Dependency scan, build, tests, typecheck, and repository check.                                                   |

## Implementation steps

1. Add focused SDK adapters around the accepted nominal library owners without recreating protocol types.
2. Migrate transaction, script, governance, evaluation, and signing call sites to those adapters.
3. Preserve provider, connector, account, mnemonic, network, and submission orchestration in the SDK.
4. Remove obsolete CBOR, Bech32, and hashing workarounds and their direct dependencies when no SDK-owned use remains.
5. Add deterministic tests for the corrected ownership boundaries and protocol discriminants.

## Validation

- `npm run build --workspace @xray-network/xray-js-cardano`
- `npm test --workspace @xray-network/xray-js-cardano`
- `npm run typecheck --workspace @xray-network/xray-js-cardano`
- `npm run check`
- `git diff --check`
- Confirm no production SDK source imports `@noble/hashes`, manually decodes DRep/transaction/redeemer CBOR, constructs tag-24 ScriptRef CBOR, or uses shifted Conway certificate numbers.

## Compatibility and human review

Review strict rejection of ambiguous serialized Plutus scripts and noncanonical DRep identifiers,
the corrected Conway certificate tags, typed witness intersection, preservation of standard account
fixtures, and dependency removal. Existing application-facing SDK method signatures should remain
stable unless malformed inputs were previously accepted only by permissive local parsing.

## Completion criteria

- Accepted xray-cardano-lib owners perform every protocol-sensitive operation named above.
- SDK account, provider, connector, DTO, and asynchronous transaction workflows remain local.
- Existing deterministic Cardano SDK tests pass with focused migration regressions.
- Required validation completes and the result records exact compatibility effects.

## Out of scope

- Moving providers, connectors, accounts, mnemonic words, storage, discovery, submission, or network requests into xray-cardano-lib.
- Adopting unrelated CIP-21, CIP-57, CIP-67, or CIP-68 features.
- Redesigning the SDK public API or provider DTOs.
- Modifying the adjacent xray-cardano-lib repository.

## Blockers

None.
