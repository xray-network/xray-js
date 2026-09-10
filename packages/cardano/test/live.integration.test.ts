import assert from "node:assert/strict"
import { it } from "node:test"
import { createCardano } from "@xray-network/xray-js-cardano"

it("queries a live XRAY Cardano endpoint", { skip: process.env.XRAY_LIVE_TESTS !== "1" }, async () => {
  const cardano = createCardano({ network: "mainnet", protocolParameters: "remote" })
  assert.ok((await cardano.chain.getTip()).absSlot > 0)
})
