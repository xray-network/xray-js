# Implementation instruction and result workflow

Implementation-Workflow-Version: v1

Sequences are four digits and begin at `0001`. Flat mode has one repository-wide sequence;
monorepo mode has one independent sequence per target.

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
Provider-Evidence: <snapshot links or NONE>

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| `<path>` | `LOCAL` | Yes | Exact purpose. |

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
or validation design is a blocker.

## Result

Create a result only after implementation and required validation:

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
provider artifacts. The result names every input actually consumed and every deviation.
