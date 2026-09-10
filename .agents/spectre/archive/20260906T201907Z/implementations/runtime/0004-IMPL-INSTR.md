# Runtime implementation 0004 instruction

Implementation-Version: v1
Implementation-ID: runtime/0004
Created: 20260812T113508Z
Evidence-Mode: LOCAL
Depends-On: cardano/0007
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-approved removal of the duplicate package-root API | `LOCAL` | Yes | Make explicit xray-js subpaths the only public entry points. |
| Runtime manifest/source/tests, README, and active root consumers | `LOCAL` | Yes | Define and validate the breaking root removal. |

## Objective

Remove the `@xray-network/xray-js` package-root module and document only explicit subpath APIs.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Remove the `.` export and root-oriented package metadata from the runtime manifest. | Intentional breaking change; retain every explicit subpath. | runtime manifest | Export-map audit and package build. |
| C02 | Delete the duplicate `XRAY` facade and unused shared root exports/types. | `createCardano` remains canonical on `/cardano`. | runtime source/tests | Source scan, tests, and declarations. |
| C03 | Rewrite README examples and placeholders around explicit blockchain and bridge subpaths. | Do not document unavailable Bitcoin or Midnight APIs as live. | README | Formatting and documentation audit. |
| C04 | Migrate the only active root consumer to `createCardano`. | Preserve Cardano client construction behavior. | xray-app | Complete downstream verification. |

## Implementation steps

1. Remove root source files, manifest export, and metadata.
2. Replace facade tests with focused subpath behavior tests.
3. Update README and XRAY App imports.
4. Run repository, export, and downstream validation.

## Validation

- `npm run check`
- root-import and export-map audits
- `npm run format:check`
- XRAY App `npm run verify`
- `git diff --check`

## Compatibility and human review

This intentionally makes `import ... from "@xray-network/xray-js"` unsupported. Review explicit-subpath ergonomics.

## Completion criteria

The package root is absent, all explicit subpaths remain valid, active root imports are gone, and validation passes.

## Out of scope

Adding Bitcoin or Midnight implementations or changing existing subpath behavior.

## Blockers

None.
