# Mini App Bridge implementation 0017 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0017
Instruction: ./0017-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| `C01` | IMPLEMENTED | Replaced the ambiguous nullable live fields with a required Cardano account-state `balanceStatus` discriminated union. Initializing/error branches require null state/delegation; ready requires non-null state and nullable delegation; the outer no-account result remains null. | Direct schema tests accept all valid branches and reject missing, unknown, or mismatched status/data combinations; package/runtime builds and typechecks pass. |
| `C02` | IMPLEMENTED | Added an opt-in generic remote-store readiness policy with injectable delays/scheduler and configured only Cardano `useAccountState()` for subscribe-first requests plus retries after 250, 500, 1000, and 2000 milliseconds. It stops on ready, host error status, transport/validation failure, exhaustion, last unsubscribe, or reset; manual refresh starts a fresh bounded attempt. | Deterministic scheduler tests prove the exact sequence, exhaustion, terminal states, manual refresh, shared subscriptions, unsubscribe, reset, and transport failure. |
| `C03` | IMPLEMENTED | Added complete account-snapshot structural equality, unchanged-snapshot notification suppression, event revision tracking so stale requests cannot overwrite newer events, one shared in-flight request, and generation-safe teardown. Automatic retries do not toggle loading or notify when the initializing snapshot remains equivalent. | Race/dedup tests cover an event during an in-flight request, an older request result, duplicate ready events, shared subscribers, cancellation, and terminal snapshot/error preservation. |
| `C04` | IMPLEMENTED | Updated typed mock account state, direct-open integration coverage, Cardano React documentation, and test compilation so focused tests can exercise the internal generic store. The active React template was verified against the rebuilt runtime and already consumes only `useAccountState()` without component timers or a separate listener. | Direct-open integration reaches ready through the automatic second request; Mini App Bridge passes 22/22 tests, full workspace/format checks pass, and the active template typechecks. |

## Outcome

`cardanoV1.useAccountState()` is now the single owner of direct-open Cardano balance bootstrap. It subscribes before
requesting the initial snapshot, shares one bounded retry sequence across consumers, suppresses equivalent account
data, and cannot let a late request overwrite a newer event. Components retain the existing
`{ data, loading, error, refresh }` API and need no timer, repeated effect, or bootstrap listener.

Cardano v1 account readiness is explicit on the wire. The method/event routes, envelopes, context, and outer null
account behavior are unchanged, while every non-null payload must now satisfy the readiness discriminator.

## Inputs consumed

- Human request dated 2026-08-24 for Mini-App-owned Cardano account bootstrap through one React hook.
- XRAY implementation instruction `mini-app-bridge/0017` and repository standards.
- Cardano v1 contract/client/React adapter, generic remote store, mock host, bridge tests, package scripts, and Cardano
  documentation.
- Coordinated XRAY App `app/0032` implementation and linked active React template consumer.

## Project changes

- `packages/mini-app-bridge/src/adapters/cardano/v1/contract.ts`
- `packages/mini-app-bridge/src/adapters/cardano/v1/react.ts`
- `packages/mini-app-bridge/src/react/remote-store.ts`
- `packages/mini-app-bridge/src/testing/mock-host.ts`
- `packages/mini-app-bridge/test/account-state-contract.test.ts`
- `packages/mini-app-bridge/test/remote-store.test.ts`
- `packages/mini-app-bridge/test/bridge.test.ts`
- `packages/mini-app-bridge/test/tsconfig.json`
- `packages/mini-app-bridge/package.json`
- `packages/mini-app-bridge/README-CARDANO.md`

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| `C01` | Non-null Cardano v1 account state is a required `initializing`/`ready`/`error` discriminated payload. | Scope, version, method/event names, context, envelopes, and outer null remain unchanged; host/SDK payload deployment must be coordinated. | Deploy with XRAY App `app/0032` and branch UI on `balanceStatus`. |
| `C02` | `useAccountState()` automatically retries only initializing snapshots on the fixed bounded schedule. | Hook return shape is unchanged; all other remote stores behave as before unless an opt-in policy is supplied. | Remove component-owned startup timers/repeated effects. |
| `C03` | Account snapshots are structurally deduplicated and event updates outrank older requests. | Meaningful account, status, state, or delegation changes still notify; events are future changes, not initial replay. | Render state transitions rather than assuming one React render. |
| `C04` | Mocks, tests, docs, and the active React consumer use the one-hook lifecycle. | No dependency, Provider, handshake, capability path, CIP-30 change, or protocol fallback was added. | Use `data.balanceStatus` and existing `error` for exhaustion/transport failures. |

## Validation

- `npm run build --workspace @xray-network/xray-js-mini-app-bridge` — passed.
- `npm run typecheck --workspace @xray-network/xray-js-mini-app-bridge` — passed.
- `npm test --workspace @xray-network/xray-js-mini-app-bridge` — passed, 22/22 tests.
- Runtime package build, typecheck, and tests — passed, 3/3 tests.
- `npm run check` — passed; Cardano 30 passed/1 live test skipped, Mini App Bridge 22 passed, runtime 3 passed.
- `npm run format:check` — passed.
- Coordinated XRAY App `npm run verify:wallet` — passed, including 61/61 frontend tests, typecheck, client/SSR build,
  and SPA prerender.
- Active `xray-mini-app-template-react` `npm run typecheck` — passed against the rebuilt linked runtime; source audit
  confirms one `useAccountState()` call and no manual retry/listener.
- `git diff --check` — passed before result creation.
- Source/documentation scan — no component-owned account bootstrap timer, initial-event promise, continuous polling,
  compatibility alias, dependency update, or lockfile change was introduced.
- Node emitted the existing `MaxListenersExceededWarning` during the bridge suite; all tests passed and the warning is
  unrelated to the account-state retry lifecycle.

## Deviations from instruction

None.

## Remaining human review

- Confirm a directly opened real Mini App renders initializing and then ready without a tab click or account-state
  event, and that multiple mounted consumers share the same request sequence.
- Confirm first-load host error, transport failure, and retry exhaustion are presented appropriately through
  `balanceStatus` or the existing hook `error` field.
- Confirm XRAY App and Mini App Bridge versions are deployed together because the required Cardano v1 payload shape
  changed without a compatibility fallback.

## Reproducibility

From the `xray-js` repository root, run `npm run check`, `npm run format:check`, and `git diff --check`. Then build the
linked XRAY App and typecheck `xray-mini-app-template-react` against the rebuilt runtime.
