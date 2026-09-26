import { Check } from 'lucide-react'
import { cx } from '../../utils/accents'
import { Spinner } from './CommunityLoader'
import { btn } from './shared'

// One primary action. Before: JOIN COMMUNITY. While joining: small spinner.
// After: ✓ JOINED, with a quiet "Leave" beside it.
export function JoinCommunityButton({ joined, pending, onJoin, onLeave, size = 'md', showLeave = true, communityName }) {
  const h = size === 'sm' ? 'h-9 px-4 text-[0.8rem]' : 'h-11 px-6'
  if (joined) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={cx('inline-flex items-center gap-2 rounded-full bg-mint/15 font-semibold text-mint ring-1 ring-mint/40 ring-inset', h)}>
          <Check aria-hidden="true" className="size-4" strokeWidth={2.75} />
          Joined
        </span>
        {showLeave && (
          <button
            type="button"
            onClick={onLeave}
            disabled={pending === 'leave'}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-paper/55 hover:bg-paper/[0.07] hover:text-paper"
          >
            {pending === 'leave' && <Spinner className="size-3.5" />}
            Leave<span className="sr-only"> {communityName}</span>
          </button>
        )}
      </div>
    )
  }
  return (
    <button type="button" onClick={onJoin} disabled={pending === 'join'} aria-busy={pending === 'join'} className={cx(btn.primary, h, 'min-w-[9.5rem] uppercase tracking-[0.06em]')}>
      {pending === 'join' ? (
        <>
          <Spinner /> Joining…
        </>
      ) : (
        <>
          Join community<span className="sr-only"> {communityName}</span>
        </>
      )}
    </button>
  )
}
