import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { FRAME_COUNT, frameSrc, storyStages } from '../../data/story'
import { DESKTOP, useMediaQuery } from '../../hooks/useMediaQuery'
import { accentSolid, accentText, cx } from '../../utils/accents'
import { BrainScrollController } from './BrainScrollController'
import { StoryStage } from './StoryStage'

const N = storyStages.length

export function InnovationStory() {
  const desktop = useMediaQuery(DESKTOP)
  const reduce = useReducedMotion()
  // Reduced motion (any size) and small screens get the vertical narrative.
  return desktop && !reduce ? <PinnedStory /> : <VerticalStory />
}

function StoryIntro({ className }) {
  return (
    <div className={className}>
      <h1 id="story-title" className="display mt-8 text-huge">
        From idea <span className="text-sun">to market</span>
      </h1>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop: sticky stage, brain narrates, SCROLL = CONTROL             */
/* ------------------------------------------------------------------ */

function PinnedStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Spring gives the scrub physical weight without detaching it from the scrollbar.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5, restDelta: 0.0005 })

  // Brain path: holds still while a stage's copy is readable, and only travels
  // during the hand-off between stages (when the copy is fading) — so it never
  // drifts across text that someone is reading.
  const stops = [0]
  const xs = [-24]
  storyStages.forEach((s, i) => {
    stops.push((i + 0.25) / N, (i + 0.75) / N)
    xs.push(s.brainX, s.brainX)
  })
  stops.push(1)
  xs.push(24)
  const brainX = useTransform(progress, stops, xs.map((v) => `${v}vw`))
  const brainY = useTransform(progress, [0, 0.9, 1], ['4vh', '0vh', '-8vh'])
  const brainScale = useTransform(progress, [0, 0.08, 0.92, 1], [0.86, 1, 1, 0.9])

  const [active, setActive] = useState(0)
  useMotionValueEvent(progress, 'change', (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)))
    if (i !== active) setActive(i)
  })

  const goTo = (i) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + travel * ((i + 0.5) / N), behavior: 'smooth' })
  }

  const barScale = useTransform(progress, [0, 1], [0, 1])
  const introOpacity = useTransform(progress, [0, 0.06], [1, 0])

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="story-title"
      className="relative bg-ink"
      style={{ height: `${N * 65 + 70}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* ghost numeral of the active stage */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.span
            key={active}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="display text-[58vh] leading-none text-paper/[0.035]"
          >
            {String(active + 1).padStart(2, '0')}
          </motion.span>
        </div>

        <motion.div style={{ opacity: introOpacity }} className="absolute inset-x-0 top-24 z-10">
          <StoryIntro className="container-x" />
        </motion.div>

        {/* brain */}
        <motion.div
          style={{ x: brainX, y: brainY, scale: brainScale }}
          className="absolute top-1/2 left-1/2 aspect-[16/9] w-[54vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <BrainScrollController progress={progress} />
        </motion.div>

        {/* copy */}
        <ol className="relative z-10 size-full">
          {storyStages.map((stage, i) => (
            <StoryStage key={stage.id} stage={stage} index={i} total={N} progress={progress} />
          ))}
        </ol>

        {/* rail — also the keyboard way to jump between stages */}
        <nav aria-label="Journey stages" className="container-x absolute inset-x-0 bottom-6 z-20">
          <div className="relative mb-3 h-px bg-line">
            <motion.div style={{ scaleX: barScale }} className="absolute inset-0 origin-left bg-paper" />
          </div>
          <ul className="grid grid-cols-8 gap-2">
            {storyStages.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={cx(
                    'group flex w-full items-center gap-2 py-1 text-left font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors duration-300',
                    i === active ? 'text-paper' : 'text-paper/40 hover:text-paper/80',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      'size-2 shrink-0 rounded-full transition-transform duration-300',
                      i === active ? cx(accentSolid[s.accent], 'scale-125') : 'bg-line-strong',
                    )}
                  />
                  <span className="truncate">
                    {String(i + 1).padStart(2, '0')} {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile / reduced motion: vertical narrative, one frame per stage    */
/* ------------------------------------------------------------------ */

function VerticalStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-x-clip bg-ink py-section">
      <StoryIntro className="container-x" />
      <ol className="container-x mt-10 flex flex-col gap-4">
        {storyStages.map((s, i) => {
          const frame = Math.round(((i + 0.5) / N) * (FRAME_COUNT - 1))
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid items-center gap-2 border-t border-line pt-6 sm:grid-cols-2 sm:gap-8"
            >
              <img
                src={frameSrc(frame)}
                alt=""
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className={cx('frame-blend -mx-[6vw] w-[calc(100%+12vw)] max-w-none sm:mx-0 sm:w-full', i % 2 && 'sm:order-2')}
              />
              <div>
                <div className="flex items-baseline gap-3">
                  <span className={cx('display text-5xl leading-none', accentText[s.accent])}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="eyebrow text-paper/60">{s.eyebrow}</span>
                </div>
                <h3 className="display mt-1 text-[clamp(2.6rem,12vw,4.5rem)] sm:text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.86]">{s.title}</h3>
                <p className="mt-3 max-w-[30ch] text-lg leading-snug text-paper/80">{s.copy}</p>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
