import { Star } from 'lucide-react'
import { accentBorderHover, accentText, cx } from '../../utils/accents'
import { Avatar } from '../ui/Avatar'

export function ReviewCard({ review }) {
  return (
    <figure
      className={cx(
        'group relative flex w-[min(84vw,24rem)] shrink-0 snap-start flex-col border border-line bg-ink-2 px-6 pt-12 pb-7 sm:px-8',
        'transition-[transform,border-color] duration-500 ease-[var(--ease-expo)] hover:-translate-y-2 focus-within:-translate-y-2',
        accentBorderHover[review.accent],
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'display absolute top-1 left-5 text-[5.5rem] leading-none transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1.5 group-hover:-rotate-6',
          accentText[review.accent],
        )}
      >
        “
      </span>
      <blockquote className="flex-1 text-[1.15rem] leading-relaxed text-paper/90">
        <p>{review.quote}</p>
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <Avatar name={review.name} photo={review.photo} accent={review.accent} size="sm" />
        <span className="min-w-0">
          <span className="block truncate font-semibold">{review.name}</span>
          <span className="block truncate text-sm text-paper/55">
            {review.role} · {review.org}
          </span>
        </span>
      </figcaption>
      <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
        <span className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={cx('size-4', i < review.rating ? 'fill-sun text-sun' : 'text-line-strong')} />
          ))}
        </span>
        <span className="font-mono text-xs text-paper/60">Rating: {review.rating}/5</span>
      </div>
    </figure>
  )
}
