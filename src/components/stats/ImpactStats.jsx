import { headlineStat, stats } from '../../data/stats'
import { Counter } from '../motion/Counter'
import { RevealText } from '../motion/RevealText'
import { RevealGroup, RevealItem } from '../motion/ScrollReveal'

export function ImpactStats() {
  return (
    <section id="impact" aria-labelledby="impact-title" className="overflow-hidden bg-volt py-section text-white">
      <div className="container-x">
        
        <RevealText id="impact-title" lines={['People are', 'building here.']} className="display text-huge" />

        <p className="mt-[clamp(2.5rem,6vw,5rem)] flex flex-wrap items-end gap-x-6">
          <Counter
            value={headlineStat.value}
            suffix={headlineStat.suffix}
            className="display text-[clamp(5rem,19vw,19rem)] leading-[0.8] text-ink"
          />
          <span className="display pb-[1.2vw] text-[clamp(2rem,5vw,5rem)] leading-none">{headlineStat.label}</span>
        </p>

        <RevealGroup as="dl" stagger={0.07} className="mt-14 grid grid-cols-2 border-t-2 border-white/90 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <RevealItem key={s.id} className="flex flex-col border-b border-white/25 py-6 pr-4 lg:border-b-0">
              <dt className="eyebrow order-2 mt-2 text-white/80">{s.label}</dt>
              <dd className="display order-1 text-[clamp(2.6rem,4.4vw,4.2rem)] leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

    </section>
  )
}
