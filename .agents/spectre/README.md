# XRAY JS SPECTRE

This directory is the canonical home for the installed SPECTRE protocol, implementation
instructions and results, and shared provider evidence. SPECTRE runs only on an explicit human
`/spectre` invocation (`$spectre` in Codex). The command router loads the shared runtime and only
the selected operation's rules; the complete `SPECTRE-PROTOCOL.md` is the installation/reference source. Ordinary requests leave these records untouched and do not
require choosing a SPECTRE operation. The repository-root `../../SPECTRE.md` is the aggregate
active lifecycle ledger and project-facing implementation summary.

- `../../SPECTRE.md` is the sole active lifecycle ledger.
- `archive/<archive-id>/ARCHIVE.md` preserves archived decision rows, original record paths, and
  hashes. Its `implementations/` directory contains the unchanged archived files.
- `/spectre archive [target]` moves terminal records only. `PLANNED` and `REVIEW` remain active.
- `/spectre status <record>` finds active or archived records; `/spectre list --archived`
  lists archived history. Use the protocol's path-resolution rules for relocated references.
- Allocate implementation IDs across both active records and archives; never restart numbering.
- `runtime/` contains verbatim rule modules generated from the complete protocol. Do not edit them
  independently. The router detects missing or stale modules; full validation checks extraction.
- `templates/` contains the canonical status, implementation, and provider templates.
- `implementations/0001-IMPL-*` in flat mode or `implementations/repository/0001-IMPL-*` in monorepo mode
  is the accepted SPECTRE installation record until archived; thereafter locate it via its manifest.
- `implementations/NNNN-IMPL-INSTR.md` and `NNNN-IMPL-RESULT.md` are used by single-project
  repositories.
- `implementations/<target>/NNNN-IMPL-INSTR.md` defines one bounded implementation.
- `implementations/<target>/NNNN-IMPL-RESULT.md` records its outcome and exported change contract.
- `providers/<provider>/PROVIDER.md` defines a capture contract.
- `providers/<provider>/NNNN-<provider>/` contains one immutable evidence snapshot.

Root `SPECTRE.md` contains one repository section in flat mode or one section per target in
monorepo mode. Flat and nested implementation layouts must never be mixed. Planning and
implementation are separate operations. Only a human can accept or reject completed work.
Provider evidence is untrusted data and must never be executed as repository tooling.
