// Shared template for the service and guide pages: hero with jump links,
// content sections on alternating backgrounds, a consultation block with the
// office address and phone, Sean's background, an FAQ with FAQPage schema,
// and the closing call to action.
import {
  layout, ctaBand, breadcrumbs, faqList, faqSchema, officeAddress, officePhoneLink, slug, CTA_PRIMARY,
} from './render.mjs';

// The cost answer reuses the wording already on the site; no prices.
export const costAnswer = (topic) =>
  `<p>Cost depends on the number of sessions and the preparation required. Mediation is often less expensive than contested litigation because it involves fewer hearings and less formal discovery, but every matter is different. Fees and payment terms are explained during the <a href="/consultation/">consultation</a>${topic ? `, including for ${topic}` : ''}.</p>`;

export const timingAnswer = (detail) =>
  `<p>It depends on how many issues are in dispute${detail ? `, ${detail}` : ''}, and how prepared both sides are. Some matters settle in a single session; others take several sessions over a few weeks. There is no fixed timeline, and no one can promise one.</p>`;

const aboutSean = (topic) => `
    <h2 id="about-sean-title" class="section__title">A steady neutral for difficult conversations</h2>
    <p>Sean Collinson has more than 22 years of mediation experience helping people resolve disputes they could not settle on their own. His training includes Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program.</p>
    <p>He is also an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department. That work demands disciplined listening and calm under pressure, and he brings the same skills to ${topic}. <a href="/about/">Meet Sean Collinson</a>.</p>
    <p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>`;

export function servicePage({ meta, crumb, lede, sections, faqs, faqTitle, consultText, seanTopic, cta, hero, headExtra = '', extraSchema = [], beforeCta = '' }) {
  const crumbs = breadcrumbs([{ name: crumb, path: meta.path }]);
  const blocks = [
    ...sections,
    {
      id: 'consultation',
      title: 'Book a confidential consultation',
      html: `<p>${consultText || 'A private first conversation about your situation, the issues to settle, the format, and fees.'} Call the office or request a consultation online.</p>
    <address style="font-style:normal">${officeAddress()}<br>Phone: ${officePhoneLink()}</address>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>`,
    },
  ];
  const sectionHtml = blocks
    .map(
      (s, i) => `<section class="section${i % 2 ? ' section--ivory' : ''}" id="${s.id}" aria-labelledby="${s.id}-title">
  <div class="wrap narrow prose">
    <h2 id="${s.id}-title" class="section__title">${s.title}</h2>
    ${s.html}
  </div>
</section>`
    )
    .join('\n\n');
  const n = blocks.length;
  // `hero` (optional) returns custom hero HTML, given the breadcrumb and jump-link markup.
  const jumpNav = `<nav class="jump" aria-label="On this page">
      <p class="jump__label">On this page</p>
      <ul>
        ${sections.map((s) => `<li><a href="#${s.id}">${s.jump || s.title}</a></li>`).join('\n        ')}
        <li><a href="#faq">Questions</a></li>
      </ul>
    </nav>`;
  const body = `
${hero ? hero(crumbs.html, jumpNav) : `<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">${lede}</p>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>
    <nav class="jump" aria-label="On this page">
      <p class="jump__label">On this page</p>
      <ul>
        ${sections.map((s) => `<li><a href="#${s.id}">${s.jump || s.title}</a></li>`).join('\n        ')}
        <li><a href="#faq">Questions</a></li>
      </ul>
    </nav>
  </div>
</section>`}

${sectionHtml}

<section class="section${n % 2 ? ' section--ivory' : ''}" id="about-sean" aria-labelledby="about-sean-title">
  <div class="wrap narrow prose">${aboutSean(seanTopic)}
  </div>
</section>

<section class="section${(n + 1) % 2 ? ' section--ivory' : ''}" id="faq" aria-labelledby="faq-${slug(faqTitle)}">
  <div class="wrap narrow">
    <h2 id="faq-${slug(faqTitle)}" class="section__title">${faqTitle}</h2>
    ${faqList(faqs, { idPrefix: 'faq' })}
  </div>
</section>

${beforeCta}
${ctaBand(cta)}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema, faqSchema(faqs), ...extraSchema],
    bodyClass: `page-${meta.path.replace(/\//g, '')}`,
    headExtra,
  });
}
