// About page motion helpers: easing windows, edge geometry and the procedural
// networks (hero growth, idea → real world, future rings). Framework-free.

export const clamp01 = (v) => Math.max(0, Math.min(1, v))
export const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a || 1e-6))
  return t * t * (3 - 2 * t)
}
// visibility of something that appears at `at` and (optionally) leaves at `until`
export const appear = (v, at = 0, until) => {
  const inn = at <= 0 ? 1 : smooth(at - 0.02, at + 0.015, v)
  return until ? inn * (1 - smooth(until - 0.025, until, v)) : inn
}

export const ACC = {
  sun: '#ffd33d',
  flare: '#ff5b22',
  iris: '#b79cff',
  mint: '#3fdb94',
  volt: '#8196ff',
  voltDeep: '#3f5bff',
  paper: '#f3f0e8',
  ink: '#08080b',
}

export function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Edge path: straight, quadratic (`curve` = bow as a fraction of length, sign =
// side) or cubic (`c1`,`c2` absolute control points). Returns the SVG `d` and a
// point(t) sampler so signals can ride the exact same curve.
export function edgeGeometry(A, B, { curve = 0, c1, c2 } = {}) {
  if (c1 && c2) {
    const point = (t) => {
      const u = 1 - t
      return {
        x: u * u * u * A.x + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * B.x,
        y: u * u * u * A.y + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * B.y,
      }
    }
    return { d: `M${A.x} ${A.y} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${B.x} ${B.y}`, point }
  }
  if (!curve) {
    return { d: `M${A.x} ${A.y} L${B.x} ${B.y}`, point: (t) => ({ x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t }) }
  }
  const len = Math.hypot(B.x - A.x, B.y - A.y)
  const mx = (A.x + B.x) / 2 - ((B.y - A.y) / len) * curve * len
  const my = (A.y + B.y) / 2 + ((B.x - A.x) / len) * curve * len
  const point = (t) => {
    const u = 1 - t
    return { x: u * u * A.x + 2 * u * t * mx + t * t * B.x, y: u * u * A.y + 2 * u * t * my + t * t * B.y }
  }
  return { d: `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`, point }
}

// Stage (1-based of n) → progress threshold, leaving a small lead-in.
export const stageAt = (stage, n) => (stage - 1) / n + 0.02

const polar = (cx, cy, r, a) => ({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
const nearest = (p, list) => list.reduce((best, q) => (Math.hypot(q.x - p.x, q.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? q : best), list[0])

// ── Hero: one point → people → knowledge → collaboration ──────────────────
export function heroNetwork({ cx = 640, cy = 360, dense = true } = {}) {
  const rand = seeded(11)
  const colors = ['sun', 'iris', 'mint', 'volt', 'flare']
  const nodes = [{ id: 'c', x: cx, y: cy, kind: 'core', r: 12, accent: 'sun', at: 0, pulse: true }]
  const edges = []
  const ring = (count, r, jitter, at0, at1, kind, rr, prefix, parents) => {
    const out = []
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rand() * 0.5 - 0.25 + (prefix === 'b' ? 0.3 : 0)
      const p = polar(cx, cy, r + (rand() - 0.5) * jitter, a)
      const at = at0 + (i / count) * (at1 - at0)
      const n = { id: `${prefix}${i}`, x: p.x, y: p.y, kind, r: rr, accent: colors[i % colors.length], at }
      nodes.push(n)
      out.push(n)
      const par = parents ? nearest(p, parents) : nodes[0]
      edges.push({ from: par.id, to: n.id, at: at - 0.035, dur: 0.035, accent: n.accent, flow: kind === 'node' })
    }
    return out
  }
  const r1 = ring(3, 115, 20, 0.12, 0.26, 'node', 7, 'a', null)
  const r2 = ring(9, 215, 50, 0.32, 0.55, 'node', 5, 'b', r1)
  const r3 = dense ? ring(24, 330, 90, 0.6, 0.86, 'dot', 3, 'd', r2) : []
  // collaboration: cross-links between neighbours
  r2.forEach((n, i) => edges.push({ from: n.id, to: r2[(i + 1) % r2.length].id, at: 0.7 + i * 0.012, dur: 0.04, accent: 'paper', dim: true }))
  r3.forEach((n, i) => i % 3 === 0 && edges.push({ from: n.id, to: r3[(i + 2) % r3.length].id, at: 0.84 + (i / r3.length) * 0.1, dur: 0.04, accent: 'paper', dim: true }))
  return { nodes, edges }
}

// ── Idea → real world: the network literally grows stage by stage ─────────
export function ideaWorldNetwork({ dense = true } = {}) {
  const S = (i) => i / 8 + 0.02 // 8 stages
  const rand = seeded(29)
  const C = { x: 330, y: 380 }
  const nodes = [{ id: 'idea', x: C.x, y: C.y, kind: 'core', r: 13, accent: 'sun', at: 0, label: 'Idea', lp: 'b', pulse: true }]
  const edges = []
  // research: knowledge around the idea
  for (let i = 0; i < 6; i++) {
    const p = polar(C.x, C.y, 62, (i / 6) * Math.PI * 2 + 0.3)
    nodes.push({ id: `k${i}`, ...p, kind: 'dot', r: 4, accent: 'iris', at: S(1) + i * 0.012 })
    edges.push({ from: 'idea', to: `k${i}`, at: S(1) + i * 0.012 - 0.02, dur: 0.025, accent: 'iris', dim: true })
  }
  // prototype: structure — a pentagon around the idea
  const P = []
  for (let i = 0; i < 5; i++) {
    const p = polar(C.x, C.y, 140, (i / 5) * Math.PI * 2 - Math.PI / 2)
    P.push({ id: `p${i}`, ...p })
    nodes.push({ id: `p${i}`, ...p, kind: 'node', r: 8, accent: 'sun', at: S(2) + i * 0.015 })
    edges.push({ from: 'idea', to: `p${i}`, at: S(2) + i * 0.015 - 0.02, dur: 0.03, accent: 'sun' })
  }
  // MVP: the ring closes and signals start moving around it
  for (let i = 0; i < 5; i++) edges.push({ from: `p${i}`, to: `p${(i + 1) % 5}`, at: S(3) + i * 0.012, dur: 0.03, accent: 'mint', flow: true, w: 2.2 })
  // validation: first outside users
  const V = []
  for (let i = 0; i < 7; i++) {
    const p = { x: 600 + rand() * 90, y: 210 + (i / 6) * 340 + (rand() - 0.5) * 30 }
    V.push(p)
    nodes.push({ id: `v${i}`, ...p, kind: 'dot', r: 5, accent: 'volt', at: S(4) + i * 0.012 })
    const par = nearest(p, P)
    edges.push({ from: par.id, to: `v${i}`, at: S(4) + i * 0.012 - 0.015, dur: 0.025, accent: 'volt', dim: true })
  }
  // AI Shark: experts challenge the system (dashed)
  ;[[190, 95], [330, 70], [470, 95]].forEach(([x, y], i) => {
    nodes.push({ id: `x${i}`, x, y, kind: 'node', r: 8, accent: 'flare', at: S(5) + i * 0.015, label: i === 1 ? 'Experts' : undefined, lp: 't' })
    edges.push({ from: `x${i}`, to: 'idea', at: S(5) + i * 0.015, dur: 0.035, accent: 'flare', dashed: true, tag: i === 1 ? 'Challenge' : undefined })
  })
  // Market Push: out through the workspace boundary
  nodes.push({ id: 'mp', x: 760, y: 380, kind: 'pill', label: 'Market Push', accent: 'sun', at: S(6), small: true })
  edges.push({ from: 'p1', to: 'mp', at: S(6) - 0.01, dur: 0.035, accent: 'sun', flow: true, w: 2 })
  edges.push({ from: 'p2', to: 'mp', at: S(6), dur: 0.035, accent: 'sun', flow: true, w: 2 })
  const CH = [[905, 230], [935, 380], [905, 530]]
  CH.forEach(([x, y], i) => {
    nodes.push({ id: `ch${i}`, x, y, kind: 'node', r: 7, accent: 'sun', at: S(6) + 0.03 + i * 0.012 })
    edges.push({ from: 'mp', to: `ch${i}`, at: S(6) + 0.02 + i * 0.012, dur: 0.03, accent: 'sun' })
  })
  // Live: many users
  const L = dense ? 34 : 14
  for (let i = 0; i < L; i++) {
    const ch = CH[i % 3]
    const p = polar(ch[0], ch[1], 45 + rand() * 75, rand() * Math.PI * 2)
    p.x = Math.min(990, p.x)
    p.y = Math.max(40, Math.min(700, p.y))
    const at = S(7) + (i / L) * 0.1
    nodes.push({ id: `u${i}`, ...p, kind: 'dot', r: 3.2, accent: 'mint', at })
    if (i % 2 === 0) edges.push({ from: `ch${i % 3}`, to: `u${i}`, at: at - 0.01, dur: 0.02, accent: 'mint', dim: true, flow: i % 6 === 0 })
  }
  const frames = [{ id: 'ws', label: 'Workspace', x: 150, y: 200, w: 370, h: 360, at: S(2) }]
  return { nodes, edges, frames }
}

// ── Future: dots filling the city / country / global rings ─────────────────
export function futureDots({ cx = 500, cy = 500, dense = true } = {}) {
  const rand = seeded(47)
  const bands = [
    { r0: 150, r1: 215, count: dense ? 16 : 8, at: 0.5, accent: 'mint' },
    { r0: 245, r1: 320, count: dense ? 30 : 14, at: 0.65, accent: 'volt' },
    { r0: 350, r1: 445, count: dense ? 56 : 22, at: 0.8, accent: 'iris' },
  ]
  return bands.flatMap((b, bi) =>
    Array.from({ length: b.count }, (_, i) => {
      const p = polar(cx, cy, b.r0 + rand() * (b.r1 - b.r0), rand() * Math.PI * 2)
      return { id: `f${bi}-${i}`, ...p, r: 2 + rand() * 2.2, accent: b.accent, at: b.at + rand() * 0.1 }
    }),
  )
}
