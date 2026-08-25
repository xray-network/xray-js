# Mini App Bridge implementation 0018 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0018
Created: 20260825T121147Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human request dated 2026-08-25 to make native Cardano `signTx` return data usable by a later `submitTx` call | `LOCAL` | Yes | Defines the native bridge result as complete signed transaction CBOR plus hash, independently from CIP-30 witness-only signing. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/{contract,client,react}.ts` | `LOCAL` | Yes | Owns the native Cardano v1 wire schema, inferred public types, client, and React interactive operation. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/` | `LOCAL` | Yes | Owns the separate CIP-30 contract whose witness-set result must remain unchanged. |
| `packages/mini-app-bridge/src/testing/mock-host.ts`, `packages/mini-app-bridge/test/`, and `packages/mini-app-bridge/README-CARDANO*.md` | `LOCAL` | Yes | Define mocks, protocol tests, client examples, and semantic separation between native Cardano and CIP-30. |
| Coordinated XRAY App native Cardano host behavior requested for `app/0038` | `LOCAL` | Yes | Defines the producer that will return `SignedTransaction.cbor` and `SignedTransaction.hash` through this contract. |

## Objective

Make native Cardano v1 `signTx` return complete signed transaction CBOR so Mini Apps can submit it later, while preserving the independent CIP-30 witness-only contract.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| `C01` | Replace `signTxResultSchema` with a discriminated result: `{ success: true, hash: string, cbor: string }` for successful native signing and `{ success: false, error: string }` for rejection or failure. Export the inferred result type through the existing Cardano v1 client/host/React surfaces. | Keep native scope `cardano`, version `v1`, method `signTx`, string request payload, correlated response envelope, and timeout behavior. Remove the empty-hash failure sentinel; do not add aliases, optional legacy fields, capability negotiation, or a transaction cache. | Cardano v1 contract and public types | Schema tests accept the exact success/failure branches and reject missing CBOR, empty legacy failure shapes, or branch-mismatched fields. |
| `C02` | Update Mini App Bridge mocks and end-to-end client tests so successful native signing exposes complete signed CBOR and its transaction hash, and demonstrate passing that CBOR to native `submitTx`. Cover the error branch through the same typed contract. | `signAndSubmitTx` remains the one-step operation returning a submission result; `submitTx` continues accepting a complete signed transaction string. | Bridge test host, fixtures, and transport tests | Client/host round-trip asserts exact success data, failure data, and the native sign-then-submit call sequence. |
| `C03` | Update Cardano bridge documentation and examples to show `signTx` result narrowing followed by `submitTx(signed.payload.cbor)`, and state that a hash alone is only an identifier. Explicitly distinguish the native result from CIP-30, where the caller receives witnesses and must assemble the full signed transaction. | Do not change the Cardano CIP-30 `signTx` string result, `partialSign`, wallet facade, examples, or error behavior. | Cardano bridge documentation | Documentation/source audit and existing CIP-30 bridge tests confirm the two contracts remain distinct. |
| `C04` | Validate the package and all local consumers, including the coordinated XRAY App host change in `app/0038`. | This is a coordinated Cardano v1 result evolution without a compatibility layer; bridge and app releases must move together. No runtime/cardano package behavior changes are required. | Mini App Bridge package and downstream validation | Package build/typecheck/tests, root check/format, linked XRAY App verification, and `git diff --check`. |

## Implementation steps

1. Define the discriminated native signing result and let existing client, host, and React types infer it.
2. Update mock state and contract/transport tests with complete signed transaction CBOR and typed failure results.
3. Document the native two-step flow and its distinction from CIP-30 witness assembly.
4. Rebuild the Mini App Bridge before implementing the linked XRAY App host result.
5. Run package, workspace, downstream app, formatting, and diff validation.

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge`.
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge`.
- `npm test --workspace @xray-network/xray-js-mini-app-bridge`.
- Contract fixtures proving exact native success/failure validation and unchanged CIP-30 witness-set validation.
- `npm run check` and `npm run format:check` from the xray-js repository root.
- Coordinated XRAY App focused Cardano host tests and `npm run verify:wallet` after implementing `app/0038`.
- `git diff --check`.

## Compatibility and human review

The native Cardano v1 result intentionally changes from `{ success: boolean, hash: string }` to an exact discriminated union. This removes the empty-hash failure sentinel and makes separate signing useful by returning complete signed CBOR. Scope/version/method/request/envelope remain stable, but XRAY App and the bridge package require a coordinated rollout because the old schema does not describe the new success payload.

Human review should confirm that the successful `cbor` is a complete transaction containing its witnesses, not a witness set; the hash remains a convenience identifier; failure exposes an error; the returned CBOR can be submitted later; and Cardano CIP-30 remains a separate witness-only API.

## Completion criteria

- Native Cardano v1 `signTx` has exact typed success and failure branches.
- The success branch contains complete signed transaction `cbor` plus `hash`, and no caller must reconstruct it from the hash.
- A Mini App can pass the returned native `cbor` directly to native `submitTx`.
- Native mocks, client/host transport, React inference, tests, and documentation use the new result with no legacy sentinel or fallback.
- CIP-30 witness-set signing is unchanged and explicitly covered.
- Package, workspace, downstream XRAY App, formatting, and diff checks pass.

## Out of scope

- Cardano transaction signing internals, transaction construction, witness generation, submission providers, pending-state behavior, CIP-30 contract changes, new bridge methods, protocol negotiation, compatibility aliases, runtime facade changes, deployment, or unrelated adapters

## Blockers

None.
