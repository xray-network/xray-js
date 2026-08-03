import { DEFAULT_PROTOCOL_PARAMETERS } from "./config.js"
import { createProviderResolvers } from "./providers/provider.js"
import type { AccountDelegation, ProtocolParameters, Provider, RedeemerCost, Script, Tip, Utxo } from "./types.js"

export { createProviderResolvers, pollUntil } from "./providers/provider.js"

export interface InMemoryProviderOptions {
  protocolParameters?: ProtocolParameters
  tip?: Tip
  utxos?: Utxo[]
  datums?: Record<string, string>
  scripts?: Record<string, Script>
  delegations?: Record<string, AccountDelegation>
  evaluation?: RedeemerCost[]
}

export interface InMemoryProvider extends Provider {
  readonly submittedTransactions: readonly string[]
  readonly protocolParameterRequests: number
}

export const createInMemoryProvider = (options: InMemoryProviderOptions = {}): InMemoryProvider => {
  const state = {
    protocolParameters: options.protocolParameters ?? DEFAULT_PROTOCOL_PARAMETERS,
    tip: options.tip ?? { hash: "0".repeat(64), epochNo: 0, absSlot: 0, epochSlot: 0, blockNo: 0, blockTime: 0 },
    utxos: options.utxos ?? [],
    datums: options.datums ?? {},
    scripts: options.scripts ?? {},
    delegations: options.delegations ?? {},
    evaluation: options.evaluation ?? [],
  }
  const submittedTransactions: string[] = []
  let protocolParameterRequests = 0

  const getTip = async (): Promise<Tip> => state.tip
  const getProtocolParameters = async (): Promise<ProtocolParameters> => {
    protocolParameterRequests += 1
    return state.protocolParameters
  }
  const getUtxosByAddresses = async (addresses: string[]): Promise<Utxo[]> => {
    const selected = new Set(addresses)
    return state.utxos.filter((utxo) => selected.has(utxo.address))
  }
  const getUtxoByOutputRef = async (transactionHash: string, index: number): Promise<Utxo> => {
    const utxo = state.utxos.find(
      (candidate) => candidate.transaction.id === transactionHash && candidate.index === index
    )
    if (!utxo) throw new Error(`UTXO ${transactionHash}#${index} was not found`)
    return utxo
  }
  const getDatumByHash = async (datumHash: string): Promise<string | undefined> => state.datums[datumHash]
  const getScriptByHash = async (scriptHash: string): Promise<Script | undefined> => state.scripts[scriptHash]
  const getDelegation = async (stakingAddress: string): Promise<AccountDelegation> =>
    state.delegations[stakingAddress] ?? { delegation: null, rewards: 0n }
  const evaluateTx = async (): Promise<RedeemerCost[]> => state.evaluation
  const submitTx = async (transaction: string): Promise<string> => {
    submittedTransactions.push(transaction)
    return `submitted-${submittedTransactions.length}`
  }
  const observeTx = async (transactionHash: string): Promise<boolean> => transactionHash.startsWith("submitted-")
  const { getUtxosByAddress, resolveUtxoDatumAndScript } = createProviderResolvers(
    { getUtxosByAddresses, getDatumByHash, getScriptByHash },
    { preserveResolved: true }
  )

  return Object.freeze({
    submittedTransactions,
    get protocolParameterRequests() {
      return protocolParameterRequests
    },
    getTip,
    getProtocolParameters,
    getUtxosByAddresses,
    getUtxosByAddress,
    getUtxoByOutputRef,
    resolveUtxoDatumAndScript,
    getDatumByHash,
    getScriptByHash,
    getDelegation,
    evaluateTx,
    submitTx,
    observeTx,
  })
}
