import { motion, useReducedMotion, useTransform } from 'motion/react'
import { ACC, appear, clamp01, edgeGeometry, smooth } from '../../../animations/aboutMotion'
import { useSvgTransform } from '../../../hooks/useSvgTransform'
import { cx } from '../../../utils/accents'

// One data-flow engine for every diagram on the About page.
// Everything is a pure function of `progress` (a MotionValue 0–1), so scrolling
// back reverses it exactly. Node: { id, x, y, kind: core|pill|node|dot, label,
// accent, at, until, lp }. Edge: { from, to, at, dur, accent, curve|c1+c2,
// dashed, dim, flow, tag, w }. Frame: { label, x, y, w, h, at }.

const TONES = {
  dark: { text: '#f3f0e8', mute: '#8f8d9c', track: '#2a2a34', node: '#f3f0e8', pill: '#101015', frame: '#3b3b48' },
  light: { text: '#08080b', mute: '#5d5a52', track: '#cfc9b8', node: '#08080b', pill: '#f3f0e8', frame: '#b7b09c' },
}
const color = (accent, tone) =>
  accent === 'paper' || !accent ? TONES[tone].node : accent === 'volt' && tone === 'light' ? ACC.voltDeep : ACC[accent]

const DISPLAY = { fontFamily: 'Archivo, sans-serif', fontStretch: '70%', fontWeight: 800 }
const MONO = { fontFamily: '"Geist Mono", monospace', letterSpacing: '0.12em' }

// `className` replaces the default sizing (h-auto w-full); `fit` sets preserveAspectRatio.
export function NetworkDiagram({ nodes, edges = [], frames = [], progress, width = 1000, height = 700, tone = 'dark', fontSize = 18, ambient = true, className, fit, children }) {
  const reduce = useReducedMotion()
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio={fit} aria-hidden="true" className={cx('block overflow-visible', className ?? 'h-auto w-full')}>
      {frames.map((f) => (
        <FlowFrame key={f.id ?? f.label} frame={f} progress={progress} tone={tone} fontSize={fontSize} />
      ))}
      {edges.map((e, i) => (
        <FlowLine key={`${e.from}-${e.to}-${i}`} edge={e} a={byId[e.from]} b={byId[e.to]} index={i} progress={progress} tone={tone} fontSize={fontSize} ambient={ambient && !reduce} />
      ))}
      {nodes.map((n) => (
        <FlowNode key={n.id} node={n} progress={progress} tone={tone} fontSize={fontSize} />
      ))}
      {children}
    </svg>
  )
}

// A line that draws itself, lights up, carries one signal across, then settles.
export function FlowLine({ edge, a, b, index = 0, progress, tone = 'dark', fontSize = 18, ambient = true }) {
  const t = TONES[tone]
  const geo = edgeGeometry(a, b, edge)
  const dur = edge.dur ?? 0.06
  const at = edge.at ?? 0
  const col = color(edge.accent, tone)

  const drawn = useTransform(progress, (v) => smooth(at, at + dur, v) * (edge.until ? 1 - smooth(edge.until - 0.03, edge.until, v) : 1))
  // bright while it's the newest thing on screen, then settles
  const lineO = useTransform(progress, (v) => {
    const d = smooth(at, at + dur, v)
    const settle = v > at + dur + 0.1 ? (edge.dim ? 0.35 : 0.55) : edge.dim ? 0.6 : 1
    // round caps render a dot at pathLength 0 — stay invisible until drawing starts
    return edge.dashed ? d * settle : d > 0.002 ? settle : 0
  })
  const s = useTransform(progress, (v) => clamp01((v - at) / (dur * 1.5)))
  const sx = useTransform(s, (k) => geo.point(k).x)
  const sy = useTransform(s, (k) => geo.point(k).y)
  const sigO = useTransform(s, (k) => (k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0))
  const haloO = useTransform(sigO, (o) => o * 0.25)
  const flowO = useTransform(drawn, (d) => (d > 0.98 ? 0.9 : 0))
  const tagO = useTransform(drawn, (d) => d * 0.9)
  const mid = geo.point(0.5)

  return (
    <g>
      <motion.path
        d={geo.d}
        fill="none"
        stroke={col}
        strokeWidth={edge.w ?? 1.6}
        strokeLinecap="round"
        strokeDasharray={edge.dashed ? '5 7' : undefined}
        style={edge.dashed ? { opacity: lineO } : { pathLength: drawn, opacity: lineO }}
      />
      <motion.circle cx={sx} cy={sy} r={12} fill={col} style={{ opacity: haloO }} />
      <motion.circle cx={sx} cy={sy} r={4.5} fill={col} style={{ opacity: sigO }} />
      {ambient && edge.flow && (
        <motion.circle r={3} fill={col} style={{ opacity: flowO }}>
          <animateMotion dur={`${2.4 + (index % 4) * 0.5}s`} begin={`${(index % 5) * 0.35}s`} repeatCount="indefinite" path={geo.d} />
        </motion.circle>
      )}
      {edge.tag && (
        <motion.text x={mid.x + 10} y={mid.y - 8} fill={t.mute} style={{ ...MONO, fontSize: fontSize * 0.6, opacity: tagO }}>
          {edge.tag.toUpperCase()}
        </motion.text>
      )}
    </g>
  )
}

// A node that appears (scale + fade) and pulses once as it arrives.
export function FlowNode({ node: n, progress, tone = 'dark', fontSize = 18 }) {
  const t = TONES[tone]
  const at = n.at ?? 0
  const col = color(n.accent, tone)
  const o = useTransform(progress, (v) => appear(v, at, n.until))
  const tr = useTransform(o, (k) => `translate(${n.x} ${n.y}) scale(${0.55 + 0.45 * k})`)
  const gRef = useSvgTransform(tr)
  const base = n.kind === 'core' ? n.r ?? 14 : n.kind === 'pill' ? 26 : n.r ?? 7
  const pr = useTransform(progress, (v) => base + smooth(at, at + 0.06, v) * base * 2.2)
  const po = useTransform(progress, (v) => {
    const k = smooth(at, at + 0.06, v)
    return at > 0 && k > 0 && k < 1 ? (1 - k) * 0.6 : 0
  })

  const fs = n.small ? fontSize * 0.8 : fontSize
  const label = n.label?.toUpperCase()
  const pillW = label ? label.length * fs * 0.56 + fs * 1.7 : 0
  const lp = n.lp ?? 'b'
  const lx = lp === 'l' ? -base - 10 : lp === 'r' ? base + 10 : 0
  const ly = lp === 't' ? -base - 12 : lp === 'b' ? base + fs + 6 : fs * 0.35
  const anchor = lp === 'l' ? 'end' : lp === 'r' ? 'start' : 'middle'

  return (
    <motion.g ref={gRef} style={{ opacity: o }}>
      {n.kind !== 'dot' && <motion.circle r={pr} fill="none" stroke={col} strokeWidth="1.5" style={{ opacity: po }} />}
      {n.kind === 'core' && (
        <>
          <circle r={base * 3} fill={col} opacity="0.1" className={n.pulse ? 'animate-pulse-dot' : undefined} />
          <circle r={base * 1.7} fill={col} opacity="0.22" />
          <circle r={base} fill={col} />
        </>
      )}
      {n.kind === 'pill' && (
        <>
          <rect x={-pillW / 2} y={-fs * 1.05} width={pillW} height={fs * 2.1} rx={fs * 1.05} fill={t.pill} stroke={col} strokeWidth="1.6" />
          <text textAnchor="middle" y={fs * 0.36} fill={t.text} style={{ ...DISPLAY, fontSize: fs }}>
            {label}
          </text>
        </>
      )}
      {n.kind === 'node' && (
        <>
          <circle r={base + 4} fill={col} opacity="0.18" />
          <circle r={base} fill={col} />
        </>
      )}
      {n.kind === 'dot' && <circle r={base} fill={col} opacity="0.85" />}
      {label && n.kind !== 'pill' && (
        <text x={lx} y={ly} textAnchor={anchor} fill={t.text} style={{ ...DISPLAY, fontSize: fs }}>
          {label}
        </text>
      )}
    </motion.g>
  )
}

export function FlowFrame({ frame: f, progress, tone = 'dark', fontSize = 18 }) {
  const t = TONES[tone]
  const o = useTransform(progress, (v) => appear(v, f.at ?? 0, f.until) * 0.9)
  return (
    <motion.g style={{ opacity: o }}>
      <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="28" fill="none" stroke={t.frame} strokeWidth="1.4" strokeDasharray="6 8" />
      <text x={f.x + 24} y={f.y + fontSize * 1.6} fill={t.mute} style={{ ...MONO, fontSize: fontSize * 0.62 }}>
        {f.label.toUpperCase()}
      </text>
    </motion.g>
  )
}
