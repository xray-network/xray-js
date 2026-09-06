export const spacing = 26
export const firstY = 20

// CSS-pixel coordinates: resize changes the number of symbols, never their size.
export function createGrid(width: number, height: number) {
  const margin = 6
  const columns = width > 0 ? Math.floor((width + margin) / spacing) + 1 : 0
  const rows = height > 0 ? Math.max(0, Math.floor((height + margin - firstY) / spacing) + 1) : 0
  const radiusX = Math.max(width * .65, 1)
  const radiusY = Math.max(height * .8, 1)
  const points = Array.from({ length: rows * columns }, (_, i) => {
    const x = (i % columns) * spacing
    const y = firstY + Math.floor(i / columns) * spacing
    const dx = (x - width / 2) / radiusX
    const dy = y / radiusY
    // Soft oval falloff from the top center, cached when the grid is resized.
    const visibility = .04 + .9 * Math.exp(-2.3 * (dx * dx + dy * dy))
    return { x, y, visibility }
  })
  return { columns, rows, points }
}
