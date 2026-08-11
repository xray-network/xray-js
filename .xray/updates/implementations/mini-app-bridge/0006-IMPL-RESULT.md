# Mini App Bridge implementation 0006 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0006
Instruction: ./0006-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition   | Implementation                                                                                                  | Validation                                  |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| C01       | `IMPLEMENTED` | Renamed the public constant to `CARDANO_BRIDGE_PROTOCOL` and its value to `cardano.bridge`.                     | Full monorepo check passed.                 |
| C02       | `IMPLEMENTED` | Migrated React discovery, mock handshake defaults, contract assertions, and test terminology to Cardano Bridge. | Focused bridge tests and formatting passed. |
| C03       | `IMPLEMENTED` | Documented both protocol IDs, constant-based discovery, bridge requests, CIP-30 enablement, and connector installation. | README formatting audit passed.             |

## Outcome

Hosts and mini apps can use the explicit `cardano.bridge` identifier for XRAY's Cardano bridge API without conflating it with Cardano native assets.

## Inputs consumed

- Human request on 2026-08-11.
- Cardano bridge protocol, React hooks, mock host, and bridge tests.
- Active sibling host and template consumers.

## Project changes

- Replaced `CARDANO_NATIVE_PROTOCOL` with `CARDANO_BRIDGE_PROTOCOL`.
- Replaced the advertised protocol value `cardano.native` with `cardano.bridge`.
- Updated discovery hooks, default test handshake data, and assertions.
- Updated the root README with separate Cardano Bridge and CIP-30 discovery and usage examples.
- Kept all `xray.cardano.client.*` and `xray.cardano.host.*` wire message names unchanged.

## Exported change contract

| Change ID | Semantic change                                                 | Compatibility                                             | Downstream action                        |
| --------- | --------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| C01       | The Cardano bridge protocol identifier is now `cardano.bridge`. | Intentional pre-release breaking rename; no legacy alias. | Migrate host advertisements and checks. |
| C02       | React Cardano data hooks check the new protocol identifier.     | Hook signatures and behavior are otherwise unchanged.    | Advertise `cardano.bridge`.              |
| C03       | README consumers discover protocols through exported constants. | Examples use existing public package subpaths.            | Follow the documented activation flow.  |

## Validation

- `npm run check` — passed all workspace builds, tests, and typechecks.
- Focused mini-app bridge test — passed 2 tests.
- Active consumer verification — XRAY App and React template passed.
- Prettier audit and `git diff --check` — passed.

## Deviations from instruction

None.

## Remaining human review

Confirm external pre-release consumers migrate their handshake protocol checks to `cardano.bridge`.

## Reproducibility

Run `npm run check`, then verify a mock handshake advertises `cardano.bridge` and `cardano.cip30`.
