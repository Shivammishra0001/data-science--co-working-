import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

// Routes ("/market-push", "/#projects") go through the router — no full reload.
// In-page anchors ("#contact") and external URLs stay plain <a>.
export const SmartLink = forwardRef(function SmartLink({ href = '#', ...rest }, ref) {
  if (href.startsWith('/')) return <Link ref={ref} to={href} {...rest} />
  return <a ref={ref} href={href} {...rest} />
})
