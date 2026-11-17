import {
  layout, ctaBand, breadcrumbs, faqList, faqSchema, CTA_PRIMARY,
} from '../lib/render.mjs';

export const meta = {
  path: '/child-support-mediation/',
  out: 'child-support-mediation/index.html',
  title: 'Child Support Mediator in Los Angeles, Sean Collinson',
  description:
    'Private child support mediation in Los Angeles. Work through California guideline support, add-ons, income changes, and self-employment income with mediator Sean Collinson.',
  h1: 'Child Support Mediator in Los Angeles, Sean Collinson',
};

const faqs = [
  {
    q: 'How long does child support mediation take?',
    a: `<p>It depends on how many issues are in dispute, how complex the finances are, and how prepared both parents are. When the income documents are ready, some parents settle support in a single session; others take several sessions over a few weeks. There is no fixed timeline, and no one can promise one.</p>`,
    open: true,
  },
  {
    q: 'How much does child support mediation cost?',
    a: `<p>Cost depends on the number of sessions and the preparation required. Mediation is often less expensive than contested litigation because it involves fewer hearings and less formal discovery, but every matter is different. Fees and payment terms are explained during the <a href="/consultation/">consultation</a>.</p>`,
  },
  {
    q: 'What if we disagree about income?',
    a: `<p>Start with documents, not opinions. Each parent shares pay stubs, tax returns, and, for business owners, profit-and-loss statements and bank records, so you are both working from the same numbers. When income is genuinely hard to pin down, parents sometimes bring in a neutral accountant. If you still cannot agree, that issue can go to the court, and anything you did agree on still counts.</p>`,
  },
  {
    q: 'Can child support be changed later?',
    a: `<p>Yes, when circumstances change, such as a new job, a lost job, or a different parenting schedule. Parents can come back to mediation to work out a new amount, and the change generally needs to be approved by the court. The existing order stays in effect until it is changed, so do not wait to start the conversation. Ask your attorney how the timing works in your case.</p>`,
  },
];

export function render() {
  const crumbs = breadcrumbs([{ name: 'Child Support Mediation', path: meta.path }]);
  const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">Child support is about numbers, but it rarely feels that way. Mediation puts the income, the parenting schedule, and the real costs of raising your children on the table, so both parents can see how the figure is reached and agree on something that works month after month.</p>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/" data-consult-open>${CTA_PRIMARY}</a></div>
    <nav class="jump" aria-label="On this page">
      <p class="jump__label">On this page</p>
      <ul>
        <li><a href="#how-calculated">How support is calculated</a></li>
        <li><a href="#add-ons">Add-ons</a></li>
        <li><a href="#income-changes">When income changes</a></li>
        <li><a href="#self-employed">Self-employed parents</a></li>
        <li><a href="#parenting-plan">The parenting plan</a></li>
        <li><a href="#faq">Questions</a></li>
      </ul>
    </nav>
  </div>
</section>

<section class="section" id="how-calculated" aria-labelledby="calc-title">
  <div class="wrap narrow prose">
    <h2 id="calc-title" class="section__title">How child support is calculated in California</h2>
    <p>California uses a statewide guideline formula. Two inputs drive most of the result:</p>
    <ul>
      <li><strong>Income:</strong> each parent’s net disposable income, which is gross income minus items such as taxes, mandatory retirement contributions, and health insurance premiums.</li>
      <li><strong>Parenting time:</strong> the percentage of time the children spend with each parent, often called the timeshare. Together with both incomes, it determines which parent pays support and how much.</li>
    </ul>
    <p>The guideline is usually run with calculation software, and courts review support agreements. Parents can agree on an amount that differs from the guideline, but the court must approve it and generally needs to see that the children’s needs are met. In mediation, Sean helps you gather the inputs and understand the options. He is a neutral and does not give legal advice, so many parents also have their own attorney review the numbers.</p>
  </div>
</section>

<section class="section section--ivory" id="add-ons" aria-labelledby="addons-title">
  <div class="wrap narrow prose">
    <h2 id="addons-title" class="section__title">Add-ons: childcare, health insurance, and school costs</h2>
    <p>The guideline amount is not the whole picture. Agreements often spell out how parents share costs on top of base support:</p>
    <ul>
      <li><strong>Childcare</strong> needed so a parent can work or attend school or job training.</li>
      <li><strong>Health insurance</strong> for the children: who carries it, and how premiums are counted.</li>
      <li><strong>Uninsured medical costs</strong> such as co-pays, dental, vision, and therapy.</li>
      <li><strong>School and education costs</strong> such as tuition, tutoring, supplies, and special educational needs.</li>
      <li><strong>Activities and travel</strong> such as sports, lessons, camps, and travel between homes.</li>
    </ul>
    <p>The useful part is the detail: what percentage each parent pays, how receipts are shared, and how quickly reimbursements happen. Settling that now prevents a lot of arguments later.</p>
  </div>
</section>

<section class="section" id="income-changes" aria-labelledby="changes-title">
  <div class="wrap narrow prose">
    <h2 id="changes-title" class="section__title">What happens when income changes</h2>
    <p>Jobs change, hours get cut, and promotions happen. Child support can be modified when circumstances change, but the existing order stays in place until a new one is made. Changing your arrangement informally, without updating the order, can leave both parents exposed.</p>
    <p>Mediation is a practical way to handle a change: share the new numbers, rerun the calculation, and agree on an updated amount to submit to the court. Some parents also agree in advance on how they will exchange income information each year.</p>
  </div>
</section>

<section class="section section--ivory" id="self-employed" aria-labelledby="self-title">
  <div class="wrap narrow prose">
    <h2 id="self-title" class="section__title">Self-employed parents</h2>
    <p>When a parent owns a business or works for themselves, income is harder to see. Earnings can vary month to month, and the line between business and personal expenses is not always clear.</p>
    <p>Mediation gives you room to work through it: tax returns, profit-and-loss statements, and bank records; which business expenses are reasonable; whether to average income over a period of time; and whether the business pays any personal costs. When the numbers are complex, a neutral accountant can help both parents start from the same figures.</p>
  </div>
</section>

<section class="section" id="parenting-plan" aria-labelledby="plan-title">
  <div class="wrap narrow prose">
    <h2 id="plan-title" class="section__title">How support fits with the parenting plan</h2>
    <p>Support and parenting time are connected, because the timeshare is part of the calculation. Working out the schedule and support together keeps the two consistent, and makes it clear how a future schedule change could affect support. <a href="/child-custody-mediation/">Read about custody and parenting plans</a>.</p>
  </div>
</section>

<section class="section section--ivory" id="about-sean" aria-labelledby="about-sean-title">
  <div class="wrap narrow prose">
    <h2 id="about-sean-title" class="section__title">A steady neutral for difficult conversations</h2>
    <p>Sean Collinson has more than 22 years of mediation experience helping families and individuals resolve disputes they could not settle on their own. His training includes Harvard’s Program on Negotiation and Loyola Law School’s Mediating the Litigated Case program.</p>
    <p>He is also an FBI-trained crisis negotiator who volunteers with the Los Angeles County Sheriff’s Department. That work demands disciplined listening and calm under pressure, and he brings the same skills to conversations about money and children. <a href="/about/">Meet Sean Collinson</a>.</p>
    <p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title" class="section__title">Questions about child support mediation</h2>
    ${faqList(faqs, { idPrefix: 'faq' })}
  </div>
</section>

${ctaBand({
  heading: 'Settle Support With the Numbers in Front of You',
  text: 'Book a confidential consultation to talk through income, parenting time, and the next practical step.',
  secondary: { href: '/mediation/', label: 'Explore Mediation Services' },
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema, faqSchema(faqs)],
    bodyClass: 'page-support',
  });
}
