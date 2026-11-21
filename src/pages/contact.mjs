import { contact, site } from '../config.mjs';
import { office } from '../config.mjs';
import { layout, breadcrumbs, esc, ph, isDraft, hasPhone, hasEmail, phoneLink, emailLink, officePhoneLink, bookingLink } from '../lib/render.mjs';
import { field, formShell, warning, consentField } from '../lib/forms.mjs';

export const meta = {
  path: '/contact/',
  out: 'contact/index.html',
  title: 'Contact Sean Collinson | Mediation Services',
  description:
    'Contact The Mediation Office of Sean Collinson to discuss divorce, family, civil, business, workplace, or virtual mediation services.',
  h1: 'Let’s Find a Practical Way Forward',
};

function details() {
  const rows = [];
  rows.push(['Phone', officePhoneLink()]);
  if (hasEmail()) rows.push(['Email', emailLink()]);
  else if (isDraft()) rows.push(['Email', ph('office email address')]);
  if (contact.officeHours) rows.push(['Office hours', esc(contact.officeHours)]);
  else if (isDraft()) rows.push(['Office hours', ph('office hours')]);
  rows.push(['Office', `<address>${esc(office.name)}<br>${esc(office.street)}<br>${esc(office.city)}, ${esc(office.region)} ${esc(office.postalCode)}</address>`]);
  rows.push(['Service area', esc(site.serviceArea)]);
  rows.push(['Virtual sessions', 'Mediation and consultations by Zoom for parties anywhere in the United States.']);
  return `<dl class="contact-details">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
<div class="btn-row"><a class="btn btn--primary" href="tel:${esc(office.phone)}">Tap to call ${esc(office.phoneDisplay)}</a>${bookingLink('btn btn--secondary')}</div>`;
}

export function render() {
  const crumbs = breadcrumbs([{ name: 'Contact', path: meta.path }]);
  const fields = [
    field({ name: 'name', label: 'Name', required: true, autocomplete: 'name', maxlength: 120 }),
    field({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxlength: 160 }),
    field({ name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', maxlength: 40 }),
    field({
      name: 'reason',
      label: 'Reason for contacting',
      type: 'select',
      required: true,
      options: ['Question about mediation', 'Consultation or scheduling', 'Attorney referral', 'Masterclass or training', 'Media or speaking request', 'Other'],
    }),
    field({ name: 'matter_type', label: 'What type of matter', type: 'select', options: ['Divorce', 'Child custody', 'Child support', 'Property or finances', 'Workplace or business', 'Other'] }),
    field({ name: 'children', label: 'Are children under 18 involved?', type: 'radio', options: ['Yes', 'No'] }),
    field({ name: 'court_filed', label: 'Has anything been filed in court yet?', type: 'radio', options: ['Yes', 'No'] }),
    field({ name: 'urgent', label: 'Anything urgent we should know', maxlength: 200, width: 'full' }),
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
<section class="page-hero page-hero--photo page-hero--contact" aria-labelledby="page-title">
  <div class="hero__media"><picture class="hero__photo">
<source type="image/webp" srcset="/assets/img/contact/sean-collinson-contact-480.webp?v=20261118 480w, /assets/img/contact/sean-collinson-contact-800.webp?v=20261118 800w, /assets/img/contact/sean-collinson-contact-1200.webp?v=20261118 1200w, /assets/img/contact/sean-collinson-contact-1600.webp?v=20261118 1600w" sizes="(min-width: 820px) 62vw, 100vw">
<img src="/assets/img/contact/sean-collinson-contact-800.jpg?v=20261118" srcset="/assets/img/contact/sean-collinson-contact-480.jpg?v=20261118 480w, /assets/img/contact/sean-collinson-contact-800.jpg?v=20261118 800w, /assets/img/contact/sean-collinson-contact-1200.jpg?v=20261118 1200w, /assets/img/contact/sean-collinson-contact-1600.jpg?v=20261118 1600w" sizes="(min-width: 820px) 62vw, 100vw" width="1600" height="885" alt="Sean Collinson, mediator, smiling in a dark suit" fetchpriority="high">
</picture></div>
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
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
    headExtra: `<style>.page-hero--contact .hero__media{top:calc(var(--header-h) - 1rem);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 38%),linear-gradient(180deg,transparent 0,#000 2.5rem);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent 0%,#000 38%),linear-gradient(180deg,transparent 0,#000 2.5rem);mask-composite:intersect}.page-hero--contact .hero__media img{object-position:72% 0%}@media (min-width:820px){.page-hero--contact .page-hero__lede{max-width:28em}}@media (max-width:819px){.page-hero--contact{padding-top:calc(var(--header-h) + 62vw)}.page-hero--contact .hero__media{height:72vw;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 2rem,#000 55%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 2rem,#000 55%,transparent 100%)}.page-hero--contact .hero__media img{object-position:68% 0%}}</style>`,
  });
}
