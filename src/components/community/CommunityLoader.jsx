import { Loader2 } from 'lucide-react'
import { cx } from '../../utils/accents'

// The only "loading" visual on community pages: a small spinner, optionally
// labelled. Never full-screen.
export function Spinner({ className }) {
  return <Loader2 aria-hidden="true" className={cx('size-4 animate-spin text-current', className)} />
}

export function CommunityLoader({ label = 'Loading', className }) {
  return (
    <div role="status" className={cx('flex items-center justify-center gap-2.5 py-10 text-sm text-paper/55', className)}>
      <Spinner />
      <span>{label}…</span>
    </div>
  )
}
