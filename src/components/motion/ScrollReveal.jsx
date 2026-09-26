import { motion } from 'motion/react'

const presets = {
  rise: { hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } },
  scale: { hidden: { opacity: 0, y: 30, scale: 0.94 }, shown: { opacity: 1, y: 0, scale: 1 } },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(18% 0% 18% 0% round 28px)' },
    shown: { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' },
  },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
}

// One-shot in-view reveal. Compose with `delay` for manual staggering,
// or wrap children in <RevealGroup> for automatic stagger.
export function ScrollReveal({
  as = 'div',
  preset = 'rise',
  delay = 0,
  duration = 0.9,
  amount = 0.25,
  className,
  children,
  ...rest
}) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      variants={presets[preset]}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function RevealGroup({ as = 'div', stagger = 0.1, amount = 0.2, className, children, ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      transition={{ staggerChildren: stagger }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function RevealItem({ as = 'div', preset = 'rise', className, children, ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      variants={presets[preset]}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
