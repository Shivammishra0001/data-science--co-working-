import { useState } from 'react'
import {
  Bookmark,
  BellOff,
  Flag,
  Heart,
  Link2,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Share2,
  Star,
  Trash2,
  Unlock,
} from 'lucide-react'
import * as api from '../../api/communityApi'
import { profileHref } from '../../data/communityMembers'
import { cx } from '../../utils/accents'
import { fullDate, timeAgo } from '../../utils/time'
import { Avatar } from '../ui/Avatar'
import { SmartLink } from '../ui/SmartLink'
import { useToast } from '../ui/useToast'
import { CommentThread } from './CommentThread'
import { Menu } from './Menu'
import { useParticipation } from './useParticipation'
import { CodeBlock, EventCard, LinkPreview, PollView, PostImages, ProjectPreview } from './PostMedia'

const typeLabel = { question: 'Question', announcement: 'Announcement', event: 'Event', project: 'Project update', poll: 'Poll' }

export function PostCard({ post }) {
  const [open, setOpen] = useState(false)
  const [focusKey, setFocusKey] = useState(0)
  const { author } = post

  return (
    <article
      aria-labelledby={`post-${post.id}-author`}
      className={cx('rounded-xl border bg-ink-2 px-4 pt-4 pb-2 sm:px-5 sm:pt-5', post.pinned ? 'border-line-strong' : 'border-line')}
    >
      {(post.pinned || post.featured) && (
        <p className="mb-3 flex items-center gap-3 font-mono text-[0.66rem] tracking-[0.12em] text-paper/55 uppercase">
          {post.pinned && (
            <span className="flex items-center gap-1.5">
              <Pin aria-hidden="true" className="size-3.5 text-sun" /> Pinned
            </span>
          )}
          {post.featured && (
            <span className="flex items-center gap-1.5">
              <Star aria-hidden="true" className="size-3.5 text-sun" /> Featured
            </span>
          )}
        </p>
      )}

      <header className="flex items-start gap-3">
        <SmartLink href={profileHref(author)} tabIndex={-1} aria-hidden="true">
          <Avatar name={author.name} accent={author.accent ?? 'sun'} size="md" className="!size-11" />
        </SmartLink>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <SmartLink id={`post-${post.id}-author`} href={profileHref(author)} className="font-semibold hover:underline">
              {author.name}
            </SmartLink>
            {typeLabel[post.type] && (
              <span className="rounded-full bg-paper/[0.07] px-2 py-0.5 text-[0.7rem] font-medium text-paper/70">{typeLabel[post.type]}</span>
            )}
          </p>
          <p className="text-sm text-paper/50">
            {author.role}
            {author.role && ' · '}
            <time dateTime={post.createdAt} title={fullDate(post.createdAt)}>
              {timeAgo(post.createdAt)}
            </time>
          </p>
        </div>
        <PostMoreMenu post={post} />
      </header>

      <div className="mt-3 text-[0.98rem] leading-relaxed text-paper/90">
        <PostText text={post.content} />
      </div>
      {post.tags?.length > 0 && (
        <p className="mt-2 flex flex-wrap gap-x-2 text-sm text-[#8196ff]">
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </p>
      )}

      {post.code && <CodeBlock code={post.code} />}
      {post.images?.length > 0 && <PostImages images={post.images} />}
      {post.link && <LinkPreview link={post.link} />}
      {post.project && <ProjectPreview project={post.project} />}
      {post.poll && <PollView post={post} />}
      {post.event && (
        <div className="mt-3">
          <EventCard event={post.event} compact />
        </div>
      )}

      <PostActions
        post={post}
        commentsOpen={open}
        onComment={() => {
          setOpen(true)
          setFocusKey((k) => k + 1)
        }}
        onToggleComments={() => setOpen((o) => !o)}
      />
      {open && <CommentThread post={post} focusKey={focusKey} />}
      {open && <div className="h-3" />}
    </article>
  )
}

// Paragraphs + #tags inline, no markdown engine needed.
function PostText({ text }) {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i} className={cx('whitespace-pre-line', i > 0 && 'mt-3')}>
      {para}
    </p>
  ))
}

function PostActions({ post, commentsOpen, onComment, onToggleComments }) {
  const { participate } = useParticipation()
  const toast = useToast()
  const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#${post.id}` : ''

  const like = () => participate('react to posts', (u) => api.setReaction(post.id, u.id, !post.liked))
  const save = () =>
    participate('save posts', async (u) => {
      await api.setSaved(post.id, u.id, !post.saved)
      toast(post.saved ? 'Removed from saved' : 'Post saved', { tone: post.saved ? 'info' : 'success' })
    })
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copied')
    } catch {
      toast('Couldn’t copy — use the address bar', { tone: 'info' })
    }
  }
  const share = post.content.slice(0, 120)

  const action = 'inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-paper/[0.07]'
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-1 border-t border-line pt-1.5">
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={like} aria-pressed={post.liked} className={cx(action, post.liked ? 'text-flare' : 'text-paper/70 hover:text-paper')}>
          <Heart aria-hidden="true" className={cx('size-[1.1rem]', post.liked && 'fill-current')} />
          <span>{post.likes}</span>
          <span className="sr-only">{post.liked ? 'Unlike' : 'Like'}</span>
        </button>
        <button
          type="button"
          onClick={post.commentsCount && !commentsOpen ? onToggleComments : onComment}
          aria-expanded={commentsOpen}
          className={cx(action, 'text-paper/70 hover:text-paper')}
        >
          <MessageCircle aria-hidden="true" className="size-[1.1rem]" />
          <span>{post.commentsCount}</span>
          <span className="sr-only">{post.commentsCount === 1 ? 'comment' : 'comments'}</span>
          {post.locked && <Lock aria-label="Comments locked" className="size-3.5 text-paper/45" />}
        </button>
      </div>
      <div className="flex items-center gap-0.5">
        <Menu
          label="Share post"
          trigger={
            <>
              <Share2 aria-hidden="true" className="size-[1.1rem]" /> <span className="hidden sm:inline">Share</span>
            </>
          }
          items={[
            { label: 'Copy link', icon: Link2, onSelect: copy },
            { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
            { label: 'Share on X', href: `https://x.com/intent/post?text=${encodeURIComponent(share)}&url=${encodeURIComponent(url)}` },
          ]}
        />
        <button type="button" onClick={save} aria-pressed={post.saved} className={cx(action, post.saved ? 'text-sun' : 'text-paper/70 hover:text-paper')}>
          <Bookmark aria-hidden="true" className={cx('size-[1.1rem]', post.saved && 'fill-current')} />
          <span className="hidden sm:inline">{post.saved ? 'Saved' : 'Save'}</span>
          <span className="sr-only sm:hidden">{post.saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  )
}

function PostMoreMenu({ post }) {
  const { canModerate, mute } = useParticipation()
  const toast = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const mod = async (patch, msg) => {
    await api.moderatePost(post.id, patch)
    toast(msg, { tone: 'info' })
  }
  return (
    <Menu
      label="More options for this post"
      trigger={<MoreHorizontal aria-hidden="true" className="size-4.5" />}
      items={[
        { label: 'Copy link', icon: Link2, onSelect: () => navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${post.id}`).then(() => toast('Link copied')) },
        { label: 'Report post', icon: Flag, onSelect: () => toast('Thanks — a moderator will review this.', { tone: 'info' }) },
        { label: `Mute ${post.author.name.split(' ')[0]}`, icon: BellOff, onSelect: () => { mute(post.authorId); toast(`Muted ${post.author.name} in this feed`, { tone: 'info' }) } },
        canModerate && { label: post.pinned ? 'Unpin post' : 'Pin to top', icon: Pin, onSelect: () => mod({ pinned: !post.pinned }, post.pinned ? 'Post unpinned' : 'Post pinned') },
        canModerate && { label: post.featured ? 'Remove from featured' : 'Feature post', icon: Star, onSelect: () => mod({ featured: !post.featured }, post.featured ? 'No longer featured' : 'Post featured') },
        canModerate && { label: post.locked ? 'Unlock discussion' : 'Lock discussion', icon: post.locked ? Unlock : Lock, onSelect: () => mod({ locked: !post.locked }, post.locked ? 'Discussion unlocked' : 'Discussion locked') },
        canModerate &&
          (confirmDelete
            ? { label: 'Confirm delete', icon: Trash2, danger: true, onSelect: () => mod({ deleted: true }, 'Post deleted') }
            : { label: 'Delete post…', icon: Trash2, danger: true, onSelect: () => setConfirmDelete(true) }),
      ]}
    />
  )
}
