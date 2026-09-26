import { brand } from '../config/site'
import { CommunityDirectory } from '../components/community/CommunityDirectory'

// /community — the directory. Calm by design: no scroll effects.
export default function CommunityPage() {
  return (
    <div className="min-h-svh bg-ink pt-28 pb-24 sm:pt-32">
      <title>{`Communities — ${brand.name}`}</title>
      <meta
        name="description"
        content="Explore technology communities built around the tools, ideas and disciplines shaping what comes next."
      />
      <div className="mx-auto w-full max-w-[88rem] px-[var(--spacing-gutter)]">
        <header className="max-w-3xl">
          <p className="eyebrow text-paper/55">Communities</p>
          <h1 className="display mt-3 text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.9]">
            Find your people.
            <br />
            <span className="text-sun">Build with them.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-paper/70">
            Explore technology communities built around the tools, ideas and disciplines shaping what comes next.
          </p>
        </header>
        <div className="mt-10">
          <CommunityDirectory />
        </div>
      </div>
    </div>
  )
}
