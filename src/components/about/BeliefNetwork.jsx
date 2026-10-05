import { useRef } from 'react'
import { useMotionValue, useScroll } from 'motion/react'
import { belief } from '../../data/about/story'
import { useStoryMode } from '../../hooks/useStoryMode'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { ThemeSection } from '../market-push/ThemeSection'
import { NetworkDiagram } from './data-flow/NetworkDiagram'

// 04 — LIGHT: the belief. One builder in the middle; each skill connects as
// you scroll past. Scrubbed (not pinned) — the section just reads downward.
const S = 640
const C = { x: S / 2, y: S / 2 }
const nodes = [
  { id: 'b', x: C.x, y: C.y, kind: 'core', r: 18, accent: 'sun', label: belief.center, lp: 'b', at: 0 },
  ...belief.skills.map((s, i) => {
    const a = (i / belief.skills.length) * Math.PI * 2 - Math.PI / 2
    return { id: `s${i}`, x: C.x + Math.cos(a) * 225, y: C.y + Math.sin(a) * 225, kind: 'pill', label: s.label, accent: s.accent, at: 0.12 + i * 0.09 }
  }),
]
const edges = belief.skills.flatMap((s, i) => [
  { from: `s${i}`, to: 'b', at: 0.1 + i * 0.09, dur: 0.07, accent: s.accent, flow: true },
  // neighbours start talking to each other late: perspectives cross
  ...(i % 2 === 0 ? [{ from: `s${i}`, to: `s${(i + 3) % 8}`, at: 0.86 + i * 0.012, dur: 0.05, accent: 'paper', dim: true, curve: 0.12 }] : []),
])

export function BeliefNetwork() {
  const ref = useRef(null)
  const { reduce } = useStoryMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 40%'] })
  const full = useMotionValue(1)

  return (
    <ThemeSection tone="light" id="belief" labelledBy="belief-title" data-chapter="belief" className="pb-section">
      <div className="container-x grid items-center gap-12 pt-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-paper-mute">04 · What we believe</p>
          <RevealText id="belief-title" lines={belief.title} className="display mt-3 text-huge" />
          <div className="mt-12 border-t-2 border-ink pt-6">
            <RevealText as="p" lines={belief.message} className="display text-big text-flare" />
            <ul className="mt-6 flex flex-col gap-1 text-xl text-ink/75">
              {belief.lines.map((l, i) => (
                <ScrollReveal as="li" key={l} delay={i * 0.12} preset="fade" amount={1} className={i === belief.lines.length - 1 ? 'font-semibold text-ink' : undefined}>
                  {l}
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>
        <div ref={ref}>
          <NetworkDiagram nodes={nodes} edges={edges} progress={reduce ? full : scrollYProgress} width={S} height={S} tone="light" fontSize={20} className="mx-auto h-auto w-full max-w-[36rem]" />
          <p className="sr-only">
            A network: the builder in the centre, connected to {belief.skills.map((s) => s.label).join(', ')}.
          </p>
        </div>
      </div>
    </ThemeSection>
  )
}
