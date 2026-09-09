# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol: [.agents/spectre/SPECTRE-PROTOCOL.md](.agents/spectre/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: nested

This is the sole active lifecycle ledger. Archived decision rows and record paths are preserved
under `.agents/spectre/archive/` once an archive exists.

## Cardano implementation status

Target: cardano

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

No implementation records.

## Mini App Bridge implementation status

Target: mini-app-bridge

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |
| `0019` | Clarify bridge response outcomes | [Instruction](.agents/spectre/implementations/mini-app-bridge/0019-IMPL-INSTR.md) | `REVIEW` | [Result](.agents/spectre/implementations/mini-app-bridge/0019-IMPL-RESULT.md) | `LOCAL` | Implemented C01–C07; required validation passed; awaiting human review. |
| `0020` | Simplify bridge source and types | [Instruction](.agents/spectre/implementations/mini-app-bridge/0020-IMPL-INSTR.md) | `REVIEW` | [Result](.agents/spectre/implementations/mini-app-bridge/0020-IMPL-RESULT.md) | `LOCAL` | Implemented C01–C05; required validation passed; awaiting human review. |

## Repository implementation status

Target: repository

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

No implementation records.

## Runtime implementation status

Target: runtime

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

No implementation records.
