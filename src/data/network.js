// Builder network roles + placeholder people. Replace `people` with profiles from the API;
// `photo` is optional — cards fall back to an initials avatar.
export const networkRoles = [
  { id: 'experts', label: 'Experts', note: 'Twenty years in the problem, available on Thursdays.', accent: 'sun' },
  { id: 'founders', label: 'Founders', note: 'Have raised, shipped, failed and tried again.', accent: 'flare' },
  { id: 'engineers', label: 'Engineers', note: 'Turn a notebook into a service that stays up.', accent: 'volt' },
  { id: 'data-scientists', label: 'Data Scientists', note: 'Know when the model is lying to you.', accent: 'mint' },
  { id: 'researchers', label: 'Researchers', note: 'Read the paper so you can build on it.', accent: 'iris' },
  { id: 'product', label: 'Product Builders', note: 'Ask who it is for, before what it does.', accent: 'paper' },
]

export const people = [
  { id: 'p1', name: 'Ananya R.', role: 'ML Engineer', focus: 'Speech & Indic NLP', accent: 'mint', sample: true },
  { id: 'p2', name: 'Karan M.', role: 'Founder', focus: 'Health AI', accent: 'flare', sample: true },
  { id: 'p3', name: 'Dr. Meera S.', role: 'Research Mentor', focus: 'Computer vision', accent: 'iris', sample: true },
  { id: 'p4', name: 'Rahul V.', role: 'Data Scientist', focus: 'Forecasting', accent: 'sun', sample: true },
  { id: 'p5', name: 'Sara K.', role: 'Product Builder', focus: '0 → 1 products', accent: 'volt', sample: true },
]
