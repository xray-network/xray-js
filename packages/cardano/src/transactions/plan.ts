import type { CardanoContext } from "../internal/context.js"
import type * as CardanoTypes from "../types.js"
import { buildTransaction } from "./builder.js"
import type { UnsignedTransaction } from "./transaction.js"

export interface TransactionPlan {
  attachScript(script: CardanoTypes.Script): TransactionPlan
  readFrom(utxos: CardanoTypes.Utxo[]): TransactionPlan
  spendFromScript(utxos: CardanoTypes.Utxo[], redeemer?: string): TransactionPlan
  spend(utxos: CardanoTypes.Utxo[]): TransactionPlan
  payToContract(
    output: CardanoTypes.Output,
    datum: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ): TransactionPlan
  payTo(outputs: CardanoTypes.Output[], datum?: CardanoTypes.DatumOutput, script?: CardanoTypes.Script): TransactionPlan
  validFrom(unixTime: number): TransactionPlan
  validUntil(unixTime: number): TransactionPlan
  validForSlots(slotsOffset: number): TransactionPlan
  setChangeAddress(address: string): TransactionPlan
  requireSigner(address: string): TransactionPlan
  requireSignerKeyHash(keyHash: string): TransactionPlan
  mint(assets: CardanoTypes.Asset[], redeemer?: string): TransactionPlan
  metadataText(label: number, metadata: CardanoTypes.JsonValue): TransactionPlan
  metadataJson(label: number, metadata: CardanoTypes.JsonValue, conversion?: 0 | 1 | 2): TransactionPlan
  readonly stake: {
    withdrawRewards(rewardAddress: string, amount: bigint, redeemer?: string): TransactionPlan
    delegateTo(rewardAddress: string, poolId: string, redeemer?: string): TransactionPlan
    register(rewardAddress: string): TransactionPlan
    deregister(rewardAddress: string, redeemer?: string): TransactionPlan
  }
  readonly governance: {
    delegateToDRep(rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string): TransactionPlan
    registerDRep(rewardAddress: string, anchor?: CardanoTypes.DrepAnchor, redeemer?: string): TransactionPlan
    deregisterDRep(rewardAddress: string, redeemer?: string): TransactionPlan
    updateDRep(rewardAddress: string, anchor?: CardanoTypes.DrepAnchor, redeemer?: string): TransactionPlan
  }
  evaluation(mode: "local" | "remote"): TransactionPlan
  coinSelection(strategy: CardanoTypes.CoinSelectionStrategy): TransactionPlan
  build(): Promise<UnsignedTransaction>
}

export type TransactionOperation =
  | { readonly kind: "attach-script"; readonly script: CardanoTypes.Script }
  | { readonly kind: "read-from"; readonly utxos: readonly CardanoTypes.Utxo[] }
  | {
      readonly kind: "spend-from-script"
      readonly utxos: readonly CardanoTypes.Utxo[]
      readonly redeemer?: string
    }
  | { readonly kind: "spend"; readonly utxos: readonly CardanoTypes.Utxo[] }
  | {
      readonly kind: "pay-to-contract"
      readonly output: CardanoTypes.Output
      readonly datum: CardanoTypes.DatumOutput
      readonly script?: CardanoTypes.Script
    }
  | {
      readonly kind: "pay-to"
      readonly outputs: readonly CardanoTypes.Output[]
      readonly datum?: CardanoTypes.DatumOutput
      readonly script?: CardanoTypes.Script
    }
  | { readonly kind: "valid-from"; readonly unixTime: number }
  | { readonly kind: "valid-until"; readonly unixTime: number }
  | { readonly kind: "valid-for-slots"; readonly slotsOffset: number }
  | { readonly kind: "set-change-address"; readonly address: string }
  | { readonly kind: "require-signer"; readonly address: string }
  | { readonly kind: "require-signer-key-hash"; readonly keyHash: string }
  | { readonly kind: "mint"; readonly assets: readonly CardanoTypes.Asset[]; readonly redeemer?: string }
  | { readonly kind: "metadata-text"; readonly label: number; readonly metadata: CardanoTypes.JsonValue }
  | {
      readonly kind: "metadata-json"
      readonly label: number
      readonly metadata: CardanoTypes.JsonValue
      readonly conversion: 0 | 1 | 2
    }
  | {
      readonly kind: "withdraw-rewards"
      readonly rewardAddress: string
      readonly amount: bigint
      readonly redeemer?: string
    }
  | {
      readonly kind: "delegate-stake"
      readonly rewardAddress: string
      readonly poolId: string
      readonly redeemer?: string
    }
  | { readonly kind: "register-stake"; readonly rewardAddress: string }
  | { readonly kind: "deregister-stake"; readonly rewardAddress: string; readonly redeemer?: string }
  | {
      readonly kind: "delegate-drep"
      readonly rewardAddress: string
      readonly drep: CardanoTypes.DRep
      readonly redeemer?: string
    }
  | {
      readonly kind: "register-drep"
      readonly rewardAddress: string
      readonly anchor?: CardanoTypes.DrepAnchor
      readonly redeemer?: string
    }
  | { readonly kind: "deregister-drep"; readonly rewardAddress: string; readonly redeemer?: string }
  | {
      readonly kind: "update-drep"
      readonly rewardAddress: string
      readonly anchor?: CardanoTypes.DrepAnchor
      readonly redeemer?: string
    }
  | { readonly kind: "evaluation"; readonly mode: "local" | "remote" }
  | { readonly kind: "coin-selection"; readonly strategy: CardanoTypes.CoinSelectionStrategy }

const copyAssets = (assets: readonly CardanoTypes.Asset[] | undefined): CardanoTypes.Asset[] | undefined =>
  assets ? (Object.freeze(assets.map((asset) => Object.freeze({ ...asset }))) as CardanoTypes.Asset[]) : undefined

const copyUtxos = (utxos: readonly CardanoTypes.Utxo[]): readonly CardanoTypes.Utxo[] =>
  Object.freeze(
    utxos.map((utxo) =>
      Object.freeze({
        ...utxo,
        transaction: Object.freeze({ ...utxo.transaction }),
        assets: copyAssets(utxo.assets) ?? [],
        script: utxo.script ? Object.freeze({ ...utxo.script }) : utxo.script,
      })
    )
  )

const copyOutputs = (outputs: readonly CardanoTypes.Output[]): readonly CardanoTypes.Output[] =>
  Object.freeze(outputs.map((output) => Object.freeze({ ...output, assets: copyAssets(output.assets) })))

export const createTransactionPlan = (
  client: CardanoContext,
  operations: readonly TransactionOperation[] = []
): TransactionPlan => {
  const append = (operation: TransactionOperation): TransactionPlan =>
    createTransactionPlan(client, Object.freeze([...operations, Object.freeze(operation)]))

  const stake = Object.freeze({
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) =>
      append({ kind: "withdraw-rewards", rewardAddress, amount, redeemer }),
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) =>
      append({ kind: "delegate-stake", rewardAddress, poolId, redeemer }),
    register: (rewardAddress: string) => append({ kind: "register-stake", rewardAddress }),
    deregister: (rewardAddress: string, redeemer?: string) =>
      append({ kind: "deregister-stake", rewardAddress, redeemer }),
  })

  const governance = Object.freeze({
    delegateToDRep: (rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string) =>
      append({ kind: "delegate-drep", rewardAddress, drep, redeemer }),
    registerDRep: (rewardAddress: string, anchor?: CardanoTypes.DrepAnchor, redeemer?: string) =>
      append({ kind: "register-drep", rewardAddress, anchor: anchor ? { ...anchor } : undefined, redeemer }),
    deregisterDRep: (rewardAddress: string, redeemer?: string) =>
      append({ kind: "deregister-drep", rewardAddress, redeemer }),
    updateDRep: (rewardAddress: string, anchor?: CardanoTypes.DrepAnchor, redeemer?: string) =>
      append({ kind: "update-drep", rewardAddress, anchor: anchor ? { ...anchor } : undefined, redeemer }),
  })

  return Object.freeze({
    attachScript: (script: CardanoTypes.Script) => append({ kind: "attach-script", script: { ...script } }),
    readFrom: (utxos: CardanoTypes.Utxo[]) => append({ kind: "read-from", utxos: copyUtxos(utxos) }),
    spendFromScript: (utxos: CardanoTypes.Utxo[], redeemer?: string) =>
      append({ kind: "spend-from-script", utxos: copyUtxos(utxos), redeemer }),
    spend: (utxos: CardanoTypes.Utxo[]) => append({ kind: "spend", utxos: copyUtxos(utxos) }),
    payToContract: (output: CardanoTypes.Output, datum: CardanoTypes.DatumOutput, script?: CardanoTypes.Script) =>
      append({
        kind: "pay-to-contract",
        output: copyOutputs([output])[0]!,
        datum: { ...datum },
        script: script ? { ...script } : undefined,
      }),
    payTo: (outputs: CardanoTypes.Output[], datum?: CardanoTypes.DatumOutput, script?: CardanoTypes.Script) =>
      append({
        kind: "pay-to",
        outputs: copyOutputs(outputs),
        datum: datum ? { ...datum } : undefined,
        script: script ? { ...script } : undefined,
      }),
    validFrom: (unixTime: number) => append({ kind: "valid-from", unixTime }),
    validUntil: (unixTime: number) => append({ kind: "valid-until", unixTime }),
    validForSlots: (slotsOffset: number) => append({ kind: "valid-for-slots", slotsOffset }),
    setChangeAddress: (address: string) => append({ kind: "set-change-address", address }),
    requireSigner: (address: string) => append({ kind: "require-signer", address }),
    requireSignerKeyHash: (keyHash: string) => append({ kind: "require-signer-key-hash", keyHash }),
    mint: (assets: CardanoTypes.Asset[], redeemer?: string) =>
      append({ kind: "mint", assets: copyAssets(assets) ?? [], redeemer }),
    metadataText: (label: number, metadata: CardanoTypes.JsonValue) =>
      append({ kind: "metadata-text", label, metadata: structuredClone(metadata) }),
    metadataJson: (label: number, metadata: CardanoTypes.JsonValue, conversion: 0 | 1 | 2 = 0) =>
      append({ kind: "metadata-json", label, metadata: structuredClone(metadata), conversion }),
    stake,
    governance,
    evaluation: (mode: "local" | "remote") => append({ kind: "evaluation", mode }),
    coinSelection: (strategy: CardanoTypes.CoinSelectionStrategy) => append({ kind: "coin-selection", strategy }),
    build: () => buildTransaction(client, operations),
  })
}
