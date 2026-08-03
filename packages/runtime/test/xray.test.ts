import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { XRAY } from "@xray-network/xray-js"
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
