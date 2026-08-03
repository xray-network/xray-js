import type { Provider, Utxo } from "../types.js"

type ResolverSource = Pick<Provider, "getUtxosByAddresses" | "getDatumByHash" | "getScriptByHash">

export const createProviderResolvers = (
  { getUtxosByAddresses, getDatumByHash, getScriptByHash }: ResolverSource,
  { preserveResolved = false }: { preserveResolved?: boolean } = {}
) => {
  const getUtxosByAddress = (address: string): Promise<Utxo[]> => getUtxosByAddresses([address])

  const resolveUtxoDatumAndScript = async (utxo: Utxo): Promise<Utxo> => ({
    ...utxo,
    datum:
      preserveResolved && utxo.datum !== null && utxo.datum !== undefined
        ? utxo.datum
        : utxo.datumHash
          ? ((await getDatumByHash(utxo.datumHash)) ?? null)
          : null,
    script:
      preserveResolved && utxo.script !== null && utxo.script !== undefined
        ? utxo.script
        : utxo.scriptHash
          ? ((await getScriptByHash(utxo.scriptHash)) ?? null)
          : null,
  })

  const resolveUtxosDatumAndScript = (utxos: readonly Utxo[]): Promise<Utxo[]> =>
    Promise.all(utxos.map(resolveUtxoDatumAndScript))

  return Object.freeze({ getUtxosByAddress, resolveUtxoDatumAndScript, resolveUtxosDatumAndScript })
}

export const pollUntil = async (
  check: () => Promise<boolean>,
  checkIntervalMs: number,
  timeoutMs: number
): Promise<boolean> => {
  if (await check()) return true
  if (timeoutMs <= 0) return false

  return new Promise<boolean>((resolve, reject) => {
    let settled = false
    const finish = (value: boolean) => {
      if (settled) return
      settled = true
      clearInterval(interval)
      clearTimeout(timeout)
      resolve(value)
    }
    const fail = (error: unknown) => {
      if (settled) return
      settled = true
      clearInterval(interval)
      clearTimeout(timeout)
      reject(error)
    }
    const interval = setInterval(() => void check().then((found) => found && finish(true), fail), checkIntervalMs)
    const timeout = setTimeout(() => finish(false), timeoutMs)
  })
}
