import { generateMnemonic, mnemonicToEntropy, validateMnemonic } from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english.js"
import { CardanoLib, CW3Types } from "../index.js"
import { harden } from "./misc.js"

const derivePrivateKey = (
  xprvKey: string,
  accountPath?: CW3Types.AccountDerivationPath,
  addressPath?: CW3Types.AddressDerivationPath
): CardanoLib.Bip32PrivateKey => {
  const root = CardanoLib.Bip32PrivateKey.from_bech32(xprvKey)
  if (
    accountPath?.[0] === 1852 &&
    accountPath[1] === 1815 &&
    addressPath &&
    addressPath[0] >= CardanoLib.Cip1852Role.External &&
    addressPath[0] <= CardanoLib.Cip1852Role.ConstitutionalCommitteeHot
  ) {
    return CardanoLib.deriveCip1852Private(
      root,
      CardanoLib.Cip1852Path.new(accountPath[2], addressPath[0], addressPath[1])
    )
  }
  if (accountPath?.[0] === 1852 && accountPath[1] === 1815 && !addressPath) {
    return CardanoLib.deriveCip1852AccountPrivate(root, accountPath[2])
  }

  let key = root
  if (accountPath) {
    for (const index of accountPath) key = key.derive(harden(index))
  }
  if (addressPath) {
    for (const index of addressPath) key = key.derive(index)
  }
  return key
}

export const mnemonicGenerate = (length: 12 | 15 | 24 = 24): string => {
  return generateMnemonic(wordlist, (32 * length) / 3)
}

export const mnemonicValidate = (mnemonic: string): boolean => {
  return validateMnemonic(mnemonic, wordlist)
}

export const mnemonicToXprvKey = (mnemonic: string, password?: string): string => {
  return CardanoLib.cip1852RootFromIcarusEntropy(
    mnemonicToEntropy(mnemonic, wordlist),
    password ? new TextEncoder().encode(password) : new Uint8Array()
  ).to_bech32()
}

export const xprvKeyGenerate = (): string => {
  return CardanoLib.Bip32PrivateKey.generate_ed25519_bip32().to_bech32()
}

export const xprvKeyValidate = (xprvKey: string): boolean => {
  try {
    CardanoLib.Bip32PrivateKey.from_bech32(xprvKey).to_bech32()
    return true
  } catch {
    return false
  }
}

export const xprvKeyToXpubKey = (
  xprvKey: string,
  accountPath?: CW3Types.AccountDerivationPath,
  addressPath?: CW3Types.AddressDerivationPath
): string => {
  return derivePrivateKey(xprvKey, accountPath, addressPath).to_public().to_bech32()
}

export const xprvToVrfKey = (
  xprvKey: string,
  accountPath?: CW3Types.AccountDerivationPath,
  addressPath?: CW3Types.AddressDerivationPath
): string => {
  return derivePrivateKey(xprvKey, accountPath, addressPath).to_raw_key().to_bech32()
}

export const xvkKeyToXpubKey = (xvkKey: string): string => {
  for (const role of [
    CardanoLib.CardanoKeyRole.Root,
    CardanoLib.CardanoKeyRole.Account,
    CardanoLib.CardanoKeyRole.Payment,
    CardanoLib.CardanoKeyRole.Stake,
    CardanoLib.CardanoKeyRole.DRep,
    CardanoLib.CardanoKeyRole.ConstitutionalCommitteeCold,
    CardanoLib.CardanoKeyRole.ConstitutionalCommitteeHot,
  ]) {
    try {
      return CardanoLib.decodeCardanoBip32PublicKey(role, xvkKey).to_bech32()
    } catch {
      // Try the next supported role prefix.
    }
  }
  throw new TypeError("Unsupported Cardano extended verification key")
}

export const xpubKeyValidate = (pubKey: string): boolean => {
  try {
    CardanoLib.Bip32PublicKey.from_bech32(pubKey)
    return true
  } catch {
    return false
  }
}
