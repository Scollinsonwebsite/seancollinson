// High-Conflict Settlement Officer page: shared service template with the
// Mediation page's gold conference-room hero.
import { servicePage, costAnswer, timingAnswer } from '../lib/service-page.mjs';
import { partial, CTA_PRIMARY } from '../lib/render.mjs';

const meta = {
  path: '/high-conflict-settlement-officer/',
  out: 'high-conflict-settlement-officer/index.html',
  title: 'High-Conflict Settlement Officer in Los Angeles | Sean Collinson',
  description:
    'Private settlement sessions for high-conflict divorce, custody, and business disputes in Los Angeles, led by mediator and FBI-trained crisis negotiator Sean Collinson.',
  h1: 'High-Conflict Settlement Officer in Los Angeles',
};

const photo = `<div class="hero__media"><picture class="hero__photo">
<source type="image/webp" srcset="/assets/img/mediation/sean-collinson-mediation-480.webp?v=20261027 480w, /assets/img/mediation/sean-collinson-mediation-800.webp?v=20261027 800w, /assets/img/mediation/sean-collinson-mediation-1118.webp?v=20261027 1118w" sizes="(min-width: 820px) 66vw, 100vw">
<img src="/assets/img/mediation/sean-collinson-mediation-800.jpg?v=20261027" srcset="/assets/img/mediation/sean-collinson-mediation-480.jpg?v=20261027 480w, /assets/img/mediation/sean-collinson-mediation-800.jpg?v=20261027 800w, /assets/img/mediation/sean-collinson-mediation-1118.jpg?v=20261027 1118w" sizes="(min-width: 820px) 66vw, 100vw" width="1118" height="638" alt="" fetchpriority="high">
</picture></div>`;

const hero = (crumbs, jumpNav) => `<section class="page-hero page-hero--photo page-hero--mediation" aria-labelledby="page-title">
${photo}
<div class="wrap">${crumbs}</div>
<div class="wrap mh">
<div class="mh__eyebrow"><h1 id="page-title" class="mh__name" style="font:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;margin:0;max-width:min(100%, 42rem)">${meta.h1}</h1><span class="mh__role">Sean Collinson, Mediator</span></div>
<p class="page-hero__title mh__title"><span class="mh__line">High-Conflict Settlement Officer</span> <span class="mh__line mh__gold">I settle high-conflict cases.</span></p>
<p class="page-hero__lede mh__lede">When a case has turned into a war of attrition, the hardest part is getting both sides to a workable agreement. Sean brings structure, calm, and crisis-negotiation discipline to disputes that have stalled everywhere else.</p>
<div class="btn-row"><a class="btn mh__cta" href="/consultation/" data-consult-open>${CTA_PRIMARY} <svg class="mh__arrow" viewBox="0 0 24 12" aria-hidden="true" focusable="false"><path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a></div>
${jumpNav}
</div>
</section>`;

const cfg = {
  meta,
  crumb: 'High-Conflict Settlement Officer',
  hero,
  lede: '',
  sections: [
    {
      id: 'what-it-is',
      title: 'What a high-conflict settlement officer does',
      jump: 'What it is',
      html: `<p>Some disputes are not short on facts. They are short on trust. Custody battles, contested divorces, and business breakups can reach a point where every message escalates and every proposal is read as an attack. A settlement officer’s job is to change how the negotiation happens, so the people involved can reach terms they can live with.</p>
    <p>Sean works as a neutral. He does not take sides, decide the outcome, represent either party, or give legal advice. He manages a structured, private process aimed at settlement, and the parties make the decisions.</p>`,
    },
    {
      id: 'how-sessions-work',
      title: 'How sessions work in high-conflict cases',
      jump: 'How sessions work',
      html: `<ul>
      <li><strong>Separate rooms when needed:</strong> sessions can be joint, fully separate, or a mix, with Sean carrying proposals between the parties.</li>
      <li><strong>Clear ground rules:</strong> how people speak to each other, how breaks work, and what happens if the conversation escalates.</li>
      <li><strong>A focused agenda:</strong> one issue at a time, starting where progress is most likely.</li>
      <li><strong>Pacing:</strong> enough time to think, without letting the case drift for months.</li>
      <li><strong>In person or by Zoom:</strong> virtual sessions use private breakout rooms, which many people find easier than sitting across the table.</li>
    </ul>`,
    },
    {
      id: 'crisis-skills',
      title: 'Crisis negotiation skills, applied to settlement',
      jump: 'Crisis negotiation skills',
      html: `<p>Sean is an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department. Crisis negotiation is communication at its most demanding: active listening, emotional regulation, rapport, separating positions from interests, and turning those interests into specific, workable terms. Those are the skills high-conflict cases need most. <a href="/about/">Read about Sean’s background</a>.</p>`,
    },
    {
      id: 'attorneys',
      title: 'Working with attorneys',
      html: `<p>Attorneys are welcome to attend or to be available during sessions. When the parties reach agreement, the key terms are written down so counsel can review them and prepare final documents. In family matters, agreements then move through the court process that finalizes them. See <a href="/divorce-mediation/">divorce mediation</a> and <a href="/child-custody-mediation/">child custody mediation</a>.</p>`,
    },
    {
      id: 'not-right',
      title: 'When this is not the right fit',
      jump: 'When it is not right',
      html: `<p>A structured process depends on both parties being able to participate safely and freely. If there is a history of abuse, threats, or intimidation, mediation may not be appropriate, or may need special safeguards. Raise any safety concern during the consultation, and consider speaking with an attorney or advocate.</p>`,
    },
  ],
  faqTitle: 'Questions about high-conflict settlement',
  faqs: [
    { q: 'How long does a high-conflict settlement take?', a: timingAnswer('how entrenched the positions are, how complex the finances are'), open: true },
    { q: 'How much does it cost?', a: costAnswer() },
    { q: 'What if we still can’t agree?', a: `<p>Even when a full settlement is not reached, a structured session often narrows the dispute to a handful of issues and makes any remaining litigation shorter and less expensive. Court remains available for anything that is not resolved.</p>` },
    { q: 'Can a settlement be changed later?', a: `<p>It depends on the terms. In family matters, custody, parenting time, and child support can usually be revisited when circumstances change, while property division is generally final once a judgment is entered. Business settlements are generally binding once signed. Ask your attorney how this applies before you sign.</p>` },
  ],
  seanTopic: 'high-conflict settlement sessions',
  consultText: 'A private first conversation about the dispute, the people involved, the format, and fees.',
  cta: { heading: 'Move a Stalled Case Toward Settlement', text: 'Book a confidential consultation to talk through the dispute and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
};

// The gold hero's styles are read at render time, once the build has set ctx.srcDir.
export const highConflict = { meta, render: () =>
    servicePage({
      ...cfg,
      // Longer banner lines than the Mediation page: let them wrap on the left, clear of the photo.
      headExtra: `${partial('mediation-head.html')}
<style>.page-high-conflict-settlement-officer .mh__line{white-space:normal}.page-high-conflict-settlement-officer .mh__title{max-width:9.5em}</style>`,
    }),
};
