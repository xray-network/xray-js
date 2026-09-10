import { hexToBytes } from "@xray-network/xray-cardano-lib-core"
import { AssetName } from "@xray-network/xray-cardano-lib-chain"
import { ScriptHash } from "@xray-network/xray-cardano-lib-crypto"
import { AssetFingerprint } from "@xray-network/xray-cardano-lib-cip/cip14"

const textDecoder = new TextDecoder()

export const getFingerprint = (policyId: string, assetName?: string): string => {
  return AssetFingerprint.from_parts(ScriptHash.from_hex(policyId), AssetName.from_hex(assetName || "")).to_bech32()
}

export const assetNameToAssetNameAscii = (assetName: string): string => {
  return textDecoder.decode(hexToBytes(assetName))
}
