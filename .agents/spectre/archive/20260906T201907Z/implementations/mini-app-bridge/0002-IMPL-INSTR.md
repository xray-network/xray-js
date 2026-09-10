# Mini App Bridge implementation 0002 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0002
Created: 20260811T082930Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request | `LOCAL` | Yes | Add validated host blockchain context to bridge messages and expose it to mini apps. |
| `packages/mini-app-bridge/src/` | `LOCAL` | Yes | Existing protocol, client, host, React, and testing implementation. |

## Objective

Expose typed blockchain host context on every host-to-mini-app bridge envelope.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Define a discriminated Cardano, Bitcoin, and Midnight host-context schema and require it beside `type`, `payload`, and `requestId` on host envelopes. | Breaking host-envelope change is allowed before release. | `packages/mini-app-bridge/src/protocol/` | Package build and typecheck. |
| C02 | Propagate context through core/CIP-30 clients, host send/listen helpers, and testing mocks. | Client request envelopes remain context-free. | `packages/mini-app-bridge/src/{client,host,testing}/` | Package build and typecheck. |
| C03 | Cache and expose context through React with host-context, blockchain, and network access. | Existing network hook remains available but derives from context. | `packages/mini-app-bridge/src/react/` | Package build and typecheck. |

## Implementation steps

1. Add runtime schemas and typed host envelopes.
2. Thread context through bridge transports and mocks.
3. Update the React store and hooks.
4. Build and typecheck the monorepo.

## Validation

- `npm run build`
- `npm run typecheck`

## Compatibility and human review

Review the required host-envelope field and discriminated network typing.

## Completion criteria

All host messages validate with context, consumers can read it from responses/listeners/hooks, and validation outcomes are recorded.

## Out of scope

Chain-specific account, tip, transaction, or capability redesign.

## Blockers

None.
