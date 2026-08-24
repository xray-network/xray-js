# XRAY Updates status

Status-Version: v1

This is the only lifecycle and decision-proof ledger for all implementation records.

## Cardano implementation status

Target: cardano

### Implementation ledger

| ID     | Title                                | Instruction                                                 | State      | Result                                                  | Evidence mode | Decision proof                                                                     |
| ------ | ------------------------------------ | ----------------------------------------------------------- | ---------- | ------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| `0001` | Adopt typed Cardano APIs             | [Instruction](./implementations/cardano/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](./implementations/cardano/0001-IMPL-RESULT.md) | `DERIVED`     | Human explicitly accepted `cardano/0001`.                                          |
| `0002` | Replace Cardano client architecture  | [Instruction](./implementations/cardano/0002-IMPL-INSTR.md) | `REVIEW`   | [Result](./implementations/cardano/0002-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review.           |
| `0003` | Adopt functional Cardano API         | [Instruction](./implementations/cardano/0003-IMPL-INSTR.md) | `REVIEW`   | [Result](./implementations/cardano/0003-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review.           |
| `0004` | Simplify Cardano source structure    | [Instruction](./implementations/cardano/0004-IMPL-INSTR.md) | `REVIEW`   | [Result](./implementations/cardano/0004-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review.           |
| `0005` | Normalize Cardano library namespaces | [Instruction](./implementations/cardano/0005-IMPL-INSTR.md) | `REVIEW`   | [Result](./implementations/cardano/0005-IMPL-RESULT.md) | `LOCAL`       | Focused facade exports and consumer consolidation validate and await human review. |
| `0006` | Group Cardano application exports | [Instruction](./implementations/cardano/0006-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/cardano/0006-IMPL-RESULT.md) | `LOCAL` | Grouped application and low-level boundaries, tests, docs, and every active downstream build pass. |
| `0007` | Isolate Cardano Lib exports | [Instruction](./implementations/cardano/0007-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/cardano/0007-IMPL-RESULT.md) | `LOCAL` | Strict application/library exports and all downstream validations pass and await human review. |
| `0008` | Group Cardano utilities | [Instruction](./implementations/cardano/0008-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/cardano/0008-IMPL-RESULT.md) | `LOCAL` | Grouped utility exports, internal ownership cleanup, downstream migration, and complete validation await human review. |
| `0009` | Construct canonical ADA-only values | [Instruction](./implementations/cardano/0009-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/cardano/0009-IMPL-RESULT.md) | `LOCAL` | Canonical conversion boundaries, Eternl regression coverage, lossless signing, and downstream XRAY App validation pass. |

## Mini App Bridge implementation status

Target: mini-app-bridge

### Implementation ledger

| ID     | Title                   | Instruction                                                         | State      | Result                                                          | Evidence mode | Decision proof                                    |
| ------ | ----------------------- | ------------------------------------------------------------------- | ---------- | --------------------------------------------------------------- | ------------- | ------------------------------------------------- |
| `0001` | Rename Mini App package | [Instruction](./implementations/mini-app-bridge/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](./implementations/mini-app-bridge/0001-IMPL-RESULT.md) | `LOCAL`       | Human explicitly accepted `mini-app-bridge/0001`. |
| `0002` | Expose bridge host context | [Instruction](./implementations/mini-app-bridge/0002-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0002-IMPL-RESULT.md) | `LOCAL` | Contextual envelopes, transports, mocks, and React hooks validate and await human review. |
| `0003` | Separate Cardano bridge adapter | [Instruction](./implementations/mini-app-bridge/0003-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0003-IMPL-RESULT.md) | `LOCAL` | Platform, Cardano-native, and CIP-30 boundaries plus all downstream builds pass and await human review. |
| `0004` | Remove bridge entrypoint shims | [Instruction](./implementations/mini-app-bridge/0004-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0004-IMPL-RESULT.md) | `LOCAL` | Direct exports, neutral documentation, and all consumer validations pass and await human review. |
| `0005` | Rename default connector key | [Instruction](./implementations/mini-app-bridge/0005-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0005-IMPL-RESULT.md) | `LOCAL` | The xrayBridge default, tests, and builds pass and await human review. |
| `0006` | Rename Cardano bridge protocol | [Instruction](./implementations/mini-app-bridge/0006-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0006-IMPL-RESULT.md) | `LOCAL` | The renamed public contract, hooks, mocks, tests, README, and active consumers validate and await human review. |
| `0007` | Compact bridge role exports | [Instruction](./implementations/mini-app-bridge/0007-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0007-IMPL-RESULT.md) | `LOCAL` | Symmetric Cardano-wide listeners and handshake-ordered React platform getters pass package tests and downstream template verification and await human review. |
| `0008` | Separate JavaScript React examples | [Instruction](./implementations/mini-app-bridge/0008-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0008-IMPL-RESULT.md) | `LOCAL` | Separate JavaScript client, host/relay, and React examples validate and await human review. |
| `0009` | Separate CIP-30 examples | [Instruction](./implementations/mini-app-bridge/0009-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0009-IMPL-RESULT.md) | `LOCAL` | Independent Cardano Bridge and CIP-30 JavaScript/React examples validate and await human review. |
| `0010` | Collapse CIP-30 protocol subpath | [Instruction](./implementations/mini-app-bridge/0010-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0010-IMPL-RESULT.md) | `LOCAL` | Unified Cardano contracts, retired nested path, and complete downstream validation await human review. |
| `0011` | Allow nullable platform context | [Instruction](./implementations/mini-app-bridge/0011-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0011-IMPL-RESULT.md) | `LOCAL` | Accountless platform connectivity and complete SDK validation await human review. |
| `0012` | Version Mini App Bridge protocol | [Instruction](./implementations/mini-app-bridge/0012-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0012-IMPL-RESULT.md) | `LOCAL` | Revised explicit v1 ownership to the bridge package only, kept the aggregate runtime current-facing, and reran all validations; coordinated XRAY App and mini-app migration awaits human review. |
| `0013` | Simplify bridge adapter scopes | [Instruction](./implementations/mini-app-bridge/0013-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0013-IMPL-RESULT.md) | `LOCAL` | Platform status now identifies `xray.app` and its nullable account without a handshake; packaging and all validations pass and await human review. |
| `0014` | Normalize platform status envelope | [Instruction](./implementations/mini-app-bridge/0014-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0014-IMPL-RESULT.md) | `LOCAL` | Normalized raw status envelopes and unchanged React projection validate across the SDK and await human review. |
| `0015` | Open Cardano explorer identifiers | [Instruction](./implementations/mini-app-bridge/0015-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0015-IMPL-RESULT.md) | `LOCAL` | Open nonempty explorer identifiers and full SDK validation pass and await human review. |
| `0016` | Expose platform locale | [Instruction](./implementations/mini-app-bridge/0016-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0016-IMPL-RESULT.md) | `LOCAL` | Typed request-only locale contract, mocks, tests, docs, and full SDK validation pass and await human review. |
| `0017` | Stabilize Cardano account bootstrap | [Instruction](./implementations/mini-app-bridge/0017-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/mini-app-bridge/0017-IMPL-RESULT.md) | `LOCAL` | Typed readiness, bounded one-hook retry, deduplication, stale-result protection, tests, docs, and coordinated validation pass and await human review. |

## Repository implementation status

Target: repository

### Implementation ledger

| ID     | Title                | Instruction                                                    | State      | Result                                                     | Evidence mode | Decision proof                                |
| ------ | -------------------- | -------------------------------------------------------------- | ---------- | ---------------------------------------------------------- | ------------- | --------------------------------------------- |
| `0001` | Install XRAY Updates | [Instruction](./implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](./implementations/repository/0001-IMPL-RESULT.md) | `LOCAL`       | Human requested installation of XRAY Updates. |
| `0002` | Organize blockchain examples | [Instruction](./implementations/repository/0002-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/repository/0002-IMPL-RESULT.md) | `LOCAL` | Cardano examples and explicit Bitcoin/Midnight placeholders validate and await human review. |

## Runtime implementation status

Target: runtime

### Implementation ledger

| ID     | Title                             | Instruction                                                 | State    | Result                                                  | Evidence mode | Decision proof                                                           |
| ------ | --------------------------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| `0001` | Introduce XRAY chain facade       | [Instruction](./implementations/runtime/0001-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0001-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review. |
| `0002` | Make Cardano creation synchronous | [Instruction](./implementations/runtime/0002-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0002-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review. |
| `0003` | Mirror compact bridge facade | [Instruction](./implementations/runtime/0003-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0003-IMPL-RESULT.md) | `LOCAL` | Reduced runtime bridge wrappers and all local validations await human review. |
| `0004` | Remove package root module | [Instruction](./implementations/runtime/0004-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0004-IMPL-RESULT.md) | `LOCAL` | Explicit-only exports and complete local validation pass and await human review. |
| `0005` | Collapse CIP-30 compatibility path | [Instruction](./implementations/runtime/0005-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0005-IMPL-RESULT.md) | `LOCAL` | Unified runtime Cardano contract path and complete local validation await human review. |
