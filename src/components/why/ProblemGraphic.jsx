// Small line diagrams, one per problem card — each draws the problem itself.
// Ink on the card's accent colour; a little motion on card hover/focus.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
const spin = '[transform-box:fill-box] origin-center transition-transform duration-700 ease-[var(--ease-expo)]'

// No idea where to start — a starting point, arrows heading everywhere
function Scatter() {
  const arrows = [
    [100, 56, 46, 24],
    [100, 56, 160, 20],
    [100, 56, 168, 88],
    [100, 56, 36, 92],
    [100, 56, 100, 104],
  ]
  return (
    <g>
      {arrows.map(([x1, y1, x2, y2], i) => (
        <g key={i} className={`${spin} group-hover:scale-110`}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} {...S} strokeDasharray="4 6" opacity="0.55" />
          <circle cx={x2} cy={y2} r="4" fill="currentColor" opacity="0.55" />
        </g>
      ))}
      <circle cx="100" cy="56" r="15" fill="currentColor" />
      <text x="100" y="62" textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--card)" style={{ fontFamily: 'Archivo, sans-serif' }}>
        ?
      </text>
    </g>
  )
}

// Thinking a lot, never starting — a loop that goes round and round
function Loop() {
  return (
    <g>
      <g className={`${spin} group-hover:rotate-[200deg]`}>
        <path d="M100 18 A38 38 0 1 1 63 64" {...S} strokeWidth="3" />
        <path d="M55 52 L63 65 L76 58" {...S} strokeWidth="3" />
      </g>
      <path d="M100 26 A30 30 0 0 1 100 86" {...S} strokeDasharray="3 6" opacity="0.4" />
      <circle cx="100" cy="56" r="9" fill="currentColor" />
      <line x1="150" y1="56" x2="186" y2="56" {...S} strokeDasharray="3 6" opacity="0.35" />
      <circle cx="190" cy="56" r="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    </g>
  )
}

// Learning alone — one point, far from the connected group
function Alone() {
  const group = [
    [140, 34],
    [176, 44],
    [150, 80],
    [184, 86],
  ]
  return (
    <g>
      <g opacity="0.35">
        {[[0, 1], [0, 2], [1, 3], [2, 3], [1, 2]].map(([a, b], i) => (
          <line key={i} x1={group[a][0]} y1={group[a][1]} x2={group[b][0]} y2={group[b][1]} {...S} strokeWidth="2" />
        ))}
        {group.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="currentColor" />
        ))}
      </g>
      <circle cx="38" cy="58" r="12" fill="currentColor" className={`${spin} group-hover:translate-x-3`} />
      <line x1="60" y1="58" x2="118" y2="58" {...S} strokeDasharray="2 7" opacity="0.5" />
    </g>
  )
}

// No exposure to the real market — work boxed in, users outside, path blocked
function Walled() {
  return (
    <g>
      <rect x="14" y="20" width="84" height="72" rx="14" {...S} />
      <circle cx="56" cy="56" r="11" fill="currentColor" />
      <line x1="70" y1="56" x2="96" y2="56" {...S} />
      <g className={`${spin} group-hover:rotate-90`}>
        <path d="M104 46 L122 64 M122 46 L104 64" {...S} strokeWidth="3.5" />
      </g>
      {[
        [150, 26],
        [178, 40],
        [158, 66],
        [186, 80],
        [142, 94],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5.5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      ))}
    </g>
  )
}

const graphics = { scatter: Scatter, loop: Loop, alone: Alone, walled: Walled }

export function ProblemGraphic({ kind, className }) {
  const G = graphics[kind]
  if (!G) return null
  return (
    <svg viewBox="0 0 200 112" aria-hidden="true" className={className}>
      <G />
    </svg>
  )
}
