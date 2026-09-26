// Local stand-in for the backend. Seed content (src/data/*) is read-only;
// everything a user does is stored here as deltas and persisted to
// localStorage, so the demo survives reloads. Replace communityApi.js with
// real fetch calls and this file goes away.

const KEY = 'chrysalis.community.v1'

const empty = () => ({
  users: {}, // id → user (demo sign-ins)
  memberships: [], // { id, userId, communityId, status, joinedAt }
  posts: [], // user-created posts
  comments: [], // user-created comments
  reactions: [], // { id, userId, postId, type }
  bookmarks: [], // { id, userId, postId }
  pollVotes: [], // { userId, postId, optionId }
  rsvps: [], // { userId, eventId }
  postPatches: {}, // postId → { pinned?, locked?, deleted? }  (moderation)
  deletedCommentIds: [],
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty()
  } catch {
    return empty()
  }
}

export const db = load()

const listeners = new Set()
let version = 0

export function commit() {
  version++
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    // quota (e.g. large image data URLs) — keep working in memory
  }
  listeners.forEach((fn) => fn(version))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const uid = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
