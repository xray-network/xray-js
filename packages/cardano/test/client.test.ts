import assert from "node:assert/strict"
import { describe, it, type TestContext } from "node:test"
import { createCardano } from "@xray-network/xray-js-cardano"
import { createInMemoryProvider } from "@xray-network/xray-js-cardano/testing"

const captureServiceRequests = (context: TestContext) => {
  const requests: Request[] = []
  context.mock.method(globalThis, "fetch", async (request: Request) => {
    requests.push(request)
    return Response.json([{ hash: "tip", epoch_no: 1, abs_slot: 2, epoch_slot: 3, block_no: 4, block_time: 5 }])
  })
  return requests
}

describe("createCardano", () => {
  for (const network of ["mainnet", "preprod", "preview"] as const) {
    it(`uses the current Graph service endpoints for ${network}`, async (context) => {
      const requests = captureServiceRequests(context)
      const cardano = createCardano({ network })

      assert.equal((await cardano.chain.getTip()).absSlot, 2)
      await cardano.clients.koios.GET("/tip", {})
      await cardano.clients.nftcdn.GET("/image/{id}", { params: { path: { id: "asset" } }, parseAs: "text" })

      assert.deepEqual(
        requests.map((request) => request.url),
        [
          `https://graph.xray.app/output/services/xray-koios/${network}-api-v1/tip`,
          `https://graph.xray.app/output/services/xray-koios/${network}-api-v1/tip`,
          `https://graph.xray.app/output/services/xray-nftcdn-cardano/${network}-api-v1/image/asset`,
        ]
      )
      assert.equal(cardano.clients.ogmios, undefined)
      assert.equal(cardano.clients.kupo, undefined)
    })
  }

  it("uses configured service URLs and headers, including the default provider", async (context) => {
    const requests = captureServiceRequests(context)
    const cardano = createCardano({
      clients: {
        koios: { url: "https://koios.example/api/v1", headers: { Authorization: "koios-token" } },
        nftcdn: { url: "https://nftcdn.example", headers: { Authorization: "nftcdn-token" } },
        ogmios: { url: "https://ogmios.example", headers: { Authorization: "ogmios-token" } },
        kupo: { url: "https://kupo.example", headers: { Authorization: "kupo-token" } },
      },
    })

    await cardano.chain.getTip()
    await cardano.clients.koios.GET("/tip", {})
    await cardano.clients.nftcdn.GET("/image/{id}", { params: { path: { id: "asset" } }, parseAs: "text" })
    assert(cardano.clients.ogmios)
    assert(cardano.clients.kupo)
    await cardano.clients.ogmios.GET("/health", {})
    await cardano.clients.kupo.GET("/health", {})

    assert.deepEqual(
      requests.map((request) => [request.url, request.headers.get("Authorization")]),
      [
        ["https://koios.example/api/v1/tip", "koios-token"],
        ["https://koios.example/api/v1/tip", "koios-token"],
        ["https://nftcdn.example/image/asset", "nftcdn-token"],
        ["https://ogmios.example/health", "ogmios-token"],
        ["https://kupo.example/health", "kupo-token"],
      ]
    )
  })

  it("creates synchronously, then lazily loads and caches remote protocol parameters", async () => {
    const provider = createInMemoryProvider()
    const cardano = createCardano({
      network: "preview",
      provider,
      clients: { koios: { url: "https://koios.example/api/v1" } },
      protocolParameters: { source: "remote", cacheDurationMs: 300_000 },
    })

    assert.equal(cardano.provider, provider)
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
