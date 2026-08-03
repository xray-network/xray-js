import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { CardanoWeb3, utils } from "@xray-network/xray-js-cardano"
import { testData } from "./fixtures.js"

describe("Account", async () => {
  const web3 = new CardanoWeb3()

  it("FromMnemonic", async () => {
    const mnemonicGenerated = utils.keys.mnemonicGenerate()
    const account = web3.account.fromMnemonic(mnemonicGenerated)
    assert.equal(account.__config.xpubKey.length, 114)
  })

  it("FromXprvKey", async () => {
    const xprvKeyGenerated = utils.keys.xprvKeyGenerate()
    const account = web3.account.fromXprvKey(xprvKeyGenerated)
    assert.equal(account.__config.xpubKey.length, 114)
  })

  it("FromXprvKeyEncoded", async () => {
    const xprvKeyGenerated = utils.keys.xprvKeyGenerate()
    const account = web3.account.fromXprvKey(xprvKeyGenerated, "123456")
    const encodedXprvKey = account.__config.xprvKey
    const decodedXprvKey = account.getDecodedXprvKey("123456")
    assert.equal(xprvKeyGenerated, decodedXprvKey)
  })

  it("FromXpubKey", async () => {
    const account = web3.account.fromXpubKey(testData.xpubKey)
    assert.equal(account.__config.xpubKey.length, 114)
  })

  it("EncodeXprvKey", async () => {
    const account = web3.account.fromXprvKey(testData.xprvKey)
    const encodedXprvKey = account.getEncodedXprvKey("password123")
    assert.equal(encodedXprvKey.length, 450)
  })
})
