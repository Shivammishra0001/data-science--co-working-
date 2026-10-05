import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { vision } from '../../data/about/vision'
import { useStoryMode } from '../../hooks/useStoryMode'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'

// 10 — LIGHT → DARK: the vision. Starts in clarity, and as the statements
// widen from "a better space" to "a default behaviour", the page darkens into
// the long-term network that follows.
export function VisionStory() {
  const ref = useRef(null)
  const { reduce } = useStoryMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // the page turns dark once the vision widens beyond the space itself —
  // a timed 700ms transition at a threshold, so it can never rest mid-grey
  const [dark, setDark] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setDark(!reduce && v > 0.5))

  return (
    <section
      ref={ref}
      id="vision"
      aria-labelledby="vision-title"
      data-chapter="future"
      data-theme="light"
      className={`relative py-section transition-colors duration-700 ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}
    >
      <div className="container-x">
        <p className="eyebrow opacity-60">10 · Our vision</p>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-lg" aria-label="What we are not">
          {vision.notJust.map((x, i) => (
            <ScrollReveal as="li" key={x} delay={i * 0.08} preset="fade" className="opacity-60">
              Not just <s className="decoration-flare decoration-2">{x}</s>
            </ScrollReveal>
          ))}
        </ul>

        <RevealText id="vision-title" lines={vision.statements[0]} className="display mt-10 text-huge" />
        <RevealText as="p" lines={vision.statements[1]} className="display mt-6 text-huge text-flare" />
        <p className="mt-10 max-w-xl text-xl leading-relaxed opacity-70">{vision.body}</p>

        <h3 className="mt-[clamp(5rem,12vw,9rem)] font-mono text-sm tracking-[0.14em] uppercase opacity-60">{vision.futuresTitle}</h3>
        <ul className="mt-5 grid gap-x-10 border-t border-current/20 sm:grid-cols-2">
          {vision.futures.map(([who, what], i) => (
            <ScrollReveal as="li" key={who} delay={(i % 2) * 0.08} amount={0.8} className="flex items-baseline justify-between gap-4 border-b border-current/20 py-4">
              <span className="display text-3xl leading-none">{who}</span>
              <span className="text-right text-lg opacity-70">{what}</span>
            </ScrollReveal>
          ))}
        </ul>

      </div>
    </section>
  )
}
