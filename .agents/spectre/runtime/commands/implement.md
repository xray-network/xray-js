<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 9e42795ea1d0d6e6ebc8ba96e654b083a21f87ad917b082a9ae77f8cf50c18e8

## 6. Evidence modes and inputs

Every instruction declares exactly one evidence mode:

| Mode | Normative inputs |
| --- | --- |
| `DIRECT` | One or more immutable provider snapshots or artifacts. |
| `DERIVED` | One or more `ACCEPTED` implementation results. |
| `HYBRID` | Provider evidence and `ACCEPTED` implementation results. |
| `LOCAL` | Repository requirements and owned source only. |

Every normative input must be an explicit row in the instruction's input table. Input kinds are
`PROVIDER`, `IMPLEMENTATION_RESULT`, and `LOCAL`.

- A derived input is valid only while its active or archived decision row is `ACCEPTED` and the
  linked result matches the implementation ID. Resolve relocated inputs through the §9 archive
  path map; archiving does not revoke acceptance or require rewriting the consuming instruction.
- A provider input names an immutable snapshot and, when practical, exact artifact paths.
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

For an explicit `/spectre implement <record>` invocation (or its host-native equivalent):

1. Require exactly one matching `PLANNED` row and instruction. Refuse missing, duplicate,
   terminal, blocked, or mismatched records.
2. Read the complete instruction, every declared input, target source/tests, and current
   repository guidance.
3. Implement only the bounded objective from declared inputs. Preserve ownership and exclusions,
   and apply the compatibility rule above.
4. Run every required validation command plus relevant repository completion checks. Never claim
   a command ran if it did not.
5. Create exactly one matching result. Give every required Change ID one disposition:
   `IMPLEMENTED`, `PARTIAL`, `NOT-IMPLEMENTED`, or `SUPERSEDED`.
6. Record actual inputs, paths changed, validation commands and outcomes, deviations, and
   remaining review.
7. Move the ledger row to `REVIEW` only when a result exists and validation is honestly recorded.
   A failed required check normally remains a documented blocker and must not be presented as
   review-ready unless the instruction explicitly defines that failure as expected evidence.

Implementation command:

```text
/spectre implement <record>
```
