# Mini App Bridge implementation 0016 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0016
Instruction: ./0016-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | IMPLEMENTED | Added nonempty `localeSchema`, public `Locale`, and null-payload `getLocale` to Platform v1; client and host re-export the type. | Package build/typecheck and valid/invalid locale tests pass. |
| C02 | IMPLEMENTED | Added `clientPlatformV1.getLocale(timeout?)` through the existing request transport and aggregate SDK facade. | Focused routing/envelope/timeout tests and runtime facade checks pass. |
| C03 | IMPLEMENTED | Added mock-host locale state defaulting to `en`, direct mock responses, typed host-handler coverage, and invalid-result rejection tests. | Mini App Bridge test suite passes all 13 tests. |
| C04 | IMPLEMENTED | Documented direct client/host locale usage and the request-only, nonempty BCP 47 contract without adding a locale event or React hook. | Documentation/source scan, Prettier, and diff checks pass. |

## Outcome

Platform v1 now provides a request-only `getLocale` method. Valid hosts return a nonempty locale string such as `en`
or `en-US` in the unchanged correlated response envelope and selected-account context. The SDK does not infer,
normalize, default, persist, subscribe to, or expose React state for locale.

## Inputs consumed

- Human-requested Platform v1 `getLocale` requirement dated 2026-08-22.
- Platform v1 contract, client, host, transport types, and aggregate runtime facade.
- Mini App Bridge mock host, focused tests, and package documentation.

## Project changes

- `packages/mini-app-bridge/src/adapters/platform/v1/contract.ts`
- `packages/mini-app-bridge/src/adapters/platform/v1/client.ts`
- `packages/mini-app-bridge/src/adapters/platform/v1/host.ts`
- `packages/mini-app-bridge/src/testing/mock-host.ts`
- `packages/mini-app-bridge/test/bridge.test.ts`
- `packages/mini-app-bridge/README.md`
- `packages/mini-app-bridge/README-PLATFORM.md`

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Platform v1 recognizes `getLocale` with a null request and nonempty string result; `Locale` is public on client and host namespaces. | Additive on the existing `platform/v1` scope; other methods, events, context, and envelopes are unchanged. | Hosts should answer with a canonical locale identifier such as `en`. |
| C02 | `clientPlatformV1.getLocale(timeout?)` returns the normal correlated response or `null` on timeout/invalid response. | No handshake, fallback, or alternate method is introduced. | Mini apps may call the direct client method after deploying a compatible SDK. |
| C03 | SDK mocks expose locale state with default `en`. | Existing mock options remain compatible through partial state overrides. | Tests may override `state.locale` with any nonempty identifier. |
| C04 | Locale is explicitly request-only in Platform v1. | No locale event or React hook/store exists. | Consumers needing a refresh must call `getLocale` again. |

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge` — passed.
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge` — passed.
- `npm test --workspace @xray-network/xray-js-mini-app-bridge` — passed, 13/13 tests.
- Runtime package build, typecheck, and tests — passed, 3/3 tests.
- `npm run check` — passed; Cardano 27 passed/1 live test skipped, bridge 13 passed, runtime 3 passed.
- `npm run format:check` — passed after formatting the three reported files.
- `git diff --check` — passed.
- Active `locale|getLocale` scan — locale occurs only in the Platform contract/client, client/host types, mocks, tests,
  and documentation; no locale event, React store, or React hook was added.
- Node emitted the pre-existing `MaxListenersExceededWarning` during the bridge suite; tests still passed and the
  warning is unrelated to locale behavior.

## Deviations from instruction

None.

## Remaining human review

- Confirm the public nonempty-string locale contract is sufficiently open for future canonical BCP 47 identifiers.
- Confirm request-only behavior is desired until a real locale mutation/subscription requirement exists.
- Review the coordinated XRAY App host value and React-template action.

## Reproducibility

From the `xray-js` repository root, run `npm run check`, `npm run format:check`, and `git diff --check`.
