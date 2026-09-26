import { accentVar } from '../../utils/accents'

// Generative stand-in artwork per project until real screenshots/media exist.
// Pure SVG: crisp at any size, ~1KB each, no network.
export function ProjectVisual({ kind, accent }) {
  const c = accentVar[accent] ?? 'var(--color-paper)'
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" className="size-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="var(--color-ink)" />
      {art[kind]?.(c) ?? art.grid(c)}
    </svg>
  )
}

const seeded = (n) => {
  const x = Math.sin(n * 999) * 10000
  return x - Math.floor(x)
}

const art = {
  graph: (c) => {
    const pts = Array.from({ length: 14 }, (_, i) => [40 + seeded(i + 1) * 320, 30 + seeded(i + 40) * 240])
    return (
      <g>
        {pts.map(([x, y], i) =>
          pts.slice(i + 1, i + 3).map(([x2, y2], j) => (
            <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={c} strokeOpacity="0.35" strokeWidth="1.5" />
          )),
        )}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 10 : 5} fill={i % 4 === 0 ? c : 'var(--color-paper)'} />
        ))}
      </g>
    )
  },
  grid: (c) => (
    <g>
      {Array.from({ length: 10 * 8 }, (_, i) => {
        const x = (i % 10) * 40 + 20
        const y = Math.floor(i / 10) * 40 + 10
        const on = seeded(i + 3) > 0.62
        return <rect key={i} x={x - 12} y={y} width="24" height="24" rx="6" fill={on ? c : 'var(--color-line)'} />
      })}
    </g>
  ),
  wave: (c) => (
    <g fill="none" strokeWidth="3" strokeLinecap="round">
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M0 ${150} ${Array.from({ length: 21 }, (_, k) => {
            const x = k * 20
            const amp = Math.sin((k / 20) * Math.PI) * (20 + i * 9)
            return `L${x} ${150 + Math.sin(k * 0.9 + i * 0.6) * amp}`
          }).join(' ')}`}
          stroke={i === 4 ? c : 'var(--color-paper)'}
          strokeOpacity={i === 4 ? 1 : 0.18}
        />
      ))}
    </g>
  ),
  nodes: (c) => (
    <g>
      {[0, 1, 2].map((tier) => {
        const count = 3 + tier * 2
        return Array.from({ length: count }, (_, i) => {
          const x = 70 + tier * 130
          const y = 150 + (i - (count - 1) / 2) * 42
          return (
            <g key={`${tier}-${i}`}>
              {tier < 2 && (
                <line x1={x} y1={y} x2={x + 130} y2={150 + (i - 1) * 50} stroke="var(--color-paper)" strokeOpacity="0.2" />
              )}
              <circle cx={x} cy={y} r="12" fill={tier === 2 && i === 4 ? c : 'var(--color-ink-3)'} stroke={c} strokeWidth="2" />
            </g>
          )
        })
      })}
    </g>
  ),
  rings: (c) => (
    <g fill="none">
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx="200" cy="150" r={20 + i * 22} stroke={i === 3 ? c : 'var(--color-paper)'} strokeOpacity={i === 3 ? 1 : 0.14} strokeWidth={i === 3 ? 6 : 2} />
      ))}
      <circle cx="200" cy="150" r="10" fill={c} />
    </g>
  ),
  bars: (c) => (
    <g>
      {Array.from({ length: 16 }, (_, i) => {
        const h = 30 + seeded(i + 7) * 190
        return <rect key={i} x={24 + i * 23} y={260 - h} width="14" height={h} rx="7" fill={i === 11 ? c : 'var(--color-line-strong)'} />
      })}
    </g>
  ),
}
