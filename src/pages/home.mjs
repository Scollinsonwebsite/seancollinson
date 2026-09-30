import { claims, testimonials } from '../config.mjs';
import {
  layout, photo, ctaBand, faqList, isDraft, esc, CTA_PRIMARY, CTA_SECONDARY,
  websiteSchema, businessSchema, personSchema,
} from '../lib/render.mjs';

export const meta = {
  path: '/',
  out: 'index.html',
  title: 'Los Angeles Divorce Mediator | Sean Collinson',
  description:
    'Resolve divorce, family, civil, and business disputes privately with experienced Los Angeles mediator Sean Collinson. In-person and virtual mediation.',
  h1: 'Resolve Conflict Without Losing Control',
};

const services = [
  {
    title: 'Divorce and family mediation',
    href: '/mediation/#divorce-and-family',
    text: 'A structured, private process for working through the decisions a divorce requires, at a pace both of you can manage.',
    lead: true,
  },
  {
    title: 'Legal separation mediation',
    href: '/mediation/#legal-separation',
    text: 'Clear terms for living apart when you are not ready for, or do not want, a divorce.',
  },
  {
    title: 'Child custody and parenting plans',
    href: '/mediation/#custody-and-parenting',
    text: 'Schedules, holidays, and decision-making built around your children rather than the courtroom calendar.',
  },
  {
    title: 'Property and financial issues',
    href: '/mediation/#property-and-finances',
    text: 'Homes, retirement accounts, business interests, debt, and support, discussed with the documents on the table.',
  },
  {
    title: 'Civil and business mediation',
    href: '/mediation/#civil-and-business',
    text: 'Contract, partnership, and commercial disputes resolved before, or during, litigation.',
  },
  {
    title: 'Workplace and community disputes',
    href: '/mediation/#partnership-contract-workplace',
    text: 'Employment conflict, landlord and tenant matters, and neighbor or community disagreements.',
  },
];

const steps = [
  {
    title: 'Confidential consultation',
    text: 'A private conversation about what is in dispute, who needs to be involved, and whether mediation is a good fit.',
  },
  {
    title: 'Issue identification and preparation',
    text: 'Sean helps each side name the decisions that actually need to be made and gather the information needed to make them.',
  },
  {
    title: 'Guided mediation sessions',
    text: 'Structured sessions, in person or by Zoom, that keep the conversation focused, respectful, and moving toward options.',
  },
  {
    title: 'Clear written terms',
    text: 'Agreed points are captured in writing so each party can review them, with independent counsel if they choose, before anything is final.',
  },
];

const faqs = [
  {
    q: 'How does mediation work?',
    a: `<p>Both parties meet with a neutral mediator, together or in separate rooms, to identify the issues, exchange the information each side needs, and work toward terms both can accept. The mediator guides the process but does not decide the outcome or take sides. <a href="/mediation/#how-mediation-works">Read how the mediation process works</a>.</p>`,
    open: true,
  },
  {
    q: 'Is mediation confidential?',
    a: `<p>Sessions are private, and California has statutes that generally protect what is said in mediation, subject to specific exceptions. How those rules apply depends on your situation and jurisdiction, so it is worth asking your own attorney. Sean explains the confidentiality terms at the start of every matter.</p>`,
  },
  {
    q: 'How long does mediation take?',
    a: `<p>It depends on how many issues are in dispute, how complex the finances are, and how prepared both sides are. Some matters settle in a single session; others take several sessions over a few weeks. You will have a clearer sense after the consultation.</p>`,
  },
  {
    q: 'Can mediation address custody, support, and property?',
    a: `<p>Yes. Parenting schedules, decision-making, child and spousal support, property, debt, and retirement assets can all be discussed in mediation. <a href="/mediation/#services">See the full list of mediation services</a>.</p>`,
  },
];

function trustBar() {
  const items = [
    ['22+ years', 'of mediation experience'],
    ['Harvard and Loyola', 'negotiation and mediation training'],
    ['FBI-trained', 'crisis negotiator'],
    ['California and virtual', 'sessions by Zoom nationwide'],
  ];
  return `<section class="trust" aria-label="Credentials at a glance">
  <ul class="wrap trust__list">
    ${items.map(([a, b]) => `<li class="trust__item"><strong>${a}</strong> <span>${b}</span></li>`).join('')}
  </ul>
</section>`;
}

function verifiedClaims() {
  const enabled = Object.values(claims).filter((c) => c.enabled && c.value && c.note);
  if (!enabled.length) return '';
  return `<dl class="claims">${enabled
    .map((c) => `<div class="claims__item"><dt>${esc(c.value)}</dt><dd>${esc(c.label)}<small class="claims__note">${esc(c.note)} Past results do not guarantee a similar outcome in any other matter.</small></dd></div>`)
    .join('')}</dl>`;
}

function testimonialsSection() {
  const real = testimonials.filter((t) => t.permissionOnFile && t.quote && t.name);
  if (real.length) {
    return `<section class="section" aria-labelledby="reviews-title">
  <div class="wrap">
    <h2 id="reviews-title" class="section__title">What clients say</h2>
    <div class="reviews">${real
      .map((t) => `<figure class="review"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)}${t.context ? `, ${esc(t.context)}` : ''}</figcaption></figure>`)
      .join('')}</div>
    <p class="fine-print">Reviews are shared with each client’s permission. Every matter is different, and no result is guaranteed.</p>
  </div>
</section>`;
  }
  if (!isDraft()) return '';
  return `<section class="section" aria-labelledby="reviews-title">
  <div class="wrap">
    <h2 id="reviews-title" class="section__title">What clients say</h2>
    <div class="reviews">${[1, 2, 3]
      .map(() => `<div class="review review--ph"><span class="ph">Needed: approved client review</span><p>Add a verified review with written permission in <code>src/config.mjs</code>. This card does not appear in production.</p></div>`)
      .join('')}</div>
  </div>
</section>`;
}

export function render() {
  const body = `
<section class="hero" aria-labelledby="hero-title">
  <svg class="hero__lines" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path class="hero__line hero__line--a" pathLength="1" d="M-20 12 C 560 12, 900 104, 1460 104" />
    <path class="hero__line hero__line--b" pathLength="1" d="M-20 156 C 560 156, 900 104, 1460 104" />
  </svg>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <p class="eyebrow">Private. Practical. Solution-Focused.</p>
      <h1 id="hero-title" class="hero__title">${meta.h1}</h1>
      <p class="hero__lede">Sean Collinson is a family and civil mediator who helps individuals, families, and businesses reach practical agreements without the cost, delay, and strain of prolonged litigation. You keep the decisions. He keeps the process calm, focused, and fair.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="/consultation/">${CTA_PRIMARY}</a>
        <a class="btn btn--secondary" href="/mediation/">${CTA_SECONDARY}</a>
      </div>
      <p class="hero__note">Divorce mediation in Los Angeles and across California, with virtual sessions available nationwide.</p>
    </div>
    <figure class="hero__figure">
      <div class="hero__frame">${photo('portrait', { eager: true, sizes: '(min-width: 1000px) 34vw, 90vw', className: 'hero__photo' })}</div>
      <figcaption class="hero__caption"><span class="hero__caption-name">Sean Collinson</span> Family and civil mediator for more than 22 years</figcaption>
    </figure>
  </div>
</section>

${trustBar()}

<section class="section" aria-labelledby="why-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="why-title" class="section__title">Why people choose mediation</h2>
      <p class="section__lede">Litigation hands the most personal decisions of your life to a stranger with a crowded docket. Mediation keeps them with the people who will live with the result.</p>
    </div>
    <div class="pillars">
      <div class="pillar">
        <h3 class="pillar__title">Save time and money</h3>
        <p>Mediation usually involves fewer filings, fewer hearings, and less back-and-forth than litigation, so more of your time and resources stay with your family or business.</p>
      </div>
      <div class="pillar">
        <h3 class="pillar__title">Keep control of the outcome</h3>
        <p>Nothing is imposed. You and the other party shape the terms together, so the agreement can reflect details a court order rarely captures.</p>
      </div>
      <div class="pillar">
        <h3 class="pillar__title">Reduce conflict, protect relationships</h3>
        <p>Co-parents, business partners, and colleagues often have to keep working together. A respectful process makes that far easier after the dispute is settled.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="services-title" class="section__title">Mediation services</h2>
      <p class="section__lede">From divorce and parenting plans to contract and workplace disputes, each matter gets the same disciplined, neutral approach.</p>
    </div>
    <ul class="services">
      ${services
        .map(
          (s) => `<li class="service${s.lead ? ' service--lead' : ''}">
        <h3 class="service__title"><a href="${s.href}">${s.title}</a></h3>
        <p>${s.text}</p>
      </li>`
        )
        .join('')}
    </ul>
    <div class="btn-row btn-row--section">
      <a class="btn btn--secondary" href="/mediation/">See how each type of mediation works</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="about-preview-title">
  <div class="wrap split">
    <div class="split__media">
      ${photo('office', { sizes: '(min-width: 1000px) 45vw, 90vw', className: 'split__photo' })}
    </div>
    <div class="split__copy">
      <h2 id="about-preview-title" class="section__title">A steady neutral for difficult conversations</h2>
      <p>Sean Collinson has spent more than 22 years helping people resolve disputes they could not settle on their own. His training includes Harvard’s Program on Negotiation, Loyola Law School’s Mediating the Litigated Case program, and advanced family mediation training recognized by the Florida Supreme Court.</p>
      <p>He is also an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department. That work demands disciplined listening and calm under pressure, and he brings the same skills to every mediation, while staying strictly neutral between the parties.</p>
      <p><a class="text-link" href="/about/">Read Sean Collinson’s background and approach</a></p>
    </div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="process-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="process-title" class="section__title">How the process works</h2>
      <p class="section__lede">Four stages, each with a clear purpose. Most people find the structure itself lowers the temperature.</p>
    </div>
    <ol class="steps">
      ${steps.map((s) => `<li class="step"><h3 class="step__title">${s.title}</h3><p>${s.text}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="statement" aria-labelledby="experience-title">
  <div class="wrap statement__inner">
    <h2 id="experience-title" class="statement__label">Experience you can trust</h2>
    <p class="statement__quote">With more than 22 years of mediation experience and advanced training from Harvard, Loyola Law School, and the FBI, Sean Collinson brings proven judgment, calm leadership, and practical problem-solving to every case.</p>
    ${verifiedClaims()}
  </div>
</section>

${testimonialsSection()}

<section class="section" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title" class="section__title">Common questions</h2>
    ${faqList(faqs, { idPrefix: 'home-faq' })}
    <p class="faq__more"><a class="text-link" href="/mediation/#faq">Read more answers about divorce, family, and business mediation</a></p>
  </div>
</section>

${ctaBand({
  heading: 'Your Dispute Does Not Have to Control Your Future',
  text: 'A short, confidential consultation is the simplest way to find out whether mediation fits your situation.',
  primary: 'Schedule a Consultation',
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [websiteSchema(), businessSchema(), personSchema()],
    bodyClass: 'page-home',
  });
}
