import { cx } from '../../utils/accents'

// A community's real logo, tinted via CSS mask (same technique and assets as the
// landing-page Technology Communities wall). Sized by height; width follows the
// asset's aspect ratio.
export function BrandLogo({ community, className, decorative = false, tint = true }) {
  const { logo, theme } = community
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : logo.alt}
      aria-hidden={decorative || undefined}
      className={cx('inline-block shrink-0', className)}
      style={{
        aspectRatio: logo.aspect,
        background: tint ? theme.logoFill : 'currentColor',
        WebkitMask: `url(${logo.src}) center / contain no-repeat`,
        mask: `url(${logo.src}) center / contain no-repeat`,
      }}
    />
  )
}
