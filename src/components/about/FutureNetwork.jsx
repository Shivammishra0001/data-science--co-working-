import { motion, useTransform } from 'motion/react'
import { ACC, appear, futureDots, smooth } from '../../animations/aboutMotion'
import { futureNetwork as F } from '../../data/about/vision'
import { useActiveIndex } from '../../hooks/useScrollProgress'
import { useStoryMode } from '../../hooks/useStoryMode'
import { useSvgTransform } from '../../hooks/useSvgTransform'
import { cx } from '../../utils/accents'
import { NetworkDiagram } from './data-flow/NetworkDiagram'
import { StoryScene } from './data-flow/StoryScene'

// 11 — DARK: the long-term vision (explicitly not current scale). The builder's
// network sits in the centre; then the camera pulls back — local space, city,
// country, a global builder network — each ring filling with other builders.
const S = 1000
const C = S / 2
const inner = [
  { id: 'b', x: C, y: C, kind: 'core', r: 20, accent: 'sun', label: F.center, lp: 'b', at: 0 },
  ...F.around.map((label, i) => {
    const a = (i / F.around.length) * Math.PI * 2 - Math.PI / 2
    return { id: `a${i}`, x: C + Math.cos(a) * 190, y: C + Math.sin(a) * 190, kind: 'node', r: 9, label, lp: Math.cos(a) > 0.3 ? 'r' : Math.cos(a) < -0.3 ? 'l' : Math.sin(a) < 0 ? 't' : 'b', accent: ['mint', 'sun', 'volt', 'iris', 'iris', 'mint', 'flare', 'sun', 'mint'][i], at: 0.03 + i * 0.02 }
  }),
]
const innerEdges = F.around.map((_, i) => ({ from: `a${i}`, to: 'b', at: 0.02 + i * 0.02, dur: 0.05, accent: inner[i + 1].accent, flow: true }))
const rings = [
  { r: 120, at: 0.35, label: 'Local space' },
  { r: 230, at: 0.5, label: 'City' },
  { r: 335, at: 0.65, label: 'Country' },
  { r: 460, at: 0.8, label: 'Global builder network' },
]
const denseDots = futureDots({ cx: C, cy: C, dense: true })
const lightDots = futureDots({ cx: C, cy: C, dense: false })

export function FutureNetwork() {
  return (
    <StoryScene tone="dark" id="future" chapter="future" labelledBy="future-title" vh={420} sheet={false}>
      {(p, pinned) => <Scene progress={p} pinned={pinned} />}
    </StoryScene>
  )
}

function Scene({ progress, pinned }) {
  const { desktop } = useStoryMode()
  const active = useActiveIndex(useTransform(progress, (v) => Math.min(0.999, smooth(0.2, 0.9, v) * 1.02)), F.scales.length)
  const scale = useTransform(progress, (v) => 1 - smooth(0.25, 0.9, v) * 0.72)
  const tr = useTransform(scale, (s) => `translate(${C} ${C}) scale(${s}) translate(${-C} ${-C})`)
  const gRef = useSvgTransform(tr)
  const s = F.scales[pinned ? active : F.scales.length - 1]

  return (
    <div className="container-x grid w-full items-center gap-8 lg:grid-cols-[0.7fr_1.3fr]">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-sun/50 px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.12em] text-sun uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sun" /> {F.badge}
        </p>
        <h2 id="future-title" className="display mt-5 text-huge">
          {F.title[0]} <span className="text-sun">{F.title[1]}</span>
        </h2>
        <div key={s.id} className="animate-fade-in mt-8" aria-live="polite">
          <p className="display text-3xl leading-none">{s.label}</p>
          <p className="mt-2 max-w-xs text-lg text-paper/70">{s.copy}</p>
        </div>
        {pinned && (
          <ol className="mt-8 flex flex-col gap-1.5 font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
            {F.scales.map((x, i) => (
              <li key={x.id} className={cx('transition-colors duration-300', i === active ? 'text-paper' : i < active ? 'text-paper/50' : 'text-paper/25')}>
                {i > 0 && '↓ '}
                {x.label}
              </li>
            ))}
          </ol>
        )}
      </div>

      <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto block h-auto max-h-[82svh] w-full overflow-visible" aria-hidden="true">
        {rings.map((r) => (
          <Ring key={r.label} ring={r} progress={progress} />
        ))}
        {(desktop ? denseDots : lightDots).map((d) => (
          <Dot key={d.id} dot={d} progress={progress} />
        ))}
        <g ref={gRef}>
          <NetworkDiagram nodes={inner} edges={innerEdges} progress={progress} width={S} height={S} fontSize={24} className="overflow-visible" />
        </g>
      </svg>
      <p className="sr-only">
        A long-term vision, not current scale: the builder connected to {F.around.join(', ')}, then rings for local space, city, country and a global builder network.
      </p>
    </div>
  )
}

function Ring({ ring, progress }) {
  const o = useTransform(progress, (v) => appear(v, ring.at))
  const draw = useTransform(progress, (v) => smooth(ring.at - 0.02, ring.at + 0.08, v))
  return (
    <motion.g style={{ opacity: o }}>
      <motion.circle cx={C} cy={C} r={ring.r} fill="none" stroke="#3b3b48" strokeWidth="1.5" style={{ pathLength: draw, rotate: -90, originX: '50%', originY: '50%' }} />
      <text x={C} y={C - ring.r - 12} textAnchor="middle" fill="#8f8d9c" style={{ fontFamily: '"Geist Mono", monospace', fontSize: 17, letterSpacing: '0.14em' }}>
        {ring.label.toUpperCase()}
      </text>
    </motion.g>
  )
}

function Dot({ dot, progress }) {
  const o = useTransform(progress, (v) => appear(v, dot.at) * 0.85)
  return <motion.circle cx={dot.x} cy={dot.y} r={dot.r} fill={ACC[dot.accent]} style={{ opacity: o }} />
}
