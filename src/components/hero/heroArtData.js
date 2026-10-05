// Shared art data for the hero robots (HeroBots strip + HeroActors free-roaming).
export const W = 1000
export const H = 480
export const OUTLINE = '#cfcaf0'
export const INK = '#0b0b12'
export const PAPER = '#f3f0e8'
export const C = { sun: '#ffd33d', mint: '#3fdb94', iris: '#b79cff', flare: '#ff5b22', volt: '#8196ff', pink: '#ff6fa8' }

export const robots = [
  { id: 'research', label: 'Research', x: 140, y: 420, accent: C.mint, mouth: 'none', delay: 0 },
  { id: 'build', label: 'Build', x: 380, y: 410, accent: C.mint, mouth: 'none', delay: 0.6 },
  { id: 'connect', label: 'Connect', x: 625, y: 428, accent: C.mint, mouth: 'smile', delay: 1.1 },
  { id: 'ship', label: 'Ship', x: 865, y: 414, accent: C.sun, mouth: 'o', delay: 0.3 },
]

// floating icons: position, glyph, colour, parallax depth (bigger = moves more)
export const icons = [
  { x: 110, y: 100, r: 28, glyph: 'eye', color: C.mint, depth: 1.4, delay: 0 },
  { x: 250, y: 70, r: 0, glyph: 'spark', color: C.mint, depth: 0.8, delay: 1.2 },
  { x: 300, y: 128, r: 26, glyph: 'code', color: C.sun, depth: 1.1, delay: 0.5 },
  { x: 490, y: 96, r: 24, glyph: 'lens', color: PAPER, depth: 0.9, delay: 2 },
  { x: 610, y: 92, r: 22, glyph: 'target', color: PAPER, depth: 1.2, delay: 1.6 },
  { x: 760, y: 70, r: 24, glyph: 'heart', color: C.pink, depth: 1.5, delay: 0.9 },
  { x: 905, y: 46, r: 18, glyph: 'cube', color: C.volt, depth: 0.7, delay: 2.4 },
  { x: 960, y: 102, r: 22, glyph: 'nodes', color: PAPER, depth: 1, delay: 0.2 },
  { x: 965, y: 236, r: 0, glyph: 'spark', color: C.flare, depth: 1.3, delay: 1.8 },
  { x: 40, y: 300, r: 0, glyph: 'dot', color: PAPER, depth: 0.6, delay: 0.7 },
  { x: 520, y: 330, r: 0, glyph: 'dot', color: PAPER, depth: 0.5, delay: 2.2 },
]

