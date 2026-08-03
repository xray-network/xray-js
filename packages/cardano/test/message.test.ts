import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createCardano } from "@xray-network/xray-js-cardano"
import { createInMemoryProvider } from "@xray-network/xray-js-cardano/testing"
import { testData } from "./fixtures.js"

describe("Cardano messages", () => {
  it("signs and verifies CIP-8 messages", async () => {
    const cardano = createCardano({ network: "preview", provider: createInMemoryProvider() })
    const account = cardano.accounts.fromPrivateKey(testData.xprvKey)
    const message = "Hello from XRAY"
    const signed = await cardano.messages.sign(account, message)
    const locallySigned = cardano.messages.signWithPrivateKey(account.getPrivateKey(), account.paymentAddress, message)
    assert.equal(cardano.messages.verify(account.paymentAddress, message, signed), true)
    assert.equal(cardano.messages.verify(account.paymentAddress, message, locallySigned), true)
  })
})
