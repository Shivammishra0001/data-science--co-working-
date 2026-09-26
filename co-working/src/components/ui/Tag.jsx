import { cx } from '../../utils/accents'

export function Tag({ children, tone = 'dark', className }) {
  return (
    <span
      className={cx(
        'inline-flex h-7 items-center rounded-full border px-3 font-mono text-[0.7rem] tracking-wide uppercase',
        tone === 'dark' ? 'border-line-strong text-paper/80' : 'border-ink/20 text-ink/75',
        className,
      )}
    >
      {children}
    </span>
  )
}
