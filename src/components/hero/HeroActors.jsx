import { useEffect, useId, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { FINE_POINTER, useMediaQuery } from '../../hooks/useMediaQuery'
import { Glyph, Robot } from './HeroBots'
import { icons, robots } from './heroArtData'

// Desktop hero: every robot and icon is its own actor, roaming the open space
// of the hero. Each one picks a destination that
//   · is fully inside the visible hero (below the navbar, above the fold),
//   · doesn't touch any text — headline lines, paragraph, buttons, eyebrow are
//     measured as real text boxes (not their full-width containers), padded,
//   · keeps clear of the other actors' destinations,
// glides there, rests a moment, then picks the next. Robots still bob, blink,
// wave, follow the cursor and hop on hover. Reduced motion: placed once, still.
//
// `avoidRef` → the element containing the hero copy.

const ROBOT_VB = { x: -150, y: -320, w: 300, h: 370 } // robot drawing bounds (feet at 0,0)
const NAV = 96 // px kept clear for the fixed navbar
const PAD = 22 // px gap kept between an actor and any text
const iconActors = icons.filter((i) => i.glyph !== 'dot')

export function HeroActors({ avoidRef, className }) {
  const rootRef = useRef(null)
  const reduce = useReducedMotion()
  const fine = useMediaQuery(FINE_POINTER)
  const inView = useInView(rootRef)
  const uid = useId().replace(/:/g, '')

  // obstacles + bounds, in hero-local px; actors read this when choosing where to go
  const space = useRef({ w: 0, h: 0, rects: [], claims: new Map() })
  const [version, setVersion] = useState(0) // bumps whenever the layout is re-measured

  useEffect(() => {
    const root = rootRef.current
    const copy = avoidRef.current
    if (!root || !copy) return
    const measure = () => {
      const base = root.getBoundingClientRect()
      const rects = []
      const push = (r) => r.width > 2 && r.height > 2 && rects.push({ l: r.left - base.left - PAD, t: r.top - base.top - PAD, r: r.right - base.left + PAD, b: r.bottom - base.top + PAD })
      // real text boxes: a Range over each *text node* gives one rect per line of
      // glyphs (a Range over the element would also return its full-width line boxes)
      copy.querySelectorAll('p, h1').forEach((el) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue
          const range = document.createRange()
          range.selectNodeContents(n)
          ;[...range.getClientRects()].forEach(push)
        }
      })
      // highlight chip and buttons are boxes, not text
      copy.querySelectorAll('a, button, h1 [aria-hidden="true"]').forEach((el) => push(el.getBoundingClientRect()))
      // the visible part of the hero only (never below the fold)
      space.current.w = base.width
      space.current.h = Math.min(base.height, window.innerHeight - Math.max(0, base.top))
      space.current.rects = rects
      setVersion((v) => v + 1)
    }
    measure()
    // text animates in, fonts swap, the window resizes — measure again each time
    const t1 = setTimeout(measure, 1700)
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    ro.observe(copy)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t1)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [avoidRef])

  // pointer (client px) + hero rect for eye tracking
  const cx = useSpring(useMotionValue(-9999), { stiffness: 90, damping: 18 })
  const cy = useSpring(useMotionValue(-9999), { stiffness: 90, damping: 18 })
  const heroRect = useRef({ left: 0, top: 0 })
  useEffect(() => {
    if (reduce || !fine || !inView) return
    const onMove = (e) => {
      const r = rootRef.current?.getBoundingClientRect()
      if (r) heroRect.current = r
      cx.set(e.clientX)
      cy.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, fine, inView, cx, cy])

  const shared = { space, version, live: !reduce, roam: !reduce && inView, cx, cy, heroRect, uid, fine }
  return (
    <div ref={rootRef} aria-hidden="true" className={className}>
      {/* robots mount first so they claim room before the smaller icons */}
      {robots.map((bot) => (
        <RobotActor key={bot.id} id={bot.id} bot={bot} {...shared} />
      ))}
      {iconActors.map((ic, i) => (
        <IconActor key={`i${i}`} id={`i${i}`} icon={ic} {...shared} />
      ))}
    </div>
  )
}

// ── placement ────────────────────────────────────────────────────────────
const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t

function pickSpot(space, id, w, h, near, strict = false) {
  const { w: W, h: H, rects, claims } = space
  const minX = 16
  const maxX = W - w - 16
  const minY = NAV
  const maxY = H - h - 12
  if (maxX <= minX || maxY <= minY) return null
  // robots (strict) only keep clear of other robots — icons are small and get out of their way
  const others = [...claims].filter(([k]) => k !== id && (!strict || !k.startsWith('i'))).map(([, c]) => c)
  // best-candidate sampling: gather clear spots, keep the one furthest from the
  // other actors — the cast spreads across all the open space instead of clumping
  let best = null
  let bestScore = -1
  let fallback = null
  let found = 0
  for (let i = 0; i < 260 && found < 10; i++) {
    const x = near && i < 140 ? clamp(near.x + (Math.random() - 0.5) * W * 0.6, minX, maxX) : minX + Math.random() * (maxX - minX)
    const y = near && i < 140 ? clamp(near.y + (Math.random() - 0.5) * H * 0.6, minY, maxY) : minY + Math.random() * (maxY - minY)
    const box = { l: x, t: y, r: x + w, b: y + h }
    if (rects.some((r) => hit(box, r))) continue
    if (near && !routeClear(near, x, y, w, h, rects)) continue
    if (others.some((c) => hit(box, { l: c.l - 12, t: c.t - 12, r: c.r + 12, b: c.b + 12 }))) {
      // an icon may settle next to another icon, but never on a robot
      if (!strict && !robotsHit(claims, id, box)) fallback ??= box
      continue
    }
    found++
    const cxm = x + w / 2
    const cym = y + h / 2
    const score = others.length ? Math.min(...others.map((c) => Math.hypot((c.l + c.r) / 2 - cxm, (c.t + c.b) / 2 - cym))) : Math.random()
    if (score > bestScore) {
      bestScore = score
      best = box
    }
  }
  // icons may squeeze in next to something; robots never overlap each other
  if (!best && !strict) best = fallback
  if (best) claims.set(id, best)
  return best && { x: best.l, y: best.t }
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
function robotsHit(claims, id, box) {
  for (const [k, c] of claims) if (k !== id && !k.startsWith('i') && hit(box, c)) return true
  return false
}
function routeClear(from, x, y, w, h, rects) {
  for (let k = 1; k < 16; k++) {
    const t = k / 16
    const bx = from.x + (x - from.x) * t
    const by = from.y + (y - from.y) * t
    if (rects.some((r) => hit({ l: bx, t: by, r: bx + w, b: by + h }, r))) return false
  }
  return true
}

// Places an actor in a free spot, re-places it if a re-measure puts text or
// the fold on top of it, and moves it between free spots while `roam` is true.
// Position and fade are motion values, so none of this re-renders React.
function useRoam({ id, space, version, roam, w, h, speed, strict = false }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const opacity = useMotionValue(0)
  const placed = useRef(false)

  useEffect(() => {
    if (!version || !w) return
    const s = space.current
    const cur = { l: x.get(), t: y.get(), r: x.get() + w, b: y.get() + h }
    if (placed.current && !s.rects.some((r) => hit(cur, r)) && cur.r <= s.w && cur.b <= s.h) return
    const spot = pickSpot(s, id, w, h, null, strict)
    if (!spot) return
    x.set(spot.x)
    y.set(spot.y)
    placed.current = true
    animate(opacity, 1, { duration: 0.8 })
  }, [version, id, space, w, h, strict, x, y, opacity])

  useEffect(() => {
    if (!roam) return
    let alive = true
    let timer = 0
    let anims = []
    const step = () => {
      if (!alive) return
      const spot = placed.current && pickSpot(space.current, id, w, h, { x: x.get(), y: y.get() }, strict)
      if (spot) {
        const dist = Math.hypot(spot.x - x.get(), spot.y - y.get())
        const duration = clamp(dist / speed, 2.5, 9)
        anims = [animate(x, spot.x, { duration, ease: 'easeInOut' }), animate(y, spot.y, { duration, ease: 'easeInOut' })]
        timer = setTimeout(step, duration * 1000 + 600 + Math.random() * 2200)
      } else timer = setTimeout(step, 1500)
    }
    timer = setTimeout(step, 400 + Math.random() * 1600)
    return () => {
      alive = false
      clearTimeout(timer)
      anims.forEach((a) => a.stop())
    }
  }, [roam, id, space, w, h, speed, strict, x, y])

  return { x, y, opacity }
}

// ── actors ───────────────────────────────────────────────────────────────
function RobotActor({ id, bot, space, version, live, roam, cx, cy, heroRect, uid, fine }) {
  // robot size follows the viewport: big enough to read, small enough to find room
  const [size, setSize] = useState(() => robotSize())
  useEffect(() => {
    const on = () => setSize(robotSize())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const h = size
  const w = (h * ROBOT_VB.w) / ROBOT_VB.h
  const { x, y, opacity } = useRoam({ id, space, version, roam, w, h, speed: 70, strict: true })
  const [hot, setHot] = useState(false)

  // pointer → this robot's drawing coordinates (for eye-tracking and lean)
  const px = useTransform([cx, x], ([a, X]) => (a < -9000 ? -260 : ((a - heroRect.current.left - X) / w) * ROBOT_VB.w + ROBOT_VB.x))
  const py = useTransform([cy, y], ([b, Y]) => (b < -9000 ? -420 : ((b - heroRect.current.top - Y) / h) * ROBOT_VB.h + ROBOT_VB.y))
  // lean into the direction of travel, on top of the cursor lean inside <Robot>
  const vx = useSpring(useTransform(x, (v) => v), { stiffness: 40, damping: 20 })
  const tilt = useTransform([x, vx], ([a, b]) => clamp((a - b) / 6, -6, 6))
  const glowId = `bot-glow-${uid}-${id}`

  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ x, y, opacity, width: w, height: h, rotate: live ? tilt : 0 }}
    >
      <svg viewBox={`${ROBOT_VB.x} ${ROBOT_VB.y} ${ROBOT_VB.w} ${ROBOT_VB.h}`} className="block size-full overflow-visible">
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#8196ff" floodOpacity="0.55" />
          </filter>
        </defs>
        <Robot
          bot={{ ...bot, x: 0, y: 0 }}
          px={px}
          py={py}
          live={live}
          hot={hot}
          showLabel={false}
          glowId={glowId}
          onEnter={() => fine && setHot(true)}
          onLeave={() => fine && setHot(false)}
          onTap={() => {}}
        />
      </svg>
    </motion.div>
  )
}

function IconActor({ id, icon, space, version, roam, live }) {
  const s = icon.r ? icon.r * 2 + 10 : 34 // px box for the glyph
  const { x, y, opacity } = useRoam({ id, space, version, roam, w: s, h: s, speed: 38 })
  const r = icon.r || 14
  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ x, y, opacity, width: s, height: s }}
    >
      <svg viewBox={`${-r - 5} ${-r - 5} ${2 * r + 10} ${2 * r + 10}`} className="block size-full overflow-visible">
        <g className={live ? 'motion-safe:animate-bot-float' : undefined} style={{ animationDelay: `${-icon.delay}s`, transformBox: 'fill-box' }}>
          <Glyph kind={icon.glyph} r={icon.r} color={icon.color} />
        </g>
      </svg>
    </motion.div>
  )
}

function robotSize() {
  if (typeof window === 'undefined') return 190
  return clamp(Math.min(window.innerHeight * 0.22, window.innerWidth * 0.11), 120, 220)
}
