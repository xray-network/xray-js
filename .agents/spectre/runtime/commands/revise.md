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

For an explicit `/spectre revise <record>: <changes>` invocation (or its host-native equivalent):

1. Require exactly one matching `REVIEW` row, instruction, and result. Refuse `PLANNED`, terminal,
   missing, duplicate, or mismatched records.
2. Read the requested changes, complete instruction, existing result, current target source and
   tests, and applicable repository guidance.
3. Confirm the requested changes remain within the instruction's objective, declared inputs,
   compatibility boundary, and validation design. If they materially expand scope or introduce an
   independently reviewable capability, stop without mutation and require a new `/spectre plan`.
4. Implement only the requested bounded changes. Do not create or renumber an instruction, result,
   ledger row, provider capture, fallback, compatibility layer, or revision-history
   structure.
5. Rerun every affected instruction check plus relevant completion checks. Never claim a command
   ran if it did not.
6. Update the existing result in place with the final dispositions, outcome, actual changes,
   validation, deviations, remaining review, and reproducibility. Record the human revision request
   and any superseded review outcome honestly.
7. Keep the ledger row and result link in `REVIEW`; update only its review proof when needed to
   describe the revised work awaiting human decision. Stop without accepting or rejecting it.

Revision command:

```text
/spectre revise <record>: <requested changes>
```
