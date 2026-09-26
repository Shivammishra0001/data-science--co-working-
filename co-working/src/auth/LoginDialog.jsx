import { useState } from 'react'
import { demoSignIn } from '../api/communityApi'
import { Dialog } from '../components/ui/Dialog'
import { Spinner } from '../components/community/CommunityLoader'
import { useToast } from '../components/ui/useToast'
import { cx } from '../utils/accents'

const field =
  'mt-1.5 h-11 w-full rounded-lg border border-line-strong bg-ink px-3.5 text-paper placeholder:text-paper/35 focus:border-paper/50 focus:outline-none'

export function LoginDialog({ open, message, onClose, onSignedIn }) {
  const [mode, setMode] = useState('login') // login | signup
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [moderator, setModerator] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please add your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please add a valid email.')
    setError('')
    setPending(true)
    try {
      const user = await demoSignIn({ name, email, moderator })
      toast(mode === 'signup' ? `Welcome, ${user.name.split(' ')[0]}` : `Signed in as ${user.name}`)
      onSignedIn(user)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={message ? 'Join the community to participate' : mode === 'signup' ? 'Create your account' : 'Log in'}
      description={message}
    >
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 rounded-lg border border-line p-1 text-sm">
        {[
          ['login', 'Log in'],
          ['signup', 'Create account'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={cx('h-9 rounded-md font-medium transition-colors', mode === id ? 'bg-paper text-ink' : 'text-paper/65 hover:text-paper')}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-4" noValidate>
        <label className="text-sm font-medium">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="text-sm font-medium">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} placeholder="you@example.com" />
        </label>
        <label className="flex items-center gap-2.5 text-sm text-paper/70">
          <input type="checkbox" checked={moderator} onChange={(e) => setModerator(e.target.checked)} className="size-4 accent-sun" />
          Preview as a community moderator
        </label>
        {error && (
          <p role="alert" className="text-sm text-flare">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-paper font-semibold text-ink transition-colors hover:bg-sun disabled:opacity-70"
        >
          {pending && <Spinner />}
          {mode === 'signup' ? 'Create account' : 'Log in'}
        </button>
        <p className="text-xs leading-relaxed text-paper/45">
          Demo sign-in: nothing is sent to a server. Your name and activity are stored only in this browser until real
          accounts launch.
        </p>
      </form>
    </Dialog>
  )
}
