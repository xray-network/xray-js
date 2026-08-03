# Cardano implementation 0004 instruction

Implementation-Version: v1
Implementation-ID: cardano/0004
Created: 20260803T165138Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                                     | Kind    | Required | Purpose                                                                                                                         |
| ----------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `packages/cardano/src/`                   | `LOCAL` | Yes      | Current source layout, functional API, provider adapters, and transaction implementation to simplify without changing behavior. |
| `packages/cardano/test/`                  | `LOCAL` | Yes      | Existing public-contract and behavior coverage that the refactor must preserve and extend where shared helpers are introduced.  |
| `packages/cardano/package.json`           | `LOCAL` | Yes      | Published root and `testing` entrypoints and package validation commands that must remain compatible.                           |
| `packages/cardano/tsconfig.json`          | `LOCAL` | Yes      | Strict TypeScript build boundary for the reorganized modules.                                                                   |
| `packages/runtime/src/cardano.ts`         | `LOCAL` | Yes      | Root-package re-export boundary that must continue to compile without consumer changes.                                         |
| `packages/runtime/src/cardano-testing.ts` | `LOCAL` | Yes      | Root-package testing re-export boundary that must remain compatible.                                                            |
| `packages/runtime/src/xray.ts`            | `LOCAL` | Yes      | Existing Cardano factory consumer whose imports and synchronous construction contract must remain unchanged.                    |
| `README.md`                               | `LOCAL` | Yes      | Documented public Cardano imports and examples that must remain valid.                                                          |
| Human request in this conversation        | `LOCAL` | Yes      | Requires a simpler, more compact, human-readable Cardano package structure with duplicated code removed.                        |

## Objective

Simplify the Cardano source structure and internal implementation, remove duplicated adapter and transaction plumbing, and preserve the published API and observable behavior.

## Changes to implement

| Change ID | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                | Compatibility                                                                                                                                                                                               | Local owner                                            | Validation                                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| C01       | Remove incidental one-file and `index.ts`-based folders while organizing stable feature domains explicitly: account models under `accounts/`, wallet adapters under `wallets/`, transaction planning/building/values under `transactions/`, and provider adapters under `providers/`. Use descriptive filenames, do not create empty future adapter placeholders, and keep no feature-local `index.ts` files below `src/`. | Preserve the package root and `./testing` export paths; internal source paths are intentionally reorganized and remain unpublished.                                                                         | Cardano source layout and imports                      | Build/typecheck plus source-tree searches prove that imports resolve and only `src/index.ts` remains.                                            |
| C02       | Delete pass-through barrels and wrappers that add no behavior. Import Cardano library/primitives directly, export the four generated service clients directly under their existing public names, and replace the testing barrel with the actual in-memory provider module.                                                                                                                                                 | Existing root names (`KoiosClient`, `KupoClient`, `NftcdnClient`, `OgmiosClient`, primitive namespaces, and Cardano library exports) and testing names remain available with equivalent types and behavior. | Package barrel, service clients, primitives, testing   | Declaration build and public-import tests cover both package entrypoints and all retained names.                                                 |
| C03       | Replace the duplicated `TransactionPlan`/`TransactionExecutor` fluent surfaces and closure-forwarding layer with one public fluent contract backed by immutable, typed operation data and a separate transaction builder/interpreter. Consolidate repeated script/redeemer witness selection, builder initialization, input keys, and snapshot helpers.                                                                    | Preserve every transaction-plan method, immutability, synchronous plan creation, asynchronous `build()`, transaction output, and existing error behavior where asserted.                                    | Transaction plan, builder, signing, transaction values | Transaction tests cover operation snapshots, payment, staking, governance, minting, signing, serialization, submission, and immutable branching. |
| C04       | Extract shared provider utilities for single-address lookup, datum/script resolution, multi-UTXO resolution, and bounded transaction polling; use them in Koios, Kupmios, and the in-memory provider as applicable. Remove provider-only methods that are neither part of `Provider` nor consumed. Keep backend-specific response mapping local to each adapter and use descriptive shared error/polling logic.            | Preserve the `Provider` interface, factory signatures, default intervals/timeouts, backend mappings, and Cardano client behavior.                                                                           | Provider contract and adapters                         | Unit tests exercise shared resolution and polling behavior without network access; provider and client tests pass.                               |
| C05       | Remove stale comments, redundant `async`/`await`, repeated object assembly, and non-domain aliases exposed only to work around the old layout. Keep comments that explain Cardano semantics or non-obvious low-level library constraints, and format all changed files consistently.                                                                                                                                       | No public symbol or documented import is removed; generated declarations remain compatible at the package entrypoints.                                                                                      | All changed Cardano modules and tests                  | Prettier check/write on scoped files, public API searches, package/repository validation, and diff review.                                       |

## Implementation steps

1. Capture the current public declarations and source tree, then define the compact target module map before moving files.
2. Remove incidental directories, group stable account, wallet, transaction, and provider domains, and update imports while keeping `src/index.ts` and `src/testing.ts` as the only published entry modules.
3. Remove pass-through service-client, primitive, dependency, and testing wrappers; retain the existing exported names from direct imports/exports.
4. Model transaction plans as immutable typed operations, move execution into a focused builder, and share low-level witness/build helpers.
5. Introduce common provider resolution and polling helpers, update all owned providers, and delete unused provider extras.
6. Extend tests for public imports, immutable transaction operation snapshots, provider resolution, and polling; run formatting and all validation commands.
7. Record exact moves, code reductions, compatibility evidence, and validation results in `0004-IMPL-RESULT.md`, then move the ledger row to `REVIEW` only if required checks pass.

## Validation

- `npm run build --workspace=@xray-network/xray-js-cardano`
- `npm run typecheck --workspace=@xray-network/xray-js-cardano`
- `npm test --workspace=@xray-network/xray-js-cardano`
- `npm run build`
- `npm run typecheck`
- `npm test`
- `test "$(find packages/cardano/src -mindepth 2 -name index.ts -print -quit)" = ""`
- `rg -n "accounts/cardano-account|clients/(koios|kupo|nftcdn|ogmios)-client|internal/(dependencies|cardano-lib/index)|primitives/index|providers/(koios|kupmios)/index|testing/in-memory-provider|transactions/(signed|unsigned)-transaction|types/index|wallets/cip30-wallet" packages/cardano packages/runtime README.md`
- `git diff --check`

The legacy-path search must return no matches. The nested-`index.ts` check must pass. Formatting may use the repository Prettier command scoped to changed Cardano, runtime, README, and XRAY record files rather than rewriting unrelated files.

## Compatibility and human review

This is an internal structural refactor. Human review should compare the generated public declarations before and after, confirm that the root and `testing` entrypoints retain all documented exports, and check that operation-data and provider helpers reduce indirection without hiding Cardano-specific behavior behind generic abstractions. Review should also confirm that attribution for the licensed CIP-4 source remains adjacent and intact.

## Completion criteria

- The Cardano source tree uses descriptive filenames and contains no nested `index.ts` files.
- Incidental one-module directories and pass-through source barrels are removed; stable accounts, wallets, transactions, primitives, providers, and licensed third-party-derived code remain clearly bounded.
- Transaction plan methods are declared once and captured as immutable typed data rather than duplicated through a second fluent executor surface.
- Koios and Kupmios no longer duplicate address, resolution, and polling plumbing.
- The package root and `./testing` entrypoint exports, factory signatures, functional effect boundaries, and tested Cardano behavior remain compatible.
- Cardano package and repository build, typecheck, and deterministic tests pass.

## Out of scope

- Adding or removing Cardano features or changing transaction semantics.
- Changing the published package name, entrypoints, or root runtime facade.
- Changing generated upstream client packages or the external Cardano library.
- Redesigning documented public method names or intentionally breaking consumer types.
- Running live integration tests, publishing packages, or accepting the implementation.

## Blockers

None.
