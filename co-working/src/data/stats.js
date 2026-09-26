// Impact numbers — PLACEHOLDER until wired to the stats endpoint.
// `value` is numeric so counters can animate; `suffix` is appended as-is.
export const headlineStat = { value: 10000, suffix: '+', label: 'Builders', sample: true }

export const stats = [
  { id: 'projects', value: 640, suffix: '+', label: 'Projects started', sample: true },
  { id: 'launched', value: 48, suffix: '', label: 'Products launched', sample: true },
  { id: 'experts', value: 120, suffix: '+', label: 'Experts', sample: true },
  { id: 'communities', value: 9, suffix: '', label: 'Communities', sample: true },
  { id: 'events', value: 300, suffix: '+', label: 'Events', sample: true },
  { id: 'reached', value: 250, suffix: 'K', label: 'Users reached', sample: true },
]

// Mosaic tiles for the community wall (sits on volt — so no volt tiles). `photo` optional; initials otherwise.
export const mosaic = [
  { initials: 'AR', accent: 'sun', span: 'tall' },
  { initials: 'KM', accent: 'paper' },
  { initials: 'MS', accent: 'flare', span: 'wide', badge: 'shipped' },
  { initials: 'RV', accent: 'mint' },
  { initials: 'SK', accent: 'iris' },
  { initials: 'DP', accent: 'paper', span: 'tall' },
  { initials: 'NJ', accent: 'flare' },
  { initials: 'TA', accent: 'sun', span: 'wide' },
  { initials: 'YB', accent: 'flare', badge: 'idea' },
  { initials: 'LC', accent: 'mint' },
  { initials: 'IG', accent: 'iris', span: 'wide' },
  { initials: 'PH', accent: 'sun' },
]
