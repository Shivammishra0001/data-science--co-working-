// The brain narrates. Frames run brain (001) → particles → butterfly (040),
// so the sequence reads as "intelligence becoming something that takes flight".
//
// brainX: horizontal offset of the brain in vw (desktop only).
// side:   which side the copy sits on — always opposite the brain.
export const storyStages = [
  {
    id: 'idea',
    title: 'Idea',
    eyebrow: 'Where it starts',
    copy: 'Every product starts as a question.',
    tags: ['Problem framing', 'Research'],
    brainX: -18,
    side: 'right',
    accent: 'sun',
  },
  {
    id: 'build',
    title: 'Build',
    eyebrow: 'Hands on keyboards',
    copy: 'Turn curiosity into something people can actually use.',
    tags: ['Prototypes', 'Notebooks', 'APIs'],
    brainX: 10,
    side: 'left',
    accent: 'flare',
  },
  {
    id: 'collaborate',
    title: 'Collaborate',
    eyebrow: 'Many minds',
    copy: 'Find people who see the problem differently.',
    tags: ['Co-builders', 'Pairing'],
    brainX: 20,
    side: 'left',
    accent: 'iris',
  },
  {
    id: 'guidance',
    title: 'Guidance',
    eyebrow: 'Experience in the room',
    copy: 'Bring experienced builders into the room.',
    tags: ['Mentors', 'Office hours'],
    brainX: 8,
    side: 'left',
    accent: 'mint',
  },
  {
    id: 'validate',
    title: 'Validate',
    eyebrow: 'Pressure-test it',
    copy: 'Challenge the idea before the market does.',
    tags: ['User interviews', 'Evals'],
    brainX: -18,
    side: 'right',
    accent: 'volt',
  },
  {
    id: 'ai-shark',
    title: 'AI Shark',
    eyebrow: 'Pitch night',
    copy: 'Present the idea. Get challenged. Improve it.',
    tags: ['Demo day', 'Expert panel'],
    brainX: 18,
    side: 'left',
    accent: 'flare',
  },
  {
    id: 'market-push',
    title: 'Market Push',
    eyebrow: 'Real users',
    copy: 'Put the product in front of real users.',
    tags: ['Pilots', 'Distribution'],
    brainX: -8,
    side: 'right',
    accent: 'sun',
  },
  {
    id: 'launch',
    title: 'Launch',
    eyebrow: 'Take flight',
    copy: 'Move from experiment to something real.',
    tags: ['Go live'],
    brainX: 16,
    side: 'left',
    accent: 'mint',
  },
]

export const FRAME_COUNT = 40
export const frameSrc = (i) => `/frames/brain-${String(i + 1).padStart(3, '0')}.jpg`
export const frameSrcs = Array.from({ length: FRAME_COUNT }, (_, i) => frameSrc(i))
// Final frames: butterfly, wings open, particle trail — used for the closing CTA loop.
export const butterflySrcs = frameSrcs.slice(33)
