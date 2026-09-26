import { useEffect, useRef } from 'react'
import { useInView } from 'motion/react'
import { BrandMark } from '../layout/BrandMark'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { PillButton } from '../ui/PillButton'
import { NeuralField } from './NeuralField'
import { ThemeSection } from './ThemeSection'

// 12 — DARK: momentum. The network returns, fully connected. When you arrive,
// one signal enters from the edge and the whole field answers:
// one idea → connected community → real users → new signals → next idea.
export function MarketCTA() {
  const ref = useRef(null)
  const api = useRef(null)
  const inView = useInView(ref, { amount: 0.5 })

  useEffect(() => {
    if (!inView) return
    const a = setTimeout(() => api.current?.burstFromEdge(14), 350)
    const b = setTimeout(() => api.current?.burstCenter(12), 1500)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [inView])

  return (
    <ThemeSection tone="dark" id="submit" labelledBy="mp-cta-title" className="overflow-hidden">
      <div ref={ref} className="relative isolate flex min-h-svh flex-col justify-center py-section">
        <NeuralField
          connectivity={1}
          density="high"
          seed={21}
          onReady={(a) => (api.current = a)}
          className="absolute inset-0 -z-10 opacity-90"
          label="The neural network again, now fully connected; a single signal enters and spreads through every node."
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_46%_40%_at_50%_50%,rgba(8,8,11,0.9),transparent)]"
        />

        <div className="container-x pointer-events-none text-center">
          <p className="eyebrow text-flare">12 · Your turn</p>
          <RevealText
            id="mp-cta-title"
            lines={['Your idea has a', <span key="f" className="text-flare">first user somewhere.</span>]}
            className="display mt-4 text-giant"
          />
          <ScrollReveal delay={0.25} className="mt-6 text-xl text-paper/85 [text-shadow:0_1px_14px_rgba(8,8,11,0.95)]">
            <p>We help you find them.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3">
            <PillButton href="#submit-form" variant="flare" size="lg" arrow>
              Put my idea in Market Push
            </PillButton>
            <PillButton href="#discover" variant="outline" size="lg">
              Explore innovations
            </PillButton>
          </ScrollReveal>
          <div className="pointer-events-auto mt-16 flex justify-center">
            <BrandMark />
          </div>
        </div>
      </div>
    </ThemeSection>
  )
}
