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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_cip36delegation_free: (a: number, b: number) => void;
  readonly cip36delegation_to_cbor_bytes: (a: number) => [number, number];
  readonly cip36delegation_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly cip36delegation_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip36delegation_to_cbor_hex: (a: number) => [number, number];
  readonly cip36delegation_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly cip36delegation_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip36delegation_to_json: (a: number) => [number, number, number, number];
  readonly cip36delegation_to_js_value: (a: number) => [number, number, number];
  readonly cip36delegation_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36delegation_voting_pub_key: (a: number) => number;
  readonly cip36delegation_weight: (a: number) => number;
  readonly cip36delegation_new: (a: number, b: number) => number;
  readonly __wbg_cip36delegationdistribution_free: (a: number, b: number) => void;
  readonly cip36delegationdistribution_to_cbor_bytes: (a: number) => [number, number];
  readonly cip36delegationdistribution_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly cip36delegationdistribution_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip36delegationdistribution_to_cbor_hex: (a: number) => [number, number];
  readonly cip36delegationdistribution_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly cip36delegationdistribution_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip36delegationdistribution_to_json: (a: number) => [number, number, number, number];
  readonly cip36delegationdistribution_to_js_value: (a: number) => [number, number, number];
  readonly cip36delegationdistribution_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36delegationdistribution_new_weighted: (a: number) => number;
  readonly cip36delegationdistribution_new_legacy: (a: number) => number;
  readonly cip36delegationdistribution_kind: (a: number) => number;
  readonly cip36delegationdistribution_as_weighted: (a: number) => number;
  readonly cip36delegationdistribution_as_legacy: (a: number) => number;
  readonly __wbg_cip36delegationlist_free: (a: number, b: number) => void;
  readonly cip36delegationlist_new: () => number;
  readonly cip36delegationlist_len: (a: number) => number;
  readonly cip36delegationlist_get: (a: number, b: number) => number;
  readonly cip36delegationlist_add: (a: number, b: number) => void;
  readonly __wbg_cip36deregistrationcbor_free: (a: number, b: number) => void;
  readonly cip36deregistrationcbor_to_json: (a: number) => [number, number, number, number];
  readonly cip36deregistrationcbor_to_js_value: (a: number) => [number, number, number];
  readonly cip36deregistrationcbor_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36deregistrationcbor_key_deregistration: (a: number) => number;
  readonly cip36deregistrationcbor_deregistration_witness: (a: number) => number;
  readonly cip36deregistrationcbor_new: (a: number, b: number) => number;
  readonly __wbg_cip36deregistrationwitness_free: (a: number, b: number) => void;
  readonly cip36deregistrationwitness_to_cbor_bytes: (a: number) => [number, number];
  readonly cip36deregistrationwitness_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly cip36deregistrationwitness_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip36deregistrationwitness_to_cbor_hex: (a: number) => [number, number];
  readonly cip36deregistrationwitness_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly cip36deregistrationwitness_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip36deregistrationwitness_to_json: (a: number) => [number, number, number, number];
  readonly cip36deregistrationwitness_to_js_value: (a: number) => [number, number, number];
  readonly cip36deregistrationwitness_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36deregistrationwitness_stake_witness: (a: number) => number;
  readonly cip36deregistrationwitness_new: (a: number) => number;
  readonly __wbg_cip36keyderegistration_free: (a: number, b: number) => void;
  readonly cip36keyderegistration_to_cbor_bytes: (a: number) => [number, number];
  readonly cip36keyderegistration_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly cip36keyderegistration_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip36keyderegistration_to_cbor_hex: (a: number) => [number, number];
  readonly cip36keyderegistration_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly cip36keyderegistration_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip36keyderegistration_to_json: (a: number) => [number, number, number, number];
  readonly cip36keyderegistration_to_js_value: (a: number) => [number, number, number];
  readonly cip36keyderegistration_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36keyderegistration_stake_credential: (a: number) => number;
  readonly cip36keyderegistration_nonce: (a: number) => bigint;
  readonly cip36keyderegistration_set_voting_purpose: (a: number, b: bigint) => void;
  readonly cip36keyderegistration_voting_purpose: (a: number) => bigint;
  readonly __wbg_cip36keyregistration_free: (a: number, b: number) => void;
  readonly cip36keyregistration_to_cbor_bytes: (a: number) => [number, number];
  readonly cip36keyregistration_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly cip36keyregistration_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip36keyregistration_to_cbor_hex: (a: number) => [number, number];
  readonly cip36keyregistration_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly cip36keyregistration_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip36keyregistration_to_json: (a: number) => [number, number, number, number];
  readonly cip36keyregistration_to_js_value: (a: number) => [number, number, number];
  readonly cip36keyregistration_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36keyregistration_delegation: (a: number) => number;
  readonly cip36keyregistration_stake_credential: (a: number) => number;
  readonly cip36keyregistration_payment_address: (a: number) => number;
  readonly cip36keyregistration_nonce: (a: number) => bigint;
  readonly cip36keyregistration_set_voting_purpose: (a: number, b: bigint) => void;
  readonly cip36keyregistration_voting_purpose: (a: number) => bigint;
  readonly __wbg_cip36registrationcbor_free: (a: number, b: number) => void;
  readonly cip36registrationcbor_to_json: (a: number) => [number, number, number, number];
  readonly cip36registrationcbor_to_js_value: (a: number) => [number, number, number];
  readonly cip36registrationcbor_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36registrationcbor_key_registration: (a: number) => number;
  readonly cip36registrationcbor_registration_witness: (a: number) => number;
  readonly cip36registrationcbor_new: (a: number, b: number) => number;
  readonly __wbg_cip36registrationwitness_free: (a: number, b: number) => void;
  readonly cip36registrationwitness_to_cbor_bytes: (a: number) => [number, number];
  readonly cip36registrationwitness_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly cip36registrationwitness_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip36registrationwitness_to_cbor_hex: (a: number) => [number, number];
  readonly cip36registrationwitness_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly cip36registrationwitness_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip36registrationwitness_to_json: (a: number) => [number, number, number, number];
  readonly cip36registrationwitness_to_js_value: (a: number) => [number, number, number];
  readonly cip36registrationwitness_from_json: (a: number, b: number) => [number, number, number];
  readonly cip36registrationwitness_stake_witness: (a: number) => number;
  readonly cip36registrationwitness_new: (a: number) => number;
  readonly __wbg_cip25metadata_free: (a: number, b: number) => void;
  readonly cip25metadata_to_json: (a: number) => [number, number, number, number];
  readonly cip25metadata_to_js_value: (a: number) => [number, number, number];
  readonly cip25metadata_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25metadata_to_cbor_bytes: (a: number) => [number, number];
  readonly cip25metadata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip25metadata_key_721: (a: number) => number;
  readonly cip25metadata_new: (a: number) => number;
  readonly __wbg_cip25chunkablestring_free: (a: number, b: number) => void;
  readonly cip25chunkablestring_to_cbor_bytes: (a: number) => [number, number];
  readonly cip25chunkablestring_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip25chunkablestring_to_cbor_hex: (a: number) => [number, number];
  readonly cip25chunkablestring_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip25chunkablestring_to_json: (a: number) => [number, number, number, number];
  readonly cip25chunkablestring_to_js_value: (a: number) => [number, number, number];
  readonly cip25chunkablestring_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25chunkablestring_new_single: (a: number) => number;
  readonly cip25chunkablestring_new_chunked: (a: number) => number;
  readonly cip25chunkablestring_kind: (a: number) => number;
  readonly cip25chunkablestring_as_single: (a: number) => number;
  readonly cip25chunkablestring_as_chunked: (a: number) => number;
  readonly __wbg_cip25filesdetails_free: (a: number, b: number) => void;
  readonly cip25filesdetails_to_cbor_bytes: (a: number) => [number, number];
  readonly cip25filesdetails_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip25filesdetails_to_cbor_hex: (a: number) => [number, number];
  readonly cip25filesdetails_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip25filesdetails_to_json: (a: number) => [number, number, number, number];
  readonly cip25filesdetails_to_js_value: (a: number) => [number, number, number];
  readonly cip25filesdetails_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25filesdetails_name: (a: number) => number;
  readonly cip25filesdetails_media_type: (a: number) => number;
  readonly cip25filesdetails_src: (a: number) => number;
  readonly cip25filesdetails_new: (a: number, b: number, c: number) => number;
  readonly __wbg_filesdetailslist_free: (a: number, b: number) => void;
  readonly filesdetailslist_new: () => number;
  readonly filesdetailslist_len: (a: number) => number;
  readonly filesdetailslist_get: (a: number, b: number) => number;
  readonly filesdetailslist_add: (a: number, b: number) => void;
  readonly __wbg_cip25metadatadetails_free: (a: number, b: number) => void;
  readonly cip25metadatadetails_to_cbor_bytes: (a: number) => [number, number];
  readonly cip25metadatadetails_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip25metadatadetails_to_cbor_hex: (a: number) => [number, number];
  readonly cip25metadatadetails_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip25metadatadetails_to_json: (a: number) => [number, number, number, number];
  readonly cip25metadatadetails_to_js_value: (a: number) => [number, number, number];
  readonly cip25metadatadetails_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25metadatadetails_name: (a: number) => number;
  readonly cip25metadatadetails_image: (a: number) => number;
  readonly cip25metadatadetails_set_media_type: (a: number, b: number) => void;
  readonly cip25metadatadetails_media_type: (a: number) => number;
  readonly cip25metadatadetails_set_description: (a: number, b: number) => void;
  readonly cip25metadatadetails_description: (a: number) => number;
  readonly cip25metadatadetails_set_files: (a: number, b: number) => void;
  readonly cip25metadatadetails_files: (a: number) => number;
  readonly cip25metadatadetails_new: (a: number, b: number) => number;
  readonly __wbg_cip25string64_free: (a: number, b: number) => void;
  readonly cip25string64_to_cbor_bytes: (a: number) => [number, number];
  readonly cip25string64_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip25string64_to_cbor_hex: (a: number) => [number, number];
  readonly cip25string64_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip25string64_to_json: (a: number) => [number, number, number, number];
  readonly cip25string64_to_js_value: (a: number) => [number, number, number];
  readonly cip25string64_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25string64_get: (a: number) => [number, number];
  readonly __wbg_cip25string64list_free: (a: number, b: number) => void;
  readonly cip25string64list_new: () => number;
  readonly cip25string64list_len: (a: number) => number;
  readonly cip25string64list_get: (a: number, b: number) => number;
  readonly cip25string64list_add: (a: number, b: number) => void;
  readonly cip25metadata_to_metadata: (a: number) => [number, number, number];
  readonly cip25metadata_from_metadata: (a: number) => [number, number, number];
  readonly cip25metadata_add_to_metadata: (a: number, b: number) => [number, number];
  readonly cip25string64_new: (a: number, b: number) => [number, number, number];
  readonly cip25string64_to_str: (a: number) => [number, number];
  readonly cip25string64_get_str: (a: number) => [number, number];
  readonly cip25chunkablestring_from_string: (a: number, b: number) => number;
  readonly cip25chunkablestring_to_string: (a: number) => [number, number];
  readonly __wbg_cip25minimetadatadetails_free: (a: number, b: number) => void;
  readonly cip25minimetadatadetails_to_json: (a: number) => [number, number, number, number];
  readonly cip25minimetadatadetails_to_js_value: (a: number) => [number, number, number];
  readonly cip25minimetadatadetails_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25minimetadatadetails_new: () => number;
  readonly cip25minimetadatadetails_set_name: (a: number, b: number) => void;
  readonly cip25minimetadatadetails_name: (a: number) => number;
  readonly cip25minimetadatadetails_set_image: (a: number, b: number) => void;
  readonly cip25minimetadatadetails_image: (a: number) => number;
  readonly cip25minimetadatadetails_loose_parse: (a: number) => [number, number, number];
  readonly __wbg_cip25labelmetadata_free: (a: number, b: number) => void;
  readonly cip25labelmetadata_to_cbor_bytes: (a: number) => [number, number];
  readonly cip25labelmetadata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly cip25labelmetadata_to_cbor_hex: (a: number) => [number, number];
  readonly cip25labelmetadata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly cip25labelmetadata_to_json: (a: number) => [number, number, number, number];
  readonly cip25labelmetadata_to_js_value: (a: number) => [number, number, number];
  readonly cip25labelmetadata_from_json: (a: number, b: number) => [number, number, number];
  readonly cip25labelmetadata_new: (a: number) => number;
  readonly cip25labelmetadata_set: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly cip25labelmetadata_get: (a: number, b: number, c: number) => number;
  readonly cip25labelmetadata_version: (a: number) => number;
  readonly auxiliarydata_new: () => number;
  readonly auxiliarydata_metadata: (a: number) => number;
  readonly auxiliarydata_native_scripts: (a: number) => number;
  readonly auxiliarydata_plutus_v1_scripts: (a: number) => number;
  readonly auxiliarydata_plutus_v2_scripts: (a: number) => number;
  readonly auxiliarydata_add_metadata: (a: number, b: number) => void;
  readonly auxiliarydata_add_native_scripts: (a: number, b: number) => void;
  readonly auxiliarydata_add_plutus_v1_scripts: (a: number, b: number) => void;
  readonly auxiliarydata_add_plutus_v2_scripts: (a: number, b: number) => void;
  readonly auxiliarydata_add: (a: number, b: number) => void;
  readonly __wbg_auxiliarydata_free: (a: number, b: number) => void;
  readonly auxiliarydata_to_cbor_bytes: (a: number) => [number, number];
  readonly auxiliarydata_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly auxiliarydata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly auxiliarydata_to_cbor_hex: (a: number) => [number, number];
  readonly auxiliarydata_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly auxiliarydata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly auxiliarydata_to_json: (a: number) => [number, number, number, number];
  readonly auxiliarydata_to_js_value: (a: number) => [number, number, number];
  readonly auxiliarydata_from_json: (a: number, b: number) => [number, number, number];
  readonly auxiliarydata_new_shelley: (a: number) => number;
  readonly auxiliarydata_new_shelley_ma: (a: number) => number;
  readonly auxiliarydata_new_conway: (a: number) => number;
  readonly auxiliarydata_kind: (a: number) => number;
  readonly auxiliarydata_as_shelley: (a: number) => number;
  readonly auxiliarydata_as_shelley_ma: (a: number) => number;
  readonly auxiliarydata_as_conway: (a: number) => number;
  readonly __wbg_conwayformatauxdata_free: (a: number, b: number) => void;
  readonly conwayformatauxdata_to_cbor_bytes: (a: number) => [number, number];
  readonly conwayformatauxdata_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly conwayformatauxdata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly conwayformatauxdata_to_cbor_hex: (a: number) => [number, number];
  readonly conwayformatauxdata_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly conwayformatauxdata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly conwayformatauxdata_to_json: (a: number) => [number, number, number, number];
  readonly conwayformatauxdata_to_js_value: (a: number) => [number, number, number];
  readonly conwayformatauxdata_from_json: (a: number, b: number) => [number, number, number];
  readonly conwayformatauxdata_set_metadata: (a: number, b: number) => void;
  readonly conwayformatauxdata_metadata: (a: number) => number;
  readonly conwayformatauxdata_set_native_scripts: (a: number, b: number) => void;
  readonly conwayformatauxdata_native_scripts: (a: number) => number;
  readonly conwayformatauxdata_set_plutus_v1_scripts: (a: number, b: number) => void;
  readonly conwayformatauxdata_plutus_v1_scripts: (a: number) => number;
  readonly conwayformatauxdata_set_plutus_v2_scripts: (a: number, b: number) => void;
  readonly conwayformatauxdata_plutus_v2_scripts: (a: number) => number;
  readonly conwayformatauxdata_set_plutus_v3_scripts: (a: number, b: number) => void;
  readonly conwayformatauxdata_plutus_v3_scripts: (a: number) => number;
  readonly conwayformatauxdata_new: () => number;
  readonly __wbg_shelleymaformatauxdata_free: (a: number, b: number) => void;
  readonly shelleymaformatauxdata_to_cbor_bytes: (a: number) => [number, number];
  readonly shelleymaformatauxdata_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly shelleymaformatauxdata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly shelleymaformatauxdata_to_cbor_hex: (a: number) => [number, number];
  readonly shelleymaformatauxdata_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly shelleymaformatauxdata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly shelleymaformatauxdata_to_json: (a: number) => [number, number, number, number];
  readonly shelleymaformatauxdata_to_js_value: (a: number) => [number, number, number];
  readonly shelleymaformatauxdata_from_json: (a: number, b: number) => [number, number, number];
  readonly shelleymaformatauxdata_transaction_metadata: (a: number) => number;
  readonly shelleymaformatauxdata_auxiliary_scripts: (a: number) => number;
  readonly shelleymaformatauxdata_new: (a: number, b: number) => number;
  readonly __wbg_inputbuilderresult_free: (a: number, b: number) => void;
  readonly __wbg_singleinputbuilder_free: (a: number, b: number) => void;
  readonly singleinputbuilder_new: (a: number, b: number) => number;
  readonly singleinputbuilder_from_transaction_unspent_output: (a: number) => number;
  readonly singleinputbuilder_payment_key: (a: number) => [number, number, number];
  readonly singleinputbuilder_native_script: (a: number, b: number, c: number) => [number, number, number];
  readonly singleinputbuilder_plutus_script: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly singleinputbuilder_plutus_script_inline_datum: (a: number, b: number, c: number) => [number, number, number];
  readonly __wbg_transactionoutputbuilder_free: (a: number, b: number) => void;
  readonly transactionoutputbuilder_new: () => number;
  readonly transactionoutputbuilder_with_address: (a: number, b: number) => number;
  readonly transactionoutputbuilder_with_communication_data: (a: number, b: number) => number;
  readonly transactionoutputbuilder_with_data: (a: number, b: number) => number;
  readonly transactionoutputbuilder_with_reference_script: (a: number, b: number) => number;
  readonly transactionoutputbuilder_next: (a: number) => [number, number, number];
  readonly __wbg_transactionoutputamountbuilder_free: (a: number, b: number) => void;
  readonly transactionoutputamountbuilder_with_value: (a: number, b: number) => number;
  readonly transactionoutputamountbuilder_with_asset_and_min_required_coin: (a: number, b: number, c: bigint) => [number, number, number];
  readonly transactionoutputamountbuilder_build: (a: number) => [number, number, number];
  readonly __wbg_singleoutputbuilderresult_free: (a: number, b: number) => void;
  readonly singleoutputbuilderresult_new: (a: number) => number;
  readonly singleoutputbuilderresult_output: (a: number) => number;
  readonly singleoutputbuilderresult_communication_datum: (a: number) => number;
  readonly __wbg_withdrawalbuilderresult_free: (a: number, b: number) => void;
  readonly __wbg_singlewithdrawalbuilder_free: (a: number, b: number) => void;
  readonly singlewithdrawalbuilder_new: (a: number, b: bigint) => number;
  readonly singlewithdrawalbuilder_payment_key: (a: number) => [number, number, number];
  readonly singlewithdrawalbuilder_native_script: (a: number, b: number, c: number) => [number, number, number];
  readonly singlewithdrawalbuilder_plutus_script: (a: number, b: number, c: number) => [number, number, number];
  readonly __wbg_plutusscriptwitness_free: (a: number, b: number) => void;
  readonly plutusscriptwitness_new_script: (a: number) => number;
  readonly plutusscriptwitness_new_ref: (a: number) => number;
  readonly plutusscriptwitness_hash: (a: number) => number;
  readonly __wbg_partialplutuswitness_free: (a: number, b: number) => void;
  readonly partialplutuswitness_new: (a: number, b: number) => number;
  readonly partialplutuswitness_script: (a: number) => number;
  readonly partialplutuswitness_data: (a: number) => number;
  readonly __wbg_inputaggregatewitnessdata_free: (a: number, b: number) => void;
  readonly inputaggregatewitnessdata_plutus_data: (a: number) => number;
  readonly __wbg_requiredwitnessset_free: (a: number, b: number) => void;
  readonly requiredwitnessset_add_vkey_key_hash: (a: number, b: number) => void;
  readonly requiredwitnessset_add_bootstrap: (a: number, b: number) => void;
  readonly requiredwitnessset_add_script_ref: (a: number, b: number) => void;
  readonly requiredwitnessset_add_script_hash: (a: number, b: number) => void;
  readonly requiredwitnessset_add_plutus_datum_hash: (a: number, b: number) => void;
  readonly requiredwitnessset_add_redeemer_tag: (a: number, b: number) => void;
  readonly requiredwitnessset_add_all: (a: number, b: number) => void;
  readonly requiredwitnessset_new: () => number;
  readonly requiredwitnessset_withdrawal_required_wits: (a: number, b: number) => void;
  readonly __wbg_transactionwitnesssetbuilder_free: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_add_vkey: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_add_bootstrap: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_add_script: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_get_native_script: (a: number) => number;
  readonly transactionwitnesssetbuilder_get_plutus_v1_script: (a: number) => number;
  readonly transactionwitnesssetbuilder_get_plutus_v2_script: (a: number) => number;
  readonly transactionwitnesssetbuilder_add_plutus_datum: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_get_plutus_datum: (a: number) => number;
  readonly transactionwitnesssetbuilder_add_redeemer: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_get_redeemer: (a: number) => number;
  readonly transactionwitnesssetbuilder_add_required_wits: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_new: () => number;
  readonly transactionwitnesssetbuilder_add_existing: (a: number, b: number) => void;
  readonly transactionwitnesssetbuilder_build: (a: number) => number;
  readonly transactionwitnesssetbuilder_remaining_wits: (a: number) => number;
  readonly transactionwitnesssetbuilder_try_build: (a: number) => [number, number, number];
  readonly transactionwitnesssetbuilder_merge_fake_witness: (a: number, b: number) => void;
  readonly __wbg_nativescriptwitnessinfo_free: (a: number, b: number) => void;
  readonly nativescriptwitnessinfo_num_signatures: (a: number) => number;
  readonly nativescriptwitnessinfo_vkeys: (a: number) => number;
  readonly nativescriptwitnessinfo_assume_signature_count: () => number;
  readonly hash_auxiliary_data: (a: number) => number;
  readonly hash_transaction: (a: number) => number;
  readonly hash_plutus_data: (a: number) => number;
  readonly hash_script_data: (a: number, b: number, c: number) => number;
  readonly calc_script_data_hash: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly calc_script_data_hash_from_witness: (a: number, b: number) => [number, number, number];
  readonly __wbg_bootstrapwitness_free: (a: number, b: number) => void;
  readonly bootstrapwitness_to_cbor_bytes: (a: number) => [number, number];
  readonly bootstrapwitness_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly bootstrapwitness_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly bootstrapwitness_to_cbor_hex: (a: number) => [number, number];
  readonly bootstrapwitness_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly bootstrapwitness_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly bootstrapwitness_to_json: (a: number) => [number, number, number, number];
  readonly bootstrapwitness_to_js_value: (a: number) => [number, number, number];
  readonly bootstrapwitness_from_json: (a: number, b: number) => [number, number, number];
  readonly bootstrapwitness_public_key: (a: number) => number;
  readonly bootstrapwitness_signature: (a: number) => number;
  readonly bootstrapwitness_chain_code: (a: number) => [number, number];
  readonly bootstrapwitness_attributes: (a: number) => number;
  readonly bootstrapwitness_new: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly __wbg_kessignature_free: (a: number, b: number) => void;
  readonly kessignature_to_cbor_bytes: (a: number) => [number, number];
  readonly kessignature_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly kessignature_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly kessignature_to_cbor_hex: (a: number) => [number, number];
  readonly kessignature_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly kessignature_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly kessignature_to_json: (a: number) => [number, number, number, number];
  readonly kessignature_to_js_value: (a: number) => [number, number, number];
  readonly kessignature_from_json: (a: number, b: number) => [number, number, number];
  readonly kessignature_get: (a: number) => [number, number];
  readonly __wbg_nonce_free: (a: number, b: number) => void;
  readonly nonce_to_cbor_bytes: (a: number) => [number, number];
  readonly nonce_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly nonce_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly nonce_to_cbor_hex: (a: number) => [number, number];
  readonly nonce_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly nonce_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly nonce_to_json: (a: number) => [number, number, number, number];
  readonly nonce_to_js_value: (a: number) => [number, number, number];
  readonly nonce_from_json: (a: number, b: number) => [number, number, number];
  readonly nonce_new_identity: () => number;
  readonly nonce_new_hash: (a: number) => number;
  readonly nonce_kind: (a: number) => number;
  readonly nonce_as_hash: (a: number) => number;
  readonly __wbg_vrfcert_free: (a: number, b: number) => void;
  readonly vrfcert_to_cbor_bytes: (a: number) => [number, number];
  readonly vrfcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly vrfcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly vrfcert_to_cbor_hex: (a: number) => [number, number];
  readonly vrfcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly vrfcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly vrfcert_to_json: (a: number) => [number, number, number, number];
  readonly vrfcert_to_js_value: (a: number) => [number, number, number];
  readonly vrfcert_from_json: (a: number, b: number) => [number, number, number];
  readonly vrfcert_output: (a: number) => [number, number];
  readonly vrfcert_proof: (a: number) => [number, number];
  readonly vrfcert_new: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly __wbg_vkeywitness_free: (a: number, b: number) => void;
  readonly vkeywitness_to_cbor_bytes: (a: number) => [number, number];
  readonly vkeywitness_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly vkeywitness_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly vkeywitness_to_cbor_hex: (a: number) => [number, number];
  readonly vkeywitness_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly vkeywitness_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly vkeywitness_to_json: (a: number) => [number, number, number, number];
  readonly vkeywitness_to_js_value: (a: number) => [number, number, number];
  readonly vkeywitness_from_json: (a: number, b: number) => [number, number, number];
  readonly vkeywitness_vkey: (a: number) => number;
  readonly vkeywitness_ed25519_signature: (a: number) => number;
  readonly vkeywitness_new: (a: number, b: number) => number;
  readonly __wbg_networkinfo_free: (a: number, b: number) => void;
  readonly networkinfo_new: (a: number, b: number) => number;
  readonly networkinfo_network_id: (a: number) => number;
  readonly networkinfo_protocol_magic: (a: number) => number;
  readonly networkinfo_testnet: () => number;
  readonly networkinfo_mainnet: () => number;
  readonly networkinfo_preview: () => number;
  readonly networkinfo_preprod: () => number;
  readonly networkinfo_sancho_testnet: () => number;
  readonly __wbg_byrongenesisredeem_free: (a: number, b: number) => void;
  readonly byrongenesisredeem_new: (a: number, b: number) => number;
  readonly byrongenesisredeem_txid: (a: number) => number;
  readonly byrongenesisredeem_address: (a: number) => number;
  readonly genesis_txid_byron: (a: number, b: number) => number;
  readonly genesis_txid_shelley: (a: number) => number;
  readonly __wbg_constrplutusdata_free: (a: number, b: number) => void;
  readonly constrplutusdata_to_cbor_bytes: (a: number) => [number, number];
  readonly constrplutusdata_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly constrplutusdata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly constrplutusdata_to_cbor_hex: (a: number) => [number, number];
  readonly constrplutusdata_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly constrplutusdata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly constrplutusdata_to_json: (a: number) => [number, number, number, number];
  readonly constrplutusdata_to_js_value: (a: number) => [number, number, number];
  readonly constrplutusdata_from_json: (a: number, b: number) => [number, number, number];
  readonly constrplutusdata_alternative: (a: number) => bigint;
  readonly constrplutusdata_fields: (a: number) => number;
  readonly constrplutusdata_new: (a: bigint, b: number) => number;
  readonly plutusdata_to_cardano_node_format: (a: number) => number;
  readonly __wbg_plutusmap_free: (a: number, b: number) => void;
  readonly plutusmap_to_cbor_bytes: (a: number) => [number, number];
  readonly plutusmap_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly plutusmap_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusmap_to_cbor_hex: (a: number) => [number, number];
  readonly plutusmap_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly plutusmap_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly plutusmap_new: () => number;
  readonly plutusmap_len: (a: number) => number;
  readonly plutusmap_is_empty: (a: number) => number;
  readonly plutusmap_set: (a: number, b: number, c: number) => void;
  readonly plutusmap_get: (a: number, b: number) => number;
  readonly plutusmap_get_all: (a: number, b: number) => number;
  readonly plutusmap_keys: (a: number) => number;
  readonly __wbg_plutusscript_free: (a: number, b: number) => void;
  readonly plutusscript_from_v1: (a: number) => number;
  readonly plutusscript_from_v2: (a: number) => number;
  readonly plutusscript_from_v3: (a: number) => number;
  readonly plutusscript_hash: (a: number) => number;
  readonly plutusscript_as_v1: (a: number) => number;
  readonly plutusscript_as_v2: (a: number) => number;
  readonly plutusscript_as_v3: (a: number) => number;
  readonly plutusscript_version: (a: number) => number;
  readonly plutusv1script_hash: (a: number) => number;
  readonly plutusv2script_hash: (a: number) => number;
  readonly plutusv3script_hash: (a: number) => number;
  readonly plutusv1script_to_raw_bytes: (a: number) => [number, number];
  readonly plutusv1script_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusv1script_to_hex: (a: number) => [number, number];
  readonly plutusv1script_from_hex: (a: number, b: number) => [number, number, number];
  readonly plutusv2script_to_raw_bytes: (a: number) => [number, number];
  readonly plutusv2script_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusv2script_to_hex: (a: number) => [number, number];
  readonly plutusv2script_from_hex: (a: number, b: number) => [number, number, number];
  readonly plutusv3script_to_raw_bytes: (a: number) => [number, number];
  readonly plutusv3script_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusv3script_to_hex: (a: number) => [number, number];
  readonly plutusv3script_from_hex: (a: number, b: number) => [number, number, number];
  readonly redeemers_to_flat_format: (a: number) => number;
  readonly exunits_checked_add: (a: number, b: number) => [number, number, number];
  readonly compute_total_ex_units: (a: number) => [number, number, number];
  readonly __wbg_alonzoformattxout_free: (a: number, b: number) => void;
  readonly alonzoformattxout_to_cbor_bytes: (a: number) => [number, number];
  readonly alonzoformattxout_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly alonzoformattxout_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly alonzoformattxout_to_cbor_hex: (a: number) => [number, number];
  readonly alonzoformattxout_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly alonzoformattxout_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly alonzoformattxout_to_json: (a: number) => [number, number, number, number];
  readonly alonzoformattxout_to_js_value: (a: number) => [number, number, number];
  readonly alonzoformattxout_from_json: (a: number, b: number) => [number, number, number];
  readonly alonzoformattxout_address: (a: number) => number;
  readonly alonzoformattxout_amount: (a: number) => number;
  readonly alonzoformattxout_set_datum_hash: (a: number, b: number) => void;
  readonly alonzoformattxout_datum_hash: (a: number) => number;
  readonly alonzoformattxout_new: (a: number, b: number) => number;
  readonly __wbg_conwayformattxout_free: (a: number, b: number) => void;
  readonly conwayformattxout_to_cbor_bytes: (a: number) => [number, number];
  readonly conwayformattxout_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly conwayformattxout_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly conwayformattxout_to_cbor_hex: (a: number) => [number, number];
  readonly conwayformattxout_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly conwayformattxout_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly conwayformattxout_to_json: (a: number) => [number, number, number, number];
  readonly conwayformattxout_to_js_value: (a: number) => [number, number, number];
  readonly conwayformattxout_from_json: (a: number, b: number) => [number, number, number];
  readonly conwayformattxout_address: (a: number) => number;
  readonly conwayformattxout_amount: (a: number) => number;
  readonly conwayformattxout_set_datum_option: (a: number, b: number) => void;
  readonly conwayformattxout_datum_option: (a: number) => number;
  readonly conwayformattxout_set_script_reference: (a: number, b: number) => void;
  readonly conwayformattxout_script_reference: (a: number) => number;
  readonly conwayformattxout_new: (a: number, b: number) => number;
  readonly __wbg_datumoption_free: (a: number, b: number) => void;
  readonly datumoption_to_cbor_bytes: (a: number) => [number, number];
  readonly datumoption_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly datumoption_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly datumoption_to_cbor_hex: (a: number) => [number, number];
  readonly datumoption_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly datumoption_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly datumoption_to_json: (a: number) => [number, number, number, number];
  readonly datumoption_to_js_value: (a: number) => [number, number, number];
  readonly datumoption_from_json: (a: number, b: number) => [number, number, number];
  readonly datumoption_new_hash: (a: number) => number;
  readonly datumoption_new_datum: (a: number) => number;
  readonly datumoption_kind: (a: number) => number;
  readonly datumoption_as_hash: (a: number) => number;
  readonly datumoption_as_datum: (a: number) => number;
  readonly __wbg_nativescript_free: (a: number, b: number) => void;
  readonly nativescript_to_cbor_bytes: (a: number) => [number, number];
  readonly nativescript_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly nativescript_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly nativescript_to_cbor_hex: (a: number) => [number, number];
  readonly nativescript_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly nativescript_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly nativescript_to_json: (a: number) => [number, number, number, number];
  readonly nativescript_to_js_value: (a: number) => [number, number, number];
  readonly nativescript_from_json: (a: number, b: number) => [number, number, number];
  readonly nativescript_new_script_pubkey: (a: number) => number;
  readonly nativescript_new_script_all: (a: number) => number;
  readonly nativescript_new_script_any: (a: number) => number;
  readonly nativescript_new_script_n_of_k: (a: bigint, b: number) => number;
  readonly nativescript_new_script_invalid_before: (a: bigint) => number;
  readonly nativescript_new_script_invalid_hereafter: (a: bigint) => number;
  readonly nativescript_kind: (a: number) => number;
  readonly nativescript_as_script_pubkey: (a: number) => number;
  readonly nativescript_as_script_all: (a: number) => number;
  readonly nativescript_as_script_any: (a: number) => number;
  readonly nativescript_as_script_n_of_k: (a: number) => number;
  readonly nativescript_as_script_invalid_before: (a: number) => number;
  readonly nativescript_as_script_invalid_hereafter: (a: number) => number;
  readonly __wbg_scriptall_free: (a: number, b: number) => void;
  readonly scriptall_to_cbor_bytes: (a: number) => [number, number];
  readonly scriptall_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly scriptall_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptall_to_cbor_hex: (a: number) => [number, number];
  readonly scriptall_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly scriptall_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly scriptall_to_json: (a: number) => [number, number, number, number];
  readonly scriptall_to_js_value: (a: number) => [number, number, number];
  readonly scriptall_from_json: (a: number, b: number) => [number, number, number];
  readonly scriptall_native_scripts: (a: number) => number;
  readonly scriptall_new: (a: number) => number;
  readonly __wbg_scriptany_free: (a: number, b: number) => void;
  readonly scriptany_to_cbor_bytes: (a: number) => [number, number];
  readonly scriptany_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly scriptany_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptany_to_cbor_hex: (a: number) => [number, number];
  readonly scriptany_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly scriptany_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly scriptany_to_json: (a: number) => [number, number, number, number];
  readonly scriptany_to_js_value: (a: number) => [number, number, number];
  readonly scriptany_from_json: (a: number, b: number) => [number, number, number];
  readonly scriptany_native_scripts: (a: number) => number;
  readonly scriptany_new: (a: number) => number;
  readonly __wbg_scriptinvalidbefore_free: (a: number, b: number) => void;
  readonly scriptinvalidbefore_to_cbor_bytes: (a: number) => [number, number];
  readonly scriptinvalidbefore_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly scriptinvalidbefore_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptinvalidbefore_to_cbor_hex: (a: number) => [number, number];
  readonly scriptinvalidbefore_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly scriptinvalidbefore_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly scriptinvalidbefore_to_json: (a: number) => [number, number, number, number];
  readonly scriptinvalidbefore_to_js_value: (a: number) => [number, number, number];
  readonly scriptinvalidbefore_from_json: (a: number, b: number) => [number, number, number];
  readonly scriptinvalidbefore_before: (a: number) => bigint;
  readonly scriptinvalidbefore_new: (a: bigint) => number;
  readonly __wbg_scriptinvalidhereafter_free: (a: number, b: number) => void;
  readonly scriptinvalidhereafter_to_cbor_bytes: (a: number) => [number, number];
  readonly scriptinvalidhereafter_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly scriptinvalidhereafter_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptinvalidhereafter_to_cbor_hex: (a: number) => [number, number];
  readonly scriptinvalidhereafter_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly scriptinvalidhereafter_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly scriptinvalidhereafter_to_json: (a: number) => [number, number, number, number];
  readonly scriptinvalidhereafter_to_js_value: (a: number) => [number, number, number];
  readonly scriptinvalidhereafter_from_json: (a: number, b: number) => [number, number, number];
  readonly scriptinvalidhereafter_after: (a: number) => bigint;
  readonly scriptinvalidhereafter_new: (a: bigint) => number;
  readonly __wbg_scriptnofk_free: (a: number, b: number) => void;
  readonly scriptnofk_to_cbor_bytes: (a: number) => [number, number];
  readonly scriptnofk_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly scriptnofk_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptnofk_to_cbor_hex: (a: number) => [number, number];
  readonly scriptnofk_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly scriptnofk_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly scriptnofk_to_json: (a: number) => [number, number, number, number];
  readonly scriptnofk_to_js_value: (a: number) => [number, number, number];
  readonly scriptnofk_from_json: (a: number, b: number) => [number, number, number];
  readonly scriptnofk_n: (a: number) => bigint;
  readonly scriptnofk_native_scripts: (a: number) => number;
  readonly scriptnofk_new: (a: bigint, b: number) => number;
  readonly __wbg_scriptpubkey_free: (a: number, b: number) => void;
  readonly scriptpubkey_to_cbor_bytes: (a: number) => [number, number];
  readonly scriptpubkey_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly scriptpubkey_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptpubkey_to_cbor_hex: (a: number) => [number, number];
  readonly scriptpubkey_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly scriptpubkey_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly scriptpubkey_to_json: (a: number) => [number, number, number, number];
  readonly scriptpubkey_to_js_value: (a: number) => [number, number, number];
  readonly scriptpubkey_from_json: (a: number, b: number) => [number, number, number];
  readonly scriptpubkey_ed25519_key_hash: (a: number) => number;
  readonly scriptpubkey_new: (a: number) => number;
  readonly __wbg_transaction_free: (a: number, b: number) => void;
  readonly transaction_to_cbor_bytes: (a: number) => [number, number];
  readonly transaction_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly transaction_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transaction_to_cbor_hex: (a: number) => [number, number];
  readonly transaction_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly transaction_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly transaction_to_json: (a: number) => [number, number, number, number];
  readonly transaction_to_js_value: (a: number) => [number, number, number];
  readonly transaction_from_json: (a: number, b: number) => [number, number, number];
  readonly transaction_body: (a: number) => number;
  readonly transaction_witness_set: (a: number) => number;
  readonly transaction_is_valid: (a: number) => number;
  readonly transaction_auxiliary_data: (a: number) => number;
  readonly transaction_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_transactionbody_free: (a: number, b: number) => void;
  readonly transactionbody_to_cbor_bytes: (a: number) => [number, number];
  readonly transactionbody_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly transactionbody_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionbody_to_cbor_hex: (a: number) => [number, number];
  readonly transactionbody_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly transactionbody_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly transactionbody_to_json: (a: number) => [number, number, number, number];
  readonly transactionbody_to_js_value: (a: number) => [number, number, number];
  readonly transactionbody_from_json: (a: number, b: number) => [number, number, number];
  readonly transactionbody_inputs: (a: number) => number;
  readonly transactionbody_outputs: (a: number) => number;
  readonly transactionbody_fee: (a: number) => bigint;
  readonly transactionbody_set_ttl: (a: number, b: bigint) => void;
  readonly transactionbody_ttl: (a: number) => [number, bigint];
  readonly transactionbody_set_certs: (a: number, b: number) => void;
  readonly transactionbody_certs: (a: number) => number;
  readonly transactionbody_set_withdrawals: (a: number, b: number) => void;
  readonly transactionbody_withdrawals: (a: number) => number;
  readonly transactionbody_set_auxiliary_data_hash: (a: number, b: number) => void;
  readonly transactionbody_auxiliary_data_hash: (a: number) => number;
  readonly transactionbody_set_validity_interval_start: (a: number, b: bigint) => void;
  readonly transactionbody_validity_interval_start: (a: number) => [number, bigint];
  readonly transactionbody_set_mint: (a: number, b: number) => void;
  readonly transactionbody_mint: (a: number) => number;
  readonly transactionbody_set_script_data_hash: (a: number, b: number) => void;
  readonly transactionbody_script_data_hash: (a: number) => number;
  readonly transactionbody_set_collateral_inputs: (a: number, b: number) => void;
  readonly transactionbody_collateral_inputs: (a: number) => number;
  readonly transactionbody_set_required_signers: (a: number, b: number) => void;
  readonly transactionbody_required_signers: (a: number) => number;
  readonly transactionbody_set_network_id: (a: number, b: number) => void;
  readonly transactionbody_network_id: (a: number) => number;
  readonly transactionbody_set_collateral_return: (a: number, b: number) => void;
  readonly transactionbody_collateral_return: (a: number) => number;
  readonly transactionbody_set_total_collateral: (a: number, b: bigint) => void;
  readonly transactionbody_total_collateral: (a: number) => [number, bigint];
  readonly transactionbody_set_reference_inputs: (a: number, b: number) => void;
  readonly transactionbody_reference_inputs: (a: number) => number;
  readonly transactionbody_set_voting_procedures: (a: number, b: number) => void;
  readonly transactionbody_voting_procedures: (a: number) => number;
  readonly transactionbody_set_proposal_procedures: (a: number, b: number) => void;
  readonly transactionbody_proposal_procedures: (a: number) => number;
  readonly transactionbody_set_current_treasury_value: (a: number, b: bigint) => void;
  readonly transactionbody_current_treasury_value: (a: number) => [number, bigint];
  readonly transactionbody_set_donation: (a: number, b: bigint) => void;
  readonly transactionbody_donation: (a: number) => [number, bigint];
  readonly transactionbody_new: (a: number, b: number, c: bigint) => number;
  readonly __wbg_transactioninput_free: (a: number, b: number) => void;
  readonly transactioninput_to_cbor_bytes: (a: number) => [number, number];
  readonly transactioninput_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly transactioninput_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transactioninput_to_cbor_hex: (a: number) => [number, number];
  readonly transactioninput_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly transactioninput_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly transactioninput_to_json: (a: number) => [number, number, number, number];
  readonly transactioninput_to_js_value: (a: number) => [number, number, number];
  readonly transactioninput_from_json: (a: number, b: number) => [number, number, number];
  readonly transactioninput_transaction_id: (a: number) => number;
  readonly transactioninput_index: (a: number) => bigint;
  readonly transactioninput_new: (a: number, b: bigint) => number;
  readonly __wbg_transactionoutput_free: (a: number, b: number) => void;
  readonly transactionoutput_to_cbor_bytes: (a: number) => [number, number];
  readonly transactionoutput_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly transactionoutput_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionoutput_to_cbor_hex: (a: number) => [number, number];
  readonly transactionoutput_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly transactionoutput_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly transactionoutput_to_json: (a: number) => [number, number, number, number];
  readonly transactionoutput_to_js_value: (a: number) => [number, number, number];
  readonly transactionoutput_from_json: (a: number, b: number) => [number, number, number];
  readonly transactionoutput_new_alonzo_format_tx_out: (a: number) => number;
  readonly transactionoutput_new_conway_format_tx_out: (a: number) => number;
  readonly transactionoutput_kind: (a: number) => number;
  readonly transactionoutput_as_alonzo_format_tx_out: (a: number) => number;
  readonly transactionoutput_as_conway_format_tx_out: (a: number) => number;
  readonly __wbg_transactionwitnessset_free: (a: number, b: number) => void;
  readonly transactionwitnessset_to_cbor_bytes: (a: number) => [number, number];
  readonly transactionwitnessset_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly transactionwitnessset_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionwitnessset_to_cbor_hex: (a: number) => [number, number];
  readonly transactionwitnessset_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly transactionwitnessset_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly transactionwitnessset_to_json: (a: number) => [number, number, number, number];
  readonly transactionwitnessset_to_js_value: (a: number) => [number, number, number];
  readonly transactionwitnessset_from_json: (a: number, b: number) => [number, number, number];
  readonly transactionwitnessset_set_vkeywitnesses: (a: number, b: number) => void;
  readonly transactionwitnessset_vkeywitnesses: (a: number) => number;
  readonly transactionwitnessset_set_native_scripts: (a: number, b: number) => void;
  readonly transactionwitnessset_native_scripts: (a: number) => number;
  readonly transactionwitnessset_set_bootstrap_witnesses: (a: number, b: number) => void;
  readonly transactionwitnessset_bootstrap_witnesses: (a: number) => number;
  readonly transactionwitnessset_set_plutus_v1_scripts: (a: number, b: number) => void;
  readonly transactionwitnessset_plutus_v1_scripts: (a: number) => number;
  readonly transactionwitnessset_set_plutus_datums: (a: number, b: number) => void;
  readonly transactionwitnessset_plutus_datums: (a: number) => number;
  readonly transactionwitnessset_set_redeemers: (a: number, b: number) => void;
  readonly transactionwitnessset_redeemers: (a: number) => number;
  readonly transactionwitnessset_set_plutus_v2_scripts: (a: number, b: number) => void;
  readonly transactionwitnessset_plutus_v2_scripts: (a: number) => number;
  readonly transactionwitnessset_set_plutus_v3_scripts: (a: number, b: number) => void;
  readonly transactionwitnessset_plutus_v3_scripts: (a: number) => number;
  readonly transactionwitnessset_new: () => number;
  readonly __wbg_mapassetnametocoin_free: (a: number, b: number) => void;
  readonly mapassetnametocoin_get: (a: number, b: number) => [number, bigint];
  readonly mapassetnametocoin_insert: (a: number, b: number, c: bigint) => [number, bigint];
  readonly mapassetnametocoin_new: () => number;
  readonly mapassetnametocoin_len: (a: number) => number;
  readonly mapassetnametocoin_is_empty: (a: number) => number;
  readonly mapassetnametocoin_keys: (a: number) => number;
  readonly assetname_from_str: (a: number, b: number) => [number, number, number];
  readonly assetname_to_str: (a: number) => [number, number, number, number];
  readonly assetname_to_raw_bytes: (a: number) => [number, number];
  readonly assetname_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly assetname_to_hex: (a: number) => [number, number];
  readonly assetname_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_multiasset_free: (a: number, b: number) => void;
  readonly multiasset_new: () => number;
  readonly multiasset_policy_count: (a: number) => number;
  readonly multiasset_insert_assets: (a: number, b: number, c: number) => number;
  readonly multiasset_get_assets: (a: number, b: number) => number;
  readonly multiasset_get: (a: number, b: number, c: number) => [number, bigint];
  readonly multiasset_set: (a: number, b: number, c: number, d: bigint) => [number, bigint];
  readonly multiasset_keys: (a: number) => number;
  readonly multiasset_checked_add: (a: number, b: number) => [number, number, number];
  readonly multiasset_checked_sub: (a: number, b: number) => [number, number, number];
  readonly multiasset_clamped_sub: (a: number, b: number) => number;
  readonly __wbg_mint_free: (a: number, b: number) => void;
  readonly mint_new: () => number;
  readonly mint_policy_count: (a: number) => number;
  readonly mint_insert_assets: (a: number, b: number, c: number) => number;
  readonly mint_get_assets: (a: number, b: number) => number;
  readonly mint_get: (a: number, b: number, c: number) => [number, bigint];
  readonly mint_set: (a: number, b: number, c: number, d: bigint) => [number, bigint];
  readonly mint_keys: (a: number) => number;
  readonly mint_checked_add: (a: number, b: number) => [number, number, number];
  readonly mint_checked_sub: (a: number, b: number) => [number, number, number];
  readonly mint_as_positive_multiasset: (a: number) => number;
  readonly mint_as_negative_multiasset: (a: number) => number;
  readonly __wbg_value_free: (a: number, b: number) => void;
  readonly value_to_cbor_bytes: (a: number) => [number, number];
  readonly value_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly value_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly value_to_cbor_hex: (a: number) => [number, number];
  readonly value_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly value_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly value_to_json: (a: number) => [number, number, number, number];
  readonly value_to_js_value: (a: number) => [number, number, number];
  readonly value_from_json: (a: number, b: number) => [number, number, number];
  readonly value_from_coin: (a: bigint) => number;
  readonly value_new: (a: bigint, b: number) => number;
  readonly value_coin: (a: number) => bigint;
  readonly value_multi_asset: (a: number) => number;
  readonly value_zero: () => number;
  readonly value_is_zero: (a: number) => number;
  readonly value_has_multiassets: (a: number) => number;
  readonly value_checked_add: (a: number, b: number) => [number, number, number];
  readonly value_checked_sub: (a: number, b: number) => [number, number, number];
  readonly value_clamped_sub: (a: number, b: number) => number;
  readonly __wbg_addressid_free: (a: number, b: number) => void;
  readonly addressid_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly addressid_from_bech32: (a: number, b: number) => [number, number, number];
  readonly addressid_to_raw_bytes: (a: number) => [number, number];
  readonly addressid_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly addressid_to_hex: (a: number) => [number, number];
  readonly addressid_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_byronscript_free: (a: number, b: number) => void;
  readonly byronscript_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly byronscript_from_bech32: (a: number, b: number) => [number, number, number];
  readonly byronscript_to_raw_bytes: (a: number) => [number, number];
  readonly byronscript_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly byronscript_to_hex: (a: number) => [number, number];
  readonly byronscript_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_stakeholderid_free: (a: number, b: number) => void;
  readonly stakeholderid_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly stakeholderid_from_bech32: (a: number, b: number) => [number, number, number];
  readonly stakeholderid_to_raw_bytes: (a: number) => [number, number];
  readonly stakeholderid_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly stakeholderid_to_hex: (a: number) => [number, number];
  readonly stakeholderid_from_hex: (a: number, b: number) => [number, number, number];
  readonly stakeholderid_new: (a: number) => number;
  readonly addrattributes_new_bootstrap_era: (a: number, b: number) => number;
  readonly addrattributes_new_single_key: (a: number, b: number, c: number) => number;
  readonly addressid_new: (a: number, b: number, c: number) => number;
  readonly addresscontent_hash_and_create: (a: number, b: number, c: number) => number;
  readonly addresscontent_new_redeem: (a: number, b: number) => number;
  readonly addresscontent_new_simple: (a: number, b: number) => number;
  readonly addresscontent_to_address: (a: number) => number;
  readonly addresscontent_byron_protocol_magic: (a: number) => number;
  readonly addresscontent_network_id: (a: number) => [number, number, number];
  readonly addresscontent_icarus_from_key: (a: number, b: number) => number;
  readonly addresscontent_identical_with_pubkey: (a: number, b: number) => number;
  readonly byronaddress_to_base58: (a: number) => [number, number];
  readonly byronaddress_from_base58: (a: number, b: number) => [number, number, number];
  readonly byronaddress_is_valid: (a: number, b: number) => number;
  readonly byronaddress_to_address: (a: number) => number;
  readonly byronaddress_from_address: (a: number) => number;
  readonly byronaddress_from_address_content: (a: number) => number;
  readonly __wbg_protocolmagic_free: (a: number, b: number) => void;
  readonly protocolmagic_new: (a: number) => number;
  readonly protocolmagic_to_int: (a: number) => number;
  readonly make_daedalus_bootstrap_witness: (a: number, b: number, c: number) => number;
  readonly make_icarus_bootstrap_witness: (a: number, b: number, c: number) => number;
  readonly __wbg_certificatebuilderresult_free: (a: number, b: number) => void;
  readonly __wbg_singlecertificatebuilder_free: (a: number, b: number) => void;
  readonly singlecertificatebuilder_new: (a: number) => number;
  readonly singlecertificatebuilder_skip_witness: (a: number) => number;
  readonly singlecertificatebuilder_payment_key: (a: number) => [number, number, number];
  readonly singlecertificatebuilder_native_script: (a: number, b: number, c: number) => [number, number, number];
  readonly singlecertificatebuilder_plutus_script: (a: number, b: number, c: number) => [number, number, number];
  readonly __wbg_proposalbuilderresult_free: (a: number, b: number) => void;
  readonly __wbg_proposalbuilder_free: (a: number, b: number) => void;
  readonly proposalbuilder_new: () => number;
  readonly proposalbuilder_with_proposal: (a: number, b: number) => [number, number, number];
  readonly proposalbuilder_with_native_script_proposal: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly proposalbuilder_with_plutus_proposal: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly proposalbuilder_with_plutus_proposal_inline_datum: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly proposalbuilder_build: (a: number) => number;
  readonly __wbg_redeemerwitnesskey_free: (a: number, b: number) => void;
  readonly redeemerwitnesskey_new: (a: number, b: bigint) => number;
  readonly redeemerwitnesskey_from_redeemer: (a: number) => number;
  readonly __wbg_untaggedredeemer_free: (a: number, b: number) => void;
  readonly untaggedredeemer_new: (a: number, b: number) => number;
  readonly __wbg_redeemersetbuilder_free: (a: number, b: number) => void;
  readonly redeemersetbuilder_new: () => number;
  readonly redeemersetbuilder_is_empty: (a: number) => number;
  readonly redeemersetbuilder_update_ex_units: (a: number, b: number, c: number) => void;
  readonly redeemersetbuilder_add_spend: (a: number, b: number) => void;
  readonly redeemersetbuilder_add_mint: (a: number, b: number) => void;
  readonly redeemersetbuilder_add_reward: (a: number, b: number) => void;
  readonly redeemersetbuilder_add_cert: (a: number, b: number) => void;
  readonly redeemersetbuilder_add_proposal: (a: number, b: number) => void;
  readonly redeemersetbuilder_add_vote: (a: number, b: number) => void;
  readonly redeemersetbuilder_build: (a: number, b: number) => [number, number, number];
  readonly __wbg_transactionunspentoutput_free: (a: number, b: number) => void;
  readonly transactionunspentoutput_to_cbor_bytes: (a: number) => [number, number];
  readonly transactionunspentoutput_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionunspentoutput_to_cbor_hex: (a: number) => [number, number];
  readonly transactionunspentoutput_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly transactionunspentoutput_new: (a: number, b: number) => number;
  readonly transactionunspentoutput_input: (a: number) => number;
  readonly transactionunspentoutput_output: (a: number) => number;
  readonly __wbg_transactionbuilderconfig_free: (a: number, b: number) => void;
  readonly __wbg_transactionbuilderconfigbuilder_free: (a: number, b: number) => void;
  readonly transactionbuilderconfigbuilder_new: () => number;
  readonly transactionbuilderconfigbuilder_fee_algo: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_coins_per_utxo_byte: (a: number, b: bigint) => number;
  readonly transactionbuilderconfigbuilder_pool_deposit: (a: number, b: bigint) => number;
  readonly transactionbuilderconfigbuilder_key_deposit: (a: number, b: bigint) => number;
  readonly transactionbuilderconfigbuilder_max_value_size: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_max_tx_size: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_prefer_pure_change: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_ex_unit_prices: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_cost_models: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_collateral_percentage: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_max_collateral_inputs: (a: number, b: number) => number;
  readonly transactionbuilderconfigbuilder_build: (a: number) => [number, number, number];
  readonly __wbg_transactionbuilder_free: (a: number, b: number) => void;
  readonly transactionbuilder_select_utxos: (a: number, b: number) => [number, number];
  readonly transactionbuilder_add_input: (a: number, b: number) => [number, number];
  readonly transactionbuilder_add_utxo: (a: number, b: number) => void;
  readonly transactionbuilder_fee_for_input: (a: number, b: number) => [bigint, number, number];
  readonly transactionbuilder_add_reference_input: (a: number, b: number) => void;
  readonly transactionbuilder_add_output: (a: number, b: number) => [number, number];
  readonly transactionbuilder_fee_for_output: (a: number, b: number) => [bigint, number, number];
  readonly transactionbuilder_set_fee: (a: number, b: bigint) => void;
  readonly transactionbuilder_set_donation: (a: number, b: bigint) => void;
  readonly transactionbuilder_set_current_treasury_value: (a: number, b: bigint) => void;
  readonly transactionbuilder_set_ttl: (a: number, b: bigint) => void;
  readonly transactionbuilder_set_validity_start_interval: (a: number, b: bigint) => void;
  readonly transactionbuilder_add_cert: (a: number, b: number) => void;
  readonly transactionbuilder_add_proposal: (a: number, b: number) => void;
  readonly transactionbuilder_add_vote: (a: number, b: number) => void;
  readonly transactionbuilder_get_withdrawals: (a: number) => number;
  readonly transactionbuilder_add_withdrawal: (a: number, b: number) => void;
  readonly transactionbuilder_get_auxiliary_data: (a: number) => number;
  readonly transactionbuilder_set_auxiliary_data: (a: number, b: number) => void;
  readonly transactionbuilder_add_auxiliary_data: (a: number, b: number) => void;
  readonly transactionbuilder_add_mint: (a: number, b: number) => [number, number];
  readonly transactionbuilder_get_mint: (a: number) => number;
  readonly transactionbuilder_new: (a: number) => number;
  readonly transactionbuilder_add_collateral: (a: number, b: number) => [number, number];
  readonly transactionbuilder_add_required_signer: (a: number, b: number) => void;
  readonly transactionbuilder_set_network_id: (a: number, b: number) => void;
  readonly transactionbuilder_network_id: (a: number) => number;
  readonly transactionbuilder_get_explicit_input: (a: number) => [number, number, number];
  readonly transactionbuilder_get_implicit_input: (a: number) => [number, number, number];
  readonly transactionbuilder_get_total_input: (a: number) => [number, number, number];
  readonly transactionbuilder_get_total_output: (a: number) => [number, number, number];
  readonly transactionbuilder_get_explicit_output: (a: number) => [number, number, number];
  readonly transactionbuilder_get_deposit: (a: number) => [bigint, number, number];
  readonly transactionbuilder_get_fee_if_set: (a: number) => [number, bigint];
  readonly transactionbuilder_set_collateral_return: (a: number, b: number) => void;
  readonly transactionbuilder_full_size: (a: number) => [number, number, number];
  readonly transactionbuilder_output_sizes: (a: number) => [number, number];
  readonly transactionbuilder_build_for_evaluation: (a: number, b: number, c: number) => [number, number, number];
  readonly transactionbuilder_build: (a: number, b: number, c: number) => [number, number, number];
  readonly transactionbuilder_set_exunits: (a: number, b: number, c: number) => void;
  readonly transactionbuilder_min_fee: (a: number, b: number) => [bigint, number, number];
  readonly transactionbuilder_add_change_if_needed: (a: number, b: number, c: number) => [number, number, number];
  readonly __wbg_txredeemerbuilder_free: (a: number, b: number) => void;
  readonly txredeemerbuilder_build: (a: number) => [number, number, number];
  readonly txredeemerbuilder_set_exunits: (a: number, b: number, c: number) => void;
  readonly txredeemerbuilder_draft_body: (a: number) => number;
  readonly txredeemerbuilder_auxiliary_data: (a: number) => number;
  readonly txredeemerbuilder_draft_tx: (a: number) => [number, number, number];
  readonly __wbg_signedtxbuilder_free: (a: number, b: number) => void;
  readonly signedtxbuilder_new_with_data: (a: number, b: number, c: number, d: number) => number;
  readonly signedtxbuilder_new_without_data: (a: number, b: number, c: number) => number;
  readonly signedtxbuilder_build_checked: (a: number) => [number, number, number];
  readonly signedtxbuilder_build_unchecked: (a: number) => number;
  readonly signedtxbuilder_add_vkey: (a: number, b: number) => void;
  readonly signedtxbuilder_add_bootstrap: (a: number, b: number) => void;
  readonly signedtxbuilder_body: (a: number) => number;
  readonly signedtxbuilder_witness_set: (a: number) => number;
  readonly signedtxbuilder_is_valid: (a: number) => number;
  readonly signedtxbuilder_auxiliary_data: (a: number) => number;
  readonly __wbg_anchor_free: (a: number, b: number) => void;
  readonly anchor_to_cbor_bytes: (a: number) => [number, number];
  readonly anchor_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly anchor_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly anchor_to_cbor_hex: (a: number) => [number, number];
  readonly anchor_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly anchor_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly anchor_to_json: (a: number) => [number, number, number, number];
  readonly anchor_to_js_value: (a: number) => [number, number, number];
  readonly anchor_from_json: (a: number, b: number) => [number, number, number];
  readonly anchor_anchor_url: (a: number) => number;
  readonly anchor_anchor_doc_hash: (a: number) => number;
  readonly anchor_new: (a: number, b: number) => number;
  readonly __wbg_constitution_free: (a: number, b: number) => void;
  readonly constitution_to_cbor_bytes: (a: number) => [number, number];
  readonly constitution_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly constitution_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly constitution_to_cbor_hex: (a: number) => [number, number];
  readonly constitution_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly constitution_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly constitution_to_json: (a: number) => [number, number, number, number];
  readonly constitution_to_js_value: (a: number) => [number, number, number];
  readonly constitution_from_json: (a: number, b: number) => [number, number, number];
  readonly constitution_anchor: (a: number) => number;
  readonly constitution_script_hash: (a: number) => number;
  readonly constitution_new: (a: number, b: number) => number;
  readonly __wbg_govaction_free: (a: number, b: number) => void;
  readonly govaction_to_cbor_bytes: (a: number) => [number, number];
  readonly govaction_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly govaction_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly govaction_to_cbor_hex: (a: number) => [number, number];
  readonly govaction_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly govaction_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly govaction_to_json: (a: number) => [number, number, number, number];
  readonly govaction_to_js_value: (a: number) => [number, number, number];
  readonly govaction_from_json: (a: number, b: number) => [number, number, number];
  readonly govaction_new_parameter_change_action: (a: number, b: number, c: number) => number;
  readonly govaction_new_hard_fork_initiation_action: (a: number, b: number) => number;
  readonly govaction_new_treasury_withdrawals_action: (a: number, b: number) => number;
  readonly govaction_new_no_confidence: (a: number) => number;
  readonly govaction_new_update_committee: (a: number, b: number, c: number, d: number) => number;
  readonly govaction_new_new_constitution: (a: number, b: number) => number;
  readonly govaction_new_info_action: () => number;
  readonly govaction_kind: (a: number) => number;
  readonly govaction_as_parameter_change_action: (a: number) => number;
  readonly govaction_as_hard_fork_initiation_action: (a: number) => number;
  readonly govaction_as_treasury_withdrawals_action: (a: number) => number;
  readonly govaction_as_no_confidence: (a: number) => number;
  readonly govaction_as_update_committee: (a: number) => number;
  readonly govaction_as_new_constitution: (a: number) => number;
  readonly __wbg_govactionid_free: (a: number, b: number) => void;
  readonly govactionid_to_cbor_bytes: (a: number) => [number, number];
  readonly govactionid_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly govactionid_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly govactionid_to_cbor_hex: (a: number) => [number, number];
  readonly govactionid_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly govactionid_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly govactionid_to_json: (a: number) => [number, number, number, number];
  readonly govactionid_to_js_value: (a: number) => [number, number, number];
  readonly govactionid_from_json: (a: number, b: number) => [number, number, number];
  readonly govactionid_transaction_id: (a: number) => number;
  readonly govactionid_gov_action_index: (a: number) => bigint;
  readonly govactionid_new: (a: number, b: bigint) => number;
  readonly __wbg_hardforkinitiationaction_free: (a: number, b: number) => void;
  readonly hardforkinitiationaction_to_cbor_bytes: (a: number) => [number, number];
  readonly hardforkinitiationaction_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly hardforkinitiationaction_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly hardforkinitiationaction_to_cbor_hex: (a: number) => [number, number];
  readonly hardforkinitiationaction_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly hardforkinitiationaction_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly hardforkinitiationaction_to_json: (a: number) => [number, number, number, number];
  readonly hardforkinitiationaction_to_js_value: (a: number) => [number, number, number];
  readonly hardforkinitiationaction_from_json: (a: number, b: number) => [number, number, number];
  readonly hardforkinitiationaction_action_id: (a: number) => number;
  readonly hardforkinitiationaction_version: (a: number) => number;
  readonly hardforkinitiationaction_new: (a: number, b: number) => number;
  readonly __wbg_newconstitution_free: (a: number, b: number) => void;
  readonly newconstitution_to_cbor_bytes: (a: number) => [number, number];
  readonly newconstitution_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly newconstitution_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly newconstitution_to_cbor_hex: (a: number) => [number, number];
  readonly newconstitution_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly newconstitution_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly newconstitution_to_json: (a: number) => [number, number, number, number];
  readonly newconstitution_to_js_value: (a: number) => [number, number, number];
  readonly newconstitution_from_json: (a: number, b: number) => [number, number, number];
  readonly newconstitution_action_id: (a: number) => number;
  readonly newconstitution_constitution: (a: number) => number;
  readonly newconstitution_new: (a: number, b: number) => number;
  readonly __wbg_noconfidence_free: (a: number, b: number) => void;
  readonly noconfidence_to_cbor_bytes: (a: number) => [number, number];
  readonly noconfidence_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly noconfidence_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly noconfidence_to_cbor_hex: (a: number) => [number, number];
  readonly noconfidence_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly noconfidence_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly noconfidence_to_json: (a: number) => [number, number, number, number];
  readonly noconfidence_to_js_value: (a: number) => [number, number, number];
  readonly noconfidence_from_json: (a: number, b: number) => [number, number, number];
  readonly noconfidence_action_id: (a: number) => number;
  readonly noconfidence_new: (a: number) => number;
  readonly __wbg_parameterchangeaction_free: (a: number, b: number) => void;
  readonly parameterchangeaction_to_cbor_bytes: (a: number) => [number, number];
  readonly parameterchangeaction_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly parameterchangeaction_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly parameterchangeaction_to_cbor_hex: (a: number) => [number, number];
  readonly parameterchangeaction_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly parameterchangeaction_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly parameterchangeaction_to_json: (a: number) => [number, number, number, number];
  readonly parameterchangeaction_to_js_value: (a: number) => [number, number, number];
  readonly parameterchangeaction_from_json: (a: number, b: number) => [number, number, number];
  readonly parameterchangeaction_action_id: (a: number) => number;
  readonly parameterchangeaction_update: (a: number) => number;
  readonly parameterchangeaction_policy_hash: (a: number) => number;
  readonly parameterchangeaction_new: (a: number, b: number, c: number) => number;
  readonly __wbg_proposalprocedure_free: (a: number, b: number) => void;
  readonly proposalprocedure_to_cbor_bytes: (a: number) => [number, number];
  readonly proposalprocedure_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly proposalprocedure_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly proposalprocedure_to_cbor_hex: (a: number) => [number, number];
  readonly proposalprocedure_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly proposalprocedure_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly proposalprocedure_to_json: (a: number) => [number, number, number, number];
  readonly proposalprocedure_to_js_value: (a: number) => [number, number, number];
  readonly proposalprocedure_from_json: (a: number, b: number) => [number, number, number];
  readonly proposalprocedure_deposit: (a: number) => bigint;
  readonly proposalprocedure_reward_account: (a: number) => number;
  readonly proposalprocedure_gov_action: (a: number) => number;
  readonly proposalprocedure_anchor: (a: number) => number;
  readonly proposalprocedure_new: (a: bigint, b: number, c: number, d: number) => number;
  readonly __wbg_treasurywithdrawalsaction_free: (a: number, b: number) => void;
  readonly treasurywithdrawalsaction_to_cbor_bytes: (a: number) => [number, number];
  readonly treasurywithdrawalsaction_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly treasurywithdrawalsaction_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly treasurywithdrawalsaction_to_cbor_hex: (a: number) => [number, number];
  readonly treasurywithdrawalsaction_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly treasurywithdrawalsaction_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly treasurywithdrawalsaction_to_json: (a: number) => [number, number, number, number];
  readonly treasurywithdrawalsaction_to_js_value: (a: number) => [number, number, number];
  readonly treasurywithdrawalsaction_from_json: (a: number, b: number) => [number, number, number];
  readonly treasurywithdrawalsaction_withdrawal: (a: number) => number;
  readonly treasurywithdrawalsaction_policy_hash: (a: number) => number;
  readonly treasurywithdrawalsaction_new: (a: number, b: number) => number;
  readonly __wbg_updatecommittee_free: (a: number, b: number) => void;
  readonly updatecommittee_to_cbor_bytes: (a: number) => [number, number];
  readonly updatecommittee_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly updatecommittee_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly updatecommittee_to_cbor_hex: (a: number) => [number, number];
  readonly updatecommittee_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly updatecommittee_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly updatecommittee_to_json: (a: number) => [number, number, number, number];
  readonly updatecommittee_to_js_value: (a: number) => [number, number, number];
  readonly updatecommittee_from_json: (a: number, b: number) => [number, number, number];
  readonly updatecommittee_action_id: (a: number) => number;
  readonly updatecommittee_cold_credentials: (a: number) => number;
  readonly updatecommittee_credentials: (a: number) => number;
  readonly updatecommittee_unit_interval: (a: number) => number;
  readonly updatecommittee_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_voter_free: (a: number, b: number) => void;
  readonly voter_to_cbor_bytes: (a: number) => [number, number];
  readonly voter_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly voter_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly voter_to_cbor_hex: (a: number) => [number, number];
  readonly voter_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly voter_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly voter_to_json: (a: number) => [number, number, number, number];
  readonly voter_to_js_value: (a: number) => [number, number, number];
  readonly voter_from_json: (a: number, b: number) => [number, number, number];
  readonly voter_new_constitutional_committee_hot_key_hash: (a: number) => number;
  readonly voter_new_constitutional_committee_hot_script_hash: (a: number) => number;
  readonly voter_new_d_rep_key_hash: (a: number) => number;
  readonly voter_new_d_rep_script_hash: (a: number) => number;
  readonly voter_new_staking_pool_key_hash: (a: number) => number;
  readonly voter_kind: (a: number) => number;
  readonly voter_as_constitutional_committee_hot_key_hash: (a: number) => number;
  readonly voter_as_constitutional_committee_hot_script_hash: (a: number) => number;
  readonly voter_as_d_rep_key_hash: (a: number) => number;
  readonly voter_as_d_rep_script_hash: (a: number) => number;
  readonly voter_as_staking_pool_key_hash: (a: number) => number;
  readonly __wbg_votingprocedure_free: (a: number, b: number) => void;
  readonly votingprocedure_to_cbor_bytes: (a: number) => [number, number];
  readonly votingprocedure_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly votingprocedure_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly votingprocedure_to_cbor_hex: (a: number) => [number, number];
  readonly votingprocedure_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly votingprocedure_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly votingprocedure_to_json: (a: number) => [number, number, number, number];
  readonly votingprocedure_to_js_value: (a: number) => [number, number, number];
  readonly votingprocedure_from_json: (a: number, b: number) => [number, number, number];
  readonly votingprocedure_vote: (a: number) => number;
  readonly votingprocedure_anchor: (a: number) => number;
  readonly votingprocedure_new: (a: number, b: number) => number;
  readonly __wbg_votingprocedures_free: (a: number, b: number) => void;
  readonly votingprocedures_new: () => number;
  readonly votingprocedures_len: (a: number) => number;
  readonly votingprocedures_insert: (a: number, b: number, c: number) => number;
  readonly votingprocedures_get: (a: number, b: number) => number;
  readonly votingprocedures_keys: (a: number) => number;
  readonly __wbg_mapu64toarri64_free: (a: number, b: number) => void;
  readonly mapu64toarri64_get: (a: number, b: bigint) => [number, number];
  readonly mapu64toarri64_insert: (a: number, b: bigint, c: number, d: number) => [number, number];
  readonly mapu64toarri64_new: () => number;
  readonly mapu64toarri64_len: (a: number) => number;
  readonly mapu64toarri64_is_empty: (a: number) => number;
  readonly mapu64toarri64_keys: (a: number) => [number, number];
  readonly __wbg_costmodels_free: (a: number, b: number) => void;
  readonly costmodels_to_cbor_bytes: (a: number) => [number, number];
  readonly costmodels_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly costmodels_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly costmodels_to_cbor_hex: (a: number) => [number, number];
  readonly costmodels_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly costmodels_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly costmodels_to_json: (a: number) => [number, number, number, number];
  readonly costmodels_to_js_value: (a: number) => [number, number, number];
  readonly costmodels_from_json: (a: number, b: number) => [number, number, number];
  readonly costmodels_inner: (a: number) => number;
  readonly __wbg_exunitprices_free: (a: number, b: number) => void;
  readonly exunitprices_to_cbor_bytes: (a: number) => [number, number];
  readonly exunitprices_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly exunitprices_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly exunitprices_to_cbor_hex: (a: number) => [number, number];
  readonly exunitprices_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly exunitprices_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly exunitprices_to_json: (a: number) => [number, number, number, number];
  readonly exunitprices_to_js_value: (a: number) => [number, number, number];
  readonly exunitprices_from_json: (a: number, b: number) => [number, number, number];
  readonly exunitprices_mem_price: (a: number) => number;
  readonly exunitprices_step_price: (a: number) => number;
  readonly exunitprices_new: (a: number, b: number) => number;
  readonly __wbg_exunits_free: (a: number, b: number) => void;
  readonly exunits_to_cbor_bytes: (a: number) => [number, number];
  readonly exunits_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly exunits_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly exunits_to_cbor_hex: (a: number) => [number, number];
  readonly exunits_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly exunits_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly exunits_to_json: (a: number) => [number, number, number, number];
  readonly exunits_to_js_value: (a: number) => [number, number, number];
  readonly exunits_from_json: (a: number, b: number) => [number, number, number];
  readonly exunits_mem: (a: number) => bigint;
  readonly exunits_steps: (a: number) => bigint;
  readonly exunits_new: (a: bigint, b: bigint) => number;
  readonly __wbg_legacyredeemer_free: (a: number, b: number) => void;
  readonly legacyredeemer_to_cbor_bytes: (a: number) => [number, number];
  readonly legacyredeemer_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly legacyredeemer_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly legacyredeemer_to_cbor_hex: (a: number) => [number, number];
  readonly legacyredeemer_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly legacyredeemer_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly legacyredeemer_to_json: (a: number) => [number, number, number, number];
  readonly legacyredeemer_to_js_value: (a: number) => [number, number, number];
  readonly legacyredeemer_from_json: (a: number, b: number) => [number, number, number];
  readonly legacyredeemer_tag: (a: number) => number;
  readonly legacyredeemer_index: (a: number) => bigint;
  readonly legacyredeemer_data: (a: number) => number;
  readonly legacyredeemer_ex_units: (a: number) => number;
  readonly legacyredeemer_new: (a: number, b: bigint, c: number, d: number) => number;
  readonly __wbg_plutusdata_free: (a: number, b: number) => void;
  readonly plutusdata_to_cbor_bytes: (a: number) => [number, number];
  readonly plutusdata_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly plutusdata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusdata_to_cbor_hex: (a: number) => [number, number];
  readonly plutusdata_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly plutusdata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly plutusdata_to_json: (a: number) => [number, number, number, number];
  readonly plutusdata_to_js_value: (a: number) => [number, number, number];
  readonly plutusdata_from_json: (a: number, b: number) => [number, number, number];
  readonly plutusdata_new_constr_plutus_data: (a: number) => number;
  readonly plutusdata_new_map: (a: number) => number;
  readonly plutusdata_new_list: (a: number) => number;
  readonly plutusdata_new_integer: (a: number) => number;
  readonly plutusdata_new_bytes: (a: number, b: number) => number;
  readonly plutusdata_kind: (a: number) => number;
  readonly plutusdata_as_constr_plutus_data: (a: number) => number;
  readonly plutusdata_as_map: (a: number) => number;
  readonly plutusdata_as_list: (a: number) => number;
  readonly plutusdata_as_integer: (a: number) => number;
  readonly plutusdata_as_bytes: (a: number) => [number, number];
  readonly __wbg_plutusv1script_free: (a: number, b: number) => void;
  readonly plutusv1script_to_cbor_bytes: (a: number) => [number, number];
  readonly plutusv1script_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly plutusv1script_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusv1script_to_cbor_hex: (a: number) => [number, number];
  readonly plutusv1script_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly plutusv1script_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly plutusv1script_to_json: (a: number) => [number, number, number, number];
  readonly plutusv1script_to_js_value: (a: number) => [number, number, number];
  readonly plutusv1script_from_json: (a: number, b: number) => [number, number, number];
  readonly __wbg_plutusv2script_free: (a: number, b: number) => void;
  readonly plutusv2script_to_cbor_bytes: (a: number) => [number, number];
  readonly plutusv2script_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly plutusv2script_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusv2script_to_cbor_hex: (a: number) => [number, number];
  readonly plutusv2script_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly plutusv2script_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly plutusv2script_to_json: (a: number) => [number, number, number, number];
  readonly plutusv2script_to_js_value: (a: number) => [number, number, number];
  readonly plutusv2script_from_json: (a: number, b: number) => [number, number, number];
  readonly __wbg_plutusv3script_free: (a: number, b: number) => void;
  readonly plutusv3script_to_cbor_bytes: (a: number) => [number, number];
  readonly plutusv3script_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly plutusv3script_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly plutusv3script_to_cbor_hex: (a: number) => [number, number];
  readonly plutusv3script_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly plutusv3script_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly plutusv3script_to_json: (a: number) => [number, number, number, number];
  readonly plutusv3script_to_js_value: (a: number) => [number, number, number];
  readonly plutusv3script_from_json: (a: number, b: number) => [number, number, number];
  readonly __wbg_redeemerkey_free: (a: number, b: number) => void;
  readonly redeemerkey_to_cbor_bytes: (a: number) => [number, number];
  readonly redeemerkey_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly redeemerkey_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly redeemerkey_to_cbor_hex: (a: number) => [number, number];
  readonly redeemerkey_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly redeemerkey_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly redeemerkey_to_json: (a: number) => [number, number, number, number];
  readonly redeemerkey_to_js_value: (a: number) => [number, number, number];
  readonly redeemerkey_from_json: (a: number, b: number) => [number, number, number];
  readonly redeemerkey_tag: (a: number) => number;
  readonly redeemerkey_index: (a: number) => bigint;
  readonly redeemerkey_new: (a: number, b: bigint) => number;
  readonly __wbg_redeemerval_free: (a: number, b: number) => void;
  readonly redeemerval_to_cbor_bytes: (a: number) => [number, number];
  readonly redeemerval_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly redeemerval_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly redeemerval_to_cbor_hex: (a: number) => [number, number];
  readonly redeemerval_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly redeemerval_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly redeemerval_to_json: (a: number) => [number, number, number, number];
  readonly redeemerval_to_js_value: (a: number) => [number, number, number];
  readonly redeemerval_from_json: (a: number, b: number) => [number, number, number];
  readonly redeemerval_data: (a: number) => number;
  readonly redeemerval_ex_units: (a: number) => number;
  readonly redeemerval_new: (a: number, b: number) => number;
  readonly __wbg_redeemers_free: (a: number, b: number) => void;
  readonly redeemers_to_cbor_bytes: (a: number) => [number, number];
  readonly redeemers_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly redeemers_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly redeemers_to_cbor_hex: (a: number) => [number, number];
  readonly redeemers_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly redeemers_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly redeemers_to_json: (a: number) => [number, number, number, number];
  readonly redeemers_to_js_value: (a: number) => [number, number, number];
  readonly redeemers_from_json: (a: number, b: number) => [number, number, number];
  readonly redeemers_new_arr_legacy_redeemer: (a: number) => number;
  readonly redeemers_new_map_redeemer_key_to_redeemer_val: (a: number) => number;
  readonly redeemers_kind: (a: number) => number;
  readonly redeemers_as_arr_legacy_redeemer: (a: number) => number;
  readonly redeemers_as_map_redeemer_key_to_redeemer_val: (a: number) => number;
  readonly __wbg_metadatumlist_free: (a: number, b: number) => void;
  readonly metadatumlist_new: () => number;
  readonly metadatumlist_len: (a: number) => number;
  readonly metadatumlist_get: (a: number, b: number) => number;
  readonly metadatumlist_add: (a: number, b: number) => void;
  readonly __wbg_transactionmetadatumlabels_free: (a: number, b: number) => void;
  readonly transactionmetadatumlabels_new: () => number;
  readonly transactionmetadatumlabels_len: (a: number) => number;
  readonly transactionmetadatumlabels_get: (a: number, b: number) => bigint;
  readonly transactionmetadatumlabels_add: (a: number, b: bigint) => void;
  readonly __wbg_metadatummap_free: (a: number, b: number) => void;
  readonly metadatummap_new: () => number;
  readonly metadatummap_len: (a: number) => number;
  readonly metadatummap_set: (a: number, b: number, c: number) => void;
  readonly metadatummap_get: (a: number, b: number) => number;
  readonly metadatummap_get_all: (a: number, b: number) => number;
  readonly metadatummap_keys: (a: number) => number;
  readonly __wbg_transactionmetadatumlist_free: (a: number, b: number) => void;
  readonly transactionmetadatumlist_new: () => number;
  readonly transactionmetadatumlist_len: (a: number) => number;
  readonly transactionmetadatumlist_get: (a: number, b: number) => number;
  readonly transactionmetadatumlist_add: (a: number, b: number) => void;
  readonly __wbg_metadata_free: (a: number, b: number) => void;
  readonly metadata_new: () => number;
  readonly metadata_len: (a: number) => number;
  readonly metadata_set: (a: number, b: bigint, c: number) => void;
  readonly metadata_get: (a: number, b: bigint) => number;
  readonly metadata_get_all: (a: number, b: bigint) => number;
  readonly metadata_labels: (a: number) => number;
  readonly __wbg_transactionmetadatum_free: (a: number, b: number) => void;
  readonly transactionmetadatum_to_cbor_bytes: (a: number) => [number, number];
  readonly transactionmetadatum_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionmetadatum_to_json: (a: number) => [number, number, number, number];
  readonly transactionmetadatum_to_json_value: (a: number) => [number, number, number];
  readonly transactionmetadatum_from_json: (a: number, b: number) => [number, number, number];
  readonly transactionmetadatum_new_map: (a: number) => number;
  readonly transactionmetadatum_new_list: (a: number) => number;
  readonly transactionmetadatum_new_int: (a: number) => number;
  readonly transactionmetadatum_new_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionmetadatum_new_text: (a: number, b: number) => [number, number, number];
  readonly transactionmetadatum_kind: (a: number) => number;
  readonly transactionmetadatum_as_map: (a: number) => number;
  readonly transactionmetadatum_as_list: (a: number) => number;
  readonly transactionmetadatum_as_int: (a: number) => number;
  readonly transactionmetadatum_as_bytes: (a: number) => [number, number];
  readonly transactionmetadatum_as_text: (a: number) => [number, number];
  readonly encode_arbitrary_bytes_as_metadatum: (a: number, b: number) => number;
  readonly decode_arbitrary_bytes_from_metadatum: (a: number) => [number, number];
  readonly __wbg_linearfee_free: (a: number, b: number) => void;
  readonly linearfee_new: (a: bigint, b: bigint, c: bigint) => number;
  readonly linearfee_coefficient: (a: number) => bigint;
  readonly linearfee_constant: (a: number) => bigint;
  readonly linearfee_ref_script_cost_per_byte: (a: number) => bigint;
  readonly min_script_fee: (a: number, b: number) => [bigint, number, number];
  readonly min_no_script_fee: (a: number, b: number) => [bigint, number, number];
  readonly min_fee: (a: number, b: number, c: number, d: bigint) => [bigint, number, number];
  readonly __wbg_languagelist_free: (a: number, b: number) => void;
  readonly languagelist_new: () => number;
  readonly languagelist_len: (a: number) => number;
  readonly languagelist_get: (a: number, b: number) => number;
  readonly languagelist_add: (a: number, b: number) => void;
  readonly __wbg_biginteger_free: (a: number, b: number) => void;
  readonly biginteger_to_cbor_bytes: (a: number) => [number, number];
  readonly biginteger_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly biginteger_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly biginteger_to_cbor_hex: (a: number) => [number, number];
  readonly biginteger_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly biginteger_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly biginteger_to_json: (a: number) => [number, number, number, number];
  readonly biginteger_to_js_value: (a: number) => [number, number, number];
  readonly biginteger_from_json: (a: number, b: number) => [number, number, number];
  readonly biginteger_from_int: (a: number) => number;
  readonly biginteger_from_str: (a: number, b: number) => [number, number, number];
  readonly biginteger_to_str: (a: number) => [number, number];
  readonly biginteger_as_u64: (a: number) => [number, bigint];
  readonly biginteger_as_int: (a: number) => number;
  readonly script_hash: (a: number) => number;
  readonly script_language: (a: number) => number;
  readonly __wbg_networkid_free: (a: number, b: number) => void;
  readonly networkid_to_cbor_bytes: (a: number) => [number, number];
  readonly networkid_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly networkid_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly networkid_to_cbor_hex: (a: number) => [number, number];
  readonly networkid_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly networkid_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly networkid_to_json: (a: number) => [number, number, number, number];
  readonly networkid_to_js_value: (a: number) => [number, number, number];
  readonly networkid_from_json: (a: number, b: number) => [number, number, number];
  readonly networkid_new: (a: bigint) => number;
  readonly networkid_mainnet: () => number;
  readonly networkid_testnet: () => number;
  readonly networkid_network: (a: number) => bigint;
  readonly subcoin_from_base10_f32: (a: number) => number;
  readonly __wbg_assetname_free: (a: number, b: number) => void;
  readonly assetname_to_cbor_bytes: (a: number) => [number, number];
  readonly assetname_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly assetname_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly assetname_to_cbor_hex: (a: number) => [number, number];
  readonly assetname_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly assetname_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly assetname_to_json: (a: number) => [number, number, number, number];
  readonly assetname_to_js_value: (a: number) => [number, number, number];
  readonly assetname_from_json: (a: number, b: number) => [number, number, number];
  readonly __wbg_mintbuilderresult_free: (a: number, b: number) => void;
  readonly __wbg_singlemintbuilder_free: (a: number, b: number) => void;
  readonly singlemintbuilder_new: (a: number) => number;
  readonly singlemintbuilder_new_single_asset: (a: number, b: bigint) => number;
  readonly singlemintbuilder_native_script: (a: number, b: number, c: number) => number;
  readonly singlemintbuilder_plutus_script: (a: number, b: number, c: number) => number;
  readonly __wbg_votebuilderresult_free: (a: number, b: number) => void;
  readonly __wbg_votebuilder_free: (a: number, b: number) => void;
  readonly votebuilder_new: () => number;
  readonly votebuilder_with_vote: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly votebuilder_with_native_script_vote: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly votebuilder_with_plutus_vote: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number, number];
  readonly votebuilder_with_plutus_vote_inline_datum: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly votebuilder_build: (a: number) => number;
  readonly __wbg_addrattributes_free: (a: number, b: number) => void;
  readonly addrattributes_to_cbor_bytes: (a: number) => [number, number];
  readonly addrattributes_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly addrattributes_to_cbor_hex: (a: number) => [number, number];
  readonly addrattributes_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly addrattributes_set_stake_distribution: (a: number, b: number) => void;
  readonly addrattributes_stake_distribution: (a: number) => number;
  readonly addrattributes_set_derivation_path: (a: number, b: number) => void;
  readonly addrattributes_derivation_path: (a: number) => number;
  readonly addrattributes_set_protocol_magic: (a: number, b: number) => void;
  readonly addrattributes_protocol_magic: (a: number) => number;
  readonly addrattributes_new: () => number;
  readonly __wbg_addresscontent_free: (a: number, b: number) => void;
  readonly addresscontent_to_cbor_bytes: (a: number) => [number, number];
  readonly addresscontent_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly addresscontent_to_cbor_hex: (a: number) => [number, number];
  readonly addresscontent_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly addresscontent_address_id: (a: number) => number;
  readonly addresscontent_addr_attributes: (a: number) => number;
  readonly addresscontent_addr_type: (a: number) => number;
  readonly addresscontent_new: (a: number, b: number, c: number) => number;
  readonly __wbg_byronaddress_free: (a: number, b: number) => void;
  readonly byronaddress_to_cbor_bytes: (a: number) => [number, number];
  readonly byronaddress_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly byronaddress_to_cbor_hex: (a: number) => [number, number];
  readonly byronaddress_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly byronaddress_content: (a: number) => number;
  readonly byronaddress_crc: (a: number) => number;
  readonly byronaddress_new: (a: number, b: number) => number;
  readonly __wbg_hdaddresspayload_free: (a: number, b: number) => void;
  readonly hdaddresspayload_to_cbor_bytes: (a: number) => [number, number];
  readonly hdaddresspayload_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly hdaddresspayload_to_cbor_hex: (a: number) => [number, number];
  readonly hdaddresspayload_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly hdaddresspayload_get: (a: number) => [number, number];
  readonly __wbg_spendingdata_free: (a: number, b: number) => void;
  readonly spendingdata_to_cbor_bytes: (a: number) => [number, number];
  readonly spendingdata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly spendingdata_to_cbor_hex: (a: number) => [number, number];
  readonly spendingdata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly spendingdata_new_spending_data_pub_key: (a: number) => number;
  readonly spendingdata_new_spending_data_script: (a: number) => number;
  readonly spendingdata_new_spending_data_redeem: (a: number) => number;
  readonly spendingdata_kind: (a: number) => number;
  readonly spendingdata_as_spending_data_pub_key: (a: number) => number;
  readonly spendingdata_as_spending_data_script: (a: number) => number;
  readonly spendingdata_as_spending_data_redeem: (a: number) => number;
  readonly __wbg_stakedistribution_free: (a: number, b: number) => void;
  readonly stakedistribution_to_cbor_bytes: (a: number) => [number, number];
  readonly stakedistribution_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakedistribution_to_cbor_hex: (a: number) => [number, number];
  readonly stakedistribution_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakedistribution_new_single_key: (a: number) => number;
  readonly stakedistribution_new_bootstrap_era: () => number;
  readonly stakedistribution_kind: (a: number) => number;
  readonly stakedistribution_as_single_key: (a: number) => number;
  readonly __wbg_byrontxout_free: (a: number, b: number) => void;
  readonly byrontxout_to_cbor_bytes: (a: number) => [number, number];
  readonly byrontxout_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly byrontxout_to_cbor_hex: (a: number) => [number, number];
  readonly byrontxout_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly byrontxout_address: (a: number) => number;
  readonly byrontxout_amount: (a: number) => bigint;
  readonly byrontxout_new: (a: number, b: bigint) => number;
  readonly bootstrapwitness_to_address: (a: number) => [number, number, number];
  readonly make_vkey_witness: (a: number, b: number) => number;
  readonly govaction_script_hash: (a: number) => number;
  readonly voter_key_hash: (a: number) => number;
  readonly voter_script_hash: (a: number) => number;
  readonly __wbg_assetnamelist_free: (a: number, b: number) => void;
  readonly assetnamelist_new: () => number;
  readonly assetnamelist_len: (a: number) => number;
  readonly assetnamelist_get: (a: number, b: number) => number;
  readonly assetnamelist_add: (a: number, b: number) => void;
  readonly __wbg_bootstrapwitnesslist_free: (a: number, b: number) => void;
  readonly bootstrapwitnesslist_new: () => number;
  readonly bootstrapwitnesslist_len: (a: number) => number;
  readonly bootstrapwitnesslist_get: (a: number, b: number) => number;
  readonly bootstrapwitnesslist_add: (a: number, b: number) => void;
  readonly __wbg_certificatelist_free: (a: number, b: number) => void;
  readonly certificatelist_new: () => number;
  readonly certificatelist_len: (a: number) => number;
  readonly certificatelist_get: (a: number, b: number) => number;
  readonly certificatelist_add: (a: number, b: number) => void;
  readonly __wbg_committeecoldcredentiallist_free: (a: number, b: number) => void;
  readonly committeecoldcredentiallist_new: () => number;
  readonly committeecoldcredentiallist_len: (a: number) => number;
  readonly committeecoldcredentiallist_get: (a: number, b: number) => number;
  readonly committeecoldcredentiallist_add: (a: number, b: number) => void;
  readonly __wbg_drepvotingthresholds_free: (a: number, b: number) => void;
  readonly drepvotingthresholds_to_cbor_bytes: (a: number) => [number, number];
  readonly drepvotingthresholds_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly drepvotingthresholds_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly drepvotingthresholds_to_cbor_hex: (a: number) => [number, number];
  readonly drepvotingthresholds_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly drepvotingthresholds_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly drepvotingthresholds_to_json: (a: number) => [number, number, number, number];
  readonly drepvotingthresholds_to_js_value: (a: number) => [number, number, number];
  readonly drepvotingthresholds_from_json: (a: number, b: number) => [number, number, number];
  readonly drepvotingthresholds_motion_no_confidence: (a: number) => number;
  readonly drepvotingthresholds_committee_normal: (a: number) => number;
  readonly drepvotingthresholds_committee_no_confidence: (a: number) => number;
  readonly drepvotingthresholds_update_constitution: (a: number) => number;
  readonly drepvotingthresholds_hard_fork_initiation: (a: number) => number;
  readonly drepvotingthresholds_pp_network_group: (a: number) => number;
  readonly drepvotingthresholds_pp_economic_group: (a: number) => number;
  readonly drepvotingthresholds_pp_technical_group: (a: number) => number;
  readonly drepvotingthresholds_pp_governance_group: (a: number) => number;
  readonly drepvotingthresholds_treasury_withdrawal: (a: number) => number;
  readonly drepvotingthresholds_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly __wbg_ed25519keyhashlist_free: (a: number, b: number) => void;
  readonly ed25519keyhashlist_new: () => number;
  readonly ed25519keyhashlist_len: (a: number) => number;
  readonly ed25519keyhashlist_get: (a: number, b: number) => number;
  readonly ed25519keyhashlist_add: (a: number, b: number) => void;
  readonly __wbg_govactionidlist_free: (a: number, b: number) => void;
  readonly govactionidlist_new: () => number;
  readonly govactionidlist_len: (a: number) => number;
  readonly govactionidlist_get: (a: number, b: number) => number;
  readonly govactionidlist_add: (a: number, b: number) => void;
  readonly __wbg_intlist_free: (a: number, b: number) => void;
  readonly intlist_new: () => number;
  readonly intlist_len: (a: number) => number;
  readonly intlist_get: (a: number, b: number) => number;
  readonly intlist_add: (a: number, b: number) => void;
  readonly __wbg_legacyredeemerlist_free: (a: number, b: number) => void;
  readonly legacyredeemerlist_new: () => number;
  readonly legacyredeemerlist_len: (a: number) => number;
  readonly legacyredeemerlist_get: (a: number, b: number) => number;
  readonly legacyredeemerlist_add: (a: number, b: number) => void;
  readonly __wbg_mapassetnametononzeroint64_free: (a: number, b: number) => void;
  readonly mapassetnametononzeroint64_new: () => number;
  readonly mapassetnametononzeroint64_len: (a: number) => number;
  readonly mapassetnametononzeroint64_insert: (a: number, b: number, c: bigint) => [number, bigint];
  readonly mapassetnametononzeroint64_get: (a: number, b: number) => [number, bigint];
  readonly mapassetnametononzeroint64_keys: (a: number) => number;
  readonly __wbg_mapassetnametou64_free: (a: number, b: number) => void;
  readonly mapassetnametou64_new: () => number;
  readonly mapassetnametou64_len: (a: number) => number;
  readonly mapassetnametou64_insert: (a: number, b: number, c: bigint) => [number, bigint];
  readonly mapassetnametou64_get: (a: number, b: number) => [number, bigint];
  readonly mapassetnametou64_keys: (a: number) => number;
  readonly __wbg_mapcommitteecoldcredentialtoepoch_free: (a: number, b: number) => void;
  readonly mapcommitteecoldcredentialtoepoch_new: () => number;
  readonly mapcommitteecoldcredentialtoepoch_len: (a: number) => number;
  readonly mapcommitteecoldcredentialtoepoch_insert: (a: number, b: number, c: bigint) => [number, bigint];
  readonly mapcommitteecoldcredentialtoepoch_get: (a: number, b: number) => [number, bigint];
  readonly mapcommitteecoldcredentialtoepoch_keys: (a: number) => number;
  readonly __wbg_mapgovactionidtovotingprocedure_free: (a: number, b: number) => void;
  readonly mapgovactionidtovotingprocedure_new: () => number;
  readonly mapgovactionidtovotingprocedure_len: (a: number) => number;
  readonly mapgovactionidtovotingprocedure_insert: (a: number, b: number, c: number) => number;
  readonly mapgovactionidtovotingprocedure_get: (a: number, b: number) => number;
  readonly mapgovactionidtovotingprocedure_keys: (a: number) => number;
  readonly __wbg_mapplutusdatatoplutusdata_free: (a: number, b: number) => void;
  readonly mapplutusdatatoplutusdata_new: () => number;
  readonly mapplutusdatatoplutusdata_len: (a: number) => number;
  readonly mapplutusdatatoplutusdata_insert: (a: number, b: number, c: number) => number;
  readonly mapplutusdatatoplutusdata_get: (a: number, b: number) => number;
  readonly mapplutusdatatoplutusdata_keys: (a: number) => number;
  readonly __wbg_mapredeemerkeytoredeemerval_free: (a: number, b: number) => void;
  readonly mapredeemerkeytoredeemerval_new: () => number;
  readonly mapredeemerkeytoredeemerval_len: (a: number) => number;
  readonly mapredeemerkeytoredeemerval_insert: (a: number, b: number, c: number) => number;
  readonly mapredeemerkeytoredeemerval_get: (a: number, b: number) => number;
  readonly mapredeemerkeytoredeemerval_keys: (a: number) => number;
  readonly __wbg_maprewardaccounttocoin_free: (a: number, b: number) => void;
  readonly maprewardaccounttocoin_new: () => number;
  readonly maprewardaccounttocoin_len: (a: number) => number;
  readonly maprewardaccounttocoin_insert: (a: number, b: number, c: bigint) => [number, bigint];
  readonly maprewardaccounttocoin_get: (a: number, b: number) => [number, bigint];
  readonly maprewardaccounttocoin_keys: (a: number) => number;
  readonly __wbg_mapstakecredentialtodeltacoin_free: (a: number, b: number) => void;
  readonly mapstakecredentialtodeltacoin_new: () => number;
  readonly mapstakecredentialtodeltacoin_len: (a: number) => number;
  readonly mapstakecredentialtodeltacoin_insert: (a: number, b: number, c: number) => number;
  readonly mapstakecredentialtodeltacoin_get: (a: number, b: number) => number;
  readonly mapstakecredentialtodeltacoin_keys: (a: number) => number;
  readonly __wbg_maptransactionindextoauxiliarydata_free: (a: number, b: number) => void;
  readonly maptransactionindextoauxiliarydata_new: () => number;
  readonly maptransactionindextoauxiliarydata_len: (a: number) => number;
  readonly maptransactionindextoauxiliarydata_insert: (a: number, b: number, c: number) => number;
  readonly maptransactionindextoauxiliarydata_get: (a: number, b: number) => number;
  readonly maptransactionindextoauxiliarydata_keys: (a: number) => [number, number];
  readonly __wbg_maptransactionmetadatumtotransactionmetadatum_free: (a: number, b: number) => void;
  readonly maptransactionmetadatumtotransactionmetadatum_new: () => number;
  readonly maptransactionmetadatumtotransactionmetadatum_len: (a: number) => number;
  readonly maptransactionmetadatumtotransactionmetadatum_insert: (a: number, b: number, c: number) => number;
  readonly maptransactionmetadatumtotransactionmetadatum_get: (a: number, b: number) => number;
  readonly maptransactionmetadatumtotransactionmetadatum_keys: (a: number) => number;
  readonly __wbg_nativescriptlist_free: (a: number, b: number) => void;
  readonly nativescriptlist_new: () => number;
  readonly nativescriptlist_len: (a: number) => number;
  readonly nativescriptlist_get: (a: number, b: number) => number;
  readonly nativescriptlist_add: (a: number, b: number) => void;
  readonly __wbg_plutusdatalist_free: (a: number, b: number) => void;
  readonly plutusdatalist_new: () => number;
  readonly plutusdatalist_len: (a: number) => number;
  readonly plutusdatalist_get: (a: number, b: number) => number;
  readonly plutusdatalist_add: (a: number, b: number) => void;
  readonly __wbg_plutusv1scriptlist_free: (a: number, b: number) => void;
  readonly plutusv1scriptlist_new: () => number;
  readonly plutusv1scriptlist_len: (a: number) => number;
  readonly plutusv1scriptlist_get: (a: number, b: number) => number;
  readonly plutusv1scriptlist_add: (a: number, b: number) => void;
  readonly __wbg_plutusv2scriptlist_free: (a: number, b: number) => void;
  readonly plutusv2scriptlist_new: () => number;
  readonly plutusv2scriptlist_len: (a: number) => number;
  readonly plutusv2scriptlist_get: (a: number, b: number) => number;
  readonly plutusv2scriptlist_add: (a: number, b: number) => void;
  readonly __wbg_plutusv3scriptlist_free: (a: number, b: number) => void;
  readonly plutusv3scriptlist_new: () => number;
  readonly plutusv3scriptlist_len: (a: number) => number;
  readonly plutusv3scriptlist_get: (a: number, b: number) => number;
  readonly plutusv3scriptlist_add: (a: number, b: number) => void;
  readonly __wbg_policyidlist_free: (a: number, b: number) => void;
  readonly policyidlist_new: () => number;
  readonly policyidlist_len: (a: number) => number;
  readonly policyidlist_get: (a: number, b: number) => number;
  readonly policyidlist_add: (a: number, b: number) => void;
  readonly __wbg_poolvotingthresholds_free: (a: number, b: number) => void;
  readonly poolvotingthresholds_to_cbor_bytes: (a: number) => [number, number];
  readonly poolvotingthresholds_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly poolvotingthresholds_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly poolvotingthresholds_to_cbor_hex: (a: number) => [number, number];
  readonly poolvotingthresholds_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly poolvotingthresholds_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly poolvotingthresholds_to_json: (a: number) => [number, number, number, number];
  readonly poolvotingthresholds_to_js_value: (a: number) => [number, number, number];
  readonly poolvotingthresholds_from_json: (a: number, b: number) => [number, number, number];
  readonly poolvotingthresholds_motion_no_confidence: (a: number) => number;
  readonly poolvotingthresholds_committee_normal: (a: number) => number;
  readonly poolvotingthresholds_committee_no_confidence: (a: number) => number;
  readonly poolvotingthresholds_hard_fork_initiation: (a: number) => number;
  readonly poolvotingthresholds_security_relevant_parameter_voting_threshold: (a: number) => number;
  readonly poolvotingthresholds_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbg_proposalprocedurelist_free: (a: number, b: number) => void;
  readonly proposalprocedurelist_new: () => number;
  readonly proposalprocedurelist_len: (a: number) => number;
  readonly proposalprocedurelist_get: (a: number, b: number) => number;
  readonly proposalprocedurelist_add: (a: number, b: number) => void;
  readonly __wbg_protocolparamupdate_free: (a: number, b: number) => void;
  readonly protocolparamupdate_to_cbor_bytes: (a: number) => [number, number];
  readonly protocolparamupdate_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly protocolparamupdate_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly protocolparamupdate_to_cbor_hex: (a: number) => [number, number];
  readonly protocolparamupdate_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly protocolparamupdate_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly protocolparamupdate_to_json: (a: number) => [number, number, number, number];
  readonly protocolparamupdate_to_js_value: (a: number) => [number, number, number];
  readonly protocolparamupdate_from_json: (a: number, b: number) => [number, number, number];
  readonly protocolparamupdate_set_minfee_a: (a: number, b: bigint) => void;
  readonly protocolparamupdate_minfee_a: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_minfee_b: (a: number, b: bigint) => void;
  readonly protocolparamupdate_minfee_b: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_max_block_body_size: (a: number, b: bigint) => void;
  readonly protocolparamupdate_max_block_body_size: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_max_transaction_size: (a: number, b: bigint) => void;
  readonly protocolparamupdate_max_transaction_size: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_max_block_header_size: (a: number, b: bigint) => void;
  readonly protocolparamupdate_max_block_header_size: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_key_deposit: (a: number, b: bigint) => void;
  readonly protocolparamupdate_key_deposit: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_pool_deposit: (a: number, b: bigint) => void;
  readonly protocolparamupdate_pool_deposit: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_maximum_epoch: (a: number, b: bigint) => void;
  readonly protocolparamupdate_maximum_epoch: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_n_opt: (a: number, b: bigint) => void;
  readonly protocolparamupdate_n_opt: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_pool_pledge_influence: (a: number, b: number) => void;
  readonly protocolparamupdate_pool_pledge_influence: (a: number) => number;
  readonly protocolparamupdate_set_expansion_rate: (a: number, b: number) => void;
  readonly protocolparamupdate_expansion_rate: (a: number) => number;
  readonly protocolparamupdate_set_treasury_growth_rate: (a: number, b: number) => void;
  readonly protocolparamupdate_treasury_growth_rate: (a: number) => number;
  readonly protocolparamupdate_set_min_pool_cost: (a: number, b: bigint) => void;
  readonly protocolparamupdate_min_pool_cost: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_ada_per_utxo_byte: (a: number, b: bigint) => void;
  readonly protocolparamupdate_ada_per_utxo_byte: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_cost_models_for_script_languages: (a: number, b: number) => void;
  readonly protocolparamupdate_cost_models_for_script_languages: (a: number) => number;
  readonly protocolparamupdate_set_execution_costs: (a: number, b: number) => void;
  readonly protocolparamupdate_execution_costs: (a: number) => number;
  readonly protocolparamupdate_set_max_tx_ex_units: (a: number, b: number) => void;
  readonly protocolparamupdate_max_tx_ex_units: (a: number) => number;
  readonly protocolparamupdate_set_max_block_ex_units: (a: number, b: number) => void;
  readonly protocolparamupdate_max_block_ex_units: (a: number) => number;
  readonly protocolparamupdate_set_max_value_size: (a: number, b: bigint) => void;
  readonly protocolparamupdate_max_value_size: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_collateral_percentage: (a: number, b: bigint) => void;
  readonly protocolparamupdate_collateral_percentage: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_max_collateral_inputs: (a: number, b: bigint) => void;
  readonly protocolparamupdate_max_collateral_inputs: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_pool_voting_thresholds: (a: number, b: number) => void;
  readonly protocolparamupdate_pool_voting_thresholds: (a: number) => number;
  readonly protocolparamupdate_set_d_rep_voting_thresholds: (a: number, b: number) => void;
  readonly protocolparamupdate_d_rep_voting_thresholds: (a: number) => number;
  readonly protocolparamupdate_set_min_committee_size: (a: number, b: bigint) => void;
  readonly protocolparamupdate_min_committee_size: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_committee_term_limit: (a: number, b: bigint) => void;
  readonly protocolparamupdate_committee_term_limit: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_governance_action_validity_period: (a: number, b: bigint) => void;
  readonly protocolparamupdate_governance_action_validity_period: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_governance_action_deposit: (a: number, b: bigint) => void;
  readonly protocolparamupdate_governance_action_deposit: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_d_rep_deposit: (a: number, b: bigint) => void;
  readonly protocolparamupdate_d_rep_deposit: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_d_rep_inactivity_period: (a: number, b: bigint) => void;
  readonly protocolparamupdate_d_rep_inactivity_period: (a: number) => [number, bigint];
  readonly protocolparamupdate_set_min_fee_ref_script_cost_per_byte: (a: number, b: number) => void;
  readonly protocolparamupdate_min_fee_ref_script_cost_per_byte: (a: number) => number;
  readonly protocolparamupdate_new: () => number;
  readonly __wbg_rational_free: (a: number, b: number) => void;
  readonly rational_to_cbor_bytes: (a: number) => [number, number];
  readonly rational_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly rational_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly rational_to_cbor_hex: (a: number) => [number, number];
  readonly rational_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly rational_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly rational_to_json: (a: number) => [number, number, number, number];
  readonly rational_to_js_value: (a: number) => [number, number, number];
  readonly rational_from_json: (a: number, b: number) => [number, number, number];
  readonly rational_numerator: (a: number) => bigint;
  readonly rational_denominator: (a: number) => bigint;
  readonly rational_new: (a: bigint, b: bigint) => number;
  readonly __wbg_redeemerkeylist_free: (a: number, b: number) => void;
  readonly redeemerkeylist_new: () => number;
  readonly redeemerkeylist_len: (a: number) => number;
  readonly redeemerkeylist_get: (a: number, b: number) => number;
  readonly redeemerkeylist_add: (a: number, b: number) => void;
  readonly __wbg_relaylist_free: (a: number, b: number) => void;
  readonly relaylist_new: () => number;
  readonly relaylist_len: (a: number) => number;
  readonly relaylist_get: (a: number, b: number) => number;
  readonly relaylist_add: (a: number, b: number) => void;
  readonly __wbg_rewardaccountlist_free: (a: number, b: number) => void;
  readonly rewardaccountlist_new: () => number;
  readonly rewardaccountlist_len: (a: number) => number;
  readonly rewardaccountlist_get: (a: number, b: number) => number;
  readonly rewardaccountlist_add: (a: number, b: number) => void;
  readonly __wbg_script_free: (a: number, b: number) => void;
  readonly script_to_cbor_bytes: (a: number) => [number, number];
  readonly script_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly script_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly script_to_cbor_hex: (a: number) => [number, number];
  readonly script_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly script_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly script_to_json: (a: number) => [number, number, number, number];
  readonly script_to_js_value: (a: number) => [number, number, number];
  readonly script_from_json: (a: number, b: number) => [number, number, number];
  readonly script_new_native: (a: number) => number;
  readonly script_new_plutus_v1: (a: number) => number;
  readonly script_new_plutus_v2: (a: number) => number;
  readonly script_new_plutus_v3: (a: number) => number;
  readonly script_kind: (a: number) => number;
  readonly script_as_native: (a: number) => number;
  readonly script_as_plutus_v1: (a: number) => number;
  readonly script_as_plutus_v2: (a: number) => number;
  readonly script_as_plutus_v3: (a: number) => number;
  readonly __wbg_stakecredentiallist_free: (a: number, b: number) => void;
  readonly stakecredentiallist_new: () => number;
  readonly stakecredentiallist_len: (a: number) => number;
  readonly stakecredentiallist_get: (a: number, b: number) => number;
  readonly stakecredentiallist_add: (a: number, b: number) => void;
  readonly __wbg_transactionbodylist_free: (a: number, b: number) => void;
  readonly transactionbodylist_new: () => number;
  readonly transactionbodylist_len: (a: number) => number;
  readonly transactionbodylist_get: (a: number, b: number) => number;
  readonly transactionbodylist_add: (a: number, b: number) => void;
  readonly __wbg_transactioninputlist_free: (a: number, b: number) => void;
  readonly transactioninputlist_new: () => number;
  readonly transactioninputlist_len: (a: number) => number;
  readonly transactioninputlist_get: (a: number, b: number) => number;
  readonly transactioninputlist_add: (a: number, b: number) => void;
  readonly __wbg_transactionoutputlist_free: (a: number, b: number) => void;
  readonly transactionoutputlist_new: () => number;
  readonly transactionoutputlist_len: (a: number) => number;
  readonly transactionoutputlist_get: (a: number, b: number) => number;
  readonly transactionoutputlist_add: (a: number, b: number) => void;
  readonly __wbg_transactionwitnesssetlist_free: (a: number, b: number) => void;
  readonly transactionwitnesssetlist_new: () => number;
  readonly transactionwitnesssetlist_len: (a: number) => number;
  readonly transactionwitnesssetlist_get: (a: number, b: number) => number;
  readonly transactionwitnesssetlist_add: (a: number, b: number) => void;
  readonly __wbg_unitinterval_free: (a: number, b: number) => void;
  readonly unitinterval_to_cbor_bytes: (a: number) => [number, number];
  readonly unitinterval_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly unitinterval_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly unitinterval_to_cbor_hex: (a: number) => [number, number];
  readonly unitinterval_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly unitinterval_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly unitinterval_to_json: (a: number) => [number, number, number, number];
  readonly unitinterval_to_js_value: (a: number) => [number, number, number];
  readonly unitinterval_from_json: (a: number, b: number) => [number, number, number];
  readonly unitinterval_start: (a: number) => bigint;
  readonly unitinterval_end: (a: number) => bigint;
  readonly unitinterval_new: (a: bigint, b: bigint) => number;
  readonly __wbg_vkeywitnesslist_free: (a: number, b: number) => void;
  readonly vkeywitnesslist_new: () => number;
  readonly vkeywitnesslist_len: (a: number) => number;
  readonly vkeywitnesslist_get: (a: number, b: number) => number;
  readonly vkeywitnesslist_add: (a: number, b: number) => void;
  readonly __wbg_voterlist_free: (a: number, b: number) => void;
  readonly voterlist_new: () => number;
  readonly voterlist_len: (a: number) => number;
  readonly voterlist_get: (a: number, b: number) => number;
  readonly voterlist_add: (a: number, b: number) => void;
  readonly __wbg_address_free: (a: number, b: number) => void;
  readonly address_to_json: (a: number) => [number, number, number, number];
  readonly address_to_js_value: (a: number) => [number, number, number];
  readonly address_from_json: (a: number, b: number) => [number, number, number];
  readonly address_header: (a: number) => number;
  readonly address_header_matches_kind: (a: number, b: number) => number;
  readonly address_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly address_from_bech32: (a: number, b: number) => [number, number, number];
  readonly address_is_valid_bech32: (a: number, b: number) => number;
  readonly address_is_valid: (a: number, b: number) => number;
  readonly address_network_id: (a: number) => [number, number, number];
  readonly address_payment_cred: (a: number) => number;
  readonly address_staking_cred: (a: number) => number;
  readonly address_kind: (a: number) => number;
  readonly address_to_raw_bytes: (a: number) => [number, number];
  readonly address_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly address_to_hex: (a: number) => [number, number];
  readonly address_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_baseaddress_free: (a: number, b: number) => void;
  readonly baseaddress_new: (a: number, b: number, c: number) => number;
  readonly baseaddress_to_address: (a: number) => number;
  readonly baseaddress_from_address: (a: number) => number;
  readonly baseaddress_network_id: (a: number) => number;
  readonly baseaddress_payment: (a: number) => number;
  readonly baseaddress_stake: (a: number) => number;
  readonly __wbg_enterpriseaddress_free: (a: number, b: number) => void;
  readonly enterpriseaddress_new: (a: number, b: number) => number;
  readonly enterpriseaddress_to_address: (a: number) => number;
  readonly enterpriseaddress_from_address: (a: number) => number;
  readonly enterpriseaddress_network_id: (a: number) => number;
  readonly enterpriseaddress_payment: (a: number) => number;
  readonly __wbg_pointer_free: (a: number, b: number) => void;
  readonly __wbg_pointeraddress_free: (a: number, b: number) => void;
  readonly pointeraddress_new: (a: number, b: number, c: number) => number;
  readonly pointeraddress_to_address: (a: number) => number;
  readonly pointeraddress_from_address: (a: number) => number;
  readonly pointeraddress_network_id: (a: number) => number;
  readonly pointeraddress_payment: (a: number) => number;
  readonly pointeraddress_stake: (a: number) => number;
  readonly __wbg_rewardaddress_free: (a: number, b: number) => void;
  readonly rewardaddress_to_json: (a: number) => [number, number, number, number];
  readonly rewardaddress_to_js_value: (a: number) => [number, number, number];
  readonly rewardaddress_from_json: (a: number, b: number) => [number, number, number];
  readonly rewardaddress_new: (a: number, b: number) => number;
  readonly rewardaddress_to_address: (a: number) => number;
  readonly rewardaddress_from_address: (a: number) => number;
  readonly rewardaddress_network_id: (a: number) => number;
  readonly rewardaddress_payment: (a: number) => number;
  readonly __wbg_block_free: (a: number, b: number) => void;
  readonly block_to_cbor_bytes: (a: number) => [number, number];
  readonly block_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly block_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly block_to_cbor_hex: (a: number) => [number, number];
  readonly block_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly block_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly block_to_json: (a: number) => [number, number, number, number];
  readonly block_to_js_value: (a: number) => [number, number, number];
  readonly block_from_json: (a: number, b: number) => [number, number, number];
  readonly block_header: (a: number) => number;
  readonly block_transaction_bodies: (a: number) => number;
  readonly block_transaction_witness_sets: (a: number) => number;
  readonly block_auxiliary_data_set: (a: number) => number;
  readonly block_invalid_transactions: (a: number) => [number, number];
  readonly block_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_header_free: (a: number, b: number) => void;
  readonly header_to_cbor_bytes: (a: number) => [number, number];
  readonly header_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly header_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly header_to_cbor_hex: (a: number) => [number, number];
  readonly header_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly header_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly header_to_json: (a: number) => [number, number, number, number];
  readonly header_to_js_value: (a: number) => [number, number, number];
  readonly header_from_json: (a: number, b: number) => [number, number, number];
  readonly header_header_body: (a: number) => number;
  readonly header_body_signature: (a: number) => number;
  readonly header_new: (a: number, b: number) => number;
  readonly __wbg_headerbody_free: (a: number, b: number) => void;
  readonly headerbody_to_cbor_bytes: (a: number) => [number, number];
  readonly headerbody_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly headerbody_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly headerbody_to_cbor_hex: (a: number) => [number, number];
  readonly headerbody_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly headerbody_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly headerbody_to_json: (a: number) => [number, number, number, number];
  readonly headerbody_to_js_value: (a: number) => [number, number, number];
  readonly headerbody_from_json: (a: number, b: number) => [number, number, number];
  readonly headerbody_block_number: (a: number) => bigint;
  readonly headerbody_slot: (a: number) => bigint;
  readonly headerbody_prev_hash: (a: number) => number;
  readonly headerbody_issuer_vkey: (a: number) => number;
  readonly headerbody_vrf_vkey: (a: number) => number;
  readonly headerbody_vrf_result: (a: number) => number;
  readonly headerbody_block_body_size: (a: number) => bigint;
  readonly headerbody_block_body_hash: (a: number) => number;
  readonly headerbody_operational_cert: (a: number) => number;
  readonly headerbody_protocol_version: (a: number) => number;
  readonly headerbody_new: (a: bigint, b: bigint, c: number, d: number, e: number, f: number, g: bigint, h: number, i: number, j: number) => number;
  readonly __wbg_operationalcert_free: (a: number, b: number) => void;
  readonly operationalcert_to_cbor_bytes: (a: number) => [number, number];
  readonly operationalcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly operationalcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly operationalcert_to_cbor_hex: (a: number) => [number, number];
  readonly operationalcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly operationalcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly operationalcert_to_json: (a: number) => [number, number, number, number];
  readonly operationalcert_to_js_value: (a: number) => [number, number, number];
  readonly operationalcert_from_json: (a: number, b: number) => [number, number, number];
  readonly operationalcert_hot_vkey: (a: number) => number;
  readonly operationalcert_sequence_number: (a: number) => bigint;
  readonly operationalcert_kes_period: (a: number) => bigint;
  readonly operationalcert_sigma: (a: number) => number;
  readonly operationalcert_new: (a: number, b: bigint, c: bigint, d: number) => number;
  readonly __wbg_protocolversion_free: (a: number, b: number) => void;
  readonly protocolversion_to_cbor_bytes: (a: number) => [number, number];
  readonly protocolversion_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly protocolversion_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly protocolversion_to_cbor_hex: (a: number) => [number, number];
  readonly protocolversion_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly protocolversion_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly protocolversion_to_json: (a: number) => [number, number, number, number];
  readonly protocolversion_to_js_value: (a: number) => [number, number, number];
  readonly protocolversion_from_json: (a: number, b: number) => [number, number, number];
  readonly protocolversion_major: (a: number) => bigint;
  readonly protocolversion_minor: (a: number) => bigint;
  readonly protocolversion_new: (a: bigint, b: bigint) => number;
  readonly __wbg_crc32_free: (a: number, b: number) => void;
  readonly crc32_new: () => number;
  readonly crc32_update: (a: number, b: number, c: number) => void;
  readonly crc32_finalize: (a: number) => number;
  readonly __wbg_authcommitteehotcert_free: (a: number, b: number) => void;
  readonly authcommitteehotcert_to_cbor_bytes: (a: number) => [number, number];
  readonly authcommitteehotcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly authcommitteehotcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly authcommitteehotcert_to_cbor_hex: (a: number) => [number, number];
  readonly authcommitteehotcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly authcommitteehotcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly authcommitteehotcert_to_json: (a: number) => [number, number, number, number];
  readonly authcommitteehotcert_to_js_value: (a: number) => [number, number, number];
  readonly authcommitteehotcert_from_json: (a: number, b: number) => [number, number, number];
  readonly authcommitteehotcert_committee_cold_credential: (a: number) => number;
  readonly authcommitteehotcert_committee_hot_credential: (a: number) => number;
  readonly authcommitteehotcert_new: (a: number, b: number) => number;
  readonly __wbg_certificate_free: (a: number, b: number) => void;
  readonly certificate_to_cbor_bytes: (a: number) => [number, number];
  readonly certificate_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly certificate_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly certificate_to_cbor_hex: (a: number) => [number, number];
  readonly certificate_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly certificate_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly certificate_to_json: (a: number) => [number, number, number, number];
  readonly certificate_to_js_value: (a: number) => [number, number, number];
  readonly certificate_from_json: (a: number, b: number) => [number, number, number];
  readonly certificate_new_stake_registration: (a: number) => number;
  readonly certificate_new_stake_deregistration: (a: number) => number;
  readonly certificate_new_stake_delegation: (a: number, b: number) => number;
  readonly certificate_new_pool_registration: (a: number) => number;
  readonly certificate_new_pool_retirement: (a: number, b: bigint) => number;
  readonly certificate_new_reg_cert: (a: number, b: bigint) => number;
  readonly certificate_new_unreg_cert: (a: number, b: bigint) => number;
  readonly certificate_new_vote_deleg_cert: (a: number, b: number) => number;
  readonly certificate_new_stake_vote_deleg_cert: (a: number, b: number, c: number) => number;
  readonly certificate_new_stake_reg_deleg_cert: (a: number, b: number, c: bigint) => number;
  readonly certificate_new_vote_reg_deleg_cert: (a: number, b: number, c: bigint) => number;
  readonly certificate_new_stake_vote_reg_deleg_cert: (a: number, b: number, c: number, d: bigint) => number;
  readonly certificate_new_auth_committee_hot_cert: (a: number, b: number) => number;
  readonly certificate_new_resign_committee_cold_cert: (a: number, b: number) => number;
  readonly certificate_new_reg_drep_cert: (a: number, b: bigint, c: number) => number;
  readonly certificate_new_unreg_drep_cert: (a: number, b: bigint) => number;
  readonly certificate_new_update_drep_cert: (a: number, b: number) => number;
  readonly certificate_kind: (a: number) => number;
  readonly certificate_as_stake_registration: (a: number) => number;
  readonly certificate_as_stake_deregistration: (a: number) => number;
  readonly certificate_as_stake_delegation: (a: number) => number;
  readonly certificate_as_pool_registration: (a: number) => number;
  readonly certificate_as_pool_retirement: (a: number) => number;
  readonly certificate_as_reg_cert: (a: number) => number;
  readonly certificate_as_unreg_cert: (a: number) => number;
  readonly certificate_as_vote_deleg_cert: (a: number) => number;
  readonly certificate_as_stake_vote_deleg_cert: (a: number) => number;
  readonly certificate_as_stake_reg_deleg_cert: (a: number) => number;
  readonly certificate_as_vote_reg_deleg_cert: (a: number) => number;
  readonly certificate_as_stake_vote_reg_deleg_cert: (a: number) => number;
  readonly certificate_as_auth_committee_hot_cert: (a: number) => number;
  readonly certificate_as_resign_committee_cold_cert: (a: number) => number;
  readonly certificate_as_reg_drep_cert: (a: number) => number;
  readonly certificate_as_unreg_drep_cert: (a: number) => number;
  readonly certificate_as_update_drep_cert: (a: number) => number;
  readonly __wbg_credential_free: (a: number, b: number) => void;
  readonly credential_to_cbor_bytes: (a: number) => [number, number];
  readonly credential_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly credential_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly credential_to_cbor_hex: (a: number) => [number, number];
  readonly credential_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly credential_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly credential_to_json: (a: number) => [number, number, number, number];
  readonly credential_to_js_value: (a: number) => [number, number, number];
  readonly credential_from_json: (a: number, b: number) => [number, number, number];
  readonly credential_new_pub_key: (a: number) => number;
  readonly credential_new_script: (a: number) => number;
  readonly credential_kind: (a: number) => number;
  readonly credential_as_pub_key: (a: number) => number;
  readonly credential_as_script: (a: number) => number;
  readonly __wbg_dnsname_free: (a: number, b: number) => void;
  readonly dnsname_to_cbor_bytes: (a: number) => [number, number];
  readonly dnsname_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly dnsname_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly dnsname_to_cbor_hex: (a: number) => [number, number];
  readonly dnsname_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly dnsname_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly dnsname_to_json: (a: number) => [number, number, number, number];
  readonly dnsname_to_js_value: (a: number) => [number, number, number];
  readonly dnsname_from_json: (a: number, b: number) => [number, number, number];
  readonly dnsname_get: (a: number) => [number, number];
  readonly __wbg_drep_free: (a: number, b: number) => void;
  readonly drep_to_cbor_bytes: (a: number) => [number, number];
  readonly drep_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly drep_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly drep_to_cbor_hex: (a: number) => [number, number];
  readonly drep_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly drep_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly drep_to_json: (a: number) => [number, number, number, number];
  readonly drep_to_js_value: (a: number) => [number, number, number];
  readonly drep_from_json: (a: number, b: number) => [number, number, number];
  readonly drep_new_key: (a: number) => number;
  readonly drep_new_script: (a: number) => number;
  readonly drep_new_always_abstain: () => number;
  readonly drep_new_always_no_confidence: () => number;
  readonly drep_kind: (a: number) => number;
  readonly drep_as_key: (a: number) => number;
  readonly drep_as_script: (a: number) => number;
  readonly __wbg_ipv4_free: (a: number, b: number) => void;
  readonly ipv4_to_cbor_bytes: (a: number) => [number, number];
  readonly ipv4_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly ipv4_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly ipv4_to_cbor_hex: (a: number) => [number, number];
  readonly ipv4_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly ipv4_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly ipv4_to_json: (a: number) => [number, number, number, number];
  readonly ipv4_to_js_value: (a: number) => [number, number, number];
  readonly ipv4_from_json: (a: number, b: number) => [number, number, number];
  readonly ipv4_get: (a: number) => [number, number];
  readonly __wbg_ipv6_free: (a: number, b: number) => void;
  readonly ipv6_to_cbor_bytes: (a: number) => [number, number];
  readonly ipv6_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly ipv6_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly ipv6_to_cbor_hex: (a: number) => [number, number];
  readonly ipv6_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly ipv6_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly ipv6_to_json: (a: number) => [number, number, number, number];
  readonly ipv6_to_js_value: (a: number) => [number, number, number];
  readonly ipv6_from_json: (a: number, b: number) => [number, number, number];
  readonly ipv6_get: (a: number) => [number, number];
  readonly __wbg_multihostname_free: (a: number, b: number) => void;
  readonly multihostname_to_cbor_bytes: (a: number) => [number, number];
  readonly multihostname_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly multihostname_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly multihostname_to_cbor_hex: (a: number) => [number, number];
  readonly multihostname_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly multihostname_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly multihostname_to_json: (a: number) => [number, number, number, number];
  readonly multihostname_to_js_value: (a: number) => [number, number, number];
  readonly multihostname_from_json: (a: number, b: number) => [number, number, number];
  readonly multihostname_dns_name: (a: number) => number;
  readonly multihostname_new: (a: number) => number;
  readonly __wbg_poolmetadata_free: (a: number, b: number) => void;
  readonly poolmetadata_to_cbor_bytes: (a: number) => [number, number];
  readonly poolmetadata_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly poolmetadata_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly poolmetadata_to_cbor_hex: (a: number) => [number, number];
  readonly poolmetadata_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly poolmetadata_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly poolmetadata_to_json: (a: number) => [number, number, number, number];
  readonly poolmetadata_to_js_value: (a: number) => [number, number, number];
  readonly poolmetadata_from_json: (a: number, b: number) => [number, number, number];
  readonly poolmetadata_url: (a: number) => number;
  readonly poolmetadata_pool_metadata_hash: (a: number) => number;
  readonly poolmetadata_new: (a: number, b: number) => number;
  readonly __wbg_poolparams_free: (a: number, b: number) => void;
  readonly poolparams_to_cbor_bytes: (a: number) => [number, number];
  readonly poolparams_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly poolparams_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly poolparams_to_cbor_hex: (a: number) => [number, number];
  readonly poolparams_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly poolparams_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly poolparams_to_json: (a: number) => [number, number, number, number];
  readonly poolparams_to_js_value: (a: number) => [number, number, number];
  readonly poolparams_from_json: (a: number, b: number) => [number, number, number];
  readonly poolparams_operator: (a: number) => number;
  readonly poolparams_vrf_keyhash: (a: number) => number;
  readonly poolparams_pledge: (a: number) => bigint;
  readonly poolparams_cost: (a: number) => bigint;
  readonly poolparams_margin: (a: number) => number;
  readonly poolparams_reward_account: (a: number) => number;
  readonly poolparams_pool_owners: (a: number) => number;
  readonly poolparams_relays: (a: number) => number;
  readonly poolparams_pool_metadata: (a: number) => number;
  readonly poolparams_new: (a: number, b: number, c: bigint, d: bigint, e: number, f: number, g: number, h: number, i: number) => number;
  readonly __wbg_poolregistration_free: (a: number, b: number) => void;
  readonly poolregistration_to_cbor_bytes: (a: number) => [number, number];
  readonly poolregistration_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly poolregistration_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly poolregistration_to_cbor_hex: (a: number) => [number, number];
  readonly poolregistration_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly poolregistration_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly poolregistration_to_json: (a: number) => [number, number, number, number];
  readonly poolregistration_to_js_value: (a: number) => [number, number, number];
  readonly poolregistration_from_json: (a: number, b: number) => [number, number, number];
  readonly poolregistration_pool_params: (a: number) => number;
  readonly poolregistration_new: (a: number) => number;
  readonly __wbg_poolretirement_free: (a: number, b: number) => void;
  readonly poolretirement_to_cbor_bytes: (a: number) => [number, number];
  readonly poolretirement_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly poolretirement_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly poolretirement_to_cbor_hex: (a: number) => [number, number];
  readonly poolretirement_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly poolretirement_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly poolretirement_to_json: (a: number) => [number, number, number, number];
  readonly poolretirement_to_js_value: (a: number) => [number, number, number];
  readonly poolretirement_from_json: (a: number, b: number) => [number, number, number];
  readonly poolretirement_pool: (a: number) => number;
  readonly poolretirement_epoch: (a: number) => bigint;
  readonly poolretirement_new: (a: number, b: bigint) => number;
  readonly __wbg_regcert_free: (a: number, b: number) => void;
  readonly regcert_to_cbor_bytes: (a: number) => [number, number];
  readonly regcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly regcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly regcert_to_cbor_hex: (a: number) => [number, number];
  readonly regcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly regcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly regcert_to_json: (a: number) => [number, number, number, number];
  readonly regcert_to_js_value: (a: number) => [number, number, number];
  readonly regcert_from_json: (a: number, b: number) => [number, number, number];
  readonly regcert_stake_credential: (a: number) => number;
  readonly regcert_deposit: (a: number) => bigint;
  readonly regcert_new: (a: number, b: bigint) => number;
  readonly __wbg_regdrepcert_free: (a: number, b: number) => void;
  readonly regdrepcert_to_cbor_bytes: (a: number) => [number, number];
  readonly regdrepcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly regdrepcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly regdrepcert_to_cbor_hex: (a: number) => [number, number];
  readonly regdrepcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly regdrepcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly regdrepcert_to_json: (a: number) => [number, number, number, number];
  readonly regdrepcert_to_js_value: (a: number) => [number, number, number];
  readonly regdrepcert_from_json: (a: number, b: number) => [number, number, number];
  readonly regdrepcert_drep_credential: (a: number) => number;
  readonly regdrepcert_deposit: (a: number) => bigint;
  readonly regdrepcert_anchor: (a: number) => number;
  readonly regdrepcert_new: (a: number, b: bigint, c: number) => number;
  readonly __wbg_relay_free: (a: number, b: number) => void;
  readonly relay_to_cbor_bytes: (a: number) => [number, number];
  readonly relay_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly relay_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly relay_to_cbor_hex: (a: number) => [number, number];
  readonly relay_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly relay_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly relay_to_json: (a: number) => [number, number, number, number];
  readonly relay_to_js_value: (a: number) => [number, number, number];
  readonly relay_from_json: (a: number, b: number) => [number, number, number];
  readonly relay_new_single_host_addr: (a: number, b: number, c: number) => number;
  readonly relay_new_single_host_name: (a: number, b: number) => number;
  readonly relay_new_multi_host_name: (a: number) => number;
  readonly relay_kind: (a: number) => number;
  readonly relay_as_single_host_addr: (a: number) => number;
  readonly relay_as_single_host_name: (a: number) => number;
  readonly relay_as_multi_host_name: (a: number) => number;
  readonly __wbg_resigncommitteecoldcert_free: (a: number, b: number) => void;
  readonly resigncommitteecoldcert_to_cbor_bytes: (a: number) => [number, number];
  readonly resigncommitteecoldcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly resigncommitteecoldcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly resigncommitteecoldcert_to_cbor_hex: (a: number) => [number, number];
  readonly resigncommitteecoldcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly resigncommitteecoldcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly resigncommitteecoldcert_to_json: (a: number) => [number, number, number, number];
  readonly resigncommitteecoldcert_to_js_value: (a: number) => [number, number, number];
  readonly resigncommitteecoldcert_from_json: (a: number, b: number) => [number, number, number];
  readonly resigncommitteecoldcert_committee_cold_credential: (a: number) => number;
  readonly resigncommitteecoldcert_anchor: (a: number) => number;
  readonly resigncommitteecoldcert_new: (a: number, b: number) => number;
  readonly __wbg_singlehostaddr_free: (a: number, b: number) => void;
  readonly singlehostaddr_to_cbor_bytes: (a: number) => [number, number];
  readonly singlehostaddr_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly singlehostaddr_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly singlehostaddr_to_cbor_hex: (a: number) => [number, number];
  readonly singlehostaddr_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly singlehostaddr_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly singlehostaddr_to_json: (a: number) => [number, number, number, number];
  readonly singlehostaddr_to_js_value: (a: number) => [number, number, number];
  readonly singlehostaddr_from_json: (a: number, b: number) => [number, number, number];
  readonly singlehostaddr_port: (a: number) => number;
  readonly singlehostaddr_ipv4: (a: number) => number;
  readonly singlehostaddr_ipv6: (a: number) => number;
  readonly singlehostaddr_new: (a: number, b: number, c: number) => number;
  readonly __wbg_singlehostname_free: (a: number, b: number) => void;
  readonly singlehostname_to_cbor_bytes: (a: number) => [number, number];
  readonly singlehostname_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly singlehostname_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly singlehostname_to_cbor_hex: (a: number) => [number, number];
  readonly singlehostname_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly singlehostname_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly singlehostname_to_json: (a: number) => [number, number, number, number];
  readonly singlehostname_to_js_value: (a: number) => [number, number, number];
  readonly singlehostname_from_json: (a: number, b: number) => [number, number, number];
  readonly singlehostname_port: (a: number) => number;
  readonly singlehostname_dns_name: (a: number) => number;
  readonly singlehostname_new: (a: number, b: number) => number;
  readonly __wbg_stakedelegation_free: (a: number, b: number) => void;
  readonly stakedelegation_to_cbor_bytes: (a: number) => [number, number];
  readonly stakedelegation_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly stakedelegation_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakedelegation_to_cbor_hex: (a: number) => [number, number];
  readonly stakedelegation_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly stakedelegation_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakedelegation_to_json: (a: number) => [number, number, number, number];
  readonly stakedelegation_to_js_value: (a: number) => [number, number, number];
  readonly stakedelegation_from_json: (a: number, b: number) => [number, number, number];
  readonly stakedelegation_stake_credential: (a: number) => number;
  readonly stakedelegation_pool: (a: number) => number;
  readonly stakedelegation_new: (a: number, b: number) => number;
  readonly __wbg_stakederegistration_free: (a: number, b: number) => void;
  readonly stakederegistration_to_cbor_bytes: (a: number) => [number, number];
  readonly stakederegistration_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly stakederegistration_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakederegistration_to_cbor_hex: (a: number) => [number, number];
  readonly stakederegistration_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly stakederegistration_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakederegistration_to_json: (a: number) => [number, number, number, number];
  readonly stakederegistration_to_js_value: (a: number) => [number, number, number];
  readonly stakederegistration_from_json: (a: number, b: number) => [number, number, number];
  readonly stakederegistration_stake_credential: (a: number) => number;
  readonly stakederegistration_new: (a: number) => number;
  readonly __wbg_stakeregdelegcert_free: (a: number, b: number) => void;
  readonly stakeregdelegcert_to_cbor_bytes: (a: number) => [number, number];
  readonly stakeregdelegcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly stakeregdelegcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakeregdelegcert_to_cbor_hex: (a: number) => [number, number];
  readonly stakeregdelegcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly stakeregdelegcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakeregdelegcert_to_json: (a: number) => [number, number, number, number];
  readonly stakeregdelegcert_to_js_value: (a: number) => [number, number, number];
  readonly stakeregdelegcert_from_json: (a: number, b: number) => [number, number, number];
  readonly stakeregdelegcert_stake_credential: (a: number) => number;
  readonly stakeregdelegcert_pool: (a: number) => number;
  readonly stakeregdelegcert_deposit: (a: number) => bigint;
  readonly stakeregdelegcert_new: (a: number, b: number, c: bigint) => number;
  readonly __wbg_stakeregistration_free: (a: number, b: number) => void;
  readonly stakeregistration_to_cbor_bytes: (a: number) => [number, number];
  readonly stakeregistration_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly stakeregistration_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakeregistration_to_cbor_hex: (a: number) => [number, number];
  readonly stakeregistration_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly stakeregistration_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakeregistration_to_json: (a: number) => [number, number, number, number];
  readonly stakeregistration_to_js_value: (a: number) => [number, number, number];
  readonly stakeregistration_from_json: (a: number, b: number) => [number, number, number];
  readonly stakeregistration_stake_credential: (a: number) => number;
  readonly stakeregistration_new: (a: number) => number;
  readonly __wbg_stakevotedelegcert_free: (a: number, b: number) => void;
  readonly stakevotedelegcert_to_cbor_bytes: (a: number) => [number, number];
  readonly stakevotedelegcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly stakevotedelegcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakevotedelegcert_to_cbor_hex: (a: number) => [number, number];
  readonly stakevotedelegcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly stakevotedelegcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakevotedelegcert_to_json: (a: number) => [number, number, number, number];
  readonly stakevotedelegcert_to_js_value: (a: number) => [number, number, number];
  readonly stakevotedelegcert_from_json: (a: number, b: number) => [number, number, number];
  readonly stakevotedelegcert_stake_credential: (a: number) => number;
  readonly stakevotedelegcert_pool: (a: number) => number;
  readonly stakevotedelegcert_d_rep: (a: number) => number;
  readonly stakevotedelegcert_new: (a: number, b: number, c: number) => number;
  readonly __wbg_stakevoteregdelegcert_free: (a: number, b: number) => void;
  readonly stakevoteregdelegcert_to_cbor_bytes: (a: number) => [number, number];
  readonly stakevoteregdelegcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly stakevoteregdelegcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly stakevoteregdelegcert_to_cbor_hex: (a: number) => [number, number];
  readonly stakevoteregdelegcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly stakevoteregdelegcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly stakevoteregdelegcert_to_json: (a: number) => [number, number, number, number];
  readonly stakevoteregdelegcert_to_js_value: (a: number) => [number, number, number];
  readonly stakevoteregdelegcert_from_json: (a: number, b: number) => [number, number, number];
  readonly stakevoteregdelegcert_stake_credential: (a: number) => number;
  readonly stakevoteregdelegcert_pool: (a: number) => number;
  readonly stakevoteregdelegcert_d_rep: (a: number) => number;
  readonly stakevoteregdelegcert_deposit: (a: number) => bigint;
  readonly stakevoteregdelegcert_new: (a: number, b: number, c: number, d: bigint) => number;
  readonly __wbg_unregcert_free: (a: number, b: number) => void;
  readonly unregcert_to_cbor_bytes: (a: number) => [number, number];
  readonly unregcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly unregcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly unregcert_to_cbor_hex: (a: number) => [number, number];
  readonly unregcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly unregcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly unregcert_to_json: (a: number) => [number, number, number, number];
  readonly unregcert_to_js_value: (a: number) => [number, number, number];
  readonly unregcert_from_json: (a: number, b: number) => [number, number, number];
  readonly unregcert_stake_credential: (a: number) => number;
  readonly unregcert_deposit: (a: number) => bigint;
  readonly unregcert_new: (a: number, b: bigint) => number;
  readonly __wbg_unregdrepcert_free: (a: number, b: number) => void;
  readonly unregdrepcert_to_cbor_bytes: (a: number) => [number, number];
  readonly unregdrepcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly unregdrepcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly unregdrepcert_to_cbor_hex: (a: number) => [number, number];
  readonly unregdrepcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly unregdrepcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly unregdrepcert_to_json: (a: number) => [number, number, number, number];
  readonly unregdrepcert_to_js_value: (a: number) => [number, number, number];
  readonly unregdrepcert_from_json: (a: number, b: number) => [number, number, number];
  readonly unregdrepcert_drep_credential: (a: number) => number;
  readonly unregdrepcert_deposit: (a: number) => bigint;
  readonly unregdrepcert_new: (a: number, b: bigint) => number;
  readonly __wbg_updatedrepcert_free: (a: number, b: number) => void;
  readonly updatedrepcert_to_cbor_bytes: (a: number) => [number, number];
  readonly updatedrepcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly updatedrepcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly updatedrepcert_to_cbor_hex: (a: number) => [number, number];
  readonly updatedrepcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly updatedrepcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly updatedrepcert_to_json: (a: number) => [number, number, number, number];
  readonly updatedrepcert_to_js_value: (a: number) => [number, number, number];
  readonly updatedrepcert_from_json: (a: number, b: number) => [number, number, number];
  readonly updatedrepcert_drep_credential: (a: number) => number;
  readonly updatedrepcert_anchor: (a: number) => number;
  readonly updatedrepcert_new: (a: number, b: number) => number;
  readonly __wbg_url_free: (a: number, b: number) => void;
  readonly url_to_cbor_bytes: (a: number) => [number, number];
  readonly url_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly url_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly url_to_cbor_hex: (a: number) => [number, number];
  readonly url_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly url_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly url_to_json: (a: number) => [number, number, number, number];
  readonly url_to_js_value: (a: number) => [number, number, number];
  readonly url_from_json: (a: number, b: number) => [number, number, number];
  readonly url_get: (a: number) => [number, number];
  readonly __wbg_votedelegcert_free: (a: number, b: number) => void;
  readonly votedelegcert_to_cbor_bytes: (a: number) => [number, number];
  readonly votedelegcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly votedelegcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly votedelegcert_to_cbor_hex: (a: number) => [number, number];
  readonly votedelegcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly votedelegcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly votedelegcert_to_json: (a: number) => [number, number, number, number];
  readonly votedelegcert_to_js_value: (a: number) => [number, number, number];
  readonly votedelegcert_from_json: (a: number, b: number) => [number, number, number];
  readonly votedelegcert_stake_credential: (a: number) => number;
  readonly votedelegcert_d_rep: (a: number) => number;
  readonly votedelegcert_new: (a: number, b: number) => number;
  readonly __wbg_voteregdelegcert_free: (a: number, b: number) => void;
  readonly voteregdelegcert_to_cbor_bytes: (a: number) => [number, number];
  readonly voteregdelegcert_to_canonical_cbor_bytes: (a: number) => [number, number];
  readonly voteregdelegcert_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly voteregdelegcert_to_cbor_hex: (a: number) => [number, number];
  readonly voteregdelegcert_to_canonical_cbor_hex: (a: number) => [number, number];
  readonly voteregdelegcert_from_cbor_hex: (a: number, b: number) => [number, number, number];
  readonly voteregdelegcert_to_json: (a: number) => [number, number, number, number];
  readonly voteregdelegcert_to_js_value: (a: number) => [number, number, number];
  readonly voteregdelegcert_from_json: (a: number, b: number) => [number, number, number];
  readonly voteregdelegcert_stake_credential: (a: number) => number;
  readonly voteregdelegcert_d_rep: (a: number) => number;
  readonly voteregdelegcert_deposit: (a: number) => bigint;
  readonly voteregdelegcert_new: (a: number, b: number, c: bigint) => number;
  readonly get_implicit_input: (a: number, b: bigint, c: bigint) => [number, number, number];
  readonly get_deposit: (a: number, b: bigint, c: bigint) => [bigint, number, number];
  readonly encode_json_str_to_metadatum: (a: number, b: number, c: number) => [number, number, number];
  readonly decode_metadatum_to_json_str: (a: number, b: number) => [number, number, number, number];
  readonly encode_json_str_to_plutus_datum: (a: number, b: number, c: number) => [number, number, number];
  readonly decode_plutus_datum_to_json_str: (a: number, b: number) => [number, number, number, number];
  readonly min_ada_required: (a: number, b: bigint) => [bigint, number, number];
  readonly transactionoutput_new: (a: number, b: number, c: number, d: number) => number;
  readonly transactionoutput_address: (a: number) => number;
  readonly transactionoutput_set_address: (a: number, b: number) => void;
  readonly transactionoutput_amount: (a: number) => number;
  readonly transactionoutput_set_amount: (a: number, b: number) => void;
  readonly transactionoutput_datum: (a: number) => number;
  readonly transactionoutput_datum_hash: (a: number) => number;
  readonly transactionoutput_script_ref: (a: number) => number;
  readonly nativescript_get_required_signers: (a: number) => number;
  readonly nativescript_hash: (a: number) => number;
  readonly nativescript_verify: (a: number, b: number, c: bigint, d: number, e: bigint, f: number) => number;
  readonly transactionwitnessset_add_all_witnesses: (a: number, b: number) => void;
  readonly transactionwitnessset_languages: (a: number) => number;
  readonly __wbg_bip32privatekey_free: (a: number, b: number) => void;
  readonly bip32privatekey_derive: (a: number, b: number) => number;
  readonly bip32privatekey_from_128_xprv: (a: number, b: number) => [number, number, number];
  readonly bip32privatekey_to_128_xprv: (a: number) => [number, number];
  readonly bip32privatekey_generate_ed25519_bip32: () => number;
  readonly bip32privatekey_to_raw_key: (a: number) => number;
  readonly bip32privatekey_to_public: (a: number) => number;
  readonly bip32privatekey_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly bip32privatekey_to_raw_bytes: (a: number) => [number, number];
  readonly bip32privatekey_from_bech32: (a: number, b: number) => [number, number, number];
  readonly bip32privatekey_to_bech32: (a: number) => [number, number];
  readonly bip32privatekey_from_bip39_entropy: (a: number, b: number, c: number, d: number) => number;
  readonly bip32privatekey_chaincode: (a: number) => [number, number];
  readonly __wbg_bip32publickey_free: (a: number, b: number) => void;
  readonly bip32publickey_derive: (a: number, b: number) => [number, number, number];
  readonly bip32publickey_to_raw_key: (a: number) => number;
  readonly bip32publickey_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly bip32publickey_to_raw_bytes: (a: number) => [number, number];
  readonly bip32publickey_from_bech32: (a: number, b: number) => [number, number, number];
  readonly bip32publickey_to_bech32: (a: number) => [number, number];
  readonly bip32publickey_chaincode: (a: number) => [number, number];
  readonly __wbg_privatekey_free: (a: number, b: number) => void;
  readonly privatekey_to_public: (a: number) => number;
  readonly privatekey_generate_ed25519: () => number;
  readonly privatekey_generate_ed25519extended: () => number;
  readonly privatekey_from_bech32: (a: number, b: number) => [number, number, number];
  readonly privatekey_to_bech32: (a: number) => [number, number];
  readonly privatekey_to_raw_bytes: (a: number) => [number, number];
  readonly privatekey_from_extended_bytes: (a: number, b: number) => [number, number, number];
  readonly privatekey_from_normal_bytes: (a: number, b: number) => [number, number, number];
  readonly privatekey_sign: (a: number, b: number, c: number) => number;
  readonly __wbg_publickey_free: (a: number, b: number) => void;
  readonly publickey_from_bech32: (a: number, b: number) => [number, number, number];
  readonly publickey_to_bech32: (a: number) => [number, number];
  readonly publickey_to_raw_bytes: (a: number) => [number, number];
  readonly publickey_from_bytes: (a: number, b: number) => [number, number, number];
  readonly publickey_verify: (a: number, b: number, c: number, d: number) => number;
  readonly publickey_hash: (a: number) => number;
  readonly __wbg_ed25519signature_free: (a: number, b: number) => void;
  readonly ed25519signature_to_bech32: (a: number) => [number, number];
  readonly ed25519signature_from_bech32: (a: number, b: number) => [number, number, number];
  readonly ed25519signature_to_raw_bytes: (a: number) => [number, number];
  readonly ed25519signature_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly ed25519signature_to_hex: (a: number) => [number, number];
  readonly ed25519signature_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_ed25519keyhash_free: (a: number, b: number) => void;
  readonly ed25519keyhash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly ed25519keyhash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly ed25519keyhash_to_raw_bytes: (a: number) => [number, number];
  readonly ed25519keyhash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly ed25519keyhash_to_hex: (a: number) => [number, number];
  readonly ed25519keyhash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_scripthash_free: (a: number, b: number) => void;
  readonly scripthash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly scripthash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly scripthash_to_raw_bytes: (a: number) => [number, number];
  readonly scripthash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly scripthash_to_hex: (a: number) => [number, number];
  readonly scripthash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_transactionhash_free: (a: number, b: number) => void;
  readonly transactionhash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly transactionhash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly transactionhash_to_raw_bytes: (a: number) => [number, number];
  readonly transactionhash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly transactionhash_to_hex: (a: number) => [number, number];
  readonly transactionhash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_genesisdelegatehash_free: (a: number, b: number) => void;
  readonly genesisdelegatehash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly genesisdelegatehash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly genesisdelegatehash_to_raw_bytes: (a: number) => [number, number];
  readonly genesisdelegatehash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly genesisdelegatehash_to_hex: (a: number) => [number, number];
  readonly genesisdelegatehash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_genesishash_free: (a: number, b: number) => void;
  readonly genesishash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly genesishash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly genesishash_to_raw_bytes: (a: number) => [number, number];
  readonly genesishash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly genesishash_to_hex: (a: number) => [number, number];
  readonly genesishash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_auxiliarydatahash_free: (a: number, b: number) => void;
  readonly auxiliarydatahash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly auxiliarydatahash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly auxiliarydatahash_to_raw_bytes: (a: number) => [number, number];
  readonly auxiliarydatahash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly auxiliarydatahash_to_hex: (a: number) => [number, number];
  readonly auxiliarydatahash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_poolmetadatahash_free: (a: number, b: number) => void;
  readonly poolmetadatahash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly poolmetadatahash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly poolmetadatahash_to_raw_bytes: (a: number) => [number, number];
  readonly poolmetadatahash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly poolmetadatahash_to_hex: (a: number) => [number, number];
  readonly poolmetadatahash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_vrfkeyhash_free: (a: number, b: number) => void;
  readonly vrfkeyhash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly vrfkeyhash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly vrfkeyhash_to_raw_bytes: (a: number) => [number, number];
  readonly vrfkeyhash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly vrfkeyhash_to_hex: (a: number) => [number, number];
  readonly vrfkeyhash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_blockbodyhash_free: (a: number, b: number) => void;
  readonly blockbodyhash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly blockbodyhash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly blockbodyhash_to_raw_bytes: (a: number) => [number, number];
  readonly blockbodyhash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly blockbodyhash_to_hex: (a: number) => [number, number];
  readonly blockbodyhash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_blockheaderhash_free: (a: number, b: number) => void;
  readonly blockheaderhash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly blockheaderhash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly blockheaderhash_to_raw_bytes: (a: number) => [number, number];
  readonly blockheaderhash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly blockheaderhash_to_hex: (a: number) => [number, number];
  readonly blockheaderhash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_datumhash_free: (a: number, b: number) => void;
  readonly datumhash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly datumhash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly datumhash_to_raw_bytes: (a: number) => [number, number];
  readonly datumhash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly datumhash_to_hex: (a: number) => [number, number];
  readonly datumhash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_scriptdatahash_free: (a: number, b: number) => void;
  readonly scriptdatahash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly scriptdatahash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly scriptdatahash_to_raw_bytes: (a: number) => [number, number];
  readonly scriptdatahash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly scriptdatahash_to_hex: (a: number) => [number, number];
  readonly scriptdatahash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_vrfvkey_free: (a: number, b: number) => void;
  readonly vrfvkey_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly vrfvkey_from_bech32: (a: number, b: number) => [number, number, number];
  readonly vrfvkey_to_raw_bytes: (a: number) => [number, number];
  readonly vrfvkey_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly vrfvkey_to_hex: (a: number) => [number, number];
  readonly vrfvkey_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_kesvkey_free: (a: number, b: number) => void;
  readonly kesvkey_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly kesvkey_from_bech32: (a: number, b: number) => [number, number, number];
  readonly kesvkey_to_raw_bytes: (a: number) => [number, number];
  readonly kesvkey_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly kesvkey_to_hex: (a: number) => [number, number];
  readonly kesvkey_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_noncehash_free: (a: number, b: number) => void;
  readonly noncehash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly noncehash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly noncehash_to_raw_bytes: (a: number) => [number, number];
  readonly noncehash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly noncehash_to_hex: (a: number) => [number, number];
  readonly noncehash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_anchordochash_free: (a: number, b: number) => void;
  readonly anchordochash_to_bech32: (a: number, b: number, c: number) => [number, number, number, number];
  readonly anchordochash_from_bech32: (a: number, b: number) => [number, number, number];
  readonly anchordochash_to_raw_bytes: (a: number) => [number, number];
  readonly anchordochash_from_raw_bytes: (a: number, b: number) => [number, number, number];
  readonly anchordochash_to_hex: (a: number) => [number, number];
  readonly anchordochash_from_hex: (a: number, b: number) => [number, number, number];
  readonly __wbg_legacydaedalusprivatekey_free: (a: number, b: number) => void;
  readonly legacydaedalusprivatekey_chaincode: (a: number) => [number, number];
  readonly emip3_encrypt_with_password: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number, number];
  readonly emip3_decrypt_with_password: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly __wbg_int_free: (a: number, b: number) => void;
  readonly int_to_cbor_bytes: (a: number) => [number, number];
  readonly int_from_cbor_bytes: (a: number, b: number) => [number, number, number];
  readonly int_to_json: (a: number) => [number, number, number, number];
  readonly int_to_json_value: (a: number) => [number, number, number];
  readonly int_from_json: (a: number, b: number) => [number, number, number];
  readonly int_new: (a: bigint) => number;
  readonly int_to_str: (a: number) => [number, number];
  readonly int_from_str: (a: number, b: number) => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
