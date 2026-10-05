// "Grab your seat" booking form — all text, options and prices live here.
// The form UI is src/components/booking/BookingDialog.jsx.

export const bookingCopy = {
  eyebrow: 'Work mode activated',
  title: ['Grab your', 'power seat'], // second line is highlighted
  intro: "You're one step away from a focused, high-performance data workspace built for AI builders, Data Engineers & serious creators.",
  features: [
    { icon: 'laptop', title: 'Focused Work Environment', text: 'Distraction-free zone designed for deep work & real building.', accent: 'mint' },
    { icon: 'people', title: 'Builder Community Access', text: 'Sit alongside Data Scientists, AI founders & engineers.', accent: 'iris' },
    { icon: 'wifi', title: 'High-Speed Internet + AC + Coffee', text: 'Everything you need to stay in execution mode.', accent: 'sun' },
  ],
  tip: 'Pro Tip: Book longer slots to enter deep-work state. Real progress needs uninterrupted time.',
  formTitle: 'Book your seat',
  formSubtitle: "Fill in your details. We'll confirm on WhatsApp.",
  submit: 'Confirm my seat',
  footnote: "You'll receive confirmation on WhatsApp within 5 minutes",
  successTitle: 'Seat requested',
  successBody: "We'll confirm on WhatsApp within 5 minutes.",
}

export const learnOptions = ['Data Science & ML', 'Generative AI & LLMs', 'Data Engineering', 'Data Analytics', 'MLOps & Deployment', 'Just here to build']

// Durations. Only the 8-hour price was provided — set `price` for the others
// (number, in ₹) when known; until then they show "Price on confirmation".
export const durations = [
  { id: '2h', hours: 2, label: '2 Hours', note: 'Quick sprint', price: null },
  { id: '4h', hours: 4, label: '4 Hours', note: 'Half day', price: null },
  { id: '8h', hours: 8, label: '8 Hours', note: 'Full Day Power Mode', price: 3000, best: true },
]

// Opening hours (24h clock). Start times are offered hourly so the chosen
// duration always ends by closing time.
export const hours = { open: 9, close: 21 }

// Business WhatsApp number (digits only, with country code, e.g. '919999999999').
// When set, a confirmed request also opens WhatsApp with the details pre-filled.
// Leave empty until the real number is known.
export const bookingWhatsApp = ''
