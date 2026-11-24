// High-Conflict Settlement Officer page. Copy supplied by Sean (2026-11-18);
// hero uses the Mediation page's gold conference-room style.
import { ebookReady, EBOOK_ANCHOR } from './ebook.mjs';
import { ebook } from '../config.mjs';
import { office } from '../config.mjs';
import { layout, breadcrumbs, faqList, faqSchema, ctaBand, partial, esc } from '../lib/render.mjs';

const meta = {
  path: '/high-conflict-settlement-officer/',
  out: 'high-conflict-settlement-officer/index.html',
  title: 'High Conflict Settlement Officer | Family and Civil Cases | Sean Collinson',
  description:
    'When family or civil litigation is deadlocked, Sean Collinson brings 22+ years of mediation experience and crisis negotiation training to help attorneys and parties move toward resolution.',
  h1: 'High-Conflict Settlement Officer in Los Angeles',
};

// Banner photo supplied by Sean (2026-11-18): Sean seated in the conference room.
// Cropped to remove the screenshot frame and the caption label.
const photo = `<div class="hero__media"><picture class="hero__photo">
<source type="image/webp" srcset="/assets/img/settlement/sean-collinson-settlement-480.webp?v=20261118 480w, /assets/img/settlement/sean-collinson-settlement-800.webp?v=20261118 800w, /assets/img/settlement/sean-collinson-settlement-1200.webp?v=20261118 1200w, /assets/img/settlement/sean-collinson-settlement-1600.webp?v=20261118 1600w" sizes="(min-width: 820px) 66vw, 100vw">
<img src="/assets/img/settlement/sean-collinson-settlement-800.jpg?v=20261118" srcset="/assets/img/settlement/sean-collinson-settlement-480.jpg?v=20261118 480w, /assets/img/settlement/sean-collinson-settlement-800.jpg?v=20261118 800w, /assets/img/settlement/sean-collinson-settlement-1200.jpg?v=20261118 1200w, /assets/img/settlement/sean-collinson-settlement-1600.jpg?v=20261118 1600w" sizes="(min-width: 820px) 66vw, 100vw" width="1600" height="852" alt="Sean Collinson, mediator, seated in a conference room" fetchpriority="high">
</picture></div>`;

const arrow = `<svg class="mh__arrow" viewBox="0 0 24 12" aria-hidden="true" focusable="false"><path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const tel = `tel:${esc(office.phone)}`;

const conferenceIncludes = [
  'Private sessions with each side',
  'Joint discussion when useful and appropriate',
  'A clear agenda focused on unresolved issues',
  'Careful listening to identify concerns beneath stated positions',
  'Direct discussion of risks, options, and practical consequences',
  'Testing proposals for feasibility and durability',
  'Help documenting terms the parties reach',
];

const whenToCall = [
  'The parties are deadlocked despite prior negotiations or mediation.',
  'Counsel believes the matter may settle, but the client is not moving.',
  'Offers and counteroffers have stopped producing meaningful progress.',
  'Strong emotions, mistrust, or communication breakdown are driving the case.',
  'The parties are facing a trial, hearing, or expensive next phase of litigation.',
  'A family dispute requires careful attention to ongoing relationships or parenting issues.',
  'A civil dispute involves significant financial exposure, reputational concerns, or business relationships.',
  'Counsel needs a neutral who can remain steady, direct, and focused under pressure.',
];

const steps = [
  ['Counsel contacts the office', 'Counsel provides a brief description of the matter, the parties, the issues still open, and what has prevented progress.'],
  ['The case is assessed for fit', 'The office discusses the requested process, participants, timing, conflicts, and any relevant case management needs.'],
  ['The conference is prepared', 'Counsel and the parties receive instructions about scheduling, submissions, attendance, and the issues to be addressed.'],
  ['The settlement conference takes place', 'Sean conducts a structured process, which may include separate sessions, joint discussion, or both, depending on the case and the parties’ agreement.'],
  ['Any agreement is documented', 'If the parties reach agreement, they and their counsel determine how the terms should be documented and finalized.'],
];

const attorneyChecklist = [
  'Case type and jurisdiction',
  'Counsel and party names for conflict review',
  'Issues resolved and issues still open',
  'Prior settlement efforts',
  'Trial or hearing dates, if set',
  'Whether the parties prefer virtual or in-person sessions',
  'Any accessibility, safety, or participation concerns',
];

const faqs = [
  { q: 'Is Sean acting as a judge or arbitrator?', a: '<p>No. Sean serves as a private neutral settlement officer or mediator, as agreed by the participants. He does not decide the case, issue a ruling, or impose a settlement.</p>', open: true },
  { q: 'Does Sean represent either party?', a: '<p>No. Sean is a neutral and does not represent any participant. Each party should consult their own attorney about legal advice and settlement decisions.</p>' },
  { q: 'Can Sean guarantee that the case will settle?', a: '<p>No. Settlement depends on the parties, their authority, the facts, the law, and the available options. The conference is designed to support focused negotiations, but no result is guaranteed.</p>' },
  { q: 'Can the conference be conducted virtually?', a: '<p>Virtual sessions may be available by arrangement. In-person availability, location, and logistics are confirmed during scheduling.</p>' },
  { q: 'Does this service replace a party’s attorney?', a: '<p>No. Parties should have counsel advise them about their rights, risks, and proposed settlement terms. Sean’s role is to facilitate and support settlement discussions as a neutral.</p>' },
  { q: 'Are settlement discussions confidential?', a: '<p>Confidentiality depends on the process selected, applicable law, and any written agreement or court order. The applicable confidentiality terms should be confirmed before the conference begins.</p>' },
  { q: 'Does Sean accept cases outside California?', a: '<p>Appropriate matters may be considered nationwide by arrangement, subject to jurisdiction, case type, conflicts, and logistics.</p>' },
];

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const section = (id, title, lede, html, ivory) => `<section class="section${ivory ? ' section--ivory' : ''}" id="${id}" aria-labelledby="${id}-title">
  <div class="wrap narrow prose">
    <h2 id="${id}-title" class="section__title">${title}</h2>
    ${lede ? `<p class="section__lede">${lede}</p>` : ''}
    ${html}
  </div>
</section>`;

export function render() {
  const crumbs = breadcrumbs([{ name: 'High-Conflict Settlement Officer', path: meta.path }]);
  const body = `
<section class="page-hero page-hero--photo page-hero--mediation" aria-labelledby="page-title">
${photo}
<div class="wrap">${crumbs.html}</div>
<div class="wrap mh">
<div class="mh__eyebrow"><h1 id="page-title" class="mh__name" style="font:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;margin:0;max-width:min(100%, 42rem)">${meta.h1}</h1><span class="mh__role">Sean Collinson, Mediator</span></div>
<p class="page-hero__title mh__title"><span class="mh__line">High-Conflict Settlement Officer</span> <span class="mh__line mh__gold">I settle high-conflict cases</span></p>
<p class="hc__calm">Sean brings the calm presence of a hostage negotiator and the staircase of calm, lowering the temperature one step at a time until the parties can focus on the decisions in front of them.</p>
<p class="hc__pc">Sean can also serve as a parental coordinator for <a href="/child-custody-mediation/">parenting plans</a> and <a href="/holiday-parenting-schedules/">holiday schedules</a>.</p>
<p class="hc__tagline">When a Case Is Stuck, Bring in a Different Kind of Neutral.</p>
<p class="hc__kicker">High conflict settlement conferences for family and civil cases.</p>
<div class="page-hero__lede mh__lede">
<p>When attorneys cannot get their clients aligned, negotiations have stopped moving, or the parties are locked in a cycle of conflict, Sean Collinson steps in to structure the conversation and work toward a practical resolution.</p>
<p>Sean combines more than 22 years of mediation experience with FBI crisis negotiation training and service as a volunteer negotiator with the Los Angeles County Sheriff’s Department. His approach is calm, direct, and focused on the issues keeping the case from moving forward.</p>
</div>
<div class="btn-row"><a class="btn mh__cta" href="/consultation/" data-consult-open>Request a Case Consultation ${arrow}</a><a class="btn btn--glass" href="/contact/">Discuss a Settlement Conference</a></div>
<p class="hc__note">Serving California and accepting appropriate matters nationwide by arrangement.</p>
</div>
</section>

${section('problem', 'The case may be ready to settle. The people may not be.', '', `<p>Some cases stall because the people involved are carrying more than legal questions into the room. In family cases especially, years of hurt, fear, disappointment, and concern for the future can make every decision feel personal and every compromise feel like a loss. When emotions are running high, people can become trapped in the conflict and lose sight of the choices that could move the case forward.</p>
    <p>Counsel can play an important role in helping clients step back from that cycle. By bringing in a proactive, skilled neutral, attorneys can create a structured opportunity for the parties to feel heard, identify what is truly keeping them stuck, and consider practical options with greater clarity.</p>
    <p>When direct negotiations have reached an impasse, a focused settlement conference can help the parties move through the conflict and toward a resolution they can live with.</p>`)}

${section('what-sean-does', 'What Sean does', 'A focused, structured effort to move negotiations forward', `<p>Sean works with counsel and the parties to identify what is blocking settlement, lower the temperature where possible, and bring attention back to the decisions that need to be made.</p>
    <p>Depending on the case and the parties’ agreement, the conference may include:</p>
    ${list(conferenceIncludes)}
    <p>The goal is not to pressure anyone into an agreement. The goal is to create conditions where the parties can make informed decisions and determine whether an acceptable resolution is possible.</p>`, true)}

${section('when-to-call', 'When to call Sean', 'Consider a settlement conference when:', list(whenToCall))}

${section('family', 'Family law settlement conferences', 'Family disputes need a process that can handle the personal stakes.', `<p>Family cases often involve more than dividing property or resolving a legal claim. They may involve children, support, financial security, trust, and an ongoing relationship between the parties.</p>
    <p>Sean helps counsel and parties address unresolved family law issues in a structured setting. The conference can focus on the specific issues still in dispute, including custody and parenting arrangements, support, property division, and other financial or post-judgment matters.</p>
    <p>The process is designed to keep discussions focused and respectful while recognizing the realities of the case. Any agreement remains the parties’ decision. In matters involving children, their interests and applicable legal standards remain central.</p>`, true)}

${section('civil', 'Civil settlement conferences', 'A practical path for cases with real stakes and no forward movement.', `<p>Civil disputes can become entrenched even when both sides recognize the cost, risk, and uncertainty of continuing litigation.</p>
    <p>Sean works with counsel and parties to clarify the disputed issues, examine settlement options, and identify terms that may be workable in practice. The conference may be appropriate for cases involving significant financial exposure, business or professional disputes, personal injury, contract claims, or other civil matters where the parties are prepared to explore resolution.</p>
    <p>Each matter is reviewed for fit, conflicts, and the type of neutral process requested.</p>`)}

${section('background', 'A different background at the settlement table', 'Calm under pressure. Direct about the decisions.', `<p>Sean Collinson is a family and civil mediator with more than 22 years of experience. He has completed negotiation training through Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program. He is also an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department.</p>
    <p>Crisis negotiation training emphasizes disciplined listening, rapport, emotional awareness, and careful communication when people are under pressure. Those skills inform Sean’s settlement work. They do not replace legal analysis or the parties’ counsel. They help create a structured environment where difficult issues can be discussed directly.</p>
    <blockquote class="pull-quote"><p>Different background. Steady process. A focused effort to find a workable path forward.</p></blockquote>
    ${ebookReady() ? `<p>For the mindset and word-for-word scripts behind this approach, download the <a href="${ebook.path}">${EBOOK_ANCHOR}</a>.</p>
    ` : ''}<p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>`, true)}

<section class="section" id="process" aria-labelledby="process-title">
  <div class="wrap">
    <h2 id="process-title" class="section__title">How the process works</h2>
    <ol class="steps" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr))">
      ${steps.map(([t, d]) => `<li class="step"><h3 class="step__title">${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>

${section('attorneys', 'For attorneys', 'Refer the case when the negotiation needs a reset.', `<p>Helping attorneys and their clients navigate difficult negotiations, overcome settlement impasses, and find practical pathways to resolution. You do not need to wait until the eve of trial to bring in a settlement neutral. A conference may be useful when the legal analysis is complete but the negotiation is stuck, when client authorization is an obstacle, or when prior discussions have hardened the parties’ positions.</p>
    <p>When contacting the office, please include:</p>
    ${list(attorneyChecklist)}
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>Request a Confidential Case Consultation</a></div>`, true)}

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title" class="section__title">Frequently asked questions</h2>
    ${faqList(faqs, { idPrefix: 'faq' })}
    <p class="fine-print">Sean Collinson serves as a neutral mediator or private settlement officer and does not represent either party. He does not act as a judge, arbitrator, or legal adviser to either side. Participation does not guarantee settlement. Each party should consult independent counsel regarding legal rights and proposed settlement terms. The applicable confidentiality rules depend on the process selected and should be confirmed before the conference begins.</p>
  </div>
</section>

${ctaBand({
  heading: 'The Case Is Stuck. Start a Focused Conversation.',
  text: 'If the parties are locked in conflict and ordinary settlement efforts have stopped moving the case forward, discuss whether a structured settlement conference is appropriate.',
  primary: 'Request a Case Consultation',
  secondary: { href: tel, label: 'Call the Office' },
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema, faqSchema(faqs)],
    bodyClass: 'page-high-conflict-settlement-officer',
    // Read at render time, once the build has set ctx.srcDir.
    headExtra: `${partial('mediation-head.html')}
<style>.page-high-conflict-settlement-officer .mh__line{white-space:normal}.page-high-conflict-settlement-officer .mh__title{max-width:9.5em}.page-high-conflict-settlement-officer .mh__title .mh__gold{font-size:.82em;margin-top:.15em}@media (min-width:820px){.page-high-conflict-settlement-officer .hero__media img{object-position:24% 20%}}.hc__tagline{margin:1.6rem 0 .4rem;font-family:var(--display);font-weight:700;font-size:var(--step-2);line-height:1.2;color:var(--t-head);max-width:24em}.hc__kicker{margin:0;font-size:.8rem;font-weight:600;letter-spacing:.17em;text-transform:uppercase;color:var(--t-accent)}.page-high-conflict-settlement-officer .mh__lede p{margin:0 0 .8em}.hc__calm{margin:1.4rem 0 0;max-width:34em;font-size:var(--step-1);line-height:1.5;color:var(--t-head)}.hc__pc{margin:.7rem 0 0;max-width:34em;color:var(--t-body)}.hc__pc a{color:var(--t-accent)}.hc__note{margin-top:1rem;font-size:.9rem;color:var(--t-body)}</style>`,
  });
}

export const highConflict = { meta, render };
