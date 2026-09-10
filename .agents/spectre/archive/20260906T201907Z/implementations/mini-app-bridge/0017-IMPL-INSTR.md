# Mini App Bridge implementation 0017 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0017
Created: 20260824T102214Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human request dated 2026-08-24 for mini-app-owned Cardano account bootstrap through one React hook | `LOCAL` | Yes | Defines explicit balance readiness, bounded retry, and removal of component-managed bootstrap logic. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/` | `LOCAL` | Yes | Owns the Cardano account-state wire schema, client, and React adapter. |
| `packages/mini-app-bridge/src/react/remote-store.ts` | `LOCAL` | Yes | Owns shared subscription, initial refresh, caching, notification, and teardown behavior. |
| Mini App Bridge mocks, tests, documentation, and active XRAY App/template consumers | `LOCAL` | Yes | Define deterministic protocol coverage, direct-open verification, and coordinated compatibility checks. |

## Objective

Make `useAccountState()` own Cardano balance bootstrap with typed readiness, bounded retry, deduplication, and race-safe cleanup, without component-managed retries or an initial host event.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| `C01` | Add a required `balanceStatus` discriminator to each non-null Cardano v1 account-state snapshot. Model `initializing` and `error` with null live state/delegation, and `ready` with non-null state plus nullable delegation, using a schema that preserves those invariants in inferred client and host types. | Coordinated required Cardano v1 payload evolution with XRAY App `app/0032`; request/event routes, envelopes, selected-account context, account-null behavior, method names, and protocol version remain unchanged. Do not add aliases, fallbacks, or capability negotiation. | Cardano v1 contract and public client/host types | Contract tests accept each valid branch and reject missing, mismatched, or unknown status/data combinations. |
| `C02` | Extend the shared remote-store primitive with an optional readiness/retry policy and injectable bounded delays. Configure `useAccountState()` to subscribe before its initial request and retry only an `initializing` snapshot after `250`, `500`, `1000`, and `2000` milliseconds. Stop automatically on `ready`, `error`, retry exhaustion, last unsubscribe, or reset; a manual `refresh()` starts a fresh bounded attempt when the snapshot is still initializing. | Keep the public hook return shape `{ data, loading, error, refresh }` and one-hook consumer model. Other remote stores retain their existing behavior when no policy is supplied. No new runtime dependency. | Generic remote store and Cardano React adapter | Fake-timer tests prove the exact schedule, terminal states, exhaustion, manual refresh, shared subscribers, and cancellation. |
| `C03` | Make request/event interleaving stable: do not notify consumers for equivalent account snapshots, do not allow an older request result to overwrite a newer event, share one request/retry sequence across subscribers, and cancel timers or pending retry progression on teardown/reset. Preserve the last terminal snapshot while exposing transport/validation failures through the existing hook error channel. | Events remain future change notifications, not an initial replay contract. Equality must cover the complete validated account snapshot so meaningful account/status/state/delegation changes still notify. | Remote store lifecycle and Cardano hook policy | Deterministic tests cover duplicate responses/events, an event arriving during an in-flight request, two subscribers, unsubscribe/reset, and terminal snapshot preservation. |
| `C04` | Update mocks, Cardano documentation, and active React examples to teach only `useAccountState()` for direct-open bootstrap. Show rendering `initializing`, `ready`, and `error` states without component timers, repeated effects, or a separate account-state listener. | Documentation and examples must not promise an initial `accountState` event or continuous host balance publication. Coordinate local host/schema validation before rollout. | Bridge mocks/tests, Cardano README, and active React templates | Direct-open fixture moves automatically from initializing to ready; error/exhaustion fixtures terminate; docs and templates contain no manual bootstrap retry loop. |

## Implementation steps

1. Define the discriminated Cardano account-state schema and update typed mocks/fixtures.
2. Add an opt-in readiness policy to the shared remote store without changing other hook behavior.
3. Configure `useAccountState()` with bounded retry, structural deduplication, stale-result protection, and teardown safety.
4. Add deterministic direct-open, race, subscriber-sharing, terminal-state, and cancellation tests.
5. Update Cardano React documentation/examples and run coordinated XRAY App/template validation.

## Validation

- Mini App Bridge build, typecheck, and tests, including fake-timer retry/race coverage.
- Runtime build, typecheck, and tests.
- `npm run check` and `npm run format:check` from the xray-js repository root.
- Coordinated XRAY App focused account-state tests, frontend typecheck/build, and React-template direct-open verification.
- Source/documentation scan proving no component-owned retry loop and no reliance on an initial `accountState` event.
- `git diff --check`.

## Compatibility and human review

Review observable state transitions rather than React render count: the hook may publish loading and data/error transitions, while duplicate validated snapshots must not create redundant data notifications. Multiple components share one store and retry sequence.

The hook API and Cardano v1 routes remain stable, but the non-null account-state payload gains a required discriminator. XRAY App `app/0032` and this SDK change therefore require a coordinated host/SDK rollout before deployment. A mini app must not infer readiness from a null balance or depend on an initial event.

## Completion criteria

- `useAccountState()` alone bootstraps a directly opened mini app from initializing to a terminal ready/error state.
- Retry is bounded to the documented delay sequence, shared across subscribers, restartable through `refresh()`, and fully cancelled on teardown/reset.
- Duplicate snapshots do not notify again, and stale request results cannot overwrite newer events.
- The discriminated schema enforces status/data invariants for clients, hosts, mocks, and active consumers.
- Documentation, templates, package/runtime checks, coordinated host checks, formatting, and diff validation pass.

## Out of scope

- Host balance acquisition or persistence, initial host event replay, ongoing balance-change publication, continuous polling, tip readiness, CIP-30 behavior, Provider APIs, new dependencies, protocol version negotiation, deployment, or unrelated UI changes

## Blockers

None.
