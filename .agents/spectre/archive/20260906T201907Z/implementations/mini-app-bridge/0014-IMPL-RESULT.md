# Mini App Bridge implementation 0014 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0014
Instruction: ./0014-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Added the strict wire identity `{ host: "xray.app" }`; platform status results/events now carry account selection only in nullable context. | Contract, response, event, selected-account, and accountless tests pass. |
| C02 | `IMPLEMENTED` | `clientPlatformV1.getStatus()` now returns the standard correlated response. The React store projects payload plus context back to `{ host, account }`. | Mini App Bridge build, typecheck, and 11 tests pass. |
| C03 | `IMPLEMENTED` | Updated mocks, public types, package guides, runtime facade validation, and removed duplicated-account wire examples. | Runtime build/typecheck/3 tests, repository check, formatting, stale scan, and diff check pass. |

## Outcome

Low-level platform status now has the same response shape as every other request: `{ payload: { host }, context,
requestId }`. The host marker is always present in a successful response; only account context is nullable. React
consumers retain `{ host, account }` without source changes.

## Inputs consumed

- `0014-IMPL-INSTR.md` and the human-approved normalized status shape.
- Platform v1 contract, client, host, React store, testing mock, focused tests, package docs, and runtime facade.

## Project changes

- Added `PlatformIdentity` and restricted status wire payload schemas to that identity.
- Restored standard correlated client responses and added the React payload/context projection.
- Updated mocks, tests, exports, and Platform/package documentation.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01-C03 | Platform v1 status payload is exactly `{ host: "xray.app" }`; selected account is nullable context. | Low-level status consumers must read `response.context`; React `useStatus().data.account` is unchanged. | Hosts must remove account from status result/event payloads; raw clients and relays must preserve the correlated envelope. |

## Validation

- Mini App Bridge build/typecheck/tests: PASS, 11 tests.
- Runtime build/typecheck/tests: PASS, 3 tests.
- `npm run check`: PASS across all SDK workspaces.
- `npm run format:check`, stale-schema audit, and `git diff --check`: PASS.

## Deviations from instruction

None.

## Remaining human review

- Confirm raw selected/accountless responses and events show account only in context.
- Confirm React selected, accountless, unavailable, and cleanup behavior in an embedded mini app.

## Reproducibility

From `xray-js`, run `npm run check`, `npm run format:check`, and `git diff --check`.
