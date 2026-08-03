# Cardano implementation 0003 instruction

Implementation-Version: v1
Implementation-ID: cardano/0003
Created: 20260803T180000Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                              | Kind    | Required | Purpose                                                                                                                                    |
| ---------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/cardano/`                | `LOCAL` | Yes      | Current Cardano behavior, public API, providers, and tests to replace with a functional architecture.                                      |
| `packages/runtime/src/xray.ts`     | `LOCAL` | Yes      | Current asynchronous chain-factory integration boundary.                                                                                   |
| `README.md`                        | `LOCAL` | Yes      | Public examples whose asynchronous boundaries must match the replacement API.                                                              |
| Human request in this conversation | `LOCAL` | Yes      | Requires a classless functional Cardano API, synchronous client creation, and asynchronous operations only for provider or wallet effects. |

## Objective

Replace the public Cardano class architecture with functional factories and readonly values, make Cardano client creation synchronous, and expose asynchronous boundaries only where provider or wallet I/O requires them.

## Changes to implement

| Change ID | Requirement                                                                                                                                                                                                                                              | Compatibility                                                 | Local owner                                      | Validation                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| C01       | Replace `CardanoClient.create` with synchronous `createCardano(config)` and a readonly `Cardano` client value; protocol parameters load lazily on first effectful use.                                                                                   | Intentionally breaking factory and type names.                | Cardano client/context/configuration             | Client tests prove construction performs no provider request.         |
| C02       | Replace public account and CIP-30 wallet classes with functional factories, readonly capability values, and explicit synchronous versus asynchronous operations.                                                                                         | Removes class constructors and instance identity assumptions. | Account and wallet modules                       | Account, message, and wallet typechecks/tests.                        |
| C03       | Replace public transaction state classes with readonly tagged values and functional sign, serialization, submit, and observation operations; keep transaction plan creation synchronous while build remains asynchronous when it resolves provider data. | Intentionally breaking transaction state API.                 | Transaction modules                              | Payment, staking, governance, minting, signing, and submission tests. |
| C04       | Replace owned Cardano provider, protocol cache, testing provider, and fluent builder classes with function-created objects so `packages/cardano/src` contains no owned class declarations.                                                               | Provider construction changes from `new` to factory calls.    | Providers, internal cache, transactions, testing | Strict typecheck and class-declaration search.                        |
| C05       | Export only the new functional surface and update direct/root examples to show `await` only for provider/wallet effects.                                                                                                                                 | All prior public class exports are removed.                   | Package barrel, tests, README                    | Builds, tests, declaration generation, and legacy API search.         |

## Implementation steps

1. Define readonly Cardano, account, wallet, transaction, builder, and provider contracts.
2. Convert client construction, protocol caching, accounts, wallets, providers, and transaction state to function-created values.
3. Preserve transaction feature behavior behind the classless API and explicit effect boundaries.
4. Replace tests and documentation, then search for owned Cardano class declarations and obsolete public names.
5. Run package and repository validation and record actual outcomes.

## Validation

- `npm run build --workspace=@xray-network/xray-js-cardano`
- `npm run typecheck --workspace=@xray-network/xray-js-cardano`
- `npm test --workspace=@xray-network/xray-js-cardano`
- `npm run build`
- `npm run typecheck`
- `npm test`
- `rg -n "export class|class Cardano|class Cip30|class Transaction|new CardanoClient|new CardanoAccount|new Cip30Wallet|new TransactionBuilder|new UnsignedTransaction|new SignedTransaction" packages/cardano/src packages/cardano/test`

## Compatibility and human review

This is intentionally incompatible. Human review should focus on whether synchronous construction is predictable, every Promise corresponds to a real effect, transaction state transitions remain type-safe, closure-held secrets remain inaccessible, and the functional surface stays ergonomic.

## Completion criteria

- `createCardano` and `XRAY.cardano.create` return synchronously without provider I/O.
- Cardano public values and owned providers are created by functions rather than classes.
- Transaction plan creation and local private-key signing are synchronous.
- Provider resolution, wallet signing, submission, and observation remain asynchronous.
- Existing tested Cardano capabilities pass through the replacement API.

## Out of scope

- Making inherently effectful provider or CIP-30 operations synchronous.
- Adding another blockchain module.
- Publishing packages or accepting the implementation.

## Blockers

None.
