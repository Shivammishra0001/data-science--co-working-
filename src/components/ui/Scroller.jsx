import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../../utils/accents'

export function ScrollerControls({ scroller, label, tone = 'dark', className }) {
  const btn = cx(
    'grid size-12 place-items-center rounded-full border transition-colors duration-300 disabled:opacity-30 sm:size-14',
    tone === 'dark'
      ? 'border-line-strong text-paper enabled:hover:bg-paper enabled:hover:text-ink'
      : 'border-ink/25 text-ink enabled:hover:bg-ink enabled:hover:text-paper',
  )
  return (
    <div className={cx('flex gap-3', className)}>
      <button
        type="button"
        className={btn}
        onClick={() => scroller.page(-1)}
        disabled={scroller.edge.start}
        aria-label={`Previous ${label}`}
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => scroller.page(1)}
        disabled={scroller.edge.end}
        aria-label={`Next ${label}`}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  )
}

export function ScrollerTrack({ scroller, label, children, className }) {
  const { setRef } = scroller
  return (
    <div
      ref={setRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cx(
        'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-6 sm:gap-6',
        'scroll-px-[var(--spacing-gutter)] px-[var(--spacing-gutter)]',
        className,
      )}
    >
      {children}
      {/* trailing spacer so the last card can snap with the gutter */}
      <div aria-hidden="true" className="w-px shrink-0" />
    </div>
  )
}
