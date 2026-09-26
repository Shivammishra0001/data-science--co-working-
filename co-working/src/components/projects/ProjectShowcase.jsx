import { projects } from '../../data/projects'
import { useScroller } from '../../hooks/useScroller'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { PillButton } from '../ui/PillButton'
import { SampleBadge } from '../ui/SampleBadge'
import { ScrollerControls, ScrollerTrack } from '../ui/Scroller'
import { ProjectCard } from './ProjectCard'

export function ProjectShowcase() {
  const scroller = useScroller()
  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-paper py-section text-ink">
      <div className="container-x flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow mb-5 flex items-center gap-3 text-paper-mute">
            Projects <SampleBadge tone="light" show={projects.some((p) => p.sample)} />
          </p>
          <RevealText id="projects-title" lines={['What people', 'are building']} className="display text-giant" />
          <p className="mt-5 text-xl text-ink/70">Real ideas. Real experiments. Real products.</p>
        </div>
        <ScrollerControls scroller={scroller} label="projects" tone="light" />
      </div>

      <ScrollReveal preset="fade" className="mt-12">
        <ScrollerTrack scroller={scroller} label="Featured projects" className="pt-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </ScrollerTrack>
      </ScrollReveal>

      <div className="container-x mt-6">
        <PillButton href="#projects-all" variant="outline-ink" arrow>
          View all projects
        </PillButton>
      </div>
    </section>
  )
}
