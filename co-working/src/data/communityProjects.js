// DEMO SEED — projects linked to communities (Community ↔ Projects).
// A project can belong to several communities. Shape: id, name, builderId,
// stage, tech, description, communityIds
export const communityProjects = [
  { id: 'resume-analyzer', name: 'AI Resume Analyzer', builderId: 'm10', stage: 'MVP', tech: ['LLM', 'Structured outputs'], description: 'Maps a CV to a role’s real requirements, not keywords.', communityIds: ['openai'] },
  { id: 'support-agent', name: 'Customer Support Agent', builderId: 'm16', stage: 'Beta', tech: ['Agents', 'Tool use'], description: 'Resolves tier-one tickets and hands off with a full trace.', communityIds: ['openai', 'anthropic'] },
  { id: 'rag-assistant', name: 'RAG Research Assistant', builderId: 'm1', stage: 'Prototype', tech: ['RAG', 'Neo4j', 'Embeddings'], description: 'Answers with the passage and the graph path it used.', communityIds: ['openai', 'neo4j'] },
  { id: 'voice-assistant', name: 'Voice Assistant', builderId: 'm7', stage: 'Prototype', tech: ['Speech', 'LLM'], description: 'Hands-free assistant for field workers, in Hindi and Telugu.', communityIds: ['openai', 'sarvam-ai'] },
  { id: 'doc-extraction', name: 'Document Extraction Pipeline', builderId: 'm2', stage: 'Live', tech: ['Structured outputs', 'Vision'], description: 'Invoices and forms into validated JSON, with retry rules.', communityIds: ['openai', 'gemini'] },
  { id: 'clinic-notes', name: 'Clinic Notes Copilot', builderId: 'm3', stage: 'Beta', tech: ['Speech', 'LLM', 'Evals'], description: 'Drafts the medical record while the doctor talks.', communityIds: ['openai', 'anthropic'] },
  { id: 'agent-eval-bench', name: 'Agent Eval Bench', builderId: 'm9', stage: 'MVP', tech: ['Evals', 'Agents'], description: 'Replayable test suites for multi-step agent runs.', communityIds: ['anthropic', 'deepseek'] },
  { id: 'invoice-vision', name: 'Invoice Vision', builderId: 'm4', stage: 'Prototype', tech: ['Multimodal', 'OCR'], description: 'Reads scanned invoices, including handwritten totals.', communityIds: ['gemini'] },
  { id: 'lecture-notes', name: 'Lecture Video Notes', builderId: 'm15', stage: 'Prototype', tech: ['Video', 'Summarisation'], description: 'Turns a two-hour lecture into chaptered notes.', communityIds: ['gemini'] },
  { id: 'small-classifier', name: 'Small-Model Classifier', builderId: 'm13', stage: 'MVP', tech: ['Open models', 'Fine-tuning'], description: 'A 1B model routing support tickets on a laptop CPU.', communityIds: ['hugging-face'] },
  { id: 'transliteration', name: 'Indic Transliteration Kit', builderId: 'm7', stage: 'Research', tech: ['Indic NLP', 'Datasets'], description: 'Consistent romanised ↔ native script for 8 languages.', communityIds: ['sarvam-ai', 'hugging-face'] },
  { id: 'reasoning-tutor', name: 'Reasoning Tutor', builderId: 'm15', stage: 'Idea', tech: ['Reasoning models'], description: 'Shows students where their working went wrong, step by step.', communityIds: ['deepseek'] },
  { id: 'feature-store', name: 'Lakehouse Feature Store', builderId: 'm8', stage: 'Live', tech: ['Delta Lake', 'MLflow'], description: 'One feature table for experiments and production.', communityIds: ['databricks'] },
  { id: 'demand-forecast', name: 'Kirana Demand Forecast', builderId: 'm6', stage: 'Beta', tech: ['Time series', 'Spark'], description: 'Tomorrow’s order, before the wholesaler calls.', communityIds: ['databricks'] },
  { id: 'supply-graph', name: 'Supply Chain Knowledge Graph', builderId: 'm11', stage: 'Research', tech: ['Neo4j', 'Graph ML'], description: 'Finds supplier risk three tiers deep.', communityIds: ['neo4j'] },
  { id: 'graph-fraud', name: 'Graph Fraud Signals', builderId: 'm8', stage: 'MVP', tech: ['Neo4j', 'Spark'], description: 'Flags rings of accounts that look fine one at a time.', communityIds: ['neo4j', 'databricks'] },
  { id: 'edge-crop-vision', name: 'Edge Crop Vision', builderId: 'm12', stage: 'Beta', tech: ['Jetson', 'TensorRT'], description: 'Leaf disease detection with no signal in the field.', communityIds: ['nvidia', 'hugging-face'] },
  { id: 'gpu-cost', name: 'GPU Cost Dashboard', builderId: 'm6', stage: 'Prototype', tech: ['CUDA metrics', 'Spark'], description: 'Which experiments are burning your GPU budget, and why.', communityIds: ['nvidia', 'databricks'] },
]

export const findProject = (id) => communityProjects.find((p) => p.id === id)
