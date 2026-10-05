import { useState } from 'react'
import { AnimatePresence, motion, useTransform } from 'motion/react'
import { accentSolid, accentVar, cx } from '../../utils/accents'

// A living loop: stages sit on a ring, a signal travels the ring with scroll,
// the arc it has covered lights up, and the active stage swells while the next
// one "prepares" (a slow dashed ring). Geometry is in a 1000×1000 viewBox;
// nodes are HTML buttons laid over the SVG at the same coordinates, so they're
// focusable, hoverable and readable.
const C = 500
const R = 330

const polar = (angle, r = R) => [C + Math.cos(angle) * r, C + Math.sin(angle) * r]
const angleOf = (i, n) => -Math.PI / 2 + (i / n) * Math.PI * 2
const pct = (v) => `${v / 10}%`

const tones = {
  dark: {
    track: '#2a2a34',
    arc: '#ff5b22',
    node: 'bg-ink-2 text-paper ring-1 ring-line-strong',
    past: 'bg-ink-3 text-paper ring-1',
    label: 'text-paper',
    labelDim: 'text-paper/40',
    satellite: 'border-line-strong text-paper/70 bg-ink',
    dot: '#ff5b22',
  },
  light: {
    track: '#cfc9b8',
    arc: '#08080b',
    node: 'bg-paper text-ink ring-2 ring-ink/25',
    past: 'bg-paper-2 text-ink ring-2',
    label: 'text-ink',
    labelDim: 'text-ink/40',
    satellite: 'border-ink/25 text-ink/75 bg-paper',
    dot: '#3f5bff',
  },
}

export function LoopDiagram({
  stages,
  progress,
  active,
  tone = 'dark',
  center,
  satellites = [],
  corners,
  closingLabel,
  onSelect,
  onHover,
  className,
}) {
  const n = stages.length
  const t = tones[tone]
  const [hover, setHover] = useState(-1)

  // Signal position in "stage units": arrives at stage i early in its window,
  // and after the last stage runs on home to the first.
  const s = useTransform(progress, (p) => Math.max(0, Math.min(n, p * n - 0.35 + 0.35 * p)))
  const arc = useTransform(s, (v) => v / n)
  const dotX = useTransform(s, (v) => polar(angleOf(v, n))[0])
  const dotY = useTransform(s, (v) => polar(angleOf(v, n))[1])

  // satellites use the gaps between stage labels; gap 0 is kept for the closing label
  if (satellites.length > n - 1) console.warn('LoopDiagram: more satellites than free gaps')

  const setH = (i) => {
    setHover(i)
    onHover?.(i)
  }

  return (
    <div className={cx('relative aspect-square w-full', className)}>
      <svg viewBox="0 0 1000 1000" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <marker id={`chev-${tone}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M2 1 L8 5 L2 9" fill="none" stroke={t.track} strokeWidth="1.6" strokeLinecap="round" />
          </marker>
        </defs>

        {/* satellites feed the loop from outside */}
        {satellites.map((label, i) => {
          const a = angleOf(i + 1.5, n)
          const [x1, y1] = polar(a, 440)
          const [x2, y2] = polar(a, R + 40)
          return <Feed key={label} x1={x1} y1={y1} x2={x2} y2={y2} progress={progress} phase={i / satellites.length} color={t.track} dot={t.dot} />
        })}

        {corners && (
          <>
            <path d={`M70 110 Q 260 60 ${C - 40} ${C - R - 10}`} fill="none" stroke={t.track} strokeWidth="2" strokeDasharray="4 8" markerEnd={`url(#chev-${tone})`} />
            <path d={`M${C + 40} ${C + R + 10} Q 760 960 930 890`} fill="none" stroke={t.track} strokeWidth="2" strokeDasharray="4 8" markerEnd={`url(#chev-${tone})`} />
          </>
        )}

        {/* track + chevrons between stages */}
        <circle cx={C} cy={C} r={R} fill="none" stroke={t.track} strokeWidth="2" />
        {stages.map((_, i) => {
          const a = angleOf(i + 0.5, n)
          const [x, y] = polar(a)
          const deg = (a * 180) / Math.PI + 90
          return (
            <path
              key={i}
              d="M-7 -9 L4 0 L-7 9"
              transform={`translate(${x} ${y}) rotate(${deg})`}
              fill="none"
              stroke={t.track}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )
        })}

        {/* covered arc */}
        <motion.circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke={t.arc}
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength: arc, rotate: -90, originX: '50%', originY: '50%' }}
        />
        {closingLabel && (
          <text x={polar(angleOf(0.5, n), R + 62)[0]} y={polar(angleOf(0.5, n), R + 62)[1]} textAnchor="middle" className="fill-current font-mono text-[18px] tracking-[0.14em] uppercase" opacity="0.55">
            {closingLabel}
          </text>
        )}

        {/* the signal */}
        <motion.circle cx={dotX} cy={dotY} r="22" fill={t.dot} opacity="0.18" />
        <motion.circle cx={dotX} cy={dotY} r="9" fill={t.dot} />
      </svg>

      {/* centre */}
      <div className="absolute inset-[27%] grid place-items-center rounded-full text-center">{center}</div>

      {/* nodes */}
      <ol className="absolute inset-0">
        {stages.map((st, i) => {
          const [x, y] = polar(angleOf(i, n))
          const [lx, ly] = polar(angleOf(i, n), R + 118)
          const isActive = i === active
          const isNext = active < n && i === (active + 1) % n
          const isPast = i < active
          return (
            <li key={st.id}>
              <button
                type="button"
                onClick={() => onSelect?.(i)}
                onPointerEnter={() => setH(i)}
                onPointerLeave={() => setH(-1)}
                onFocus={() => setH(i)}
                onBlur={() => setH(-1)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${String(i + 1).padStart(2, '0')} ${st.label}: ${st.copy}`}
                style={{ left: pct(x), top: pct(y), '--acc': accentVar[st.accent] ?? 'var(--color-flare)' }}
                className={cx(
                  'absolute grid size-[clamp(2.6rem,6.4%,4.4rem)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[clamp(0.6875rem,1.2vw,0.8rem)] font-semibold',
                  'transition-[transform,background-color,box-shadow,color] duration-500 ease-[var(--ease-expo)]',
                  isActive
                    ? cx(accentSolid[st.accent] ?? 'bg-flare text-ink', 'scale-[1.45] shadow-[0_0_0_10px_color-mix(in_srgb,var(--acc)_22%,transparent),0_0_40px_6px_color-mix(in_srgb,var(--acc)_45%,transparent)]')
                    : isPast
                      ? cx(t.past, 'ring-[var(--acc)]')
                      : t.node,
                  hover === i && !isActive && 'scale-125',
                )}
              >
                {isNext && (
                  <span aria-hidden="true" className="absolute -inset-2 animate-[spin_7s_linear_infinite] rounded-full border border-dashed border-[var(--acc)]" />
                )}
                {String(i + 1).padStart(2, '0')}
              </button>
              <span
                aria-hidden="true"
                style={{ left: pct(lx), top: pct(ly) }}
                className={cx(
                  'display pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[clamp(0.95rem,2.1vw,1.9rem)] leading-none whitespace-nowrap transition-colors duration-500',
                  isActive || hover === i ? t.label : t.labelDim,
                )}
              >
                {st.label}
              </span>
            </li>
          )
        })}
      </ol>

      {satellites.map((label, i) => {
        const [x, y] = polar(angleOf(i + 1.5, n), 462)
        return (
          <span
            key={label}
            style={{ left: pct(x), top: pct(y) }}
            className={cx('absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1 font-mono text-[clamp(0.6875rem,1vw,0.72rem)] tracking-[0.14em] whitespace-nowrap uppercase', t.satellite)}
          >
            {label}
          </span>
        )
      })}

      {corners && (
        <>
          <span className={cx('absolute top-[8%] left-0 font-mono text-[0.72rem] tracking-[0.14em] uppercase', t.labelDim)}>{corners.in} →</span>
          <span className={cx('absolute right-0 bottom-[8%] font-mono text-[0.72rem] tracking-[0.14em] uppercase', t.labelDim)}>→ {corners.out}</span>
        </>
      )}
    </div>
  )
}

// Inbound feed: dashed line with a dot riding it toward the loop, driven by scroll.
function Feed({ x1, y1, x2, y2, progress, phase, color, dot }) {
  const t = useTransform(progress, (p) => (p * 3 + phase) % 1)
  const cx = useTransform(t, (v) => x1 + (x2 - x1) * v)
  const cy = useTransform(t, (v) => y1 + (y2 - y1) * v)
  const op = useTransform(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeDasharray="3 9" />
      <motion.circle cx={cx} cy={cy} r="7" fill={dot} style={{ opacity: op }} />
    </g>
  )
}

// Description panel shared by both loops.
export function LoopPanel({ stage, index, tone = 'dark', eyebrow }) {
  return (
    <div aria-live="polite" className="relative min-h-[15rem]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={cx('eyebrow', tone === 'dark' ? 'text-paper/55' : 'text-ink/55')}>
            {eyebrow} · {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="display mt-2 text-[clamp(3.2rem,6.5vw,7rem)] leading-[0.84]">{stage.label}</h3>
          <p className={cx('mt-4 max-w-sm text-xl leading-snug', tone === 'dark' ? 'text-paper/80' : 'text-ink/75')}>
            {stage.copy}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
