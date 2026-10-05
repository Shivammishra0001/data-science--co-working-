import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { manifesto } from '../../data/about/story'
import { useStoryMode } from '../../hooks/useStoryMode'
import { RevealText } from '../motion/RevealText'
import { ThemeSection } from '../market-push/ThemeSection'

// 12 — LIGHT: the manifesto. Only typography. Each line comes fully into
// focus as it reaches the middle of the screen; the space between is the pause.
export function Manifesto() {
  const ref = useRef(null)
  const { reduce } = useStoryMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 50%'] })
  const n = manifesto.lines.length

  return (
    <ThemeSection tone="light" id="manifesto" labelledBy="manifesto-title" data-chapter="future" className="pb-section">
      <div className="container-x pt-14">
        <h2 id="manifesto-title" className="eyebrow text-paper-mute">
          12 · Manifesto
        </h2>
        <ol ref={ref} className="mt-10 flex flex-col gap-[9vh]">
          {manifesto.lines.map((line, i) => (
            <Line key={line} text={line} range={[i / n, (i + 0.7) / n]} progress={scrollYProgress} still={reduce} last={i === n - 1} />
          ))}
        </ol>
        <RevealText as="p" lines={manifesto.closing} className="display mt-[18vh] text-huge text-flare" />
      </div>
    </ThemeSection>
  )
}

function Line({ text, range, progress, still, last }) {
  const o = useTransform(progress, range, [0.12, 1])
  const x = useTransform(progress, range, [-24, 0])
  return (
    <motion.li style={still ? undefined : { opacity: o, x }} className={`display text-[clamp(2.8rem,8vw,8rem)] leading-[0.88] ${last ? 'text-sun [-webkit-text-stroke:2px_#08080b]' : ''}`}>
      {text}
    </motion.li>
  )
}
