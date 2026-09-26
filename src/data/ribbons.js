// Each ribbon has its own base velocity (%/s, sign = direction) and palette.
// Scroll direction flips and accelerates them; see ScrollRibbon.
export const ribbons = [
  {
    id: 'verbs',
    label: 'What happens here',
    velocity: -2.2,
    items: ['Build', 'Experiment', 'Collaborate', 'Create', 'Research', 'Ship', 'Validate', 'Launch'],
    palette: ['sun', 'paper', 'flare', 'iris'],
    size: 'lg',
  },
  {
    id: 'fields',
    label: 'Fields we work in',
    velocity: 1.6,
    items: ['AI', 'Data', 'LLM', 'Robotics', 'Computer Vision', 'NLP', 'Knowledge Graphs'],
    palette: ['volt', 'mint', 'paper', 'flare'],
    size: 'md',
  },
  {
    id: 'stack',
    label: 'Technologies our builders use',
    velocity: -1.1,
    items: ['OpenAI', 'Anthropic', 'Gemini', 'Hugging Face', 'Databricks', 'Neo4j', 'Sarvam AI', 'DeepSeek'],
    palette: ['outline'],
    size: 'sm',
  },
]
