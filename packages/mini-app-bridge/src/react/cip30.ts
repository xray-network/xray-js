import { useSyncExternalStore } from "react"
import { client } from "../adapters/cip30.js"

const createConnectorStore = <Connector>(install: () => Connector) => {
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

const useInstalledConnector = createConnectorStore(() => client.installConnector())

export const useConnector = useInstalledConnector
