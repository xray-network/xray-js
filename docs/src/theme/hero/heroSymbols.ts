// Narrow, font-independent glyphs: / \ | + < > [ ] = 0 1 :
// Each group of four numbers is one line segment in CSS pixels.
const glyphs = [
  [-1.5, 3.5, 1.5, -3.5],
  [-1.5, -3.5, 1.5, 3.5],
  [0, -3.5, 0, 3.5],
  [-1.5, 0, 1.5, 0, 0, -3, 0, 3],
  [1.5, -3, -1.5, 0, -1.5, 0, 1.5, 3],
  [-1.5, -3, 1.5, 0, 1.5, 0, -1.5, 3],
  [1.5, -3.5, -1.5, -3.5, -1.5, -3.5, -1.5, 3.5, -1.5, 3.5, 1.5, 3.5],
  [-1.5, -3.5, 1.5, -3.5, 1.5, -3.5, 1.5, 3.5, 1.5, 3.5, -1.5, 3.5],
  [-1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5, 1.5],
  [-1.5, -3, 1.5, -3, 1.5, -3, 1.5, 3, 1.5, 3, -1.5, 3, -1.5, 3, -1.5, -3],
  [-1.5, -2, 0, -3.5, 0, -3.5, 0, 3.5, -1.5, 3.5, 1.5, 3.5],
  [0, -2, 0, -1.5, 0, 1.5, 0, 2],
  // Weighted blank slots create gaps between the bright symbols.
  [], [], [],
]

export const firstBlankSymbol = glyphs.length - 3
export const symbolCount = glyphs.length
export const symbolInterval = 140

export function strokeSymbol(ctx: CanvasRenderingContext2D, symbol: number, x: number, y: number, ratio = 1) {
  ratio *= 1.25
  const segments = glyphs[symbol]
  if (!segments.length) return
  ctx.beginPath()
  for (let i = 0; i < segments.length; i += 4) {
    ctx.moveTo(x + segments[i] * ratio, y + segments[i + 1] * ratio)
    ctx.lineTo(x + segments[i + 2] * ratio, y + segments[i + 3] * ratio)
  }
  ctx.stroke()
}

export function symbolAt(index: number, now: number) {
  // Stagger each cell and hash its time step; no random allocation in the frame loop.
  let hash = Math.imul(index + 1, 374761393) ^ Math.floor((now + index * 37) / symbolInterval)
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177)
  return 1 + ((hash ^ (hash >>> 16)) >>> 0) % (symbolCount - 1)
}
