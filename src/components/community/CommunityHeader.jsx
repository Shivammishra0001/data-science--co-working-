import { useSearchParams } from 'react-router-dom'
import { Check, Users } from 'lucide-react'
import { cx } from '../../utils/accents'
import { SampleBadge } from '../ui/SampleBadge'
import { BrandLogo } from './BrandLogo'
import { TABS, compact } from './shared'
import { JoinCommunityButton } from './JoinCommunityButton'
import { useParticipation } from './useParticipation'

// Logo · name/description/members · join. Answers "what is this, how big,
// how do I join" in one glance.
export function CommunityHeader() {
  const { community, flow } = useParticipation()
  return (
    <header className="rounded-xl border border-line bg-ink-2 p-5 sm:p-6" style={{ '--acc': community.theme.accent }}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center rounded-xl border border-line bg-ink sm:size-24">
          <BrandLogo community={community} className="h-12 sm:h-14" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-[color-mix(in_srgb,var(--acc)_70%,var(--color-paper))] uppercase">
            {community.categories.join(' · ')}
          </p>
          <h1 className="display-upright mt-1 text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[0.95]">{community.name}</h1>
          <p className="mt-1 text-paper/70">{community.tagline}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-paper/55">
            <span className="flex items-center gap-1.5">
              <Users aria-hidden="true" className="size-4" /> {compact(community.membersCount)} members
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" /> {community.activeMembersCount} active today
            </span>
            <SampleBadge>Demo counts</SampleBadge>
          </p>
        </div>
        <div className="shrink-0">
          <JoinCommunityButton joined={flow.joined} pending={flow.pending} onJoin={() => flow.join()} onLeave={flow.leave} communityName={community.name} />
        </div>
      </div>
      {flow.joined && (
        <p className="mt-5 flex items-center gap-2 rounded-lg bg-mint/[0.08] px-3.5 py-2.5 text-sm text-mint">
          <Check aria-hidden="true" className="size-4" /> You’re part of this community.
        </p>
      )}
    </header>
  )
}

export function CommunityTabs({ active }) {
  const [params, setParams] = useSearchParams()
  const go = (id) => {
    const p = new URLSearchParams(params)
    if (id === 'feed') p.delete('tab')
    else p.set('tab', id)
    setParams(p)
  }
  const onKey = (e) => {
    const i = TABS.findIndex((t) => t.id === active)
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const next = TABS[(i + d + TABS.length) % TABS.length]
    go(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }
  return (
    <div role="tablist" aria-label="Community sections" onKeyDown={onKey} className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line">
      {TABS.map((t) => (
        <button
          key={t.id}
          id={`tab-${t.id}`}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          aria-controls="community-tabpanel"
          tabIndex={active === t.id ? 0 : -1}
          onClick={() => go(t.id)}
          className={cx(
            '-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150',
            active === t.id ? 'border-paper text-paper' : 'border-transparent text-paper/55 hover:text-paper',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
