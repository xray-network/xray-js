import { Bip32PublicKey, CIP4, type CIP4Checksum } from "@xray-network/xray-cardano-lib"

export default function walletChecksum(xpubKey: string): CIP4Checksum {
  const publicKeyHash = Bip32PublicKey.from_bech32(xpubKey).to_raw_key().hash().to_hex()
  return CIP4.calculateChecksum(publicKeyHash)
}
