import { ArrowUpRight, BookOpen, CalendarX, CodeXml, ExternalLink, FolderOpen, Globe, Shield, UserRound } from 'lucide-react'
import * as api from '../../api/communityApi'
import { profileHref } from '../../data/communityMembers'
import { useQuery } from '../../hooks/useCommunity'
import { useAuth } from '../../auth/useAuth'
import { Avatar } from '../ui/Avatar'
import { SampleBadge } from '../ui/SampleBadge'
import { SmartLink } from '../ui/SmartLink'
import { BrandLogo } from './BrandLogo'
import { compact } from './shared'
import { CommunityLoader } from './CommunityLoader'
import { EmptyState } from './EmptyState'
import { useParticipation } from './useParticipation'
import { EventCard } from './PostMedia'

const card = 'rounded-xl border border-line bg-ink-2 p-5 sm:p-6'

export function CommunityLinks({ community, className }) {
  const links = [
    { href: community.officialWebsite, label: 'Official website', icon: Globe },
    { href: community.docs, label: 'Documentation', icon: BookOpen },
    { href: community.github, label: 'GitHub', icon: CodeXml },
  ].filter((l) => l.href)
  return (
    <ul className={className}>
      {links.map(({ href, label, icon: Icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-md py-1.5 text-sm text-paper/80 hover:text-paper hover:underline">
            <Icon aria-hidden="true" className="size-4 text-paper/50" />
            {label}
            <ExternalLink aria-hidden="true" className="size-3 text-paper/35" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function CommunityRules({ rules }) {
  return (
    <ol className="flex flex-col gap-2.5 text-sm text-paper/75">
      {rules.map((r, i) => (
        <li key={r} className="flex gap-3">
          <span className="font-mono text-paper/40">{i + 1}.</span>
          {r}
        </li>
      ))}
    </ol>
  )
}

export function CommunityAbout() {
  const { community } = useParticipation()
  const created = new Date(community.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  return (
    <div className="flex flex-col gap-4">
      <section className={card} aria-labelledby="about-title">
        <div className="flex items-center gap-4">
          <BrandLogo community={community} className="h-10" />
          <h2 id="about-title" className="text-xl font-semibold">
            About {community.name} Builders
          </h2>
        </div>
        <p className="mt-4 text-[1.02rem] leading-relaxed text-paper/80">This community is {community.about.charAt(0).toLowerCase() + community.about.slice(1)}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-paper/50">Members</dt>
            <dd className="mt-0.5 font-semibold">{compact(community.membersCount)}</dd>
          </div>
          <div>
            <dt className="text-paper/50">Active today</dt>
            <dd className="mt-0.5 font-semibold">{community.activeMembersCount}</dd>
          </div>
          <div>
            <dt className="text-paper/50">Created</dt>
            <dd className="mt-0.5 font-semibold">{created}</dd>
          </div>
        </dl>
      </section>
      <section className={card} aria-labelledby="topics-title">
        <h2 id="topics-title" className="font-semibold">
          Topics
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {community.topics.map((t) => (
            <li key={t} className="rounded-full border border-line-strong px-3 py-1 text-sm text-paper/80">
              {t}
            </li>
          ))}
        </ul>
      </section>
      <section className={card} aria-labelledby="rules-title">
        <h2 id="rules-title" className="flex items-center gap-2 font-semibold">
          <Shield aria-hidden="true" className="size-4 text-paper/55" /> Community rules
        </h2>
        <div className="mt-4">
          <CommunityRules rules={community.rules} />
        </div>
      </section>
      <section className={card} aria-labelledby="links-title">
        <h2 id="links-title" className="font-semibold">
          Resources
        </h2>
        <CommunityLinks community={community} className="mt-2" />
        <p className="mt-4 text-xs text-paper/45">
          An independent builder community. Not affiliated with or endorsed by {community.name}.
        </p>
      </section>
    </div>
  )
}

export function CommunityProjects() {
  const { community } = useParticipation()
  const { data, loading } = useQuery(`projects:${community.slug}`, (o) => api.getCommunityProjects(community.slug, o))
  if (loading) return <CommunityLoader label="Loading projects" />
  if (!data?.length) return <EmptyState icon={FolderOpen} title="No projects yet." body="Projects that use this technology will appear here." />
  return (
    <div>
      <SampleBadge className="mb-3">Demo projects</SampleBadge>
      <ul className="grid gap-4 sm:grid-cols-2">
        {data.map((p) => (
          <li key={p.id} className="flex flex-col rounded-xl border border-line bg-ink-2 p-5 transition-colors hover:border-line-strong">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-paper/[0.07] px-2.5 py-0.5 font-mono text-[0.66rem] tracking-wide text-paper/75 uppercase">{p.stage}</span>
              <span className="text-xs text-paper/45">{p.tech.join(' · ')}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-paper/65">{p.description}</p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-4">
              <SmartLink href={profileHref(p.builder)} className="text-sm text-paper/60 hover:text-paper hover:underline">
                by {p.builder.name}
              </SmartLink>
              <SmartLink href="/#projects" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                View project <ArrowUpRight aria-hidden="true" className="size-4" />
              </SmartLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CommunityEvents() {
  const { community } = useParticipation()
  const { user } = useAuth()
  const { data, loading } = useQuery(`events:${community.slug}:${user?.id ?? 'anon'}`, (o) => api.getCommunityEvents(community.slug, user?.id, o))
  if (loading) return <CommunityLoader label="Loading events" />
  if (!data?.length) return <EmptyState icon={CalendarX} title="No upcoming events." body="Talks, workshops and meetups will show up here." />
  return (
    <div>
      <SampleBadge className="mb-3">Demo events</SampleBadge>
      <ul className="flex flex-col gap-3">
        {data.map((e) => (
          <li key={e.id}>
            <EventCard event={e} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CommunityMembers() {
  const { community } = useParticipation()
  const { data, loading } = useQuery(`members:${community.slug}`, (o) => api.getCommunityMembers(community.slug, o))
  if (loading) return <CommunityLoader label="Loading members" />
  if (!data?.length) return <EmptyState icon={UserRound} title="No members yet." body="Be the first to join." />
  return (
    <div>
      <SampleBadge className="mb-3">Demo profiles</SampleBadge>
      <ul className="grid gap-3 sm:grid-cols-2">
        {data.map((m) => (
          <li key={m.id} className="flex items-start gap-3 rounded-xl border border-line bg-ink-2 p-4">
            <Avatar name={m.name} accent={m.accent ?? 'sun'} size="md" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-semibold">
                {m.name}
                {m.isModerator && <span className="rounded-full bg-sun/15 px-2 py-0.5 text-[0.65rem] font-semibold text-sun">Moderator</span>}
                {m.isLocal && <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[0.65rem] font-semibold text-mint">You</span>}
              </p>
              <p className="text-sm text-paper/55">{m.role}</p>
              {m.skills?.length > 0 && <p className="mt-2 text-xs text-paper/50">{m.skills.join(' · ')}</p>}
              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-paper/50">
                <span>{m.projectsCount ?? 0} projects</span>
                <SmartLink href={profileHref(m)} className="font-semibold text-paper hover:underline">
                  View profile
                </SmartLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
