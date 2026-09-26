import { ArrowRight } from 'lucide-react'
import { accentSolid, cx } from '../../utils/accents'
import { ProjectVisual } from '../projects/ProjectVisual'
import { SampleBadge } from '../ui/SampleBadge'

// Editorial case-study card. `size` sets composition, not just width:
// feature = tall with big art; small = compact; wide = art beside text;
// full = art and headline side by side at display scale.
export function LaunchStoryCard({ story, size = story.size, className }) {
  const horizontal = size === 'wide' || size === 'full'
  return (
    <article
      className={cx(
        'group relative flex overflow-hidden rounded-card border-2 border-ink bg-paper text-ink transition-[border-color,box-shadow] duration-300',
        'hover:shadow-[0_14px_0_-6px_var(--color-ink)] focus-within:shadow-[0_14px_0_-6px_var(--color-ink)]',
        horizontal ? 'flex-col md:flex-row' : 'flex-col',
        className,
      )}
    >
      <div
        className={cx(
          'relative m-2 overflow-hidden rounded-[1.2rem]',
          size === 'feature' && 'min-h-[13rem] flex-1',
          size === 'small' && 'h-20 shrink-0',
          horizontal && 'aspect-[16/10] md:aspect-auto md:w-[48%] md:shrink-0',
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.03]">
          <ProjectVisual kind={story.visual} accent={story.accent} />
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[0.65rem] font-semibold tracking-[0.1em] uppercase">
          <span className="rounded-full bg-paper/90 px-2.5 py-1 text-ink/60">{story.before}</span>
          <ArrowRight aria-hidden="true" className="size-3.5 text-paper" />
          <span className={cx('rounded-full px-2.5 py-1', accentSolid[story.accent])}>{story.now}</span>
          <span className="sr-only">
            Stage before Market Push: {story.before}. Current stage: {story.now}.
          </span>
        </div>
      </div>

      <div className={cx('flex flex-col px-5 pt-3 pb-5 sm:px-6', horizontal && 'md:flex-1 md:py-6', size === 'full' && 'lg:px-10')}>
        <div className={cx('flex items-center justify-between gap-3', size === 'small' && 'hidden')}>
          <p className="font-mono text-[0.68rem] tracking-[0.12em] text-ink/55 uppercase">
            Launched {story.launched} · {story.builder}
          </p>
          <SampleBadge tone="light" show={story.sample} />
        </div>
        <h3
          className={cx(
            'display mt-3 leading-[0.88] transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1',
            size === 'small' ? 'text-[1.9rem]' : size === 'full' ? 'text-[clamp(2.6rem,5vw,5.5rem)]' : 'text-[clamp(2.2rem,3.4vw,3.4rem)]',
          )}
        >
          {story.project}
        </h3>
        <p className={cx('mt-3 leading-snug text-ink/75', size === 'full' && 'max-w-xl text-lg', size === 'small' && 'line-clamp-2 text-sm')}>{story.problem}</p>

        {size !== 'small' && (
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink/15 pt-4 text-sm">
            <div className="col-span-2">
              <dt className="eyebrow !text-[0.62rem] text-ink/50">What was built</dt>
              <dd className="mt-1">{story.built}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-[0.62rem] text-ink/50">Technology</dt>
              <dd className="mt-1">{story.tech.join(' · ')}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-[0.62rem] text-ink/50">Users</dt>
              <dd className="mt-1">{story.users ?? <span className="text-ink/50">Awaiting verified data</span>}</dd>
            </div>
          </dl>
        )}

        <a
          href={`#story-${story.id}`}
          className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold tracking-[0.08em] uppercase after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
        >
          Read the story
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
      </div>
    </article>
  )
}
