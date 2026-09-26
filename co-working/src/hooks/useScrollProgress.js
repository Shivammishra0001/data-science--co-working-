import { useState } from 'react'
import { useMotionValueEvent, useScroll, useSpring } from 'motion/react'

// Section scroll progress (0–1), spring-smoothed for a physical feel.
// Default offset suits a pinned section: 0 when its top hits the top of the
// viewport, 1 when its bottom hits the bottom.
export function useScrollProgress(ref, { offset = ['start start', 'end end'], smooth = true } = {}) {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const spring = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5, restDelta: 0.0005 })
  return smooth ? spring : scrollYProgress
}

// Which of `count` equal steps the progress is in. Re-renders only on change.
export function useActiveIndex(progress, count) {
  const [active, setActive] = useState(0)
  useMotionValueEvent(progress, 'change', (v) => {
    const i = Math.min(count - 1, Math.max(0, Math.floor(v * count)))
    if (i !== active) setActive(i)
  })
  return active
}

// Scroll the window so a pinned section lands on step `i` of `count`.
export function scrollToStep(el, i, count) {
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  const travel = el.offsetHeight - window.innerHeight
  window.scrollTo({ top: top + travel * ((i + 0.5) / count), behavior: 'smooth' })
}
