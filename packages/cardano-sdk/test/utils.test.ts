import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { CardanoLib, CardanoWeb3, CW3Types, UPLC, utils } from "@xray-network/xray-js-cardano"
import {
  ProvisionalGovernanceCredentialId,
  ProvisionalGovernanceCredentialRole,
} from "@xray-network/xray-cardano-lib-cip/cip129"
import { testData } from "./fixtures.js"

describe("Utils", async () => {
  const web3 = new CardanoWeb3({
    network: "preview",
  })

  describe("Keys", async () => {
    it("mnemonicGenerate(): 24 words", async () => {
      const mnemonic = utils.keys.mnemonicGenerate()
      assert.equal(mnemonic.split(" ").length, 24)
    })

    it("mnemonicGenerate(24): 24 Words", async () => {
      const mnemonic = utils.keys.mnemonicGenerate(24)
      assert.equal(mnemonic.split(" ").length, 24)
    })

    it("mnemonicGenerate(15): 15 Words", async () => {
      const mnemonic = utils.keys.mnemonicGenerate(15)
      assert.equal(mnemonic.split(" ").length, 15)
    })

    it("mnemonicGenerate(12): 12 Words", async () => {
      const mnemonic = utils.keys.mnemonicGenerate(12)
      assert.equal(mnemonic.split(" ").length, 12)
    })

    it("mnemonicToXprvKey()", async () => {
      const xprvKeyFromMnemonic = utils.keys.mnemonicToXprvKey(testData.mnemonic)
      assert.deepEqual(xprvKeyFromMnemonic, testData.xprvKey)
    })

    it("xprvKeyGenerate()", async () => {
      const xprvKeyGenerated = utils.keys.xprvKeyGenerate()
      assert.equal(xprvKeyGenerated.length, 165)
    })

    it("xprvKeyValidate()", async () => {
      const isValid = utils.keys.xprvKeyValidate(testData.xprvKey)
      assert.deepEqual(isValid, true)
    })

    it("xprvKeyToXpubKey(): AccountPath", async () => {
      const xpubKeyFromXprv = utils.keys.xprvKeyToXpubKey(testData.xprvKey, testData.accountPath)
      assert.deepEqual(xpubKeyFromXprv, testData.xpubKey)
    })

    it("xpubKeyValidate()", async () => {
      const isValid = utils.keys.xpubKeyValidate(testData.xpubKey)
      assert.deepEqual(isValid, true)
    })

    it("xvkKeyToXpubKey()", () => {
      const xvk = CardanoLib.encodeCardanoBip32PublicKey(
        CardanoLib.CardanoKeyRole.Account,
        CardanoLib.Bip32PublicKey.from_bech32(testData.xpubKey)
      )
      assert.equal(utils.keys.xvkKeyToXpubKey(xvk), testData.xpubKey)
    })

    it("PaymentAddress Verification Key", async () => {
      const paymentAddressVerificationKeyGenerated = utils.keys.xprvToVrfKey(
        testData.xprvKey,
        testData.accountPath,
        testData.addressPath
      )
      assert.deepEqual(paymentAddressVerificationKeyGenerated, testData.paymentAddressVerificationKey)
    })
  })

  describe("Address", async () => {
    it("deriveBase()", async () => {
      const addressGenerated = utils.address.deriveBase(
        testData.xpubKey,
        testData.addressPath,
        web3.__config.network.id
      )
      assert.deepEqual(addressGenerated, testData.paymentAddress)
    })

    it("deriveEnterprise()", async () => {
      const addressGenerated = utils.address.deriveEnterprise(
        testData.xpubKey,
        testData.addressPath,
        web3.__config.network.id
      )
      assert.deepEqual(addressGenerated, testData.paymentAddressEnterprise)
    })

    it("deriveStaking()", async () => {
      const addressGenerated = utils.address.deriveStaking(testData.xpubKey, web3.__config.network.id)
      assert.deepEqual(addressGenerated, testData.stakingAddress)
    })

    it("getStakingAddress()", async () => {
      const addressGenerated = utils.address.getStakingAddress(testData.paymentAddress)
      assert.deepEqual(addressGenerated, testData.stakingAddress)
    })

    it("getPublicCredentials(): from BaseAddress", async () => {
      const credGenerated = utils.address.getCredentials(testData.paymentAddress)
      assert.deepEqual(credGenerated.type, "base")
    })

    it("getPublicCredentials(): from EnterpriseAddress", async () => {
      const credGenerated = utils.address.getCredentials(testData.paymentAddressEnterprise)
      assert.deepEqual(credGenerated.type, "enterprise")
    })

    it("getPublicCredentials(): from StakingAddress", async () => {
      const credGenerated = utils.address.getCredentials(testData.stakingAddress)
      assert.deepEqual(credGenerated.type, "reward")
    })

    it("getShelleyOrByronAddress(): from ShelleyAddress", async () => {
      const address = utils.address.getShelleyOrByronAddress(testData.paymentAddress)
      assert.deepEqual(address.kind(), 0)
    })
    it("getShelleyOrByronAddress(): from ByronAddress", async () => {
      const address = utils.address.getShelleyOrByronAddress(
        "DdzFFzCqrhsqpATkVg8YFHXHiFqs58yt8HLaMrvmX6aFobzAtRbgURcq9EsRtwWZvkkFiRyFMcxuGUfR1QDoUqGwQrd6dtPMT6rgYXh3"
      )
      assert.deepEqual(address.kind(), 4)
    })
  })

  describe("Account", async () => {
    it("checksum()", async () => {
      const { checksumId: checksumIdGenerated, checksumImage: checksumImageGenerated } = utils.account.checksum(
        testData.xpubKey
      )
      assert.deepEqual(checksumIdGenerated, testData.checksumId)
      assert.deepEqual(checksumImageGenerated, testData.checksumImage)
    })

    it("getDetailsFromXpub()", async () => {
      const details = utils.account.getDetailsFromXpub(testData.xpubKey, testData.addressPath, web3.__config.network.id)
      assert.deepEqual(details.paymentAddress, testData.paymentAddress)
      assert.deepEqual(details.stakingAddress, testData.stakingAddress)
    })

    it("getBalanceFromUtxos()", async () => {
      const balanceGenerated = utils.account.getBalanceFromUtxos(testData.accountState.utxos)
      assert.deepEqual(balanceGenerated.value, testData.accountState.balance.value)
    })
  })

  describe("Asset", async () => {
    it("getFingerprint()", async () => {
      const fingerprint = "asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx"
      const policyId = "86abe45be4d8fb2e8f28e8047d17d0ba5592f2a6c8c452fc88c2c143"
      const assetName = "XRAY"
      const assetNameHex = utils.misc.fromStringToHex(assetName)
      const fingerprintGenerated = utils.asset.getFingerprint(policyId, assetNameHex)
      assert.deepEqual(fingerprintGenerated, fingerprint)
    })
  })

  describe("Governance", () => {
    it("decodes a strict CIP-129 DRep credential", () => {
      const credential = utils.governance.getDRepCredentials(
        "drep1yf4darz2mwutsy5j966e6unjrd4f4s56e8eh3hekzvq3grcrzn4ws"
      )
      assert.equal(credential.type, "key")
      assert.equal(credential.hash.length, 56)
    })

    it("rejects a governance identifier with the wrong role", () => {
      const committeeId = ProvisionalGovernanceCredentialId.from_credential(
        ProvisionalGovernanceCredentialRole.ConstitutionalCommitteeHot,
        CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_raw_bytes(new Uint8Array(28)))
      )
      assert.throws(() => utils.governance.getDRepCredentials(committeeId.to_bech32()), /not a DRep/)
    })
  })

  describe("Script", () => {
    it("normalizes every explicit Plutus envelope to double CBOR", () => {
      const raw = UPLC.encodeFlatProgram(UPLC.parseUplcText("(program 1.0.0 (con unit ()))"))
      const envelope = CardanoLib.SerializedPlutusScript.from_raw_flat(raw)
      const expected = utils.misc.toHex(envelope.to_double_cbor())

      for (const script of [raw, envelope.to_single_cbor(), envelope.to_double_cbor()]) {
        assert.equal(utils.script.applyDoubleCborEncoding(utils.misc.toHex(script)), expected)
      }
    })

    it("uses the same ledger hash for every Plutus envelope", () => {
      const raw = UPLC.encodeFlatProgram(UPLC.parseUplcText("(program 1.0.0 (con unit ()))"))
      const envelope = CardanoLib.SerializedPlutusScript.from_raw_flat(raw)
      const hashes = [raw, envelope.to_single_cbor(), envelope.to_double_cbor()].map((script) =>
        utils.script.scriptToScriptHash({ language: "PlutusV2", script: utils.misc.toHex(script) })
      )
      assert.equal(new Set(hashes).size, 1)
    })
  })

  describe("Transaction", () => {
    const ownedUtxo = () => ({
      ...testData.accountState.utxos[0],
      address: testData.paymentAddress,
      assets: [] as CW3Types.Asset[],
    })

    it("discovers and signs the account witness from builder-resolved inputs", async () => {
      const account = web3.account.fromXprvKey(testData.xprvKey)
      const finalizer = await web3
        .createTx()
        .setChangeAddress(testData.paymentAddress)
        .addOutputs([{ address: testData.paymentAddress, value: 2_000_000n }])
        .addInputs([ownedUtxo()])
        .applyAndBuild()
      const unsigned = finalizer.__tx.to_cbor_hex()
      const signed = await finalizer.signWithAccount(account, []).applyAndToJson()

      assert.notEqual(signed.tx, unsigned)
      assert.equal(signed.hash.length, 64)
    })

    it("emits the Conway certificate variants for DRep operations", async () => {
      const certificateKind = async (operation: (builder: ReturnType<CardanoWeb3["createTx"]>) => void) => {
        const builder = web3.createTx().setChangeAddress(testData.paymentAddress)
        operation(builder)
        const finalizer = await builder.addInputs([ownedUtxo()]).applyAndBuild()
        const fields = finalizer.__tx.body().to_js_value() as Array<{ k: number; v: unknown }>
        const certificates = fields.find(({ k }) => k === 4)?.v as { value: Array<[number, ...unknown[]]> } | undefined
        return certificates?.value[0]?.[0]
      }

      assert.equal(
        await certificateKind((builder) => {
          builder.governance.delegateToDRep(testData.stakingAddress, "AlwaysAbstain")
        }),
        9
      )
      assert.equal(
        await certificateKind((builder) => {
          builder.governance.registerDRep(testData.stakingAddress)
        }),
        16
      )
      assert.equal(
        await certificateKind((builder) => {
          builder.governance.deregisterDRep(testData.stakingAddress)
        }),
        17
      )
      assert.equal(
        await certificateKind((builder) => {
          builder.governance.updateDRep(testData.stakingAddress)
        }),
        18
      )
    })
  })

  describe("Time", async () => {
    it("Roundtrip unixTimeToSlot() slotToUnixTime()", async () => {
      const unixTime = Date.now()
      const slot = utils.time.unixTimeToSlot(unixTime, web3.__config.slotConfig)
      const unixTimeGenerated = utils.time.slotToUnixTime(slot, web3.__config.slotConfig)
      assert.deepEqual(unixTimeGenerated, Math.floor(unixTime / 1000) * 1000)
    })
  })

  describe("Misc", async () => {
    it("Roundtrip fromHex() toHex()", async () => {
      const hex = "48656c6c6f2c20576f726c6421"
      const hexDecoded = utils.misc.toHex(utils.misc.fromHex(hex))
      assert.deepEqual(hexDecoded, hex)
    })

    it("fromStringToHex()", async () => {
      const string = "Hello, World!"
      const hex = "48656c6c6f2c20576f726c6421"
      const hexEncoded = utils.misc.fromStringToHex(string)
      assert.deepEqual(hexEncoded, hex)
    })

    it("fromHexToString()", async () => {
      const string = "Hello, World!"
      const hex = "48656c6c6f2c20576f726c6421"
      const stringEncoded = utils.misc.toStringFromHex(hex)
      assert.deepEqual(stringEncoded, string)
    })

    it("Roundtrip encryptDataWithPass() decryptDataWithPass()", async () => {
      const message = "Hello, World!"
      const encryptedData = utils.misc.encryptDataWithPass(message, "password123")
      const decrypterData = utils.misc.decryptDataWithPass(encryptedData, "password123")
      assert.deepEqual(decrypterData, message)
    })

    it("randomBytes()", async () => {
      const randomBytes = utils.misc.randomBytes(8)
      assert.ok(randomBytes instanceof Uint8Array)
    })
  })
})
