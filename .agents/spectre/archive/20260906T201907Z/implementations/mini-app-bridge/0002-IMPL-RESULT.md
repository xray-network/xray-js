# Mini App Bridge implementation 0002 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0002
Instruction: ./0002-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | Added discriminated host context and required it on core and CIP-30 host envelopes. | Build, typecheck, and runtime schema check passed. |
| C02 | `IMPLEMENTED` | Client parsing, host send helpers, and test mocks now preserve and validate context. | Build and typecheck passed. |
| C03 | `IMPLEMENTED` | React caches context and exposes `useHostContext`, `useBlockchain`, contextual `useNetwork`, and `useMiniApp().context`. | Build and typecheck passed. |

## Outcome

Host messages now carry authoritative chain/network context beside their routing fields, and context-free or invalid host envelopes are rejected by SDK consumers.

## Inputs consumed

Current human request and `packages/mini-app-bridge/src/`.

## Project changes

- Added `protocol/context.ts` and contextual envelope parsing/types.
- Updated core/CIP-30 clients and hosts, React state/hooks, and testing mocks.

## Exported change contract

| Change ID | Semantic change | Compatibility | Downstream action |
| --- | --- | --- | --- |
| C01 | Every host envelope requires `{ blockchain, network }` context. | Breaking for hosts emitting context-free messages. | Hosts must attach a valid discriminated context. |
| C02 | Client response/listener APIs return validated context. | Malformed host messages are ignored. | Consumers may read `message.context`. |
| C03 | React exposes host context and derived blockchain/network values. | `useNetwork` remains named but is context-derived. | React mini apps may use `useHostContext()`. |

## Validation

- `npm run build` — passed.
- `npm run typecheck` — passed.
- Runtime `parseMessage` check — accepted Bitcoin/testnet context and rejected a missing context.

## Deviations from instruction

None.

## Remaining human review

Review the breaking envelope requirement and public hook names.

## Reproducibility

Run the recorded commands from the xray-js repository root with installed npm dependencies.
