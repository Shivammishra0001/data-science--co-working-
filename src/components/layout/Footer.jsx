import { brand, footerColumns, socials } from '../../config/site'
import { BrandMark } from './BrandMark'
import { SmartLink } from '../ui/SmartLink'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="contact" className="border-t border-line bg-ink pt-20 pb-10">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-xs text-paper/60">
              A co-working space and builder ecosystem for data and AI — between idea and market.
            </p>
            <address className="mt-8 flex flex-col gap-1 not-italic">
              <a href={`mailto:${brand.email}`} className="text-lg font-semibold underline-offset-4 hover:underline">
                {brand.email}
              </a>
              <span className="text-paper/60">{brand.location}</span>
            </address>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="eyebrow text-paper/50">{col.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <SmartLink href={l.href} className="text-paper/85 transition-colors hover:text-sun">
                        {l.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="eyebrow text-paper/50">Social</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="text-paper/85 transition-colors hover:text-sun">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <p aria-hidden="true" className="display mt-20 overflow-hidden text-[clamp(3rem,11.5vw,11.5rem)] leading-[0.82] whitespace-nowrap text-paper/[0.06] select-none">
          {brand.wordmark.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <div className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-xs text-paper/45">
          <span>
            © {year} {brand.name}
          </span>
          <span>Built by builders.</span>
        </div>
      </div>
    </footer>
  )
}
