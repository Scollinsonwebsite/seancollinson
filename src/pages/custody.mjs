import {
  layout, ctaBand, breadcrumbs, faqList, faqSchema, officeAddress, officePhoneLink, CTA_PRIMARY,
} from '../lib/render.mjs';

export const meta = {
  path: '/child-custody-mediation/',
  out: 'child-custody-mediation/index.html',
  title: 'Child Custody Mediator in Los Angeles | Sean Collinson',
  description:
    'Private child custody mediation in Los Angeles. Build a parenting plan covering schedules, holidays, school breaks, decision-making, and exchanges with mediator Sean Collinson.',
  h1: 'Child Custody Mediator in Los Angeles',
};

const planItems = [
  {
    title: 'Weekday and weekend schedule',
    text: 'Where the children sleep on school nights and weekends, and how the schedule fits each parent’s work and the children’s routines.',
  },
  {
    title: 'Holidays and special days',
    text: 'Thanksgiving, winter holidays, birthdays, Mother’s Day and Father’s Day, and religious or cultural celebrations: who has the children, and how years alternate.',
  },
  {
    title: 'School breaks and summer',
    text: 'Winter, spring, and summer breaks, vacations and travel, and how much notice each parent gives before taking the children away.',
  },
  {
    title: 'Decision-making',
    text: 'How you will decide together about education, health care, counseling, and activities, and what happens when you disagree.',
  },
  {
    title: 'Exchanges and transportation',
    text: 'Where and when handoffs happen, who drives, and how to keep exchanges calm and predictable for the children.',
  },
  {
    title: 'Communication',
    text: 'How you share information about school, health, and schedules, and how and when the children reach the other parent.',
  },
];

const faqs = [
  {
    q: 'How long does custody mediation take?',
    a: `<p>It depends on how many issues are in dispute, how complex the schedule is, and how prepared both parents are. Some parents settle a parenting plan in a single session; others take several sessions over a few weeks. There is no fixed timeline, and no one can promise one.</p>`,
    open: true,
  },
  {
    q: 'How much does custody mediation cost?',
    a: `<p>Cost depends on the number of sessions and the preparation required. Mediation is often less expensive than contested litigation because it involves fewer hearings and less formal discovery, but every matter is different. Fees and payment terms are explained during the <a href="/consultation/">consultation</a>.</p>`,
  },
  {
    q: 'What if we can’t agree on everything?',
    a: `<p>That is common, and it is not a failure. Most parents agree on more than they expect, and the remaining issues get smaller and clearer. Whatever you do agree on can be written down, and anything left unresolved can still go through the court process. Mediation does not take away your right to go to court.</p>`,
  },
  {
    q: 'Can a parenting plan be changed later?',
    a: `<p>Yes. Children grow, schools change, and schedules that worked at five rarely work at fifteen. Parents can come back to mediation to adjust an existing plan. If your plan is part of a court order, changes generally need court approval, so ask your attorney how that applies to you.</p>`,
  },
];

export function render() {
  const crumbs = breadcrumbs([{ name: 'Child Custody Mediation', path: meta.path }]);
  const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">Your children need a plan that works on a Tuesday night, at Thanksgiving, and in the middle of summer. Custody mediation lets you and the other parent build that plan together, in private, with a neutral who keeps the conversation focused on the children rather than the conflict.</p>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>
    <nav class="jump" aria-label="On this page">
      <p class="jump__label">On this page</p>
      <ul>
        <li><a href="#parenting-plans">Parenting plans</a></li>
        <li><a href="#co-parenting">Co-parenting</a></li>
        <li><a href="#private-or-court">Private or court mediation</a></li>
        <li><a href="#about-sean">About Sean</a></li>
        <li><a href="#faq">Questions</a></li>
      </ul>
    </nav>
  </div>
</section>

<section class="section" id="parenting-plans" aria-labelledby="plans-title">
  <div class="wrap narrow prose">
    <h2 id="plans-title" class="section__title">What a parenting plan covers</h2>
    <p>A good parenting plan answers the questions that cause friction before they come up. Sean works through each one with both parents, one decision at a time, until the plan is specific enough to follow without arguing over what it means.</p>
    ${planItems.map((p) => `<h3>${p.title}</h3>\n<p>${p.text}</p>`).join('\n')}
  </div>
</section>

<section class="section section--ivory" id="co-parenting" aria-labelledby="co-parenting-title">
  <div class="wrap narrow prose">
    <h2 id="co-parenting-title" class="section__title">Co-parenting after the agreement</h2>
    <p>You will be parents together long after the paperwork is done. Mediation gives you practice making decisions as a team, and the plan you build reflects how your family actually lives. When the children grow, change schools, or pick up new activities, you can come back and adjust the plan rather than start a new fight.</p>
    <p>Sessions can be held together or in separate rooms, in person or by Zoom. If being in the same room is hard, Sean can work with each parent separately and carry proposals between you.</p>
    <p>Child support is usually worked out alongside the parenting plan, because parenting time is part of the calculation. <a href="/child-support-mediation/">Read about child support mediation</a>.</p>
  </div>
</section>

<section class="section" id="private-or-court" aria-labelledby="private-title">
  <div class="wrap narrow prose">
    <h2 id="private-title" class="section__title">Private mediation or court mediation</h2>
    <p>California family courts provide their own court-connected child custody services. Private mediation is separate, and some families use both.</p>
    <ul>
      <li><strong>Who decides:</strong> in private mediation, you and the other parent decide together. If parents cannot agree in court, a judge decides.</li>
      <li><strong>Privacy:</strong> private mediation happens in a confidential setting. Court proceedings are public.</li>
      <li><strong>Time and pace:</strong> private sessions are scheduled around your family, and you can take the time a detailed plan needs.</li>
      <li><strong>Tone:</strong> mediation is more private, more flexible, and less adversarial, which matters when you will keep raising children together.</li>
    </ul>
    <p>Private mediation does not replace legal advice. Many parents consult their own attorneys before signing a final agreement. <a href="/mediation/">See how mediation works</a>, or <a href="/divorce-mediation/">read about divorce mediation</a>. For custody disputes that have become entrenched, see <a href="/high-conflict-settlement-officer/">high-conflict settlement</a>.</p>
  </div>
</section>

<section class="section section--ivory" id="about-sean" aria-labelledby="about-sean-title">
  <div class="wrap narrow prose">
    <h2 id="about-sean-title" class="section__title">A steady neutral for difficult conversations</h2>
    <p>Sean Collinson has more than 22 years of mediation experience helping families and individuals resolve disputes they could not settle on their own. His training includes Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program.</p>
    <p>He is also an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department. That work demands disciplined listening and calm under pressure, and he brings the same skills to custody conversations. <a href="/about/">Meet Sean Collinson</a>.</p>
    <p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>
  </div>
</section>

<section class="section" id="consultation" aria-labelledby="contact-title">
  <div class="wrap narrow prose">
    <h2 id="contact-title" class="section__title">Start with a confidential consultation</h2>
    <p>A private first conversation about your children, the issues you need to settle, the format, and fees.</p>
    <address style="font-style:normal">${officeAddress()}<br>Phone: ${officePhoneLink()}</address>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>
  </div>
</section>

<section class="section section--ivory" id="faq" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title" class="section__title">Questions about custody mediation</h2>
    ${faqList(faqs, { idPrefix: 'faq' })}
  </div>
</section>

${ctaBand({
  heading: 'Build a Parenting Plan That Works for Your Children',
  text: 'Book a confidential consultation to talk through your schedule, the format, and the next practical step.',
  secondary: { href: '/mediation/', label: 'Explore Mediation Services' },
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema, faqSchema(faqs)],
    bodyClass: 'page-custody',
  });
}
