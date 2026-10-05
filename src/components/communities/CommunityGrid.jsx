import { motion } from 'motion/react'
import { Armchair, ArrowRight, Check } from 'lucide-react'
import { useBooking } from '../booking/useBooking'
import { communities, communitySection as copy } from '../../data/communities'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { PillButton } from '../ui/PillButton'
import { SampleBadge } from '../ui/SampleBadge'
import { SmartLink } from '../ui/SmartLink'
import { CommunityCard } from './CommunityCard'
import { tileIn } from './tileMotion'

// Left: the tagline (sticky on desktop). Right: an uneven logo wall —
// two 2×2 feature tiles placed on a diagonal, small square tiles around them,
// and a "View all" tile to finish the grid. 4 cols desktop · 3 tablet · 2 phone.
// Copy lives in src/data/communities.js → communitySection.
export function CommunityGrid() {
  const [first, second] = communities.filter((c) => c.featured)
  const rest = communities.filter((c) => !c.featured)
  const title = copy.title
  const { openBooking } = useBooking()

  return (
    <section id="community" aria-labelledby="community-title" className="bg-ink py-section">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-6 flex items-center gap-3 text-paper/60">
            {copy.eyebrow} <SampleBadge show={communities.some((c) => c.sample)}>Sample counts</SampleBadge>
          </p>
          <RevealText
            id="community-title"
            lines={[...title.slice(0, -1), <span key="hl" className="text-volt">{title.at(-1)}</span>]}
            className="display text-huge"
          />
          <ScrollReveal delay={0.2} className="mt-6 max-w-md">
            <p className="text-lg leading-relaxed text-paper/75">{copy.body}</p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {copy.points.map((pt) => (
                <li key={pt} className="flex items-center gap-3 text-paper/85">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-volt/20 text-[#8196ff]">
                    <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <PillButton href={copy.cta.href} variant="solid" arrow>
                {copy.cta.label}
              </PillButton>
              <button
                type="button"
                onClick={openBooking}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 text-sm font-semibold tracking-[0.06em] text-ink uppercase transition-colors hover:bg-paper"
              >
                <Armchair aria-hidden="true" className="size-4" /> Grab a seat
              </button>
            </div>
          </ScrollReveal>
        </div>

        <motion.ul
          aria-label="Technology communities"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          <CommunityCard community={first} size="lg" />
          {/* second feature sits bottom-right on desktop: a diagonal, not a block */}
          <CommunityCard community={second} size="lg" className="lg:col-start-3 lg:row-start-3" />
          {rest.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
          <ViewAllTile />
        </motion.ul>
      </div>
    </section>
  )
}

function ViewAllTile() {
  return (
    <motion.li variants={tileIn}>
      <SmartLink
        href={copy.viewAll.href}
        className="group flex aspect-square size-full flex-col items-center justify-center rounded-xl border border-dashed border-line-strong text-center transition-colors duration-500 hover:border-volt hover:bg-volt/10 focus-visible:border-volt focus-visible:outline-none"
      >
        <span className="display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none text-[#8196ff]">{communities.length}+</span>
        <span className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-paper/85">
          {copy.viewAll.label}
          <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </SmartLink>
    </motion.li>
  )
}
