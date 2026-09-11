<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 378106ef1048e32dae9d97a9bafdef94565fb1ee0dd5a833d6cf9ee2b633b8b7

| Syntax | Operation and stopping boundary |
| --- | --- |
| `/spectre plan <target>: <objective>` | Run the §8 planning workflow for one target, create the instruction and `PLANNED` row, and stop without modifying product source. |
| `/spectre implement <record>` | Run the §9 implementation workflow for the identified `PLANNED` record, validate it, write its result, move it to `REVIEW`, and stop. |
| `/spectre implement --batch <records>` | Resolve a fixed set of existing plans and run §9 sequentially, completing each result and `REVIEW` transition before the next item. Stop on a blocker or after the selected set; never accept work automatically. |
| `/spectre revise <record>: <changes>` | Run the §9 revision workflow for the identified `REVIEW` record, change only that implementation within its instruction, rerun applicable validation, update its existing result, keep it in `REVIEW`, and stop. |
| `/spectre status <record>` | Find the unique record in the active ledger or archives, read its row, instruction, and result when present, and report status and location without changing files or state. |
| `/spectre list [target] [state] [--archived]` | List active-ledger records by default, or archived records only with `--archived`. Optional target and state arguments filter that set; no arguments include every target and state in the active ledger. |
| `/spectre accept <records>: <proof>` | Resolve one or a bounded set of `REVIEW` records and record the current human's acceptance in only their matching ledger decision fields. |
| `/spectre reject <records>: <proof>` | Resolve one or a bounded set of `REVIEW` records and record the current human's rejection in only their matching ledger decision fields. |
| `/spectre cancel <records>: <reason>` | Resolve one or a bounded set of `PLANNED` records and record the human-authorized cancellation in only their matching ledger decision fields. |
| `/spectre archive [target]` | Run the §9 archive workflow for all targets or one selected target, move only terminal implementations and their ledger rows into a dated archive, preserve active work, validate, and stop. |
| `/spectre capture <provider>` | Run only §12: publish a numbered full baseline or incremental capture; unchanged evidence creates no folder or tracked writes. Do not create or implement a target record. |
| `/spectre help [operation]` | Report every command, or one named operation, with its syntax, purpose, and stopping boundary without changing tracked files or lifecycle state. |

`help` reads only the router, shared core, and its command module. Its unqualified form reports every command in the table;
its qualified form reports one command. If the command name is unknown, report that it is not
recognized and suggest `/spectre help` without selecting or running another operation.

Unqualified help also explains that a current-human message mentioning SPECTRE may queue multiple
explicitly stated non-decision operations in natural language without another command,
and that accept, reject, and cancel remain standalone commands that may select a bounded eligible
record set.

Record, target, and provider selectors accept IDs/slugs or natural descriptions. A unique match
resolves to its canonical identity; bounded plural record selectors are also valid for implementation
and decision batches. Ambiguity or missing decision proof requires clarification. Examples:
`/spectre status last implementation`, `/spectre reject the login change: missing checks`, and
`/spectre accept the three implementations just completed: reviewed their results and checks`.
Describing a target never authorizes another operation or bypasses its state requirements.
