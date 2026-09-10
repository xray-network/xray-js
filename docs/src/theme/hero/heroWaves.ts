export type Wave = {
  start: number
  extent: number
  duration: number
  width: number
  phase: number
  bend: number
}

export type PreparedWave = Wave & { distances: Float32Array }

export function createWave(start: number, extent: number): Wave {
  return {
    start, extent,
    duration: 4200 + Math.random() * 2200,
    width: 95 + Math.random() * 65,
    phase: Math.random() * Math.PI * 2,
    bend: 45 + Math.random() * 90,
  }
}

export function prepareWave(wave: Wave, points: ReadonlyArray<{ x: number; y: number }>): PreparedWave {
  const distances = new Float32Array(points.length)
  let lastY = NaN, offset = 0
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i]
    if (y !== lastY) {
      lastY = y
      offset = Math.sin(y / 115 + wave.phase) * wave.bend
        + Math.sin(y / 57 - wave.phase) * wave.bend * .25
    }
    distances[i] = x + offset
  }
  return { ...wave, distances }
}

export function waveFrame(wave: Wave, now: number, state: { front: number; envelope: number }) {
  const progress = (now - wave.start) / wave.duration
  if (progress <= 0 || progress >= 1) return false
  state.front = -220 + (1 - Math.cos(Math.PI * progress)) / 2 * (wave.extent + 440)
  state.envelope = Math.sin(Math.PI * progress)
  return true
}
