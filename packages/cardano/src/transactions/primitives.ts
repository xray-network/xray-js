import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"
import { ScriptHash } from "@xray-network/xray-cardano-lib-crypto"
import type * as CardanoTypes from "../types.js"
import { fromHex } from "../utilities/encoding.js"
import { getShelleyOrByronAddress } from "../utilities/addresses.js"
import { scriptToScriptRef } from "../utilities/scripts.js"

export const createCostModels = (costModels: CardanoTypes.CostModels): CardanoLib.CostModels => {
  return CardanoLib.CostModels.from_json(
    JSON.stringify({
      "0": costModels.PlutusV1,
      "1": costModels.PlutusV2,
      "2": costModels.PlutusV3,
    })
  )
}

export const getTransactionBuilder = (
  protocolParams: CardanoTypes.ProtocolParameters
): CardanoLib.TransactionBuilder => {
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

export const assetsToValue = (value?: CardanoTypes.Value, assets?: CardanoTypes.Asset[]): CardanoLib.Value => {
  const multiAsset = CardanoLib.MultiAsset.new()

  if (assets) {
    for (const asset of assets) {
      const policyId = ScriptHash.from_hex(asset.policyId)
      const assetName = CardanoLib.AssetName.from_raw_bytes(fromHex(asset.assetName || ""))
      const policyAssets = multiAsset.get_assets(policyId) ?? CardanoLib.MapAssetNameToCoin.new()
      policyAssets.insert(assetName, asset.quantity)
      multiAsset.insert_assets(policyId, policyAssets)
    }
  }

  return CardanoLib.Value.new(value || 0n, multiAsset)
}

export const utxoToCore = (utxo: CardanoTypes.Utxo): CardanoLib.TransactionUnspentOutput => {
  return CardanoLib.TransactionUnspentOutput.new(utxoToTransactionInput(utxo), utxoToTransactionOutput(utxo))
}

export const utxoToTransactionInput = (utxo: CardanoTypes.Utxo): CardanoLib.TransactionInput => {
  return CardanoLib.TransactionInput.new(CardanoLib.TransactionHash.from_hex(utxo.transaction.id), BigInt(utxo.index))
}

export const utxoToTransactionOutput = (utxo: CardanoTypes.Utxo): CardanoLib.TransactionOutput => {
  const value = assetsToValue(utxo.value, utxo.assets)
  const outputBuilder = outputToTransactionOutputBuilder(
    {
      address: utxo.address,
      value: utxo.value,
      assets: utxo.assets,
    },
    utxo.datum && utxo.datumType
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
  output: CardanoTypes.Output,
  datum?: CardanoTypes.DatumOutput,
  script?: CardanoTypes.Script
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
  ownUtxos: CardanoTypes.Utxo[]
): string[] => {
  const required = CardanoLib.discover_required_witnesses(tx, ownUtxos.map(utxoToCore))
  return [...required.vkeys.keys()].filter((hash) => ownKeyHashes.includes(hash))
}
