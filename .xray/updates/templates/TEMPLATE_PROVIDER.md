# Provider contract and snapshot workflow

Provider-Workflow-Version: v1

Provider evidence is shared, immutable, and optional. Every snapshot contains only `SNAPSHOT.md`
and a nonempty `artifacts/` directory.

## Provider contract

```markdown
# <Provider> provider

Provider: <provider>
Provider-Version: v1

## Purpose

## Source

| Field | Value |
| --- | --- |
| Repository or URL | `<source-location>` |
| Followed ref | `<ref or NONE>` |
| Revision policy | `<immutable commit, tag, or content-hash rule>` |
| Source mode | `<LIVE|FROZEN>` |
| Submodules | `<policy>` |
| License | `<license>` |

## Artifact selection

| Upstream selection | Snapshot artifact |
| --- | --- |
| `<source path>` | `artifacts/<destination>` |

## Evidence-only sources

## Consumption and planning requirements

## Excluded source material
```

The contract defines an immutable source identity, exact regular-file selection and destinations,
required licenses, transformations, exclusions, and consumer constraints. Changing those
semantics requires incrementing `Provider-Version`.

## Snapshot

```markdown
# <Provider> provider snapshot

Provider-Snapshot-Version: v1
Snapshot: <NNNN>-<provider>
Provider: <provider>
Created: YYYYMMDDTHHMMSSZ
Previous-Snapshot: <relative link or NONE>
Provider-Version: <version>
Source-Type: <git|url>
Source-Repository: <URL or NONE>
Source-Commit: <full commit or NONE>
Source-Ref: <ref or NONE>
Source-Tag: <tag or NONE>
Source-URL: <exact URL or NONE>
Source-SHA256: <sha256 or NONE>

## Evidence objective

## Comparison sources

## Captured scope

## Integrity and licensing

## Semantic evidence

## Exclusions
```

Use Git fields for Git sources and URL/SHA256 fields for URL sources; keep inapplicable fields as
`NONE`. The snapshot records an exact nonempty artifact inventory and SHA-256 verification.
Published snapshots are immutable.
