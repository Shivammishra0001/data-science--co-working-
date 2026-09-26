import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { projects } from '../../data/projects'
import { useActiveIndex, useScrollProgress } from '../../hooks/useScrollProgress'
import { cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { ProjectCard } from '../projects/ProjectCard'
import { ThemeSection } from './ThemeSection'

// idea → collaborator → prototype → users → signal → a real project card.
const steps = [
  { id: 'idea', label: 'Idea', note: 'One point of light. Nobody else knows yet.' },
  { id: 'collaborator', label: 'Collaborator', note: 'Someone else sees it too.' },
  { id: 'prototype', label: 'Prototype', note: 'A small network: people, code, a first version.' },
  { id: 'user', label: 'Users', note: 'Strangers arrive. Some stay.' },
  { id: 'signal', label: 'Signal', note: 'Every visit, click and return sends something back.' },
  { id: 'project', label: 'Project', note: 'Now it has a name, a stage and builders.' },
]

// Scene layout (viewBox 1000 × 700). `a` = progress at which the point appears.
const CX = 500
const CY = 350
const seeded = (n) => {
  const x = Math.sin(n * 7919) * 10000
  return x - Math.floor(x)
}
const points = [
  { x: CX, y: CY, a: 0, r: 11, c: '#ff5b22' },
  { x: 650, y: 290, a: 0.16, r: 8, c: '#ffd33d' },
  ...[
    [560, 440],
    [420, 270],
    [700, 420],
    [380, 420],
    [540, 210],
  ].map(([x, y], i) => ({ x, y, a: 0.31 + i * 0.015, r: 6, c: ['#b79cff', '#3fdb94', '#3f5bff', '#ffd33d', '#b79cff'][i] })),
  ...Array.from({ length: 18 }, (_, i) => {
    const ang = (i / 18) * Math.PI * 2 + seeded(i) * 0.4
    const rad = 250 + seeded(i + 30) * 90
    return { x: CX + Math.cos(ang) * rad * 1.35, y: CY + Math.sin(ang) * rad * 0.82, a: 0.47 + (i / 18) * 0.1, r: 3.5, c: '#08080b', user: true }
  }),
]
const edges = [
  [0, 1, 0.19],
  [0, 2, 0.34], [1, 4, 0.35], [0, 3, 0.35], [3, 5, 0.36], [2, 5, 0.37], [1, 6, 0.37], [6, 3, 0.38], [2, 4, 0.38],
  ...points.map((p, i) => [i, [2, 3, 4, 5, 6][i % 5], p.a + 0.01]).filter((_, i) => points[i].user),
]

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const at = (i, p) => {
  const pt = points[i]
  const c = smooth(0.8, 0.9, p) // converge into the card
  return {
    x: pt.x + (CX - pt.x) * c,
    y: pt.y + (CY - pt.y) * c,
    o: smooth(pt.a - 0.035, pt.a, p) * (1 - smooth(0.85, 0.9, p)),
  }
}

export function IdeaSignalSection() {
  const reduce = useReducedMotion()
  return reduce ? <StaticIdeaSignal /> : <PinnedIdeaSignal />
}

function Heading() {
  return (
    <>
      <p className="eyebrow text-paper-mute">04 · Idea → signal</p>
      <RevealText
        id="mp-signal-title"
        lines={['An idea is just a signal', <span key="u" className="text-flare">until someone responds.</span>]}
        className="display mt-3 text-big"
      />
    </>
  )
}

function PinnedIdeaSignal() {
  const ref = useRef(null)
  const progress = useScrollProgress(ref)
  const active = useActiveIndex(progress, steps.length)

  return (
    <ThemeSection tone="light" id="idea-signal" labelledBy="mp-signal-title" sectionRef={ref}>
      <div className="h-[420vh] lg:h-[520vh]">
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-24 lg:justify-center lg:pt-16">
          <div className="container-x grid flex-1 grid-cols-[minmax(0,1fr)] content-start items-center gap-6 lg:content-center lg:flex-none lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
            <div>
              <Heading />
              <Stepper active={active} />
            </div>
            <Scene progress={progress} />
          </div>
        </div>
      </div>
    </ThemeSection>
  )
}

function StaticIdeaSignal() {
  const network = useMotionValue(0.72)
  return (
    <ThemeSection tone="light" id="idea-signal" labelledBy="mp-signal-title" className="pb-section">
      <div className="container-x grid gap-10 pt-16 lg:grid-cols-2">
        <div>
          <Heading />
          <Stepper active={steps.length - 1} all />
        </div>
        <div>
          <Scene progress={network} showCard={false} />
          <div className="mt-6 flex justify-center">
            <ProjectCard project={projects[0]} />
          </div>
        </div>
      </div>
    </ThemeSection>
  )
}

function Stepper({ active, all = false }) {
  const listRef = useRef(null)
  // mobile: the steps are a horizontal row — keep the active one in view
  // (scrolls only the row, never the page)
  useEffect(() => {
    const list = listRef.current
    const item = list?.children[active]
    if (!list || !item || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: item.offsetLeft - 16, behavior: 'smooth' })
  }, [active])
  return (
    <ol ref={listRef} className="no-scrollbar relative mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:gap-0 lg:overflow-visible">
      {steps.map((s, i) => {
        const on = all || i === active
        const done = i < active
        return (
          <li
            key={s.id}
            aria-current={i === active ? 'step' : undefined}
            className={cx(
              'shrink-0 rounded-full border px-3 py-1.5 transition-colors duration-500 lg:grid lg:grid-cols-[2.5rem_1fr] lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-3',
              on ? 'border-ink bg-ink text-paper lg:bg-transparent lg:text-ink' : done ? 'border-ink/30 text-ink/60' : 'border-ink/15 text-ink/35',
              'lg:border-ink/15',
            )}
          >
            <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
            <span className="ml-2 lg:ml-0">
              <span className="display text-base lg:text-2xl lg:leading-none">{s.label}</span>
              <span className={cx('hidden text-sm lg:mt-1 lg:block', on ? 'text-ink/70' : 'text-ink/35')}>{s.note}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function Scene({ progress, showCard = true }) {
  const card = useTransform(progress, [0.86, 0.95], [0, 1])
  const cardScale = useTransform(progress, [0.86, 0.97], [0.6, 1])
  const glow = useTransform(progress, [0, 0.1, 0.8, 0.88], [0.2, 1, 1, 0])
  const glowO = useTransform(glow, (g) => g * 0.14)
  const cardVis = useTransform(card, (v) => (v < 0.01 ? 'hidden' : 'visible'))
  return (
    <div className="relative aspect-[10/7] w-full">
      <svg viewBox="0 0 1000 700" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        <motion.circle cx={CX} cy={CY} r="60" fill="#ff5b22" style={{ opacity: glowO }} />
        {edges.map(([a, b, appear], k) => (
          <Edge key={k} a={a} b={b} appear={appear} progress={progress} />
        ))}
        {points.map((_, i) => (
          <Point key={i} i={i} progress={progress} />
        ))}
      </svg>
      <p className="sr-only">
        A single point connects to a collaborator, grows into a small prototype network, gathers users who send signals
        back, and finally becomes a project card.
      </p>
      {showCard && (
        <motion.div
          style={{ opacity: card, scale: cardScale, visibility: cardVis }}
          className="absolute inset-0 grid place-items-center"
        >
          <div className="origin-center max-lg:scale-[0.8]">
            <ProjectCard project={projects[0]} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

function Point({ i, progress }) {
  const pt = points[i]
  const x = useTransform(progress, (p) => at(i, p).x)
  const y = useTransform(progress, (p) => at(i, p).y)
  const o = useTransform(progress, (p) => at(i, p).o)
  // signal phase: user points ping back toward the network
  const ping = useTransform(progress, (p) => (pt.user ? smooth(0.62, 0.64, p) * (1 - smooth(0.8, 0.84, p)) : 0))
  const pingR = useTransform(progress, (p) => pt.r + 6 + ((p * 40 + i * 0.37) % 1) * 22)
  const pingO = useTransform([ping, progress], ([g, p]) => g * (1 - ((p * 40 + i * 0.37) % 1)) * 0.6)
  return (
    <g>
      <motion.circle cx={x} cy={y} r={pingR} fill="none" stroke="#ff5b22" strokeWidth="1.5" style={{ opacity: pingO }} />
      <motion.circle cx={x} cy={y} r={pt.r} fill={pt.c} style={{ opacity: o }} />
    </g>
  )
}

function Edge({ a, b, appear, progress }) {
  const x1 = useTransform(progress, (p) => at(a, p).x)
  const y1 = useTransform(progress, (p) => at(a, p).y)
  const x2 = useTransform(progress, (p) => at(b, p).x)
  const y2 = useTransform(progress, (p) => at(b, p).y)
  const draw = useTransform(progress, (p) => smooth(appear - 0.02, appear + 0.03, p))
  const o = useTransform(progress, (p) => Math.min(at(a, p).o, at(b, p).o))
  // during the signal phase edges brighten toward the accent
  const stroke = useTransform(progress, [0.6, 0.66, 0.8], ['#08080b', '#ff5b22', '#ff5b22'])
  const lineO = useTransform(o, (v) => v * 0.55)
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ pathLength: draw, opacity: lineO }}
    />
  )
}
