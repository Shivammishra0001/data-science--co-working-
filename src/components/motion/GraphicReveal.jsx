import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

// Decorative graphics stay hidden — not just transparent: visibility:hidden, so
// they can't flash, intercept clicks or be painted early — until the section
// they belong to is actually in the viewport. Then they reveal once (no replay
// on every scroll). Viewport-based, so it works at any screen height.
//
//   <GraphicReveal className="absolute inset-0"><ButterflyLoop /></GraphicReveal>
//
// amount: how much of the trigger must be visible (0–1).
// decorative: hide from assistive tech (omit when the child carries a text label).
// Reduced motion: shown immediately, no movement.
export function GraphicReveal({ children, className, style, amount = 0.3, delay = 0, as = 'div', decorative = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div
  const shown = reduce || inView
  return (
    <Tag
      ref={ref}
      aria-hidden={decorative || undefined}
      className={className}
      initial={false}
      animate={shown ? { opacity: 1, y: 0, scale: 1, visibility: 'visible' } : { opacity: 0, y: 30, scale: 0.95, visibility: 'hidden' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1], visibility: { delay: shown ? 0 : 0.9 } }}
      style={style}
    >
      {children}
    </Tag>
  )
}
