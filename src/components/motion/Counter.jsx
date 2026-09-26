import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

const fmt = new Intl.NumberFormat('en-US')

// Counts up once when scrolled into view. Writes to the DOM directly so a
// 1.8s count doesn't re-render React 100+ times. Screen readers get the
// final value via aria-label; reduced motion shows it immediately.
export function Counter({ value, suffix = '', duration = 1.8, className }) {
  const rootRef = useRef(null)
  const numRef = useRef(null)
  const inView = useInView(rootRef, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const final = `${fmt.format(value)}${suffix}`

  useEffect(() => {
    const el = numRef.current
    if (!el || !inView || reduce) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${fmt.format(Math.round(v))}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, suffix, duration])

  return (
    <span ref={rootRef} className={className}>
      <span className="sr-only">{final}</span>
      <span ref={numRef} aria-hidden="true" className="tabular-nums">
        {reduce ? final : `0${suffix}`}
      </span>
    </span>
  )
}
