import { masterclass } from '../config.mjs';
import { layout, breadcrumbs, photo, faqList, phBlock, esc, isDraft, ph } from '../lib/render.mjs';
import { field, formShell, consentField } from '../lib/forms.mjs';

export const meta = {
  path: '/masterclass/',
  out: 'masterclass/index.html',
  title: 'Negotiation and Conflict Resolution Masterclass | Sean Collinson',
  description:
    'Learn practical negotiation, listening, de-escalation, and conflict-resolution strategies in Sean Collinson’s Think Like a Hostage Negotiator masterclass.',
  h1: 'Stay Calm. Read the Conflict. Move the Conversation Forward.',
};

const audience = [
  ['Leaders and executives', 'Who need to hold difficult conversations without losing the room.'],
  ['Attorneys and mediators', 'Who negotiate for, or between, people under stress.'],
  ['Business owners and managers', 'Handling disputes with partners, vendors, customers, or staff.'],
  ['HR and workplace teams', 'Who step into conflict between colleagues every week.'],
  ['Public-safety and security professionals', 'Who de-escalate tense situations as part of the job.'],
  ['Individuals', 'Who regularly manage high-conflict conversations at work or at home.'],
];

const outcomes = [
  'Control your emotional response under pressure',
  'Identify triggers and hidden interests',
  'Use active listening and calibrated questions',
  'Build rapport without surrendering boundaries',
  'De-escalate resistance',
  'Move from positions to workable options',
  'Close with clarity and accountability',
];

const formats = [
  { key: 'keynote', title: 'Keynote', text: 'A focused talk for conferences, leadership retreats, and association events, built around the core principles of the program.' },
  { key: 'workshop', title: 'Workshop', text: 'An interactive session with practice scenarios, so participants use the techniques rather than just hear about them.' },
  { key: 'team', title: 'Team training', text: 'A program shaped around your organization’s real situations, for HR, management, client-facing, or security teams.' },
  { key: 'digital', title: 'Digital masterclass', text: 'A self-paced online version for individuals who want to build these skills on their own schedule.' },
];

const faqs = [
  { q: 'What formats are available?', a: '<p>The program is offered as a keynote, a hands-on workshop, customized team training, and a digital masterclass. Availability for each format is confirmed when you request information.</p>' },
  { q: 'Who is the masterclass for?', a: '<p>Anyone who handles tense conversations: leaders, attorneys, mediators, managers, HR professionals, public-safety and security staff, and individuals who want to communicate more calmly under pressure. No prior negotiation training is required.</p>' },
  { q: 'Can the training be customized for our organization?', a: '<p>Yes. Workshops and team training can be built around your industry, your team’s common scenarios, and the specific challenges you want to address. Share the details in the request form below.</p>' },
  { q: 'What group sizes can you accommodate?', a: '<p>Keynotes suit large audiences. Workshops and team training work best with smaller groups where everyone can practice. Tell us your expected group size and Sean will recommend the right format.</p>' },
  { q: 'Is the program available virtually?', a: '<p>Yes. Workshops and team training can be delivered live over video, and the digital masterclass is designed for online learning.</p>' },
  { q: 'Is this an official FBI or Sheriff’s Department program?', a: '<p>No. The masterclass is Sean Collinson’s own educational program, informed by his mediation practice and his crisis-negotiation training. It is not affiliated with or endorsed by the FBI or the Los Angeles County Sheriff’s Department.</p>' },
];

function calmSection() {
  if (Array.isArray(masterclass.calm) && masterclass.calm.length) {
    return `<section class="section section--ivory" aria-labelledby="calm-title">
  <div class="wrap">
    <h2 id="calm-title" class="section__title">The CALM framework</h2>
    <ol class="calm">${masterclass.calm
      .map((c) => `<li class="calm__item"><span class="calm__letter" aria-hidden="true">${esc(c.letter)}</span><h3 class="calm__word">${esc(c.word)}</h3><p>${esc(c.text)}</p></li>`)
      .join('')}</ol>
  </div>
</section>`;
  }
  return isDraft()
    ? `<section class="section section--ivory"><div class="wrap">${phBlock(
        'CALM framework definitions',
        'Supply Sean’s approved meaning for each letter of CALM, with a one-sentence explanation of each, in <code>masterclass.calm</code> in <code>src/config.mjs</code>. The section stays hidden in production until then.'
      )}</div></section>`
    : '';
}

export function render() {
  const crumbs = breadcrumbs([{ name: 'Masterclass', path: meta.path }]);
  const fields = [
    field({ name: 'name', label: 'Full name', required: true, autocomplete: 'name', maxlength: 120 }),
    field({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxlength: 160 }),
    field({ name: 'organization', label: 'Organization', autocomplete: 'organization', maxlength: 160 }),
    field({ name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', maxlength: 40 }),
    field({ name: 'format', label: 'Format of interest', type: 'select', required: true, options: ['Keynote', 'Workshop', 'Team training', 'Digital masterclass', 'Not sure yet'] }),
    field({ name: 'group_size', label: 'Approximate group size', maxlength: 40 }),
    field({ name: 'message', label: 'What would you like the training to address?', type: 'textarea', required: true, maxlength: 1500, width: 'full' }),
    consentField('I agree to be contacted about training information as described in the Privacy Policy.'),
  ].join('\n');

  const formatCards = formats
    .map((f) => {
      const d = masterclass.formats[f.key] || {};
      const detail = [
        d.availability ? `<p class="format__detail">${esc(d.availability)}</p>` : `<p class="format__detail">Availability confirmed on request ${ph(f.title + ' availability')}</p>`,
        d.price ? `<p class="format__detail">${esc(d.price)}</p>` : isDraft() ? `<p class="format__detail">${ph(f.title + ' pricing')}</p>` : '',
        d.enrollUrl ? `<p><a class="text-link" href="${esc(d.enrollUrl)}">Enroll in the digital masterclass</a></p>` : '',
      ].join('');
      return `<li class="format"><h3 class="format__title">${f.title}</h3><p>${f.text}</p>${detail}</li>`;
    })
    .join('');

  const body = `
<section class="page-hero page-hero--dark" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede"><strong>Think Like a Hostage Negotiator</strong> is a practical negotiation and conflict resolution masterclass informed by more than two decades of mediation and by crisis-negotiation training. Learn the listening, de-escalation, and negotiation skills that keep hard conversations productive.</p>
    <div class="btn-row"><a class="btn btn--light" href="#training-request">Request Training Information</a></div>
  </div>
</section>

<section class="section" aria-labelledby="audience-title">
  <div class="wrap">
    <h2 id="audience-title" class="section__title">Who the program is for</h2>
    <dl class="values">
      ${audience.map(([t, d]) => `<div class="value"><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="outcomes-title">
  <div class="wrap split split--text">
    <div>
      <h2 id="outcomes-title" class="section__title">What participants learn</h2>
      <p class="section__lede">The skills build on one another, from managing your own reactions to closing an agreement everyone understands.</p>
    </div>
    <ol class="outcomes">
      ${outcomes.map((o) => `<li>${o}</li>`).join('')}
    </ol>
  </div>
</section>

${calmSection()}

<section class="section" aria-labelledby="formats-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="formats-title" class="section__title">Program formats</h2>
      <p class="section__lede">Choose the depth and delivery that fits your group. Pricing is provided with each proposal.</p>
    </div>
    <ul class="formats">${formatCards}</ul>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="instructor-title">
  <div class="wrap split">
    <div class="split__media">${photo('portrait', { sizes: '(min-width: 1000px) 30vw, 90vw', className: 'split__photo split__photo--narrow' })}</div>
    <div class="split__copy">
      <h2 id="instructor-title" class="section__title">Your instructor</h2>
      <p>Sean Collinson is a family and civil mediator with more than 22 years of experience. He trained through Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program, and he is an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department.</p>
      <p>The masterclass draws on what works in both settings: calm, structured communication that helps people move from reaction to resolution.</p>
      <p><a class="text-link" href="/about/">Read more about Sean Collinson</a></p>
      <p class="fine-print">This is an independent educational program. It is not affiliated with or endorsed by the FBI or the Los Angeles County Sheriff’s Department.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="mc-faq-title">
  <div class="wrap narrow">
    <h2 id="mc-faq-title" class="section__title">Masterclass questions</h2>
    ${faqList(masterclass.certificates ? [...faqs, { q: 'Do participants receive a certificate?', a: '<p>Yes. Participants who complete the program receive a certificate of completion.</p>' }] : faqs, { idPrefix: 'mc-faq' })}
  </div>
</section>

<section class="section section--ivory" id="training-request" aria-label="Training information request">
  <div class="wrap form-layout">
    <div class="form-layout__aside">
      <h2 class="section__title">Bring the masterclass to your team</h2>
      <p>Tell us about your group and what you would like the training to address. You will receive details on availability, format, and pricing.</p>
      <p>Looking for help with a dispute rather than training? <a href="/consultation/">Request a mediation consultation</a>.</p>
    </div>
    ${formShell({
      type: 'masterclass',
      title: 'Request training information',
      fieldsHtml: fields,
      submitLabel: 'Send training request',
      successMessage: 'Thank you. Your request has been sent, and the office will follow up with training information.',
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
    bodyClass: 'page-masterclass',
  });
}

