# Mini App Bridge implementation 0016 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0016
Created: 20260822T072729Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-requested platform `getLocale` method dated 2026-08-22 | `LOCAL` | Yes | Define the new request-only Platform v1 capability and coordinated XRAY App/template rollout. |
| `packages/mini-app-bridge/src/adapters/platform/v1/` | `LOCAL` | Yes | Own the Platform v1 schema, client request, and public client/host types. |
| Mini App Bridge mocks, tests, runtime facade, and package documentation | `LOCAL` | Yes | Prove the locale request uses existing envelopes and remains available through the aggregate SDK facade. |

## Objective

Expose a typed Platform v1 `getLocale` method that returns the host's nonempty locale identifier through the existing
correlated request envelope, without adding a locale event, handshake, or compatibility path.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Add a nonempty string `localeSchema`, inferred public `Locale` type, and null-payload `getLocale` result to the Platform v1 contract. | Additive within `platform/v1`; existing scope, version, methods, events, context, and envelopes remain unchanged. Locale identifiers should use canonical BCP 47 forms such as `en`, not underscore forms. | Platform v1 contract and client/host type exports. | Build/typecheck proves the method and `Locale` exports; schema tests accept `en` and reject empty/non-string results. |
| C02 | Add `clientPlatformV1.getLocale(timeout?)` using the standard request timeout and existing `{ payload, context, requestId }` response shape. | No defaulting, locale detection, normalization, fallback, or React state is introduced in the SDK. | Platform v1 client and aggregate runtime facade. | Focused client and facade tests prove method presence, exact `platform/v1` routing, null request payload, and correlated response context. |
| C03 | Extend the mock host and focused bridge tests with a default `en` locale and host-handler coverage. | Existing mock defaults and all other adapter behavior remain unchanged. | Testing mock and Mini App Bridge tests. | Request, timeout, invalid result, and typed host-handler coverage passes. |
| C04 | Document `getLocale` as a request-only Platform v1 method and show direct client/host usage. | Do not document a locale event or `platformV1.useLocale` hook because neither is part of this change. | Mini App Bridge README and Platform guide. | Documentation scan, package/runtime checks, formatting, and diff check pass. |

## Implementation steps

1. Extend the Platform v1 contract, client export, and client/host public types with the locale method.
2. Extend the mock host and focused protocol tests for valid, invalid, routed, and timed-out locale requests.
3. Update active Platform documentation and verify the aggregate runtime facade continues to expose the method.
4. Run focused and repository-wide validation and scan for accidental locale event/hook additions.

## Validation

- Mini App Bridge build, typecheck, and tests.
- Runtime build, typecheck, and tests.
- `npm run check`, `npm run format:check`, and `git diff --check`.
- Active source/documentation scan proving `getLocale` is documented and no locale event or React locale store/hook was added.

## Compatibility and human review

This is an additive method on the existing Platform v1 route. Review that `getLocale(null)` retains the normal response
envelope and selected-account context, that missing/invalid host responses follow current bridge behavior, and that
locale remains a host-owned nonempty string rather than being inferred by the mini app.

The initial XRAY App value is `en`. Consumers should treat it as a locale identifier and must not assume underscore
formatting or a closed list of future locales.

## Completion criteria

- Platform v1 clients and hosts have typed `getLocale` support with `Locale` exported from both sides.
- `getLocale` accepts only a null request and returns a validated nonempty string in the existing envelope.
- Mocks default to `en`, and focused tests cover routing, response validation, context, host handling, and timeout.
- Documentation, package/runtime validation, formatting, and stale scans pass.
- No locale event, React hook/store, locale detection, or fallback is introduced.

## Out of scope

- XRAY App preference storage or UI.
- React-template controls or localization.
- Locale change events, React hooks, translation catalogs, text direction, formatting policy, or browser detection.
- A Platform v2 adapter, handshake, capability negotiation, compatibility shim, or deployment.

## Blockers

None.
