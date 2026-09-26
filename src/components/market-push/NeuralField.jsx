import { useEffect, useEffectEvent, useRef } from 'react'
import { isMotionValue, useReducedMotion, useScroll, useVelocity } from 'motion/react'
import { createNeuralField } from '../../animations/neuralMotion'
import { DESKTOP, FINE_POINTER, useMediaQuery } from '../../hooks/useMediaQuery'

// React shell around the canvas engine:
//  - builds once per size, rebuilds on resize
//  - runs only while on screen (IntersectionObserver), never on reduced motion
//  - scroll velocity nudges the whole field; nearby pointer bends it and
//    hovering a node fires a signal through its connections
//  - `connectivity` may be a number or a MotionValue (scroll-driven)
//  - `onReady(api)` hands out burst controls for choreographed moments
export function NeuralField({ connectivity = 0.3, density, seed = 7, interactive = true, onReady, label, className }) {
  const canvasRef = useRef(null)
  const apiRef = useRef(null)
  const desktop = useMediaQuery(DESKTOP)
  const finePointer = useMediaQuery(FINE_POINTER)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const dens = density ?? (desktop ? 'medium' : 'low')

  const readConn = useEffectEvent(() => (isMotionValue(connectivity) ? connectivity.get() : connectivity))
  const ready = useEffectEvent((api) => onReady?.(api))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const api = createNeuralField(canvas, { density: dens, seed, connectivity: readConn() })
    apiRef.current = api
    api.setAmbient(!reduce)
    api.resize()
    ready(api)

    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !reduce) api.start()
      else api.stop()
    })
    io.observe(canvas)

    let t = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(t)
      t = setTimeout(() => api.resize(), 120) // debounce rebuilds
    })
    ro.observe(canvas)

    return () => {
      io.disconnect()
      ro.disconnect()
      clearTimeout(t)
      api.destroy()
      apiRef.current = null
    }
    // readConn/ready are effect events; rebuild only when the field's shape changes
  }, [dens, seed, reduce])

  // connectivity: follow a MotionValue without re-rendering React
  useEffect(() => {
    if (!isMotionValue(connectivity)) {
      apiRef.current?.setConnectivity(connectivity)
      return
    }
    apiRef.current?.setConnectivity(connectivity.get())
    return connectivity.on('change', (v) => apiRef.current?.setConnectivity(v))
  }, [connectivity])

  useEffect(() => {
    if (reduce) return
    return velocity.on('change', (v) => apiRef.current?.kick(v))
  }, [velocity, reduce])

  const pointerOn = interactive && finePointer && !reduce
  const onPointerMove = (e) => {
    if (!pointerOn) return
    const r = e.currentTarget.getBoundingClientRect()
    apiRef.current?.setPointer(e.clientX - r.left, e.clientY - r.top)
  }
  const onPointerLeave = () => apiRef.current?.setPointer(null)

  return (
    <div className={className ?? 'relative'} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      {label && <p className="sr-only">{label}</p>}
    </div>
  )
}
