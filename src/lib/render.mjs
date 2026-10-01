// Shared rendering helpers: escaping, placeholders, images, header, footer,
// metadata, and structured data. Pages import these and return HTML strings.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site, contact, social, analytics, images, legal } from '../config.mjs';
import { icon } from './icons.mjs';

export const ctx = { mode: 'production', year: new Date().getFullYear(), srcDir: '' };
export const isDraft = () => ctx.mode === 'draft';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (path) => site.url.replace(/\/$/, '') + path;

// A visible "needed" tag in draft builds; nothing in production.
export const ph = (label) => (isDraft() ? `<span class="ph">Needed: ${esc(label)}</span>` : '');

// Block-level placeholder panel (draft only).
export const phBlock = (title, detail = '') =>
  isDraft()
    ? `<div class="ph-block" role="note"><p class="ph-block__title">Needed: ${esc(title)}</p>${
        detail ? `<p>${detail}</p>` : ''
      }</div>`
    : '';

export const hasPhone = () => Boolean(contact.phone && contact.phoneDisplay);
export const hasEmail = () => Boolean(contact.email);

export const phoneLink = (cls = '') =>
  hasPhone() ? `<a class="${cls}" href="tel:${esc(contact.phone)}">${esc(contact.phoneDisplay)}</a>` : '';
export const emailLink = (cls = '') =>
  hasEmail() ? `<a class="${cls}" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>` : '';

// ── Images ───────────────────────────────────────────────────────────────────
// Returns responsive <picture> markup if the optimised files exist (see
// tools/optimize-images.mjs), otherwise a designed placeholder panel.
export function photo(key, { eager = false, sizes = '100vw', className = '' } = {}) {
  const spec = images[key];
  const base = spec.file.replace(/\.[a-z]+$/i, '');
  const imgDir = join(ctx.srcDir, 'assets/img/generated');
  const widths = [480, 800, 1200, 1600].filter((w) => existsSync(join(imgDir, `${base}-${w}.webp`)));
  const loading = eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  if (widths.length) {
    const srcset = (ext) => widths.map((w) => `/assets/img/generated/${base}-${w}.${ext} ${w}w`).join(', ');
    const fallback = widths.includes(800) ? 800 : widths[widths.length - 1];
    return `<picture class="${className}">
      <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
      <img src="/assets/img/generated/${base}-${fallback}.jpg" srcset="${srcset('jpg')}" sizes="${sizes}" width="${spec.width}" height="${spec.height}" alt="${esc(spec.alt)}" ${loading}>
    </picture>`;
  }
  // Placeholder: decorative in production, labelled in draft.
  const label = isDraft()
    ? `<span class="img-ph__label">Needed: approved photo<br><strong>${esc(spec.file)}</strong><br>${esc(spec.note)}</span>`
    : '';
  return `<div class="img-ph ${className}" style="aspect-ratio:${spec.width}/${spec.height}" aria-hidden="true">
    <svg class="img-ph__mark" viewBox="0 0 120 60" focusable="false"><path d="M4 8 C 40 8, 70 30, 116 30" /><path d="M4 52 C 40 52, 70 30, 116 30" /></svg>
    ${label}
  </div>`;
}

// ── Brand mark ───────────────────────────────────────────────────────────────
// Two lines that start apart and meet: the convergence motif used sitewide.
export const markSvg = (cls = 'brand__mark') =>
  `<svg class="${cls}" viewBox="0 0 42 24" aria-hidden="true" focusable="false"><path d="M1 3 C 14 3, 22 12, 39 12" /><path d="M1 21 C 14 21, 22 12, 39 12" /><circle cx="39" cy="12" r="1.6" /></svg>`;

// Two contrails that enter from opposite edges of the sky and meet, then fly on
// as one: the convergence mark drawn at sky scale. Pure geometry, decorative.
export const contrails = (cls = '') =>
  `<svg class="trails ${cls}" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="trail-fade-a" gradientUnits="userSpaceOnUse" x1="520" y1="0" x2="1110" y2="330"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <linearGradient id="trail-fade-b" gradientUnits="userSpaceOnUse" x1="690" y1="800" x2="1110" y2="330"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <filter id="trail-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <g class="trails__haze" filter="url(#trail-soft)">
    <path class="trail" pathLength="1" stroke="url(#trail-fade-a)" d="M520 -20 C 740 110, 950 245, 1110 330"/>
    <path class="trail trail--b" pathLength="1" stroke="url(#trail-fade-b)" d="M690 820 C 850 630, 990 430, 1110 330"/>
    <path class="trail trail--joined" pathLength="1" stroke="#fff" d="M1110 330 C 1240 312, 1350 302, 1480 296"/>
  </g>
  <g class="trails__core">
    <path class="trail" pathLength="1" stroke="url(#trail-fade-a)" d="M520 -20 C 740 110, 950 245, 1110 330"/>
    <path class="trail trail--b" pathLength="1" stroke="url(#trail-fade-b)" d="M690 820 C 850 630, 990 430, 1110 330"/>
    <path class="trail trail--joined" pathLength="1" stroke="#fff" d="M1110 330 C 1240 312, 1350 302, 1480 296"/>
  </g>
</svg>`;

// ── Navigation ───────────────────────────────────────────────────────────────
export const nav = [
  { path: '/', label: 'Home' },
  { path: '/about/', label: 'About' },
  { path: '/mediation/', label: 'Mediation' },
  { path: '/consultation/', label: 'Consultation' },
  { path: '/videos/', label: 'Videos' },
  { path: '/masterclass/', label: 'Masterclass' },
  { path: '/contact/', label: 'Contact' },
];

export const CTA_PRIMARY = 'Schedule a Confidential Consultation';
export const CTA_SECONDARY = 'Explore Mediation Services';

function header(path) {
  const items = nav
    .map(
      (n) =>
        `<li><a href="${n.path}"${n.path === path ? ' aria-current="page"' : ''}>${n.label}</a></li>`
    )
    .join('');
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header" data-header>
  <div class="site-header__inner wrap">
    <a class="brand" href="/" aria-label="Mediation Office of S. Collinson, home">
      <span class="brand__badge">${markSvg()}</span>
      <span class="brand__text"><span class="brand__name">Sean Collinson</span><span class="brand__sub">Mediation Office</span></span>
    </a>
    <nav class="primary-nav" aria-label="Primary">
      <ul class="primary-nav__list">${items}</ul>
    </nav>
    <a class="btn btn--header btn--sm site-header__cta" href="/consultation/">Schedule a Consultation</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
      <span class="menu-toggle__bars" aria-hidden="true"></span><span class="visually-hidden">Menu</span>
    </button>
  </div>
  <div class="mobile-menu" id="mobile-menu" data-menu hidden>
    <nav aria-label="Mobile">
      <ul class="mobile-menu__list">${items}</ul>
    </nav>
    <a class="btn btn--primary mobile-menu__cta" href="/consultation/">${CTA_PRIMARY}</a>
  </div>
</header>`;
}

function footer() {
  const pageLinks = nav.map((n) => `<li><a href="${n.path}">${n.label}</a></li>`).join('');
  const socials = social.length
    ? `<ul class="footer__social">${social
        .map((s) => `<li><a href="${esc(s.url)}" rel="noopener noreferrer" target="_blank">${esc(s.label)}<span class="visually-hidden"> (opens in a new tab)</span></a></li>`)
        .join('')}</ul>`
    : '';
  const contactLines = [
    hasPhone() ? `<li>Phone: ${phoneLink()}</li>` : isDraft() ? `<li>${ph('office phone number')}</li>` : '',
    hasEmail() ? `<li>Email: ${emailLink()}</li>` : isDraft() ? `<li>${ph('office email address')}</li>` : '',
    !hasPhone() && !hasEmail()
      ? `<li>Reach the office through the <a href="/contact/">contact page</a>.</li>`
      : '',
  ].join('');
  const legalLink = (href, label, key) =>
    `<li><a href="${href}">${label}</a>${!legal[key].reviewed && isDraft() ? ' ' + ph('professional review') : ''}</li>`;
  return `<footer class="site-footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <p class="footer__name">${esc(site.name)}</p>
      <p>${esc(site.positioning)}</p>
      <ul class="footer__contact">${contactLines}</ul>
      <p class="footer__area">${esc(site.serviceArea)}</p>
      ${socials}
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <p class="footer__heading">Pages</p>
      <ul>${pageLinks}</ul>
    </nav>
    <nav class="footer__nav" aria-label="Legal">
      <p class="footer__heading">Policies</p>
      <ul>
        ${legalLink('/privacy-policy/', 'Privacy Policy', 'privacy')}
        ${legalLink('/terms-of-use/', 'Terms of Use', 'terms')}
        ${legalLink('/accessibility/', 'Accessibility Statement', 'accessibility')}
        ${legalLink('/disclaimer/', 'Disclaimer', 'disclaimer')}
      </ul>
    </nav>
  </div>
  <div class="wrap footer__legal">
    <p class="footer__disclaimer">The information on this website is provided for general informational purposes and does not constitute legal advice. Sean Collinson serves as a neutral mediator and does not represent either party. Using this website or contacting the office does not create an attorney-client relationship. Each matter is different, and no result is guaranteed.</p>
    <p>&copy; <span data-year>${ctx.year}</span> ${esc(site.name)}. All rights reserved.</p>
  </div>
</footer>
${
  hasPhone()
    ? `<div class="mobile-cta" aria-label="Quick contact"><a class="mobile-cta__btn" href="tel:${esc(contact.phone)}">Call</a><a class="mobile-cta__btn mobile-cta__btn--primary" href="/consultation/">Consultation</a></div>`
    : ''
}`;
}

// ── Breadcrumbs ──────────────────────────────────────────────────────────────
export function breadcrumbs(trail) {
  // trail: [{ name, path }] excluding Home
  const all = [{ name: 'Home', path: '/' }, ...trail];
  const html = `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${all
    .map((c, i) =>
      i === all.length - 1
        ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
        : `<li><a href="${c.path}">${esc(c.name)}</a></li>`
    )
    .join('')}</ol></nav>`;
  const schema = {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
  return { html, schema };
}

// ── Structured data ──────────────────────────────────────────────────────────
export const ids = {
  website: abs('/#website'),
  business: abs('/#practice'),
  person: abs('/about/#sean-collinson'),
};

export function personSchema() {
  const p = {
    '@type': 'Person',
    '@id': ids.person,
    name: site.person,
    jobTitle: site.jobTitle,
    url: abs('/about/'),
    worksFor: { '@id': ids.business },
    description:
      'Family and civil mediator with more than 22 years of mediation experience. Trained through the Harvard Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program.',
    knowsAbout: [
      'Divorce mediation',
      'Family mediation',
      'Child custody and parenting plan mediation',
      'Civil mediation',
      'Business dispute mediation',
      'Workplace mediation',
      'Negotiation',
      'Crisis negotiation communication',
    ],
  };
  if (existsSync(join(ctx.srcDir, 'assets/img/generated', images.portrait.file.replace(/\.[a-z]+$/i, '') + '-800.jpg'))) {
    p.image = abs('/assets/img/generated/' + images.portrait.file.replace(/\.[a-z]+$/i, '') + '-800.jpg');
  }
  if (social.length) p.sameAs = social.map((s) => s.url);
  return p;
}

export function businessSchema() {
  const b = {
    '@type': 'ProfessionalService',
    '@id': ids.business,
    name: site.name,
    alternateName: 'Sean Collinson Mediation',
    url: abs('/'),
    description: site.positioning,
    founder: { '@id': ids.person },
    employee: { '@id': ids.person },
    areaServed: [
      { '@type': 'City', name: 'Los Angeles' },
      { '@type': 'State', name: 'California' },
      { '@type': 'Country', name: 'United States' },
    ],
    serviceType: [
      'Divorce mediation',
      'Family mediation',
      'Child custody mediation',
      'Civil mediation',
      'Business mediation',
      'Workplace mediation',
    ],
    logo: abs('/assets/img/logo.png'),
    image: abs('/assets/img/social-share.jpg'),
  };
  if (hasPhone()) b.telephone = contact.phone;
  if (hasEmail()) b.email = contact.email;
  if (contact.address) {
    b.address = {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    };
  }
  if (social.length) b.sameAs = social.map((s) => s.url);
  return b;
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: abs('/'),
    name: site.name,
    publisher: { '@id': ids.business },
    inLanguage: 'en-US',
  };
}

export const jsonld = (graph) =>
  graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`
    : '';

// ── Document ─────────────────────────────────────────────────────────────────
export function layout({ path, title, description, body, schema = [], noindex = false, bodyClass = '' }) {
  const canonical = abs(path);
  const ogImage = abs('/assets/img/social-share.jpg');
  const robots = noindex || isDraft() ? '<meta name="robots" content="noindex, follow">' : '';
  const verification = analytics.googleSiteVerification
    ? `<meta name="google-site-verification" content="${esc(analytics.googleSiteVerification)}">`
    : '';
  const ga = analytics.ga4MeasurementId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(analytics.ga4MeasurementId)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(analytics.ga4MeasurementId)}');</script>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${path === '/404.html' ? '' : `<link rel="canonical" href="${canonical}">`}
${robots}
${verification}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${path === '/404.html' ? '' : `<meta property="og:url" content="${canonical}">`}
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Mediation Office of S. Collinson">
<meta property="og:locale" content="${site.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<meta name="theme-color" content="#1F4F96">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/manrope-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/schibsted-grotesk-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${ctx.version}">
${jsonld(schema)}
${ga}
</head>
<body class="${bodyClass}${isDraft() ? ' is-draft' : ''}">
${isDraft() ? '<div class="draft-banner" role="note">Draft preview: tags marked “Needed” show content Sean must supply. Not for publication.</div>' : ''}
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
<script src="/assets/js/site.js?v=${ctx.version}" defer></script>
</body>
</html>
`;
}

// ── Reusable sections ────────────────────────────────────────────────────────
export function ctaBand({ heading, text, primary = CTA_PRIMARY, secondary = null }) {
  return `<section class="cta-band sky sky--dusk" aria-labelledby="cta-${slug(heading)}">
  ${contrails('cta-band__trails')}
  <div class="wrap cta-band__inner">
    <h2 id="cta-${slug(heading)}" class="cta-band__title">${heading}</h2>
    <p class="cta-band__text">${text}</p>
    <div class="btn-row">
      <a class="btn btn--white" href="/consultation/">${primary}</a>
      ${secondary ? `<a class="btn btn--glass" href="${secondary.href}">${secondary.label}</a>` : ''}
    </div>
  </div>
</section>`;
}

export const slug = (s) =>
  String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// FAQ list rendered as native disclosure widgets (keyboard accessible).
export function faqList(items, { idPrefix = 'faq' } = {}) {
  return `<div class="faq">${items
    .map(
      (q, i) => `<details class="faq__item" id="${idPrefix}-${slug(q.q)}"${i === 0 && q.open ? ' open' : ''}>
  <summary class="faq__q"><h3>${q.q}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
  <div class="faq__a">${q.a}</div>
</details>`
    )
    .join('')}</div>`;
}
