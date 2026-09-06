# Mini App Bridge implementation 0013 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0013
Created: 20260819T082052Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request dated 2026-08-19 | `LOCAL` | Yes | Requires a super-compact Mini App Bridge with direct named versioned client/host exports and direct versioned React exports; scope/version markers on every message; no handshake or capability negotiation; `platform.getAccountType()`; and split focused documentation. |
| `packages/mini-app-bridge/src/` | `LOCAL` | Yes | Defines the current handshake, transport, platform, Cardano Bridge, CIP-30, client, host, React, and testing behavior to simplify or remove. |
| `packages/mini-app-bridge/package.json` and `packages/runtime/` | `LOCAL` | Yes | Define direct-package and aggregate-runtime entry points and consumers that must be reduced to the new compact surface. |
| `packages/mini-app-bridge/test/bridge.test.ts` and `packages/runtime/test/xray.test.ts` | `LOCAL` | Yes | Define existing request correlation, validation, context, Cardano, CIP-30, React, and public-boundary behavior that must be retained where this instruction does not intentionally replace it. |
| `README.md` | `LOCAL` | Yes | Defines the current combined documentation to reduce to a basic example and links to adapter-focused guides. |

## Objective

Replace the session-handshake architecture with a compact, stateless, scope-versioned Mini App Bridge. Publish direct
named ESM exports `clientPlatformV1`, `clientCardanoV1`, `clientCardanoCip30V1`, `hostPlatformV1`, `hostCardanoV1`,
and `hostCardanoCip30V1`, plus direct React subpath exports `platformV1`, `cardanoV1`, and `cardanoCip30V1`; stamp
every request, response, and event with its scope and version; route or reject each message independently; add
`clientPlatformV1.getAccountType()` for active blockchain/network routing; and split detailed usage into focused
README guides. Implement only in `xray-js`; XRAY App and mini-app migrations remain later work.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Replace version-specific handshake envelopes with three generic validated wire envelopes: request, response, and event. Every envelope must carry a stable scope and version; requests additionally carry method, request ID, and payload; responses correlate by request ID and contain either result or a typed error; events carry event name and payload. Preserve host context on applicable responses/events. | This intentionally removes `xray.client.handshake`, `xray.host.handshake`, capability arrays, session selection, and the numeric global protocol version. Scope versions use public string literals such as `"v1"`. | `packages/mini-app-bridge/src/transport/**` and adapter contracts | Schema tests accept exact valid envelopes, reject malformed scope/version/method/result/error combinations, and prove response correlation plus context behavior. |
| C02 | Make transport stateless with respect to protocol selection. Client helpers stamp and filter one scope/version; host transport maintains at most one underlying message router per iframe window, registers scope/version handlers, publishes stamped events, validates the source window, and immediately returns `UNSUPPORTED_SCOPE_VERSION` or `UNSUPPORTED_METHOD` instead of allowing unsupported calls to time out. | Version marks are routing metadata, never trust or authorization. XRAY App remains responsible for user consent, origin policy, and operation authorization. Existing timeout behavior remains for hosts that fail to respond after accepting a supported method. | `packages/mini-app-bridge/src/transport/{client,host,errors,messages}.ts` | Tests prove exact stamping/filtering, one-router registration and cleanup, source-window rejection, concurrent correlation, immediate unsupported errors, timeout behavior, and no version lock or handshake dependency. |
| C03 | Organize each independently evolving interface as an adapter/version folder. Implement current `platform/v1`, `cardano/v1`, and `cardano-cip30/v1` contracts with thin client request/listen facades and host listen/publish facades. Keep Cardano Bridge and CIP-30 independently versioned; preserve their current non-handshake method inputs, results, context rules, and connector behavior. | Remove public protocol capability constants and the redundant `bridge` namespace. `clientCardanoV1.getTip()` replaces `client.cardano.bridge.getTip()`; `clientCardanoCip30V1` owns the CIP-30 connector. Do not create empty future adapters. | `packages/mini-app-bridge/src/adapters/{types,platform/v1,cardano/v1,cardano-cip30/v1}/**` | Focused adapter tests cover every retained platform, Cardano, and CIP-30 operation and prove exact scope/version ownership with no cross-scope parsing. |
| C04 | Add `clientPlatformV1.getAccountType()` returning `{ blockchain, network }` for the selected account or `null` when no account is selected, plus matching `hostPlatformV1` handling/publication and the `platformV1` React hook/listener. Use this value only for application routing; it must not grant capability or authorization. | Preserve accountless platform availability. Current Cardano context semantics remain; later blockchain adapters may extend the account-type values without changing platform transport mechanics. | `packages/mini-app-bridge/src/adapters/platform/v1/**` | Tests cover Cardano blockchain/network values, `null`, request/response correlation, account-type publications, and wrong-source/wrong-version rejection. |
| C05 | Replace configured factories, sessions, and grouped role objects with direct named module exports. Root exports exactly `clientPlatformV1`, `clientCardanoV1`, `clientCardanoCip30V1`, `hostPlatformV1`, `hostCardanoV1`, `hostCardanoCip30V1`, `BridgeError`, and required public types. Use static ESM namespace re-exports such as `export * as clientCardanoV1 from "./adapters/cardano/v1/client.js"`; adding a future version adds another direct export without editing existing v1 modules. Host exports provide compact listen/handle and publish operations over the shared router. | Remove `createClientSession`, `createHostSession`, grouped `client`/`host` objects and directories, adapter registry/selection exports, raw transport/schema exports, `/cardano`, and `/v1*` public subpaths. Do not manually construct eager namespace objects. | `packages/mini-app-bridge/src/index.ts`, package manifest, and runtime facade | Type/import audits prove the exact direct named root exports and absence of grouped or retired exports/subpaths; static references resolve to the correct adapter version; no v2 or unimplemented Ethereum export exists. |
| C06 | Replace handshake-gated React bindings with a separate `./react` entry that directly exports `platformV1`, `cardanoV1`, and `cardanoCip30V1`. Hooks lazily request initial values, subscribe only to their exact scope/version, share deduplicated external stores, expose loading/data/error/refresh state where remote data is involved, and clean up the final subscription. The CIP-30 connector hook must install idempotently. No `react` namespace, Provider, or bridge factory is required. | Remove `MiniAppProvider`, handshake/connection gating, grouped `react`, and generic global hooks whose adapter version is ambiguous. React remains an optional peer and must not load from the core entry. | `packages/mini-app-bridge/src/react/**` and each adapter's `react.ts` | Store, hook-boundary, and import tests/typechecks prove the exact direct React exports, initial loading, value/null/error distinction, refresh, exact-version event filtering, subscription cleanup, selected account routing, and idempotent connector installation. |
| C07 | Update testing utilities, direct-package tests, aggregate runtime facades, and runtime tests to the compact surface. Keep runtime `/mini-app-bridge`, `/mini-app-bridge/react`, and `/mini-app-bridge/testing`; remove the redundant runtime `/mini-app-bridge/cardano` entry because Cardano adapters are available from the direct named root and React exports. | This is an intentional public API break with no compatibility shims. The implementation must migrate every owned consumer in `xray-js` and leave XRAY App and external mini apps unchanged for later coordinated work. | `packages/mini-app-bridge/src/testing/**`, package tests, `packages/runtime/**`, and manifests | Clean builds and import audits load every retained direct/runtime entry, reject every retired subpath, and prove representative client, host, React, mock, Cardano, and CIP-30 behavior. |
| C08 | Reduce root `README.md` to a concise architecture summary and basic client/host/React examples, then link focused `README-PLATFORM.md`, `README-CARDANO.md`, and `README-CARDANO-CIP30.md` guides. Each focused guide documents its v1 client, host, wire scope, errors/events, and React surface. State that Ethereum EIP-1193 is a future naming example only and is not exported or supported. | Remove handshake, capability-check, old namespace, and retired subpath examples. Documentation must clearly defer XRAY App and mini-app migration and must not claim unsupported adapters. | `README.md`, `README-PLATFORM.md`, `README-CARDANO.md`, and `README-CARDANO-CIP30.md` | Documentation link/import scans pass, examples typecheck where practical, and stale-handshake/capability/retired-import scans find only explicit migration notes. |

## Target source structure

```text
packages/mini-app-bridge/src/
├── index.ts
├── transport/
│   ├── messages.ts
│   ├── client.ts
│   ├── host.ts
│   └── errors.ts
├── adapters/
│   ├── types.ts
│   ├── platform/
│   │   └── v1/
│   │       ├── contract.ts
│   │       ├── client.ts
│   │       ├── host.ts
│   │       └── react.ts
│   ├── cardano/
│   │   └── v1/
│   │       ├── contract.ts
│   │       ├── client.ts
│   │       ├── host.ts
│   │       └── react.ts
│   └── cardano-cip30/
│       └── v1/
│           ├── contract.ts
│           ├── client.ts
│           ├── host.ts
│           ├── connector.ts
│           └── react.ts
├── react/
│   ├── index.ts
│   ├── remote-store.ts
│   └── connector-store.ts
└── testing/
    ├── index.ts
    ├── events.ts
    ├── mock-client.ts
    └── mock-host.ts
```

Future adapters such as `ethereum-eip1193/v1` are added only with their real contract, client, host, connector, React,
tests, and documentation. This implementation must not create an empty directory, registry key, type-only promise, or
public export for them.

## Implementation steps

1. Capture current non-handshake platform, Cardano Bridge, CIP-30, context, correlation, connector, React-store, mock, and runtime-facade behavior as fixtures.
2. Define strict generic request/response/event envelopes and typed bridge errors with scope/version on every direction.
3. Refactor client and host transport around generic scoped request, listen, handle, response, error, and publish primitives; remove selection/session state.
4. Move current contracts into independent platform v1, Cardano v1, and Cardano CIP-30 v1 adapter folders and implement their thin client/host facades.
5. Add `platformV1.getAccountType()`, its host handler/publication, event listener, types, and accountless behavior.
6. Replace root exports with direct named client/host adapter namespaces and remove grouped role objects, obsolete handshake, registry, sessions, capability constants, raw public internals, and retired subpaths.
7. Replace Provider-based React with version-bound adapter hooks backed by lazy shared stores and an optional `./react` entry that does not affect the core bundle.
8. Update mocks, direct tests, runtime facade/tests, package export maps, and owned imports; remove obsolete source rather than retaining shims.
9. Split documentation into the concise root README and three focused guides, then audit every example and link.
10. Run focused package/runtime checks, type/import/schema/error/React/documentation audits, full repository validation, formatting, and diff checks.

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge`
- `npm test --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run build --workspace @xray-network/xray-js`
- `npm run typecheck --workspace @xray-network/xray-js`
- `npm test --workspace @xray-network/xray-js`
- `npm run check`
- `npm run format:check`
- Import the retained direct root, React, and testing entries plus retained aggregate runtime root, React, and testing entries; assert the exact direct named export surface and the absence of grouped `client`, `host`, and `react` objects.
- Assert retired direct `/cardano`, `/v1*`, aggregate `/mini-app-bridge/cardano`, and aggregate `/mini-app-bridge/v1*` paths reject imports.
- Assert every request, response, error, and event carries the exact adapter scope and string version; malformed or mismatched messages do not reach typed handlers/listeners.
- Assert unsupported scope/version and unsupported method requests receive immediate correlated typed errors, while accepted but unanswered methods retain timeout behavior.
- Assert `platformV1.getAccountType()` and its event distinguish `{ blockchain, network }`, `null`, loading, and error states without granting authorization.
- Assert React stores request lazily, deduplicate subscriptions, filter exact scope/version events, refresh, and clean up; assert the core entry does not import React.
- Scan owned source, tests, and documentation for handshake messages, protocol capability constants/lists, session factories, obsolete registry selection, Provider gating, and retired imports.
- Validate `README.md` links to `README-PLATFORM.md`, `README-CARDANO.md`, and `README-CARDANO-CIP30.md`, and that every guide's imports resolve.
- `git diff --check`

## Compatibility and human review

This implementation intentionally replaces the in-review handshake/session architecture and all earlier Mini App
Bridge public paths. There is no backward-compatibility layer. Every wire request, response, error, and event gains its
own scope/version mark, so an XRAY App host using the prior message families cannot communicate with this SDK until its
later migration.

The direct exports are the version selection: `clientCardanoV1` sends only `cardano/v1`, and `hostCardanoV1`
listens/publishes only `cardano/v1`. Multiple versions may coexist later as sibling named exports and host
registrations; there is no handshake, negotiation, capability list, fallback, or iframe-level version lock.

Human review must confirm that the XRAY App trust/permission system is the authority for opening mini apps and
authorizing operations. Scope/version values route schemas and handlers but never establish trust. The later XRAY App
implementation must validate iframe source and trusted origin, enforce permissions per operation, register every
supported versioned host scope, and return generic unsupported errors for unknown scopes/versions/methods.

## Completion criteria

- The core public API is limited to direct named versioned client/host exports, `BridgeError`, and necessary public types; React and testing remain isolated optional entries.
- `clientPlatformV1`, `clientCardanoV1`, and `clientCardanoCip30V1` expose the retained current methods without a handshake, configured factory, or grouped `client` object.
- `hostPlatformV1`, `hostCardanoV1`, and `hostCardanoCip30V1` register typed handlers and publish exact-version events through one shared router per iframe, without a grouped `host` object.
- Every message independently identifies its scope/version and receives a correlated result or typed error; unsupported routing never depends on timeout.
- `platformV1.getAccountType()` and its React hook/event return the active `{ blockchain, network }` or `null` and support account changes.
- The React subpath directly exports `platformV1`, `cardanoV1`, and `cardanoCip30V1`; its hooks are version-bound, lazy, deduplicated, cleanup-safe, and usable without a grouped `react` object, Provider, or bridge factory.
- Handshake, capability constants/lists, registry selection, session factories, redundant bridge/CIP-30 grouping, obsolete schemas, and retired public subpaths are removed rather than shimmed.
- Root and focused documentation accurately show the compact JavaScript, host, React, account-routing, Cardano, and CIP-30 APIs and link correctly.
- All focused, runtime, full repository, formatting, import, stale-contract, documentation, and diff validations pass.
- The eventual XRAY App and mini-app migration requirements are recorded without changing those repositories here.

## Out of scope

- Modifying XRAY App or any mini app.
- Implementing, exporting, stubbing, or documenting Ethereum EIP-1193, Bitcoin, Midnight, another blockchain, or any v2 adapter.
- Preserving old handshakes, message type families, capability lists, public schemas, configured factories, sessions, grouped role namespace objects, providers, or retired import paths.
- Treating scope/version metadata as user consent, origin trust, account authorization, wallet availability, or operation permission.
- Adding automatic version negotiation, fallback, highest-common-version selection, or iframe-level version locking.
- Changing Cardano or CIP-30 business behavior beyond the transport/public API restructuring and correlated typed-error normalization.
- Implementing XRAY App origin/permission policy inside this package.

## Blockers

None.
