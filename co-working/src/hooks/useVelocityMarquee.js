import { useRef } from 'react'
import {
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// Infinite marquee whose speed and direction follow the scroll:
// scroll down → base direction, faster; scroll up → reverses. Influence is
// capped so a hard flick never strobes. Content must be duplicated once
// (two identical halves) so wrapping at -50% is seamless.
export function useVelocityMarquee(velocity = -2) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { margin: '200px 0px' })

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 })
  const factor = useTransform(smoothVelocity, [-2500, 0, 2500], [-3, 0, 3], { clamp: true })
  const direction = useRef(1)

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    const vf = factor.get()
    if (vf < -0.02) direction.current = -1
    else if (vf > 0.02) direction.current = 1
    let moveBy = direction.current * velocity * (Math.min(delta, 64) / 1000)
    moveBy += direction.current * moveBy * vf
    baseX.set(baseX.get() + moveBy)
  })

  return { ref, x }
}
