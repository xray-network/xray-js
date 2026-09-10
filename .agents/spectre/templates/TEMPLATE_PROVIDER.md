# Provider information and numbered incremental captures

Provider-Workflow-Version: v1

A provider is not versioned. PROVIDER.md explains its purpose, authority and sources. Each numbered
capture directory contains a frozen SNAPSHOT.md specification, an advisory CAPTURE.md summary, and
only the artifact files newly stored by that capture. The first baseline stores all selected
artifacts. Later captures reuse earlier immutable files through explicit inventory references.
Provider-Snapshot-Version and Provider-Capture-Version identify document schemas, not providers.

## Provider guide

```markdown
# <Provider> provider

Provider: <provider>

## Purpose and authority

Describe the protocol, standard or implementation and what it supplies. Link official sources.

## Sources and tracking

| Source | Official repository or documentation | Followed ref/policy | License guidance |
| --- | --- | --- | --- |
| Primary | `<official source links>` | `<live policy or explicit freeze reason>` | `<license guidance>` |

## Evidence domains and boundaries

## Summarization requirements

## Maintained consumer guidance

## Captures

No captures yet. After publication, add a numbered SNAPSHOT.md link and CAPTURE.md summary link.
```

The guide owns purpose, official links, tracking policy, domains, exclusions, summarization and
maintained-consumer guidance. Follow live upstream unless a human explicitly freezes a source
with a reason. Exact source identities, selections, formats, counts and verification rules belong
to each SNAPSHOT.md, never to the guide or summary. Later guide edits cannot reinterpret history.

## Snapshot specification

```markdown
# <Provider> snapshot <NNNN>

Provider-Snapshot-Version: v1
Provider: <provider>
Snapshot: <NNNN>
Created: YYYYMMDDTHHMMSSZ
Previous-Snapshot: <provider-root-relative SNAPSHOT.md path and SHA-256 or NONE>
Capture-Summary: CAPTURE.md
Capture-Summary-SHA256: <sha256>
Source-Type: <git|url>
Source-Repository: <URL or NONE>
Source-Commit: <full upstream commit or NONE>
Source-Ref: <ref or NONE>
Source-Tag: <tag or NONE>
Source-URL: <exact URL or NONE>
Source-SHA256: <sha256 or NONE>

## Evidence objective

## Comparison sources

## Complete capture specification

### Source selection and mapping

| Source identity | Exact path, bounded tree or deterministic selector | Logical artifact path or transform |
| --- | --- | --- |
| `<immutable upstream source>` | `<resolved selection rule>` | `<logical path>` |

### Completeness and format rules

Define independent source enumeration, file types, binary fidelity, transformations, schemas,
resource limits, case discovery and result/budget associations.

### Complete resolved artifact inventory

| Logical path | Physical path from provider root | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `<logical path>` | `<NNNN>/artifacts/<path>` | `<size>` | `<sha256>` |

### Referenced snapshots

| Earlier snapshot path from provider root | SHA-256 | Role |
| --- | --- | --- |
| `<NNNN>/SNAPSHOT.md` | `<sha256>` | `<predecessor or artifact owner>` |

### Inventories and counts

| Property | Exact value or pinned manifest reference |
| --- | --- |
| Source inventory | `<complete selected membership and counts>` |
| Effective artifacts | `<full logical inventory count>` |
| Newly stored files | `<physical files in this capture, count, sizes and hashes>` |
| Reused artifacts | `<logical entries resolved to earlier files, count>` |
| Corpus entries and executable cases | `<separate counts/rules or NOT-APPLICABLE>` |

### Changes from predecessor

| Logical path | Change | Previous physical path and hash | Current physical path and hash |
| --- | --- | --- | --- |
| `<path>` | `<added/changed/removed/unchanged>` | `<reference or NONE>` | `<reference or NONE>` |

### Integrity and licensing rules

### Consumption boundaries and exclusions

## Validation evidence

## Unresolved specification questions
```

Keep inapplicable source fields as NONE. Identify every comparison source by full commit/content
hash, selection, role and license. A branch or tag alone is not immutable provenance. Freeze the
complete specification before publishing. Capture rules and summaries are not executable tooling.

The logical inventory describes the entire effective snapshot, including unchanged files; it is
not merely a delta list. Physical references are explicit regular-file paths from the provider
root, either inside this capture's artifacts/ or inside an earlier same-provider capture's
artifacts/. Resolve them directly, never via latest aliases, symlinks, hardlinks or patch replay.
Every reused file must be owned by a hash-pinned earlier snapshot and match its size/hash. Earlier
snapshots may be legacy numbered directories under §14. Predecessor references strictly decrease;
artifact owners never point forward. Do not consult today's guide to interpret a past specification.

Source and artifact inventories must agree through the declared mapping, using independently
complete source enumeration. File-download counts alone do not establish completeness. Reject
truncated lists, unsafe paths, duplicate logical paths, case collisions, symlinks, gitlinks and
special files. Retain original binary bytes, formats, associations, transformations and licenses.
Do not weaken the specification to hide missing files, unsupported cases or failed checks.

Inventories may live in pinned manifest artifacts rather than inline tables. All physical files,
including control manifests, are counted and hashed in SNAPSHOT.md or its acyclic integrity graph;
never require a manifest to hash itself. Distinguish effective logical artifacts, newly stored
physical files, reused entries, corpus entries and executable cases. SNAPSHOT.md and CAPTURE.md
are metadata and excluded from artifact counts. A stored control manifest must have declared
membership even when kept outside the semantic evidence inventory. No undeclared files are allowed.

The first snapshot has Previous-Snapshot: NONE and a nonempty full baseline. Later snapshots pin
the immediately previous published capture and include the complete current rules/inventory plus
an exact comparison. Removed logical paths disappear from the new effective inventory and are
listed as removals; their old files remain untouched. An unchanged logical artifact must reference
its earlier physical file, not a copied file. Changed/new bytes are stored locally. When a rename
or reintroduction can reuse identical earlier bytes, reference those bytes while recording the new
logical mapping and provenance. Byte equality alone never merges distinct semantic source identities.
No cross-provider content store or byte-level deduplication is required. A changed packed corpus
may be stored as a whole new file; unchanged packaged corpora must be referenced, not copied.

Only create a capture for changed selected evidence, authorized selection/transformation/rules,
licensing or meaningful provenance. An unrelated upstream advance, repeated check, timestamp, guide
edit or summary rewording is NO-CHANGE: create no directory, summary, index update or tracked write.
Report newly checked upstream identities ephemerally rather than changing old captured provenance.
A justified removal-only or specification-only update can create metadata with zero new artifact
files; record exact zero counts and omit artifacts/ when empty. Do not copy evidence to fill it.

## Capture summary

```markdown
# <Provider> capture <NNNN> summary

Provider-Capture-Version: v1
Provider: <provider>
Capture: <NNNN>
Snapshot: SNAPSHOT.md
Previous-Capture: <provider-root-relative CAPTURE.md path or NONE; legacy summary location if applicable>

## Summary

Baseline scope, or what changed since the predecessor. This is advisory, not a specification.

## Relevant changes

| Finding | Previous/current numbered artifact references | Observation and significance |
| --- | --- | --- |
| `<finding>` | `<evidence links>` | `<observation or explicitly labeled inference>` |

## Consumer impact and recommended work

| Finding | Maintained target and modules/APIs | Tests and validation | Recommendation and evidence |
| --- | --- | --- | --- |
| `<finding>` | `<actual owner or NOT-MAPPED with reason>` | `<checks>` | `<implement/investigate/no-change/out-of-scope>` |

## Exclusions and unresolved questions
```

CAPTURE.md summarizes only this baseline or update. SNAPSHOT.md owns every normative rule, exact
inventory, count, predecessor and removal declaration; summaries link it instead of maintaining a
second specification. Hash the completed summary in SNAPSHOT.md; the summary links back by path
without a reciprocal hash, avoiding a cycle. Both become immutable together with their artifacts.

Distinguish behavior from documentation, tests and refactoring, and observation from inference.
Summarize language-neutral semantics first, then map actual maintained consumers. TypeScript may
be the initial maintained target; C++ and any other unmaintained target remain opt-in. Include
justified no-change recommendations and unresolved questions. Summaries never authorize execution
or imply feature parity. New implementation plans still need their own command and input pins.
