import { DEFAULT_ACCOUNT_DERIVATION_PATH, DEFAULT_ADDRESS_DERIVATION_PATH, SLOT_CONFIG_NETWORK, TTL } from "./config.js"
import * as CardanoLib from "@xray-network/xray-cardano-lib"
import { CIP8Message as Message } from "@xray-network/xray-cardano-lib"
import KoiosClient from "cardano-koios-client"
import KupoClient from "cardano-kupo-client"
import NftcdnClient from "cardano-nftcdn-client"
import OgmiosClient from "cardano-ogmios-client"
import {
  accountFromAddress,
  accountFromMnemonic,
  accountFromPrivateKey,
  accountFromPublicKey,
  accountFromWallet,
  importCardanoAccount,
  type CardanoAccount,
} from "./accounts/account.js"
import type { CardanoContext } from "./internal/context.js"
import { createProtocolParametersCache } from "./internal/protocol-parameters.js"
import { createKoiosProvider } from "./providers/koios.js"
import * as addresses from "./primitives/address.js"
import * as encoding from "./primitives/misc.js"
import { createTransactionPlan, type TransactionPlan } from "./transactions/plan.js"
import {
  signTransaction,
  signTransactionWithPrivateKey,
  unsignedTransactionFromCbor,
  type AccountSignOptions,
  type UnsignedTransaction,
  type SignedTransaction,
} from "./transactions/transaction.js"
import type {
  AccountDerivationPath,
  AccountExportV1,
  AddressDerivationPath,
  CardanoServiceClients,
  CardanoConfig,
  NetworkConfig,
  ProtocolParameters,
  Provider,
  SignedMessage,
  SlotConfig,
} from "./types.js"
import { connectCip30Wallet, isCip30WalletEnabled, listCip30Wallets, type Cip30Wallet } from "./wallets/cip30.js"

export interface Cardano {
  readonly provider: Provider
  readonly clients: CardanoServiceClients
  readonly network: NetworkConfig
  readonly slotConfig: SlotConfig
  readonly transactionTtlSeconds: number
  getProtocolParameters(forceRefresh?: boolean): Promise<ProtocolParameters>
  readonly chain: {
    getTip(): ReturnType<Provider["getTip"]>
  }
  readonly wallets: {
    list(): string[]
    isEnabled(wallet: string): Promise<boolean>
    connect(wallet: string, extensions?: { cip: number }[]): Promise<Cip30Wallet>
  }
  readonly accounts: {
    fromMnemonic(
      mnemonic: string,
      password?: string,
      accountPath?: AccountDerivationPath,
      addressPath?: AddressDerivationPath
    ): CardanoAccount
    fromPrivateKey(
      privateKey: string,
      password?: string,
      accountPath?: AccountDerivationPath,
      addressPath?: AddressDerivationPath
    ): CardanoAccount
    fromPublicKey(publicKey: string, addressPath?: AddressDerivationPath): CardanoAccount
    fromWallet(wallet: Cip30Wallet): Promise<CardanoAccount>
    fromAddress(address: string): CardanoAccount
    import(config: AccountExportV1): CardanoAccount
  }
  readonly transactions: {
    create(): TransactionPlan
    fromCbor(transaction: string): UnsignedTransaction
    sign(
      transaction: UnsignedTransaction,
      accounts: CardanoAccount | readonly CardanoAccount[],
      options?: AccountSignOptions
    ): Promise<SignedTransaction>
    signWithPrivateKey(transaction: UnsignedTransaction, privateKey: string): SignedTransaction
    submit(transaction: SignedTransaction): Promise<string>
    observe(transactionHash: string, checkIntervalMs?: number, timeoutMs?: number): Promise<boolean>
  }
  readonly messages: {
    sign(account: CardanoAccount, message: string, password?: string): Promise<SignedMessage>
    signWithPrivateKey(privateKey: string, address: string, message: string): SignedMessage
    verify(address: string, message: string, signedMessage: SignedMessage): boolean
  }
}

export const createCardano = (config: CardanoConfig = {}): Cardano => {
  const networkName = config.network ?? "mainnet"
  const network: NetworkConfig = Object.freeze({
    name: networkName,
    type: networkName === "mainnet" ? "mainnet" : "testnet",
    id: networkName === "mainnet" ? 1 : 0,
  })
  const slotConfig = config.slotConfig ?? SLOT_CONFIG_NETWORK[networkName]
  if (networkName === "custom" && (!config.slotConfig || slotConfig.slotDuration <= 0)) {
    throw new Error("A custom network requires a slotConfig with a positive slotDuration")
  }

  const graphUrl = (service: string) => `https://graph.xray.app/output/services/${service}/${networkName}/api/v1`
  const provider = config.provider ?? createKoiosProvider(graphUrl("koios"))
  const clients: CardanoServiceClients = Object.freeze({
    koios: KoiosClient(config.clients?.koios?.url ?? graphUrl("koios"), config.clients?.koios?.headers),
    ogmios: OgmiosClient(config.clients?.ogmios?.url ?? graphUrl("ogmios"), config.clients?.ogmios?.headers),
    kupo: KupoClient(config.clients?.kupo?.url ?? graphUrl("kupo"), config.clients?.kupo?.headers),
    nftcdn: NftcdnClient(config.clients?.nftcdn?.url ?? graphUrl("nftcdn"), config.clients?.nftcdn?.headers),
  })
  const protocolParameters = createProtocolParametersCache(provider, config.protocolParameters ?? "remote")
  const context: CardanoContext = Object.freeze({
    provider,
    network,
    slotConfig,
    transactionTtlSeconds: config.transactionTtlSeconds ?? TTL,
    getProtocolParameters: protocolParameters.get,
  })

  const signMessageWithPrivateKey = (privateKey: string, address: string, message: string): SignedMessage => {
    const hexAddress = CardanoLib.Address.from_bech32(address).to_hex()
    const hexMessage = encoding.fromStringToHex(message)
    const { paymentCred } = addresses.getCredentials(address)
    const hash = CardanoLib.PrivateKey.from_bech32(privateKey).to_public().hash().to_hex()
    if (!paymentCred?.hash || paymentCred.hash !== hash) throw new Error("Private key does not match the address")
    return Message.signData(hexAddress, hexMessage, privateKey)
  }

  const messages = Object.freeze({
    sign: async (account: CardanoAccount, message: string, password?: string): Promise<SignedMessage> => {
      if (account.type === "private-key") {
        return signMessageWithPrivateKey(account.getPrivateKey(password), account.paymentAddress, message)
      }
      if (account.type === "wallet") {
        const hexAddress = CardanoLib.Address.from_bech32(account.paymentAddress).to_hex()
        return account.getWallet().signData(hexAddress, encoding.fromStringToHex(message))
      }
      throw new Error(`Account type ${account.type} cannot sign messages`)
    },
    signWithPrivateKey: signMessageWithPrivateKey,
    verify: (address: string, message: string, signedMessage: SignedMessage): boolean => {
      const hexAddress = CardanoLib.Address.from_bech32(address).to_hex()
      const hexMessage = encoding.fromStringToHex(message)
      const { paymentCred, stakingCred } = addresses.getCredentials(address)
      const hash = paymentCred?.hash ?? stakingCred?.hash
      if (!hash) throw new Error("Invalid address")
      return Message.verifyData(hexAddress, hash, hexMessage, signedMessage)
    },
  })

  return Object.freeze({
    provider,
    clients,
    network,
    slotConfig,
    transactionTtlSeconds: context.transactionTtlSeconds,
    getProtocolParameters: protocolParameters.get,
    chain: Object.freeze({ getTip: () => provider.getTip() }),
    wallets: Object.freeze({
      list: listCip30Wallets,
      isEnabled: isCip30WalletEnabled,
      connect: connectCip30Wallet,
    }),
    accounts: Object.freeze({
      fromMnemonic: (
        mnemonic: string,
        password?: string,
        accountPath: AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH,
        addressPath: AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH
      ) => accountFromMnemonic(context, mnemonic, password, accountPath, addressPath),
      fromPrivateKey: (
        privateKey: string,
        password?: string,
        accountPath: AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH,
        addressPath: AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH
      ) => accountFromPrivateKey(context, privateKey, password, accountPath, addressPath),
      fromPublicKey: (publicKey: string, addressPath: AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH) =>
        accountFromPublicKey(context, publicKey, addressPath),
      fromWallet: (wallet: Cip30Wallet) => accountFromWallet(context, wallet),
      fromAddress: (address: string) => accountFromAddress(context, address),
      import: (account: AccountExportV1) => importCardanoAccount(context, account),
    }),
    transactions: Object.freeze({
      create: () => createTransactionPlan(context),
      fromCbor: unsignedTransactionFromCbor,
      sign: signTransaction,
      signWithPrivateKey: signTransactionWithPrivateKey,
      submit: (transaction: SignedTransaction) => provider.submitTx(transaction.cbor),
      observe: (transactionHash: string, checkIntervalMs?: number, timeoutMs?: number) =>
        provider.observeTx(transactionHash, checkIntervalMs, timeoutMs),
    }),
    messages,
  })
}
