import { useEffect, useEffectEvent, useState } from 'react'
import * as api from '../api/communityApi'
import { subscribe } from '../api/mockStore'
import { useAuth } from '../auth/useAuth'

// Minimal query hook: loads when `key` changes (showing the small loader),
// then silently re-fetches whenever the store changes after a mutation, so
// counts and states stay in sync without any loading flicker.
// `keepPrevious`: while a new key loads, keep showing the last result (search-as-you-type).
export function useQuery(key, fetcher, { enabled = true, keepPrevious = false } = {}) {
  const [state, setState] = useState({ key: null, data: undefined, error: null })
  const run = useEffectEvent((opts) => fetcher(opts))

  useEffect(() => {
    if (!enabled) return
    let alive = true
    run().then(
      (data) => alive && setState({ key, data, error: null }),
      (error) => alive && setState({ key, data: undefined, error }),
    )
    const unsub = subscribe(() =>
      run({ silent: true }).then(
        (data) => alive && setState((s) => (s.key === key ? { ...s, data } : s)),
        () => {},
      ),
    )
    return () => {
      alive = false
      unsub()
    }
  }, [key, enabled])

  const fresh = state.key === key
  return {
    data: fresh || keepPrevious ? state.data : undefined,
    error: fresh ? state.error : null,
    loading: enabled && !fresh,
  }
}

export function useCommunities(params) {
  return useQuery(`communities:${JSON.stringify(params)}`, (o) => api.getCommunities(params, o), { keepPrevious: true })
}

export function useCommunity(slug) {
  return useQuery(`community:${slug}`, (o) => api.getCommunity(slug, o))
}

export function useCommunityPosts(slug) {
  const { user } = useAuth()
  return useQuery(`posts:${slug}:${user?.id ?? 'anon'}`, (o) => api.getCommunityPosts(slug, user?.id, o))
}

export function useComments(postId, enabled) {
  return useQuery(`comments:${postId}`, (o) => api.getComments(postId, o), { enabled })
}

// Membership for the current user + join/leave with a pending state.
export function useCommunityMembership(slug) {
  const { user } = useAuth()
  const { data: membership, loading } = useQuery(`membership:${slug}:${user?.id ?? 'anon'}`, (o) =>
    user ? api.getMembership(slug, user.id, o) : Promise.resolve(null),
  )
  const [pending, setPending] = useState(null) // 'join' | 'leave' | null

  // `asUser` lets a just-signed-in user join before React state has caught up
  const join = async (asUser = user) => {
    setPending('join')
    try {
      return await api.joinCommunity(slug, asUser.id)
    } finally {
      setPending(null)
    }
  }
  const leave = async () => {
    setPending('leave')
    try {
      await api.leaveCommunity(slug, user.id)
    } finally {
      setPending(null)
    }
  }

  return { joined: !!membership, membership, loading, pending, join, leave }
}

// Joined community ids for the sidebar ("Your communities").
export function useJoinedCommunityIds() {
  const { user } = useAuth()
  const { data } = useQuery(`joined:${user?.id ?? 'anon'}`, async () => (user ? api.getJoinedCommunityIds(user.id) : []))
  return data ?? []
}
