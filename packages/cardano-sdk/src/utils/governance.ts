import { CardanoLib, CW3Types } from "../index.js"
import { bech32 } from "@scure/base"
import { Buffer } from "buffer"

export const toDRep = (drep: CW3Types.DRep): CardanoLib.DRep => {
  if (drep === "AlwaysAbstain") {
    return CardanoLib.DRep.new(2n)
  } else if (drep === "AlwaysNoConfidence") {
    return CardanoLib.DRep.new(3n)
  } else {
    try {
      const drepCredentials = getDRepCredentials(drep)
      switch (drepCredentials.type) {
        case "key":
          return CardanoLib.DRep.new(0n, CardanoLib.Ed25519KeyHash.from_hex(drepCredentials.hash).to_raw_bytes())
        case "script":
          return CardanoLib.DRep.new(1n, CardanoLib.ScriptHash.from_hex(drepCredentials.hash).to_raw_bytes())
        default:
          throw new Error(`Unsupported DRep type: ${drepCredentials.type}`)
      }
    } catch (error) {
      throw new Error(`Unexpected DRep type: ${drep}`)
    }
  }
}

export const getDRepCredentials = (drepBech32: string): CW3Types.Credential => {
  const { words } = bech32.decode(drepBech32, 1023)
  const payload = bech32.fromWords(words)
  const header = payload[0]
  const hash = payload.slice(1)
  const isDrepGovCred = (header & 0x20) === 0x20
  const isScriptHash = (header & 0x03) === 0x03

  if (!isDrepGovCred) {
    throw new Error(`Invalid DRep Bech32 header: ${header}`)
  }

  return {
    type: isScriptHash ? "script" : "key",
    hash: Buffer.from(hash).toString("hex"),
  }
}
