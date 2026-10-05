import { useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, ExternalLink, MapPin, Rocket, Users } from 'lucide-react'
import { profileHref } from '../../data/communityMembers'
import { cx } from '../../utils/accents'
import { eventDay, fullDate } from '../../utils/time'
import { SmartLink } from '../ui/SmartLink'
import { useToast } from '../ui/useToast'
import { Spinner } from './CommunityLoader'
import { DemoFigure } from './DemoFigure'
import { btn } from './shared'
import { useParticipation } from './useParticipation'
import * as api from '../../api/communityApi'

export function PostImages({ images }) {
  return (
    <div className={cx('mt-3 grid gap-2', images.length > 1 && 'grid-cols-2')}>
      {images.map((img, i) => (
        <figure key={i} className="overflow-hidden rounded-lg border border-line">
          {img.figure ? (
            <>
              <DemoFigure figure={img.figure} />
              <figcaption className="sr-only">{img.alt}</figcaption>
            </>
          ) : (
            <img src={img.src} alt={img.alt} loading="lazy" className="max-h-[32rem] w-full object-cover" />
          )}
        </figure>
      ))}
    </div>
  )
}

export function CodeBlock({ code }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-line bg-[#0d0d12]">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide text-paper/45 uppercase">
        {code.lang}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed text-paper/85">
        <code>{code.source}</code>
      </pre>
    </div>
  )
}

export function LinkPreview({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 flex items-start gap-3 rounded-lg border border-line bg-ink p-4 transition-colors hover:border-line-strong hover:bg-ink-3"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-paper/[0.06]">
        <ExternalLink aria-hidden="true" className="size-4 text-paper/60" />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[0.6875rem] tracking-wide text-paper/45 uppercase">{link.domain}</span>
        <span className="mt-0.5 block font-semibold">{link.title}</span>
        {link.description && <span className="mt-1 line-clamp-2 block text-sm text-paper/60">{link.description}</span>}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  )
}

export function ProjectPreview({ project }) {
  return (
    <div className="mt-3 rounded-lg border border-line bg-ink p-4">
      <div className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-wide text-paper/50 uppercase">
        <Rocket aria-hidden="true" className="size-3.5" /> Project · {project.stage}
      </div>
      <p className="mt-2 text-lg font-semibold">{project.name}</p>
      <p className="mt-1 text-sm text-paper/65">{project.description}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-paper/50">{project.tech.join(' · ')}</span>
        <SmartLink href="/#projects" className="inline-flex items-center gap-1 text-sm font-semibold text-paper hover:underline">
          View project <ArrowUpRight aria-hidden="true" className="size-4" />
        </SmartLink>
      </div>
    </div>
  )
}

// Vote → results. Voting goes through the participation gate.
export function PollView({ post }) {
  const { participate } = useParticipation()
  const toast = useToast()
  const { poll } = post
  const [choice, setChoice] = useState(null)
  const [pending, setPending] = useState(false)
  const voted = !!poll.myVote

  const vote = () =>
    participate('vote in polls', async (u) => {
      setPending(true)
      try {
        await api.votePoll(post.id, u.id, choice)
        toast('Vote recorded')
      } finally {
        setPending(false)
      }
    })

  if (voted) {
    return (
      <div className="mt-3 flex flex-col gap-2">
        {poll.options.map((o) => {
          const pct = poll.total ? Math.round((o.votes / poll.total) * 100) : 0
          const mine = o.id === poll.myVote
          return (
            <div key={o.id} className="relative overflow-hidden rounded-lg border border-line px-3.5 py-2.5 text-sm">
              <span aria-hidden="true" className={cx('absolute inset-y-0 left-0', mine ? 'bg-volt/35' : 'bg-paper/[0.07]')} style={{ width: `${pct}%` }} />
              <span className="relative flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  {o.label}
                  {mine && <Check aria-label="Your vote" className="size-4 text-paper" />}
                </span>
                <span className="font-mono text-paper/70">{pct}%</span>
              </span>
            </div>
          )
        })}
        <p className="text-xs text-paper/50">{poll.total} votes</p>
      </div>
    )
  }

  return (
    <fieldset className="mt-3">
      <legend className="sr-only">{post.content}</legend>
      <div className="flex flex-col gap-2">
        {poll.options.map((o) => (
          <label
            key={o.id}
            className={cx(
              'flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors',
              choice === o.id ? 'border-paper/60 bg-paper/[0.06]' : 'border-line hover:border-line-strong',
            )}
          >
            <input type="radio" name={`poll-${post.id}`} value={o.id} checked={choice === o.id} onChange={() => setChoice(o.id)} className="size-4 accent-sun" />
            {o.label}
          </label>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-paper/50">{poll.total} votes · results after you vote</span>
        <button type="button" onClick={vote} disabled={!choice || pending} className={cx(btn.secondary, 'h-9')}>
          {pending && <Spinner />} Vote
        </button>
      </div>
    </fieldset>
  )
}

export function EventCard({ event, compact = false }) {
  const { participate } = useParticipation()
  const toast = useToast()
  const [pending, setPending] = useState(false)
  const { month, day } = eventDay(event.date)

  const toggle = () =>
    participate('join events', async (u) => {
      setPending(true)
      try {
        await api.setRsvp(event.id, u.id, !event.going)
        toast(event.going ? 'You’re no longer going' : `You’re going to “${event.title}”`, { tone: event.going ? 'info' : 'success' })
      } finally {
        setPending(false)
      }
    })

  return (
    <article className={cx('flex gap-4 rounded-lg border border-line bg-ink p-4', !compact && 'sm:p-5')}>
      <div className="flex w-14 shrink-0 flex-col items-center rounded-md border border-line-strong py-2">
        <span className="font-mono text-[0.6875rem] tracking-wide text-flare uppercase">{month}</span>
        <span className="text-2xl leading-none font-semibold">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.6875rem] tracking-wide text-paper/50 uppercase">{event.kind}</p>
        <h3 className="mt-0.5 font-semibold">{event.title}</h3>
        {!compact && <p className="mt-1 text-sm text-paper/65">{event.description}</p>}
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-paper/55">
          <li className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            <time dateTime={event.date}>{fullDate(event.date)}</time>
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5" />
            {event.location}
          </li>
          <li className="flex items-center gap-1.5">
            <Users aria-hidden="true" className="size-3.5" />
            {event.participantsCount} going
          </li>
        </ul>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-paper/50">
            Hosted by{' '}
            <SmartLink href={profileHref(event.host)} className="text-paper/80 hover:underline">
              {event.host.name}
            </SmartLink>
          </span>
          <button type="button" onClick={toggle} disabled={pending} aria-pressed={event.going} className={cx(event.going ? btn.secondary : btn.primary, 'h-9 px-4')}>
            {pending ? <Spinner /> : event.going && <Check aria-hidden="true" className="size-4" />}
            {event.going ? 'Going' : 'Join event'}
          </button>
        </div>
      </div>
    </article>
  )
}
