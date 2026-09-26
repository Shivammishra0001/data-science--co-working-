// Seed-post images drawn in SVG from data (architecture, graph, bars, line).
// Real uploads render as <img>; these stand in for screenshots/diagrams until
// real media exists, and they're crisp, tiny and on-topic.
const INK = '#101015'
const LINE = '#3b3b48'
const TEXT = '#f3f0e8'
const MUTE = '#8f8d9c'
const ACC = ['#ffd33d', '#3fdb94', '#b79cff', '#8196ff', '#ff5b22']

export function DemoFigure({ figure }) {
  const Fig = kinds[figure.kind]
  return Fig ? <Fig {...figure} /> : null
}

function Frame({ children, h = 300 }) {
  return (
    <svg viewBox={`0 0 640 ${h}`} className="block h-auto w-full" aria-hidden="true" style={{ background: INK }}>
      {children}
    </svg>
  )
}

function Architecture({ nodes, loopBack, loopLabel }) {
  const n = nodes.length
  const w = 96
  const gap = (640 - 48 - n * w) / (n - 1)
  const x = (i) => 24 + i * (w + gap)
  const y = 120
  return (
    <Frame h={260}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10z" fill={MUTE} />
        </marker>
      </defs>
      {nodes.slice(0, -1).map((_, i) => (
        <line key={i} x1={x(i) + w} y1={y + 24} x2={x(i + 1) - 4} y2={y + 24} stroke={MUTE} strokeWidth="1.5" markerEnd="url(#arr)" />
      ))}
      {loopBack && (
        <g>
          <path
            d={`M${x(loopBack[0]) + w / 2} ${y + 50} C ${x(loopBack[0]) + w / 2} ${y + 110}, ${x(loopBack[1]) + w / 2} ${y + 110}, ${x(loopBack[1]) + w / 2} ${y + 54}`}
            fill="none"
            stroke={ACC[4]}
            strokeWidth="1.5"
            strokeDasharray="5 5"
            markerEnd="url(#arr)"
          />
          <text x={(x(loopBack[0]) + x(loopBack[1])) / 2 + w / 2} y={y + 104} textAnchor="middle" fill={ACC[4]} fontSize="12" fontFamily="Geist Mono, monospace">
            {loopLabel}
          </text>
        </g>
      )}
      {nodes.map((label, i) => (
        <g key={label}>
          <rect x={x(i)} y={y} width={w} height="48" rx="8" fill="#18181f" stroke={i === 0 || i === n - 1 ? LINE : ACC[i % ACC.length]} strokeWidth="1.5" />
          <text x={x(i) + w / 2} y={y + 29} textAnchor="middle" fill={TEXT} fontSize="13" fontFamily="Geist, sans-serif">
            {label}
          </text>
        </g>
      ))}
      <text x="24" y="40" fill={MUTE} fontSize="12" fontFamily="Geist Mono, monospace">
        architecture.draft.v3
      </text>
    </Frame>
  )
}

function Graph() {
  const q = [320, 150]
  const docs = [[190, 90], [450, 95], [200, 215], [440, 215]]
  const ents = [[80, 60], [70, 170], [110, 270], [560, 50], [590, 160], [560, 270], [320, 275], [320, 40]]
  const links = [[0, 0], [0, 1], [1, 3], [1, 7], [2, 1], [2, 2], [2, 6], [3, 4], [3, 5], [3, 6]]
  return (
    <Frame h={310}>
      {links.map(([d, e], i) => (
        <line key={i} x1={docs[d][0]} y1={docs[d][1]} x2={ents[e][0]} y2={ents[e][1]} stroke={LINE} strokeWidth="1.2" />
      ))}
      {docs.map(([x, y], i) => (
        <line key={`q${i}`} x1={q[0]} y1={q[1]} x2={x} y2={y} stroke={ACC[0]} strokeWidth="1.6" strokeDasharray={i > 1 ? '4 4' : undefined} />
      ))}
      {ents.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill={ACC[2]} opacity="0.85" />
      ))}
      {docs.map(([x, y], i) => (
        <rect key={i} x={x - 16} y={y - 11} width="32" height="22" rx="4" fill="#18181f" stroke={ACC[1]} strokeWidth="1.5" />
      ))}
      <circle cx={q[0]} cy={q[1]} r="14" fill={ACC[0]} />
      <text x={q[0]} y={q[1] + 34} textAnchor="middle" fill={TEXT} fontSize="12" fontFamily="Geist Mono, monospace">
        query
      </text>
      <g fontFamily="Geist Mono, monospace" fontSize="11" fill={MUTE}>
        <rect x="16" y="284" width="10" height="10" fill="#18181f" stroke={ACC[1]} />
        <text x="32" y="293">document (vector hit)</text>
        <circle cx="200" cy="289" r="5" fill={ACC[2]} />
        <text x="212" y="293">entity (graph hop)</text>
      </g>
    </Frame>
  )
}

function Bars({ title, unit, data }) {
  const max = Math.max(...data.map((d) => d[1]))
  const bw = 520 / data.length
  return (
    <Frame h={300}>
      <text x="28" y="38" fill={TEXT} fontSize="14" fontFamily="Geist, sans-serif">
        {title}
      </text>
      <line x1="60" y1="250" x2="612" y2="250" stroke={LINE} />
      {data.map(([label, v], i) => {
        const h = (v / max) * 170
        const x = 76 + i * bw
        return (
          <g key={label}>
            <rect x={x} y={250 - h} width={bw - 36} height={h} rx="4" fill={ACC[i % ACC.length]} opacity="0.9" />
            <text x={x + (bw - 36) / 2} y={242 - h} textAnchor="middle" fill={TEXT} fontSize="12" fontFamily="Geist Mono, monospace">
              {v}
              {unit}
            </text>
            <text x={x + (bw - 36) / 2} y="272" textAnchor="middle" fill={MUTE} fontSize="12" fontFamily="Geist, sans-serif">
              {label}
            </text>
          </g>
        )
      })}
    </Frame>
  )
}

function Line({ title, unit, data }) {
  const vals = data.map((d) => d[1])
  const min = Math.min(...vals) - 5
  const max = Math.max(...vals) + 3
  const px = (i) => 70 + (i / (data.length - 1)) * 530
  const py = (v) => 250 - ((v - min) / (max - min)) * 180
  const d = data.map(([, v], i) => `${i ? 'L' : 'M'}${px(i)} ${py(v)}`).join(' ')
  return (
    <Frame h={300}>
      <text x="28" y="38" fill={TEXT} fontSize="14" fontFamily="Geist, sans-serif">
        {title}
      </text>
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1="60" x2="612" y1={70 + k * 60} y2={70 + k * 60} stroke="#22222b" />
      ))}
      <path d={d} fill="none" stroke={ACC[3]} strokeWidth="2.5" />
      {data.map(([label, v], i) => (
        <g key={label}>
          <circle cx={px(i)} cy={py(v)} r="4.5" fill={ACC[3]} />
          <text x={px(i)} y={py(v) - 12} textAnchor="middle" fill={TEXT} fontSize="11" fontFamily="Geist Mono, monospace">
            {v}
            {unit}
          </text>
          <text x={px(i)} y="276" textAnchor="middle" fill={MUTE} fontSize="11" fontFamily="Geist Mono, monospace">
            {label}
          </text>
        </g>
      ))}
    </Frame>
  )
}

const kinds = { architecture: Architecture, graph: Graph, bars: Bars, line: Line }
