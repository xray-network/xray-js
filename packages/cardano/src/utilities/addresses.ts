import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"
import { Bip32PublicKey, Cip1852Role, deriveCip1852Public } from "@xray-network/xray-cardano-lib-crypto"
import type * as CardanoTypes from "../types.js"

const deriveAddressPublic = (
  accountPublic: Bip32PublicKey,
  [role, index]: CardanoTypes.AddressDerivationPath
): Bip32PublicKey => {
  if (role >= Cip1852Role.External && role <= Cip1852Role.ConstitutionalCommitteeHot) {
    return deriveCip1852Public(accountPublic, role, index)
  }
  return accountPublic.derive(role).derive(index)
}

export const validateAddress = (addrBech32: string): boolean => {
  try {
    CardanoLib.Address.from_bech32(addrBech32)
    return true
  } catch {
    return false
  }
}

export const getNetwork = (addrBech32: string): CardanoTypes.NetworkId | undefined => {
  try {
    return CardanoLib.Address.from_bech32(addrBech32).network_id() as CardanoTypes.NetworkId
  } catch {
    return undefined
  }
}

export const deriveBase = (
  xpubKey: string,
  addressDerivationPath: CardanoTypes.AddressDerivationPath,
  networkId: CardanoTypes.NetworkId
): string => {
  const accountPublic = Bip32PublicKey.from_bech32(xpubKey)
  const paymentKeyHash = deriveAddressPublic(accountPublic, addressDerivationPath).to_raw_key().hash()
  const stakeKeyHash = deriveCip1852Public(accountPublic, Cip1852Role.Stake, 0).to_raw_key().hash()
  return CardanoLib.BaseAddress.new(
    networkId,
    CardanoLib.Credential.new_pub_key(paymentKeyHash),
    CardanoLib.Credential.new_pub_key(stakeKeyHash)
  )
    .to_address()
    .to_bech32()
}

export const deriveEnterprise = (
  xpubKey: string,
  addressDerivationPath: CardanoTypes.AddressDerivationPath,
  networkId: CardanoTypes.NetworkId
): string => {
  const paymentKeyHash = deriveAddressPublic(Bip32PublicKey.from_bech32(xpubKey), addressDerivationPath)
    .to_raw_key()
    .hash()
  return CardanoLib.EnterpriseAddress.new(networkId, CardanoLib.Credential.new_pub_key(paymentKeyHash))
    .to_address()
    .to_bech32()
}

export const deriveStaking = (xpubKey: string, networkId: CardanoTypes.NetworkId): string => {
  const stakeKeyHash = deriveCip1852Public(Bip32PublicKey.from_bech32(xpubKey), Cip1852Role.Stake, 0)
    .to_raw_key()
    .hash()
  return CardanoLib.RewardAddress.new(networkId, CardanoLib.Credential.new_pub_key(stakeKeyHash))
    .to_address()
    .to_bech32()
}

export const getStakingAddress = (addrBech32: string): string => {
  const address = CardanoLib.Address.from_bech32(addrBech32)
  const stakingCred = address.staking_cred()
  if (!stakingCred) throw new Error("Address has no staking credential")
  return CardanoLib.RewardAddress.new(address.network_id(), stakingCred).to_address().to_bech32()
}

const credentialToPublic = (credential: CardanoLib.Credential | undefined): CardanoTypes.Credential | undefined => {
  if (!credential) return undefined
  if (credential.kind() === 0) {
    const key = credential.as_pub_key()
    return key ? { type: "key", hash: key.to_hex() } : undefined
  }
  const script = credential.as_script()
  return script ? { type: "script", hash: script.to_hex() } : undefined
}

export const getCredentials = (addrBech32: string): CardanoTypes.AddressPublicCredentials => {
  const address = CardanoLib.Address.from_bech32(addrBech32)
  const kind = address.kind() as 0 | 1 | 2 | 3 | 4
  const type = {
    0: "base",
    1: "pointer",
    2: "enterprise",
    3: "reward",
    4: "byron",
  }[kind] as CardanoTypes.AddressType
  if (type === "base") {
    return {
      type,
      paymentCred: credentialToPublic(address.payment_cred()),
      stakingCred: credentialToPublic(address.staking_cred()),
    }
  }
  if (type === "pointer" || type === "enterprise") {
    return { type, paymentCred: credentialToPublic(address.payment_cred()) }
  }
  if (type === "reward") return { type, stakingCred: credentialToPublic(address.payment_cred()) }
  return { type: "byron" }
}

export const getShelleyOrByronAddress = (addrBech32: string): CardanoLib.Address => {
  try {
    return CardanoLib.Address.from_bech32(addrBech32)
  } catch {
    return CardanoLib.ByronAddress.from_base58(addrBech32).to_address()
  }
}
