import { createConnectorStore } from "../../../react/connector-store.js"
import { installConnector } from "./client.js"

const useInstalledConnector = createConnectorStore(() => installConnector())

export const useConnector = useInstalledConnector
