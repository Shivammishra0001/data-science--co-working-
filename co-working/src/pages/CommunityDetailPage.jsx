import { useParams, useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { brand } from '../config/site'
import { useCommunity } from '../hooks/useCommunity'
import { CommunityFeed } from '../components/community/CommunityFeed'
import { CommunityHeader, CommunityTabs } from '../components/community/CommunityHeader'
import { TABS } from '../components/community/shared'
import { CommunityLoader } from '../components/community/CommunityLoader'
import { CommunityNav, CommunitySidebar, CommunitySwitcher } from '../components/community/CommunitySidebar'
import { CommunityAbout, CommunityEvents, CommunityMembers, CommunityProjects } from '../components/community/CommunityTabsContent'
import { EmptyState } from '../components/community/EmptyState'
import { btn } from '../components/community/shared'
import { ParticipationProvider } from '../components/community/Participation'
import { SmartLink } from '../components/ui/SmartLink'

const panels = { feed: CommunityFeed, about: CommunityAbout, projects: CommunityProjects, events: CommunityEvents, members: CommunityMembers }

// /community/:slug — read → join → participate. Calm layout, no scroll effects.
// Desktop: communities | feed (≤46rem) | info.  Smaller: one column
// (switcher, header, tabs, content, info).
export default function CommunityDetailPage() {
  const { slug } = useParams()
  const { data: community, loading, error } = useCommunity(slug)

  return (
    <div className="min-h-svh bg-ink pt-24 pb-24 sm:pt-28">
      <div className="mx-auto grid w-full max-w-[92rem] gap-6 px-[var(--spacing-gutter)] lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,46rem)_20rem] xl:justify-between">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CommunityNav current={slug} />
          </div>
        </aside>

        {loading ? (
          <div className="xl:col-span-2">
            <CommunityLoader label="Loading community" className="py-24" />
          </div>
        ) : error || !community ? (
          <div className="xl:col-span-2">
            <title>{`Community not found — ${brand.name}`}</title>
            <EmptyState
              icon={SearchX}
              titleAs="h1"
              title="We couldn’t find that community."
              body="It may have been renamed. Browse the directory to find it."
              action={
                <SmartLink href="/community" className={btn.primary}>
                  Browse communities
                </SmartLink>
              }
            />
          </div>
        ) : (
          <ParticipationProvider key={community.id} community={community}>
            <CommunityBody community={community} />
          </ParticipationProvider>
        )}
      </div>
    </div>
  )
}

function CommunityBody({ community }) {
  const [params] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'feed'
  const Panel = panels[tab]
  return (
    <>
      <title>{`${community.name} community — ${brand.name}`}</title>
      <meta name="description" content={`${community.name} Builders: ${community.about}`} />
      <section className="min-w-0" aria-label={`${community.name} community`}>
        <div className="mb-4 lg:hidden">
          <CommunitySwitcher current={community.slug} />
        </div>
        <CommunityHeader />
        <div className="mt-4">
          <CommunityTabs active={tab} />
        </div>
        {/* keyed so each tab switch fades in (200ms, 6px) — the only transition */}
        <div key={tab} id="community-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="animate-fade-in mt-5">
          <Panel />
        </div>
        <div className="mt-10 xl:hidden">
          <h2 className="mb-3 text-sm font-semibold text-paper/60">Community info</h2>
          <CommunitySidebar />
        </div>
      </section>
      <aside className="hidden xl:block" aria-label="Community info">
        <div className="sticky top-24">
          <CommunitySidebar />
        </div>
      </aside>
    </>
  )
}
