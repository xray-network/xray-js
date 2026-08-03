import { TTL } from "../config.js"

import KoiosClient, { KoiosTypes } from "cardano-koios-client"
import type * as CardanoTypes from "../types.js"
import { createProviderResolvers, pollUntil } from "./provider.js"

export const createKoiosProvider = (baseUrl: string, headers?: CardanoTypes.Headers): CardanoTypes.Provider => {
  const koiosClient = KoiosClient(baseUrl, headers)

  const getTip = async (): Promise<CardanoTypes.Tip> => {
    const response = await koiosClient.GET("/tip", {})
    const tip = response.data?.[0]
    if (tip) {
      return {
        hash: required(tip.hash, "tip.hash"),
        epochNo: required(tip.epoch_no, "tip.epoch_no"),
        absSlot: required(tip.abs_slot, "tip.abs_slot"),
        epochSlot: required(tip.epoch_slot, "tip.epoch_slot"),
        blockNo: required(tip.block_no, "tip.block_no"),
        blockTime: required(tip.block_time, "tip.block_time"),
      }
    }
    throw new Error("Error: KoiosProvider.getTip")
  }

  const getProtocolParameters = async (): Promise<CardanoTypes.ProtocolParameters> => {
    const response = await koiosClient.GET("/epoch_params", {
      params: {
        query: {
          _epoch_no: undefined,
          limit: "1",
        },
      },
    })
    if (response.data?.[0]) {
      return koiosProtocolParamsToProtocolParams(response.data[0])
    }
    throw new Error("Error: KoiosProvider.getProtocolParameters")
  }

  const getUtxosByAddresses = async (addresses: string[]): Promise<CardanoTypes.Utxo[]> => {
    try {
      const utxos: CardanoTypes.Utxo[] = []
      let hasMore = true
      while (hasMore) {
        const response = await koiosClient.POST("/address_utxos", {
          body: {
            _addresses: addresses,
            _extended: true,
          },
        })
        if (response.data && response.data.length > 0) {
          utxos.push(...koiosUtxosToUtxos(response.data))
          // Koios default limit
          if (response.data.length < 1000) {
            hasMore = false
          }
        } else {
          hasMore = false
        }
      }
      return utxos
    } catch {
      throw new Error("Error: KoiosProvider.getUtxosByAddresses")
    }
  }

  const getUtxoByOutputRef = async (txHash: string, index: number): Promise<CardanoTypes.Utxo> => {
    const response = await koiosClient.POST("/utxo_info", {
      body: {
        _utxo_refs: [`${txHash}#${index}`],
        _extended: true,
      },
    })
    if (response.data) {
      return koiosUtxoToUtxo(response.data[0])
    }
    throw new Error("Error: KoiosProvider.getUtxoByTxRef")
  }

  const getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    const response = await koiosClient.POST("/datum_info", {
      body: {
        _datum_hashes: [datumHash],
      },
    })
    if (response.data) {
      return response.data[0]?.bytes ?? undefined
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  const getScriptByHash = async (scriptHash: string): Promise<CardanoTypes.Script | undefined> => {
    const response = await koiosClient.POST("/script_info", {
      body: {
        _script_hashes: [scriptHash],
      },
    })
    if (response.data?.[0]) {
      const script = response.data[0]
      return {
        language: koiosPlutusVersionToPlutusVersion(required(script.type, "script.type")),
        script: required(script.bytes, "script.bytes"),
      }
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  const { getUtxosByAddress, resolveUtxoDatumAndScript } = createProviderResolvers({
    getUtxosByAddresses,
    getDatumByHash,
    getScriptByHash,
  })

  const getDelegation = async (stakingAddress: string): Promise<CardanoTypes.AccountDelegation> => {
    const response = await koiosClient.POST("/account_info", {
      body: {
        _stake_addresses: [stakingAddress],
      },
    })
    if (response.data) {
      const delegation = response.data[0]
      return {
        delegation: delegation?.delegated_pool ?? null,
        rewards: BigInt(delegation?.rewards_available || 0),
      }
    }
    throw new Error("Error: KoiosProvider.getDelegation")
  }

  const evaluateTx = async (
    tx: string,
    additionalUtxos?: CardanoTypes.Utxo[]
  ): Promise<CardanoTypes.RedeemerCost[]> => {
    const response = await koiosClient.POST("/ogmios", {
      parseAs: "text",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: {
          transaction: { cbor: tx },
          additionalUtxoSet: [], // TODO
        } as never,
      },
    })
    if (response.data) {
      if (response.data.result) {
        return response.data.result as CardanoTypes.RedeemerCost[]
      } else {
        throw new Error(JSON.stringify(response.data))
      }
    }
    if (response.error) {
      throw new Error(JSON.stringify(response.error))
    }
    throw new Error("Error: KoiosProvider.evaluateTx")
  }

  const observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await koiosClient.POST("/tx_status", {
        body: {
          _tx_hashes: [txHash],
        },
      })
      const status = response.data?.[0]
      return (status?.num_confirmations ?? 0) > 0
    }
    return pollUntil(checkTx, checkInterval, maxTime)
  }

  const submitTx = async (tx: string): Promise<string> => {
    const response = await koiosClient.POST("/submittx", {
      parseAs: "text",
      headers: {
        "Content-Type": "application/cbor",
      },
      body: tx,
    })
    if (response.data) {
      return response.data
    }
    if (response.error) {
      throw new Error(JSON.stringify(response.error))
    }
    throw new Error("Error: KoiosProvider.submitTx")
  }

  return Object.freeze({
    getTip,
    getProtocolParameters,
    getUtxosByAddresses,
    getUtxosByAddress,
    getUtxoByOutputRef,
    resolveUtxoDatumAndScript,
    getDatumByHash,
    getScriptByHash,
    getDelegation,
    evaluateTx,
    observeTx,
    submitTx,
  })
}

const koiosUtxoToUtxo = (utxo: KoiosTypes.components["schemas"]["utxo_infos"][number]): CardanoTypes.Utxo => {
  return {
    transaction: {
      id: required(utxo.tx_hash, "utxo.tx_hash"),
    },
    index: required(utxo.tx_index, "utxo.tx_index"),
    address: required(utxo.address, "utxo.address"),
    value: BigInt(required(utxo.value, "utxo.value")),
    assets: koiosAssetsToAssets(utxo.asset_list || []),
    datumHash: utxo.datum_hash || null,
    datumType: utxo.datum_hash ? (utxo.inline_datum ? "inline" : "hash") : null,
    scriptHash: utxo.reference_script?.hash || null,
    datum: null,
    script: null,
  }
}

const koiosUtxosToUtxos = (utxos: KoiosTypes.components["schemas"]["utxo_infos"]): CardanoTypes.Utxo[] => {
  return utxos.map((utxo) => koiosUtxoToUtxo(utxo))
}

const koiosAssetsToAssets = (
  assets: KoiosTypes.components["schemas"]["utxo_infos"][number]["asset_list"]
): CardanoTypes.Asset[] => {
  return (assets ?? []).map((asset): CardanoTypes.Asset => {
    return {
      policyId: required(asset.policy_id, "asset.policy_id"),
      assetName: asset.asset_name || "",
      quantity: BigInt(required(asset.quantity, "asset.quantity")),
      decimals: asset.decimals,
    }
  })
}

const koiosPlutusVersionToPlutusVersion = (plutusVersion: string) => {
  switch (plutusVersion) {
    case "plutusV1":
      return "PlutusV1"
    case "plutusV2":
      return "PlutusV2"
    case "plutusV3":
      return "PlutusV3"
    case "timelock":
      return "Native"
    case "multisig":
      return "Native"
    default:
      throw new Error("Invalid Plutus version")
  }
}

const koiosProtocolParamsToProtocolParams = (
  pp: KoiosTypes.components["schemas"]["epoch_params"][number]
): CardanoTypes.ProtocolParameters => {
  return {
    protocolMajorVersion: required(pp.protocol_major, "protocol_major"),
    minFeeA: required(pp.min_fee_a, "min_fee_a"),
    minFeeB: required(pp.min_fee_b, "min_fee_b"),
    maxTxSize: required(pp.max_tx_size, "max_tx_size"),
    maxValSize: required(pp.max_val_size, "max_val_size"),
    keyDeposit: BigInt(required(pp.key_deposit, "key_deposit")),
    poolDeposit: BigInt(required(pp.pool_deposit, "pool_deposit")),
    drepDeposit: BigInt(required(pp.drep_deposit, "drep_deposit")),
    govActionDeposit: BigInt(required(pp.gov_action_deposit, "gov_action_deposit")),
    priceMem: required(pp.price_mem, "price_mem"),
    priceStep: required(pp.price_step, "price_step"),
    maxTxExMem: BigInt(required(pp.max_tx_ex_mem, "max_tx_ex_mem")),
    maxTxExSteps: BigInt(required(pp.max_tx_ex_steps, "max_tx_ex_steps")),
    coinsPerUtxoByte: BigInt(required(pp.coins_per_utxo_size, "coins_per_utxo_size")),
    collateralPercentage: required(pp.collateral_percent, "collateral_percent"),
    maxCollateralInputs: required(pp.max_collateral_inputs, "max_collateral_inputs"),
    minFeeRefScriptCostPerByte: required(pp.min_fee_ref_script_cost_per_byte, "min_fee_ref_script_cost_per_byte"),
    costModels: pp.cost_models as unknown as CardanoTypes.CostModels,
  }
}

const required = <T>(value: T | null | undefined, field: string): T => {
  if (value === null || value === undefined) throw new Error(`Koios response is missing ${field}`)
  return value
}
