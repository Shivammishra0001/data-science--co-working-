import { ribbons } from '../../data/ribbons'
import { ScrollRibbon } from './ScrollRibbon'

// Three ribbons, three behaviours: different speeds, directions, scales and tilt.
const tilt = ['-rotate-2', 'rotate-1', '-rotate-1']

export function RibbonSection() {
  return (
    <section id="ribbons" aria-label="What we build with" className="relative overflow-hidden pt-[clamp(1.5rem,4vw,3rem)] pb-[clamp(3rem,7vw,6rem)]">
      <div className="flex flex-col gap-[clamp(0.5rem,1.4vw,1.25rem)]">
        {ribbons.map((r, i) => (
          <ScrollRibbon
            key={r.id}
            items={r.items}
            velocity={r.velocity}
            palette={r.palette}
            size={r.size}
            label={r.label}
            className={`-mx-[4vw] ${tilt[i % tilt.length]}`}
          />
        ))}
      </div>
    </section>
  )
}
