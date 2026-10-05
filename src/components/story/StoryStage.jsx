import { motion, useTransform } from 'motion/react'
import { accentSolid, accentText, cx } from '../../utils/accents'

// One stage of the pinned story. Its visibility window is [index/total, (index+1)/total]
// of the section's scroll progress; copy rises in, holds, then lifts out — and
// reverses exactly when scrolling back because it's a pure function of progress.
export function StoryStage({ stage, index, total, progress }) {
  const w = 1 / total
  const start = index * w
  const end = start + w
  const fade = w * 0.22
  const first = index === 0
  const last = index === total - 1

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [first ? 1 : 0, 1, 1, last ? 1 : 0],
  )
  const y = useTransform(progress, [start, start + fade, end - fade, end], [first ? 0 : 70, 0, 0, last ? 0 : -70])
  const titleX = useTransform(progress, [start, end], stage.side === 'right' ? [40, -20] : [-40, 20])
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? 'hidden' : 'visible'))

  return (
    <motion.li
      style={{ opacity, y, visibility }}
      className={cx(
        'absolute top-1/2 w-[min(36vw,36rem)] -translate-y-1/2',
        stage.side === 'right' ? 'right-[var(--spacing-gutter)]' : 'left-[var(--spacing-gutter)]',
      )}
    >
      <div className="flex items-center gap-4">
        <span className={cx('display text-[clamp(3rem,6vw,6rem)] leading-none', accentText[stage.accent])}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
        <span className="eyebrow text-paper/60">{stage.eyebrow}</span>
      </div>
      <motion.h3 style={{ x: titleX }} className="display mt-2 text-[clamp(3rem,5.8vw,6.2rem)] leading-[0.84] text-paper">
        {stage.title}
      </motion.h3>
      <p className="mt-5 max-w-[26ch] text-[clamp(1.2rem,1.7vw,1.65rem)] leading-snug text-paper/80">{stage.copy}</p>
      {stage.tags?.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${stage.title} includes`}>
          {stage.tags.map((t) => (
            <li
              key={t}
              className={cx('rounded-full px-3 py-1.5 font-mono text-[0.7rem] tracking-wide uppercase', accentSolid[stage.accent])}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </motion.li>
  )
}
