import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { signalPipeline, userSignals } from '../../data/market/signals'
import { useVelocityMarquee } from '../../hooks/useVelocityMarquee'
import { cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { SampleBadge } from '../ui/SampleBadge'
import { SignalCard } from './SignalCard'
import { ThemeSection } from './ThemeSection'

// 07 — DARK: the noise of the market. Two streams of signals drift in opposite
// directions (and follow scroll direction); below, the pipeline shows every
// interaction becoming information — its dots move only when you scroll.
export function UserSignals() {
  const half = Math.ceil(userSignals.length / 2)
  return (
    <ThemeSection tone="dark" id="signals" labelledBy="mp-signals-title" className="overflow-x-clip pb-section">
      <div className="container-x pt-16">
        <p className="eyebrow flex items-center gap-3 text-paper/55">
          07 · Real user signals <SampleBadge>Example signals</SampleBadge>
        </p>
        <RevealText
          id="mp-signals-title"
          lines={['The product talks.', <span key="u" className="text-mint">But users talk louder.</span>]}
          className="display mt-3 text-huge"
        />
      </div>

      <div className="mt-14 flex flex-col gap-5" aria-label="Example user signals" role="region">
        <p className="sr-only">{userSignals.map((s) => s.text).join(' · ')}</p>
        <Stream items={userSignals.slice(0, half)} velocity={-1.4} />
        <Stream items={userSignals.slice(half)} velocity={1.1} />
      </div>

      <Pipeline />
    </ThemeSection>
  )
}

function Stream({ items, velocity }) {
  const { ref, x } = useVelocityMarquee(velocity)
  const all = [...items, ...items]
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden py-4">
      <motion.div style={{ x }} className="flex w-max will-change-transform">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-4 pr-4">
            {all.map((s, i) => (
              <SignalCard key={`${half}-${i}`} signal={s} offset={(i % 3) * 10 - 10} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Pipeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return (
    <div ref={ref} className="container-x mt-20">
      <ol className="grid gap-3 md:grid-cols-4 md:gap-0">
        {signalPipeline.map((step, i) => (
          <li key={step.id} className="relative flex items-stretch md:block">
            <div className={cx('flex-1 rounded-tile border border-line bg-ink-2 p-5 md:mr-6 lg:mr-10', i === signalPipeline.length - 1 && 'border-mint md:mr-0')}>
              <span className="font-mono text-xs text-paper/45">{String(i + 1).padStart(2, '0')}</span>
              <h3 className={cx('display mt-2 text-3xl leading-none lg:text-4xl', i === signalPipeline.length - 1 && 'text-mint')}>{step.label}</h3>
              <p className="mt-2 text-sm text-paper/60">{step.note}</p>
            </div>
            {i < signalPipeline.length - 1 && <Flow progress={scrollYProgress} phase={i * 0.21} />}
          </li>
        ))}
      </ol>
    </div>
  )
}

// Dots ride the connector at a rate set by scroll — interaction makes information.
function Flow({ progress, phase }) {
  const dots = [0, 0.33, 0.66]
  return (
    <div aria-hidden="true" className="absolute top-full left-8 h-3 w-px md:top-1/2 md:right-0 md:left-auto md:h-px md:w-6 lg:w-10">
      <div className="absolute inset-0 bg-line-strong" />
      {dots.map((d) => (
        <FlowDot key={d} progress={progress} offset={d + phase} />
      ))}
    </div>
  )
}

function FlowDot({ progress, offset }) {
  const t = useTransform(progress, (p) => `${((p * 6 + offset) % 1) * 100}%`)
  return (
    <>
      <motion.span style={{ left: t }} className="absolute top-1/2 hidden size-1.5 -translate-1/2 rounded-full bg-mint md:block" />
      <motion.span style={{ top: t }} className="absolute left-1/2 size-1.5 -translate-1/2 rounded-full bg-mint md:hidden" />
    </>
  )
}
