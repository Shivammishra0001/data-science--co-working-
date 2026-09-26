// Brand + navigation config. The name is a working title — change it here only.
export const brand = {
  name: 'Chrysalis',
  descriptor: 'AI Builder Space',
  email: 'hello@chrysalis.build',
  location: 'Bengaluru, India',
}

// While true, any section rendering `sample: true` data shows a
// "Sample data" marker so placeholder numbers are never read as real.
export const SHOW_SAMPLE_NOTICE = true

export const navLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Market Push', href: '/market-push' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/#why' },
  { label: 'Contact', href: '#contact' },
]

export const primaryCta = { label: 'Join Community', href: '/#start' }
export const signIn = { label: 'Sign in' }

export const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Projects', href: '/#projects' },
      { label: 'Market Push', href: '/market-push' },
      { label: 'Community', href: '/community' },
      { label: 'Innovation', href: '/#story' },
      { label: 'Experts', href: '/#network' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#why' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'OpenAI', href: '/community/openai' },
      { label: 'Anthropic', href: '/community/anthropic' },
      { label: 'Gemini', href: '/community/gemini' },
      { label: 'Hugging Face', href: '/community/hugging-face' },
      { label: 'Neo4j', href: '/community/neo4j' },
      { label: 'Databricks', href: '/community/databricks' },
    ],
  },
]

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'X', href: 'https://x.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
]
