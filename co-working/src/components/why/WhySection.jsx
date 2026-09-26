import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { problems } from '../../data/problems'
import { accentSolid, cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'

// Light "paper" section — the one place the page opens up before the dark story.
export function WhySection() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative bg-paper py-section text-ink">
      <div className="container-x">
        <p className="eyebrow mb-6 text-paper-mute">Why this exists</p>
        <RevealText
          lines={["Talent isn't", 'the problem.', <span key="c" className="text-flare">The environment is.</span>]}
          className="display text-giant"
          id="why-title"
        />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {problems.map((p, i) => (
            <ProblemCard key={p.claim} problem={p} index={i} />
          ))}
        </div>

        <Resolution />
      </div>
    </section>
  )
}

function ProblemCard({ problem, index }) {
  return (
    <ScrollReveal
      as="article"
      preset="clip"
      delay={index * 0.12}
      amount={0.3}
      className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-card border-2 border-ink bg-paper p-6 sm:min-h-[24rem] sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">0{index + 1}</span>
        <span
          aria-hidden="true"
          className={cx(
            'size-10 rounded-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-[7]',
            accentSolid[problem.accent],
          )}
        />
      </div>
      <div className="relative">
        <h3 className="display text-[clamp(2.2rem,3.4vw,3.2rem)] leading-[0.9]">“{problem.claim}”</h3>
        <p className="mt-4 text-lg leading-snug text-ink/70">{problem.but}</p>
      </div>
    </ScrollReveal>
  )
}

// The turn: scroll-scrubbed words light up one by one.
function Resolution() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const words = 'So we built the environment between idea and market.'.split(' ')

  return (
    <div ref={ref} className="mt-[clamp(4rem,10vw,9rem)] border-t-2 border-ink pt-10">
      <p className="eyebrow mb-6 text-paper-mute">The answer</p>
      <p className="display max-w-[18ch] text-huge">
        <span className="sr-only">{words.join(' ')}</span>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} highlight={i >= 5}>
            {w}
          </Word>
        ))}
      </p>
    </div>
  )
}

function Word({ progress, range, highlight, children }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className={cx('mr-[0.22em] inline-block', highlight && 'text-volt')}>
      {children}
    </motion.span>
  )
}
