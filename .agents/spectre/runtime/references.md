<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 8e4bbe2866065d021bd27c61965a99d5566e2dc33148a5d239470c6e04e5ef11

The two implementation forms in the tree are alternatives and must not be mixed:

- A single-project repository uses the flat form: `implementations/NNNN-IMPL-INSTR.md` and
  `implementations/NNNN-IMPL-RESULT.md`. It has one repository-wide sequence.
- A monorepo uses the nested form: `implementations/<target>/NNNN-IMPL-INSTR.md` and
  `implementations/<target>/NNNN-IMPL-RESULT.md`. Its required bootstrap record uses the reserved
  `repository` target; other sequences are independent per target.

An implementation **target** is the smallest stable monorepo project area with its own source
ownership and meaningful completion validation. Examples include `api`, `web`, `mobile`,
`typescript`, or `payments`. Implementation sequences use four digits beginning at `0001`.
Each provider has an independent four-digit capture sequence. These numbers identify immutable
evidence captures, not versions of the provider or upstream protocol.

Root `SPECTRE.md` is the sole active lifecycle ledger and the project-facing implementation
summary. It aggregates one status section for the repository in flat mode or one section per
target in monorepo mode. Each archived implementation has its sole historical decision row in
one `archive/<archive-id>/ARCHIVE.md`; it has no row in the active ledger. Archive manifests are
immutable history, not additional active ledgers. Target directories contain instructions and
results, not status ledgers. Provider captures have no lifecycle ledger and never contain
implementation instructions or results.

Archive directories are created only by a nonempty `/spectre archive` operation. Each batch
preserves the installation's flat or nested layout under its `implementations/` directory.
IDs remain unique across active records and every archive within their original sequence.

### Pinned provider evidence

A provider pin contains a stable pin ID; the evidence-owning repository identity (`SELF` for this
repository, otherwise an explicit identity and local locator); the provider and capture ID; the
repository-relative SNAPSHOT.md path and its SHA-256; and selected logical artifact paths and
SHA-256 values, inline or in a pinned manifest. PROVIDER input rows and Provider-Evidence name
these pin IDs. Upstream Source-Commit is provenance, not the capture's local identity.

Resolve the pinned SNAPSHOT.md, verify its hash and complete specification, then resolve every
entry in its full logical inventory directly to the declared physical file in this or an earlier
same-provider capture. Verify membership, sizes, hashes, source mapping and counts before consuming
the selected subset. The snapshot contains the complete resolved inventory, not just additions or
patch instructions. No replay of earlier deltas, Git checkout or upstream fetch is needed to obtain
the effective evidence. Verify referenced earlier snapshot hashes and their ownership of reused
files; validate the predecessor chain as an acyclic, strictly decreasing sequence.

Reject missing files, unsafe paths, duplicate logical entries, forward/cross-provider references,
cycles, altered descriptors or hash mismatches. Never substitute the provider's latest capture,
an upstream ref or a similarly named file. A missing retained artifact is a blocker, not authority
to recapture it or silently read Git history. CAPTURE.md is advisory; it cannot override SNAPSHOT.md.

Plans select an explicit completed immutable capture and record its pin. Capture publication and
integrity validation are required; a separate Git commit is not a protocol prerequisite. Version
control remains recommended repository practice and commands never auto commit. Keep all referenced
numbered directories and artifacts available to active and archived consumers. Numbered evidence
and hashes provide stable inputs without requiring a Git-only history store. New provider updates
never overwrite those files. Legacy references retain the explicit §14 handling rules.

### Resolving archived records and references

All SPECTRE operations resolve record IDs and references across the active ledger and every
archive manifest. One implementation ID has exactly one authoritative row and one physical
instruction (and at most one result), either active or archived. Archive dates never change
implementation identity, target ownership, state, or dependency acceptance.

Record contents remain byte-for-byte unchanged, including embedded relative paths. To follow a
repository-relative reference from a record:

1. Use the containing file's original repository location as the base. For an archived record,
   obtain that location from its Record paths entry; for an active record, use its current path.
   Explicit repository-root-relative references keep the repository root as their base.
2. Normalize the referenced path within the repository, retaining any fragment. If it names an
   Original path in an archive manifest, resolve it to that row's Archived file. Otherwise use
   the repository file at that path. Direct links already naming an archived file remain valid.
3. Require a unique existing destination. Reject conflicting active and archived copies, duplicate
   mappings, missing destinations, or escaping paths. For an archived destination, verify its
   digest and the matching decision row before using it as evidence. Never follow a mapping chain.

Apply this to `Depends-On`, input tables, `Instruction`, result references, and provider links;
provider files themselves stay in place. An archived file's raw relative link may require this
original-location resolution rather than ordinary Markdown navigation. The manifest's record
links must work directly, and `status` must return usable links to the resolved files. Do not
rewrite immutable records merely to make their embedded links relative to the archive directory.

### Explicit development-layout adoption

While 1.0.0 is in development, a human may explicitly request refreshing the installed protocol,
runtime and templates in place. Source edits never update installed files automatically. Inventory
existing provider layouts and all active/archived input references before changing evidence storage.

Existing full numbered snapshots, including NNNN-<provider> directories and their original schemas,
remain immutable at their original paths. Validate them against their original resolved rules,
including retained contract files when needed. They may be the immediate predecessor and direct
artifact owners for a new incremental capture. Count their numeric IDs in the same provider-local
sequence, and create only the next unused higher NNNN directory. Legacy absence of CAPTURE.md is
permitted: link its existing snapshot summary location without creating invented historical data.
New snapshots carry the complete current rules/inventory even when reusing legacy artifact bytes.
If required legacy rules or inventory cannot be resolved, report a blocker instead of guessing.

A root-level rolling CAPTURE.md/artifacts layout requires explicit human-authorized adoption.
Freeze its validated state into the next numbered baseline with separate specification and summary,
recording original paths/hashes and the adoption provenance. Do not claim this was a fresh upstream
check. Moving/copying that baseline is permitted only within the authorized migration scope and
when existing references remain resolvable. Old path-only inputs require retaining their original
files; Git-pinned inputs still require their exact committed history and hash verification. Neither
can be silently redirected to the new baseline. Do not rewrite terminal records or archive manifests.

Preserve referenced provider contracts and old duplicated files when removal would break a consumer.
Do not rewrite old numbered snapshots into deltas merely to save space. New captures enforce reuse;
automatic cleanup or history rewriting is not authorized. Any separately requested cleanup must
prove every reference remains valid before removing a file, including transitive artifact owners.
