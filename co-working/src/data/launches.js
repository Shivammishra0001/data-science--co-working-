// Market Push — projects that crossed into real use.
// Every metric here is PLACEHOLDER until the launches API exists. Keep `sample: true`
// on anything not backed by real data; the UI labels it.
export const journey = ['Idea', 'Prototype', 'Test', 'Launch', 'Users']

export const launches = [
  {
    id: 'clinic-notes',
    product: 'Clinic Notes Copilot',
    origin: 'Started as a weekend hack in the Build Lab',
    stage: 'Launch',
    metric: { value: '4.8K', label: 'Active users' },
    industry: 'Healthcare',
    tech: ['LLM', 'Speech-to-text'],
    live: true,
    accent: 'volt',
    sample: true,
  },
  {
    id: 'kirana-forecast',
    product: 'Kirana Demand Forecast',
    origin: 'Born from an AI Shark pitch',
    stage: 'Users',
    metric: { value: '36', label: 'Business users' },
    industry: 'Retail',
    tech: ['Time series', 'Databricks'],
    live: true,
    accent: 'sun',
    sample: true,
  },
  {
    id: 'docs-qa',
    product: 'Policy Docs Q&A',
    origin: 'Three strangers, one whiteboard',
    stage: 'Test',
    metric: { value: '12K+', label: 'Questions answered' },
    industry: 'Public sector',
    tech: ['RAG', 'Knowledge graphs'],
    live: false,
    accent: 'flare',
    sample: true,
  },
]
