import { useDeferredValue, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX, X } from 'lucide-react'
import { COMMUNITY_CATEGORIES, COMMUNITY_SORTS } from '../../data/communities'
import { useCommunities } from '../../hooks/useCommunity'
import { cx } from '../../utils/accents'
import { SampleBadge } from '../ui/SampleBadge'
import { CommunityCard } from './CommunityCard'
import { CommunityLoader } from './CommunityLoader'
import { EmptyState } from './EmptyState'
import { btn } from './shared'

// Search, category and sort live in the URL (?q=&category=&sort=) so a
// filtered view can be shared and survives back/forward.
export function CommunityDirectory() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const category = params.get('category') ?? 'All'
  const sort = params.get('sort') ?? 'popular'
  // deferred value = cheap debounce for typing; swap for a timed debounce when this hits a real API
  const query = useDeferredValue(q)
  const { data, loading } = useCommunities({ q: query, category, sort })

  const update = (next) => {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (!v || (k === 'category' && v === 'All') || (k === 'sort' && v === 'popular')) p.delete(k)
      else p.set(k, v)
    }
    setParams(p, { replace: true })
  }
  const onSearch = (v) => {
    setQ(v)
    update({ q: v })
  }
  const clear = () => {
    setQ('')
    setParams({}, { replace: true })
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search communities</span>
          <Search aria-hidden="true" className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-paper/45" />
          <input
            type="search"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search communities…"
            className="h-11 w-full rounded-full border border-line-strong bg-ink-2 pr-10 pl-10 text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none"
          />
          {q && (
            <button type="button" onClick={() => onSearch('')} aria-label="Clear search" className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-paper/55 hover:bg-paper/10">
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </label>
        <label className="flex items-center gap-2 text-sm text-paper/60">
          Sort
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="h-11 rounded-full border border-line-strong bg-ink-2 px-4 text-paper focus:border-paper/50 focus:outline-none"
          >
            {COMMUNITY_SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-[var(--spacing-gutter)] mt-4 flex gap-2 overflow-x-auto px-[var(--spacing-gutter)] pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {COMMUNITY_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => update({ category: c })}
            className={cx(
              'h-9 shrink-0 rounded-full px-4 text-sm transition-colors duration-150',
              category === c ? 'bg-paper font-semibold text-ink' : 'text-paper/70 ring-1 ring-line-strong ring-inset hover:bg-paper/[0.07] hover:text-paper',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-paper/55">
        <p aria-live="polite">{data ? `${data.length} ${data.length === 1 ? 'community' : 'communities'}` : ' '}</p>
        <SampleBadge>Demo counts</SampleBadge>
      </div>

      {loading && !data ? (
        <CommunityLoader label="Loading communities" />
      ) : data?.length ? (
        <ul key={`${category}-${sort}`} className="animate-fade-in mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-4"
          icon={SearchX}
          title="No community matched that search."
          body="Try a technology name like “graph” or “LLM”, or clear the filters."
          action={
            <button type="button" onClick={clear} className={btn.secondary}>
              Clear search
            </button>
          }
        />
      )}
    </div>
  )
}
