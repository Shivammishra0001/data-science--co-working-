import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { categories, filters } from '../../data/market/innovations'
import { accentSolid, accentBorderHover, cx } from '../../utils/accents'
import { ProjectVisual } from '../projects/ProjectVisual'

const flagLabel = Object.fromEntries(filters.map((f) => [f.id, f.label]))
const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))

// Innovation, not inventory: stage and what it needs lead; there is no price.
export const DiscoveryCard = forwardRef(function DiscoveryCard({ item, className }, ref) {
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-card border border-line bg-ink-2 transition-colors duration-300',
        accentBorderHover[item.accent],
        className,
      )}
    >
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.2rem]">
        <div className="size-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-[1.03]">
          <ProjectVisual kind={item.visual} accent={item.accent} />
        </div>
        <span className={cx('absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[0.6875rem] font-semibold tracking-[0.12em] uppercase', accentSolid[item.accent])}>
          {item.stage}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.12em] text-paper uppercase">
          {categoryLabel[item.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-2 pb-5">
        <h3 className="display text-[1.9rem] leading-[0.9] transition-transform duration-300 group-hover:translate-x-1">
          <a href={`#innovation-${item.id}`} className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-sun">
            {item.name}
          </a>
        </h3>
        <p className="mt-2 text-sm leading-snug text-paper/70">{item.blurb}</p>
        <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.1em] text-paper/50 uppercase">{item.tech.join(' · ')}</p>

        {/* metadata surfaces on hover/focus (always visible on touch) */}
        <ul
          aria-label="Status"
          className="mt-4 flex flex-wrap gap-1.5 transition-all duration-300 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          {item.flags.map((f) => (
            <li key={f} className="rounded-full border border-line-strong px-2 py-0.5 text-[0.7rem] text-paper/75">
              {flagLabel[f]}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="text-paper/55">{item.users ?? 'Users not yet reported'}</span>
          <ArrowUpRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </motion.li>
  )
})
