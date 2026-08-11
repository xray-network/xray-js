import { createContext, useContext, useState, type ReactNode } from "react"
import { createCardanoMiniAppStore, defaultCardanoMiniAppStore, type CardanoMiniAppStore } from "./store.js"

const CardanoMiniAppContext = createContext<CardanoMiniAppStore | null>(null)

export const CardanoMiniAppProvider = ({ store, children }: { store?: CardanoMiniAppStore; children?: ReactNode }) => {
  const [value] = useState(() => store ?? createCardanoMiniAppStore())
  return <CardanoMiniAppContext.Provider value={value}>{children}</CardanoMiniAppContext.Provider>
}

export const useCardanoMiniAppStore = () => useContext(CardanoMiniAppContext) ?? defaultCardanoMiniAppStore
