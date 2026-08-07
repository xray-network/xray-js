import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { XRAY } from "@xray-network/xray-js"
import * as cardanoApplication from "@xray-network/xray-js/cardano"
import * as cardanoLib from "@xray-network/xray-js/cardano/lib"
import { createInMemoryProvider } from "@xray-network/xray-js/cardano/testing"

describe("XRAY facade", () => {
  it("is immutable and creates isolated Cardano clients synchronously", () => {
    const provider = createInMemoryProvider()
    const first = XRAY.cardano.create({ network: "preview", provider })
    const second = XRAY.cardano.create({ network: "mainnet", provider: createInMemoryProvider() })

    assert.equal(Object.isFrozen(XRAY), true)
    assert.equal(Object.isFrozen(XRAY.cardano), true)
    assert.notEqual(first, second)
    assert.equal(first.network.name, "preview")
    assert.equal(second.network.name, "mainnet")
    assert.equal(provider.protocolParameterRequests, 0)
  })
})

describe("Cardano package boundaries", () => {
  it("exposes grouped application and low-level namespaces without retired aliases", () => {
    assert.equal(typeof cardanoApplication.createCardano, "function")
    assert.equal(typeof cardanoApplication.wallets.cip30.connectCip30Wallet, "function")
    assert.equal(typeof cardanoApplication.transactions.assetsToValue, "function")
    assert.equal(typeof cardanoApplication.providers.koios.Client, "function")
    assert.equal(typeof cardanoApplication.cips.cip67.decode_asset_name_label, "function")
    assert.equal(typeof cardanoApplication.plutus.data.Data.Integer, "function")
    assert.equal("cip129" in cardanoApplication.cips, false)
    assert.equal("CardanoLib" in cardanoApplication, false)
    assert.equal("cip67" in cardanoApplication, false)

    assert.deepEqual(Object.keys(cardanoLib).sort(), ["chain", "cips", "core", "crypto", "plutus"])
    assert.equal(typeof cardanoLib.chain.Address.from_bech32, "function")
    assert.equal(typeof cardanoLib.crypto.PrivateKey.from_bech32, "function")
    assert.equal(typeof cardanoLib.core.bytesToHex, "function")
  })
})
