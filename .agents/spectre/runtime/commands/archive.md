<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 378106ef1048e32dae9d97a9bafdef94565fb1ee0dd5a833d6cf9ee2b633b8b7

### Archive workflow

Run only for `/spectre archive [target]` or its host-native equivalent. Omit the target to select
all active-ledger targets; supply a target to select exactly that existing target. In flat mode,
the only valid target is the repository slug. Resolve supplied target descriptions under §1 before
mutation; an unknown or ambiguous selector requires clarification. Do not create a target or expand
a record description to a target scope for this operation.

Eligible states are `ACCEPTED`, `REJECTED`, and `CANCELLED`, including the accepted installation
record. Keep `PLANNED` and `REVIEW` records and rows active. Already archived records are never
moved again. If no eligible rows exist, report that nothing was archived and change no files;
do not create an empty archive or directory.

1. Read the active ledger, all archive manifests, and selected terminal instructions and results.
   Validate the installation using §13 before mutation. Refuse missing or duplicate records,
   invalid states, unresolved references, hash mismatches, or an incomplete previous archive.
2. Collect every eligible row in the selected scope and its exact record files. An `ACCEPTED` or
   `REJECTED` row requires a result; preserve a `CANCELLED` row's optional result when present.
   Capture the original repository-relative paths, record bytes and SHA-256 digests, ledger rows,
   and current active-ledger contents before moving anything.
3. Choose a new UTC archive ID `YYYYMMDDTHHMMSSZ`. If that directory already exists, append the
   smallest unused four-digit suffix beginning with `-0001`. Never overwrite an existing batch.
   Stage the batch outside the live archive directory, retaining each file's path relative to
   active `implementations/`, and prepare `ARCHIVE.md` using the format below.
4. Verify staged bytes against the original digests, row preservation, direct manifest links,
   and all inbound and outbound SPECTRE references using the path-resolution rules below.
   Dependencies from active work or older archives must still resolve to the same record bytes.
   Preserve product source, provider evidence, active records outside the selection, and all
   previous archives. Do not rewrite record contents, create redirect stubs, or reset IDs.
5. Recheck that the original records and ledger still match the captured inputs; if they changed,
   stop before publication and leave the new work untouched. Publish the complete batch, remove
   only its original record files, and remove only its rows
   from root `SPECTRE.md` as one recoverable repository change. Keep ledger metadata, target
   sections, table headers, and remaining rows unchanged. For each newly empty table, add
   `No implementation records.`; remove a stale empty-table marker when a later plan adds a row.
   Do not delete the active ledger or renumber its records.
6. Validate the final installation and reference resolution using §13. If publication or
   validation fails, restore the captured source files and ledger and remove only this operation's
   new batch. Do not report success or discard staging/backups until the entire change validates.
   After an interruption, detect inconsistent copies or rows and stop for recovery rather than
   running another archive or allocating IDs from incomplete history.
7. Report the archive ID and path, archived implementation IDs, and remaining active counts.
   Stop without creating a plan, result, acceptance decision, or other lifecycle operation.

### Archive manifest

Each batch has one `.agents/spectre/archive/<archive-id>/ARCHIVE.md`. This is a batch manifest,
not a fourth installed template. It becomes immutable when the archive operation succeeds.

```markdown
# SPECTRE archive <archive-id>

Archive-Version: v1
Archive-ID: <archive-id>
Created: YYYYMMDDTHHMMSSZ
Protocol-Version: 1.0.0
Storage-Mode: <flat|nested>
Scope: <target|ALL>

## Archived implementations

### <Target> implementation status

Target: <target>

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

## Record paths

| Original path | Archived file | SHA-256 |
| --- | --- | --- |
| `.agents/spectre/implementations/<record-file>` | [Record](implementations/<record-file>) | `<sha256>` |
```

Populate the manifest with only this batch's selected rows. Repeat the target section for each
selected target, ordered by slug, and order rows by numeric ID. Preserve every cell's original
value and link label; only rebase Instruction and Result destinations to the archived files,
relative to `ARCHIVE.md`. Preserve `—` for a missing optional result.

The Record paths table has exactly one row per moved instruction or result. Original path is the
normalized repository-relative path before archiving. Archived file is a direct relative link to
the batch's file with the same suffix below `implementations/`; nested storage includes the target
in that suffix. SHA-256 is the lowercase hex digest of the original bytes. Require regular files,
unique original paths and destinations, and agreement between record IDs, ledger rows, and paths.
Refuse symlinks, paths outside the installation, duplicate maps, or extra undeclared record files.
