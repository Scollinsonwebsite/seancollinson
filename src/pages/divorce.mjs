import {
  layout, ctaBand, breadcrumbs, faqList, faqSchema, officeAddress, officePhoneLink, CTA_PRIMARY,
} from '../lib/render.mjs';

export const meta = {
  path: '/divorce-mediation/',
  out: 'divorce-mediation/index.html',
  title: 'Divorce Mediator in Los Angeles | Sean Collinson',
  description:
    'Private divorce mediation in Los Angeles. Decide property, finances, parenting, and support together instead of leaving it to a judge, with mediator Sean Collinson.',
  h1: 'Divorce Mediator in Los Angeles',
};

const steps = [
  {
    title: 'Consultation',
    text: 'A private first conversation about your situation, the format, and fees, so you both know what to expect before you commit.',
  },
  {
    title: 'Agenda and information',
    text: 'You list the decisions to make and gather what you need to make them: income, accounts, debts, and the children’s schedule.',
  },
  {
    title: 'Working sessions',
    text: 'You work through each issue in an order that makes sense, together or in separate rooms, in person or by Zoom.',
  },
  {
    title: 'Written terms',
    text: 'Agreed points are written down so each of you can review them, with your own attorney if you choose, before anything is final.',
  },
];

const faqs = [
  {
    q: 'How long does divorce mediation take?',
    a: `<p>It depends on how many issues are in dispute, how complex the finances are, and how prepared both sides are. Some matters settle in a single session; others take several sessions over a few weeks. There is no fixed timeline, and no one can promise one.</p>`,
    open: true,
  },
  {
    q: 'How much does divorce mediation cost?',
    a: `<p>Cost depends on the number of sessions and the preparation required. Mediation is often less expensive than contested litigation because it involves fewer hearings and less formal discovery, but every matter is different. Fees and payment terms are explained during the <a href="/consultation/">consultation</a>.</p>`,
  },
  {
    q: 'What if we can’t agree on everything?',
    a: `<p>That is common, and it is not a failure. Most couples agree on more than they expect, and the remaining issues get smaller and clearer. Whatever you agree on can be written down, and anything left unresolved can still go to the court. Mediation does not take away your right to go to court.</p>`,
  },
  {
    q: 'Can our agreement be changed later?',
    a: `<p>Some parts can and some generally cannot. Custody, parenting time, and child support can usually be revisited when circumstances change, and you can come back to mediation to work out the update. Property division is generally final once the judgment is entered. Spousal support depends on the terms you agree to. Ask your attorney how this applies to your agreement before you sign.</p>`,
  },
];

export function render() {
  const crumbs = breadcrumbs([{ name: 'Divorce Mediation', path: meta.path }]);
  const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">A divorce asks you to make some of the biggest decisions of your life at the hardest possible time. Mediation lets the two of you make them together, in private, at a pace you can manage, instead of handing them to a judge with a crowded calendar.</p>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>
    <nav class="jump" aria-label="On this page">
      <p class="jump__label">On this page</p>
      <ul>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#what-gets-decided">What gets decided</a></li>
        <li><a href="#property-and-finances">Property and finances</a></li>
        <li><a href="#parenting-and-support">Parenting and support</a></li>
        <li><a href="#private">You decide, in private</a></li>
        <li><a href="#good-fit">Mediation or court?</a></li>
        <li><a href="#faq">Questions</a></li>
      </ul>
    </nav>
  </div>
</section>

<section class="section" id="how-it-works" aria-labelledby="how-title">
  <div class="wrap narrow prose">
    <h2 id="how-title" class="section__title">How divorce mediation works</h2>
    <p>You and your spouse meet with a neutral mediator who keeps the conversation organized and fair. Sean does not take sides, does not decide anything for you, and does not give legal advice. His job is to help you reach terms you can both live with.</p>
    ${steps.map((s, i) => `<h3>${i + 1}. ${s.title}</h3>\n<p>${s.text}</p>`).join('\n')}
    <p>California divorces still go through the court. Mediation does not replace that process; it is a better way to reach the agreements the court will review and finalize.</p>
  </div>
</section>

<section class="section section--ivory" id="what-gets-decided" aria-labelledby="decided-title">
  <div class="wrap narrow prose">
    <h2 id="decided-title" class="section__title">What gets decided</h2>
    <p>Every divorce is different, but most come down to the same set of decisions:</p>
    <ul>
      <li>Who keeps the home, or whether it is sold</li>
      <li>How savings, investments, retirement accounts, and business interests are divided</li>
      <li>Who pays which debts</li>
      <li>Where the children live and how parenting time is shared</li>
      <li>Child support and spousal support</li>
      <li>How you will handle decisions and communication going forward</li>
    </ul>
  </div>
</section>

<section class="section" id="property-and-finances" aria-labelledby="property-title">
  <div class="wrap narrow prose">
    <h2 id="property-title" class="section__title">Property and finances</h2>
    <p>Money conversations go better when everyone is looking at the same numbers. Both spouses share the information that matters: bank and investment statements, retirement accounts, the mortgage, debts, tax returns, and business records if either of you owns a business.</p>
    <p>From there, you work through the home, accounts, retirement assets, and debt one item at a time. When values are complicated, such as a business, a pension, or real estate, couples often bring in a neutral appraiser or financial professional so both sides can trust the figures.</p>
  </div>
</section>

<section class="section section--ivory" id="parenting-and-support" aria-labelledby="parenting-title">
  <div class="wrap narrow prose">
    <h2 id="parenting-title" class="section__title">Parenting and support</h2>
    <p>If you have children, the parenting plan is often the most important part of the agreement: the weekly schedule, holidays, school breaks, decision-making, and exchanges. <a href="/child-custody-mediation/">Read about custody and parenting plans</a>.</p>
    <p>Child support in California follows a statewide guideline based on income and parenting time, and spousal support depends on your circumstances. Working out parenting and support together keeps the two consistent. <a href="/child-support-mediation/">Read about child support mediation</a>.</p>
  </div>
</section>

<section class="section" id="private" aria-labelledby="private-title">
  <div class="wrap narrow prose">
    <h2 id="private-title" class="section__title">It stays private, and you decide</h2>
    <p>In court, a judge decides the contested issues, and the proceedings are public. In mediation, you and your spouse decide the outcome together, in a confidential setting. Your finances and family details stay in the room, not in a courtroom.</p>
    <p>That control matters. You know your family, your children, and your finances better than any judge can. Mediation is more private, more flexible, and less adversarial, and it leaves you in a better position to work together afterward, especially if you are raising children.</p>
  </div>
</section>

<section class="section section--ivory" id="good-fit" aria-labelledby="fit-title">
  <div class="wrap narrow prose">
    <h2 id="fit-title" class="section__title">When mediation is a good fit, and when court may be better</h2>
    <p>Mediation tends to work well when:</p>
    <ul>
      <li>You both want to make the decisions yourselves rather than leave them to a judge</li>
      <li>You are willing to share financial information honestly</li>
      <li>You can each speak up for what you need, even if the conversation is hard</li>
      <li>You care about privacy, cost, and keeping things as calm as possible</li>
    </ul>
    <p>You do not need to agree on everything to start. Most couples begin far apart on at least one issue.</p>
    <p>Court may be the better path if there is a history of abuse, threats, or intimidation, if one spouse cannot participate safely and freely, or if one spouse refuses to share financial information. Raise any safety concern during the consultation, and consider speaking with an attorney or advocate. Court also remains available for anything mediation does not resolve.</p>
  </div>
</section>

<section class="section" id="consultation" aria-labelledby="contact-title">
  <div class="wrap narrow prose">
    <h2 id="contact-title" class="section__title">Book a confidential consultation</h2>
    <p>A private first conversation about your situation, the decisions ahead, the format, and fees. Call the office or request a consultation online.</p>
    <address style="font-style:normal">${officeAddress()}<br>Phone: ${officePhoneLink()}</address>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>
  </div>
</section>

<section class="section section--ivory" id="about-sean" aria-labelledby="about-sean-title">
  <div class="wrap narrow prose">
    <h2 id="about-sean-title" class="section__title">A steady neutral for difficult conversations</h2>
    <p>Sean Collinson has more than 22 years of mediation experience helping families and individuals resolve disputes they could not settle on their own. His training includes Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program.</p>
    <p>He is also an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department. That work demands disciplined listening and calm under pressure, and he brings the same skills to every divorce mediation. <a href="/about/">Meet Sean Collinson</a>.</p>
    <p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title" class="section__title">Questions about divorce mediation</h2>
    ${faqList(faqs, { idPrefix: 'faq' })}
  </div>
</section>

${ctaBand({
  heading: 'Make the Decisions Yourselves, in Private',
  text: 'Book a confidential consultation to talk through your situation, the format, and the next practical step.',
  secondary: { href: '/mediation/', label: 'Explore Mediation Services' },
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema, faqSchema(faqs)],
    bodyClass: 'page-divorce',
  });
}
