# Mini App Bridge implementation 0014 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0014
Created: 20260819T131657Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Human-approved platform status shape dated 2026-08-19 | `LOCAL` | Yes | Define the normalized low-level response and unchanged React convenience state. |
| `packages/mini-app-bridge/src/adapters/platform/v1/` and tests/docs | `LOCAL` | Yes | Own the platform contract, clients, host types, React store, mocks, and examples. |

## Objective

Normalize `getStatus` with every other request: return `{ payload: { host: "xray.app" }, context, requestId }`, keep only `context` nullable, and preserve React `useStatus().data` as `{ host, account: context }`.

## Changes to implement

| Change ID | Requirement | Compatibility | Validation |
| --- | --- | --- | --- |
| C01 | Add a wire-level platform identity `{ host: "xray.app" }`; make status method/event payloads use it and carry the selected account only in nullable context. | Successful host is never nullable; unavailable host remains no response. | Contract and transport tests pass. |
| C02 | Make `clientPlatformV1.getStatus()` return the standard correlated client response; make React combine payload host with context as `account`. | Existing React consumers keep their current shape. | Client, React store, mock, type, and event tests pass. |
| C03 | Update focused docs/runtime facade tests and remove duplicated `payload.account` examples. | No bridge version or route changes. | Package/runtime/full checks and stale scans pass. |

## Implementation steps

1. Change the platform v1 contract/client/React transformation.
2. Update mocks, tests, types, and documentation.
3. Run package and repository validation.

## Validation

- Mini App Bridge build, typecheck, and tests.
- Runtime build, typecheck, and tests.
- `npm run check`, `npm run format:check`, and `git diff --check`.

## Compatibility and human review

Low-level `getStatus` is intentionally normalized; React remains source-compatible. Review account-selected, accountless, unavailable, response-correlation, and status-event cases.

## Completion criteria

No successful status envelope duplicates account in payload and context, and all SDK validation passes.

## Out of scope

New adapters, protocol versions, capability discovery, or authorization changes.

## Blockers

None.
