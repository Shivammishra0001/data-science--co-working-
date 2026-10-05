import { motion } from 'motion/react'
import { ArrowDown, RotateCcw } from 'lucide-react'
import { accentSolid, cx } from '../../utils/accents'

// The loop, unrolled: mobile + reduced-motion equivalent of LoopDiagram.
// Same content, vertical, with the return-to-start made explicit.
export function LoopList({ stages, tone = 'dark', returnLabel = 'Back to the start' }) {
  const line = tone === 'dark' ? 'bg-line-strong' : 'bg-ink/20'
  const dim = tone === 'dark' ? 'text-paper/70' : 'text-ink/70'
  return (
    <ol className="relative">
      {stages.map((st, i) => (
        <motion.li
          key={st.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid grid-cols-[3rem_1fr] gap-4 pb-8"
        >
          <div className="flex flex-col items-center">
            <span className={cx('grid size-12 place-items-center rounded-full font-mono text-xs font-semibold', accentSolid[st.accent] ?? 'bg-flare text-ink')}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className={cx('mt-2 w-px flex-1', line)} />
          </div>
          <div className="pt-1">
            <h3 className="display text-[clamp(2.2rem,9vw,3.4rem)] leading-[0.9]">{st.label}</h3>
            <p className={cx('mt-2 text-lg leading-snug', dim)}>{st.copy}</p>
            {i < stages.length - 1 && <ArrowDown aria-hidden="true" className={cx('mt-4 size-4', dim)} />}
          </div>
        </motion.li>
      ))}
      {returnLabel && (
        <li className={cx('flex items-center gap-3 pl-1 font-mono text-xs tracking-[0.14em] uppercase', dim)}>
          <RotateCcw aria-hidden="true" className="size-4" />
          {returnLabel}
        </li>
      )}
    </ol>
  )
}
