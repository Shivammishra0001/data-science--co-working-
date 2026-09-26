import { useRef, useState } from 'react'
import { useMotionValue, useReducedMotion } from 'motion/react'
import { lifecycle, lifecycleInputs } from '../../data/market/lifecycle'
import { DESKTOP, useMediaQuery } from '../../hooks/useMediaQuery'
import { scrollToStep, useActiveIndex, useScrollProgress } from '../../hooks/useScrollProgress'
import { BrandMark } from '../layout/BrandMark'
import { RevealText } from '../motion/RevealText'
import { LoopDiagram, LoopPanel } from './LoopDiagram'
import { LoopList } from './LoopList'
import { ThemeSection } from './ThemeSection'

const N = lifecycle.length

// 03 — DARK: the system. Pinned; scroll walks the signal around the loop.
export function MarketLifecycle() {
  const desktop = useMediaQuery(DESKTOP)
  const reduce = useReducedMotion()
  return desktop && !reduce ? <PinnedLifecycle /> : <StackedLifecycle />
}

function Heading() {
  return (
    <>
      <p className="eyebrow text-paper/55">03 · The Market Push lifecycle</p>
      <RevealText
        id="mp-lifecycle-title"
        lines={['The real test starts', <span key="b" className="text-flare">after you build it.</span>]}
        className="display mt-3 text-big"
      />
    </>
  )
}

const Center = () => (
  <div className="flex flex-col items-center gap-3">
    <BrandMark withName={false} />
    <span className="display text-[clamp(1.4rem,2.6vw,2.6rem)] leading-[0.85]">
      Market
      <br />
      Push
    </span>
    <span className="font-mono text-[0.6rem] tracking-[0.16em] text-paper/45 uppercase">a loop, not a line</span>
  </div>
)

function PinnedLifecycle() {
  const ref = useRef(null)
  const progress = useScrollProgress(ref)
  const active = useActiveIndex(progress, N)
  const [hover, setHover] = useState(-1)
  const shown = hover >= 0 ? hover : active

  return (
    <ThemeSection tone="dark" id="lifecycle" labelledBy="mp-lifecycle-title" sectionRef={ref}>
      <div style={{ height: `${N * 70 + 100}vh` }}>
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div className="container-x grid items-center gap-10 pt-16 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Heading />
              <div className="mt-10">
                <LoopPanel stage={lifecycle[shown]} index={shown} eyebrow={hover >= 0 ? 'Preview' : 'Now'} />
              </div>
              <p className="mt-6 font-mono text-[0.7rem] tracking-[0.14em] text-paper/40 uppercase">
                Scroll to move the signal · select a stage to jump
              </p>
            </div>
            <LoopDiagram
              stages={lifecycle}
              progress={progress}
              active={active}
              tone="dark"
              center={<Center />}
              corners={lifecycleInputs}
              onSelect={(i) => scrollToStep(ref.current, i, N)}
              onHover={setHover}
              className="mx-auto max-w-[min(80svh,44rem)]"
            />
          </div>
        </div>
      </div>
    </ThemeSection>
  )
}

function StackedLifecycle() {
  const desktop = useMediaQuery(DESKTOP)
  const complete = useMotionValue(1) // reduced motion: the whole loop, fully drawn
  return (
    <ThemeSection tone="dark" id="lifecycle" labelledBy="mp-lifecycle-title" className="pb-section">
      <div className="container-x pt-16">
        <Heading />
        <p className="mt-6 max-w-md text-lg text-paper/70">
          From {lifecycleInputs.in.toLowerCase()} to the {lifecycleInputs.out.toLowerCase()} — and back again. Eight
          stages, one loop.
        </p>
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          {desktop && (
            <LoopDiagram
              stages={lifecycle}
              progress={complete}
              active={N}
              tone="dark"
              center={<Center />}
              corners={lifecycleInputs}
              className="max-w-[40rem]"
            />
          )}
          <LoopList stages={lifecycle} returnLabel="Improve feeds the next idea" />
        </div>
      </div>
    </ThemeSection>
  )
}
