import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { cardanoCip30V1Contract } from "../src/adapters/cip30.js"
import { signTxResultSchema } from "../src/adapters/cardano.js"

describe("Cardano native signing result contract", () => {
  it("accepts the complete transaction and its witness set", () => {
    assert.deepEqual(signTxResultSchema.parse({ hash: "hash", cbor: "84a300", witnessSet: "a10081825820" }), {
      hash: "hash",
      cbor: "84a300",
      witnessSet: "a10081825820",
    })
  })

  it("rejects incomplete results, the legacy empty-hash failure, and mixed branches", () => {
    const invalid = [
      { hash: "hash" },
      { hash: "hash", cbor: "84a300" },
      { hash: "hash", cbor: "", witnessSet: "a100" },
      { success: false, hash: "" },
      { success: false, error: "Signing was rejected", hash: "hash" },
      { hash: "hash", cbor: "84a300", witnessSet: "a100", error: "unexpected" },
    ]
    invalid.forEach((value) => assert.equal(signTxResultSchema.safeParse(value).success, false))
  })

  it("keeps CIP-30 signTx witness-only", () => {
    const cip30SignTxResult = cardanoCip30V1Contract.methods.signTx.result
    assert.equal(cip30SignTxResult.safeParse("a10081825820").success, true)
    assert.equal(cip30SignTxResult.safeParse({ hash: "hash", cbor: "84a300", witnessSet: "a100" }).success, false)
  })
})
