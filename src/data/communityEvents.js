// DEMO SEED — community events. Dates are relative to "now" so the demo never
// shows stale events. Shape (CommunityEvent): id, communityId, title,
// description, date, location, url, kind, hostId, participantsCount
const inDays = (d, hour = 18, min = 30) => {
  const t = new Date()
  t.setDate(t.getDate() + d)
  t.setHours(hour, min, 0, 0)
  return t.toISOString()
}
const HQ = 'Data Science Co-Working, Bengaluru · Floor 3'

export const communityEvents = [
  { id: 'e-oa-1', communityId: 'openai', kind: 'Talk', title: 'Agents in production: show & tell', description: 'Three teams walk through an agent that’s live — traces, failures and all.', date: inDays(4), location: HQ, url: null, hostId: 'm14', participantsCount: 64 },
  { id: 'e-oa-2', communityId: 'openai', kind: 'Workshop', title: 'Structured outputs clinic', description: 'Bring a messy extraction task; leave with a schema and a retry policy.', date: inDays(11, 11, 0), location: 'Online', url: null, hostId: 'm2', participantsCount: 38 },
  { id: 'e-an-1', communityId: 'anthropic', kind: 'Discussion', title: 'Office hours: evaluating agents', description: 'Open Q&A on agent evals, grading rubrics and replaying runs.', date: inDays(3, 17, 0), location: 'Online', url: null, hostId: 'm14', participantsCount: 41 },
  { id: 'e-an-2', communityId: 'anthropic', kind: 'Meetup', title: 'MCP build night', description: 'Wire an MCP server to one internal tool in an evening.', date: inDays(9), location: HQ, url: null, hostId: 'm16', participantsCount: 52 },
  { id: 'e-ge-1', communityId: 'gemini', kind: 'Demo day', title: 'Multimodal demo day', description: 'Five-minute demos: images, audio and video in, something useful out.', date: inDays(6), location: HQ, url: null, hostId: 'm4', participantsCount: 77 },
  { id: 'e-hf-1', communityId: 'hugging-face', kind: 'Workshop', title: 'Fine-tuning small models', description: 'LoRA on a single GPU, from dataset to evaluation.', date: inDays(5, 10, 30), location: HQ, url: null, hostId: 'm13', participantsCount: 45 },
  { id: 'e-hf-2', communityId: 'hugging-face', kind: 'Discussion', title: 'Open models reading group', description: 'This week: model cards, and what they leave out.', date: inDays(12), location: 'Online', url: null, hostId: 'm9', participantsCount: 23 },
  { id: 'e-sa-1', communityId: 'sarvam-ai', kind: 'Meetup', title: 'Indic AI meetup', description: 'Speech, translation and the datasets we still don’t have.', date: inDays(8), location: HQ, url: null, hostId: 'm7', participantsCount: 58 },
  { id: 'e-de-1', communityId: 'deepseek', kind: 'Discussion', title: 'Reasoning models paper club', description: 'We read one paper and try one idea from it.', date: inDays(7, 19, 0), location: 'Online', url: null, hostId: 'm9', participantsCount: 31 },
  { id: 'e-db-1', communityId: 'databricks', kind: 'Talk', title: 'One lakehouse for experiments and production', description: 'How one team stopped maintaining two copies of every feature.', date: inDays(10), location: HQ, url: null, hostId: 'm8', participantsCount: 49 },
  { id: 'e-ne-1', communityId: 'neo4j', kind: 'Workshop', title: 'GraphRAG hack evening', description: 'Build entity + document graphs and compare retrieval strategies.', date: inDays(5), location: HQ, url: null, hostId: 'm11', participantsCount: 36 },
  { id: 'e-nv-1', communityId: 'nvidia', kind: 'Workshop', title: 'Jetson edge AI workshop', description: 'Quantise a vision model and hit a latency budget on-device.', date: inDays(13, 10, 0), location: HQ, url: null, hostId: 'm12', participantsCount: 29 },
]

export const findEvent = (id) => communityEvents.find((e) => e.id === id)
