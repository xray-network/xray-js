import * as CardanoLib from "@xray-network/xray-cardano-lib"
import type { CardanoContext } from "../internal/context.js"
import * as account from "../primitives/account.js"
import * as addresses from "../primitives/address.js"
import * as keys from "../primitives/keys.js"
import * as encoding from "../primitives/misc.js"
import type {
  AccountConfig,
  AccountDelegation,
  AccountDerivationPath,
  AccountExportV1,
  AccountState,
  AccountType,
  AddressDerivationPath,
} from "../types.js"
import type { Cip30Wallet } from "../wallets/cip30.js"

export interface CardanoAccount {
  readonly type: AccountType
  readonly paymentAddress: string
  readonly stakingAddress: string | undefined
  readonly publicKey: string | undefined
  readonly checksum: Readonly<{ id: string; image: string }> | undefined
  export(): AccountExportV1
  encryptPrivateKey(password: string): string
  decryptPrivateKey(password: string): string
  getSigningMaterial(password?: string): {
    rootPrivateKey: string
    accountPath: AccountDerivationPath
    addressPath: AddressDerivationPath
  }
  getPrivateKey(password?: string): string
  getWallet(): Cip30Wallet
  getState(): Promise<AccountState>
  getDelegation(): Promise<AccountDelegation>
}

const createCardanoAccount = (client: CardanoContext, state: AccountConfig): CardanoAccount => {
  if (!state.type) throw new Error("Account is not initialized")
  if (!state.paymentAddress) throw new Error("Account has no payment address")

  const type = state.type
  const paymentAddress = state.paymentAddress
  const stakingAddress = state.stakingAddress

  const exportAccount = (): AccountExportV1 => ({
    configVersion: 1,
    type,
    xpubKey: state.xpubKey,
    xprvKey: state.xprvKey,
    xprvKeyIsEncoded: state.xprvKeyIsEncoded,
    accountPath: state.accountPath,
    addressPath: state.addressPath,
    paymentAddress: state.paymentAddress,
    stakingAddress: state.stakingAddress,
  })

  const encryptPrivateKey = (password: string): string => {
    if (!state.xprvKey) throw new Error("Account has no private key")
    if (state.xprvKeyIsEncoded) throw new Error("Private key is already encrypted")
    return encoding.encryptDataWithPass(state.xprvKey, password)
  }

  const decryptPrivateKey = (password: string): string => {
    if (!state.xprvKey || !state.xprvKeyIsEncoded) throw new Error("Account has no encrypted private key")
    return encoding.decryptDataWithPass(state.xprvKey, password)
  }

  const getSigningMaterial = (password?: string) => {
    if (type !== "private-key" || !state.xprvKey || !state.accountPath || !state.addressPath) {
      throw new Error(`Account type ${type} has no private signing material`)
    }
    if (state.xprvKeyIsEncoded && !password) throw new Error("Password is required for the encrypted private key")
    return {
      rootPrivateKey: state.xprvKeyIsEncoded ? decryptPrivateKey(password!) : state.xprvKey,
      accountPath: state.accountPath,
      addressPath: state.addressPath,
    }
  }

  const getPrivateKey = (password?: string): string => {
    const material = getSigningMaterial(password)
    return keys.derivePrivateKey(material.rootPrivateKey, material.accountPath, material.addressPath)
  }

  const getWallet = (): Cip30Wallet => {
    if (type !== "wallet" || !state.wallet) throw new Error(`Account type ${type} has no wallet`)
    return state.wallet
  }

  const getState = async (): Promise<AccountState> => {
    const utxos = await client.provider.getUtxosByAddress(paymentAddress)
    return { utxos, balance: account.getBalanceFromUtxos(utxos) }
  }

  const getDelegation = async (): Promise<AccountDelegation> => {
    if (!stakingAddress) throw new Error("Account has no staking address")
    const delegation = await client.provider.getDelegation(stakingAddress)
    return { delegation: delegation?.delegation ?? null, rewards: delegation?.rewards ?? 0n }
  }

  return Object.freeze({
    type,
    paymentAddress,
    stakingAddress,
    publicKey: state.xpubKey,
    checksum:
      state.checksumId && state.checksumImage
        ? Object.freeze({ id: state.checksumId, image: state.checksumImage })
        : undefined,
    export: exportAccount,
    encryptPrivateKey,
    decryptPrivateKey,
    getSigningMaterial,
    getPrivateKey,
    getWallet,
    getState,
    getDelegation,
  })
}

const privateKeyState = (
  client: CardanoContext,
  privateKey: string,
  password: string | undefined,
  accountPath: AccountDerivationPath,
  addressPath: AddressDerivationPath
): AccountConfig => {
  const publicKey = keys.xprvKeyToXpubKey(privateKey, accountPath)
  const checksum = account.checksum(publicKey)
  const details = account.getDetailsFromXpub(publicKey, addressPath, client.network.id)
  return {
    configVersion: 1,
    type: "private-key",
    checksumImage: checksum.checksumImage,
    checksumId: checksum.checksumId,
    xpubKey: publicKey,
    xprvKey: password ? encoding.encryptDataWithPass(privateKey, password) : privateKey,
    xprvKeyIsEncoded: Boolean(password),
    accountPath,
    addressPath,
    paymentAddress: details.paymentAddress,
    paymentCred: details.paymentCred,
    stakingAddress: details.stakingAddress,
    stakingCred: details.stakingCred,
    wallet: undefined,
  }
}

const publicKeyState = (
  client: CardanoContext,
  publicKey: string,
  addressPath: AddressDerivationPath
): AccountConfig => {
  if (!keys.xpubKeyValidate(publicKey)) throw new Error("Invalid public key")
  const checksum = account.checksum(publicKey)
  const details = account.getDetailsFromXpub(publicKey, addressPath, client.network.id)
  return {
    configVersion: 1,
    type: "public-key",
    checksumImage: checksum.checksumImage,
    checksumId: checksum.checksumId,
    xpubKey: publicKey,
    xprvKey: undefined,
    xprvKeyIsEncoded: false,
    accountPath: undefined,
    addressPath,
    paymentAddress: details.paymentAddress,
    paymentCred: details.paymentCred,
    stakingAddress: details.stakingAddress,
    stakingCred: details.stakingCred,
    wallet: undefined,
  }
}

export const accountFromMnemonic = (
  client: CardanoContext,
  mnemonic: string,
  password: string | undefined,
  accountPath: AccountDerivationPath,
  addressPath: AddressDerivationPath
): CardanoAccount => accountFromPrivateKey(client, keys.mnemonicToXprvKey(mnemonic), password, accountPath, addressPath)

export const accountFromPrivateKey = (
  client: CardanoContext,
  privateKey: string,
  password: string | undefined,
  accountPath: AccountDerivationPath,
  addressPath: AddressDerivationPath
): CardanoAccount =>
  createCardanoAccount(client, privateKeyState(client, privateKey, password, accountPath, addressPath))

export const accountFromPublicKey = (
  client: CardanoContext,
  publicKey: string,
  addressPath: AddressDerivationPath
): CardanoAccount => createCardanoAccount(client, publicKeyState(client, publicKey, addressPath))

export const accountFromWallet = async (client: CardanoContext, wallet: Cip30Wallet): Promise<CardanoAccount> => {
  const walletNetwork = await wallet.getNetworkId()
  if (walletNetwork !== client.network.id) throw new Error("Wallet network mismatch")
  const mainAddress = (await wallet.getUsedAddresses())[0] ?? (await wallet.getUnusedAddresses())[0]
  const rewardAddress = (await wallet.getRewardAddresses())[0]
  if (!mainAddress) throw new Error("Wallet did not provide a payment address")
  const paymentAddress = CardanoLib.Address.from_hex(mainAddress).to_bech32()
  const credentials = addresses.getCredentials(paymentAddress)
  const stakingAddress = rewardAddress ? CardanoLib.Address.from_hex(rewardAddress).to_bech32() : undefined
  return createCardanoAccount(client, {
    configVersion: 1,
    type: "wallet",
    checksumImage: undefined,
    checksumId: undefined,
    xpubKey: undefined,
    xprvKey: undefined,
    xprvKeyIsEncoded: false,
    accountPath: undefined,
    addressPath: undefined,
    paymentAddress,
    paymentCred: credentials.paymentCred?.hash,
    stakingAddress,
    stakingCred: credentials.stakingCred?.hash,
    wallet,
  })
}

export const accountFromAddress = (client: CardanoContext, address: string): CardanoAccount => {
  const credentials = addresses.getCredentials(address)
  return createCardanoAccount(client, {
    configVersion: 1,
    type: "address",
    checksumImage: undefined,
    checksumId: undefined,
    xpubKey: undefined,
    xprvKey: undefined,
    xprvKeyIsEncoded: false,
    accountPath: undefined,
    addressPath: undefined,
    paymentAddress: address,
    paymentCred: credentials.paymentCred?.hash,
    stakingAddress: addresses.getStakingAddress(address),
    stakingCred: credentials.stakingCred?.hash,
    wallet: undefined,
  })
}

export const importCardanoAccount = (client: CardanoContext, config: AccountExportV1): CardanoAccount => {
  if (config.configVersion !== 1) {
    throw new Error(`Unsupported account configuration version: ${config.configVersion}`)
  }
  if (config.type === "private-key") {
    if (!config.xpubKey || !config.xprvKey || !config.accountPath || !config.addressPath) {
      throw new Error("Private-key account export is incomplete")
    }
    return createCardanoAccount(client, {
      ...publicKeyState(client, config.xpubKey, config.addressPath),
      type: "private-key",
      xprvKey: config.xprvKey,
      xprvKeyIsEncoded: config.xprvKeyIsEncoded ?? false,
      accountPath: config.accountPath,
    })
  }
  if (config.type === "public-key") {
    if (!config.xpubKey || !config.addressPath) throw new Error("Public-key account export is incomplete")
    return accountFromPublicKey(client, config.xpubKey, config.addressPath)
  }
  if (config.type === "address") {
    if (!config.paymentAddress) throw new Error("Address account export is incomplete")
    return accountFromAddress(client, config.paymentAddress)
  }
  throw new Error("Wallet accounts cannot be restored from serialized account data")
}
