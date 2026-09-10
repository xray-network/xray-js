# Mini App Bridge implementation 0012 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0012
Instruction: ./0012-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Added protocol-neutral version, adapter, and handshake-selection contracts; registered only v1; and made the exact v1 client handshake payload `{ protocolVersion: 1 }` with no null, malformed, extra-field, or unsupported-version acceptance. | Focused schema/session tests pass for the valid request and every required rejection case. |
| C02 | `IMPLEMENTED` | Moved envelope/context, platform, Cardano Bridge, CIP-30, and Cardano React wire-dependent ownership under `src/protocol/v1`; assembled one v1 adapter; and converted top-level transport code into parser-injected, version-neutral mechanics. | Package build/typecheck pass, existing platform/Cardano/CIP-30 tests pass, and the schema-owner audit finds every wire schema only below `protocol/v1`. |
| C03 | `IMPLEMENTED` | Added `createClientSession(1)`, which locks one adapter, exposes its explicit handshake and complete v1 client namespace, and parses host messages through the same adapter. Existing root `client` operations remain bound to v1. | Tests prove selected-client identity, exact emitted handshake bytes, unsupported-version failure before use, and unchanged later platform/Cardano/CIP-30 behavior. |
| C04 | `IMPLEMENTED` | Added `createHostSession(iframe)`, exact handshake selection, immutable adapter locking, preselection rejection, selected-adapter host access, and selected client-message parsing. Existing root `host` operations remain the direct v1 surface. | Tests prove v1 selection, source iframe retention, preselection rejection, valid postselection parsing, null/unsupported handshake rejection, and no version switch. |
| C05 | `SUPERSEDED` | The human revision removed the aggregate runtime `/mini-app-bridge/v1*` forwarding layer. Explicit `/v1`, `/v1/cardano`, `/v1/react`, and `/v1/testing` ownership remains in the Mini App Bridge package; the aggregate runtime retains only its four current-facing bridge entries. No v2 directory or export exists. | All 12 supported direct-package and aggregate-runtime entries import after clean builds, and all four removed aggregate `/v1*` subpaths fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`. |
| C06 | `IMPLEMENTED` | Made mocks parse through the v1 adapter, added exact handshake/session/export contract tests, and documented client-selected v1, direct-package explicit imports, dynamic host sessions, the null-handshake break, and required coordinated XRAY App/mini-app migration. | Bridge tests pass 8/8, runtime tests pass 3/3, README/source stale-contract audits pass with null payloads present only as explicit rejection evidence. |

## Outcome

Mini App Bridge now owns one explicit v1 wire implementation under `protocol/v1`. V1 clients send
`{ protocolVersion: 1 }` in `xray.client.handshake`; the former null payload is invalid. Client and
host session factories select exactly one registered adapter and keep subsequent parsing and
listen/send access on it. Existing SDK paths remain v1, stable explicit v1 paths are published from
the Mini App Bridge package only, and no v2 implementation or negotiation behavior was introduced.
The aggregate runtime deliberately exposes only the current bridge, Cardano, React, and testing
facades instead of duplicating the bridge package's version hierarchy.

## Inputs consumed

- Current human request dated 2026-08-19.
- `packages/mini-app-bridge/src/` current transport, platform, Cardano, client, host, React, and testing source.
- `packages/mini-app-bridge/package.json`, `packages/runtime/package.json`, and bridge runtime facade source.
- `packages/mini-app-bridge/test/bridge.test.ts` and `packages/runtime/test/xray.test.ts`.
- `README.md` Mini App Bridge documentation.

## Project changes

- Added `packages/mini-app-bridge/src/protocol/{types,registry,handshake}.ts`.
- Added `packages/mini-app-bridge/src/protocol/v1/` with the adapter, public entry, transport envelope/context bindings, platform client/host/contracts, Cardano Bridge client/host/contracts, CIP-30 client/host/contracts, and Cardano React bindings.
- Removed the former unversioned `src/platform/`, `src/cardano/`, and transport envelope/context owners after migrating their contents to v1.
- Refactored `packages/mini-app-bridge/src/transport/` into version-neutral mechanics and retained constants/window utilities there.
- Added `packages/mini-app-bridge/src/client/session.ts` and `src/host/session.ts`; migrated client, host, React, and testing facades/imports to v1.
- Updated strict v1 mocks and `packages/mini-app-bridge/test/bridge.test.ts` contract coverage.
- Updated `packages/mini-app-bridge/package.json` with explicit v1 exports and redirected retained Cardano contracts to their v1 owner.
- Kept `packages/runtime` as a current-facing aggregate with only `mini-app-bridge.ts`, `mini-app-bridge-cardano.ts`, `mini-app-bridge-react.ts`, and `mini-app-bridge-testing.ts`; removed the proposed runtime v1 forwarding files and export-map entries.
- Updated `README.md` with explicit v1 handshake, imports, host-session usage, migration warning, and origin responsibility.
- Added the matching instruction/result and updated `.xray/updates/XRAY-UPDATES-STATUS.md`.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | A v1 client handshake request payload is exactly `{ protocolVersion: 1 }`; null and unsupported versions do not select an adapter. | Intentional wire break within v1; the handshake response remains `{ protocolVersion: 1, protocols }`. | XRAY App and every mini app must adopt the explicit request before this SDK revision is released. |
| C02 | All v1 wire contracts/codecs have one immutable ownership boundary under `protocol/v1`; shared transport receives a version parser instead of owning schemas. | Every non-handshake v1 name, payload, context, response, capability, and CIP-30 behavior is retained. | Add future versions as sibling adapters; do not edit v1 to implement v2. |
| C03 | `client.createClientSession(1)` exposes a locked v1 handshake/client/parser surface; the existing root client remains v1. | Current client method names and behavior remain available through retained and explicit v1 paths. | Version-aware consumers may create a pointed session; existing consumers receive the revised v1 handshake automatically. |
| C04 | `host.createHostSession(iframe)` selects one adapter from the explicit handshake and rejects traffic before selection through its parser. | Existing direct host helpers remain v1; dynamic hosts gain exact session selection without fallback. | XRAY App should create one host session per iframe and route transport/publications/blockchain handling through its selected adapter. |
| C05 | Stable explicit v1 entry paths are owned only by the Mini App Bridge package; the aggregate runtime exposes only its current-facing bridge paths. | Existing aggregate paths still resolve to v1, but aggregate `/mini-app-bridge/v1*` paths are intentionally not exported. No v2 path is advertised. | Consumers that need a permanent version import must use `@xray-network/xray-js-mini-app-bridge/v1*`; consumers of `@xray-network/xray-js` use its current unversioned bridge paths. |
| C06 | Tests, mocks, and docs treat null handshake input only as invalid migration evidence. | No hidden compatibility alias remains. | Coordinate and validate XRAY App first, then all deployed mini apps, before publishing/releasing. |

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge`: PASS.
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge`: PASS.
- `npm test --workspace @xray-network/xray-js-mini-app-bridge`: PASS, 8/8 tests.
- `npm run build --workspace @xray-network/xray-js`: PASS.
- `npm run typecheck --workspace @xray-network/xray-js`: PASS.
- `npm test --workspace @xray-network/xray-js`: PASS, 3/3 tests.
- `npm run check`: PASS under Node 24.18.0 and npm 11.16.0; all workspace builds/typechecks pass, Cardano passes 27 tests with its live endpoint test skipped as declared, bridge passes 8/8, and runtime passes 3/3.
- `npm run format:check`: PASS.
- Public export/import audit: PASS for all 12 supported direct-package and aggregate-runtime entries; all four removed aggregate runtime `/v1*` subpaths reject with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Exact handshake/session audit: PASS; the client emits `{ type: "xray.client.handshake", payload: { protocolVersion: 1 }, requestId }`, null does not parse or enter mocks, unsupported selection fails, and the host session stays locked.
- Schema-owner audit: PASS; envelope/context/platform/Cardano/CIP-30 schema declarations exist only below `src/protocol/v1`.
- V2 audit: PASS; no v2 directory or package export exists.
- `git diff --check`: PASS.

## Deviations from instruction

The illustrative target tree did not show Cardano-specific React internals under v1. They were moved to
`protocol/v1/cardano/react` because they directly consume v1 Cardano contracts and clients; the public
top-level `/react` and explicit `/v1/react` facades remain unchanged and share that implementation. This
preserves the instruction's ownership boundary without duplicating hooks.

The human revision requested that protocol-version entry points remain owned by the bridge SDK instead
of being mirrored by the aggregate runtime. This supersedes C05's aggregate `/mini-app-bridge/v1*`
entry-point requirement and the matching completion criterion. The direct package still provides every
explicit v1 surface, while all pre-existing aggregate runtime paths remain current v1. No product scope,
input, wire compatibility rule, or required protocol behavior was otherwise changed.

## Remaining human review

- Confirm the intentional removal of the null v1 handshake is acceptable for coordinated release.
- Review the `createClientSession` and `createHostSession` API shape before treating it as the pattern for v2.
- Confirm explicit version pinning belongs only to `@xray-network/xray-js-mini-app-bridge/v1*` and that the aggregate runtime should remain current-facing.
- Create and implement the separate versioned-host plan in `xray-app` before publishing this SDK revision.
- Migrate and validate all mini apps against the explicit v1 handshake after the host supports it.
- Perform browser-level exact-origin/security review in `xray-app`; SDK wildcard helpers were intentionally unchanged.

## Reproducibility

Use Node 24.18.0 (satisfies the repository's `>=20.19.0` engine), install the locked workspaces, then
run `npm run check` and `npm run format:check`. This revision was validated with npm 11.16.0; the
repository package-manager declaration remains npm 10.8.2. Build the bridge and runtime before running
the 12-entry import audit and the four removed-subpath rejection checks. Inspect
`protocol/v1/platform/protocol.ts` for the exact request schema, `protocol/registry.ts` for registered
versions, and the bridge contract tests for selection, rejection, and direct-package export equivalence.
