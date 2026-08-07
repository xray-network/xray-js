import cip4 from "../internal/cip4/checksum.js"
import type * as CardanoTypes from "../types.js"
import { getFingerprint, assetNameToAssetNameAscii } from "./asset.js"
import { deriveBase, getCredentials, getStakingAddress } from "./address.js"

export const checksum = (
  xpubKey: string
): {
  checksumId: string
  checksumImage: string
} => {
  return cip4(xpubKey)
}

export const getDetailsFromXpub = (
  xpubKey: string,
  addressDerivationPath: CardanoTypes.AddressDerivationPath,
  networkId: CardanoTypes.NetworkId
): {
  paymentAddress: string
  paymentCred: string
  stakingAddress: string
  stakingCred: string
} => {
  const paymentAddress = deriveBase(xpubKey, addressDerivationPath, networkId)
  const { paymentCred, stakingCred } = getCredentials(paymentAddress)
  if (!paymentCred || !stakingCred) throw new Error("Derived base address is missing credentials")
  const stakingAddress = getStakingAddress(paymentAddress)

  return {
    paymentAddress,
    paymentCred: paymentCred.hash,
    stakingAddress,
    stakingCred: stakingCred.hash,
  }
}

export const getBalanceFromUtxos = (utxos: CardanoTypes.Utxo[]): CardanoTypes.Balance => {
  const balance: CardanoTypes.Balance = {
    value: BigInt(0),
    assets: [],
  }

  utxos.forEach((utxo) => {
    balance.value += utxo.value
    utxo.assets.forEach((asset) => {
      const existingAsset = balance.assets.find((a) => a.policyId + a.assetName === asset.policyId + asset.assetName)
      if (existingAsset) {
        existingAsset.quantity += asset.quantity
      } else {
        balance.assets.push({
          ...asset,
          fingerprint: getFingerprint(asset.policyId, asset.assetName),
          assetNameAscii: assetNameToAssetNameAscii(asset.assetName),
        })
      }
    })
  })

  return balance
}
