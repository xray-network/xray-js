# Runtime implementation 0001 result

Result-Version: v1
Implementation-ID: runtime/0001
Instruction: ./0001-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation                                                                                                                                      | Validation                                                             |
| --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| C01       | Implemented | Added the immutable named `XRAY` facade with `XRAY.cardano.create(config)` and removed the previous root `Cardano` namespace export.                | Runtime build, typecheck, and facade test passed.                      |
| C02       | Implemented | Preserved direct `@xray-network/xray-js/cardano` and `/cardano/lib` entrypoints and added `/cardano/testing`, all backed by generated declarations. | Runtime compilation and self-referenced subpath imports passed.        |
| C03       | Implemented | Added the generic `XrayChainModule<Config, Client>` lifecycle contract and kept the dependency direction from runtime to the leaf chain package.    | Strict typecheck passed; no Cardano source imports runtime.            |
| C04       | Implemented | Kept the facade frozen and made every `create` call dynamically load the chain module and return a new client instance.                             | Runtime test confirms facade/module immutability and isolated clients. |
| C05       | Implemented | Rewrote root examples and package descriptions around uppercase `XRAY`, lower-case chain modules, and direct chain imports.                         | Documentation search and root validation passed.                       |

## Outcome

The root package now presents uppercase `XRAY` as a small immutable multi-chain facade. `XRAY.cardano.create` creates isolated Cardano clients, while direct Cardano and testing subpaths remain available. Future chain modules can adopt the same create contract without changing Cardano or storing mutable global clients.

## Inputs consumed

- `packages/runtime/` supplied the existing root and subpath export layout.
- The pre-migration `packages/cardano-sdk/` contract supplied the Cardano integration baseline before the coordinated replacement.
- The human request in this conversation established uppercase `XRAY` and lower-case chain-module naming.

## Project changes

- Added `packages/runtime/src/xray.ts` and exported `XRAY` from the package root.
- Added `XrayChainModule` to the runtime common types.
- Added the `@xray-network/xray-js/cardano/testing` entrypoint.
- Added runtime compile/runtime tests for public imports, immutability, and isolated Cardano clients.
- Updated runtime package metadata and root documentation for version `4.0.0`.

## Exported change contract

| Change ID | Semantic change                                                                                                | Compatibility                                          | Downstream action                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| C01       | The root product entry is `XRAY`; chain clients are created through lower-case modules such as `XRAY.cardano`. | The root `Cardano` namespace is removed.               | Import `{ XRAY }` and call `await XRAY.cardano.create(config)`.                   |
| C02       | Cardano remains available as a direct subpath, with library and testing subpaths.                              | Direct exports now expose the replacement Cardano API. | Import Cardano-specific types and utilities from `@xray-network/xray-js/cardano`. |
| C03       | Every chain module follows the minimal asynchronous `create(config?)` contract.                                | Additive architecture contract.                        | Add future chain modules as facade properties implementing `XrayChainModule`.     |
| C04       | XRAY is a frozen facade, not a configured singleton.                                                           | Shared global client state is not supported.           | Retain and pass the client returned by each chain module's `create` call.         |
| C05       | Public documentation consistently uses uppercase XRAY product naming.                                          | Old examples are obsolete.                             | Update application imports and examples to the new naming.                        |

## Validation

- `npm run build --workspace=@xray-network/xray-js` passed.
- `npm run typecheck --workspace=@xray-network/xray-js` passed.
- `npm test --workspace=@xray-network/xray-js` passed with 1 test passed and 0 failed.
- `npm run build` passed for Cardano, Mini App Bridge, and Runtime.
- `npm run typecheck` passed for all workspaces.
- `npm test` passed for all workspaces with no failures; the single opt-in Cardano live test was skipped.
- The runtime test imports `XRAY` from the package root and `InMemoryProvider` through `@xray-network/xray-js/cardano/testing`, exercising package self-reference and generated exports.
- `git diff --check` passed.

## Deviations from instruction

None. No placeholder `XRAY.bitcoin` property was added because a concrete Bitcoin module is explicitly out of scope; the facade contract is ready for it when that package exists.

## Remaining human review

- Confirm `XRAY.cardano.create` is the desired cross-chain lifecycle convention.
- Confirm future unimplemented chains should remain absent rather than appear as placeholders.
- Review the version `4.0.0` release and publication plan separately.

## Reproducibility

Validated from the repository root on 2026-08-03 with npm `10.8.2` and Node `v20.18.1`. The repository declares Node `>=20.19.0`; this mismatch produced npm engine warnings during lockfile validation but did not prevent required builds, typechecks, or offline tests.
