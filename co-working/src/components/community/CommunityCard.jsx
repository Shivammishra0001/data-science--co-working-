import { ArrowRight, Users } from 'lucide-react'
import { communityHref } from '../../data/communities'
import { useJoinFlow } from '../../hooks/useJoinFlow'
import { SmartLink } from '../ui/SmartLink'
import { BrandLogo } from './BrandLogo'
import { compact } from './shared'
import { JoinCommunityButton } from './JoinCommunityButton'

// Directory card: quiet and structured. The whole card opens the community;
// the join button sits above the stretched link so it stays its own target.
export function CommunityCard({ community }) {
  const flow = useJoinFlow(community)
  return (
    <li
      style={{ '--acc': community.theme.accent }}
      className="group relative flex flex-col rounded-xl border border-line bg-ink-2 p-5 transition-colors duration-200 hover:border-line-strong hover:bg-ink-3 focus-within:border-line-strong"
    >
      <div className="flex items-start justify-between gap-4">
        <BrandLogo community={community} className="h-11 transition-transform duration-200 group-hover:scale-105" />
        <ArrowRight aria-hidden="true" className="size-4 text-paper/35 transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-paper" />
      </div>
      <h2 className="display-upright mt-5 text-[1.9rem] leading-none">
        <SmartLink
          href={communityHref(community)}
          className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-sun"
        >
          {community.name}
        </SmartLink>
      </h2>
      <p className="mt-1.5 text-sm text-paper/70">{community.tagline}</p>
      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] text-paper/55">
        <div className="flex items-center gap-1.5">
          <Users aria-hidden="true" className="size-3.5" />
          <dt className="sr-only">Members</dt>
          <dd>{compact(community.membersCount)} members</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
          <dt className="sr-only">Active today</dt>
          <dd>{community.activeMembersCount} active today</dd>
        </div>
      </dl>
      <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-xs text-paper/45">{community.categories.join(' · ')}</span>
        <JoinCommunityButton
          size="sm"
          joined={flow.joined}
          pending={flow.pending}
          onJoin={() => flow.join()}
          onLeave={flow.leave}
          showLeave={false}
          communityName={community.name}
        />
      </div>
    </li>
  )
}
