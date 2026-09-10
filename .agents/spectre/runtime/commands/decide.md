<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 8e4bbe2866065d021bd27c61965a99d5566e2dc33148a5d239470c6e04e5ef11

### Decision workflow

`accept <records>: <proof>` and `reject <records>: <proof>` require one or a bounded set of active
REVIEW rows, each with a matching instruction and result. `cancel <records>: <reason>` requires one
or a bounded set of active PLANNED rows, each with an instruction and optional result. The current
human must explicitly invoke exactly one decision operation and supply one proof/reason that applies
to the complete set; never infer approval from tests, merges, discussion, or a compound queue.

Resolve, freeze, and report the complete set under the decision batch selectors before mutation.
Read every selected row and record, then recheck all identities, states, eligibility, and proof
immediately before writing. If any selected record is missing, ambiguous, duplicated, archived,
terminal, corrupt, or ineligible, change none. Never filter the set or apply a decision partially.

After successful preflight, change only each selected row's State and Decision proof to the one
authorized value: ACCEPTED, REJECTED, or CANCELLED. Apply all selected changes in one root
`SPECTRE.md` ledger edit, preserving links, other cells, every record file, product source, evidence,
and unrelated rows. Validate the complete selected set and verify that the diff is limited to those
decision cells. If writing or validation fails, restore the prior ledger only when concurrency guards
confirm it is still this invocation's version; otherwise stop and report the exact inconsistency.
Report every canonical ID, final state, and shared human proof/reason. If a required detail is
missing, pause before mutation. Decision commands are standalone and never resume or enter a queue.
