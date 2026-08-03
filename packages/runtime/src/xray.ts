import { createCardano, type Cardano, type CardanoConfig } from "@xray-network/xray-js-cardano"
import type { XrayChainModule } from "./common.js"

const cardano: XrayChainModule<CardanoConfig, Cardano> = Object.freeze({
  create: createCardano,
})

/**
 * Immutable XRAY product facade. Each chain module creates isolated clients;
 * future chain modules can implement the same small lifecycle contract.
 */
export const XRAY = Object.freeze({
  cardano,
})
