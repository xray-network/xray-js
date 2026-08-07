import { Bip32PublicKey } from "@xray-network/xray-cardano-lib-crypto"
import { CIP4, type CIP4Checksum } from "@xray-network/xray-cardano-lib-cip/cip4"

export default function walletChecksum(xpubKey: string): CIP4Checksum {
  const publicKeyHash = Bip32PublicKey.from_bech32(xpubKey).to_raw_key().hash().to_hex()
  return CIP4.calculateChecksum(publicKeyHash)
}
