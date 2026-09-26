// DEMO SEED — development posts and comments by fictional members.
// Not real posts from real users. Shape (Post): id, communityId, authorId, type,
// content, tags, images, link, projectId, eventId, poll, code, pinned,
// createdAt, updatedAt, likes (seed count), plus UI hints.
//
// type: text | question | image | link | project | poll | event | announcement
// images: [{ figure, alt }] — `figure` is a generated technology diagram
// (see components/community/DemoFigure) until real uploads exist.

const ago = (hours) => new Date(Date.now() - hours * 3600e3).toISOString()

export const communityPosts = [
  // ── OpenAI ────────────────────────────────────────────────────────────
  {
    id: 'p-oa-1', communityId: 'openai', authorId: 'm14', type: 'announcement', pinned: true, createdAt: ago(70), likes: 58,
    content: 'Welcome to OpenAI Builders 👋\n\nShare what you’re building, ask the questions you’re stuck on, and post results — including the ones that didn’t work. Office hours are every Thursday; the next show & tell is on the Events tab.',
    tags: ['Welcome'],
  },
  {
    id: 'p-oa-2', communityId: 'openai', authorId: 'm2', type: 'text', createdAt: ago(2), likes: 42,
    content: 'I’ve been testing structured outputs for an internal data extraction workflow. The biggest improvement wasn’t the model change — it was tightening the schema and making failure cases explicit.\n\nCurious how others are handling retries and validation in production.',
    tags: ['OpenAI', 'LLM', 'StructuredOutput'],
  },
  {
    id: 'p-oa-3', communityId: 'openai', authorId: 'm10', type: 'question', createdAt: ago(5), likes: 17,
    content: 'Has anyone built a reliable agent workflow where tool calls can be inspected and replayed without re-running the entire conversation?',
    tags: ['Agents', 'Debugging'],
  },
  {
    id: 'p-oa-4', communityId: 'openai', authorId: 'm4', type: 'image', createdAt: ago(9), likes: 33,
    content: 'Here’s the architecture diagram we are currently testing. The validator sits between the model and the queue, so bad JSON never reaches downstream services.',
    images: [{ figure: { kind: 'architecture', nodes: ['Upload', 'Model', 'Validator', 'Queue', 'Review UI'], loopBack: [2, 1], loopLabel: 'retry' }, alt: 'Architecture diagram: Upload → Model → Validator → Queue → Review UI, with a retry loop from Validator back to Model.' }],
    tags: ['Architecture', 'Extraction'],
  },
  {
    id: 'p-oa-5', communityId: 'openai', authorId: 'm3', type: 'project', createdAt: ago(26), likes: 61,
    content: 'We just moved our first prototype into an internal beta. Four clinics, one week in. The biggest surprise: doctors edit the summary less when it’s shorter.',
    projectId: 'clinic-notes',
    tags: ['ProjectUpdate', 'HealthAI'],
  },

  // ── Anthropic ─────────────────────────────────────────────────────────
  {
    id: 'p-an-1', communityId: 'anthropic', authorId: 'm9', type: 'text', createdAt: ago(3), likes: 36,
    content: 'I’ve been comparing long-context workflows with a smaller retrieval pipeline. The interesting part isn’t just context size — it’s deciding what should actually enter the context.',
    tags: ['Claude', 'RAG', 'Agents'],
  },
  {
    id: 'p-an-2', communityId: 'anthropic', authorId: 'm2', type: 'poll', createdAt: ago(7), likes: 12,
    content: 'Which approach are you using for RAG evaluation?',
    poll: { options: [{ id: 'a', label: 'Vector-only', votes: 14 }, { id: 'b', label: 'Hybrid retrieval', votes: 31 }, { id: 'c', label: 'GraphRAG', votes: 9 }, { id: 'd', label: 'Custom retrieval pipeline', votes: 17 }] },
    tags: ['RAG', 'Evals'],
  },
  {
    id: 'p-an-3', communityId: 'anthropic', authorId: 'm16', type: 'link', createdAt: ago(20), likes: 24,
    content: 'If you’re connecting agents to internal tools, the MCP intro is the fastest way to get the mental model right. We rebuilt two integrations after reading it.',
    link: { url: 'https://modelcontextprotocol.io/introduction', title: 'Model Context Protocol — Introduction', description: 'An open protocol that standardises how applications provide context to LLMs.', domain: 'modelcontextprotocol.io' },
    tags: ['MCP', 'Tooling'],
  },
  {
    id: 'p-an-4', communityId: 'anthropic', authorId: 'm14', type: 'event', createdAt: ago(30), likes: 19,
    content: 'Office hours this week are all about agent evals. Bring a trace that confused you.',
    eventId: 'e-an-1',
    tags: ['Event'],
  },

  // ── Gemini ────────────────────────────────────────────────────────────
  {
    id: 'p-ge-1', communityId: 'gemini', authorId: 'm4', type: 'image', createdAt: ago(4), likes: 28,
    content: 'Tried multimodal extraction on scanned invoices. Field accuracy by document quality below — handwritten totals are still the weak spot.',
    images: [{ figure: { kind: 'bars', title: 'Field accuracy by scan quality', unit: '%', data: [['Clean PDF', 97], ['Phone photo', 91], ['Faded scan', 84], ['Handwritten', 68]] }, alt: 'Bar chart of field accuracy: clean PDF 97%, phone photo 91%, faded scan 84%, handwritten 68%.' }],
    tags: ['Multimodal', 'OCR'],
  },
  {
    id: 'p-ge-2', communityId: 'gemini', authorId: 'm15', type: 'question', createdAt: ago(8), likes: 9,
    content: 'What’s the best way to handle lecture videos longer than an hour? Chunk by time, or by slide changes?',
    tags: ['Video', 'Question'],
  },
  {
    id: 'p-ge-3', communityId: 'gemini', authorId: 'm10', type: 'text', createdAt: ago(31), likes: 21,
    content: 'Grounding answers with search cut our made-up citations noticeably in a small internal test. Not zero — noticeably.',
    tags: ['Grounding'],
  },

  // ── Hugging Face ──────────────────────────────────────────────────────
  {
    id: 'p-hf-1', communityId: 'hugging-face', authorId: 'm13', type: 'text', createdAt: ago(1.5), likes: 47,
    content: 'Just tested a small open model locally for a document classification experiment.\n\nThe performance is surprisingly close to a hosted model for this particular workload.',
    tags: ['OpenSource', 'Models', 'Inference'],
  },
  {
    id: 'p-hf-2', communityId: 'hugging-face', authorId: 'm5', type: 'text', createdAt: ago(6), likes: 30,
    content: 'The smallest eval harness that still catches regressions. Pin the dataset revision — it matters more than people think.',
    code: { lang: 'python', source: 'from datasets import load_dataset\nfrom transformers import pipeline\n\nds = load_dataset("ag_news", split="test[:500]", revision="main")\nclf = pipeline("text-classification", model="./my-small-model")\n\npreds = clf(ds["text"], batch_size=32, truncation=True)\nacc = sum(p["label"] == str(y) for p, y in zip(preds, ds["label"])) / len(ds)\nprint(f"accuracy: {acc:.3f}")' },
    tags: ['Evals', 'Transformers'],
  },
  {
    id: 'p-hf-3', communityId: 'hugging-face', authorId: 'm13', type: 'poll', createdAt: ago(14), likes: 15,
    content: 'Where do you actually run small open models?',
    poll: { options: [{ id: 'a', label: 'Laptop', votes: 22 }, { id: 'b', label: 'Single GPU server', votes: 35 }, { id: 'c', label: 'Managed endpoint', votes: 18 }, { id: 'd', label: 'Edge device', votes: 6 }] },
    tags: ['Inference'],
  },
  {
    id: 'p-hf-4', communityId: 'hugging-face', authorId: 'm9', type: 'link', createdAt: ago(40), likes: 11,
    content: 'Reminder for newcomers: the Transformers docs have a good section on picking the right pipeline before you reach for fine-tuning.',
    link: { url: 'https://huggingface.co/docs/transformers', title: 'Transformers documentation', description: 'State-of-the-art models for text, vision and audio, with pipelines for inference and training.', domain: 'huggingface.co' },
    tags: ['Docs'],
  },

  // ── Sarvam AI ─────────────────────────────────────────────────────────
  {
    id: 'p-sa-1', communityId: 'sarvam-ai', authorId: 'm7', type: 'text', createdAt: ago(3.5), likes: 26,
    content: 'Exploring Indic-language AI applications and looking at where multilingual workflows still struggle with consistency and context.',
    tags: ['SarvamAI', 'IndicAI', 'Multilingual'],
  },
  {
    id: 'p-sa-2', communityId: 'sarvam-ai', authorId: 'm15', type: 'question', createdAt: ago(11), likes: 8,
    content: 'Is anyone benchmarking transliteration quality for mixed Hindi–English (Hinglish) chat? Looking for a test set that isn’t just news text.',
    tags: ['Transliteration', 'Datasets'],
  },
  {
    id: 'p-sa-3', communityId: 'sarvam-ai', authorId: 'm7', type: 'event', createdAt: ago(28), likes: 20,
    content: 'The Indic AI meetup is back. Short talks, then we build test sets together.',
    eventId: 'e-sa-1',
    tags: ['Event', 'Bengaluru'],
  },

  // ── DeepSeek ──────────────────────────────────────────────────────────
  {
    id: 'p-de-1', communityId: 'deepseek', authorId: 'm9', type: 'text', createdAt: ago(2.5), likes: 22,
    content: 'Reading reasoning traces is teaching me more about my eval set than about the model. Half the “failures” were ambiguous questions.',
    tags: ['Reasoning', 'Evals'],
  },
  {
    id: 'p-de-2', communityId: 'deepseek', authorId: 'm5', type: 'image', createdAt: ago(13), likes: 34,
    content: 'Accuracy vs. thinking budget on our internal maths set. Gains flatten sooner than I expected.',
    images: [{ figure: { kind: 'line', title: 'Accuracy vs. reasoning tokens', unit: '%', data: [['256', 52], ['512', 63], ['1K', 71], ['2K', 76], ['4K', 78], ['8K', 79]] }, alt: 'Line chart: accuracy rises from 52% at 256 reasoning tokens to 76% at 2K, then flattens at 79% by 8K.' }],
    tags: ['Reasoning', 'Benchmarks'],
  },
  {
    id: 'p-de-3', communityId: 'deepseek', authorId: 'm15', type: 'question', createdAt: ago(22), likes: 7,
    content: 'For a student project: is distilling a reasoning model into a smaller one realistic on a single consumer GPU?',
    tags: ['Distillation', 'Question'],
  },

  // ── Databricks ────────────────────────────────────────────────────────
  {
    id: 'p-db-1', communityId: 'databricks', authorId: 'm8', type: 'text', createdAt: ago(4.5), likes: 29,
    content: 'I’m working on a pipeline where the same dataset needs to serve both experimentation and production workloads.\n\nCurious how others are structuring their feature and data workflows.',
    tags: ['Databricks', 'DataEngineering', 'ML'],
  },
  {
    id: 'p-db-2', communityId: 'databricks', authorId: 'm6', type: 'image', createdAt: ago(12), likes: 25,
    content: 'Our medallion layout after the refactor. The gold layer is the only thing the models ever read.',
    images: [{ figure: { kind: 'architecture', nodes: ['Sources', 'Bronze', 'Silver', 'Gold', 'Models'] }, alt: 'Pipeline diagram: Sources → Bronze → Silver → Gold → Models.' }],
    tags: ['Lakehouse', 'Pipelines'],
  },
  {
    id: 'p-db-3', communityId: 'databricks', authorId: 'm8', type: 'project', createdAt: ago(35), likes: 38,
    content: 'The feature store is live for three teams. One table, two consumers, zero copy-paste features.',
    projectId: 'feature-store',
    tags: ['ProjectUpdate'],
  },

  // ── Neo4j ─────────────────────────────────────────────────────────────
  {
    id: 'p-ne-1', communityId: 'neo4j', authorId: 'm11', type: 'announcement', pinned: true, createdAt: ago(60), likes: 31,
    content: 'This month’s challenge: build a GraphRAG prototype over any public dataset and post your retrieval comparison here. Best write-up presents at the hack evening.',
    tags: ['Challenge'],
  },
  {
    id: 'p-ne-2', communityId: 'neo4j', authorId: 'm1', type: 'image', createdAt: ago(2), likes: 42,
    content: 'I’ve been experimenting with RAG over graph data using Neo4j and I’m getting interesting results when the retrieval strategy combines vector similarity with graph traversal.\n\nHas anyone tried a similar approach?',
    images: [{ figure: { kind: 'graph' }, alt: 'Graph visualisation: a query node connects to retrieved document nodes, which link to entity nodes two hops away.' }],
    tags: ['RAG', 'Neo4j', 'GraphRAG'],
  },
  {
    id: 'p-ne-3', communityId: 'neo4j', authorId: 'm11', type: 'text', createdAt: ago(10), likes: 27,
    content: 'GraphRAG becomes much more interesting when the graph stores relationships that a vector database alone would struggle to represent.\n\nWorking on a prototype connecting entities, documents and events.',
    tags: ['Neo4j', 'GraphRAG', 'KnowledgeGraph'],
  },
  {
    id: 'p-ne-4', communityId: 'neo4j', authorId: 'm8', type: 'text', createdAt: ago(27), likes: 16,
    content: 'The two-hop expansion that made the biggest difference for us:',
    code: { lang: 'cypher', source: 'MATCH (d:Document)-[:MENTIONS]->(e:Entity)\nWHERE d.id IN $retrievedIds\nMATCH (e)-[:RELATED_TO*1..2]-(n:Entity)<-[:MENTIONS]-(other:Document)\nRETURN other, count(DISTINCT e) AS sharedEntities\nORDER BY sharedEntities DESC\nLIMIT 10' },
    tags: ['Cypher'],
  },

  // ── NVIDIA ────────────────────────────────────────────────────────────
  {
    id: 'p-nv-1', communityId: 'nvidia', authorId: 'm12', type: 'image', createdAt: ago(5), likes: 31,
    content: 'Latency on a Jetson after each optimisation step. INT8 was the big one; the rest was death by a thousand cuts.',
    images: [{ figure: { kind: 'bars', title: 'Inference latency per frame', unit: 'ms', data: [['FP32', 118], ['FP16', 64], ['INT8', 31], ['+ batching', 24]] }, alt: 'Bar chart of latency per frame: FP32 118 ms, FP16 64 ms, INT8 31 ms, INT8 with batching 24 ms.' }],
    tags: ['Jetson', 'TensorRT', 'EdgeAI'],
  },
  {
    id: 'p-nv-2', communityId: 'nvidia', authorId: 'm6', type: 'question', createdAt: ago(16), likes: 13,
    content: 'For serving a 7B model on a single GPU, what’s been easier to operate day to day — TensorRT-LLM or vLLM?',
    tags: ['Inference', 'Question'],
  },
  {
    id: 'p-nv-3', communityId: 'nvidia', authorId: 'm12', type: 'event', createdAt: ago(33), likes: 18,
    content: 'Hands-on Jetson workshop. We’ll quantise a vision model and try to hit 30 fps.',
    eventId: 'e-nv-1',
    tags: ['Event', 'Workshop'],
  },
]

// Comment model: id, postId, authorId, parentCommentId, content, createdAt
export const communityComments = [
  { id: 'c1', postId: 'p-ne-2', authorId: 'm2', parentCommentId: null, content: 'Interesting. Did you compare hybrid retrieval?', createdAt: ago(1.8) },
  { id: 'c2', postId: 'p-ne-2', authorId: 'm1', parentCommentId: 'c1', content: 'Yes — hybrid improved recall, especially on multi-hop questions where the answer sits two entities away from the best-matching chunk.', createdAt: ago(1.6) },
  { id: 'c3', postId: 'p-ne-2', authorId: 'm11', parentCommentId: 'c1', content: 'Same here. Did you cap the traversal depth? We saw noise creep in past two hops.', createdAt: ago(1.4) },
  { id: 'c4', postId: 'p-ne-2', authorId: 'm1', parentCommentId: 'c1', content: 'Capped at two, and weighted paths by edge type.', createdAt: ago(1.3) },
  { id: 'c5', postId: 'p-ne-2', authorId: 'm8', parentCommentId: 'c1', content: 'Would love to see the eval set if you can share it.', createdAt: ago(1.1) },
  { id: 'c6', postId: 'p-ne-2', authorId: 'm2', parentCommentId: 'c1', content: 'Seconding that — even a sample would help.', createdAt: ago(1) },
  { id: 'c7', postId: 'p-ne-2', authorId: 'm8', parentCommentId: null, content: 'What are you using for entity extraction?', createdAt: ago(0.8) },

  { id: 'c10', postId: 'p-oa-2', authorId: 'm10', parentCommentId: null, content: 'We retry once with the validation error appended to the prompt, then route to a human queue. Second attempts fix most of it.', createdAt: ago(1.7) },
  { id: 'c11', postId: 'p-oa-2', authorId: 'm2', parentCommentId: 'c10', content: 'That’s close to what we landed on. Do you log the first failure for evals?', createdAt: ago(1.5) },
  { id: 'c12', postId: 'p-oa-2', authorId: 'm3', parentCommentId: null, content: 'Making “unknown” an explicit enum value helped us more than any retry logic.', createdAt: ago(1.2) },

  { id: 'c20', postId: 'p-an-1', authorId: 'm16', parentCommentId: null, content: 'Agree. We now rank candidate context with a cheap model before the expensive call.', createdAt: ago(2.4) },
  { id: 'c21', postId: 'p-an-1', authorId: 'm2', parentCommentId: null, content: 'Have you measured cost per correct answer rather than per call?', createdAt: ago(2) },

  { id: 'c30', postId: 'p-hf-1', authorId: 'm5', parentCommentId: null, content: 'Which model size, and did you quantise?', createdAt: ago(1.2) },
  { id: 'c31', postId: 'p-hf-1', authorId: 'm13', parentCommentId: 'c30', content: '1B, 4-bit. CPU only, about 40 docs a second.', createdAt: ago(1) },

  { id: 'c40', postId: 'p-db-1', authorId: 'm6', parentCommentId: null, content: 'We version feature tables and pin model training to a table version. Production reads latest.', createdAt: ago(3.9) },
  { id: 'c41', postId: 'p-oa-3', authorId: 'm16', parentCommentId: null, content: 'Store every tool call + result as an event; replay by feeding the log back instead of calling the tools.', createdAt: ago(4.2) },
]
