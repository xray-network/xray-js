# XRAY Cardano SDK

`@xray-network/xray-js-cardano` provides Cardano accounts, wallet connections, providers,
transaction building, signing, submission, and inspection for applications.

## Installation

```sh
npm install @xray-network/xray-js-cardano
```

If you already use the aggregate `@xray-network/xray-js` package, the same application exports
are available from `@xray-network/xray-js/cardano`.

## Requirements

ESM-only, with TypeScript declarations included. Use Node.js 20.19 or newer or a modern browser
with `fetch`, `Uint8Array`, `bigint`, and Web Crypto. Browser-wallet connections require a
CIP-30 wallet injected into `window.cardano`; local providers and account utilities do not.

## Quickstart

```ts
import { createCardano } from "@xray-network/xray-js-cardano"

const cardano = createCardano({ network: "preview" })
const tip = await cardano.chain.getTip()
console.log(tip)
```

This example reads the preview network through the default remote provider. It does not require
a wallet. Catch provider/network failures in the calling application.

## Entry points

| Entry point                             | Contents                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `@xray-network/xray-js-cardano`         | Client factory, accounts, wallets, providers, transactions, utilities, and types |
| `@xray-network/xray-js-cardano/testing` | In-memory provider and provider-test helpers                                     |

## Providers and service clients

For mainnet, preprod, and preview, the default provider and Koios client use
`https://graph.xray.app/output/services/xray-koios/{network}-api-v1`. The NFT CDN client uses
`https://graph.xray.app/output/services/xray-nftcdn-cardano/{network}-api-v1`. These endpoint prefixes
already select API v1; do not append another `/api/v1` segment.

Override URLs and headers through `clients`. A configured Koios URL and headers also apply to the
default provider; an explicit `provider` takes precedence. Custom networks require an explicit
`slotConfig`; supply your own provider and URLs for any service clients you use.

Ogmios and Kupo have no default Graph endpoints. Set `clients.ogmios` and `clients.kupo` explicitly
to enable them; otherwise `cardano.clients.ogmios` and `cardano.clients.kupo` are `undefined`.

## Build, sign, and submit

Client and transaction-plan creation are synchronous. Operations that can cross a provider or wallet boundary return
promises.

The following continues the quickstart. Supply your own mnemonic, UTxOs owned by the derived
account, and a recipient address on the selected network.

```ts
import type { types } from "@xray-network/xray-js-cardano"

declare const mnemonic: string
declare const utxos: types.Utxo[]
declare const recipient: string

const account = cardano.accounts.fromMnemonic(mnemonic)

const plan = cardano.transactions
  .create()
  .setChangeAddress(account.paymentAddress)
  .spend(utxos)
  .payTo([{ address: recipient, value: 2_000_000n }])

const unsigned = await plan.build()
const signed = cardano.transactions.signWithPrivateKey(unsigned, account.getPrivateKey())
const transactionHash = await cardano.transactions.submit(signed)
```

## Application namespaces

```ts
import { providers, utilities, type types } from "@xray-network/xray-js-cardano"

declare const koiosUrl: string
declare const address: string
declare const assetNameHex: string

const provider: types.Provider = providers.koios.createKoiosProvider(koiosUrl)
const addressIsValid = utilities.addresses.validateAddress(address)
const assetName = utilities.assets.assetNameToAssetNameAscii(assetNameHex)
```

## Low-level Cardano library

The application entry does not export low-level ledger and cryptography bindings. Install their
aggregate package explicitly when you need them:

```sh
npm install @xray-network/xray-cardano-lib
```

```ts
import { chain } from "@xray-network/xray-cardano-lib"

const address = chain.Address.from_bech32("stake1u8pcjgmx7962w6hey5hhsd502araxp26kdtgagakhaqtq8squng76")
console.log(address.network_id())
```

Applications using `@xray-network/xray-js` can import these same namespaces from
`@xray-network/xray-js/cardano/lib`.

Transaction conversions construct ADA-only values with the coin-only CBOR form; the `[coin, multiasset]` form is
reserved for values containing tokens. Caller-supplied transaction CBOR remains lossless during inspection and
signing. Rebuild an existing transaction explicitly if its ADA-only outputs contain an empty multi-asset map.

## Intrinsic transaction inspection

`transactions.inspect(cbor)` and `cardano.transactions.inspect(cbor)` synchronously return a deeply immutable,
exact-integer view of every field contained in an ordinary transaction envelope. Inputs remain transaction-ID/index
references because their addresses and values are not present in transaction CBOR. The result includes all outputs,
certificate tags, validity slots, mint and withdrawals, collateral and governance fields, factual witness presence,
auxiliary metadata and scripts, plus lossless CBOR for unsupported future fields. Inspection never calls a provider,
classifies a transaction as fully signed, or performs JSON conversion.

## Errors and signing material

Provider, account, and transaction operations may throw; asynchronous operations reject their
promises on failure. Handle those failures at the application boundary. A submission timeout
does not prove that a transaction was rejected; check its status before submitting again.
Keep mnemonics, private keys, and account exports containing private material out of logs and
source control. Browser-wallet accounts let the wallet own signing and approval.

## Documentation and development

See the [SDK overview](https://github.com/xray-network/xray-js/blob/main/packages/runtime/README.md) and
[source and tests](https://github.com/xray-network/xray-js/tree/main/packages/cardano).
From a repository checkout, build the linked Cardano library first, then run `npm run check`
at the SDK repository root to build, test, and typecheck all SDK packages.

## License

MIT. See [LICENSE](./LICENSE).
