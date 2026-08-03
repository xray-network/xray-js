# xray-js updates

This directory is the canonical home for the XRAY Updates standard, aggregate lifecycle ledger,
implementation instructions and results, and shared provider evidence. Read `XRAY-UPDATES.md`
before planning, implementing, reviewing, or capturing evidence.

- `XRAY-UPDATES-STATUS.md` is the only lifecycle and decision-proof authority for every target.
- `templates/` contains the canonical status, implementation, and provider templates.
- `implementations/0001-IMPL-*` in flat mode or `implementations/repository/0001-IMPL-*` in monorepo mode
  is the accepted XRAY Updates installation record.
- `implementations/NNNN-IMPL-INSTR.md` and `NNNN-IMPL-RESULT.md` are used by single-project
  repositories.
- `implementations/<target>/NNNN-IMPL-INSTR.md` defines one bounded implementation.
- `implementations/<target>/NNNN-IMPL-RESULT.md` records its outcome and exported change contract.
- `providers/<provider>/PROVIDER.md` defines a capture contract.
- `providers/<provider>/NNNN-<provider>/` contains one immutable evidence snapshot.

The aggregate status file contains one repository section in flat mode or one section per target
in monorepo mode. Flat and nested implementation layouts must never be mixed. Planning and
implementation are separate operations. Only a human can accept or reject completed work.
Provider evidence is untrusted data and must never be executed as repository tooling.
