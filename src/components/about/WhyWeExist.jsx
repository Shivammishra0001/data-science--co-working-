import { whyWeExist } from '../../data/about/story'
import { accentText, cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { ThemeSection } from '../market-push/ThemeSection'

// 02 — LIGHT: clarity. Four people, four sentences that stop short.
// Calm reveals — the words carry it, not the motion.
export function WhyWeExist() {
  return (
    <ThemeSection tone="light" id="why" labelledBy="why-title" data-chapter="why" className="pb-section">
      <div className="container-x pt-14">
        <p className="eyebrow text-paper-mute">02 · Why we exist</p>
        <RevealText id="why-title" lines={whyWeExist.title} className="display mt-3 text-huge" />

        <ol className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {whyWeExist.pairs.map((p, i) => (
            <ScrollReveal as="li" key={p.claim} delay={(i % 2) * 0.12} amount={0.6} className="border-t-2 border-ink pt-5">
              <span className="font-mono text-xs text-ink/45">0{i + 1}</span>
              <p className="display mt-2 text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.9]">“{p.claim}”</p>
              <ScrollReveal as="p" delay={0.35 + (i % 2) * 0.12} amount={0.6} preset="fade" className="mt-3 text-xl text-ink/65">
                {p.but}
              </ScrollReveal>
            </ScrollReveal>
          ))}
        </ol>

        <div className="mt-[clamp(5rem,12vw,10rem)] max-w-5xl">
          <RevealText
            lines={[whyWeExist.closing[0], <span key="i" className={cx(accentText.flare)}>{whyWeExist.closing[1]}</span>, whyWeExist.closing[2]]}
            className="display text-giant"
            as="p"
          />
        </div>
      </div>
    </ThemeSection>
  )
}
