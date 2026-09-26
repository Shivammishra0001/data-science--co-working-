// DEMO SEED — fictional people for local development. Not real users.
// Shape: id, username, name, role, bio, skills, communityIds, accent, projectsCount
export const communityMembers = [
  { id: 'm1', username: 'rahul-sharma', name: 'Rahul Sharma', role: 'ML Engineer', skills: ['RAG', 'Neo4j', 'Python'], communityIds: ['neo4j', 'openai', 'databricks'], accent: 'sun', projectsCount: 3 },
  { id: 'm2', username: 'priya-nair', name: 'Priya Nair', role: 'Data Scientist', skills: ['LLM evals', 'Python', 'Statistics'], communityIds: ['openai', 'anthropic', 'hugging-face'], accent: 'iris', projectsCount: 2 },
  { id: 'm3', username: 'arjun-mehta', name: 'Arjun Mehta', role: 'Founder, health AI', skills: ['Product', 'Speech', 'LLMs'], communityIds: ['openai', 'anthropic'], accent: 'flare', projectsCount: 1 },
  { id: 'm4', username: 'sara-khan', name: 'Sara Khan', role: 'Product Builder', skills: ['Prototyping', 'Multimodal', 'UX'], communityIds: ['gemini', 'openai'], accent: 'mint', projectsCount: 2 },
  { id: 'm5', username: 'meera-iyer', name: 'Dr. Meera Iyer', role: 'Research Mentor', skills: ['Computer vision', 'Evaluation'], communityIds: ['nvidia', 'hugging-face', 'deepseek'], accent: 'volt', projectsCount: 4 },
  { id: 'm6', username: 'kabir-rao', name: 'Kabir Rao', role: 'Platform Engineer', skills: ['Spark', 'Kubernetes', 'GPUs'], communityIds: ['databricks', 'nvidia'], accent: 'sun', projectsCount: 2 },
  { id: 'm7', username: 'ananya-reddy', name: 'Ananya Reddy', role: 'Speech & Indic NLP', skills: ['ASR', 'Transliteration', 'PyTorch'], communityIds: ['sarvam-ai', 'hugging-face', 'openai'], accent: 'mint', projectsCount: 2 },
  { id: 'm8', username: 'vikram-joshi', name: 'Vikram Joshi', role: 'Data Engineer', skills: ['Delta Lake', 'dbt', 'Graphs'], communityIds: ['databricks', 'neo4j'], accent: 'flare', projectsCount: 2 },
  { id: 'm9', username: 'lena-fischer', name: 'Lena Fischer', role: 'Research Engineer', skills: ['Reasoning evals', 'Distillation'], communityIds: ['deepseek', 'anthropic', 'hugging-face'], accent: 'iris', projectsCount: 1 },
  { id: 'm10', username: 'tomas-rivera', name: 'Tomás Rivera', role: 'Full-stack AI Developer', skills: ['TypeScript', 'Agents', 'APIs'], communityIds: ['openai', 'gemini'], accent: 'volt', projectsCount: 1 },
  { id: 'm11', username: 'neha-gupta', name: 'Neha Gupta', role: 'Graph Data Scientist', skills: ['Cypher', 'Graph ML', 'GraphRAG'], communityIds: ['neo4j'], accent: 'mint', projectsCount: 1 },
  { id: 'm12', username: 'imran-siddiqui', name: 'Imran Siddiqui', role: 'Edge AI Engineer', skills: ['Jetson', 'TensorRT', 'C++'], communityIds: ['nvidia'], accent: 'sun', projectsCount: 1 },
  { id: 'm13', username: 'aisha-bello', name: 'Aisha Bello', role: 'MLOps Engineer', skills: ['MLflow', 'Serving', 'Monitoring'], communityIds: ['databricks', 'hugging-face'], accent: 'flare', projectsCount: 2 },
  { id: 'm14', username: 'karthik-s', name: 'Karthik Subramanian', role: 'Community host', skills: ['Agents', 'Events', 'Mentoring'], communityIds: ['openai', 'anthropic'], accent: 'iris', projectsCount: 0 },
  { id: 'm15', username: 'meghna-das', name: 'Meghna Das', role: 'Student Builder', skills: ['Python', 'Notebooks', 'Curiosity'], communityIds: ['gemini', 'sarvam-ai', 'deepseek'], accent: 'volt', projectsCount: 1 },
  { id: 'm16', username: 'owen-park', name: 'Owen Park', role: 'Developer Advocate', skills: ['MCP', 'Tooling', 'Docs'], communityIds: ['anthropic', 'openai'], accent: 'mint', projectsCount: 2 },
]

export const findMember = (id) => communityMembers.find((m) => m.id === id)
export const findMemberByUsername = (u) => communityMembers.find((m) => m.username === u)
export const profileHref = (person) => `/profile/${person.username}`
