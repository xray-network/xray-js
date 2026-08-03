# Repository implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: repository/0001
Created: 20260803T095459Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| `.xray/updates/XRAY-UPDATES.md` | `LOCAL` | Yes | Canonical XRAY Updates v1 installation and validation requirements. |
| `package.json` | `LOCAL` | Yes | Establish npm workspace boundaries, monorepo storage, and repository-native checks. |
| `README.md` | `LOCAL` | Yes | Confirm repository identity and documented workspace ownership. |
| `Human request to install XRAY Updates v1` | `LOCAL` | Yes | Authorize installation and provide the bootstrap acceptance decision. |

## Objective

Install XRAY Updates.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| `C01` | Install the canonical XRAY Updates v1 tracking structure in nested monorepo mode, including aggregate sections for established workspace targets and only the reserved `repository` implementation directory. | Preserve all product source and avoid pre-creating product target directories. | `.xray/updates/` | Validate every applicable §13 structural invariant and repository-relative link. |
| `C02` | Add the required XRAY standards pointer to root `AGENTS.md`. | Preserve all existing agent instructions and add no unrelated guidance. | `AGENTS.md` | Compare the section and bullets with §2. |
| `C03` | Record this validated installation as the sole accepted bootstrap implementation. | Use `repository/0001`, `LOCAL` evidence, and the exact required decision proof. | `.xray/updates/XRAY-UPDATES-STATUS.md` and `.xray/updates/implementations/repository/` | Reconcile the instruction, result, ledger row, IDs, modes, links, state, and decision proof. |

## Implementation steps

1. Preserve the canonical standard at `.xray/updates/XRAY-UPDATES.md`.
2. Create the README, three canonical templates, aggregate ledger, empty providers area, and nested implementation area.
3. Add the required XRAY pointer to root `AGENTS.md`.
4. Validate the structure and repository-native checks without changing product source.
5. Write the matching result and accepted bootstrap ledger row.

## Validation

- Validate all applicable invariants from §13, including relative links, target and ID formats, unique records, matching metadata, canonical template locations, nested-only storage, and absence of target-local status files.
- Confirm the canonical document identifies `Standard-ID: xray/updates` and `Standard-Version: 1.0.0`.
- Run `npm run check` as the repository-native completion check.
- Inspect `git diff --name-only` and confirm no product source path changed.

## Compatibility and human review

This installation adds repository governance records only. The human request to install XRAY Updates is the explicit acceptance decision for this bootstrap exception.

## Completion criteria

- All required tracking files and aggregate sections for `cardano-sdk`, `mini-app`, `repository`, and `runtime` exist; only the reserved bootstrap implementation directory is created.
- All applicable §13 invariants pass.
- The repository-native completion check passes.
- No product source is modified.
- The ledger contains exactly one `ACCEPTED` bootstrap row with the required decision proof.

## Out of scope

- Product source, tests, manifests, dependencies, build configuration, and documentation changes.
- Provider evidence capture.
- Product target directory creation.
- Any implementation plan beyond the bootstrap installation record.

## Blockers

None.
