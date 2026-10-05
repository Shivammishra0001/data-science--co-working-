import { useEffect, useEffectEvent, useRef } from 'react'
import { useInView, useMotionValueEvent } from 'motion/react'
import { FRAME_COUNT, frameSrcs } from '../../data/story'
import { useFrameSequence } from '../../hooks/useFrameSequence'
import { drawContain, syncCanvasSize } from '../../utils/media'
import { cx } from '../../utils/accents'

// Scrubs the 40-frame brain → butterfly sequence from a 0–1 motion value.
// - Loads only when the story is near the viewport (not on page load).
// - Cross-fades between neighbouring frames by the fractional position, so
//   40 frames read as continuous motion instead of a slideshow.
// - At most one draw per animation frame; no React renders on scroll, and no
//   layout reads in the hot path (size is synced by a ResizeObserver).
export function BrainScrollController({ progress, className }) {
  const canvasRef = useRef(null)
  const near = useInView(canvasRef, { once: true, margin: '120% 0px' })
  const { imagesRef, loaded } = useFrameSequence(frameSrcs, { enabled: near })
  const lastRef = useRef(-1)
  const rafRef = useRef(0)

  const draw = (force = false) => {
    const f = Math.max(0, Math.min(FRAME_COUNT - 1, progress.get() * (FRAME_COUNT - 1)))
    const q = Math.round(f * 24) / 24 // quantise: skip sub-visible redraws
    if (!force && q === lastRef.current) return
    const imgs = imagesRef.current
    const i = Math.floor(f)
    const a = imgs[i]
    if (!a?.complete || !a.naturalWidth) return
    lastRef.current = q
    const canvas = canvasRef.current
    drawContain(canvas, a)
    const t = f - i
    const b = imgs[i + 1]
    if (t > 0.02 && b?.complete && b.naturalWidth) drawContain(canvas, b, { alpha: t, clear: false })
  }

  const schedule = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      draw()
    })
  }
  useMotionValueEvent(progress, 'change', schedule)

  const repaint = useEffectEvent(() => {
    syncCanvasSize(canvasRef.current)
    draw(true)
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => repaint())
    ro.observe(canvas)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (loaded) repaint()
  }, [loaded])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="A glowing particle brain that dissolves and re-forms as a butterfly taking flight"
      className={cx('frame-blend size-full transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
