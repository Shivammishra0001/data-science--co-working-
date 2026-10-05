import { architecture } from '../../data/about/ecosystem'
import { stageAt } from '../../animations/aboutMotion'
import { useActiveIndex } from '../../hooks/useScrollProgress'
import { cx } from '../../utils/accents'
import { LoopList } from '../market-push/LoopList'
import { NetworkDiagram } from './data-flow/NetworkDiagram'
import { StoryScene } from './data-flow/StoryScene'

// 05 — DARK: what we built. The platform as a living system, assembled stage
// by stage: innovation → community → projects → experts → AI Shark →
// Market Push → users & opportunities. Each new stage lights its path.
const N = architecture.stages.length
const at = (stage) => stageAt(stage, N)
const nodes = architecture.nodes.map((n) => ({ ...n, at: n.stage === 1 ? 0 : at(n.stage) + 0.03 }))
const edges = architecture.edges.map((e) => ({ ...e, at: at(e.stage), dur: 0.05 }))
const frames = architecture.frames.map((f) => ({ ...f, at: f.stage === 1 ? 0 : at(f.stage) }))
const list = architecture.stages.map((s, i) => ({ id: s.title, label: s.title, copy: s.copy, accent: ['sun', 'mint', 'iris', 'volt', 'flare', 'sun', 'mint'][i] }))

export function PlatformArchitecture() {
  return (
    <StoryScene tone="dark" id="architecture" chapter="system" labelledBy="arch-title" vh={520} fallback={(p) => <Static progress={p} />}>
      {(p) => <Pinned progress={p} />}
    </StoryScene>
  )
}

function Heading() {
  return (
    <>
      <p className="eyebrow text-paper/55">05 · What we built</p>
      <h2 id="arch-title" className="display mt-3 text-big">
        Not one thing. <span className="text-sun">Layers that connect.</span>
      </h2>
    </>
  )
}

function Pinned({ progress }) {
  const active = useActiveIndex(progress, N)
  return (
    <div className="container-x grid w-full items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <Heading />
        <ol className="mt-8 flex flex-col">
          {architecture.stages.map((s, i) => (
            <li key={s.title} aria-current={i === active ? 'step' : undefined} className={cx('border-t border-line py-2.5 transition-opacity duration-300', i === active ? 'opacity-100' : i < active ? 'opacity-55' : 'opacity-25')}>
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-paper/50">{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-2xl leading-none">{s.title}</span>
              </p>
              <div className={cx('grid transition-[grid-template-rows] duration-300', i === active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <p className="overflow-hidden pl-8 text-sm text-paper/70">
                  <span className="block pt-1.5">{s.copy}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <NetworkDiagram nodes={nodes} edges={edges} frames={frames} progress={progress} width={architecture.width} height={architecture.height} className="mx-auto h-auto max-h-[80svh] w-full" />
    </div>
  )
}

function Static({ progress }) {
  return (
    <div className="container-x">
      <Heading />
      <div className="mt-10 hidden md:block">
        <NetworkDiagram nodes={nodes} edges={edges} frames={frames} progress={progress} width={architecture.width} height={architecture.height} />
      </div>
      <div className="mt-10">
        <LoopList stages={list} returnLabel={null} />
      </div>
    </div>
  )
}
