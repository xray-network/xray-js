import assert from "node:assert/strict"
import { describe, it } from "node:test"
import * as cips from "@xray-network/xray-cardano-lib-cip"
import * as plutus from "@xray-network/xray-cardano-lib-plutus"
import { accounts, providers, utilities } from "@xray-network/xray-js-cardano"
import { testData } from "./fixtures.js"

describe("Cardano utilities", () => {
  it("derives keys, addresses, checksums, assets, and encoding", () => {
    assert.equal(utilities.keys.xprvKeyToXpubKey(testData.xprvKey, testData.accountPath), testData.xpubKey)
    assert.equal(utilities.addresses.deriveBase(testData.xpubKey, testData.addressPath, 0), testData.paymentAddress)
    assert.equal(accounts.checksum(testData.xpubKey).checksumId, testData.checksumId)
    assert.equal(utilities.encoding.toStringFromHex(utilities.encoding.fromStringToHex("XRAY")), "XRAY")
    assert.match(
      utilities.assets.getFingerprint("8bca871dcd8d901d02677b6d2413fd19e4c8febfc353edff".padEnd(56, "0")),
      /^asset1/
    )
  })

  it("keeps Cardano Lib protocols separate from generated client domains", () => {
    assert.equal(typeof cips.cip8.CIP8Message.signData, "function")
    assert.equal(typeof cips.cip8.CIP8Message.verifyData, "function")
    assert.equal(typeof plutus.uplc.evaluateProgram, "function")
    assert.equal(typeof providers.koios.Client, "function")
    assert.equal(typeof providers.kupo.Client, "function")
    assert.equal(typeof providers.nftcdn.Client, "function")
    assert.equal(typeof providers.ogmios.Client, "function")
  })

  it("exposes the focused cardano-lib CIP-67 codec", () => {
    const label = cips.cip67.encode_asset_name_label(222)
    assert.equal(utilities.encoding.toHex(label), "000de140")
    assert.equal(cips.cip67.decode_asset_name_label(label), 222)
    assert.throws(() => cips.cip67.decode_asset_name_label(Uint8Array.of(0, 0, 0, 1)))
  })
})
