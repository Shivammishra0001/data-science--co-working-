import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useTransform } from 'motion/react'
import { launchStories } from '../../data/market/stories'
import { DESKTOP, useMediaQuery } from '../../hooks/useMediaQuery'
import { useScroller } from '../../hooks/useScroller'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { RevealText } from '../motion/RevealText'
import { SampleBadge } from '../ui/SampleBadge'
import { ScrollerControls, ScrollerTrack } from '../ui/Scroller'
import { LaunchStoryCard } from './LaunchStoryCard'
import { ThemeSection } from './ThemeSection'

// 06 — LIGHT: evidence. Desktop: vertical scroll drives a horizontal track of
// mixed-size stories (feature · stacked pair · wide · full-width case).
// Touch / reduced motion: a native swipeable row.
export function LaunchStories() {
  const desktop = useMediaQuery(DESKTOP)
  const reduce = useReducedMotion()
  return desktop && !reduce ? <PinnedTrack /> : <SwipeTrack />
}

function Heading({ children }) {
  return (
    <div className="container-x flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="eyebrow flex items-center gap-3 text-paper-mute">
          06 · Launch stories
          <SampleBadge tone="light" show={launchStories.some((s) => s.sample)}>Sample stories</SampleBadge>
        </p>
        <RevealText
          id="mp-stories-title"
          lines={['From experiment', <span key="r" className="text-volt">to something real.</span>]}
          className="display mt-3 text-huge"
        />
      </div>
      {children}
    </div>
  )
}

function PinnedTrack() {
  const ref = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)
  const progress = useScrollProgress(ref)
  const x = useTransform(progress, [0, 1], [0, -distance])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const [feature, a, b, wide, full] = launchStories
  return (
    <ThemeSection tone="light" id="stories" labelledBy="mp-stories-title" sectionRef={ref}>
      <div style={{ height: `calc(100svh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden pt-20">
          <Heading>
            <p className="max-w-xs text-ink/60">Keep scrolling — the stories move sideways.</p>
          </Heading>
          <motion.ul
            ref={trackRef}
            style={{ x }}
            aria-label="Launch stories"
            className="flex h-[min(64svh,40rem)] w-max gap-5 pr-[var(--spacing-gutter)] pl-[var(--spacing-gutter)] will-change-transform"
          >
            <li className="h-full w-[min(40vw,36rem)]">
              <LaunchStoryCard story={feature} className="h-full" />
            </li>
            <li className="flex h-full w-[min(26vw,24rem)] flex-col gap-5">
              <LaunchStoryCard story={a} className="min-h-0 flex-1" />
              <LaunchStoryCard story={b} className="min-h-0 flex-1" />
            </li>
            <li className="h-full w-[min(52vw,50rem)]">
              <LaunchStoryCard story={wide} className="h-full" />
            </li>
            <li className="h-full w-[82vw]">
              <LaunchStoryCard story={full} className="h-full" />
            </li>
          </motion.ul>
        </div>
      </div>
    </ThemeSection>
  )
}

function SwipeTrack() {
  const scroller = useScroller()
  return (
    <ThemeSection tone="light" id="stories" labelledBy="mp-stories-title" className="pb-section">
      <div className="pt-16">
        <Heading>
          <ScrollerControls scroller={scroller} label="stories" tone="light" />
        </Heading>
      </div>
      <ScrollerTrack scroller={scroller} label="Launch stories" className="mt-10 items-stretch pt-2">
        {launchStories.map((s) => (
          <div key={s.id} className="flex w-[min(86vw,26rem)] shrink-0 snap-start">
            <LaunchStoryCard story={s} size={s.size === 'small' ? 'small' : 'feature'} className="w-full" />
          </div>
        ))}
      </ScrollerTrack>
    </ThemeSection>
  )
}
