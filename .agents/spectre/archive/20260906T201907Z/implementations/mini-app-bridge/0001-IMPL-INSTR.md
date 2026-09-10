# Mini App Bridge implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0001
Created: 20260803T143851Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                                                                      | Kind    | Required | Purpose                                                                       |
| -------------------------------------------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------- |
| Current human request to rename the Mini App package to Mini App Bridge    | `LOCAL` | Yes      | Authorizes the workspace, package, runtime subpath, and documentation rename. |
| `packages/mini-app/`, `packages/runtime/`, root manifests, and `README.md` | `LOCAL` | Yes      | Defines the existing package and every repository-owned consumer.             |

## Objective

Rename the Mini App workspace and package to Mini App Bridge across repository-owned paths while
preserving its protocol, client, host, React, testing, and CIP-30 behavior.

## Changes to implement

| Change ID | Requirement                                                                                                          | Compatibility                                                                      | Local owner                                              | Validation                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `C01`     | Rename `packages/mini-app` to `packages/mini-app-bridge` and the package to `@xray-network/xray-js-mini-app-bridge`. | Preserve source modules, exports, and public `MiniApp*` symbols.                   | `packages/mini-app-bridge/`, root `package.json`         | Workspace build and typecheck.                       |
| `C02`     | Rename runtime source modules and public subpaths from `mini-app` to `mini-app-bridge`.                              | This is an intentional import-path rename; do not retain old aliases.              | `packages/runtime/src/`, `packages/runtime/package.json` | Runtime build and repository-wide stale-name scan.   |
| `C03`     | Update repository dependencies, lockfile links, comments, and documentation to the new name.                         | Installation must resolve the renamed local workspace without stale package links. | `package-lock.json`, `README.md`                         | Offline lockfile reconciliation and stale-name scan. |
| `C04`     | Preserve behavior and verify all workspaces after the mechanical rename.                                             | No protocol message, API symbol, schema, or runtime behavior change.               | Repository                                               | `npm run check` and `git diff --check`.              |

## Implementation steps

1. Rename the workspace directory and package identity.
2. Rename runtime bridge entry modules and public package subpaths.
3. Update all repository-owned imports, workspace declarations, comments, docs, and lockfile links.
4. Run focused and complete validation, then scan for stale old paths and package names.

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run check`
- `git diff --check`
- Confirm no repository-owned source, manifest, lockfile, or README reference remains for
  `packages/mini-app`, `@xray-network/xray-js-mini-app`, or the runtime `/mini-app` subpaths.

## Compatibility and human review

This intentionally changes the direct workspace package name and aggregate runtime import subpaths.
Review consumers for the new `mini-app-bridge` spelling. Public TypeScript symbols and wire protocol
identities remain unchanged.

## Completion criteria

- The workspace, package name, runtime entry modules, runtime exports, dependency links, and docs use
  Mini App Bridge consistently.
- The old package/path names are absent from active repository-owned code and metadata.
- All workspace validation passes without functional source changes.

## Out of scope

- Renaming `MiniApp*` API symbols or wire message types.
- Changing the postMessage protocol, CIP-30 behavior, React APIs, or testing utilities.
- Publishing packages or providing external consumer migration automation.

## Blockers

None.
