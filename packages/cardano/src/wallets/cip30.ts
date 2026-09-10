import type { Cip30Api, Cip30Extension, Cip30Provider, SignedMessage, WalletPagination } from "../types.js"

declare global {
  interface Window {
    cardano?: Record<string, Cip30Provider | undefined>
  }
}

export interface Cip30Wallet {
  getExtensions(): Promise<Cip30Extension[]>
  getNetworkId(): Promise<0 | 1>
  getUtxos(amount?: string, paginate?: WalletPagination): Promise<string[] | null>
  getCollateral(): Promise<string[] | null>
  getBalance(): Promise<string>
  getUsedAddresses(paginate?: WalletPagination): Promise<string[]>
  getUnusedAddresses(): Promise<string[]>
  getChangeAddress(): Promise<string>
  getRewardAddresses(): Promise<string[]>
  signTransaction(transaction: string, partialSign?: boolean): Promise<string>
  signData(address: string, payload: string): Promise<SignedMessage>
  submitTransaction(transaction: string): Promise<string>
}

export const createCip30Wallet = (api: Cip30Api): Cip30Wallet =>
  Object.freeze({
    getExtensions: () => api.getExtensions(),
    getNetworkId: () => api.getNetworkId(),
    getUtxos: (amount?: string, paginate?: WalletPagination) => api.getUtxos(amount, paginate),
    getCollateral: () => api.getCollateral(),
    getBalance: () => api.getBalance(),
    getUsedAddresses: (paginate?: WalletPagination) => api.getUsedAddresses(paginate),
    getUnusedAddresses: () => api.getUnusedAddresses(),
    getChangeAddress: () => api.getChangeAddress(),
    getRewardAddresses: () => api.getRewardAddresses(),
    signTransaction: (transaction: string, partialSign = false) => api.signTx(transaction, partialSign),
    signData: (address: string, payload: string) => api.signData(address, payload),
    submitTransaction: (transaction: string) => api.submitTx(transaction),
  })

export const listCip30Wallets = (): string[] => {
  if (typeof window === "undefined") throw new Error("CIP-30 wallets are only available in browsers")
  return Object.entries(window.cardano ?? {})
    .filter(([, provider]) => Boolean(provider?.apiVersion))
    .map(([name]) => name)
}

export const isCip30WalletEnabled = async (wallet: string): Promise<boolean> => {
  if (typeof window === "undefined") throw new Error("CIP-30 wallets are only available in browsers")
  return (await window.cardano?.[wallet]?.isEnabled()) ?? false
}

export const connectCip30Wallet = async (wallet: string, extensions?: Cip30Extension[]): Promise<Cip30Wallet> => {
  if (typeof window === "undefined") throw new Error("CIP-30 wallets are only available in browsers")
  const provider = window.cardano?.[wallet]
  if (!provider) throw new Error(`Wallet ${wallet} was not found`)
  return createCip30Wallet(await provider.enable(extensions ? { extensions } : undefined))
}
