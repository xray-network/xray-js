<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 8e4bbe2866065d021bd27c61965a99d5566e2dc33148a5d239470c6e04e5ef11

`list` output includes target, implementation ID, title, state, evidence mode, whether a result
is recorded, and location (`ACTIVE` or an archive ID). Default listing reads rows only from root `SPECTRE.md`
and includes terminal records that have not been archived. `--archived` reads only the archive
manifests and lists archived records, sorted by target and numeric implementation ID. An absent
archive directory means no archived records. Target and state filters apply equally to either
set; `PLANNED` or `REVIEW` with `--archived` returns no records. Accept the flag once in the final
position; reject unknown or repeated flags without mutation. A multiword target selector is one
argument; parse an optional final state token before resolving it, as specified below.

Syntax: `/spectre list [target] [state] [--archived]`. Without a target, no selector module is needed:
recognize the optional state token and final flag, and list the selected ledger set without mutation.

`list` resolves target descriptions from repository metadata and ledger headings, without inspecting
record contents or provider evidence. It does not create records, modify source, or
change lifecycle state. `help` and `status` likewise authorize no tracked-file or lifecycle changes.
Required validation is performed within the selected workflow, not through another public command.
