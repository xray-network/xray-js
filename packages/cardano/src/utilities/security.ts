import { emip3_decrypt_with_password, emip3_encrypt_with_password } from "@xray-network/xray-cardano-lib-crypto"
import { fromStringToHex, toHex, toStringFromHex } from "./encoding.js"

export const encryptWithPassword = (data: string, password: string): string => {
  return emip3_encrypt_with_password(
    fromStringToHex(password),
    toHex(randomBytes(32)),
    toHex(randomBytes(12)),
    fromStringToHex(data)
  )
}

export const decryptWithPassword = (data: string, password: string): string => {
  return toStringFromHex(emip3_decrypt_with_password(fromStringToHex(password), data))
}

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}
