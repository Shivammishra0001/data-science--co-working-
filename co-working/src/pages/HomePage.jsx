import { brand } from '../config/site'
import { HeroSection } from '../components/hero/HeroSection'
import { RibbonSection } from '../components/motion/RibbonSection'
import { WhySection } from '../components/why/WhySection'
import { InnovationStory } from '../components/story/InnovationStory'
import { ProjectShowcase } from '../components/projects/ProjectShowcase'
import { MarketPush } from '../components/market/MarketPush'
import { CommunityGrid } from '../components/communities/CommunityGrid'
import { BuilderNetwork } from '../components/network/BuilderNetwork'
import { CommunityVoices } from '../components/testimonials/CommunityVoices'
import { ImpactStats } from '../components/stats/ImpactStats'
import { FinalCTA } from '../components/cta/FinalCTA'

export default function HomePage() {
  return (
    <>
      {/* React 19 hoists these into <head> */}
      <title>{`${brand.name} — The AI Builder Space`}</title>
      <meta
        name="description"
        content="A co-working space and builder ecosystem for data scientists, AI builders and founders. Ideate, build, validate and launch."
      />
      <HeroSection />
      <RibbonSection />
      <WhySection />
      <InnovationStory />
      <ProjectShowcase />
      <MarketPush />
      <CommunityGrid />
      <BuilderNetwork />
      <CommunityVoices />
      <ImpactStats />
      <FinalCTA />
    </>
  )
}
