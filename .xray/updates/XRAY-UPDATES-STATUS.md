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

## Mini App Bridge implementation status

Target: mini-app-bridge

### Implementation ledger

| ID     | Title                   | Instruction                                                         | State      | Result                                                          | Evidence mode | Decision proof                                    |
| ------ | ----------------------- | ------------------------------------------------------------------- | ---------- | --------------------------------------------------------------- | ------------- | ------------------------------------------------- |
| `0001` | Rename Mini App package | [Instruction](./implementations/mini-app-bridge/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](./implementations/mini-app-bridge/0001-IMPL-RESULT.md) | `LOCAL`       | Human explicitly accepted `mini-app-bridge/0001`. |

## Repository implementation status

Target: repository

### Implementation ledger

| ID     | Title                | Instruction                                                    | State      | Result                                                     | Evidence mode | Decision proof                                |
| ------ | -------------------- | -------------------------------------------------------------- | ---------- | ---------------------------------------------------------- | ------------- | --------------------------------------------- |
| `0001` | Install XRAY Updates | [Instruction](./implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](./implementations/repository/0001-IMPL-RESULT.md) | `LOCAL`       | Human requested installation of XRAY Updates. |

## Runtime implementation status

Target: runtime

### Implementation ledger

| ID     | Title                             | Instruction                                                 | State    | Result                                                  | Evidence mode | Decision proof                                                           |
| ------ | --------------------------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| `0001` | Introduce XRAY chain facade       | [Instruction](./implementations/runtime/0001-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0001-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review. |
| `0002` | Make Cardano creation synchronous | [Instruction](./implementations/runtime/0002-IMPL-INSTR.md) | `REVIEW` | [Result](./implementations/runtime/0002-IMPL-RESULT.md) | `LOCAL`       | Implementation completed and validation recorded; awaiting human review. |
