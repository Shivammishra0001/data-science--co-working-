import { impactStats } from '../../data/market/stats'
import { accentText, cx } from '../../utils/accents'
import { Counter } from '../motion/Counter'
import { RevealText } from '../motion/RevealText'
import { RevealGroup, RevealItem } from '../motion/ScrollReveal'
import { SampleBadge } from '../ui/SampleBadge'
import { ThemeSection } from './ThemeSection'

// 11 — LIGHT: momentum, counted. Values come from data/market/stats.js.
export function MarketImpact() {
  const [lead, ...rest] = impactStats
  return (
    <ThemeSection tone="light" id="impact" labelledBy="mp-impact-title" className="pb-section">
      <div className="container-x pt-16">
        <p className="eyebrow flex items-center gap-3 text-paper-mute">
          11 · Impact <SampleBadge tone="light" show={impactStats.some((s) => s.sample)}>Sample numbers</SampleBadge>
        </p>
        <RevealText id="mp-impact-title" lines={['Momentum,', 'counted.']} className="display mt-3 text-huge" />

        <div className="mt-12 grid items-end gap-6 border-t-2 border-ink pt-8 lg:grid-cols-[1.4fr_1fr]">
          <p className="flex flex-wrap items-end gap-x-5 gap-y-6">
            <Counter value={lead.value} suffix={lead.suffix} className={cx('display text-[clamp(5rem,17vw,17rem)] leading-[0.8]', accentText[lead.accent])} />
            <span className="display pb-[1vw] text-[clamp(2rem,4vw,4rem)] leading-none">{lead.label}</span>
          </p>
          <p className="max-w-sm pb-3 text-xl leading-snug text-ink/75">
            Every number represents a person who tried something that didn’t exist before.
          </p>
        </div>

        <RevealGroup as="dl" stagger={0.08} className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border-2 border-ink bg-ink md:grid-cols-5">
          {rest.map((s) => (
            <RevealItem key={s.id} className="flex flex-col bg-paper p-5 sm:p-6">
              <dt className="eyebrow order-2 mt-2 text-ink/60">{s.label}</dt>
              <dd className="display order-1 text-[clamp(2.8rem,5vw,5rem)] leading-none">
                <Counter value={s.value} suffix={s.suffix} duration={1.4} />
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </ThemeSection>
  )
}
