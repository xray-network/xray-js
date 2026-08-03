# Runtime implementation 0002 result

Result-Version: v1
Implementation-ID: runtime/0002
Instruction: ./0002-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation                                                                                                                         | Validation                                                                                 |
| --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| C01       | Implemented | Changed `XrayChainModule.create` to synchronously return its client value.                                                             | Runtime and root strict typechecks pass.                                                   |
| C02       | Implemented | Statically integrated `createCardano` so `XRAY.cardano.create(config)` returns immediately without dynamic import or protocol loading. | Runtime test confirms immediate isolated values and zero provider requests after creation. |
| C03       | Implemented | Removed awaited facade creation from tests and README, and documented synchronous composition versus provider/wallet effects.          | Runtime package and root build/test suites pass.                                           |

## Outcome

The XRAY Cardano facade now constructs isolated functional Cardano values synchronously. Network, protocol, submission, observation, and wallet effects remain asynchronous on the returned value rather than being hidden inside module creation.

## Inputs consumed

- `packages/runtime/src/xray.ts` supplied the prior dynamic asynchronous integration.
- `packages/runtime/src/common.ts` supplied the generic asynchronous chain-module contract.
- `packages/cardano/` supplied the coordinated synchronous `createCardano` contract.
- The human request in this conversation required synchronous `XRAY.cardano.create(config)`.

## Project changes

- Updated `XrayChainModule` to return its client directly.
- Replaced the dynamic Cardano import with a static `createCardano` binding.
- Updated runtime tests and root documentation for the explicit asynchronous boundaries.

## Exported change contract

| Change ID | Semantic change                                                             | Compatibility                                                       | Downstream action                                                                                         |
| --------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| C01       | A chain module's `create(config?)` method returns its client synchronously. | Asynchronous chain-module factories no longer satisfy the contract. | Construct configuration synchronously and defer external effects to client operations.                    |
| C02       | `XRAY.cardano.create(config)` returns `Cardano`, not `Promise<Cardano>`.    | Awaiting creation is unnecessary and hides the intended boundary.   | Remove `await` from XRAY Cardano creation.                                                                |
| C03       | Promises identify provider or wallet effects after creation.                | Documentation and call sites change.                                | Await chain queries, builds requiring provider data, wallet operations, submission, and observation only. |

## Validation

- `npm run build --workspace=@xray-network/xray-js` passed.
- `npm run typecheck --workspace=@xray-network/xray-js` passed.
- `npm test --workspace=@xray-network/xray-js` passed with 1 test passed and 0 failed.
- `npm run build`, `npm run typecheck`, and `npm test` passed for every workspace.
- Runtime test verifies facade immutability, isolated client values, synchronous return, and zero protocol requests at creation.
- `git diff --check` passed.

## Deviations from instruction

None.

## Remaining human review

- Confirm synchronous creation should be the generic contract for future chain modules.
- Confirm static chain-module imports are preferred to asynchronous module discovery.

## Reproducibility

Validated from the repository root on 2026-08-03 with npm `10.8.2` and Node `v20.18.1`. The repository requires Node `>=20.19.0`; all required commands still completed successfully in the available environment.
