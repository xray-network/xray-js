import { blake2b } from "@noble/hashes/blake2.js"
import { bech32 } from "@scure/base"
import { hexToBytes } from "@xray-network/xray-cardano-lib-core"

const textDecoder = new TextDecoder()

export const getFingerprint = (policyId: string, assetName?: string): string => {
  const readablePart = "asset"
  const hashBuffer = blake2b(
    new Uint8Array([...hexToBytes(policyId), ...hexToBytes(assetName || "")]),
    { dkLen: 20 }
  )
  const words = bech32.toWords(hashBuffer)
  const fingerprint = bech32.encode(readablePart, words)
  return fingerprint
}

export const assetNameToAssetNameAscii = (assetName: string): string => {
  return textDecoder.decode(hexToBytes(assetName))
}
