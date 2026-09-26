import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { communities, ecosystemCard } from '../../data/communities'
import { RevealText } from '../motion/RevealText'
import { SampleBadge } from '../ui/SampleBadge'
import { SmartLink } from '../ui/SmartLink'
import { CommunityCard } from './CommunityCard'

// A technology wall: 2 featured posters, then 4 + 3 tiles and an ecosystem
// endpoint. Desktop 4 cols (features span 2) · tablet 2 · mobile 1.
// Borders collapse via -m-px so the wall reads as one ruled surface.
export function CommunityGrid() {
  const ordered = [...communities.filter((c) => c.featured), ...communities.filter((c) => !c.featured)]
  return (
    <section id="community" aria-labelledby="community-title" className="bg-ink py-section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-3 text-paper/60">
              Technology communities <SampleBadge show={communities.some((c) => c.sample)}>Sample counts</SampleBadge>
            </p>
            <RevealText
              id="community-title"
              lines={['Build inside the', 'technologies shaping', <span key="c" className="text-volt">what comes next.</span>]}
              className="display text-huge"
            />
          </div>
        </div>

        <motion.ul
          aria-label="Technology communities"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.07 }}
          className="mt-14 grid grid-cols-1 pt-px pl-px md:grid-cols-2 lg:grid-cols-4 [&>*]:-mt-px [&>*]:-ml-px"
        >
          {ordered.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
          <EcosystemCard />
        </motion.ul>
      </div>
    </section>
  )
}

const arrows = [0, 1, 2]

function EcosystemCard() {
  return (
    <motion.li
      variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.8 } } }}
      className="group relative isolate flex min-h-[13rem] flex-col justify-between overflow-hidden border border-line bg-ink p-5 transition-colors duration-500 hover:bg-paper hover:text-ink focus-within:bg-paper focus-within:text-ink sm:min-h-[15rem] sm:p-6"
    >
      <p className="font-mono text-[0.68rem] tracking-[0.12em] text-paper/55 uppercase transition-colors duration-500 group-hover:text-ink/60 group-focus-within:text-ink/60">
        {communities.length}+ communities · more joining
      </p>
      <div>
        <h3 className="display text-[clamp(1.9rem,2.5vw,2.5rem)] leading-[0.9]">
          <SmartLink
            href={ecosystemCard.href}
            className="outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-sun"
          >
            {ecosystemCard.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </SmartLink>
        </h3>
        {/* three arrows travel in sequence on hover/focus; static otherwise */}
        <span aria-hidden="true" className="mt-3 flex">
          {arrows.map((i) => (
            <ArrowRight
              key={i}
              style={{ transitionDelay: `${i * 70}ms` }}
              className="-mr-1.5 size-6 transition-[transform,opacity] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-3 group-focus-within:translate-x-3"
              opacity={1 - i * 0.3}
              strokeWidth={2.25}
            />
          ))}
        </span>
        <p className="mt-3 text-sm text-paper/60 transition-colors duration-500 group-hover:text-ink/70 group-focus-within:text-ink/70">
          {ecosystemCard.description}
        </p>
      </div>
    </motion.li>
  )
}
