import { useEffect, useRef } from 'react'

// Binds an SVG `transform` attribute to a MotionValue<string>. Motion's own
// transform handling on SVG groups uses CSS transform-box, which doesn't match
// viewBox coordinates; writing the attribute directly keeps geometry exact and
// never re-renders React on scroll.
export function useSvgTransform(value) {
  const ref = useRef(null)
  useEffect(() => {
    const set = (v) => ref.current?.setAttribute('transform', v)
    set(value.get())
    return value.on('change', set)
  }, [value])
  return ref
}
