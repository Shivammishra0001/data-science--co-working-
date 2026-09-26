import { useRef, useState } from 'react'
import { BarChart3, ImagePlus, Link2, Plus, Rocket, X } from 'lucide-react'
import * as api from '../../api/communityApi'
import { useQuery } from '../../hooks/useCommunity'
import { cx } from '../../utils/accents'
import { Avatar } from '../ui/Avatar'
import { useToast } from '../ui/useToast'
import { Spinner } from './CommunityLoader'
import { btn } from './shared'
import { useParticipation } from './useParticipation'

const MAX_IMAGES = 4
const MAX_BYTES = 5 * 1024 * 1024
const readAsDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })

const input =
  'h-10 w-full rounded-lg border border-line-strong bg-ink px-3 text-sm text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none'

// Joined members only (the feed shows a join callout otherwise).
// One attachment kind at a time: image(s) | link | poll | project.
export function CreatePost() {
  const { community, flow, composerRef } = useParticipation()
  const toast = useToast()
  const [text, setText] = useState('')
  const [mode, setMode] = useState(null)
  const [images, setImages] = useState([])
  const [link, setLink] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [projectId, setProjectId] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const { data: projects } = useQuery(`projects:${community.slug}`, (o) => api.getCommunityProjects(community.slug, o), {
    enabled: mode === 'project',
  })

  const choose = (m) => {
    setError('')
    if (m === 'image') fileRef.current?.click()
    setMode((cur) => (cur === m && m !== 'image' ? null : m))
  }

  const onFiles = async (files) => {
    const list = [...files].slice(0, MAX_IMAGES - images.length)
    const tooBig = list.find((f) => f.size > MAX_BYTES)
    if (tooBig) return setError(`“${tooBig.name}” is over 5 MB.`)
    const urls = await Promise.all(list.map(readAsDataUrl))
    if (urls.length) {
      setImages((cur) => [...cur, ...urls])
      setMode('image')
      toast(urls.length === 1 ? 'Image uploaded' : `${urls.length} images uploaded`)
    }
  }

  const reset = () => {
    setText('')
    setMode(null)
    setImages([])
    setLink('')
    setPollOptions(['', ''])
    setProjectId('')
    setError('')
  }

  const validPoll = pollOptions.filter((o) => o.trim()).length >= 2
  const canPost =
    text.trim().length > 0 && (mode !== 'poll' || validPoll) && (mode !== 'link' || /^https?:\/\/\S+\.\S+/.test(link)) && (mode !== 'project' || projectId)

  const submit = async (e) => {
    e?.preventDefault()
    if (!canPost || pending) return
    setPending(true)
    try {
      await api.createPost(community.slug, flow.user.id, {
        content: text,
        images: mode === 'image' ? images : [],
        link: mode === 'link' ? link.trim() : null,
        poll: mode === 'poll' ? pollOptions.map((o) => o.trim()).filter(Boolean) : null,
        projectId: mode === 'project' ? projectId : null,
      })
      reset()
      toast('Post published')
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  const tool = (m, Icon, label) => (
    <button
      type="button"
      onClick={() => choose(m)}
      aria-pressed={mode === m}
      className={cx(btn.ghost, 'h-9 px-2.5 sm:px-3', mode === m && 'bg-paper/[0.08] text-paper')}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  )

  return (
    <form onSubmit={submit} className="rounded-xl border border-line bg-ink-2 p-4 sm:p-5" aria-label="Create a post">
      <div className="flex gap-3">
        <Avatar name={flow.user.name} accent="sun" size="md" className="!size-11" />
        <label className="flex-1">
          <span className="sr-only">Post text</span>
          <textarea
            ref={composerRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && submit(e)}
            placeholder={mode === 'poll' ? 'Ask a question…' : `Share something with ${community.name} builders…`}
            rows={2}
            className="field-sizing-content min-h-16 w-full resize-none bg-transparent pt-2.5 text-[1.02rem] text-paper placeholder:text-paper/40 focus:outline-none"
          />
        </label>
      </div>

      {mode === 'image' && images.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Attached images">
          {images.map((src, i) => (
            <li key={i} className="relative">
              <img src={src} alt={`Attachment ${i + 1}`} className="size-24 rounded-lg border border-line object-cover" />
              <button
                type="button"
                onClick={() => setImages((cur) => cur.filter((_, j) => j !== i))}
                aria-label={`Remove image ${i + 1}`}
                className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-ink-3 ring-1 ring-line-strong"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {mode === 'link' && (
        <label className="mt-3 block">
          <span className="sr-only">Link URL</span>
          <input type="url" autoFocus value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" className={input} />
        </label>
      )}
      {mode === 'poll' && (
        <fieldset className="mt-3 flex flex-col gap-2">
          <legend className="mb-1 text-xs text-paper/55">Poll options (2–4)</legend>
          {pollOptions.map((o, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={o}
                onChange={(e) => setPollOptions((cur) => cur.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={`Option ${i + 1}`}
                aria-label={`Option ${i + 1}`}
                className={input}
              />
              {pollOptions.length > 2 && (
                <button type="button" onClick={() => setPollOptions((cur) => cur.filter((_, j) => j !== i))} aria-label={`Remove option ${i + 1}`} className={cx(btn.ghost, 'h-10 px-3')}>
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
            </div>
          ))}
          {pollOptions.length < 4 && (
            <button type="button" onClick={() => setPollOptions((cur) => [...cur, ''])} className={cx(btn.ghost, 'self-start')}>
              <Plus aria-hidden="true" className="size-4" /> Add option
            </button>
          )}
        </fieldset>
      )}
      {mode === 'project' && (
        <label className="mt-3 block text-xs text-paper/55">
          Attach a project
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={cx(input, 'mt-1')}>
            <option value="">{projects ? 'Choose a project…' : 'Loading projects…'}</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.stage}
              </option>
            ))}
          </select>
        </label>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-flare">
          {error}
        </p>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = '' }} />
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
        <div className="flex flex-wrap items-center">
          {tool('image', ImagePlus, 'Image')}
          {tool('link', Link2, 'Link')}
          {tool('poll', BarChart3, 'Poll')}
          {tool('project', Rocket, 'Project')}
        </div>
        <button type="submit" disabled={!canPost || pending} className={cx(btn.primary, 'px-6')}>
          {pending && <Spinner />} Post
        </button>
      </div>
    </form>
  )
}
