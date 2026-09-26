import { useCallback, useRef, useState } from 'react'
import { Check, Info } from 'lucide-react'
import { ToastContext } from './useToast'

// Lightweight feedback: "Joined OpenAI", "Post published"… One line, fades in,
// leaves after ~2.6s. Announced politely to screen readers.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const toast = useCallback((message, { tone = 'success', duration = 2600 } = {}) => {
    const id = ++idRef.current
    setToasts((t) => [...t.slice(-2), { id, message, tone, leaving: false }])
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), duration)
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration + 220)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast-in flex items-center gap-2.5 rounded-full border border-line-strong bg-ink-3 py-2.5 pr-5 pl-3 text-sm text-paper shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] transition-opacity duration-200 ${t.leaving ? 'opacity-0' : 'opacity-100'}`}
          >
            <span className={`grid size-6 place-items-center rounded-full ${t.tone === 'success' ? 'bg-mint text-ink' : 'bg-paper/15 text-paper'}`}>
              {t.tone === 'success' ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : <Info aria-hidden="true" className="size-3.5" />}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
