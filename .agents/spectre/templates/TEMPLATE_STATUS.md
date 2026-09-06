# Aggregate implementation status

Status-Template-Version: v1

Repository-root `SPECTRE.md` uses this schema and is the sole active lifecycle ledger and
project-facing implementation summary. Archived decision rows live only in their immutable
`archive/<archive-id>/ARCHIVE.md` manifests. Use one repository section in flat mode or repeat
the target section once for every target in monorepo mode.

```markdown
# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol: [.agents/spectre/SPECTRE-PROTOCOL.md](.agents/spectre/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: <flat|nested>

This is the sole active lifecycle ledger. Archived decision rows and record paths are preserved
under `.agents/spectre/archive/` once an archive exists.

## <Target> implementation status

Target: <target>

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |
| `0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
```

In flat mode, replace `<Target>` and `<target>` with the repository name and slug, and use flat
instruction and result links. In monorepo mode, repeat the section for every target and use links
under `.agents/spectre/implementations/<target>/`. Every section's table header is required even when there are
no rows. Put `No implementation records.` after an empty table header.

Rules:

- Flat mode has exactly one repository section and one repository-wide sequence.
- Monorepo target sections are unique and ordered by target slug.
- Every installation has exactly one `ACCEPTED` bootstrap row at flat `0001` or `repository/0001`,
  in either this ledger or one archive manifest. Do not recreate it after archiving.
- IDs are four digits, unique across active and archived records in the applicable sequence, and
  ordered ascending. Allocate after the highest ID across both locations.
- Title is a two-to-eight-word plain-language objective label with no ending punctuation. It must
  agree with the instruction objective.
- Each row links one matching instruction and, once required, its result.
- Evidence mode matches the instruction.
- States are `PLANNED`, `REVIEW`, `ACCEPTED`, `REJECTED`, or `CANCELLED`.
- `REVIEW`, `ACCEPTED`, and `REJECTED` require a result link.
- `PLANNED` and `CANCELLED` may use `—` for Result.
- Decision proof gives the exact reason for the current state.
- Provider inventories and global plans do not belong here.
- Archiving removes only selected terminal rows, preserving metadata and target sections. Keep
  headers for empty tables and use `No implementation records.` until the next row is added.
- Archived rows retain their original state and decision proof in their batch manifest; there
  must never be two authoritative rows for the same implementation.
