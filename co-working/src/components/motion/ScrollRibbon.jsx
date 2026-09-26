import { motion } from 'motion/react'
import { useVelocityMarquee } from '../../hooks/useVelocityMarquee'
import { accentSolid, cx } from '../../utils/accents'

const sizes = {
  lg: {
    chip: 'rounded-[clamp(1rem,2vw,2rem)] px-[0.18em] pt-[0.06em] text-[clamp(4.2rem,11vw,11rem)] leading-[0.95]',
    gap: 'gap-3 pr-3 sm:gap-5 sm:pr-5',
  },
  md: {
    chip: 'rounded-[clamp(0.8rem,1.5vw,1.5rem)] px-[0.22em] pt-[0.05em] text-[clamp(2.6rem,6.5vw,6.5rem)] leading-[0.98]',
    gap: 'gap-2.5 pr-2.5 sm:gap-4 sm:pr-4',
  },
  sm: {
    chip: 'rounded-full px-[0.8em] py-[0.35em] text-[clamp(1.05rem,2vw,1.6rem)] not-italic font-bold tracking-[0.04em]',
    gap: 'gap-2 pr-2 sm:gap-3 sm:pr-3',
  },
}

// Infinite ribbon of display chips; speed + direction follow the scroll
// (see useVelocityMarquee).
export function ScrollRibbon({ items, velocity = -2, palette = ['paper'], size = 'md', label, className }) {
  const { ref, x } = useVelocityMarquee(velocity)

  const s = sizes[size]
  // Each half carries its trailing gap as padding so -50% is a seamless loop.
  // One "set" is repeated so a half-track is always wider than the viewport.
  const set = [...items, ...items]
  const chip = (item, i, copy) => {
    const tone = palette[i % palette.length]
    return (
      <span
        key={`${copy}-${i}`}
        className={cx('display inline-block whitespace-nowrap', s.chip, accentSolid[tone])}
      >
        {item}
      </span>
    )
  }

  return (
    <div ref={ref} className={cx('relative overflow-hidden py-1.5', className)}>
      <p className="sr-only">
        {label}: {items.join(', ')}
      </p>
      <motion.div aria-hidden="true" style={{ x }} className="flex w-max will-change-transform">
        <div className={cx('flex shrink-0', s.gap)}>{set.map((it, i) => chip(it, i, 'a'))}</div>
        <div className={cx('flex shrink-0', s.gap)}>{set.map((it, i) => chip(it, i, 'b'))}</div>
      </motion.div>
    </div>
  )
}
