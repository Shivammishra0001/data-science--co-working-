import { AboutHero } from '../components/about/AboutHero'
import { WhyWeExist } from '../components/about/WhyWeExist'
import { ProblemStory } from '../components/about/ProblemStory'
import { BeliefNetwork } from '../components/about/BeliefNetwork'
import { PlatformArchitecture } from '../components/about/PlatformArchitecture'
import { EcosystemFlow } from '../components/about/EcosystemFlow'
import { DayAtTheSpace } from '../components/about/DayAtTheSpace'
import { WhatYouGet } from '../components/about/WhatYouGet'
import { IdeaToRealWorld } from '../components/about/IdeaToRealWorld'
import { VisionStory } from '../components/about/VisionStory'
import { FutureNetwork } from '../components/about/FutureNetwork'
import { Manifesto } from '../components/about/Manifesto'
import { AboutCTA } from '../components/about/AboutCTA'
import { ProgressIndicator } from '../components/about/data-flow/ProgressIndicator'

// Rhythm = story: dark (curiosity) → light (why) → dark (problem) → light
// (belief) → dark (what we built) → light (connections) → dark (building) →
// light (what you get) → dark (idea → world) → light→dark (vision) → dark
// (future) → light (manifesto) → dark (join).
export default function AboutPage() {
  return (
    <>
      <title>About Us — Building the Environment Where Ideas Become Real</title>
      <meta
        name="description"
        content="Discover why we built this data science and AI coworking ecosystem, how builders collaborate here, and our vision for turning curiosity into real-world innovation."
      />
      <ProgressIndicator />
      <AboutHero />
      <WhyWeExist />
      <ProblemStory />
      <BeliefNetwork />
      <PlatformArchitecture />
      <EcosystemFlow />
      <DayAtTheSpace />
      <WhatYouGet />
      <IdeaToRealWorld />
      <VisionStory />
      <FutureNetwork />
      <Manifesto />
      <AboutCTA />
    </>
  )
}
