import { useEffect, useId, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { FINE_POINTER, useMediaQuery } from '../../hooks/useMediaQuery'
import { cx } from '../../utils/accents'
import { C, H, icons, INK, OUTLINE, PAPER, robots, W } from './heroArtData'

// Hero illustration: four line-art builder robots on a dashed path — Research,
// Build, Connect, Ship — with tech icons floating around them.
//   idle:   robots bob, arms wave, eyes blink, icons drift (CSS, paused off-screen)
//   react:  eyes follow the cursor, robots lean toward it, icons parallax
//   touch:  hover (or tap) a robot → it hops and smiles
// Reduced motion: a still scene. Drawn in SVG — crisp at any size, ~0 KB of images.

const ground = `M60 ${H - 52} C 220 ${H - 30}, 290 ${H - 82}, 380 ${H - 70} S 540 ${H - 40}, 625 ${H - 52} S 790 ${H - 78}, 960 ${H - 60}`

export function HeroBots({ className, style, compact = false }) {
  const svgRef = useRef(null)
  const reduce = useReducedMotion()
  const fine = useMediaQuery(FINE_POINTER)
  const inView = useInView(svgRef, { margin: '100px 0px' })
  const [hot, setHot] = useState(null) // robot currently hovered / tapped
  // unique ids: the desktop and phone copies must not share filter/gradient ids
  // (a reference to an id inside a display:none copy renders nothing)
  const uid = useId().replace(/:/g, '')
  const glowId = `bot-glow-${uid}`
  const hazeId = `bot-haze-${uid}`

  // pointer in SVG coordinates; at rest the robots glance up-left, toward the headline
  const rawX = useMotionValue(220)
  const rawY = useMotionValue(-40)
  const px = useSpring(rawX, { stiffness: 90, damping: 18 })
  const py = useSpring(rawY, { stiffness: 90, damping: 18 })

  useEffect(() => {
    if (reduce || !fine || !inView) return
    const svg = svgRef.current
    const onMove = (e) => {
      const m = svg?.getScreenCTM()
      if (!m) return
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
      rawX.set(pt.x)
      rawY.set(pt.y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, fine, inView, rawX, rawY])

  // touch: a tap makes the robot hop, then it settles back
  const tapTimer = useRef(0)
  const tap = (id) => {
    if (fine) return
    setHot(id)
    clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => setHot(null), 900)
  }
  useEffect(() => () => clearTimeout(tapTimer.current), [])

  const live = !reduce
  return (
    <motion.div
      style={style}
      className={cx('pointer-events-none', !inView && '[&_*]:![animation-play-state:paused]', className)}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Four friendly robots on a dotted path — one researching with a magnifier, one building with a glowing orb, one waving to connect, one shipping a chart — with tech icons floating around them."
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#8196ff" floodOpacity="0.55" />
          </filter>
          <radialGradient id={hazeId} cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="#3f5bff" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#3f5bff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={W / 2} cy={H * 0.7} rx={W * 0.46} ry={H * 0.34} fill={`url(#${hazeId})`} />
        <path d={ground} fill="none" stroke={OUTLINE} strokeOpacity="0.45" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />

        {icons.filter((ic) => !(compact && ic.glyph === 'dot')).map((ic, i) => (
          <FloatIcon key={i} icon={ic} px={px} py={py} live={live} />
        ))}

        {robots.map((r, i) => (
          <motion.g
            key={r.id}
            // phones: each robot wanders a little along the path on its own rhythm
            animate={live && compact ? { x: [0, 26, -18, 0] } : { x: 0 }}
            transition={live && compact ? { duration: 9 + i * 1.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 } : undefined}
          >
          <Robot
            bot={r}
            px={px}
            py={py}
            live={live}
            hot={hot === r.id}
            showLabel={!compact}
            glowId={glowId}
            onEnter={() => fine && setHot(r.id)}
            onLeave={() => fine && setHot((h) => (h === r.id ? null : h))}
            onTap={() => tap(r.id)}
          />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  )
}

// ── a robot ────────────────────────────────────────────────────────────────
const HEAD_Y = -212

export function Robot({ bot, px, py, live, hot, showLabel, glowId, onEnter, onLeave, onTap }) {
  const { x, y, accent, delay, id } = bot
  const hx = x
  const hy = y + HEAD_Y
  // eyes look toward the pointer (max 5px), robot leans a few degrees toward it
  const eyeX = useTransform([px, py], ([a, b]) => ((a - hx) / (Math.hypot(a - hx, b - hy) || 1)) * 5)
  const eyeY = useTransform([px, py], ([a, b]) => ((b - hy) / (Math.hypot(a - hx, b - hy) || 1)) * 4)
  const lean = useTransform(px, (a) => Math.max(-1, Math.min(1, (a - hx) / 520)) * 5)
  const mouth = hot ? 'smile' : bot.mouth

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* shadow shrinks while the robot is up in the air */}
      <motion.ellipse cx="0" cy="6" rx="54" ry="9" fill="#000" initial={false} animate={{ opacity: hot ? 0.25 : 0.55, rx: hot ? 40 : 54 }} />
      {showLabel && (
        <text y="40" textAnchor="middle" fill={PAPER} fillOpacity="0.5" style={{ fontFamily: '"Geist Mono", monospace', fontSize: 17, letterSpacing: '0.16em' }}>
          {bot.label.toUpperCase()}
        </text>
      )}

      <motion.g
        initial={false}
        animate={{ y: hot ? -26 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 14 }}
        style={live ? { rotate: lean, originX: 0.5, originY: 1, transformBox: 'fill-box' } : undefined}
      >
        <g
          className={cx(live && 'motion-safe:animate-bot-bob')}
          style={{ animationDelay: `${-delay}s`, transformBox: 'fill-box' }}
        >
          {/* generous invisible hit area for hover / tap */}
          <rect
            x="-80"
            y="-310"
            width="160"
            height="320"
            fill="transparent"
            className="pointer-events-auto cursor-pointer"
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            onPointerDown={onTap}
          />
          <g filter={`url(#${glowId})`} stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
            {/* legs */}
            <path d="M-16 -72 L-22 0" fill="none" />
            <path d="M16 -72 L21 0" fill="none" />
            <Arms id={id} accent={accent} live={live} hot={hot} delay={delay} />
            {/* body */}
            <rect x="-40" y="-158" width="80" height="90" rx="22" fill={INK} />
            <rect x="40" y="-140" width="12" height="34" rx="5" fill={INK} strokeWidth="2.5" />
            <Chest id={id} />
            {/* antenna */}
            <path d="M0 -262 L0 -290" fill="none" />
            <motion.circle cy="-297" r="8" fill={accent} stroke="none" initial={false} animate={{ r: hot ? 11 : 8 }} />
            {/* head */}
            <circle cy={HEAD_Y} r="50" fill={INK} />
            {id === 'research' && <path d="M-22 -236 Q-12 -244 -2 -238" fill="none" strokeWidth="2.5" strokeOpacity="0.8" />}
            {id === 'build' && <path d="M-26 -234 Q-14 -242 -4 -236" fill="none" strokeWidth="2.5" strokeOpacity="0.8" />}
          </g>

          {/* face (no glow, sharper) */}
          <motion.g style={live ? { x: eyeX, y: eyeY } : undefined}>
            <g className={cx(live && 'motion-safe:animate-bot-blink')} style={{ animationDelay: `${-delay * 2}s`, transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx="-16" cy={HEAD_Y - 2} r="6" fill={PAPER} />
              <circle cx="16" cy={HEAD_Y - 2} r="6" fill={PAPER} />
            </g>
            <Mouth kind={mouth} />
          </motion.g>
        </g>
      </motion.g>
    </g>
  )
}

function Mouth({ kind }) {
  if (kind === 'smile') return <path d={`M-15 ${HEAD_Y + 14} Q0 ${HEAD_Y + 28} 15 ${HEAD_Y + 14}`} fill="none" stroke={PAPER} strokeWidth="3.5" strokeLinecap="round" />
  if (kind === 'o') return <ellipse cx="0" cy={HEAD_Y + 18} rx="4.5" ry="5.5" fill="none" stroke={PAPER} strokeWidth="3" />
  return null
}

function Chest({ id }) {
  if (id === 'research') return <rect x="-15" y="-138" width="30" height="20" rx="5" fill={INK} strokeWidth="2.5" />
  if (id === 'build')
    return (
      <g strokeWidth="2.5">
        <circle cy="-120" r="12" fill={INK} />
        <circle cy="-120" r="4" fill={PAPER} stroke="none" />
      </g>
    )
  return null
}

// arms + whatever each robot is holding
function Arms({ id, accent, live, hot, delay }) {
  const wave = cx(live && 'motion-safe:animate-bot-wave')
  const waveStyle = (origin, d = 0) => ({ transformBox: 'view-box', transformOrigin: origin, animationDelay: `${-(delay + d)}s` })

  if (id === 'research')
    return (
      <>
        <path d="M40 -146 Q64 -118 66 -84" fill="none" />
        <g className={wave} style={{ ...waveStyle('-40px -150px'), animationDuration: '3.4s' }}>
          <path d="M-40 -150 Q-74 -150 -96 -176" fill="none" />
          <circle cx="-122" cy="-200" r="30" fill="none" strokeWidth="4" />
          <path d="M-101 -180 L-92 -172" fill="none" strokeWidth="5" />
        </g>
      </>
    )
  if (id === 'build')
    return (
      <>
        <path d="M-40 -146 Q-62 -118 -62 -86" fill="none" />
        <g className={wave} style={waveStyle('40px -150px')}>
          <path d="M40 -152 Q74 -196 76 -238" fill="none" />
          <circle cx="78" cy="-252" r="15" fill={INK} />
          <circle cx="78" cy="-252" r="5" fill={accent} stroke="none" />
        </g>
      </>
    )
  if (id === 'connect')
    return (
      <>
        <g className={wave} style={{ ...waveStyle('-40px -150px', 0.3), animationDuration: hot ? '0.6s' : '1.8s' }}>
          <path d="M-40 -152 Q-74 -200 -70 -246" fill="none" />
          <circle cx="-70" cy="-258" r="12" fill="none" />
        </g>
        <g className={wave} style={{ ...waveStyle('40px -150px'), animationDuration: hot ? '0.6s' : '2.1s' }}>
          <path d="M40 -152 Q76 -200 72 -246" fill="none" />
          <circle cx="73" cy="-257" r="11" fill={INK} />
        </g>
        {/* picture card it's showing off */}
        <g transform="translate(90 -150)" strokeWidth="2.5">
          <rect width="56" height="50" rx="9" fill={C.iris} fillOpacity="0.9" stroke={C.iris} />
          <circle cx="18" cy="17" r="6" fill={PAPER} stroke="none" />
          <path d="M8 40 L24 27 L33 34 L42 24 L50 40 Z" fill={PAPER} stroke="none" />
        </g>
      </>
    )
  // ship
  return (
    <>
      <path d="M40 -146 Q66 -116 70 -82" fill="none" />
      <circle cx="71" cy="-78" r="6" fill={C.sun} stroke="none" />
      <path d="M-40 -146 Q-70 -126 -74 -102" fill="none" />
      <g transform="translate(-126 -148)">
        <rect width="70" height="84" rx="9" fill={INK} stroke={C.sun} strokeWidth="5" />
        <motion.path
          d="M14 58 L28 44 L38 50 L56 26"
          fill="none"
          stroke={C.mint}
          strokeWidth="4"
          initial={false}
          animate={{ pathLength: live ? [0.15, 1, 1] : 1 }}
          transition={live ? { duration: 2.8, repeat: Infinity, repeatDelay: 1.2, times: [0, 0.6, 1] } : undefined}
        />
      </g>
    </>
  )
}

// ── floating icons ────────────────────────────────────────────────────────
function FloatIcon({ icon, px, py, live }) {
  const { x, y, r, glyph, color, depth, delay } = icon
  const dx = useTransform(px, (a) => ((a - W / 2) / W) * 18 * depth)
  const dy = useTransform(py, (b) => ((b - H / 2) / H) * 12 * depth)
  return (
    <motion.g style={live ? { x: dx, y: dy } : undefined}>
      <g transform={`translate(${x} ${y})`}>
        <g className={cx(live && 'motion-safe:animate-bot-float')} style={{ animationDelay: `${-delay}s`, transformBox: 'fill-box' }}>
          <Glyph kind={glyph} r={r} color={color} />
        </g>
      </g>
    </motion.g>
  )
}

export function Glyph({ kind, r, color }) {
  const ring = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (kind) {
    case 'eye':
      return (
        <g>
          <circle r={r} fill={color} fillOpacity="0.9" />
          <path d={`M${-r * 0.55} 0 Q0 ${-r * 0.5} ${r * 0.55} 0 Q0 ${r * 0.5} ${-r * 0.55} 0 Z`} fill="none" stroke={PAPER} strokeWidth="3" />
          <circle r={r * 0.16} fill={PAPER} />
        </g>
      )
    case 'code':
      return (
        <g>
          <circle r={r} fill={color} />
          <path d={`M${-r * 0.2} ${-r * 0.3} L${-r * 0.48} 0 L${-r * 0.2} ${r * 0.3} M${r * 0.2} ${-r * 0.3} L${r * 0.48} 0 L${r * 0.2} ${r * 0.3}`} {...ring} stroke={PAPER} />
        </g>
      )
    case 'lens':
      return (
        <g>
          <circle r={r} fill={INK} stroke={color} strokeOpacity="0.7" strokeWidth="2.5" />
          <circle cx={-3} cy={-3} r={r * 0.42} {...ring} />
          <path d={`M${r * 0.12} ${r * 0.12} L${r * 0.46} ${r * 0.46}`} {...ring} strokeWidth="4" />
        </g>
      )
    case 'target':
      return (
        <g {...ring} strokeOpacity="0.75">
          <circle r={r} />
          <circle r={r * 0.5} />
          <circle r={r * 0.14} fill={color} />
        </g>
      )
    case 'heart':
      return (
        <g>
          <circle r={r} fill="none" stroke={color} strokeWidth="3.5" />
          <path d={`M0 ${r * 0.34} C ${-r * 0.7} ${-r * 0.05}, ${-r * 0.32} ${-r * 0.62}, 0 ${-r * 0.22} C ${r * 0.32} ${-r * 0.62}, ${r * 0.7} ${-r * 0.05}, 0 ${r * 0.34} Z`} fill={color} />
        </g>
      )
    case 'cube':
      return (
        <g>
          <circle r={r} fill={color} />
          <path d={`M0 ${-r * 0.5} L${r * 0.44} ${-r * 0.25} L${r * 0.44} ${r * 0.25} L0 ${r * 0.5} L${-r * 0.44} ${r * 0.25} L${-r * 0.44} ${-r * 0.25} Z`} fill={PAPER} fillOpacity="0.9" />
        </g>
      )
    case 'nodes':
      return (
        <g>
          <circle r={r} fill={INK} stroke={color} strokeOpacity="0.6" strokeWidth="2.5" />
          <g {...ring}>
            <path d={`M0 ${r * 0.35} L0 0 L${-r * 0.35} ${-r * 0.3} M0 0 L${r * 0.35} ${-r * 0.3}`} />
          </g>
          {[[0, r * 0.38], [-r * 0.38, -r * 0.32], [r * 0.38, -r * 0.32]].map(([cx2, cy2], i) => (
            <circle key={i} cx={cx2} cy={cy2} r="3.4" fill={color} />
          ))}
        </g>
      )
    case 'spark':
      return <path d="M0 -14 Q2 -2 14 0 Q2 2 0 14 Q-2 2 -14 0 Q-2 -2 0 -14 Z" fill={color} />
    default:
      return <circle r="5" fill={color} fillOpacity="0.5" />
  }
}
