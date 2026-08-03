import { CardanoLib, CW3Types } from "../index.js"

const deriveAddressPublic = (
  accountPublic: CardanoLib.Bip32PublicKey,
  [role, index]: CW3Types.AddressDerivationPath
): CardanoLib.Bip32PublicKey => {
  if (role >= CardanoLib.Cip1852Role.External && role <= CardanoLib.Cip1852Role.ConstitutionalCommitteeHot) {
    return CardanoLib.deriveCip1852Public(accountPublic, role, index)
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

export const getNetwork = (addrBech32: string): CW3Types.NetworkId | undefined => {
  try {
    return CardanoLib.Address.from_bech32(addrBech32).network_id() as CW3Types.NetworkId
  } catch {
    return undefined
  }
}

export const deriveBase = (
  xpubKey: string,
  addressDerivationPath: CW3Types.AddressDerivationPath,
  netoworkId: CW3Types.NetworkId
): string => {
  const accountPublic = CardanoLib.Bip32PublicKey.from_bech32(xpubKey)
  const paymentKeyHash = deriveAddressPublic(accountPublic, addressDerivationPath).to_raw_key().hash()
  const stakeKeyHash = CardanoLib.deriveCip1852Public(accountPublic, CardanoLib.Cip1852Role.Stake, 0)
    .to_raw_key()
    .hash()
  return CardanoLib.BaseAddress.new(
    netoworkId,
    CardanoLib.Credential.new_pub_key(paymentKeyHash),
    CardanoLib.Credential.new_pub_key(stakeKeyHash)
  )
    .to_address()
    .to_bech32()
}

export const deriveEnterprise = (
  xpubKey: string,
  addressDerivationPath: CW3Types.AddressDerivationPath,
  netoworkId: CW3Types.NetworkId
): string => {
  const paymentKeyHash = deriveAddressPublic(CardanoLib.Bip32PublicKey.from_bech32(xpubKey), addressDerivationPath)
    .to_raw_key()
    .hash()
  return CardanoLib.EnterpriseAddress.new(netoworkId, CardanoLib.Credential.new_pub_key(paymentKeyHash))
    .to_address()
    .to_bech32()
}

export const deriveStaking = (xpubKey: string, netoworkId: CW3Types.NetworkId): string => {
  const stakeKeyHash = CardanoLib.deriveCip1852Public(
    CardanoLib.Bip32PublicKey.from_bech32(xpubKey),
    CardanoLib.Cip1852Role.Stake,
    0
  )
    .to_raw_key()
    .hash()
  return CardanoLib.RewardAddress.new(netoworkId, CardanoLib.Credential.new_pub_key(stakeKeyHash))
    .to_address()
    .to_bech32()
}

export const getStakingAddress = (addrBech32: string): string => {
  const address = CardanoLib.Address.from_bech32(addrBech32)
  const stakingCred = address.staking_cred()
  return CardanoLib.RewardAddress.new(address.network_id(), stakingCred).to_address().to_bech32()
}

export const getCredentials = (addrBech32: string): CW3Types.AddressPublicCredentials => {
  const address = CardanoLib.Address.from_bech32(addrBech32)
  const kind = address.kind() as 0 | 1 | 2 | 3 | 4
  const type = {
    0: "base",
    1: "pointer",
    2: "enterprise",
    3: "reward",
    4: "byron",
  }[kind] as CW3Types.AddressType
  if (type === "base") {
    return {
      type,
      paymentCred:
        address.payment_cred()?.kind() === 0
          ? {
              type: "key",
              hash: address.payment_cred()?.as_pub_key()?.to_hex(),
            }
          : {
              type: "script",
              hash: address.payment_cred()?.as_script().to_hex(),
            },
      stakingCred:
        address.staking_cred()?.kind() === 0
          ? {
              type: "key",
              hash: address.staking_cred()?.as_pub_key()?.to_hex(),
            }
          : {
              type: "script",
              hash: address.staking_cred()?.as_script().to_hex(),
            },
    }
  }
  if (type === "pointer") {
    return {
      type,
      paymentCred:
        address.payment_cred()?.kind() === 0
          ? {
              type: "key",
              hash: address.payment_cred()?.as_pub_key()?.to_hex(),
            }
          : {
              type: "script",
              hash: address.payment_cred()?.as_script().to_hex(),
            },
    }
  }
  if (type === "enterprise") {
    return {
      type,
      paymentCred:
        address.payment_cred()?.kind() === 0
          ? {
              type: "key",
              hash: address.payment_cred()?.as_pub_key()?.to_hex(),
            }
          : {
              type: "script",
              hash: address.payment_cred()?.as_script().to_hex(),
            },
    }
  }
  if (type === "reward") {
    return {
      type,
      stakingCred:
        address.payment_cred()?.kind() === 0
          ? {
              type: "key",
              hash: address.payment_cred()?.as_pub_key()?.to_hex(),
            }
          : {
              type: "script",
              hash: address.payment_cred()?.as_script().to_hex(),
            },
    }
  }
  if (type === "byron") {
    return {
      type,
    }
  }
}

export const getShelleyOrByronAddress = (addrBech32: string): CardanoLib.Address => {
  try {
    return CardanoLib.Address.from_bech32(addrBech32)
  } catch {
    return CardanoLib.ByronAddress.from_base58(addrBech32).to_address()
  }
}
