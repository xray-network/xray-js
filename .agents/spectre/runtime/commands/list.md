<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 9e42795ea1d0d6e6ebc8ba96e654b083a21f87ad917b082a9ae77f8cf50c18e8

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
change lifecycle state. `help`, `status`, and `validate` likewise authorize no tracked-file or
lifecycle changes, and validation reports remain ephemeral unless a separate authorized workflow
requires them to be recorded.
