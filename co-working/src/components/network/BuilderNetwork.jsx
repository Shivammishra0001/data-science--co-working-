import { motion } from 'motion/react'
import { networkRoles, people } from '../../data/network'
import { accentSolid, cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { RevealGroup, RevealItem } from '../motion/ScrollReveal'
import { PillButton } from '../ui/PillButton'
import { SampleBadge } from '../ui/SampleBadge'

// Fanned stack: resting pose overlaps, hovering the stack spreads it apart.
const fan = [
  { r: -9, x: -8, y: 10 },
  { r: -4, x: -4, y: 0 },
  { r: 2, x: 0, y: -6 },
  { r: 7, x: 4, y: 4 },
  { r: 12, x: 8, y: 14 },
]

export function BuilderNetwork() {
  return (
    <section id="network" aria-labelledby="network-title" className="overflow-hidden bg-paper py-section text-ink">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow mb-6 text-paper-mute">Expert + builder network</p>
          <RevealText id="network-title" lines={['No one', 'builds alone.']} className="display text-giant" />

          <RevealGroup as="ul" stagger={0.06} className="mt-10 border-t-2 border-ink">
            {networkRoles.map((role) => (
              <RevealItem
                as="li"
                key={role.id}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-ink/15 py-4 sm:grid-cols-[12rem_1fr]"
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cx('size-3 rounded-full transition-transform duration-500 group-hover:scale-150', accentSolid[role.accent], role.accent === 'paper' && 'ring-2 ring-ink')}
                  />
                  <span className="display text-2xl leading-none">{role.label}</span>
                </span>
                <span className="col-span-2 mt-1 text-ink/65 sm:col-span-1 sm:mt-0">{role.note}</span>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10">
            <PillButton href="#network-all" variant="ink" arrow>
              Meet the network
            </PillButton>
          </div>
        </div>

        <div className="relative">
          <SampleBadge tone="light" show={people.some((p) => p.sample)} className="absolute -top-10 right-0">
            Placeholder profiles
          </SampleBadge>
          <motion.ul
            aria-label="Some of the people in the network"
            className="relative flex justify-center py-10 lg:py-16"
            initial="rest"
            whileInView="in"
            whileHover="spread"
            viewport={{ once: true, amount: 0.4 }}
          >
            {people.map((p, i) => (
              <motion.li
                key={p.id}
                className="-mx-[clamp(2.8rem,5vw,4rem)] first:ml-0 last:mr-0"
                style={{ zIndex: i === 2 ? 5 : 5 - Math.abs(i - 2) }}
                variants={{
                  rest: { opacity: 0, y: 80, rotate: 0 },
                  in: { opacity: 1, y: fan[i].y, rotate: fan[i].r, x: fan[i].x, transition: { delay: i * 0.08, type: 'spring', stiffness: 120, damping: 16 } },
                  spread: { opacity: 1, y: fan[i].y - 10, rotate: fan[i].r * 0.4, x: (i - 2) * 38, transition: { type: 'spring', stiffness: 160, damping: 18 } },
                }}
              >
                <ProfileCard person={p} />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

function ProfileCard({ person }) {
  const initials = person.name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
  return (
    <article className="w-[clamp(8.5rem,17vw,13rem)] overflow-hidden rounded-[1.4rem] border-2 border-ink bg-paper shadow-[0_10px_0_-4px_var(--color-ink)]">
      <div className={cx('relative grid aspect-[4/5] place-items-center overflow-hidden', accentSolid[person.accent])}>
        {person.photo ? (
          <img src={person.photo} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <>
            <span aria-hidden="true" className="absolute -top-1/4 -left-1/4 size-3/4 rounded-full bg-black/10" />
            <span aria-hidden="true" className="absolute right-[-10%] bottom-[-10%] size-1/2 rotate-45 bg-white/25" />
            <span aria-hidden="true" className="display relative text-[clamp(3rem,6vw,5rem)] leading-none">
              {initials}
            </span>
          </>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-[0.95rem] leading-tight font-semibold">{person.name}</h3>
        <p className="mt-0.5 font-mono text-[0.62rem] tracking-[0.1em] text-ink/60 uppercase">{person.role}</p>
        <p className="mt-2 hidden text-xs text-ink/70 sm:block">{person.focus}</p>
      </div>
    </article>
  )
}
