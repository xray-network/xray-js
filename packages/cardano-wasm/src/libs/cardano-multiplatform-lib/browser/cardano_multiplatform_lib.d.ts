/* tslint:disable */
/* eslint-disable */
/**
 * Encrypt using Emip3: https://github.com/Emurgo/EmIPs/blob/master/specs/emip-003.md
 */
export function emip3_encrypt_with_password(password: string, salt: string, nonce: string, data: string): string;
/**
 * Decrypt using Emip3: https://github.com/Emurgo/EmIPs/blob/master/specs/emip-003.md
 */
export function emip3_decrypt_with_password(password: string, data: string): string;
export function make_vkey_witness(tx_body_hash: TransactionHash, sk: PrivateKey): Vkeywitness;
export function make_daedalus_bootstrap_witness(tx_body_hash: TransactionHash, addr: ByronAddress, key: LegacyDaedalusPrivateKey): BootstrapWitness;
export function make_icarus_bootstrap_witness(tx_body_hash: TransactionHash, addr: ByronAddress, key: Bip32PrivateKey): BootstrapWitness;
export function hash_auxiliary_data(auxiliary_data: AuxiliaryData): AuxiliaryDataHash;
export function hash_transaction(tx_body: TransactionBody): TransactionHash;
export function hash_plutus_data(plutus_data: PlutusData): DatumHash;
/**
 * Calculates the hash for script data (no plutus scripts) if it is necessary.
 * Returns None if it was not necessary (no datums/redeemers) to include.
 *
 * Most users will not directly need this as when using the builders
 * it will be invoked for you.
 *
 * Note: This WASM binding does not work with non-standard witness set
 * encodings. If you created the witness set manually this is not an issue
 * but for constructing it from deserializing a transaction/witness then
 * please use calc_script_data_hash_from_witness()
 */
export function hash_script_data(redeemers: Redeemers, cost_models: CostModels, datums?: PlutusDataList | null): ScriptDataHash;
/**
 * Calculates the hash for script data (with plutus scripts) if it is necessary.
 * Returns None if it was not necessary (no datums/redeemers) to include.
 *
 * Most users will not directly need this as when using the builders
 * it will be invoked for you.
 *
 * Note: This WASM binding does not work with non-standard witness set
 * encodings. If you created the witness set manually this is not an issue
 * but for constructing it from deserializing a transaction/witness then
 * please use calc_script_data_hash_from_witness()
 */
export function calc_script_data_hash(redeemers: Redeemers, datums: PlutusDataList, cost_models: CostModels, used_langs: LanguageList): ScriptDataHash | undefined;
/**
 * Calculates the hash for script data from a witness if it is necessary.
 * Returns None if it was not necessary (no datums/redeemers) to include.
 *
 * Most users will not directly need this as when using the builders
 * it will be invoked for you.
 */
export function calc_script_data_hash_from_witness(witnesses: TransactionWitnessSet, cost_models: CostModels): ScriptDataHash | undefined;
export function genesis_txid_byron(pubkey: PublicKey, protocol_magic?: number | null): ByronGenesisRedeem;
export function genesis_txid_shelley(address: Address): TransactionHash;
export function compute_total_ex_units(redeemers: Redeemers): ExUnits;
/**
 * encodes arbitrary bytes into chunks of 64 bytes (the limit for bytes) as a list to be valid Metadata
 */
export function encode_arbitrary_bytes_as_metadatum(bytes: Uint8Array): TransactionMetadatum;
/**
 * decodes from chunks of bytes in a list to a byte vector if that is the metadata format, otherwise returns None
 */
export function decode_arbitrary_bytes_from_metadatum(metadata: TransactionMetadatum): Uint8Array | undefined;
/**
 *
 * * Min fee for JUST the script, NOT including ref inputs
 * 
 */
export function min_script_fee(tx: Transaction, ex_unit_prices: ExUnitPrices): bigint;
export function min_no_script_fee(tx: Transaction, linear_fee: LinearFee): bigint;
/**
 *
 * * Calculates the cost of all ref scripts
 * * * `total_ref_script_size` - Total size (original, not hashes) of all ref scripts. Duplicate scripts are counted as many times as they occur
 * 
 */
export function min_fee(tx: Transaction, linear_fee: LinearFee, ex_unit_prices: ExUnitPrices, total_ref_script_size: bigint): bigint;
export function get_implicit_input(txbody: TransactionBody, pool_deposit: bigint, key_deposit: bigint): Value;
export function get_deposit(txbody: TransactionBody, pool_deposit: bigint, key_deposit: bigint): bigint;
/**
 * Converts JSON to Metadata according to MetadataJsonSchema
 */
export function encode_json_str_to_metadatum(json: string, schema: MetadataJsonSchema): TransactionMetadatum;
/**
 * Converts Metadata to JSON according to MetadataJsonSchema
 */
export function decode_metadatum_to_json_str(metadatum: TransactionMetadatum, schema: MetadataJsonSchema): string;
export function encode_json_str_to_plutus_datum(json: string, schema: CardanoNodePlutusDatumSchema): PlutusData;
export function decode_plutus_datum_to_json_str(datum: PlutusData, schema: CardanoNodePlutusDatumSchema): string;
export function min_ada_required(output: TransactionOutput, coins_per_utxo_byte: bigint): bigint;
/**
 * Careful: this enum doesn't include the network ID part of the header
 * ex: base address isn't 0b0000_0000 but instead 0b0000
 * Use `header_matches_kind` if you don't want to implement the bitwise operators yourself
 */
export enum AddressHeaderKind {
  BasePaymentKeyStakeKey = 0,
  BasePaymentScriptStakeKey = 1,
  BasePaymentKeyStakeScript = 2,
  BasePaymentScriptStakeScript = 3,
  PointerKey = 4,
  PointerScript = 5,
  EnterpriseKey = 6,
  EnterpriseScript = 7,
  Byron = 8,
  RewardKey = 14,
  RewardScript = 15,
}
export enum AddressKind {
  Base = 0,
  Ptr = 1,
  Enterprise = 2,
  Reward = 3,
  Byron = 4,
}
export enum AuxiliaryDataKind {
  Shelley = 0,
  ShelleyMA = 1,
  Conway = 2,
}
export enum ByronAddrType {
  PublicKey = 0,
  Script = 1,
  Redeem = 2,
}
/**
 * Which version of the CIP25 spec to use. See CIP25 for details.
 * This will change how things are encoded but for the most part contains
 * the same information.
 */
export enum CIP25Version {
  /**
   * Initial version of CIP25 with only string (utf8) asset names allowed.
   */
  V1 = 0,
  /**
   * Second version of CIP25. Supports any type of asset names.
   */
  V2 = 1,
}
/**
 * JSON <-> PlutusData conversion schemas.
 * Follows ScriptDataJsonSchema in cardano-cli defined at:
 * https://github.com/input-output-hk/cardano-node/blob/master/cardano-api/src/Cardano/Api/ScriptData.hs#L254
 *
 * All methods here have the following restrictions due to limitations on dependencies:
 * * JSON numbers above u64::MAX (positive) or below i64::MIN (negative) will throw errors
 * * Hex strings for bytes don't accept odd-length (half-byte) strings.
 *      cardano-cli seems to support these however but it seems to be different than just 0-padding
 *      on either side when tested so proceed with caution
 */
export enum CardanoNodePlutusDatumSchema {
  /**
   * ScriptDataJsonNoSchema in cardano-node.
   *
   * This is the format used by --script-data-value in cardano-cli
   * This tries to accept most JSON but does not support the full spectrum of Plutus datums.
   * From JSON:
   * * null/true/false/floats NOT supported
   * * strings starting with 0x are treated as hex bytes. All other strings are encoded as their utf8 bytes.
   * To JSON:
   * * ConstrPlutusData not supported in ANY FORM (neither keys nor values)
   * * Lists not supported in keys
   * * Maps not supported in keys
   */
  BasicConversions = 0,
  /**
   * ScriptDataJsonDetailedSchema in cardano-node.
   *
   * This is the format used by --script-data-file in cardano-cli
   * This covers almost all (only minor exceptions) Plutus datums, but the JSON must conform to a strict schema.
   * The schema specifies that ALL keys and ALL values must be contained in a JSON map with 2 cases:
   * 1. For ConstrPlutusData there must be two fields "constructor" contianing a number and "fields" containing its fields
   *    e.g. { "constructor": 2, "fields": [{"int": 2}, {"list": [{"bytes": "CAFEF00D"}]}]}
   * 2. For all other cases there must be only one field named "int", "bytes", "list" or "map"
   *    BigInteger's value is a JSON number e.g. {"int": 100}
   *    Bytes' value is a hex string representing the bytes WITHOUT any prefix e.g. {"bytes": "CAFEF00D"}
   *    Lists' value is a JSON list of its elements encoded via the same schema e.g. {"list": [{"bytes": "CAFEF00D"}]}
   *    Maps' value is a JSON list of objects, one for each key-value pair in the map, with keys "k" and "v"
   *          respectively with their values being the plutus datum encoded via this same schema
   *          e.g. {"map": [
   *              {"k": {"int": 2}, "v": {"int": 5}},
   *              {"k": {"map": [{"k": {"list": [{"int": 1}]}, "v": {"bytes": "FF03"}}]}, "v": {"list": []}}
   *          ]}
   * From JSON:
   * * null/true/false/floats NOT supported
   * * the JSON must conform to a very specific schema
   * To JSON:
   * * all Plutus datums should be fully supported outside of the integer range limitations outlined above.
   */
  DetailedSchema = 1,
}
export enum CertificateKind {
  StakeRegistration = 0,
  StakeDeregistration = 1,
  StakeDelegation = 2,
  PoolRegistration = 3,
  PoolRetirement = 4,
  RegCert = 5,
  UnregCert = 6,
  VoteDelegCert = 7,
  StakeVoteDelegCert = 8,
  StakeRegDelegCert = 9,
  VoteRegDelegCert = 10,
  StakeVoteRegDelegCert = 11,
  AuthCommitteeHotCert = 12,
  ResignCommitteeColdCert = 13,
  RegDrepCert = 14,
  UnregDrepCert = 15,
  UpdateDrepCert = 16,
}
export enum ChangeSelectionAlgo {
  Default = 0,
}
export enum ChunkableStringKind {
  Single = 0,
  Chunked = 1,
}
export enum CoinSelectionStrategyCIP2 {
  /**
   * Performs CIP2's Largest First ada-only selection. Will error if outputs contain non-ADA assets.
   */
  LargestFirst = 0,
  /**
   * Performs CIP2's Random Improve ada-only selection. Will error if outputs contain non-ADA assets.
   */
  RandomImprove = 1,
  /**
   * Same as LargestFirst, but before adding ADA, will insert by largest-first for each asset type.
   */
  LargestFirstMultiAsset = 2,
  /**
   * Same as RandomImprove, but before adding ADA, will insert by random-improve for each asset type.
   */
  RandomImproveMultiAsset = 3,
}
export enum CredentialKind {
  PubKey = 0,
  Script = 1,
}
export enum DRepKind {
  Key = 0,
  Script = 1,
  AlwaysAbstain = 2,
  AlwaysNoConfidence = 3,
}
export enum DatumOptionKind {
  Hash = 0,
  Datum = 1,
}
export enum DelegationDistributionKind {
  Weighted = 0,
  Legacy = 1,
}
export enum GovActionKind {
  ParameterChangeAction = 0,
  HardForkInitiationAction = 1,
  TreasuryWithdrawalsAction = 2,
  NoConfidence = 3,
  UpdateCommittee = 4,
  NewConstitution = 5,
  InfoAction = 6,
}
export enum Language {
  PlutusV1 = 0,
  PlutusV2 = 1,
  PlutusV3 = 2,
}
export enum MetadataJsonSchema {
  NoConversions = 0,
  BasicConversions = 1,
  DetailedSchema = 2,
}
export enum NativeScriptKind {
  ScriptPubkey = 0,
  ScriptAll = 1,
  ScriptAny = 2,
  ScriptNOfK = 3,
  ScriptInvalidBefore = 4,
  ScriptInvalidHereafter = 5,
}
export enum NonceKind {
  Identity = 0,
  Hash = 1,
}
export enum PlutusDataKind {
  ConstrPlutusData = 0,
  Map = 1,
  List = 2,
  Integer = 3,
  Bytes = 4,
}
export enum RedeemerTag {
  Spend = 0,
  Mint = 1,
  Cert = 2,
  Reward = 3,
  Voting = 4,
  Proposing = 5,
}
export enum RedeemersKind {
  ArrLegacyRedeemer = 0,
  MapRedeemerKeyToRedeemerVal = 1,
}
export enum RelayKind {
  SingleHostAddr = 0,
  SingleHostName = 1,
  MultiHostName = 2,
}
export enum ScriptKind {
  Native = 0,
  PlutusV1 = 1,
  PlutusV2 = 2,
  PlutusV3 = 3,
}
export enum SpendingDataKind {
  SpendingDataPubKey = 0,
  SpendingDataScript = 1,
  SpendingDataRedeem = 2,
}
export enum StakeDistributionKind {
  SingleKey = 0,
  BootstrapEra = 1,
}
export enum TransactionMetadatumKind {
  Map = 0,
  List = 1,
  Int = 2,
  Bytes = 3,
  Text = 4,
}
export enum TransactionOutputKind {
  AlonzoFormatTxOut = 0,
  ConwayFormatTxOut = 1,
}
export enum Vote {
  No = 0,
  Yes = 1,
  Abstain = 2,
}
export enum VoterKind {
  ConstitutionalCommitteeHotKeyHash = 0,
  ConstitutionalCommitteeHotScriptHash = 1,
  DRepKeyHash = 2,
  DRepScriptHash = 3,
  StakingPoolKeyHash = 4,
}
export class AddrAttributes {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): AddrAttributes;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): AddrAttributes;
  set_stake_distribution(stake_distribution: StakeDistribution): void;
  stake_distribution(): StakeDistribution | undefined;
  set_derivation_path(derivation_path: HDAddressPayload): void;
  derivation_path(): HDAddressPayload | undefined;
  set_protocol_magic(protocol_magic: ProtocolMagic): void;
  protocol_magic(): ProtocolMagic | undefined;
  static new(): AddrAttributes;
  static new_bootstrap_era(hdap?: HDAddressPayload | null, protocol_magic?: ProtocolMagic | null): AddrAttributes;
  static new_single_key(pubk: Bip32PublicKey, hdap: HDAddressPayload | null | undefined, protocol_magic: ProtocolMagic): AddrAttributes;
}
export class Address {
  private constructor();
  free(): void;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Address;
  /**
   * header has 4 bits addr type discrim then 4 bits network discrim.
   * Copied from shelley.cddl:
   *
   * base address
   * bits 7-6: 00
   * bit 5: stake cred is keyhash/scripthash
   * bit 4: payment cred is keyhash/scripthash
   * bits 3-0: network id
   *
   * pointer address
   * bits 7-5: 010
   * bit 4: payment cred is keyhash/scripthash
   * bits 3-0: network id
   *
   * enterprise address
   * bits 7-5: 010
   * bit 4: payment cred is keyhash/scripthash
   * bits 3-0: network id
   *
   * reward addresses:
   * bits 7-5: 111
   * bit 4: credential is keyhash/scripthash
   * bits 3-0: network id
   *
   * byron addresses:
   * bits 7-4: 1000
   * bits 3-0: unrelated data (recall: no network ID in Byron addresses)
   */
  header(): number;
  static header_matches_kind(header: number, kind: AddressHeaderKind): boolean;
  to_bech32(prefix?: string | null): string;
  static from_bech32(bech_str: string): Address;
  /**
   *
   *     * Note: bech32-encoded Byron addresses will also pass validation here
   *     
   */
  static is_valid_bech32(bech_str: string): boolean;
  static is_valid(bech_str: string): boolean;
  network_id(): number;
  /**
   * Note: by convention, the key inside reward addresses are considered payment credentials
   */
  payment_cred(): Credential | undefined;
  /**
   * Note: by convention, the key inside reward addresses are NOT considered staking credentials
   * Note: None is returned pointer addresses as the chain history is required to resolve its associated cred
   */
  staking_cred(): Credential | undefined;
  kind(): AddressKind;
  to_raw_bytes(): Uint8Array;
  static from_raw_bytes(data: Uint8Array): Address;
  to_hex(): string;
  static from_hex(hex: string): Address;
}
export class AddressContent {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): AddressContent;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): AddressContent;
  address_id(): AddressId;
  addr_attributes(): AddrAttributes;
  addr_type(): ByronAddrType;
  static new(address_id: AddressId, addr_attributes: AddrAttributes, addr_type: ByronAddrType): AddressContent;
  static hash_and_create(addr_type: ByronAddrType, spending_data: SpendingData, attributes: AddrAttributes): AddressContent;
  static new_redeem(pubkey: PublicKey, protocol_magic?: ProtocolMagic | null): AddressContent;
  static new_simple(xpub: Bip32PublicKey, protocol_magic?: ProtocolMagic | null): AddressContent;
  /**
   * Do we want to remove this or keep it for people who were using old Byron code?
   */
  to_address(): ByronAddress;
  /**
   * returns the byron protocol magic embedded in the address, or mainnet id if none is present
   * note: for bech32 addresses, you need to use network_id instead
   */
  byron_protocol_magic(): ProtocolMagic;
  network_id(): number;
  static icarus_from_key(key: Bip32PublicKey, protocol_magic: ProtocolMagic): AddressContent;
  /**
   * Check if the Addr can be reconstructed with a specific xpub
   */
  identical_with_pubkey(xpub: Bip32PublicKey): boolean;
}
export class AddressId {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): AddressId;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): AddressId;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): AddressId;
  static new(addr_type: ByronAddrType, spending_data: SpendingData, attrs: AddrAttributes): AddressId;
}
export class AlonzoFormatTxOut {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): AlonzoFormatTxOut;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): AlonzoFormatTxOut;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): AlonzoFormatTxOut;
  address(): Address;
  amount(): Value;
  set_datum_hash(datum_hash: DatumHash): void;
  datum_hash(): DatumHash | undefined;
  static new(address: Address, amount: Value): AlonzoFormatTxOut;
}
export class Anchor {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Anchor;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Anchor;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Anchor;
  anchor_url(): Url;
  anchor_doc_hash(): AnchorDocHash;
  static new(anchor_url: Url, anchor_doc_hash: AnchorDocHash): Anchor;
}
export class AnchorDocHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): AnchorDocHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): AnchorDocHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): AnchorDocHash;
}
export class AssetName {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): AssetName;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): AssetName;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): AssetName;
  /**
   *
   *     * Create an AssetName from utf8 string. 64 byte (not char!) maximum.
   *     
   */
  static from_str(utf8_str: string): AssetName;
  /**
   *
   *     * AssetName as a utf8 string if it's possible. Will error if the asset is not utf8
   *     
   */
  to_str(): string;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): AssetName;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): AssetName;
}
export class AssetNameList {
  private constructor();
  free(): void;
  static new(): AssetNameList;
  len(): number;
  get(index: number): AssetName;
  add(elem: AssetName): void;
}
export class AuthCommitteeHotCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): AuthCommitteeHotCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): AuthCommitteeHotCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): AuthCommitteeHotCert;
  committee_cold_credential(): Credential;
  committee_hot_credential(): Credential;
  static new(committee_cold_credential: Credential, committee_hot_credential: Credential): AuthCommitteeHotCert;
}
export class AuxiliaryData {
  private constructor();
  free(): void;
  static new(): AuxiliaryData;
  metadata(): Metadata | undefined;
  native_scripts(): NativeScriptList | undefined;
  plutus_v1_scripts(): PlutusV1ScriptList | undefined;
  plutus_v2_scripts(): PlutusV2ScriptList | undefined;
  /**
   * Warning: overwrites any conflicting metadatum labels present
   */
  add_metadata(other: Metadata): void;
  /**
   * Warning: does not check for duplicates and may migrate eras
   */
  add_native_scripts(scripts: NativeScriptList): void;
  /**
   * Warning: does not check for duplicates and may migrate eras
   */
  add_plutus_v1_scripts(scripts: PlutusV1ScriptList): void;
  /**
   * Warning: does not check for duplicates and may migrate eras
   */
  add_plutus_v2_scripts(scripts: PlutusV2ScriptList): void;
  /**
   * Adds everything present in other to self
   * May change the era the aux data is in if necessary
   * Warning: overwrites any metadatum labels present
   * also does not check for duplicates in scripts
   */
  add(other: AuxiliaryData): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): AuxiliaryData;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): AuxiliaryData;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): AuxiliaryData;
  static new_shelley(shelley: Metadata): AuxiliaryData;
  static new_shelley_ma(shelley_ma: ShelleyMAFormatAuxData): AuxiliaryData;
  static new_conway(conway: ConwayFormatAuxData): AuxiliaryData;
  kind(): AuxiliaryDataKind;
  as_shelley(): Metadata | undefined;
  as_shelley_ma(): ShelleyMAFormatAuxData | undefined;
  as_conway(): ConwayFormatAuxData | undefined;
}
export class AuxiliaryDataHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): AuxiliaryDataHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): AuxiliaryDataHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): AuxiliaryDataHash;
}
export class BaseAddress {
  private constructor();
  free(): void;
  static new(network: number, payment: Credential, stake: Credential): BaseAddress;
  to_address(): Address;
  static from_address(address: Address): BaseAddress | undefined;
  network_id(): number;
  payment(): Credential;
  stake(): Credential;
}
export class BigInteger {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): BigInteger;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): BigInteger;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): BigInteger;
  static from_int(x: Int): BigInteger;
  static from_str(s: string): BigInteger;
  to_str(): string;
  /**
   * Converts to a u64
   * Returns None if the number was negative or too big for a u64
   */
  as_u64(): bigint | undefined;
  /**
   * Converts to an Int
   * Returns None when the number is too big for an Int (outside +/- 64-bit unsigned)
   * Retains encoding info if the original was encoded as an Int
   */
  as_int(): Int | undefined;
}
export class Bip32PrivateKey {
  private constructor();
  free(): void;
  /**
   * derive this private key with the given index.
   *
   * # Security considerations
   *
   * * hard derivation index cannot be soft derived with the public key
   *
   * # Hard derivation vs Soft derivation
   *
   * If you pass an index below 0x80000000 then it is a soft derivation.
   * The advantage of soft derivation is that it is possible to derive the
   * public key too. I.e. derivation the private key with a soft derivation
   * index and then retrieving the associated public key is equivalent to
   * deriving the public key associated to the parent private key.
   *
   * Hard derivation index does not allow public key derivation.
   *
   * This is why deriving the private key should not fail while deriving
   * the public key may fail (if the derivation index is invalid).
   */
  derive(index: number): Bip32PrivateKey;
  /**
   * 128-byte xprv a key format in Cardano that some software still uses or requires
   * the traditional 96-byte xprv is simply encoded as
   * prv | chaincode
   * however, because some software may not know how to compute a public key from a private key,
   * the 128-byte inlines the public key in the following format
   * prv | pub | chaincode
   * so be careful if you see the term "xprv" as it could refer to either one
   * our library does not require the pub (instead we compute the pub key when needed)
   */
  static from_128_xprv(bytes: Uint8Array): Bip32PrivateKey;
  /**
   * see from_128_xprv
   */
  to_128_xprv(): Uint8Array;
  static generate_ed25519_bip32(): Bip32PrivateKey;
  to_raw_key(): PrivateKey;
  to_public(): Bip32PublicKey;
  static from_raw_bytes(bytes: Uint8Array): Bip32PrivateKey;
  to_raw_bytes(): Uint8Array;
  static from_bech32(bech32_str: string): Bip32PrivateKey;
  to_bech32(): string;
  static from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): Bip32PrivateKey;
  chaincode(): Uint8Array;
}
export class Bip32PublicKey {
  private constructor();
  free(): void;
  /**
   * derive this public key with the given index.
   *
   * # Errors
   *
   * If the index is not a soft derivation index (< 0x80000000) then
   * calling this method will fail.
   *
   * # Security considerations
   *
   * * hard derivation index cannot be soft derived with the public key
   *
   * # Hard derivation vs Soft derivation
   *
   * If you pass an index below 0x80000000 then it is a soft derivation.
   * The advantage of soft derivation is that it is possible to derive the
   * public key too. I.e. derivation the private key with a soft derivation
   * index and then retrieving the associated public key is equivalent to
   * deriving the public key associated to the parent private key.
   *
   * Hard derivation index does not allow public key derivation.
   *
   * This is why deriving the private key should not fail while deriving
   * the public key may fail (if the derivation index is invalid).
   */
  derive(index: number): Bip32PublicKey;
  to_raw_key(): PublicKey;
  static from_raw_bytes(bytes: Uint8Array): Bip32PublicKey;
  to_raw_bytes(): Uint8Array;
  static from_bech32(bech32_str: string): Bip32PublicKey;
  to_bech32(): string;
  chaincode(): Uint8Array;
}
export class Block {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Block;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Block;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Block;
  header(): Header;
  transaction_bodies(): TransactionBodyList;
  transaction_witness_sets(): TransactionWitnessSetList;
  auxiliary_data_set(): MapTransactionIndexToAuxiliaryData;
  invalid_transactions(): Uint16Array;
  static new(header: Header, transaction_bodies: TransactionBodyList, transaction_witness_sets: TransactionWitnessSetList, auxiliary_data_set: MapTransactionIndexToAuxiliaryData, invalid_transactions: Uint16Array): Block;
}
export class BlockBodyHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): BlockBodyHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): BlockBodyHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): BlockBodyHash;
}
export class BlockHeaderHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): BlockHeaderHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): BlockHeaderHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): BlockHeaderHash;
}
export class BootstrapWitness {
  private constructor();
  free(): void;
  to_address(): AddressContent;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): BootstrapWitness;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): BootstrapWitness;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): BootstrapWitness;
  public_key(): PublicKey;
  signature(): Ed25519Signature;
  chain_code(): Uint8Array;
  attributes(): AddrAttributes;
  static new(public_key: PublicKey, signature: Ed25519Signature, chain_code: Uint8Array, attributes: AddrAttributes): BootstrapWitness;
}
export class BootstrapWitnessList {
  private constructor();
  free(): void;
  static new(): BootstrapWitnessList;
  len(): number;
  get(index: number): BootstrapWitness;
  add(elem: BootstrapWitness): void;
}
export class ByronAddress {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ByronAddress;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ByronAddress;
  content(): AddressContent;
  crc(): Crc32;
  static new(content: AddressContent, crc: Crc32): ByronAddress;
  to_base58(): string;
  static from_base58(s: string): ByronAddress;
  static is_valid(s: string): boolean;
  to_address(): Address;
  static from_address(addr: Address): ByronAddress | undefined;
  static from_address_content(address_content: AddressContent): ByronAddress;
}
export class ByronGenesisRedeem {
  private constructor();
  free(): void;
  static new(txid: TransactionHash, address: ByronAddress): ByronGenesisRedeem;
  txid(): TransactionHash;
  address(): ByronAddress;
}
export class ByronScript {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): ByronScript;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): ByronScript;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): ByronScript;
}
export class ByronTxOut {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ByronTxOut;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ByronTxOut;
  address(): ByronAddress;
  amount(): bigint;
  static new(address: ByronAddress, amount: bigint): ByronTxOut;
}
/**
 * A String that may or may not be chunked into 64-byte chunks to be able
 * to conform to Cardano TX Metadata limitations.
 * Most users should simply use CIP25ChunkableString::from_string() and CIP25ChunkableString::to_string()
 * and avoid the explicit single/chunk interface:
 * ```javascript
 * let chunkableString = CIP25.CIP25ChunkableString.from_string("this can be any length and will automatically be chunked if needed");
 * ```
 */
export class CIP25ChunkableString {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP25ChunkableString;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP25ChunkableString;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25ChunkableString;
  static new_single(single: CIP25String64): CIP25ChunkableString;
  static new_chunked(chunked: CIP25String64List): CIP25ChunkableString;
  kind(): ChunkableStringKind;
  as_single(): CIP25String64 | undefined;
  as_chunked(): CIP25String64List | undefined;
  static from_string(str: string): CIP25ChunkableString;
  to_string(): string;
}
export class CIP25FilesDetails {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP25FilesDetails;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP25FilesDetails;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25FilesDetails;
  name(): CIP25String64;
  media_type(): CIP25String64;
  src(): CIP25ChunkableString;
  static new(name: CIP25String64, media_type: CIP25String64, src: CIP25ChunkableString): CIP25FilesDetails;
}
export class CIP25LabelMetadata {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP25LabelMetadata;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP25LabelMetadata;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25LabelMetadata;
  /**
   * Note that Version 1 can only support utf8 string asset names.
   * Version 2 can support any asset name.
   */
  static new(version: CIP25Version): CIP25LabelMetadata;
  /**
   * If this is version 1 and the asset name is not a utf8 asset name
   * then this will return an error.
   * This function will never return an error for version 2.
   * On success, returns the previous details that were overwritten, or None otherwise.
   */
  set(policy_id: ScriptHash, asset_name: AssetName, details: CIP25MetadataDetails): CIP25MetadataDetails | undefined;
  get(policy_id: ScriptHash, asset_name: AssetName): CIP25MetadataDetails | undefined;
  version(): CIP25Version;
}
/**
 * This is the entire metadata schema for CIP-25
 * It can be parsed by passing in the CBOR bytes of the entire transaction metadata
 * or by passing in an existing Metadata struct.
 * Parsing from CBOR bytes should be marginally faster.
 */
export class CIP25Metadata {
  private constructor();
  free(): void;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25Metadata;
  /**
   * Serialize to CBOR bytes compatible with tx metadata
   * Does not guarantee any specific type of CBOR format and should NOT
   * be used with round-tripping. It will ignore all non-CIP25 keys.
   * Use cml_cip25::metadate crate for round-tripping metadata.
   */
  to_cbor_bytes(): Uint8Array;
  /**
   * Deserialize from CBOR bytes compatible with tx metadata
   * Does not guarantee any specific type of CBOR format and should NOT
   * be used with round-tripping. It will ignore all non-CIP25 keys.
   * Use cml_cip25::metadate crate for round-tripping metadata.
   */
  static from_cbor_bytes(data: Uint8Array): CIP25Metadata;
  /**
   * The core details of the CIP25 spec
   */
  key_721(): CIP25LabelMetadata;
  static new(key_721: CIP25LabelMetadata): CIP25Metadata;
  /**
   * Create a Metadata containing only the CIP25 schema
   */
  to_metadata(): Metadata;
  /**
   * Read the CIP25 schema from a Metadata. Ignores all other data besides CIP25
   * Can fail if the Metadata does not conform to CIP25
   */
  static from_metadata(metadata: Metadata): CIP25Metadata;
  /**
   * Add to an existing metadata (could be empty) the full CIP25 metadata
   */
  add_to_metadata(metadata: Metadata): void;
}
export class CIP25MetadataDetails {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP25MetadataDetails;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP25MetadataDetails;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25MetadataDetails;
  name(): CIP25String64;
  image(): CIP25ChunkableString;
  set_media_type(media_type: CIP25String64): void;
  media_type(): CIP25String64 | undefined;
  set_description(description: CIP25ChunkableString): void;
  description(): CIP25ChunkableString | undefined;
  set_files(files: FilesDetailsList): void;
  files(): FilesDetailsList | undefined;
  static new(name: CIP25String64, image: CIP25ChunkableString): CIP25MetadataDetails;
}
export class CIP25MiniMetadataDetails {
  private constructor();
  free(): void;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25MiniMetadataDetails;
  static new(): CIP25MiniMetadataDetails;
  set_name(name: CIP25String64): void;
  name(): CIP25String64 | undefined;
  set_image(image: CIP25ChunkableString): void;
  image(): CIP25ChunkableString | undefined;
  /**
   * loose parsing of CIP25 metadata to allow for common exceptions to the format
   * `metadatum` should represent the data where the `CIP25MetadataDetails` is in the cip25 structure
   */
  static loose_parse(metadatum: TransactionMetadatum): CIP25MiniMetadataDetails;
}
/**
 * A String of at most 64 bytes.
 * This is to conform with Cardano metadata restrictions.
 */
export class CIP25String64 {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP25String64;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP25String64;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP25String64;
  get(): string;
  static new(s: string): CIP25String64;
  to_str(): string;
  get_str(): string;
}
export class CIP25String64List {
  private constructor();
  free(): void;
  static new(): CIP25String64List;
  len(): number;
  get(index: number): CIP25String64;
  add(elem: CIP25String64): void;
}
export class CIP36Delegation {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP36Delegation;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP36Delegation;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36Delegation;
  voting_pub_key(): PublicKey;
  weight(): number;
  static new(voting_pub_key: PublicKey, weight: number): CIP36Delegation;
}
export class CIP36DelegationDistribution {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP36DelegationDistribution;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP36DelegationDistribution;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36DelegationDistribution;
  static new_weighted(delegations: CIP36DelegationList): CIP36DelegationDistribution;
  static new_legacy(legacy: PublicKey): CIP36DelegationDistribution;
  kind(): DelegationDistributionKind;
  as_weighted(): CIP36DelegationList | undefined;
  as_legacy(): PublicKey | undefined;
}
export class CIP36DelegationList {
  private constructor();
  free(): void;
  static new(): CIP36DelegationList;
  len(): number;
  get(index: number): CIP36Delegation;
  add(elem: CIP36Delegation): void;
}
export class CIP36DeregistrationCbor {
  private constructor();
  free(): void;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36DeregistrationCbor;
  key_deregistration(): CIP36KeyDeregistration;
  deregistration_witness(): CIP36DeregistrationWitness;
  static new(key_deregistration: CIP36KeyDeregistration, deregistration_witness: CIP36DeregistrationWitness): CIP36DeregistrationCbor;
}
export class CIP36DeregistrationWitness {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP36DeregistrationWitness;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP36DeregistrationWitness;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36DeregistrationWitness;
  stake_witness(): Ed25519Signature;
  static new(stake_witness: Ed25519Signature): CIP36DeregistrationWitness;
}
export class CIP36KeyDeregistration {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP36KeyDeregistration;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP36KeyDeregistration;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36KeyDeregistration;
  stake_credential(): PublicKey;
  nonce(): bigint;
  set_voting_purpose(voting_purpose: bigint): void;
  voting_purpose(): bigint;
}
export class CIP36KeyRegistration {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP36KeyRegistration;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP36KeyRegistration;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36KeyRegistration;
  delegation(): CIP36DelegationDistribution;
  stake_credential(): PublicKey;
  payment_address(): Address;
  nonce(): bigint;
  set_voting_purpose(voting_purpose: bigint): void;
  voting_purpose(): bigint;
}
export class CIP36RegistrationCbor {
  private constructor();
  free(): void;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36RegistrationCbor;
  key_registration(): CIP36KeyRegistration;
  registration_witness(): CIP36RegistrationWitness;
  static new(key_registration: CIP36KeyRegistration, registration_witness: CIP36RegistrationWitness): CIP36RegistrationCbor;
}
export class CIP36RegistrationWitness {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CIP36RegistrationWitness;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CIP36RegistrationWitness;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CIP36RegistrationWitness;
  stake_witness(): Ed25519Signature;
  static new(stake_witness: Ed25519Signature): CIP36RegistrationWitness;
}
export class Certificate {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Certificate;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Certificate;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Certificate;
  /**
   * Will be deprecated in the next era. Use RegCert instead which takes an explicit deposit amount, as that can change.
   */
  static new_stake_registration(stake_credential: Credential): Certificate;
  /**
   * Will be deprecated in the next era. Use UnregCert instead which takes an explicit deposit amount, as that can change.
   */
  static new_stake_deregistration(stake_credential: Credential): Certificate;
  /**
   * Delegate to a take pool only
   */
  static new_stake_delegation(stake_credential: Credential, pool: Ed25519KeyHash): Certificate;
  static new_pool_registration(pool_params: PoolParams): Certificate;
  static new_pool_retirement(pool: Ed25519KeyHash, epoch: bigint): Certificate;
  /**
   * Registers a stake credential.
   */
  static new_reg_cert(stake_credential: Credential, deposit: bigint): Certificate;
  /**
   * Unregisters a stake credential.
   */
  static new_unreg_cert(stake_credential: Credential, deposit: bigint): Certificate;
  /**
   * Delegate to a DRep for voting only
   */
  static new_vote_deleg_cert(stake_credential: Credential, d_rep: DRep): Certificate;
  /**
   * Delegate to a stake pool and a DRep
   */
  static new_stake_vote_deleg_cert(stake_credential: Credential, pool: Ed25519KeyHash, d_rep: DRep): Certificate;
  /**
   * Register a stake credential and delegate to a pool in a single cert
   */
  static new_stake_reg_deleg_cert(stake_credential: Credential, pool: Ed25519KeyHash, deposit: bigint): Certificate;
  /**
   * Register a stake credential and delegate to a DRep in a single cert
   */
  static new_vote_reg_deleg_cert(stake_credential: Credential, d_rep: DRep, deposit: bigint): Certificate;
  /**
   * Register a stake credential and delegate to a pool and a DRep in a single cert
   */
  static new_stake_vote_reg_deleg_cert(stake_credential: Credential, pool: Ed25519KeyHash, d_rep: DRep, deposit: bigint): Certificate;
  static new_auth_committee_hot_cert(committee_cold_credential: Credential, committee_hot_credential: Credential): Certificate;
  static new_resign_committee_cold_cert(committee_cold_credential: Credential, anchor?: Anchor | null): Certificate;
  static new_reg_drep_cert(drep_credential: Credential, deposit: bigint, anchor?: Anchor | null): Certificate;
  static new_unreg_drep_cert(drep_credential: Credential, deposit: bigint): Certificate;
  static new_update_drep_cert(drep_credential: Credential, anchor?: Anchor | null): Certificate;
  kind(): CertificateKind;
  as_stake_registration(): StakeRegistration | undefined;
  as_stake_deregistration(): StakeDeregistration | undefined;
  as_stake_delegation(): StakeDelegation | undefined;
  as_pool_registration(): PoolRegistration | undefined;
  as_pool_retirement(): PoolRetirement | undefined;
  as_reg_cert(): RegCert | undefined;
  as_unreg_cert(): UnregCert | undefined;
  as_vote_deleg_cert(): VoteDelegCert | undefined;
  as_stake_vote_deleg_cert(): StakeVoteDelegCert | undefined;
  as_stake_reg_deleg_cert(): StakeRegDelegCert | undefined;
  as_vote_reg_deleg_cert(): VoteRegDelegCert | undefined;
  as_stake_vote_reg_deleg_cert(): StakeVoteRegDelegCert | undefined;
  as_auth_committee_hot_cert(): AuthCommitteeHotCert | undefined;
  as_resign_committee_cold_cert(): ResignCommitteeColdCert | undefined;
  as_reg_drep_cert(): RegDrepCert | undefined;
  as_unreg_drep_cert(): UnregDrepCert | undefined;
  as_update_drep_cert(): UpdateDrepCert | undefined;
}
export class CertificateBuilderResult {
  private constructor();
  free(): void;
}
export class CertificateList {
  private constructor();
  free(): void;
  static new(): CertificateList;
  len(): number;
  get(index: number): Certificate;
  add(elem: Certificate): void;
}
export class CommitteeColdCredentialList {
  private constructor();
  free(): void;
  static new(): CommitteeColdCredentialList;
  len(): number;
  get(index: number): Credential;
  add(elem: Credential): void;
}
export class Constitution {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Constitution;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Constitution;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Constitution;
  anchor(): Anchor;
  script_hash(): ScriptHash | undefined;
  static new(anchor: Anchor, script_hash?: ScriptHash | null): Constitution;
}
export class ConstrPlutusData {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ConstrPlutusData;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ConstrPlutusData;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ConstrPlutusData;
  alternative(): bigint;
  fields(): PlutusDataList;
  static new(alternative: bigint, fields: PlutusDataList): ConstrPlutusData;
}
export class ConwayFormatAuxData {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ConwayFormatAuxData;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ConwayFormatAuxData;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ConwayFormatAuxData;
  set_metadata(metadata: Metadata): void;
  metadata(): Metadata | undefined;
  set_native_scripts(native_scripts: NativeScriptList): void;
  native_scripts(): NativeScriptList | undefined;
  set_plutus_v1_scripts(plutus_v1_scripts: PlutusV1ScriptList): void;
  plutus_v1_scripts(): PlutusV1ScriptList | undefined;
  set_plutus_v2_scripts(plutus_v2_scripts: PlutusV2ScriptList): void;
  plutus_v2_scripts(): PlutusV2ScriptList | undefined;
  set_plutus_v3_scripts(plutus_v3_scripts: PlutusV3ScriptList): void;
  plutus_v3_scripts(): PlutusV3ScriptList | undefined;
  static new(): ConwayFormatAuxData;
}
export class ConwayFormatTxOut {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ConwayFormatTxOut;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ConwayFormatTxOut;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ConwayFormatTxOut;
  address(): Address;
  amount(): Value;
  set_datum_option(datum_option: DatumOption): void;
  datum_option(): DatumOption | undefined;
  set_script_reference(script_reference: Script): void;
  script_reference(): Script | undefined;
  static new(address: Address, amount: Value): ConwayFormatTxOut;
}
export class CostModels {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): CostModels;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): CostModels;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): CostModels;
  inner(): MapU64ToArrI64;
}
export class Crc32 {
  private constructor();
  free(): void;
  /**
   * initialise a new CRC32 state
   */
  static new(): Crc32;
  /**
   * update the CRC32 with the given bytes.
   *
   * beware that the order in which you update the Crc32
   * matter
   */
  update(bytes: Uint8Array): void;
  /**
   * finalize the CRC32, recovering the computed value
   */
  finalize(): number;
}
export class Credential {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Credential;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Credential;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Credential;
  static new_pub_key(hash: Ed25519KeyHash): Credential;
  static new_script(hash: ScriptHash): Credential;
  kind(): CredentialKind;
  as_pub_key(): Ed25519KeyHash | undefined;
  as_script(): ScriptHash | undefined;
}
export class DNSName {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): DNSName;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): DNSName;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): DNSName;
  get(): string;
}
export class DRep {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): DRep;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): DRep;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): DRep;
  static new_key(pool: Ed25519KeyHash): DRep;
  static new_script(script_hash: ScriptHash): DRep;
  static new_always_abstain(): DRep;
  static new_always_no_confidence(): DRep;
  kind(): DRepKind;
  as_key(): Ed25519KeyHash | undefined;
  as_script(): ScriptHash | undefined;
}
export class DRepVotingThresholds {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): DRepVotingThresholds;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): DRepVotingThresholds;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): DRepVotingThresholds;
  motion_no_confidence(): UnitInterval;
  committee_normal(): UnitInterval;
  committee_no_confidence(): UnitInterval;
  update_constitution(): UnitInterval;
  hard_fork_initiation(): UnitInterval;
  pp_network_group(): UnitInterval;
  pp_economic_group(): UnitInterval;
  pp_technical_group(): UnitInterval;
  pp_governance_group(): UnitInterval;
  treasury_withdrawal(): UnitInterval;
  static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, update_constitution: UnitInterval, hard_fork_initiation: UnitInterval, pp_network_group: UnitInterval, pp_economic_group: UnitInterval, pp_technical_group: UnitInterval, pp_governance_group: UnitInterval, treasury_withdrawal: UnitInterval): DRepVotingThresholds;
}
export class DatumHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): DatumHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): DatumHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): DatumHash;
}
export class DatumOption {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): DatumOption;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): DatumOption;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): DatumOption;
  static new_hash(datum_hash: DatumHash): DatumOption;
  static new_datum(datum: PlutusData): DatumOption;
  kind(): DatumOptionKind;
  as_hash(): DatumHash | undefined;
  as_datum(): PlutusData | undefined;
}
export class Ed25519KeyHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): Ed25519KeyHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): Ed25519KeyHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): Ed25519KeyHash;
}
export class Ed25519KeyHashList {
  private constructor();
  free(): void;
  static new(): Ed25519KeyHashList;
  len(): number;
  get(index: number): Ed25519KeyHash;
  add(elem: Ed25519KeyHash): void;
}
export class Ed25519Signature {
  private constructor();
  free(): void;
  to_bech32(): string;
  static from_bech32(bech32_str: string): Ed25519Signature;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): Ed25519Signature;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): Ed25519Signature;
}
export class EnterpriseAddress {
  private constructor();
  free(): void;
  static new(network: number, payment: Credential): EnterpriseAddress;
  to_address(): Address;
  static from_address(address: Address): EnterpriseAddress | undefined;
  network_id(): number;
  payment(): Credential;
}
export class ExUnitPrices {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ExUnitPrices;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ExUnitPrices;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ExUnitPrices;
  mem_price(): Rational;
  step_price(): Rational;
  static new(mem_price: Rational, step_price: Rational): ExUnitPrices;
}
export class ExUnits {
  private constructor();
  free(): void;
  checked_add(other: ExUnits): ExUnits;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ExUnits;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ExUnits;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ExUnits;
  mem(): bigint;
  steps(): bigint;
  static new(mem: bigint, steps: bigint): ExUnits;
}
export class FilesDetailsList {
  private constructor();
  free(): void;
  static new(): FilesDetailsList;
  len(): number;
  get(index: number): CIP25FilesDetails;
  add(elem: CIP25FilesDetails): void;
}
export class GenesisDelegateHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): GenesisDelegateHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): GenesisDelegateHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): GenesisDelegateHash;
}
export class GenesisHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): GenesisHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): GenesisHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): GenesisHash;
}
export class GovAction {
  private constructor();
  free(): void;
  script_hash(): ScriptHash | undefined;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): GovAction;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): GovAction;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): GovAction;
  static new_parameter_change_action(action_id: GovActionId | null | undefined, update: ProtocolParamUpdate, policy_hash?: ScriptHash | null): GovAction;
  static new_hard_fork_initiation_action(action_id: GovActionId | null | undefined, version: ProtocolVersion): GovAction;
  static new_treasury_withdrawals_action(withdrawal: MapRewardAccountToCoin, policy_hash?: ScriptHash | null): GovAction;
  static new_no_confidence(action_id?: GovActionId | null): GovAction;
  static new_update_committee(action_id: GovActionId | null | undefined, cold_credentials: CommitteeColdCredentialList, credentials: MapCommitteeColdCredentialToEpoch, unit_interval: UnitInterval): GovAction;
  static new_new_constitution(action_id: GovActionId | null | undefined, constitution: Constitution): GovAction;
  static new_info_action(): GovAction;
  kind(): GovActionKind;
  as_parameter_change_action(): ParameterChangeAction | undefined;
  as_hard_fork_initiation_action(): HardForkInitiationAction | undefined;
  as_treasury_withdrawals_action(): TreasuryWithdrawalsAction | undefined;
  as_no_confidence(): NoConfidence | undefined;
  as_update_committee(): UpdateCommittee | undefined;
  as_new_constitution(): NewConstitution | undefined;
}
export class GovActionId {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): GovActionId;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): GovActionId;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): GovActionId;
  transaction_id(): TransactionHash;
  gov_action_index(): bigint;
  static new(transaction_id: TransactionHash, gov_action_index: bigint): GovActionId;
}
export class GovActionIdList {
  private constructor();
  free(): void;
  static new(): GovActionIdList;
  len(): number;
  get(index: number): GovActionId;
  add(elem: GovActionId): void;
}
export class HDAddressPayload {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): HDAddressPayload;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): HDAddressPayload;
  get(): Uint8Array;
}
export class HardForkInitiationAction {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): HardForkInitiationAction;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): HardForkInitiationAction;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): HardForkInitiationAction;
  action_id(): GovActionId | undefined;
  version(): ProtocolVersion;
  static new(action_id: GovActionId | null | undefined, version: ProtocolVersion): HardForkInitiationAction;
}
export class Header {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Header;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Header;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Header;
  header_body(): HeaderBody;
  body_signature(): KESSignature;
  static new(header_body: HeaderBody, body_signature: KESSignature): Header;
}
export class HeaderBody {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): HeaderBody;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): HeaderBody;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): HeaderBody;
  block_number(): bigint;
  slot(): bigint;
  prev_hash(): BlockHeaderHash | undefined;
  issuer_vkey(): PublicKey;
  vrf_vkey(): VRFVkey;
  vrf_result(): VRFCert;
  block_body_size(): bigint;
  block_body_hash(): BlockBodyHash;
  operational_cert(): OperationalCert;
  protocol_version(): ProtocolVersion;
  static new(block_number: bigint, slot: bigint, prev_hash: BlockHeaderHash | null | undefined, issuer_vkey: PublicKey, vrf_vkey: VRFVkey, vrf_result: VRFCert, block_body_size: bigint, block_body_hash: BlockBodyHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion): HeaderBody;
}
export class InputAggregateWitnessData {
  private constructor();
  free(): void;
  plutus_data(): PlutusData | undefined;
}
export class InputBuilderResult {
  private constructor();
  free(): void;
}
export class Int {
  private constructor();
  free(): void;
  to_cbor_bytes(): Uint8Array;
  static from_cbor_bytes(cbor_bytes: Uint8Array): Int;
  to_json(): string;
  to_json_value(): any;
  static from_json(json: string): Int;
  static new(x: bigint): Int;
  to_str(): string;
  static from_str(string: string): Int;
}
export class IntList {
  private constructor();
  free(): void;
  static new(): IntList;
  len(): number;
  get(index: number): Int;
  add(elem: Int): void;
}
export class Ipv4 {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Ipv4;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Ipv4;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Ipv4;
  get(): Uint8Array;
}
export class Ipv6 {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Ipv6;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Ipv6;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Ipv6;
  get(): Uint8Array;
}
export class KESSignature {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): KESSignature;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): KESSignature;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): KESSignature;
  get(): Uint8Array;
}
export class KESVkey {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): KESVkey;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): KESVkey;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): KESVkey;
}
export class LanguageList {
  private constructor();
  free(): void;
  static new(): LanguageList;
  len(): number;
  get(index: number): Language;
  add(elem: Language): void;
}
export class LegacyDaedalusPrivateKey {
  private constructor();
  free(): void;
  chaincode(): Uint8Array;
}
export class LegacyRedeemer {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): LegacyRedeemer;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): LegacyRedeemer;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): LegacyRedeemer;
  tag(): RedeemerTag;
  index(): bigint;
  data(): PlutusData;
  ex_units(): ExUnits;
  static new(tag: RedeemerTag, index: bigint, data: PlutusData, ex_units: ExUnits): LegacyRedeemer;
}
export class LegacyRedeemerList {
  private constructor();
  free(): void;
  static new(): LegacyRedeemerList;
  len(): number;
  get(index: number): LegacyRedeemer;
  add(elem: LegacyRedeemer): void;
}
/**
 * Careful: although the linear fee is the same for Byron & Shelley
 * The value of the parameters and how fees are computed is not the same
 */
export class LinearFee {
  private constructor();
  free(): void;
  /**
   *
   *     * * `coefficient` - minfee_a from protocol params
   *     * * `constant` - minfee_b from protocol params
   *     * * `ref_script_cost_per_bytes` - min_fee_ref_script_cost_per_byte from protocol params. New in Conway
   *     
   */
  static new(coefficient: bigint, constant: bigint, ref_script_cost_per_byte: bigint): LinearFee;
  /**
   * minfee_a
   */
  coefficient(): bigint;
  /**
   * minfee_b
   */
  constant(): bigint;
  ref_script_cost_per_byte(): bigint;
}
export class MapAssetNameToCoin {
  private constructor();
  free(): void;
  get(key: AssetName): bigint | undefined;
  insert(key: AssetName, value: bigint): bigint | undefined;
  static new(): MapAssetNameToCoin;
  len(): number;
  is_empty(): boolean;
  keys(): AssetNameList;
}
export class MapAssetNameToNonZeroInt64 {
  private constructor();
  free(): void;
  static new(): MapAssetNameToNonZeroInt64;
  len(): number;
  insert(key: AssetName, value: bigint): bigint | undefined;
  get(key: AssetName): bigint | undefined;
  keys(): AssetNameList;
}
export class MapAssetNameToU64 {
  private constructor();
  free(): void;
  static new(): MapAssetNameToU64;
  len(): number;
  insert(key: AssetName, value: bigint): bigint | undefined;
  get(key: AssetName): bigint | undefined;
  keys(): AssetNameList;
}
export class MapCommitteeColdCredentialToEpoch {
  private constructor();
  free(): void;
  static new(): MapCommitteeColdCredentialToEpoch;
  len(): number;
  insert(key: Credential, value: bigint): bigint | undefined;
  get(key: Credential): bigint | undefined;
  keys(): CommitteeColdCredentialList;
}
export class MapGovActionIdToVotingProcedure {
  private constructor();
  free(): void;
  static new(): MapGovActionIdToVotingProcedure;
  len(): number;
  insert(key: GovActionId, value: VotingProcedure): VotingProcedure | undefined;
  get(key: GovActionId): VotingProcedure | undefined;
  keys(): GovActionIdList;
}
export class MapPlutusDataToPlutusData {
  private constructor();
  free(): void;
  static new(): MapPlutusDataToPlutusData;
  len(): number;
  insert(key: PlutusData, value: PlutusData): PlutusData | undefined;
  get(key: PlutusData): PlutusData | undefined;
  keys(): PlutusDataList;
}
export class MapRedeemerKeyToRedeemerVal {
  private constructor();
  free(): void;
  static new(): MapRedeemerKeyToRedeemerVal;
  len(): number;
  insert(key: RedeemerKey, value: RedeemerVal): RedeemerVal | undefined;
  get(key: RedeemerKey): RedeemerVal | undefined;
  keys(): RedeemerKeyList;
}
export class MapRewardAccountToCoin {
  private constructor();
  free(): void;
  static new(): MapRewardAccountToCoin;
  len(): number;
  insert(key: RewardAddress, value: bigint): bigint | undefined;
  get(key: RewardAddress): bigint | undefined;
  keys(): RewardAccountList;
}
export class MapStakeCredentialToDeltaCoin {
  private constructor();
  free(): void;
  static new(): MapStakeCredentialToDeltaCoin;
  len(): number;
  insert(key: Credential, value: Int): Int | undefined;
  get(key: Credential): Int | undefined;
  keys(): StakeCredentialList;
}
export class MapTransactionIndexToAuxiliaryData {
  private constructor();
  free(): void;
  static new(): MapTransactionIndexToAuxiliaryData;
  len(): number;
  insert(key: number, value: AuxiliaryData): AuxiliaryData | undefined;
  get(key: number): AuxiliaryData | undefined;
  keys(): Uint16Array;
}
export class MapTransactionMetadatumToTransactionMetadatum {
  private constructor();
  free(): void;
  static new(): MapTransactionMetadatumToTransactionMetadatum;
  len(): number;
  insert(key: TransactionMetadatum, value: TransactionMetadatum): TransactionMetadatum | undefined;
  get(key: TransactionMetadatum): TransactionMetadatum | undefined;
  keys(): TransactionMetadatumList;
}
export class MapU64ToArrI64 {
  private constructor();
  free(): void;
  get(key: bigint): BigInt64Array | undefined;
  insert(key: bigint, value: BigInt64Array): BigInt64Array | undefined;
  static new(): MapU64ToArrI64;
  len(): number;
  is_empty(): boolean;
  keys(): BigUint64Array;
}
export class Metadata {
  private constructor();
  free(): void;
  static new(): Metadata;
  /**
   * How many metadatum labels there are.
   */
  len(): number;
  /**
   * Replaces all metadatums of a given label, if any exist.
   */
  set(key: bigint, value: TransactionMetadatum): void;
  /**
   * Gets the Metadatum corresponding to a given label, if it exists.
   * Note: In the case of duplicate labels this only returns the first metadatum.
   * This is an extremely rare occurence on-chain but can happen.
   */
  get(label: bigint): TransactionMetadatum | undefined;
  /**
   * In the extremely unlikely situation there are duplicate labels, this gets all of a single label
   */
  get_all(label: bigint): TransactionMetadatumList | undefined;
  labels(): TransactionMetadatumLabels;
}
export class MetadatumList {
  private constructor();
  free(): void;
  static new(): MetadatumList;
  len(): number;
  get(index: number): TransactionMetadatum;
  add(elem: TransactionMetadatum): void;
}
export class MetadatumMap {
  private constructor();
  free(): void;
  static new(): MetadatumMap;
  len(): number;
  /**
   * Replaces all metadatums of a given key, if any exist.
   */
  set(key: TransactionMetadatum, value: TransactionMetadatum): void;
  /**
   * Gets the Metadatum corresponding to a given key, if it exists.
   * Note: In the case of duplicate keys this only returns the first metadatum.
   * This is an extremely rare occurence (2 total on mainnet) on-chain but can happen.
   */
  get(key: TransactionMetadatum): TransactionMetadatum | undefined;
  /**
   * In the extremely unlikely situation there are duplicate keys, this gets all of a single key
   */
  get_all(key: TransactionMetadatum): TransactionMetadatumList | undefined;
  keys(): MetadatumList;
}
export class Mint {
  private constructor();
  free(): void;
  static new(): Mint;
  policy_count(): number;
  insert_assets(policy_id: ScriptHash, assets: MapAssetNameToNonZeroInt64): MapAssetNameToNonZeroInt64 | undefined;
  get_assets(key: ScriptHash): MapAssetNameToNonZeroInt64 | undefined;
  /**
   * Get the value of policy_id:asset_name if it exists.
   */
  get(policy_id: ScriptHash, asset: AssetName): bigint | undefined;
  /**
   * Set the value of policy_id:asset_name to value.
   * Returns the previous value, or None if it didn't exist
   */
  set(policy_id: ScriptHash, asset: AssetName, value: bigint): bigint | undefined;
  keys(): PolicyIdList;
  /**
   * Adds two mints together, checking value bounds.
   * Does not modify self, and instead returns the result.
   */
  checked_add(rhs: Mint): Mint;
  /**
   * Subtracts rhs from this mint.
   * This does not modify self, and instead returns the result.
   */
  checked_sub(rhs: Mint): Mint;
  /**
   * Returns the multiasset where only positive (minting) entries are present
   */
  as_positive_multiasset(): MultiAsset;
  /**
   * Returns the multiasset where only negative (burning) entries are present
   */
  as_negative_multiasset(): MultiAsset;
}
export class MintBuilderResult {
  private constructor();
  free(): void;
}
export class MultiAsset {
  private constructor();
  free(): void;
  static new(): MultiAsset;
  policy_count(): number;
  insert_assets(policy_id: ScriptHash, assets: MapAssetNameToCoin): MapAssetNameToCoin | undefined;
  get_assets(key: ScriptHash): MapAssetNameToCoin | undefined;
  /**
   * Get the value of policy_id:asset_name if it exists.
   */
  get(policy_id: ScriptHash, asset: AssetName): bigint | undefined;
  /**
   * Set the value of policy_id:asset_name to value.
   * Returns the previous value, or None if it didn't exist
   */
  set(policy_id: ScriptHash, asset: AssetName, value: bigint): bigint | undefined;
  keys(): PolicyIdList;
  /**
   * Adds to multiassets together, checking value bounds.
   * Does not modify self, and instead returns the result.
   */
  checked_add(rhs: MultiAsset): MultiAsset;
  /**
   * Subtracts rhs from this multiasset.
   * This does not modify self, and instead returns the result.
   * If this would cause there to be fewer than 0 of a given asset
   * an error will be returned.
   * Use clamped_sub if you need to only try to remove assets when they exist
   * and ignore them when they don't.
   */
  checked_sub(rhs: MultiAsset): MultiAsset;
  /**
   * Sybtracts rhs from this multiasset.
   * If this would cause there to be 0 or fewer of a given asset
   * it will simply be removed entirely from the result.
   */
  clamped_sub(rhs: MultiAsset): MultiAsset;
}
export class MultiHostName {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): MultiHostName;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): MultiHostName;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): MultiHostName;
  dns_name(): DNSName;
  /**
   * * `dns_name` - A SRV DNS record
   */
  static new(dns_name: DNSName): MultiHostName;
}
export class NativeScript {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): NativeScript;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): NativeScript;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): NativeScript;
  static new_script_pubkey(ed25519_key_hash: Ed25519KeyHash): NativeScript;
  static new_script_all(native_scripts: NativeScriptList): NativeScript;
  static new_script_any(native_scripts: NativeScriptList): NativeScript;
  static new_script_n_of_k(n: bigint, native_scripts: NativeScriptList): NativeScript;
  /**
   * Timelock validity intervals are half-open intervals [a, b). This field specifies the left (included) endpoint a.
   */
  static new_script_invalid_before(before: bigint): NativeScript;
  /**
   * Timelock validity intervals are half-open intervals [a, b). This field specifies the right (excluded) endpoint b.
   */
  static new_script_invalid_hereafter(after: bigint): NativeScript;
  kind(): NativeScriptKind;
  as_script_pubkey(): ScriptPubkey | undefined;
  as_script_all(): ScriptAll | undefined;
  as_script_any(): ScriptAny | undefined;
  as_script_n_of_k(): ScriptNOfK | undefined;
  as_script_invalid_before(): ScriptInvalidBefore | undefined;
  as_script_invalid_hereafter(): ScriptInvalidHereafter | undefined;
  /**
   * Returns an array of unique Ed25519KeyHashes
   * contained within this script recursively on any depth level.
   * The order of the keys in the result is not determined in any way.
   */
  get_required_signers(): Ed25519KeyHashList;
  hash(): ScriptHash;
  verify(lower_bound: bigint | null | undefined, upper_bound: bigint | null | undefined, key_hashes: Ed25519KeyHashList): boolean;
}
export class NativeScriptList {
  private constructor();
  free(): void;
  static new(): NativeScriptList;
  len(): number;
  get(index: number): NativeScript;
  add(elem: NativeScript): void;
}
export class NativeScriptWitnessInfo {
  private constructor();
  free(): void;
  /**
   * Unsure which keys will sign, but you know the exact number to save on tx fee
   */
  static num_signatures(num: number): NativeScriptWitnessInfo;
  /**
   * This native script will be witnessed by exactly these keys
   */
  static vkeys(vkeys: Ed25519KeyHashList): NativeScriptWitnessInfo;
  /**
   * You don't know how many keys will sign, so the maximum possible case will be assumed
   */
  static assume_signature_count(): NativeScriptWitnessInfo;
}
export class NetworkId {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): NetworkId;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): NetworkId;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): NetworkId;
  static new(network: bigint): NetworkId;
  static mainnet(): NetworkId;
  static testnet(): NetworkId;
  network(): bigint;
}
export class NetworkInfo {
  private constructor();
  free(): void;
  static new(network_id: number, protocol_magic: ProtocolMagic): NetworkInfo;
  network_id(): number;
  protocol_magic(): ProtocolMagic;
  /**
   * This is the old testnet - most likely you want to use preview()/preprod()
   */
  static testnet(): NetworkInfo;
  static mainnet(): NetworkInfo;
  static preview(): NetworkInfo;
  static preprod(): NetworkInfo;
  static sancho_testnet(): NetworkInfo;
}
export class NewConstitution {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): NewConstitution;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): NewConstitution;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): NewConstitution;
  action_id(): GovActionId | undefined;
  constitution(): Constitution;
  static new(action_id: GovActionId | null | undefined, constitution: Constitution): NewConstitution;
}
export class NoConfidence {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): NoConfidence;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): NoConfidence;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): NoConfidence;
  action_id(): GovActionId | undefined;
  static new(action_id?: GovActionId | null): NoConfidence;
}
export class Nonce {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Nonce;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Nonce;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Nonce;
  static new_identity(): Nonce;
  static new_hash(hash: NonceHash): Nonce;
  kind(): NonceKind;
  as_hash(): NonceHash | undefined;
}
export class NonceHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): NonceHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): NonceHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): NonceHash;
}
export class OperationalCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): OperationalCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): OperationalCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): OperationalCert;
  hot_vkey(): KESVkey;
  sequence_number(): bigint;
  kes_period(): bigint;
  sigma(): Ed25519Signature;
  static new(hot_vkey: KESVkey, sequence_number: bigint, kes_period: bigint, sigma: Ed25519Signature): OperationalCert;
}
export class ParameterChangeAction {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ParameterChangeAction;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ParameterChangeAction;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ParameterChangeAction;
  action_id(): GovActionId | undefined;
  update(): ProtocolParamUpdate;
  policy_hash(): ScriptHash | undefined;
  static new(action_id: GovActionId | null | undefined, update: ProtocolParamUpdate, policy_hash?: ScriptHash | null): ParameterChangeAction;
}
/**
 * A partial Plutus witness
 * It contains all the information needed to witness the Plutus script execution
 * except for the redeemer tag and index
 * Note: no datum is attached because only input script types have datums
 */
export class PartialPlutusWitness {
  private constructor();
  free(): void;
  static new(script: PlutusScriptWitness, data: PlutusData): PartialPlutusWitness;
  script(): PlutusScriptWitness;
  data(): PlutusData;
}
export class PlutusData {
  private constructor();
  free(): void;
  /**
   *
   *     *  Convert to a Datum that will serialize equivalent to cardano-node's format
   *     *
   *     *  Please VERY STRONGLY consider using PlutusData::from_cbor_bytes() instead wherever possible.
   *     * You should try to never rely on a tool encoding CBOR a certain way as there are many possible,
   *     * and just because it matches with a specific datum, doesn't mean that a different datum won't differ.
   *     * This is critical as that means the datum hash won't match.
   *     * After creation a datum (or other hashable CBOR object) should only be treated as raw CBOR bytes,
   *     * or through a type that respects its specific CBOR format e.g. CML's PlutusData::from_cbor_bytes()
   *     *
   *     *  This function is just here in case there's no possible way at all to create from CBOR bytes and
   *     * thus cold only be constructed manually and then had this function called on it.
   *     *
   *     *  This is also the format that CSL and Lucid use
   *     
   */
  to_cardano_node_format(): PlutusData;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PlutusData;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PlutusData;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PlutusData;
  static new_constr_plutus_data(constr_plutus_data: ConstrPlutusData): PlutusData;
  static new_map(map: PlutusMap): PlutusData;
  static new_list(list: PlutusDataList): PlutusData;
  static new_integer(big_int: BigInteger): PlutusData;
  static new_bytes(bytes: Uint8Array): PlutusData;
  kind(): PlutusDataKind;
  as_constr_plutus_data(): ConstrPlutusData | undefined;
  as_map(): PlutusMap | undefined;
  as_list(): PlutusDataList | undefined;
  as_integer(): BigInteger | undefined;
  as_bytes(): Uint8Array | undefined;
}
export class PlutusDataList {
  private constructor();
  free(): void;
  static new(): PlutusDataList;
  len(): number;
  get(index: number): PlutusData;
  add(elem: PlutusData): void;
}
export class PlutusMap {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PlutusMap;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PlutusMap;
  static new(): PlutusMap;
  len(): number;
  is_empty(): boolean;
  /**
   * Replaces all datums of a given key, if any exist.
   */
  set(key: PlutusData, value: PlutusData): void;
  /**
   * Gets the plutus datum corresponding to a given key, if it exists.
   * Note: In the case of duplicate keys this only returns the first datum.
   * This is an extremely rare occurence on-chain but can happen.
   */
  get(key: PlutusData): PlutusData | undefined;
  /**
   * In the extremely unlikely situation there are duplicate keys, this gets all of a single key
   */
  get_all(key: PlutusData): PlutusDataList | undefined;
  keys(): PlutusDataList;
}
/**
 * Version-agnostic Plutus script
 */
export class PlutusScript {
  private constructor();
  free(): void;
  static from_v1(script: PlutusV1Script): PlutusScript;
  static from_v2(script: PlutusV2Script): PlutusScript;
  static from_v3(script: PlutusV3Script): PlutusScript;
  hash(): ScriptHash;
  as_v1(): PlutusV1Script | undefined;
  as_v2(): PlutusV2Script | undefined;
  as_v3(): PlutusV3Script | undefined;
  version(): Language;
}
export class PlutusScriptWitness {
  private constructor();
  free(): void;
  static new_script(script: PlutusScript): PlutusScriptWitness;
  static new_ref(hash: ScriptHash): PlutusScriptWitness;
  hash(): ScriptHash;
}
export class PlutusV1Script {
  private constructor();
  free(): void;
  hash(): ScriptHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): PlutusV1Script;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): PlutusV1Script;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PlutusV1Script;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PlutusV1Script;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PlutusV1Script;
}
export class PlutusV1ScriptList {
  private constructor();
  free(): void;
  static new(): PlutusV1ScriptList;
  len(): number;
  get(index: number): PlutusV1Script;
  add(elem: PlutusV1Script): void;
}
export class PlutusV2Script {
  private constructor();
  free(): void;
  hash(): ScriptHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): PlutusV2Script;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): PlutusV2Script;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PlutusV2Script;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PlutusV2Script;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PlutusV2Script;
}
export class PlutusV2ScriptList {
  private constructor();
  free(): void;
  static new(): PlutusV2ScriptList;
  len(): number;
  get(index: number): PlutusV2Script;
  add(elem: PlutusV2Script): void;
}
export class PlutusV3Script {
  private constructor();
  free(): void;
  hash(): ScriptHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): PlutusV3Script;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): PlutusV3Script;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PlutusV3Script;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PlutusV3Script;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PlutusV3Script;
}
export class PlutusV3ScriptList {
  private constructor();
  free(): void;
  static new(): PlutusV3ScriptList;
  len(): number;
  get(index: number): PlutusV3Script;
  add(elem: PlutusV3Script): void;
}
export class Pointer {
  private constructor();
  free(): void;
}
export class PointerAddress {
  private constructor();
  free(): void;
  static new(network: number, payment: Credential, stake: Pointer): PointerAddress;
  to_address(): Address;
  static from_address(address: Address): PointerAddress | undefined;
  network_id(): number;
  payment(): Credential;
  stake(): Pointer;
}
export class PolicyIdList {
  private constructor();
  free(): void;
  static new(): PolicyIdList;
  len(): number;
  get(index: number): ScriptHash;
  add(elem: ScriptHash): void;
}
export class PoolMetadata {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PoolMetadata;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PoolMetadata;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PoolMetadata;
  url(): Url;
  pool_metadata_hash(): PoolMetadataHash;
  static new(url: Url, pool_metadata_hash: PoolMetadataHash): PoolMetadata;
}
export class PoolMetadataHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): PoolMetadataHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): PoolMetadataHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): PoolMetadataHash;
}
export class PoolParams {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PoolParams;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PoolParams;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PoolParams;
  operator(): Ed25519KeyHash;
  vrf_keyhash(): VRFKeyHash;
  pledge(): bigint;
  cost(): bigint;
  margin(): UnitInterval;
  reward_account(): RewardAddress;
  pool_owners(): Ed25519KeyHashList;
  relays(): RelayList;
  pool_metadata(): PoolMetadata | undefined;
  static new(operator: Ed25519KeyHash, vrf_keyhash: VRFKeyHash, pledge: bigint, cost: bigint, margin: UnitInterval, reward_account: RewardAddress, pool_owners: Ed25519KeyHashList, relays: RelayList, pool_metadata?: PoolMetadata | null): PoolParams;
}
export class PoolRegistration {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PoolRegistration;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PoolRegistration;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PoolRegistration;
  pool_params(): PoolParams;
  static new(pool_params: PoolParams): PoolRegistration;
}
export class PoolRetirement {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PoolRetirement;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PoolRetirement;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PoolRetirement;
  pool(): Ed25519KeyHash;
  epoch(): bigint;
  static new(pool: Ed25519KeyHash, epoch: bigint): PoolRetirement;
}
export class PoolVotingThresholds {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): PoolVotingThresholds;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): PoolVotingThresholds;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): PoolVotingThresholds;
  motion_no_confidence(): UnitInterval;
  committee_normal(): UnitInterval;
  committee_no_confidence(): UnitInterval;
  hard_fork_initiation(): UnitInterval;
  security_relevant_parameter_voting_threshold(): UnitInterval;
  static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_parameter_voting_threshold: UnitInterval): PoolVotingThresholds;
}
export class PrivateKey {
  private constructor();
  free(): void;
  to_public(): PublicKey;
  static generate_ed25519(): PrivateKey;
  static generate_ed25519extended(): PrivateKey;
  /**
   * Get private key from its bech32 representation
   * ```javascript
   * PrivateKey.from_bech32(&#39;ed25519_sk1ahfetf02qwwg4dkq7mgp4a25lx5vh9920cr5wnxmpzz9906qvm8qwvlts0&#39;);
   * ```
   * For an extended 25519 key
   * ```javascript
   * PrivateKey.from_bech32(&#39;ed25519e_sk1gqwl4szuwwh6d0yk3nsqcc6xxc3fpvjlevgwvt60df59v8zd8f8prazt8ln3lmz096ux3xvhhvm3ca9wj2yctdh3pnw0szrma07rt5gl748fp&#39;);
   * ```
   */
  static from_bech32(bech32_str: string): PrivateKey;
  to_bech32(): string;
  to_raw_bytes(): Uint8Array;
  static from_extended_bytes(bytes: Uint8Array): PrivateKey;
  static from_normal_bytes(bytes: Uint8Array): PrivateKey;
  sign(message: Uint8Array): Ed25519Signature;
}
export class ProposalBuilder {
  private constructor();
  free(): void;
  static new(): ProposalBuilder;
  with_proposal(proposal: ProposalProcedure): ProposalBuilder;
  with_native_script_proposal(proposal: ProposalProcedure, native_script: NativeScript, witness_info: NativeScriptWitnessInfo): ProposalBuilder;
  with_plutus_proposal(proposal: ProposalProcedure, partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList, datum: PlutusData): ProposalBuilder;
  with_plutus_proposal_inline_datum(proposal: ProposalProcedure, partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList): ProposalBuilder;
  build(): ProposalBuilderResult;
}
export class ProposalBuilderResult {
  private constructor();
  free(): void;
}
export class ProposalProcedure {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ProposalProcedure;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ProposalProcedure;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ProposalProcedure;
  deposit(): bigint;
  reward_account(): RewardAddress;
  gov_action(): GovAction;
  anchor(): Anchor;
  static new(deposit: bigint, reward_account: RewardAddress, gov_action: GovAction, anchor: Anchor): ProposalProcedure;
}
export class ProposalProcedureList {
  private constructor();
  free(): void;
  static new(): ProposalProcedureList;
  len(): number;
  get(index: number): ProposalProcedure;
  add(elem: ProposalProcedure): void;
}
export class ProtocolMagic {
  private constructor();
  free(): void;
  static new(pm: number): ProtocolMagic;
  to_int(): number;
}
export class ProtocolParamUpdate {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ProtocolParamUpdate;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ProtocolParamUpdate;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ProtocolParamUpdate;
  set_minfee_a(minfee_a: bigint): void;
  minfee_a(): bigint | undefined;
  set_minfee_b(minfee_b: bigint): void;
  minfee_b(): bigint | undefined;
  set_max_block_body_size(max_block_body_size: bigint): void;
  max_block_body_size(): bigint | undefined;
  set_max_transaction_size(max_transaction_size: bigint): void;
  max_transaction_size(): bigint | undefined;
  set_max_block_header_size(max_block_header_size: bigint): void;
  max_block_header_size(): bigint | undefined;
  set_key_deposit(key_deposit: bigint): void;
  key_deposit(): bigint | undefined;
  set_pool_deposit(pool_deposit: bigint): void;
  pool_deposit(): bigint | undefined;
  set_maximum_epoch(maximum_epoch: bigint): void;
  maximum_epoch(): bigint | undefined;
  set_n_opt(n_opt: bigint): void;
  n_opt(): bigint | undefined;
  set_pool_pledge_influence(pool_pledge_influence: Rational): void;
  pool_pledge_influence(): Rational | undefined;
  set_expansion_rate(expansion_rate: UnitInterval): void;
  expansion_rate(): UnitInterval | undefined;
  set_treasury_growth_rate(treasury_growth_rate: UnitInterval): void;
  treasury_growth_rate(): UnitInterval | undefined;
  set_min_pool_cost(min_pool_cost: bigint): void;
  min_pool_cost(): bigint | undefined;
  set_ada_per_utxo_byte(ada_per_utxo_byte: bigint): void;
  ada_per_utxo_byte(): bigint | undefined;
  set_cost_models_for_script_languages(cost_models_for_script_languages: CostModels): void;
  cost_models_for_script_languages(): CostModels | undefined;
  set_execution_costs(execution_costs: ExUnitPrices): void;
  execution_costs(): ExUnitPrices | undefined;
  set_max_tx_ex_units(max_tx_ex_units: ExUnits): void;
  max_tx_ex_units(): ExUnits | undefined;
  set_max_block_ex_units(max_block_ex_units: ExUnits): void;
  max_block_ex_units(): ExUnits | undefined;
  set_max_value_size(max_value_size: bigint): void;
  max_value_size(): bigint | undefined;
  set_collateral_percentage(collateral_percentage: bigint): void;
  collateral_percentage(): bigint | undefined;
  set_max_collateral_inputs(max_collateral_inputs: bigint): void;
  max_collateral_inputs(): bigint | undefined;
  set_pool_voting_thresholds(pool_voting_thresholds: PoolVotingThresholds): void;
  pool_voting_thresholds(): PoolVotingThresholds | undefined;
  set_d_rep_voting_thresholds(d_rep_voting_thresholds: DRepVotingThresholds): void;
  d_rep_voting_thresholds(): DRepVotingThresholds | undefined;
  set_min_committee_size(min_committee_size: bigint): void;
  min_committee_size(): bigint | undefined;
  set_committee_term_limit(committee_term_limit: bigint): void;
  committee_term_limit(): bigint | undefined;
  set_governance_action_validity_period(governance_action_validity_period: bigint): void;
  governance_action_validity_period(): bigint | undefined;
  set_governance_action_deposit(governance_action_deposit: bigint): void;
  governance_action_deposit(): bigint | undefined;
  set_d_rep_deposit(d_rep_deposit: bigint): void;
  d_rep_deposit(): bigint | undefined;
  set_d_rep_inactivity_period(d_rep_inactivity_period: bigint): void;
  d_rep_inactivity_period(): bigint | undefined;
  set_min_fee_ref_script_cost_per_byte(min_fee_ref_script_cost_per_byte: Rational): void;
  min_fee_ref_script_cost_per_byte(): Rational | undefined;
  static new(): ProtocolParamUpdate;
}
export class ProtocolVersion {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ProtocolVersion;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ProtocolVersion;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ProtocolVersion;
  major(): bigint;
  minor(): bigint;
  static new(major: bigint, minor: bigint): ProtocolVersion;
}
/**
 * ED25519 key used as public key
 */
export class PublicKey {
  private constructor();
  free(): void;
  /**
   * Get public key from its bech32 representation
   * Example:
   * ```javascript
   * const pkey = PublicKey.from_bech32(&#39;ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2&#39;);
   * ```
   */
  static from_bech32(bech32_str: string): PublicKey;
  to_bech32(): string;
  to_raw_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PublicKey;
  verify(data: Uint8Array, signature: Ed25519Signature): boolean;
  hash(): Ed25519KeyHash;
}
export class Rational {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Rational;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Rational;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Rational;
  numerator(): bigint;
  denominator(): bigint;
  static new(numerator: bigint, denominator: bigint): Rational;
}
export class RedeemerKey {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): RedeemerKey;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): RedeemerKey;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): RedeemerKey;
  tag(): RedeemerTag;
  index(): bigint;
  static new(tag: RedeemerTag, index: bigint): RedeemerKey;
}
export class RedeemerKeyList {
  private constructor();
  free(): void;
  static new(): RedeemerKeyList;
  len(): number;
  get(index: number): RedeemerKey;
  add(elem: RedeemerKey): void;
}
/**
 * In order to calculate the index from the sorted set, "add_*" methods in this builder
 * must be called along with the "add_*" methods in transaction builder.
 */
export class RedeemerSetBuilder {
  private constructor();
  free(): void;
  static new(): RedeemerSetBuilder;
  is_empty(): boolean;
  /**
   * note: will override existing value if called twice with the same key
   */
  update_ex_units(key: RedeemerWitnessKey, ex_units: ExUnits): void;
  add_spend(result: InputBuilderResult): void;
  add_mint(result: MintBuilderResult): void;
  add_reward(result: WithdrawalBuilderResult): void;
  add_cert(result: CertificateBuilderResult): void;
  add_proposal(result: ProposalBuilderResult): void;
  add_vote(result: VoteBuilderResult): void;
  build(default_to_dummy_exunits: boolean): Redeemers;
}
export class RedeemerVal {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): RedeemerVal;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): RedeemerVal;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): RedeemerVal;
  data(): PlutusData;
  ex_units(): ExUnits;
  static new(data: PlutusData, ex_units: ExUnits): RedeemerVal;
}
export class RedeemerWitnessKey {
  private constructor();
  free(): void;
  static new(tag: RedeemerTag, index: bigint): RedeemerWitnessKey;
  static from_redeemer(redeemer: LegacyRedeemer): RedeemerWitnessKey;
}
export class Redeemers {
  private constructor();
  free(): void;
  to_flat_format(): LegacyRedeemerList;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Redeemers;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Redeemers;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Redeemers;
  static new_arr_legacy_redeemer(arr_legacy_redeemer: LegacyRedeemerList): Redeemers;
  static new_map_redeemer_key_to_redeemer_val(map_redeemer_key_to_redeemer_val: MapRedeemerKeyToRedeemerVal): Redeemers;
  kind(): RedeemersKind;
  as_arr_legacy_redeemer(): LegacyRedeemerList | undefined;
  as_map_redeemer_key_to_redeemer_val(): MapRedeemerKeyToRedeemerVal | undefined;
}
export class RegCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): RegCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): RegCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): RegCert;
  stake_credential(): Credential;
  deposit(): bigint;
  static new(stake_credential: Credential, deposit: bigint): RegCert;
}
export class RegDrepCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): RegDrepCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): RegDrepCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): RegDrepCert;
  drep_credential(): Credential;
  deposit(): bigint;
  anchor(): Anchor | undefined;
  static new(drep_credential: Credential, deposit: bigint, anchor?: Anchor | null): RegDrepCert;
}
export class Relay {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Relay;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Relay;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Relay;
  static new_single_host_addr(port?: number | null, ipv4?: Ipv4 | null, ipv6?: Ipv6 | null): Relay;
  static new_single_host_name(port: number | null | undefined, dns_name: DNSName): Relay;
  static new_multi_host_name(dns_name: DNSName): Relay;
  kind(): RelayKind;
  as_single_host_addr(): SingleHostAddr | undefined;
  as_single_host_name(): SingleHostName | undefined;
  as_multi_host_name(): MultiHostName | undefined;
}
export class RelayList {
  private constructor();
  free(): void;
  static new(): RelayList;
  len(): number;
  get(index: number): Relay;
  add(elem: Relay): void;
}
export class RequiredWitnessSet {
  private constructor();
  free(): void;
  add_vkey_key_hash(hash: Ed25519KeyHash): void;
  add_bootstrap(address: ByronAddress): void;
  add_script_ref(script_hash: ScriptHash): void;
  add_script_hash(script_hash: ScriptHash): void;
  add_plutus_datum_hash(plutus_datum: DatumHash): void;
  add_redeemer_tag(redeemer: RedeemerWitnessKey): void;
  add_all(requirements: RequiredWitnessSet): void;
  static new(): RequiredWitnessSet;
  withdrawal_required_wits(address: RewardAddress): void;
}
export class ResignCommitteeColdCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ResignCommitteeColdCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ResignCommitteeColdCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ResignCommitteeColdCert;
  committee_cold_credential(): Credential;
  anchor(): Anchor | undefined;
  static new(committee_cold_credential: Credential, anchor?: Anchor | null): ResignCommitteeColdCert;
}
export class RewardAccountList {
  private constructor();
  free(): void;
  static new(): RewardAccountList;
  len(): number;
  get(index: number): RewardAddress;
  add(elem: RewardAddress): void;
}
export class RewardAddress {
  private constructor();
  free(): void;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): RewardAddress;
  static new(network: number, payment: Credential): RewardAddress;
  to_address(): Address;
  static from_address(address: Address): RewardAddress | undefined;
  network_id(): number;
  payment(): Credential;
}
export class Script {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Script;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Script;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Script;
  static new_native(script: NativeScript): Script;
  static new_plutus_v1(script: PlutusV1Script): Script;
  static new_plutus_v2(script: PlutusV2Script): Script;
  static new_plutus_v3(script: PlutusV3Script): Script;
  kind(): ScriptKind;
  as_native(): NativeScript | undefined;
  as_plutus_v1(): PlutusV1Script | undefined;
  as_plutus_v2(): PlutusV2Script | undefined;
  as_plutus_v3(): PlutusV3Script | undefined;
  hash(): ScriptHash;
  language(): Language | undefined;
}
export class ScriptAll {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ScriptAll;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ScriptAll;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ScriptAll;
  native_scripts(): NativeScriptList;
  static new(native_scripts: NativeScriptList): ScriptAll;
}
export class ScriptAny {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ScriptAny;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ScriptAny;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ScriptAny;
  native_scripts(): NativeScriptList;
  static new(native_scripts: NativeScriptList): ScriptAny;
}
export class ScriptDataHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): ScriptDataHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): ScriptDataHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): ScriptDataHash;
}
export class ScriptHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): ScriptHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): ScriptHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): ScriptHash;
}
export class ScriptInvalidBefore {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ScriptInvalidBefore;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ScriptInvalidBefore;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ScriptInvalidBefore;
  before(): bigint;
  static new(before: bigint): ScriptInvalidBefore;
}
export class ScriptInvalidHereafter {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ScriptInvalidHereafter;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ScriptInvalidHereafter;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ScriptInvalidHereafter;
  after(): bigint;
  static new(after: bigint): ScriptInvalidHereafter;
}
export class ScriptNOfK {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ScriptNOfK;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ScriptNOfK;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ScriptNOfK;
  n(): bigint;
  native_scripts(): NativeScriptList;
  static new(n: bigint, native_scripts: NativeScriptList): ScriptNOfK;
}
export class ScriptPubkey {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ScriptPubkey;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ScriptPubkey;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ScriptPubkey;
  ed25519_key_hash(): Ed25519KeyHash;
  static new(ed25519_key_hash: Ed25519KeyHash): ScriptPubkey;
}
export class ShelleyMAFormatAuxData {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): ShelleyMAFormatAuxData;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): ShelleyMAFormatAuxData;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): ShelleyMAFormatAuxData;
  transaction_metadata(): Metadata;
  auxiliary_scripts(): NativeScriptList;
  static new(transaction_metadata: Metadata, auxiliary_scripts: NativeScriptList): ShelleyMAFormatAuxData;
}
export class SignedTxBuilder {
  private constructor();
  free(): void;
  static new_with_data(body: TransactionBody, witness_set: TransactionWitnessSetBuilder, is_valid: boolean, auxiliary_data: AuxiliaryData): SignedTxBuilder;
  static new_without_data(body: TransactionBody, witness_set: TransactionWitnessSetBuilder, is_valid: boolean): SignedTxBuilder;
  /**
   *
   *     * Builds the final transaction and checks that all witnesses are there
   *     
   */
  build_checked(): Transaction;
  /**
   *
   *     * Builds the transaction without doing any witness checks.
   *     *
   *     * This can be useful if other witnesses will be added later.
   *     * e.g. CIP30 signing takes a Transaction with possible witnesses
   *     * to send to the wallet to fill in the missing ones.
   *     
   */
  build_unchecked(): Transaction;
  add_vkey(vkey: Vkeywitness): void;
  add_bootstrap(bootstrap: BootstrapWitness): void;
  body(): TransactionBody;
  witness_set(): TransactionWitnessSetBuilder;
  is_valid(): boolean;
  auxiliary_data(): AuxiliaryData | undefined;
}
export class SingleCertificateBuilder {
  private constructor();
  free(): void;
  static new(cert: Certificate): SingleCertificateBuilder;
  /**
   * note: particularly useful for StakeRegistration which doesn't require witnessing
   */
  skip_witness(): CertificateBuilderResult;
  payment_key(): CertificateBuilderResult;
  /**
   * Signer keys don't have to be set. You can leave it empty and then add the required witnesses later 
   */
  native_script(native_script: NativeScript, witness_info: NativeScriptWitnessInfo): CertificateBuilderResult;
  plutus_script(partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList): CertificateBuilderResult;
}
export class SingleHostAddr {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): SingleHostAddr;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): SingleHostAddr;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): SingleHostAddr;
  port(): number | undefined;
  ipv4(): Ipv4 | undefined;
  ipv6(): Ipv6 | undefined;
  static new(port?: number | null, ipv4?: Ipv4 | null, ipv6?: Ipv6 | null): SingleHostAddr;
}
export class SingleHostName {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): SingleHostName;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): SingleHostName;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): SingleHostName;
  port(): number | undefined;
  dns_name(): DNSName;
  /**
   * * `dns_name` - An A or AAAA DNS record
   */
  static new(port: number | null | undefined, dns_name: DNSName): SingleHostName;
}
export class SingleInputBuilder {
  private constructor();
  free(): void;
  static new(input: TransactionInput, utxo_info: TransactionOutput): SingleInputBuilder;
  static from_transaction_unspent_output(utxo: TransactionUnspentOutput): SingleInputBuilder;
  payment_key(): InputBuilderResult;
  native_script(native_script: NativeScript, witness_info: NativeScriptWitnessInfo): InputBuilderResult;
  plutus_script(partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList, datum: PlutusData): InputBuilderResult;
  plutus_script_inline_datum(partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList): InputBuilderResult;
}
export class SingleMintBuilder {
  private constructor();
  free(): void;
  static new(assets: MapAssetNameToNonZeroInt64): SingleMintBuilder;
  static new_single_asset(asset: AssetName, amount: bigint): SingleMintBuilder;
  native_script(native_script: NativeScript, witness_info: NativeScriptWitnessInfo): MintBuilderResult;
  plutus_script(partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList): MintBuilderResult;
}
export class SingleOutputBuilderResult {
  private constructor();
  free(): void;
  static new(output: TransactionOutput): SingleOutputBuilderResult;
  output(): TransactionOutput;
  communication_datum(): PlutusData | undefined;
}
export class SingleWithdrawalBuilder {
  private constructor();
  free(): void;
  static new(address: RewardAddress, amount: bigint): SingleWithdrawalBuilder;
  payment_key(): WithdrawalBuilderResult;
  native_script(native_script: NativeScript, witness_info: NativeScriptWitnessInfo): WithdrawalBuilderResult;
  plutus_script(partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList): WithdrawalBuilderResult;
}
export class SpendingData {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): SpendingData;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): SpendingData;
  static new_spending_data_pub_key(pubkey: Bip32PublicKey): SpendingData;
  static new_spending_data_script(script: ByronScript): SpendingData;
  static new_spending_data_redeem(redeem: PublicKey): SpendingData;
  kind(): SpendingDataKind;
  as_spending_data_pub_key(): Bip32PublicKey | undefined;
  as_spending_data_script(): ByronScript | undefined;
  as_spending_data_redeem(): PublicKey | undefined;
}
export class StakeCredentialList {
  private constructor();
  free(): void;
  static new(): StakeCredentialList;
  len(): number;
  get(index: number): Credential;
  add(elem: Credential): void;
}
export class StakeDelegation {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeDelegation;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeDelegation;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): StakeDelegation;
  stake_credential(): Credential;
  pool(): Ed25519KeyHash;
  static new(stake_credential: Credential, pool: Ed25519KeyHash): StakeDelegation;
}
export class StakeDeregistration {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeDeregistration;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeDeregistration;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): StakeDeregistration;
  stake_credential(): Credential;
  static new(stake_credential: Credential): StakeDeregistration;
}
export class StakeDistribution {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeDistribution;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeDistribution;
  static new_single_key(stakeholder_id: StakeholderId): StakeDistribution;
  static new_bootstrap_era(): StakeDistribution;
  kind(): StakeDistributionKind;
  as_single_key(): StakeholderId | undefined;
}
export class StakeRegDelegCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeRegDelegCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeRegDelegCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): StakeRegDelegCert;
  stake_credential(): Credential;
  pool(): Ed25519KeyHash;
  deposit(): bigint;
  static new(stake_credential: Credential, pool: Ed25519KeyHash, deposit: bigint): StakeRegDelegCert;
}
export class StakeRegistration {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeRegistration;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeRegistration;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): StakeRegistration;
  stake_credential(): Credential;
  static new(stake_credential: Credential): StakeRegistration;
}
export class StakeVoteDelegCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeVoteDelegCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeVoteDelegCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): StakeVoteDelegCert;
  stake_credential(): Credential;
  pool(): Ed25519KeyHash;
  d_rep(): DRep;
  static new(stake_credential: Credential, pool: Ed25519KeyHash, d_rep: DRep): StakeVoteDelegCert;
}
export class StakeVoteRegDelegCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): StakeVoteRegDelegCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): StakeVoteRegDelegCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): StakeVoteRegDelegCert;
  stake_credential(): Credential;
  pool(): Ed25519KeyHash;
  d_rep(): DRep;
  deposit(): bigint;
  static new(stake_credential: Credential, pool: Ed25519KeyHash, d_rep: DRep, deposit: bigint): StakeVoteRegDelegCert;
}
export class StakeholderId {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): StakeholderId;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): StakeholderId;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): StakeholderId;
  static new(pubk: Bip32PublicKey): StakeholderId;
}
export class Transaction {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Transaction;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Transaction;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Transaction;
  body(): TransactionBody;
  witness_set(): TransactionWitnessSet;
  is_valid(): boolean;
  auxiliary_data(): AuxiliaryData | undefined;
  static new(body: TransactionBody, witness_set: TransactionWitnessSet, is_valid: boolean, auxiliary_data?: AuxiliaryData | null): Transaction;
}
export class TransactionBody {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): TransactionBody;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): TransactionBody;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): TransactionBody;
  inputs(): TransactionInputList;
  outputs(): TransactionOutputList;
  fee(): bigint;
  set_ttl(ttl: bigint): void;
  ttl(): bigint | undefined;
  set_certs(certs: CertificateList): void;
  certs(): CertificateList | undefined;
  set_withdrawals(withdrawals: MapRewardAccountToCoin): void;
  withdrawals(): MapRewardAccountToCoin | undefined;
  set_auxiliary_data_hash(auxiliary_data_hash: AuxiliaryDataHash): void;
  auxiliary_data_hash(): AuxiliaryDataHash | undefined;
  set_validity_interval_start(validity_interval_start: bigint): void;
  validity_interval_start(): bigint | undefined;
  set_mint(mint: Mint): void;
  mint(): Mint | undefined;
  set_script_data_hash(script_data_hash: ScriptDataHash): void;
  script_data_hash(): ScriptDataHash | undefined;
  set_collateral_inputs(collateral_inputs: TransactionInputList): void;
  collateral_inputs(): TransactionInputList | undefined;
  set_required_signers(required_signers: Ed25519KeyHashList): void;
  required_signers(): Ed25519KeyHashList | undefined;
  set_network_id(network_id: NetworkId): void;
  network_id(): NetworkId | undefined;
  set_collateral_return(collateral_return: TransactionOutput): void;
  collateral_return(): TransactionOutput | undefined;
  set_total_collateral(total_collateral: bigint): void;
  total_collateral(): bigint | undefined;
  set_reference_inputs(reference_inputs: TransactionInputList): void;
  reference_inputs(): TransactionInputList | undefined;
  set_voting_procedures(voting_procedures: VotingProcedures): void;
  voting_procedures(): VotingProcedures | undefined;
  set_proposal_procedures(proposal_procedures: ProposalProcedureList): void;
  proposal_procedures(): ProposalProcedureList | undefined;
  set_current_treasury_value(current_treasury_value: bigint): void;
  current_treasury_value(): bigint | undefined;
  set_donation(donation: bigint): void;
  donation(): bigint | undefined;
  static new(inputs: TransactionInputList, outputs: TransactionOutputList, fee: bigint): TransactionBody;
}
export class TransactionBodyList {
  private constructor();
  free(): void;
  static new(): TransactionBodyList;
  len(): number;
  get(index: number): TransactionBody;
  add(elem: TransactionBody): void;
}
export class TransactionBuilder {
  private constructor();
  free(): void;
  /**
   * This automatically selects and adds inputs from {inputs} consisting of just enough to cover
   * the outputs that have already been added.
   * This should be called after adding all certs/outputs/etc and will be an error otherwise.
   * Uses CIP2: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0002/CIP-0002.md
   * Adding a change output must be called after via TransactionBuilder::add_change_if_needed()
   * This function, diverging from CIP2, takes into account fees and will attempt to add additional
   * inputs to cover the minimum fees. This does not, however, set the txbuilder's fee.
   */
  select_utxos(strategy: CoinSelectionStrategyCIP2): void;
  add_input(result: InputBuilderResult): void;
  add_utxo(result: InputBuilderResult): void;
  /**
   * calculates how much the fee would increase if you added a given output
   */
  fee_for_input(result: InputBuilderResult): bigint;
  /**
   * Add a reference input. Must be called BEFORE adding anything (inputs, certs, etc) that refer to this reference input.
   */
  add_reference_input(utxo: TransactionUnspentOutput): void;
  /**
   * Add explicit output via a TransactionOutput object
   */
  add_output(builder_result: SingleOutputBuilderResult): void;
  /**
   * calculates how much the fee would increase if you added a given output
   */
  fee_for_output(builder: SingleOutputBuilderResult): bigint;
  set_fee(fee: bigint): void;
  set_donation(donation: bigint): void;
  set_current_treasury_value(current_treasury_value: bigint): void;
  set_ttl(ttl: bigint): void;
  set_validity_start_interval(validity_start_interval: bigint): void;
  add_cert(result: CertificateBuilderResult): void;
  add_proposal(result: ProposalBuilderResult): void;
  add_vote(result: VoteBuilderResult): void;
  get_withdrawals(): MapRewardAccountToCoin | undefined;
  add_withdrawal(result: WithdrawalBuilderResult): void;
  get_auxiliary_data(): AuxiliaryData | undefined;
  set_auxiliary_data(new_aux_data: AuxiliaryData): void;
  add_auxiliary_data(new_aux_data: AuxiliaryData): void;
  add_mint(result: MintBuilderResult): void;
  /**
   * Returns a copy of the current mint state in the builder
   */
  get_mint(): Mint | undefined;
  static new(cfg: TransactionBuilderConfig): TransactionBuilder;
  add_collateral(result: InputBuilderResult): void;
  add_required_signer(hash: Ed25519KeyHash): void;
  set_network_id(network_id: NetworkId): void;
  network_id(): NetworkId | undefined;
  /**
   * does not include refunds or withdrawals
   */
  get_explicit_input(): Value;
  /**
   * withdrawals and refunds
   */
  get_implicit_input(): Value;
  /**
   * Return explicit input plus implicit input plus mint
   */
  get_total_input(): Value;
  /**
   * Return explicit output plus implicit output plus burn (does not consider fee directly)
   */
  get_total_output(): Value;
  /**
   * does not include fee
   */
  get_explicit_output(): Value;
  get_deposit(): bigint;
  get_fee_if_set(): bigint | undefined;
  set_collateral_return(output: TransactionOutput): void;
  full_size(): number;
  output_sizes(): Uint32Array;
  /**
   * Builds the transaction and moves to the next step redeemer units can be added and a draft tx can
   * be evaluated
   * NOTE: is_valid set to true
   */
  build_for_evaluation(algo: ChangeSelectionAlgo, change_address: Address): TxRedeemerBuilder;
  /**
   * Builds the transaction and moves to the next step where any real witness can be added
   * NOTE: is_valid set to true
   */
  build(algo: ChangeSelectionAlgo, change_address: Address): SignedTxBuilder;
  /**
   * used to override the exunit values initially provided when adding inputs
   */
  set_exunits(redeemer: RedeemerWitnessKey, ex_units: ExUnits): void;
  /**
   * warning: sum of all parts of a transaction must equal 0. You cannot just set the fee to the min value and forget about it
   * warning: min_fee may be slightly larger than the actual minimum fee (ex: a few lovelaces)
   * this is done to simplify the library code, but can be fixed later
   */
  min_fee(script_calulation: boolean): bigint;
  /**
   * Warning: this function will mutate the /fee/ field
   * Make sure to call this function last after setting all other tx-body properties
   * Editing inputs, outputs, mint, etc. after change been calculated
   * might cause a mismatch in calculated fee versus the required fee
   */
  add_change_if_needed(address: Address, include_exunits: boolean): boolean;
}
export class TransactionBuilderConfig {
  private constructor();
  free(): void;
}
export class TransactionBuilderConfigBuilder {
  private constructor();
  free(): void;
  static new(): TransactionBuilderConfigBuilder;
  fee_algo(fee_algo: LinearFee): TransactionBuilderConfigBuilder;
  coins_per_utxo_byte(coins_per_utxo_byte: bigint): TransactionBuilderConfigBuilder;
  pool_deposit(pool_deposit: bigint): TransactionBuilderConfigBuilder;
  key_deposit(key_deposit: bigint): TransactionBuilderConfigBuilder;
  max_value_size(max_value_size: number): TransactionBuilderConfigBuilder;
  max_tx_size(max_tx_size: number): TransactionBuilderConfigBuilder;
  prefer_pure_change(prefer_pure_change: boolean): TransactionBuilderConfigBuilder;
  ex_unit_prices(ex_unit_prices: ExUnitPrices): TransactionBuilderConfigBuilder;
  cost_models(cost_models: CostModels): TransactionBuilderConfigBuilder;
  collateral_percentage(collateral_percentage: number): TransactionBuilderConfigBuilder;
  max_collateral_inputs(max_collateral_inputs: number): TransactionBuilderConfigBuilder;
  build(): TransactionBuilderConfig;
}
export class TransactionHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): TransactionHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): TransactionHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): TransactionHash;
}
export class TransactionInput {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): TransactionInput;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): TransactionInput;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): TransactionInput;
  transaction_id(): TransactionHash;
  index(): bigint;
  static new(transaction_id: TransactionHash, index: bigint): TransactionInput;
}
export class TransactionInputList {
  private constructor();
  free(): void;
  static new(): TransactionInputList;
  len(): number;
  get(index: number): TransactionInput;
  add(elem: TransactionInput): void;
}
export class TransactionMetadatum {
  private constructor();
  free(): void;
  to_cbor_bytes(): Uint8Array;
  static from_cbor_bytes(cbor_bytes: Uint8Array): TransactionMetadatum;
  to_json(): string;
  to_json_value(): any;
  static from_json(json: string): TransactionMetadatum;
  static new_map(map: MetadatumMap): TransactionMetadatum;
  static new_list(elements: MetadatumList): TransactionMetadatum;
  static new_int(int: Int): TransactionMetadatum;
  static new_bytes(bytes: Uint8Array): TransactionMetadatum;
  static new_text(text: string): TransactionMetadatum;
  kind(): TransactionMetadatumKind;
  as_map(): MetadatumMap | undefined;
  as_list(): MetadatumList | undefined;
  as_int(): Int | undefined;
  as_bytes(): Uint8Array | undefined;
  as_text(): string | undefined;
}
export class TransactionMetadatumLabels {
  private constructor();
  free(): void;
  static new(): TransactionMetadatumLabels;
  len(): number;
  get(index: number): bigint;
  add(elem: bigint): void;
}
export class TransactionMetadatumList {
  private constructor();
  free(): void;
  static new(): TransactionMetadatumList;
  len(): number;
  get(index: number): TransactionMetadatum;
  add(elem: TransactionMetadatum): void;
}
export class TransactionOutput {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): TransactionOutput;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): TransactionOutput;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): TransactionOutput;
  static new_alonzo_format_tx_out(alonzo_format_tx_out: AlonzoFormatTxOut): TransactionOutput;
  static new_conway_format_tx_out(conway_format_tx_out: ConwayFormatTxOut): TransactionOutput;
  kind(): TransactionOutputKind;
  as_alonzo_format_tx_out(): AlonzoFormatTxOut | undefined;
  as_conway_format_tx_out(): ConwayFormatTxOut | undefined;
  static new(address: Address, amount: Value, datum_option?: DatumOption | null, script_reference?: Script | null): TransactionOutput;
  address(): Address;
  set_address(addr: Address): void;
  amount(): Value;
  set_amount(amount: Value): void;
  datum(): DatumOption | undefined;
  /**
   * Get the datum hash from a tx output if present as a hash.
   * Returns None if there is no datum, or the datum is inlined.
   * Use TransactionOutput::datum() for inlined datums.
   */
  datum_hash(): DatumHash | undefined;
  script_ref(): Script | undefined;
}
export class TransactionOutputAmountBuilder {
  private constructor();
  free(): void;
  with_value(amount: Value): TransactionOutputAmountBuilder;
  with_asset_and_min_required_coin(multiasset: MultiAsset, coins_per_utxo_byte: bigint): TransactionOutputAmountBuilder;
  build(): SingleOutputBuilderResult;
}
/**
 * We introduce a builder-pattern format for creating transaction outputs
 * This is because:
 * 1. Some fields (i.e. data hash) are optional, and we can't easily expose Option<> in WASM
 * 2. Some fields like amounts have many ways it could be set (some depending on other field values being known)
 * 3. Easier to adapt as the output format gets more complicated in future Cardano releases
 */
export class TransactionOutputBuilder {
  private constructor();
  free(): void;
  static new(): TransactionOutputBuilder;
  with_address(address: Address): TransactionOutputBuilder;
  /**
   * A communication datum is one where the data hash is used in the tx output
   * Yet the full datum is included in the witness of the same transaction
   */
  with_communication_data(datum: PlutusData): TransactionOutputBuilder;
  with_data(datum: DatumOption): TransactionOutputBuilder;
  with_reference_script(script_ref: Script): TransactionOutputBuilder;
  next(): TransactionOutputAmountBuilder;
}
export class TransactionOutputList {
  private constructor();
  free(): void;
  static new(): TransactionOutputList;
  len(): number;
  get(index: number): TransactionOutput;
  add(elem: TransactionOutput): void;
}
export class TransactionUnspentOutput {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes.
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): TransactionUnspentOutput;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type does NOT support fine-tuned encoding options so this may or may not be
   *             * canonical CBOR and may or may not preserve round-trip encodings.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): TransactionUnspentOutput;
  static new(input: TransactionInput, output: TransactionOutput): TransactionUnspentOutput;
  input(): TransactionInput;
  output(): TransactionOutput;
}
export class TransactionWitnessSet {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): TransactionWitnessSet;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): TransactionWitnessSet;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): TransactionWitnessSet;
  set_vkeywitnesses(vkeywitnesses: VkeywitnessList): void;
  vkeywitnesses(): VkeywitnessList | undefined;
  set_native_scripts(native_scripts: NativeScriptList): void;
  native_scripts(): NativeScriptList | undefined;
  set_bootstrap_witnesses(bootstrap_witnesses: BootstrapWitnessList): void;
  bootstrap_witnesses(): BootstrapWitnessList | undefined;
  set_plutus_v1_scripts(plutus_v1_scripts: PlutusV1ScriptList): void;
  plutus_v1_scripts(): PlutusV1ScriptList | undefined;
  set_plutus_datums(plutus_datums: PlutusDataList): void;
  plutus_datums(): PlutusDataList | undefined;
  set_redeemers(redeemers: Redeemers): void;
  redeemers(): Redeemers | undefined;
  set_plutus_v2_scripts(plutus_v2_scripts: PlutusV2ScriptList): void;
  plutus_v2_scripts(): PlutusV2ScriptList | undefined;
  set_plutus_v3_scripts(plutus_v3_scripts: PlutusV3ScriptList): void;
  plutus_v3_scripts(): PlutusV3ScriptList | undefined;
  static new(): TransactionWitnessSet;
  add_all_witnesses(other: TransactionWitnessSet): void;
  languages(): LanguageList;
}
/**
 * Builder de-duplicates witnesses as they are added
 */
export class TransactionWitnessSetBuilder {
  private constructor();
  free(): void;
  add_vkey(vkey_witness: Vkeywitness): void;
  add_bootstrap(bootstrap: BootstrapWitness): void;
  add_script(script: Script): void;
  get_native_script(): NativeScriptList;
  get_plutus_v1_script(): PlutusV1ScriptList;
  get_plutus_v2_script(): PlutusV2ScriptList;
  add_plutus_datum(plutus_datum: PlutusData): void;
  get_plutus_datum(): PlutusDataList;
  add_redeemer(redeemer: LegacyRedeemer): void;
  get_redeemer(): LegacyRedeemerList;
  add_required_wits(required_wits: RequiredWitnessSet): void;
  static new(): TransactionWitnessSetBuilder;
  add_existing(wit_set: TransactionWitnessSet): void;
  build(): TransactionWitnessSet;
  remaining_wits(): RequiredWitnessSet;
  try_build(): TransactionWitnessSet;
  merge_fake_witness(required_wits: RequiredWitnessSet): void;
}
export class TransactionWitnessSetList {
  private constructor();
  free(): void;
  static new(): TransactionWitnessSetList;
  len(): number;
  get(index: number): TransactionWitnessSet;
  add(elem: TransactionWitnessSet): void;
}
export class TreasuryWithdrawalsAction {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): TreasuryWithdrawalsAction;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): TreasuryWithdrawalsAction;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): TreasuryWithdrawalsAction;
  withdrawal(): MapRewardAccountToCoin;
  policy_hash(): ScriptHash | undefined;
  static new(withdrawal: MapRewardAccountToCoin, policy_hash?: ScriptHash | null): TreasuryWithdrawalsAction;
}
export class TxRedeemerBuilder {
  private constructor();
  free(): void;
  /**
   * Builds the transaction and moves to the next step where any real witness can be added
   * NOTE: is_valid set to true
   * Will NOT require you to have set required signers & witnesses
   */
  build(): Redeemers;
  /**
   * used to override the exunit values initially provided when adding inputs
   */
  set_exunits(redeemer: RedeemerWitnessKey, ex_units: ExUnits): void;
  /**
   * Transaction body with a dummy values for redeemers & script_data_hash
   * Used for calculating exunits or required signers
   */
  draft_body(): TransactionBody;
  auxiliary_data(): AuxiliaryData | undefined;
  /**
   * Transaction body with a dummy values for redeemers & script_data_hash and padded with dummy witnesses
   * Used for calculating exunits
   * note: is_valid set to true
   */
  draft_tx(): Transaction;
}
export class UnitInterval {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): UnitInterval;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): UnitInterval;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): UnitInterval;
  start(): bigint;
  end(): bigint;
  static new(start: bigint, end: bigint): UnitInterval;
}
export class UnregCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): UnregCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): UnregCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): UnregCert;
  stake_credential(): Credential;
  deposit(): bigint;
  static new(stake_credential: Credential, deposit: bigint): UnregCert;
}
export class UnregDrepCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): UnregDrepCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): UnregDrepCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): UnregDrepCert;
  drep_credential(): Credential;
  deposit(): bigint;
  static new(drep_credential: Credential, deposit: bigint): UnregDrepCert;
}
/**
 * Redeemer without the tag of index
 * This allows builder code to return partial redeemers
 * and then later have them placed in the right context
 */
export class UntaggedRedeemer {
  private constructor();
  free(): void;
  static new(data: PlutusData, ex_units: ExUnits): UntaggedRedeemer;
}
export class UpdateCommittee {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): UpdateCommittee;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): UpdateCommittee;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): UpdateCommittee;
  action_id(): GovActionId | undefined;
  cold_credentials(): CommitteeColdCredentialList;
  credentials(): MapCommitteeColdCredentialToEpoch;
  unit_interval(): UnitInterval;
  static new(action_id: GovActionId | null | undefined, cold_credentials: CommitteeColdCredentialList, credentials: MapCommitteeColdCredentialToEpoch, unit_interval: UnitInterval): UpdateCommittee;
}
export class UpdateDrepCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): UpdateDrepCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): UpdateDrepCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): UpdateDrepCert;
  drep_credential(): Credential;
  anchor(): Anchor | undefined;
  static new(drep_credential: Credential, anchor?: Anchor | null): UpdateDrepCert;
}
export class Url {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Url;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Url;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Url;
  get(): string;
}
export class VRFCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): VRFCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): VRFCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): VRFCert;
  output(): Uint8Array;
  proof(): Uint8Array;
  static new(output: Uint8Array, proof: Uint8Array): VRFCert;
}
export class VRFKeyHash {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): VRFKeyHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): VRFKeyHash;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): VRFKeyHash;
}
export class VRFVkey {
  private constructor();
  free(): void;
  to_bech32(prefix: string): string;
  static from_bech32(bech32_str: string): VRFVkey;
  /**
   *
   *             * Direct raw bytes without any CBOR structure
   *             
   */
  to_raw_bytes(): Uint8Array;
  /**
   *
   *             * Parse from the direct raw bytes, without any CBOR structure
   *             
   */
  static from_raw_bytes(bytes: Uint8Array): VRFVkey;
  /**
   *
   *             * Direct raw bytes without any CBOR structure, as a hex-encoded string
   *             
   */
  to_hex(): string;
  /**
   *
   *             * Parse from a hex string of the direct raw bytes, without any CBOR structure
   *             
   */
  static from_hex(input: string): VRFVkey;
}
export class Value {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Value;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Value;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Value;
  static from_coin(coin: bigint): Value;
  static new(coin: bigint, multiasset: MultiAsset): Value;
  coin(): bigint;
  multi_asset(): MultiAsset;
  static zero(): Value;
  is_zero(): boolean;
  has_multiassets(): boolean;
  checked_add(rhs: Value): Value;
  /**
   * Subtract ADA and/or assets
   * Removes an asset from the list if the result is 0 or less
   * Does not modify this object, instead the result is returned
   * None is returned if there would be integer underflow
   */
  checked_sub(rhs: Value): Value;
  clamped_sub(rhs: Value): Value;
}
export class Vkeywitness {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Vkeywitness;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Vkeywitness;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Vkeywitness;
  vkey(): PublicKey;
  ed25519_signature(): Ed25519Signature;
  static new(vkey: PublicKey, ed25519_signature: Ed25519Signature): Vkeywitness;
}
export class VkeywitnessList {
  private constructor();
  free(): void;
  static new(): VkeywitnessList;
  len(): number;
  get(index: number): Vkeywitness;
  add(elem: Vkeywitness): void;
}
export class VoteBuilder {
  private constructor();
  free(): void;
  static new(): VoteBuilder;
  with_vote(voter: Voter, gov_action_id: GovActionId, procedure: VotingProcedure): VoteBuilder;
  with_native_script_vote(voter: Voter, gov_action_id: GovActionId, procedure: VotingProcedure, native_script: NativeScript, witness_info: NativeScriptWitnessInfo): VoteBuilder;
  with_plutus_vote(voter: Voter, gov_action_id: GovActionId, procedure: VotingProcedure, partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList, datum: PlutusData): VoteBuilder;
  with_plutus_vote_inline_datum(voter: Voter, gov_action_id: GovActionId, procedure: VotingProcedure, partial_witness: PartialPlutusWitness, required_signers: Ed25519KeyHashList): VoteBuilder;
  build(): VoteBuilderResult;
}
export class VoteBuilderResult {
  private constructor();
  free(): void;
}
export class VoteDelegCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): VoteDelegCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): VoteDelegCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): VoteDelegCert;
  stake_credential(): Credential;
  d_rep(): DRep;
  static new(stake_credential: Credential, d_rep: DRep): VoteDelegCert;
}
export class VoteRegDelegCert {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): VoteRegDelegCert;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): VoteRegDelegCert;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): VoteRegDelegCert;
  stake_credential(): Credential;
  d_rep(): DRep;
  deposit(): bigint;
  static new(stake_credential: Credential, d_rep: DRep, deposit: bigint): VoteRegDelegCert;
}
export class Voter {
  private constructor();
  free(): void;
  key_hash(): Ed25519KeyHash | undefined;
  script_hash(): ScriptHash | undefined;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): Voter;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): Voter;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): Voter;
  static new_constitutional_committee_hot_key_hash(ed25519_key_hash: Ed25519KeyHash): Voter;
  static new_constitutional_committee_hot_script_hash(script_hash: ScriptHash): Voter;
  static new_d_rep_key_hash(ed25519_key_hash: Ed25519KeyHash): Voter;
  static new_d_rep_script_hash(script_hash: ScriptHash): Voter;
  static new_staking_pool_key_hash(ed25519_key_hash: Ed25519KeyHash): Voter;
  kind(): VoterKind;
  as_constitutional_committee_hot_key_hash(): Ed25519KeyHash | undefined;
  as_constitutional_committee_hot_script_hash(): ScriptHash | undefined;
  as_d_rep_key_hash(): Ed25519KeyHash | undefined;
  as_d_rep_script_hash(): ScriptHash | undefined;
  as_staking_pool_key_hash(): Ed25519KeyHash | undefined;
}
export class VoterList {
  private constructor();
  free(): void;
  static new(): VoterList;
  len(): number;
  get(index: number): Voter;
  add(elem: Voter): void;
}
export class VotingProcedure {
  private constructor();
  free(): void;
  /**
   *
   *             * Serialize this type to CBOR bytes
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings
   *             
   */
  to_canonical_cbor_bytes(): Uint8Array;
  /**
   *
   *             * Create this type from CBOR bytes
   *             
   */
  static from_cbor_bytes(cbor_bytes: Uint8Array): VotingProcedure;
  /**
   *
   *             * Serialize this type to CBOR bytes encoded as a hex string (useful for working with CIP30).
   *             * This type type supports encoding preservation so this will preserve round-trip CBOR formats.
   *             * If created from scratch the CBOR will be canonical.
   *             
   */
  to_cbor_hex(): string;
  /**
   *
   *             * Serialize this type to CBOR bytes using canonical CBOR encodings as hex bytes
   *             
   */
  to_canonical_cbor_hex(): string;
  /**
   *
   *             * Create this type from the CBOR bytes encoded as a hex string.
   *             * This is useful for interfacing with CIP30
   *             
   */
  static from_cbor_hex(cbor_bytes: string): VotingProcedure;
  to_json(): string;
  to_js_value(): any;
  static from_json(json: string): VotingProcedure;
  vote(): Vote;
  anchor(): Anchor | undefined;
  static new(vote: Vote, anchor?: Anchor | null): VotingProcedure;
}
export class VotingProcedures {
  private constructor();
  free(): void;
  static new(): VotingProcedures;
  len(): number;
  insert(key: Voter, value: MapGovActionIdToVotingProcedure): MapGovActionIdToVotingProcedure | undefined;
  get(key: Voter): MapGovActionIdToVotingProcedure | undefined;
  keys(): VoterList;
}
export class WithdrawalBuilderResult {
  private constructor();
  free(): void;
}
