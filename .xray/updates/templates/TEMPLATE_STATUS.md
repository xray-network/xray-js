# Aggregate implementation status

Status-Template-Version: v1

`.xray/updates/XRAY-UPDATES-STATUS.md` uses this schema and is the only lifecycle and decision-proof
ledger for all implementations. Use one repository section in flat mode or repeat the target
section once for every target in monorepo mode.

```markdown
# XRAY Updates status

Status-Version: v1

This is the only lifecycle and decision-proof ledger for all implementation records.

## <Target> implementation status

Target: <target>

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |
| `0001` | Install XRAY Updates | [Instruction](./implementations/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](./implementations/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of XRAY Updates. |
```

In flat mode, replace `<Target>` and `<target>` with the repository name and slug, and use flat
instruction and result links. In monorepo mode, repeat the section for every target and use links
under `./implementations/<target>/`. Every section's table header is required even when there are
no rows. Put `No implementation records.` after an empty table header.

Rules:

- Flat mode has exactly one repository section and one repository-wide sequence.
- Monorepo target sections are unique and ordered by target slug.
- Every new installation has exactly one `ACCEPTED` bootstrap row at flat `0001` or `repository/0001`.
- IDs are four digits, unique within the applicable sequence, and ordered ascending.
- Title is a two-to-eight-word plain-language objective label with no ending punctuation. It must
  agree with the instruction objective.
- Each row links one matching instruction and, once required, its result.
- Evidence mode matches the instruction.
- States are `PLANNED`, `REVIEW`, `ACCEPTED`, `REJECTED`, or `CANCELLED`.
- `REVIEW`, `ACCEPTED`, and `REJECTED` require a result link.
- `PLANNED` and `CANCELLED` may use `—` for Result.
- Decision proof gives the exact reason for the current state.
- Provider inventories and global plans do not belong here.
