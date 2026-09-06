# Cardano implementation 0002 result

Result-Version: v1
Implementation-ID: cardano/0002
Instruction: ./0002-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation                                                                                                                                                                                                                       | Validation                                                                                                                             |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| C01       | Implemented | Moved the owned source workspace from `packages/cardano-sdk` to `packages/cardano`; updated root workspaces, package metadata, and the lockfile for version `4.0.0`. The accepted `cardano-sdk` tracking history was left unchanged. | Cardano and root builds passed; the lockfile resolves `@xray-network/xray-js-cardano` to `packages/cardano`.                           |
| C02       | Implemented | Replaced legacy public names with `CardanoClient`, `CardanoAccount`, `Cip30Wallet`, direct types, raw clients, primitive namespaces, and explicit transaction classes. No compatibility aliases were added.                          | Strict typechecks passed and the required legacy-identifier search returned no matches.                                                |
| C03       | Implemented | Added async `CardanoClient.create`, remote or static protocol-parameter sources, per-client remote caching, forced refresh, and the explicit millisecond option `cacheDurationMs`.                                                   | Client tests verify initial remote loading, cache reuse, expiration, forced refresh, static parameters, and custom-network validation. |
| C04       | Implemented | Reorganized accounts, CIP-30 wallets, messages, providers, raw service clients, primitives, transactions, staking, governance, evaluation, signing, submission, and observation behind the new client and domain modules.            | The package suite passed 23 offline tests; the opt-in live endpoint test compiled and was skipped by default.                          |
| C05       | Implemented | Enabled strict TypeScript, moved shared dependencies behind internal modules, removed internal imports through the public barrel, replaced owned public `any` surfaces, and made secret-bearing account state private.               | Source builds and strict source/test typechecks passed.                                                                                |
| C06       | Implemented | Added `TransactionBuilder`, `UnsignedTransaction`, and `SignedTransaction`; signing now transitions from unsigned to signed state, while serialization and submission live on explicit transaction objects.                          | Payment, staking, governance, native minting, validity, signing, serialization, and submission tests passed.                           |
| C07       | Implemented | Added `@xray-network/xray-js-cardano/testing` with `InMemoryProvider` for deterministic provider, protocol, transaction, and observation behavior.                                                                                   | The complete default Cardano suite runs without network access.                                                                        |
| C08       | Implemented | Replaced root documentation with `XRAY.cardano.create`, direct Cardano subpath imports, protocol-parameter source examples, and the new workspace structure.                                                                         | README formatting and legacy-name searches passed; documented imports are exercised by runtime compilation/tests.                      |

## Outcome

The Cardano SDK is now a strict, breaking `packages/cardano` implementation centered on an asynchronously created `CardanoClient`. It preserves the previously implemented Cardano capabilities while exposing clearer domain boundaries, deterministic testing support, private secret state, and explicit unsigned/signed transaction lifecycles for use directly or through the XRAY facade.

## Inputs consumed

- The pre-migration `packages/cardano-sdk/` source, tests, and package metadata were used as the feature inventory and implementation baseline.
- `packages/runtime/src/cardano.ts` was used to preserve the direct Cardano package boundary.
- `README.md` was used as the existing documentation baseline and then replaced with the new public API examples.
- The human request in this conversation authorized the breaking rename and removal of all legacy compatibility names.

## Project changes

- Replaced `packages/cardano-sdk` with domain-oriented source under `packages/cardano/src/{accounts,clients,internal,primitives,providers,testing,transactions,types,wallets}`.
- Added strict configuration and a per-client protocol-parameter cache.
- Added explicit transaction build, unsigned, and signed state objects.
- Added deterministic `InMemoryProvider` testing support and a replacement offline test suite.
- Updated root workspace metadata, lockfile entries, runtime dependency metadata, and documentation for version `4.0.0`.

## Exported change contract

| Change ID | Semantic change                                                                                                     | Compatibility                                                        | Downstream action                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| C01       | Cardano source ownership is `packages/cardano`; the published leaf package remains `@xray-network/xray-js-cardano`. | Source paths and package version are breaking.                       | Update repository tooling and internal paths from `packages/cardano-sdk` to `packages/cardano`.                                           |
| C02       | The primary leaf client is `CardanoClient`; types and domains are directly exported.                                | All CardanoWeb3/CW3 names are removed.                               | Replace legacy imports and terminology with the new direct exports.                                                                       |
| C03       | Client construction is asynchronous and resolves protocol parameters before returning.                              | Synchronous construction is removed.                                 | Use `await CardanoClient.create(config)` and choose remote or static protocol parameters explicitly when needed.                          |
| C04       | Features are grouped by client services and domain modules while low-level clients/providers remain available.      | Method locations and names are breaking.                             | Migrate calls to `client.accounts`, `client.wallets`, `client.messages`, `client.transactions`, `client.chain`, or direct domain exports. |
| C05       | TypeScript surfaces are strict and account secrets are private.                                                     | Code relying on loose types or mutable internals no longer compiles. | Use declared provider/wallet/signer contracts and account methods rather than internal fields.                                            |
| C06       | Transaction state progresses from builder to unsigned to signed.                                                    | Legacy finalizer and `apply*` methods are removed.                   | Build first, sign the returned unsigned transaction, then serialize or submit the signed transaction.                                     |
| C07       | Deterministic provider support is exported from `/testing`.                                                         | Additive testing API.                                                | Import `InMemoryProvider` from `@xray-network/xray-js-cardano/testing` or `@xray-network/xray-js/cardano/testing`.                        |
| C08       | Documentation names the root product `XRAY` and the chain module `cardano`.                                         | Old examples are obsolete.                                           | Follow the new README import and construction examples.                                                                                   |

## Validation

- `npm install --package-lock-only --ignore-scripts` completed and reported the existing environment mismatch: Node `v20.18.1` is below the repository's required `>=20.19.0`.
- `npm run build --workspace=@xray-network/xray-js-cardano` passed.
- `npm run typecheck --workspace=@xray-network/xray-js-cardano` passed.
- `npm test --workspace=@xray-network/xray-js-cardano` passed with 23 tests passed, 0 failed, and 1 opt-in live test skipped.
- `npm run build` passed for all three workspaces.
- `npm run typecheck` passed for all three workspaces.
- `npm test` passed for all three workspaces with no failures; the Cardano live test remained skipped by design.
- `rg -n "CardanoWeb3|CW3Types|cw3js|cardano-web3-js|\\bcw3\\b" packages/cardano packages/runtime README.md` returned no matches.
- `rg -n "packages/cardano-sdk" package.json package-lock.json README.md packages` returned no matches.
- `git diff --check` passed.

## Deviations from instruction

None. A functional non-Cardano chain and the previously empty hardware-wallet placeholders remain out of scope as declared.

## Remaining human review

- Confirm the breaking service and method names are the preferred long-term Cardano vocabulary.
- Review private-key/account lifecycle and protocol-parameter freshness policy.
- Review transaction builder parity for application-specific Plutus and governance flows.
- Run `npm run test:integration --workspace=@xray-network/xray-js-cardano` in an authorized live-network environment if live endpoint evidence is required.

## Reproducibility

Validated from the repository root on 2026-08-03 with npm `10.8.2` and Node `v20.18.1`. The repository declares Node `>=20.19.0`; npm emitted `EBADENGINE` warnings during lockfile validation, but every required build, typecheck, and offline test completed successfully.
