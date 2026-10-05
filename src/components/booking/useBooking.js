import { createContext, useContext } from 'react'

export const BookingContext = createContext({ openBooking: () => {} })
// openBooking() — opens the "Grab your seat" form from anywhere.
export const useBooking = () => useContext(BookingContext)
