import { Fragment } from 'react'
import { MessagesSquare } from 'lucide-react'
import { useCommunityPosts } from '../../hooks/useCommunity'
import { BrandLogo } from './BrandLogo'
import { CommunityLoader } from './CommunityLoader'
import { CreatePost } from './CreatePost'
import { EmptyState } from './EmptyState'
import { btn } from './shared'
import { JoinCommunityButton } from './JoinCommunityButton'
import { useParticipation } from './useParticipation'
import { PostCard } from './PostCard'

// Posts render as a plain list — no scroll effects, no animated cards.
// Not joined: the feed is a readable preview, with the composer replaced by a
// join callout (and a second one after a few posts).
export function CommunityFeed() {
  const { community, flow, participate, muted, composerRef } = useParticipation()
  const { data: posts, loading } = useCommunityPosts(community.slug)
  const visible = posts?.filter((p) => !muted.has(p.authorId))

  return (
    <div className="flex flex-col gap-4">
      {flow.joined ? <CreatePost /> : <JoinCallout />}

      {loading ? (
        <CommunityLoader label="Loading posts" />
      ) : visible?.length ? (
        <ol className="animate-fade-in flex flex-col gap-4" aria-label={`Posts in ${community.name}`}>
          {visible.map((p, i) => (
            <Fragment key={p.id}>
              <li id={p.id}>
                <PostCard post={p} />
              </li>
              {!flow.joined && i === 2 && visible.length > 3 && (
                <li>
                  <JoinCallout inline />
                </li>
              )}
            </Fragment>
          ))}
        </ol>
      ) : (
        <EmptyState
          icon={MessagesSquare}
          title="This community is quiet right now."
          body="Be the first person to start the conversation."
          action={
            <button type="button" onClick={() => participate('create posts', () => composerRef.current?.focus())} className={btn.primary}>
              Create post
            </button>
          }
        />
      )}
    </div>
  )
}

function JoinCallout({ inline = false }) {
  const { community, flow } = useParticipation()
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-line bg-ink-2 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <BrandLogo community={community} className="h-9" decorative />
        <div>
          <p className="font-semibold">{inline ? 'Join to participate in the conversation.' : 'Join this community to start a conversation.'}</p>
          <p className="mt-0.5 text-sm text-paper/60">Members can post, reply, react, save posts and join events.</p>
        </div>
      </div>
      <JoinCommunityButton joined={flow.joined} pending={flow.pending} onJoin={() => flow.join()} onLeave={flow.leave} communityName={community.name} size="sm" />
    </div>
  )
}
