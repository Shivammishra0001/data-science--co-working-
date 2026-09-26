import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '../../hooks/useMagnetic'
import { cx } from '../../utils/accents'
import { SmartLink } from './SmartLink'

const MotionLink = motion.create(SmartLink)

const variants = {
  solid: 'bg-paper text-ink hover:bg-sun',
  ink: 'bg-ink text-paper hover:bg-volt',
  outline: 'text-current ring-2 ring-inset ring-current hover:bg-paper hover:text-ink hover:ring-paper',
  'outline-ink': 'text-ink ring-2 ring-inset ring-ink hover:bg-ink hover:text-paper',
  sun: 'bg-sun text-ink hover:bg-paper',
  flare: 'bg-flare text-ink hover:bg-paper',
}

const sizes = {
  sm: 'h-10 px-4 text-[0.8rem]',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-7 text-[0.95rem] sm:h-16 sm:px-9',
}

// Pill CTA. Magnetic on fine pointers; the arrow nudges on hover.
export function PillButton({
  href,
  children,
  variant = 'solid',
  size = 'md',
  arrow = false,
  magnetic = true,
  className,
  ...rest
}) {
  const mag = useMagnetic(0.2)
  const magProps = magnetic ? mag : {}
  return (
    <MotionLink
      href={href}
      {...magProps}
      className={cx(
        'group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold tracking-[0.06em] uppercase',
        'transition-[background-color,color,box-shadow] duration-300 ease-[var(--ease-soft)]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
        />
      )}
    </MotionLink>
  )
}
