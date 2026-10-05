import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { heroNetwork } from '../../animations/aboutMotion'
import { hero } from '../../data/about/story'
import { useActiveIndex, useScrollProgress } from '../../hooks/useScrollProgress'
import { useStoryMode } from '../../hooks/useStoryMode'
import { cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { NetworkDiagram } from './data-flow/NetworkDiagram'

const desktopNet = heroNetwork({ cx: 660, cy: 360 })
const compactNet = heroNetwork({ cx: 500, cy: 360, dense: false })

// 01 — DARK: curiosity. One point, alone. Scroll, and it starts to connect:
// one idea → people → knowledge → collaboration.
export function AboutHero() {
  const ref = useRef(null)
  const { pinned } = useStoryMode()
  const progress = useScrollProgress(ref)
  const full = useMotionValue(1)
  const p = pinned ? progress : full
  const step = useActiveIndex(p, hero.steps.length)
  const copyO = useTransform(progress, [0.85, 1], [1, 0.25])

  const copy = (
    <div className="container-x relative z-10">
      <p className="eyebrow mb-6 text-paper/60">{hero.eyebrow}</p>
      <RevealText as="h1" id="about-title" lines={hero.title} className="display max-w-[16ch] text-[clamp(2.6rem,6.2vw,6.4rem)] leading-[0.88]" delay={0.1} />
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-7 max-w-md text-lg leading-relaxed text-paper/75">
        {hero.body}
      </motion.p>
      <a href="#why" className="group mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-[0.06em] uppercase ring-2 ring-paper ring-inset transition-colors hover:bg-paper hover:text-ink">
        {hero.cta}
        <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover:translate-y-0.5" />
      </a>
    </div>
  )

  const steps = (
    <ol className="container-x relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.14em] uppercase" aria-label="How it grows">
      {hero.steps.map((s, i) => (
        <li key={s} className={cx('flex items-center gap-3 transition-colors duration-300', i <= step ? 'text-paper' : 'text-paper/30')}>
          {s}
          {i < hero.steps.length - 1 && <span aria-hidden="true">→</span>}
        </li>
      ))}
    </ol>
  )

  if (!pinned) {
    return (
      <section ref={ref} id="top" aria-labelledby="about-title" className="relative isolate overflow-hidden bg-ink pt-28 pb-20">
        {copy}
        <div className="container-x mt-10">
          <NetworkDiagram nodes={compactNet.nodes} edges={compactNet.edges} progress={full} className="mx-auto h-auto w-full max-w-2xl" />
        </div>
        <div className="mt-6">{steps}</div>
      </section>
    )
  }

  return (
    <section ref={ref} id="top" aria-labelledby="about-title" className="relative bg-ink" style={{ height: '180vh' }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <NetworkDiagram nodes={desktopNet.nodes} edges={desktopNet.edges} progress={progress} className="absolute inset-0 size-full" fit="xMaxYMid meet" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_18%_50%,rgba(8,8,11,0.9),transparent)]" />
        </div>
        <motion.div style={{ opacity: copyO }}>{copy}</motion.div>
        <div className="absolute inset-x-0 bottom-8">{steps}</div>
      </div>
    </section>
  )
}
