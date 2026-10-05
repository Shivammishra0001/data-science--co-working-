import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Armchair, CalendarDays, Check, Clock, Coffee, Flame, Laptop, MessageCircle, Users, Wifi, X } from 'lucide-react'
import { bookingCopy as copy, bookingWhatsApp, durations, hours, learnOptions } from '../../data/booking'
import { accentSolid, accentText, cx } from '../../utils/accents'
import { Spinner } from '../community/CommunityLoader'
import { useToast } from '../ui/useToast'

const icons = { laptop: Laptop, people: Users, wifi: Wifi }
const rupees = (n) => `₹${n.toLocaleString('en-IN')}`
const pad = (n) => String(n).padStart(2, '0')
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fmtHour = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`
const STORAGE = 'dscw.seatRequests' // demo only: requests are kept in this browser until a backend exists

const defaultDuration = durations.find((d) => d.best) ?? durations[0]
// open on today if the default duration still fits before closing, otherwise tomorrow
const defaultDate = () => {
  const d = new Date()
  if (d.getHours() + 1 + defaultDuration.hours > hours.close) d.setDate(d.getDate() + 1)
  return isoDay(d)
}
const empty = () => ({ name: '', phone: '', learn: learnOptions[0], date: defaultDate(), duration: defaultDuration.id, start: null })

// "Grab your seat": a wide two-pane sheet on desktop (pitch left, form right),
// a full-height sheet on phones (compact pitch above the form).
// Choices are tappable chips/cards instead of dropdowns, so the whole booking
// is visible at once and works with one thumb.
export default function BookingDialog({ open, onClose }) {
  const ref = useRef(null)
  const toast = useToast()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  // after closing, start fresh next time
  const close = () => {
    onClose()
    setTimeout(() => {
      setStatus('idle')
      setForm(empty())
      setErrors({})
    }, 250)
  }

  const duration = durations.find((d) => d.id === form.duration)
  const today = isoDay(new Date())
  const slots = useMemo(() => {
    const nowHour = new Date().getHours() + 1 // next full hour
    const out = []
    for (let h = hours.open; h + duration.hours <= hours.close; h++) {
      if (form.date === today && h < nowHour) continue
      out.push(h)
    }
    return out
  }, [form.date, duration.hours, today])

  // a chosen start time that no longer fits (date or duration changed) counts as unchosen
  const start = slots.includes(form.start) ? form.start : null

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name.'
    const digits = form.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    if (!/^[6-9]\d{9}$/.test(digits)) e.phone = 'Enter a 10-digit Indian mobile number.'
    if (!form.date || form.date < today) e.date = 'Pick today or a later date.'
    if (start == null) e.start = slots.length ? 'Choose a start time.' : 'No slots left on this date — pick another day.'
    setErrors(e)
    return Object.keys(e).length === 0 ? digits : null
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const digits = validate()
    if (!digits) {
      const bad = ref.current?.querySelector('input[aria-invalid="true"], fieldset[aria-invalid="true"]')
      if (bad?.tagName === 'INPUT') bad.focus()
      else bad?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setStatus('sending')
    const request = { ...form, start, phone: `+91${digits}`, end: start + duration.hours, price: duration.price, createdAt: new Date().toISOString() }
    await new Promise((r) => setTimeout(r, 700))
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE) || '[]')
      localStorage.setItem(STORAGE, JSON.stringify([...list, request]))
    } catch {
      /* storage unavailable — the request still shows as sent in this session */
    }
    setStatus('done')
    toast('Seat request sent')
  }

  const summary = `${new Date(form.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · ${start != null ? `${fmtHour(start)} – ${fmtHour(start + duration.hours)}` : ''}`
  const waText = encodeURIComponent(
    `Hi! I'd like to book a seat.\nName: ${form.name}\nTopic: ${form.learn}\nDate: ${summary}\nDuration: ${duration.label}${duration.price ? ` (${rupees(duration.price)})` : ''}`,
  )

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => e.target === ref.current && close()}
      aria-labelledby="booking-title"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-paper backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-fade-in sm:m-auto sm:h-auto sm:max-h-[min(92dvh,56rem)] sm:w-[min(94vw,72rem)]"
    >
      <div className="flex h-full flex-col overflow-hidden border-line-strong bg-ink sm:max-h-[min(92dvh,56rem)] sm:rounded-[1.75rem] sm:border lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <Pitch />

        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-ink/90 px-5 py-4 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-sun text-ink">
                <Armchair aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 id="booking-title" className="text-xl leading-tight font-semibold">
                  {status === 'done' ? copy.successTitle : copy.formTitle}
                </h2>
                <p className="text-sm text-paper/60">{status === 'done' ? copy.successBody : copy.formSubtitle}</p>
              </div>
            </div>
            <button type="button" onClick={close} aria-label="Close booking" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm text-paper/70 hover:bg-paper/10 hover:text-paper">
              <ArrowLeft aria-hidden="true" className="size-4 sm:hidden" />
              <X aria-hidden="true" className="hidden size-4 sm:block" />
              <span aria-hidden="true" className="sm:hidden">Back</span>
            </button>
          </div>

          {status === 'done' ? (
            <Success form={form} duration={duration} summary={summary} waText={waText} onDone={close} />
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-6 px-5 py-6 sm:px-8 sm:py-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  {(p) => <input {...p} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" placeholder="Your full name" className={input(p['aria-invalid'])} />}
                </Field>
                <Field label="WhatsApp number" error={errors.phone}>
                  {(p) => (
                    <div className={cx(input(p['aria-invalid']), 'flex items-center gap-2 px-0 focus-within:border-paper/60')}>
                      <span className="flex h-full items-center border-r border-line-strong pr-3 pl-4 text-paper/60">+91</span>
                      <input
                        {...p}
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="99953 43366"
                        className="h-full w-full min-w-0 bg-transparent pr-4 outline-none placeholder:text-paper/35"
                      />
                    </div>
                  )}
                </Field>
              </div>

              <Group label="What do you want to learn?">
                <div className="flex flex-wrap gap-2">
                  {learnOptions.map((o) => (
                    <Chip key={o} name="learn" checked={form.learn === o} onChange={() => set('learn', o)}>
                      {o}
                    </Chip>
                  ))}
                </div>
              </Group>

              <Group label="Duration">
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {durations.map((d) => (
                    <label
                      key={d.id}
                      className={cx(
                        'relative flex cursor-pointer flex-col rounded-2xl border p-3 transition-colors duration-200 sm:p-4',
                        form.duration === d.id ? 'border-sun bg-sun/[0.08]' : 'border-line-strong hover:border-paper/40',
                        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun',
                      )}
                    >
                      <input type="radio" name="duration" value={d.id} checked={form.duration === d.id} onChange={() => set('duration', d.id)} className="sr-only" />
                      {d.best && (
                        <span className="absolute -top-2.5 right-3 rounded-full bg-sun px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide text-ink uppercase">⭐ Best<span className="max-sm:hidden"> value</span></span>
                      )}
                      <span className="display text-2xl leading-none sm:text-3xl">{d.label}</span>
                      <span className="mt-1 text-xs text-paper/60 sm:text-sm">{d.note}</span>
                      <span className={cx('mt-2 font-semibold sm:mt-3', d.price ? 'text-base text-paper sm:text-lg' : 'text-xs font-normal text-paper/50 sm:text-sm')}>
                        {d.price ? rupees(d.price) : 'Price on request'}
                      </span>
                    </label>
                  ))}
                </div>
              </Group>

              <div className="grid gap-5 sm:grid-cols-[0.8fr_1.2fr]">
                <Field label="Date" error={errors.date} icon={CalendarDays}>
                  {(p) => <input {...p} type="date" min={today} value={form.date} onChange={(e) => set('date', e.target.value)} className={cx(input(p['aria-invalid']), '[color-scheme:dark]')} />}
                </Field>
                <Group label="Start time" icon={Clock} error={errors.start}>
                  {slots.length ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((h) => (
                        <Chip key={h} name="start" checked={start === h} onChange={() => set('start', h)} compact>
                          {fmtHour(h)}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-paper/60">No slots left on this date for {duration.label.toLowerCase()} — try tomorrow.</p>
                  )}
                </Group>
              </div>

              <div className="sticky bottom-0 -mx-5 mt-1 border-t border-line bg-ink/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-paper/60">{start != null ? summary : 'Pick a start time'}</span>
                  <span className="font-semibold">{duration.price ? rupees(duration.price) : duration.label}</span>
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-sun text-base font-bold tracking-[0.06em] text-ink uppercase transition-colors hover:bg-paper disabled:opacity-70"
                >
                  {status === 'sending' ? <Spinner /> : <span aria-hidden="true">🚀</span>}
                  {copy.submit}
                </button>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-paper/55">
                  <MessageCircle aria-hidden="true" className="size-3.5 text-mint" /> {copy.footnote}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  )
}

// Left pane: the pitch. Compact strip on phones, full panel on desktop.
function Pitch() {
  return (
    <aside className="relative shrink-0 overflow-hidden border-b border-line bg-ink-2 px-5 py-5 sm:px-8 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-9">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-volt/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 size-60 rounded-full bg-iris/20 blur-3xl max-lg:hidden" />
      <div className="relative">
        <p className="eyebrow flex items-center gap-2 text-mint">
          <span aria-hidden="true" className="animate-pulse-dot size-1.5 rounded-full bg-mint" /> {copy.eyebrow}
        </p>
        <p className="display mt-3 text-[clamp(2.2rem,4.2vw,4.2rem)] leading-[0.88]">
          {copy.title[0]} <span className="text-sun lg:block">{copy.title[1]}</span>
        </p>
        <p className="mt-4 hidden text-paper/70 lg:block">{copy.intro}</p>

        {/* phones: features as a row of chips; desktop: full cards */}
        <ul className="mt-4 flex flex-wrap gap-2 lg:hidden">
          {copy.features.map((f) => {
            const Icon = icons[f.icon]
            return (
              <li key={f.title} className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-xs text-paper/80">
                <Icon aria-hidden="true" className={cx('size-3.5', accentText[f.accent])} /> {f.title}
              </li>
            )
          })}
        </ul>
        <ul className="mt-7 hidden flex-col gap-3 lg:flex">
          {copy.features.map((f) => {
            const Icon = icons[f.icon]
            return (
              <li key={f.title} className="flex gap-4 rounded-2xl border border-line bg-ink/60 p-4">
                <span className={cx('grid size-11 shrink-0 place-items-center rounded-xl', accentSolid[f.accent])}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{f.title}</span>
                  <span className="mt-0.5 block text-sm text-paper/65">{f.text}</span>
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 hidden items-start gap-3 rounded-2xl border border-sun/30 bg-sun/[0.07] p-4 text-sm text-sun lg:flex">
          <Flame aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> {copy.tip}
        </p>
      </div>
    </aside>
  )
}

function Success({ form, duration, summary, waText, onDone }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-10 text-center sm:px-8">
      <span className="grid size-16 place-items-center rounded-full bg-mint text-ink">
        <Check aria-hidden="true" className="size-8" strokeWidth={3} />
      </span>
      <div>
        <p className="display text-4xl">See you soon, {form.name.trim().split(' ')[0]}.</p>
        <p className="mt-2 text-paper/65">Your request is in. We’ll confirm your seat on WhatsApp.</p>
      </div>
      <dl className="grid w-full max-w-sm gap-px overflow-hidden rounded-2xl border border-line text-left text-sm">
        {[
          ['When', summary],
          ['Duration', `${duration.label}${duration.price ? ` · ${rupees(duration.price)}` : ''}`],
          ['Focus', form.learn],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 bg-ink-2 px-4 py-3">
            <dt className="text-paper/55">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap justify-center gap-2">
        {bookingWhatsApp && (
          <a href={`https://wa.me/${bookingWhatsApp}?text=${waText}`} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-mint px-6 font-semibold text-ink">
            <MessageCircle aria-hidden="true" className="size-4" /> Message us on WhatsApp
          </a>
        )}
        <button type="button" onClick={onDone} className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold ring-1 ring-line-strong ring-inset hover:bg-paper/10">
          <Coffee aria-hidden="true" className="size-4" /> Done
        </button>
      </div>
    </div>
  )
}

const input = (invalid) =>
  cx(
    'h-12 w-full rounded-xl border bg-ink-2 px-4 text-paper outline-none transition-colors placeholder:text-paper/35 focus:border-paper/60',
    invalid ? 'border-flare' : 'border-line-strong',
  )

const labelCls = 'mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-paper/70 uppercase'

function Field({ label, error, icon: Icon, children }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {Icon && <Icon aria-hidden="true" className="size-3.5" />}
        {label}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-err` : undefined })}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-flare">
          {error}
        </p>
      )}
    </div>
  )
}

function Group({ label, icon: Icon, error, children }) {
  const id = useId()
  return (
    <fieldset aria-describedby={error ? `${id}-err` : undefined} aria-invalid={!!error || undefined}>
      <legend className={labelCls}>
        {Icon && <Icon aria-hidden="true" className="size-3.5" />}
        {label}
      </legend>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-flare">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Chip({ name, checked, onChange, compact, children }) {
  return (
    <label
      className={cx(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border text-sm transition-colors duration-200',
        compact ? 'h-10 px-2' : 'h-10 px-4',
        checked ? 'border-paper bg-paper font-semibold text-ink' : 'border-line-strong text-paper/80 hover:border-paper/50',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {checked && !compact && <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
      {children}
    </label>
  )
}
