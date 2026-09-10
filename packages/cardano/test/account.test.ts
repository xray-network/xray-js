import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createCardano, utilities } from "@xray-network/xray-js-cardano"
import { createInMemoryProvider } from "@xray-network/xray-js-cardano/testing"
import { ownedUtxo, testData } from "./fixtures.js"

describe("Cardano accounts", () => {
  it("creates, encrypts, exports, and imports private-key accounts", async () => {
    const cardano = createCardano({
      network: "preview",
      provider: createInMemoryProvider({ utxos: [ownedUtxo] }),
    })
    const mnemonic = utilities.keys.mnemonicGenerate()
    const generated = cardano.accounts.fromMnemonic(mnemonic)
    assert.equal(generated.publicKey?.length, 114)

    const account = cardano.accounts.fromPrivateKey(testData.xprvKey, "password")
    assert.equal(account.paymentAddress, testData.paymentAddress)
    assert.equal(account.decryptPrivateKey("password"), testData.xprvKey)
    assert.equal(cardano.accounts.import(account.export()).paymentAddress, account.paymentAddress)
    assert.equal((await account.getState()).utxos.length, 1)
  })

  it("creates public and watch-only accounts without signing capability", async () => {
    const cardano = createCardano({ network: "preview", provider: createInMemoryProvider() })
    const publicAccount = cardano.accounts.fromPublicKey(testData.xpubKey)
    const watchOnly = cardano.accounts.fromAddress(testData.paymentAddress)
    assert.equal(publicAccount.publicKey, testData.xpubKey)
    assert.throws(() => watchOnly.getPrivateKey(), /no private signing material/)
  })
})
