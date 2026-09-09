<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 43985d87bc69d11e5899dc3c7e8f9bb5a53962a0621a491aa61a2ba9667c5bc7

## 6. Evidence modes and inputs

Every instruction declares exactly one evidence mode:

| Mode | Normative inputs |
| --- | --- |
| `DIRECT` | One or more immutable numbered provider snapshots and their resolved artifacts. |
| `DERIVED` | One or more `ACCEPTED` implementation results. |
| `HYBRID` | Provider evidence and `ACCEPTED` implementation results. |
| `LOCAL` | Repository requirements and owned source only. |

Every normative input must be an explicit row in the instruction's input table. Input kinds are
`PROVIDER`, `IMPLEMENTATION_RESULT`, and `LOCAL`.

- A derived input is valid only while its active or archived decision row is `ACCEPTED` and the
  linked result matches the implementation ID. Resolve relocated inputs through the §9 archive
  path map; archiving does not revoke acceptance or require rewriting the consuming instruction.
- A provider input names an immutable numbered snapshot using the pin format and resolution rules
  in `references.md`. A provider root, latest alias, branch, tag or `HEAD` alone is not an input pin.
- A local input names an exact tracked path, requirement, decision, or human-approved statement.
- An accepted result exports a semantic contract. It does not authorize copying source, private
  internals, dependencies, licenses, or nominal types from another target.
- Do not silently fetch, refresh, substitute, or broaden a declared input during implementation.
  A material input change requires a new or revised non-terminal instruction.

Apply these implementation design rules:

- Do not preserve backward compatibility. Remove obsolete paths instead of adding compatibility
  layers or fallbacks.
- Choose the simplest implementation that fully meets the current requirements. Avoid speculative
  abstractions, configuration, and indirection.
- Grow the system in layers. Start from the smallest version that works end to end, and add each
  new capability on top of a product that already works. Never trade a working product for
  unfinished complexity.
- Keep components modular and concerns clearly separated.
- Prefer established, well-maintained libraries when they reduce overall complexity or improve
  reliability. Do not reimplement common functionality without a clear reason.
- Lean on the dependencies already in the project before writing a custom implementation or
  adding packages. Do not assume a library lacks a capability without checking its documentation
  and types.
- Make architectural decisions for the long term. Do not accept a stopgap that only works for now
  and is meant to be replaced later.

For `/spectre implement <record>`, a selected batch item, or an authorized implementation
continuation, complete this workflow for one record:

1. Require one matching active `PLANNED` row and instruction. Refuse missing, duplicate,
   terminal, or mismatched identities. A previously recorded blocker must be resolved before
   dependent source work. Recheck required accepted inputs and provider integrity.
2. Read the complete instruction, every declared input, any existing partial result, target
   source/tests, and current repository guidance. Inspect existing changes before editing.
3. Implement only the bounded objective from declared inputs. Preserve ownership and exclusions,
   and apply the compatibility rule above. If some or all source work already exists, reconcile
   it against the instruction, preserve unrelated human edits, and implement only missing work.
   Never redo correct code merely to manufacture an implementation history.
4. Run every required validation command plus relevant repository completion checks. Record actual
   outcomes against the current changes; never invent earlier runs or assume existing code passes.
5. Create exactly one matching result, or update that record's existing non-terminal partial result.
   Give every required Change ID one disposition: `IMPLEMENTED`, `PARTIAL`, `NOT-IMPLEMENTED`, or
   `SUPERSEDED`. Record actual inputs, paths changed, checks, deviations, and remaining review.
6. Move the ledger row to `REVIEW` only when the bounded objective and required checks are complete
   and the matching result exists. Write result and ledger updates as part of this item, validate
   their IDs, links, Change IDs and state, and verify the files before reporting completion.
7. On failure or interruption, preserve the existing work, record a partial result and the actual
   failed/not-run checks and blocker, and leave the row `PLANNED` with that reason and result link.
   Do not claim review-readiness or roll back unrelated work. If record writes themselves fail,
   stop and report the exact inconsistency; never continue source implementation with stale tracking.
   A required failure counts as completion only when the instruction explicitly defines it as
   expected validation evidence and its objective is otherwise complete.

### Sequential batch execution

1. Resolve the entire fixed set and order using §1 before source mutation. Verify each identity,
   instruction and state; reject duplicates, missing IDs and ineligible explicit selections.
   Check declared acceptance gates; batch order never makes a REVIEW result ACCEPTED.
2. Run the complete single-record workflow above for each item sequentially. Do not begin the next
   item until the current item's result, required validation and `REVIEW` row agree. No separate
   permission is needed between items already authorized. Independent items do not require human
   acceptance of the preceding item merely because they share a batch.
3. Stop the batch at the first blocker, failed required check, conflicting edit, or unresolved
   acceptance gate. Preserve completed items in `REVIEW`; record the current item's actual progress
   and leave unstarted items unchanged. Report the blocker and the exact remaining IDs. Never
   silently skip a failed item, widen scope, or mark the whole batch complete.
4. On an authorized continuation of this same bound batch, reconcile its IDs with the ledger and
   existing changes. Validate records already completed in `REVIEW` and do not implement them again.
   Human-decided terminal items remain immutable; verify and report them without reopening them.
   Resume eligible PLANNED work after its blockers are resolved. A new request explicitly selecting
   REVIEW work is still a revision and requires `revise`; inconsistent records block continuation.
5. Before the final report, check every selected record against its actual outcome. Report IDs in
   REVIEW, already completed/decided items, blocked work and unstarted work separately, with result
   links and validation evidence. No item may be reported implemented while its row is PLANNED or
   its result is missing. Provider captures and other excluded follow-ups stay explicitly separate.

Implementation commands:

```text
/spectre implement <record>
/spectre implement --batch typescript/0025..0029
/spectre implement --batch repository/0002, repository/0003, typescript/0025
/spectre implement the plans just listed one by one
```
