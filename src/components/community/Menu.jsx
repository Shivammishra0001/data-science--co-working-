import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '../../utils/accents'

// Small popover menu: toggles on click, closes on outside click / Escape /
// selection, returns focus to its trigger. Arrow keys move between items.
export function Menu({ label, trigger, items, align = 'right', side = 'bottom', className }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const els = [...rootRef.current.querySelectorAll('[role=menuitem]')]
        const i = els.indexOf(document.activeElement)
        els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    rootRef.current?.querySelector('[role=menuitem]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm text-paper/70 transition-colors hover:bg-paper/[0.07] hover:text-paper aria-expanded:bg-paper/[0.07]"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          className={cx(
            'animate-fade-in absolute z-30 min-w-[12rem]',
            side === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1',
            ' rounded-lg border border-line-strong bg-ink-3 p-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.filter(Boolean).map((it) =>
            it.href ? (
              <a
                key={it.label}
                role="menuitem"
                href={it.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-paper/85 hover:bg-paper/[0.08] focus:bg-paper/[0.08] focus:outline-none"
              >
                {it.icon && <it.icon aria-hidden="true" className="size-4 text-paper/55" />}
                {it.label}
              </a>
            ) : (
              <button
                key={it.label}
                role="menuitem"
                type="button"
                onClick={() => {
                  setOpen(false)
                  btnRef.current?.focus()
                  it.onSelect()
                }}
                className={cx(
                  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm hover:bg-paper/[0.08] focus:bg-paper/[0.08] focus:outline-none',
                  it.danger ? 'text-flare' : 'text-paper/85',
                )}
              >
                {it.icon && <it.icon aria-hidden="true" className={cx('size-4', it.danger ? 'text-flare' : 'text-paper/55')} />}
                {it.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
