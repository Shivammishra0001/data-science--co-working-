import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../utils/accents'

// Native <dialog>: focus trap, Escape and inert background for free.
// Controlled by `open`; `onClose` fires on Escape, backdrop click or ✕.
export function Dialog({ open, onClose, title, description, children, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose?.()}
      className={cx(
        'm-auto w-[min(92vw,28rem)] rounded-2xl border border-line-strong bg-ink-2 p-0 text-paper backdrop:bg-black/60 open:animate-fade-in',
        className,
      )}
    >
      {open && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="dialog-title" className="text-xl font-semibold">
                {title}
              </h2>
              {description && <p className="mt-1.5 text-sm text-paper/65">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="-mt-1 -mr-2 grid size-9 place-items-center rounded-full text-paper/60 hover:bg-paper/10 hover:text-paper">
              <X aria-hidden="true" className="size-4.5" />
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  )
}
