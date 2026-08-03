# Cardano implementation 0004 result

Result-Version: v1
Implementation-ID: cardano/0004
Instruction: ./0004-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation                                                                                                                                                                                                                                                                                                                     | Validation                                                                                                                                                  |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C01       | IMPLEMENTED | Organized stable `accounts/`, `wallets/`, `transactions/`, and `providers/` feature domains with descriptive modules while flattening incidental types, testing, context, cache, and Cardano-library helpers. Removed empty/transitional directories and every nested `index.ts`; retained the licensed `internal/cip4/` boundary. | Cardano and repository builds/typechecks pass; the nested-index and legacy-path checks pass. Source changed from 33 to 27 TypeScript modules.               |
| C02       | IMPLEMENTED | Removed four generated-client wrappers, the primitive aggregate, the Cardano-library dependency aggregate, and the testing barrel. Root exports now expose generated clients and Cardano library namespaces directly under their existing names; `testing.ts` owns the in-memory implementation.                                   | Declaration generation and public-import tests cover the Cardano library, all four generated clients, primitives, and the `./testing` entrypoint.           |
| C03       | IMPLEMENTED | Replaced the duplicated public/internal fluent transaction interfaces and forwarding closures with one `TransactionPlan`, immutable discriminated operation data, and one operation interpreter in `transactions/builder.ts`. Shared UTXO keys, builder initialization, data snapshots, and Plutus witness/redeemer validation.    | Transaction tests pass for immutable branching/snapshots, payments, staking, governance, minting, validity, signing, serialization, and submission.         |
| C04       | IMPLEMENTED | Added shared provider resolvers for address lookup and single/multiple datum/script resolution plus a bounded polling helper. Koios and Kupmios use the shared resolver/poller, while the in-memory provider uses the resolver with its prior already-resolved-value behavior. Removed non-contract provider extras.               | New offline provider tests cover address lookup, single/multiple resolution, preservation of resolved values, immediate/later polling success, and timeout. |
| C05       | IMPLEMENTED | Removed pass-through aliases, repeated async/polling/transaction plumbing, stale fluent-builder comments, redundant provider methods, commented-out query code, and local spelling errors; formatted all changed Cardano and XRAY files.                                                                                           | Scoped Prettier check and `git diff --check` pass; the legacy-path search returns no matches. Source decreased from 4,035 to 3,791 lines.                   |

## Outcome

The Cardano package now has a smaller, feature-oriented source tree with six fewer TypeScript modules, no nested `index.ts` files, and no one-function client/dependency barrels. Account models, wallet adapters, transactions, and providers have stable domain folders; a future hardware-wallet adapter can live beside `wallets/cip30.ts` without another structural change. Transactions use immutable typed operations interpreted by one builder instead of two parallel fluent surfaces. Providers share resolution and polling behavior while retaining backend-specific mapping and the published Cardano API.

## Inputs consumed

- `packages/cardano/src/` supplied the source layout, public implementation, providers, transactions, primitives, and existing compatibility behavior.
- `packages/cardano/test/` supplied the deterministic behavior suite and fixtures extended for the refactor.
- `packages/cardano/package.json` supplied the root and `./testing` package entrypoints and package validation scripts.
- `packages/cardano/tsconfig.json` supplied the strict source compilation boundary.
- `packages/runtime/src/cardano.ts` and `packages/runtime/src/cardano-testing.ts` supplied root-package re-export consumers.
- `packages/runtime/src/xray.ts` supplied the synchronous Cardano factory consumer.
- `README.md` supplied documented direct/root imports and functional effect boundaries.
- The human request in this conversation authorized implementation of `cardano/0004`.

## Project changes

- Moved the account model to `accounts/account.ts` and the CIP-30 adapter to `wallets/cip30.ts`, establishing feature folders without adding an empty hardware-wallet placeholder.
- Moved central types, Cardano context, protocol cache, Cardano transaction helpers, CIP-4 checksum, Koios, Kupmios, and Kupmios response types to descriptive non-index modules.
- Replaced `transactions/transaction-plan.ts`, `unsigned-transaction.ts`, and `signed-transaction.ts` with `transactions/plan.ts`, `builder.ts`, and `transaction.ts`.
- Deleted the generated-client wrappers, primitive aggregate, dependency aggregate, and testing provider barrel path.
- Added `providers/provider.ts` for shared resolution and polling.
- Made `testing.ts` the actual in-memory provider implementation and additive test-utility entrypoint.
- Updated direct imports across Cardano primitives, client construction, providers, package exports, and internal helpers.
- Added `test/provider.test.ts`; extended primitive export and transaction snapshot tests; corrected fixture/source spelling.
- Did not change runtime source or README because their existing public imports compiled unchanged.

Tracked paths changed:

- Tracking: `.xray/updates/XRAY-UPDATES-STATUS.md`, `.xray/updates/implementations/cardano/0004-IMPL-INSTR.md`, and `.xray/updates/implementations/cardano/0004-IMPL-RESULT.md`.
- Cardano root modules: `src/config.ts`, `src/create-cardano.ts`, `src/index.ts`, `src/testing.ts`, and `src/types.ts`.
- Account and wallet domains: `src/accounts/account.ts` and `src/wallets/cip30.ts`.
- Internal modules: `src/internal/cip4/checksum.ts`, `src/internal/context.ts`, `src/internal/protocol-parameters.ts`, and `src/internal/transaction.ts`.
- Primitives: `src/primitives/account.ts`, `address.ts`, `asset.ts`, `governance.ts`, `keys.ts`, `misc.ts`, `script.ts`, `time.ts`, and `tx.ts`.
- Providers: `src/providers/koios.ts`, `kupmios.ts`, `kupmios-types.ts`, and `provider.ts`.
- Transactions: `src/transactions/builder.ts`, `plan.ts`, and `transaction.ts`.
- Tests: `test/fixtures.ts`, `test/primitives.test.ts`, `test/provider.test.ts`, and `test/transaction.test.ts`.
- Removed source paths: `src/accounts/cardano-account.ts`; all four files under `src/clients/`; `src/internal/cardano-lib/index.ts`, `cip4/index.ts`, `client-context.ts`, `dependencies.ts`, and `protocol-parameters-cache.ts`; `src/primitives/index.ts`; both provider `index.ts` files and `src/providers/kupmios/types.ts`; `src/testing/in-memory-provider.ts`; all three former transaction files; `src/types/index.ts`; and `src/wallets/cip30-wallet.ts`.

## Exported change contract

| Change ID | Semantic change                                                                                                                                                             | Compatibility                                                                                                               | Downstream action                                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| C01       | Cardano implementation modules use stable account, wallet, transaction, and provider feature folders with descriptive filenames and no nested index modules.                | Published entrypoints remain package root and `./testing`; old `src/` paths were never package exports.                     | None for package consumers; add future wallet adapters under `wallets/`.             |
| C02       | Generated client factories and Cardano library namespaces are re-exported directly rather than through owned pass-through wrappers.                                         | Existing public names and callable behavior remain available and are covered by package-import tests.                       | None.                                                                                |
| C03       | Transaction plans capture immutable typed operation snapshots and one builder interprets them at `build()`.                                                                 | Public plan methods, synchronous planning, async building, transaction values, and tested errors/behavior remain unchanged. | None.                                                                                |
| C04       | Provider address/resolution/polling behavior comes from shared utilities; `createProviderResolvers` and `pollUntil` are additionally available from the testing entrypoint. | The `Provider` interface and owned provider factory signatures remain unchanged.                                            | Testing consumers may use the additive helpers; production consumers need no change. |
| C05       | Owned Cardano source has less duplicated and stale implementation text.                                                                                                     | No documented public symbol or import was removed.                                                                          | None.                                                                                |

## Validation

- `npm run build --workspace=@xray-network/xray-js-cardano` passed.
- `npm run typecheck --workspace=@xray-network/xray-js-cardano` passed.
- `npm test --workspace=@xray-network/xray-js-cardano` passed with 26 tests passed, 0 failed, and 1 opt-in live test skipped (27 total).
- `npm run build` passed for all workspaces.
- `npm run typecheck` passed for all workspaces.
- `npm test` passed for all workspaces; Cardano had 26 passed and 1 skipped, runtime had 1 passed, and no test failed.
- `test "$(find packages/cardano/src -mindepth 2 -name index.ts -print -quit)" = ""` passed.
- The required legacy-path `rg` search returned no matches (exit 1 as expected).
- Scoped `npx prettier --check` passed.
- `git diff --check` passed.
- Baseline/current counts recorded 33/27 TypeScript source modules and 4,035/3,791 source lines.

## Deviations from instruction

The human review refinement grouped the account model and CIP-30 adapter into stable `accounts/` and `wallets/` domains after the first implementation pass; it did not change the objective or public API, and no empty hardware-wallet module was added. The testing entrypoint gained the shared provider helpers additively so the required offline utility behavior could be tested without publishing internal source paths; existing testing exports remain compatible.

## Remaining human review

- Review the new transaction operation vocabulary and builder split for readability.
- Confirm `accounts/account.ts` and `wallets/cip30.ts` are the preferred feature boundaries for future account and hardware-wallet work.
- Confirm the additive `createProviderResolvers` and `pollUntil` testing exports are desirable.
- Review the generated root declaration diff: exported names are retained while internal module specifiers reflect the new layout.
- Run the opt-in live provider integration test in an authorized network environment if live evidence is required.

## Reproducibility

Validated from the repository root on 2026-08-03 with npm `10.8.2` and Node `v20.18.1`. The repository declares Node `>=20.19.0`; this existing environment mismatch did not prevent any required build, typecheck, or deterministic test from passing.
