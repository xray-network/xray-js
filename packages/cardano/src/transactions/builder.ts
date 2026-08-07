import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"
import { AnchorDocHash, ScriptHash } from "@xray-network/xray-cardano-lib-crypto"
import * as UPLC from "@xray-network/xray-cardano-lib-plutus"
import type { CardanoContext } from "../internal/context.js"
import * as addresses from "../primitives/address.js"
import * as governancePrimitives from "../primitives/governance.js"
import * as encoding from "../primitives/misc.js"
import * as scriptsPrimitives from "../primitives/script.js"
import * as time from "../primitives/time.js"
import * as transactionPrimitives from "../primitives/tx.js"
import type * as CardanoTypes from "../types.js"
import { unsignedTransactionFromCbor, type UnsignedTransaction } from "./transaction.js"
import type { TransactionOperation } from "./plan.js"

export const buildTransaction = async (
  client: CardanoContext,
  operations: readonly TransactionOperation[]
): Promise<UnsignedTransaction> => {
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

  const utxoKey = (utxo: CardanoTypes.Utxo) => `${utxo.index}@${utxo.transaction.id}`
  const createPlutusWitness = (script: CardanoTypes.Script, redeemer?: string) => {
    if (!redeemer) {
      throw new Error("Redeemer is required for Plutus scripts. Use Data.void() if the script has no redeemer")
    }
    return createPlutusWitness(script, redeemer)
  }
  const initializeBuilder = () => {
    const builder = transactionPrimitives.getTransactionBuilder(protocolParameters)
    builder.set_network_id(
      client.network.type === "mainnet" ? CardanoLib.NetworkId.mainnet() : CardanoLib.NetworkId.testnet()
    )
    builder.set_ttl(BigInt(time.unixTimeToSlot(Date.now() + client.transactionTtlSeconds * 1000, client.slotConfig)))
    return builder
  }
  const attachScript = (script: CardanoTypes.Script) => {
    const scriptHash = scriptsPrimitives.scriptToScriptHash(script)
    scripts.set(scriptHash, script)
    return
  }
  const readFrom = (utxos: readonly CardanoTypes.Utxo[]) => {
    queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await client.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        if (utxo.script && utxo.scriptHash) {
          scripts.set(utxo.scriptHash, utxo.script)
        }
        readInputs.set(utxoKey(utxo), utxo)
        const input = transactionPrimitives.utxoToCore(utxo)
        transactionBuilder.add_reference_input(input)
      }
    })
    return
  }
  const spendFromScript = (utxos: readonly CardanoTypes.Utxo[], redeemer?: string) => {
    queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await client.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        const { paymentCred } = addresses.getCredentials(utxo.address)
        if (!paymentCred) throw new Error("Script input address has no payment credential")
        const script = scripts.get(paymentCred.hash)
        if (!script) {
          throw new Error(
            "Script is required for spendFromScript() method. Attach script with attachScript() or readFrom() method"
          )
        }
        collectInputs.set(utxoKey(utxo), utxo)
        const coreUtxo = transactionPrimitives.utxoToCore(utxo)
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
            transactionBuilder.add_input(
              inputBuilder.plutus_script(
                createPlutusWitness(script, redeemer),
                CardanoLib.RequiredSigners.new(),
                CardanoLib.PlutusData.from_cbor_hex(utxo.datum!)
              )
            )
            break
          case "PlutusV2":
          case "PlutusV3":
            transactionBuilder.add_input(
              inputBuilder.plutus_script_inline_datum(
                createPlutusWitness(script, redeemer),
                CardanoLib.RequiredSigners.new()
              )
            )
            break
        }
      }
    })
    return
  }
  const spend = (utxos: readonly CardanoTypes.Utxo[]) => {
    queue.push(async () => {
      for (const utxo of utxos) {
        inputs.set(utxoKey(utxo), utxo)
        const coreUtxo = transactionPrimitives.utxoToCore(utxo)
        const inputBuilder = CardanoLib.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        transactionBuilder.add_input(inputBuilder.payment_key())
      }
    })
    return
  }
  const addOutput = (output: CardanoTypes.Output, datum?: CardanoTypes.DatumOutput, script?: CardanoTypes.Script) => {
    queue.push(async () => {
      const outputBuilder = transactionPrimitives.outputToTransactionOutputBuilder(output, datum, script)
      const value = output.value ?? 0n
      const cardanoValue = transactionPrimitives.assetsToValue(value, output.assets)
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
    return
  }
  const payToContract = (
    output: CardanoTypes.Output,
    datum: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ) => {
    const { paymentCred } = addresses.getCredentials(output.address)
    if (!paymentCred || paymentCred.type !== "script") {
      throw new Error("Invalid address for contract")
    }
    addOutput(output, datum, script)
    return
  }
  const payTo = (
    outputs: readonly CardanoTypes.Output[],
    datum?: CardanoTypes.DatumOutput,
    script?: CardanoTypes.Script
  ) => {
    for (const output of outputs) {
      addOutput(output, datum, script)
    }
    return
  }
  const validFrom = (unixTime: number) => {
    queue.push(async () => {
      const slot = time.unixTimeToSlot(unixTime, client.slotConfig)
      transactionBuilder.set_validity_start_interval(BigInt(slot))
    })
    return
  }
  const validUntil = (unixTime: number) => {
    queue.push(async () => {
      const slot = time.unixTimeToSlot(unixTime, client.slotConfig)
      transactionBuilder.set_ttl(BigInt(slot))
    })
    return
  }
  const validForSlots = (slotsOffset: number) => {
    queue.push(async () => {
      const slot = time.unixTimeToSlot(Date.now() + slotsOffset * 1000, client.slotConfig)
      transactionBuilder.set_ttl(BigInt(slot))
    })
    return
  }
  const setChangeAddress = (address: string) => {
    changeAddress = address
    return
  }
  const requireSigner = (address: string) => {
    queue.push(() => {
      const { paymentCred, stakingCred, type } = addresses.getCredentials(address)
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
    return
  }
  const requireSignerKeyHash = (keyHash: string) => {
    queue.push(() => {
      transactionBuilder.add_required_signer(CardanoLib.Ed25519KeyHash.from_hex(keyHash))
    })
    return
  }
  const mint = (assets: readonly CardanoTypes.Asset[], redeemer?: string) => {
    queue.push(async () => {
      const policyId = assets[0].policyId
      const mintAssets = CardanoLib.MapAssetNameToNonZeroInt64.new()
      for (const asset of assets) {
        if (asset.policyId !== policyId) throw new Error("All assets must have the same policyId")
        mintAssets.insert(CardanoLib.AssetName.from_raw_bytes(encoding.fromHex(asset.assetName || "")), asset.quantity)
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
          transactionBuilder.add_mint(
            mintBuilder.plutus_script(createPlutusWitness(script, redeemer), CardanoLib.RequiredSigners.new())
          )
          break
      }
    })
    return
  }
  const metadataText = (label: number, metadata: CardanoTypes.JsonValue) => {
    queue.push(async () => {
      const metadatum = CardanoLib.TransactionMetadatum.new_text(JSON.stringify(metadata))
      const metadataBuilder = CardanoLib.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = CardanoLib.AuxiliaryData.new(metadataBuilder)
      transactionBuilder.add_auxiliary_data(aux)
    })
    return
  }
  const metadataJson = (label: number, metadata: CardanoTypes.JsonValue, conversion: 0 | 1 | 2 = 0) => {
    queue.push(async () => {
      const metadatum = CardanoLib.encode_json_str_to_metadatum(JSON.stringify(metadata), conversion)
      const metadataBuilder = CardanoLib.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = CardanoLib.AuxiliaryData.new(metadataBuilder)
      transactionBuilder.add_auxiliary_data(aux)
    })
    return
  }

  const stake: {
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) => void
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) => void
    register: (rewardAddress: string) => void
    deregister: (rewardAddress: string, redeemer?: string) => void
  } = {
    withdrawRewards: (rewardAddress: string, amount: bigint, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
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
                transactionBuilder.add_withdrawal(
                  withdrawBuilder.plutus_script(createPlutusWitness(script, redeemer), CardanoLib.RequiredSigners.new())
                )
                break
            }
            break
          }
        }
      })
      return
    },
    delegateTo: (rewardAddress: string, poolId: string, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
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
            const credential = CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
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
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    createPlutusWitness(script, redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
            break
          }
        }
      })
      return
    },
    register: (rewardAddress: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
        const credential =
          stakingCred.type === "key"
            ? CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakingCred.hash))
            : CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
        const certificateBuilder = CardanoLib.SingleCertificateBuilder.new(
          CardanoLib.Certificate.new_stake_registration(CardanoLib.StakeRegistration.new(credential))
        )
        transactionBuilder.add_cert(certificateBuilder.skip_witness())
      })
      return
    },
    deregister: (rewardAddress: string, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
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
            const credential = CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
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
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    createPlutusWitness(script, redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return
    },
  }
  const governance: {
    delegateToDRep: (rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string) => void
    registerDRep: (rewardAddress: string, drepInfo?: CardanoTypes.DrepAnchor, redeemer?: string) => void
    deregisterDRep: (rewardAddress: string, redeemer?: string) => void
    updateDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => void
  } = {
    delegateToDRep: (rewardAddress: string, drep: CardanoTypes.DRep, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")
        const drepInstance = governancePrimitives.toDRep(drep)

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
            const credential = CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
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
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    createPlutusWitness(script, redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return
    },

    registerDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")
        const drepAnchorInstance = drepAnchor
          ? CardanoLib.Anchor.new(CardanoLib.Url.new(drepAnchor.url), AnchorDocHash.from_hex(drepAnchor.dataHash))
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
            const credential = CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
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
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    createPlutusWitness(script, redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return
    },

    deregisterDRep: (rewardAddress: string, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
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
            const credential = CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
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
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    createPlutusWitness(script, redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return
    },

    updateDRep: (rewardAddress: string, drepAnchor?: CardanoTypes.DrepAnchor, redeemer?: string) => {
      queue.push(async () => {
        const { stakingCred } = addresses.getCredentials(rewardAddress)
        if (!stakingCred) throw new Error("Invalid governance address: no staking credential")
        const drepAnchorInstance = drepAnchor
          ? CardanoLib.Anchor.new(CardanoLib.Url.new(drepAnchor.url), AnchorDocHash.from_hex(drepAnchor.dataHash))
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
            const credential = CardanoLib.Credential.new_script(ScriptHash.from_hex(stakingCred.hash))
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
                transactionBuilder.add_cert(
                  certificateBuilder.plutus_script(
                    createPlutusWitness(script, redeemer),
                    CardanoLib.RequiredSigners.new()
                  )
                )
                break
            }
          }
        }
      })
      return
    },
  }
  const evaluation = (mode: "local" | "remote") => {
    evaluationMode = mode
    return
  }
  const coinSelection = (strategy: CardanoTypes.CoinSelectionStrategy) => {
    coinSelectionStrategy = strategy
    return
  }
  const applyOperations = async () => {
    if (!changeAddress) {
      throw new Error("Change address is required. Use setChangeAddress() method to set it")
    }

    if (!transactionBuilder) {
      protocolParameters = await client.getProtocolParameters()
      transactionBuilder = initializeBuilder()
    }

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
          transactionPrimitives.utxoToCore(collateral)
        ).payment_key()
      )
      transactionBuilder.set_collateral_return(
        CardanoLib.TransactionOutputBuilder.new()
          .with_address(CardanoLib.Address.from_bech32(changeAddress))
          .next()
          .with_value(transactionPrimitives.assetsToValue(collateral.value - BigInt(3_000_000), collateral.assets))
          .build()
          .output()
      )
    }
    addCollateral()

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
        const costModels = transactionPrimitives.createCostModels(protocolParameters.costModels)
        const slotConfig = client.slotConfig
        const allInputs = [...inputs.values(), ...readInputs.values(), ...collectInputs.values()]
        const uplcEvaluatedRedeemers = UPLC.evaluatePhaseTwo(
          evaluation.draft_tx(),
          allInputs.map(transactionPrimitives.utxoToCore),
          costModels,
          [protocolParameters.maxTxExSteps, protocolParameters.maxTxExMem],
          [BigInt(slotConfig.zeroTime), BigInt(slotConfig.zeroSlot), BigInt(slotConfig.slotDuration)],
          protocolParameters.protocolMajorVersion,
          true
        )
        // Evaluation adds draft change to the low-level builder. Rebuild from the
        // operation queue before applying execution units so final build owns change calculation.
        transactionBuilder = initializeBuilder()
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

    return
  }
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

  for (const operation of operations) {
    switch (operation.kind) {
      case "attach-script":
        attachScript(operation.script)
        break
      case "read-from":
        readFrom(operation.utxos)
        break
      case "spend-from-script":
        spendFromScript(operation.utxos, operation.redeemer)
        break
      case "spend":
        spend(operation.utxos)
        break
      case "pay-to-contract":
        payToContract(operation.output, operation.datum, operation.script)
        break
      case "pay-to":
        payTo(operation.outputs, operation.datum, operation.script)
        break
      case "valid-from":
        validFrom(operation.unixTime)
        break
      case "valid-until":
        validUntil(operation.unixTime)
        break
      case "valid-for-slots":
        validForSlots(operation.slotsOffset)
        break
      case "set-change-address":
        setChangeAddress(operation.address)
        break
      case "require-signer":
        requireSigner(operation.address)
        break
      case "require-signer-key-hash":
        requireSignerKeyHash(operation.keyHash)
        break
      case "mint":
        mint(operation.assets, operation.redeemer)
        break
      case "metadata-text":
        metadataText(operation.label, operation.metadata)
        break
      case "metadata-json":
        metadataJson(operation.label, operation.metadata, operation.conversion)
        break
      case "withdraw-rewards":
        stake.withdrawRewards(operation.rewardAddress, operation.amount, operation.redeemer)
        break
      case "delegate-stake":
        stake.delegateTo(operation.rewardAddress, operation.poolId, operation.redeemer)
        break
      case "register-stake":
        stake.register(operation.rewardAddress)
        break
      case "deregister-stake":
        stake.deregister(operation.rewardAddress, operation.redeemer)
        break
      case "delegate-drep":
        governance.delegateToDRep(operation.rewardAddress, operation.drep, operation.redeemer)
        break
      case "register-drep":
        governance.registerDRep(operation.rewardAddress, operation.anchor, operation.redeemer)
        break
      case "deregister-drep":
        governance.deregisterDRep(operation.rewardAddress, operation.redeemer)
        break
      case "update-drep":
        governance.updateDRep(operation.rewardAddress, operation.anchor, operation.redeemer)
        break
      case "evaluation":
        evaluation(operation.mode)
        break
      case "coin-selection":
        coinSelection(operation.strategy)
        break
      default: {
        const exhaustive: never = operation
        return exhaustive
      }
    }
  }

  return build()
}
