/**
 * Copy this file into your dapp and load it as a browser ES module.
 *
 * import { createBridge } from "./bridge.js"
 * const bridge = createBridge("https://your-xray-host.example")
 * const response = await bridge.cardano.getAccountState()
 * if (response.ok) console.log(response.payload)
 * else console.error(response.error.code, response.error.message)
 *
 * Use your embedding host's exact origin, including its port in development.
 * This small example checks envelopes, not the SDK's full domain schemas.
 */
export function createBridge(hostOrigin) {
  const url = new URL(hostOrigin)
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Provide an HTTP(S) host origin")
  const origin = url.origin
  const host = window.parent
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
  const fromHost = (event) => event.source === host && event.origin === origin && isObject(event.data)
  const message = (scope, method, payload) => ({
    type: "xray.bridge.request",
    scope,
    version: "v1",
    method,
    requestId: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    payload,
  })

  function request(scope, method, payload = null, timeout = 5_000) {
    const outgoing = message(scope, method, payload)
    const failure = (code, text) => ({
      type: "xray.bridge.response",
      scope,
      version: "v1",
      method,
      requestId: outgoing.requestId,
      ok: false,
      error: { code, message: text },
    })
    if (host === window) return Promise.resolve(failure("HOST_UNAVAILABLE", "Open this dapp inside an XRAY host"))

    return new Promise((resolve) => {
      function finish(response) {
        window.removeEventListener("message", receive)
        clearTimeout(timer)
        resolve(response)
      }
      function receive(event) {
        if (!fromHost(event)) return
        const response = event.data
        if (
          response.type !== "xray.bridge.response" ||
          response.scope !== scope ||
          response.version !== "v1" ||
          response.requestId !== outgoing.requestId
        )
          return

        const success =
          response.ok === true &&
          response.payload !== undefined &&
          response.context !== undefined &&
          !("error" in response)
        const error =
          response.ok === false &&
          isObject(response.error) &&
          typeof response.error.code === "string" &&
          typeof response.error.message === "string" &&
          !("payload" in response) &&
          !("context" in response)
        finish(
          response.method === method && (success || error)
            ? response
            : failure("INVALID_RESPONSE", `Invalid ${scope}/${method} response`)
        )
      }
      const timer = setTimeout(() => finish(failure("TIMEOUT", `Host did not respond to ${method}`)), timeout)
      window.addEventListener("message", receive)
      try {
        // postMessage preserves bigint values; do not JSON.stringify bridge messages.
        host.postMessage(outgoing, origin)
      } catch {
        finish(failure("TRANSPORT_ERROR", `Unable to send ${method}`))
      }
    })
  }

  function listen(scope, eventName, handler) {
    if (host === window) return () => {}
    function receive(event) {
      if (!fromHost(event)) return
      const value = event.data
      if (
        value.type === "xray.bridge.event" &&
        value.scope === scope &&
        value.version === "v1" &&
        value.event === eventName &&
        value.payload !== undefined &&
        value.context !== undefined &&
        !("ok" in value) &&
        !("requestId" in value)
      )
        handler(value)
    }
    window.addEventListener("message", receive)
    return () => window.removeEventListener("message", receive)
  }

  function routeChanged(route) {
    if (host === window) return false
    try {
      host.postMessage(message("platform", "routeChanged", route), origin)
      return true // Sending succeeded; this is not a host acknowledgement.
    } catch {
      return false
    }
  }

  return {
    request,
    listen,
    platform: {
      getStatus: () => request("platform", "getStatus"),
      getTheme: () => request("platform", "getTheme"),
      getCurrency: () => request("platform", "getCurrency"),
      getLocale: () => request("platform", "getLocale"),
      getHideBalances: () => request("platform", "getHideBalances"),
      routeChanged,
    },
    cardano: {
      getAccountState: () => request("cardano", "getAccountState"),
      getTip: () => request("cardano", "getTip"),
      getExplorer: () => request("cardano", "getExplorer"),
      signTx: (tx) => request("cardano", "signTx", tx, 120_000),
      submitTx: (tx) => request("cardano", "submitTx", tx, 120_000),
      signData: (address, data) => request("cardano", "signData", { address, data }, 120_000),
    },
  }
}
