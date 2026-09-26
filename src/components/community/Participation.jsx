import { useRef, useState } from 'react'
import { useJoinFlow } from '../../hooks/useJoinFlow'
import { Dialog } from '../ui/Dialog'
import { BrandLogo } from './BrandLogo'
import { btn } from './shared'
import { Spinner } from './CommunityLoader'
import { ParticipationContext as Ctx } from './useParticipation'

// One gate for every interaction on a community page:
//   participate(reason, action)
//     logged out → sign-in (in place) → join → action
//     not joined → small "Join to …" prompt → join → action
//     joined     → action
// Components never check membership themselves; they just call participate().
export function ParticipationProvider({ community, children }) {
  const flow = useJoinFlow(community)
  const [prompt, setPrompt] = useState(null) // { reason, action }
  const [muted, setMuted] = useState(() => new Set())
  const composerRef = useRef(null)

  const participate = (reason, action) => {
    if (!flow.user) return flow.join(action)
    if (!flow.joined) return setPrompt({ reason, action })
    return action?.(flow.user)
  }

  const confirmJoin = async () => {
    const next = prompt?.action
    await flow.join()
    setPrompt(null)
    next?.(flow.user)
  }

  const canModerate = !!flow.user && (flow.user.isModerator || community.moderatorIds?.includes(flow.user.id))
  const mute = (authorId) => setMuted((s) => new Set(s).add(authorId))

  return (
    <Ctx.Provider value={{ community, flow, participate, canModerate, muted, mute, composerRef }}>
      {children}
      <Dialog
        open={!!prompt}
        onClose={() => setPrompt(null)}
        title={`Join ${flow.label}`}
        description={prompt ? `Join the community to ${prompt.reason}.` : undefined}
      >
        <div className="flex items-center gap-4 rounded-xl border border-line bg-ink p-4">
          <BrandLogo community={community} className="h-10" />
          <div className="text-sm text-paper/70">
            Members can post, reply, react, save and join events. You can leave at any time.
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setPrompt(null)} className={btn.ghost}>
            Not now
          </button>
          <button type="button" onClick={confirmJoin} disabled={flow.pending === 'join'} className={btn.primary}>
            {flow.pending === 'join' && <Spinner />}
            Join community
          </button>
        </div>
      </Dialog>
    </Ctx.Provider>
  )
}
