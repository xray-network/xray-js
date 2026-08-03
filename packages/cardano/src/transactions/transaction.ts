import * as CardanoLib from "@xray-network/xray-cardano-lib"
import type { CardanoAccount } from "../accounts/account.js"
import { createTransaction, getTransactionParts } from "../internal/transaction.js"
import * as keys from "../primitives/keys.js"
import * as transactionPrimitives from "../primitives/tx.js"
import type { Utxo } from "../types.js"

export interface AccountSignOptions {
  password?: string
  resolvedUtxos?: Utxo[]
}

export interface UnsignedTransaction {
  readonly kind: "unsigned"
  readonly cbor: string
  readonly hash: string
  readonly json: unknown
  readonly resolvedUtxos: readonly Utxo[]
}

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

export const unsignedTransactionFromCbor = (cbor: string, resolvedUtxos: readonly Utxo[] = []): UnsignedTransaction => {
  const transaction = CardanoLib.Transaction.from_cbor_hex(cbor)
  return Object.freeze({
    kind: "unsigned" as const,
    cbor: transaction.to_cbor_hex(),
    hash: CardanoLib.hash_transaction(getTransactionParts(transaction).body).to_hex(),
    json: transaction.to_js_value(),
    resolvedUtxos: Object.freeze([...resolvedUtxos]),
  })
}

export const signTransaction = async (
  unsigned: UnsignedTransaction,
  accounts: CardanoAccount | readonly CardanoAccount[],
  options: AccountSignOptions = {}
): Promise<SignedTransaction> => {
  const transaction = CardanoLib.Transaction.from_cbor_hex(unsigned.cbor)
  const witnessBuilder = CardanoLib.TransactionWitnessSetBuilder.new()
  witnessBuilder.add_existing(getTransactionParts(transaction).witnessSet)

  for (const account of Array.isArray(accounts) ? accounts : [accounts]) {
    if (account.type === "private-key") {
      const material = account.getSigningMaterial(options.password)
      const paymentKey = CardanoLib.PrivateKey.from_bech32(
        keys.derivePrivateKey(material.rootPrivateKey, material.accountPath, material.addressPath)
      )
      const stakingKey = CardanoLib.PrivateKey.from_bech32(
        keys.derivePrivateKey(material.rootPrivateKey, material.accountPath, [2, 0])
      )
      const paymentKeyHash = paymentKey.to_public().hash().to_hex()
      const stakingKeyHash = stakingKey.to_public().hash().to_hex()
      const resolved = new Map<string, Utxo>()
      for (const utxo of [...unsigned.resolvedUtxos, ...(options.resolvedUtxos ?? [])]) {
        resolved.set(`${utxo.transaction.id}#${utxo.index}`, utxo)
      }
      const foundHashes = transactionPrimitives.discoverOwnUsedTxKeyHashes(
        transaction,
        [stakingKeyHash, paymentKeyHash],
        [...resolved.values()]
      )
      const transactionHash = CardanoLib.hash_transaction(getTransactionParts(transaction).body)
      if (foundHashes.includes(paymentKeyHash)) {
        witnessBuilder.add_vkey(CardanoLib.make_vkey_witness(transactionHash, paymentKey))
      }
      if (foundHashes.includes(stakingKeyHash)) {
        witnessBuilder.add_vkey(CardanoLib.make_vkey_witness(transactionHash, stakingKey))
      }
      continue
    }
    if (account.type === "wallet") {
      const witnessSetHex = await account.getWallet().signTransaction(unsigned.cbor)
      witnessBuilder.add_existing(CardanoLib.TransactionWitnessSet.from_cbor_hex(witnessSetHex))
      continue
    }
    throw new Error(`Account type ${account.type} cannot sign transactions`)
  }

  const parts = getTransactionParts(transaction)
  return signedTransactionFromCbor(createTransaction({ ...parts, witnessSet: witnessBuilder.build() }).to_cbor_hex())
}

export const signTransactionWithPrivateKey = (unsigned: UnsignedTransaction, privateKey: string): SignedTransaction => {
  const transaction = CardanoLib.Transaction.from_cbor_hex(unsigned.cbor)
  const key = CardanoLib.PrivateKey.from_bech32(privateKey)
  const witnessBuilder = CardanoLib.TransactionWitnessSetBuilder.new()
  witnessBuilder.add_existing(getTransactionParts(transaction).witnessSet)
  witnessBuilder.add_vkey(
    CardanoLib.make_vkey_witness(CardanoLib.hash_transaction(getTransactionParts(transaction).body), key)
  )
  const parts = getTransactionParts(transaction)
  return signedTransactionFromCbor(createTransaction({ ...parts, witnessSet: witnessBuilder.build() }).to_cbor_hex())
}
