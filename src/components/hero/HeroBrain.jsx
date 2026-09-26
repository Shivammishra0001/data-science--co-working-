import { motion } from 'motion/react'
import { frameSrc } from '../../data/story'
import { cx } from '../../utils/accents'

// Labels orbit the brain at fixed polar-ish positions (percent of the brain box).
const labels = [
  { text: 'AI', x: 20, y: 18, delay: 0 },
  { text: 'Data', x: 76, y: 12, delay: 1.2 },
  { text: 'Research', x: 88, y: 44, delay: 2.1 },
  { text: 'Build', x: 8, y: 52, delay: 0.6 },
  { text: 'Community', x: 70, y: 84, delay: 1.7 },
  { text: 'Product', x: 20, y: 82, delay: 2.6 },
  { text: 'Innovation', x: 46, y: 5, delay: 3.1 },
]

export function HeroBrain({ className, style }) {
  return (
    <motion.div className={cx('pointer-events-none aspect-[16/9]', className)} style={style}>
      <motion.img
        src={frameSrc(0)}
        alt=""
        width={640}
        height={360}
        fetchPriority="high"
        className="frame-blend absolute inset-0 size-full object-contain"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
      <ul aria-hidden="true" className="absolute inset-0 hidden lg:block">
        {labels.map((l, i) => (
          <motion.li
            key={l.text}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${l.x}%`, top: `${l.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="animate-drift inline-flex items-center gap-2 rounded-full border border-paper/15 bg-ink/55 px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.16em] text-paper/80 uppercase backdrop-blur-sm"
              style={{ animationDelay: `${l.delay}s` }}
            >
              <span className="size-1.5 rounded-full bg-sun" />
              {l.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
