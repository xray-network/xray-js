import type { CardanoContext } from "../internal/client-context.js"
import { CardanoLib, UPLC } from "../internal/dependencies.js"
import primitives from "../primitives/index.js"
import type * as CardanoTypes from "../types/index.js"
import { unsignedTransactionFromCbor, type UnsignedTransaction } from "./unsigned-transaction.js"

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
    registerDRep(rewardAddress: string, drepInfo?: CardanoTypes.DrepAnchor, redeemer?: string): TransactionPlan
    deregisterDRep(rewardAddress: string, redeemer?: string): TransactionPlan
    updateDRep(rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string): TransactionPlan
  }
  evaluation(mode: "local" | "remote"): TransactionPlan
  coinSelection(strategy: CardanoTypes.CoinSelectionStrategy): TransactionPlan
  build(): Promise<UnsignedTransaction>
}

export interface TransactionExecutor {
  attachScript(script: CardanoTypes.Script): TransactionExecutor
  readFrom(utxos: CardanoTypes.Utxo[]): TransactionExecutor
  spendFromScript(utxos: CardanoTypes.Utxo[], redeemer?: string): TransactionExecutor
  spend(utxos: CardanoTypes.Utxo[]): TransactionExecutor
  payToContract(
    output: CardanoTypes.Output,
    datum: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ): TransactionExecutor
  payTo(
    outputs: CardanoTypes.Output[],
    datum?: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ): TransactionExecutor
  validFrom(unixTime: number): TransactionExecutor
  validUntil(unixTime: number): TransactionExecutor
  validForSlots(slotsOffset: number): TransactionExecutor
  setChangeAddress(address: string): TransactionExecutor
  requireSigner(address: string): TransactionExecutor
  requireSignerKeyHash(keyHash: string): TransactionExecutor
  mint(assets: CardanoTypes.Asset[], redeemer?: string): TransactionExecutor
  metadataText(label: number, metadata: CardanoTypes.JsonValue): TransactionExecutor
  metadataJson(label: number, metadata: CardanoTypes.JsonValue, conversion?: 0 | 1 | 2): TransactionExecutor
  readonly stake: {
    withdrawRewards(rewardAddress: string, amount: bigint, redeemer?: string): TransactionExecutor
    delegateTo(rewardAddress: string, poolId: string, redeemer?: string): TransactionExecutor
    register(rewardAddress: string): TransactionExecutor
    deregister(rewardAddress: string, redeemer?: string): TransactionExecutor
  }
  readonly governance: {
    delegateToDRep(rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string): TransactionExecutor
    registerDRep(rewardAddress: string, drepInfo?: CardanoTypes.DrepAnchor, redeemer?: string): TransactionExecutor
    deregisterDRep(rewardAddress: string, redeemer?: string): TransactionExecutor
    updateDRep(rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string): TransactionExecutor
  }
  evaluation(mode: "local" | "remote"): TransactionExecutor
  coinSelection(strategy: CardanoTypes.CoinSelectionStrategy): TransactionExecutor
  build(): Promise<UnsignedTransaction>
}

export const createTransactionExecutor = (client: CardanoContext): TransactionExecutor => {
  let protocolParameters: CardanoTypes.ProtocolParameters
  let changeAddress: string
  const scripts = new Map<string, CardanoTypes.Script>()
  const queue: (() => unknown)[] = []
  const inputs = new Map<string, CardanoTypes.Utxo>()
  const readInputs = new Map<string, CardanoTypes.Utxo>()
  const collectInputs = new Map<string, CardanoTypes.Utxo>()
  let evaluationMode: "local" | "remote" = "local"
  let coinSelectionStrategy: CardanoTypes.CoinSelectionStrategy = "largest-first-multiasset"
  let transactionBuilder: CardanoLib.TransactionBuilder
  let api: TransactionExecutor

  /** Attach script to transaction builder for using in next operations
   * @param script Script to attach
   * @returns TransactionExecutor instance
   */
  const attachScript = (script: CardanoTypes.Script) => {
    const scriptHash = primitives.script.scriptToScriptHash(script)
    scripts.set(scriptHash, script)
    return api
  }

  /**
   * Add UTXOs to read referenced data from
   * @param utxos UTXOs to read from
   * @returns TransactionExecutor instance
   */
  const readFrom = (utxos: CardanoTypes.Utxo[]) => {
    queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await client.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        if (utxo.script && utxo.scriptHash) {
          scripts.set(utxo.scriptHash, utxo.script)
        }
        readInputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const input = primitives.tx.utxoToCore(utxo)
        transactionBuilder.add_reference_input(input)
      }
    })
    return api
  }

  /**
   * Add script UTXOs to spend from
   * @param utxos UTXOs to collect from
   * @param redeemer Redeemer to use (optional)
   * @returns TransactionExecutor instance
   */
  const spendFromScript = (utxos: CardanoTypes.Utxo[], redeemer?: string) => {
    queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await client.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        const { paymentCred } = primitives.address.getCredentials(utxo.address)
        if (!paymentCred) throw new Error("Script input address has no payment credential")
        const script = scripts.get(paymentCred.hash)
        if (!script) {
          throw new Error(
            "Script is required for spendFromScript() method. Attach script with attachScript() or readFrom() method"
          )
        }
        collectInputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const coreUtxo = primitives.tx.utxoToCore(utxo)
        const inputBuilder = CardanoLib.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        switch (script.language) {
          case "Native":
            transactionBuilder.add_input(
              inputBuilder.native_script(
                CardanoLib.NativeScript.from_cbor_hex(script.script),
                CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
              )
            )
            break
          case "PlutusV1":
            if (!redeemer) {
              throw new Error(
                "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
              )
            }
            transactionBuilder.add_input(
              inputBuilder.plutus_script(
                primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                CardanoLib.RequiredSigners.new(),
                CardanoLib.PlutusData.from_cbor_hex(utxo.datum!)
              )
            )
            break
          case "PlutusV2":
          case "PlutusV3":
            if (!redeemer) {
              throw new Error(
                "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
              )
            }
            transactionBuilder.add_input(
              inputBuilder.plutus_script_inline_datum(
                primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                CardanoLib.RequiredSigners.new()
              )
            )
            break
        }
      }
    })
    return api
  }

  /**
   * Add UTXOs to spend from
   * @param utxos UTXOs to spend from
   * @returns TransactionExecutor instance
   */
  const spend = (utxos: CardanoTypes.Utxo[]) => {
    queue.push(async () => {
      for (const utxo of utxos) {
        inputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const coreUtxo = primitives.tx.utxoToCore(utxo)
        const inputBuilder = CardanoLib.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        transactionBuilder.add_input(inputBuilder.payment_key())
      }
    })
    return api
  }

  /**
   * Main method to pay to address with/without data
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach (optional)
   * @returns TransactionExecutor instance
   * @throws Error if script is not provided with hash datum type
   */
  const addOutput = (output: CardanoTypes.Output, datum?: CardanoTypes.DatumOutput, script?: CardanoTypes.Script) => {
    queue.push(async () => {
      const outputBuilder = primitives.tx.outputToTransactionOutputBuilder(output, datum, script)
      const value = output.value ?? 0n
      const cardanoValue = primitives.tx.assetsToValue(value, output.assets)
      const multiAsset = cardanoValue.multi_asset()
      if (value === 0n && !multiAsset) throw new Error("An output requires lovelace or assets")
      const outputBuilderResult =
        value > 0n
          ? outputBuilder.next().with_value(cardanoValue).build()
          : outputBuilder
              .next()
              .with_asset_and_min_required_coin(multiAsset!, protocolParameters.coinsPerUtxoByte)
              .build()
      transactionBuilder.add_output(outputBuilderResult)
    })
    return api
  }

  /**
   * Add Output with data to pay to contract with address check
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach
   * @returns TransactionExecutor instance
   * @throws Error if address is not script type
   */
  const payToContract = (
    output: CardanoTypes.Output,
    datum: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ) => {
    const { paymentCred } = primitives.address.getCredentials(output.address)
    if (!paymentCred || paymentCred.type !== "script") {
      throw new Error("Invalid address for contract")
    }
    addOutput(output, datum, script)
    return api
  }

  /**
   * Add Outputs to pay to addresses
   * @param outputs Outputs to pay to
   * @param datum Datum to attach (optional)
   * @param script Script to attach (optional)
   * @returns TransactionExecutor instance
   */
  const payTo = (outputs: CardanoTypes.Output[], datum?: CardanoTypes.DatumOutput, script?: CardanoTypes.Script) => {
    for (const output of outputs) {
      addOutput(output, datum, script)
    }
    return api
  }

  /**
   * Set transaction validity start interval
   * @param unixTime Unix timestamp
   * @returns TransactionExecutor instance
   */
  const validFrom = (unixTime: number) => {
    queue.push(async () => {
      const slot = primitives.time.unixTimeToSlot(unixTime, client.slotConfig)
      transactionBuilder.set_validity_start_interval(BigInt(slot))
    })
    return api
  }

  /**
   * Set transaction validity end interval by Unix timestamp
   * @param unixTime Unix timestamp
   * @returns TransactionExecutor instance
   */
  const validUntil = (unixTime: number) => {
    queue.push(async () => {
      const slot = primitives.time.unixTimeToSlot(unixTime, client.slotConfig)
      transactionBuilder.set_ttl(BigInt(slot))
    })
    return api
  }

  /**
   * Set transaction validity end interval (TTL) in slots from now
   * @param slotsOffset Slots offset
   * @returns TransactionExecutor instance
   */
  const validForSlots = (slotsOffset: number) => {
    queue.push(async () => {
      const slot = primitives.time.unixTimeToSlot(Date.now() + slotsOffset * 1000, client.slotConfig)
      transactionBuilder.set_ttl(BigInt(slot))
    })
    return api
  }

  /**
   * Set change address
   * @param address Change address
   * @returns TransactionExecutor instance
   */
  const setChangeAddress = (address: string) => {
    changeAddress = address
    return api
  }

  /**
   * Add Required Signer by address
   * @param address Address of required signer
   * @returns TransactionExecutor instance
   */
  const requireSigner = (address: string) => {
    queue.push(() => {
      const { paymentCred, stakingCred, type } = primitives.address.getCredentials(address)
      if (!paymentCred && !stakingCred) {
        throw new Error("Invalid address for required signer")
      }
      const credential = type == "reward" ? stakingCred : paymentCred
      if (!credential) throw new Error("Address has no applicable signer credential")
      if (credential.type === "script") {
        throw new Error("Only key hash (not script) is allowed for required signer")
      }
      transactionBuilder.add_required_signer(CardanoLib.Ed25519KeyHash.from_hex(credential.hash))
    })
    return api
  }

  /**
   * Add Required Signer by key hash
   * @param keyHash Key hash of required signer
   * @returns TransactionExecutor instance
   */
  const requireSignerKeyHash = (keyHash: string) => {
    queue.push(() => {
      transactionBuilder.add_required_signer(CardanoLib.Ed25519KeyHash.from_hex(keyHash))
    })
    return api
  }

  /**
   * Add minting of assets
   * @param assets Assets to mint
   * @param redeemer Redeemer to use (optional)
   * @returns TransactionExecutor instance
   */
  const mint = (assets: CardanoTypes.Asset[], redeemer?: string) => {
    queue.push(async () => {
      const policyId = assets[0].policyId
      const mintAssets = CardanoLib.MapAssetNameToNonZeroInt64.new()
      for (const asset of assets) {
        if (asset.policyId !== policyId) throw new Error("All assets must have the same policyId")
        mintAssets.insert(
          CardanoLib.AssetName.from_raw_bytes(primitives.misc.fromHex(asset.assetName || "")),
          asset.quantity
        )
      }
      const script = scripts.get(policyId)
      if (!script) {
        throw new Error("Script is required for mint() method. Attach script with attachScript() or readFrom() method")
      }
      const mintBuilder = CardanoLib.SingleMintBuilder.new(mintAssets)
      switch (script.language) {
        case "Native":
          transactionBuilder.add_mint(
            mintBuilder.native_script(
              CardanoLib.NativeScript.from_cbor_hex(script.script),
              CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
            )
          )
          break
        case "PlutusV1":
        case "PlutusV2":
        case "PlutusV3":
          if (!redeemer) {
            throw new Error(
              "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
            )
          }
          transactionBuilder.add_mint(
            mintBuilder.plutus_script(
              primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
              CardanoLib.RequiredSigners.new()
            )
          )
          break
      }
    })
    return api
  }

  /**
   * Add metadata as string to transaction
   * @param label Metadata label
   * @param metadata Metadata to attach
   * @returns TransactionExecutor instance
   */
  const metadataText = (label: number, metadata: CardanoTypes.JsonValue) => {
    queue.push(async () => {
      const metadatum = CardanoLib.TransactionMetadatum.new_text(JSON.stringify(metadata))
      const metadataBuilder = CardanoLib.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = CardanoLib.AuxiliaryData.new(metadataBuilder)
      transactionBuilder.add_auxiliary_data(aux)
    })
    return api
  }

  /**
   * Add metadata as JSON (with conversion) to transaction
   * @param label Metadata label
   * @param metadata Metadata to attach
   * @param conversion Conversion type (optional, 0: default, 1: detailed, 2: more detailed)
   * @returns TransactionExecutor instance
   */
  const metadataJson = (label: number, metadata: CardanoTypes.JsonValue, conversion: 0 | 1 | 2 = 0) => {
    queue.push(async () => {
      const metadatum = CardanoLib.encode_json_str_to_metadatum(JSON.stringify(metadata), conversion)
      const metadataBuilder = CardanoLib.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = CardanoLib.AuxiliaryData.new(metadataBuilder)
      transactionBuilder.add_auxiliary_data(aux)
    })
    return api
  }

  /**
   * Stake related methods
   */

  const stake: {
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) => TransactionExecutor
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) => TransactionExecutor
    register: (rewardAddress: string) => TransactionExecutor
    deregister: (rewardAddress: string, redeemer?: string) => TransactionExecutor
  } = {
    /**
     * Add withdrawal of rewards
     * @param rewardAddress Reward address to withdraw from
     * @param amount Amount to withdraw
     * @param script Script to attach (optional)
     * @param redeemer Redeemer to use (optional)
     * @returns TransactionExecutor instance
     */
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
        const reward = CardanoLib.RewardAddress.from_address(CardanoLib.Address.from_bech32(rewardAddress))
        if (!reward) throw new Error("Invalid reward address")
        const withdrawBuilder = CardanoLib.SingleWithdrawalBuilder.new(reward, amount)
        switch (stakingCred.type) {
          case "key": {
            transactionBuilder.add_withdrawal(withdrawBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for stake.withdrawRewards() method. Attach script with attachScript() or readFrom() method"
              )
            }
            switch (script.language) {
              case "Native":
                transactionBuilder.add_withdrawal(
                  withdrawBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_withdrawal(
                  withdrawBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
            break
          }
        }
      })
      return api
    },
    /**
     * Delegate to pool
     * @param rewardAddress Reward address to delegate from
     * @param poolId Pool ID to delegate to
     * @param script Script to attach (optional)
     * @param redeemer Redeemer to use (optional)
     * @returns TransactionExecutor instance
     */
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards delegation (no staking credential)")
        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_stake_delegation(
                CardanoLib.StakeDelegation.new(credential, CardanoLib.Ed25519KeyHash.from_bech32(poolId))
              )
            )
            transactionBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for stake.delegateTo() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_stake_delegation(
                CardanoLib.StakeDelegation.new(credential, CardanoLib.Ed25519KeyHash.from_bech32(poolId))
              )
            )
            switch (script.language) {
              case "Native":
                transactionBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
            break
          }
        }
      })
      return api
    },
    /**
     * Register stake address
     * @param rewardAddress Reward address to register
     * @returns TransactionExecutor instance
     */
    register: (rewardAddress: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
        const credential =
          stakingCred.type === "key"
            ? CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            : CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
        const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
          CardanoLib.Certificate.new_stake_registration(CardanoLib.StakeRegistration.new(credential))
        )
        transactionBuilder.add_cert(certificateBuilder.skip_witness())
      })
      return api
    },
    /**
     * Deregister stake address
     * @param rewardAddress Reward address to deregister
     * @param script Script to attach (optional)
     * @param redeemer Redeemer to use (optional)
     * @returns TransactionExecutor instance
     */
    deregister: (rewardAddress: string, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards deregistration (no staking credential)")
        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_stake_deregistration(CardanoLib.StakeDeregistration.new(credential))
            )
            transactionBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for stake.deregister() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_stake_deregistration(CardanoLib.StakeDeregistration.new(credential))
            )
            switch (script.language) {
              case "Native":
                transactionBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return api
    },
  }

  /**
   * Governance related methods
   */
  const governance: {
    delegateToDRep: (rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string) => TransactionExecutor
    registerDRep: (rewardAddress: string, drepInfo?: CardanoTypes.DrepAnchor, redeemer?: string) => TransactionExecutor
    deregisterDRep: (rewardAddress: string, redeemer?: string) => TransactionExecutor
    updateDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => TransactionExecutor
  } = {
    delegateToDRep: (rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")
        const drepInstance = primitives.governance.toDRep(drep)

        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_vote_deleg_cert(CardanoLib.VoteDelegCert.new(credential, drepInstance))
            )
            transactionBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.delegateToDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_vote_deleg_cert(CardanoLib.VoteDelegCert.new(credential, drepInstance))
            )
            switch (script.language) {
              case "Native":
                transactionBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return api
    },

    registerDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")
        const drepAnchorInstance = drepAnchor
          ? CardanoLib.Anchor.new(
              CardanoLib.Url.new(drepAnchor.url),
              CardanoLib.AnchorDocHash.from_hex(drepAnchor.dataHash)
            )
          : undefined

        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_reg_drep_cert(
                CardanoLib.RegDrepCert.new(credential, protocolParameters.drepDeposit, drepAnchorInstance ?? null)
              )
            )
            transactionBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.registerDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_reg_drep_cert(
                CardanoLib.RegDrepCert.new(credential, protocolParameters.drepDeposit, drepAnchorInstance ?? null)
              )
            )
            switch (script.language) {
              case "Native":
                transactionBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return api
    },

    deregisterDRep: (rewardAddress: string, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")

        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_unreg_drep_cert(
                CardanoLib.UnregDrepCert.new(credential, protocolParameters.drepDeposit)
              )
            )
            transactionBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.registerDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_unreg_drep_cert(
                CardanoLib.UnregDrepCert.new(credential, protocolParameters.drepDeposit)
              )
            )
            switch (script.language) {
              case "Native":
                transactionBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return api
    },

    updateDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = primitives.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")
        const drepAnchorInstance = drepAnchor
          ? CardanoLib.Anchor.new(
              CardanoLib.Url.new(drepAnchor.url),
              CardanoLib.AnchorDocHash.from_hex(drepAnchor.dataHash)
            )
          : undefined

        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_update_drep_cert(
                CardanoLib.UpdateDrepCert.new(credential, drepAnchorInstance ?? null)
              )
            )
            transactionBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.registerDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new_update_drep_cert(
                CardanoLib.UpdateDrepCert.new(credential, drepAnchorInstance ?? null)
              )
            )
            switch (script.language) {
              case "Native":
                transactionBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
                break
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    primitives.script.partialPlutusWitness(primitives.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return api
    },
  }

  /**
   * Evaluate TX execution cost remotely
   * @param mode Evaluation mode
   * @returns TransactionExecutor instance
   */
  const evaluation = (mode: "local" | "remote") => {
    evaluationMode = mode
    return api
  }

  /**
   * Set coin selection strategy
   *
   * -1: Include all inputs
   *
   * 0: LargestFirst: Performs CIP2's Largest First ada-only selection. Will error if outputs contain non-ADA assets
   *
   * 1: RandomImprove: Performs CIP2's Random Improve ada-only selection. Will error if outputs contain non-ADA assets
   *
   * 2: LargestFirstMultiAsset: Same as LargestFirst, but before adding ADA, will insert by largest-first for each asset type
   *
   * 3: RandomImproveMultiAsset: Same as RandomImprove, but before adding ADA, will insert by random-improve for each asset type
   *
   * @param strategy Coin selection strategy
   * @returns TransactionExecutor instance
   */
  const coinSelection = (strategy: CardanoTypes.CoinSelectionStrategy) => {
    coinSelectionStrategy = strategy
    return api
  }

  /**
   * Apply all methods and return UnsignedTransaction instance
   * @returns UnsignedTransaction instance
   */
  const applyOperations = async () => {
    // Check if change address is set
    if (!changeAddress) {
      throw new Error("Change address is required. Use setChangeAddress() method to set it")
    }

    // Initialize Transaction Builder
    if (!transactionBuilder) {
      protocolParameters = await client.getProtocolParameters()
      transactionBuilder = primitives.tx.getTransactionBuilder(protocolParameters)
      // Set Network ID
      transactionBuilder.set_network_id(
        client.network.type === "mainnet" ? CardanoLib.NetworkId.mainnet() : CardanoLib.NetworkId.testnet()
      )
      // Set default TTL
      transactionBuilder.set_ttl(
        BigInt(primitives.time.unixTimeToSlot(Date.now() + client.transactionTtlSeconds * 1000, client.slotConfig))
      )
    }

    // Execute queue tasks
    for (const task of queue) {
      await task()
    }

    const requiresPlutus = [...scripts.values()].some((script) => script.language !== "Native")
    const addCollateral = () => {
      if (!requiresPlutus) return
      const collateral = [...inputs.values()].find((utxo) => utxo.value > 5_000_000)
      if (!collateral) throw new Error("Suitable collateral > 5 ADA not found")
      transactionBuilder.add_collateral(
        CardanoLib.SingleInputBuilder.from_transaction_unspent_output(
          primitives.tx.utxoToCore(collateral)
        ).payment_key()
      )
      transactionBuilder.set_collateral_return(
        CardanoLib.TransactionOutputBuilder.new()
          .with_address(CardanoLib.Address.from_bech32(changeAddress))
          .next()
          .with_value(primitives.tx.assetsToValue(collateral.value - BigInt(3_000_000), collateral.assets))
          .build()
          .output()
      )
    }
    addCollateral()

    // Coin Selection
    const selectionAlgorithms: Record<Exclude<CardanoTypes.CoinSelectionStrategy, "all">, 0 | 1 | 2 | 3> = {
      "largest-first": 0,
      "random-improve": 1,
      "largest-first-multiasset": 2,
      "random-improve-multiasset": 3,
    }
    const selectCoins = () => {
      if (coinSelectionStrategy !== "all") {
        transactionBuilder.select_utxos(selectionAlgorithms[coinSelectionStrategy])
      }
    }
    selectCoins()

    if (requiresPlutus) {
      const evaluation = transactionBuilder.build_for_evaluation(
        CardanoLib.ChangeSelectionAlgo.Default,
        CardanoLib.Address.from_bech32(changeAddress)
      )
      if (evaluationMode === "local") {
        const costModels = primitives.tx.createCostModels(protocolParameters.costModels)
        const slotConfig = client.slotConfig
        const allInputs = [...inputs.values(), ...readInputs.values(), ...collectInputs.values()]
        const uplcEvaluatedRedeemers = UPLC.evaluatePhaseTwo(
          evaluation.draft_tx(),
          allInputs.map(primitives.tx.utxoToCore),
          costModels,
          [protocolParameters.maxTxExSteps, protocolParameters.maxTxExMem],
          [BigInt(slotConfig.zeroTime), BigInt(slotConfig.zeroSlot), BigInt(slotConfig.slotDuration)],
          protocolParameters.protocolMajorVersion,
          true
        )
        // Evaluation adds draft change to the low-level builder. Rebuild from the
        // operation queue before applying execution units so final build owns change calculation.
        transactionBuilder = primitives.tx.getTransactionBuilder(protocolParameters)
        transactionBuilder.set_network_id(
          client.network.type === "mainnet" ? CardanoLib.NetworkId.mainnet() : CardanoLib.NetworkId.testnet()
        )
        transactionBuilder.set_ttl(
          BigInt(primitives.time.unixTimeToSlot(Date.now() + client.transactionTtlSeconds * 1000, client.slotConfig))
        )
        for (const task of queue) await task()
        addCollateral()
        selectCoins()
        for (const result of uplcEvaluatedRedeemers) {
          transactionBuilder.set_exunits(
            result.redeemer,
            CardanoLib.ExUnits.new(result.evaluation.cost.memory, result.evaluation.cost.cpu)
          )
        }
      } else {
        throw new Error("Remote TX evaluation is not supported yet")
      }
    }

    return api
  }

  /**
   * Apply all methods, build TX and return UnsignedTransaction instance
   * @returns UnsignedTransaction instance
   */
  const build = async () => {
    await applyOperations()
    return unsignedTransactionFromCbor(
      transactionBuilder
        .build(CardanoLib.ChangeSelectionAlgo.Default, CardanoLib.Address.from_bech32(changeAddress))
        .build_unchecked()
        .to_cbor_hex(),
      [...inputs.values(), ...readInputs.values(), ...collectInputs.values()]
    )
  }

  api = Object.freeze({
    attachScript,
    readFrom,
    spendFromScript,
    spend,
    payToContract,
    payTo,
    validFrom,
    validUntil,
    validForSlots,
    setChangeAddress,
    requireSigner,
    requireSignerKeyHash,
    mint,
    metadataText,
    metadataJson,
    stake: Object.freeze(stake),
    governance: Object.freeze(governance),
    evaluation,
    coinSelection,
    build,
  })
  return api
}

type TransactionOperation = (executor: TransactionExecutor) => TransactionExecutor

const copyAssets = (assets: readonly CardanoTypes.Asset[] | undefined): CardanoTypes.Asset[] | undefined =>
  assets?.map((asset) => ({ ...asset }))

const copyUtxos = (utxos: readonly CardanoTypes.Utxo[]): CardanoTypes.Utxo[] =>
  utxos.map((utxo) => ({
    ...utxo,
    transaction: { ...utxo.transaction },
    assets: copyAssets(utxo.assets) ?? [],
    script: utxo.script ? { ...utxo.script } : utxo.script,
  }))

const copyOutputs = (outputs: readonly CardanoTypes.Output[]): CardanoTypes.Output[] =>
  outputs.map((output) => ({ ...output, assets: copyAssets(output.assets) }))

export const createTransactionPlan = (
  client: CardanoContext,
  operations: readonly TransactionOperation[] = []
): TransactionPlan => {
  const append = (operation: TransactionOperation): TransactionPlan =>
    createTransactionPlan(client, Object.freeze([...operations, operation]))

  const attachScript = (script: CardanoTypes.Script) => {
    const snapshot = { ...script }
    return append((executor) => executor.attachScript(snapshot))
  }
  const readFrom = (utxos: CardanoTypes.Utxo[]) => {
    const snapshot = copyUtxos(utxos)
    return append((executor) => executor.readFrom(snapshot))
  }
  const spendFromScript = (utxos: CardanoTypes.Utxo[], redeemer?: string) => {
    const snapshot = copyUtxos(utxos)
    return append((executor) => executor.spendFromScript(snapshot, redeemer))
  }
  const spend = (utxos: CardanoTypes.Utxo[]) => {
    const snapshot = copyUtxos(utxos)
    return append((executor) => executor.spend(snapshot))
  }
  const payToContract = (
    output: CardanoTypes.Output,
    datum: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ) => {
    const outputSnapshot = copyOutputs([output])[0]!
    const datumSnapshot = { ...datum }
    const scriptSnapshot = script ? { ...script } : undefined
    return append((executor) => executor.payToContract(outputSnapshot, datumSnapshot, scriptSnapshot))
  }
  const payTo = (outputs: CardanoTypes.Output[], datum?: CardanoTypes.DatumOutput, script?: CardanoTypes.Script) => {
    const outputSnapshot = copyOutputs(outputs)
    const datumSnapshot = datum ? { ...datum } : undefined
    const scriptSnapshot = script ? { ...script } : undefined
    return append((executor) => executor.payTo(outputSnapshot, datumSnapshot, scriptSnapshot))
  }
  const validFrom = (unixTime: number) => append((executor) => executor.validFrom(unixTime))
  const validUntil = (unixTime: number) => append((executor) => executor.validUntil(unixTime))
  const validForSlots = (slotsOffset: number) => append((executor) => executor.validForSlots(slotsOffset))
  const setChangeAddress = (address: string) => append((executor) => executor.setChangeAddress(address))
  const requireSigner = (address: string) => append((executor) => executor.requireSigner(address))
  const requireSignerKeyHash = (keyHash: string) => append((executor) => executor.requireSignerKeyHash(keyHash))
  const mint = (assets: CardanoTypes.Asset[], redeemer?: string) => {
    const snapshot = copyAssets(assets) ?? []
    return append((executor) => executor.mint(snapshot, redeemer))
  }
  const metadataText = (label: number, metadata: CardanoTypes.JsonValue) => {
    const snapshot = structuredClone(metadata)
    return append((executor) => executor.metadataText(label, snapshot))
  }
  const metadataJson = (label: number, metadata: CardanoTypes.JsonValue, conversion: 0 | 1 | 2 = 0) => {
    const snapshot = structuredClone(metadata)
    return append((executor) => executor.metadataJson(label, snapshot, conversion))
  }
  const evaluation = (mode: "local" | "remote") => append((executor) => executor.evaluation(mode))
  const coinSelection = (strategy: CardanoTypes.CoinSelectionStrategy) =>
    append((executor) => executor.coinSelection(strategy))

  const stake = Object.freeze({
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) =>
      append((executor) => executor.stake.withdrawRewards(rewardAddress, amount, redeemer)),
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) =>
      append((executor) => executor.stake.delegateTo(rewardAddress, poolId, redeemer)),
    register: (rewardAddress: string) => append((executor) => executor.stake.register(rewardAddress)),
    deregister: (rewardAddress: string, redeemer?: string) =>
      append((executor) => executor.stake.deregister(rewardAddress, redeemer)),
  })

  const governance = Object.freeze({
    delegateToDRep: (rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string) =>
      append((executor) => executor.governance.delegateToDRep(rewardAddress, drep, redeemer)),
    registerDRep: (rewardAddress: string, drepInfo?: CardanoTypes.DrepAnchor, redeemer?: string) => {
      const snapshot = drepInfo ? { ...drepInfo } : undefined
      return append((executor) => executor.governance.registerDRep(rewardAddress, snapshot, redeemer))
    },
    deregisterDRep: (rewardAddress: string, redeemer?: string) =>
      append((executor) => executor.governance.deregisterDRep(rewardAddress, redeemer)),
    updateDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => {
      const snapshot = drepAnchor ? { ...drepAnchor } : undefined
      return append((executor) => executor.governance.updateDRep(rewardAddress, snapshot, redeemer))
    },
  })

  const build = async (): Promise<UnsignedTransaction> => {
    let executor = createTransactionExecutor(client)
    for (const operation of operations) executor = operation(executor)
    return executor.build()
  }

  return Object.freeze({
    attachScript,
    readFrom,
    spendFromScript,
    spend,
    payToContract,
    payTo,
    validFrom,
    validUntil,
    validForSlots,
    setChangeAddress,
    requireSigner,
    requireSignerKeyHash,
    mint,
    metadataText,
    metadataJson,
    stake,
    governance,
    evaluation,
    coinSelection,
    build,
  })
}
