# XRAY Cardano SDK

`@xray-network/xray-js-cardano` contains the Cardano application client used by the XRAY JavaScript SDK. The public
`@xray-network/xray-js` runtime exposes it through `/cardano`, with low-level pure JavaScript primitives under
`/cardano/lib` and test providers under `/cardano/testing`.

## Create a Cardano client

```ts
import { createCardano } from "@xray-network/xray-js/cardano"

const cardano = createCardano({ network: "preview", provider })
const tip = await cardano.chain.getTip()
```

For mainnet, preprod, and preview, the default provider and Koios client use
`https://graph.xray.app/output/services/xray-koios/{network}-api-v1`. The NFT CDN client uses
`https://graph.xray.app/output/services/xray-nftcdn-cardano/{network}-api-v1`. These endpoint prefixes
already select API v1; do not append another `/api/v1` segment.

Override URLs and headers through `clients`. A configured Koios URL and headers also apply to the
default provider; an explicit `provider` takes precedence. Custom networks need their own provider
and any service URLs they use.

Ogmios and Kupo have no default Graph endpoints. Set `clients.ogmios` and `clients.kupo` explicitly
to enable them; otherwise `cardano.clients.ogmios` and `cardano.clients.kupo` are `undefined`.

Client and transaction-plan creation are synchronous. Operations that can cross a provider or wallet boundary return
promises:

```ts
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
import { providers, utilities, type types } from "@xray-network/xray-js/cardano"

const provider: types.Provider = providers.koios.createKoiosProvider(koiosUrl)
const addressIsValid = utilities.addresses.validateAddress(address)
const assetName = utilities.assets.assetNameToAssetNameAscii(assetNameHex)
```

## Low-level Cardano library

```ts
import * as cardanoLib from "@xray-network/xray-js/cardano/lib"

const address = cardanoLib.chain.Address.from_bech32(addressBech32)
const key = cardanoLib.crypto.PrivateKey.from_bech32(privateKeyBech32)
```

The application entry does not duplicate low-level `cips`, `crypto`, `plutus`, or ledger primitives. Import
`/cardano/lib` only when those APIs are required.

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
