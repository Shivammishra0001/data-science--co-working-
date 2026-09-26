import { MarketHero } from '../components/market-push/MarketHero'
import { MarketQuestion } from '../components/market-push/MarketQuestion'
import { MarketLifecycle } from '../components/market-push/MarketLifecycle'
import { IdeaSignalSection } from '../components/market-push/IdeaSignalSection'
import { ValidationSignals } from '../components/market-push/ValidationSignals'
import { LaunchStories } from '../components/market-push/LaunchStories'
import { UserSignals } from '../components/market-push/UserSignals'
import { InnovationDiscovery } from '../components/market-push/InnovationDiscovery'
import { FeedbackLoop } from '../components/market-push/FeedbackLoop'
import { BuilderUserNetwork } from '../components/market-push/BuilderUserNetwork'
import { MarketImpact } from '../components/market-push/MarketImpact'
import { MarketCTA } from '../components/market-push/MarketCTA'

// Theme rhythm = concept rhythm:
// dark (unknown) → light (clarity) → dark (system) → light (signal) → dark (complexity)
// → light (evidence) → dark (market noise, discovery) → light (people, feedback)
// → dark (connection) → light (momentum) → dark (launch)
export default function MarketPushPage() {
  return (
    <>
      <title>Market Push — From Ideas to Real-World Innovation</title>
      <meta
        name="description"
        content="Discover technology products built by our community, explore emerging innovations, and move your own idea from experiment to real-world users."
      />
      <MarketHero />
      <MarketQuestion />
      <MarketLifecycle />
      <IdeaSignalSection />
      <ValidationSignals />
      <LaunchStories />
      <UserSignals />
      <InnovationDiscovery />
      <FeedbackLoop />
      <BuilderUserNetwork />
      <MarketImpact />
      <MarketCTA />
    </>
  )
}
