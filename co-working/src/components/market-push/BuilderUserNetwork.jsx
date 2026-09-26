import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { accentSolid, cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { ThemeSection } from './ThemeSection'

// Ecosystem graph (viewBox 800 × 920). Each link draws in with scroll, a signal
// rides it, and the node it feeds lights up on arrival. The return path closes
// the whole Market Push idea: signals become the next build.
const nodes = {
  builders: { x: 400, y: 70, label: 'Builders', note: 'People with an idea and the skills to try it.', accent: 'sun' },
  product: { x: 400, y: 260, label: 'Product', note: 'The thing they put out there.', accent: 'flare' },
  community: { x: 180, y: 470, label: 'Community', note: 'Peers, experts, early believers.', accent: 'iris' },
  users: { x: 620, y: 470, label: 'Users', note: 'Strangers with a real need.', accent: 'mint' },
  signals: { x: 400, y: 680, label: 'Signals', note: 'What everyone does, not just says.', accent: 'volt' },
  next: { x: 400, y: 860, label: 'Next build', note: 'Better, because someone answered.', accent: 'sun' },
}
// [from, to, start, end] — the window of progress in which each link draws
const links = [
  ['builders', 'product', 0.0, 0.16],
  ['product', 'community', 0.18, 0.34],
  ['product', 'users', 0.18, 0.34],
  ['community', 'signals', 0.36, 0.52],
  ['users', 'signals', 0.36, 0.52],
  ['signals', 'next', 0.54, 0.68],
]
const RETURN = { start: 0.7, end: 0.95 } // next build → builders, around the left
const returnPath = `M${nodes.next.x - 60} ${nodes.next.y} C 20 860, 20 70, ${nodes.builders.x - 70} ${nodes.builders.y}`

const arrivals = { builders: RETURN.end, product: 0.16, community: 0.34, users: 0.34, signals: 0.52, next: 0.68 }

export function BuilderUserNetwork() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 70%'] })

  return (
    <ThemeSection tone="dark" id="builders-users" labelledBy="mp-meet-title" className="pb-section">
      <div className="container-x grid items-center gap-12 pt-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-paper/55">10 · Builders + users</p>
          <RevealText
            id="mp-meet-title"
            lines={['The moment', <span key="m" className="text-sun">builders meet users.</span>]}
            className="display mt-3 text-huge"
          />
          <p className="mt-6 max-w-md text-lg text-paper/70">
            A product sits between the people who make it and the people who need it. Market Push is the wiring: the
            community around it, the signals that come back, and the next build they shape.
          </p>
          {/* text equivalent of the graph */}
          <ol className="sr-only">
            <li>Builders make a product.</li>
            <li>The product reaches a community and users.</li>
            <li>Both send signals back.</li>
            <li>Signals shape the next build, and the loop returns to the builders.</li>
          </ol>
        </div>

        <div ref={ref} className="relative mx-auto aspect-[800/920] w-full max-w-[40rem]" aria-hidden="true">
          <svg viewBox="0 0 800 920" className="absolute inset-0 size-full overflow-visible">
            <ReturnLink progress={scrollYProgress} />
            {links.map(([a, b, s, e]) => (
              <Link key={`${a}-${b}`} from={nodes[a]} to={nodes[b]} start={s} end={e} progress={scrollYProgress} />
            ))}
          </svg>
          {Object.entries(nodes).map(([id, n]) => (
            <Node key={id} node={n} arrive={arrivals[id]} progress={scrollYProgress} first={id === 'builders'} />
          ))}
        </div>
      </div>
    </ThemeSection>
  )
}

function Link({ from, to, start, end, progress }) {
  const draw = useTransform(progress, [start, end], [0, 1])
  const t = useTransform(progress, [start, end, end + 0.04], [0, 1, 1])
  const x = useTransform(t, (v) => from.x + (to.x - from.x) * v)
  const y = useTransform(t, (v) => from.y + (to.y - from.y) * v)
  const dotO = useTransform(progress, [start, start + 0.01, end, end + 0.03], [0, 1, 1, 0])
  const haloO = useTransform(dotO, (o) => o * 0.25)
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#2a2a34" strokeWidth="2" />
      <motion.line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#f3f0e8" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: draw }} />
      <motion.circle cx={x} cy={y} r="18" fill="#ffd33d" style={{ opacity: haloO }} />
      <motion.circle cx={x} cy={y} r="6.5" fill="#ffd33d" style={{ opacity: dotO }} />
    </g>
  )
}

function ReturnLink({ progress }) {
  const draw = useTransform(progress, [RETURN.start, RETURN.end], [0, 1])
  return (
    <g>
      <path d={returnPath} fill="none" stroke="#2a2a34" strokeWidth="2" strokeDasharray="4 10" />
      <motion.path d={returnPath} fill="none" stroke="#ffd33d" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: draw }} />
      <text x="36" y="470" fill="#8f8d9c" className="font-mono text-[15px] tracking-[0.14em] uppercase" transform="rotate(-90 36 470)" textAnchor="middle">
        and again
      </text>
    </g>
  )
}

function Node({ node, arrive, progress, first }) {
  // builders are lit from the start and re-energised when the loop returns
  const lit = useTransform(progress, [arrive - 0.02, arrive + 0.01], [first ? 0.6 : 0, 1])
  const scale = useTransform(lit, [0, 1], [0.92, 1])
  const color = useTransform(lit, [0, 0.6], ['#f3f0e8', node.accent === 'volt' ? '#ffffff' : '#08080b'])
  return (
    <motion.div
      style={{ left: `${(node.x / 800) * 100}%`, top: `${(node.y / 920) * 100}%`, scale }}
      className="absolute w-max max-w-[11rem] -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <span className="relative inline-flex overflow-hidden rounded-full bg-ink-2 ring-1 ring-line-strong">
        <motion.span style={{ opacity: lit }} className={cx('absolute inset-0', accentSolid[node.accent])} />
        <motion.span
          style={{ color }}
          className="display relative px-4 pt-1.5 pb-1 text-[clamp(1rem,2.3vw,1.7rem)] leading-none whitespace-nowrap"
        >
          {node.label}
        </motion.span>
      </span>
      <span className="mt-1.5 hidden rounded bg-ink px-1.5 text-xs leading-snug text-paper/55 sm:inline-block">{node.note}</span>
    </motion.div>
  )
}
