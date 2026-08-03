import { CardanoWeb3, CardanoLib, utils, CW3Types } from "../index.js"
import { createTransaction, getTransactionParts } from "../libs/cardanoLib/index.js"
import { Account } from "./account.js"

export class TxFinalizer {
  private cw3: CardanoWeb3
  private resolvedUtxos: CW3Types.Utxo[]
  private queue: (() => unknown)[] = []
  __tx: CardanoLib.Transaction
  __witnessBuilder: CardanoLib.TransactionWitnessSetBuilder

  constructor(cw3: CardanoWeb3, tx: string, resolvedUtxos: CW3Types.Utxo[] = []) {
    this.cw3 = cw3
    this.resolvedUtxos = resolvedUtxos
    this.__tx = CardanoLib.Transaction.from_cbor_hex(tx)
    this.__witnessBuilder = CardanoLib.TransactionWitnessSetBuilder.new()
  }

  /**
   * Sign TX with private key
   * @param verificationKey Private key to sign with
   * @returns TxFinalizer instance
   */
  signWithVrfKey = (verificationKey: string) => {
    this.queue.push(async () => {
      const vkey = CardanoLib.PrivateKey.from_bech32(verificationKey)
      this.__witnessBuilder.add_vkey(
        CardanoLib.make_vkey_witness(CardanoLib.hash_transaction(getTransactionParts(this.__tx).body), vkey)
      )
    })
    return this
  }

  /**
   * Sign TX with account
   * @param account Account to sign with
   * @param utxos UTXOs to use for signing (trying to find used signing keys)
   * @param password Password to decode xprv key (optional)
   * @returns TxFinalizer instance
   */
  signWithAccount = (account: Account, utxos: CW3Types.Utxo[], password?: string) => {
    this.queue.push(async () => {
      if (account.__config.type === "xprv") {
        if (account.__config.xprvKeyIsEncoded && !password)
          throw new Error("Password is required to sign with xprv encoded account")
        const xprvKey = account.__config.xprvKeyIsEncoded
          ? account.getDecodedXprvKey(password)
          : account.__config.xprvKey

        const paymentVerificationKey = utils.keys.xprvToVrfKey(
          xprvKey,
          account.__config.accountPath,
          account.__config.addressPath
        )
        const paymentKey = CardanoLib.PrivateKey.from_bech32(paymentVerificationKey)
        const paymentKeyHash = paymentKey.to_public().hash().to_hex()

        const stakingVerificationKey = utils.keys.xprvToVrfKey(xprvKey, account.__config.accountPath, [2, 0])
        const stakingKey = CardanoLib.PrivateKey.from_bech32(stakingVerificationKey)
        const stakingKeyHash = stakingKey.to_public().hash().to_hex()

        const resolvedUtxos = new Map<string, CW3Types.Utxo>()
        for (const utxo of [...this.resolvedUtxos, ...utxos]) {
          resolvedUtxos.set(`${utxo.transaction.id}#${utxo.index}`, utxo)
        }
        if (resolvedUtxos.size > 0) {
          const foundHashes = utils.tx.discoverOwnUsedTxKeyHashes(
            this.__tx,
            [stakingKeyHash, paymentKeyHash],
            [...resolvedUtxos.values()]
          )
          if (foundHashes.includes(paymentKeyHash)) {
            this.__witnessBuilder.add_vkey(
              CardanoLib.make_vkey_witness(CardanoLib.hash_transaction(getTransactionParts(this.__tx).body), paymentKey)
            )
          }
          if (foundHashes.includes(stakingKeyHash)) {
            this.__witnessBuilder.add_vkey(
              CardanoLib.make_vkey_witness(CardanoLib.hash_transaction(getTransactionParts(this.__tx).body), stakingKey)
            )
          }
        }
      }
      if (account.__config.type === "connector") {
        const witnessSetHex = await account.__config.connector.signTx(this.__tx.to_cbor_hex())
        const witnessSet = CardanoLib.TransactionWitnessSet.from_cbor_hex(witnessSetHex)
        this.__witnessBuilder.add_existing(witnessSet)
      }
      if (account.__config.type === "ledger") {
        throw new Error("Ledger account signing is not implemented yet")
      }
      if (account.__config.type === "trezor") {
        throw new Error("Trezor account signing is not implemented yet")
      }
      if (account.__config.type === "xpub") {
        throw new Error("Can't sign TX with xpub account type. Use signWithVrfKey() method instead")
      }
    })

    return this
  }

  /**
   * Apply all methods and return TxFinalizer instance
   * @returns TxFinalizer instance
   */
  apply = async () => {
    // Add witness set to TX
    this.__witnessBuilder.add_existing(getTransactionParts(this.__tx).witnessSet)

    // Execute queue tasks
    for (const task of this.queue) {
      await task()
    }

    // Rebuild finalized TX
    const parts = getTransactionParts(this.__tx)
    this.__tx = createTransaction({ ...parts, witnessSet: this.__witnessBuilder.build() })

    return this
  }

  /**
   * Apply all methods and return TX in JSON format
   * @returns TX in JSON format
   */
  applyAndToJson = async () => {
    await this.apply()
    return {
      tx: this.__tx.to_cbor_hex(),
      hash: CardanoLib.hash_transaction(getTransactionParts(this.__tx).body).to_hex(),
      json: this.__tx.to_js_value(),
    }
  }

  /**
   * Apply all methods and submit transaction to blockchain
   * @returns Transaction hash
   */
  applyAndSubmit = async () => {
    await this.apply()
    return await this.cw3.provider.submitTx(this.__tx.to_cbor_hex())
  }
}
