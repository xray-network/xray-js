# Cardano implementation 0003 result

Result-Version: v1
Implementation-ID: cardano/0003
Instruction: ./0003-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation                                                                                                                                                                                                                                                                         | Validation                                                                                                                                     |
| --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| C01       | Implemented | Replaced `CardanoClient.create` with synchronous `createCardano(config)`, a frozen `Cardano` value, and lazy closure-backed protocol-parameter loading.                                                                                                                                | Client tests confirm creation performs zero provider requests and the first explicit parameter request populates the cache.                    |
| C02       | Implemented | Replaced account and CIP-30 wallet classes with readonly interfaces, closure-backed account capabilities, and `createCip30Wallet`/browser wallet functions. Local account creation is synchronous; wallet discovery effects remain asynchronous where required.                        | Account and message tests pass; private-key message signing is exercised synchronously.                                                        |
| C03       | Implemented | Added immutable `TransactionPlan` values, readonly tagged unsigned/signed transaction records, functional signing helpers, and client-level submit/observe effects. Each plan operation returns a new plan; building resolves effects, while local private-key signing is synchronous. | Transaction tests cover immutable plans, build, local and account signing, staking, governance, minting, serialization values, and submission. |
| C04       | Implemented | Replaced owned protocol cache, provider, in-memory provider, transaction executor, and wallet/account class declarations with function-created frozen objects and private closures.                                                                                                    | Strict builds/typechecks pass and the required owned-class search returns no matches.                                                          |
| C05       | Implemented | Removed public class exports, exported `createCardano`, provider factories, readonly functional types/helpers, and rewrote examples around explicit effect boundaries. Build now clears stale Cardano declarations before compiling.                                                   | Declaration generation, package tests, root tests, documentation formatting, and obsolete API searches pass.                                   |

## Outcome

Cardano now has a classless functional public architecture. `createCardano` returns immediately without I/O, protocol parameters load lazily, transaction plans are immutable, unsigned and signed transactions are readonly tagged values, and locally computable operations remain synchronous. Provider, network, and CIP-30 wallet effects retain explicit Promise boundaries.

## Inputs consumed

- `packages/cardano/` supplied the current feature implementation, providers, transactions, and tests.
- `packages/runtime/src/xray.ts` supplied the asynchronous facade integration that was coordinated with the replacement factory.
- `README.md` supplied the existing examples and asynchronous construction contract.
- The human request in this conversation required the classless functional redesign and effect-only asynchronous operations.

## Project changes

- Replaced `src/cardano-client.ts` with `src/create-cardano.ts`.
- Converted accounts and CIP-30 wallets to interfaces and function-created capability values.
- Replaced transaction classes and the mutable public builder with immutable `TransactionPlan`, `UnsignedTransaction`, and `SignedTransaction` values plus standalone functions.
- Converted Koios, Kupmios, protocol cache, and in-memory testing providers to factories.
- Updated the package barrel, public types, build cleanup, tests, and README examples.

## Exported change contract

| Change ID | Semantic change                                                                                                                                                           | Compatibility                                              | Downstream action                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| C01       | `createCardano(config)` synchronously returns a frozen `Cardano` value and performs no provider request.                                                                  | `CardanoClient` and its async static factory are removed.  | Replace `await CardanoClient.create(config)` with `createCardano(config)`.                                |
| C02       | Accounts and wallets are readonly capability values created by functions.                                                                                                 | Public constructors and class identity checks are removed. | Obtain accounts from `cardano.accounts`; create or connect wallets through the exported CIP-30 functions. |
| C03       | Transaction composition returns new immutable plans; build is async, local private-key signing is sync, wallet-capable generic signing is async, and submission is async. | Transaction instance methods are removed.                  | Use `plan.build()`, then `cardano.transactions.sign*` and `cardano.transactions.submit(transaction)`.     |
| C04       | Provider construction uses `createKoiosProvider`, `createKupmiosProvider`, and `createInMemoryProvider`.                                                                  | `new Provider(...)` construction is removed.               | Replace owned provider constructors with their factory functions.                                         |
| C05       | Public Cardano exports are functions and readonly types rather than classes.                                                                                              | All class-based Cardano imports are obsolete.              | Import `createCardano` and the functional helpers/types from the Cardano entrypoint.                      |

## Validation

- `npm run build --workspace=@xray-network/xray-js-cardano` passed and regenerated declarations from a clean `dist` directory.
- `npm run typecheck --workspace=@xray-network/xray-js-cardano` passed.
- `npm test --workspace=@xray-network/xray-js-cardano` passed with 23 tests passed, 0 failed, and 1 opt-in live test skipped.
- `npm run build` passed for all workspaces.
- `npm run typecheck` passed for all workspaces.
- `npm test` passed for all workspaces with no failures; the Cardano live test remained skipped by design.
- `rg -n "export class|class Cardano|class Cip30|class Transaction|new CardanoClient|new CardanoAccount|new Cip30Wallet|new TransactionBuilder|new UnsignedTransaction|new SignedTransaction" packages/cardano/src packages/cardano/test` returned no matches.
- Obsolete `CardanoClient`, constructor-based provider, and awaited client-creation searches returned no relevant matches.
- `git diff --check` passed.

## Deviations from instruction

None. External `@xray-network/xray-cardano-lib` objects still use their own low-level class API internally; the owned Cardano SDK source declares no classes.

## Remaining human review

- Confirm `createCardano` and `XRAY.cardano.create` should remain synchronous for every chain implementation.
- Review whether generic account signing should remain Promise-based because it accepts CIP-30 wallet accounts alongside local accounts.
- Review the immutable fluent `TransactionPlan` vocabulary and standalone transaction state operations.
- Run the opt-in integration test in an authorized live-network environment if live provider evidence is required.

## Reproducibility

Validated from the repository root on 2026-08-03 with npm `10.8.2` and Node `v20.18.1`. The repository declares Node `>=20.19.0`; this existing environment mismatch does not prevent the required build, typecheck, or offline tests from passing.
