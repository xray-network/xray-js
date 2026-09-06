<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 9e42795ea1d0d6e6ebc8ba96e654b083a21f87ad917b082a9ae77f8cf50c18e8

### Decision workflow

`accept <record>: <proof>` and `reject <record>: <proof>` require one active REVIEW row,
instruction, and result. `cancel <record>: <reason>` requires one active PLANNED row and instruction
(with an optional result). The current human must explicitly invoke the decision and supply its
proof/reason; never infer approval from tests, merges, or discussion. Resolve and bind the selector,
read the selected row and records, and recheck their matching identity and state immediately before
writing. Change only that row's State and Decision proof to ACCEPTED, REJECTED, or CANCELLED.
Preserve links, other cells, every record file, product source, evidence, and unrelated rows. Verify
the diff is limited to the authorized decision and report the canonical ID, state, and human proof.
If a required detail is missing, pause for it; terminal or archived records cannot be decided again.
