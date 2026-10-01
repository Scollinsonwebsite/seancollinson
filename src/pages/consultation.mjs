import { scheduler } from '../config.mjs';
import { layout, breadcrumbs, phBlock, esc, isDraft } from '../lib/render.mjs';
import { field, formShell, warning, consentField } from '../lib/forms.mjs';

export const meta = {
  path: '/consultation/',
  out: 'consultation/index.html',
  title: 'Schedule a Mediation Consultation | Sean Collinson',
  description:
    'Request a confidential consultation with mediator Sean Collinson to discuss divorce, family, civil, or business mediation and determine the next practical step.',
  h1: 'Start With a Confidential Conversation',
};

const covers = [
  ['The nature of the dispute', 'What is in disagreement, how long it has been going on, and what has already been tried.'],
  ['Who should participate', 'The parties, and whether attorneys, advisors, or other decision-makers should be involved.'],
  ['Immediate concerns or deadlines', 'Court dates, filing deadlines, or time-sensitive decisions that affect scheduling.'],
  ['Documents and preparation', 'What information will make the first session productive.'],
  ['Session format and scheduling', 'In person in California or by Zoom, joint or separate sessions, and timing.'],
  ['Fees and next steps', 'How fees work and what happens if you decide to go ahead.'],
];

export const disputeTypes = [
  'Divorce',
  'Legal separation',
  'Child custody or parenting plan',
  'Child or spousal support',
  'Property or financial issues',
  'Civil dispute',
  'Business, partnership, or contract dispute',
  'Workplace or employment conflict',
  'Landlord-tenant or community dispute',
  'Other',
];

function schedulerSection() {
  if (scheduler.url) {
    return `<section class="section section--ivory" aria-labelledby="schedule-title">
  <div class="wrap narrow">
    <h2 id="schedule-title" class="section__title">Choose a consultation time</h2>
    <p>Pick a time that works for you using ${esc(scheduler.provider || 'the online scheduler')}. Your appointment is confirmed only when you receive a confirmation from the scheduling system.</p>
    <div class="scheduler" data-scheduler data-src="${esc(scheduler.url)}">
      <p><a class="btn btn--secondary" href="${esc(scheduler.url)}" target="_blank" rel="noopener noreferrer">Open the scheduling page<span class="visually-hidden"> (opens in a new tab)</span></a></p>
    </div>
  </div>
</section>`;
  }
  return isDraft()
    ? `<section class="section section--ivory"><div class="wrap narrow">${phBlock(
        'online scheduler',
        'Add the approved Calendly, Acuity, or other scheduler URL to <code>scheduler.url</code> in <code>src/config.mjs</code>. Until then this section is hidden in production and the request form below is the only way to ask for a consultation.'
      )}</div></section>`
    : '';
}

export function render() {
  const crumbs = breadcrumbs([{ name: 'Consultation', path: meta.path }]);
  const fields = [
    field({ name: 'name', label: 'Full name', required: true, autocomplete: 'name', maxlength: 120 }),
    field({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxlength: 160 }),
    field({ name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', maxlength: 40 }),
    field({ name: 'contact_method', label: 'Preferred contact method', type: 'radio', required: true, options: ['Email', 'Phone'] }),
    field({ name: 'dispute_type', label: 'Type of dispute', type: 'select', required: true, options: disputeTypes }),
    field({
      name: 'other_party',
      label: 'Other party’s name',
      required: true,
      maxlength: 160,
      hint: 'Used only to check for conflicts of interest before a consultation is scheduled.',
    }),
    field({ name: 'case_number', label: 'Court case number', maxlength: 60, hint: 'If a case has already been filed.' }),
    field({ name: 'session_format', label: 'Preferred session format', type: 'select', required: true, options: ['In person (California)', 'Virtual (Zoom)', 'Not sure yet'] }),
    field({ name: 'availability', label: 'General availability', maxlength: 200, width: 'full', hint: 'For example: weekday mornings, or Tuesdays and Thursdays after 3 p.m.' }),
    warning(),
    field({
      name: 'summary',
      label: 'Brief non-confidential summary',
      type: 'textarea',
      required: true,
      maxlength: 1500,
      width: 'full',
      hint: 'A few sentences about the type of dispute and what you hope to resolve. Please leave out financial account details, private allegations, and anything confidential.',
    }),
    consentField(),
  ].join('\n');

  const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">A consultation is a private conversation with Sean Collinson about your situation and whether mediation is a sensible next step. It is available for divorce, family, civil, workplace, and business disputes, in person in California or online.</p>
    <div class="btn-row"><a class="btn btn--primary" href="#request">Request a consultation</a></div>
  </div>
</section>

<section class="section" aria-labelledby="covers-title">
  <div class="wrap">
    <h2 id="covers-title" class="section__title">What the consultation covers</h2>
    <dl class="values values--compact">
      ${covers.map(([t, d]) => `<div class="value"><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="can-title">
  <div class="wrap">
    <h2 id="can-title" class="section__title">What mediation can and cannot do</h2>
    <div class="two-col">
      <div class="panel">
        <h3 class="panel__title">Mediation can</h3>
        <ul class="plain-list">
          <li>Give both parties a structured, private place to be heard</li>
          <li>Clarify the real issues and the information needed to decide them</li>
          <li>Help you create options a court might not consider</li>
          <li>Narrow a dispute even when it does not settle everything</li>
          <li>Produce written terms you can review with your own counsel</li>
        </ul>
      </div>
      <div class="panel">
        <h3 class="panel__title">Mediation cannot</h3>
        <ul class="plain-list">
          <li>Force either party to agree to anything</li>
          <li>Replace legal advice from your own attorney</li>
          <li>Guarantee a particular result or timeline</li>
          <li>Substitute for emergency help or court protection when safety is at risk</li>
          <li>Finalize a divorce without the required court process</li>
        </ul>
      </div>
    </div>
    <p class="section__aside">Want to understand the process first? <a href="/mediation/#process">Read how the four-step mediation process works</a>.</p>
  </div>
</section>

${schedulerSection()}

<section class="section" id="request" aria-label="Consultation request">
  <div class="wrap form-layout">
    <div class="form-layout__aside">
      <h2 class="section__title">Before you send</h2>
      <p>Use the form to share the basics. The office uses the other party’s name only to check for conflicts of interest.</p>
      <p>Sending a request does not book an appointment. The office will contact you to arrange a time, and your consultation is confirmed only when you receive that confirmation.</p>
      <p>Prefer to ask a general question first? Use the <a href="/contact/">contact page</a>.</p>
    </div>
    ${formShell({
      type: 'consultation',
      title: 'Request a consultation',
      intro: 'All fields marked required must be completed.',
      fieldsHtml: fields,
      submitLabel: 'Send consultation request',
      successMessage:
        'Thank you. Your consultation request has been sent. It is not yet an appointment: the office will contact you to arrange a time.',
    })}
  </div>
</section>
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema],
    bodyClass: 'page-consultation',
  });
}
