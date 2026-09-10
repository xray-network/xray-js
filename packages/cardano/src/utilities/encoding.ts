import { bytesToHex, hexToBytes } from "@xray-network/xray-cardano-lib-core"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const fromHex = (hex: string): Uint8Array => {
  return hexToBytes(hex)
}

export const toHex = (bytes: Uint8Array): string => {
  return bytesToHex(bytes)
}

export const toStringFromHex = (hex: string): string => {
  return textDecoder.decode(hexToBytes(hex))
}

export const fromStringToHex = (text: string): string => {
  return bytesToHex(textEncoder.encode(text))
}
