// Low-level plumbing shared by the core and CIP-30 host surfaces.

/** Post a message to an embedded iframe. Safe no-op when the iframe reference is missing. */
export const sendMessage = (iframe: Window | null | undefined, type: string, payload: unknown, requestId: string) => {
  if (!iframe) return
  iframe.postMessage({ type, payload, requestId }, "*")
}

/**
 * Subscribe to a specific message type originating from the given iframe.
 * Returns an unsubscribe function.
 */
export const listenToWindow = <MessageType extends string, Payload>(
  iframe: Window | null | undefined,
  messageType: MessageType,
  handler: (message: { type: MessageType; payload: Payload; requestId: string }) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== iframe) return
    const { type, payload, requestId } = event.data ?? {}
    if (type !== messageType) return
    handler({ type, payload, requestId })
  }
  if (iframe) {
    window.addEventListener("message", handleMessage)
  }
  return () => {
    window.removeEventListener("message", handleMessage)
  }
}

/**
 * Subscribe to every message originating from the given iframe. Returns an
 * unsubscribe function.
 */
export const listenAllFromWindow = <Message>(
  iframe: Window | null | undefined,
  handler: (message: Message) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== iframe) return
    const { type, payload, requestId } = event.data ?? {}
    if (typeof type !== "string") return
    handler({ type, payload, requestId } as Message)
  }
  if (iframe) {
    window.addEventListener("message", handleMessage)
  }
  return () => {
    window.removeEventListener("message", handleMessage)
  }
}
