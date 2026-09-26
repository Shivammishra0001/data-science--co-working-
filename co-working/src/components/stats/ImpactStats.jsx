import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { headlineStat, mosaic, stats } from '../../data/stats'
import { accentSolid, cx } from '../../utils/accents'
import { Counter } from '../motion/Counter'
import { RevealText } from '../motion/RevealText'
import { RevealGroup, RevealItem } from '../motion/ScrollReveal'
import { SampleBadge } from '../ui/SampleBadge'

export function ImpactStats() {
  const anySample = headlineStat.sample || stats.some((s) => s.sample)
  return (
    <section id="impact" aria-labelledby="impact-title" className="overflow-hidden bg-volt py-section text-white">
      <div className="container-x">
        <p className="eyebrow mb-6 flex items-center gap-3 text-white/80">
          Impact
          <SampleBadge show={anySample} className="!border-white/40 !text-white/80">
            Sample numbers
          </SampleBadge>
        </p>
        <RevealText id="impact-title" lines={['People are', 'building here.']} className="display text-huge" />

        <p className="mt-[clamp(2.5rem,6vw,5rem)] flex flex-wrap items-end gap-x-6">
          <Counter
            value={headlineStat.value}
            suffix={headlineStat.suffix}
            className="display text-[clamp(5rem,19vw,19rem)] leading-[0.8] text-ink"
          />
          <span className="display pb-[1.2vw] text-[clamp(2rem,5vw,5rem)] leading-none">{headlineStat.label}</span>
        </p>

        <RevealGroup as="dl" stagger={0.07} className="mt-14 grid grid-cols-2 border-t-2 border-white/90 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <RevealItem key={s.id} className="flex flex-col border-b border-white/25 py-6 pr-4 lg:border-b-0">
              <dt className="eyebrow order-2 mt-2 text-white/80">{s.label}</dt>
              <dd className="display order-1 text-[clamp(2.6rem,4.4vw,4.2rem)] leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Mosaic />
    </section>
  )
}

// Two rows of community tiles drifting in opposite directions with scroll.
function Mosaic() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xA = useTransform(scrollYProgress, [0, 1], ['2%', '-12%'])
  const xB = useTransform(scrollYProgress, [0, 1], ['-12%', '2%'])
  const half = Math.ceil(mosaic.length / 2)
  const rows = [mosaic.slice(0, half), mosaic.slice(half)]

  return (
    <div ref={ref} aria-hidden="true" className="mt-[clamp(3rem,7vw,6rem)] flex flex-col gap-3 sm:gap-4">
      {rows.map((row, r) => (
        <motion.div key={r} style={{ x: r === 0 ? xA : xB }} className="flex w-max gap-3 sm:gap-4">
          {[...row, ...row].map((t, i) => (
            <Tile key={i} tile={t} />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function Tile({ tile }) {
  return (
    <div
      className={cx(
        'relative h-36 shrink-0 overflow-hidden rounded-[1.4rem] sm:h-52',
        tile.span === 'wide' ? 'w-64 sm:w-96' : 'w-36 sm:w-52',
        accentSolid[tile.accent],
      )}
    >
      <span className="absolute -top-6 -right-6 size-24 rounded-full bg-black/10 sm:size-32" />
      <span className="absolute bottom-0 left-1/4 h-1/2 w-1/2 rounded-t-full bg-black/15" />
      <span className="display absolute bottom-3 left-4 text-4xl leading-none sm:text-6xl">{tile.initials}</span>
      {tile.badge && (
        <span className="absolute top-3 left-3 rounded-full rounded-bl-none bg-ink px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.1em] text-paper uppercase">
          {tile.badge === 'shipped' ? '🚀 Shipped' : '💡 New idea'}
        </span>
      )}
    </div>
  )
}
