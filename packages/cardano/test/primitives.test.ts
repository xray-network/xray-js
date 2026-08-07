import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { accounts, addresses, assets, cips, encoding, keys, plutus, providers } from "@xray-network/xray-js-cardano"
import { testData } from "./fixtures.js"

describe("Cardano primitives", () => {
  it("derives keys, addresses, checksums, assets, and encoding", () => {
    assert.equal(keys.xprvKeyToXpubKey(testData.xprvKey, testData.accountPath), testData.xpubKey)
    assert.equal(addresses.deriveBase(testData.xpubKey, testData.addressPath, 0), testData.paymentAddress)
    assert.equal(accounts.checksum(testData.xpubKey).checksumId, testData.checksumId)
    assert.equal(encoding.toStringFromHex(encoding.fromStringToHex("XRAY")), "XRAY")
    assert.match(assets.getFingerprint("8bca871dcd8d901d02677b6d2413fd19e4c8febfc353edff".padEnd(56, "0")), /^asset1/)
  })

  it("groups CIPs, Plutus, and generated clients by domain", () => {
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
    assert.equal(encoding.toHex(label), "000de140")
    assert.equal(cips.cip67.decode_asset_name_label(label), 222)
    assert.throws(() => cips.cip67.decode_asset_name_label(Uint8Array.of(0, 0, 0, 1)))
  })
})
