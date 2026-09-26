import { brand } from '../../config/site'
import { cx } from '../../utils/accents'
import { SmartLink } from '../ui/SmartLink'

// Chrysalis mark: a cocoon cut through a disc — the space between idea and launch.
export function BrandMark({ className, withName = true, tone = 'light' }) {
  return (
    <SmartLink href="/" className={cx('group inline-flex items-center gap-3', className)} aria-label={`${brand.name} — home`}>
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="size-11 shrink-0 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-[20deg] sm:size-12"
      >
        <circle cx="24" cy="24" r="23" fill={tone === 'light' ? '#f3f0e8' : '#08080b'} />
        <path
          d="M24 8c6.5 5.2 9 11 9 16.2S30.4 35 24 40c-6.4-5-9-10.6-9-15.8S17.5 13.2 24 8Z"
          fill={tone === 'light' ? '#08080b' : '#f3f0e8'}
          transform="rotate(-28 24 24)"
        />
        <circle cx="31.5" cy="15" r="3.2" fill="#ffd33d" />
      </svg>
      {withName && (
        <span className="display-upright text-[1.35rem] leading-none tracking-wide">{brand.name}</span>
      )}
    </SmartLink>
  )
}
