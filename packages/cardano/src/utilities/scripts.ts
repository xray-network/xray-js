import {
  Data as PlutusData,
  SerializedPlutusScript,
  type DataSchema,
  type PlutusDataValue,
  type StaticSchema,
} from "@xray-network/xray-cardano-lib-plutus"
import * as CardanoLib from "@xray-network/xray-cardano-lib-chain"
import { ScriptHash } from "@xray-network/xray-cardano-lib-crypto"
import * as UPLC from "@xray-network/xray-cardano-lib-plutus"
import type * as CardanoTypes from "../types.js"
import { fromHex, toHex } from "./encoding.js"

const serializedPlutusScript = (script: string): SerializedPlutusScript => {
  const bytes = fromHex(script)
  const candidates = [
    () => SerializedPlutusScript.from_raw_flat(bytes),
    () => SerializedPlutusScript.from_single_cbor(bytes),
    () => SerializedPlutusScript.from_double_cbor(bytes),
  ]
    .map((parse) => {
      try {
        return parse()
      } catch {
        return undefined
      }
    })
    .filter((candidate): candidate is SerializedPlutusScript => candidate !== undefined)

  if (candidates.length !== 1) {
    throw new TypeError(
      candidates.length === 0
        ? "Plutus script is not valid raw Flat, single-CBOR, or double-CBOR"
        : "Plutus script serialization is ambiguous"
    )
  }
  return candidates[0]
}

const plutusLedgerScript = (
  script: string,
  language: "PlutusV1" | "PlutusV2" | "PlutusV3"
): CardanoLib.PlutusScript => {
  const bytes = serializedPlutusScript(script).to_single_cbor()
  switch (language) {
    case "PlutusV1":
      return CardanoLib.PlutusScript.from_v1(CardanoLib.PlutusV1Script.from_raw_bytes(bytes))
    case "PlutusV2":
      return CardanoLib.PlutusScript.from_v2(CardanoLib.PlutusV2Script.from_raw_bytes(bytes))
    case "PlutusV3":
      return CardanoLib.PlutusScript.from_v3(CardanoLib.PlutusV3Script.from_raw_bytes(bytes))
  }
}

export const scriptToScriptRef = (script: CardanoTypes.Script): CardanoLib.ScriptRef => {
  const coreScript = (() => {
    switch (script.language) {
      case "Native":
        return CardanoLib.Script.new_native(CardanoLib.NativeScript.from_cbor_hex(script.script))
      case "PlutusV1":
        return plutusLedgerScript(script.script, script.language).to_script()
      case "PlutusV2":
        return plutusLedgerScript(script.script, script.language).to_script()
      case "PlutusV3":
        return plutusLedgerScript(script.script, script.language).to_script()
      default:
        throw new Error("scriptToScriptRef: Wrong script language")
    }
  })()

  return CardanoLib.ScriptRef.new_script(coreScript)
}

export const scriptToAddress = (
  script: CardanoTypes.Script,
  networkId: CardanoTypes.NetworkId,
  stakeCredential?: CardanoTypes.Credential
): string => {
  const validatorHash = scriptToScriptHash(script)
  if (stakeCredential) {
    return CardanoLib.BaseAddress.new(
      networkId,
      CardanoLib.Credential.new_script(ScriptHash.from_hex(validatorHash)),
      stakeCredential.type === "key"
        ? CardanoLib.Credential.new_pub_key(CardanoLib.Ed25519KeyHash.from_hex(stakeCredential.hash))
        : CardanoLib.Credential.new_script(ScriptHash.from_hex(stakeCredential.hash))
    )
      .to_address()
      .to_bech32(undefined)
  } else {
    return CardanoLib.EnterpriseAddress.new(
      networkId,
      CardanoLib.Credential.new_script(ScriptHash.from_hex(validatorHash))
    )
      .to_address()
      .to_bech32(undefined)
  }
}

export const scriptToPlutusScript = (script: CardanoTypes.Script): CardanoLib.PlutusScript => {
  switch (script.language) {
    case "PlutusV1":
    case "PlutusV2":
    case "PlutusV3":
      return plutusLedgerScript(script.script, script.language)
    default:
      throw new Error("scriptToPlutusScript: Wrong script language")
  }
}

export const scriptToScriptHash = (script: CardanoTypes.Script): string => {
  switch (script.language) {
    case "Native":
      return CardanoLib.NativeScript.from_cbor_hex(script.script).hash().to_hex()
    case "PlutusV1":
    case "PlutusV2":
    case "PlutusV3":
      return plutusLedgerScript(script.script, script.language).hash().to_hex()
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
  return toHex(serializedPlutusScript(script).to_double_cbor())
}

export const nativeScriptFromJson = (
  json: CardanoTypes.NativeConfig
): {
  policyId: string
  script: CardanoTypes.Script
} => {
  const parseNativeScript = (json: CardanoTypes.NativeConfig) => {
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
  const script: CardanoTypes.Script = {
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
  params: CardanoTypes.Exact<StaticSchema<S>>,
  type: S
): string
export function applyParamsToScript(plutusScript: string, params: PlutusDataValue[]): string
export function applyParamsToScript(plutusScript: string, params: unknown, type?: DataSchema): string {
  const p = type ? PlutusData.castTo(params as never, type) : params
  if (!Array.isArray(p)) throw new TypeError("Script parameters must encode as a Plutus Data list")
  return toHex(
    UPLC.applyParamsToScript(
      fromHex(PlutusData.to(p as PlutusDataValue[])),
      serializedPlutusScript(plutusScript).to_single_cbor()
    )
  )
}
