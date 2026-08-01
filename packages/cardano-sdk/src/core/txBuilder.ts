import { TTL } from "../config.js"
import { decodeCbor } from "@xray-network/xray-cardano-lib-core"

import { CardanoWeb3, CardanoLib, UPLC, utils, CW3Types } from "../index.js"
import { TxFinalizer } from "./txFinalizer.js"

export class TxBuilder {
  private cw3: CardanoWeb3
  private protocolParams: CW3Types.ProtocolParameters
  private changeAddress: string
  private scripts: Map<string, CW3Types.Script> = new Map()
  private queue: (() => unknown)[] = []
  private inputs: Map<string, CW3Types.Utxo> = new Map()
  private readInputs: Map<string, CW3Types.Utxo> = new Map()
  private collectInputs: Map<string, CW3Types.Utxo> = new Map()
  private remoteProtocolParams: boolean = false
  private remoteTxEvaluate: boolean = false
  private coinSelection: number = 2 // Default: LargestFirstMultiAsset
  __txBuilder: CardanoLib.TransactionBuilder

  constructor(cw3: CardanoWeb3) {
    this.cw3 = cw3
  }

  /** Attach script to transaction builder for using in next operations
   * @param script Script to attach
   * @returns TxBuilder instance
   */
  attachScript = (script: CW3Types.Script) => {
    const scriptHash = utils.script.scriptToScriptHash(script)
    this.scripts.set(scriptHash, script)
    return this
  }

  /**
   * Add UTXOs to read referenced data from
   * @param utxos UTXOs to read from
   * @returns TxBuilder instance
   */
  readFrom = (utxos: CW3Types.Utxo[]) => {
    this.queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await this.cw3.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        if (utxo.script) {
          this.scripts.set(utxo.scriptHash, utxo.script)
        }
        this.readInputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const input = utils.tx.utxoToCore(utxo)
        this.__txBuilder.add_reference_input(input)
      }
    })
    return this
  }

  /**
   * Add script UTXOs to spend from
   * @param utxos UTXOs to collect from
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  collectFrom = (utxos: CW3Types.Utxo[], redeemer?: string) => {
    this.queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await this.cw3.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        const { paymentCred } = utils.address.getCredentials(utxo.address)
        const script = this.scripts.get(paymentCred.hash)
        if (!script) {
          throw new Error(
            "Script is required for collectFrom() method. Attach script with attachScript() or readFrom() method"
          )
        }
        this.collectInputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const coreUtxo = utils.tx.utxoToCore(utxo)
        const inputBuilder = CardanoLib.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        switch (script.language) {
          case "Native":
            this.__txBuilder.add_input(
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
            this.__txBuilder.add_input(
              inputBuilder.plutus_script(
                utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                CardanoLib.RequiredSigners.from_cbor_hex("d9010280"),
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
            this.__txBuilder.add_input(
              inputBuilder.plutus_script_inline_datum(
                utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
              )
            )
            break
        }
      }
    })
    return this
  }

  /**
   * Add UTXOs to spend from
   * @param utxos UTXOs to spend from
   * @returns TxBuilder instance
   */
  addInputs = (utxos: CW3Types.Utxo[]) => {
    this.queue.push(async () => {
      for (const utxo of utxos) {
        this.inputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const coreUtxo = utils.tx.utxoToCore(utxo)
        const inputBuilder = CardanoLib.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        this.__txBuilder.add_input(inputBuilder.payment_key())
      }
    })
    return this
  }

  /**
   * Main method to pay to address with/without data
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach (optional)
   * @returns TxBuilder instance
   * @throws Error if script is not provided with hash datum type
   */
  private payTo = (output: CW3Types.Output, datum?: CW3Types.DatumOutput, script?: CW3Types.Script) => {
    this.queue.push(async () => {
      const outputBuilder = utils.tx.outputToTransactionOutputBuilder(output, datum, script)
      const outputBuilderResult =
        output.value > 0n
          ? outputBuilder.next().with_value(utils.tx.assetsToValue(output.value, output.assets)).build()
          : outputBuilder
              .next()
              .with_asset_and_min_required_coin(
                utils.tx.assetsToValue(output.value, output.assets).multi_asset(),
                this.protocolParams.coinsPerUtxoByte
              )
              .build()
      this.__txBuilder.add_output(outputBuilderResult)
    })
    return this
  }

  /**
   * Add Output with data to pay to contract with address check
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach
   * @returns TxBuilder instance
   * @throws Error if address is not script type
   */
  payToContract = (output: CW3Types.Output, datum: CW3Types.DatumOutput, script?: CW3Types.Script) => {
    const { paymentCred } = utils.address.getCredentials(output.address)
    if (!paymentCred || paymentCred.type !== "script") {
      throw new Error("Invalid address for contract")
    }
    this.payTo(output, datum, script)
    return this
  }

  /**
   * Add Outputs to pay to addresses
   * @param outputs Outputs to pay to
   * @param datum Datum to attach (optional)
   * @param script Script to attach (optional)
   * @returns TxBuilder instance
   */
  addOutputs = (outputs: CW3Types.Output[], datum?: CW3Types.DatumOutput, script?: CW3Types.Script) => {
    for (const output of outputs) {
      this.payTo(output, datum, script)
    }
    return this
  }

  /**
   * Set transaction validity start interval
   * @param unixTime Unix timestamp
   * @returns TxBuilder instance
   */
  validFrom = (unixTime: number) => {
    this.queue.push(async () => {
      const slot = utils.time.unixTimeToSlot(unixTime, this.cw3.__config.slotConfig)
      this.__txBuilder.set_validity_start_interval(BigInt(slot))
    })
    return this
  }

  /**
   * Set transaction validity end interval by Unix timestamp
   * @param unixTime Unix timestamp
   * @returns TxBuilder instance
   */
  validTo = (unixTime: number) => {
    this.queue.push(async () => {
      const slot = utils.time.unixTimeToSlot(unixTime, this.cw3.__config.slotConfig)
      this.__txBuilder.set_ttl(BigInt(slot))
    })
    return this
  }

  /**
   * Set transaction validity end interval (TTL) in slots from now
   * @param slotsOffset Slots offset
   * @returns TxBuilder instance
   */
  setTtl = (slotsOffset: number) => {
    this.queue.push(async () => {
      const slot = utils.time.unixTimeToSlot(Date.now() + slotsOffset * 1000, this.cw3.__config.slotConfig)
      this.__txBuilder.set_ttl(BigInt(slot))
    })
    return this
  }

  /**
   * Set change address
   * @param address Change address
   * @returns TxBuilder instance
   */
  setChangeAddress = (address: string) => {
    this.changeAddress = address
    return this
  }

  /**
   * Add Required Signer by address
   * @param address Address of required signer
   * @returns TxBuilder instance
   */
  addRequiredSignerByAddress = (address: string) => {
    this.queue.push(() => {
      const { paymentCred, stakingCred, type } = utils.address.getCredentials(address)
      if (!paymentCred && !stakingCred) {
        throw new Error("Invalid address for required signer")
      }
      const credential = type == "reward" ? stakingCred : paymentCred
      if (credential.type === "script") {
        throw new Error("Only key hash (not script) is allowed for required signer")
      }
      this.__txBuilder.add_required_signer(CardanoLib.Ed25519KeyHash.from_hex(credential.hash))
    })
    return this
  }

  /**
   * Add Required Signer by key hash
   * @param keyHash Key hash of required signer
   * @returns TxBuilder instance
   */
  addRequiredSignerByKeyHash = (keyHash: string) => {
    this.queue.push(() => {
      this.__txBuilder.add_required_signer(CardanoLib.Ed25519KeyHash.from_hex(keyHash))
    })
    return this
  }

  /**
   * Add minting of assets
   * @param assets Assets to mint
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  addMint = (assets: CW3Types.Asset[], redeemer?: string) => {
    this.queue.push(async () => {
      const policyId = assets[0].policyId
      const mintAssets = CardanoLib.MapAssetNameToNonZeroInt64.new()
      for (const asset of assets) {
        if (asset.policyId !== policyId) throw new Error("All assets must have the same policyId")
        mintAssets.insert(CardanoLib.AssetName.from_str(asset.assetName || ""), asset.quantity)
      }
      const script = this.scripts.get(policyId)
      if (!script) {
        throw new Error(
          "Script is required for addMint() method. Attach script with attachScript() or readFrom() method"
        )
      }
      const mintBuilder = CardanoLib.SingleMintBuilder.new(mintAssets)
      switch (script.language) {
        case "Native":
          this.__txBuilder.add_mint(
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
          this.__txBuilder.add_mint(
            mintBuilder.plutus_script(
              utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
              CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
            )
          )
          break
      }
    })
    return this
  }

  /**
   * Add metadata as string to transaction
   * @param label Metadata label
   * @param metadata Metadata to attach
   * @returns TxBuilder instance
   */
  addMetadataString = (label: number, metadata: CW3Types.Json) => {
    this.queue.push(async () => {
      const metadatum = CardanoLib.TransactionMetadatum.new_text(JSON.stringify(metadata))
      const metadataBuilder = CardanoLib.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = CardanoLib.AuxiliaryData.new(metadataBuilder)
      this.__txBuilder.add_auxiliary_data(aux)
    })
    return this
  }

  /**
   * Add metadata as JSON (with conversion) to transaction
   * @param label Metadata label
   * @param metadata Metadata to attach
   * @param conversion Conversion type (optional, 0: default, 1: detailed, 2: more detailed)
   * @returns TxBuilder instance
   */
  addMetadataJson = (label: number, metadata: CW3Types.Json, conversion: 0 | 1 | 2 = 0) => {
    this.queue.push(async () => {
      const metadatum = CardanoLib.encode_json_str_to_metadatum(JSON.stringify(metadata), conversion)
      const metadataBuilder = CardanoLib.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = CardanoLib.AuxiliaryData.new(metadataBuilder)
      this.__txBuilder.add_auxiliary_data(aux)
    })
    return this
  }

  /**
   * Stake related methods
   */

  stake: {
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) => TxBuilder
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) => TxBuilder
    register: (rewardAddress: string) => TxBuilder
    deregister: (rewardAddress: string, redeemer?: string) => TxBuilder
  } = {
    /**
     * Add withdrawal of rewards
     * @param rewardAddress Reward address to withdraw from
     * @param amount Amount to withdraw
     * @param script Script to attach (optional)
     * @param redeemer Redeemer to use (optional)
     * @returns TxBuilder instance
     */
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
        const withdrawBuilder = CardanoLib.SingleWithdrawalBuilder.new(
          CardanoLib.RewardAddress.from_address(CardanoLib.Address.from_bech32(rewardAddress)),
          amount
        )
        switch (stakingCred.type) {
          case "key": {
            this.__txBuilder.add_withdrawal(withdrawBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for stake.withdrawRewards() method. Attach script with attachScript() or readFrom() method"
              )
            }
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_withdrawal(
                  withdrawBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_withdrawal(
                  withdrawBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
            break
          }
        }
      })
      return this
    },
    /**
     * Delegate to pool
     * @param rewardAddress Reward address to delegate from
     * @param poolId Pool ID to delegate to
     * @param script Script to attach (optional)
     * @param redeemer Redeemer to use (optional)
     * @returns TxBuilder instance
     */
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards delegation (no staking credential)")
        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(2n, credential, CardanoLib.Ed25519KeyHash.from_bech32(poolId).to_raw_bytes())
            )
            this.__txBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for stake.delegateTo() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(2n, credential, CardanoLib.Ed25519KeyHash.from_bech32(poolId).to_raw_bytes())
            )
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
            break
          }
        }
      })
      return this
    },
    /**
     * Register stake address
     * @param rewardAddress Reward address to register
     * @returns TxBuilder instance
     */
    register: (rewardAddress: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
        const credential =
          stakingCred.type === "key"
            ? CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            : CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
        const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(CardanoLib.Certificate.new(0n, credential))
        this.__txBuilder.add_cert(certificateBuilder.skip_witness())
      })
      return this
    },
    /**
     * Deregister stake address
     * @param rewardAddress Reward address to deregister
     * @param script Script to attach (optional)
     * @param redeemer Redeemer to use (optional)
     * @returns TxBuilder instance
     */
    deregister: (rewardAddress: string, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards deregistration (no staking credential)")
        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(1n, credential)
            )
            this.__txBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for stake.deregister() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(1n, credential)
            )
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
          }
        }
      })
      return this
    },
  }

  /**
   * Governance related methods
   */
  governance: {
    delegateToDRep: (rewardAddress: string, drep: CW3Types.DRep, redeemer?: string) => TxBuilder
    registerDRep: (rewardAddress: string, drepInfo?: CW3Types.DrepAnchor, redeemer?: string) => TxBuilder
    deregisterDRep: (rewardAddress: string, redeemer?: string) => TxBuilder
    updateDRep: (rewardAddress: string, drepAnchor?: CW3Types.DrepAnchor, redeemer?: string) => TxBuilder
  } = {
    delegateToDRep: (rewardAddress: string, drep: CW3Types.DRep, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
        const drepInstance = utils.governance.toDRep(drep)

        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(7n, credential, drepInstance)
            )
            this.__txBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.delegateToDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(7n, credential, drepInstance)
            )
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
          }
        }
      })
      return this
    },

    registerDRep: (rewardAddress: string, drepAnchor?: CW3Types.DrepAnchor, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
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
              CardanoLib.Certificate.new(
                14n,
                credential,
                this.cw3.__config.protocolParams.drepDeposit,
                drepAnchorInstance ?? null
              )
            )
            this.__txBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.registerDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(
                14n,
                credential,
                this.cw3.__config.protocolParams.drepDeposit,
                drepAnchorInstance ?? null
              )
            )
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
          }
        }
      })
      return this
    },

    deregisterDRep: (rewardAddress: string, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)

        switch (stakingCred.type) {
          case "key": {
            const credential = CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(15n, credential, this.cw3.__config.protocolParams.drepDeposit)
            )
            this.__txBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.registerDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(15n, credential, this.cw3.__config.protocolParams.drepDeposit)
            )
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
          }
        }
      })
      return this
    },

    updateDRep: (rewardAddress: string, drepAnchor: CW3Types.DrepAnchor, redeemer?: string) => {
      this.queue.push(async () => {
        const { stakingCred } = utils.address.getCredentials(rewardAddress)
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
              CardanoLib.Certificate.new(16n, credential, drepAnchorInstance ?? null)
            )
            this.__txBuilder.add_cert(certificateBuilder.payment_key())
            break
          }
          case "script": {
            const script = this.scripts.get(stakingCred.hash)
            if (!script) {
              throw new Error(
                "Script is required for governance.registerDRep() method. Attach script with attachScript() or readFrom() method"
              )
            }
            const credential = CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakingCred.hash))
            const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
              CardanoLib.Certificate.new(16n, credential, drepAnchorInstance ?? null)
            )
            switch (script.language) {
              case "Native":
                this.__txBuilder.add_cert(
                  certificateBuilder.native_script(
                    CardanoLib.NativeScript.from_cbor_hex(script.script),
                    CardanoLib.NativeScriptWitnessInfo.assume_signature_count()
                  )
                )
              case "PlutusV1":
              case "PlutusV2":
              case "PlutusV3":
                if (!redeemer) {
                  throw new Error(
                    "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                  )
                }
                this.__txBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    utils.script.partialPlutusWitness(utils.script.scriptToPlutusScript(script), redeemer),
                    CardanoLib.RequiredSigners.from_cbor_hex("d9010280")
                  )
                )
                break
            }
          }
        }
      })
      return this
    },
  }

  /**
   * Fetch protocol parameters from remote on TX build
   * @param remoteProtocolParams Fetch protocol parameters from remote
   * @returns TxBuilder instance
   */
  withRemoteProtocolParams = (remoteProtocolParams: boolean) => {
    this.remoteProtocolParams = remoteProtocolParams
    return this
  }

  /**
   * Evaluate TX execution cost remotely
   * @param remoteTxEvaluate Evaluate TX execution cost remotely
   * @returns TxBuilder instance
   */
  withRemoteTxEvaluate = (remoteTxEvaluate: boolean) => {
    this.remoteTxEvaluate = remoteTxEvaluate
    return this
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
   * @returns TxBuilder instance
   */
  setCoinSelection = (strategy: -1 | 0 | 1 | 2 | 3) => {
    this.coinSelection = strategy
    return this
  }

  /**
   * Apply all methods and return TxFinalizer instance
   * @returns TxFinalizer instance
   */
  apply = async () => {
    // Check if change address is set
    if (!this.changeAddress) {
      throw new Error("Change address is required. Use setChangeAddress() method to set it")
    }

    // Initialize Transaction Builder
    if (!this.__txBuilder) {
      // Get Protocol Parameters (from local or remote)
      this.protocolParams = this.remoteProtocolParams
        ? await this.cw3.provider.getProtocolParameters()
        : this.cw3.__config.protocolParams
      this.__txBuilder = utils.tx.getTxBuilder(this.protocolParams)
      // Set Network ID
      this.__txBuilder.set_network_id(
        this.cw3.__config.network.type === "mainnet" ? CardanoLib.NetworkId.mainnet() : CardanoLib.NetworkId.testnet()
      )
      // Set default TTL
      this.__txBuilder.set_ttl(BigInt(utils.time.unixTimeToSlot(Date.now() + TTL * 1000, this.cw3.__config.slotConfig)))
    }

    // Execute queue tasks
    for (const task of this.queue) {
      await task()
    }

    // Set Collateral
    if (
      this.__txBuilder
        .build_for_evaluation(
          CardanoLib.ChangeSelectionAlgo.Default,
          CardanoLib.Address.from_bech32(this.changeAddress)
        )
        .build()
        .len() > 0
    ) {
      // TODO: Select up to maxCollateralInputs collaterals
      const collateral = [...this.inputs.values()].find((utxo) => utxo.value > 5_000_000)
      if (!collateral) throw new Error("Suitable collateral > 5 ADA not found")
      // Add Collateral
      this.__txBuilder.add_collateral(
        CardanoLib.SingleInputBuilder.from_transaction_unspent_output(utils.tx.utxoToCore(collateral)).payment_key()
      )
      // Add Collateral Return
      this.__txBuilder.set_collateral_return(
        CardanoLib.TransactionOutputBuilder.new()
          .with_address(CardanoLib.Address.from_bech32(this.changeAddress))
          .next()
          .with_value(utils.tx.assetsToValue(collateral.value - BigInt(3_000_000), collateral.assets))
          .build()
          .output()
      )
    }

    // Coin Selection
    if (this.coinSelection !== -1) this.__txBuilder.select_utxos(this.coinSelection)

    // Evaluate TX phase two execution cost and set ex_units
    const evaluation = this.__txBuilder.build_for_evaluation(
      CardanoLib.ChangeSelectionAlgo.Default,
      CardanoLib.Address.from_bech32(this.changeAddress)
    )
    if (evaluation.build().len() > 0) {
      if (!this.remoteTxEvaluate) {
        const costModels = utils.tx.createCostModels(this.protocolParams.costModels)
        const slotConfig = this.cw3.__config.slotConfig
        const allInputs = [...this.inputs.values(), ...this.readInputs.values(), ...this.collectInputs.values()]
        const uplcEvaluatedRedeemers = UPLC.evaluatePhaseTwoRaw(
          evaluation.draft_tx().to_cbor_bytes(),
          allInputs.map(
            (utxo) =>
              [
                utils.tx.utxoToTransactionInput(utxo).to_cbor_bytes(),
                utils.tx.utxoToTransactionOutput(utxo).to_cbor_bytes(),
              ] as const
          ),
          costModels.to_cbor_bytes(),
          [this.protocolParams.maxTxExSteps, this.protocolParams.maxTxExMem],
          [BigInt(slotConfig.zeroTime), BigInt(slotConfig.zeroSlot), BigInt(slotConfig.slotDuration)],
          this.protocolParams.protocolMajorVersion,
          true
        )
        for (const [redeemerBytes, result] of uplcEvaluatedRedeemers) {
          const redeemer = decodeCbor(redeemerBytes)
          if (
            redeemer.kind !== "array" ||
            redeemer.values[0]?.kind !== "unsigned" ||
            redeemer.values[1]?.kind !== "unsigned"
          ) {
            throw new Error("UPLC evaluator returned an invalid redeemer")
          }
          const key = CardanoLib.RedeemerWitnessKey.new(
            Number(redeemer.values[0].value) as CardanoLib.RedeemerTag,
            redeemer.values[1].value
          )
          this.__txBuilder.set_exunits(key, CardanoLib.ExUnits.new(result.cost.memory, result.cost.cpu))
        }
      } else {
        throw new Error("Remote TX evaluation is not supported yet")
      }
    }

    // Final calculations
    this.__txBuilder.add_change_if_needed(CardanoLib.Address.from_bech32(this.changeAddress), true)

    return this
  }

  /**
   * Apply all methods, build TX and return TxFinalizer instance
   * @returns TxFinalizer instance
   */
  applyAndBuild = async () => {
    await this.apply()
    return new TxFinalizer(
      this.cw3,
      this.__txBuilder
        .build(CardanoLib.ChangeSelectionAlgo.Default, CardanoLib.Address.from_bech32(this.changeAddress))
        .build_unchecked()
        .to_cbor_hex()
    )
  }
}
