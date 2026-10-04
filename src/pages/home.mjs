import { claims, testimonials } from '../config.mjs';
import {
  layout, photo, ctaBand, faqList, isDraft, esc, CTA_PRIMARY, CTA_SECONDARY,
  websiteSchema, businessSchema, personSchema,
} from '../lib/render.mjs';
import { icon } from '../lib/icons.mjs';

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

function bento() {
  return `<section class="bento-wrap" aria-label="Mediation at a glance">
  <div class="wrap bento">
    <article class="tile tile--route" aria-labelledby="route-title">
      <div class="tile__head">
        <h2 id="route-title" class="tile__title">How mediation works</h2>
        <a class="tile__link" href="/mediation/#process">The full process</a>
      </div>
      <p class="tile__lede">Four stages, each with one purpose. Most people find the structure itself lowers the temperature.</p>
      <ol class="route">
        ${steps.map((st, i) => `<li class="route__stop"><span class="route__node" aria-hidden="true"></span><h3 class="route__title">${st.title}</h3><p>${st.text}</p></li>`).join('')}
      </ol>
    </article>

    <article class="tile tile--start" aria-labelledby="start-title">
      <span class="chip chip--blue">${icon('calendar-check')}</span>
      <h2 id="start-title" class="tile__title">Start with a confidential consultation</h2>
      <p>A private first conversation about your dispute, the format, and fees.</p>
      <div class="stage" aria-hidden="true">
        <span class="stage__seg is-on"></span><span class="stage__seg"></span><span class="stage__seg"></span><span class="stage__seg"></span>
      </div>
      <p class="stage__label">Step 1 of 4</p>
      <ul class="where">
        <li>${icon('map-pin', 'icon icon--sm')} In person across California</li>
        <li>${icon('video', 'icon icon--sm')} By Zoom, nationwide</li>
      </ul>
      <a class="btn btn--primary btn--block btn--sm" href="/consultation/">${CTA_PRIMARY}</a>
    </article>

    <a class="tile tile--service tile--blue" href="/mediation/#divorce-and-family">
      <span class="chip chip--blue">${icon('users')}</span>
      <h2 class="tile__title">Divorce and family</h2>
      <p>Parenting, support, property, and debt, worked through at a pace both of you can manage.</p>
    </a>

    <a class="tile tile--service tile--violet" href="/mediation/#custody-and-parenting">
      <span class="chip chip--violet">${icon('baby')}</span>
      <h2 class="tile__title">Custody and parenting plans</h2>
      <p>Schedules, holidays, and decision-making built around your children.</p>
    </a>

    <a class="tile tile--service tile--amber" href="/mediation/#civil-and-business">
      <span class="chip chip--amber">${icon('briefcase-business')}</span>
      <h2 class="tile__title">Civil and business</h2>
      <p>Contract, partnership, and workplace disputes, before or during litigation.</p>
    </a>



    <article class="tile tile--decide" aria-labelledby="decide-title">
      <span class="chip chip--green">${icon('check')}</span>
      <h2 id="decide-title" class="tile__title">Who decides the outcome?</h2>
      <dl class="decide">
        <div class="decide__row decide__row--yes"><dt>Mediation</dt><dd>You and the other party</dd></div>
        <div class="decide__row"><dt>Litigation</dt><dd>A judge</dd></div>
      </dl>
      <p class="tile__note">Nothing in mediation is imposed. <a href="/mediation/#comparison">Compare the two</a></p>
    </article>

  </div>
</section>`;
}

export function render() {
  const body = `
<section class="hero hero--photo sky" aria-labelledby="hero-title">
  <div class="hero__media">${photo('hero', { eager: true, sizes: '100vw', className: 'hero__photo' })}</div>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <h1 id="hero-title" class="hero__title">${meta.h1}</h1>
      <p class="hero__lede">Sean Collinson is a family and civil mediator who helps individuals, families, and businesses reach practical agreements without the cost, delay, and strain of prolonged litigation. You keep the decisions. He keeps the process calm, focused, and fair.</p>
      <div class="hero__actions">
        <a class="btn btn--white" href="/consultation/">${CTA_PRIMARY}</a>
        <a class="btn btn--glass" href="/mediation/">${CTA_SECONDARY}</a>
      </div>
      <ul class="hero__values" aria-label="The approach">
        <li>Private</li><li>Practical</li><li>Solution-focused</li>
      </ul>
    </div>
  </div>
  <div class="wrap">
    <aside class="glass hero__strip" aria-labelledby="glance-title">
      <h2 id="glance-title" class="visually-hidden">Sean Collinson at a glance</h2>
      <ul class="glance glance--row">
        <li>${icon('clock')}<span><strong>22+ years</strong> of mediation experience</span></li>
        <li>${icon('graduation-cap')}<span><strong>Harvard and Loyola</strong> negotiation and mediation training</span></li>
        <li>${icon('shield-check')}<span><strong>FBI-trained</strong> crisis negotiator</span></li>
        <li>${icon('video')}<span><strong>California and Zoom</strong> in person or virtual, nationwide</span></li>
      </ul>
    </aside>
  </div>
</section>

${bento()}

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

<section class="statement sky sky--dusk" aria-labelledby="experience-title">
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
