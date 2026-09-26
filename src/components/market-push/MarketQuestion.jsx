import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { marketQuestions } from '../../data/market/lifecycle'
import { RevealText } from '../motion/RevealText'
import { ThemeSection } from './ThemeSection'

// 02 — LIGHT: clarity. Left column holds the claim (sticky on desktop);
// the signal from the hero travels down the right column, lighting each question.
export function MarketQuestion() {
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 70%', 'end 45%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])
  const dotTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <ThemeSection tone="light" labelledBy="mp-question-title" className="pb-section">
      <div aria-hidden="true" className="mx-auto h-20 w-px bg-gradient-to-b from-flare/70 to-transparent" />
      <div className="container-x grid gap-14 pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-6 text-paper-mute">02 · The question</p>
          <RevealText
            id="mp-question-title"
            lines={['Building something', 'is easy to measure.']}
            className="display text-huge"
          />
          <RevealText
            as="p"
            lines={['But how do you know', <span key="n" className="text-flare">if anyone needs it?</span>]}
            className="display mt-6 text-huge text-ink/35"
            delay={0.35}
          />
        </div>

        <div>
          <p className="max-w-md text-lg leading-relaxed text-ink/70">
            Code either runs or it doesn’t. Demand is harder: it hides in behaviour, not in test results. Three
            questions decide whether a project becomes a product.
          </p>

          <div ref={trackRef} className="relative mt-12 pl-10 sm:pl-14">
            {/* signal rail */}
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-3 w-px bg-ink/15 sm:left-5">
              <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-flare" />
              <motion.span
                style={{ top: dotTop }}
                className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flare shadow-[0_0_14px_3px_rgba(255,91,34,0.55)]"
              />
            </div>
            <ol className="flex flex-col gap-14 sm:gap-20">
              {marketQuestions.map((item, i) => (
                <Question key={item.q} item={item} index={i} total={marketQuestions.length} progress={scrollYProgress} />
              ))}
            </ol>
          </div>

          <p className="display mt-16 text-big">
            That’s where <span className="text-flare">Market Push</span> begins.
          </p>
        </div>
      </div>
    </ThemeSection>
  )
}

function Question({ item, index, total, progress }) {
  const at = index / (total - 1)
  const opacity = useTransform(progress, [at - 0.25, at], [0.2, 1])
  const x = useTransform(progress, [at - 0.25, at], [-16, 0])
  return (
    <motion.li style={{ opacity, x }}>
      <span className="font-mono text-xs tracking-[0.14em] text-ink/50">Q{index + 1}</span>
      <h3 className="display mt-1 text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.9]">{item.q}</h3>
      <p className="mt-3 max-w-sm text-ink/65">{item.a}</p>
    </motion.li>
  )
}
