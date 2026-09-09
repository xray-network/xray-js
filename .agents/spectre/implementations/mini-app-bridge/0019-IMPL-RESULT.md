# Mini App Bridge implementation 0019 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0019
Instruction: ./0019-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | IMPLEMENTED | Existing envelopes now use method/route metadata and an explicit ok union. Adapter Request/Response/Event aliases preserve method-specific payloads. | Strict schema rejection tests; cross-adapter compile-time narrowing and negative method/payload assertions. |
| C02 | IMPLEMENTED | Shared client returns correlated outcomes for absent host, invalid request, timeout, send failure, and malformed replies. Terminal paths remove listeners and timers. | Out-of-order identical-method calls, unrelated/invalid replies, null versus failure, and cleanup tests. |
| C03 | IMPLEMENTED | All host adapters use validated outcomes; protocol exports shared contracts, parsers, and response/event constructors. | Manual/automatic relay parity, host validation, route errors, and real client/host round trips for all three scopes. |
| C04 | IMPLEMENTED | Existing native and Platform clients retain their names and expose full outcomes. Native signing results are flat. CIP-30 unwraps success and throws standard wallet or bridge errors. | All existing methods, full signed CBOR versus witness set, refusal/operation error mapping, and CIP-30 tests. |
| C05 | IMPLEMENTED | Existing read hooks consume structured failures; interactive hooks retain/resolve the full outcome and populate error for failed outcomes. | Read-store error projection, interactive transition test using actual signing calls, existing subscription/readiness/retry/stale-result tests. |
| C06 | IMPLEMENTED | Existing mock envelopes, native result fixtures, and aggregate export assertions updated in place. Added behavioral and compile-time coverage. | Root workspace check: 70 passing tests, no failures, one existing optional live-endpoint test skipped. |
| C07 | IMPLEMENTED | Rewrote the four existing guides with final types, host helpers, errors, React behavior, and prerelease consumer-update requirements. | All 13 exact TS/TSX README blocks extracted and typechecked; required Prettier check passed. |

## Outcome

The existing unreleased bridge now uses one response format across all adapter routes. Every response identifies its scope, version, method, and request ID and carries either a success payload/context or a structured error. Native callers inspect `ok`; timeout and absent-host outcomes no longer collapse into null. Matching malformed replies fail immediately. Events retain route metadata.

The wire literal remains `v1`, adapter directories and V1 namespace names remain unchanged, and every package manifest and lockfile is unchanged. No legacy parser, dual codec, new adapter version, package dependency, or release was added. The external CIP-30 wallet API retains its standard values and exceptions while using the updated internal envelope.

## Inputs consumed


All paths below are repository-root-relative. The existing source defines the unreleased implementation to update in place; archived results are sequence history, not normative implementation inputs.

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human request in this conversation: “Show please example to request / response data type”; “Analyze bridge iframe sdk and suggest improvements”; “Okay, prepare $spectre plan” | `LOCAL` | Yes | Make responses distinguishable while keeping the SDK small; authorize planning only. |
| Human clarification: “Revise using $spectre : don't update versioning, as lib not released yet” | `LOCAL` | Yes | Keep all current wire/package versions and adapter names; replace the unreleased contract directly without parallel versions or compatibility fallbacks. |
| `AGENTS.md` | `LOCAL` | Yes | Repository authority and lifecycle boundaries. |
| `README.md` | `LOCAL` | Yes | Workspace ownership and supported package boundaries. |
| `package.json` | `LOCAL` | Yes | Build, test, typecheck, and formatting commands. |
| `tsconfig.base.json` | `LOCAL` | Yes | Strict TypeScript and module settings. |
| `packages/mini-app-bridge/package.json` | `LOCAL` | Yes | Public exports, optional React entry, dependencies, and test commands. |
| `packages/mini-app-bridge/tsconfig.json` | `LOCAL` | Yes | SDK compilation boundary. |
| `packages/mini-app-bridge/test/tsconfig.json` | `LOCAL` | Yes | Runtime and compile-time test discovery. |
| `packages/mini-app-bridge/src/adapters/types.ts` | `LOCAL` | Yes | Schema-derived method, response, event, and host types. |
| `packages/mini-app-bridge/src/transport/messages.ts` | `LOCAL` | Yes | Strict v1 wire envelopes and error codes. |
| `packages/mini-app-bridge/src/transport/client.ts` | `LOCAL` | Yes | Correlation, validation, timeouts, notifications, and listeners. |
| `packages/mini-app-bridge/src/transport/host.ts` | `LOCAL` | Yes | Shared host router, registration, handlers, manual responses, and events. |
| `packages/mini-app-bridge/src/transport/errors.ts` | `LOCAL` | Yes | Existing BridgeError and CIP-30 error serialization. |
| `packages/mini-app-bridge/src/adapters/platform/v1/contract.ts` | `LOCAL` | Yes | Platform operations, events, identity, and nullable account context. |
| `packages/mini-app-bridge/src/adapters/platform/v1/client.ts` | `LOCAL` | Yes | Direct client API and notification behavior. |
| `packages/mini-app-bridge/src/adapters/platform/v1/host.ts` | `LOCAL` | Yes | Direct host API. |
| `packages/mini-app-bridge/src/adapters/platform/v1/react.ts` | `LOCAL` | Yes | Lazy stores and platform status projection. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/contract.ts` | `LOCAL` | Yes | Native data schemas, readiness states, and operation results. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/client.ts` | `LOCAL` | Yes | Native method signatures and interactive timeouts. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/host.ts` | `LOCAL` | Yes | Native host method and event surface. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/react.ts` | `LOCAL` | Yes | Account retries and interactive hooks. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/contract.ts` | `LOCAL` | Yes | Preserve CIP-30 method payloads while adopting the shared response envelope. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/host.ts` | `LOCAL` | Yes | Update CIP-30 host outcomes with the same shared transport. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/react.ts` | `LOCAL` | Yes | Verify the existing connector hook stays connected to the updated adapter. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/client.ts` | `LOCAL` | Yes | Preserve external CIP-30 values, exceptions, and connector behavior. |
| `packages/mini-app-bridge/src/react/remote-store.ts` | `LOCAL` | Yes | Existing subscription, stale-response, refresh, and retry behavior. |
| `packages/mini-app-bridge/src/index.ts` | `LOCAL` | Yes | Direct core namespace exports. |
| `packages/mini-app-bridge/src/react/index.ts` | `LOCAL` | Yes | Direct optional React namespace exports. |
| `packages/mini-app-bridge/src/testing/index.ts` | `LOCAL` | Yes | Testing entrypoint and mocks to update with the contract. |
| `packages/mini-app-bridge/src/testing/mock-client.ts` | `LOCAL` | Yes | Mock wire parsing and collected responses. |
| `packages/mini-app-bridge/src/testing/mock-host.ts` | `LOCAL` | Yes | Mock routing, operation fixtures, events, and failures. |
| `packages/mini-app-bridge/src/testing/events.ts` | `LOCAL` | Yes | Message-event test injection. |
| `packages/mini-app-bridge/test/bridge.test.ts` | `LOCAL` | Yes | Existing request, error, event, React, and export regression coverage. |
| `packages/mini-app-bridge/test/cardano-sign-tx-contract.test.ts` | `LOCAL` | Yes | Complete signed transaction versus witness-only compatibility. |
| `packages/mini-app-bridge/test/account-state-contract.test.ts` | `LOCAL` | Yes | Preserve domain readiness discrimination and nullable account data. |
| `packages/mini-app-bridge/README.md` | `LOCAL` | Yes | Current architecture and examples. |
| `packages/mini-app-bridge/README-PLATFORM.md` | `LOCAL` | Yes | Platform API documentation to rewrite for the updated contract. |
| `packages/mini-app-bridge/README-CARDANO.md` | `LOCAL` | Yes | Native operations and React behavior documentation. |
| `packages/mini-app-bridge/README-CARDANO-CIP30.md` | `LOCAL` | Yes | Preserve separately versioned CIP-30 semantics. |
| `packages/runtime/package.json` | `LOCAL` | Yes | Existing aggregate re-export and validation boundaries. |
| `packages/runtime/src/mini-app-bridge.ts` | `LOCAL` | Yes | Existing automatic core re-export. |
| `packages/runtime/src/mini-app-bridge-react.ts` | `LOCAL` | Yes | Existing automatic React re-export. |
| `packages/runtime/src/mini-app-bridge-testing.ts` | `LOCAL` | Yes | Existing automatic testing re-export. |
| `packages/runtime/test/xray.test.ts` | `LOCAL` | Yes | Aggregate export assertions affected by the shared protocol helpers. |

## Project changes

Paths are repository-root-relative. Product changes are confined to the bridge package and its aggregate export test:

- `packages/mini-app-bridge/README-CARDANO-CIP30.md`
- `packages/mini-app-bridge/README-CARDANO.md`
- `packages/mini-app-bridge/README-PLATFORM.md`
- `packages/mini-app-bridge/README.md`
- `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/client.ts`
- `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/host.ts`
- `packages/mini-app-bridge/src/adapters/cardano/v1/client.ts`
- `packages/mini-app-bridge/src/adapters/cardano/v1/contract.ts`
- `packages/mini-app-bridge/src/adapters/cardano/v1/host.ts`
- `packages/mini-app-bridge/src/adapters/cardano/v1/react.ts`
- `packages/mini-app-bridge/src/adapters/platform/v1/client.ts`
- `packages/mini-app-bridge/src/adapters/platform/v1/host.ts`
- `packages/mini-app-bridge/src/adapters/platform/v1/react.ts`
- `packages/mini-app-bridge/src/adapters/types.ts`
- `packages/mini-app-bridge/src/index.ts`
- `packages/mini-app-bridge/src/protocol.ts`
- `packages/mini-app-bridge/src/react/interactive.ts`
- `packages/mini-app-bridge/src/testing/mock-client.ts`
- `packages/mini-app-bridge/src/testing/mock-host.ts`
- `packages/mini-app-bridge/src/transport/client.ts`
- `packages/mini-app-bridge/src/transport/errors.ts`
- `packages/mini-app-bridge/src/transport/host.ts`
- `packages/mini-app-bridge/src/transport/messages.ts`
- `packages/mini-app-bridge/src/transport/protocol.ts`
- `packages/mini-app-bridge/test/bridge.test.ts`
- `packages/mini-app-bridge/test/cardano-sign-tx-contract.test.ts`
- `packages/mini-app-bridge/test/interactive.test.ts`
- `packages/mini-app-bridge/test/response-contract.test.ts`
- `packages/mini-app-bridge/test/response-types.ts`
- `packages/runtime/test/xray.test.ts`

The existing instruction is unchanged. This operation adds this result and changes only the corresponding root ledger row from PLANNED to REVIEW. Runtime/protocol governance files and archived records remain unchanged.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Responses identify their operation and call and discriminate success from failure. | In-place replacement of the unreleased response format; version metadata unchanged. | Use method-specific types and branch on ok before reading payload/error. |
| C02 | Missing host, timeout, invalid input/reply, and send failure have distinct error codes. | Platform/native calls resolve expected failures; successful absent values remain nullable payloads. | Replace top-level null checks and expected-error catches with outcome handling; do not retry signing/submission after timeout. |
| C03 | Host handlers and manual responses use the same validated outcome; reusable protocol helpers are exported. | Old result envelopes are rejected; current host namespace names stay the same. | Update handlers and relays, and share SDK schemas instead of handwritten envelopes. |
| C04 | Native operation success has flat data; external CIP-30 behavior remains standard-shaped. | Native payload.success/error removed; complete native transaction and CIP-30 witness semantics preserved. | Read signed transaction hash/CBOR directly after ok; report operation failures through the outer error branch. |
| C05 | Interactive React actions resolve/store complete outcomes and expose structured failure state. | Existing hook names and read-store shape retained. | Read interactive result.ok and result.payload; retain existing readiness handling for account snapshots. |
| C06 | Mocks represent the new wire format and explicit failures. | No compatibility mode for old fixtures. | Update local fixtures; use mock.fail for host failures. |
| C07 | Documentation describes the final contract and the prerelease update boundary. | Imports and versions stay the same; wire consumers must be updated together. | Align XRAY App and mini-app handling before release or combined use. |

## Validation

Final checks completed on 2026-09-09 from the xray-js repository root:

| Check | Outcome |
| --- | --- |
| `npm run check` | PASS: all workspace builds and typechecks; Cardano 31 passed / 1 skipped, bridge 36 passed, aggregate runtime 3 passed; no failures. |
| `npx --no-install prettier --check packages/mini-app-bridge/src packages/mini-app-bridge/test packages/mini-app-bridge/README*.md packages/runtime/test/xray.test.ts` | PASS. |
| Extract all TS/TSX blocks from the four bridge README files into independent modules under the ignored `.test-dist/docs-check` directory, then run `tsc --noEmit` via its generated configuration extending the root configuration | PASS: 13 exact documented code blocks compile. |
| Node module-loader guard rejecting any React import while importing standalone and aggregate core entries | PASS: both core entries import without loading React. |
| SHA-256 comparison against the pre-implementation manifest/lockfile/instruction/archive baseline; adapter-directory and wire-version inspection | PASS: unchanged versions, unchanged instruction and history, only v1 adapter directories. |
| `git diff --check` | PASS. |

The skipped test is the existing optional live XRAY Cardano endpoint query. No live service check, browser rendering test, XRAY App test, or consumer test is claimed. The interactive test executes the asynchronous transition used by the hook with actual client calls and checks pending/result/error values; existing remote-store tests cover subscriptions, stale responses, and retries.

Earlier focused runs exposed expected old-envelope test assertions and one test importing a separate source transport instance; those tests were corrected. Final required checks all pass.

## Deviations from instruction

No material objective, versioning, ownership, or compatibility deviation. A small internal interactive runner isolates the existing hook's asynchronous outcome transition for deterministic tests; it introduces no public API or alternative store. Send-only route notifications return false for validation/send failures, consistently with their boolean send-status contract.

## Remaining human review

Review the response fields/error codes and the intentional in-place prerelease API change. XRAY App and consumer mini apps still require separately owned source updates before release or combined use; this result does not claim their migration. App-owned origin/trust/account/authorization checks remain a downstream responsibility.

The record is REVIEW and awaits an explicit human decision. It is not accepted, published, or deployed.

## Reproducibility

Use the repository's existing Node/npm requirements and lockfile; no dependency changes are needed. `npm run check` builds packages before running tests and compile-time fixtures, including the aggregate entry. Run the formatting command above afterward. Recreate the README check by extracting each fenced ts/tsx block as a separate module with `export {}` and compiling under the root strict settings with `noEmit` and `jsx: react-jsx`.

Build and test output is generated in the existing ignored dist/.test-dist locations. The implementation was not committed or published by this operation.
