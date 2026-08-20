# Mini App Bridge implementation 0015 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0015
Created: 20260820T093921Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-approved open explorer identifier dated 2026-08-20 | `LOCAL` | Yes | Replace the closed Cardano explorer enumeration with a string contract. |
| `packages/mini-app-bridge/src/adapters/cardano/v1/` | `LOCAL` | Yes | Own the Cardano v1 explorer method, event, public type, and React projection. |
| Mini App Bridge mocks, tests, runtime facade, and package documentation | `LOCAL` | Yes | Prove open identifiers are accepted without changing message routing or response envelopes. |

## Objective

Make Cardano v1 explorer identifiers open nonempty strings so XRAY App can add explorers without another SDK schema
change, while preserving the existing method, event, envelope, and React APIs.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Replace the closed `cardanoscan`/`cexplorer`/`adastat`/`xray` explorer schema with a nonempty string schema and keep `Explorer` as its inferred public type. | Existing explorer values remain valid. Scope, version, method/event names, context, and correlated envelopes remain unchanged. | Cardano v1 contract and client/host type exports. | Contract build/typecheck passes and an arbitrary nonempty identifier validates. |
| C02 | Update mocks and focused tests to prove unknown future explorer identifiers pass through `getExplorer`, explorer events, and React state while empty or non-string values remain invalid. | No capability discovery, handshake, fallback mapping, or client-side explorer registry is introduced. | Testing mock and Mini App Bridge tests. | Focused request/event/store tests pass. |
| C03 | Document that explorer identifiers are host-controlled strings and consumers must handle unknown values generically; remove active closed-enum assumptions. | Older SDK builds still reject new identifiers, so XRAY App must not emit them until consumers receive this one-time schema rollout. Future identifiers require no further schema release. | Mini App Bridge Cardano guide and runtime facade validation. | Documentation scan, package/runtime checks, formatting, and diff check pass. |

## Implementation steps

1. Widen the Cardano v1 explorer schema and exported type to nonempty string.
2. Update mocks, request/event/React tests, and documentation for an unknown explorer identifier.
3. Run focused and repository-wide validation and audit for stale closed-enum assumptions.

## Validation

- Mini App Bridge build, typecheck, and tests.
- Runtime build, typecheck, and tests.
- `npm run check`, `npm run format:check`, and `git diff --check`.
- Active source/documentation scan for the retired closed explorer enum.

## Compatibility and human review

Existing strings remain unchanged on the wire. The low-level client continues to return `{ payload, context,
requestId }`, and React continues to expose the explorer string as store data. Review generic rendering and link
construction for an identifier the mini app does not recognize.

This change removes the need for future SDK schema releases when XRAY App adds an explorer identifier, but an initial
consumer rollout is still required before XRAY App sends a value that older strict-enum SDK builds reject.

## Completion criteria

- Any nonempty explorer identifier passes Cardano v1 result/event validation.
- Empty and non-string explorer values remain rejected.
- Existing clients, host helpers, React hooks, envelopes, and adapter routes retain their shape.
- Tests, documentation, formatting, full SDK checks, and stale scans pass.

## Out of scope

- Adding or selecting a new explorer in XRAY App.
- Explorer URL templates, icons, display metadata, or client-side registries.
- A Cardano v2 adapter, protocol negotiation, publishing, or downstream deployment.

## Blockers

None.
