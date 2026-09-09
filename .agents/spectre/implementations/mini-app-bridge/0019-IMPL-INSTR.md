# Mini App Bridge implementation 0019 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0019
Created: 20260909T071254Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

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

## Objective

Make bridge responses identifiable and explicit by updating the existing unreleased bridge contract in place. Keep `version: "v1"`, the current `V1` adapter exports and directories, and every package version unchanged. Use literal route metadata and one success/error outcome across the shared transport, with the standard external CIP-30 API projecting that outcome into its required values and exceptions.

Deliver the updated SDK contract, host utilities, optional React bindings, examples, and tests as one reviewable package change. Replace the old wire response and ambiguous null/throw behavior directly; do not retain parallel adapters, legacy codecs, fallback parsing, or compatibility aliases. The human explicitly confirmed that the library has not been released.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Update the existing strict request/response/event schemas and schema-derived adapter unions. Preserve literal scope, version, method/event, and payload relationships. | Replace the unreleased response format; retain all current version literals and names. | Mini App Bridge contracts and transport | Schema acceptance/rejection and TypeScript narrowing tests. |
| C02 | Update shared client transport to return one correlated `ok` outcome for replies and expected local failures; clean up listeners/timers on every completion path. | Replace ambiguous top-level nulls and thrown transport failures; preserve timeout durations. | Mini App Bridge client transport | Correlation, concurrent calls, malformed replies, missing host, timeout, send failure, and cleanup tests. |
| C03 | Update all existing host adapters to use the shared outcome and expose reusable protocol helpers for external relays. Validate request and response payloads with the same contracts. | One wire format and dispatch path; no legacy parser or dual-version support. | Mini App Bridge host transport and core exports | All three adapter routes, unsupported routes/methods, handler validation, and manual relay parity. |
| C04 | Update existing Platform and native Cardano clients, flatten native operation failures into the outer error branch, and adapt CIP-30 internally to the same transport. | Keep `clientPlatformV1`, `hostPlatformV1`, `clientCardanoV1`, `hostCardanoV1`, and both CIP-30 namespaces. External CIP-30 values/exceptions remain standard-shaped. | Mini App Bridge adapter modules | All methods, null data/context, native failure mapping, complete signed CBOR, and CIP-30 mapping tests. |
| C05 | Update existing React bindings to consume outcomes and expose complete interactive outcomes. | Keep current React export names and optional entry; one store per existing adapter value. | Mini App Bridge React adapters | Lazy subscriptions, stale results, account retries, cleanup, and interactive failure state. |
| C06 | Update existing mock clients/hosts and standalone/aggregate assertions to the new contract. | Replace old fixtures and assertions instead of retaining compatibility modes; runtime edits limited to directly affected tests. | Mini App Bridge testing utilities; incidental runtime tests | Package tests, aggregate tests, and compile-time fixtures. |
| C07 | Rewrite existing guides with the final request/response types, success/failure examples, error meanings, and coordinated prerelease consumer update requirements. | No version bump, old-version guide, or host-first dual-version rollout. | Mini App Bridge README guides | Compile documented examples and verify unchanged versions/export names. |

## Implementation steps

1. Update the existing schemas and derived types under the current source paths. Reuse stable domain schemas. Introduce no additional adapter-version directory or duplicated transport/store implementation.
2. Update client and host transport together, then all three adapters, so internal SDK host/client round trips use the same envelope. Remove obsolete response construction, parsing, and nested native result branches.
3. Expose one `protocol` namespace at the existing core entry for adapter contracts, envelope parsers, and typed response/event constructors. Reuse those helpers in SDK hosts. Existing runtime star re-exports expose it without another package or subpath.
4. Update existing React bindings, mock fixtures, and affected aggregate tests in place. Preserve optional React loading and checks against retired namespace aliases.
5. Rewrite the existing guides around the final API and execute the validation commands below.
6. Record implementation evidence only during a separately invoked implementation operation. This refinement keeps the existing instruction ID, Created timestamp, C01–C07 IDs, and PLANNED state.

### Message and SDK contract

Keep the existing message labels `xray.bridge.request`, `xray.bridge.response`, and `xray.bridge.event`; scope strings `platform`, `cardano`, and `cardano-cip30`; and `version: "v1"` on every adapter. Leave package manifest version numbers and lockfile version metadata unchanged.

Requests contain exactly `type`, `scope`, `version`, `method`, `requestId`, and `payload`. Existing request payloads and convenience arguments remain, including `payload: null` for parameterless requests.

Responses contain `type`, `scope`, `version`, `method`, and `requestId`, plus exactly one branch:

- Success: `ok: true`, `payload`, and `context`.
- Failure: `ok: false` and `error: { code, message, data? }`, without success payload/context fields.

Use `payload` consistently on the wire and public responses. Replace wire `result` and the old success/error envelopes; do not accept both formats. Internal schema field names need not be renamed when they are not part of the wire or public API.

Platform and native Cardano client methods return the same envelope shape through `Promise<Response>`, with schema-inferred literals and data types. Local failures carry metadata from the attempted call but are not posted as host messages. Events keep their label, scope, version, `event`, `payload`, and `context`; they have no request ID or `ok` field. Public event values retain route metadata.

Export namespace types such as `clientPlatformV1.Request<"getTheme">` and `clientPlatformV1.Response<"getTheme">`. Omitting the method yields a mapped union over methods. Provide equivalent native Cardano and host types and event unions. Cross-adapter collections must narrow by scope, method, and `ok` to the matching payload without casts or unrelated method/payload unions. CIP-30 host/protocol types describe the shared envelope; its public wallet methods continue to return standard wallet values.

```ts
type GetThemeRequest = clientPlatformV1.Request<"getTheme">
type GetThemeResponse = clientPlatformV1.Response<"getTheme">

const request: GetThemeRequest = {
  type: "xray.bridge.request",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId: "req-123",
  payload: null,
}

const response: GetThemeResponse = {
  type: "xray.bridge.response",
  scope: "platform",
  version: "v1",
  method: "getTheme",
  requestId: "req-123",
  ok: true,
  payload: "dark",
  context: null,
}

const signed = await clientCardanoV1.signTx(unsignedCbor)
if (signed.ok) {
  console.log(signed.payload.cbor)
} else {
  console.error(signed.error.code, signed.error.message)
}
```

### Failure semantics

Extend the existing closed bridge error-code schema: retain the five existing codes and add `HOST_UNAVAILABLE`, `TIMEOUT`, `TRANSPORT_ERROR`, `USER_REJECTED`, and `OPERATION_FAILED`.

- Missing browser/parent host: `HOST_UNAVAILABLE`.
- Invalid caller payload: `INVALID_REQUEST` as an outcome, not a synchronous throw.
- `postMessage` failure: `TRANSPORT_ERROR`, with listener/timer cleanup.
- Deadline exceeded: `TIMEOUT`; preserve 5-second request and 120-second interactive defaults. A timeout does not establish whether an operation executed. Never automatically retry signing/submission.
- A message from the expected source with matching response type, scope, version, and request ID but invalid envelope/method/payload/context/error: complete immediately with `INVALID_RESPONSE`.
- Unrelated sources, message kinds, routes, or IDs: ignore. Duplicate/late replies cannot settle another call.
- Valid host failure: preserve code/message/data. Unexpected handler throws become `HOST_ERROR` without stacks or uncloneable values.
- Explicitly identified native user refusal: `USER_REJECTED`. Other known native operation failures: `OPERATION_FAILED`. Do not infer refusal from human-readable strings.

Native `signTx` success payload is `{ hash, cbor }`; `submitTx` and `signAndSubmitTx` use `{ hash }`; `signData` uses `{ data }`. Remove their nested `success`/error branches. Keep native complete-transaction signing distinct from CIP-30 witness-set signing.

Preserve domain semantics: account `balanceStatus: "error"` is a successfully delivered snapshot, and `ok: true, payload: null` is a valid absent account/tip. Neither is a transport failure. Platform context may be null; Cardano success context remains required.

The CIP-30 adapter consumes the shared response: on `ok: true`, return the standard payload; on failure carrying validated CIP-30 `{ code, info }` data, throw the corresponding CIP-30 exception; otherwise throw `BridgeError` with the actual bridge code/message/data. Preserve connector installation and authorization behavior. This projection implements the external wallet API; it does not preserve an obsolete bridge format.

### Host and React behavior

All existing `handle` handlers return `{ ok: true, payload, context }` or `{ ok: false, error }`, synchronously or asynchronously. The transport supplies correlation metadata. Manual `respond` accepts and validates the same outcome shape. Keep `listen` and `publish`; shared `protocol` helpers follow the same validation paths. Preserve numeric CIP-30 exception serialization through bridge error data.

Platform `routeChanged` remains a send-only boolean convenience. Document that the boolean indicates sending, not host acceptance. It uses the request envelope without a pending response; unsolicited acknowledgements are ignored.

Read hooks retain `{ data, loading, error, refresh }`, map success payloads to data, and expose failure code/message/data through error. Preserve the platform status projection, lazy subscriptions, stale-response suppression, and account retry schedule. Interactive hooks resolve to and store the complete response union in `result`; failed outcomes also populate `error`, without an additional thrown-error path. Keep existing `platformV1`, `cardanoV1`, and `cardanoCip30V1` React exports. No parallel stores or Provider are needed.

### Prerelease compatibility boundary

This is an intentional in-place change to an unreleased contract. Existing host/client code using old envelopes must be updated; there is no backward-compatibility obligation for those envelopes. Remove legacy response parsing, old mock behavior, and stale examples rather than retaining fallbacks or aliases. Keep version metadata and existing adapter naming exactly as they are.

Document that XRAY App and local mini-app consumers must adopt the same envelope and outcome handling before the SDK is released or used together with them. The separate XRAY App implementation should import the shared protocol helpers, update all three scope handlers/publications, and preserve its origin, trust, account, and authorization enforcement. Consumers retain their current imports and change response handling. No staged dual-version deployment, version negotiation, or legacy fallback is part of that update.

This record owns the SDK package and incidental aggregate export tests. XRAY App and consumer source edits remain separately owned work; completing the SDK record must not claim that those consumers already use the new contract.

## Validation

Run from the `xray-js` repository root during implementation:

```sh
npm run check
npx --no-install prettier --check packages/mini-app-bridge/src packages/mini-app-bridge/test packages/mini-app-bridge/README*.md packages/runtime/test/xray.test.ts
```

The root `check` builds all workspaces before tests/typechecks so package exports use current declarations. No new dependency is required. Add compile-time fixtures to the existing bridge test project, with expected errors for method/payload mismatches and wrong-branch property access.

Required cases: all three adapters using the single updated envelope; concurrent/out-of-order calls including two identical methods; exact route/method correlation; malformed and unrelated replies; missing host versus timeout versus valid null; postMessage failure cleanup; handler response validation; native refusal/operation failures; standard CIP-30 values and exception mapping; complete signed transaction versus witness set; events, lazy stores, account retries and cleanup; and bigint account round trips without JSON serialization.

Replace tests that assert obsolete null/throw or nested native success behavior. Add negative schema tests rejecting old result envelopes and missing discriminators; do not keep legacy parsing modes. Compile the documented examples through both standalone and aggregate exports. Confirm existing V1 namespace names and all wire/package version values are unchanged, with no new version directories/exports. Core imports must keep React optional.

For this plan refinement, validate record/ledger identity, schema, evidence, existing local inputs, links, unique Change IDs, unchanged creation timestamp, absence of a result, and unchanged source/archive/version bytes. Do not run or claim implementation tests during planning.

## Compatibility and human review

Review the final fields and error codes and the in-place prerelease change under existing names. The human's no-version-change instruction supersedes the initial parallel-version design. Preserve external CIP-30 behavior while changing its internal wire envelope. Coordinate downstream source updates before release or combined use; passing SDK tests does not establish XRAY App readiness or accept this record.

## Completion criteria

- Every C01–C07 requirement has implementation and validation evidence in the eventual result.
- Responses narrow by scope, method, and outcome and identify the operation when logged.
- Expected native/Platform failures use one explicit outcome with no ambiguous top-level null or nested native success flag.
- One shared wire contract covers all adapters; host and client validation reuse schemas.
- Existing adapter names, version literals, package versions, and export subpaths remain unchanged.
- Obsolete envelopes, compatibility fallbacks, and stale examples are removed.
- External CIP-30 values/exceptions and domain readiness semantics are verified.
- Existing optional React/testing entries use the updated contract without parallel implementations.
- Required commands pass and examples compile; actual limitations/deviations are recorded.
- Documentation identifies separately required XRAY App/consumer updates without claiming they are complete.

## Out of scope

- Product implementation during this plan refinement.
- XRAY App/consumer source edits, deployment, publishing, or release/version metadata changes.
- New adapter versions, renamed V1 namespaces, dual codecs, compatibility aliases, or old-envelope fallback.
- Changing the external CIP-30 wallet API.
- Handshake/session/capability negotiation, global factories, generic plugin registries, or automatic wallet-operation retries.
- Independent origin-configuration redesign; preserve current checks and app-owned enforcement.
- Domain account readiness or remote-store state model redesign.
- New SPECTRE record identities, lifecycle transitions, or terminal-history changes.

## Blockers

None for this bounded SDK implementation. Coordinated XRAY App/consumer updates are required before release or combined use of the updated SDK.
