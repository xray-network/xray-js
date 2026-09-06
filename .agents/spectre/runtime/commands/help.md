<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 9e42795ea1d0d6e6ebc8ba96e654b083a21f87ad917b082a9ae77f8cf50c18e8

| Syntax | Operation and stopping boundary |
| --- | --- |
| `/spectre plan <target>: <objective>` | Run the §8 planning workflow for one target, create the instruction and `PLANNED` row, and stop without modifying product source. |
| `/spectre implement <record>` | Run the §9 implementation workflow for the identified `PLANNED` record, validate it, create its result, move it to `REVIEW`, and stop. |
| `/spectre revise <record>: <changes>` | Run the §9 revision workflow for the identified `REVIEW` record, change only that implementation within its instruction, rerun applicable validation, update its existing result, keep it in `REVIEW`, and stop. |
| `/spectre status <record>` | Find the unique record in the active ledger or archives, read its row, instruction, and result when present, and report status and location without changing files or state. |
| `/spectre list [target] [state] [--archived]` | List active-ledger records by default, or archived records only with `--archived`. Optional target and state arguments filter that set; no arguments include every target and state in the active ledger. |
| `/spectre validate [record]` | Run applicable §13 validation for the complete installation including archives, or the identified active or archived record, without changing files or state. |
| `/spectre accept <record>: <proof>` | Record the current human's acceptance of a `REVIEW` record and only the matching ledger decision fields. |
| `/spectre reject <record>: <proof>` | Record the current human's rejection of a `REVIEW` record and only the matching ledger decision fields. |
| `/spectre cancel <record>: <reason>` | Record a human-authorized cancellation of a `PLANNED` record and only the matching ledger decision fields. |
| `/spectre archive [target]` | Run the §9 archive workflow for all targets or one selected target, move only terminal implementations and their ledger rows into a dated archive, preserve active work, validate, and stop. |
| `/spectre capture <provider>` | Run only the §12 provider evidence-capture workflow under the named provider contract; do not create or implement a target record. |
| `/spectre help [operation]` | Report every command, or one named operation, with its syntax, purpose, and stopping boundary without changing tracked files or lifecycle state. |

`help` reads only the router, shared core, and its command module. Its unqualified form reports every command in the table;
its qualified form reports one command. If the command name is unknown, report that it is not
recognized and suggest `/spectre help` without selecting or running another operation.

Record, target, and provider selectors accept IDs/slugs or natural descriptions. A unique match
resolves to its canonical identity; ambiguity or missing decision proof requires clarification.
Examples: `/spectre status last implementation`, `/spectre reject the login change: missing checks`.
Describing a target never authorizes another operation or bypasses its state requirements.
