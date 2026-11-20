// Shared rendering helpers: escaping, placeholders, images, header, footer,
// metadata, and structured data. Pages import these and return HTML strings.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { site, contact, office, social, analytics, images, legal, reviews, areasServed, booking, serviceRegion } from '../config.mjs';
import { icon } from './icons.mjs';
import { quickRequestDialog } from './forms.mjs';

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

export const officeAddress = () =>
  `${esc(office.name)}, ${esc(office.street)}, ${esc(office.city)}, ${esc(office.region)} ${esc(office.postalCode)}`;
export const officePhoneLink = () => `<a href="tel:${esc(office.phone)}">${esc(office.phoneDisplay)}</a>`;

// ── Images ───────────────────────────────────────────────────────────────────
// Returns responsive <picture> markup if the optimised files exist (see
// tools/optimize-images.mjs), otherwise a designed placeholder panel.
export function photo(key, { eager = false, sizes = '100vw', className = '' } = {}) {
  const spec = images[key];
  const base = spec.file.replace(/\.[a-z]+$/i, '');
  const imgDir = join(ctx.srcDir, 'assets/img/generated');
  const widths = existsSync(imgDir)
    ? readdirSync(imgDir)
        .map((f) => f.match(new RegExp(`^${base}-(\\d+)\\.webp$`)))
        .filter(Boolean)
        .map((m) => Number(m[1]))
        .sort((a, b) => a - b)
    : [];
  const loading = eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  if (widths.length) {
    // Content hash in the URL so a replaced photo is never served from a stale cache.
    const ver = (w, ext) => createHash('md5').update(readFileSync(join(imgDir, `${base}-${w}.${ext}`))).digest('hex').slice(0, 8);
    const url = (w, ext) => `/assets/img/generated/${base}-${w}.${ext}?v=${ver(w, ext)}`;
    const srcset = (ext) => widths.map((w) => `${url(w, ext)} ${w}w`).join(', ');
    const fallback = widths.includes(1200) ? 1200 : widths[widths.length - 1];
    return `<picture class="${className}">
      <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
      <img src="${url(fallback, 'jpg')}" srcset="${srcset('jpg')}" sizes="${sizes}" width="${spec.width}" height="${spec.height}" alt="${esc(spec.alt)}" ${loading}>
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
  { path: '/blog/', label: 'Blog' },
  { path: '/contact/', label: 'Contact' },
];

// Service and guide pages, shown in the Mediation dropdown and the footer.
export const services = [
  { path: '/divorce-mediation/', label: 'Divorce mediation' },
  { path: '/child-custody-mediation/', label: 'Child custody' },
  { path: '/child-support-mediation/', label: 'Child support' },
  { path: '/spousal-support-mediation/', label: 'Spousal support' },
  { path: '/property-division-mediation/', label: 'Property and finances' },
  { path: '/legal-separation-mediation/', label: 'Legal separation' },
  { path: '/paternity-mediation/', label: 'Paternity' },
  { path: '/holiday-parenting-schedules/', label: 'Holiday schedules' },
  { path: '/business-mediation/', label: 'Civil and business' },
  { path: '/workplace-mediation/', label: 'Workplace' },
  { path: '/high-conflict-settlement-officer/', label: 'High-conflict settlement' },
];
export const guides = [
  { path: '/how-mediation-works/', label: 'How mediation works' },
  { path: '/faq/', label: 'FAQ' },
];

export const reviewsLine = () =>
  `<a href="${esc(reviews.url)}" rel="noopener" target="_blank"><span aria-hidden="true">★</span> ${esc(reviews.rating)} out of 5 from ${reviews.count} ${esc(reviews.source)} reviews<span class="visually-hidden"> (opens in a new tab)</span></a>`;
const andList = (items) => `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
export const areasHtml = () => `<p>${esc(areasServed.line)}</p>
    <p><strong>Counties:</strong> ${esc(andList(areasServed.counties))}.</p>
    <p><strong>Cities:</strong> ${esc(andList(areasServed.cities))}.</p>`;

// "Book a Consultation" opens the online booking page in a new tab.
export const bookingLink = (cls) =>
  `<a class="${cls}" href="${esc(booking.url)}" target="_blank" rel="noopener">${esc(booking.label)}<span class="visually-hidden"> (opens ${esc(booking.provider)} in a new tab)</span></a>`;

const socialSvg = {
  YouTube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" fill="currentColor"/>',
  Instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/>',
  X: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>',
  LinkedIn: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-3.95v-11Z" fill="currentColor"/>',
};
export const socialIcons = (cls) =>
  social.length
    ? `<ul class="${cls}">${social
        .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.aria || s.label)} (opens in a new tab)"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">${socialSvg[s.label] || ''}</svg></a></li>`)
        .join('')}</ul>`
    : '';

export const CTA_PRIMARY = 'Book a Free Consultation';
export const CTA_SECONDARY = 'Explore Mediation Services';

function header(path) {
  const items = nav
    .map(
      (n) =>
        `<li><a href="${n.path}"${n.path === path ? ' aria-current="page"' : ''}>${n.label}</a></li>`
    )
    .join('');
  const sub = [...services, ...guides, { path: '/mediation-cost/', label: 'Mediation cost' }, { path: '/think-like-a-hostage-negotiator/', label: 'Think Like a Hostage Negotiator' }];
  const subLinks = sub
    .map((s) => `<li><a href="${s.path}"${s.path === path ? ' aria-current="page"' : ''}>${s.label}</a></li>`)
    .join('');
  const withSub = (html, mobile) =>
    html.replace(
      /<li><a href="\/mediation\/"([^>]*)>Mediation<\/a><\/li>/,
      mobile
        ? `<li><a href="/mediation/"$1>Mediation</a><ul class="mobile-menu__sub">${subLinks}</ul></li>`
        : `<li class="has-sub"><a href="/mediation/"$1>Mediation</a><button class="subnav-toggle" type="button" aria-expanded="false" aria-controls="subnav-mediation" data-subnav-toggle><span class="visually-hidden">Show mediation services</span></button><ul class="subnav" id="subnav-mediation">${subLinks}</ul></li>`
    );
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header" data-header>
  <div class="site-header__inner wrap">
    <a class="brand" href="/" aria-label="${esc(site.name)}, home">
      <span class="brand__badge">${markSvg()}</span>
      <span class="brand__text"><span class="brand__pre">The Mediation Office of</span><span class="brand__name">Sean Collinson</span></span>
    </a>
    <nav class="primary-nav" aria-label="Primary">
      <ul class="primary-nav__list">${withSub(items, false)}</ul>
    </nav>
    ${socialIcons('header-social')}
    ${bookingLink('btn btn--header btn--sm site-header__cta')}
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
      <span class="menu-toggle__bars" aria-hidden="true"></span><span class="visually-hidden">Menu</span>
    </button>
  </div>
  <div class="mobile-menu" id="mobile-menu" data-menu hidden>
    <nav aria-label="Mobile">
      <ul class="mobile-menu__list">${withSub(items, true)}</ul>
    </nav>
    ${bookingLink('btn btn--primary mobile-menu__cta')}
    ${socialIcons('mobile-menu__social')}
  </div>
</header>`;
}

function footer() {
  const pageLinks = [...nav, { path: '/testimonials/', label: 'Testimonials' }, { path: '/newsletter/', label: 'Newsletter' }].map((n) => `<li><a href="${n.path}">${n.label}</a></li>`).join('');
  const serviceLinks = [...services, ...guides].map((n) => `<li><a href="${n.path}">${n.label}</a></li>`).join('');
  const socials = social.length
    ? `<ul class="footer__social">${social
        .map((s) => `<li><a href="${esc(s.url)}" rel="noopener noreferrer" target="_blank"${s.aria ? ` aria-label="${esc(s.aria)} (opens in a new tab)"` : ''}>${esc(s.label)}<span class="visually-hidden"> (opens in a new tab)</span></a></li>`)
        .join('')}</ul>`
    : '';
  const contactLines = [
    `<li><address style="font-style:normal">${officeAddress()}</address></li>`,
    `<li>Phone: ${officePhoneLink()}</li>`,
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
      <p class="footer__book">${bookingLink('btn btn--header btn--sm')}</p>
      <p class="footer__rating">${reviewsLine()}</p>
      <p class="footer__area">${esc(site.serviceArea)}</p>
      <div class="footer__area footer__region">${serviceRegionHtml('p', 'footer__heading', 'footer-region')}</div>
      ${socials}
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <p class="footer__heading">Pages</p>
      <ul>${pageLinks}</ul>
    </nav>
    <nav class="footer__nav" aria-label="Services">
      <p class="footer__heading">Services</p>
      <ul>${serviceLinks}</ul>
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
    ? `<div class="mobile-cta" aria-label="Quick contact"><a class="mobile-cta__btn" href="tel:${esc(contact.phone)}">Call</a><a class="mobile-cta__btn mobile-cta__btn--primary" href="/consultation/" data-consult-open>Consultation</a></div>`
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
  organization: abs('/#organization'),
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

// Office details (name, Sherman Oaks address, phone) come from `office` in
// config.mjs, so the schema matches the footer and home page exactly.
const officePostalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: office.street,
  addressLocality: office.city,
  addressRegion: office.region,
  postalCode: office.postalCode,
  addressCountry: 'US',
});
// Schema service area: the Southern California counties in serviceRegion.
const losAngeles = () =>
  serviceRegion.counties.map((c) => ({
    '@type': 'AdministrativeArea',
    name: `${c} County`,
    containedInPlace: { '@type': 'State', name: 'California' },
  }));

const listLine = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}` : items.join(''));
export const serviceRegionHtml = (headingTag = 'h2', cls = 'section__title', id = 'region-title') => `<${headingTag} id="${id}" class="${cls}">${esc(serviceRegion.heading)}</${headingTag}>
    <p>${esc(serviceRegion.line)}</p>
    <p><strong>Counties:</strong> ${esc(listLine(serviceRegion.counties.map((c) => `${c} County`)))}.</p>
    <p><strong>Cities:</strong> ${esc(listLine(serviceRegion.cities))}.</p>`;

export function organizationSchema() {
  const o = {
    '@type': 'Organization',
    '@id': ids.organization,
    name: office.name,
    url: abs('/'),
    logo: abs('/assets/img/logo.png'),
    image: abs('/assets/img/social-share.jpg'),
    description: site.positioning,
    telephone: office.phone,
    address: officePostalAddress(),
    areaServed: losAngeles(),
    founder: { '@id': ids.person },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: office.phone,
      contactType: 'customer service',
      areaServed: losAngeles(),
      availableLanguage: 'English',
    },
  };
  if (hasEmail()) o.email = contact.email;
  if (social.length) o.sameAs = social.map((s) => s.url);
  return o;
}

export function businessSchema() {
  const b = {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ids.business,
    name: office.name,
    url: abs('/'),
    description: site.positioning,
    telephone: office.phone,
    address: officePostalAddress(),
    areaServed: losAngeles(),
    parentOrganization: { '@id': ids.organization },
    openingHoursSpecification: (contact.openingHours || []).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    founder: { '@id': ids.person },
    employee: { '@id': ids.person },
    knowsAbout: [
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
  if (hasEmail()) b.email = contact.email;
  if (social.length) b.sameAs = social.map((s) => s.url);
  return b;
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: abs('/'),
    name: site.name,
    publisher: { '@id': ids.organization },
    inLanguage: 'en-US',
  };
}

export const jsonld = (graph) =>
  graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`
    : '';

// ── Document ─────────────────────────────────────────────────────────────────
// Hand-built page sections kept as exact HTML (ported from the live site).
export const partial = (name) => readFileSync(join(ctx.srcDir, 'partials', name), 'utf8').replace(/\n$/, '');

// Pages that never load the engagement pop-up (they already have their own form).
export const ENGAGE_EXCLUDED = ['/contact/', '/think-like-a-hostage-negotiator/'];

export function layout({ path, title, description, body, schema = [], noindex = false, bodyClass = '', headExtra = '', bodyEnd = '' }) {
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
<meta property="og:image:alt" content="${esc(site.name)}">
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
${headExtra}
${ga}
</head>
<body class="${bodyClass}${isDraft() ? ' is-draft' : ''}">
${isDraft() ? '<div class="draft-banner" role="note">Draft preview: tags marked “Needed” show content Sean must supply. Not for publication.</div>' : ''}
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${quickRequestDialog()}
<script src="/assets/js/site.js?v=${ctx.version}" defer></script>
${ENGAGE_EXCLUDED.includes(path) ? '' : `<script src="/assets/js/engage.js?v=${ctx.engageVersion}" defer></script>\n`}${bodyEnd}
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
      <a class="btn btn--white" href="/consultation/" data-consult-open>${primary}</a>
      ${secondary ? `<a class="btn btn--glass" href="${secondary.href}">${secondary.label}</a>` : ''}
    </div>
  </div>
</section>`;
}

export const slug = (s) =>
  String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// FAQPage structured data for the given FAQ items. The answer text is the
// same HTML shown on the page, so the markup always matches what visitors see.
export function faqSchema(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    })),
  };
}

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
