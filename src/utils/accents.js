// Static class maps so Tailwind can see every class at build time.
// `solid` pairs each bright with a text colour that passes contrast on it.
export const accentSolid = {
  sun: 'bg-sun text-ink',
  flare: 'bg-flare text-ink',
  iris: 'bg-iris text-ink',
  mint: 'bg-mint text-ink',
  volt: 'bg-volt text-white',
  paper: 'bg-paper text-ink',
  outline: 'bg-transparent text-paper ring-2 ring-inset ring-line-strong',
}

export const accentText = {
  sun: 'text-sun',
  flare: 'text-flare',
  iris: 'text-iris',
  mint: 'text-mint',
  volt: 'text-[#8196ff]', // volt lifted for small text on ink
  paper: 'text-paper',
}

export const accentBorderHover = {
  sun: 'hover:border-sun focus-within:border-sun',
  flare: 'hover:border-flare focus-within:border-flare',
  iris: 'hover:border-iris focus-within:border-iris',
  mint: 'hover:border-mint focus-within:border-mint',
  volt: 'hover:border-volt focus-within:border-volt',
  paper: 'hover:border-paper focus-within:border-paper',
}

export const accentVar = {
  sun: 'var(--color-sun)',
  flare: 'var(--color-flare)',
  iris: 'var(--color-iris)',
  mint: 'var(--color-mint)',
  volt: 'var(--color-volt)',
  paper: 'var(--color-paper)',
}

export const cx = (...parts) => parts.filter(Boolean).join(' ')
