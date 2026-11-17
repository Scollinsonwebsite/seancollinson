// Family service pages built on the shared service-page template.
import { servicePage, costAnswer, timingAnswer } from '../lib/service-page.mjs';

const changeNote = 'Ask your attorney how this applies before you sign.';

const page = (cfg) => ({ meta: cfg.meta, render: () => servicePage(cfg) });

export const spousal = page({
  meta: {
    path: '/spousal-support-mediation/',
    out: 'spousal-support-mediation/index.html',
    title: 'Spousal Support Mediator in Los Angeles | Sean Collinson',
    description: 'Private spousal support mediation in Los Angeles. Work through amount, duration, and changing circumstances together with mediator Sean Collinson.',
    h1: 'Spousal Support Mediator in Los Angeles',
  },
  crumb: 'Spousal Support Mediation',
  lede: 'Spousal support is where money and fairness collide. Mediation lets both of you look at the same numbers, talk through what each household actually needs, and agree on an amount and timeline you can both plan around.',
  sections: [
    {
      id: 'how-decided',
      title: 'How spousal support is decided in California',
      jump: 'How it is decided',
      html: `<p>Unlike child support, long-term spousal support in California does not come from a single formula. Courts weigh a list of factors set out in the Family Code, including:</p>
    <ul>
      <li>The length of the marriage</li>
      <li>Each spouse’s earning capacity, income, and assets</li>
      <li>The standard of living established during the marriage</li>
      <li>Each spouse’s age and health</li>
      <li>Contributions one spouse made to the other’s education or career, and time spent out of the workforce raising children</li>
    </ul>
    <p>Temporary support while a case is pending is often estimated with guideline software. Because the long-term picture involves judgment rather than a formula, it is exactly the kind of decision couples are often better placed to make themselves.</p>`,
    },
    {
      id: 'what-to-agree',
      title: 'What you can agree on',
      html: `<p>Mediation gives you room to design terms that fit your situation, not just a number:</p>
    <ul>
      <li><strong>Amount:</strong> a monthly figure, or one that steps down over time</li>
      <li><strong>Duration:</strong> a set end date, a review date, or support tied to a milestone such as finishing a degree</li>
      <li><strong>Modifiability:</strong> whether and when the amount can be revisited</li>
      <li><strong>Lump-sum options:</strong> trading ongoing support for a larger share of property, where that makes sense</li>
      <li><strong>Taxes and insurance:</strong> how support interacts with taxes, health insurance, and life insurance that secures payments</li>
    </ul>`,
    },
    {
      id: 'changes',
      title: 'When circumstances change',
      jump: 'Changes later',
      html: `<p>Jobs end, health changes, and people remarry. Spousal support can often be modified when circumstances change, unless the agreement says it cannot be. The existing order stays in place until a new one is made, so changing the arrangement informally can leave both of you exposed. Mediation is a practical way to share the new information and agree on an updated order to submit to the court.</p>`,
    },
    {
      id: 'with-other-issues',
      title: 'How it fits with the rest of the divorce',
      jump: 'The bigger picture',
      html: `<p>Spousal support is connected to everything else: how property is divided, who keeps the house, and child support if you have children. Working through them together keeps the overall agreement consistent. <a href="/divorce-mediation/">Read about divorce mediation</a>, <a href="/property-division-mediation/">property and finances</a>, or <a href="/child-support-mediation/">child support</a>.</p>
    <p>Sean is a neutral and does not give legal advice. Many people have their own attorney review the support terms before signing.</p>`,
    },
  ],
  faqTitle: 'Questions about spousal support mediation',
  faqs: [
    { q: 'How long does spousal support mediation take?', a: timingAnswer('how complex the finances are'), open: true },
    { q: 'How much does spousal support mediation cost?', a: costAnswer() },
    { q: 'What if we can’t agree on spousal support?', a: `<p>That is common, and it does not mean mediation failed. Most couples narrow the gap once they see the same numbers. Whatever you agree on can be written down, and the remaining issue can still go to the court. Mediation does not take away your right to go to court.</p>` },
    { q: 'Can spousal support be changed later?', a: `<p>Often, yes, when circumstances change, unless your agreement says support cannot be modified. Former spouses can come back to mediation to work out a change, which generally needs court approval. ${changeNote}</p>` },
  ],
  seanTopic: 'conversations about money and fairness',
  cta: { heading: 'Settle Support With the Numbers in Front of You', text: 'Book a confidential consultation to talk through income, needs, and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
});

export const property = page({
  meta: {
    path: '/property-division-mediation/',
    out: 'property-division-mediation/index.html',
    title: 'Property and Finances Mediator in Los Angeles | Sean Collinson',
    description: 'Private property division mediation in Los Angeles. Divide the home, accounts, retirement, business interests, and debt with mediator Sean Collinson.',
    h1: 'Property and Finances Mediator in Los Angeles',
  },
  crumb: 'Property and Finances Mediation',
  lede: 'Dividing a life you built together is rarely just math. Mediation puts every asset and debt on the table, so you can make clear-eyed decisions about the home, the accounts, and the future, without paying for a courtroom fight over each one.',
  sections: [
    {
      id: 'community-property',
      title: 'Community property in plain language',
      jump: 'Community property',
      html: `<p>California is a community property state. In general, what either spouse earned or acquired during the marriage belongs to both, and what each owned before the marriage, or received as a gift or inheritance, is that spouse’s separate property. Real life is messier: separate money gets mixed into joint accounts, and community income pays down a house one spouse owned before. Sorting that out is a large part of property mediation.</p>
    <p>Sean does not give legal advice, so many couples check their characterization questions with their own attorneys.</p>`,
    },
    {
      id: 'what-gets-divided',
      title: 'What gets divided',
      html: `<ul>
      <li><strong>The home:</strong> sell it, refinance it so one spouse keeps it, or keep it jointly for a time</li>
      <li><strong>Bank and investment accounts</strong></li>
      <li><strong>Retirement accounts and pensions</strong>, which may need a court order to divide</li>
      <li><strong>Business interests</strong>, including how to value them</li>
      <li><strong>Vehicles, household items, and personal property</strong></li>
      <li><strong>Debt:</strong> mortgages, credit cards, loans, and taxes</li>
    </ul>`,
    },
    {
      id: 'disclosure',
      title: 'Full disclosure first',
      jump: 'Disclosure',
      html: `<p>California divorces require both spouses to disclose their assets, debts, income, and expenses. Mediation works the same way: decisions are only as good as the information behind them. Both of you share statements, tax returns, and records, so you are working from the same picture.</p>
    <p>When values are complicated, such as a business, a pension, or real estate, couples often bring in a neutral appraiser or financial professional so both sides can trust the figures.</p>`,
    },
    {
      id: 'trade-offs',
      title: 'Trade-offs that work for both of you',
      jump: 'Trade-offs',
      html: `<p>An equal division does not have to mean splitting every item in half. One spouse might keep the house while the other keeps more of the retirement savings, or debts might be assigned to offset an asset. Mediation gives you room to build a division that fits your lives, and to think about taxes, liquidity, and timing along the way. <a href="/spousal-support-mediation/">Read about spousal support</a> or <a href="/divorce-mediation/">divorce mediation</a>.</p>`,
    },
  ],
  faqTitle: 'Questions about property mediation',
  faqs: [
    { q: 'How long does property mediation take?', a: timingAnswer('how many assets and debts there are, how complex the finances are'), open: true },
    { q: 'How much does property mediation cost?', a: costAnswer() },
    { q: 'What if we can’t agree on how to divide something?', a: `<p>Most couples agree on more than they expect, and the remaining items get smaller and clearer. Anything you agree on can be written down, and unresolved issues can still go to the court. Mediation does not take away your right to go to court.</p>` },
    { q: 'Can a property division be changed later?', a: `<p>Generally, no. Property division is usually final once the judgment is entered, except in limited situations such as an asset that was not disclosed. That is why full disclosure and careful review before signing matter so much. ${changeNote}</p>` },
  ],
  seanTopic: 'conversations about money and the future',
  cta: { heading: 'Divide What You Built, Without the Fight', text: 'Book a confidential consultation to talk through your assets, debts, and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
});

export const separation = page({
  meta: {
    path: '/legal-separation-mediation/',
    out: 'legal-separation-mediation/index.html',
    title: 'Legal Separation Mediator in Los Angeles | Sean Collinson',
    description: 'Private legal separation mediation in Los Angeles. Agree on parenting, support, and finances while living apart, with mediator Sean Collinson.',
    h1: 'Legal Separation Mediator in Los Angeles',
  },
  crumb: 'Legal Separation Mediation',
  lede: 'Not every couple who lives apart wants a divorce, at least not yet. Mediation helps you set clear terms for living separately, so both of you know where you stand on the children, the money, and the house.',
  sections: [
    {
      id: 'what-it-is',
      title: 'What legal separation is',
      html: `<p>In California, a legal separation is a court judgment that settles the same issues as a divorce, including custody, support, and property, but you remain legally married. People choose it for many reasons: religious beliefs, health insurance or other benefits, financial planning, or simply wanting time before deciding about divorce.</p>
    <p>Which legal path is right for you is a question for your own attorney. Mediation can help with either, and working through the practical issues often clarifies which path you want.</p>`,
    },
    {
      id: 'what-gets-decided',
      title: 'What gets decided',
      html: `<ul>
      <li>Where the children live and how parenting time is shared</li>
      <li>Child support and spousal support</li>
      <li>Who stays in the home and who pays which bills</li>
      <li>How income, accounts, and debts are handled while you live apart</li>
      <li>Health insurance and other benefits</li>
    </ul>
    <p>See <a href="/child-custody-mediation/">custody and parenting plans</a>, <a href="/child-support-mediation/">child support</a>, and <a href="/spousal-support-mediation/">spousal support</a> for more detail.</p>`,
    },
    {
      id: 'separation-or-divorce',
      title: 'Separation or divorce?',
      jump: 'Separation or divorce',
      html: `<p>The decisions are mostly the same; the difference is whether the marriage ends. A legal separation can later be converted to a divorce, and many of the agreements you reach now can carry over. If you are unsure, mediation lets you settle the urgent issues first and decide on the legal path with a clearer head. <a href="/divorce-mediation/">Read about divorce mediation</a>.</p>`,
    },
    {
      id: 'private',
      title: 'Private, and you decide',
      html: `<p>In court, a judge decides the contested issues, and the proceedings are public. In mediation, the two of you decide together, in a confidential setting. Mediation is more private, more flexible, and less adversarial, which matters if you may reconcile or will keep raising children together.</p>`,
    },
  ],
  faqTitle: 'Questions about legal separation mediation',
  faqs: [
    { q: 'How long does legal separation mediation take?', a: timingAnswer('how complex the finances are'), open: true },
    { q: 'How much does legal separation mediation cost?', a: costAnswer() },
    { q: 'What if we can’t agree on everything?', a: `<p>That is common. Whatever you agree on can be written down, and anything left unresolved can still go to the court. Mediation does not take away your right to go to court.</p>` },
    { q: 'Can a separation agreement be changed later?', a: `<p>Parts of it can. Custody, parenting time, and child support can usually be revisited when circumstances change, and you can come back to mediation to work out the update. Property terms are generally final once a judgment is entered, and spousal support depends on the terms you agree to. ${changeNote}</p>` },
  ],
  seanTopic: 'conversations about what comes next',
  cta: { heading: 'Set Clear Terms for Living Apart', text: 'Book a confidential consultation to talk through your situation and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
});

export const paternity = page({
  meta: {
    path: '/paternity-mediation/',
    out: 'paternity-mediation/index.html',
    title: 'Paternity Mediator in Los Angeles | Sean Collinson',
    description: 'Private mediation for unmarried parents in Los Angeles. Agree on custody, parenting time, and child support after parentage is established, with Sean Collinson.',
    h1: 'Paternity Mediator in Los Angeles',
  },
  crumb: 'Paternity Mediation',
  lede: 'When parents were never married, the questions are the same as in any family: where the children live, how time is shared, and how costs are covered. Mediation helps unmarried parents settle those questions together, in private.',
  sections: [
    {
      id: 'parentage',
      title: 'Parentage comes first',
      html: `<p>For unmarried parents, custody and support orders depend on legal parentage being established. In California that can happen through a voluntary declaration of parentage signed by both parents, through genetic testing, or through a court judgment. Mediation does not determine parentage, and Sean does not give legal advice; if parentage is in question, speak with an attorney or the court’s family law facilitator.</p>
    <p>Once parentage is clear, or both parents agree on it, mediation can help with everything that follows.</p>`,
    },
    {
      id: 'parenting-plan',
      title: 'Building a parenting plan',
      jump: 'Parenting plan',
      html: `<p>The parenting plan covers the weekly schedule, holidays and school breaks, decision-making about education and health care, exchanges, and how you will communicate. For parents who did not live together, or a parent who is just getting to know the child, plans often build time gradually. <a href="/child-custody-mediation/">Read about custody and parenting plans</a> and <a href="/holiday-parenting-schedules/">holiday schedules</a>.</p>`,
    },
    {
      id: 'support',
      title: 'Child support',
      html: `<p>Child support for unmarried parents follows the same California guideline as for divorcing parents, based on both incomes and parenting time. Agreements also cover add-ons such as childcare, health insurance, and school costs. <a href="/child-support-mediation/">Read about child support mediation</a>.</p>`,
    },
    {
      id: 'private',
      title: 'Private, and you decide',
      html: `<p>In court, a judge decides the contested issues. In mediation, the two of you decide together, in a confidential setting, and build a working relationship as parents along the way. Agreements involving children are generally reviewed by the court, which considers the children’s best interests.</p>`,
    },
  ],
  faqTitle: 'Questions about paternity mediation',
  faqs: [
    { q: 'How long does paternity mediation take?', a: timingAnswer('how detailed the parenting plan needs to be'), open: true },
    { q: 'How much does paternity mediation cost?', a: costAnswer() },
    { q: 'What if we can’t agree?', a: `<p>Parents often agree on more than they expect once the conversation is organized. Whatever you agree on can be written down, and anything left unresolved can still go to the court. Mediation does not take away your right to go to court.</p>` },
    { q: 'Can the parenting plan or support be changed later?', a: `<p>Yes. Custody, parenting time, and child support can usually be revisited as children grow and circumstances change, and you can come back to mediation to work out the update. Changes to a court order generally need court approval. ${changeNote}</p>` },
  ],
  seanTopic: 'conversations between parents',
  cta: { heading: 'Build a Plan That Works for Your Child', text: 'Book a confidential consultation to talk through parenting time, support, and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
});

export const holidays = page({
  meta: {
    path: '/holiday-parenting-schedules/',
    out: 'holiday-parenting-schedules/index.html',
    title: 'Holiday Parenting Schedules in Los Angeles | Sean Collinson',
    description: 'Mediation for holiday and school-break parenting schedules in Los Angeles: alternating years, split holidays, travel, and birthdays, with Sean Collinson.',
    h1: 'Holiday Parenting Schedules in Los Angeles',
  },
  crumb: 'Holiday Parenting Schedules',
  lede: 'Holidays are where vague parenting plans fall apart. Mediation helps you settle Thanksgiving, winter break, birthdays, and summer travel in advance, in writing, so the children are not caught in the middle every year.',
  sections: [
    {
      id: 'common-approaches',
      title: 'Common ways to share holidays',
      jump: 'Common approaches',
      html: `<ul>
      <li><strong>Alternating years:</strong> one parent has Thanksgiving in even years, the other in odd years</li>
      <li><strong>Splitting the day:</strong> Christmas Eve with one parent, Christmas Day with the other</li>
      <li><strong>Splitting the break:</strong> the first half of winter break with one parent, the second half with the other, rotating each year</li>
      <li><strong>Fixed holidays:</strong> Mother’s Day with mom and Father’s Day with dad, every year</li>
      <li><strong>Celebrating twice:</strong> each household marks the holiday on its own day</li>
    </ul>`,
    },
    {
      id: 'details',
      title: 'The details that prevent arguments',
      jump: 'The details',
      html: `<p>A schedule that just says “alternate holidays” leads to disputes. A good one answers:</p>
    <ul>
      <li>Exact start and end times, and whether a holiday weekend includes Monday</li>
      <li>Which holidays override the regular weekly schedule</li>
      <li>Birthdays: the children’s and each parent’s</li>
      <li>Religious and cultural holidays that matter to your family</li>
      <li>Three-day weekends and teacher in-service days</li>
      <li>Where exchanges happen and who drives</li>
    </ul>`,
    },
    {
      id: 'breaks-and-travel',
      title: 'School breaks, summer, and travel',
      jump: 'Breaks and travel',
      html: `<p>Winter, spring, and summer breaks need their own plan: how the time is divided, how much notice each parent gives before a vacation, how far in advance summer dates are chosen, and rules for travel out of state or out of the country, including passports and itineraries. <a href="/child-custody-mediation/">Read about custody and parenting plans</a>.</p>`,
    },
    {
      id: 'adjusting',
      title: 'Adjusting as children grow',
      html: `<p>What works for a toddler rarely works for a teenager with a job and friends. Many parents agree to revisit the holiday schedule at set points, or to come back to mediation when it stops working, rather than waiting for a conflict in December.</p>`,
    },
  ],
  faqTitle: 'Questions about holiday schedules',
  faqs: [
    { q: 'How long does it take to mediate a holiday schedule?', a: timingAnswer('how detailed the schedule needs to be'), open: true },
    { q: 'How much does holiday schedule mediation cost?', a: costAnswer() },
    { q: 'What if we can’t agree on a holiday?', a: `<p>Holiday disputes often come down to one or two days. Mediation helps you look for trades, such as alternating years or splitting the day, that give each parent meaningful time. Anything left unresolved can still go to the court.</p>` },
    { q: 'Can the holiday schedule be changed later?', a: `<p>Yes. Parents can agree to changes at any time, and many build a review date into the plan. If the schedule is part of a court order, formal changes generally need court approval. ${changeNote}</p>` },
  ],
  seanTopic: 'conversations between parents',
  cta: { heading: 'Settle the Holidays Before They Arrive', text: 'Book a confidential consultation to talk through your schedule and the next practical step.', secondary: { href: '/child-custody-mediation/', label: 'Custody and Parenting Plans' } },
});
