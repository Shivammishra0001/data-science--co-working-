import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { dayHere } from '../../data/about/story'
import { useStoryMode } from '../../hooks/useStoryMode'
import { RevealText } from '../motion/RevealText'
import { ThemeSection } from '../market-push/ThemeSection'

// 07 — DARK: building. Seven moments down a circuit line. The line is a data
// path: it draws as you read, and each step lights when the signal reaches it.
export function DayAtTheSpace() {
  const ref = useRef(null)
  const { reduce } = useStoryMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const full = useMotionValue(1)
  const p = reduce ? full : scrollYProgress
  const line = useTransform(p, [0, 1], [0, 1])
  const tip = useTransform(p, (v) => `${v * 100}%`)
  const n = dayHere.steps.length

  return (
    <ThemeSection tone="dark" id="inside" labelledBy="day-title" data-chapter="build" className="pb-section">
      <div className="container-x pt-14">
        <p className="eyebrow text-paper/55">07 · What happens here</p>
        <RevealText id="day-title" lines={dayHere.title} className="display mt-3 text-huge" />

        <div ref={ref} className="relative mt-14 max-w-4xl pl-12 sm:pl-20">
          {/* the circuit: base trace, drawn trace, signal at the tip */}
          <div aria-hidden="true" className="absolute top-3 bottom-3 left-4 w-px bg-line sm:left-7">
            <motion.div style={{ scaleY: line }} className="absolute inset-0 origin-top bg-gradient-to-b from-sun via-mint to-flare" />
            <motion.span style={{ top: tip }} className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[0_0_16px_4px_rgba(243,240,232,0.45)]" />
          </div>
          <ol className="flex flex-col gap-12 sm:gap-16">
            {dayHere.steps.map((s, i) => (
              <Step key={s.title} step={s} i={i} at={i / (n - 1)} progress={p} />
            ))}
          </ol>
        </div>
      </div>
    </ThemeSection>
  )
}

function Step({ step, i, at, progress }) {
  const lit = useTransform(progress, [at - 0.06, at], [0, 1])
  const o = useTransform(lit, [0, 1], [0.35, 1])
  const bg = useTransform(lit, (k) => (k > 0.5 ? '#3fdb94' : '#18181f'))
  return (
    <motion.li style={{ opacity: o }} className="relative">
      {/* branch from the trace to the step */}
      <span aria-hidden="true" className="absolute top-4 -left-8 h-px w-6 bg-line-strong sm:-left-13 sm:w-10" />
      <motion.span aria-hidden="true" style={{ backgroundColor: bg }} className="absolute top-[0.7rem] -left-[2.05rem] size-3 rounded-sm ring-1 ring-line-strong sm:-left-[3.3rem]" />
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.14em] text-paper/50 uppercase">
        Step {String(i + 1).padStart(2, '0')} <span className="rounded border border-line-strong px-1.5 py-0.5 text-[0.6875rem]">{step.tag}</span>
      </p>
      <h3 className="display mt-1.5 text-[clamp(2rem,4vw,3.6rem)] leading-[0.92]">{step.title}</h3>
      <p className="mt-2 text-xl text-paper/70 italic">“{step.quote}”</p>
    </motion.li>
  )
}
