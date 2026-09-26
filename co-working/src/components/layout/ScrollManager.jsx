import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// New page → top. Hash (e.g. "/#projects" from another page) → that section,
// once it has rendered (lazy routes may take a frame or two).
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    let tries = 0
    let raf = 0
    const seek = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      else if (tries++ < 30) raf = requestAnimationFrame(seek)
    }
    seek()
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}
