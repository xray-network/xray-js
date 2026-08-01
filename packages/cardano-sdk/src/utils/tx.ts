import { bytesToHex, decodeCbor, type CborValue } from "@xray-network/xray-cardano-lib-core"
import { CardanoLib, CW3Types } from "../index.js"
import { fromHex } from "./misc.js"
import { getShelleyOrByronAddress, getCredentials } from "./address.js"
import { scriptToScriptRef } from "./script.js"

export const createCostModels = (costModels: CW3Types.CostModels): CardanoLib.CostModels => {
  const models = CardanoLib.MapU64ToArrI64.new()
  models.insert(0n, BigInt64Array.from(costModels.PlutusV1.map(BigInt)))
  models.insert(1n, BigInt64Array.from(costModels.PlutusV2.map(BigInt)))
  models.insert(2n, BigInt64Array.from(costModels.PlutusV3.map(BigInt)))
  return CardanoLib.CostModels.new(models)
}

export const getTxBuilder = (protocolParams: CW3Types.ProtocolParameters): CardanoLib.TransactionBuilder => {
  const pp = protocolParams
  const txBuilderConfig = CardanoLib.TransactionBuilderConfigBuilder.new()
    .fee_algo(CardanoLib.LinearFee.new(BigInt(pp.minFeeA), BigInt(pp.minFeeB), BigInt(pp.minFeeRefScriptCostPerByte)))
    .pool_deposit(BigInt(pp.poolDeposit))
    .key_deposit(BigInt(pp.keyDeposit))
    .coins_per_utxo_byte(BigInt(pp.coinsPerUtxoByte))
    .max_tx_size(pp.maxTxSize)
    .max_value_size(pp.maxValSize)
    .collateral_percentage(pp.collateralPercentage)
    .max_collateral_inputs(pp.maxCollateralInputs)
    .ex_unit_prices(
      CardanoLib.ExUnitPrices.new(
        CardanoLib.Rational.new(BigInt(pp.priceMem * 100_000_000), 100_000_000n),
        CardanoLib.Rational.new(BigInt(pp.priceStep * 100_000_000), 100_000_000n)
      )
    )
    .prefer_pure_change(true)
    .cost_models(createCostModels(pp.costModels))
    .build()

  return CardanoLib.TransactionBuilder.new(txBuilderConfig)
}

export const assetsToValue = (value?: CW3Types.Value, assets?: CW3Types.Asset[]): CardanoLib.Value => {
  const multiAsset = CardanoLib.MultiAsset.new()

  if (assets) {
    for (const asset of assets) {
      const policyId = CardanoLib.ScriptHash.from_hex(asset.policyId)
      const assetName = CardanoLib.AssetName.from_raw_bytes(fromHex(asset.assetName || ""))
      const policyAssets = multiAsset.get_assets(policyId) ?? CardanoLib.MapAssetNameToCoin.new()
      policyAssets.insert(assetName, asset.quantity)
      multiAsset.insert_assets(policyId, policyAssets)
    }
  }

  return CardanoLib.Value.new(value || 0n, multiAsset)
}

export const utxoToCore = (utxo: CW3Types.Utxo): CardanoLib.TransactionUnspentOutput => {
  return CardanoLib.TransactionUnspentOutput.new(utxoToTransactionInput(utxo), utxoToTransactionOutput(utxo))
}

export const utxoToTransactionInput = (utxo: CW3Types.Utxo): CardanoLib.TransactionInput => {
  return CardanoLib.TransactionInput.new(CardanoLib.TransactionHash.from_hex(utxo.transaction.id), BigInt(utxo.index))
}

export const utxoToTransactionOutput = (utxo: CW3Types.Utxo): CardanoLib.TransactionOutput => {
  const value = assetsToValue(utxo.value, utxo.assets)
  const outputBuilder = outputToTransactionOutputBuilder(
    {
      address: utxo.address,
      value: utxo.value,
      assets: utxo.assets,
    },
    utxo.datum
      ? {
          type: utxo.datumType,
          datum: utxo.datum,
        }
      : undefined,
    utxo.script || undefined
  )
  return outputBuilder.next().with_value(value).build().output()
}

export const outputToTransactionOutputBuilder = (
  output: CW3Types.Output,
  datum?: CW3Types.DatumOutput,
  script?: CW3Types.Script
): CardanoLib.TransactionOutputBuilder => {
  const address = getShelleyOrByronAddress(output.address)
  let outputBuilder = CardanoLib.TransactionOutputBuilder.new().with_address(address)
  if (datum) {
    if (datum.type === "inline") {
      const data = CardanoLib.PlutusData.from_cbor_hex(datum.datum)
      const datumOption = CardanoLib.DatumOption.new(1n, data)
      outputBuilder = outputBuilder.with_data(datumOption)
    }
    if (datum.type === "hash") {
      // TODO: Check if hash datums is set correctly in the UTXO (witness set)
      const data = CardanoLib.PlutusData.from_cbor_hex(datum.datum)
      outputBuilder = outputBuilder.with_communication_data(data)
    }
  }
  return script ? outputBuilder.with_reference_script(scriptToScriptRef(script)) : outputBuilder
}

export const discoverOwnUsedTxKeyHashes = (
  tx: CardanoLib.Transaction,
  ownKeyHashes: string[],
  ownUtxos: CW3Types.Utxo[]
): string[] => {
  const usedKeyHashes: string[] = []
  const transaction = decodeCbor(tx.to_cbor_bytes())
  if (transaction.kind !== "array" || transaction.values[0]?.kind !== "map") {
    throw new TypeError("Invalid Cardano transaction")
  }
  const body = transaction.values[0]
  const witnesses = transaction.values[1]
  const bodyField = (field: bigint): CborValue | undefined =>
    body.entries.find(([key]) => key.kind === "unsigned" && key.value === field)?.[1]
  const witnessField = (field: bigint): CborValue | undefined =>
    witnesses?.kind === "map"
      ? witnesses.entries.find(([key]) => key.kind === "unsigned" && key.value === field)?.[1]
      : undefined
  const collectionValues = (value: CborValue | undefined): readonly CborValue[] => {
    const collection = value?.kind === "tag" && value.tag === 258n ? value.value : value
    return collection?.kind === "array" ? collection.values : []
  }

  for (const inputs of [bodyField(0n), bodyField(13n)]) {
    for (const input of collectionValues(inputs)) {
      if (input.kind !== "array" || input.values[0]?.kind !== "bytes" || input.values[1]?.kind !== "unsigned") {
        continue
      }
      const txId = bytesToHex(input.values[0].value)
      const txIndex = Number(input.values[1].value)
      const utxo = ownUtxos.find((utxo) => utxo.transaction.id === txId && utxo.index === txIndex)
      if (utxo) {
        const { paymentCred } = getCredentials(utxo.address)
        usedKeyHashes.push(paymentCred.hash)
      }
    }
  }

  for (const certificate of collectionValues(bodyField(4n))) {
    if (certificate.kind !== "array" || certificate.values[0]?.kind !== "unsigned") continue
    const kind = Number(certificate.values[0].value)
    if (kind === 3 && certificate.values[1]?.kind === "array") {
      const pool = certificate.values[1]
      if (pool.values[0]?.kind === "bytes") usedKeyHashes.push(bytesToHex(pool.values[0].value))
      for (const owner of collectionValues(pool.values[6])) {
        if (owner.kind === "bytes") usedKeyHashes.push(bytesToHex(owner.value))
      }
    } else if (kind === 4 && certificate.values[1]?.kind === "bytes") {
      usedKeyHashes.push(bytesToHex(certificate.values[1].value))
    } else if (kind !== 0) {
      const credential = certificate.values[1]
      if (credential?.kind === "array" && credential.values[1]?.kind === "bytes") {
        usedKeyHashes.push(bytesToHex(credential.values[1].value))
      }
    }
  }

  const withdrawals = bodyField(5n)
  if (withdrawals?.kind === "map") {
    for (const [address] of withdrawals.entries) {
      if (address.kind !== "bytes") continue
      const credential = CardanoLib.RewardAddress.from_address(
        CardanoLib.Address.from_raw_bytes(address.value)
      )?.payment()
      const hash = credential?.as_pub_key() ?? credential?.as_script()
      if (hash) usedKeyHashes.push(hash.to_hex())
    }
  }

  for (const signer of collectionValues(bodyField(14n))) {
    if (signer.kind === "bytes") usedKeyHashes.push(bytesToHex(signer.value))
  }

  const keyHashesFromScript = (script: CborValue): void => {
    if (script.kind !== "array" || script.values[0]?.kind !== "unsigned") return
    const kind = Number(script.values[0].value)
    if (kind === 0 && script.values[1]?.kind === "bytes") {
      usedKeyHashes.push(bytesToHex(script.values[1].value))
      return
    }
    const nested = kind === 3 ? script.values[2] : script.values[1]
    if (kind >= 1 && kind <= 3 && nested?.kind === "array") {
      nested.values.forEach(keyHashesFromScript)
    }
  }
  collectionValues(witnessField(1n)).forEach(keyHashesFromScript)

  return usedKeyHashes.filter((hash) => ownKeyHashes.includes(hash))
}
