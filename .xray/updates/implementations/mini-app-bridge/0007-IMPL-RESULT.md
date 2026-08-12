# Mini App Bridge implementation 0007 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0007
Instruction: ./0007-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Added root `client.platform`, `client.cardano.bridge`, and `client.cardano.cip30` namespaces, plus `client.cardano.listenAll` for one validated platform, Cardano Bridge, and CIP-30 host-message subscription. | Package build, aggregate-listener tests, namespace tests, and downstream template verification passed. |
| C02 | `IMPLEMENTED` | Added symmetric root `host.platform`, `host.cardano.bridge`, and `host.cardano.cip30` namespaces, plus `host.cardano.listenAll` for one validated platform, Cardano Bridge, and CIP-30 client-message subscription per iframe. | Package build, aggregate-listener tests, namespace tests, and typecheck passed. |
| C03 | `IMPLEMENTED` | Added `cardano.bridge` to the separate React entry while retaining all platform hooks. Platform value hooks now wait for a successful shared handshake before sending their selected getters. | Package typecheck, lifecycle-order test, namespace test, and React consumer builds passed. |
| C04 | `IMPLEMENTED` | Reduced package exports from 15 to 6, consolidated mocks under `/testing`, migrated tests/docs, and declared side-effect-free ESM. | Export/import audit, full repository check, formatting, and all local consumer validations passed. |

## Outcome

Mini App Bridge now presents compact role namespaces while React remains an optional separate
entry and protocol/type entry points remain explicit. Cardano clients and hosts can each observe
all platform, Cardano Bridge, and CIP-30 traffic through one high-level typed listener without
importing schema maps or transport context schemas.

## Inputs consumed

- `packages/mini-app-bridge/src` and package manifest.
- Bridge tests and repository README.
- Active local consumers and the human-approved export design.
- The human revision request for symmetric Cardano-wide client and host listeners.
- The human revision request for platform value getters to run after handshake.

## Project changes

- Added client, host, and React Cardano namespace barrels.
- Added schema-combined `client.cardano.listenAll` and `host.cardano.listenAll` facade methods while
  retaining the low-level schema-driven transport listeners.
- Deferred React platform value getters until the memoized handshake succeeds, without making
  unused values eager.
- Consolidated testing exports and removed the redundant Cardano testing shim.
- Removed obsolete deep role subpaths from the export map.
- Updated aggregate listener tests and documentation for the compact API.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Mini-app operations are selected by `client.<domain>` from the bridge root; `client.cardano.listenAll` combines validated platform, Cardano Bridge, and CIP-30 host messages. | Wire behavior, payloads, source-window validation, Cardano context validation, and low-level listeners are unchanged. | Replace deep client imports with root `client` namespaces; use the aggregate listener when one Cardano-scoped subscription is preferred. |
| C02 | Host operations are selected by `host.<domain>` from the bridge root; `host.cardano.listenAll` combines validated platform, Cardano Bridge, and CIP-30 client requests for one iframe. | Wire behavior, payloads, iframe-source validation, and low-level listeners are unchanged. | Replace deep host imports with root `host` namespaces; use the aggregate listener for Cardano-scoped host routing or logging. |
| C03 | Cardano React hooks are under `cardano.bridge` on `/react`, and selected platform value hooks fetch only after handshake succeeds. | Platform hook names, lazy selection, response caching, and later push updates remain unchanged. | Replace `/cardano/react` imports with the React namespace; mount the platform hooks whose initial values the app needs. |
| C04 | Deep role and transport subpaths are no longer exported. | Root, React, testing, Cardano protocol, and CIP-30 protocol paths remain. | Migrate before upgrading to this breaking surface. |

## Validation

- `npm run check` — passed; 35 tests passed and one live integration test skipped, including the
  new symmetric aggregate-listener and handshake-before-getter coverage.
- `npm run format:check` — passed.
- React template lint, typecheck, client/server build, and SPA prerender — passed using
  `client.cardano.listenAll` without schema/context imports.
- XRAY App typecheck — passed against the rebuilt runtime facade.
- Obsolete-import and export-map audits — passed.
- `git diff --check` — passed.

## Deviations from instruction

The human revisions extended the compact Cardano namespaces with symmetric aggregate listener
methods and ordered selected React platform getters after the shared handshake. These remain
within the namespace/React objective and preserve all lower-level operations.

## Remaining human review

Review the intentional removal of deep runtime-role subpaths, namespace naming, and the decision
for Cardano-wide listeners to include platform messages alongside Cardano Bridge and CIP-30.

## Reproducibility

Run `npm run format:check` and `npm run check`, import `client`/`host` from the bridge root, then
exercise `client.cardano.listenAll(handler)` and `host.cardano.listenAll(iframe, handler)` with one
platform, Cardano Bridge, and CIP-30 envelope each. Create a React store, ensure platform values,
and confirm its outgoing order is handshake, theme, currency, then balance privacy.
