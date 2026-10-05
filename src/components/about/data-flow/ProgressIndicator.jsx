import { useEffect, useState } from 'react'
import { chapters } from '../../../data/about/story'
import { cx } from '../../../utils/accents'

// Quiet vertical chapter rail (desktop xl+). The chapter whose section crosses
// the middle of the viewport is current. mix-blend-difference keeps it legible
// on both dark and light sections without swapping colours.
export function ProgressIndicator() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const els = [...document.querySelectorAll('[data-chapter]')]
    const visible = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting))
        const hit = els.find((el) => visible.get(el))
        setActive(hit ? hit.dataset.chapter : null)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="About page chapters"
      className={cx(
        'fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 text-white mix-blend-difference transition-opacity duration-500 xl:block',
        active ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ol className="flex flex-col gap-2.5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
        {chapters.map((c, i) => {
          const on = c.id === active
          return (
            <li key={c.id}>
              <a href={c.href} aria-current={on ? 'step' : undefined} className={cx('group flex flex-row-reverse items-center gap-2 transition-opacity duration-300', on ? 'opacity-100' : 'opacity-35 hover:opacity-80')}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className={cx('h-px bg-current transition-[width] duration-300', on ? 'w-5' : 'w-2.5')} />
                {/* only the current chapter spells its name — keeps the rail out of the content */}
                <span className={on ? '' : 'sr-only group-hover:not-sr-only'}>{c.label}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
