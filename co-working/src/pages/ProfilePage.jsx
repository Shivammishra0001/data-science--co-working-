import { useParams } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { brand } from '../config/site'
import { communities, communityHref } from '../data/communities'
import { findMemberByUsername } from '../data/communityMembers'
import { db } from '../api/mockStore'
import { Avatar } from '../components/ui/Avatar'
import { SmartLink } from '../components/ui/SmartLink'
import { BrandLogo } from '../components/community/BrandLogo'
import { EmptyState } from '../components/community/EmptyState'
import { btn } from '../components/community/shared'

// /profile/:username — placeholder so author links resolve. The full profile
// (posts, projects, follow) comes with the profile system.
export default function ProfilePage() {
  const { username } = useParams()
  const person = findMemberByUsername(username) ?? Object.values(db.users).find((u) => u.username === username)
  const joined = person?.communityIds ?? db.memberships.filter((m) => m.userId === person?.id && m.status === 'active').map((m) => m.communityId)
  const list = communities.filter((c) => joined.includes(c.id))

  return (
    <div className="min-h-svh bg-ink pt-28 pb-24">
      <div className="mx-auto w-full max-w-3xl px-[var(--spacing-gutter)]">
        {!person ? (
          <>
            <title>{`Profile not found — ${brand.name}`}</title>
            <EmptyState icon={UserRound} titleAs="h1" title="We couldn’t find that profile." action={<SmartLink href="/community" className={btn.primary}>Back to communities</SmartLink>} />
          </>
        ) : (
          <>
            <title>{`${person.name} — ${brand.name}`}</title>
            <div className="flex items-center gap-5">
              <Avatar name={person.name} accent={person.accent ?? 'sun'} size="lg" className="!size-20 text-xl" />
              <div>
                <h1 className="text-3xl font-semibold">{person.name}</h1>
                <p className="text-paper/60">{person.role}</p>
              </div>
            </div>
            {person.skills?.length > 0 && <p className="mt-6 text-paper/75">{person.skills.join(' · ')}</p>}
            <h2 className="mt-10 text-sm font-semibold text-paper/60">Communities</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {list.map((c) => (
                <li key={c.id}>
                  <SmartLink href={communityHref(c)} className="flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-sm hover:bg-paper/[0.06]">
                    <BrandLogo community={c} className="h-4" decorative /> {c.name}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-paper/45">{person.isLocal ? 'Your demo profile.' : 'Demo profile — fictional seed content.'} Full profiles are coming soon.</p>
          </>
        )}
      </div>
    </div>
  )
}
