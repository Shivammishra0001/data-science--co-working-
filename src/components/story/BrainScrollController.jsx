import { useEffect, useEffectEvent, useRef } from 'react'
import { useMotionValueEvent } from 'motion/react'
import { FRAME_COUNT, frameSrcs } from '../../data/story'
import { useFrameSequence } from '../../hooks/useFrameSequence'
import { drawContain, syncCanvasSize } from '../../utils/media'
import { cx } from '../../utils/accents'

// Scrubs the 40-frame brain → butterfly sequence from a 0–1 motion value.
// Draws to one canvas only when the frame index actually changes — no React
// renders on scroll, no layout reads in the hot path.
export function BrainScrollController({ progress, className }) {
  const canvasRef = useRef(null)
  const currentRef = useRef(-1)
  const { imagesRef, loaded } = useFrameSequence(frameSrcs)

  const draw = (force = false) => {
    const i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(progress.get() * (FRAME_COUNT - 1))))
    if (!force && i === currentRef.current) return
    const img = imagesRef.current[i]
    if (!img?.complete || !img.naturalWidth) return
    currentRef.current = i
    drawContain(canvasRef.current, img)
  }

  useMotionValueEvent(progress, 'change', () => draw())

  const repaint = useEffectEvent(() => {
    syncCanvasSize(canvasRef.current)
    draw(true)
  })

  // Resize: match backing store to layout size, then repaint the current frame.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => repaint())
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // First paint once the sequence has decoded.
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
