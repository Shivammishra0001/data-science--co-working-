// Technology communities — CMS/API-ready shape.
//
// Logos (public/logos/*.svg) are the brands' own marks, as published by:
//   - Simple Icons (CC0 tracings of official marks) — v16.32.0; OpenAI from v15.22.0
//   - Sarvam AI's own brand CDN (assets.sarvam.ai/assets/brand/logos) — sarvam-ai.svg
// They are single-colour and rendered as CSS masks, so each can take a subtle
// brand tint without separate coloured files. Using third-party marks is subject
// to each brand's guidelines; confirm before launch.
//
// logo.aspect      width ÷ height of the SVG viewBox (all current files are 1)
// logo.placement   where the mark sits as artwork: `h` = height as % of the card,
//                  plus any of top/right/bottom/left in %. Width follows from
//                  `aspect`, so marks are never stretched.
// logo.depth       scroll-parallax travel in px (4–10) — different rates create depth
// theme            accent = hover border / metadata / glow; logoFill = mask fill
//                  (a colour or gradient); logoOpacity = resting visibility
// members          DEVELOPMENT CONTENT — replace with platform data (`sample: true`)

const baseCommunities = [
  {
    id: 'openai',
    slug: 'openai',
    name: 'OpenAI',
    description: 'Agents & API builders',
    members: '12.4K',
    category: 'AI / Builders',
    featured: true,
    logo: { src: '/logos/openai.svg', alt: 'OpenAI logo', aspect: 1, placement: { h: 112, right: -6, top: 4 }, depth: 8 },
    theme: { accent: '#e8e6df', logoFill: '#e8e6df', logoOpacity: 0.14 },
    sample: true,
  },
  {
    id: 'anthropic',
    slug: 'anthropic',
    name: 'Anthropic',
    description: 'Claude builders',
    members: '8.1K',
    category: 'AI / Agents',
    featured: true,
    logo: { src: '/logos/anthropic.svg', alt: 'Anthropic logo', aspect: 1, placement: { h: 96, right: -2, top: -14 }, depth: 6 },
    theme: { accent: '#d97757', logoFill: '#e9a58a', logoOpacity: 0.16 },
    sample: true,
  },
  {
    id: 'gemini',
    slug: 'gemini',
    name: 'Gemini',
    description: 'Multimodal apps',
    members: '6.7K',
    category: 'AI / Multimodal',
    logo: { src: '/logos/gemini.svg', alt: 'Google Gemini logo', aspect: 1, placement: { h: 128, right: -26, bottom: -30 }, depth: 10 },
    theme: { accent: '#8e8cf0', logoFill: 'linear-gradient(135deg, #4796e3 10%, #9177c7 55%, #ca6673 95%)', logoOpacity: 0.22 },
    sample: true,
  },
  {
    id: 'hugging-face',
    slug: 'hugging-face',
    name: 'Hugging Face',
    description: 'Open models',
    members: '9.2K',
    category: 'AI / Open source',
    logo: { src: '/logos/hugging-face.svg', alt: 'Hugging Face logo', aspect: 1, placement: { h: 104, right: -18, bottom: -14 }, depth: 5 },
    theme: { accent: '#ffd21e', logoFill: '#ffd21e', logoOpacity: 0.16 },
    sample: true,
  },
  {
    id: 'sarvam-ai',
    slug: 'sarvam-ai',
    name: 'Sarvam AI',
    description: 'Indic language AI',
    members: '3.3K',
    category: 'AI / Language',
    logo: { src: '/logos/sarvam-ai.svg', alt: 'Sarvam AI logo', aspect: 1, placement: { h: 124, right: -34, top: 6 }, depth: 7 },
    theme: { accent: '#3fdb94', logoFill: '#8ce8bd', logoOpacity: 0.2 },
    sample: true,
  },
  {
    id: 'deepseek',
    slug: 'deepseek',
    name: 'DeepSeek',
    description: 'Reasoning models',
    members: '4.0K',
    category: 'AI / Research',
    logo: { src: '/logos/deepseek.svg', alt: 'DeepSeek logo', aspect: 1, placement: { h: 108, right: -24, top: 10 }, depth: 9 },
    theme: { accent: '#4d6bfe', logoFill: '#7d93ff', logoOpacity: 0.2 },
    sample: true,
  },
  {
    id: 'databricks',
    slug: 'databricks',
    name: 'Databricks',
    description: 'Data & ML platforms',
    members: '5.5K',
    category: 'Data / ML',
    logo: { src: '/logos/databricks.svg', alt: 'Databricks logo', aspect: 1, placement: { h: 96, right: -12, top: -20 }, depth: 6 },
    theme: { accent: '#ff3621', logoFill: '#ff6a52', logoOpacity: 0.18 },
    sample: true,
  },
  {
    id: 'neo4j',
    slug: 'neo4j',
    name: 'Neo4j',
    description: 'Graphs & GraphRAG',
    members: '2.9K',
    category: 'Data / Knowledge graph',
    logo: { src: '/logos/neo4j.svg', alt: 'Neo4j logo', aspect: 1, placement: { h: 100, left: 34, bottom: -26 }, depth: 8 },
    theme: { accent: '#4fd8a5', logoFill: '#7fe3bd', logoOpacity: 0.18 },
    sample: true,
  },
  {
    id: 'nvidia',
    slug: 'nvidia',
    name: 'NVIDIA',
    description: 'GPU & edge AI',
    members: '7.6K',
    category: 'AI / Computing',
    logo: { src: '/logos/nvidia.svg', alt: 'NVIDIA logo', aspect: 1, placement: { h: 118, right: -18, bottom: -24 }, depth: 4 },
    theme: { accent: '#76b900', logoFill: '#94d32b', logoOpacity: 0.18 },
    sample: true,
  },
]

// ---------------------------------------------------------------------------
// Community platform fields (/community). DEMO DATA: membersCount, activeToday
// and createdAt are local seed values until the backend exists — not real
// activity. Shape follows the Community model: id, slug, name, logo, description
// (tagline), category, membersCount, activeMembersCount, officialWebsite,
// github, docs, rules, createdAt.
// ---------------------------------------------------------------------------
const defaultRules = [
  'Be respectful. Disagree with ideas, not people.',
  'No spam or unsolicited promotion.',
  'Share useful technical knowledge — code, results, lessons.',
  'Clearly label promotional or affiliated content.',
  'Respect licences and give attribution.',
]

const platform = {
  openai: {
    tagline: 'Agents & API builders',
    about: 'For people exploring LLM applications, agents, APIs and practical AI product development.',
    categories: ['AI', 'Developer'],
    keywords: ['LLM', 'GPT', 'agents', 'API', 'structured outputs', 'function calling'],
    topics: ['LLMs', 'Agents', 'APIs', 'RAG', 'AI products'],
    membersCount: 12400,
    activeMembersCount: 286,
    createdAt: '2025-03-04',
    officialWebsite: 'https://openai.com',
    docs: 'https://platform.openai.com/docs',
    github: 'https://github.com/openai',
    highlights: { projectsThisWeek: 5, discussionsToday: 12, upcomingEvents: 2 },
    moderatorIds: ['m14'],
  },
  anthropic: {
    tagline: 'Claude & AI builders',
    about: 'For builders working with Claude: agents, tool use, long context, evals and safe deployment.',
    categories: ['AI', 'Developer', 'Research'],
    keywords: ['LLM', 'Claude', 'agents', 'MCP', 'tool use', 'long context'],
    topics: ['Claude', 'Agents', 'MCP', 'Evals', 'Long context'],
    membersCount: 8100,
    activeMembersCount: 174,
    createdAt: '2025-04-11',
    officialWebsite: 'https://www.anthropic.com',
    docs: 'https://docs.anthropic.com',
    github: 'https://github.com/anthropics',
    highlights: { projectsThisWeek: 3, discussionsToday: 9, upcomingEvents: 2 },
    moderatorIds: ['m14'],
  },
  gemini: {
    tagline: 'Multimodal AI builders',
    about: 'For people building with Gemini across text, images, audio and video.',
    categories: ['AI', 'Cloud', 'Developer'],
    keywords: ['LLM', 'multimodal', 'Google', 'vision', 'video'],
    topics: ['Multimodal', 'Vision', 'Video', 'Grounding'],
    membersCount: 6700,
    activeMembersCount: 210,
    createdAt: '2025-05-20',
    officialWebsite: 'https://gemini.google.com',
    docs: 'https://ai.google.dev/gemini-api/docs',
    github: 'https://github.com/google-gemini',
    highlights: { projectsThisWeek: 2, discussionsToday: 8, upcomingEvents: 1 },
    moderatorIds: [],
  },
  'hugging-face': {
    tagline: 'Open models & open-source AI',
    about: 'For people training, fine-tuning, evaluating and shipping open models and datasets.',
    categories: ['AI', 'ML', 'Open Source'],
    keywords: ['LLM', 'transformers', 'open models', 'datasets', 'fine-tuning', 'inference'],
    topics: ['Open models', 'Fine-tuning', 'Datasets', 'Inference'],
    membersCount: 9200,
    activeMembersCount: 318,
    createdAt: '2025-02-18',
    officialWebsite: 'https://huggingface.co',
    docs: 'https://huggingface.co/docs',
    github: 'https://github.com/huggingface',
    highlights: { projectsThisWeek: 6, discussionsToday: 14, upcomingEvents: 2 },
    moderatorIds: [],
  },
  'sarvam-ai': {
    tagline: 'Indic language AI',
    about: 'For builders working on Indian-language AI: speech, translation, transliteration and multilingual apps.',
    categories: ['AI', 'Research'],
    keywords: ['LLM', 'Indic', 'multilingual', 'speech', 'translation'],
    topics: ['Indic languages', 'Speech', 'Translation', 'Multilingual'],
    membersCount: 3300,
    activeMembersCount: 96,
    createdAt: '2025-08-02',
    officialWebsite: 'https://www.sarvam.ai',
    docs: 'https://docs.sarvam.ai',
    github: 'https://github.com/sarvamai',
    highlights: { projectsThisWeek: 1, discussionsToday: 4, upcomingEvents: 1 },
    moderatorIds: [],
  },
  deepseek: {
    tagline: 'Reasoning & research',
    about: 'For people studying and applying reasoning models: evals, distillation and open research.',
    categories: ['AI', 'Research', 'Open Source'],
    keywords: ['LLM', 'reasoning', 'MoE', 'distillation', 'open weights'],
    topics: ['Reasoning', 'Evals', 'Distillation', 'Papers'],
    membersCount: 4000,
    activeMembersCount: 144,
    createdAt: '2025-06-09',
    officialWebsite: 'https://www.deepseek.com',
    docs: 'https://api-docs.deepseek.com',
    github: 'https://github.com/deepseek-ai',
    highlights: { projectsThisWeek: 2, discussionsToday: 6, upcomingEvents: 1 },
    moderatorIds: [],
  },
  databricks: {
    tagline: 'Data & ML platforms',
    about: 'For data engineers and ML teams building pipelines, lakehouses and production ML.',
    categories: ['Data', 'ML', 'Cloud'],
    keywords: ['Spark', 'lakehouse', 'MLflow', 'Delta', 'data engineering', 'feature store'],
    topics: ['Lakehouse', 'Pipelines', 'MLflow', 'Feature stores'],
    membersCount: 5500,
    activeMembersCount: 201,
    createdAt: '2025-03-27',
    officialWebsite: 'https://www.databricks.com',
    docs: 'https://docs.databricks.com',
    github: 'https://github.com/databricks',
    highlights: { projectsThisWeek: 3, discussionsToday: 7, upcomingEvents: 1 },
    moderatorIds: [],
  },
  neo4j: {
    tagline: 'Graphs & GraphRAG',
    about: 'For people modelling connected data: knowledge graphs, Cypher, graph ML and GraphRAG.',
    categories: ['Data', 'Knowledge Graph', 'Developer'],
    keywords: ['graph', 'Cypher', 'GraphRAG', 'knowledge graph', 'graph database'],
    topics: ['Knowledge graphs', 'GraphRAG', 'Cypher', 'Graph ML'],
    membersCount: 2900,
    activeMembersCount: 88,
    createdAt: '2025-07-15',
    officialWebsite: 'https://neo4j.com',
    docs: 'https://neo4j.com/docs',
    github: 'https://github.com/neo4j',
    highlights: { projectsThisWeek: 2, discussionsToday: 5, upcomingEvents: 1 },
    moderatorIds: ['m11'],
  },
  nvidia: {
    tagline: 'GPU & edge AI',
    about: 'For people optimising AI on GPUs: CUDA, inference engines, edge devices and cost.',
    categories: ['AI', 'ML', 'Cloud'],
    keywords: ['GPU', 'CUDA', 'TensorRT', 'Jetson', 'edge', 'inference'],
    topics: ['CUDA', 'Inference', 'Edge AI', 'Jetson'],
    membersCount: 7600,
    activeMembersCount: 235,
    createdAt: '2025-01-30',
    officialWebsite: 'https://www.nvidia.com',
    docs: 'https://docs.nvidia.com',
    github: 'https://github.com/NVIDIA',
    highlights: { projectsThisWeek: 4, discussionsToday: 10, upcomingEvents: 1 },
    moderatorIds: [],
  },
}

export const communities = baseCommunities.map((c) => ({ rules: defaultRules, ...c, ...platform[c.id] }))

export const COMMUNITY_CATEGORIES = ['All', 'AI', 'Data', 'ML', 'Developer', 'Research', 'Open Source', 'Cloud', 'Knowledge Graph']
export const COMMUNITY_SORTS = [
  { id: 'popular', label: 'Popular' },
  { id: 'active', label: 'Most active' },
  { id: 'newest', label: 'Newest' },
  { id: 'alpha', label: 'Alphabetical' },
]

export const communityHref = (c) => `/community/${c.slug}`
export const findCommunity = (slug) => communities.find((c) => c.slug === slug)

export const ecosystemCard = {
  title: ['Explore', 'the whole', 'ecosystem'],
  description: 'AI, data, cloud, developer tools, research and more.',
  href: '/community',
}

// Home page "Technology communities" section — left-column copy.
// Edit the words here; the layout is in src/components/communities/CommunityGrid.jsx.
export const communitySection = {
  eyebrow: 'Technology communities',
  title: ['Every stack', 'has a crowd.', 'Find yours.'], // last line is highlighted
  body: 'Builders who use the same tools, in the same room — swapping code, questions and wins, from LLMs and open models to graphs and GPUs.',
  points: ['Ask the people who already solved it', 'Share what you’re building', 'Join meetups, workshops and demo days'],
  cta: { label: 'Explore communities', href: '/community' },
  viewAll: { label: 'View all', href: '/community' },
}
