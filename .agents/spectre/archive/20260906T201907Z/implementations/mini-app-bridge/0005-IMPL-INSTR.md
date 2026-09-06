# Mini App Bridge implementation 0005 instruction

Implementation-Version: v1
Implementation-ID: mini-app-bridge/0005
Created: 20260811T093635Z
Evidence-Mode: LOCAL
Depends-On: mini-app-bridge/0004
Provider-Evidence: NONE

## Objective

Expose the default Cardano compatibility connector as `window.cardano.xrayBridge`.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Rename the default connector key from `xray` to `xrayBridge` and update tests/docs. | Pre-release breaking rename. | Cardano CIP-30 client | Bridge tests and build. |

## Validation

- Bridge build, typecheck, and tests

## Out of scope

Protocol or connector API changes.

## Blockers

None.
