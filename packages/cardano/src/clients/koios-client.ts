import __KoiosClient, { KoiosTypes } from "cardano-koios-client"
import type * as CardanoTypes from "../types/index.js"
export type { KoiosTypes } from "cardano-koios-client"

export const KoiosClient = (baseUrl: string, headers?: CardanoTypes.Headers): ReturnType<typeof __KoiosClient> => {
  return __KoiosClient(baseUrl, headers)
}
