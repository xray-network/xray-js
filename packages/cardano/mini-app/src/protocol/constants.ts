// Shared constants for the XRAY Mini App messaging protocol.

/** Protocol revision, bumped when message shapes change incompatibly. */
export const PROTOCOL_VERSION = 3

/** Prefix carried by every core host -> client message type. */
export const HOST_MESSAGE_PREFIX = "xray.host." as const

/** Prefix carried by every core client -> host message type. */
export const CLIENT_MESSAGE_PREFIX = "xray.client." as const

/** Prefix carried by every CIP-30 host -> client message type. */
export const CIP30_HOST_MESSAGE_PREFIX = "xray.cip30.host." as const

/** Prefix carried by every CIP-30 client -> host message type. */
export const CIP30_CLIENT_MESSAGE_PREFIX = "xray.cip30.client." as const

/** Default timeout for quick request/response calls (handshake, getters). */
export const DEFAULT_REQUEST_TIMEOUT = 1_000

/** Default timeout for calls that wait on user interaction (signing, submitting). */
export const DEFAULT_INTERACTIVE_TIMEOUT = 600_000
