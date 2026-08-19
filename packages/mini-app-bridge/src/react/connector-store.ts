import { useSyncExternalStore } from "react"

export const createConnectorStore = <Connector>(install: () => Connector) => {
  let connector: Connector | undefined
  const getSnapshot = () => connector
  const subscribe = (listener: () => void) => {
    if (connector === undefined) {
      connector = install()
      listener()
    }
    return () => undefined
  }
  return () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
