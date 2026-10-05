import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useTransform } from 'motion/react'
import { ACC, smooth } from '../../animations/aboutMotion'
import { problem } from '../../data/about/story'
import { useSvgTransform } from '../../hooks/useSvgTransform'
import { StageRail, StoryScene } from './data-flow/StoryScene'

// 03 — DARK: the problem. An idea sets out along a line, meets six obstacles,
// and the line breaks apart. Then the same path, with the environment changed:
// every obstacle is replaced by what was missing, and the line holds.
const W = 1000
const Y = 200
const X = [60, 190, 300, 410, 520, 630, 740, 905] // idea, 6 gates, impact
const drawAt = (i) => 0.04 + i * 0.045 // segment i draws in [drawAt, drawAt+0.045]
const frag = (v) => smooth(0.4, 0.55, v) * (1 - smooth(0.8, 0.92, v))
const heal = (v) => smooth(0.8, 0.94, v)

export function ProblemStory() {
  return (
    <StoryScene tone="dark" id="problem" chapter="problem" labelledBy="problem-title" vh={420}>
      {(p, pinned) => <Scene progress={p} pinned={pinned} />}
    </StoryScene>
  )
}

function Scene({ progress, pinned }) {
  const [beat, setBeat] = useState(pinned ? 0 : problem.beats.length - 1)
  useMotionValueEvent(progress, 'change', (v) => {
    const i = problem.beats.findIndex((b) => v < b.until)
    if (i !== beat && i >= 0) setBeat(i)
  })
  const b = problem.beats[beat]

  return (
    <div className="container-x w-full">
      <p className="eyebrow text-paper/55">03 · The problem</p>
      <div className="mt-3 min-h-[9.5rem] sm:min-h-[8rem]" aria-live="polite">
        {pinned ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={beat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <h2 id="problem-title" className="display text-huge">
                {b.text}
              </h2>
              {b.sub && <p className="mt-3 max-w-2xl text-lg text-paper/70">{b.sub}</p>}
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <h2 id="problem-title" className="display text-huge">
              This isn’t a talent problem. <span className="text-flare">It’s an environment problem.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-paper/70">
              A good idea usually runs into {problem.obstacles.map((o) => o.toLowerCase()).join(', ')}. Put{' '}
              {problem.answers.map((o) => o.toLowerCase()).join(', ')} along the path instead — and the line holds.
            </p>
          </>
        )}
      </div>

      <svg viewBox={`0 0 ${W} 400`} className="mt-8 block h-auto w-full overflow-visible" aria-hidden="true">
        {X.slice(0, -1).map((x, i) => (
          <Segment key={i} i={i} x1={x} x2={X[i + 1]} progress={progress} />
        ))}
        <Endpoint x={X[0]} label="Idea" progress={progress} idea />
        {problem.obstacles.map((o, i) => (
          <Gate key={o} x={X[i + 1]} i={i} obstacle={o} answer={problem.answers[i]} progress={progress} />
        ))}
        <Endpoint x={X[7]} label="Impact" progress={progress} />
        <Signal progress={progress} />
      </svg>
      <p className="sr-only">
        Obstacles along the way: {problem.obstacles.join(', ')}. What the environment puts in their place: {problem.answers.join(', ')}.
      </p>

      {pinned && (
        <div className="mt-8">
          <Rail progress={progress} />
        </div>
      )}
    </div>
  )
}

function Rail({ progress }) {
  const labels = ['Idea sets out', 'Obstacles', 'Line breaks', 'The real cause', 'Reconnected']
  const [a, setA] = useState(0)
  useMotionValueEvent(progress, 'change', (v) => {
    const i = v < 0.36 ? 0 : v < 0.42 ? 1 : v < 0.6 ? 2 : v < 0.84 ? 3 : 4
    if (i !== a) setA(i)
  })
  return <StageRail stages={labels} active={a} />
}

function Segment({ i, x1, x2, progress }) {
  const draw = useTransform(progress, (v) => smooth(drawAt(i), drawAt(i) + 0.045, v))
  const dy = useTransform(progress, (v) => (i % 2 ? 1 : -1) * frag(v) * (18 + i * 5))
  const rot = useTransform(progress, (v) => (i % 2 ? 1 : -1) * frag(v) * 6)
  const op = useTransform(progress, (v) => (smooth(drawAt(i), drawAt(i) + 0.045, v) > 0.002 ? 1 - frag(v) * 0.75 : 0))
  const stroke = useTransform(progress, (v) => (heal(v) > 0.5 ? ACC.mint : frag(v) > 0.3 ? ACC.flare : ACC.paper))
  const tr = useTransform([dy, rot], ([y, r]) => `translate(0 ${y}) rotate(${r} ${(x1 + x2) / 2} ${Y})`)
  const gRef = useSvgTransform(tr)
  return (
    <motion.g ref={gRef} style={{ opacity: op }}>
      <motion.path d={`M${x1 + 14} ${Y} L${x2 - 14} ${Y}`} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" style={{ pathLength: draw }} />
    </motion.g>
  )
}

function Gate({ x, i, obstacle, answer, progress }) {
  const reach = drawAt(i) + 0.045
  const o = useTransform(progress, (v) => smooth(reach - 0.01, reach + 0.02, v))
  const bad = useTransform(progress, (v) => 1 - heal(v))
  const good = useTransform(progress, (v) => heal(v))
  const up = i % 2 === 0
  const ty = up ? Y - 52 : Y + 70
  return (
    <motion.g style={{ opacity: o }}>
      <motion.g style={{ opacity: bad }}>
        <line x1={x - 10} y1={Y - 10} x2={x + 10} y2={Y + 10} stroke={ACC.flare} strokeWidth="3" strokeLinecap="round" />
        <line x1={x + 10} y1={Y - 10} x2={x - 10} y2={Y + 10} stroke={ACC.flare} strokeWidth="3" strokeLinecap="round" />
        <text x={x} y={ty} textAnchor="middle" fill={ACC.flare} style={{ fontFamily: '"Geist Mono", monospace', fontSize: 15, letterSpacing: '0.12em' }}>
          {obstacle.toUpperCase()}
        </text>
      </motion.g>
      <motion.g style={{ opacity: good }}>
        <circle cx={x} cy={Y} r="12" fill={ACC.mint} opacity="0.2" />
        <circle cx={x} cy={Y} r="7" fill={ACC.mint} />
        <text x={x} y={ty} textAnchor="middle" fill={ACC.mint} style={{ fontFamily: 'Archivo, sans-serif', fontStretch: '70%', fontWeight: 800, fontSize: 19 }}>
          {answer.toUpperCase()}
        </text>
      </motion.g>
    </motion.g>
  )
}

function Endpoint({ x, label, progress, idea }) {
  // the idea glows from the start; impact is faint, vanishes as the line
  // breaks, and lights up when it reconnects
  const o = useTransform(progress, (v) => (idea ? 1 : Math.max(0.05, 0.3 - frag(v) * 0.3 + heal(v) * 0.7)))
  const c = idea ? ACC.sun : ACC.mint
  return (
    <motion.g style={{ opacity: o }}>
      <circle cx={x} cy={Y} r="30" fill={c} opacity="0.14" className={idea ? 'animate-pulse-dot' : undefined} />
      <circle cx={x} cy={Y} r="14" fill={c} />
      <text x={x} y={Y + 58} textAnchor="middle" fill="#f3f0e8" style={{ fontFamily: 'Archivo, sans-serif', fontStretch: '70%', fontWeight: 800, fontSize: 22 }}>
        {label.toUpperCase()}
      </text>
    </motion.g>
  )
}

// After the reconnect, one signal runs the whole path.
function Signal({ progress }) {
  const t = useTransform(progress, (v) => smooth(0.86, 0.99, v))
  const x = useTransform(t, (k) => X[0] + (X[7] - X[0]) * k)
  const o = useTransform(t, (k) => (k > 0 && k < 1 ? 1 : 0))
  return <motion.circle cx={x} cy={Y} r="7" fill={ACC.paper} style={{ opacity: o }} />
}
