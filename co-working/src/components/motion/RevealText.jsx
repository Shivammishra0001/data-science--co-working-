import { motion } from 'motion/react'
import { cx } from '../../utils/accents'

// Line-by-line masked reveal. Each line rises out of its own clip box,
// staggered — used for display headlines. `lines` is an array so line
// breaks are authored, not left to the browser.
export function RevealText({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  amount = 0.4,
  ...rest
}) {
  const MotionTag = motion[Tag] ?? motion.h2
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      {...rest}
    >
      {lines.map((line, i) => (
        <span key={i} className={cx('block overflow-hidden pb-[0.06em]', lineClassName)}>
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: { y: '105%', rotate: 2 },
              shown: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
