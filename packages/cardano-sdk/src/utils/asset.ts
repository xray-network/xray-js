import { blake2b } from "@noble/hashes/blake2.js"
import { bech32 } from "@scure/base"
import { Buffer } from "buffer"

export const getFingerprint = (policyId: string, assetName?: string): string => {
  const readablePart = "asset"
  const hashBuffer = blake2b(
    new Uint8Array([...Buffer.from(policyId, "hex"), ...Buffer.from(assetName || "", "hex")]),
    { dkLen: 20 }
  )
  const words = bech32.toWords(hashBuffer)
  const fingerprint = bech32.encode(readablePart, words)
  return fingerprint
}

export const assetNameToAssetNameAscii = (assetName: string): string => {
  return Buffer.from(assetName, "hex").toString("utf-8")
}
