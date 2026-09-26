// Market Push lifecycle — the main diagram. Order matters: it's a loop.
export const lifecycle = [
  { id: 'idea', label: 'Idea', copy: 'Start with the question worth asking.', accent: 'sun' },
  { id: 'build', label: 'Build', copy: 'Turn curiosity into something people can touch.', accent: 'flare' },
  { id: 'test', label: 'Test', copy: 'Put the first version in front of reality.', accent: 'iris' },
  { id: 'feedback', label: 'Feedback', copy: 'Listen before defending the idea.', accent: 'mint' },
  { id: 'launch', label: 'Launch', copy: 'Give people a chance to say yes.', accent: 'sun' },
  { id: 'users', label: 'Users', copy: 'Your first users are evidence.', accent: 'flare' },
  { id: 'signals', label: 'Signals', copy: 'Watch what they do, not only what they say.', accent: 'iris' },
  { id: 'improve', label: 'Improve', copy: 'Turn evidence into the next build.', accent: 'mint' },
]

// What feeds the lifecycle from outside (left) and where it leads (right).
export const lifecycleInputs = { in: 'Builders', out: 'Market' }


// Feedback loop (second diagram) — launch is not the end. One accent: volt.
export const feedbackLoop = [
  { id: 'build', label: 'Build', copy: 'Ship the smallest thing that can teach you something.', accent: 'volt' },
  { id: 'release', label: 'Release', copy: 'Real people, real context, real stakes.', accent: 'volt' },
  { id: 'observe', label: 'Observe', copy: 'Where do they hesitate? Where do they leave?', accent: 'volt' },
  { id: 'listen', label: 'Listen', copy: 'Ask why — then stop talking.', accent: 'volt' },
  { id: 'learn', label: 'Learn', copy: 'Separate what you hoped from what happened.', accent: 'volt' },
  { id: 'improve', label: 'Improve', copy: 'Change one thing that matters. Then release again.', accent: 'volt' },
]

export const feedbackInputs = ['Users', 'Community', 'Experts', 'Data', 'Market']

// The questions that start it all (section 02).
export const marketQuestions = [
  { q: 'Who needs it?', a: 'Not "everyone". A person with a name, a job and a bad Tuesday.' },
  { q: 'Do they understand it?', a: 'If it needs a demo to make sense, the demo is the product.' },
  { q: 'Will they come back?', a: 'The first visit is curiosity. The second one is evidence.' },
]

// Validation (section 05)
export const validationQuestions = ['Who will use it?', 'Why will they care?', 'What makes them come back?', 'What would make them pay?']

export const behaviourSignals = [
  { id: 'click', label: 'Click', meaning: 'Something caught their eye.', strength: 1, accent: 'paper' },
  { id: 'save', label: 'Save', meaning: 'They want this later.', strength: 2, accent: 'iris' },
  { id: 'return', label: 'Return', meaning: 'They came back without being asked.', strength: 4, accent: 'mint' },
  { id: 'share', label: 'Share', meaning: 'They put their name next to yours.', strength: 3, accent: 'sun' },
  { id: 'buy', label: 'Buy', meaning: 'The strongest yes there is.', strength: 5, accent: 'flare' },
  { id: 'drop', label: 'Drop', meaning: 'Also a signal. Often the most useful one.', strength: -1, accent: 'volt' },
]
