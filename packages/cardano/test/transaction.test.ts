import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createCardano, transactions, utilities } from "@xray-network/xray-js-cardano"
import { createInMemoryProvider } from "@xray-network/xray-js-cardano/testing"
import { bytesToHex, decodeCbor, encodeCbor, hexToBytes, type CborValue } from "@xray-network/xray-cardano-lib-core"
import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"
import { ScriptHash } from "@xray-network/xray-cardano-lib-crypto"
import { ownedUtxo, testData } from "./fixtures.js"

const setup = () => {
  const provider = createInMemoryProvider({ utxos: [ownedUtxo] })
  const cardano = createCardano({ network: "preview", provider })
  const account = cardano.accounts.fromPrivateKey(testData.xprvKey)
  return { provider, cardano, account }
}

const mapField = (value: CborValue, key: bigint): CborValue | undefined => {
  if (value.kind !== "map") throw new TypeError("expected a CBOR map")
  return value.entries.find(([candidate]) => candidate.kind === "unsigned" && candidate.value === key)?.[1]
}

const transactionOutputAmounts = (transactionCbor: string): CborValue[] => {
  const transaction = decodeCbor(hexToBytes(transactionCbor))
  if (transaction.kind !== "array" || transaction.values[0]?.kind !== "map") {
    throw new TypeError("expected a transaction with a map body")
  }
  const outputs = mapField(transaction.values[0], 1n)
  if (outputs?.kind !== "array") throw new TypeError("expected transaction outputs")
  return outputs.values.map((output) => {
    if (output.kind === "array") {
      const amount = output.values[1]
      if (amount === undefined) throw new TypeError("legacy output amount is missing")
      return amount
    }
    const amount = mapField(output, 1n)
    if (amount === undefined) throw new TypeError("output amount is missing")
    return amount
  })
}

const transactionOutputAmount = (output: CardanoLib.TransactionOutput): CborValue => {
  const decoded = decodeCbor(output.to_cbor_bytes())
  if (decoded.kind === "array") {
    const amount = decoded.values[1]
    if (amount === undefined) throw new TypeError("legacy output amount is missing")
    return amount
  }
  const amount = mapField(decoded, 1n)
  if (amount === undefined) throw new TypeError("output amount is missing")
  return amount
}

const withEmptyAssetsOnFirstOutput = (transactionCbor: string): string => {
  const transaction = decodeCbor(hexToBytes(transactionCbor))
  if (transaction.kind !== "array" || transaction.values[0]?.kind !== "map") {
    throw new TypeError("expected a transaction with a map body")
  }
  const body = transaction.values[0]
  const outputs = mapField(body, 1n)
  if (outputs?.kind !== "array" || outputs.values[0]?.kind !== "map") {
    throw new TypeError("expected a Conway transaction output")
  }
  const output = outputs.values[0]
  const amount = mapField(output, 1n)
  if (amount?.kind !== "unsigned") throw new TypeError("expected a coin-only output")
  const emptyAssets: CborValue = { kind: "map", entries: [], encoding: { kind: "definite", width: 0 } }
  const tupleAmount: CborValue = {
    kind: "array",
    values: [amount, emptyAssets],
    encoding: { kind: "definite", width: 0 },
  }
  const changedOutput: CborValue = {
    ...output,
    entries: output.entries.map(([key, value]) => [
      key,
      key.kind === "unsigned" && key.value === 1n ? tupleAmount : value,
    ]),
  }
  const changedOutputs: CborValue = { ...outputs, values: [changedOutput, ...outputs.values.slice(1)] }
  const changedBody: CborValue = {
    ...body,
    entries: body.entries.map(([key, value]) => [
      key,
      key.kind === "unsigned" && key.value === 1n ? changedOutputs : value,
    ]),
  }
  return bytesToHex(encodeCbor({ ...transaction, values: [changedBody, ...transaction.values.slice(1)] }))
}

describe("Cardano transactions", () => {
  it("constructs canonical ADA-only values across primitive and output boundaries", async () => {
    const coinCbor = "1a003d0900"
    assert.equal(transactions.assetsToValue(4_000_000n).to_cbor_hex(), coinCbor)
    assert.equal(transactions.assetsToValue(4_000_000n, []).to_cbor_hex(), coinCbor)

    const converted = transactions.utxoToTransactionOutput({
      ...ownedUtxo,
      value: 4_000_000n,
      assets: [],
    })
    assert.equal(transactionOutputAmount(converted).kind, "unsigned")

    const { cardano, account } = setup()
    const unsigned = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .payTo([{ address: testData.paymentAddressEnterprise, value: 4_000_000n, assets: [] }])
      .spend([ownedUtxo])
      .build()
    assert.ok(transactionOutputAmounts(unsigned.cbor).every((amount) => amount.kind === "unsigned"))

    const collateralValue = transactions.assetsToValue(4_000_000n, [])
    const collateralReturn = CardanoLib.TransactionOutputBuilder.new()
      .with_address(CardanoLib.Address.from_bech32(account.paymentAddress))
      .next()
      .with_value(collateralValue)
      .build()
      .output()
    assert.equal(transactionOutputAmount(collateralReturn).kind, "unsigned")
  })

  it("preserves token-bearing maps and exact bigint quantities", async () => {
    const quantity = 9_007_199_254_740_993n
    const asset = { policyId: "11".repeat(28), assetName: "58524159", quantity }
    const value = transactions.assetsToValue(4_000_000n, [asset])
    const decoded = decodeCbor(value.to_cbor_bytes())
    assert.equal(decoded.kind, "array")
    assert.equal(
      value
        .multi_asset()
        ?.get_value(
          ScriptHash.from_hex(asset.policyId),
          CardanoLib.AssetName.from_raw_bytes(hexToBytes(asset.assetName))
        ),
      quantity
    )

    const tokenInput = { ...ownedUtxo, assets: [asset] }
    const { cardano, account } = setup()
    const unsigned = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .payTo([{ address: testData.paymentAddressEnterprise, value: 4_000_000n, assets: [asset] }])
      .spend([tokenInput])
      .build()
    const tokenAmounts = transactionOutputAmounts(unsigned.cbor).filter((amount) => amount.kind === "array")
    assert.equal(tokenAmounts.length, 1)
    const map = tokenAmounts[0]?.kind === "array" ? tokenAmounts[0].values[1] : undefined
    assert.equal(map?.kind, "map")
    const bundle = map?.kind === "map" ? map.entries[0]?.[1] : undefined
    assert.equal(bundle?.kind, "map")
    const tokenQuantity = bundle?.kind === "map" ? bundle.entries[0]?.[1] : undefined
    assert.equal(tokenQuantity?.kind, "unsigned")
    assert.equal(tokenQuantity?.kind === "unsigned" ? tokenQuantity.value : undefined, quantity)
  })

  it("keeps an Eternl-rejected ADA tuple byte- and hash-stable while signing", async () => {
    const { provider, cardano, account } = setup()
    const canonical = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .payTo([{ address: testData.paymentAddressEnterprise, value: 4_000_000n }])
      .spend([ownedUtxo])
      .build()
    const rejectedCbor = withEmptyAssetsOnFirstOutput(canonical.cbor)
    const imported = cardano.transactions.fromCbor(rejectedCbor)

    assert.equal(imported.cbor, rejectedCbor)
    const rejectedAmount = transactionOutputAmounts(imported.cbor)[0]
    assert.equal(rejectedAmount?.kind, "array")
    assert.equal(rejectedAmount?.kind === "array" ? rejectedAmount.values[1]?.kind : undefined, "map")

    const signed = cardano.transactions.signWithPrivateKey(imported, account.getPrivateKey())
    assert.equal(signed.hash, imported.hash)
    const signedAmount = transactionOutputAmounts(signed.cbor)[0]
    assert.equal(signedAmount?.kind, "array")
    assert.equal(signedAmount?.kind === "array" ? signedAmount.values[1]?.kind : undefined, "map")
    assert.equal(await cardano.transactions.submit(signed), "submitted-1")
    assert.equal(provider.submittedTransactions[0], signed.cbor)
  })

  it("builds, signs, serializes, and submits payments", async () => {
    const { provider, cardano, account } = setup()
    const emptyPlan = cardano.transactions.create()
    const output = { address: testData.paymentAddressEnterprise, value: 2_000_000n }
    const input = { ...ownedUtxo, transaction: { ...ownedUtxo.transaction } }
    const paymentPlan = emptyPlan.setChangeAddress(account.paymentAddress).payTo([output]).spend([input])
    // Plans snapshot their inputs, so later caller mutations must not affect the build.
    output.address = "mutated-after-planning"
    input.address = "mutated-after-planning"
    input.transaction.id = "2".repeat(64)
    assert.notEqual(emptyPlan, paymentPlan)
    assert.equal(Object.isFrozen(emptyPlan), true)
    const unsigned = await paymentPlan.build()

    const signed = await cardano.transactions.sign(unsigned, account)
    const locallySigned = cardano.transactions.signWithPrivateKey(unsigned, account.getPrivateKey())
    assert.equal(signed.hash.length, 64)
    assert.equal(locallySigned.kind, "signed")
    assert.equal(typeof signed.cbor, "string")
    assert.ok(signed.json)
    assert.equal(await cardano.transactions.submit(signed), "submitted-1")
    assert.equal(provider.submittedTransactions.length, 1)
  })

  it("builds staking and governance certificates", async () => {
    const { cardano, account } = setup()
    const stakingAddress = account.stakingAddress
    assert.ok(stakingAddress)
    const unsigned = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .stake.register(stakingAddress)
      .governance.delegateToDRep(stakingAddress, "AlwaysAbstain")
      .spend([ownedUtxo])
      .build()
    assert.equal((await cardano.transactions.sign(unsigned, account)).hash.length, 64)
  })

  it("retains native minting and validity operations", async () => {
    const { cardano, account } = setup()
    const paymentCredential = utilities.addresses.getCredentials(account.paymentAddress).paymentCred
    assert.ok(paymentCredential)
    const native = utilities.scripts.nativeScriptFromJson({ type: "sig", keyHash: paymentCredential.hash })
    const mintedAsset = { policyId: native.policyId, assetName: "58524159", quantity: 1n }
    const unsigned = await cardano.transactions
      .create()
      .setChangeAddress(account.paymentAddress)
      .attachScript(native.script)
      .spend([ownedUtxo])
      .payTo([{ address: account.paymentAddress, value: 2_000_000n, assets: [mintedAsset] }])
      .mint([mintedAsset])
      .validFrom(Date.now() - 1_000)
      .validUntil(Date.now() + 60_000)
      .build()
    assert.equal(typeof unsigned.cbor, "string")
    assert.equal(
      utilities.slots.slotToUnixTime(
        utilities.slots.unixTimeToSlot(Date.now(), cardano.slotConfig),
        cardano.slotConfig
      ) > 0,
      true
    )
  })
})
