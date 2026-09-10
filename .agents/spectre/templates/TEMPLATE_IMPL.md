# Implementation instruction and result workflow

Implementation-Workflow-Version: v1

Sequences are four digits and begin at `0001`. Flat mode has one repository-wide sequence;
monorepo mode has one independent sequence per target. Both modes allocate IDs above the highest
active or archived ID in their sequence. Archiving never resets numbering.

In flat mode, `<target>` in headings and `Implementation-ID` is the repository slug, but instruction
and result files remain directly under `implementations/`. In monorepo mode, `<target>` is the
target-directory slug.

Installation is the only workflow that may create an instruction and result in one operation and
enter `ACCEPTED` immediately. It uses implementation `0001` in flat mode or `repository/0001` in monorepo
mode, and the human installation request is its decision proof.

## Instruction

```markdown
# <Target> implementation <NNNN> instruction

Implementation-Version: v1
Implementation-ID: <target>/<NNNN>
Created: YYYYMMDDTHHMMSSZ
Evidence-Mode: <DIRECT|DERIVED|HYBRID|LOCAL>
Depends-On: <accepted result links or NONE>
Provider-Evidence: <provider pin IDs from the input table or NONE>

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| `<path>` | `LOCAL` | Yes | Exact purpose. |

## Provider pins

NONE, or one row per PROVIDER input using the complete pin format from references.md:

| Pin ID | Evidence repository | Provider/capture ID | SNAPSHOT.md path and SHA-256 | Selected logical artifact paths and SHA-256 |
| --- | --- | --- | --- | --- |

## Objective

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |

## Implementation steps

## Validation

## Compatibility and human review

## Completion criteria

## Out of scope

## Blockers

None.
```

Input kinds are `PROVIDER`, `IMPLEMENTATION_RESULT`, and `LOCAL`. A `PLANNED` instruction must be
implementation-ready; unresolved source selection, semantic mapping, ownership, compatibility,
or validation design is a blocker. PROVIDER input rows reference their pin IDs. A latest-capture
alias cannot replace a snapshot/hash pin; record the owning repository separately from upstream sources.

## Result

Create or update the result as part of implementation and validation. Interrupted or failed work
uses the same result schema with honest partial dispositions, failed/not-run checks, and blockers;
its ledger stays `PLANNED`. Do not create an empty result during planning.

```markdown
# <Target> implementation <NNNN> result

Result-Version: v1
Implementation-ID: <target>/<NNNN>
Instruction: ./<NNNN>-IMPL-INSTR.md
Evidence-Mode: <DIRECT|DERIVED|HYBRID|LOCAL>

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |

## Outcome

## Inputs consumed

## Project changes

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |

## Validation

## Deviations from instruction

## Remaining human review

## Reproducibility
```

Every required instruction change has exactly one result disposition. The exported contract must
be language- and implementation-neutral enough for another target to evaluate without reading
provider artifacts. The result names every input actually consumed and every deviation. Provider inputs and
Reproducibility include the actual repository, capture ID, snapshot hash, logical-to-physical
artifact paths and verified hashes, matching the instruction pins. Existing
source changes must be attributed as existing work when reconciling; do not invent provenance.
Implementation completion requires this result and the matching REVIEW ledger update together,
including for every item in a sequential batch.
