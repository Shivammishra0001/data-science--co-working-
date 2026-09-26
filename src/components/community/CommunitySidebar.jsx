import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { communities, communityHref } from '../../data/communities'
import { useJoinedCommunityIds } from '../../hooks/useCommunity'
import { cx } from '../../utils/accents'
import { SmartLink } from '../ui/SmartLink'
import { BrandLogo } from './BrandLogo'
import { compact } from './shared'
import { CommunityLinks, CommunityRules } from './CommunityTabsContent'
import { useParticipation } from './useParticipation'

// Right column (desktop) / bottom panel (smaller screens): community info.
export function CommunitySidebar() {
  const { community, flow } = useParticipation()
  const h = community.highlights
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-line bg-ink-2 p-5" aria-labelledby="info-title">
        <div className="flex items-center gap-3">
          <BrandLogo community={community} className="h-8" decorative />
          <h2 id="info-title" className="display-upright text-2xl leading-none">
            {community.name}
          </h2>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-[0.68rem] tracking-[0.1em] uppercase">
          <div className="flex flex-col-reverse">
            <dt className="text-paper/50">Members</dt>
            <dd className="text-lg font-semibold tracking-normal text-paper">{compact(community.membersCount)}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="text-paper/50">Active today</dt>
            <dd className="text-lg font-semibold tracking-normal text-paper">{community.activeMembersCount}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-paper/70">{community.about}</p>
        {flow.joined && <p className="mt-3 text-sm text-mint">You’re a member.</p>}
      </section>

      {h && (
        <section className="rounded-xl border border-line bg-ink-2 p-5" aria-labelledby="hl-title">
          <h2 id="hl-title" className="text-sm font-semibold">
            This week <span className="font-normal text-paper/45">· demo</span>
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-paper/75">
            <li>{h.projectsThisWeek} projects shared</li>
            <li>{h.discussionsToday} discussions today</li>
            <li>{h.upcomingEvents} upcoming events</li>
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-line bg-ink-2 p-5" aria-labelledby="sb-links">
        <h2 id="sb-links" className="text-sm font-semibold">
          Links
        </h2>
        <CommunityLinks community={community} className="mt-2" />
      </section>

      <section className="rounded-xl border border-line bg-ink-2 p-5" aria-labelledby="sb-rules">
        <h2 id="sb-rules" className="text-sm font-semibold">
          Rules
        </h2>
        <div className="mt-3">
          <CommunityRules rules={community.rules} />
        </div>
      </section>
    </div>
  )
}

// Left column: search + your communities + all communities.
export function CommunityNav({ current }) {
  const [q, setQ] = useState('')
  const joined = useJoinedCommunityIds()
  const needle = q.trim().toLowerCase()
  const list = communities.filter(
    (c) => !needle || [c.name, c.tagline, ...c.keywords, ...c.categories].join(' ').toLowerCase().includes(needle),
  )
  const mine = list.filter((c) => joined.includes(c.id))
  const rest = list.filter((c) => !joined.includes(c.id))

  const item = (c) => (
    <li key={c.id}>
      <SmartLink
        href={communityHref(c)}
        aria-current={c.slug === current ? 'page' : undefined}
        className={cx(
          'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150',
          c.slug === current ? 'bg-paper/[0.08] font-semibold text-paper' : 'text-paper/70 hover:bg-paper/[0.05] hover:text-paper',
        )}
      >
        <BrandLogo community={c} className="h-5" decorative />
        <span className="truncate">{c.name}</span>
      </SmartLink>
    </li>
  )

  return (
    <nav aria-label="Communities" className="flex flex-col gap-5">
      <label className="relative">
        <span className="sr-only">Filter communities</span>
        <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-paper/45" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search communities…"
          className="h-10 w-full rounded-lg border border-line-strong bg-ink-2 pr-3 pl-9 text-sm text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none"
        />
      </label>
      {mine.length > 0 && (
        <div>
          <h2 className="px-2.5 text-xs font-semibold tracking-wide text-paper/45 uppercase">Your communities</h2>
          <ul className="mt-1.5">{mine.map(item)}</ul>
        </div>
      )}
      <div>
        <h2 className="px-2.5 text-xs font-semibold tracking-wide text-paper/45 uppercase">{mine.length ? 'Discover' : 'All communities'}</h2>
        <ul className="mt-1.5">{rest.map(item)}</ul>
        {list.length === 0 && <p className="px-2.5 py-2 text-sm text-paper/50">No match.</p>}
      </div>
      <SmartLink href="/community" className="px-2.5 text-sm font-semibold text-paper/70 hover:text-paper hover:underline">
        Browse the directory →
      </SmartLink>
    </nav>
  )
}

// Mobile/tablet: a plain community switcher above the header.
export function CommunitySwitcher({ current }) {
  const navigate = useNavigate()
  return (
    <label className="flex items-center gap-3 text-sm text-paper/60">
      <span className="shrink-0">Community</span>
      <select
        value={current}
        onChange={(e) => navigate(`/community/${e.target.value}`)}
        className="h-10 w-full rounded-lg border border-line-strong bg-ink-2 px-3 text-paper focus:border-paper/50 focus:outline-none"
      >
        {communities.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  )
}
