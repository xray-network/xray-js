import { useEffect, useRef } from "react"
import { createHeroRenderer } from "./heroRenderer"

export function HeroArtwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const background = backgroundRef.current
    const hero = canvas?.closest(".spectre-hero-grid")
    if (!canvas || !background || !hero) return
    return createHeroRenderer(canvas, background, hero)
  }, [])

  return (
    <div className="spectre-hero-art" aria-hidden="true">
      <canvas ref={backgroundRef} />
      <canvas ref={canvasRef} />
    </div>
  )
}
