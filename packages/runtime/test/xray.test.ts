import assert from "node:assert/strict"
import { describe, it } from "node:test"
import * as cardanoApplication from "@xray-network/xray-js/cardano"
import * as cardanoLib from "@xray-network/xray-js/cardano/lib"
import { createInMemoryProvider } from "@xray-network/xray-js/cardano/testing"
import * as cardanoBridge from "@xray-network/xray-js/mini-app-bridge/cardano"

describe("Cardano application entry", () => {
  it("creates isolated Cardano clients synchronously", () => {
    const provider = createInMemoryProvider()
    const first = cardanoApplication.createCardano({ network: "preview", provider })
    const second = cardanoApplication.createCardano({ network: "mainnet", provider: createInMemoryProvider() })

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
    assert.equal(typeof cardanoApplication.utilities.addresses.validateAddress, "function")
    assert.equal(typeof cardanoApplication.utilities.security.encryptWithPassword, "function")
    for (const retiredExport of ["addresses", "assets", "encoding", "governance", "keys", "scripts", "slots"]) {
      assert.equal(retiredExport in cardanoApplication, false)
    }
    assert.equal("cips" in cardanoApplication, false)
    assert.equal("plutus" in cardanoApplication, false)
    assert.equal("CardanoLib" in cardanoApplication, false)
    assert.equal("cip67" in cardanoApplication, false)

    assert.deepEqual(Object.keys(cardanoLib).sort(), ["chain", "cips", "core", "crypto", "plutus"])
    assert.equal(typeof cardanoLib.chain.Address.from_bech32, "function")
    assert.equal(typeof cardanoLib.crypto.PrivateKey.from_bech32, "function")
    assert.equal(typeof cardanoLib.core.bytesToHex, "function")
    assert.equal(typeof cardanoLib.cips.cip67.decode_asset_name_label, "function")
    assert.equal(typeof cardanoLib.plutus.data.Data.Integer, "function")
    assert.equal("cip129" in cardanoLib.cips, false)
  })
})

describe("Mini App Bridge Cardano contract", () => {
  it("exposes Cardano Bridge and CIP-30 from one subpath", () => {
    assert.equal(cardanoBridge.CARDANO_BRIDGE_PROTOCOL, "cardano.bridge")
    assert.equal(cardanoBridge.CARDANO_CIP30_PROTOCOL, "cardano.cip30")
    assert.equal(typeof cardanoBridge.cardanoHostMessageSchemas, "object")
    assert.equal(typeof cardanoBridge.cip30HostMessageSchemas, "object")
  })
})
