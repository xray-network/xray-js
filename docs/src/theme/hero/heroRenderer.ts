import { createGrid, spacing, firstY } from "./heroGrid"
import { strokeSymbol, symbolAt, symbolCount } from "./heroSymbols"
import { createWave, prepareWave, waveFrame, type PreparedWave } from "./heroWaves"

const alphaEpsilon = 1 / 1024

export function createHeroRenderer(canvas: HTMLCanvasElement, background: HTMLCanvasElement, hero: Element): () => void {
  const ctx = canvas.getContext("2d")
  const baseCtx = background.getContext("2d")
  const atlas = document.createElement("canvas")
  const atlasCtx = atlas.getContext("2d")
  if (!ctx || !baseCtx || !atlasCtx) return () => {}

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  let { columns, rows, points } = createGrid(0, 0)
  let hoverStrength = new Float32Array(points.length)
  let hoverTargets = new Float32Array(points.length)
  let ambient = new Float32Array(points.length)
  let lastAlpha = new Float32Array(points.length)
  let lastSprite = new Uint8Array(points.length)
  let pixelX = new Int32Array(points.length)
  let pixelY = new Int32Array(points.length)
  let frame = 0, lastPaint = 0, lastMove = 0
  let wakeTimer = 0, nextWave = 0
  let wave: PreparedWave | undefined
  const waveState = { front: 0, envelope: 0 }
  let hasPointer = false
  let inView = false, disposed = false, hoverActive = false, hoverDirty = false, boundsDirty = false
  let width = 0, height = 0, pixelRatio = 1, tileSize = 1
  let minRow = 0, maxRow = -1, minColumn = 0, maxColumn = -1
  let mouseX = 0, mouseY = 0, left = 0, top = 0
  let neutral = "#6e758d", blue = "#1940ed"
  let spriteRatio = 0, spriteBlue = "", spriteNeutral = ""
  const canAnimate = () => !disposed && !reducedMotion.matches && !document.hidden && inView && width > 0 && height > 0

  const rebuildImages = () => {
    // Static marks are painted only on resize/theme changes, never copied per frame.
    baseCtx.setTransform(1, 0, 0, 1, 0, 0)
    baseCtx.clearRect(0, 0, background.width, background.height)
    baseCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    baseCtx.strokeStyle = neutral
    baseCtx.lineWidth = .75
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minColumn; col <= maxColumn; col++) {
        const point = points[row * columns + col]
        baseCtx.globalAlpha = point.visibility * .8
        strokeSymbol(baseCtx, 0, point.x, point.y)
      }
    }
    // Small, cached sprites replace path construction/rasterization during animation.
    if (spriteRatio !== pixelRatio || spriteBlue !== blue || spriteNeutral !== neutral) {
      tileSize = Math.ceil(10 * pixelRatio) + 4
      atlas.width = tileSize * symbolCount
      atlas.height = tileSize * 2
      atlasCtx.lineWidth = 1 * pixelRatio
      atlasCtx.strokeStyle = blue
      for (let i = 0; i < symbolCount; i++) {
        strokeSymbol(atlasCtx, i, tileSize * (i + .5), tileSize / 2, pixelRatio)
      }
      atlasCtx.strokeStyle = neutral
      atlasCtx.lineWidth = .75 * pixelRatio
      strokeSymbol(atlasCtx, 0, tileSize / 2, tileSize * 1.5, pixelRatio)
      spriteRatio = pixelRatio
      spriteBlue = blue
      spriteNeutral = neutral
    }
    for (let i = 0; i < points.length; i++) {
      pixelX[i] = Math.round(points[i].x * pixelRatio - tileSize / 2)
      pixelY[i] = Math.round(points[i].y * pixelRatio - tileSize / 2)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastAlpha.fill(0)
    lastSprite.fill(0)
  }
  const showRestingMark = (i: number, visible: boolean) => {
    const x = pixelX[i] / pixelRatio, y = pixelY[i] / pixelRatio, size = tileSize / pixelRatio
    baseCtx.clearRect(x, y, size, size)
    if (visible) {
      baseCtx.globalAlpha = points[i].visibility * .8
      baseCtx.drawImage(atlas, 0, tileSize, tileSize, tileSize, x, y, size, size)
    }
  }
  const suspend = () => {
    cancelAnimationFrame(frame)
    window.clearTimeout(wakeTimer)
    wakeTimer = nextWave = 0
    wave = undefined
    ambient.fill(0)
    frame = 0
    hasPointer = false
    hoverActive = hoverDirty = false
    hoverStrength.fill(0)
    hoverTargets.fill(0)
    lastPaint = 0
    for (let i = 0; i < points.length; i++) if (lastSprite[i] > 0) showRestingMark(i, true)
    lastSprite.fill(0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastAlpha.fill(0)
  }
  const wake = () => {
    window.clearTimeout(wakeTimer)
    wakeTimer = 0
    if (canAnimate() && !frame) frame = requestAnimationFrame(tick)
  }
  const syncPlayback = () => { if (!canAnimate()) suspend(); else wake() }

  const tick = (now: number) => {
    frame = 0
    if (!canAnimate()) { suspend(); return }
    const elapsed = lastPaint ? Math.min(now - lastPaint, 50) : 16.67
    const rise = 1 - Math.exp(-elapsed / 90)
    const fade = 1 - Math.exp(-elapsed / 220)
    lastPaint = now
    if (hoverActive && now - lastMove > 80) {
      hoverActive = false
      hoverDirty = true
    }
    if (boundsDirty && hoverActive) {
      const rect = canvas.getBoundingClientRect()
      left = rect.left
      top = rect.top
      boundsDirty = false
      hoverDirty = true
    }
    // Distance calculations only happen when the pointer moves, within its 100-unit radius.
    if (hoverDirty) {
      hoverTargets.fill(0)
      if (hoverActive) {
        const x = mouseX - left
        const y = mouseY - top
        const r0 = Math.max(minRow, Math.ceil((y - 100 - firstY) / spacing))
        const r1 = Math.min(maxRow, Math.floor((y + 100 - firstY) / spacing))
        const c0 = Math.max(minColumn, Math.ceil((x - 100) / spacing))
        const c1 = Math.min(maxColumn, Math.floor((x + 100) / spacing))
        for (let row = r0; row <= r1; row++) {
          for (let col = c0; col <= c1; col++) {
            const i = row * columns + col
            const squared = (points[i].x - x) ** 2 + (points[i].y - y) ** 2
            if (squared >= 10000) continue
            const proximity = 1 - Math.sqrt(squared) / 100
            hoverTargets[i] = proximity * proximity * (3 - 2 * proximity)
          }
        }
      }
      hoverDirty = false
    }
    if (wave && now >= wave.start + wave.duration) wave = undefined
    if (now >= nextWave) {
      wave = prepareWave(createWave(now, width), points)
      nextWave = now + wave.duration + 1800 + Math.random() * 1200
    }
    ambient.fill(0)
    if (wave && waveFrame(wave, now, waveState)) {
      for (let row = minRow; row <= maxRow; row++) {
        const start = row * columns
        const offset = wave.distances[start]
        // Visit only the columns touched by this curved wave.
        const c0 = Math.max(minColumn, Math.ceil((waveState.front - wave.width - offset) / spacing))
        const c1 = Math.min(maxColumn, Math.floor((waveState.front + wave.width - offset) / spacing))
        for (let col = c0; col <= c1; col++) {
          const i = start + col
          const band = Math.max(0, 1 - Math.abs(wave.distances[i] - waveState.front) / wave.width)
          ambient[i] = band * band * (3 - 2 * band) * waveState.envelope * points[i].visibility
        }
      }
    }
    let settling = false
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minColumn; col <= maxColumn; col++) {
        const i = row * columns + col
        const difference = hoverTargets[i] - hoverStrength[i]
        if (Math.abs(difference) < .001) hoverStrength[i] = hoverTargets[i]
        else { hoverStrength[i] += difference * (difference > 0 ? rise : fade); settling = true }
        const active = hoverStrength[i]
        const pointerValue = active * (.55 + active * .45)
        const value = Math.max(pointerValue, ambient[i])
        const alpha = value < .002 ? 0 : value * (2 - value)
        const sprite = alpha > 0
          ? (ambient[i] > pointerValue ? symbolAt(i, now) : hoverActive ? symbolAt(i, lastMove) : lastSprite[i])
          : 0
        if (alpha === lastAlpha[i] || (alpha > 0 && lastAlpha[i] > 0 && Math.abs(alpha - lastAlpha[i]) < alphaEpsilon)) {
          if (sprite === lastSprite[i]) continue
        }
        // Hide the resting slash while a symbol replaces it; restore from the cache.
        if ((sprite > 0) !== (lastSprite[i] > 0)) showRestingMark(i, sprite === 0)
        // Symbol tiles never overlap. Clear only changed tiles, not the full hero surface.
        if (lastAlpha[i] > 0) ctx.clearRect(pixelX[i], pixelY[i], tileSize, tileSize)
        if (alpha > 0) {
          ctx.globalAlpha = alpha
          ctx.drawImage(atlas, sprite * tileSize, 0, tileSize, tileSize, pixelX[i], pixelY[i], tileSize, tileSize)
        }
        lastAlpha[i] = alpha
        lastSprite[i] = sprite
      }
    }
    if (wave || hoverActive || settling) frame = requestAnimationFrame(tick)
    else {
      lastPaint = 0
      wakeTimer = window.setTimeout(() => { wakeTimer = 0; wake() }, Math.max(1, nextWave - now))
    }
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    left = rect.left
    top = rect.top
    boundsDirty = false
    hoverDirty = true
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    if (width === rect.width && height === rect.height && ratio === pixelRatio) return
    width = rect.width
    height = rect.height
    pixelRatio = ratio
    canvas.width = background.width = Math.max(1, Math.round(width * pixelRatio))
    canvas.height = background.height = Math.max(1, Math.round(height * pixelRatio))
    const grid = createGrid(width, height)
    columns = grid.columns
    rows = grid.rows
    points = grid.points
    hoverStrength = new Float32Array(points.length)
    hoverTargets = new Float32Array(points.length)
    ambient = new Float32Array(points.length)
    lastAlpha = new Float32Array(points.length)
    lastSprite = new Uint8Array(points.length)
    pixelX = new Int32Array(points.length)
    pixelY = new Int32Array(points.length)
    minColumn = minRow = 0
    maxColumn = columns - 1
    maxRow = rows - 1
    if (wave) wave = prepareWave({ ...wave, extent: width }, points)
    rebuildImages()
    syncPlayback()
  }
  const readTheme = () => {
    const style = getComputedStyle(canvas)
    const nextNeutral = style.getPropertyValue("--xr-gray-500").trim() || neutral
    const nextBlue = style.getPropertyValue("--spectre-symbol-color").trim() || style.getPropertyValue("--xr-link").trim() || blue
    if (neutral === nextNeutral && blue === nextBlue) return
    neutral = nextNeutral
    blue = nextBlue
    rebuildImages()
    syncPlayback()
  }
  const onMove = (event: Event) => {
    const { clientX, clientY, isPrimary } = event as PointerEvent
    if (!canAnimate() || isPrimary === false) return
    if (hasPointer && mouseX === clientX && mouseY === clientY) return
    hasPointer = true
    lastMove = performance.now()
    mouseX = clientX
    mouseY = clientY
    hoverActive = hoverDirty = true
    wake()
  }
  const onLeave = (event?: Event) => {
    if ((event as PointerEvent | undefined)?.isPrimary === false) return
    hasPointer = false
    hoverActive = false
    hoverDirty = true
    if (lastPaint || frame) wake()
  }
  const onContact = (event: Event) => {
    if ((event as PointerEvent).pointerType !== "mouse") onMove(event)
  }
  const onEndContact = (event: Event) => {
    const { isPrimary, pointerType } = event as PointerEvent
    if (isPrimary !== false && pointerType !== "mouse") onLeave()
  }
  const onScroll = () => { boundsDirty = true; onLeave() }
  const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncPlayback() })
  const sizeObserver = new ResizeObserver(resize)
  const themeObserver = new MutationObserver(readTheme)
  intersection.observe(hero)
  sizeObserver.observe(canvas)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
  // Passive pointer events support touch/pen without blocking native scrolling.
  hero.addEventListener("pointerdown", onContact, { passive: true })
  hero.addEventListener("pointermove", onMove, { passive: true })
  hero.addEventListener("pointerup", onEndContact, { passive: true })
  hero.addEventListener("pointercancel", onEndContact, { passive: true })
  hero.addEventListener("pointerleave", onLeave)
  reducedMotion.addEventListener("change", syncPlayback)
  document.addEventListener("visibilitychange", syncPlayback)
  window.addEventListener("resize", resize)
  window.addEventListener("scroll", onScroll, true)
  resize()
  readTheme()
  return () => {
    disposed = true
    suspend()
    intersection.disconnect()
    sizeObserver.disconnect()
    themeObserver.disconnect()
    hero.removeEventListener("pointermove", onMove)
    hero.removeEventListener("pointerdown", onContact)
    hero.removeEventListener("pointerup", onEndContact)
    hero.removeEventListener("pointercancel", onEndContact)
    hero.removeEventListener("pointerleave", onLeave)
    reducedMotion.removeEventListener("change", syncPlayback)
    document.removeEventListener("visibilitychange", syncPlayback)
    window.removeEventListener("resize", resize)
    window.removeEventListener("scroll", onScroll, true)
    atlas.width = atlas.height = 0
  }
}
