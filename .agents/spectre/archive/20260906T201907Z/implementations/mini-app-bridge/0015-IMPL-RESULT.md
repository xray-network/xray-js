# Mini App Bridge implementation 0015 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0015
Instruction: ./0015-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Replaced the closed Cardano explorer enum with `z.string().min(1)`. The inferred public `Explorer` type is now `string`; method/event names, scope/version, context, and response envelopes are unchanged. | Mini App Bridge build and typecheck pass; focused tests accept an arbitrary nonempty identifier. |
| C02 | `IMPLEMENTED` | Changed mock explorer state to use the public `Explorer` type and added end-to-end request, event, and React store coverage for future identifiers. Empty-string and non-string response/event values are rejected. | Mini App Bridge suite passes 12 tests, including the new future/invalid explorer test. |
| C03 | `IMPLEMENTED` | Documented explorer identifiers as host-controlled nonempty strings, retained existing values as examples, and required generic handling of unfamiliar identifiers. Removed active closed-enum assumptions. | Runtime build/typecheck/3 tests, complete workspace check, formatting, stale scan, and diff check pass. |

## Outcome

Cardano v1 explorer identifiers are now open nonempty strings. XRAY App may introduce future explorer identifiers
without another SDK schema or protocol-version change after consumers receive this one-time widened schema. Existing
identifier values and all client, host, React, routing, context, and correlation behavior remain unchanged.

## Inputs consumed

- The human-approved open explorer requirement recorded in `0015-IMPL-INSTR.md`.
- Cardano v1 contract, client/host exports, React store, testing mock, focused tests, package guide, and runtime facade.

## Project changes

- Changed `explorerSchema` from a four-value Zod enum to a nonempty Zod string.
- Reused the inferred `Explorer` type in mock host state.
- Added future identifier request/event/React coverage and invalid empty/non-string coverage.
- Updated the Cardano bridge guide with open-identifier compatibility guidance.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01-C03 | Cardano v1 explorer payloads accept any nonempty string. | Existing strings and all API/envelope shapes remain valid. Older strict-enum SDK builds still reject unfamiliar values. | Roll this SDK schema out once before XRAY App emits a new identifier; afterward new identifiers require no SDK schema release. Consumers must render unknown identifiers generically. |

## Validation

- Mini App Bridge build and typecheck: PASS.
- Mini App Bridge tests: PASS, 12 tests.
- Runtime build and typecheck: PASS.
- Runtime tests: PASS, 3 tests.
- `npm run check`: PASS across all SDK workspaces; Cardano has 27 passing tests and one expected live test skipped.
- `npm run format:check`: PASS.
- Active closed-enum scan and `git diff --check`: PASS.

## Deviations from instruction

None.

## Remaining human review

- Confirm a mini app displays or falls back cleanly for an explorer identifier it does not recognize.
- Coordinate the one-time consumer SDK rollout before XRAY App sends its first new identifier.

## Reproducibility

From the `xray-js` root, run `npm run check`, `npm run format:check`, and `git diff --check`. The focused suite is
available through `npm test --workspace @xray-network/xray-js-mini-app-bridge`.
