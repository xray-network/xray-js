import { bytesToHex, decodeCbor, encodeCbor, type CborValue } from "@xray-network/xray-cardano-lib-core"
import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"
import { getTransactionParts } from "../internal/transaction.js"

export type TransactionUnknownField = Readonly<{ key?: bigint; keyCbor: string; cbor: string }>
export type TransactionInputInspection = Readonly<{ transactionId: string; index: bigint }>
export type TransactionAssetInspection = Readonly<{ policyId: string; assetName: string; quantity: bigint }>
export type TransactionValueInspection = Readonly<{ lovelace: bigint; assets: readonly TransactionAssetInspection[] }>
export type TransactionCredentialInspection = Readonly<{ type: "key" | "script"; hash: string }>
export type TransactionDRepInspection =
  Readonly<{ type: "key" | "script"; hash: string }> | Readonly<{ type: "always-abstain" | "always-no-confidence" }>
export type TransactionAnchorInspection = Readonly<{ url: string; dataHash: string }>
export type TransactionDatumInspection =
  Readonly<{ type: "hash"; hash: string }> | Readonly<{ type: "inline"; cbor: string }>
export type TransactionScriptInspection = Readonly<{
  kind: "native" | "plutus-v1" | "plutus-v2" | "plutus-v3"
  cbor: string
  bytes?: string
}>
export type TransactionOutputInspection = Readonly<{
  index: number
  address: string
  lovelace: bigint
  assets: readonly TransactionAssetInspection[]
  datum?: TransactionDatumInspection
  referenceScript?: TransactionScriptInspection
}>

export type TransactionCertificateKind =
  | "stake-registration"
  | "stake-deregistration"
  | "stake-delegation"
  | "pool-registration"
  | "pool-retirement"
  | "genesis-key-delegation"
  | "move-instantaneous-rewards"
  | "stake-registration-with-deposit"
  | "stake-deregistration-with-refund"
  | "vote-delegation"
  | "stake-vote-delegation"
  | "stake-registration-pool-delegation"
  | "stake-registration-vote-delegation"
  | "stake-registration-pool-vote-delegation"
  | "committee-hot-authorization"
  | "committee-cold-resignation"
  | "drep-registration"
  | "drep-deregistration"
  | "drep-update"
  | "unknown"

export type TransactionCertificateInspection = Readonly<{
  kind: TransactionCertificateKind
  tag: bigint
  cbor: string
  stakeCredential?: TransactionCredentialInspection
  poolId?: string
  drep?: TransactionDRepInspection
  deposit?: bigint
  refund?: bigint
  epoch?: bigint
  coldCredential?: TransactionCredentialInspection
  hotCredential?: TransactionCredentialInspection
  drepCredential?: TransactionCredentialInspection
  anchor?: TransactionAnchorInspection
  genesisHash?: string
  delegateHash?: string
  vrfKeyHash?: string
  mirPot?: "reserves" | "treasury"
  mirRewards?: readonly Readonly<{ credential?: TransactionCredentialInspection; reward?: bigint; cbor: string }>[]
  pool?: Readonly<{
    operator: string
    vrfKeyHash: string
    pledge: bigint
    cost: bigint
    margin: Readonly<{ numerator: bigint; denominator: bigint }>
    rewardAccount: string
    owners: readonly string[]
    relays: readonly Readonly<{ kind: "single-host-address" | "single-host-name" | "multi-host-name"; cbor: string }>[]
    metadata?: Readonly<{ url: string; hash: string }>
  }>
}>

export type TransactionMetadataValue =
  | Readonly<{ type: "integer"; value: bigint }>
  | Readonly<{ type: "bytes"; value: string }>
  | Readonly<{ type: "text"; value: string }>
  | Readonly<{ type: "list"; value: readonly TransactionMetadataValue[] }>
  | Readonly<{
      type: "map"
      value: readonly Readonly<{ key: TransactionMetadataValue; value: TransactionMetadataValue }>[]
    }>

export type TransactionWitnessInspection = Readonly<{
  vkeys: readonly Readonly<{ publicKey: string; signature: string }>[]
  bootstrap: readonly Readonly<{ publicKey: string; signature: string; chainCode: string; attributes: string }>[]
  nativeScripts: readonly TransactionScriptInspection[]
  plutusV1Scripts: readonly TransactionScriptInspection[]
  plutusV2Scripts: readonly TransactionScriptInspection[]
  plutusV3Scripts: readonly TransactionScriptInspection[]
  datums: readonly Readonly<{ cbor: string }>[]
  redeemers: readonly Readonly<{ tag: bigint; index: bigint; dataCbor: string; memory: bigint; steps: bigint }>[]
  unknownFields: readonly TransactionUnknownField[]
}>

export type TransactionAuxiliaryDataInspection = Readonly<{
  metadata: readonly Readonly<{ label: bigint; value: TransactionMetadataValue }>[]
  nativeScripts: readonly TransactionScriptInspection[]
  plutusV1Scripts: readonly TransactionScriptInspection[]
  plutusV2Scripts: readonly TransactionScriptInspection[]
  plutusV3Scripts: readonly TransactionScriptInspection[]
  unknownFields: readonly TransactionUnknownField[]
}>

export type TransactionBodyInspection = Readonly<{
  inputs: readonly TransactionInputInspection[]
  outputs: readonly TransactionOutputInspection[]
  fee: bigint
  validity: Readonly<{ invalidBefore?: bigint; invalidHereafter?: bigint }>
  certificates: readonly TransactionCertificateInspection[]
  withdrawals: readonly Readonly<{ rewardAccount: string; amount: bigint }>[]
  protocolUpdate?: Readonly<{
    epoch: bigint
    proposals: readonly Readonly<{
      genesisHash: string
      parameters: readonly Readonly<{ key: bigint; cbor: string; integer?: bigint }>[]
    }>[]
  }>
  auxiliaryDataHash?: string
  mint: readonly TransactionAssetInspection[]
  scriptDataHash?: string
  collateralInputs: readonly TransactionInputInspection[]
  requiredSigners: readonly string[]
  networkId?: number
  collateralReturn?: TransactionOutputInspection
  totalCollateral?: bigint
  referenceInputs: readonly TransactionInputInspection[]
  votingProcedures: readonly Readonly<{
    voter: Readonly<{ kind: number; credential?: TransactionCredentialInspection; poolId?: string }>
    votes: readonly Readonly<{
      transactionId: string
      index: bigint
      vote: number
      anchor?: TransactionAnchorInspection
    }>[]
  }>[]
  proposalProcedures: readonly Readonly<{
    deposit: bigint
    rewardAccount: string
    action: Readonly<{ kind: number; cbor: string }>
    anchor: TransactionAnchorInspection
  }>[]
  currentTreasuryValue?: bigint
  donation?: bigint
  unknownFields: readonly TransactionUnknownField[]
}>

export type TransactionInspection = TransactionBodyInspection &
  Readonly<{
    cbor: string
    hash: string
    body: TransactionBodyInspection
    isValid: boolean
    witnessState: "empty" | "present"
    witnesses: TransactionWitnessInspection
    auxiliaryData?: TransactionAuxiliaryDataInspection
  }>

const field = (node: CborValue, key: bigint): CborValue | undefined => {
  if (node.kind !== "map") throw new TypeError("Transaction component must be a CBOR map")
  return node.entries.find(([candidate]) => candidate.kind === "unsigned" && candidate.value === key)?.[1]
}
const sequence = (node: CborValue | undefined): readonly CborValue[] => {
  const value = node?.kind === "tag" && node.tag === 258n ? node.value : node
  if (value === undefined) return []
  if (value.kind !== "array") throw new TypeError("Transaction collection must be a CBOR array")
  return value.values
}
const cborHex = (node: CborValue) => bytesToHex(encodeCbor(node))
const bytes = (node: CborValue | undefined, name: string): string => {
  if (node?.kind !== "bytes") throw new TypeError(`${name} must be bytes`)
  return bytesToHex(node.value)
}
const uint = (node: CborValue | undefined, name: string): bigint => {
  if (node?.kind !== "unsigned") throw new TypeError(`${name} must be unsigned`)
  return node.value
}
const integer = (node: CborValue | undefined, name: string): bigint => {
  if (node?.kind !== "unsigned" && node?.kind !== "negative") throw new TypeError(`${name} must be an integer`)
  return node.value
}
const tuple = (node: CborValue, name: string): readonly CborValue[] => {
  if (node.kind !== "array") throw new TypeError(`${name} must be a CBOR array`)
  return node.values
}
const address = (node: CborValue | undefined, name: string): string => {
  if (node?.kind !== "bytes") throw new TypeError(`${name} must be address bytes`)
  const parsed = CardanoLib.Address.from_raw_bytes(node.value)
  if (parsed.kind() === CardanoLib.AddressKind.Byron) {
    const byron = CardanoLib.ByronAddress.from_address(parsed)
    if (!byron) throw new TypeError(`${name} contains an invalid Byron address`)
    return byron.to_base58()
  }
  return parsed.to_bech32()
}
const unknownField = ([key, value]: readonly [CborValue, CborValue]): TransactionUnknownField => ({
  ...(key.kind === "unsigned" ? { key: key.value } : {}),
  keyCbor: cborHex(key),
  cbor: cborHex(value),
})

const credential = (node: CborValue | undefined, name: string): TransactionCredentialInspection => {
  if (node === undefined) throw new TypeError(`${name} is absent`)
  const values = tuple(node, name)
  const kind = uint(values[0], `${name} kind`)
  if (kind > 1n) throw new TypeError(`${name} kind is unsupported`)
  return { type: kind === 0n ? "key" : "script", hash: bytes(values[1], `${name} hash`) }
}
const drep = (node: CborValue | undefined): TransactionDRepInspection => {
  if (node === undefined) throw new TypeError("DRep is absent")
  const values = tuple(node, "DRep")
  const kind = uint(values[0], "DRep kind")
  if (kind === 0n || kind === 1n) return { type: kind === 0n ? "key" : "script", hash: bytes(values[1], "DRep hash") }
  if (kind === 2n || kind === 3n) return { type: kind === 2n ? "always-abstain" : "always-no-confidence" }
  throw new TypeError("DRep kind is unsupported")
}
const anchor = (node: CborValue | undefined): TransactionAnchorInspection => {
  if (node === undefined) throw new TypeError("Anchor is absent")
  const values = tuple(node, "Anchor")
  if (values[0]?.kind !== "text") throw new TypeError("Anchor URL must be text")
  return { url: values[0].value, dataHash: bytes(values[1], "Anchor data hash") }
}

const parseValue = (node: CborValue | undefined, signed = false): TransactionValueInspection => {
  if (node?.kind === "unsigned") return { lovelace: node.value, assets: [] }
  if (node?.kind !== "array" || node.values[0]?.kind !== "unsigned" || node.values[1]?.kind !== "map") {
    throw new TypeError("Transaction value must be coin or [coin, assets]")
  }
  const assets: TransactionAssetInspection[] = []
  for (const [policy, bundle] of node.values[1].entries) {
    if (bundle.kind !== "map") throw new TypeError("Asset bundle must be a map")
    for (const [name, quantity] of bundle.entries) {
      const amount = signed ? integer(quantity, "asset quantity") : uint(quantity, "asset quantity")
      assets.push({ policyId: bytes(policy, "policy ID"), assetName: bytes(name, "asset name"), quantity: amount })
    }
  }
  return { lovelace: node.values[0].value, assets }
}
const parseMint = (node: CborValue | undefined): TransactionAssetInspection[] => {
  if (node === undefined) return []
  if (node.kind !== "map") throw new TypeError("Mint must be a map")
  return parseValue(
    {
      kind: "array",
      values: [{ kind: "unsigned", value: 0n, encoding: { width: 0 } }, node],
      encoding: { kind: "definite", width: 0 },
    },
    true
  ).assets as TransactionAssetInspection[]
}
const parseInput = (node: CborValue): TransactionInputInspection => {
  const values = tuple(node, "Transaction input")
  return {
    transactionId: bytes(values[0], "Transaction input hash"),
    index: uint(values[1], "Transaction input index"),
  }
}
const parseScript = (node: CborValue, embedded = false): TransactionScriptInspection => {
  let script = node
  if (embedded) {
    if (node.kind !== "tag" || node.tag !== 24n || node.value.kind !== "bytes")
      throw new TypeError("Reference script must be embedded CBOR")
    script = decodeCbor(node.value.value)
  }
  const values = tuple(script, "Script")
  const kind = uint(values[0], "Script kind")
  const names = ["native", "plutus-v1", "plutus-v2", "plutus-v3"] as const
  const name = names[Number(kind)]
  if (!name || values[1] === undefined) throw new TypeError("Script kind is unsupported")
  return {
    kind: name,
    cbor: cborHex(script),
    ...(values[1].kind === "bytes" ? { bytes: bytesToHex(values[1].value) } : {}),
  }
}
const parseOutput = (node: CborValue, index: number): TransactionOutputInspection => {
  const addressNode = node.kind === "map" ? field(node, 0n) : tuple(node, "Transaction output")[0]
  const valueNode = node.kind === "map" ? field(node, 1n) : tuple(node, "Transaction output")[1]
  const value = parseValue(valueNode)
  const legacyDatum = node.kind === "array" ? node.values[2] : undefined
  const datumOption = node.kind === "map" ? field(node, 2n) : undefined
  let datum: TransactionDatumInspection | undefined
  if (legacyDatum !== undefined) datum = { type: "hash", hash: bytes(legacyDatum, "Datum hash") }
  if (datumOption !== undefined) {
    const values = tuple(datumOption, "Datum option")
    const kind = uint(values[0], "Datum kind")
    if (kind === 0n) datum = { type: "hash", hash: bytes(values[1], "Datum hash") }
    else if (kind === 1n && values[1] !== undefined)
      datum = {
        type: "inline",
        cbor:
          values[1].kind === "tag" && values[1].tag === 24n && values[1].value.kind === "bytes"
            ? bytesToHex(values[1].value.value)
            : cborHex(values[1]),
      }
    else throw new TypeError("Datum option kind is unsupported")
  }
  const reference = node.kind === "map" ? field(node, 3n) : undefined
  return {
    index,
    address: address(addressNode, "Transaction output address"),
    lovelace: value.lovelace,
    assets: value.assets,
    ...(datum ? { datum } : {}),
    ...(reference ? { referenceScript: parseScript(reference, true) } : {}),
  }
}

const certificateKinds: readonly Exclude<TransactionCertificateKind, "unknown">[] = [
  "stake-registration",
  "stake-deregistration",
  "stake-delegation",
  "pool-registration",
  "pool-retirement",
  "genesis-key-delegation",
  "move-instantaneous-rewards",
  "stake-registration-with-deposit",
  "stake-deregistration-with-refund",
  "vote-delegation",
  "stake-vote-delegation",
  "stake-registration-pool-delegation",
  "stake-registration-vote-delegation",
  "stake-registration-pool-vote-delegation",
  "committee-hot-authorization",
  "committee-cold-resignation",
  "drep-registration",
  "drep-deregistration",
  "drep-update",
]
const parsePool = (values: readonly CborValue[]): NonNullable<TransactionCertificateInspection["pool"]> => {
  const marginNode = values[5] as CborValue
  const margin = tuple(
    marginNode.kind === "tag" && marginNode.tag === 30n ? marginNode.value : marginNode,
    "Pool margin"
  )
  const owners = sequence(values[7]).map((owner) => bytes(owner, "Pool owner"))
  const metadata = values[9]
  const metadataValues = metadata && metadata.kind !== "null" ? tuple(metadata, "Pool metadata") : undefined
  const metadataUrl = metadataValues?.[0]
  return {
    operator: bytes(values[1], "Pool operator"),
    vrfKeyHash: bytes(values[2], "Pool VRF key hash"),
    pledge: uint(values[3], "Pool pledge"),
    cost: uint(values[4], "Pool cost"),
    margin: {
      numerator: uint(margin[0], "Pool margin numerator"),
      denominator: uint(margin[1], "Pool margin denominator"),
    },
    rewardAccount: address(values[6], "Pool reward account"),
    owners,
    relays: sequence(values[8]).map((relay) => {
      const tag = uint(tuple(relay, "Pool relay")[0], "Pool relay kind")
      return {
        kind: tag === 0n ? "single-host-address" : tag === 1n ? "single-host-name" : "multi-host-name",
        cbor: cborHex(relay),
      }
    }),
    ...(metadataValues
      ? {
          metadata: {
            url: metadataUrl?.kind === "text" ? metadataUrl.value : "",
            hash: bytes(metadataValues[1], "Pool metadata hash"),
          },
        }
      : {}),
  }
}
const parseCertificate = (node: CborValue): TransactionCertificateInspection => {
  const values = tuple(node, "Certificate")
  const tag = uint(values[0], "Certificate tag")
  const knownKind = tag <= 18n ? certificateKinds[Number(tag)] : undefined
  if (knownKind === undefined) return { kind: "unknown", tag, cbor: cborHex(node) }
  const kind: Exclude<TransactionCertificateKind, "unknown"> = knownKind
  const base = { kind, tag, cbor: cborHex(node) } as TransactionCertificateInspection
  if ([0n, 1n, 2n, 7n, 8n, 9n, 10n, 11n, 12n, 13n].includes(tag))
    Object.assign(base, { stakeCredential: credential(values[1], "Stake credential") })
  if ([2n, 10n, 11n, 13n].includes(tag)) Object.assign(base, { poolId: bytes(values[2], "Pool ID") })
  if (tag === 3n) Object.assign(base, { pool: parsePool(values) })
  if (tag === 4n)
    Object.assign(base, { poolId: bytes(values[1], "Pool ID"), epoch: uint(values[2], "Retirement epoch") })
  if (tag === 5n)
    Object.assign(base, {
      genesisHash: bytes(values[1], "Genesis hash"),
      delegateHash: bytes(values[2], "Delegate hash"),
      vrfKeyHash: bytes(values[3], "VRF key hash"),
    })
  if (tag === 6n) {
    const mir = tuple(values[1] as CborValue, "MIR"),
      reward = mir[1]
    Object.assign(base, {
      mirPot: uint(mir[0], "MIR pot") === 0n ? "reserves" : "treasury",
      mirRewards:
        reward?.kind === "map"
          ? reward.entries.map(([key, value]) => ({
              credential: credential(key, "MIR credential"),
              reward: integer(value, "MIR reward"),
              cbor: cborHex(value),
            }))
          : [
              {
                reward: reward?.kind === "unsigned" || reward?.kind === "negative" ? reward.value : undefined,
                cbor: reward ? cborHex(reward) : "",
              },
            ],
    })
  }
  const depositIndex = tag === 7n ? 2 : tag === 11n || tag === 12n ? 3 : tag === 13n ? 4 : tag === 16n ? 2 : undefined
  if (depositIndex !== undefined) Object.assign(base, { deposit: uint(values[depositIndex], "Certificate deposit") })
  if ([8n, 17n].includes(tag)) Object.assign(base, { refund: uint(values[2], "Certificate refund") })
  if ([9n, 12n].includes(tag)) Object.assign(base, { drep: drep(values[2]) })
  if ([10n, 13n].includes(tag)) Object.assign(base, { drep: drep(values[3]) })
  if (tag === 14n)
    Object.assign(base, {
      coldCredential: credential(values[1], "Cold credential"),
      hotCredential: credential(values[2], "Hot credential"),
    })
  if (tag === 15n)
    Object.assign(base, {
      coldCredential: credential(values[1], "Cold credential"),
      ...(values[2]?.kind !== "null" ? { anchor: anchor(values[2]) } : {}),
    })
  if ([16n, 17n, 18n].includes(tag)) Object.assign(base, { drepCredential: credential(values[1], "DRep credential") })
  if ([16n, 18n].includes(tag) && values[values.length - 1]?.kind !== "null")
    Object.assign(base, { anchor: anchor(values[values.length - 1]) })
  return base
}

const parseMetadataValue = (node: CborValue): TransactionMetadataValue => {
  if (node.kind === "unsigned" || node.kind === "negative") return { type: "integer", value: node.value }
  if (node.kind === "bytes") return { type: "bytes", value: bytesToHex(node.value) }
  if (node.kind === "text") return { type: "text", value: node.value }
  if (node.kind === "array") return { type: "list", value: node.values.map(parseMetadataValue) }
  if (node.kind === "map")
    return {
      type: "map",
      value: node.entries.map(([key, value]) => ({ key: parseMetadataValue(key), value: parseMetadataValue(value) })),
    }
  throw new TypeError("Unsupported transaction metadata value")
}
const parseMetadata = (node: CborValue | undefined) => {
  if (node === undefined) return []
  if (node.kind !== "map") throw new TypeError("Metadata must be a map")
  return node.entries.map(([label, value]) => ({
    label: uint(label, "Metadata label"),
    value: parseMetadataValue(value),
  }))
}
const rawScript = (node: CborValue, kind: TransactionScriptInspection["kind"]): TransactionScriptInspection => ({
  kind,
  cbor: cborHex(node),
  ...(node.kind === "bytes" ? { bytes: bytesToHex(node.value) } : {}),
})
const parseRedeemers = (node: CborValue | undefined): TransactionWitnessInspection["redeemers"] => {
  if (node === undefined) return []
  if (node.kind === "array")
    return node.values.map((item) => {
      const v = tuple(item, "Redeemer"),
        units = tuple(v[3] as CborValue, "Redeemer ex-units")
      return {
        tag: uint(v[0], "Redeemer tag"),
        index: uint(v[1], "Redeemer index"),
        dataCbor: cborHex(v[2] as CborValue),
        memory: uint(units[0], "Redeemer memory"),
        steps: uint(units[1], "Redeemer steps"),
      }
    })
  if (node.kind === "map")
    return node.entries.map(([key, value]) => {
      const k = tuple(key, "Redeemer key"),
        v = tuple(value, "Redeemer value"),
        units = tuple(v[1] as CborValue, "Redeemer ex-units")
      return {
        tag: uint(k[0], "Redeemer tag"),
        index: uint(k[1], "Redeemer index"),
        dataCbor: cborHex(v[0] as CborValue),
        memory: uint(units[0], "Redeemer memory"),
        steps: uint(units[1], "Redeemer steps"),
      }
    })
  throw new TypeError("Redeemers must be an array or map")
}
const parseWitnesses = (node: CborValue): TransactionWitnessInspection => {
  const known = new Set([0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n])
  return {
    vkeys: sequence(field(node, 0n)).map((item) => {
      const v = tuple(item, "VKey witness")
      return { publicKey: bytes(v[0], "VKey"), signature: bytes(v[1], "VKey signature") }
    }),
    bootstrap: sequence(field(node, 2n)).map((item) => {
      const v = tuple(item, "Bootstrap witness")
      return {
        publicKey: bytes(v[0], "Bootstrap public key"),
        signature: bytes(v[1], "Bootstrap signature"),
        chainCode: bytes(v[2], "Bootstrap chain code"),
        attributes: bytes(v[3], "Bootstrap attributes"),
      }
    }),
    nativeScripts: sequence(field(node, 1n)).map((item) => rawScript(item, "native")),
    plutusV1Scripts: sequence(field(node, 3n)).map((item) => rawScript(item, "plutus-v1")),
    datums: sequence(field(node, 4n)).map((item) => ({ cbor: cborHex(item) })),
    redeemers: parseRedeemers(field(node, 5n)),
    plutusV2Scripts: sequence(field(node, 6n)).map((item) => rawScript(item, "plutus-v2")),
    plutusV3Scripts: sequence(field(node, 7n)).map((item) => rawScript(item, "plutus-v3")),
    unknownFields:
      node.kind === "map"
        ? node.entries.filter(([key]) => key.kind !== "unsigned" || !known.has(key.value)).map(unknownField)
        : [],
  }
}
const parseAuxiliary = (node: CborValue): TransactionAuxiliaryDataInspection => {
  const payload = node.kind === "tag" && node.tag === 259n ? node.value : node
  const structuredMap = node.kind === "tag" && node.tag === 259n && payload.kind === "map"
  const component = (key: bigint, index: number) =>
    structuredMap ? field(payload, key) : payload.kind === "array" ? payload.values[index] : undefined
  const metadata = node.kind === "map" ? node : component(0n, 0)
  return {
    metadata: parseMetadata(metadata),
    nativeScripts: sequence(component(1n, 1)).map((v) => rawScript(v, "native")),
    plutusV1Scripts: sequence(component(2n, 2)).map((v) => rawScript(v, "plutus-v1")),
    plutusV2Scripts: sequence(component(3n, 3)).map((v) => rawScript(v, "plutus-v2")),
    plutusV3Scripts: sequence(component(4n, 4)).map((v) => rawScript(v, "plutus-v3")),
    unknownFields:
      node.kind === "tag" && payload.kind === "map"
        ? payload.entries.filter(([key]) => key.kind !== "unsigned" || key.value > 4n).map(unknownField)
        : [],
  }
}

const parseBody = (node: CborValue): TransactionBodyInspection => {
  const known = new Set([0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 11n, 13n, 14n, 15n, 16n, 17n, 18n, 19n, 20n, 21n, 22n])
  const outputs = sequence(field(node, 1n)).map(parseOutput)
  const withdrawalsNode = field(node, 5n)
  const withdrawals =
    withdrawalsNode === undefined
      ? []
      : withdrawalsNode.kind === "map"
        ? withdrawalsNode.entries.map(([account, amount]) => ({
            rewardAccount: address(account, "Withdrawal account"),
            amount: uint(amount, "Withdrawal amount"),
          }))
        : (() => {
            throw new TypeError("Withdrawals must be a map")
          })()
  const update = field(node, 6n)
  let protocolUpdate: TransactionBodyInspection["protocolUpdate"]
  if (update !== undefined) {
    const values = tuple(update, "Protocol update"),
      proposals = values[0]
    if (proposals?.kind !== "map") throw new TypeError("Protocol proposals must be a map")
    protocolUpdate = {
      epoch: uint(values[1], "Protocol update epoch"),
      proposals: proposals.entries.map(([hash, parameters]) => {
        if (parameters.kind !== "map") throw new TypeError("Protocol parameters must be a map")
        return {
          genesisHash: bytes(hash, "Genesis hash"),
          parameters: parameters.entries.map(([key, value]) => ({
            key: uint(key, "Protocol parameter key"),
            cbor: cborHex(value),
            ...(value.kind === "unsigned" || value.kind === "negative" ? { integer: value.value } : {}),
          })),
        }
      }),
    }
  }
  const voting = field(node, 19n)
  const votingProcedures: TransactionBodyInspection["votingProcedures"] =
    voting === undefined
      ? []
      : voting.kind === "map"
        ? voting.entries.map(([voter, votes]) => {
            const voterValues = tuple(voter, "Voter"),
              kind = Number(uint(voterValues[0], "Voter kind"))
            if (votes.kind !== "map") throw new TypeError("Voter procedures must be a map")
            const voterModel: TransactionBodyInspection["votingProcedures"][number]["voter"] =
              kind === 4
                ? { kind, poolId: bytes(voterValues[1], "Voter pool ID") }
                : {
                    kind,
                    credential: {
                      type: kind === 0 || kind === 2 ? "key" : "script",
                      hash: bytes(voterValues[1], "Voter credential"),
                    },
                  }
            return {
              voter: voterModel,
              votes: votes.entries.map(([id, procedure]) => {
                const idValues = tuple(id, "Governance action ID"),
                  p = tuple(procedure, "Voting procedure")
                return {
                  transactionId: bytes(idValues[0], "Governance transaction ID"),
                  index: uint(idValues[1], "Governance action index"),
                  vote: Number(uint(p[0], "Vote")),
                  ...(p[1]?.kind !== "null" ? { anchor: anchor(p[1]) } : {}),
                }
              }),
            }
          })
        : (() => {
            throw new TypeError("Voting procedures must be a map")
          })()
  const proposals = sequence(field(node, 20n)).map((proposal) => {
    const p = tuple(proposal, "Proposal procedure"),
      action = tuple(p[2] as CborValue, "Governance action")
    return {
      deposit: uint(p[0], "Proposal deposit"),
      rewardAccount: address(p[1], "Proposal reward account"),
      action: { kind: Number(uint(action[0], "Governance action kind")), cbor: cborHex(p[2] as CborValue) },
      anchor: anchor(p[3]),
    }
  })
  return {
    inputs: sequence(field(node, 0n)).map(parseInput),
    outputs,
    fee: uint(field(node, 2n), "Transaction fee"),
    validity: {
      ...(field(node, 8n) !== undefined ? { invalidBefore: uint(field(node, 8n), "Validity start") } : {}),
      ...(field(node, 3n) !== undefined ? { invalidHereafter: uint(field(node, 3n), "TTL") } : {}),
    },
    certificates: sequence(field(node, 4n)).map(parseCertificate),
    withdrawals,
    ...(protocolUpdate ? { protocolUpdate } : {}),
    ...(field(node, 7n) !== undefined ? { auxiliaryDataHash: bytes(field(node, 7n), "Auxiliary data hash") } : {}),
    mint: parseMint(field(node, 9n)),
    ...(field(node, 11n) !== undefined ? { scriptDataHash: bytes(field(node, 11n), "Script data hash") } : {}),
    collateralInputs: sequence(field(node, 13n)).map(parseInput),
    requiredSigners: sequence(field(node, 14n)).map((v) => bytes(v, "Required signer")),
    ...(field(node, 15n) !== undefined ? { networkId: Number(uint(field(node, 15n), "Network ID")) } : {}),
    ...(field(node, 16n) !== undefined ? { collateralReturn: parseOutput(field(node, 16n) as CborValue, 0) } : {}),
    ...(field(node, 17n) !== undefined ? { totalCollateral: uint(field(node, 17n), "Total collateral") } : {}),
    referenceInputs: sequence(field(node, 18n)).map(parseInput),
    votingProcedures,
    proposalProcedures: proposals,
    ...(field(node, 21n) !== undefined
      ? { currentTreasuryValue: uint(field(node, 21n), "Current treasury value") }
      : {}),
    ...(field(node, 22n) !== undefined ? { donation: uint(field(node, 22n), "Donation") } : {}),
    unknownFields:
      node.kind === "map"
        ? node.entries.filter(([key]) => key.kind !== "unsigned" || !known.has(key.value)).map(unknownField)
        : [],
  }
}

const deepFreeze = <T>(value: T): T => {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value
  for (const item of Object.values(value)) deepFreeze(item)
  return Object.freeze(value)
}

/** Inspect only information intrinsic to an ordinary Cardano transaction envelope. */
export const inspectTransaction = (cbor: string): TransactionInspection => {
  const transaction = CardanoLib.Transaction.from_cbor_hex(cbor)
  const parts = getTransactionParts(transaction)
  const body = parseBody(decodeCbor(parts.body.to_cbor_bytes()))
  const witnessNode = decodeCbor(parts.witnessSet.to_cbor_bytes())
  const witnesses = parseWitnesses(witnessNode)
  const hasWitnesses = witnessNode.kind === "map" && witnessNode.entries.length > 0
  const auxiliaryData = parts.auxiliaryData
    ? parseAuxiliary(decodeCbor(parts.auxiliaryData.to_cbor_bytes()))
    : undefined
  return deepFreeze({
    cbor,
    hash: CardanoLib.hash_transaction(parts.body).to_hex(),
    body,
    ...body,
    isValid: parts.isValid,
    witnessState: hasWitnesses ? "present" : "empty",
    witnesses,
    ...(auxiliaryData ? { auxiliaryData } : {}),
  })
}
