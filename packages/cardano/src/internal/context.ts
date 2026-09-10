import type { NetworkConfig, ProtocolParameters, Provider, SlotConfig } from "../types.js"

export interface CardanoContext {
  readonly network: NetworkConfig
  readonly provider: Provider
  readonly slotConfig: SlotConfig
  readonly transactionTtlSeconds: number
  getProtocolParameters(forceRefresh?: boolean): Promise<ProtocolParameters>
}
