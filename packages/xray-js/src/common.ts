export type XrayChain = "base" | "cardano" | "bitcoin" | "midnight"

export interface XrayErrorOptions {
  cause?: unknown
  details?: Readonly<Record<string, unknown>>
}

export class XrayError extends Error {
  readonly code: string
  readonly details?: Readonly<Record<string, unknown>>

  constructor(code: string, message: string, options: XrayErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = "XrayError"
    this.code = code
    this.details = options.details
  }
}

export interface RequestOptions {
  signal?: AbortSignal
}
