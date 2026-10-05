import { ideaWorldNetwork } from '../../animations/aboutMotion'
import { ideaToWorld } from '../../data/about/vision'
import { useActiveIndex } from '../../hooks/useScrollProgress'
import { useStoryMode } from '../../hooks/useStoryMode'
import { accentText, cx } from '../../utils/accents'
import { LoopList } from '../market-push/LoopList'
import { NetworkDiagram } from './data-flow/NetworkDiagram'
import { StageRail, StoryScene } from './data-flow/StoryScene'

// 09 — DARK: idea → real world. The network literally grows: an idea gathers
// knowledge, takes structure inside the workspace, starts working, meets users,
// gets challenged, pushes past the workspace wall and becomes a live product.
const dense = ideaWorldNetwork({ dense: true })
const light = ideaWorldNetwork({ dense: false })
const N = ideaToWorld.stages.length

export function IdeaToRealWorld() {
  return (
    <StoryScene tone="dark" id="idea-to-world" chapter="market" labelledBy="itw-title" vh={560} fallback={(p) => <Static progress={p} />}>
      {(p) => <Pinned progress={p} />}
    </StoryScene>
  )
}

function Heading() {
  return (
    <>
      <p className="eyebrow text-paper/55">09 · From idea to real world</p>
      <h2 id="itw-title" className="display mt-3 text-big">
        {ideaToWorld.title[0]} <span className="text-sun">{ideaToWorld.title[1]}</span>
      </h2>
    </>
  )
}

function Pinned({ progress }) {
  const active = useActiveIndex(progress, N)
  const s = ideaToWorld.stages[active]
  return (
    <div className="container-x grid w-full gap-6">
      <div className="grid items-center gap-8 lg:grid-cols-[0.6fr_1.4fr]">
        <div>
          <Heading />
          <div key={s.id} className="animate-fade-in mt-10" aria-live="polite">
            <p className="font-mono text-xs tracking-[0.14em] text-paper/50 uppercase">Stage {String(active + 1).padStart(2, '0')} / 0{N}</p>
            <p className={cx('display mt-1 text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.88]', accentText[s.accent])}>{s.label}</p>
            <p className="mt-3 max-w-xs text-lg text-paper/75">{s.copy}</p>
          </div>
        </div>
        <NetworkDiagram {...dense} progress={progress} width={1000} height={720} className="h-auto max-h-[70svh] w-full" />
      </div>
      <StageRail stages={ideaToWorld.stages.map((x) => x.label)} active={active} />
    </div>
  )
}

function Static({ progress }) {
  const { desktop } = useStoryMode()
  return (
    <div className="container-x">
      <Heading />
      <div className="mt-8">
        <NetworkDiagram {...(desktop ? dense : light)} progress={progress} width={1000} height={720} />
      </div>
      <div className="mt-8">
        <LoopList stages={ideaToWorld.stages} returnLabel={null} />
      </div>
    </div>
  )
}
