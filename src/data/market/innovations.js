// Discovery grid — PLACEHOLDER innovations. `users` null = not yet reported.
export const categories = [
  { id: 'ai', label: 'AI' },
  { id: 'data', label: 'Data' },
  { id: 'healthtech', label: 'HealthTech' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'edtech', label: 'EdTech' },
  { id: 'climate', label: 'Climate' },
  { id: 'devtools', label: 'Developer Tools' },
  { id: 'research', label: 'Research' },
]

// Filters are flags on each item, so the API can return them as-is.
export const filters = [
  { id: 'all', label: 'All' },
  { id: 'justLaunched', label: 'Just launched' },
  { id: 'popular', label: 'Popular' },
  { id: 'rising', label: 'Rising' },
  { id: 'openCollab', label: 'Open for collaboration' },
  { id: 'needsUsers', label: 'Looking for users' },
  { id: 'needsExperts', label: 'Looking for experts' },
]

export const innovations = [
  { id: 'clinic-notes', name: 'Clinic Notes Copilot', blurb: 'Drafts the medical record while the doctor talks.', tech: ['LLM', 'Speech'], stage: 'Live', users: null, category: 'healthtech', accent: 'volt', visual: 'rings', flags: ['popular'], sample: true },
  { id: 'kirana', name: 'Kirana Forecast', blurb: 'Tomorrow’s order, before the wholesaler calls.', tech: ['Time series'], stage: 'Beta', users: null, category: 'data', accent: 'sun', visual: 'bars', flags: ['rising', 'needsUsers'], sample: true },
  { id: 'credit-lens', name: 'Credit Lens', blurb: 'Thin-file credit scoring from cash-flow patterns.', tech: ['ML', 'Explainability'], stage: 'MVP', users: null, category: 'fintech', accent: 'mint', visual: 'graph', flags: ['needsExperts'], sample: true },
  { id: 'tutor-loop', name: 'Tutor Loop', blurb: 'Finds the concept a student is actually stuck on.', tech: ['LLM', 'Knowledge graphs'], stage: 'Beta', users: null, category: 'edtech', accent: 'iris', visual: 'nodes', flags: ['justLaunched', 'needsUsers'], sample: true },
  { id: 'grid-carbon', name: 'Grid Carbon Clock', blurb: 'Runs heavy jobs when the grid is cleanest.', tech: ['Forecasting', 'APIs'], stage: 'Prototype', users: null, category: 'climate', accent: 'mint', visual: 'wave', flags: ['openCollab', 'rising'], sample: true },
  { id: 'eval-bench', name: 'EvalBench', blurb: 'Regression tests for prompts, run on every commit.', tech: ['Evals', 'CI'], stage: 'Live', users: null, category: 'devtools', accent: 'flare', visual: 'grid', flags: ['popular', 'justLaunched'], sample: true },
  { id: 'paper-graph', name: 'Paper Graph', blurb: 'Maps which papers actually build on each other.', tech: ['Neo4j', 'NLP'], stage: 'Research', users: null, category: 'research', accent: 'iris', visual: 'nodes', flags: ['openCollab', 'needsExperts'], sample: true },
  { id: 'voice-agent', name: 'Vernacular Voice', blurb: 'Support in eleven Indian languages.', tech: ['Speech', 'LLM'], stage: 'Live', users: null, category: 'ai', accent: 'sun', visual: 'wave', flags: ['popular'], sample: true },
  { id: 'crop-vision', name: 'Crop Disease Vision', blurb: 'One leaf photo, offline diagnosis.', tech: ['Vision', 'Edge ML'], stage: 'Beta', users: null, category: 'ai', accent: 'mint', visual: 'grid', flags: ['needsUsers', 'rising'], sample: true },
  { id: 'schema-scout', name: 'Schema Scout', blurb: 'Finds the join that breaks your dashboard.', tech: ['SQL', 'LLM'], stage: 'MVP', users: null, category: 'data', accent: 'flare', visual: 'bars', flags: ['justLaunched', 'openCollab'], sample: true },
]
