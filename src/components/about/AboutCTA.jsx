import { ArrowRight } from 'lucide-react'
import { aboutCta } from '../../data/about/story'
import { NeuralField } from '../market-push/NeuralField'
import { ThemeSection } from '../market-push/ThemeSection'
import { RevealText } from '../motion/RevealText'
import { PillButton } from '../ui/PillButton'
import { SmartLink } from '../ui/SmartLink'

// Final CTA — DARK. Three actions with deliberately different weight:
// join (primary) · explore (secondary) · book a workspace (tertiary text link).
export function AboutCTA() {
  return (
    <ThemeSection tone="dark" id="join" labelledBy="about-cta-title" className="overflow-hidden">
      <div className="relative isolate flex min-h-[70svh] flex-col justify-center py-section">
        <NeuralField connectivity={0.8} density="low" seed={5} className="absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_45%_at_50%_50%,rgba(8,8,11,0.92),transparent)]" />
        <div className="container-x text-center">
          <RevealText id="about-cta-title" lines={aboutCta.title} className="display mx-auto text-giant" />
          <p className="mx-auto mt-6 max-w-md text-xl text-paper/80">
            {aboutCta.body[0]}
            <br />
            {aboutCta.body[1]}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PillButton href={aboutCta.primary.href} variant="sun" size="lg" arrow>
              {aboutCta.primary.label}
            </PillButton>
            <PillButton href={aboutCta.secondary.href} variant="outline" size="lg">
              {aboutCta.secondary.label}
            </PillButton>
            <SmartLink href={aboutCta.tertiary.href} className="group inline-flex items-center gap-1.5 px-3 py-3 text-sm font-semibold tracking-[0.06em] text-paper/75 uppercase underline-offset-4 hover:text-paper hover:underline">
              {aboutCta.tertiary.label}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </SmartLink>
          </div>
        </div>
      </div>
    </ThemeSection>
  )
}
