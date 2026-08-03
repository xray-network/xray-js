import __KupoClient from "cardano-kupo-client"
import type * as CardanoTypes from "../types/index.js"
export type { KupoTypes } from "cardano-kupo-client"

export const KupoClient = (baseUrl: string, headers?: CardanoTypes.Headers): ReturnType<typeof __KupoClient> => {
  return __KupoClient(baseUrl, headers)
}
