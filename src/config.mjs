// ─────────────────────────────────────────────────────────────────────────────
//  CENTRAL SITE CONFIGURATION — The Mediation Office of Sean Collinson
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
  domainConfirmed: true,
  preferWww: false,

  // Matches the verified Google Business Profile listing (Sean, 2026-11-17).
  name: 'The Mediation Office of Sean Collinson',
  shortName: 'Sean Collinson Mediation',
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
  officeHours: 'Monday to Friday 9.30am to 7.30pm. Saturday 2pm to 5pm. Sunday closed, by appointment only.',
  // Same hours for LocalBusiness schema (Sunday closed, so not listed).
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '19:30' },
    { days: ['Saturday'], opens: '14:00', closes: '17:00' },
  ],
  responseTime: null, // e.g. 'The office usually replies within one business day.'
  // Only fill in if clients are received at a verified public office.
  // When null, no street address, map, or LocalBusiness address schema is published.
  address: null, // { street: '', city: '', region: 'CA', postalCode: '', country: 'US' }
  mapEmbedUrl: null,
};

// Office name, address, and phone shown in the footer of every page and in the
// home page consultation tile (added 2026-11-17). Kept separate from `contact`
// so the mobile call bar, contact page, and schema are unchanged.
export const office = {
  name: 'The Mediation Office of Sean Collinson',
  street: '15301 Ventura Blvd',
  city: 'Sherman Oaks',
  region: 'CA',
  postalCode: '91403',
  phone: '+18184027500',
  phoneDisplay: '(818) 402-7500',
};

// Google rating, as supplied by Sean on 2026-11-17 (Google Business Profile).
// Shown as text with a link to the source. Never add AggregateRating or
// Review schema for these: Google treats self-published review markup as
// ineligible, and tests/qa.mjs blocks it.
export const reviews = {
  rating: '4.9',
  count: 30,
  source: 'Google',
  // Google "write a review" link, used for the rating line (Sean, 2026-11-17).
  url: 'https://g.page/r/CbV0bc4rBNXnEAI/review',
  // Business profile page for reading reviews.
  profileUrl: 'https://maps.app.goo.gl/bf7M1erHgG23CqPS9',
};

// Southern California service area (Sean, 2026-11-17): homepage, footer, and
// schema areaServed. The office itself is only in Sherman Oaks (see `office`).
export const serviceRegion = {
  heading: 'Serving Southern California',
  line: 'In person across Southern California, and by Zoom nationwide. Office in Sherman Oaks.',
  counties: ['Los Angeles', 'Orange', 'Ventura', 'Riverside', 'San Bernardino', 'San Diego'],
  cities: ['Los Angeles', 'Huntington Beach', 'Irvine', 'Burbank', 'Sherman Oaks'],
};

// About page "Areas served": the same single list as serviceRegion (Sean, 2026-11-17).
export const areasServed = {
  line: serviceRegion.line,
  counties: serviceRegion.counties.map((c) => `${c} County`),
  cities: serviceRegion.cities,
};

// Social profiles. Only list real, active profiles owned by the practice.
export const social = [
  { label: 'YouTube', url: 'https://www.youtube.com/@SeanCollinson' },
  // Verified 2026-11-17: LinkedIn's preview shows "Sean Collinson - Mediation Offices S. Collinson".
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/seancollinson' },
  { label: 'Instagram', url: 'https://www.instagram.com/seancollinson_official/' },
];

// Online forms. The bundled PHP handler (forms/submit.php) runs on Bluehost.
// Keep `enabled: false` until forms/config.php has a verified recipient
// address and a test submission has been received. While disabled, forms are
// shown with an explanation and a disabled submit button; they never pretend
// to send.
export const forms = {
  enabled: true,
  endpoint: '/forms/submit.php',
};

// Booking link for the "Book a Consultation" buttons in the header, footer,
// and Contact page (Sean's TidyCal "Consultation in-office", 2026-11-17).
export const booking = {
  label: 'Book a Consultation',
  provider: 'TidyCal',
  url: 'https://tidycal.com/mediation/consul',
};

// Online scheduler (Calendly, Acuity, etc.). Paste the public scheduling URL
// once an account exists. When null, the scheduler area is hidden in production.
export const scheduler = {
  provider: null, // e.g. 'Calendly'
  url: null, // e.g. 'https://calendly.com/…/consultation'
};

// Analytics and Search Console. Never invent IDs.
export const analytics = {
  ga4MeasurementId: 'G-MJXLZN2W0J', // GA4 web stream for the Mediation website, added 2026-11-17
  googleSiteVerification: null, // content value of the google-site-verification meta tag
};

// Photography. Drop approved files into src/assets/img/ using these exact
// filenames and they are picked up automatically on the next build.
// Candidate originals already exist in the WordPress media library
// (Sean.pic44-1.png, sean.picdesk-2.png); confirm they are approved first.
export const images = {
  // Home page hero, replaced 2026-10-12. Sean standing in a navy-and-gold office with the Los Angeles skyline behind him, right of frame.
  hero: {
    file: 'sean-collinson-hero.jpg',
    width: 1672,
    height: 941,
    alt: 'Sean Collinson, smiling in a navy suit and silver tie, standing in a navy and gold office with the Los Angeles skyline behind him',
    note: 'Wide 16:9 photo with Sean on the right and open space on the left, 2560 × 1440 px ideal',
  },
  // Consultation page hero background, supplied 2026-10-12. Sean in a dark suit against a world-map backdrop.
  consultation: {
    file: 'sean-collinson-consultation.jpg',
    width: 1300,
    height: 703,
    alt: '', // decorative background; the page heading carries the meaning
    note: 'Wide 16:9 photo with Sean right of centre, 1300 × 703 px supplied',
  },
  // Masterclass hero, supplied 2026-10-12. Cropped to Sean only (the original shows a TV-station studio sign).
  masterclass: {
    file: 'sean-collinson-masterclass.jpg',
    width: 580,
    height: 1140,
    alt: '', // decorative background; the page heading carries the meaning
    note: 'Vertical photo of Sean in a dark suit, cropped from head to waist',
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
  {
    title: "Sean Collinson is America's Mediator",
    category: 'family',
    platform: 'youtube',
    id: '_641WEXYGwQ',
    thumbnail: 'https://i.ytimg.com/vi/_641WEXYGwQ/hqdefault.jpg',
    uploadDate: '2026-10-29',
    summary: 'If you are facing divorce, legal separation, child custody, support, property division, or another serious family or civil dispute, you do not have to navigate the process alone.',
    featured: true,
  },
  {
    title: 'What the Halle Berry Custody Fight Teaches Parents',
    category: 'family',
    platform: 'youtube',
    id: 'UKu97xQd9o0',
    thumbnail: 'https://i.ytimg.com/vi/UKu97xQd9o0/hqdefault.jpg',
    uploadDate: '2026-11-07',
    summary: 'The Mediator with Sean Collinson breaks down divorce, child custody, support, property disputes, restraining orders, high-conflict litigation, and real-world settlement strategy in plain English.',
  },
  {
    title: 'Jensen Huang’s Affair: Does Betrayal Have to End a Marriage?',
    category: 'family',
    platform: 'youtube',
    id: 'DUhTHwX09gw',
    thumbnail: 'https://i.ytimg.com/vi/DUhTHwX09gw/hqdefault.jpg',
    uploadDate: '2026-11-11',
    summary: 'Does an affair have to end a marriage? Sean Collinson looks beyond the headlines surrounding Jensen Huang to explore betrayal, forgiveness, reconciliation and the choices that come next.',
  },
  {
    title: '$20,000—or 20 Years of Hurt? | The Mediator #Shorts',
    category: 'conflict',
    platform: 'youtube',
    id: 'P8p3TjtqFZs',
    thumbnail: 'https://i.ytimg.com/vi/P8p3TjtqFZs/hqdefault.jpg',
    uploadDate: '2026-11-11',
    summary: 'Is the argument really about the money? A couple can fight over $20,000 when the deeper issue is 20 years of disappointment. Sean Collinson explains why understanding the hurt beneath a financial disagreement can change the conversation.',
  },
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
    keynote: { availability: 'Availability on request', price: 'Pricing on request' },
    workshop: { availability: 'Availability on request', price: 'Pricing on request' },
    team: { availability: 'Availability on request', price: 'Pricing on request' },
    digital: { availability: 'Availability on request', price: 'Pricing on request', enrollUrl: null },
  },
  certificates: false, // set true only if completion certificates are actually issued
};

// Legal pages. Set `reviewed: true` for each page after professional review;
// until then it is marked as a draft and excluded from search (noindex).
export const legal = {
  // Reviewed and approved by Sean on 2026-11-17.
  privacy: { reviewed: true },
  terms: { reviewed: true },
  accessibility: { reviewed: true },
  disclaimer: { reviewed: true },
};

// Free e-book (/think-like-a-hostage-negotiator/). The cover and PDF live in
// the WordPress media library; fill in their URLs after uploading. The PDF URL
// is also set in forms/config.php ['ebook']['pdf_url'], which the opt-in
// handler returns after a successful signup. While cover or pdf is null the
// page, the homepage strip and the internal links are not built.
export const ebook = {
  path: '/think-like-a-hostage-negotiator/',
  cover: null, // { src: '/wp-content/uploads/…', width: 0, height: 0 }
  pdf: null, // '/wp-content/uploads/….pdf'
};
