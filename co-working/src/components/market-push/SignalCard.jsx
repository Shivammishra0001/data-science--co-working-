import { signalKinds } from '../../data/market/signals'
import { accentSolid, accentText, cx } from '../../utils/accents'

export function SignalCard({ signal, offset = 0 }) {
  const kind = signalKinds[signal.kind]
  return (
    <figure
      style={{ transform: `translateY(${offset}px)` }}
      className="group flex w-[min(78vw,20rem)] shrink-0 flex-col gap-4 rounded-tile border border-line bg-ink-2 p-5 transition-colors duration-300 hover:border-line-strong"
    >
      <div className="flex items-center justify-between">
        <span className={cx('rounded-full px-2.5 py-1 font-mono text-[0.62rem] font-semibold tracking-[0.12em] uppercase', accentSolid[kind.accent])}>
          {kind.label}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="animate-pulse-dot size-1.5 rounded-full bg-paper/40" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </span>
      </div>
      <blockquote className={cx('display text-[1.75rem] leading-[0.95]', signal.kind === 'review' ? accentText.sun : 'text-paper')}>
        {signal.text}
      </blockquote>
      <figcaption className="font-mono text-[0.65rem] tracking-[0.12em] text-paper/45 uppercase">
        Example · {signal.meta}
      </figcaption>
    </figure>
  )
}
