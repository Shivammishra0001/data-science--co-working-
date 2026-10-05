import { useEffect, useRef } from 'react'
import { useAnimationFrame, useInView, useReducedMotion } from 'motion/react'
import { butterflySrcs } from '../../data/story'
import { useFrameSequence } from '../../hooks/useFrameSequence'
import { drawContain, syncCanvasSize } from '../../utils/media'
import { cx } from '../../utils/accents'

const FPS = 9

// The story's last frames, ping-ponged: the butterfly the brain became, still in flight.
// Loads only once near the viewport; pauses off-screen; static for reduced motion.
export function ButterflyLoop({ className }) {
  const canvasRef = useRef(null)
  const near = useInView(canvasRef, { once: true, margin: '400px 0px' })
  const visible = useInView(canvasRef)
  const reduce = useReducedMotion()
  const { imagesRef, loaded } = useFrameSequence(butterflySrcs, { enabled: near })
  const clock = useRef({ acc: 0, step: 0 })

  // size the canvas on layout changes only — never inside the animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => syncCanvasSize(canvas))
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!loaded) return
    syncCanvasSize(canvasRef.current)
    drawContain(canvasRef.current, imagesRef.current[imagesRef.current.length - 1])
  }, [loaded, imagesRef])

  useAnimationFrame((_, delta) => {
    if (!loaded || reduce || !visible) return
    const c = clock.current
    c.acc += delta
    if (c.acc < 1000 / FPS) return
    c.acc = 0
    const n = imagesRef.current.length
    c.step = (c.step + 1) % (2 * n - 2)
    const i = c.step < n ? c.step : 2 * n - 2 - c.step
    drawContain(canvasRef.current, imagesRef.current[i])
  })

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cx('frame-blend size-full transition-opacity duration-1000', loaded ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
