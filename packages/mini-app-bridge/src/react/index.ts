export * as platformV1 from "./platform.js"
export * as cardanoCip30V1 from "./cip30.js"
import * as cardano from "./cardano.js"

export const cardanoV1: Omit<typeof cardano, "runInteractive"> = {
  useTip: cardano.useTip,
  useAccountState: cardano.useAccountState,
  useExplorer: cardano.useExplorer,
  useSignTx: cardano.useSignTx,
  useSubmitTx: cardano.useSubmitTx,
  useSignData: cardano.useSignData,
  stores: cardano.stores,
}
