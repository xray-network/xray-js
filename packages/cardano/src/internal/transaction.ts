import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"

export type TransactionParts = {
  body: CardanoLib.TransactionBody
  witnessSet: CardanoLib.TransactionWitnessSet
  isValid: boolean
  auxiliaryData?: CardanoLib.AuxiliaryData
}

export const getTransactionParts = (transaction: CardanoLib.Transaction): TransactionParts => {
  const auxiliaryData = transaction.auxiliary_data()
  return {
    body: transaction.body(),
    witnessSet: transaction.witness_set(),
    isValid: transaction.is_valid(),
    ...(auxiliaryData ? { auxiliaryData } : {}),
  }
}

export const createTransaction = ({
  body,
  witnessSet,
  isValid,
  auxiliaryData,
}: TransactionParts): CardanoLib.Transaction => {
  return CardanoLib.Transaction.new(body, witnessSet, isValid, auxiliaryData ?? null)
}
