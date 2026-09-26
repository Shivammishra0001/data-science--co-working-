// Canvas 2D neural field — branching "neurons", cross-links that appear as
// connectivity rises, and signals that travel edge-to-edge and propagate.
// Framework-free: the React wrapper (NeuralField) owns lifecycle + inputs.
//
// Cost model: ~N nodes, N-trees tree edges, ≤ MAX_CROSS cross edges, ≤ MAX_SIGNALS
// signals. Everything is O(N) per frame; no per-frame allocation in the hot path
// except signal spawning.

const PALETTE = ['#ffd33d', '#ff5b22', '#b79cff', '#3fdb94', '#8196ff']
const MAX_SIGNALS = 260
const MAX_CROSS = 320

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const DENSITY = {
  low: { trees: 4, depth: 5, dendrites: 4 },
  medium: { trees: 5, depth: 6, dendrites: 4 },
  high: { trees: 7, depth: 6, dendrites: 5 },
}

function build(width, height, density, seed) {
  const cfg = DENSITY[density] ?? DENSITY.medium
  const rand = rng(seed)
  const nodes = []
  const edges = [] // [a, b] tree edges
  const minSide = Math.min(width, height)
  const baseLen = minSide * (density === 'low' ? 0.09 : 0.075)

  const addNode = (x, y, tree, depth, parent) => {
    const n = {
      x0: x,
      y0: y,
      x,
      y,
      tree,
      depth,
      color: PALETTE[tree % PALETTE.length],
      phase: rand() * Math.PI * 2,
      amp: 1.5 + rand() * 4 + depth * 0.6,
      glow: 0,
      adj: [],
      cross: [],
    }
    nodes.push(n)
    const i = nodes.length - 1
    if (parent != null) {
      edges.push([parent, i])
      nodes[parent].adj.push(i)
      n.adj.push(parent)
    }
    return i
  }

  const grow = (parent, x, y, angle, len, depth, tree) => {
    if (depth > cfg.depth) return
    // bend a little along the way — dendrites are never straight
    const a = angle + (rand() - 0.5) * 0.5
    const nx = x + Math.cos(a) * len
    const ny = y + Math.sin(a) * len
    const i = addNode(nx, ny, tree, depth, parent)
    const kids = depth < 2 ? 2 : rand() < 0.22 ? 3 : rand() < 0.85 ? 2 : 1
    for (let k = 0; k < kids; k++) {
      const spread = 0.35 + rand() * 0.45
      grow(i, nx, ny, a + (k - (kids - 1) / 2) * spread, len * (0.74 + rand() * 0.12), depth + 1, tree)
    }
  }

  const somas = []
  for (let t = 0; t < cfg.trees; t++) {
    // somas on a loose ring, then jittered — keeps the field balanced
    const ring = (t / cfg.trees) * Math.PI * 2 + rand() * 0.6
    const r = 0.18 + rand() * 0.2
    const sx = width * (0.5 + Math.cos(ring) * r * (width > height ? 1.25 : 0.9))
    const sy = height * (0.5 + Math.sin(ring) * r)
    const s = addNode(sx, sy, t, 0, null)
    nodes[s].soma = true
    somas.push(s)
    const rot = rand() * Math.PI * 2
    for (let d = 0; d < cfg.dendrites; d++) {
      grow(s, sx, sy, rot + (d / cfg.dendrites) * Math.PI * 2, baseLen * (0.8 + rand() * 0.5), 1, t)
    }
  }

  // Cross-links between different neurons, ranked nearest-first. Connectivity
  // (0–1) reveals them in rank order: the network "finds" itself.
  const leaves = nodes.map((n, i) => i).filter((i) => nodes[i].depth >= 3)
  const reach = minSide * 0.16
  const cand = []
  for (let p = 0; p < leaves.length; p++) {
    const a = nodes[leaves[p]]
    let best = -1
    let bestD = reach
    for (let q = 0; q < leaves.length; q++) {
      const b = nodes[leaves[q]]
      if (b.tree === a.tree) continue
      const d = Math.hypot(a.x0 - b.x0, a.y0 - b.y0)
      if (d < bestD) {
        bestD = d
        best = leaves[q]
      }
    }
    if (best >= 0 && leaves[p] < best) cand.push([leaves[p], best, bestD])
  }
  cand.sort((u, v) => u[2] - v[2])
  const cross = cand.slice(0, MAX_CROSS).map(([a, b], i, arr) => ({ a, b, rank: (i + 1) / arr.length }))
  for (const c of cross) {
    nodes[c.a].cross.push(c)
    nodes[c.b].cross.push(c)
  }

  // centre node = nearest to the middle, used for "central signal" bursts
  let center = 0
  let cd = Infinity
  nodes.forEach((n, i) => {
    const d = Math.hypot(n.x0 - width / 2, n.y0 - height / 2)
    if (d < cd) {
      cd = d
      center = i
    }
  })

  return { nodes, edges, cross, somas, center }
}

export function createNeuralField(canvas, { density = 'medium', seed = 7, connectivity = 0.3 } = {}) {
  const ctx = canvas.getContext('2d')
  let net = null
  let w = 0
  let h = 0
  let dpr = 1
  let conn = connectivity
  let kick = 0
  let kickTarget = 0
  let pointer = null
  let hover = -1
  let signals = []
  let raf = 0
  let running = false
  let last = 0
  let ambientClock = 0
  let ambient = true

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    w = canvas.clientWidth
    h = canvas.clientHeight
    if (!w || !h) return
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    net = build(w, h, density, seed)
    signals = []
    draw(performance.now())
  }

  const neighbours = (i) => {
    const n = net.nodes[i]
    const list = n.adj.slice()
    for (const c of n.cross) if (c.rank <= conn) list.push(c.a === i ? c.b : c.a)
    return list
  }

  const spawn = (from, to, hops, speed) => {
    if (signals.length >= MAX_SIGNALS) return
    signals.push({ from, to, t: 0, hops, speed, color: net.nodes[from].color })
  }

  // A signal starts at node `i` and ripples outward `hops` edges.
  const burst = (i = net?.center ?? 0, hops = 6, speed = 1.8) => {
    if (!net) return
    net.nodes[i].glow = 1
    for (const j of neighbours(i)) spawn(i, j, hops, speed)
  }

  const step = (now) => {
    const dt = Math.min(now - last, 50) / 1000
    last = now
    // scroll kick: spring toward target, target decays toward 0
    kick += (kickTarget - kick) * Math.min(1, dt * 6)
    kickTarget *= Math.pow(0.02, dt)

    if (ambient) {
      ambientClock += dt
      if (ambientClock > 1.4) {
        ambientClock = 0
        const s = net.somas[Math.floor(Math.random() * net.somas.length)]
        burst(s, 4, 1.2)
      }
    }

    // advance signals; arrivals light the node and propagate
    const next = []
    for (const s of signals) {
      s.t += dt * s.speed * 2.2
      if (s.t < 1) {
        next.push(s)
        continue
      }
      const node = net.nodes[s.to]
      node.glow = Math.min(1, node.glow + 0.8)
      if (s.hops > 0) {
        const nb = neighbours(s.to).filter((k) => k !== s.from)
        // fan-out capped so bursts spread but don't explode
        for (let k = 0; k < Math.min(nb.length, 2); k++) {
          const pick = nb.length > 2 ? nb[Math.floor(Math.random() * nb.length)] : nb[k]
          if (next.length + 1 < MAX_SIGNALS) next.push({ from: s.to, to: pick, t: 0, hops: s.hops - 1, speed: s.speed, color: node.color })
        }
      }
    }
    signals = next
    draw(now)
    if (running) raf = requestAnimationFrame(step)
  }

  const position = (now) => {
    const t = now * 0.001
    const px = pointer?.x
    const py = pointer?.y
    const R = 130
    for (const n of net.nodes) {
      let x = n.x0 + Math.sin(t * 0.45 + n.phase) * n.amp
      let y = n.y0 + Math.cos(t * 0.38 + n.phase * 1.3) * n.amp
      y += kick * (0.25 + n.depth * 0.14)
      if (pointer) {
        const dx = x - px
        const dy = y - py
        const d = Math.hypot(dx, dy)
        if (d < R && d > 0.01) {
          const f = (1 - d / R) ** 2 * 16
          x += (dx / d) * f
          y += (dy / d) * f
          n.glow = Math.max(n.glow, (1 - d / R) * 0.5)
        }
      }
      n.x = x
      n.y = y
      n.glow *= 0.94
    }
  }

  const draw = (now) => {
    if (!net) return
    position(now)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.lineCap = 'round'

    // tree edges, batched per neuron colour
    const byColor = new Map()
    for (const [a, b] of net.edges) {
      const c = net.nodes[a].color
      if (!byColor.has(c)) byColor.set(c, [])
      byColor.get(c).push(a, b)
    }
    ctx.lineWidth = 0.9
    ctx.globalAlpha = 0.42
    for (const [c, list] of byColor) {
      ctx.strokeStyle = c
      ctx.beginPath()
      for (let k = 0; k < list.length; k += 2) {
        const A = net.nodes[list[k]]
        const B = net.nodes[list[k + 1]]
        ctx.moveTo(A.x, A.y)
        ctx.lineTo(B.x, B.y)
      }
      ctx.stroke()
    }

    // cross-links fade in just past their rank
    ctx.strokeStyle = '#f3f0e8'
    ctx.lineWidth = 0.6
    for (const c of net.cross) {
      const vis = Math.min(1, (conn - c.rank) * 8)
      if (vis <= 0) continue
      ctx.globalAlpha = 0.16 * vis
      const A = net.nodes[c.a]
      const B = net.nodes[c.b]
      ctx.beginPath()
      ctx.moveTo(A.x, A.y)
      ctx.quadraticCurveTo((A.x + B.x) / 2, (A.y + B.y) / 2 - 12, B.x, B.y)
      ctx.stroke()
    }

    // nodes
    for (const n of net.nodes) {
      const r = n.soma ? 3.6 : n.depth >= 5 ? 1.6 : 1.1
      ctx.globalAlpha = n.soma ? 0.95 : 0.55 + n.glow * 0.45
      ctx.fillStyle = n.glow > 0.35 ? '#fff' : n.color
      ctx.beginPath()
      ctx.arc(n.x, n.y, r + n.glow * 2.2, 0, Math.PI * 2)
      ctx.fill()
    }

    // signals — additive glow
    ctx.globalCompositeOperation = 'lighter'
    for (const s of signals) {
      const A = net.nodes[s.from]
      const B = net.nodes[s.to]
      const x = A.x + (B.x - A.x) * s.t
      const y = A.y + (B.y - A.y) * s.t
      ctx.fillStyle = s.color
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x, y, 1.6, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }

  const nearest = (x, y, max = 22) => {
    let best = -1
    let bd = max
    for (let i = 0; i < net.nodes.length; i++) {
      const n = net.nodes[i]
      const d = Math.hypot(n.x - x, n.y - y)
      if (d < bd) {
        bd = d
        best = i
      }
    }
    return best
  }

  return {
    resize,
    start() {
      if (running || !net) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(step)
    },
    stop() {
      running = false
      cancelAnimationFrame(raf)
    },
    destroy() {
      running = false
      cancelAnimationFrame(raf)
      net = null
    },
    setConnectivity(v) {
      conn = v
      if (!running) draw(performance.now())
    },
    setAmbient(v) {
      ambient = v
    },
    kick(velocity) {
      kickTarget = Math.max(-40, Math.min(40, velocity * 0.012))
    },
    setPointer(x, y) {
      if (!net) return
      if (x == null) {
        pointer = null
        hover = -1
        return
      }
      pointer = { x, y }
      const i = nearest(x, y)
      if (i >= 0 && i !== hover) burst(i, 5, 2)
      hover = i
    },
    burst: (i, hops, speed) => burst(i, hops, speed),
    burstCenter: (hops = 9) => net && burst(net.center, hops, 2.2),
    // a signal "enters" from the left edge node nearest the vertical middle
    burstFromEdge: (hops = 10) => {
      if (!net) return
      let best = 0
      let score = Infinity
      net.nodes.forEach((n, i) => {
        const s = n.x0 + Math.abs(n.y0 - h / 2) * 0.6
        if (s < score) {
          score = s
          best = i
        }
      })
      burst(best, hops, 2.4)
    },
    drawStatic() {
      draw(performance.now())
    },
  }
}
