import { useState } from 'react'
import { AnimatePresence, LayoutGroup } from 'motion/react'
import { Brain, Code, Database, FlaskConical, GraduationCap, HeartPulse, Leaf, SearchX, Wallet } from 'lucide-react'
import { categories, filters, innovations } from '../../data/market/innovations'
import { cx } from '../../utils/accents'
import { RevealText } from '../motion/RevealText'
import { SampleBadge } from '../ui/SampleBadge'
import { DiscoveryCard } from './DiscoveryCard'
import { ThemeSection } from './ThemeSection'

const icons = { ai: Brain, data: Database, healthtech: HeartPulse, fintech: Wallet, edtech: GraduationCap, climate: Leaf, devtools: Code, research: FlaskConical }

// 08 — DARK (continues): the market's many directions. Discovery, not a
// catalogue — filter by what a project needs, not by price.
const MOBILE_LIMIT = 6

export function InnovationDiscovery() {
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState(null)
  const [expanded, setExpanded] = useState(false) // phones show 6 until asked

  const shown = innovations.filter(
    (it) => (filter === 'all' || it.flags.includes(filter)) && (!category || it.category === category),
  )

  return (
    <ThemeSection tone="dark" id="discover" labelledBy="mp-discover-title" sheet={false} className="border-t border-line bg-ink pb-section">
      <div className="container-x pt-section">
        <p className="eyebrow flex items-center gap-3 text-paper/55">
          08 · Discovery <SampleBadge>Sample projects</SampleBadge>
        </p>
        <RevealText
          id="mp-discover-title"
          lines={['Discover what builders', <span key="w" className="text-sun">are putting into the world.</span>]}
          className="display mt-3 text-huge"
        />

        {/* categories */}
        <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8" aria-label="Categories">
          {categories.map((c) => {
            const Icon = icons[c.id]
            const on = category === c.id
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(on ? null : c.id)}
                  className={cx(
                    'group relative flex w-full flex-col items-start gap-5 overflow-hidden rounded-tile border p-4 text-left transition-colors duration-300',
                    on ? 'border-sun bg-sun text-ink' : 'border-line bg-ink-2 hover:bg-ink-3',
                  )}
                >
                  <Icon aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:scale-125" />
                  <span className="text-sm font-semibold">{c.label}</span>
                  <span aria-hidden="true" className={cx('absolute bottom-0 left-0 h-0.5 w-0 transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-full', on ? 'bg-ink' : 'bg-sun')} />
                </button>
              </li>
            )
          })}
        </ul>

        {/* intent filters */}
        <div role="group" aria-label="Filter innovations" className="no-scrollbar -mx-[var(--spacing-gutter)] mt-6 flex gap-2 overflow-x-auto px-[var(--spacing-gutter)] pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cx(
                'h-10 shrink-0 rounded-full px-4 text-[0.78rem] font-semibold tracking-[0.06em] uppercase ring-1 ring-inset transition-colors duration-300',
                filter === f.id ? 'bg-paper text-ink ring-paper' : 'text-paper/75 ring-line-strong hover:text-paper hover:ring-paper/50',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {shown.length} {shown.length === 1 ? 'innovation' : 'innovations'} shown
        </p>

        <LayoutGroup>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((it, i) => (
                <DiscoveryCard key={it.id} item={it} className={!expanded && i >= MOBILE_LIMIT ? 'max-sm:hidden' : undefined} />
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>

        {/* phones: a single column of 12 cards was ~6 screens of scrolling */}
        {!expanded && shown.length > MOBILE_LIMIT && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold tracking-[0.06em] text-paper uppercase ring-1 ring-line-strong ring-inset hover:bg-paper hover:text-ink sm:hidden"
          >
            Show all {shown.length}
          </button>
        )}

        {shown.length === 0 && (
          <div className="mt-10 flex flex-col items-start gap-4 rounded-card border border-dashed border-line-strong p-8">
            <SearchX aria-hidden="true" className="size-6 text-paper/60" />
            <p className="display text-3xl">Nothing here — yet.</p>
            <p className="text-paper/60">That combination is an open gap. Maybe it’s yours to fill.</p>
            <button
              type="button"
              onClick={() => {
                setFilter('all')
                setCategory(null)
              }}
              className="rounded-full px-4 py-2 text-sm font-semibold uppercase ring-1 ring-line-strong hover:bg-paper hover:text-ink"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </ThemeSection>
  )
}
