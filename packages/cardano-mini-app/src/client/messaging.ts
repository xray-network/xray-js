// Low-level plumbing shared by the core and CIP-30 client surfaces.

let hostWindowOverride: Window | null = null

/**
 * Override the window the client SDK talks to. Intended for tests (see
 * `@xray-network/mini-app-sdk/testing`) where the mini app is not actually embedded in an
 * iframe. Pass null to restore the default parent-window resolution.
 */
export const setHostWindow = (win: Window | null) => {
  hostWindowOverride = win
}

/**
 * Resolve the embedding window (likely the host iframe). Returns null when the
 * mini-app is top-level or running in a non-browser environment.
 */
export const getHostWindow = () => {
  if (hostWindowOverride) return hostWindowOverride
  if (typeof window === "undefined") return null
  if (!window.parent || window.parent === window) return null
  return window.parent
}

/**
 * Generate a request correlation id, preferring `crypto.randomUUID` when
 * available to minimize collision risk across concurrent calls.
 */
export const getRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
