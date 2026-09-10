# XRAY JS implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: repository/0001
Created: 20260906T201907Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request to replace XRAY Updates with SPECTRE, accept completed review work, archive terminal history, and preserve planned work. | `LOCAL` | Yes | Authorize installation, migration, review acceptance, archival, and the bootstrap acceptance exception. |
| [Pinned SPECTRE protocol](../../SPECTRE-PROTOCOL.md) | `LOCAL` | Yes | Define installation, runtime extraction, canonical content, lifecycle storage, and validation. |
| [Repository README](../../../../README.md) | `LOCAL` | Yes | Establish repository identity and structure. |

## Objective

Install SPECTRE 1.0.0 and validate its tracking structure for XRAY JS.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Install the pinned protocol, generated runtime, canonical templates, README, command router, and repository pointer. | Preserve product behavior and unrelated repository instructions. | `.agents/spectre/`, `.agents/skills/spectre/`, `AGENTS.md` | Verify canonical bytes, runtime headers, file inventory, and invocation boundaries. |
| C02 | Migrate the XRAY Updates ledger, providers, and records into SPECTRE storage. | Preserve record identity, evidence, and existing terminal decisions; retain the one planned record as active. | `SPECTRE.md`, `.agents/spectre/implementations/`, `.agents/spectre/providers/` | Reconcile every row and record before and after migration. |
| C03 | Apply the human acceptance decision to REVIEW records and archive every terminal record. | Do not archive or implement PLANNED work. | `.agents/spectre/archive/` | Verify archive rows, record hashes, active counts, and unique IDs. |

## Implementation steps

1. Install and verify the SPECTRE 1.0.0 tracking runtime.
2. Reconcile the complete XRAY Updates ledger and preserve its migration metadata.
3. Keep PLANNED work active, record the human acceptance of REVIEW work, and archive terminal records.
4. Validate the installed structure, hashes, links, and remaining active ledger.

## Validation

- Verify protocol SHA-256 and all 13 generated runtime modules.
- Verify the three canonical templates and command router against the reference installation.
- Reconcile every legacy ledger row with exactly one instruction and each required result.
- Verify archived record hashes and ensure PLANNED records remain active.
- Run `git diff --check`.

## Compatibility and human review

This setup replaces XRAY Updates with SPECTRE while retaining historical record identities. The current human explicitly accepts completed REVIEW records for archival and explicitly excludes PLANNED work from archival.

## Completion criteria

SPECTRE 1.0.0 is installed, terminal history is archived, planned work remains active, providers remain available, the old active XRAY installation is removed, and validation passes.

## Out of scope

Product implementation, executing the retained plan, provider capture, deployment, dependency changes, and any lifecycle decision not explicitly authorized by the current human.

## Blockers

None.
