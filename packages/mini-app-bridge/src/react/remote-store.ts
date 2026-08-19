import { useSyncExternalStore } from "react"

export type RemoteState<Value> = Readonly<{
  data: Value | undefined
  loading: boolean
  error: unknown
  refresh: () => Promise<void>
}>

export type RemoteStore<Value> = Readonly<{
  getSnapshot: () => RemoteState<Value>
  subscribe: (listener: () => void) => () => void
  refresh: () => Promise<void>
  reset: () => void
}>

export const createRemoteStore = <Value>(
  load: () => Promise<Value>,
  listen: (receive: (value: Value) => void) => () => void
): RemoteStore<Value> => {
  const listeners = new Set<() => void>()
  let stopRemote: (() => void) | null = null
  let pending: Promise<void> | null = null
  let snapshot: RemoteState<Value>

  const notify = () => listeners.forEach((listener) => listener())
  const set = (next: Omit<RemoteState<Value>, "refresh">) => {
    snapshot = { ...next, refresh }
    notify()
  }
  const refresh = () =>
    (pending ??= (async () => {
      set({ data: snapshot.data, loading: true, error: undefined })
      try {
        const data = await load()
        set({ data, loading: false, error: undefined })
      } catch (error) {
        set({ data: snapshot.data, loading: false, error })
      } finally {
        pending = null
      }
    })())

  snapshot = { data: undefined, loading: false, error: undefined, refresh }

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      if (!stopRemote) {
        stopRemote = listen((data) => set({ data, loading: false, error: undefined }))
        if (snapshot.data === undefined && !snapshot.loading) void refresh()
      }
      return () => {
        listeners.delete(listener)
        if (listeners.size > 0) return
        stopRemote?.()
        stopRemote = null
      }
    },
    refresh,
    reset: () => {
      stopRemote?.()
      stopRemote = null
      pending = null
      set({ data: undefined, loading: false, error: undefined })
    },
  }
}

export const useRemoteStore = <Value>(store: RemoteStore<Value>) =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
