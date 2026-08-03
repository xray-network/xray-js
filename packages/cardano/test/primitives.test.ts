import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  CardanoLib,
  KoiosClient,
  KupoClient,
  NftcdnClient,
  OgmiosClient,
  accounts,
  addresses,
  assets,
  encoding,
  keys,
} from "@xray-network/xray-js-cardano"
import { testData } from "./fixtures.js"

describe("Cardano primitives", () => {
  it("derives keys, addresses, checksums, assets, and encoding", () => {
    assert.equal(keys.xprvKeyToXpubKey(testData.xprvKey, testData.accountPath), testData.xpubKey)
    assert.equal(addresses.deriveBase(testData.xpubKey, testData.addressPath, 0), testData.paymentAddress)
    assert.equal(accounts.checksum(testData.xpubKey).checksumId, testData.checksumId)
    assert.equal(encoding.toStringFromHex(encoding.fromStringToHex("XRAY")), "XRAY")
    assert.match(assets.getFingerprint("8bca871dcd8d901d02677b6d2413fd19e4c8febfc353edff".padEnd(56, "0")), /^asset1/)
  })

  it("keeps direct library and generated-client exports", () => {
    assert.equal(typeof CardanoLib.Address.from_bech32, "function")
    assert.equal(typeof KoiosClient, "function")
    assert.equal(typeof KupoClient, "function")
    assert.equal(typeof NftcdnClient, "function")
    assert.equal(typeof OgmiosClient, "function")
  })
})
