export type Cip30ConnectorOptions<Api> = Readonly<{
  api: Api
  isEnabled: () => Promise<boolean>
  enable: (options?: { extensions?: { cip: number }[] }) => Promise<Api>
}>

export const createConnector = <Api>(options: Cip30ConnectorOptions<Api>) => {
  const apiVersion = "1"
  const name = "XRAY"
  const icon = ""
  const supportedExtensions: { cip: number }[] = []
  const experimental = {}
  const connector = {
    apiVersion,
    name,
    icon,
    supportedExtensions,
    experimental,
    isEnabled: options.isEnabled,
    enable: options.enable,
  }
  const installConnector = (key = "xrayBridge") => {
    if (typeof window === "undefined") return connector
    const target = window as Window & { cardano?: Record<string, unknown> }
    target.cardano ??= {}
    target.cardano[key] = connector
    return connector
  }
  return { connector, installConnector, apiVersion, name, icon, supportedExtensions }
}
