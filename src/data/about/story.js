// About page — story copy. Plain words: build, test, meet, ship.

// Chapters for the side progress rail (data-chapter on each section).
export const chapters = [
  { id: 'why', label: 'Why', href: '#why' },
  { id: 'problem', label: 'Problem', href: '#problem' },
  { id: 'belief', label: 'Belief', href: '#belief' },
  { id: 'system', label: 'System', href: '#architecture' },
  { id: 'build', label: 'Build', href: '#inside' },
  { id: 'market', label: 'Market', href: '#idea-to-world' },
  { id: 'future', label: 'Future', href: '#vision' },
]

export const hero = {
  eyebrow: 'About us',
  title: ['What if the right', 'environment could change', 'what you are capable', 'of building?'],
  body: 'We believe potential is everywhere. The missing piece is often the environment around it.',
  cta: 'Explore our story',
  steps: ['One idea', 'People', 'Knowledge', 'Collaboration'],
}

export const whyWeExist = {
  title: ['Too many good ideas', 'die before they get a chance.'],
  pairs: [
    { claim: 'I have an idea.', but: 'But I don’t know where to begin.', accent: 'sun' },
    { claim: 'I know the technology.', but: 'But I haven’t built the whole thing.', accent: 'iris' },
    { claim: 'I can build.', but: 'But I’m building alone.', accent: 'mint' },
    { claim: 'I built something.', but: 'But I don’t know who needs it.', accent: 'flare' },
  ],
  closing: ['The gap between', 'idea and impact', 'is where we work.'],
}

export const problem = {
  obstacles: ['No direction', 'No team', 'No feedback', 'No expertise', 'No users', 'No market'],
  // what the environment puts in each obstacle's place
  answers: ['Guidance', 'Team', 'Feedback', 'Experts', 'Users', 'Market Push'],
  beats: [
    { until: 0.42, text: 'Here’s what usually happens to a good idea.', sub: 'It sets out. Then it meets everything it doesn’t have.' },
    { until: 0.6, text: 'The line breaks.', sub: 'Not because the idea was bad — because nothing around it held it together.' },
    { until: 0.72, text: 'This isn’t a talent problem.', sub: null },
    { until: 0.84, text: 'It’s an environment problem.', sub: null },
    { until: 1.01, text: 'So change the environment.', sub: 'Put direction, people, feedback and users along the path — and the line holds.' },
  ],
}

export const belief = {
  title: ['We believe builders', 'grow faster around', 'other builders.'],
  center: 'Builder',
  skills: [
    { label: 'Data', accent: 'volt' },
    { label: 'AI', accent: 'iris' },
    { label: 'Design', accent: 'flare' },
    { label: 'Engineering', accent: 'mint' },
    { label: 'Product', accent: 'sun' },
    { label: 'Research', accent: 'iris' },
    { label: 'Business', accent: 'volt' },
    { label: 'Community', accent: 'mint' },
  ],
  message: ['The best ideas are', 'rarely built alone.'],
  lines: ['Different skills.', 'Different experiences.', 'Different perspectives.', 'One problem worth solving.'],
}

export const dayHere = {
  title: ['This is what a day here', 'can become.'],
  steps: [
    { title: 'Arrive with a question', quote: 'I’ve been thinking about…', tag: 'Input' },
    { title: 'Meet someone', quote: 'Have you tried solving it this way?', tag: 'Connect' },
    { title: 'Build', quote: 'Let’s prototype it.', tag: 'Build' },
    { title: 'Get feedback', quote: 'Your assumption might be wrong.', tag: 'Review' },
    { title: 'Test', quote: 'Let’s put it in front of users.', tag: 'Test' },
    { title: 'Refine', quote: 'Now we know what actually matters.', tag: 'Learn' },
    { title: 'Ship', quote: 'Let’s put it into the world.', tag: 'Ship' },
  ],
}

export const manifesto = {
  lines: ['Bring the question.', 'Find the people.', 'Build the thing.', 'Test the idea.', 'Listen to the world.', 'Make it better.', 'Then launch.'],
  closing: ['That’s the kind of', 'space we’re building.'],
}

export const aboutCta = {
  title: ['What will you build', 'if you have the right', 'people around you?'],
  body: ['Bring your curiosity.', 'We’ll help you find what comes next.'],
  primary: { label: 'Join the community', href: '/community' },
  secondary: { label: 'Explore projects', href: '/#projects' },
  tertiary: { label: 'Book a workspace', href: '#contact' },
}
