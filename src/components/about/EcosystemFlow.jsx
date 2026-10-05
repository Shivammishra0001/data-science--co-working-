import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { ACC, smooth } from '../../animations/aboutMotion'
import { ecosystemFlow as F, ecosystemList } from '../../data/about/ecosystem'
import { useStoryMode } from '../../hooks/useStoryMode'
import { LoopList } from '../market-push/LoopList'
import { RevealText } from '../motion/RevealText'
import { ThemeSection } from '../market-push/ThemeSection'
import { NetworkDiagram } from './data-flow/NetworkDiagram'

// 06 — LIGHT: everything connects. Eleven steps on a serpentine path — and at
// FEEDBACK the line swings all the way back to the idea. Build → learn → build again.
const n = F.steps.length
const stepAt = (i) => (i / (n - 1)) * 0.6
const byId = Object.fromEntries(F.steps.map((s) => [s.id, s]))
const nodes = F.steps.map((s, i) => ({ ...s, kind: 'pill', accent: ecosystemList[i].accent, at: i === 0 ? 0 : stepAt(i) }))
const edges = F.steps.slice(0, -1).map((s, i) => ({ from: s.id, to: F.steps[i + 1].id, at: stepAt(i), dur: 0.6 / (n - 1), accent: 'paper', flow: true }))
// the return loop: from FEEDBACK, down and around the left edge, back to IDEA
const L = { A: byId.feedback, B: byId.idea, c1: [450, 640], c2: [-60, 640] }
const loopD = `M${L.A.x} ${L.A.y + 22} C${L.c1[0]} ${L.c1[1]} ${L.c2[0]} ${L.c2[1]} ${-20} 300 S ${160} ${-40} ${L.B.x - 10} ${L.B.y - 24}`

export function EcosystemFlow() {
  const ref = useRef(null)
  const { reduce } = useStoryMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 95%'] })
  const full = useMotionValue(1)
  const p = reduce ? full : scrollYProgress

  return (
    <ThemeSection tone="light" id="connections" labelledBy="flow-title" data-chapter="system" className="pb-section">
      <div className="container-x pt-14">
        <p className="eyebrow text-paper-mute">06 · How it connects</p>
        <RevealText id="flow-title" lines={['Everything connects.']} className="display mt-3 text-huge" />
        <p className="mt-5 max-w-xl text-lg text-ink/70">It isn’t a line from idea to launch. What users do comes back — and becomes the next version.</p>

        <div ref={ref} className="mt-14 hidden px-[4%] md:block">
          <NetworkDiagram nodes={nodes} edges={edges} progress={p} width={F.width} height={F.height} tone="light" fontSize={21}>
            <Loop progress={p} />
          </NetworkDiagram>
        </div>
        <div className="mt-10 md:hidden">
          <LoopList stages={ecosystemList} tone="light" returnLabel="Feedback → back to the idea. Build again." />
        </div>
      </div>
    </ThemeSection>
  )
}

function Loop({ progress }) {
  const draw = useTransform(progress, (v) => smooth(0.62, 0.86, v))
  const labelO = useTransform(progress, (v) => smooth(0.8, 0.9, v))
  const lineO = useTransform(draw, (d) => (d > 0.002 ? 1 : 0))
  const glowO = useTransform(lineO, (o) => o * 0.12)
  return (
    <g>
      <motion.path d={loopD} fill="none" stroke={ACC.flare} strokeWidth="5" strokeLinecap="round" style={{ pathLength: draw, opacity: lineO }} />
      <motion.path d={loopD} fill="none" stroke={ACC.flare} strokeWidth="16" strokeLinecap="round" style={{ pathLength: draw, opacity: glowO }} />
      <motion.g style={{ opacity: labelO }}>
        <text x={-34} y={300} textAnchor="middle" transform="rotate(-90 -34 300)" fill={ACC.flare} style={{ fontFamily: '"Geist Mono", monospace', fontSize: 14, letterSpacing: '0.14em' }}>
          {F.loop.label.toUpperCase()}
        </text>
      </motion.g>
    </g>
  )
}
