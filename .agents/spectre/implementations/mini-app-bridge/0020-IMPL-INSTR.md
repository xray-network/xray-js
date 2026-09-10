# Mini App Bridge implementation 0020 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0020
Created: 20260909T073948Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

All paths are repository-root-relative. The human's “Plan this with $spectre” selects the cleanup proposed for the current owned working-tree implementation, including its locally added files. Use that source directly as the local baseline. This record does not consume `0019`'s result as accepted evidence: `0019` remains `REVIEW`, and its instruction, result, and decision row must remain untouched. Archived records establish sequence history only. Planning does not authorize implementation or acceptance.

Input paths describe the source before consolidation. During implementation, resolve moved inputs through the destination mapping below; deleting a replaced source file is an intended change, not a missing prerequisite. Material changes to the selected baseline or scope require instruction revision.

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human request: “Analyze how we can minify code as possible and make it super clean for human understanding, can we use not cluttered and non inherited types, cleaner folder structure and small count of file as possible” | `LOCAL` | Yes | Reduce navigation and type indirection while preserving readable source and behavior. |
| Human request: “Plan this with $spectre”, selecting the preceding 17-file cleanup proposal | `LOCAL` | Yes | Authorize this bounded plan against the current working-tree source. |
| Human requirement: “don't update versioning, as lib not released yet” | `LOCAL` | Yes | Keep package versions, wire v1, runtime V1 names, and package export subpaths unchanged; replace prerelease type aliases directly. |
| `AGENTS.md` | `LOCAL` | Yes | Repository authority and explicit SPECTRE lifecycle boundaries. |
| `README.md` | `LOCAL` | Yes | Workspace ownership and package boundaries. |
| `package.json` | `LOCAL` | Yes | Required workspace validation commands. |
| `package-lock.json` | `LOCAL` | Yes | Existing dependency and version baseline; do not modify. |
| `tsconfig.base.json` | `LOCAL` | Yes | Strict TypeScript and ES module settings. |
| `packages/mini-app-bridge/package.json` | `LOCAL` | Yes | Public entrypoints, optional React, dependencies, and version baseline. |
| `packages/mini-app-bridge/tsconfig.json` | `LOCAL` | Yes | Source compilation and declaration output. |
| `packages/mini-app-bridge/test/tsconfig.json` | `LOCAL` | Yes | Runtime and compile-time test discovery. |
| `packages/runtime/package.json` | `LOCAL` | Yes | Aggregate package exports and version baseline. |
| `packages/runtime/src/mini-app-bridge.ts` | `LOCAL` | Yes | Existing automatic core re-export. |
| `packages/runtime/src/mini-app-bridge-react.ts` | `LOCAL` | Yes | Existing automatic optional React re-export. |
| `packages/runtime/src/mini-app-bridge-testing.ts` | `LOCAL` | Yes | Existing automatic testing re-export. |
| `packages/runtime/test/xray.test.ts` | `LOCAL` | Yes | Aggregate export regression assertions. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/client.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/contract.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/host.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/react.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/client.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/connector.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/contract.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/host.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/cardano-cip30/v1/react.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/platform/v1/client.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/platform/v1/contract.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/platform/v1/host.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/platform/v1/react.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/adapters/types.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/index.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/protocol.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. Current locally added owned file from the authorized implementation; not yet tracked. |
| `packages/mini-app-bridge/src/react/connector-store.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/react/index.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/react/interactive.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. Current locally added owned file from the authorized implementation; not yet tracked. |
| `packages/mini-app-bridge/src/react/remote-store.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/testing/events.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/testing/index.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/testing/mock-client.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/testing/mock-host.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/transport/client.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/transport/errors.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/transport/host.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/transport/messages.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. |
| `packages/mini-app-bridge/src/transport/protocol.ts` | `LOCAL` | Yes | Current owned implementation to consolidate using the explicit destination mapping below. Current locally added owned file from the authorized implementation; not yet tracked. |
| `packages/mini-app-bridge/test/account-state-contract.test.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. |
| `packages/mini-app-bridge/test/bridge.test.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. |
| `packages/mini-app-bridge/test/cardano-sign-tx-contract.test.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. |
| `packages/mini-app-bridge/test/interactive.test.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. Current locally added owned file from the authorized implementation; not yet tracked. |
| `packages/mini-app-bridge/test/remote-store.test.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. |
| `packages/mini-app-bridge/test/response-contract.test.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. Current locally added owned file from the authorized implementation; not yet tracked. |
| `packages/mini-app-bridge/test/response-types.ts` | `LOCAL` | Yes | Preserve semantic coverage; update moved imports and public type assertions. Current locally added owned file from the authorized implementation; not yet tracked. |
| `packages/mini-app-bridge/README-CARDANO-CIP30.md` | `LOCAL` | Yes | Update architecture, type imports, and exact executable examples. |
| `packages/mini-app-bridge/README-CARDANO.md` | `LOCAL` | Yes | Update architecture, type imports, and exact executable examples. |
| `packages/mini-app-bridge/README-PLATFORM.md` | `LOCAL` | Yes | Update architecture, type imports, and exact executable examples. |
| `packages/mini-app-bridge/README.md` | `LOCAL` | Yes | Update architecture, type imports, and exact executable examples. |

## Objective

Simplify the existing unreleased Mini App Bridge SDK into 17 readable source files, three flat adapter modules, and direct schema-derived message types. Remove redundant type layers and host wrappers without changing the current wire format, runtime method signatures, error behavior, domain schemas, or optional React boundary.

Optimize for a human reading and modifying the SDK. Do not compress formatting, shorten meaningful names, or claim bundle savings from source-file consolidation. The current source baseline is 29 files and 2,001 lines; report actual formatted before/after counts in the eventual result, without an arbitrary line-reduction percentage.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Replace the five-parameter contract and chained envelope aliases with a plain schema contract and direct Request, Response, Event types; expose named adapter types once. | Deliberate prerelease type-import change; preserve schema-derived route/payload correlation and readonly fields. | Mini App Bridge core types and adapters | Positive and negative compile-time fixtures for all scopes, method/event narrowing, outcome branches, and named imports. |
| C02 | Consolidate the 29 current source files into the exact 17-file layout below and remove replaced modules and forwarding shims. | Preserve the three package entrypoints and all current runtime export/member names. | Mini App Bridge source structure | File inventory, import/declaration inspection, builds, public export tests, and React isolation. |
| C03 | Bind shared host transport once per contract through one small internal bindHost helper; keep client methods explicit in each adapter. | Preserve handler, respond, listen, publish, client timeout arguments, and CIP-30 connector behavior. | Mini App Bridge transport and adapters | Existing round-trip, manual relay, host validation, timeout, and connector regression tests. |
| C04 | Move React and testing implementations into their consolidated modules without changing their state or transport behavior. | Preserve hook names, mock APIs, lazy subscriptions, retries, stale-result suppression, and external CIP-30 projection. | Mini App Bridge React and testing entries | Store, interactive, mock, and CIP-30 tests; core loads without React. |
| C05 | Update guides and affected tests to use the final named types and structure; demonstrate request, success response, and failure narrowing. | No legacy type aliases, namespace merging, version changes, or consumer-source edits. | Mini App Bridge guides/tests; incidental runtime export tests | Exact README snippets compile through standalone and aggregate entries; required workspace checks pass. |

## Implementation steps

1. Capture the current source inventory, formatted line count, runtime exports/member names, method signatures, version values, and representative emitted declarations. Read every listed input. Preserve any unrelated working-tree edits.
2. Create `types.ts` and consolidate message schemas, errors, and parsing/construction helpers into `messages.ts`. Keep domain schemas in their adapters. Update the transport to use the direct types before consolidating adapter modules.
3. Move transport to `client.ts` and `host.ts`. Implement the internal `bindHost` in `host.ts` using the existing router, validation, listener, and cleanup paths. Merge each adapter's contract/client/host into one module, keeping public convenience methods explicit.
4. Consolidate optional React and testing files according to the mapping. Update entry barrels, source imports, test imports, and documentation. Delete replaced files and empty directories; do not leave compatibility forwarding modules.
5. Run the validation below, inspect generated declarations/import boundaries, and record actual source metrics. Keep runtime/package/wire versions unchanged. Implementation evidence and a result are created only by a later explicit SPECTRE implementation operation.

### Exact source layout and move mapping

The source inventory is exactly these 17 TypeScript files. Test and documentation files are outside this count.

```text
src/
  index.ts
  protocol.ts
  types.ts
  messages.ts
  client.ts
  host.ts
  adapters/
    platform.ts
    cardano.ts
    cip30.ts
  react/
    index.ts
    store.ts
    platform.ts
    cardano.ts
    cip30.ts
  testing/
    index.ts
    client.ts
    host.ts
```

| Current paths under src/ | Destination under src/ | Responsibility |
| --- | --- | --- |
| `index.ts` | `index.ts` | Core runtime exports, BridgeError, and named public types. |
| `protocol.ts` | `protocol.ts` | Existing public protocol runtime surface and simplified generic type exports. |
| `adapters/types.ts` | `types.ts` | Plain contract shape and direct generic messages/host outcome. |
| `transport/messages.ts`, `transport/errors.ts`, `transport/protocol.ts` | `messages.ts` | Shared envelope schemas, errors, validation, and parse/build helpers. |
| `transport/client.ts` | `client.ts` | Request correlation, posting, deadlines, and event subscriptions. |
| `transport/host.ts` and repeated adapter host wrappers | `host.ts` | Shared host router plus internal bindHost. |
| `adapters/platform/v1/contract.ts`, `client.ts`, `host.ts` in that directory | `adapters/platform.ts` | Platform schemas, inferred domain types, explicit client object, bound host. |
| `adapters/cardano/v1/contract.ts`, `client.ts`, `host.ts` in that directory | `adapters/cardano.ts` | Native Cardano schemas, inferred domain types, explicit client object, bound host. |
| `adapters/cardano-cip30/v1/contract.ts`, `client.ts`, `host.ts`, `connector.ts` in that directory | `adapters/cip30.ts` | CIP-30 schemas, client projection, connector, domain types, and bound host. |
| `react/index.ts` | `react/index.ts` | Existing optional React runtime exports. |
| `react/remote-store.ts` | `react/store.ts` | Shared lazy remote store and subscription behavior. |
| `adapters/platform/v1/react.ts` | `react/platform.ts` | Platform hooks and status projection. |
| `adapters/cardano/v1/react.ts`, `react/interactive.ts` | `react/cardano.ts` | Cardano read/interactive hooks and their small local runner. |
| `adapters/cardano-cip30/v1/react.ts`, `react/connector-store.ts` | `react/cip30.ts` | CIP-30 hook and local connector-store helper. |
| `testing/index.ts` | `testing/index.ts` | Existing public testing surface. |
| `testing/mock-client.ts`, `testing/events.ts` | `testing/client.ts` | Mock client and shared message-event dispatch helper. |
| `testing/mock-host.ts` | `testing/host.ts` | Mock host; import the dispatch helper directly from testing/client. |

Use clear sections inside adapter files in this order: schemas/contract, inferred types, client methods, bound host. Keep small helpers next to their callers. Preserve meaningful comments explaining non-obvious transport and state behavior.

### Direct types and public imports

Use a non-generic `Contract` shape containing literal-compatible `scope`/`version`, method request/result schemas, event schemas, and a context schema. Declare each adapter contract with `as const satisfies Contract` so its concrete schema and literal information survive validation of the shape. Keep schema inference as the single source of truth; do not manually duplicate domain payload definitions.

Define only three primary generic message types: `Request<C, M>`, `Response<C, M>`, and `Event<C, E>`. Default method/event parameters produce mapped discriminated unions. Write their wire fields directly. In particular, write Response as explicit complete success and failure branches rather than passing through ClientResponse and HostResult or a base envelope intersection. Small method/event key aliases are allowed where they make signatures easier to read. Generic constraints are needed for schema inference; no interface inheritance hierarchy, declaration namespace merging, or class-based message model is needed.

A small direct `Outcome<Payload, Context>` union may represent host handler/manual response input without envelope metadata. Response does not extend or intersect it. Keep `BridgeError` extending built-in Error; the request for non-inherited message types does not require replacing standard exception behavior.

Expose these named types at the core root and through the existing runtime aggregate star export:

- `PlatformRequest<M>`, `PlatformResponse<M>`, `PlatformEvent<E>`.
- `CardanoRequest<M>`, `CardanoResponse<M>`, `CardanoEvent<E>`.
- `Cip30Request<M>`, `Cip30Response<M>`, `Cip30Event<E>`.

Define each alias once in its adapter and re-export it. Export existing schema-derived domain types once at the root using their current descriptive names: `AccountType`, `PlatformContext`, `PlatformIdentity`, `PlatformStatus`, `Theme`, `Currency`, `Locale`, `CardanoContext`, `AccountState`, `Tip`, `Explorer`, `SignTxResult`, `SubmitTxResult`, `SignDataResult`, `CardanoCip30Context`, `Cip30Extension`, `Cip30Pagination`, and `Cip30Error`. Preserve BridgeError and BridgeErrorCode. The protocol barrel exports Contract, Request, Response, Event, and Outcome types plus its existing message/error schema types and runtime members. Root also exports these five simplified generic types.

Remove the redundant AdapterContract/AdapterRequest/AdapterResponse/AdapterEvent, ClientResponse/ClientEvent/HostRequest/HostResult public aliases and duplicated role-specific Request/Response/Event aliases. Update internal store types to the new representation. Do not preserve old namespace type syntax through compatibility aliases or TypeScript namespace declarations.

```ts
import { clientCardanoV1, type CardanoRequest, type CardanoResponse } from "@xray-network/xray-js-mini-app-bridge"

type SignRequest = CardanoRequest<"signTx">
type SignResponse = CardanoResponse<"signTx">

async function sign(cbor: string): Promise<SignResponse> {
  const response = await clientCardanoV1.signTx(cbor)
  if (response.ok) {
    console.log(response.payload.hash, response.payload.cbor)
  } else {
    console.error(response.error.code, response.error.message)
  }
  return response
}
```

Guides must additionally include a complete request object and a complete success/failure response example using the unchanged wire fields. Type narrowing across adapter scopes, methods, events, and ok branches must remain cast-free for callers.

### Runtime and import boundaries

Export plain client and bound-host objects under the current names `clientPlatformV1`, `hostPlatformV1`, `clientCardanoV1`, `hostCardanoV1`, `clientCardanoCip30V1`, and `hostCardanoCip30V1`. Each keeps its current runtime properties, literal scope/version, signatures, default arguments, and explicit timeout overrides. Preserve current React `platformV1`, `cardanoV1`, and `cardanoCip30V1` names and testing exports. Preserve public protocol runtime member names, including all three named V1 contracts and parse/build helpers.

`bindHost(contract)` is internal and returns the typed scope/version/handle/respond/listen/publish surface. It binds existing host functions; it does not introduce a registry, class hierarchy, dynamic client method generator, or a second validation implementation. Type assertions remain localized to unavoidable schema/dispatch boundaries; do not introduce broad any/as never casts to hide inference failures.

Keep the dependency direction acyclic: core types use type-only imports; messages owns errors/envelope validation and never imports adapters; client/host import messages/types; adapters import these internal modules directly. Only the public protocol barrel imports adapter contracts. Internal transport must not import that barrel. React imports adapters and its store. Testing host may import its dispatch helper from testing/client, never through its own public barrel. Core and protocol imports must never load React or testing. Keep the existing code entrypoints `.`, `./react`, and `./testing`, plus the existing `./package.json` export; no new dependencies or subpaths.

Preserve all current behavior: strict request/response/event envelopes and rejection of obsolete envelopes; success/failure and local transport error codes; route/source/request correlation; duplicate/late reply handling; listener/timer cleanup; source/origin checks; host validation and manual relay parity; send-only routeChanged; 5-second and 120-second defaults; no automatic signing/submission retry; bigint structured cloning; valid null data/context; account readiness states; native complete-transaction signing; standard external CIP-30 values, exceptions, installation and authorization. Preserve read-hook shapes, interactive outcome/result/error behavior, lazy subscriptions, stale suppression, and account retry delays of 250/500/1000/2000 ms.

## Validation

During implementation run from the repository root:

```sh
npm run check
npx --no-install prettier --check packages/mini-app-bridge/src packages/mini-app-bridge/test packages/mini-app-bridge/README*.md packages/runtime/test/xray.test.ts
```

Retain semantic assertions from the existing test suite when updating imports. Add only focused coverage needed for the new public type surface and host binding. Compile fixtures for correct named imports and mixed-scope/mixed-method/mixed-event unions; require expected errors for incorrect payload/method combinations, wrong outcome branch access, and removed namespace type imports. Test all three bound hosts against their client/protocol paths. Preserve regression checks for correlation, malformed replies, cleanup, operation errors, null data/context, bigint, CIP-30 values/exceptions, complete signed transaction versus witness set, stores and interactive outcomes.

Extract and compile the exact TypeScript fenced examples from all four README files against freshly built standalone exports and equivalent aggregate exports; do not silently replace examples with easier approximations. Run existing aggregate export assertions. Import built core and protocol with React deliberately unavailable or rejected by a Node loader and require success. Inspect emitted declarations for retained literal inference, expected public names, and no references to removed files. Check the local module dependency graph for cycles introduced by consolidation.

Assert the exact 17-file source inventory, with no old transport directory, adapter/v1 directories, or forwarding helper files. Record formatted source file/line counts before and after. Review the consolidated files for meaningful names, ordinary formatting, explicit client methods, one host binder, and absence of the obsolete alias chains. Report any bundle measurement separately only if actually performed; smaller source inventory alone is not evidence of smaller bundles.

Compare all package manifests and lockfile bytes with the implementation-start baseline. Confirm wire v1 and runtime V1 names are unchanged, the three export subpaths still resolve, and no unrelated package or consumer source was edited. Required checks must pass; report pre-existing skips and any limitations accurately without claiming live endpoint coverage.

For this planning operation only, validate protocol/module headers, record/ledger identity and state, required sections, unique C01–C05 IDs, local input existence, sequence reconciliation through active/archive records, and absence of a result. Verify only this instruction and its new ledger row changed from the start-of-plan working-tree baseline. Do not run or claim implementation checks while planning.

## Compatibility and human review

This is an intentional prerelease type-import cleanup. For example, replace `clientCardanoV1.Response<"signTx">` with the named import `CardanoResponse<"signTx">`. Runtime calls and wire envelopes stay the same. Document the type migration in the existing guides; retain no deprecated aliases or compatibility shims. Reviewers should verify the direct types are easier to read and that consolidation has not hidden cross-module behavior or weakened validation.

The prior response implementation remains under its own human review. This plan neither accepts it nor changes its requirements retroactively. XRAY App/consumer integration and any type-import updates in their separate source remain separately owned work; do not claim they are complete. No version, release, publishing, or deployment action belongs to this record.

## Completion criteria

- Every C01–C05 requirement has implementation and validation evidence in the eventual result.
- The SDK has the exact 17-file source layout, with three readable flat adapters and no forwarding shims.
- Direct schema-derived message types retain literal/discriminated narrowing without the former alias hierarchy.
- Named adapter/domain types are exported once; guides and type fixtures use them consistently.
- One internal host binder replaces repeated wrappers; explicit client methods preserve existing signatures.
- Required tests, typechecks, builds, formatting, exact documentation examples, and import-boundary checks pass.
- Runtime APIs, wire format, versions, error and domain behavior, optional React, and testing entrypoints are preserved.
- Actual source counts and any limitations are recorded; no unsupported minification or bundle-size claim is made.
- Previous lifecycle records and unrelated working-tree changes remain untouched.

## Out of scope

- Product edits during planning or acceptance/revision of `0019`.
- Package/wire version changes, new V2 names, compatibility aliases, or parallel implementations.
- Actual source minification, obfuscation, compressed formatting, or new build tooling/dependencies.
- Wire/API behavior redesign, weakened runtime validation, origin-policy redesign, or new negotiation features.
- Dynamic client generators, plugin registries, inheritance frameworks, or a configurable public host factory.
- New state architecture or automatic signing/submission retries.
- XRAY App/consumer source, independent runtime source changes, publishing, release, or deployment.

## Blockers

None for this bounded plan. Implementation is a separate SPECTRE operation; the current invocation authorizes planning only.
