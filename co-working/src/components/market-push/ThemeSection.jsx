import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { cx } from '../../utils/accents'

const tones = {
  dark: 'bg-ink text-paper',
  light: 'bg-paper text-ink',
}

// Every theme change on this page is a conceptual change (unknown → clarity →
// complexity → people → momentum), so it's staged: the incoming section
// rises as a sheet — inset and rounded — and settles full-bleed as it arrives.
// clip-path doesn't create a scroll container, so sticky children still pin.
export function ThemeSection({ tone = 'dark', id, labelledBy, className, children, sheet = true, sectionRef }) {
  const localRef = useRef(null)
  const ref = sectionRef ?? localRef
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const inset = useTransform(scrollYProgress, [0, 1], [4, 0])
  const radius = useTransform(scrollYProgress, [0, 1], [56, 0])
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(0% ${i}% 0% ${i}% round ${r}px ${r}px 0px 0px)`)

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      data-theme={tone}
      style={sheet && !reduce ? { clipPath } : undefined}
      className={cx('relative', sheet && '-mt-16', tones[tone], className)}
    >
      {/* the sheet overlaps the previous section by this much, so its colour
          shows around the rounded corners while the sheet rises */}
      {sheet && <div aria-hidden="true" className="h-16" />}
      {children}
    </motion.section>
  )
}
