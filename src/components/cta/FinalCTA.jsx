import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { PillButton } from '../ui/PillButton'
import { ButterflyLoop } from './ButterflyLoop'

export function FinalCTA() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // The butterfly rises into place as the section arrives — the end of the brain's journey.
  const y = useTransform(scrollYProgress, [0, 1], ['30%', '0%'])
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1])

  return (
    <section
      id="start"
      ref={ref}
      aria-labelledby="cta-title"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-ink py-section"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute top-1/2 left-1/2 -z-10 aspect-[16/9] w-[max(120vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-80 lg:w-[88vw]"
      >
        <ButterflyLoop />
      </motion.div>

      {/* scrim so copy stays readable over the brightest part of the wings */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_38%_32%_at_50%_58%,rgba(8,8,11,0.82),transparent)]"
      />

      <div className="container-x text-center">
        <p className="eyebrow mb-6 text-paper/70">Stage 09 · Yours</p>
        <RevealText
          id="cta-title"
          lines={['What will', <span key="b" className="text-sun">you build?</span>]}
          className="display text-mega"
        />
        <ScrollReveal delay={0.3} className="mx-auto mt-8 max-w-md text-xl leading-snug font-medium text-paper [text-shadow:0_1px_16px_rgba(8,8,11,0.95)]">
          <p>Bring the idea.</p>
          <p>Bring the curiosity.</p>
          <p>Bring the obsession to make something real.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.45} className="mt-10 flex flex-wrap justify-center gap-3">
          <PillButton href="#start-building" variant="sun" size="lg" arrow>
            Start building
          </PillButton>
          <PillButton href="#projects" variant="outline" size="lg">
            Explore projects
          </PillButton>
          <PillButton href="#join" variant="solid" size="lg">
            Join community
          </PillButton>
        </ScrollReveal>
      </div>
    </section>
  )
}
