import { ArrowUpRight, Users } from 'lucide-react'
import { accentSolid, cx } from '../../utils/accents'
import { PROJECT_STAGES } from '../../data/projects'
import { ProjectVisual } from './ProjectVisual'

// Whole card is one link (stretched ::after), so hover and focus behave the same.
// Hover: card lifts, art zooms, title slides, CTA reveals. Touch shows the CTA always.
export function ProjectCard({ project }) {
  const stageIndex = PROJECT_STAGES.indexOf(project.stage)
  return (
    <article
      className={cx(
        'group relative flex w-[min(82vw,25rem)] shrink-0 snap-start flex-col overflow-hidden rounded-card border-2 border-ink bg-paper text-ink',
        'transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)]',
        'hover:-translate-y-2 hover:shadow-[0_18px_0_-6px_var(--color-ink)] focus-within:-translate-y-2 focus-within:shadow-[0_18px_0_-6px_var(--color-ink)]',
      )}
    >
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[1.2rem]">
        <div className="size-full transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110 group-focus-within:scale-110">
          <ProjectVisual kind={project.visual} accent={project.accent} />
        </div>
        <span
          className={cx(
            'absolute top-3 left-3 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-semibold tracking-[0.12em] uppercase',
            accentSolid[project.accent],
          )}
        >
          {project.stage}
        </span>
        {/* stage progress: Idea → Live */}
        <div className="absolute inset-x-3 bottom-3 flex gap-1" aria-hidden="true">
          {PROJECT_STAGES.map((s, i) => (
            <span key={s} className={cx('h-1 flex-1 rounded-full', i <= stageIndex ? 'bg-paper' : 'bg-paper/25')} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-3 pb-5">
        <h3 className="display text-[2rem] leading-[0.9] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1">
          <a
            href={`#project-${project.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ink"
          >
            {project.name}
          </a>
        </h3>
        <p className="mt-2 text-[0.98rem] leading-snug text-ink/70">{project.problem}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full border border-ink/20 px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide uppercase">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="text-sm">
            <p className="flex items-center gap-1.5 font-semibold">
              <Users aria-hidden="true" className="size-4" />
              {project.builders} {project.builders === 1 ? 'builder' : 'builders'}
            </p>
            <p className="mt-0.5 text-ink/60">{project.status}</p>
          </div>
          <span
            aria-hidden="true"
            className={cx(
              'grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-all duration-500 ease-[var(--ease-expo)]',
              '[@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100',
            )}
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </article>
  )
}
