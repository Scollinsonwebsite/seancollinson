import { legal, site } from '../config.mjs';
import { layout, breadcrumbs } from '../lib/render.mjs';

const draftNote = (reviewed) =>
  reviewed
    ? ''
    : `<div class="notice notice--draft" role="note"><p class="notice__title">Draft pending professional review</p><p>This page is a starting draft. It has not yet been reviewed by a qualified professional and will be updated before it is relied on.</p></div>`;

const pages = [
  {
    key: 'privacy',
    path: '/privacy-policy/',
    out: 'privacy-policy/index.html',
    title: 'Privacy Policy | Mediation Office of S. Collinson',
    h1: 'Privacy Policy',
    description: 'How the Mediation Office of S. Collinson collects, uses, and protects information submitted through this website.',
    body: `
<h2>Information you provide</h2>
<p>When you use a form on this website, the office receives the information you enter, such as your name, email address, phone number, the type of matter, and your message. The forms ask only for general, non-confidential information. Please do not send confidential, privileged, financial, medical, or time-sensitive information through this website.</p>
<h2>How information is used</h2>
<p>Information you submit is used to respond to your inquiry, to check for conflicts of interest, and to arrange a consultation if you request one. It is not sold.</p>
<h2>Technical information</h2>
<p>Like most websites, the hosting provider may record standard server logs, such as IP address, browser type, and pages visited, for security and maintenance. If analytics are added in the future, this policy will be updated to describe them before they are enabled.</p>
<h2>Third-party services</h2>
<p>Embedded videos are loaded from YouTube or Vimeo only after you choose to play them. Once a video loads, that provider’s own privacy policy applies.</p>
<h2>Retention and your choices</h2>
<p>You may ask the office to update or delete information you submitted through this website, subject to any legal obligations to retain it. Details on retention periods and applicable privacy rights, including rights under California law, will be confirmed during professional review.</p>
<h2>Contact</h2>
<p>Questions about this policy can be sent through the <a href="/contact/">contact page</a>.</p>`,
  },
  {
    key: 'terms',
    path: '/terms-of-use/',
    out: 'terms-of-use/index.html',
    title: 'Terms of Use | Mediation Office of S. Collinson',
    h1: 'Terms of Use',
    description: 'Terms that apply to use of the Mediation Office of S. Collinson website.',
    body: `
<h2>Informational purpose</h2>
<p>This website provides general information about mediation and related services. It is not legal, financial, or tax advice, and it is not a substitute for advice from a qualified professional about your situation.</p>
<h2>No representation</h2>
<p>Sean Collinson serves as a neutral mediator and does not represent any party. Using this website, submitting a form, or contacting the office does not create an attorney-client relationship or any other professional relationship, and does not mean the office has accepted a matter.</p>
<h2>Content</h2>
<p>Website content, including text, graphics, and video, belongs to ${site.name} or its licensors and may not be reproduced without permission, except for personal, non-commercial reference.</p>
<h2>External links</h2>
<p>Links to other websites are provided for convenience. The office is not responsible for the content or practices of those sites.</p>
<h2>Changes</h2>
<p>These terms may be updated from time to time. The version posted on this page applies.</p>`,
  },
  {
    key: 'accessibility',
    path: '/accessibility/',
    out: 'accessibility/index.html',
    title: 'Accessibility Statement | Mediation Office of S. Collinson',
    h1: 'Accessibility Statement',
    description: 'The Mediation Office of S. Collinson’s commitment to an accessible website, and how to report a barrier.',
    body: `
<h2>Our commitment</h2>
<p>The office wants everyone to be able to use this website, including people who rely on assistive technology. The site is designed with the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA, as its target.</p>
<h2>Measures taken</h2>
<ul>
<li>Semantic page structure with headings, landmarks, and a skip link</li>
<li>Full keyboard access to navigation, menus, question lists, and forms</li>
<li>Visible focus indicators and color contrast checked against WCAG AA</li>
<li>Form fields with visible labels, clear instructions, and error messages</li>
<li>Reduced motion when your device requests it, and no autoplaying media</li>
</ul>
<h2>Report a barrier</h2>
<p>If any part of this website is difficult to use, please let the office know through the <a href="/contact/">contact page</a>, describing the page and the problem. The office will work to provide the information in another way and to fix the issue.</p>`,
  },
  {
    key: 'disclaimer',
    path: '/disclaimer/',
    out: 'disclaimer/index.html',
    title: 'Disclaimer | Mediation Office of S. Collinson',
    h1: 'Disclaimer',
    description: 'Important information about the scope of mediation services and the content of this website.',
    body: `
<p>The information on this website is provided for general informational purposes and does not constitute legal advice. Sean Collinson serves as a neutral mediator and does not represent either party. Using this website or contacting the office does not create an attorney-client relationship. Each matter is different, and no result is guaranteed.</p>
<h2>Mediator’s role</h2>
<p>A mediator helps parties communicate and negotiate. A mediator does not make decisions for the parties, advocate for either side, or provide legal, financial, or tax advice. Parties are encouraged to consult their own advisors, including before signing any agreement.</p>
<h2>Training and affiliations</h2>
<p>References to training through Harvard’s Program on Negotiation, Loyola Law School, the Florida Supreme Court, and the FBI describe Sean Collinson’s training history. Sean’s volunteer service with the Los Angeles County Sheriff’s Department is separate from this practice. None of these institutions endorses this practice or its services.</p>
<h2>Confidentiality</h2>
<p>Statements on this website about confidentiality are general. Confidentiality in mediation depends on the applicable law and the agreements the parties sign, and it is subject to exceptions.</p>`,
  },
];

export const legalPages = pages.map((p) => ({
  meta: { path: p.path, out: p.out, title: p.title, description: p.description, h1: p.h1, noindex: !legal[p.key].reviewed },
  render() {
    const crumbs = breadcrumbs([{ name: p.h1, path: p.path }]);
    const body = `
${crumbs.html}
<section class="page-hero page-hero--compact" aria-labelledby="page-title">
  <div class="wrap narrow">
    <h1 id="page-title" class="page-hero__title">${p.h1}</h1>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap narrow prose">
    ${draftNote(legal[p.key].reviewed)}
    ${p.body}
  </div>
</section>`;
    return layout({
      path: p.path,
      title: p.title,
      description: p.description,
      body,
      schema: [crumbs.schema],
      noindex: !legal[p.key].reviewed,
      bodyClass: 'page-legal',
    });
  },
}));
