import __NftcdnClient from "cardano-nftcdn-client"
import type * as CardanoTypes from "../types/index.js"
export type { NftcdnTypes } from "cardano-nftcdn-client"

export const NftcdnClient = (baseUrl: string, headers?: CardanoTypes.Headers): ReturnType<typeof __NftcdnClient> => {
  return __NftcdnClient(baseUrl, headers)
}
