import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { problems } from '../../data/problems'
import { accentSolid, accentVar, cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'

// Light "paper" section — the one place the page opens up before the dark story.
export function WhySection() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative bg-paper py-section text-ink">
      <div className="container-x">
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
      style={{ '--card': accentVar[problem.accent] }}
      className={cx(
        'group relative flex min-h-[19rem] flex-col overflow-hidden rounded-card border-2 border-ink p-6 sm:min-h-[30rem] sm:p-7',
        'transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)]',
        'hover:-translate-y-2 hover:shadow-[0_14px_0_-4px_var(--color-ink)]',
        accentSolid[problem.accent],
      )}
    >
      {/* subtle dot grid — gives the colour block some texture */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(currentColor_1px,transparent_1.4px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />
      <div className="relative flex items-center justify-between">
        <span className="rounded-full border-2 border-current px-2.5 py-0.5 font-mono text-xs font-semibold">0{index + 1}</span>
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full bg-ink text-lg font-bold text-[var(--card)] transition-transform duration-500 group-hover:rotate-90"
        >
          ×
        </span>
      </div>
      {/* graphic + text sit together in the middle of the card, centred */}
      <div className="relative flex flex-1 flex-col items-center justify-center py-6 text-center">
        <h3 className="display text-[clamp(1.8rem,2.4vw,2.5rem)] leading-[0.92] text-balance">{problem.claim}</h3>
        <span aria-hidden="true" className="my-4 h-[3px] w-10 rounded-full bg-ink" />
        <p className="max-w-[26ch] text-[1.02rem] leading-relaxed font-medium text-pretty text-ink sm:text-[1.06rem]">{problem.but}</p>
      </div>
    </ScrollReveal>
  )
}

// The turn: scroll-scrubbed words light up one by one.
function Resolution() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 50%'] })
  const words = 'So we built the environment, become Entrepreneurs emerge....'.split(' ')

  return (
    <div ref={ref} className="mt-[clamp(4rem,10vw,9rem)] border-t-2 border-ink pt-10">
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
