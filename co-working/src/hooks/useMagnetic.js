import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { FINE_POINTER, useMediaQuery } from './useMediaQuery'

// Pulls an element a few pixels toward the pointer. Mouse-only and
// disabled for reduced motion — it's a micro-interaction, never a requirement.
export function useMagnetic(strength = 0.25) {
  const reduce = useReducedMotion()
  const fine = useMediaQuery(FINE_POINTER)
  const active = fine && !reduce

  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })

  const onPointerMove = (e) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { style: { x, y }, onPointerMove, onPointerLeave }
}
