import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createCardano, addresses, scripts, slots } from "@xray-network/xray-js-cardano"
import { createInMemoryProvider } from "@xray-network/xray-js-cardano/testing"
import { ownedUtxo, testData } from "./fixtures.js"

const setup = () => {
  const provider = createInMemoryProvider({ utxos: [ownedUtxo] })
  const cardano = createCardano({ network: "preview", provider })
  const account = cardano.accounts.fromPrivateKey(testData.xprvKey)
  return { provider, cardano, account }
}

describe("Cardano transactions", () => {
  it("builds, signs, serializes, and submits payments", async () => {
    const { provider, cardano, account } = setup()
    const emptyPlan = cardano.transactions.create()
    const paymentPlan = emptyPlan
      .setChangeAddress(account.paymentAddress)
      .payTo([{ address: testData.paymentAddressEnterprise, value: 2_000_000n }])
      .spend([ownedUtxo])
    assert.notEqual(emptyPlan, paymentPlan)
    assert.equal(Object.isFrozen(emptyPlan), true)
    const unsigned = await paymentPlan.build()

    const signed = await cardano.transactions.sign(unsigned, account)
    const locallySigned = cardano.transactions.signWithPrivateKey(unsigned, account.getPrivateKey())
    assert.equal(signed.hash.length, 64)
    assert.equal(locallySigned.kind, "signed")
    assert.equal(typeof signed.cbor, "string")
    assert.ok(signed.json)
    assert.equal(await cardano.transactions.submit(signed), "submitted-1")
    assert.equal(provider.submittedTransactions.length, 1)
  })

  it("builds staking and governance certificates", async () => {
    const { cardano, account } = setup()
    const stakingAddress = account.stakingAddress
    assert.ok(stakingAddress)
    const unsigned = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .stake.register(stakingAddress)
      .governance.delegateToDRep(stakingAddress, "AlwaysAbstain")
      .spend([ownedUtxo])
      .build()
    assert.equal((await cardano.transactions.sign(unsigned, account)).hash.length, 64)
  })

  it("retains native minting and validity operations", async () => {
    const { cardano, account } = setup()
    const paymentCredential = addresses.getCredentials(account.paymentAddress).paymentCred
    assert.ok(paymentCredential)
    const native = scripts.nativeScriptFromJson({ type: "sig", keyHash: paymentCredential.hash })
    const mintedAsset = { policyId: native.policyId, assetName: "58524159", quantity: 1n }
    const unsigned = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .attachScript(native.script)
      .spend([ownedUtxo])
      .payTo([{ address: account.paymentAddress, value: 2_000_000n, assets: [mintedAsset] }])
      .mint([mintedAsset])
      .validFrom(Date.now() - 1_000)
      .validUntil(Date.now() + 60_000)
      .build()
    assert.equal(typeof unsigned.cbor, "string")
    assert.equal(
      slots.slotToUnixTime(slots.unixTimeToSlot(Date.now(), cardano.slotConfig), cardano.slotConfig) > 0,
      true
    )
  })
})
