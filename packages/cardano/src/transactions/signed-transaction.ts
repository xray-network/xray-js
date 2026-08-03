import { CardanoLib } from "../internal/dependencies.js"
import { getTransactionParts } from "../internal/cardano-lib/index.js"

export interface SignedTransaction {
  readonly kind: "signed"
  readonly cbor: string
  readonly hash: string
  readonly json: unknown
}

export const signedTransactionFromCbor = (cbor: string): SignedTransaction => {
  const transaction = CardanoLib.Transaction.from_cbor_hex(cbor)
  return Object.freeze({
    kind: "signed" as const,
    cbor: transaction.to_cbor_hex(),
    hash: CardanoLib.hash_transaction(getTransactionParts(transaction).body).to_hex(),
    json: transaction.to_js_value(),
  })
}
