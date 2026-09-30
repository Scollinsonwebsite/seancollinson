import { contact, site } from '../config.mjs';
import { layout, breadcrumbs, esc, ph, isDraft, hasPhone, hasEmail, phoneLink, emailLink } from '../lib/render.mjs';
import { field, formShell, warning, consentField } from '../lib/forms.mjs';

export const meta = {
  path: '/contact/',
  out: 'contact/index.html',
  title: 'Contact Sean Collinson | Mediation Services',
  description:
    'Contact the Mediation Office of S. Collinson to discuss divorce, family, civil, business, workplace, or virtual mediation services.',
  h1: 'Let’s Find a Practical Way Forward',
};

function details() {
  const rows = [];
  if (hasPhone()) rows.push(['Phone', phoneLink()]);
  else if (isDraft()) rows.push(['Phone', ph('office phone number')]);
  if (hasEmail()) rows.push(['Email', emailLink()]);
  else if (isDraft()) rows.push(['Email', ph('office email address')]);
  if (contact.officeHours) rows.push(['Office hours', esc(contact.officeHours)]);
  else if (isDraft()) rows.push(['Office hours', ph('office hours')]);
  if (contact.address) {
    const a = contact.address;
    rows.push(['Office', `<address>${esc(a.street)}<br>${esc(a.city)}, ${esc(a.region)} ${esc(a.postalCode)}</address>`]);
  } else if (isDraft()) {
    rows.push(['Office', ph('verified public office address, only if clients are received there')]);
  }
  rows.push(['Service area', esc(site.serviceArea)]);
  rows.push(['Virtual sessions', 'Mediation and consultations by Zoom for parties anywhere in the United States.']);
  return `<dl class="contact-details">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
}

export function render() {
  const crumbs = breadcrumbs([{ name: 'Contact', path: meta.path }]);
  const fields = [
    field({ name: 'name', label: 'Name', required: true, autocomplete: 'name', maxlength: 120 }),
    field({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxlength: 160 }),
    field({ name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', maxlength: 40 }),
    field({
      name: 'reason',
      label: 'Reason for contacting',
      type: 'select',
      required: true,
      options: ['Question about mediation', 'Consultation or scheduling', 'Attorney referral', 'Masterclass or training', 'Media or speaking request', 'Other'],
    }),
    field({ name: 'contact_method', label: 'Preferred contact method', type: 'radio', required: true, options: ['Email', 'Phone'] }),
    warning(),
    field({ name: 'message', label: 'Message', type: 'textarea', required: true, maxlength: 1500, width: 'full' }),
    consentField(),
  ].join('\n');

  const map =
    contact.address && contact.mapEmbedUrl
      ? `<div class="map"><iframe src="${esc(contact.mapEmbedUrl)}" title="Map showing the office location" width="600" height="400" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`
      : '';

  const body = `
${crumbs.html}
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">
    <p class="eyebrow">Contact the office</p>
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">Questions about divorce, family, civil, workplace, or business mediation, attorney referrals, and masterclass inquiries are all welcome. If you already know you would like to meet, the <a href="/consultation/">consultation request</a> is the quickest route.</p>
  </div>
</section>

<section class="section" aria-label="Contact details and form">
  <div class="wrap form-layout">
    <div class="form-layout__aside">
      <h2 class="section__title">Office details</h2>
      ${details()}
      ${contact.responseTime ? `<p>${esc(contact.responseTime)}</p>` : isDraft() ? `<p>${ph('confirmed response-time standard')}</p>` : ''}
      ${map}
      <div class="notice" role="note">
        <h3 class="notice__title">Not for emergencies</h3>
        <p>This office does not provide emergency services, and messages may not be read immediately. If you have an urgent safety concern, contact the appropriate emergency services directly.</p>
      </div>
    </div>
    ${formShell({
      type: 'contact',
      title: 'Send a message',
      fieldsHtml: fields,
      submitLabel: 'Send message',
      successMessage: 'Thank you. Your message has been sent, and the office will reply using your preferred contact method.',
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
    bodyClass: 'page-contact',
  });
}
