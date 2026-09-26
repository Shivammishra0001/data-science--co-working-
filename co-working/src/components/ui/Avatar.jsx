import { accentSolid, cx } from '../../utils/accents'

const initialsOf = (name) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// Initials avatar with a geometric cut — stands in until real photos exist.
export function Avatar({ name, initials, photo, accent = 'sun', size = 'md', className }) {
  const sizes = { sm: 'size-9 text-xs', md: 'size-12 text-sm', lg: 'size-16 text-base' }
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        loading="lazy"
        className={cx('rounded-full object-cover', sizes[size], className)}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cx(
        'relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-display font-extrabold',
        accentSolid[accent],
        sizes[size],
        className,
      )}
    >
      <span className="absolute -right-1/4 -bottom-1/4 size-3/4 rotate-45 bg-black/10" />
      <span className="relative">{initials ?? initialsOf(name)}</span>
    </span>
  )
}
