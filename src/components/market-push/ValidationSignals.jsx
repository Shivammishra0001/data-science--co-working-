import { useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'motion/react'
import { behaviourSignals, validationQuestions } from '../../data/market/lifecycle'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { accentSolid, accentText, cx } from '../../utils/accents'
import { RevealGroup, RevealItem } from '../motion/ScrollReveal'
import { ThemeSection } from './ThemeSection'

// 05 — DARK: complexity. The wrong question gets struck out by scroll,
// then the right ones arrive one at a time. Behaviour signals follow.
export function ValidationSignals() {
  const reduce = useReducedMotion()
  return (
    <ThemeSection tone="dark" id="validation" labelledBy="mp-validation-title">
      {reduce ? <StaticQuestions /> : <PinnedQuestions />}
      <SignalPanel />
    </ThemeSection>
  )
}

function PinnedQuestions() {
  const ref = useRef(null)
  const progress = useScrollProgress(ref)
  const strike = useTransform(progress, [0.08, 0.2], [0, 1])
  const wrongO = useTransform(progress, [0.18, 0.3], [1, 0.25])
  const askO = useTransform(progress, [0.22, 0.3], [0, 1])
  const askY = useTransform(progress, [0.22, 0.3], [30, 0])

  return (
    <div ref={ref} className="h-[210vh] lg:h-[270vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="container-x grid w-full gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-paper/55">05 · Validation</p>
            <motion.h2 id="mp-validation-title" style={{ opacity: wrongO }} className="display mt-3 text-giant">
              Don’t ask:
              <span className="relative mt-1 block w-fit max-w-full text-[0.8em] text-paper/70">
                “Does it work?”
                <motion.span
                  aria-hidden="true"
                  style={{ scaleX: strike }}
                  className="absolute top-[52%] right-[-2%] left-[-2%] h-[0.09em] origin-left -rotate-2 rounded-full bg-flare"
                />
              </span>
            </motion.h2>
          </div>
          <div>
            <motion.p style={{ opacity: askO, y: askY }} className="display text-big text-flare">
              Ask:
            </motion.p>
            <ol className="mt-3">
              {validationQuestions.map((q, i) => (
                <Ask key={q} q={q} i={i} progress={progress} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

function Ask({ q, i, progress }) {
  const start = 0.32 + i * 0.14
  const opacity = useTransform(progress, [start, start + 0.08], [0.1, 1])
  const x = useTransform(progress, [start, start + 0.1], [40, 0])
  return (
    <motion.li style={{ opacity, x }} className="display border-b border-line py-2 text-[clamp(2.2rem,4.6vw,4.8rem)] leading-[0.95]">
      {q}
    </motion.li>
  )
}

function StaticQuestions() {
  return (
    <div className="container-x grid gap-10 py-section lg:grid-cols-2">
      <h2 id="mp-validation-title" className="display text-giant">
        Don’t ask: <s className="text-paper/60 decoration-flare">“Does it work?”</s>
      </h2>
      <div>
        <p className="display text-big text-flare">Ask:</p>
        <ol className="mt-3">
          {validationQuestions.map((q) => (
            <li key={q} className="display border-b border-line py-2 text-[clamp(2.2rem,4.6vw,4.8rem)] leading-[0.95]">
              {q}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// What behaviour tells you — meaning, not made-up metrics.
function SignalPanel() {
  return (
    <div className="container-x pb-section">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10">
        <div>
          <p className="eyebrow text-paper/55">User behaviour</p>
          <h3 className="display mt-2 text-big">Validation produces signals.</h3>
        </div>
        <p className="max-w-sm text-paper/60">
          Illustrative: what each behaviour tells a builder. Real products see these in their own Market Push data.
        </p>
      </div>
      <RevealGroup as="ul" stagger={0.07} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {behaviourSignals.map((s) => (
          <RevealItem as="li" key={s.id} preset="scale" className="h-full">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-tile border border-line bg-ink-2 p-5 transition-colors duration-500 hover:border-line-strong">
              <span
                aria-hidden="true"
                className={cx('absolute top-0 left-0 h-0.5 w-0 transition-[width] duration-700 ease-[var(--ease-expo)] group-hover:w-full', accentSolid[s.accent])}
              />
              <div className="flex items-center justify-between">
                <span className={cx('display text-3xl leading-none', accentText[s.accent] ?? 'text-paper')}>{s.label}</span>
                <Strength value={s.strength} />
              </div>
              <p className="mt-8 text-sm leading-snug text-paper/70">{s.meaning}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}

function Strength({ value }) {
  if (value < 0) {
    return (
      <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-paper/50 uppercase">
        <span aria-hidden="true">−</span>
        <span className="sr-only">Negative signal</span>
      </span>
    )
  }
  return (
    <span className="flex items-end gap-0.5">
      <span className="sr-only">Signal strength {value} of 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" className={cx('w-1 rounded-full', i < value ? 'bg-paper' : 'bg-line-strong')} style={{ height: 6 + i * 3 }} />
      ))}
    </span>
  )
}
