# Cardano implementation 0005 result

Result-Version: v1
Implementation-ID: cardano/0005
Instruction: ./0005-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition   | Implementation                                                                                                                                                                                                                                                                                            | Validation                                                                                                                           |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `C01`     | `IMPLEMENTED` | Re-exported the existing `@xray-network/xray-cardano-lib-cip/cip67` module as the focused lowercase `cip67` namespace from the xray-js Cardano package; the runtime Cardano facade forwards it through its existing package re-export, and the README documents its focused status and label-222 example. | Cardano/runtime declaration builds and a root-package ESM import smoke passed.                                                       |
| `C02`     | `IMPLEMENTED` | Extended the public primitive suite with the official label-222 vector, round-trip decode, and invalid-label rejection through the xray-js namespace.                                                                                                                                                     | `npm run check` passed with 27 Cardano tests passed, one opt-in live test skipped, and all workspace build/typecheck suites passing. |
| `C03`     | `IMPLEMENTED` | Removed the misleading uppercase `CIP8` and `UPLC` aliases of the complete cardano-lib root; added focused lowercase `cip8` and `uplc` namespaces from their owning package subpaths, declared the Plutus package as a direct dependency, and documented/tested the convention.                           | Focused export smoke, retired-export scan, package-lock inspection, and full repository checks passed.                               |

## Outcome

Consumers can now import cardano-lib's focused CIP-8, CIP-67, and UPLC modules from `@xray-network/xray-js/cardano` as `cip8`, `cip67`, and `uplc`. `CardanoLib` remains the only complete-library namespace; the misleading uppercase full-root aliases are removed.

## Inputs consumed

The human consolidation request, the Cardano package root and manifest, the linked cardano-lib CIP-67 implementation/declaration, Cardano tests, runtime facade, and README.

## Project changes

Updated `packages/cardano/src/index.ts`, manifest/lockfile, public tests, and `README.md`; added this instruction/result pair and updated the aggregate ledger.

## Exported change contract

| Change ID | Semantic change                                                                                                                                                | Compatibility                                                                                      | Downstream action                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `C01`     | `@xray-network/xray-js/cardano` exposes `cip67.encode_asset_name_label`, `decode_asset_name_label`, `make_labeled_asset_name`, and `split_labeled_asset_name`. | Additive and namespaced; cardano-lib remains the sole implementation and nominal asset-name owner. | Import `cip67` from the xray-js Cardano facade and remove local codecs/direct cardano-lib dependencies. |
| `C02`     | The facade guarantees the official label-222 bytes and strict invalid-label rejection.                                                                         | Existing Cardano behavior and entrypoints are unchanged.                                           | Preserve tolerant UI fallback in consumer adapters where invalid labels are expected input.             |
| `C03`     | Feature namespaces are `cip8`, `cip67`, and `uplc`; only `CardanoLib` exposes the complete cardano-lib root.                                                   | The incorrect `CIP8` and `UPLC` aliases are intentionally removed before v4 acceptance.            | Replace uppercase alias imports with the focused lowercase namespace that owns the required symbol.     |

## Validation

- `npm run check` — passed for every workspace build, deterministic test, and typecheck.
- Cardano tests — 27 passed, 0 failed, and one opt-in live test skipped.
- Runtime tests — one passed and none failed.
- Root ESM import smoke — passed for `cip67` encode/decode through `@xray-network/xray-js/cardano`.
- Focused namespace smoke — passed for `cip8.CIP8Message`, `cip67` label codecs, and `uplc.evaluateProgram`; retired uppercase export scan passed.
- Scoped duplicate-code scan in the four consuming mini-apps — no local CRC-8 implementation/import remains.
- Downstream typechecks — passed for Wallet, Assets, Transactions, and the Graph frontend through their linked xray-js runtime.
- `git diff --check` — passed after formatting.

## Deviations from instruction

The focused Plutus package is linked from the sibling cardano-lib workspace and is not yet available from the public npm registry. A registry lockfile refresh therefore returned `404`; the manifest keeps the repository's existing `0.1.0` publish-time convention, while the lockfile records the exact sibling package/link in the same form as the existing cardano-lib runtime, CIP, and core links. The first focused-export test also assumed `CIP8Message` was a constructor; inspection showed its intended namespace object with `signData` and `verifyData`, so the test was corrected to assert those public functions.

## Remaining human review

Confirm the lowercase `cip8`, `cip67`, and `uplc` namespaces communicate focused ownership clearly and approve removal of the incorrect uppercase aliases.

## Reproducibility

From the xray-js root, run `npm run check`, import `cip8`, `cip67`, and `uplc` from `@xray-network/xray-js/cardano`, then round-trip the `000de140` label-222 vector and verify the uppercase aliases are absent.
