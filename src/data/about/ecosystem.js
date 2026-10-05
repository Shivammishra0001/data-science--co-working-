// "What we built" architecture + "Everything connects" flow.
// Coordinates are in each diagram's own viewBox; `stage` (1-based) decides
// when a node/edge appears as the reader scrolls.

export const architecture = {
  width: 1000,
  height: 800,
  stages: [
    { title: 'Innovation', copy: 'Everything here exists to move one thing forward: the thing you’re building. It starts inside a focused co-working space designed for deep work.' },
    { title: 'Community', copy: 'Technology-specific communities: people to ask, people to learn from, people to build with.' },
    { title: 'Projects', copy: 'Real end-to-end projects — fed by the technology and events around them.' },
    { title: 'Experts', copy: 'People who have built before review architecture, products, research and direction.' },
    { title: 'AI Shark', copy: 'Present the idea. Get challenged. Improve it before the market does.' },
    { title: 'Market Push', copy: 'A path to put what works in front of real users.' },
    { title: 'Users & opportunities', copy: 'Users answer back; the work opens doors — pilots, collaborations, the next project.' },
  ],
  nodes: [
    { id: 'core', label: 'Innovation', kind: 'core', x: 500, y: 300, stage: 1, accent: 'sun' },
    { id: 'community', label: 'Community', kind: 'pill', x: 185, y: 300, stage: 2, accent: 'mint' },
    { id: 'events', label: 'Events', kind: 'pill', x: 185, y: 450, stage: 3, accent: 'mint', small: true },
    { id: 'projects', label: 'Projects', kind: 'pill', x: 815, y: 300, stage: 3, accent: 'iris' },
    { id: 'tech', label: 'Technology', kind: 'pill', x: 815, y: 450, stage: 3, accent: 'iris', small: true },
    { id: 'experts', label: 'Experts', kind: 'pill', x: 500, y: 95, stage: 4, accent: 'volt' },
    { id: 'shark', label: 'AI Shark', kind: 'pill', x: 500, y: 480, stage: 5, accent: 'flare' },
    { id: 'push', label: 'Market Push', kind: 'pill', x: 500, y: 610, stage: 6, accent: 'sun' },
    { id: 'users', label: 'Users', kind: 'pill', x: 250, y: 740, stage: 7, accent: 'mint' },
    { id: 'opps', label: 'Opportunities', kind: 'pill', x: 750, y: 740, stage: 7, accent: 'mint' },
  ],
  edges: [
    { from: 'community', to: 'core', stage: 2, accent: 'mint', tag: 'Connect', flow: true },
    { from: 'events', to: 'community', stage: 3, accent: 'mint' },
    { from: 'projects', to: 'core', stage: 3, accent: 'iris', tag: 'Build', flow: true },
    { from: 'tech', to: 'projects', stage: 3, accent: 'iris' },
    { from: 'experts', to: 'core', stage: 4, accent: 'volt', tag: 'Guide', flow: true },
    { from: 'core', to: 'shark', stage: 5, accent: 'flare', tag: 'Test', flow: true },
    { from: 'shark', to: 'push', stage: 6, accent: 'sun', tag: 'Ship', flow: true },
    { from: 'push', to: 'users', stage: 7, accent: 'mint', curve: -0.15, flow: true },
    { from: 'push', to: 'opps', stage: 7, accent: 'mint', curve: 0.15, flow: true },
    { from: 'users', to: 'community', stage: 7, accent: 'paper', curve: 0.35, dashed: true, tag: 'Feedback' },
  ],
  frames: [{ id: 'space', label: 'Co-working space · the environment', x: 70, y: 40, w: 860, h: 480, stage: 1 }],
}

// Everything connects — a serpentine path with a return loop.
export const ecosystemFlow = {
  width: 1000,
  height: 600,
  steps: [
    { id: 'user', label: 'User', x: 110, y: 100 },
    { id: 'idea', label: 'Idea', x: 370, y: 100 },
    { id: 'project', label: 'Project', x: 630, y: 100 },
    { id: 'community', label: 'Community', x: 890, y: 100 },
    { id: 'expert', label: 'Expert', x: 890, y: 300 },
    { id: 'prototype', label: 'Prototype', x: 630, y: 300 },
    { id: 'shark', label: 'AI Shark', x: 370, y: 300 },
    { id: 'push', label: 'Market Push', x: 110, y: 300 },
    { id: 'users', label: 'Users', x: 110, y: 500 },
    { id: 'feedback', label: 'Feedback', x: 450, y: 500 },
    { id: 'next', label: 'Next version', x: 800, y: 500 },
  ],
  loop: { label: 'Build → learn → build again' },
}

// Mobile / reduced-motion equivalents (vertical lists)
export const ecosystemList = ecosystemFlow.steps.map((s, i) => ({
  id: s.id,
  label: s.label,
  copy: ['Someone with a question.', 'Something worth trying.', 'The idea gets a shape.', 'People who’ve seen it before.', 'Someone who has built it before.', 'The first working version.', 'Challenged before the market does.', 'Put in front of real users.', 'People with a real need.', 'What they do, not only what they say.', 'Better, because someone answered.'][i],
  accent: ['sun', 'sun', 'iris', 'mint', 'volt', 'iris', 'flare', 'sun', 'mint', 'flare', 'mint'][i],
}))
