# Mini App Bridge implementation 0020 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0020
Instruction: ./0020-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Plain Contract; direct Request/Response/Event mapped unions; Outcome for host inputs; named adapter/domain exports defined once. Removed the previous envelope alias chain and namespace type exports. | Positive/negative type fixtures cover all three scopes, method/event payload correlation, readonly metadata, success/failure narrowing, removed aliases, generic protocol types, and standalone/aggregate imports. |
| C02 | `IMPLEMENTED` | Consolidated 29 source files into the exact 17-file tree. Removed replaced paths and empty directories. Explicit public barrels preserve runtime entry/member names. | Source inventory; runtime export/member baseline comparison; source/declaration import resolution; acyclic runtime graph; core/protocol React isolation; workspace builds. |
| C03 | `IMPLEMENTED` | One internal bindHost uses the existing router and validation paths; adapters retain explicit methods and timeout parameters. Inlined the single-use CIP-30 connector construction. | Existing client/host round trips for all scopes, host error/manual validation tests, and a new all-scope manual response/event isolation test. Runtime initializer equivalence checks protect unchanged transport logic. |
| C04 | `IMPLEMENTED` | Moved stores/hooks and mock implementations to the planned paths. Interactive and connector subscription helpers live with their callers. Internal interactive test access is excluded from the public React adapter. | Store/readiness, interactive outcome, mock, connector, and CIP-30 tests; unchanged runtime export/member keys; React unavailable import check. |
| C05 | `IMPLEMENTED` | Updated all four guides with named types, request/success/failure examples, migration notes, and the final source tree. Updated test imports and expanded focused type fixtures. | Root check, required Prettier command, and all 14 exact README TypeScript/TSX fences compiled in both public import variants. Existing aggregate tests pass without source edits. |

## Outcome

Implemented the bounded cleanup and validated it. The record is ready for human review, not accepted.

The formatted SDK source decreased from 29 files / 2,001 lines to 17 files / 1,806 lines. Emitted declaration text decreased from 2,844 to 2,793 lines. These are source/declaration counts, not bundle measurements; no bundle-size claim was made. Explicit public return annotations prevent repeated inferred schema expansions and keep method declarations readable.

The runtime adapter names, protocol runtime members, wire format, package versions, dependencies, and export subpaths are unchanged. All required checks passed: 71 tests passed, zero failed, and one pre-existing live Cardano endpoint test was skipped. No live endpoint coverage is claimed.

## Inputs consumed

Consumed the human cleanup request, selected 17-file plan, persistent no-version-change requirement, and current `$spectre implement 0020` authorization. Used the instruction's owned working-tree source, including locally added files from the earlier authorized implementation. No provider evidence or accepted implementation result was consumed.

All 53 exact local file inputs were read. The table records their pre-consolidation identity and current location. Shared host wrapper logic also moved to `packages/mini-app-bridge/src/host.ts`; the adapter destinations contain the bound host exports.

| Input at implementation start | Current location |
| --- | --- |
| `AGENTS.md` | `AGENTS.md` |
| `README.md` | `README.md` |
| `package.json` | `package.json` |
| `package-lock.json` | `package-lock.json` |
| `tsconfig.base.json` | `tsconfig.base.json` |
| `packages/mini-app-bridge/package.json` | `packages/mini-app-bridge/package.json` |
| `packages/mini-app-bridge/tsconfig.json` | `packages/mini-app-bridge/tsconfig.json` |
| `packages/mini-app-bridge/test/tsconfig.json` | `packages/mini-app-bridge/test/tsconfig.json` |
| `packages/runtime/package.json` | `packages/runtime/package.json` |
| `packages/runtime/src/mini-app-bridge.ts` | `packages/runtime/src/mini-app-bridge.ts` |
| `packages/runtime/src/mini-app-bridge-react.ts` | `packages/runtime/src/mini-app-bridge-react.ts` |
| `packages/runtime/src/mini-app-bridge-testing.ts` | `packages/runtime/src/mini-app-bridge-testing.ts` |
| `packages/runtime/test/xray.test.ts` | `packages/runtime/test/xray.test.ts` |
| `packages/mini-app-bridge/src/adapters/cardano/v1/client.ts` | `packages/mini-app-bridge/src/adapters/cardano.ts` |
| `packages/mini-app-bridge/src/adapters/cardano/v1/contract.ts` | `packages/mini-app-bridge/src/adapters/cardano.ts` |
| `packages/mini-app-bridge/src/adapters/cardano/v1/host.ts` | `packages/mini-app-bridge/src/adapters/cardano.ts` |
| `packages/mini-app-bridge/src/adapters/cardano/v1/react.ts` | `packages/mini-app-bridge/src/react/cardano.ts` |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/client.ts` | `packages/mini-app-bridge/src/adapters/cip30.ts` |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/connector.ts` | `packages/mini-app-bridge/src/adapters/cip30.ts` |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/contract.ts` | `packages/mini-app-bridge/src/adapters/cip30.ts` |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/host.ts` | `packages/mini-app-bridge/src/adapters/cip30.ts` |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/react.ts` | `packages/mini-app-bridge/src/react/cip30.ts` |
| `packages/mini-app-bridge/src/adapters/platform/v1/client.ts` | `packages/mini-app-bridge/src/adapters/platform.ts` |
| `packages/mini-app-bridge/src/adapters/platform/v1/contract.ts` | `packages/mini-app-bridge/src/adapters/platform.ts` |
| `packages/mini-app-bridge/src/adapters/platform/v1/host.ts` | `packages/mini-app-bridge/src/adapters/platform.ts` |
| `packages/mini-app-bridge/src/adapters/platform/v1/react.ts` | `packages/mini-app-bridge/src/react/platform.ts` |
| `packages/mini-app-bridge/src/adapters/types.ts` | `packages/mini-app-bridge/src/types.ts` |
| `packages/mini-app-bridge/src/index.ts` | `packages/mini-app-bridge/src/index.ts` |
| `packages/mini-app-bridge/src/protocol.ts` | `packages/mini-app-bridge/src/protocol.ts` |
| `packages/mini-app-bridge/src/react/connector-store.ts` | `packages/mini-app-bridge/src/react/cip30.ts` |
| `packages/mini-app-bridge/src/react/index.ts` | `packages/mini-app-bridge/src/react/index.ts` |
| `packages/mini-app-bridge/src/react/interactive.ts` | `packages/mini-app-bridge/src/react/cardano.ts` |
| `packages/mini-app-bridge/src/react/remote-store.ts` | `packages/mini-app-bridge/src/react/store.ts` |
| `packages/mini-app-bridge/src/testing/events.ts` | `packages/mini-app-bridge/src/testing/client.ts` |
| `packages/mini-app-bridge/src/testing/index.ts` | `packages/mini-app-bridge/src/testing/index.ts` |
| `packages/mini-app-bridge/src/testing/mock-client.ts` | `packages/mini-app-bridge/src/testing/client.ts` |
| `packages/mini-app-bridge/src/testing/mock-host.ts` | `packages/mini-app-bridge/src/testing/host.ts` |
| `packages/mini-app-bridge/src/transport/client.ts` | `packages/mini-app-bridge/src/client.ts` |
| `packages/mini-app-bridge/src/transport/errors.ts` | `packages/mini-app-bridge/src/messages.ts` |
| `packages/mini-app-bridge/src/transport/host.ts` | `packages/mini-app-bridge/src/host.ts` |
| `packages/mini-app-bridge/src/transport/messages.ts` | `packages/mini-app-bridge/src/messages.ts` |
| `packages/mini-app-bridge/src/transport/protocol.ts` | `packages/mini-app-bridge/src/messages.ts` |
| `packages/mini-app-bridge/test/account-state-contract.test.ts` | `packages/mini-app-bridge/test/account-state-contract.test.ts` |
| `packages/mini-app-bridge/test/bridge.test.ts` | `packages/mini-app-bridge/test/bridge.test.ts` |
| `packages/mini-app-bridge/test/cardano-sign-tx-contract.test.ts` | `packages/mini-app-bridge/test/cardano-sign-tx-contract.test.ts` |
| `packages/mini-app-bridge/test/interactive.test.ts` | `packages/mini-app-bridge/test/interactive.test.ts` |
| `packages/mini-app-bridge/test/remote-store.test.ts` | `packages/mini-app-bridge/test/remote-store.test.ts` |
| `packages/mini-app-bridge/test/response-contract.test.ts` | `packages/mini-app-bridge/test/response-contract.test.ts` |
| `packages/mini-app-bridge/test/response-types.ts` | `packages/mini-app-bridge/test/response-types.ts` |
| `packages/mini-app-bridge/README-CARDANO-CIP30.md` | `packages/mini-app-bridge/README-CARDANO-CIP30.md` |
| `packages/mini-app-bridge/README-CARDANO.md` | `packages/mini-app-bridge/README-CARDANO.md` |
| `packages/mini-app-bridge/README-PLATFORM.md` | `packages/mini-app-bridge/README-PLATFORM.md` |
| `packages/mini-app-bridge/README.md` | `packages/mini-app-bridge/README.md` |

## Project changes

- `packages/mini-app-bridge/src/types.ts`: non-generic contract schema shape, direct correlated request/response/event unions, host outcome, and small schema/key helpers.
- `packages/mini-app-bridge/src/messages.ts`: existing envelope schemas, BridgeError/error serialization, and shared parse/build functions in one module.
- `packages/mini-app-bridge/src/client.ts`, `host.ts`: existing transport moved without changing runtime logic; one host binder replaces repeated adapter wrappers. The host dispatch assertion now names the request type instead of using as never.
- `packages/mini-app-bridge/src/adapters/platform.ts`, `cardano.ts`, `cip30.ts`: local schemas/types, explicit client methods, and bound host. CIP-30 includes its connector and preserves standard values/exceptions.
- `packages/mini-app-bridge/src/index.ts`, `protocol.ts`: named public types and explicit runtime exports. No old alias shims or namespace merging.
- `packages/mini-app-bridge/src/react/index.ts`, `store.ts`, `platform.ts`, `cardano.ts`, `cip30.ts`: planned consolidated optional React entry; public adapter member names preserved.
- `packages/mini-app-bridge/src/testing/index.ts`, `client.ts`, `host.ts`: consolidated mocks and event dispatcher with the existing testing surface.
- `packages/mini-app-bridge/test/account-state-contract.test.ts`, `cardano-sign-tx-contract.test.ts`, `interactive.test.ts`, `remote-store.test.ts`: updated moved imports and named type imports, retaining semantic assertions.
- `packages/mini-app-bridge/test/response-contract.test.ts`, `response-types.ts`: new bound-host regression and expanded named/generic type coverage; existing outcome coverage preserved.
- `packages/mini-app-bridge/README.md`, `README-PLATFORM.md`, `README-CARDANO.md`, `README-CARDANO-CIP30.md`: final structure, type imports, complete examples, and prerelease migration notes.
- Replaced source modules and their empty directories were removed according to the instruction's move mapping. There are no transport or adapter/v1 source directories or forwarding files.

No package manifest, lockfile, runtime source/test, Cardano source, XRAY App, or consumer source changed relative to the implementation-start working tree. The existing `0019` instruction, result, and REVIEW row remain unchanged. This operation creates this result and changes only `0020`'s ledger row from PLANNED to REVIEW.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Message types are direct schema-derived discriminated unions; adapter/domain types have named root exports. | Prerelease type-import change. Wire fields and runtime outcomes remain unchanged. | Replace namespace types with PlatformRequest/Response/Event, CardanoRequest/Response/Event, or Cip30Request/Response/Event. Replace old generic aliases with Contract, Request, Response, Event, and Outcome as appropriate. |
| C02 | SDK source is consolidated into 17 files behind the same public entries. | Runtime core, protocol, React, testing, and package metadata entrypoints remain available under existing names. | Keep runtime imports. Use supported package exports, not removed private source paths. |
| C03 | All hosts bind the same router once per adapter; client methods stay explicit. | Same runtime signatures, timeout defaults/overrides, handlers, manual replies, events, and connector behavior. | No runtime call migration is required. |
| C04 | React/testing helper placement changed internally. | Same hook/store/mock behavior and optional React boundary. | No runtime migration is required. |
| C05 | Guides now show named imports and the consolidated architecture. | No compatibility aliases or version bump because the library is unreleased. | Use the new type imports when updating consumers; separately coordinate the previously required host/client envelope adoption before combined use or release. |

## Validation

Executed from the `xray-js` repository root against the final source:

```sh
npm run check
npx --no-install prettier --check packages/mini-app-bridge/src packages/mini-app-bridge/test packages/mini-app-bridge/README*.md packages/runtime/test/xray.test.ts
```

Both passed. Root check builds all workspaces, then runs their tests and typechecks:

| Workspace | Passed | Failed | Skipped |
| --- | --- | --- | --- |
| Cardano | 31 | 0 | 1 existing live XRAY endpoint test |
| Mini App Bridge | 37 | 0 | 0 |
| Runtime | 3 | 0 | 0 |

Additional executed checks:

- Extracted all 14 exact ts/tsx fenced examples from the four guides into separate temporary modules. Compiled them as written through aggregate exports and with only the package specifier changed for standalone exports: 28 files passed strict TypeScript compilation against freshly built declarations.
- Compared Object.keys for public core/React/testing exports and their adapter/protocol members against the pre-refactor built baseline: identical.
- Imported standalone and aggregate core/protocol under a Node loader that throws when React or a React subpath is resolved: passed, with shared protocol identity retained.
- Parsed local imports/exports with the installed TypeScript compiler API. All local source/declaration destinations exist; the runtime graph has no cycles; core/protocol reach neither React nor testing. The type-only error-payload reference does not create a runtime cycle.
- Asserted the exact 17-file source inventory, absence of removed alias chains/paths, preserved V1 literals, and concise public adapter return declarations using named types.
- Compared TypeScript-erased runtime initializer tokens with the implementation-start source for existing client/host transport, message schemas/helpers, adapter domain schemas, remote store, interactive runner, and connector-store helper: identical. The new binder and inlined connector are covered by regression tests.
- Compared implementation-start SHA-256 snapshots to confirm unchanged manifests/lockfile, unrelated source, `0019` records, and archive bytes. Existing uncommitted work was used as the baseline, not overwritten from Git HEAD.
- Validated the affected SPECTRE record/ledger identity, schema, C01–C05 disposition coverage, LOCAL input move resolution, result link, lifecycle state, unique active/archive identity, and matching installed runtime headers. This is scoped validation, not a claim of re-extracting every unrelated runtime module.

## Deviations from instruction

None. Runtime source/test changes were unnecessary because the existing aggregate star exports and assertions already support the final surface. Explicit return annotations and the narrow React export type are implementation details that avoid verbose emitted declarations while retaining the planned API.

## Remaining human review

Review the consolidated adapter/type readability and deliberate prerelease named-type migration. Acceptance requires a separate human decision. `0019` still awaits its own review. XRAY App/consumer source adoption, publishing, and release remain separately owned and were not performed.

## Reproducibility

Validation used the existing workspace dependencies and compiler; no dependency was installed or changed. Run the two repository commands above to reproduce build/test/typecheck/format verification. The compile-time fixtures are part of the existing bridge test project.

Documentation compilation is reproducible by extracting each exact ts/tsx fence into its own ESM module, compiling under `tsconfig.base.json` with noEmit and react-jsx, and repeating with the equivalent standalone package specifier. Runtime isolation is reproducible with a Node resolve hook that throws for `react` and `react/*` while importing both supported core entries. Runtime graph inspection ignores type-only edges and verifies emitted relative declaration paths.

Session-only diagnostic artifacts were kept outside the repository: `/tmp/xray-0020-check.log`, `/tmp/xray-0020-impl-baseline.json`, `/tmp/xray-0020-inputs.json`, `/tmp/xray-0020-runtime-baseline.json`, `/tmp/xray-0020-declarations-before.json`, `/tmp/validate-xray-0020.mjs`, `/tmp/xray-0020-no-react.mjs`, and the directory named in `/tmp/xray-0020-readme-dir.txt`. These are temporary diagnostics, not committed dependencies or provider evidence. No Git commit, deployment, or release was performed.
