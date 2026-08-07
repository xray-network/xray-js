import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createInMemoryProvider, createProviderResolvers, pollUntil } from "@xray-network/xray-js-cardano/testing"
import type { types } from "@xray-network/xray-js-cardano"

const unresolvedUtxo: types.Utxo = {
  transaction: { id: "1".repeat(64) },
  index: 0,
  address: "addr_test1_provider",
  value: 2_000_000n,
  assets: [],
  datumHash: "datum-hash",
  datumType: "hash",
  scriptHash: "script-hash",
  datum: null,
  script: null,
}

describe("provider utilities", () => {
  it("shares address and datum/script resolution", async () => {
    const script: types.Script = { language: "PlutusV2", script: "5900" }
    const provider = createInMemoryProvider({
      utxos: [unresolvedUtxo],
      datums: { "datum-hash": "d87980" },
      scripts: { "script-hash": script },
    })

    assert.deepEqual(await provider.getUtxosByAddress(unresolvedUtxo.address), [unresolvedUtxo])
    assert.deepEqual(await provider.resolveUtxoDatumAndScript(unresolvedUtxo), {
      ...unresolvedUtxo,
      datum: "d87980",
      script,
    })
    const alreadyResolved = { ...unresolvedUtxo, datum: "existing", script }
    assert.deepEqual(await provider.resolveUtxoDatumAndScript(alreadyResolved), alreadyResolved)

    const resolvers = createProviderResolvers({
      getUtxosByAddresses: provider.getUtxosByAddresses,
      getDatumByHash: provider.getDatumByHash,
      getScriptByHash: provider.getScriptByHash,
    })
    assert.equal((await resolvers.resolveUtxosDatumAndScript([unresolvedUtxo]))[0]?.datum, "d87980")
  })

  it("polls immediately, succeeds later, and respects the timeout", async () => {
    let attempts = 0
    assert.equal(
      await pollUntil(
        async () => {
          attempts += 1
          return attempts === 2
        },
        1,
        50
      ),
      true
    )
    assert.equal(attempts, 2)
    assert.equal(await pollUntil(async () => false, 1, 5), false)
  })
})
