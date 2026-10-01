// ─────────────────────────────────────────────────────────────────────────────
//  CENTRAL SITE CONFIGURATION — Mediation Office of S. Collinson
//
//  Every fact the website publishes about the practice lives here.
//  Anything set to `null` is a placeholder: the production build hides it
//  (it is never shown as if it were real), and the draft build
//  (`npm run build:draft`) shows it as a clearly marked "[Needed: …]" tag.
//
//  See CONTENT-NEEDED.md for the full list of items to supply before launch.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  // Production domain. Taken from the WordPress site currently live for this
  // practice (siteurl = https://seancollinson.com). Confirm before launch.
  url: 'https://seancollinson.com',

  // Set to true only after the domain and the www / non-www choice are
  // confirmed. Turns on the HTTPS + canonical-host redirects in .htaccess.
  domainConfirmed: false,
  preferWww: false,

  name: 'Mediation Office of S. Collinson',
  shortName: 'S. Collinson Mediation',
  person: 'Sean Collinson',
  jobTitle: 'Family and Civil Mediator',
  locale: 'en_US',
  language: 'en',
  positioning:
    'Private, practical mediation for divorce, family, civil, and business disputes. California-focused, with virtual sessions available nationwide.',
  serviceArea:
    'Serving Los Angeles and communities throughout California, with virtual mediation by Zoom available nationwide.',
  areaServed: ['Los Angeles, CA', 'California', 'United States (virtual sessions)'],
};

// Contact details. Leave as null until verified. Phone and email links, the
// mobile call bar, and contact schema appear only once these are supplied.
export const contact = {
  phone: null, // e.g. '+13105550100'  (E.164 format, used for tel: links and schema)
  phoneDisplay: null, // e.g. '(310) 555-0100'
  email: null, // e.g. 'office@seancollinson.com'
  officeHours: null, // e.g. 'Monday to Friday, 9 a.m. to 5 p.m. Pacific'
  responseTime: null, // e.g. 'The office usually replies within one business day.'
  // Only fill in if clients are received at a verified public office.
  // When null, no street address, map, or LocalBusiness address schema is published.
  address: null, // { street: '', city: '', region: 'CA', postalCode: '', country: 'US' }
  mapEmbedUrl: null,
};

// Social profiles. Only list real, active profiles owned by the practice.
export const social = [
  // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/…' },
  // { label: 'YouTube', url: 'https://www.youtube.com/@…' },
];

// Online forms. The bundled PHP handler (forms/submit.php) runs on Bluehost.
// Keep `enabled: false` until forms/config.php has a verified recipient
// address and a test submission has been received. While disabled, forms are
// shown with an explanation and a disabled submit button; they never pretend
// to send.
export const forms = {
  enabled: false,
  endpoint: '/forms/submit.php',
};

// Online scheduler (Calendly, Acuity, etc.). Paste the public scheduling URL
// once an account exists. When null, the scheduler area is hidden in production.
export const scheduler = {
  provider: null, // e.g. 'Calendly'
  url: null, // e.g. 'https://calendly.com/…/consultation'
};

// Analytics and Search Console. Never invent IDs.
export const analytics = {
  ga4MeasurementId: null, // e.g. 'G-XXXXXXXXXX'
  googleSiteVerification: null, // content value of the google-site-verification meta tag
};

// Photography. Drop approved files into src/assets/img/ using these exact
// filenames and they are picked up automatically on the next build.
// Candidate originals already exist in the WordPress media library
// (Sean.pic44-1.png, sean.picdesk-2.png); confirm they are approved first.
export const images = {
  // Home page hero, supplied 2026-10-01. Sean seated at a conference table, right of frame.
  hero: {
    file: 'sean-collinson-hero.jpg',
    width: 1672,
    height: 941,
    alt: 'Sean Collinson in a navy suit, seated at a marble conference table with his hands clasped',
    note: 'Wide 16:9 photo with Sean on the right and open space on the left, 2560 × 1440 px ideal',
  },
  portrait: {
    file: 'sean-collinson-portrait.jpg',
    width: 1200,
    height: 1500,
    alt: 'Sean Collinson, mediator', // update to describe the actual photograph
    note: 'Vertical 4:5 portrait of Sean, natural light, 1200 × 1500 px minimum',
  },
  office: {
    file: 'sean-collinson-at-desk.jpg',
    width: 1600,
    height: 900,
    alt: 'Sean Collinson at his desk', // update to describe the actual photograph
    note: 'Horizontal 16:9 environmental photo of Sean at work, 1600 × 900 px minimum',
  },
  social: {
    file: 'social-share.jpg',
    width: 1200,
    height: 630,
  },
};

// Claims that must stay off the site until Sean holds documentation.
// If `enabled` becomes true, fill in every field of the note; the site
// then shows the figure with its explanatory note.
export const claims = {
  settlementRate: {
    enabled: false,
    value: '96%',
    label: 'of mediated matters reached full or partial settlement',
    note: null, // e.g. 'Based on N matters mediated between 2003 and 2025; "success" means…'
  },
  caseCount: { enabled: false, value: null, label: 'matters mediated', note: null },
  settlementValue: { enabled: false, value: null, label: 'in settlements', note: null },
};

// Verified, written-permission client reviews only. Each needs the client's
// consent to publish. Leave empty until real reviews are supplied.
export const testimonials = [
  // { quote: '…', name: 'First name and last initial', context: 'Divorce mediation client', permissionOnFile: true },
];

// Real published videos only. The page generates VideoObject structured data
// for an entry only when every field below is filled in.
export const videoCategories = [
  { id: 'family', label: 'Divorce and family mediation' },
  { id: 'conflict', label: 'Conflict resolution' },
  { id: 'negotiation', label: 'Negotiation skills' },
  { id: 'deescalation', label: 'De-escalation' },
  { id: 'workplace', label: 'Business and workplace conflict' },
  { id: 'media', label: 'Media appearances' },
];

export const videos = [
  // {
  //   title: 'What happens in a first mediation session',
  //   category: 'family',               // one of the ids above
  //   platform: 'youtube',              // 'youtube' or 'vimeo'
  //   id: 'VIDEO_ID',                   // the platform's video id
  //   thumbnail: 'https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg',
  //   duration: 'PT6M30S',              // ISO 8601
  //   durationLabel: '6:30',
  //   uploadDate: '2025-01-15',         // ISO date of publication
  //   summary: 'One or two sentences on what the viewer will learn.',
  //   transcript: 'Full transcript or a detailed text summary.',
  //   featured: false,
  // },
];

// Masterclass details. Keep null until confirmed by Sean.
export const masterclass = {
  // The CALM framework: supply the approved acronym definitions.
  calm: null, // [{ letter: 'C', word: '…', text: '…' }, …]
  formats: {
    keynote: { availability: null, price: null },
    workshop: { availability: null, price: null },
    team: { availability: null, price: null },
    digital: { availability: null, price: null, enrollUrl: null },
  },
  certificates: false, // set true only if completion certificates are actually issued
};

// Legal pages. Set `reviewed: true` for each page after professional review;
// until then it is marked as a draft and excluded from search (noindex).
export const legal = {
  privacy: { reviewed: false },
  terms: { reviewed: false },
  accessibility: { reviewed: false },
  disclaimer: { reviewed: false },
};
