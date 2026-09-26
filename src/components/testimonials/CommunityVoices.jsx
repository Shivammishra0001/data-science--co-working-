import { testimonials } from '../../data/testimonials'
import { useScroller } from '../../hooks/useScroller'
import { RevealText } from '../motion/RevealText'
import { ScrollReveal } from '../motion/ScrollReveal'
import { SampleBadge } from '../ui/SampleBadge'
import { ScrollerControls, ScrollerTrack } from '../ui/Scroller'
import { ReviewCard } from './ReviewCard'

export function CommunityVoices() {
  const scroller = useScroller()
  const avg = testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
  return (
    <section id="voices" aria-labelledby="voices-title" className="bg-ink py-section">
      <div className="container-x flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow mb-6 flex items-center gap-3 text-paper/60">
            Community voices
            <SampleBadge show={testimonials.some((t) => t.sample)}>Placeholder quotes</SampleBadge>
          </p>
          <RevealText id="voices-title" lines={['Voices from', 'the community']} className="display text-huge" />
          <p className="mt-4 text-paper/60">
            Average rating {avg.toFixed(1)}/5 from {testimonials.length} reviews
          </p>
        </div>
        <ScrollerControls scroller={scroller} label="reviews" />
      </div>

      <ScrollReveal preset="fade" className="mt-12">
        <ScrollerTrack scroller={scroller} label="Community reviews" className="pt-3">
          {testimonials.map((t) => (
            <ReviewCard key={t.id} review={t} />
          ))}
        </ScrollerTrack>
      </ScrollReveal>
    </section>
  )
}
