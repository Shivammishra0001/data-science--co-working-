import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { communityHref } from '../../data/communities'
import { cx } from '../../utils/accents'
import { BrandLogo } from '../community/BrandLogo'
import { SmartLink } from '../ui/SmartLink'
import { tileIn } from './tileMotion'

// Square logo tile. The brand mark sits centred in its own colour; the name
// and member count stay readable at the bottom. Hover/focus: the tile lifts
// slightly, the border takes the brand colour and the logo grows a touch.
// `size="lg"` is the 2×2 feature tile.
export function CommunityCard({ community, size = 'sm', className }) {
  const { name, members, theme } = community
  const lg = size === 'lg'
  return (
    <motion.li variants={tileIn} className={cx('relative', lg && 'sm:col-span-2 sm:row-span-2', className)} style={{ '--acc': theme.accent }}>
      <SmartLink
        href={communityHref(community)}
        aria-label={`${name} community — ${members} members`}
        className={cx(
          'group relative flex aspect-square size-full flex-col items-center justify-center overflow-hidden rounded-xl border border-line bg-ink-2',
          'transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-expo)]',
          'hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--acc)_60%,transparent)] hover:bg-ink-3',
          'focus-visible:-translate-y-1 focus-visible:border-[var(--acc)] focus-visible:bg-ink-3 focus-visible:outline-none',
        )}
      >
        {/* soft brand glow behind the mark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${theme.accent} 22%, transparent), transparent 62%)` }}
        />
        <BrandLogo
          community={community}
          decorative
          className={cx('relative transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-110', lg ? 'h-[38%] sm:h-[42%]' : 'h-[38%]')}
        />
        <span
          className={cx(
            'absolute inset-x-0 bottom-0 flex items-end justify-between gap-2',
            lg ? 'p-2.5 sm:p-6' : 'p-2.5 sm:p-3',
          )}
        >
          <span className="min-w-0">
            <span className={cx('display-upright block truncate leading-none', lg ? 'text-[clamp(0.8rem,1vw,1rem)] sm:text-[clamp(1.6rem,2.6vw,2.6rem)]' : 'text-[clamp(0.8rem,1vw,1rem)]')}>{name}</span>
            <span className={cx('mt-1 block font-mono tracking-[0.1em] text-paper/50 uppercase', lg ? 'hidden text-[0.7rem] sm:block' : 'hidden text-[0.6875rem] sm:block')}>
              {members} members
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className={cx(
              'shrink-0 text-[var(--acc)] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100',
              lg ? 'size-4 sm:size-6' : 'size-4',
            )}
          />
        </span>
      </SmartLink>
    </motion.li>
  )
}
