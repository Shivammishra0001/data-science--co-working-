const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

// "just now", "5m", "2h", "3d", then a date — compact like most feeds.
export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 45) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)}m`
  if (s < 86400) return `${Math.round(s / 3600)}h`
  if (s < 604800) return `${Math.round(s / 86400)}d`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export const fullDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export const eventDay = (iso) => {
  const d = new Date(iso)
  return { month: d.toLocaleString('en-IN', { month: 'short' }), day: d.getDate() }
}

export const relativeDays = (iso) => rtf.format(Math.round((new Date(iso) - Date.now()) / 86400000), 'day')
