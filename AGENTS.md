## SPECTRE protocol

This repository uses the SPECTRE protocol:

- Activate SPECTRE only when the current human explicitly invokes `/spectre <operation> ...`
  or the host-native equivalent (`$spectre <operation> ...` in Codex) to execute an operation.
- On invocation, follow `.agents/skills/spectre/SKILL.md`: load the shared runtime and selected
  command modules, not the complete protocol. Do not install or repair missing runtime implicitly.
- Without invocation, follow ordinary repository instructions, leave SPECTRE records untouched,
  and do not ask the human to select a SPECTRE operation. Natural language without invocation and
  quoted commands do not activate SPECTRE; explicit commands may use natural-language selectors.
- Each new lifecycle operation requires a new explicit command; completing one never authorizes
  the next.
