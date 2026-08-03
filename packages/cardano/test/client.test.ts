import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createCardano } from "@xray-network/xray-js-cardano"
import { createInMemoryProvider } from "@xray-network/xray-js-cardano/testing"

describe("createCardano", () => {
  it("creates synchronously, then lazily loads and caches remote protocol parameters", async () => {
    const provider = createInMemoryProvider()
    const cardano = createCardano({
      network: "preview",
      provider,
      protocolParameters: { source: "remote", cacheDurationMs: 300_000 },
    })

    assert.equal(provider.protocolParameterRequests, 0)
    await cardano.getProtocolParameters()
    assert.equal(provider.protocolParameterRequests, 1)
    await cardano.getProtocolParameters()
    assert.equal(provider.protocolParameterRequests, 1)
    await cardano.getProtocolParameters(true)
    assert.equal(provider.protocolParameterRequests, 2)
    assert.equal((await cardano.chain.getTip()).absSlot, 0)
  })

  it("supports expiring remote caches and static protocol parameters", async () => {
    const remoteProvider = createInMemoryProvider()
    const uncached = createCardano({
      provider: remoteProvider,
      protocolParameters: { source: "remote", cacheDurationMs: 0 },
    })

    assert.equal(remoteProvider.protocolParameterRequests, 0)
    await uncached.getProtocolParameters()
    assert.equal(remoteProvider.protocolParameterRequests, 1)
    await uncached.getProtocolParameters()
    assert.equal(remoteProvider.protocolParameterRequests, 2)

    const staticProvider = createInMemoryProvider()
    const parameters = await staticProvider.getProtocolParameters()
    const configured = createCardano({
      provider: staticProvider,
      protocolParameters: { source: "static", value: parameters },
    })

    assert.equal(staticProvider.protocolParameterRequests, 1)
    assert.equal(await configured.getProtocolParameters(), parameters)
    assert.equal(staticProvider.protocolParameterRequests, 1)
  })

  it("requires a valid custom slot configuration", () => {
    assert.throws(
      () => createCardano({ network: "custom", provider: createInMemoryProvider() }),
      /custom network requires a slotConfig/
    )
  })
})
