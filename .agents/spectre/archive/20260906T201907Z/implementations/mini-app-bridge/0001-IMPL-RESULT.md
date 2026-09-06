# Mini App Bridge implementation 0001 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0001
Instruction: ./0001-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition   | Implementation                                                                                                                                                                 | Validation                                                                            |
| --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `C01`     | `IMPLEMENTED` | Renamed the workspace directory to `packages/mini-app-bridge` and its package identity to `@xray-network/xray-js-mini-app-bridge` without renaming its public `MiniApp*` APIs. | Focused workspace build and typecheck pass under the new package name.                |
| `C02`     | `IMPLEMENTED` | Renamed all six aggregate runtime entry modules and public subpaths from `mini-app` to `mini-app-bridge`, with no legacy aliases.                                              | Every aggregate bridge subpath imports successfully after a clean runtime rebuild.    |
| `C03`     | `IMPLEMENTED` | Updated root workspaces, runtime dependency metadata, npm workspace links, lockfile records, source comments, and README imports.                                              | Offline npm reconciliation passes and the active repository stale-name scan is empty. |
| `C04`     | `IMPLEMENTED` | Preserved the protocol, client, host, React, testing, and CIP-30 source modules as a mechanical workspace rename.                                                              | Complete repository build, test, and typecheck gate passes.                           |

## Outcome

The package is now consistently named Mini App Bridge. Direct consumers use
`@xray-network/xray-js-mini-app-bridge`, while aggregate consumers use
`@xray-network/xray-js/mini-app-bridge` and its `/protocol`, `/client`, `/host`, `/react`, or
`/testing` subpaths. The old package name and aggregate import paths are intentionally absent.

## Inputs consumed

- Current human rename request
- Existing `packages/mini-app` workspace and its package manifest
- Aggregate runtime package, root workspace manifest, lockfile, and README

## Project changes

- Renamed `packages/mini-app` to `packages/mini-app-bridge`.
- Renamed the direct package to `@xray-network/xray-js-mini-app-bridge`.
- Renamed runtime source entries and export subpaths to `mini-app-bridge`.
- Updated the runtime dependency, root workspaces, npm lockfile links, comments, and documentation.
- Cleaned and rebuilt bridge/runtime output to prevent stale old-named build artifacts.

## Exported change contract

| Change ID | Semantic change                                                                                            | Compatibility                                                                                                                 | Downstream action                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `C01`     | The direct package identity is `@xray-network/xray-js-mini-app-bridge`.                                    | Existing direct imports using `@xray-network/xray-js-mini-app` no longer resolve. Public exported symbol names are unchanged. | Replace the direct package name in dependencies and imports.      |
| `C02`     | Aggregate runtime paths begin with `@xray-network/xray-js/mini-app-bridge`.                                | Existing `/mini-app` aggregate imports no longer resolve; subpath structure after the renamed prefix is unchanged.            | Replace `/mini-app` with `/mini-app-bridge` in aggregate imports. |
| `C03`     | Workspace and lockfile identity follow the new bridge name.                                                | Repository-local installation resolves the renamed workspace directly.                                                        | Reinstall dependencies from the updated lockfile.                 |
| `C04`     | Wire messages, schemas, React APIs, client/host helpers, and testing utilities are behaviorally unchanged. | No source-level migration is needed beyond import/package paths.                                                              | None.                                                             |

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge` passed.
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge` passed.
- Clean bridge and runtime rebuild passed.
- All six `@xray-network/xray-js/mini-app-bridge` aggregate entry points imported successfully.
- `npm run check` passed for all workspaces; the Cardano suite reported 51 passing tests.
- `git diff --check` passed.
- Stale-name scan found no old workspace path, package identity, aggregate import, or runtime output
  reference in active source, manifests, lockfile, or README.
- Offline npm reconciliation passed with only the existing Node 20.18.1 versus `>=20.19.0` engine
  warnings.

## Deviations from instruction

None.

## Remaining human review

Confirm the intentional removal of the old direct package and `/mini-app` aggregate aliases, then
decide whether this result should move from `REVIEW` to `ACCEPTED`.

## Reproducibility

From the repository root, install from the lockfile, run `npm run check`, import each documented
`@xray-network/xray-js/mini-app-bridge` subpath, run the instruction's stale-name scan, and run
`git diff --check`.
