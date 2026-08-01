import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { CardanoWeb3, utils } from "@xray-network/xray-js-cardano"
import { testData } from "./__test.js"

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
