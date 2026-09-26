import { createContext, useContext } from 'react'

export const ParticipationContext = createContext(null)
export const useParticipation = () => useContext(ParticipationContext)
