import { useEffect, useRef, useState } from 'react'

// Preloads an image sequence once and decodes it off the main thread
// (img.decode) so scrubbing never waits on a network or decode.
// Returns a stable ref to the Image array plus how many are ready.
const cache = new Map()

function load(srcs) {
  const key = srcs.join('|')
  if (cache.has(key)) return cache.get(key)
  const images = srcs.map((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    return img
  })
  const entry = {
    images,
    ready: Promise.all(images.map((img) => img.decode().catch(() => undefined))),
  }
  cache.set(key, entry)
  return entry
}

export function useFrameSequence(srcs, { enabled = true } = {}) {
  const imagesRef = useRef([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let alive = true
    const entry = load(srcs)
    imagesRef.current = entry.images
    entry.ready.then(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
    // callers pass module-level arrays, so `srcs` is referentially stable
  }, [enabled, srcs])

  return { imagesRef, loaded }
}
