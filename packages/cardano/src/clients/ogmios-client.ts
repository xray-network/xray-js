import __OgmiosClient from "cardano-ogmios-client"
import type * as CardanoTypes from "../types/index.js"
export type { OgmiosTypes } from "cardano-ogmios-client"

export const OgmiosClient = (baseUrl: string, headers?: CardanoTypes.Headers): ReturnType<typeof __OgmiosClient> => {
  return __OgmiosClient(baseUrl, headers)
}
