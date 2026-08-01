import { decodeCbor, encodeCbor } from "@xray-network/xray-cardano-lib-core"
import { CardanoLib } from "@"

export type TransactionParts = {
  body: CardanoLib.TransactionBody
  witnessSet: CardanoLib.TransactionWitnessSet
  isValid: boolean
  auxiliaryData?: CardanoLib.AuxiliaryData
}

export const getTransactionParts = (transaction: CardanoLib.Transaction): TransactionParts => {
  const value = decodeCbor(transaction.to_cbor_bytes())
  if (
    value.kind !== "array" ||
    value.values.length !== 4 ||
    value.values[0] === undefined ||
    value.values[1] === undefined ||
    value.values[2]?.kind !== "boolean"
  ) {
    throw new TypeError("Invalid Cardano transaction")
  }

  const auxiliaryData = value.values[3]
  return {
    body: CardanoLib.TransactionBody.from_cbor_bytes(encodeCbor(value.values[0])),
    witnessSet: CardanoLib.TransactionWitnessSet.from_cbor_bytes(encodeCbor(value.values[1])),
    isValid: value.values[2].value,
    ...(auxiliaryData !== undefined && auxiliaryData.kind !== "null"
      ? { auxiliaryData: CardanoLib.AuxiliaryData.from_cbor_bytes(encodeCbor(auxiliaryData)) }
      : {}),
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
