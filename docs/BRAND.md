# Brand: Data Science Co-Working

Developer handoff for the logo and brand name. Source of truth:
`src/config/site.js` (name) · `src/components/layout/BrandMark.jsx` (mark + lockups) · `public/favicon.svg`.

## Name

| Use | Text |
| --- | --- |
| Full name (titles, copyright, alt text, footer) | **Data Science Co-Working** |
| Wordmark (next to the logo) | Two lines: **DATA SCIENCE** / **CO-WORKING** |
| Descriptor (hero eyebrow) | AI & data builder space |
| Page titles | `<Page> — Data Science Co-Working` (home: `Data Science Co-Working — Build what comes next`) |

Always hyphenate **Co-Working**. Never abbreviate in UI ("DSCW" is for code only, e.g. storage keys).
Change the name in `brand` in `site.js` only — every component reads it from there.

## Logo mark

Three connected data points rising to one **yellow insight node** in a disc.
It reads as a trend line (data science) and as connected people (co-working), echoing the site's
"signal through a network" visuals (brain, neural field, Market Push loop).

Geometry, 48 × 48 viewBox:

| Element | Spec |
| --- | --- |
| Disc | `r=23` at centre |
| Path | `M13 32.5 L21.5 26.5 L27.5 29 L34.5 16.5`, stroke 3.2, round caps/joins |
| Data points | `r=3.8` at (13, 32.5), (21.5, 26.5), (27.5, 29) |
| Insight node | `r=4.8` at (34.5, 16.5), always `--color-sun` `#ffd33d` |

## Lockups & tones

| Lockup | Component | Where |
| --- | --- | --- |
| Full (mark + stacked wordmark) | `<BrandMark />` | Navbar, mobile menu, footer, Market Push final CTA |
| Mark only | `<BrandMark withName={false} />` | Market Push lifecycle loop centre |
| Symbol, no link | `<BrandSymbol />` | Anywhere the mark isn't a home link |
| Favicon | `public/favicon.svg` | Browser tab (adds a 1.5px 35% ink edge so it holds on light tabs) |

| Tone | Disc | Marks | Wordmark lines | Use on |
| --- | --- | --- | --- | --- |
| `light` (default) | paper `#f3f0e8` | ink `#08080b` | paper / `--color-mute` | Dark surfaces (almost everywhere) |
| `dark` | ink | paper | ink / ink 60% | Light and yellow surfaces (mobile menu) |

The insight node stays yellow in both tones.

## Size & spacing

| Token | Value |
| --- | --- |
| Mark size | 44 px mobile · 48 px ≥ 640 px (`size-11 sm:size-12`) |
| Minimum mark size | 16 px (favicon); the wordmark needs a mark of at least 32 px |
| Mark ↔ wordmark gap | 10 px (`gap-2.5`) |
| Wordmark type | Archivo, width 70%, weight 800, uppercase, 0.02em tracking, line-height 0.92 · 16.8 px → 18.4 px |
| Clear space | At least ¼ of the mark's diameter on every side |

## States

| State | Behaviour |
| --- | --- |
| Default | Static |
| Hover / focus-visible (home link) | Insight node moves 1.5 px up and right in 500 ms, ease-expo ("the insight rises"). No rotation or scaling. |
| Reduced motion | The global rule reduces the transition to about 0 ms. |

## Accessibility

- The link is announced as **"Data Science Co-Working — home"**. The SVG and the wordmark text are `aria-hidden`, so the name is read once.
- Contrast: ink on paper is about 17:1. The muted second line (`#8f8d9c` on `#08080b`) is about 6.4:1, which passes AA.

## Don'ts

- Don't recolour the insight node or add a second accent to the mark.
- Don't set the wordmark on one line next to the mark. Use the stacked lockup.
- Don't stretch the mark, rotate it, or put it on a busy image without a solid backing.
- Don't reintroduce the old Chrysalis cocoon mark.

## Migration note

Browser storage keys were renamed from `chrysalis.*` to `dscw.*`. The old keys are still read once, so existing demo sign-ins and community activity survive the rebrand (`src/auth/AuthContext.jsx`, `src/api/mockStore.js`).
