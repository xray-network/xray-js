# Mini App Bridge implementation 0012 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0012
Created: 20260819T063643Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request dated 2026-08-19 | `LOCAL` | Yes | Requires client-selected iframe protocol versions, rewrites the current v1 handshake request payload as `{ protocolVersion: 1 }`, preserves v1 as an SDK-owned version, and leaves v2 for a later implementation. |
| `packages/mini-app-bridge/src/` | `LOCAL` | Yes | Defines the current unversioned transport, platform, Cardano Bridge, CIP-30, client, host, React, and testing implementation to organize behind a v1 adapter. |
| `packages/mini-app-bridge/package.json` and `packages/runtime/` | `LOCAL` | Yes | Define direct-package and aggregate-runtime public entry points that must expose the explicit v1 surface. |
| `packages/mini-app-bridge/test/bridge.test.ts` | `LOCAL` | Yes | Defines current contract, namespace, request correlation, React ordering, context, and Cardano/CIP-30 behavior to retain apart from the declared handshake change. |
| `README.md` | `LOCAL` | Yes | Defines the published JavaScript, host, Cardano, CIP-30, and React usage that must document version selection and migration. |

## Objective

Version the Mini App Bridge protocol around one complete SDK-owned v1 adapter, require the v1 client handshake request payload to be `{ protocolVersion: 1 }`, select and lock that exact version for subsequent client/host listen and send operations, and establish public v1 entry points plus a registry where a separately designed v2 can be added later without changing v1.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Define a shared `BridgeProtocolVersion`, version-adapter contracts, exact-version registry, and handshake-version parser. Register only version `1`; return no adapter for absent, malformed, or unsupported versions. | The request `{ type: "xray.client.handshake", payload: null, requestId }` is intentionally removed. A v1 request is valid only when its payload is exactly `{ protocolVersion: 1 }`. The existing v1 handshake response remains `{ protocolVersion: 1, protocols }`. | `packages/mini-app-bridge/src/protocol/{types,registry,handshake}.ts` | Focused schema tests accept the exact v1 payload and reject `null`, missing, non-integer, and unsupported versions. |
| C02 | Move the current envelope/context, platform, Cardano Bridge, and CIP-30 wire contracts and their version-specific client/host codecs under `src/protocol/v1/`, with an `adapter.ts` assembling the complete v1 surface. Keep generic window resolution, request IDs, timeouts, event subscription, and `postMessage` mechanics outside the version directory and inject/use the selected adapter there. Remove duplicate unversioned wire-contract owners after imports migrate. | Preserve all current v1 message names, non-handshake payload schemas, response correlation, nullable platform context, strict Cardano context, capability strings, CIP-30 behavior, and host response shapes. Only the client handshake payload changes. | `packages/mini-app-bridge/src/protocol/v1/**`, shared transport, and migrated internal imports | Package build/typecheck and v1 fixture tests prove exact schemas and behavior; stale-owner audit finds no second source of v1 wire contracts. |
| C03 | Add a client session/factory that is created with one pointed protocol version, sends that adapter's handshake, and thereafter delegates every request and host-message listener to the same locked adapter. Keep the existing root `client` namespace bound to v1. | A session cannot change versions after its handshake begins or mix parsers/senders. Existing root client method names and Cardano/CIP-30 behavior remain v1, but their handshake now sends the explicit payload. | `packages/mini-app-bridge/src/client/**` and `src/protocol/v1/**` | Tests inspect the emitted handshake payload, prove all later sends/listeners use v1, and prove unsupported client versions fail before posting ordinary requests. |
| C04 | Add a host session/factory that resolves the exact client-requested version from the handshake through the registry, locks the iframe session to that adapter, and delegates subsequent listen/send operations to it. Keep the existing root `host` namespace as the explicit v1 host surface for callers that do not use dynamic session selection. | Do not infer a version from later messages, silently fall back to v1, or switch an established session. Existing v1 host helper names, context requirements, and payloads remain unchanged. | `packages/mini-app-bridge/src/host/**` and `src/protocol/v1/**` | Tests prove exact v1 selection, unsupported-version rejection, same-session listen/send routing, and mixed/unselected message rejection. |
| C05 | Publish v1 explicitly from the direct package and aggregate `@xray-network/xray-js` facade, including the framework-free bridge, Cardano contracts, React bindings, and testing utilities, while keeping today's root, `/cardano`, `/react`, and `/testing` entries bound to the same v1 implementation. Do not create empty v2 modules or advertise v2 support. | Existing import paths keep resolving to v1; explicit v1 paths provide a stable non-moving contract. Adding v2 later must create a sibling `protocol/v2` adapter and new public v2 entries without editing v1. | `packages/mini-app-bridge/src/**`, both package manifests, and `packages/runtime/src/mini-app-bridge*.ts` | Export/import audit loads legacy and explicit v1 paths, compares their public operations/constants, and confirms no v2 export exists. |
| C06 | Update mocks, contract tests, and documentation for explicit client-selected v1, the version-locked session lifecycle, the v1 directory/export contract, and the required downstream host migration. | Documentation must call out that SDKs/hosts expecting a null handshake are not compatible with this revised v1 request and that `xray-app` must adopt its matching v1 adapter before release. Do not claim protocol negotiation or v2 support. | `packages/mini-app-bridge/src/testing/**`, package tests, and `README.md` | Mock and contract tests assert `{ protocolVersion: 1 }`; documentation examples compile/typecheck and stale `payload: null` scans pass. |

## Target source structure

```text
packages/mini-app-bridge/src/
├── protocol/
│   ├── types.ts
│   ├── registry.ts
│   ├── handshake.ts
│   └── v1/
│       ├── index.ts
│       ├── adapter.ts
│       ├── transport/
│       │   ├── envelope.ts
│       │   └── context.ts
│       ├── platform/
│       │   ├── protocol.ts
│       │   ├── client.ts
│       │   └── host.ts
│       └── cardano/
│           ├── protocol.ts
│           ├── client.ts
│           ├── host.ts
│           └── cip30/
│               ├── protocol.ts
│               ├── client.ts
│               └── host.ts
├── transport/                 # version-neutral postMessage mechanics
├── client/                    # selected-version client session and v1 facade
├── host/                      # selected-version host session and v1 facade
├── react/                     # v1-backed current React surface
├── testing/                   # v1-backed current mocks plus version fixtures
└── index.ts
```

The implementation may split an indicated file where TypeScript ownership requires it, but it must preserve these ownership boundaries: wire schemas/codecs live under `protocol/v1`, transport mechanics do not own a protocol version, and the registry is the sole dynamic version lookup.

## Implementation steps

1. Capture the current platform, Cardano Bridge, CIP-30, envelope, context, client, host, React, and mock behavior as v1 contract fixtures before moving source.
2. Define the shared version/adapter/session contracts and an exact registry containing only v1.
3. Relocate the current wire schemas and version-specific codecs into `protocol/v1`, update the handshake request schema to the exact `{ protocolVersion: 1 }` object, and assemble the v1 adapter.
4. Refactor generic client and host transport/session code to select once and delegate through the adapter while retaining the root client/host namespaces as v1.
5. Migrate React and testing imports to the v1-backed public/session surface without duplicating protocol definitions.
6. Add direct-package and aggregate-runtime explicit v1 entry points and verify current entries resolve to the same implementation.
7. Update README client, host, React, and migration examples, including the required matching `xray-app` change.
8. Run focused package tests, export audits, full repository validation, formatting, stale-path/payload scans, and diff checks.

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge`
- `npm test --workspace @xray-network/xray-js-mini-app-bridge`
- `npm run build --workspace @xray-network/xray-js`
- `npm run typecheck --workspace @xray-network/xray-js`
- `npm test --workspace @xray-network/xray-js`
- `npm run check`
- `npm run format:check`
- Import every retained and explicit v1 direct-package and aggregate-runtime entry and confirm equivalent v1 constants, schemas, client/host operations, React exports, and testing utilities.
- Assert the first root/v1 client message is `{ type: "xray.client.handshake", payload: { protocolVersion: 1 }, requestId: <string> }` and that `payload: null` does not parse.
- Assert a host session selects only registered version 1, remains locked for its lifetime, and rejects unselected, unsupported, or mixed-version traffic.
- Scan owned source, tests, and documentation for stale null-handshake examples and duplicate unversioned wire-schema owners.
- `git diff --check`

## Compatibility and human review

This is an intentional breaking revision of the current v1 client handshake request: `payload: null` becomes `payload: { protocolVersion: 1 }`, with no null alias or fallback. Every other current v1 wire message, response, context, capability, and SDK operation must remain semantically unchanged.

Existing root SDK entry points remain the v1 API, and explicit v1 entries make that ownership permanent. Version selection is exact rather than negotiated: the client points to one version, the host resolves that registered adapter, and both sides use it for the complete iframe session.

Human review must confirm the explicit handshake break is intended and coordinate a separate `xray-app` host plan before publishing or deploying the revised SDK. That host must recognize the explicit v1 request and lock its transport/publications/blockchain handlers to its own v1 adapter. An old host that only accepts the null request will not connect to the revised client.

## Completion criteria

- The only valid v1 client handshake payload is `{ protocolVersion: 1 }`, and the response continues to report version 1 and advertised capabilities.
- All current wire schemas/codecs have one authoritative owner under `protocol/v1`.
- Client and host sessions select a registered version exactly once and route all later listen/send behavior through it.
- Current public entry points and explicit v1 entry points expose the same working v1 SDK surface.
- No v2 implementation or advertisement exists, but a future `protocol/v2` sibling and registry row can be added without editing v1.
- Package, runtime facade, mocks, tests, documentation, full repository checks, formatting, and diff validation pass.
- The result records the downstream `xray-app` host migration as required before release.

## Out of scope

- Implementing, specifying, stubbing, or advertising protocol v2.
- Negotiating a highest common version, accepting a version list, or silently falling back between versions.
- Retaining `payload: null` as a v1 handshake alias.
- Modifying the `xray-app` repository in this implementation.
- Changing non-handshake platform, Cardano Bridge, or CIP-30 wire names, schemas, contexts, capability identifiers, authorization, or business behavior.
- Adding iframe-origin policy to SDK wildcard helpers; the embedding host remains responsible for its trusted target origin.
- Changing React product behavior or adding separate duplicated React hooks per protocol version.

## Blockers

None.
