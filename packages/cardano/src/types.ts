/** Account types */
export type AccountType = "private-key" | "public-key" | "wallet" | "address"
export type AccountConfig = {
  configVersion: number
  type: AccountType | undefined
  checksumImage: string | undefined
  checksumId: string | undefined
  xpubKey: string | undefined
  xprvKey: string | undefined
  xprvKeyIsEncoded: boolean | undefined
  accountPath: AccountDerivationPath | undefined
  addressPath: AddressDerivationPath | undefined
  paymentAddress: string | undefined
  paymentCred: string | undefined
  stakingAddress: string | undefined
  stakingCred: string | undefined
  wallet: Cip30Wallet | undefined
}
export type AccountExportV1 = {
  configVersion: 1
  type: AccountType
  xpubKey: string | undefined
  xprvKey: string | undefined
  xprvKeyIsEncoded: boolean | undefined
  accountPath: AccountDerivationPath | undefined
  addressPath: AddressDerivationPath | undefined
  paymentAddress: string | undefined
  stakingAddress: string | undefined
}
export type AccountState = {
  utxos: Utxo[]
  balance: Balance
}
export type AccountDelegation = {
  delegation: string | null
  rewards: bigint
}
export type AccountAddressDerivation = {
  address: string
  path: AddressDerivationPath
}
export type AccountMultiAddressing = {
  isMulti: boolean
  utxos: Utxo[]
  derivation: AccountAddressDerivation[]
}
/** DRep */
type DRepOptions<T extends string> = T | (string & {})
export type DRep = DRepOptions<"AlwaysAbstain" | "AlwaysNoConfidence">
export type DrepAnchor = {
  url: string
  dataHash: string
}

/** Provider types */
export interface Provider {
  getTip: () => Promise<Tip>
  getProtocolParameters(): Promise<ProtocolParameters>
  getUtxosByAddresses(address: string[]): Promise<Utxo[]>
  getUtxosByAddress(address: string): Promise<Utxo[]>
  getUtxoByOutputRef(txHash: string, index: number): Promise<Utxo>
  resolveUtxoDatumAndScript(utxo: Utxo): Promise<Utxo>
  getDatumByHash(datumHash: string): Promise<string | undefined>
  getScriptByHash(scriptHash: string): Promise<Script | undefined>
  getDelegation(stakingAddress: string): Promise<AccountDelegation>
  evaluateTx(tx: string, additionalUtxos?: Utxo[]): Promise<RedeemerCost[]>
  submitTx(tx: string): Promise<string>
  observeTx(txHash: string, checkInterval?: number, maxTime?: number): Promise<boolean>
}

/** Raw service client types */
import type KoiosClientInstance from "cardano-koios-client"
import type OgmiosClientInstance from "cardano-ogmios-client"
import type KupoClientInstance from "cardano-kupo-client"
import type NftcdnClientInstance from "cardano-nftcdn-client"
export type KoiosApiClient = ReturnType<typeof KoiosClientInstance>
export type OgmiosApiClient = ReturnType<typeof OgmiosClientInstance>
export type KupoApiClient = ReturnType<typeof KupoClientInstance>
export type NftcdnApiClient = ReturnType<typeof NftcdnClientInstance>
export type CardanoServiceClients = {
  koios: KoiosApiClient
  ogmios: OgmiosApiClient
  kupo: KupoApiClient
  nftcdn: NftcdnApiClient
}

/** Cip30Wallet types */
import type { Cip30Wallet } from "./wallets/cip30.js"
export type WalletPagination = {
  page: number
  limit: number
}

/** Cardano configuration */
export type ProtocolParameterSource =
  | ProtocolParameters
  | "remote"
  | {
      source: "remote"
      cacheDurationMs?: number
    }
  | {
      source: "static"
      value: ProtocolParameters
    }

export type CardanoConfig = {
  network?: NetworkName
  protocolParameters?: ProtocolParameterSource
  slotConfig?: SlotConfig
  transactionTtlSeconds?: number
  provider?: Provider
  clients?: {
    koios?: {
      headers?: Headers
      url: string
    }
    ogmios?: {
      headers?: Headers
      url: string
    }
    kupo?: {
      headers?: Headers
      url: string
    }
    nftcdn?: {
      headers?: Headers
      url: string
    }
  }
}

/** Cardano types */
export type NetworkName = "mainnet" | "preprod" | "preview" | "custom"
export type NetworkType = "mainnet" | "testnet"
export type NetworkId = 0 | 1
export type NetworkConfig = {
  name: NetworkName
  type: NetworkType
  id: NetworkId
}
export type Tip = {
  hash: string
  epochNo: number
  absSlot: number
  epochSlot: number
  blockNo: number
  blockTime: number
}
export type SlotConfig = {
  zeroTime: number
  zeroSlot: number
  slotDuration: number
}
export type CostModels = Record<PlutusVersion, number[]>
export type PlutusVersion = "PlutusV1" | "PlutusV2" | "PlutusV3"
export type Script = {
  language: PlutusVersion | "Native"
  script: string
}
export type NativeScript = {
  type: "sig" | "all" | "any" | "before" | "atLeast" | "after"
  keyHash?: string
  required?: number
  slot?: number
  scripts?: NativeScript[]
}
export type NativeConfig =
  | { type: "sig"; keyHash: string }
  | { type: "before"; slot: number }
  | { type: "after"; slot: number }
  | { type: "all"; scripts: ReadonlyArray<NativeConfig> }
  | { type: "any"; scripts: ReadonlyArray<NativeConfig> }
  | { type: "atLeast"; required: number; scripts: ReadonlyArray<NativeConfig> }
export type NativeScriptType =
  | { ScriptPubkey: { ed25519_key_hash: string } }
  | { ScriptInvalidBefore: { before: number } }
  | { ScriptInvalidHereafter: { after: number } }
  | { ScriptAll: { native_scripts: ReadonlyArray<NativeScriptType> } }
  | { ScriptAny: { native_scripts: ReadonlyArray<NativeScriptType> } }
  | { ScriptNOfK: { n: number; native_scripts: ReadonlyArray<NativeScriptType> } }
export type ProtocolParameters = {
  protocolMajorVersion: number
  minFeeA: number
  minFeeB: number
  maxTxSize: number
  maxValSize: number
  keyDeposit: bigint
  poolDeposit: bigint
  drepDeposit: bigint
  govActionDeposit: bigint
  priceMem: number
  priceStep: number
  maxTxExMem: bigint
  maxTxExSteps: bigint
  coinsPerUtxoByte: bigint
  collateralPercentage: number
  maxCollateralInputs: number
  minFeeRefScriptCostPerByte: number
  costModels: CostModels
}
export type AccountDerivationPath = [number, number, number]
export type AddressDerivationPath = [number, number]
export type AddressType = "base" | "pointer" | "enterprise" | "reward" | "byron"
export type AddressCredentialType = "key" | "script"
export type Credential = {
  type: AddressCredentialType
  hash: string
}
export type AddressPublicCredentials = {
  type: AddressType
  paymentCred?: Credential
  stakingCred?: Credential
}
export type Redeemer = string
export type RedeemerCost = {
  validator: string
  budget: {
    memory: number
    cpu: number
  }
}
export type Datum = string
export type DatumType = "inline" | "hash"
export type DatumOutput = {
  type: DatumType
  datum: Datum
}
export type Value = bigint
export type Asset = {
  policyId: string
  assetName: string
  quantity: bigint
  decimals?: number
}
export type Balance = {
  value: Value
  assets: (Asset & {
    fingerprint: string
    assetNameAscii: string
  })[]
}
export type Utxo = {
  transaction: {
    id: string
  }
  index: number
  address: string
  value: Value
  assets: Asset[]
  datumHash: string | null
  datumType: DatumType | null
  scriptHash: string | null
  datum?: Datum | null
  script?: Script | null
}
export type Output = {
  address: string
  value?: Value
  assets?: Asset[]
}
export type CollateralConfig = {
  utxo: Utxo | undefined
  auto: boolean
  excludeFromInputs: boolean
}
export type CoinSelectionStrategy =
  "all" | "largest-first" | "random-improve" | "largest-first-multiasset" | "random-improve-multiasset"
export type PoolConfig = {
  poolId: string
  vrfKeyHash: string
  pledge: bigint
  cost: bigint
  margin: [bigint, bigint]
  rewardAddress: string
  owners: Array<string>
  relays: Array<RelayConfig>
  metadataUrl?: string
}
export type RelayConfig = {
  type: "SingleHostIp" | "SingleHostDomainName" | "MultiHost"
  ipV4?: string
  ipV6?: string
  port?: number
  domainName?: string
}
export type DerivationScheme = {
  purpose: {
    hdwallet: 1852
    multisig: 1854
    minting: 1855
    voting: 1694
  }
  coinType: {
    ada: 1815
  }
  account: {
    first: 0
  }
  role: {
    payment: 0
    change: 1
    stake: 2
  }
  index: {
    first: 0
  }
}

/** Misc types */
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | { [key: string]: JsonValue } | JsonValue[]
export type OmitFirstArg<F> = F extends (arg1: unknown, ...args: infer P) => infer R ? (...args: P) => R : never
export type Exact<T> = T extends infer U ? U : never
export type SignedMessage = { signature: string; key: string }
export type Headers = {
  [key: string]: string
}

export type Cip30Extension = { cip: number }
export interface Cip30Api {
  getExtensions(): Promise<Cip30Extension[]>
  getNetworkId(): Promise<0 | 1>
  getUtxos(amount?: string, paginate?: WalletPagination): Promise<string[] | null>
  getCollateral(): Promise<string[] | null>
  getBalance(): Promise<string>
  getUsedAddresses(paginate?: WalletPagination): Promise<string[]>
  getUnusedAddresses(): Promise<string[]>
  getChangeAddress(): Promise<string>
  getRewardAddresses(): Promise<string[]>
  signTx(tx: string, partialSign?: boolean): Promise<string>
  signData(address: string, payload: string): Promise<SignedMessage>
  submitTx(tx: string): Promise<string>
}

export interface Cip30Provider {
  apiVersion?: string
  isEnabled(): Promise<boolean>
  enable(options?: { extensions: Cip30Extension[] }): Promise<Cip30Api>
}
