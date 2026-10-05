import { useReducedMotion } from 'motion/react'
import { DESKTOP, useMediaQuery } from './useMediaQuery'

// Pinned, scroll-scrubbed scenes on desktop only. Tablet/mobile get designed
// static layouts; reduced motion gets complete, still diagrams.
export function useStoryMode() {
  const desktop = useMediaQuery(DESKTOP)
  const reduce = useReducedMotion()
  return { pinned: desktop && !reduce, desktop, reduce: !!reduce }
}
