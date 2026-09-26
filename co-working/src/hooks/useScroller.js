import { useEffect, useState } from 'react'

// Native horizontal scroller: touch/trackpad/keyboard scrolling all work,
// snap points keep cards aligned, buttons page by ~one viewport of cards.
// Uses a callback ref (state) so render never reads a ref.
export function useScroller() {
  const [el, setRef] = useState(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth - 2
      setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [el])

  const page = (dir) => {
    el?.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return { setRef, edge, page }
}
