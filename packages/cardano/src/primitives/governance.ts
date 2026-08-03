import * as CardanoLib from "@xray-network/xray-cardano-lib"
import type * as CardanoTypes from "../types.js"
import {
  ProvisionalGovernanceCredentialId,
  ProvisionalGovernanceCredentialRole,
} from "@xray-network/xray-cardano-lib-cip/cip129"

export const toDRep = (drep: CardanoTypes.DRep): CardanoLib.DRep => {
  if (drep === "AlwaysAbstain") {
    return CardanoLib.DRep.new_always_abstain()
  } else if (drep === "AlwaysNoConfidence") {
    return CardanoLib.DRep.new_always_no_confidence()
  } else {
    try {
      const drepCredentials = getDRepCredentials(drep)
      switch (drepCredentials.type) {
        case "key":
          return CardanoLib.DRep.new_key(CardanoLib.Ed25519KeyHash.from_hex(drepCredentials.hash))
        case "script":
          return CardanoLib.DRep.new_script(CardanoLib.ScriptHash.from_hex(drepCredentials.hash))
        default:
          throw new Error(`Unsupported DRep type: ${drepCredentials.type}`)
      }
    } catch (error) {
      throw new Error(`Unexpected DRep type: ${drep}`)
    }
  }
}

export const getDRepCredentials = (drepBech32: string): CardanoTypes.Credential => {
  const identifier = ProvisionalGovernanceCredentialId.from_bech32(drepBech32)
  if (identifier.role() !== ProvisionalGovernanceCredentialRole.DRep) throw new Error("Governance ID is not a DRep")
  const credential = identifier.credential()
  const keyHash = credential.as_pub_key()
  const scriptHash = credential.as_script()
  if (scriptHash) return { type: "script", hash: scriptHash.to_hex() }
  if (keyHash) return { type: "key", hash: keyHash.to_hex() }
  throw new TypeError("DRep identifier has no credential hash")
}
