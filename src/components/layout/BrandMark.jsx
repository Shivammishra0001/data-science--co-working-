import { brand } from '../../config/site'
import { cx } from '../../utils/accents'
import { SmartLink } from '../ui/SmartLink'

// Data Science Co-Working mark: three connected data points rising to one
// yellow insight node. It reads as a trend line (data science) and as
// connected people (co-working) — the same "signal through a network" idea
// the site uses for the brain and Market Push visuals.
//
// Geometry (48×48): keep in sync with public/favicon.svg.
const POINTS = [
  [13, 32.5],
  [21.5, 26.5],
  [27.5, 29],
]
const INSIGHT = [34.5, 16.5]
const PATH = 'M13 32.5 L21.5 26.5 L27.5 29 L34.5 16.5'

const tones = {
  // on dark surfaces (default): paper disc, ink marks
  light: { disc: '#f3f0e8', ink: '#08080b', line1: 'text-paper', line2: 'text-mute' },
  // on light surfaces (e.g. the yellow mobile menu): ink disc, paper marks
  dark: { disc: '#08080b', ink: '#f3f0e8', line1: 'text-ink', line2: 'text-ink/60' },
}

export function BrandSymbol({ tone = 'light', className }) {
  const t = tones[tone]
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cx('shrink-0', className)}>
      <circle cx="24" cy="24" r="23" fill={t.disc} />
      <path d={PATH} fill="none" stroke={t.ink} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      {POINTS.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.8" fill={t.ink} />
      ))}
      {/* the insight: nudges up-right on hover (rises), never spins */}
      <circle
        cx={INSIGHT[0]}
        cy={INSIGHT[1]}
        r="4.8"
        fill="#ffd33d"
        className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]"
      />
    </svg>
  )
}

// Lockups: full (mark + stacked wordmark) · mark-only (withName={false}).
export function BrandMark({ className, withName = true, tone = 'light' }) {
  const t = tones[tone]
  return (
    <SmartLink href="/" className={cx('group inline-flex items-center gap-2.5', className)} aria-label={`${brand.name} — home`}>
      <BrandSymbol tone={tone} className="size-11 sm:size-12" />
      {withName && (
        <span aria-hidden="true" className="display-upright text-[1.05rem] leading-[0.92] tracking-[0.02em] sm:text-[1.15rem]">
          <span className={cx('block', t.line1)}>{brand.wordmark[0]}</span>
          <span className={cx('block', t.line2)}>{brand.wordmark[1]}</span>
        </span>
      )}
    </SmartLink>
  )
}
