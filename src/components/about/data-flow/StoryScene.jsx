import { useRef } from 'react'
import { useMotionValue } from 'motion/react'
import { useScrollProgress } from '../../../hooks/useScrollProgress'
import { useStoryMode } from '../../../hooks/useStoryMode'
import { ThemeSection } from '../../market-push/ThemeSection'

// A themed section that pins on desktop and scrubs its children by scroll.
// `children(progress, pinned)` — progress is a MotionValue. When not pinned
// (tablet, mobile, reduced motion) progress is fixed at 1 (the complete
// state) and `fallback` can supply a layout designed for small screens.
// Pinned length = 0.72 × `vh`: each stage still gets about a screen of scroll, without dead travel.
export function StoryScene({ tone = 'dark', id, chapter, labelledBy, vh = 400, className, sheet = true, children, fallback }) {
  const ref = useRef(null)
  const { pinned } = useStoryMode()
  const progress = useScrollProgress(ref)
  const full = useMotionValue(1)
  return (
    <ThemeSection tone={tone} id={id} labelledBy={labelledBy} sectionRef={ref} data-chapter={chapter} className={className} sheet={sheet}>
      {pinned ? (
        <div style={{ height: `${Math.round(vh * 0.72)}vh` }}>
          <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">{children(progress, true)}</div>
        </div>
      ) : (
        <div className="pt-10 pb-section">{(fallback ?? children)(full, false)}</div>
      )}
    </ThemeSection>
  )
}

// Bottom stage indicator for pinned scenes.
export function StageRail({ stages, active, tone = 'dark' }) {
  return (
    <ol className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase" aria-label="Stages">
      {stages.map((s, i) => (
        <li
          key={s}
          aria-current={i === active ? 'step' : undefined}
          className={
            i === active
              ? tone === 'dark'
                ? 'text-paper'
                : 'text-ink'
              : i < active
                ? tone === 'dark'
                  ? 'text-paper/55'
                  : 'text-ink/55'
                : tone === 'dark'
                  ? 'text-paper/25'
                  : 'text-ink/30'
          }
        >
          {String(i + 1).padStart(2, '0')} {s}
        </li>
      ))}
    </ol>
  )
}
