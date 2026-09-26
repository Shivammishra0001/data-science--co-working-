import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { brand } from '../../config/site'
import { RevealText } from '../motion/RevealText'
import { PillButton } from '../ui/PillButton'
import { HeroBrain } from './HeroBrain'

const journey = ['Ideate', 'Build', 'Collaborate', 'Guidance', 'Validate', 'Present', 'Launch', 'Market']

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Leaving the hero: copy lifts away faster than the brain, brain swells slightly.
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const brainY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const brainScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 sm:pt-28"
    >
      {/* Brain: bleeds off the right edge on desktop, sits under the headline on mobile */}
      <HeroBrain
        className="absolute top-[50%] right-[-14vw] -z-10 hidden w-[74vw] max-w-[1400px] -translate-y-1/2 lg:block"
        style={{ y: brainY, scale: brainScale }}
      />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="container-x relative flex flex-1 flex-col justify-center">
        <p className="eyebrow mb-6 flex items-center gap-3 text-paper/70 sm:mb-8">
          <span className="animate-pulse-dot size-2 rounded-full bg-mint" aria-hidden="true" />
          {brand.name} · {brand.descriptor} · {brand.location}
        </p>

        <h1 id="hero-title" className="display">
          <RevealText
            as="span"
            lines={["Don't just learn", 'technology.']}
            className="block text-[clamp(2.2rem,5.4vw,5.6rem)] leading-[0.9] text-paper/60"
            delay={0.15}
          />
          <RevealText
            as="span"
            lines={[
              <Fragment key="a">
                <span className="relative inline-block">
                  <span className="absolute inset-x-[-0.08em] inset-y-[0.04em] -z-10 rounded-[0.14em] bg-sun" aria-hidden="true" />
                  <span className="text-ink">Build</span>
                </span>{' '}
                what
              </Fragment>,
              'comes next.',
            ]}
            className="mt-1 block text-mega"
            delay={0.35}
          />
        </h1>

        <HeroBrain className="relative -mx-[12vw] -mt-[6vw] mb-2 w-[124vw] max-w-none sm:-mt-[4vw] lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-xl lg:mt-10"
        >
          <p className="text-lg leading-relaxed text-paper/75 sm:text-xl">
            An ecosystem where ideas become experiments, projects become products, and builders reach the market.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PillButton href="#start" variant="sun" size="lg" arrow>
              Start building
            </PillButton>
            <PillButton href="#projects" variant="outline" size="lg">
              Explore projects
            </PillButton>
          </div>
        </motion.div>
      </motion.div>

      <div className="container-x relative mt-12 mb-6 flex items-end justify-between gap-6 sm:mb-8">
        <ol
          aria-label="How it works"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] tracking-[0.14em] text-paper/50 uppercase"
        >
          {journey.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              {step}
              {i < journey.length - 1 && <span aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
        <a
          href="#ribbons"
          className="hidden shrink-0 items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-paper/60 uppercase transition-colors hover:text-paper sm:inline-flex"
        >
          Scroll
          <ArrowDown aria-hidden="true" className="animate-drift size-4" />
        </a>
      </div>
    </section>
  )
}
