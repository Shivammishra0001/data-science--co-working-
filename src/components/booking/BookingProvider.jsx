import { lazy, Suspense, useCallback, useState } from 'react'
import { BookingContext } from './useBooking'

// The form is its own chunk: it only downloads the first time someone opens it.
const BookingDialog = lazy(() => import('./BookingDialog'))

export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const openBooking = useCallback(() => {
    setMounted(true)
    setOpen(true)
  }, [])
  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      {mounted && (
        <Suspense fallback={null}>
          <BookingDialog open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </BookingContext.Provider>
  )
}
