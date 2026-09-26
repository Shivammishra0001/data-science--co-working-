import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { journey, launches } from '../../data/launches'
import { RevealText } from '../motion/RevealText'
import { RevealGroup, RevealItem } from '../motion/ScrollReveal'
import { PillButton } from '../ui/PillButton'
import { InnovationCard } from './InnovationCard'

export function MarketPush() {
  return (
    <section id="market-push" aria-labelledby="market-title" className="relative overflow-hidden bg-ink py-section">
      <div className="container-x">
        <p className="eyebrow mb-6 text-flare">Market Push</p>
        <RevealText
          id="market-title"
          lines={['From something', 'we built', <span key="c" className="text-flare">to something</span>, <span key="d" className="text-flare">people use.</span>]}
          className="display text-giant"
        />
        <p className="mt-6 max-w-xl text-lg text-paper/70">
          Not a marketplace. A push: pilots, first customers and distribution for the projects that survive validation.
        </p>

        <JourneyRail />

        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5" stagger={0.12}>
          {launches.map((l) => (
            <RevealItem key={l.id} preset="scale" className="h-full">
              <InnovationCard item={l} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10">
          <PillButton href="/market-push" variant="flare" arrow>
            Explore Market Push
          </PillButton>
        </div>
      </div>
    </section>
  )
}

// IDEA → PROTOTYPE → TEST → LAUNCH → USERS, filled by scroll.
function JourneyRail() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 45%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref} className="mt-[clamp(3rem,7vw,6rem)]">
      <div className="relative">
        <div className="absolute top-1/2 right-0 left-0 hidden h-0.5 -translate-y-1/2 bg-line sm:block" aria-hidden="true" />
        <motion.div
          aria-hidden="true"
          style={{ scaleX: fill }}
          className="absolute top-1/2 right-0 left-0 hidden h-0.5 origin-left -translate-y-1/2 bg-flare sm:block"
        />
        <ol className="relative flex flex-wrap gap-2 sm:justify-between" aria-label="Path to market">
          {journey.map((step, i) => (
            <Step key={step} step={step} i={i} total={journey.length} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </div>
  )
}

function Step({ step, i, total, progress }) {
  const at = i / (total - 1)
  const bg = useTransform(progress, [at - 0.02, at], ['#08080b', '#ff5b22'])
  const color = useTransform(progress, [at - 0.02, at], ['#f3f0e8', '#08080b'])
  return (
    <li className="flex flex-col items-center">
      <motion.span
        style={{ backgroundColor: bg, color }}
        className="display rounded-full border-2 border-flare px-[0.7em] pt-[0.18em] pb-[0.1em] text-[clamp(1.1rem,2.4vw,2.2rem)] leading-none whitespace-nowrap"
      >
        {step}
      </motion.span>
    </li>
  )
}
