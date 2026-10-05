import { SHOW_SAMPLE_NOTICE } from '../../config/site'
import { cx } from '../../utils/accents'

// Honest marker for placeholder content. Hidden once SHOW_SAMPLE_NOTICE is false
// (i.e. when real data is wired in).
export function SampleBadge({ show = true, tone = 'dark', className, children = 'Sample data' }) {
  if (!SHOW_SAMPLE_NOTICE || !show) return null
  return (
    <span
      className={cx(
        'eyebrow inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 !text-[0.6875rem] whitespace-nowrap',
        tone === 'dark' ? 'border-line-strong text-mute' : 'border-paper-line text-paper-mute',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
