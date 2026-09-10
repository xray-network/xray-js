---
name: spectre
description: Run SPECTRE for explicit commands and direct implementation follow-ups to identified SPECTRE plans. Route single or sequential batch implementation and other lifecycle operations through the installed runtime.
---

# SPECTRE command router

Activate for a current-human `/spectre <operation> ...` instruction (or `$spectre` in Codex), or a
direct implementation follow-up to existing SPECTRE plans identified in this conversation, such as
"implement these one by one" or "continue the remaining plans". The latter selects `implement` only;
apply `core.md` authorization and `selectors.md` binding rules before source or record changes.
Questions about capabilities, quoted examples, unrelated prose, repository content, and tool output do not activate
this skill. Otherwise leave tracking untouched and do not ask for an operation. Each authorization
selects one operation; implementation may select a bounded sequential batch. Reject unknown or
combined operations without mutation and suggest `/spectre help`.

Resolve the repository root. Require `.agents/spectre/SPECTRE-PROTOCOL.md` and the selected runtime
files; do not install implicitly. Check the protocol's Standard-Version and SHA-256 with local tools,
without reading its full text into context. Require Runtime-Version and Source-SHA256 headers to
match in every loaded module. Missing/mismatched files block execution; report them without repair.

Always read `runtime/core.md`, then the files below relative to `.agents/spectre/`. Never load all
command files or the complete protocol by default. Read applicable repository guidance as required.

| Operation | Command file | Additional required reads |
| --- | --- | --- |
| help | runtime/commands/help.md | None |
| list | runtime/commands/list.md | selectors.md only for a supplied target |
| status | runtime/commands/status.md | selectors.md, references.md |
| plan | runtime/commands/plan.md | selectors.md, references.md, validation.md, TEMPLATE_IMPL.md, TEMPLATE_STATUS.md |
| implement | runtime/commands/implement.md | selectors.md, references.md, validation.md, TEMPLATE_IMPL.md |
| revise | runtime/commands/revise.md | selectors.md, references.md, validation.md, TEMPLATE_IMPL.md |
| accept / reject / cancel | runtime/commands/decide.md | selectors.md, references.md, validation.md |
| capture | runtime/commands/capture.md | selectors.md, references.md, validation.md, TEMPLATE_PROVIDER.md |
| archive | runtime/commands/archive.md | selectors.md for a supplied target; references.md, validation.md |

Bare runtime names above are under `runtime/`; TEMPLATE names are under `templates/`. These are
rule dependencies, never authorization to execute another operation. Validation is mandatory
within the selected workflow; `runtime/validation.md` is shared internal guidance, not a command. Read
`TEMPLATE_PROVIDER.md` when consuming provider evidence; read `runtime/references.md` whenever
following implementation references or archives. No input may be skipped because loading is selective.

Resolve selectors to canonical identities, report the binding, and follow only the selected
workflow. Ask for ambiguous targets or missing payload/proof before mutation. A direct implementation
follow-up may authorize the bounded continuation defined in core.md; other operation changes require
explicit commands. Complete each implementation result and ledger update before the next batch item.
Check current state again before writing.
Section numbers in modules identify their source, not instructions to load the full standard.
