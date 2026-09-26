import { useRef, useState } from 'react'
import { useMotionValue, useReducedMotion } from 'motion/react'
import { feedbackInputs, feedbackLoop } from '../../data/market/lifecycle'
import { DESKTOP, useMediaQuery } from '../../hooks/useMediaQuery'
import { scrollToStep, useActiveIndex, useScrollProgress } from '../../hooks/useScrollProgress'
import { RevealText } from '../motion/RevealText'
import { LoopDiagram, LoopPanel } from './LoopDiagram'
import { LoopList } from './LoopList'
import { ThemeSection } from './ThemeSection'

const N = feedbackLoop.length

// 09 — LIGHT: people and feedback. The real world sits at the centre; users,
// community, experts, data and the market feed the loop from outside.
export function FeedbackLoop() {
  const desktop = useMediaQuery(DESKTOP)
  const reduce = useReducedMotion()
  return desktop && !reduce ? <PinnedLoop /> : <StackedLoop />
}

function Heading() {
  return (
    <>
      <p className="eyebrow text-paper-mute">09 · The feedback loop</p>
      <RevealText
        id="mp-loop-title"
        lines={['Launch is', <span key="e" className="text-volt">not the end.</span>]}
        className="display mt-3 text-huge"
      />
    </>
  )
}

const Center = () => (
  <div className="flex flex-col items-center">
    <span className="font-mono text-[0.6rem] tracking-[0.16em] text-ink/50 uppercase">everything happens in the</span>
    <span className="display mt-1 text-[clamp(1.8rem,3.2vw,3.2rem)] leading-[0.85]">
      Real
      <br />
      world
    </span>
  </div>
)

function PinnedLoop() {
  const ref = useRef(null)
  const progress = useScrollProgress(ref)
  const active = useActiveIndex(progress, N)
  const [hover, setHover] = useState(-1)
  const shown = hover >= 0 ? hover : active

  return (
    <ThemeSection tone="light" id="feedback-loop" labelledBy="mp-loop-title" sectionRef={ref}>
      <div style={{ height: `${N * 75 + 100}vh` }}>
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div className="container-x grid items-center gap-10 pt-16 lg:grid-cols-[1.15fr_0.85fr]">
            <LoopDiagram
              stages={feedbackLoop}
              progress={progress}
              active={active}
              tone="light"
              center={<Center />}
              satellites={feedbackInputs}
              closingLabel="Release again ↻"
              onSelect={(i) => scrollToStep(ref.current, i, N)}
              onHover={setHover}
              className="mx-auto max-w-[min(76svh,42rem)]"
            />
            <div>
              <Heading />
              <div className="mt-10">
                <LoopPanel stage={feedbackLoop[shown]} index={shown} tone="light" eyebrow={hover >= 0 ? 'Preview' : 'Now'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeSection>
  )
}

function StackedLoop() {
  const desktop = useMediaQuery(DESKTOP)
  const complete = useMotionValue(1)
  return (
    <ThemeSection tone="light" id="feedback-loop" labelledBy="mp-loop-title" className="pb-section">
      <div className="container-x pt-16">
        <Heading />
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="What feeds the loop">
          {feedbackInputs.map((f) => (
            <li key={f} className="rounded-full border border-ink/25 px-3 py-1 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              {f} →
            </li>
          ))}
        </ul>
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          {desktop && (
            <LoopDiagram stages={feedbackLoop} progress={complete} active={N} tone="light" center={<Center />} satellites={feedbackInputs} closingLabel="Release again ↻" />
          )}
          <LoopList stages={feedbackLoop} tone="light" returnLabel="Release again" />
        </div>
      </div>
    </ThemeSection>
  )
}
