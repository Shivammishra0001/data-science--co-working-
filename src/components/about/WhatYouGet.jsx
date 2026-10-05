import { benefits } from '../../data/about/benefits'
import { ACC } from '../../animations/aboutMotion'
import { useActiveIndex } from '../../hooks/useScrollProgress'
import { cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { StoryScene } from './data-flow/StoryScene'

// 08 — LIGHT: what you get. You at the centre; six layers form a ring around
// you, one segment activating per step of scroll.
const L = benefits.layers
const N = L.length
const S = 600
const C = S / 2
const R0 = 150
const R1 = 215
const rad = (d) => (d * Math.PI) / 180
const pt = (r, deg) => [C + Math.cos(rad(deg)) * r, C + Math.sin(rad(deg)) * r]
const col = (a) => (a === 'volt' ? ACC.voltDeep : ACC[a])

function arc(i, gap = 2.5) {
  const a0 = -90 + (360 / N) * i + gap
  const a1 = -90 + (360 / N) * (i + 1) - gap
  const [x0, y0] = pt(R1, a0)
  const [x1, y1] = pt(R1, a1)
  const [x2, y2] = pt(R0, a1)
  const [x3, y3] = pt(R0, a0)
  return `M${x0} ${y0} A${R1} ${R1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R0} ${R0} 0 0 0 ${x3} ${y3} Z`
}

export function WhatYouGet() {
  return (
    <StoryScene tone="light" id="what-you-get" chapter="build" labelledBy="get-title" vh={360} fallback={() => <Static />}>
      {(p) => <Pinned progress={p} />}
    </StoryScene>
  )
}

function Heading() {
  return (
    <>
      <p className="eyebrow text-paper-mute">08 · What you get</p>
      <RevealText id="get-title" lines={benefits.title} className="display mt-3 text-huge" />
    </>
  )
}

function Ring({ active }) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto block h-auto w-[84%] max-w-[34rem] overflow-visible sm:w-full" aria-hidden="true">
      <circle cx={C} cy={C} r={R1 + 40} fill="none" stroke="#cfc9b8" strokeDasharray="3 9" />
      {L.map((l, i) => {
        const on = i <= active
        const cur = i === active
        const mid = -90 + (360 / N) * (i + 0.5)
        const [dx, dy] = pt(cur ? 10 : 0, mid).map((v) => v - C)
        const [lx, ly] = pt(R1 + 62, mid)
        const [sx, sy] = pt(R0, mid)
        return (
          <g key={l.id}>
            <line x1={C} y1={C} x2={sx} y2={sy} stroke={col(l.accent)} strokeWidth="1.5" strokeDasharray="4 6" style={{ opacity: on ? 0.7 : 0, transition: 'opacity 400ms' }} />
            <path
              d={arc(i)}
              transform={`translate(${dx} ${dy})`}
              fill={on ? col(l.accent) : '#e6e2d6'}
              stroke={cur ? '#08080b' : 'none'}
              strokeWidth="2"
              style={{ transition: 'fill 400ms, transform 400ms' }}
            />
            <text x={lx} y={ly + 7} textAnchor="middle" fill={on ? '#08080b' : '#8a8577'} style={{ fontFamily: 'Archivo, sans-serif', fontStretch: '70%', fontWeight: 800, fontSize: 22, transition: 'fill 400ms' }}>
              {l.label.toUpperCase()}
            </text>
          </g>
        )
      })}
      <circle cx={C} cy={C} r={R0 - 30} fill="#08080b" />
      <text x={C} y={C + 4} textAnchor="middle" fill="#f3f0e8" style={{ fontFamily: 'Archivo, sans-serif', fontStretch: '70%', fontWeight: 800, fontSize: 52 }}>
        {benefits.center.toUpperCase()}
      </text>
      <text x={C} y={C + 32} textAnchor="middle" fill="#8f8d9c" style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12, letterSpacing: '0.14em' }}>
        THE BUILDER
      </text>
    </svg>
  )
}

function Pinned({ progress }) {
  const active = useActiveIndex(progress, N)
  return (
    <div className="container-x grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <Heading />
        <ol className="mt-8">
          {L.map((l, i) => (
            <li key={l.id} aria-current={i === active ? 'step' : undefined} className={cx('border-t border-ink/15 py-3 transition-opacity duration-300', i === active ? 'opacity-100' : i < active ? 'opacity-55' : 'opacity-30')}>
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink/50">0{i + 1}</span>
                <span className="display text-2xl leading-none">{l.label}</span>
              </p>
              {i === active && <p className="animate-fade-in mt-1.5 pl-8 text-ink/70">{l.copy}</p>}
            </li>
          ))}
        </ol>
      </div>
      <Ring active={active} />
    </div>
  )
}

function Static() {
  return (
    <div className="container-x grid items-center gap-12 lg:grid-cols-2">
      <div>
        <Heading />
        <ol className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
          {L.map((l, i) => (
            <li key={l.id} className="border-t border-ink/15 py-3">
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink/50">0{i + 1}</span>
                <span className="display text-2xl leading-none">{l.label}</span>
              </p>
              <p className="mt-1.5 pl-8 text-ink/70">{l.copy}</p>
            </li>
          ))}
        </ol>
      </div>
      <Ring active={N - 1} />
    </div>
  )
}
