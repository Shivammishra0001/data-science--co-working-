import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { brand } from '../../config/site'
import { RevealText } from '../motion/RevealText'
import { PillButton } from '../ui/PillButton'
import { HeroBots } from './HeroBots'
import { HeroActors } from './HeroActors'


export function HeroSection() {
  const ref = useRef(null)
  const copyRef = useRef(null) // the robots measure this to keep clear of the text
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Leaving the hero: copy lifts away faster than the robots; the robots drift down a touch.
  // copy lifts a little as the hero leaves — enough to feel layered, not enough to leave a void
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 pb-8 sm:pt-28"
    >
      {/* Desktop: each robot and icon roams the open space of the hero on its own,
          never over the text. Phones/tablets: a robot row under the headline. */}
      <HeroActors avoidRef={copyRef} className="pointer-events-none absolute inset-0 z-0 hidden lg:block" />

      {/* the copy layer lets the pointer through to the robots behind it; links/buttons stay clickable */}
      <motion.div ref={copyRef} style={{ y: copyY, opacity: copyOpacity }} className="container-x pointer-events-none relative flex flex-1 flex-col justify-center select-text [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <p className="eyebrow mb-6 flex items-center gap-3 text-paper/50 sm:mb-8">
          <span className="animate-pulse-dot size-2 rounded-full bg-mint" aria-hidden="true" />
          {brand.descriptor}
          <span className="hidden sm:inline">· {brand.location}</span>
        </p>

        <h1 id="hero-title" className="display">
          <RevealText
            as="span"
            lines={["Don't just Watching", 'technology.']}
            className="block text-[clamp(2.2rem,5.4vw,5.6rem)] leading-[0.9] text-paper/60"
            delay={0.15}
          />
          <RevealText
            as="span"
            lines={[
              <Fragment key="a">
                <span className="relative inline-block">
                  <span className="absolute inset-x-[-0.08em] inset-y-[0.04em] -z-10 rounded-[0.14em] bg-sun" aria-hidden="true" />
                  <span className="text-ink">Stop</span>
                </span>{' '}
                Watching
              </Fragment>,
              'Start Building.',
            ]}
            className="mt-1 block text-mega"
            delay={0.35}
          />
        </h1>

        <HeroBots compact className="relative mx-auto mt-8 mb-2 w-full max-w-[40rem] lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-xl lg:mt-10"
        >
          <p className="text-lg leading-relaxed text-paper/75 sm:text-xl">
            An ecosystem where ideas become product, product reach the market place and then product become Startup.
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

      
    </section>
  )
}
