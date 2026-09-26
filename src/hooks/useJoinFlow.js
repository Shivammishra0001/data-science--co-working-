import { useAuth } from '../auth/useAuth'
import { useToast } from '../components/ui/useToast'
import { useCommunityMembership } from './useCommunity'

// READ → JOIN → PARTICIPATE, in one place.
//  - logged out: sign-in dialog opens in place; after sign-in the join completes
//    and the pending action (if any) runs — the user never loses their spot
//  - logged in: small spinner on the button, then ✓ Joined + a toast
export function useJoinFlow(community) {
  const { user, openLogin } = useAuth()
  const toast = useToast()
  const m = useCommunityMembership(community.slug)
  const label = `${community.name} Builders`

  const joinAs = async (u, then) => {
    await m.join(u)
    toast(`You’ve joined ${label}.`)
    then?.(u)
  }

  const join = (then) => {
    if (!user) {
      openLogin({ message: `Sign in to join ${label} and take part in the conversation.`, onSuccess: (u) => joinAs(u, then) })
      return
    }
    return joinAs(user, then)
  }

  const leave = async () => {
    await m.leave()
    toast(`You left ${label}.`, { tone: 'info' })
  }

  return { ...m, user, join, leave, label }
}
