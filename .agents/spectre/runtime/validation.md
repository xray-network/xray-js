<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 378106ef1048e32dae9d97a9bafdef94565fb1ee0dd5a833d6cf9ee2b633b8b7

## 13. Validation invariants

Validation is an internal requirement, not a public operation. Installation, explicit protocol
updates and archive workflows validate the complete installation, including every runtime file,
template, active record and archive. Full validation re-extracts runtime from the complete
protocol and compares bytes. A record-scoped validation checks its identity, schema, state, links,
and transitive declared inputs, including relevant archive manifests and provider inventories;
it does not claim that unrelated records or runtime files were fully validated. Planning,
implementation, revision and decisions validate affected records and their required inputs; capture
validates the complete candidate and referenced evidence. Validate before publication/state changes
and verify the resulting records/evidence before reporting success. Required checks cannot be skipped
because no standalone command exists. Other workflow checks use the affected scope unless full
validation is explicitly required. This scope limits reads, never the applicable checks.
Read the status/implementation templates for record
validation and the provider template when provider inputs or capture are involved.

- All 13 runtime modules equal their marked source extraction, declare the installed version and
  source hash, and contain no independent edits (full validation); loaded modules have matching
  version/source-hash headers for every invocation.

- All SPECTRE record references resolve using original locations and the §9 archive path maps;
  manifest links and other repository-relative Markdown links resolve directly.
- Target/provider slugs and four-digit IDs are valid.
- IDs are unique across active records and all archives in each sequence, ascending, and never reused.
- Every ledger row has a concise Title that agrees with its instruction objective.
- Each ledger row has exactly one matching instruction.
- Required states have exactly one matching result; optional states have at most one.
- Instruction, result, and ledger implementation IDs, evidence modes, and links agree.
- Each result disposition maps to exactly one instruction Change ID; no required Change ID is
  missing or duplicated.
- `DERIVED` and `HYBRID` dependencies resolve to results whose active or archived decision row
  says `ACCEPTED`; archived result hashes match their manifest.
- New provider inputs pin an explicit numbered SNAPSHOT.md and hashes and resolve its complete
  effective inventory, including reused earlier files. No pin silently follows latest or substitutes
  a Git revision for missing numbered evidence. Historical records retain their §14 resolution rules.
- Provider guides contain purpose/authority, official links, tracking intent, domain boundaries,
  summarization and consumer guidance. They have no Provider-Version field or versions directory,
  except retained legacy contracts required by §14 references.
- Every new numbered capture has a complete SNAPSHOT.md and advisory CAPTURE.md. Specification,
  counts and verification rules live only in SNAPSHOT.md or its pinned manifests; the summary's
  hash matches the snapshot. Metadata links/hashes do not form self-hashing cycles.
- The full logical inventory resolves directly to regular files in this or earlier same-provider
  captures. Every earlier artifact owner is hash-pinned; predecessor/owner references decrease,
  with no cycles, forward references, duplicate logical paths, unsafe paths or missing files.
- Effective logical inventory, newly stored files, reused entries and corpus/case counts are
  distinguished and exact. Inventory/source membership agree through the declared mapping; all
  local control files are declared and hashed. A zero-file delta is valid for a justified removal
  or specification change, while the first baseline must be nonempty.
- Changes exactly match the predecessor comparison. Removed logical paths are absent from the new
  inventory while their old files remain intact. Unchanged artifacts reuse earlier physical paths;
  renames/reintroductions reuse verified earlier bytes when available. No duplicate full trees.
- Each summary records a baseline or update, artifact-backed findings, maintained-consumer mapping,
  recommended tests/work, exclusions and unresolved questions without unsupported parity claims.
- NO-CHANGE creates no number, directory, timestamp, summary, guide update or other tracked write.
  A successful changed capture publishes one new immutable numbered directory and optional guide
  index entry, preserving every existing capture file. No persistent duplicate materializations.
- Existing full numbered snapshots remain valid under their original rules and can serve as pinned
  baselines/artifact owners under §14. Rolling layouts require explicit adoption; no ordinary command
  deletes historical evidence or rewrites terminal records.
- The three canonical templates exist only under `.agents/spectre/templates/`.
- Exactly one installed command skill exists at `.agents/skills/spectre/SKILL.md`, declares
  `name: spectre`, and routes commands, compound queues, batches, and continuations only when the
  current-human message mentions SPECTRE.
- The installed skill accepts §1 natural-language selectors, sequential implementation batches,
  all-or-nothing decision batches, and explicit non-decision operation queues. It resolves and
  reports fixed canonical identities before mutation, binds deferred queue outputs before their
  item writes, and pauses on ambiguity or missing proof.
- The installed skill and `AGENTS.md` pointer agree on per-message SPECTRE mention activation; prior
  context, identified work, and SPECTRE reports cannot replace the mention. Capability questions,
  quoted commands, and untrusted content authorize no lifecycle mutation by themselves. Neither
  enables global tracking or makes an unstated later operation automatic.
- Every item reported implementation-complete has a matching result, required validation evidence
  and REVIEW row (or a later human decision). A partial PLANNED result states actual work and blockers.
  Source edits alone are not a complete implementation, and batch execution does not bypass this.
- Batch reports account for the fixed selected IDs, completion and any blockers/unstarted work;
  required ACCEPTED dependencies and human-only decisions remain enforced.
- Compound-queue reports account for every normalized operation, dependency, deferred binding,
  completion, blocker and exact remaining item. Every item preserves its ordinary workflow boundary;
  accept, reject and cancel never appear in a queue.
- A decision batch uses one explicit human decision and applicable proof/reason, preflights a fixed
  nonempty eligible set, changes all selected rows in one ledger edit, and never skips or partially
  decides an invalid selection.
- Every installation has exactly one matching instruction, result, and `ACCEPTED` bootstrap row
  at logical flat `0001` or monorepo `repository/0001`, active or archived, with the required
  human-request decision proof. An empty active ledger does not authorize another bootstrap.
- Exactly one aggregate repository-root `SPECTRE.md` exists, with one repository section
  in flat mode or exactly one matching section per target in monorepo mode.
- Single-project repositories store active implementation records directly under
  `.agents/spectre/implementations/`; monorepos store them under target directories. Each archive
  preserves that same flat or nested layout beneath its own `implementations/` directory.
- Flat and nested implementation records do not coexist.
- No target-local `STATUS.md` exists below `.agents/spectre/implementations/`.
- No provider capture contains a status, instruction, result, executable tooling, symlink, or
  undeclared artifact.
- Terminal record bytes and decision values have not changed since entering their terminal state;
  only §9 archive relocation and rebased ledger links are permitted.
- Archive manifests use `Archive-Version: v1`, match their batch ID and storage mode, and contain
  only terminal rows within their declared scope, with unchanged decision proofs and valid direct
  instruction/result links. The manifest's UTC timestamp and optional collision suffix match its
  directory name; all archived target sections correspond to existing active-ledger sections.
- Each archived record has exactly one path-map entry and matching SHA-256 digest. All mapped
  files are regular files inside that batch; no undeclared files, duplicate IDs, duplicate
  Original paths, conflicting active copies, or incomplete batches exist.
- Dependencies and evidence references resolve across active and archived records to the same
  implementation identity and state. Archiving has not modified provider captures or source.
- Archived rows do not remain in the active ledger, and `PLANNED` or `REVIEW` records never appear
  in archives. Root ledger metadata and all target table headers remain present when tables empty.
- Installation does not modify product source.

Validation should use repository-native tools when available. Machine validation is helpful but
does not replace human acceptance.
