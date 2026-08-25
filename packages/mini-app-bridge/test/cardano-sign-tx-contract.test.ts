import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { cardanoCip30V1Contract } from "../src/adapters/cardano-cip30/v1/contract.js"
import { signTxResultSchema } from "../src/adapters/cardano/v1/contract.js"

describe("Cardano native signing result contract", () => {
  it("accepts exact complete-transaction success and error branches", () => {
    assert.deepEqual(signTxResultSchema.parse({ success: true, hash: "hash", cbor: "84a300" }), {
      success: true,
      hash: "hash",
      cbor: "84a300",
    })
    assert.deepEqual(signTxResultSchema.parse({ success: false, error: "Signing was rejected" }), {
      success: false,
      error: "Signing was rejected",
    })
  })

  it("rejects missing CBOR, the legacy empty-hash failure, and mixed branches", () => {
    const invalid = [
      { success: true, hash: "hash" },
      { success: true, hash: "hash", cbor: "" },
      { success: false, hash: "" },
      { success: false, error: "Signing was rejected", hash: "hash" },
      { success: true, hash: "hash", cbor: "84a300", error: "unexpected" },
    ]
    invalid.forEach((value) => assert.equal(signTxResultSchema.safeParse(value).success, false))
  })

  it("keeps CIP-30 signTx witness-only", () => {
    const cip30SignTxResult = cardanoCip30V1Contract.methods.signTx.result
    assert.equal(cip30SignTxResult.safeParse("a10081825820").success, true)
    assert.equal(cip30SignTxResult.safeParse({ success: true, hash: "hash", cbor: "84a300" }).success, false)
  })
})
