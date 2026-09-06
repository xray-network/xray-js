# Runtime implementation 0002 instruction

Implementation-Version: v1
Implementation-ID: runtime/0002
Created: 20260803T180000Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                              | Kind    | Required | Purpose                                                       |
| ---------------------------------- | ------- | -------- | ------------------------------------------------------------- |
| `packages/runtime/src/xray.ts`     | `LOCAL` | Yes      | Existing asynchronous XRAY chain-module factory.              |
| `packages/runtime/src/common.ts`   | `LOCAL` | Yes      | Existing generic chain-module contract.                       |
| `packages/cardano/`                | `LOCAL` | Yes      | Coordinated synchronous `createCardano` replacement contract. |
| Human request in this conversation | `LOCAL` | Yes      | Requires `XRAY.cardano.create(config)` to be synchronous.     |

## Objective

Make the XRAY Cardano module construct its functional client synchronously while preserving isolated clients and reserving Promises for effectful client operations.

## Changes to implement

| Change ID | Requirement                                                                                                                                      | Compatibility                         | Local owner           | Validation                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| C01       | Change `XrayChainModule.create` to return its client synchronously.                                                                              | Breaking generic contract.            | Runtime common types  | Runtime typecheck.                                                       |
| C02       | Integrate `createCardano` statically so `XRAY.cardano.create(config)` returns a Cardano value without dynamic-import or protocol-fetch Promises. | Breaking Cardano creation behavior.   | Runtime XRAY facade   | Runtime test proves immediate return and zero initial provider requests. |
| C03       | Update facade tests and documentation so `await` appears only on provider or wallet effects.                                                     | Replaces async construction examples. | Runtime tests, README | Runtime/root validation.                                                 |

## Implementation steps

1. Update the generic chain module and Cardano facade integration.
2. Replace runtime tests and root documentation.
3. Run runtime and repository validation and record actual outcomes.

## Validation

- `npm run build --workspace=@xray-network/xray-js`
- `npm run typecheck --workspace=@xray-network/xray-js`
- `npm test --workspace=@xray-network/xray-js`
- `npm run build`
- `npm run typecheck`
- `npm test`

## Compatibility and human review

Human review should confirm that synchronous creation is the desired cross-chain module contract and that it does not hide asynchronous initialization or shared mutable state.

## Completion criteria

- `XRAY.cardano.create(config)` returns synchronously.
- Creating a client performs no protocol/provider request.
- Each call still creates isolated state.
- Runtime and root validation pass.

## Out of scope

- Asynchronous plugin discovery.
- Another concrete chain module.
- Package publication or human acceptance.

## Blockers

None.
