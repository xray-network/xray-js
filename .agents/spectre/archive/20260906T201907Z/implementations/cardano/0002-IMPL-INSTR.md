# Cardano implementation 0002 instruction

Implementation-Version: v1
Implementation-ID: cardano/0002
Created: 20260803T150230Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                              | Kind    | Required | Purpose                                                                                                                          |
| ---------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `packages/cardano-sdk/`            | `LOCAL` | Yes      | Current Cardano behavior and feature inventory to preserve behind the replacement API.                                           |
| `packages/runtime/src/cardano.ts`  | `LOCAL` | Yes      | Current Cardano runtime integration boundary.                                                                                    |
| `README.md`                        | `LOCAL` | Yes      | Current public installation, import, and development documentation.                                                              |
| Human request in this conversation | `LOCAL` | Yes      | Authorizes a breaking redesign, the `packages/cardano` source migration, and removal of all CW3/CardanoWeb3 compatibility names. |

## Objective

Replace the legacy CardanoWeb3/CW3 architecture with a strict, feature-complete Cardano client under `packages/cardano`, designed for use through the multi-chain XRAY facade and direct Cardano subpath imports.

## Changes to implement

| Change ID | Requirement                                                                                                                                                                                                                       | Compatibility                                                     | Local owner                               | Validation                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| C01       | Rename `packages/cardano-sdk` to `packages/cardano` and update workspace/package metadata without rewriting the accepted `cardano-sdk` tracking history.                                                                          | Intentionally breaking source/workspace migration.                | `packages/cardano`, root manifests        | Workspace build and lockfile validation.                           |
| C02       | Replace `CardanoWeb3`, `CW3Types`, `cw3`, connector, explorer, and transaction-finalizer public terminology with `CardanoClient`, direct type exports, Cardano context, CIP-30 wallets, clients, and explicit transaction states. | No legacy aliases or deprecated exports.                          | `packages/cardano/src`                    | Typecheck plus repository search for forbidden legacy identifiers. |
| C03       | Provide an asynchronous `CardanoClient.create` configuration path with remote protocol-parameter loading and a clearly named millisecond cache duration.                                                                          | Replaces synchronous construction and hardcoded-default behavior. | Cardano configuration/client modules      | Unit tests for configuration and protocol-parameter caching.       |
| C04       | Preserve current account, wallet, message, provider, raw client, primitive, transaction, staking, governance, evaluation, signing, submission, and observation capabilities behind the new API.                                   | Behavior preserved; public method organization may change.        | Cardano feature modules                   | Deterministic tests and integration-test compilation.              |
| C05       | Remove internal imports through the public barrel, enable strict TypeScript, replace public `any` surfaces where owned, and isolate mutable/private state.                                                                        | Compile-time breaking improvements are authorized.                | `packages/cardano/src`, TypeScript config | Strict source and test typechecks.                                 |
| C06       | Separate unsigned and signed transaction responsibilities and replace `apply*` methods with build/sign/serialize/submit operations.                                                                                               | Intentionally breaking transaction API.                           | Cardano transaction modules               | Transaction and governance behavior tests.                         |
| C07       | Export deterministic testing support and provider contract fixtures so feature tests do not require live endpoints.                                                                                                               | New supported testing surface.                                    | `packages/cardano/src/testing`, tests     | Offline package test suite.                                        |
| C08       | Update Cardano documentation and examples for direct imports and the XRAY facade.                                                                                                                                                 | Legacy examples are removed.                                      | `README.md`, package documentation        | Documentation search and example typecheck where applicable.       |

## Implementation steps

1. Move the workspace and establish direct-import domain boundaries.
2. Define strict configuration, domain, provider, wallet, signer, account, and transaction contracts.
3. Adapt the existing feature implementations to the new names and transaction states.
4. Add remote protocol-parameter caching and deterministic provider/testing support.
5. Replace tests and documentation, then remove every legacy public identifier.
6. Run package and repository validation and record the actual outcome.

## Validation

- `npm run build --workspace=@xray-network/xray-js-cardano`
- `npm run typecheck --workspace=@xray-network/xray-js-cardano`
- `npm test --workspace=@xray-network/xray-js-cardano`
- `npm run build`
- `npm run typecheck`
- `npm test`
- `rg -n "CardanoWeb3|CW3Types|cw3js|cardano-web3-js|\\bcw3\\b" packages/cardano packages/runtime README.md`

## Compatibility and human review

This is an intentionally incompatible replacement. Human review should focus on feature parity, naming consistency, secret handling, protocol-parameter freshness, transaction-state semantics, direct Cardano imports, and suitability for future chain modules.

## Completion criteria

- `packages/cardano` owns the Cardano implementation and compiles strictly.
- No legacy CW3/CardanoWeb3 compatibility export remains.
- Existing implemented Cardano capabilities have equivalents in the new API.
- Offline tests cover the new client and transaction flow.
- Required validation outcomes are recorded honestly.

## Out of scope

- Implementing a functional Bitcoin, Midnight, or other blockchain SDK.
- Implementing previously nonfunctional Ledger or Trezor placeholders.
- Publishing packages or accepting the implementation.

## Blockers

None.
