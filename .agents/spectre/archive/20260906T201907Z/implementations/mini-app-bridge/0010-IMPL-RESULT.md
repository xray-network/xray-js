# Mini App Bridge implementation 0010 result

Result-Version: v1
Implementation-ID: mini-app-bridge/0010
Instruction: ./0010-IMPL-INSTR.md
Evidence-Mode: LOCAL

## Change dispositions

| Change ID | Disposition | Implementation | Validation |
| --- | --- | --- | --- |
| C01 | `IMPLEMENTED` | The Cardano contract entry now re-exports Cardano Bridge and CIP-30 constants, schemas, and types. | Bridge and runtime contract tests passed. |
| C02 | `IMPLEMENTED` | Removed the `/cardano/cip30` export mapping and obsolete protocol barrel. | Both retired package specifiers fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`; built artifacts contain no retired entry. |
| C03 | `IMPLEMENTED` | Updated README examples, including commented optional `window.cardano.xrayBridge` installation, XRAY App, Mini App Builder, and the runtime facade. | All application typechecks and production builds passed. |

## Outcome

`/mini-app-bridge/cardano` is now the sole public Cardano protocol-contract entry. Role-specific operations remain at `client.cardano.cip30` and `host.cardano.cip30`.

## Exported change contract

| Semantic change | Compatibility | Downstream action |
| --- | --- | --- |
| `/mini-app-bridge/cardano/cip30` no longer exists. | Intentional breaking path cleanup; protocol values and types are unchanged. | Import CIP-30 contracts from `/mini-app-bridge/cardano`. |
| Client and host CIP-30 operations are unchanged. | Operational API compatible. | Continue using `client.cardano.cip30` or `host.cardano.cip30`. |

## Validation

- `npm run check` — passed; 33 deterministic tests passed and one live integration test skipped.
- `npm run format:check` — passed.
- Negative package-resolution and built-artifact audits — passed.
- XRAY App full verification — passed.
- Builder, Template, Assets, Wallet, Transactions, and Graph typechecks/builds — passed.
- Workspace retired-path scan and repository diff checks — passed.

## Deviations from instruction

Node 20.18.1 produced the known React Router Node 22.22+ warning. All checks and production builds still passed.

## Remaining human review

Review the intentional removal of the nested public path.
