# Mini App Bridge implementation 0003 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0003
Instruction: ./0003-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Extracted generic transport and XRAY platform protocol/client/host layers; platform owns handshake, settings, and routing only. | Full monorepo check passed. |
| C02 | `IMPLEMENTED` | Added Cardano-native schemas, client/host APIs, React store/hooks, and `xray.cardano.*` namespaces. | Bridge typecheck and every active mini-app build passed. |
| C03 | `IMPLEMENTED` | Nested the CIP-30 iframe adapter under Cardano with `xray.cardano.cip30.*`, separate enable state, connector installation, correlated standard errors, and the current collateral signature. | Bridge behavior tests and public-subpath runtime check passed. |
| C04 | `IMPLEMENTED` | Published transport, Cardano, Cardano React/testing, and CIP-30 paths through bridge and runtime packages; removed the mixed protocol path. | Runtime build and import assertions passed. |
| C05 | `IMPLEMENTED` | Split generic and Cardano testing exports and migrated mock schemas/state to the new namespaces. | Bridge build and typecheck passed. |

## Outcome

The bridge is blockchain-extensible without pretending chain protocols are interchangeable. Shared transport carries the discriminated host context, platform APIs remain neutral, and Cardano native/CIP-30 APIs have explicit ownership.

## Inputs consumed

Current human request, bridge/runtime sources, and all active XRAY host/mini-app consumers.

## Project changes

- Added `transport`, `platform`, `cardano`, `cardano/react`, and `cardano/cip30` source boundaries.
- Added structured handshake protocol advertisements for `cardano.native` and `cardano.cip30`.
- Added context-schema generics so Cardano responses/listeners statically carry `CardanoHostContext`.
- Removed old mixed client/host/protocol files and empty source directories.
- Added matching public runtime facade subpaths and updated documentation.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Root/client/host/react paths are platform-only. | Old chain-ambiguous APIs are removed. | Import platform behavior from shared bridge paths. |
| C02 | Native Cardano uses `/cardano`, `/cardano/client`, `/cardano/host`, and `/cardano/react`. | Wire types are now `xray.cardano.*`. | Move Cardano consumers to Cardano subpaths. |
| C03 | CIP-30 is a Cardano dApp compatibility adapter. | Old `xray.cip30.*` and mixed client export are removed. | Use `/cardano/cip30/*`; hosts execute against XRAY's wallet implementation. |
| C04 | Handshake returns `{ protocolVersion, protocols }`. | Boolean handshake payload is removed. | Advertise only protocols the host can execute. |

## Validation

- `npm run check`: PASS; 31 local tests passed and one opt-in live test skipped.
- Bridge and runtime public subpath import assertion: PASS.
- XRAY App full verification and every active mini-app typecheck/build: PASS.
- `git diff --check`: PASS.

## Deviations from instruction

None.

## Remaining human review

Review public subpath ergonomics, wire namespaces, and the deliberate lack of compatibility aliases.

## Reproducibility

Run `npm run check` in xray-js, then each recorded downstream validation command with linked local packages.
