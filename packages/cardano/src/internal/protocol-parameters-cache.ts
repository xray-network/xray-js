import type { ProtocolParameters, ProtocolParameterSource, Provider } from "../types/index.js"

const DEFAULT_CACHE_DURATION_MS = 5 * 60 * 1000

export interface ProtocolParametersCache {
  get(forceRefresh?: boolean): Promise<ProtocolParameters>
}

export const createProtocolParametersCache = (
  provider: Provider,
  source: ProtocolParameterSource
): ProtocolParametersCache => {
  const cacheDurationMs =
    typeof source === "object" && "source" in source && source.source === "remote"
      ? (source.cacheDurationMs ?? DEFAULT_CACHE_DURATION_MS)
      : DEFAULT_CACHE_DURATION_MS

  if (cacheDurationMs < 0 || !Number.isFinite(cacheDurationMs)) {
    throw new RangeError("protocolParameters.cacheDurationMs must be a finite, non-negative number")
  }

  let cached: { value: ProtocolParameters; expiresAt: number } | undefined

  const get = async (forceRefresh = false): Promise<ProtocolParameters> => {
    if (typeof source === "object" && !("source" in source)) return source
    if (typeof source === "object" && source.source === "static") return source.value

    const now = Date.now()
    if (!forceRefresh && cached && cached.expiresAt > now) return cached.value

    const value = await provider.getProtocolParameters()
    cached = { value, expiresAt: now + cacheDurationMs }
    return value
  }

  return Object.freeze({ get })
}
