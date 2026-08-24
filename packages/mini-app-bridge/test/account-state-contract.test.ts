import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { accountStateSchema } from "../src/adapters/cardano/v1/contract.js"

const identity = {
  paymentAddress: "addr1_payment",
  stakingAddress: "stake1_staking",
}
const state = {
  utxos: [],
  balance: { value: 1_000_000n, assets: [] },
}

describe("Cardano account-state readiness contract", () => {
  it("accepts null and each valid discriminated branch", () => {
    assert.equal(accountStateSchema.safeParse(null).success, true)
    assert.equal(
      accountStateSchema.safeParse({
        ...identity,
        balanceStatus: "initializing",
        state: null,
        delegation: null,
      }).success,
      true
    )
    assert.equal(
      accountStateSchema.safeParse({
        ...identity,
        balanceStatus: "ready",
        state,
        delegation: null,
      }).success,
      true
    )
    assert.equal(
      accountStateSchema.safeParse({
        ...identity,
        balanceStatus: "error",
        state: null,
        delegation: null,
      }).success,
      true
    )
  })

  it("rejects missing, unknown, and mismatched status/data combinations", () => {
    const invalid = [
      { ...identity, state: null, delegation: null },
      { ...identity, balanceStatus: "unknown", state: null, delegation: null },
      { ...identity, balanceStatus: "ready", state: null, delegation: null },
      { ...identity, balanceStatus: "initializing", state, delegation: null },
      { ...identity, balanceStatus: "error", state: null, delegation: { delegation: null, rewards: 0n } },
    ]
    invalid.forEach((value) => assert.equal(accountStateSchema.safeParse(value).success, false))
  })
})
