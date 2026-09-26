// Community API — each function mirrors a planned endpoint. Today they resolve
// against local seed data + mockStore; later, swap the bodies for fetch() calls
// and keep the signatures. `opts.silent` skips the simulated latency (used for
// background refreshes after a mutation, so the UI never flashes a loader).

import { communities } from '../data/communities'
import { communityPosts, communityComments } from '../data/communityPosts'
import { communityMembers, findMember } from '../data/communityMembers'
import { communityProjects, findProject } from '../data/communityProjects'
import { communityEvents, findEvent } from '../data/communityEvents'
import { commit, db, uid } from './mockStore'

const wait = (ms, opts) => new Promise((r) => setTimeout(r, opts?.silent ? 0 : ms))
const fail = (status, message) => Object.assign(new Error(message), { status })

const findCommunity = (slug) => communities.find((c) => c.slug === slug)
const mustCommunity = (slug) => findCommunity(slug) ?? (() => { throw fail(404, 'Community not found') })()
const isMember = (userId, communityId) =>
  !!userId && db.memberships.some((m) => m.userId === userId && m.communityId === communityId && m.status === 'active')
const mustMember = (userId, communityId) => {
  if (!userId) throw fail(401, 'Sign in required')
  if (!isMember(userId, communityId)) throw fail(403, 'Join the community to participate')
}

export const getUser = (id) => findMember(id) ?? db.users[id] ?? { id, name: 'Former member', role: '', username: 'unknown' }

// ── communities ──────────────────────────────────────────────────────────

function withCounts(c) {
  const local = db.memberships.filter((m) => m.communityId === c.id && m.status === 'active').length
  return { ...c, membersCount: c.membersCount + local }
}

function matches(c, q) {
  if (!q) return true
  const hay = [c.name, c.tagline, c.description, c.about, ...(c.categories ?? []), ...(c.keywords ?? []), ...(c.topics ?? [])]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}

const sorters = {
  popular: (a, b) => b.membersCount - a.membersCount,
  active: (a, b) => b.activeMembersCount - a.activeMembersCount,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  alpha: (a, b) => a.name.localeCompare(b.name),
}

/** GET /api/communities?q=&category=&sort= */
export async function getCommunities({ q = '', category = 'All', sort = 'popular' } = {}, opts) {
  await wait(260, opts)
  return communities
    .map(withCounts)
    .filter((c) => (category === 'All' || c.categories.includes(category)) && matches(c, q))
    .sort(sorters[sort] ?? sorters.popular)
}

/** GET /api/communities/:slug */
export async function getCommunity(slug, opts) {
  await wait(220, opts)
  return withCounts(mustCommunity(slug))
}

// ── membership ───────────────────────────────────────────────────────────

/** GET /api/communities/:slug/membership (current user) */
export async function getMembership(slug, userId, opts) {
  await wait(120, opts)
  const c = mustCommunity(slug)
  return db.memberships.find((m) => m.userId === userId && m.communityId === c.id && m.status === 'active') ?? null
}

export function getJoinedCommunityIds(userId) {
  return db.memberships.filter((m) => m.userId === userId && m.status === 'active').map((m) => m.communityId)
}

/** POST /api/communities/:slug/join */
export async function joinCommunity(slug, userId) {
  await wait(650)
  if (!userId) throw fail(401, 'Sign in required')
  const c = mustCommunity(slug)
  let m = db.memberships.find((x) => x.userId === userId && x.communityId === c.id)
  if (!m) {
    m = { id: uid('mem'), userId, communityId: c.id, status: 'active', joinedAt: new Date().toISOString() }
    db.memberships.push(m)
  } else {
    m.status = 'active'
    m.joinedAt = new Date().toISOString()
  }
  commit()
  return m
}

/** DELETE /api/communities/:slug/join */
export async function leaveCommunity(slug, userId) {
  await wait(400)
  const c = mustCommunity(slug)
  const m = db.memberships.find((x) => x.userId === userId && x.communityId === c.id)
  if (m) m.status = 'left'
  commit()
}

// ── posts ────────────────────────────────────────────────────────────────

function assemblePost(p, userId) {
  const patch = db.postPatches[p.id] ?? {}
  if (patch.deleted) return null
  const likes = (p.likes ?? 0) + db.reactions.filter((r) => r.postId === p.id).length
  const comments = [...communityComments, ...db.comments].filter((c) => c.postId === p.id && !db.deletedCommentIds.includes(c.id))
  let poll = null
  if (p.poll) {
    const votes = db.pollVotes.filter((v) => v.postId === p.id)
    const options = p.poll.options.map((o) => ({ ...o, votes: o.votes + votes.filter((v) => v.optionId === o.id).length }))
    poll = { options, total: options.reduce((s, o) => s + o.votes, 0), myVote: votes.find((v) => v.userId === userId)?.optionId ?? null }
  }
  return {
    ...p,
    pinned: patch.pinned ?? !!p.pinned,
    locked: patch.locked ?? false,
    featured: patch.featured ?? !!p.featured,
    author: getUser(p.authorId),
    likes,
    liked: db.reactions.some((r) => r.postId === p.id && r.userId === userId),
    saved: db.bookmarks.some((b) => b.postId === p.id && b.userId === userId),
    commentsCount: comments.length,
    poll,
    project: p.projectId ? findProject(p.projectId) : null,
    event: p.eventId ? assembleEvent(findEvent(p.eventId), userId) : null,
  }
}

/** GET /api/communities/:slug/posts */
export async function getCommunityPosts(slug, userId, opts) {
  await wait(420, opts)
  const c = mustCommunity(slug)
  return [...db.posts, ...communityPosts]
    .filter((p) => p.communityId === c.id)
    .map((p) => assemblePost(p, userId))
    .filter(Boolean)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt))
}

/** POST /api/communities/:slug/posts */
export async function createPost(slug, userId, { content, images = [], link = null, poll = null, projectId = null }) {
  await wait(500)
  const c = mustCommunity(slug)
  mustMember(userId, c.id)
  const type = poll ? 'poll' : projectId ? 'project' : images.length ? 'image' : link ? 'link' : content.replace(/(\s*#\w+)+\s*$/, '').trim().endsWith('?') ? 'question' : 'text'
  const now = new Date().toISOString()
  const post = {
    id: uid('post'),
    communityId: c.id,
    authorId: userId,
    type,
    content: content.trim(),
    tags: [...content.matchAll(/#(\w+)/g)].map((m) => m[1]),
    images: images.map((src) => ({ src, alt: 'Image shared by the author' })),
    link: link ? { url: link, title: link.replace(/^https?:\/\//, ''), domain: safeDomain(link) } : null,
    poll: poll ? { options: poll.map((label, i) => ({ id: String.fromCharCode(97 + i), label, votes: 0 })) } : null,
    projectId,
    eventId: null,
    likes: 0,
    createdAt: now,
    updatedAt: now,
  }
  db.posts.unshift(post)
  commit()
  return assemblePost(post, userId)
}

function safeDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const postCommunity = (postId) => [...db.posts, ...communityPosts].find((p) => p.id === postId)?.communityId

/** POST/DELETE /api/posts/:postId/reactions */
export async function setReaction(postId, userId, on) {
  await wait(120)
  mustMember(userId, postCommunity(postId))
  db.reactions = db.reactions.filter((r) => !(r.postId === postId && r.userId === userId))
  if (on) db.reactions.push({ id: uid('rx'), userId, postId, type: 'like' })
  commit()
}

/** POST/DELETE /api/posts/:postId/save */
export async function setSaved(postId, userId, on) {
  await wait(120)
  mustMember(userId, postCommunity(postId))
  db.bookmarks = db.bookmarks.filter((b) => !(b.postId === postId && b.userId === userId))
  if (on) db.bookmarks.push({ id: uid('bm'), userId, postId })
  commit()
}

/** POST /api/posts/:postId/poll-votes */
export async function votePoll(postId, userId, optionId) {
  await wait(200)
  mustMember(userId, postCommunity(postId))
  db.pollVotes = db.pollVotes.filter((v) => !(v.postId === postId && v.userId === userId))
  db.pollVotes.push({ userId, postId, optionId })
  commit()
}

/** Moderation — PATCH /api/posts/:postId  (pinned | locked | deleted) */
export async function moderatePost(postId, patch) {
  await wait(250)
  db.postPatches[postId] = { ...db.postPatches[postId], ...patch }
  commit()
}

// ── comments ─────────────────────────────────────────────────────────────

/** GET /api/posts/:postId/comments → threaded (one level of replies) */
export async function getComments(postId, opts) {
  await wait(300, opts)
  const all = [...communityComments, ...db.comments]
    .filter((c) => c.postId === postId && !db.deletedCommentIds.includes(c.id))
    .map((c) => ({ ...c, author: getUser(c.authorId) }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return all.filter((c) => !c.parentCommentId).map((c) => ({ ...c, replies: all.filter((r) => r.parentCommentId === c.id) }))
}

/** POST /api/posts/:postId/comments */
export async function addComment(postId, userId, { content, parentCommentId = null }) {
  await wait(300)
  mustMember(userId, postCommunity(postId))
  const comment = { id: uid('cm'), postId, authorId: userId, parentCommentId, content: content.trim(), createdAt: new Date().toISOString() }
  db.comments.push(comment)
  commit()
  return comment
}

/** DELETE /api/comments/:id (moderator) */
export async function removeComment(commentId) {
  await wait(200)
  db.deletedCommentIds.push(commentId)
  commit()
}

// ── projects · events · members ──────────────────────────────────────────

/** GET /api/communities/:slug/projects */
export async function getCommunityProjects(slug, opts) {
  await wait(300, opts)
  const c = mustCommunity(slug)
  return communityProjects.filter((p) => p.communityIds.includes(c.id)).map((p) => ({ ...p, builder: getUser(p.builderId) }))
}

function assembleEvent(e, userId) {
  if (!e) return null
  const rsvps = db.rsvps.filter((r) => r.eventId === e.id)
  return { ...e, host: getUser(e.hostId), participantsCount: e.participantsCount + rsvps.length, going: rsvps.some((r) => r.userId === userId) }
}

/** GET /api/communities/:slug/events */
export async function getCommunityEvents(slug, userId, opts) {
  await wait(300, opts)
  const c = mustCommunity(slug)
  return communityEvents
    .filter((e) => e.communityId === c.id)
    .map((e) => assembleEvent(e, userId))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** POST/DELETE /api/events/:id/rsvp */
export async function setRsvp(eventId, userId, on) {
  await wait(350)
  mustMember(userId, findEvent(eventId)?.communityId)
  db.rsvps = db.rsvps.filter((r) => !(r.eventId === eventId && r.userId === userId))
  if (on) db.rsvps.push({ userId, eventId })
  commit()
}

/** GET /api/communities/:slug/members */
export async function getCommunityMembers(slug, opts) {
  await wait(300, opts)
  const c = mustCommunity(slug)
  const locals = db.memberships
    .filter((m) => m.communityId === c.id && m.status === 'active' && db.users[m.userId])
    .map((m) => ({ ...db.users[m.userId], joinedAt: m.joinedAt, isLocal: true }))
  const seeded = communityMembers
    .filter((m) => m.communityIds.includes(c.id))
    .map((m) => ({ ...m, isModerator: c.moderatorIds?.includes(m.id) }))
  return [...locals, ...seeded]
}

// ── demo auth ────────────────────────────────────────────────────────────

/** POST /api/auth/session — demo only: no password, no server. */
export async function demoSignIn({ name, email, moderator = false }) {
  await wait(450)
  const username = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'builder'
  const id = `u_${username}`
  const user = { id, username, name: name.trim(), email: email.trim(), role: moderator ? 'Community moderator' : 'Community member', isModerator: moderator, accent: 'sun', skills: [], isLocal: true }
  db.users[id] = user
  commit()
  return user
}
