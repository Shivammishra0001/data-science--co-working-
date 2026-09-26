import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { navLinks, primaryCta, signIn } from '../../config/site'
import { useLocation } from 'react-router-dom'
import { cx } from '../../utils/accents'
import { SmartLink } from '../ui/SmartLink'
import { Avatar } from '../ui/Avatar'
import { useAuth } from '../../auth/useAuth'
import { BrandMark } from './BrandMark'
import { PillButton } from '../ui/PillButton'

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, openLogin, logout } = useAuth()
  // /community/openai still highlights "Community"
  const isCurrent = (href) => !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`))

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24
    if (next !== scrolled) setScrolled(next)
  })

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cx(
          'transition-[background-color,backdrop-filter,border-color] duration-500 ease-[var(--ease-soft)]',
          'border-b',
          scrolled ? 'border-line/70 bg-ink/88 backdrop-blur-xl backdrop-saturate-150' : 'border-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className={cx(
            'container-x flex items-center justify-between gap-6 transition-[height] duration-500',
            scrolled ? 'h-18' : 'h-20 sm:h-24',
          )}
        >
          <BrandMark />

          <ul className="hidden items-center gap-1.5 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  aria-current={isCurrent(l.href) ? 'page' : undefined}
                  className={cx(
                    'inline-flex h-11 items-center rounded-full px-5 text-[0.8rem] font-semibold tracking-[0.08em] uppercase ring-1 ring-inset transition-colors duration-300 hover:bg-paper hover:text-ink hover:ring-paper',
                    isCurrent(l.href) ? 'bg-flare text-ink ring-flare' : 'text-paper/85 ring-line-strong',
                  )}
                >
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <div className="flex items-center gap-1">
                <SmartLink href={`/profile/${user.username}`} className="inline-flex h-11 items-center gap-2 rounded-full pr-3 pl-1.5 text-sm text-paper/85 hover:bg-paper/[0.07]">
                  <Avatar name={user.name} accent="sun" size="sm" className="!size-8 text-[0.65rem]" />
                  {user.name.split(' ')[0]}
                </SmartLink>
                <button type="button" onClick={logout} className="inline-flex h-11 items-center rounded-full px-3 text-[0.75rem] font-semibold tracking-[0.08em] text-paper/55 uppercase hover:text-paper">
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openLogin()}
                className="inline-flex h-11 items-center rounded-full px-4 text-[0.8rem] font-semibold tracking-[0.08em] text-paper/70 uppercase transition-colors hover:text-paper"
              >
                {signIn.label}
              </button>
            )}
            {/* community pages have their own per-community JOIN — avoid two competing "Join"s */}
            {!pathname.startsWith('/community') && (
              <PillButton href={primaryCta.href} variant="solid" size="sm" className="!h-11 !px-5">
                {primaryCta.label}
              </PillButton>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-paper pr-4 pl-3.5 text-[0.8rem] font-semibold tracking-[0.08em] text-ink uppercase lg:hidden"
          >
            <Menu aria-hidden="true" className="size-4.5" strokeWidth={2.5} />
            Menu
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <MobileMenu
            onClose={() => setOpen(false)}
            user={user}
            onSignIn={() => {
              setOpen(false)
              openLogin()
            }}
            onSignOut={() => {
              setOpen(false)
              logout()
            }}
          />
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileMenu({ onClose, user, onSignIn, onSignOut }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('a, button')?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      // keep focus inside the dialog
      const f = panelRef.current.querySelectorAll('a, button')
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col bg-sun text-ink lg:hidden"
      initial={{ clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 3rem)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="container-x flex h-20 items-center justify-between sm:h-24">
        <BrandMark tone="dark" />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink pr-4 pl-3.5 text-[0.8rem] font-semibold tracking-[0.08em] text-paper uppercase"
        >
          <X aria-hidden="true" className="size-4.5" strokeWidth={2.5} />
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center">
        <ul>
          {navLinks.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-ink/15"
            >
              <SmartLink
                href={l.href}
                onClick={onClose}
                className="display flex items-baseline justify-between py-3 text-[clamp(2.8rem,13vw,5rem)] leading-[0.95]"
              >
                {l.label}
                <span className="font-mono text-sm not-italic">0{i + 1}</span>
              </SmartLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="container-x flex flex-wrap gap-3 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <PillButton href={primaryCta.href} onClick={onClose} variant="ink" size="lg" arrow magnetic={false} className="flex-1">
          {primaryCta.label}
        </PillButton>
        <button
          type="button"
          onClick={user ? onSignOut : onSignIn}
          className="inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.95rem] font-semibold tracking-[0.06em] text-ink uppercase ring-2 ring-ink ring-inset hover:bg-ink hover:text-paper sm:h-16 sm:px-9"
        >
          {user ? 'Sign out' : signIn.label}
        </button>
      </div>
    </motion.div>
  )
}
