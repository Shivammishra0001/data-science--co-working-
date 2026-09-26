import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { communityHref } from '../../data/communities'
import { cx } from '../../utils/accents'
import { SmartLink } from '../ui/SmartLink'

const ease = [0.16, 1, 0.3, 1]
// Card orchestrates its own entry once the grid stagger reaches it:
// border draws → logo rises in → title → metadata.
const card = { hidden: {}, shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }
const edge = { hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1.1, ease } } }
const logoIn = { hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0, transition: { duration: 1, ease } } }
const titleIn = { hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }
const metaIn = { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.8 } } }

// Logo placement → absolute box. Height is a % of the card; width follows the
// asset's aspect ratio, so the mark is never stretched.
const boxStyle = ({ h, top, right, bottom, left }, aspect) => ({
  height: `${h}%`,
  aspectRatio: aspect,
  top: top != null ? `${top}%` : undefined,
  right: right != null ? `${right}%` : undefined,
  bottom: bottom != null ? `${bottom}%` : undefined,
  left: left != null ? `${left}%` : undefined,
})

// Editorial poster tile: the brand mark is artwork behind the name — always
// visible, never an icon in a box. Hover/focus only make it more present.
export function CommunityCard({ community }) {
  const { name, description, members, category, featured, logo, theme } = community
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const d = reduce ? 0 : logo.depth
  // logos drift a few px at their own rate — the card itself never moves
  const px = useTransform(scrollYProgress, [0, 1], [d * 0.6, -d * 0.6])
  const py = useTransform(scrollYProgress, [0, 1], [d, -d])

  const vars = {
    '--acc': theme.accent,
    '--lo': theme.logoOpacity,
    '--lo-sm': +(theme.logoOpacity * 0.75).toFixed(3),
    '--lo-h': +Math.min(theme.logoOpacity + 0.11, 0.34).toFixed(3),
  }

  return (
    <motion.li
      ref={ref}
      variants={card}
      style={vars}
      className={cx(
        'group relative isolate flex flex-col justify-between overflow-hidden border border-line bg-ink-2 p-5 sm:p-6',
        'transition-[border-color,background-color] duration-500 ease-[var(--ease-soft)]',
        'hover:border-[color-mix(in_srgb,var(--acc)_45%,var(--color-line))] hover:bg-ink-3',
        'focus-within:border-[color-mix(in_srgb,var(--acc)_45%,var(--color-line))] focus-within:bg-ink-3',
        featured ? 'min-h-[19rem] sm:min-h-[22rem] lg:col-span-2 lg:min-h-[27rem]' : 'min-h-[13rem] sm:min-h-[15rem]',
      )}
    >
      {/* border draws in on reveal */}
      <motion.span
        aria-hidden="true"
        variants={edge}
        className="absolute inset-x-0 top-0 h-px origin-left bg-[color-mix(in_srgb,var(--acc)_55%,transparent)]"
      />

      {/* ambient brand light behind the mark */}
      <span
        aria-hidden="true"
        style={boxStyle(logo.placement, logo.aspect)}
        className="absolute -z-10 bg-[radial-gradient(circle_at_center,var(--acc)_0%,transparent_65%)] opacity-[0.07] transition-opacity duration-700 group-hover:opacity-[0.14] group-focus-within:opacity-[0.14]"
      />

      {/* LOGO — layers: scroll parallax › hover › entry reveal › the mark */}
      <motion.div style={{ ...boxStyle(logo.placement, logo.aspect), x: px, y: py }} className="pointer-events-none absolute -z-10">
        <div
          className={cx(
            'size-full opacity-(--lo) max-sm:opacity-(--lo-sm)',
            'transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]',
            'group-hover:-translate-x-1.5 group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:opacity-(--lo-h)',
            'group-focus-within:-translate-x-1.5 group-focus-within:-translate-y-1 group-focus-within:scale-[1.04] group-focus-within:opacity-(--lo-h)',
          )}
        >
          <motion.div variants={logoIn} className="size-full">
            <div
              role="img"
              aria-label={logo.alt}
              className="size-full"
              style={{
                background: theme.logoFill,
                WebkitMask: `url(${logo.src}) center / contain no-repeat`,
                mask: `url(${logo.src}) center / contain no-repeat`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={metaIn} className="flex items-start justify-between gap-3 font-mono text-[0.68rem] tracking-[0.12em] uppercase">
        <span className="text-[color-mix(in_srgb,var(--acc)_70%,var(--color-paper))]">{category}</span>
        <span className="text-right text-paper/55">{members} members</span>
      </motion.div>

      <div>
        <motion.h3
          variants={titleIn}
          className={cx(
            'display-upright leading-[0.88] [text-shadow:0_2px_24px_rgba(8,8,11,0.6)]',
            featured ? 'text-[clamp(3.2rem,6.4vw,6.5rem)]' : 'text-[clamp(1.9rem,2.5vw,2.5rem)]',
          )}
        >
          <SmartLink
            href={communityHref(community)}
            className="inline-block outline-none transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1 group-focus-within:translate-x-1 after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-sun"
          >
            {name}
          </SmartLink>
        </motion.h3>
        <motion.p variants={metaIn} className={cx('mt-1.5 text-paper/70', featured ? 'text-lg' : 'text-sm')}>
          {description}
        </motion.p>
        <motion.p variants={metaIn} aria-hidden="true">
          <span
            className={cx(
              'mt-4 inline-flex items-center gap-1.5 font-mono text-[0.68rem] tracking-[0.12em] text-paper uppercase',
              'transition-[opacity,transform] duration-500 ease-[var(--ease-expo)]',
              // touch devices always show it; fine pointers reveal on hover/focus
              '[@media(hover:hover)]:translate-y-1.5 [@media(hover:hover)]:opacity-0',
              'group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100',
            )}
          >
            Explore community
            <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </motion.p>
      </div>
    </motion.li>
  )
}
