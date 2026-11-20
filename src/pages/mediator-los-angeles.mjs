// "Mediator Los Angeles" page: who Sean is, what he mediates, where he
// works, the Dr. Phil appearance, and how to start. Built on the shared
// service-page template (consultation block, Sean's background, FAQ schema).
import { contact, office } from '../config.mjs';
import { servicePage, costAnswer, timingAnswer } from '../lib/service-page.mjs';
import { esc, bookingLink, reviewsLine, areasHtml, officeAddress, officePhoneLink, businessSchema } from '../lib/render.mjs';
import { drPhilFigure, drPhilStyle, drPhilSchema } from '../lib/dr-phil.mjs';
import { ebookStrip, ebookStripStyle, ebookReady } from './ebook.mjs';

export const VIEWS_CAPTION =
  '<strong>Sean Collinson on Dr. Phil.</strong> Nearly 400,000 views on YouTube. Resolve Conflict Without Losing Control.';

const meta = {
  path: '/mediator-los-angeles/',
  out: 'mediator-los-angeles/index.html',
  title: 'Mediator Los Angeles | Sean Collinson, Family and Civil Mediator',
  description:
    'Mediator Los Angeles: Sean Collinson mediates divorce, custody, civil, and business disputes privately, in Sherman Oaks and by Zoom. As seen on Dr. Phil.',
  h1: 'Mediator Los Angeles',
};

const serviceLinks = [
  ['/divorce-mediation/', 'Divorce mediation'],
  ['/child-custody-mediation/', 'Child custody and parenting plans'],
  ['/child-support-mediation/', 'Child support'],
  ['/spousal-support-mediation/', 'Spousal support'],
  ['/property-division-mediation/', 'Property division'],
  ['/legal-separation-mediation/', 'Legal separation'],
  ['/holiday-parenting-schedules/', 'Holiday parenting schedules'],
  ['/business-mediation/', 'Civil and business disputes'],
  ['/workplace-mediation/', 'Workplace conflict'],
  ['/high-conflict-settlement-officer/', 'High-conflict settlement conferences'],
];

const page = {
  meta,
  render: () =>
    servicePage({
      meta,
      crumb: 'Mediator Los Angeles',
      lede: 'Sean Collinson is a family and civil mediator serving Los Angeles from his office in Sherman Oaks, and by Zoom nationwide. He helps people settle divorce, custody, support, civil, and business disputes privately, without handing the decisions to a judge.',
      sections: [
        {
          id: 'dr-phil',
          title: 'As Seen on Dr. Phil',
          html: `<p>When emotions run high, Sean brings calm to the room and helps people find a reset, so the conversation can move forward.</p>
    ${drPhilFigure(VIEWS_CAPTION)}
    <div class="btn-row">${bookingLink('btn btn--primary')}<a class="btn btn--secondary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a></div>`,
        },
        {
          id: 'why-sean',
          title: 'A Los Angeles mediator with a different background',
          jump: 'Why Sean',
          html: `<p>Sean has more than 22 years of mediation experience. His training includes Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program, and he is an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department.</p>
    <p>That combination shapes how he works: calm when the room is tense, direct about the decisions that need to be made, and neutral throughout. He does not take sides or give legal advice. His job is to run a fair, focused process so the people involved can reach terms they can live with.</p>
    <p>${reviewsLine()}</p>`,
        },
        {
          id: 'what-sean-mediates',
          title: 'What Sean mediates',
          jump: 'Services',
          html: `<ul>${serviceLinks.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
    <p>Not sure which applies to you? <a href="/mediation/">See how mediation works</a>, or ask during the consultation.</p>
    <p>From the blog: <a href="/blog/high-conflict-custody-mediation-los-angeles/">High-conflict custody in Los Angeles: what actually works when you can’t agree on anything</a>.</p>`,
        },
        {
          id: 'where',
          title: 'Where Sean meets clients',
          jump: 'Location and hours',
          html: `<p><strong>Office:</strong> ${officeAddress()}<br><strong>Phone:</strong> ${officePhoneLink()}</p>
    <p><strong>Hours:</strong> ${esc(contact.officeHours)}</p>
    ${areasHtml()}`,
        },
        {
          id: 'how-it-works',
          title: 'How it works',
          html: `<ol>
      <li><strong>Consultation.</strong> A private first conversation about the dispute, who needs to be involved, the format, and fees.</li>
      <li><strong>Preparation.</strong> Each side identifies the decisions to make and gathers the information needed to make them.</li>
      <li><strong>Mediation sessions.</strong> Structured sessions, together or in separate rooms, in person or by Zoom.</li>
      <li><strong>Written terms.</strong> Agreed points are written down so each person can review them, with their own attorney if they choose.</li>
    </ol>`,
        },
      ],
      faqTitle: 'Questions about working with a Los Angeles mediator',
      faqs: [
        { q: 'How much does mediation cost?', a: costAnswer(), open: true },
        { q: 'How long does mediation take?', a: timingAnswer('how complex the facts and finances are') },
        { q: 'Do I still need an attorney?', a: `<p>Sean is a neutral mediator and does not represent either side or give legal advice. Many people consult their own attorney before or during mediation, and before signing a final agreement.</p>` },
        { q: 'Do you only work with people in Los Angeles?', a: `<p>No. Sean meets in person across Southern California, with his office in Sherman Oaks, and mediates by Zoom for parties anywhere in the United States.</p>` },
      ],
      seanTopic: 'every mediation',
      consultText: 'A private first conversation about your situation, the decisions ahead, the format, and fees.',
      cta: { heading: 'Talk With a Los Angeles Mediator', text: 'Book a confidential consultation to talk through your situation and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
      headExtra: drPhilStyle + (ebookReady() ? ebookStripStyle : ''),
      beforeCta: ebookStrip(),
      extraSchema: [businessSchema(), drPhilSchema()],
    }),
};

export const mediatorLosAngeles = page;
