# Runtime implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: runtime/0001
Created: 20260803T150230Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                              | Kind    | Required | Purpose                                                                                                        |
| ---------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `packages/runtime/`                | `LOCAL` | Yes      | Current root package exports and Cardano subpath integration.                                                  |
| `packages/cardano-sdk/`            | `LOCAL` | Yes      | Current local Cardano package contract being replaced in the coordinated repository change.                    |
| Human request in this conversation | `LOCAL` | Yes      | Requires uppercase `XRAY` as the main multi-chain export with lower-case chain modules such as `XRAY.cardano`. |

## Objective

Replace the root Cardano namespace export with an immutable, uppercase, extensible XRAY facade whose Cardano module creates isolated Cardano clients and whose design can add Bitcoin and other chain modules without coupling chain packages back to runtime.

## Changes to implement

| Change ID | Requirement                                                                                                                                                                   | Compatibility                                                                     | Local owner                             | Validation                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------- |
| C01       | Export `XRAY` as the main named runtime facade and expose `XRAY.cardano.create(config)`.                                                                                      | Replaces the existing root `Cardano` namespace.                                   | `packages/runtime/src`                  | Runtime build and typecheck.           |
| C02       | Keep `@xray-network/xray-js/cardano` as the direct, fully typed Cardano entry and preserve `/cardano/lib`.                                                                    | Cardano subpath API is intentionally replaced by the new Cardano package exports. | Runtime entrypoints and package exports | Import smoke tests and declarations.   |
| C03       | Define the minimal chain-module contract and keep runtime-to-chain dependency direction one-way so future `bitcoin`, `midnight`, and other modules can follow the same shape. | New extensibility contract; no non-Cardano implementation is claimed.             | Runtime common/facade modules           | Typecheck and architecture inspection. |
| C04       | Avoid a mutable global configured client; each chain-module `create` call returns an isolated client.                                                                         | New lifecycle behavior.                                                           | Runtime XRAY facade                     | Runtime tests.                         |
| C05       | Update root documentation to use `XRAY.cardano` and direct Cardano imports consistently.                                                                                      | Removes legacy root examples.                                                     | `README.md`                             | Documentation search.                  |

## Implementation steps

1. Define the chain-module contract and uppercase XRAY facade.
2. Integrate the replacement Cardano client through the facade and direct subpath.
3. Add runtime tests or compile-time smoke coverage for isolated creation and export shape.
4. Update package metadata and documentation.
5. Run repository validation and record the outcome.

## Validation

- `npm run build --workspace=@xray-network/xray-js`
- `npm run typecheck --workspace=@xray-network/xray-js`
- `npm test --workspace=@xray-network/xray-js`
- `npm run build`
- `npm run typecheck`
- `npm test`

## Compatibility and human review

This is intentionally breaking. Human review should confirm that uppercase `XRAY` is an immutable facade rather than a configured singleton, `XRAY.cardano.create` creates isolated clients, direct subpath imports remain ergonomic, and adding another chain requires no Cardano or runtime architectural rewrite.

## Completion criteria

- The root package exports uppercase `XRAY`.
- `XRAY.cardano.create` returns the new Cardano client.
- Root and direct Cardano entrypoints compile and are documented.
- The facade contract can accommodate future chain modules without pretending they are implemented.

## Out of scope

- A concrete Bitcoin, Midnight, or other blockchain implementation.
- Dynamic third-party plugin discovery.
- Package publication or human acceptance.

## Blockers

None.
