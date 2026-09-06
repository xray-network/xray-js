# Mini App Bridge implementation 0018 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0018
Instruction: ./0018-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| `C01` | IMPLEMENTED | Replaced the native Cardano `signTx` result with a strict discriminated union: success requires nonempty `hash` and complete signed transaction `cbor`; failure requires a nonempty `error`. Existing client, host, and React types infer the new result without aliases or a legacy empty-hash branch. | Direct schema tests accept both exact branches and reject missing/empty CBOR, the legacy failure sentinel, and mixed-branch fields; package and workspace typechecks pass. |
| `C02` | IMPLEMENTED | Updated the typed mock host and bridge transport coverage with complete signed CBOR, a typed failure fixture, and a sequential native flow that passes `signTx` result CBOR directly into `submitTx`. `signAndSubmitTx` remains independently covered. | Mini App Bridge tests assert the returned hash/CBOR, exact failure payload, submitted request payload, and unchanged one-step result; 26/26 package tests pass. |
| `C03` | IMPLEMENTED | Updated native Cardano documentation to narrow the result, submit `payload.cbor`, explain that the hash is only an identifier, and distinguish the CIP-30 witness-set assembly model. | Contract and existing connector tests confirm Cardano CIP-30 `signTx` still returns a string witness set; documentation and formatting checks pass. |
| `C04` | IMPLEMENTED | Rebuilt and validated the Mini App Bridge, complete xray-js workspace, and linked XRAY App host/consumer after the coordinated result change. | Root xray-js check, format check, diff check, and XRAY App wallet verification all pass. |

## Outcome

Native Cardano v1 `signTx` now returns usable signed transaction data. A successful Mini App response contains the complete signed transaction CBOR plus its transaction hash, and a failed request contains an error rather than an empty hash. A caller can retain `payload.cbor` and pass it directly to a later native `submitTx` call.

The native scope, version, method, request payload, response envelope, timeout behavior, and one-step `signAndSubmitTx` operation remain unchanged. Cardano CIP-30 remains a separate witness-only contract.

## Inputs consumed

- Human request dated 2026-08-25 to make native Cardano signing usable by a later submission call.
- XRAY implementation instruction `mini-app-bridge/0018` and repository standards.
- Native Cardano v1 contract/client/host/React adapter, Mini App Bridge mock host, tests, and Cardano documentation.
- Cardano CIP-30 contract and connector tests as the unchanged witness-only boundary.
- Coordinated XRAY App `app/0038` host implementation and validation.

## Project changes

- `packages/mini-app-bridge/src/adapters/cardano/v1/contract.ts`
- `packages/mini-app-bridge/src/testing/mock-host.ts`
- `packages/mini-app-bridge/test/cardano-sign-tx-contract.test.ts`
- `packages/mini-app-bridge/test/bridge.test.ts`
- `packages/mini-app-bridge/README-CARDANO.md`

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| `C01` | Native Cardano v1 `signTx` returns `{ success: true, hash, cbor }` or `{ success: false, error }`. | Scope `cardano`, version `v1`, method, request, envelope, and timeout are stable; the old result shape is removed. | Narrow on `payload.success`; use `payload.cbor` only from the success branch and surface `payload.error` from failure. |
| `C02` | Successful native signing yields complete transaction CBOR that can be sent directly to native `submitTx`. | `submitTx` still accepts a complete signed transaction string; `signAndSubmitTx` is unchanged. | For separate actions, retain and submit the returned `cbor`; use `signAndSubmitTx` when XRAY should own both steps. |
| `C03` | Native signing and CIP-30 signing have explicitly different return semantics. | Cardano CIP-30 `signTx`, `partialSign`, connector, and error behavior are unchanged. | CIP-30 callers must continue merging the returned witness set into the original transaction before submission. |
| `C04` | Bridge and XRAY App consumers use one coordinated required result contract. | No compatibility alias, optional legacy field, transaction cache, or protocol negotiation was added. | Release the bridge package and XRAY App host together. |

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge` — passed.
- `npm test --workspace @xray-network/xray-js-mini-app-bridge` — passed, 26/26 tests.
- `npm run check` from the xray-js repository root — passed: Cardano 31 passed/1 live test skipped, Mini App Bridge 26 passed, runtime 3 passed, and all workspace typechecks passed.
- `npm run format:check` — passed.
- Coordinated XRAY App `npm run verify:wallet` — passed after the required unsandboxed prerender-server rerun, including formatting, 87/87 tests, typecheck, client/SSR build, and SPA prerender.
- `git diff --check` — passed in both repositories.

## Deviations from instruction

None.

## Remaining human review

- Confirm a real Mini App can sign a transaction, retain the returned complete CBOR, and submit it in a later user action.
- Confirm rejected/cancelled signing is presented from the typed error branch and no consumer expects an empty hash.
- Confirm bridge and XRAY App versions are released together and CIP-30 consumers continue witness assembly.

## Reproducibility

From the xray-js repository root, run `npm run check`, `npm run format:check`, and `git diff --check`. Then run `npm run verify:wallet` and `git diff --check` from the linked xray-app repository root.
