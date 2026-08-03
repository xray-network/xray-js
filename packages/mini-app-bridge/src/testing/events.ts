/**
 * Dispatch a `message` event on `target` that looks like it was posted by
 * `source`. `MessageEventInit.source` only accepts real Window/MessagePort
 * instances in most DOM implementations, so the source is attached afterwards
 * via `defineProperty` — this works in browsers and jsdom alike.
 */
export const dispatchMessageEvent = (target: Window, data: unknown, source: object) => {
  const event = new MessageEvent("message", { data })
  Object.defineProperty(event, "source", { value: source })
  target.dispatchEvent(event)
}
