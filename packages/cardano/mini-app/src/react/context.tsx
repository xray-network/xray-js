import { createContext, useContext, useState, type ReactNode } from "react"
import { createMiniAppStore, defaultMiniAppStore, type MiniAppStore } from "./store"

const MiniAppContext = createContext<MiniAppStore | null>(null)

/**
 * Optional provider. Hooks work without it (they fall back to a module-level
 * store); mount it to isolate a subtree or inject a custom store — e.g. a
 * fresh `createMiniAppStore()` per test, or one wired to a mock host.
 */
export const MiniAppProvider = ({ store, children }: { store?: MiniAppStore; children?: ReactNode }) => {
  const [value] = useState(() => store ?? createMiniAppStore())
  return <MiniAppContext.Provider value={value}>{children}</MiniAppContext.Provider>
}

/** Resolve the active store: nearest provider, or the shared default. */
export const useMiniAppStore = () => useContext(MiniAppContext) ?? defaultMiniAppStore
