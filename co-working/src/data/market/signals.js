// EXAMPLE user signals — illustrative development content, not real users.
// Replace with consented feedback from the API; keep the shape.
export const signalKinds = {
  review: { label: 'Review', accent: 'sun' },
  usage: { label: 'Usage', accent: 'mint' },
  value: { label: 'Value', accent: 'flare' },
  request: { label: 'Request', accent: 'iris' },
  intent: { label: 'Intent', accent: 'volt' },
}

export const userSignals = [
  { id: 's1', kind: 'review', text: '★★★★★', meta: 'after week one' },
  { id: 's2', kind: 'usage', text: 'Used it twice this week.', meta: 'returning user' },
  { id: 's3', kind: 'value', text: 'Saved me 40 minutes.', meta: 'clinic pilot' },
  { id: 's4', kind: 'request', text: 'I wish it had…', meta: 'feature ask' },
  { id: 's5', kind: 'request', text: 'Can I connect this to…', meta: 'integration ask' },
  { id: 's6', kind: 'intent', text: 'Where can I buy it?', meta: 'purchase intent' },
  { id: 's7', kind: 'usage', text: 'Opened it before my first coffee.', meta: 'daily habit' },
  { id: 's8', kind: 'review', text: '“Finally, something that gets it.”', meta: 'beta tester' },
  { id: 's9', kind: 'intent', text: 'Can my team get access?', meta: 'expansion' },
  { id: 's10', kind: 'value', text: 'Replaced two spreadsheets.', meta: 'ops lead' },
]

// USER → ACTION → SIGNAL → INSIGHT
export const signalPipeline = [
  { id: 'user', label: 'User', note: 'Someone real, with a real problem.' },
  { id: 'action', label: 'Action', note: 'Opens, clicks, stays, leaves.' },
  { id: 'signal', label: 'Signal', note: 'The action, captured and counted.' },
  { id: 'insight', label: 'Insight', note: 'What the builder does differently next.' },
]
