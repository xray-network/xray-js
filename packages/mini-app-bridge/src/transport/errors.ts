import type { BridgeErrorPayload } from "./messages.js"

export type BridgeErrorCode = BridgeErrorPayload["code"]

export class BridgeError extends Error {
  readonly code: BridgeErrorCode
  readonly data?: unknown

  constructor(code: BridgeErrorCode, message: string, data?: unknown) {
    super(message)
    this.name = "BridgeError"
    this.code = code
    this.data = data
  }
}

export const toBridgeErrorPayload = (error: unknown): BridgeErrorPayload => {
  if (error instanceof BridgeError) {
    return { code: error.code, message: error.message, ...(error.data === undefined ? {} : { data: error.data }) }
  }
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "number") {
    const info = "info" in error && typeof error.info === "string" ? error.info : "Host request failed"
    return { code: "HOST_ERROR", message: info, data: { code: error.code, info } }
  }
  return {
    code: "HOST_ERROR",
    message: error instanceof Error ? error.message : "Host request failed",
  }
}
