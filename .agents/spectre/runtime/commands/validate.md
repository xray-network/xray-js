<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 9e42795ea1d0d6e6ebc8ba96e654b083a21f87ad917b082a9ae77f8cf50c18e8

## 13. Validation invariants

An installation or update is valid only when all applicable checks pass. An unqualified `validate`
and every installation/archive validation check the complete installation, including every runtime
file, template, active record, and archive. Full validation re-extracts runtime from the complete
protocol and compares bytes. A record-scoped validation checks its identity, schema, state, links,
and transitive declared inputs, including relevant archive manifests and provider inventories;
it does not claim that unrelated records or runtime files were fully validated. Required workflow
checks use the affected scope unless that workflow explicitly requires full validation. This scope
limits reads, never the applicable checks. Read the status/implementation templates for record
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
- Provider inputs resolve to complete snapshots whose inventory and hashes verify.
- The three canonical templates exist only under `.agents/spectre/templates/`.
- Exactly one installed command skill exists at `.agents/skills/spectre/SKILL.md`, declares
  `name: spectre`, and routes operations through this installed protocol only on explicit human invocation.
- The installed skill accepts §1 natural-language selectors within explicit commands, resolves
  them to canonical identities, and pauses for ambiguous targets or missing human decision proof.
- The installed skill and `AGENTS.md` pointer leave SPECTRE inactive for ordinary requests and
  quoted commands; neither prompts for an operation or enables tracking automatically.
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
- No provider snapshot contains a status, instruction, result, executable tooling, symlink, or
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
  implementation identity and state. Archiving has not modified provider snapshots or source.
- Archived rows do not remain in the active ledger, and `PLANNED` or `REVIEW` records never appear
  in archives. Root ledger metadata and all target table headers remain present when tables empty.
- Installation does not modify product source.

Validation should use repository-native tools when available. Machine validation is helpful but
does not replace human acceptance.
