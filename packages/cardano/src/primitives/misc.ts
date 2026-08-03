import { CardanoLib } from "../internal/dependencies.js"
import { bytesToHex, hexToBytes } from "@xray-network/xray-cardano-lib-core"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const harden = (num: number): number => {
  return 0x80000000 + num
}

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

export const encryptDataWithPass = (data: string, password: string): string => {
  return CardanoLib.emip3_encrypt_with_password(
    fromStringToHex(password),
    toHex(randomBytes(32)),
    toHex(randomBytes(12)),
    fromStringToHex(data)
  )
}

export const decryptDataWithPass = (data: string, password: string): string => {
  return toStringFromHex(CardanoLib.emip3_decrypt_with_password(fromStringToHex(password), data))
}

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}
