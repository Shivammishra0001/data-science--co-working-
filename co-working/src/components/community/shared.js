// Non-component exports shared by the community UI (kept out of component
// files so React Fast Refresh keeps working).

export const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n))

// Button styles — calmer than the landing-page pills.
export const btn = {
  primary: 'inline-flex h-10 items-center justify-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-sun disabled:opacity-60',
  secondary: 'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-paper ring-1 ring-line-strong ring-inset transition-colors hover:bg-paper/10 disabled:opacity-60',
  ghost: 'inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm text-paper/70 transition-colors hover:bg-paper/[0.07] hover:text-paper',
}

export const TABS = [
  { id: 'feed', label: 'Feed' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Events' },
  { id: 'members', label: 'Members' },
]
