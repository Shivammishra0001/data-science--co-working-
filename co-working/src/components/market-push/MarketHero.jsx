import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { RevealText } from '../motion/RevealText'
import { PillButton } from '../ui/PillButton'
import { NeuralField } from './NeuralField'

// 01 — DARK: the unknown. The network is sparse at rest and wires itself up as
// you scroll; past the midpoint a central signal fires and a single line carries
// it down into the next section.
export function MarketHero() {
  const ref = useRef(null)
  const api = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const connectivity = useTransform(scrollYProgress, [0, 0.7], [0.12, 1])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const handoff = useTransform(scrollYProgress, [0.35, 1], ['0%', '100%'])

  const fired = useRef(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.4 && !fired.current) {
      fired.current = true
      api.current?.burstCenter(10)
    } else if (v < 0.2) fired.current = false // re-arm on the way back up
  })

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="mp-hero-title"
      data-theme="dark"
      className="relative isolate flex min-h-[112svh] flex-col overflow-hidden bg-ink pt-28"
    >
      <NeuralField
        connectivity={connectivity}
        onReady={(a) => (api.current = a)}
        className="absolute inset-0 -z-10"
        label="An interactive network of branching neurons. Signals travel between connected nodes; it becomes more connected as you scroll."
      />
      {/* keep type readable where it overlaps the densest part of the field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_18%_62%,rgba(8,8,11,0.92),rgba(8,8,11,0.4)_60%,transparent)]"
      />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="container-x pointer-events-none flex flex-1 flex-col justify-center pb-24">
        <p className="eyebrow mb-6 flex items-center gap-3 text-flare">
          <span aria-hidden="true" className="animate-pulse-dot size-2 rounded-full bg-flare" />
          Market Push
        </p>
        <RevealText
          as="h1"
          id="mp-hero-title"
          lines={['What happens', 'when an idea', <span key="l" className="text-flare">leaves the lab?</span>]}
          className="display text-mega"
          delay={0.1}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto mt-8 max-w-xl"
        >
          <p className="text-lg leading-relaxed text-paper/80 sm:text-xl">
            Market Push turns experiments into products, products into real-world experiences, and user feedback into the
            next version.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PillButton href="#discover" variant="flare" size="lg" arrow>
              Explore live products
            </PillButton>
            <PillButton href="#submit" variant="outline" size="lg">
              Submit your project
            </PillButton>
          </div>
          <p className="mt-8 hidden font-mono text-[0.7rem] tracking-[0.14em] text-paper/45 uppercase [@media(hover:hover)]:block">
            Move through the network — every node you touch sends a signal.
          </p>
        </motion.div>
      </motion.div>

      {/* the hand-off: one signal line runs into the next section */}
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-40 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-flare/60">
        <motion.span style={{ top: handoff }} className="absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-flare shadow-[0_0_18px_4px_rgba(255,91,34,0.7)]" />
      </div>
    </section>
  )
}
