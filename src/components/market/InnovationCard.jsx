import { journey } from '../../data/launches'
import { accentSolid, accentText, accentBorderHover, cx } from '../../utils/accents'
import { SampleBadge } from '../ui/SampleBadge'

// A launched (or launching) product: the metric leads, the origin story follows.
export function InnovationCard({ item }) {
  const reached = journey.indexOf(item.stage)
  return (
    <article
      className={cx(
        'group relative flex h-full flex-col rounded-card border border-line bg-ink-2 p-6 transition-[border-color,transform] duration-500 ease-[var(--ease-expo)] hover:-translate-y-1.5 sm:p-8',
        accentBorderHover[item.accent],
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          <span
            aria-hidden="true"
            className={cx('size-2 rounded-full', item.live ? 'animate-pulse-dot bg-mint' : 'bg-sun')}
          />
          {item.live ? 'Live' : 'In testing'}
        </span>
        <SampleBadge show={item.sample} />
      </div>

      <p className="mt-8">
        <span className={cx('display block text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.82]', accentText[item.accent])}>
          {item.metric.value}
        </span>
        <span className="eyebrow mt-2 block text-paper/70">{item.metric.label}</span>
      </p>

      <h3 className="display mt-8 text-[2.1rem] leading-[0.9]">{item.product}</h3>
      <p className="mt-2 text-paper/65">{item.origin}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
        <div>
          <dt className="eyebrow !text-[0.6875rem] text-mute">Industry</dt>
          <dd className="mt-1 font-medium">{item.industry}</dd>
        </div>
        <div>
          <dt className="eyebrow !text-[0.6875rem] text-mute">Technology</dt>
          <dd className="mt-1 font-medium">{item.tech.join(' · ')}</dd>
        </div>
      </dl>

      <ol className="mt-auto flex gap-1 pt-7" aria-label={`Journey stage: ${item.stage}`}>
        {journey.map((step, i) => (
          <li key={step} className="flex-1">
            <span
              aria-hidden="true"
              className={cx('block h-1.5 rounded-full', i <= reached ? accentSolid[item.accent] : 'bg-line')}
            />
            <span
              className={cx(
                'mt-2 block font-mono text-[0.6875rem] tracking-[0.08em] uppercase',
                i === reached ? 'text-paper' : 'text-paper/35',
              )}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </article>
  )
}
