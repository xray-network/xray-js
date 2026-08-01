import {
  Data as PlutusData,
  type DataSchema,
  type PlutusDataValue,
  type StaticSchema,
} from "@xray-network/xray-cardano-lib"
import { decodeCbor, encodeCbor } from "@xray-network/xray-cardano-lib-core"
import { CardanoLib, UPLC, CW3Types } from "@"
import { fromHex, toHex } from "./misc"

export const scriptToScriptRef = (script: CW3Types.Script): CardanoLib.ScriptRef => {
  const coreScript = (() => {
    switch (script.language) {
      case "Native":
        return CardanoLib.Script.new(0n, CardanoLib.NativeScript.from_cbor_hex(script.script))
      case "PlutusV1":
        return CardanoLib.Script.new(
          1n,
          CardanoLib.PlutusV1Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
        )
      case "PlutusV2":
        return CardanoLib.Script.new(
          2n,
          CardanoLib.PlutusV2Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
        )
      case "PlutusV3":
        return CardanoLib.Script.new(
          3n,
          CardanoLib.PlutusV3Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
        )
      default:
        throw new Error("scriptToScriptRef: Wrong script language")
    }
  })()

  return CardanoLib.ScriptRef.from_cbor_bytes(
    encodeCbor({
      kind: "tag",
      tag: 24n,
      value: {
        kind: "bytes",
        value: coreScript.to_cbor_bytes(),
        encoding: { kind: "definite", width: 0 },
      },
      encoding: { width: 0 },
    })
  )
}

export const scriptToAddress = (
  script: CW3Types.Script,
  netoworkId: CW3Types.NetworkId,
  stakeCredential?: CW3Types.Credential
): string => {
  const validatorHash = scriptToScriptHash(script)
  if (stakeCredential) {
    return CardanoLib.BaseAddress.new(
      netoworkId,
      CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(validatorHash)),
      stakeCredential.type === "key"
        ? CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakeCredential.hash))
        : CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(stakeCredential.hash))
    )
      .to_address()
      .to_bech32(undefined)
  } else {
    return CardanoLib.EnterpriseAddress.new(
      netoworkId,
      CardanoLib.Credential.new_script(CardanoLib.ScriptHash.from_hex(validatorHash))
    )
      .to_address()
      .to_bech32(undefined)
  }
}

export const scriptToPlutusScript = (script: CW3Types.Script): CardanoLib.PlutusScript => {
  switch (script.language) {
    case "PlutusV1":
      return CardanoLib.PlutusScript.from_v1(
        CardanoLib.PlutusV1Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
      )
    case "PlutusV2":
      return CardanoLib.PlutusScript.from_v2(
        CardanoLib.PlutusV2Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
      )
    case "PlutusV3":
      return CardanoLib.PlutusScript.from_v3(
        CardanoLib.PlutusV3Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
      )
    default:
      throw new Error("scriptToPlutusScript: Wrong script language")
  }
}

export const scriptToScriptHash = (script: CW3Types.Script): string => {
  switch (script.language) {
    case "Native":
      return CardanoLib.NativeScript.from_cbor_hex(script.script).hash().to_hex()
    case "PlutusV1":
      return CardanoLib.PlutusScript.from_v1(
        CardanoLib.PlutusV1Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
      )
        .hash()
        .to_hex()
    case "PlutusV2":
      return CardanoLib.PlutusScript.from_v2(
        CardanoLib.PlutusV2Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
      )
        .hash()
        .to_hex()
    case "PlutusV3":
      return CardanoLib.PlutusScript.from_v3(
        CardanoLib.PlutusV3Script.from_cbor_hex(applyDoubleCborEncoding(script.script))
      )
        .hash()
        .to_hex()
    default:
      throw new Error("scriptToScriptHash: Wrong script language")
  }
}

export const partialPlutusWitness = (
  script: CardanoLib.PlutusScript,
  redeemer: string
): CardanoLib.PartialPlutusWitness => {
  return CardanoLib.PartialPlutusWitness.new(
    CardanoLib.PlutusScriptWitness.new_script(script),
    CardanoLib.PlutusData.from_cbor_hex(redeemer)
  )
}

export const applyDoubleCborEncoding = (script: string): string => {
  const scriptBytes = fromHex(script)
  const encodeBytes = (bytes: Uint8Array): Uint8Array =>
    encodeCbor({
      kind: "bytes",
      value: bytes,
      encoding: { kind: "definite", width: 0 },
    })

  try {
    const outer = decodeCbor(scriptBytes)
    if (outer.kind !== "bytes") throw new TypeError("CBOR value is not a byte string")
    decodeCbor(outer.value)
    return script
  } catch {
    try {
      decodeCbor(scriptBytes)
      return toHex(encodeBytes(scriptBytes))
    } catch {
      return toHex(encodeBytes(encodeBytes(scriptBytes)))
    }
  }
}

export const nativeScriptFromJson = (
  json: CW3Types.NativeConfig
): {
  policyId: string
  script: CW3Types.Script
} => {
  const parseNativeScript = (json: CW3Types.NativeConfig) => {
    switch (json.type) {
      case "sig":
        return CardanoLib.NativeScript.new_script_pubkey(CardanoLib.Ed25519KeyHash.from_hex(json.keyHash))
      case "before":
        return CardanoLib.NativeScript.new_script_invalid_hereafter(BigInt(json.slot))
      case "after":
        return CardanoLib.NativeScript.new_script_invalid_before(BigInt(json.slot))
      case "all": {
        const nativeList = CardanoLib.NativeScriptList.new()
        json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
        return CardanoLib.NativeScript.new_script_all(nativeList)
      }
      case "any": {
        const nativeList = CardanoLib.NativeScriptList.new()
        json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
        return CardanoLib.NativeScript.new_script_any(nativeList)
      }
      case "atLeast": {
        const nativeList = CardanoLib.NativeScriptList.new()
        json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
        return CardanoLib.NativeScript.new_script_n_of_k(BigInt(json.required), nativeList)
      }
    }
  }
  const script: CW3Types.Script = {
    language: "Native",
    script: parseNativeScript(json).to_cbor_hex(),
  }
  const policyId = scriptToScriptHash(script)
  return {
    policyId,
    script,
  }
}

export function applyParamsToScript<S extends DataSchema>(
  plutusScript: string,
  params: CW3Types.Exact<StaticSchema<S>>,
  type: S
): string
export function applyParamsToScript(plutusScript: string, params: PlutusDataValue[]): string
export function applyParamsToScript(plutusScript: string, params: unknown, type?: DataSchema): string {
  const p = type ? PlutusData.castTo(params as never, type) : params
  if (!Array.isArray(p)) throw new TypeError("Script parameters must encode as a Plutus Data list")
  const scriptBytes = fromHex(plutusScript)
  const outer = decodeCbor(scriptBytes)
  const normalizedScript = (() => {
    if (outer.kind !== "bytes") return scriptBytes
    try {
      return decodeCbor(outer.value).kind === "bytes" ? outer.value : scriptBytes
    } catch {
      return scriptBytes
    }
  })()
  return toHex(UPLC.applyParamsToScript(fromHex(PlutusData.to(p as PlutusDataValue[])), normalizedScript))
}
