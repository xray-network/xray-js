import { TTL } from "../config.js"

import KupoClient, { KupoTypes } from "cardano-kupo-client"
import OgmiosClient, { OgmiosTypes } from "cardano-ogmios-client"
import type * as CardanoTypes from "../types.js"
import * as KupmiosProviderTypes from "./kupmios-types.js"
import { createProviderResolvers, pollUntil } from "./provider.js"

export { default as KupoClient } from "cardano-kupo-client"
export type { KupoTypes } from "cardano-kupo-client"
export { default as OgmiosClient } from "cardano-ogmios-client"
export type { OgmiosTypes } from "cardano-ogmios-client"

export const createKupmiosProvider = ({
  ogmiosUrl,
  ogmiosHeaders,
  kupoUrl,
  kupoHeaders,
}: {
  ogmiosUrl: string
  ogmiosHeaders?: CardanoTypes.Headers
  kupoUrl: string
  kupoHeaders?: CardanoTypes.Headers
}): CardanoTypes.Provider => {
  const ogmiosClient = OgmiosClient(ogmiosUrl, ogmiosHeaders)
  const kupoClient = KupoClient(kupoUrl, kupoHeaders)

  const getTip = async (): Promise<CardanoTypes.Tip> => {
    const response = await ogmiosClient.GET("/health")
    if (response.data) {
      const tip = response.data as KupmiosProviderTypes.Health
      return {
        hash: tip.lastKnownTip.id,
        epochNo: tip.currentEpoch,
        absSlot: tip.lastKnownTip.slot,
        epochSlot: tip.slotInEpoch,
        blockNo: tip.lastKnownTip.height,
        blockTime: Math.floor(new Date(tip.lastTipUpdate).getTime() / 1000),
      }
    }
    throw new Error("Error: KupmiosProvider.getTip")
  }

  const getProtocolParameters = async (): Promise<CardanoTypes.ProtocolParameters> => {
    const response = await ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "queryLedgerState/protocolParameters",
      } as never,
    })
    if (response.data) {
      const data = response.data.result as unknown as OgmiosProtocolParameters
      return ogmiosProtocolParametersToProtocolParameters(data)
    }
    throw new Error("Error: KupmiosProvider.getProtocolParameters")
  }

  const getUtxosByAddresses = async (addresses: string[]): Promise<CardanoTypes.Utxo[]> => {
    try {
      const utxos: CardanoTypes.Utxo[] = []
      for (const address of addresses) {
        // Generated Kupo types omit the bare `?unspent` query supported by the service.
        const getUnspent = kupoClient.GET as unknown as (
          path: string,
          options: { params: { path: { pattern: string } } }
        ) => Promise<{ data?: KupoTypes.components["schemas"]["Match"][] }>
        const response = await getUnspent("/matches/{pattern}?unspent", {
          params: {
            path: {
              pattern: address,
            },
          },
        })
        if (response.data) {
          utxos.push(...kupoUtxosToUtxos(response.data))
        }
      }
      return utxos
    } catch {
      throw new Error("Error: KupmiosProvider.getUtxosByAddresses")
    }
  }

  const getUtxoByOutputRef = async (txHash: string, index: number): Promise<CardanoTypes.Utxo> => {
    const response = await kupoClient.GET("/matches/{pattern}", {
      params: {
        path: {
          pattern: `${index}@${txHash}`,
        },
      },
    })
    if (response.data) {
      return kupoUtxoToUtxo(response.data[0])
    }
    throw new Error("Error: KupmiosProvider.getUtxoByTxRef")
  }

  const getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    const response = await kupoClient.GET("/datums/{datum_hash}", {
      params: {
        path: {
          datum_hash: datumHash,
        },
      },
    })
    if (response.data) {
      return response.data.datum
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  const getScriptByHash = async (scriptHash: string): Promise<CardanoTypes.Script | undefined> => {
    const response = await kupoClient.GET("/scripts/{script_hash}", {
      params: {
        path: {
          script_hash: scriptHash,
        },
      },
    })
    if (response.data) {
      return {
        language: kupoPlutusVersionToPlutusVersion(response.data.language),
        script: response.data.script,
      }
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  const { getUtxosByAddress, resolveUtxoDatumAndScript } = createProviderResolvers({
    getUtxosByAddresses,
    getDatumByHash,
    getScriptByHash,
  })

  const getDelegation = async (stakingAddress: string): Promise<CardanoTypes.AccountDelegation> => {
    const response = await ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "queryLedgerState/rewardAccountSummaries",
        params: {
          keys: [stakingAddress],
        },
      } as never,
    })
    if (response.data) {
      const data = response.data as KupmiosProviderTypes.Delegation
      const delegation = Object.values(data.result ?? {})[0]
      return {
        delegation: delegation?.delegate?.id ?? null,
        rewards: BigInt(delegation?.rewards?.ada?.lovelace || 0),
      }
    }
    throw new Error("Error: KupmiosProvider.getDelegation")
  }

  const evaluateTx = async (
    tx: string,
    additionalUtxos?: CardanoTypes.Utxo[]
  ): Promise<CardanoTypes.RedeemerCost[]> => {
    const response = await ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: {
          transaction: { cbor: tx },
          additionalUtxoSet: [], // TODO
        },
      } as never,
    })
    if (response.data) {
      const data = (response.data.result as CardanoTypes.RedeemerCost[]) || []
      return data
    }
    throw new Error("Error: KupmiosProvider.evaluateTx")
  }

  const submitTx = async (tx: string): Promise<string> => {
    const response = await ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "submitTransaction",
        params: {
          transaction: {
            cbor: tx,
          },
        },
      } as never,
    })
    if (response.data) {
      const data = response.data as unknown as { result?: { transaction?: { id?: string } } }
      const transactionId = data.result?.transaction?.id
      if (transactionId) return transactionId
    }
    throw new Error("Error: KupmiosProvider.submitTx")
  }

  const observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await kupoClient.GET("/matches/{pattern}", {
        params: {
          path: {
            pattern: `*@${txHash}`,
          },
        },
      })
      if (response.data) {
        return response.data.length > 0
      }
      return false
    }
    return pollUntil(checkTx, checkInterval, maxTime)
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
    submitTx,
    observeTx,
  })
}

const kupoUtxoToUtxo = (utxo: KupoTypes.components["schemas"]["Match"]): CardanoTypes.Utxo => {
  return {
    transaction: {
      id: utxo.transaction_id,
    },
    index: utxo.output_index,
    address: utxo.address,
    value: BigInt(utxo.value.coins),
    assets: kupoAssetsToAssets(utxo.value.assets || {}),
    datumHash: utxo.datum_hash || null,
    datumType: utxo.datum_hash ? (utxo.datum_type === "hash" ? "hash" : "inline") : null,
    scriptHash: utxo.script_hash || null,
    datum: null,
    script: null,
  }
}

const kupoUtxosToUtxos = (utxos: KupoTypes.components["schemas"]["Match"][]): CardanoTypes.Utxo[] => {
  return utxos.map((utxo) => kupoUtxoToUtxo(utxo))
}

const kupoAssetsToAssets = (
  assets: KupoTypes.components["schemas"]["Match"]["value"]["assets"]
): CardanoTypes.Asset[] => {
  return Object.entries(assets ?? {}).map(([id, quantity]): CardanoTypes.Asset => {
    const [policy_id, asset_name] = id.split(".")
    return {
      policyId: policy_id ?? "",
      assetName: asset_name || "",
      quantity: BigInt(quantity),
    }
  })
}

const kupoPlutusVersionToPlutusVersion = (plutusVersion: string) => {
  switch (plutusVersion) {
    case "plutus:v1":
      return "PlutusV1"
    case "plutus:v2":
      return "PlutusV2"
    case "plutus:v3":
      return "PlutusV3"
    case "native":
      return "Native"
    default:
      throw new Error("Invalid Plutus version")
  }
}

type OgmiosProtocolParameters = {
  version?: { major?: number }
  minFeeCoefficient: string | number
  minFeeConstant: { ada: { lovelace: string | number } }
  maxTransactionSize: { bytes: string | number }
  maxValueSize: { bytes: string | number }
  stakeCredentialDeposit: { ada: { lovelace: string | number } }
  stakePoolDeposit: { ada: { lovelace: string | number } }
  delegateRepresentativeDeposit: { ada: { lovelace: string | number } }
  governanceActionDeposit: { ada: { lovelace: string | number } }
  scriptExecutionPrices: { memory: string; cpu: string }
  maxExecutionUnitsPerTransaction: { memory: string | number; cpu: string | number }
  minUtxoDepositCoefficient: string | number
  collateralPercentage: string | number
  maxCollateralInputs: string | number
  minFeeReferenceScripts: { base: string | number }
  plutusCostModels: Record<"plutus:v1" | "plutus:v2" | "plutus:v3", number[]>
}

const ogmiosProtocolParametersToProtocolParameters = (
  pp: OgmiosProtocolParameters
): CardanoTypes.ProtocolParameters => {
  const scriptExecutionPricesMemory = pp.scriptExecutionPrices.memory.split("/")
  const scriptExecutionPricesCpu = pp.scriptExecutionPrices.cpu.split("/")
  return {
    protocolMajorVersion: Number(pp.version?.major ?? 9),
    minFeeA: Number(pp.minFeeCoefficient),
    minFeeB: Number(pp.minFeeConstant.ada.lovelace),
    maxTxSize: Number(pp.maxTransactionSize.bytes),
    maxValSize: Number(pp.maxValueSize.bytes),
    keyDeposit: BigInt(pp.stakeCredentialDeposit.ada.lovelace),
    poolDeposit: BigInt(pp.stakePoolDeposit.ada.lovelace),
    drepDeposit: BigInt(pp.delegateRepresentativeDeposit.ada.lovelace),
    govActionDeposit: BigInt(pp.governanceActionDeposit.ada.lovelace),
    priceMem: parseInt(scriptExecutionPricesMemory[0]) / parseInt(scriptExecutionPricesMemory[1]),
    priceStep: parseInt(scriptExecutionPricesCpu[0]) / parseInt(scriptExecutionPricesCpu[1]),
    maxTxExMem: BigInt(pp.maxExecutionUnitsPerTransaction.memory),
    maxTxExSteps: BigInt(pp.maxExecutionUnitsPerTransaction.cpu),
    coinsPerUtxoByte: BigInt(pp.minUtxoDepositCoefficient),
    collateralPercentage: Number(pp.collateralPercentage),
    maxCollateralInputs: Number(pp.maxCollateralInputs),
    minFeeRefScriptCostPerByte: Number(pp.minFeeReferenceScripts.base),
    costModels: {
      PlutusV1: pp.plutusCostModels["plutus:v1"],
      PlutusV2: pp.plutusCostModels["plutus:v2"],
      PlutusV3: pp.plutusCostModels["plutus:v3"],
    },
  }
}
