import { hexToBytes } from "@xray-network/xray-cardano-lib-core"
import { CardanoLib } from "../index.js"

const textDecoder = new TextDecoder()

export const getFingerprint = (policyId: string, assetName?: string): string => {
  return CardanoLib.AssetFingerprint.from_parts(
    CardanoLib.ScriptHash.from_hex(policyId),
    CardanoLib.AssetName.from_hex(assetName || "")
  ).to_bech32()
}

export const assetNameToAssetNameAscii = (assetName: string): string => {
  return textDecoder.decode(hexToBytes(assetName))
}
