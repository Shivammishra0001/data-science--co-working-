import { useEffect, useRef, useState } from 'react'
import { Flag, Lock, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import * as api from '../../api/communityApi'
import { profileHref } from '../../data/communityMembers'
import { useComments } from '../../hooks/useCommunity'
import { timeAgo } from '../../utils/time'
import { Avatar } from '../ui/Avatar'
import { SmartLink } from '../ui/SmartLink'
import { useToast } from '../ui/useToast'
import { CommunityLoader, Spinner } from './CommunityLoader'
import { btn } from './shared'
import { Menu } from './Menu'
import { useParticipation } from './useParticipation'

// Inline thread under a post. One level of replies; long reply chains collapse
// behind "View N more replies". Replying/commenting goes through the gate.
export function CommentThread({ post, focusKey }) {
  const { data: comments, loading } = useComments(post.id, true)
  const [replyTo, setReplyTo] = useState(null) // top-level comment

  return (
    <div className="animate-fade-in mt-4 border-t border-line pt-4">
      {loading ? (
        <CommunityLoader label="Loading comments" className="py-5" />
      ) : comments?.length ? (
        <ul className="flex flex-col gap-4">
          {comments.map((c) => (
            <Comment key={c.id} comment={c} onReply={() => setReplyTo(c)} replying={replyTo?.id === c.id} post={post} onDone={() => setReplyTo(null)} />
          ))}
        </ul>
      ) : (
        <p className="py-2 text-sm text-paper/55">No comments yet. Start the conversation.</p>
      )}

      {post.locked ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-paper/55">
          <Lock aria-hidden="true" className="size-4" /> Comments are turned off for this discussion.
        </p>
      ) : (
        <CommentInput post={post} focusKey={focusKey} className="mt-4" />
      )}
    </div>
  )
}

function Comment({ comment, onReply, replying, post, onDone }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? comment.replies : comment.replies.slice(0, 1)
  const hidden = comment.replies.length - shown.length
  return (
    <li>
      <CommentBody comment={comment} onReply={post.locked ? null : onReply} post={post} />
      {(shown.length > 0 || replying) && (
        <ul className="mt-3 ml-11 flex flex-col gap-3 border-l border-line pl-4">
          {shown.map((r) => (
            <li key={r.id}>
              <CommentBody comment={r} small onReply={post.locked ? null : onReply} post={post} />
            </li>
          ))}
          {hidden > 0 && (
            <li>
              <button type="button" onClick={() => setExpanded(true)} className="text-sm font-medium text-paper/70 hover:text-paper hover:underline">
                View {hidden} more {hidden === 1 ? 'reply' : 'replies'}
              </button>
            </li>
          )}
          {replying && (
            <li>
              <CommentInput
                post={post}
                parent={comment}
                autoFocus
                onDone={() => {
                  setExpanded(true) // your new reply is always visible, never collapsed
                  onDone()
                }}
              />
            </li>
          )}
        </ul>
      )}
    </li>
  )
}

function CommentBody({ comment, small, onReply, post }) {
  const { canModerate } = useParticipation()
  const toast = useToast()
  const { author } = comment
  return (
    <div className="flex gap-3">
      <SmartLink href={profileHref(author)} tabIndex={-1} aria-hidden="true">
        <Avatar name={author.name} accent={author.accent ?? 'sun'} size="sm" className={small ? '!size-7 text-[0.6875rem]' : ''} />
      </SmartLink>
      <div className="min-w-0 flex-1">
        <div className="rounded-lg bg-paper/[0.05] px-3.5 py-2.5">
          <p className="text-sm">
            <SmartLink href={profileHref(author)} className="font-semibold hover:underline">
              {author.name}
            </SmartLink>
            {author.role && <span className="text-paper/45"> · {author.role}</span>}
          </p>
          <p className="mt-1 text-[0.94rem] leading-relaxed whitespace-pre-line text-paper/85">{comment.content}</p>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-paper/50">
          <time dateTime={comment.createdAt} className="px-1">
            {timeAgo(comment.createdAt)}
          </time>
          {onReply && (
            <button type="button" onClick={onReply} className="rounded px-1.5 py-0.5 font-medium hover:bg-paper/[0.07] hover:text-paper">
              Reply<span className="sr-only"> to {author.name}</span>
            </button>
          )}
          <Menu
            label={`More options for ${author.name}’s comment`}
            trigger={<MoreHorizontal aria-hidden="true" className="size-3.5" />}
            align="left"
            className="[&>button]:h-6 [&>button]:px-1.5"
            items={[
              { label: 'Report comment', icon: Flag, onSelect: () => toast('Thanks — a moderator will review this.', { tone: 'info' }) },
              canModerate && {
                label: 'Remove comment',
                icon: Trash2,
                danger: true,
                onSelect: async () => {
                  await api.removeComment(comment.id)
                  toast('Comment removed', { tone: 'info' })
                },
              },
            ]}
          />
          {post.locked && <span className="sr-only">Replies are closed</span>}
        </div>
      </div>
    </div>
  )
}

export function CommentInput({ post, parent = null, autoFocus, onDone, focusKey, className }) {
  const { flow, participate } = useParticipation()
  const toast = useToast()
  const [text, setText] = useState('')
  const [pending, setPending] = useState(false)
  const ref = useRef(null)

  // "Comment" button on the post focuses this box
  useEffect(() => {
    if (focusKey) ref.current?.focus()
  }, [focusKey])

  if (!flow.joined) {
    return (
      <div className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-line-strong px-4 py-3 text-sm text-paper/65 ${className ?? ''}`}>
        <span className="flex items-center gap-2">
          <MessageCircle aria-hidden="true" className="size-4" /> Join the community to {parent ? 'reply' : 'comment'}.
        </span>
        <button type="button" onClick={() => participate('comment and reply')} className={`${btn.secondary} h-9`}>
          Join to reply
        </button>
      </div>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    participate('comment', async (u) => {
      setPending(true)
      try {
        await api.addComment(post.id, u.id, { content: text, parentCommentId: parent?.id ?? null })
        setText('')
        toast(parent ? 'Reply added' : 'Comment added')
        onDone?.()
      } finally {
        setPending(false)
      }
    })
  }

  return (
    <form onSubmit={submit} className={`flex items-start gap-3 ${className ?? ''}`}>
      <Avatar name={flow.user.name} accent="sun" size="sm" />
      <label className="flex-1">
        <span className="sr-only">{parent ? `Reply to ${parent.author.name}` : 'Write a comment'}</span>
        <textarea
          ref={ref}
          value={text}
          autoFocus={autoFocus}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) submit(e)
            if (e.key === 'Escape') onDone?.()
          }}
          placeholder={parent ? `Reply to ${parent.author.name.split(' ')[0]}…` : 'Write a comment…'}
          className="field-sizing-content min-h-10 w-full resize-none rounded-2xl border border-line-strong bg-ink px-4 py-2 text-[0.94rem] text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none"
        />
      </label>
      <button type="submit" disabled={!text.trim() || pending} className={`${btn.primary} h-10 px-4`}>
        {pending && <Spinner />}
        {parent ? 'Reply' : 'Comment'}
      </button>
    </form>
  )
}
