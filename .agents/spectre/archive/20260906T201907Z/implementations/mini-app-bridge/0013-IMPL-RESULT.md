# Mini App Bridge implementation 0013 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0013
Instruction: ./0013-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Replaced handshake-specific message families with strict generic request, success/error response, and event envelopes carrying adapter scope and string version. Successful responses/events validate adapter context. | Schema, stamping, correlation, malformed payload, context, and event tests pass in the Mini App Bridge suite. |
| C02 | `IMPLEMENTED` | Implemented stateless client routing and one host message router per iframe with exact source, scope, version, method, payload, result, and event filtering. Unknown routes/methods return correlated typed errors; recognized unhandled requests retain timeout behavior. | Focused tests cover immediate `UNSUPPORTED_SCOPE_VERSION`, `UNSUPPORTED_METHOD`, `INVALID_REQUEST`, wrong sources, unhandled methods, client timeout, and concurrent requests. |
| C03 | `IMPLEMENTED` | Moved platform, Cardano, and Cardano CIP-30 into independent `adapters/<scope>/v1` contracts with thin request/listen and listen/handle/respond/publish facades. Retained all existing non-handshake operations and CIP-30 connector behavior. | The focused suite executes every retained platform, Cardano, and CIP-30 client operation and validates independent scope/version stamping. |
| C04 | `IMPLEMENTED` | Added the stateless `clientPlatformV1.getStatus()` request, platform `getStatus` method, `status` event, host handling/publication, and lazy `useStatus()` React state. Status identifies `host: "xray.app"` and carries the selected Cardano account or `null`; it is not a handshake or prerequisite. | Tests cover the XRAY host marker, selected and accountless states, response context, exact platform/v1 stamping, lazy loading, error separation, refresh deduplication, and event cleanup. |
| C05 | `IMPLEMENTED` | Root now exposes direct static namespaces `clientPlatformV1`, `clientCardanoV1`, `clientCardanoCip30V1`, `hostPlatformV1`, `hostCardanoV1`, and `hostCardanoCip30V1`, plus `BridgeError` and public types. Removed grouped roles, sessions, registries, raw public protocols, and direct `/cardano` and `/v1*` exports. | Runtime object-key assertions and dynamic import audits prove the exact seven runtime exports and rejection of every retired direct subpath. |
| C06 | `IMPLEMENTED` | Replaced Provider/handshake-gated React bindings with direct `platformV1`, `cardanoV1`, and `cardanoCip30V1` React namespaces. Remote stores load lazily, deduplicate, refresh, filter exact events, and clean up; the CIP-30 connector hook installs idempotently. | React store tests and source/import scans pass; the core entry and client/host adapters contain no React dependency. |
| C07 | `IMPLEMENTED` | Rebuilt testing mocks for generic scoped messages, migrated aggregate runtime facades/tests, retained root/React/testing entries, and removed runtime `/mini-app-bridge/cardano`. The bridge build now cleans `dist` before compiling so retired generated modules cannot enter a package. | Mini App Bridge and runtime builds/typechecks/tests pass; aggregate import audits validate retained and retired paths, and the package dry-run contains no obsolete generated paths. |
| C08 | `IMPLEMENTED` | Replaced combined handshake documentation with package-owned guides. Root `README.md` is description-only and links to `packages/runtime/README.md`, `packages/cardano/README.md`, and the Mini App Bridge overview/focused Platform, Cardano, and Cardano CIP-30 guides under `packages/mini-app-bridge/`. Active package documentation describes only implemented adapters. | Prettier, documentation ownership/link checks, package-content audit, import audits, and stale handshake/capability/unused-adapter scans pass. |

## Outcome

The Mini App Bridge is now a compact scope-versioned SDK with no handshake, session, capability negotiation, or
iframe-level version lock. Each adapter owns its own `v1` contract and every wire message identifies that adapter
independently. Client and host APIs are direct named ESM namespaces, while React remains an isolated optional subpath.
The aggregate runtime mirrors the compact surface. XRAY App and external mini apps remain intentionally unchanged for
their later coordinated migration. Following human review feedback, API examples now live with their owning packages;
the repository README is limited to project description and links. Platform status now identifies `host: "xray.app"`
and its nullable selected account through an ordinary versioned request/event rather than an account-type-only API.

## Inputs consumed

- The human-approved requirements recorded in `0013-IMPL-INSTR.md`.
- The human revision request dated 2026-08-19 to move examples into `packages/*` documentation and keep the root README descriptive.
- The human refinement dated 2026-08-19 to remove unused-adapter references from active SDK documentation.
- The human refinement dated 2026-08-19 to replace the account-type API with stateless platform status identified by `host: "xray.app"`.
- `packages/mini-app-bridge/src/`, including the current platform, Cardano, CIP-30, transport, React, and testing behavior.
- `packages/mini-app-bridge/package.json`, `packages/runtime/`, and both package export maps.
- `packages/mini-app-bridge/test/bridge.test.ts` and `packages/runtime/test/xray.test.ts`.
- Root `README.md` and the repository package/development conventions.

## Project changes

- Added `packages/mini-app-bridge/src/adapters/types.ts` and independent Platform v1, Cardano v1, and Cardano CIP-30 v1 contract/client/host/React modules.
- Replaced transport internals with strict generic messages, typed bridge errors, scoped client helpers, and the shared per-iframe host router.
- Reduced the core root to direct named client/host exports and rebuilt the optional React and testing entries.
- Removed handshake, registry, session, protocol capability, grouped role, Provider, obsolete transport/schema, and retired public subpath source.
- Updated Mini App Bridge and aggregate runtime manifests, facades, tests, and import boundaries; bridge builds clean stale `dist` output before compiling.
- Reduced root `README.md` to the repository description and package links, moved Cardano usage to `packages/cardano/README.md`, added `packages/runtime/README.md`, and placed the bridge overview plus focused guides under `packages/mini-app-bridge/`.
- Included the three focused Mini App Bridge guides in the published package alongside its automatically included package README.
- Removed unused blockchain and wallet-adapter names from active package documentation so it describes only shipped surfaces.
- Replaced platform `getAccountType`/`accountType`/`useAccountType` with `getStatus`/`status`/`useStatus`, returning `host: "xray.app"` and a nullable selected account without introducing connection state or negotiation.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01-C02 | Every request, response, error, and event carries a scope and string version; hosts route each message independently. | Wire-incompatible with all earlier handshake/message families. | XRAY App must register supported adapter versions per iframe and return scoped responses/events. |
| C03-C04 | Platform, Cardano, and Cardano CIP-30 evolve independently; platform status identifies XRAY App and its nullable selected account, which selects the blockchain adapter a mini app should call. | Removes protocol capability constants, the redundant Cardano bridge grouping, and the account-type-only API without a shim. | Mini apps should call `clientPlatformV1.getStatus()`, inspect `status?.account`, and then use the matching direct blockchain adapter. |
| C05 | Core imports use role-prefixed direct version names. | Grouped `client`/`host`, session factories, raw schemas, `/cardano`, and `/v1*` paths are removed without shims. | Migrate to `clientPlatformV1`, `clientCardanoV1`, `clientCardanoCip30V1`, and matching `host*` exports. |
| C06 | React imports direct adapter-version namespaces and work without a Provider or handshake. | Removes `MiniAppProvider`, generic connection hooks, and grouped React namespaces. | Import `platformV1`, `cardanoV1`, or `cardanoCip30V1` from `/mini-app-bridge/react`. |
| C07-C08 | Aggregate runtime exposes only root, React, and testing bridge entries; examples and focused guides are owned by their package directories. | Runtime `/mini-app-bridge/cardano` and root-level API guides are removed. | Use `/mini-app-bridge` for all core adapters and follow the package README links for migration. |

## Validation

| Command or audit | Outcome |
| --- | --- |
| `npm run build --workspace @xray-network/xray-js-mini-app-bridge` | Passed. |
| `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge` | Passed. |
| `npm test --workspace @xray-network/xray-js-mini-app-bridge` | Passed: 11 tests. |
| `npm run build --workspace @xray-network/xray-js` | Passed. |
| `npm run typecheck --workspace @xray-network/xray-js` | Passed. |
| `npm test --workspace @xray-network/xray-js` | Passed: 3 tests. |
| `npm run check` | Passed across all workspaces: Cardano 27 passed/1 expected live test skipped, Mini App Bridge 11 passed, runtime 3 passed; all builds and typechecks passed. |
| `npm run format:check` | Passed. |
| Root/package documentation ownership and link audit | Passed; root has no code examples, only one root README exists, and every package/focused link resolves. |
| Active SDK unused-adapter scan | Passed; no Ethereum, EIP-1193, Bitcoin, Midnight, or generic future-adapter reference remains in root/package documentation or active package source. |
| Platform status contract and stale API scan | Passed; code, tests, and package guides use `getStatus`/`status`/`useStatus`, the schema fixes the host marker to `xray.app`, and no retired camel-case account-type API remains outside the retained account schema/type name. |
| `npm pack --dry-run --json --workspace @xray-network/xray-js-mini-app-bridge` with task-local cache | Passed after a clean bridge build; all four bridge README files are included and no retired generated tree is packaged. The first default-cache attempt failed on pre-existing root-owned npm cache files, so validation was rerun with `/tmp/xray-js-0013-npm-cache` without changing global state. |
| Direct and aggregate dynamic import audit | Passed for root, React, and testing; direct `/cardano`, `/v1*`, aggregate `/mini-app-bridge/cardano`, and aggregate `/mini-app-bridge/v1` rejected. |
| Stale contract and React-isolation scans | Passed; no retired handshake/session/capability/provider source or core React import remains. |
| Documentation file/link and source-tree audits | Passed; all focused guides exist and the source tree matches the adapter/version design. |
| `git diff --check` | Passed. |

## Deviations from instruction

The human revision request superseded C08's originally planned root-level focused-guide locations. The same bounded
documentation and examples now live under their owning package directories, while root `README.md` is description-only.
The later human refinement also superseded C08's request to mention an unimplemented adapter; active documentation now
names only implemented adapters. A subsequent human refinement superseded C04's account-type-only API with a platform
status request/event/hook carrying `host: "xray.app"` and the nullable account. This remains ordinary scoped messaging,
not a handshake, trust proof, or prerequisite. The original instruction remains unchanged as the audit record of the
approved plan.

## Remaining human review

- Confirm the direct role-prefixed core names and concise React subpath names are the intended long-term public API.
- Confirm `platform/v1` status, including its self-reported `xray.app` marker and account, is routing information only and that XRAY App remains the trust and permission authority.
- Review the deliberate wire/public-path break before coordinating the later XRAY App and mini-app migrations.
- Review the package-owned examples, navigation links, and error/timeout semantics from the perspective of host and mini-app integrators.

## Reproducibility

From the repository root with Node.js 20.19 or newer and installed workspace dependencies, run `npm run check`,
`npm run format:check`, and `git diff --check`. Build the Mini App Bridge before running the dynamic import audit so its
direct and aggregate `dist/esm` entry points reflect the current source. Audit package documentation with
`npm_config_cache=/tmp/xray-js-0013-npm-cache npm pack --dry-run --json --workspace @xray-network/xray-js-mini-app-bridge`.
