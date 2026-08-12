# Runtime implementation 0004 result

Result-Version: v1
Implementation-ID: runtime/0004
Instruction: ./0004-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Removed the `.` export plus root `main`, `module`, `browser`, and `types` metadata; retained only explicit subpaths and package metadata. | Manifest audit, clean build, and retained-subpath import smoke passed. |
| C02 | `IMPLEMENTED` | Deleted `index.ts`, `xray.ts`, and `common.ts`; replaced facade tests with focused Cardano entry tests. | Source scan, clean artifact audit, tests, and typecheck passed. |
| C03 | `IMPLEMENTED` | Rewrote Cardano, Bitcoin, Midnight, package, and installation guidance around explicit subpaths. | Formatting and root-reference audits passed. |
| C04 | `IMPLEMENTED` | Migrated XRAY App from `XRAY.cardano.create` to `createCardano`. | Complete XRAY App verification passed. |

## Outcome

`@xray-network/xray-js` is now an explicit-subpath-only package. A bare package import is intentionally unsupported.

## Inputs consumed

- Runtime source, manifest, build scripts, and tests.
- Repository README.
- XRAY App Cardano adapter.

## Project changes

- Removed the package-root export and facade implementation.
- Added clean runtime build/test stages so removed root artifacts cannot survive incrementally.
- Updated public documentation and the only active root consumer.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Bare `@xray-network/xray-js` imports now raise `ERR_PACKAGE_PATH_NOT_EXPORTED`. | Intentional breaking cleanup. | Import an explicit blockchain or Mini App Bridge subpath. |
| C02 | `XRAY`, `XrayError`, and unused generic root types are removed. | No retained subpath changes. | Use `createCardano` from `/cardano`; define feature-local errors/types. |

## Validation

- `npm run check` — passed; 32 deterministic tests passed and one live integration test skipped.
- `npm run format:check` — passed.
- Bare-root failure, complete retained-subpath import, manifest, source-reference, and clean-artifact audits — passed.
- XRAY App `npm run verify` — passed, including registry checks and main, extension, and Telegram builds.
- xray-js and XRAY App `git diff --check` — passed.

## Deviations from instruction

The available Node 20.18.1 runtime is below React Router's requirement; XRAY App verification still passed with local prerender server permission.

## Remaining human review

Review the intentional lack of a package-root module.

## Reproducibility

Run `npm run check`, verify the export map, attempt a bare import, load every retained subpath, and run XRAY App verification.
