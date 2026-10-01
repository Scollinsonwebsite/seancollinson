import { layout, ctaBand, breadcrumbs, faqList, CTA_PRIMARY } from '../lib/render.mjs';

export const meta = {
  path: '/mediation/',
  out: 'mediation/index.html',
  title: 'Divorce, Family, Civil and Business Mediation | Los Angeles',
  description:
    'Private mediation for divorce, custody, legal separation, civil, workplace, and business disputes in California, with virtual sessions available nationwide.',
  h1: 'A Better Way to Resolve Difficult Disputes',
};

const comparison = [
  ['Control', 'The parties decide the terms together.', 'A judge decides contested issues.'],
  ['Privacy', 'Private sessions; California law generally protects mediation communications, with exceptions.', 'Most filings and hearings are part of the public record.'],
  ['Timing', 'Scheduled around the parties. Often faster, depending on the issues.', 'Set by court calendars, which can move slowly.'],
  ['Cost', 'Typically fewer hearings and less formal discovery.', 'Costs grow with each motion, hearing, and trial day.'],
  ['Flexibility', 'Terms can be tailored to details a court order rarely covers.', 'Remedies are limited to what the court can order.'],
  ['Relationships', 'Designed to reduce conflict, which helps co-parents and partners.', 'An adversarial process can deepen the divide.'],
];

const services = [
  {
    id: 'divorce-and-family',
    title: 'Divorce and family mediation',
    body: `<p>Divorce mediation gives spouses a private, structured way to work through the decisions a divorce requires: parenting, support, property, and debt. Sean helps you set an agenda, understand what information is needed, and work through each issue in an order that makes sense for your family. Mediation works well for amicable and uncontested divorces, and it can also help in high-conflict situations where a steady structure matters most.</p>
<p>California divorces still move through the court. Mediation does not replace that process; it gives you a better way to reach the agreements the court will ultimately review.</p>`,
  },
  {
    id: 'legal-separation',
    title: 'Legal separation',
    body: `<p>Some couples want to live apart and settle finances and parenting without ending the marriage, whether for personal, religious, financial, or insurance reasons. Legal separation mediation covers many of the same topics as divorce mediation. Sean can help you think through the issues either path raises, while decisions about which legal path to take remain yours and your attorneys’.</p>`,
  },
  {
    id: 'custody-and-parenting',
    title: 'Child custody and parenting plans',
    body: `<p>Parenting plan mediation focuses on a schedule and set of decisions that work for your children: weekday and weekend time, holidays, school breaks, transportation, and how you will make decisions about education, health, and activities. Co-parenting mediation can also help parents adjust an existing plan as children grow.</p>
<p>Private mediation is separate from the court-connected child custody services California family courts provide. Some families use both.</p>`,
  },
  {
    id: 'support',
    title: 'Child and spousal support discussions',
    body: `<p>Support is often the most emotionally charged financial topic. Mediation creates room to discuss child support, spousal support (sometimes called alimony), duration, and related expenses with the numbers in front of everyone. California uses guideline calculations for child support; your attorney or a financial professional can help you understand how they apply.</p>`,
  },
  {
    id: 'property-and-finances',
    title: 'Property, debt, retirement, and financial issues',
    body: `<p>Property division mediation covers the family home, real estate, bank and investment accounts, retirement accounts and pensions, vehicles, business interests, and debt. Sean helps both parties see the full picture and consider options, from selling to buying out to structured transfers, so decisions are made with information rather than assumptions. Complex valuations may call for input from appraisers or financial professionals.</p>`,
  },
  {
    id: 'high-asset',
    title: 'High-asset and complex family matters',
    body: `<p>High-asset divorce mediation often involves business ownership, equity compensation, multiple properties, trusts, or significant separate-property claims. These matters benefit from careful preparation, a clear agenda, and coordination with each party’s attorneys and financial advisors. Mediation also keeps sensitive financial details out of open court as far as possible.</p>`,
  },
  {
    id: 'civil-and-business',
    title: 'Civil and business disputes',
    body: `<p>Civil mediation and commercial mediation help parties resolve disputes before filing suit or at any stage of litigation, including cases where a settlement conference is approaching. Sean works with the parties and their counsel to focus on the issues that matter, test each side’s assumptions, and look for terms that make business sense. Pre-litigation mediation can resolve a dispute before legal costs escalate.</p>`,
  },
  {
    id: 'partnership-contract-workplace',
    title: 'Partnership, contract, and workplace disputes',
    body: `<p>Partnership and shareholder disputes, contract disagreements, and workplace conflict all share a common problem: the people involved often have to keep dealing with each other. Business dispute mediation and workplace mediation address the immediate issue while preserving what can be preserved, whether that is a working relationship, a customer, or an orderly separation. Employers, employees, and executives can all request mediation.</p>`,
  },
  {
    id: 'landlord-tenant-community',
    title: 'Landlord-tenant and community conflict',
    body: `<p>Landlord tenant mediation can address rent, repairs, deposits, lease terms, and move-out arrangements. Community mediation helps neighbors, associations, and organizations resolve disagreements that are affecting daily life. These disputes are often resolved in a single, well-prepared session.</p>`,
  },
];

const steps = [
  ['Confidential consultation', 'Discuss the dispute, the people involved, any deadlines or court dates, and whether mediation is appropriate.'],
  ['Preparation', 'Identify the issues, gather key documents, and agree on the format: joint sessions, separate rooms, in person, or by Zoom.'],
  ['Mediation sessions', 'Work through the agenda issue by issue. Sean keeps the conversation productive and helps generate and test options.'],
  ['Written terms', 'Agreed terms are summarized in writing for each party to review, with independent counsel if they wish, before anything is filed or signed.'],
];

const checklist = [
  'Any existing court orders, filings, or case numbers',
  'Recent financial records: income, account statements, tax returns, debts',
  'A proposed parenting schedule, if children are involved',
  'Key correspondence related to the dispute',
  'Relevant contracts, leases, or agreements',
  'A short list of the issues you consider unresolved',
];

const faqs = [
  {
    q: 'How does divorce mediation work in California?',
    a: `<p>Spouses meet with a neutral mediator to work through parenting, support, property, and debt. Once terms are agreed, they are written up for each party to review, often with an attorney, and then submitted through the court process that finalizes a California divorce. The mediator does not file paperwork on anyone’s behalf or give legal advice.</p>`,
  },
  {
    q: 'What is the difference between divorce mediation and litigation?',
    a: `<p>In litigation, each side presents its case and a judge decides contested issues. In mediation, the parties decide together with the help of a neutral. Mediation is generally more private, more flexible, and less adversarial. Litigation remains available if mediation does not resolve everything.</p>`,
  },
  {
    q: 'What should I expect in divorce mediation?',
    a: `<p>Expect a structured conversation, not a courtroom. The first session usually confirms ground rules and confidentiality, sets the agenda, and identifies what information is still needed. Later sessions work through each issue. Sean may meet with both parties together, separately, or both, depending on what is most productive.</p>`,
  },
  {
    q: 'How should I prepare for mediation?',
    a: `<p>Gather the documents relevant to your issues, think about what matters most to you and why, and consider what a workable outcome might look like for the other party as well. Many people also consult their own attorney beforehand. See the <a href="#what-to-bring">What to Bring checklist</a> above.</p>`,
  },
  {
    q: 'Is divorce mediation confidential in California?',
    a: `<p>California has statutes that generally protect communications made during mediation from later use in court, subject to specific exceptions. Mediation sessions are also private rather than public. Because the rules have exceptions and depend on the circumstances, ask your own attorney how they apply to you. Sean reviews the confidentiality terms with both parties before mediation begins.</p>`,
  },
  {
    q: 'How long does divorce mediation take?',
    a: `<p>It varies with the number and complexity of the issues and how quickly information is exchanged. Some couples resolve everything in one or two sessions; others meet several times over a few weeks or months. There is no fixed timeline, and no one can promise one.</p>`,
  },
  {
    q: 'How much does divorce mediation cost?',
    a: `<p>Cost depends on the number of sessions and the preparation required. Mediation is often less expensive than contested litigation because it involves fewer hearings and less formal discovery, but every matter is different. Fees and payment terms are explained during the <a href="/consultation/">consultation</a>.</p>`,
  },
  {
    q: 'What issues can be resolved in mediation?',
    a: `<p>Almost any issue the parties have authority to decide: parenting schedules, decision-making, child and spousal support, property and debt division, business interests, contract terms, payment plans, workplace arrangements, and lease or move-out terms. Some matters also require court approval once an agreement is reached.</p>`,
  },
  {
    q: 'Can mediation resolve child custody and support?',
    a: `<p>Yes. Parents can agree on custody arrangements, parenting schedules, and support in mediation. Agreements involving children are generally reviewed by the court, which considers the children’s best interests, and child support is informed by California’s guideline calculation.</p>`,
  },
  {
    q: 'Should we mediate a legal separation or a divorce?',
    a: `<p>Both involve many of the same decisions about parenting, support, and property. Which legal path is right for you is a question for your own attorney. Mediation can help with either, and many couples find that working through the practical issues clarifies which path they want.</p>`,
  },
  {
    q: 'How does business mediation work?',
    a: `<p>The parties, often with their attorneys, meet with the mediator to clarify the dispute, share perspectives, and explore settlement options. Sessions frequently mix joint discussion with private caucuses, where each side can speak candidly with the mediator. If an agreement is reached, the key terms are written down so counsel can prepare final documents.</p>`,
  },
  {
    q: 'Do we still need attorneys if we use a mediator?',
    a: `<p>Sean is a neutral mediator; he does not represent either party or provide legal advice. Many people consult their own attorneys before, during, or after mediation, especially before signing a final agreement. Whether and how to involve an attorney is your choice.</p>`,
  },
  {
    q: 'How should I choose a divorce mediator?',
    a: `<p>Rather than searching for the “best divorce mediator in Los Angeles,” look for a good fit: relevant experience, formal training, a clearly neutral role, a process explained in plain terms, and someone both parties can trust. Ask how sessions are structured, how confidentiality works, and how fees are handled. A consultation is a good way to find out.</p>`,
  },
  {
    q: 'When is mediation not appropriate?',
    a: `<p>Mediation depends on both parties being able to participate safely and freely. If there is a history of abuse, threats, or intimidation, or if one party cannot make decisions without fear, mediation may not be appropriate, or may need special safeguards. Raise any safety concern during the consultation, and consider speaking with an attorney or advocate.</p>`,
  },
  {
    q: 'Can mediation be done online?',
    a: `<p>Yes. Online mediation by Zoom is available for parties throughout California and nationwide. Virtual sessions can use private breakout rooms, which many people find easier than sitting across the table. Sean confirms the format and technology in advance.</p>`,
  },
];

export function render() {
  const crumbs = breadcrumbs([{ name: 'Mediation', path: meta.path }]);
  const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">Mediation is often the best path because it gives you greater control over the outcome while reducing the cost, delay, stress, and uncertainty of litigation. Instead of leaving critical decisions to a judge, the parties work with a neutral mediator in a private and confidential setting to develop practical agreements designed around their unique needs.</p>
    <div class="btn-row"><a class="btn btn--primary" href="/consultation/">${CTA_PRIMARY}</a></div>
    <nav class="jump" aria-label="On this page">
      <p class="jump__label">On this page</p>
      <ul>
        <li><a href="#how-mediation-works">How mediation works</a></li>
        <li><a href="#comparison">Mediation versus litigation</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#process">The process</a></li>
        <li><a href="#what-to-bring">What to bring</a></li>
        <li><a href="#faq">Questions</a></li>
      </ul>
    </nav>
  </div>
</section>

<section class="section" id="how-mediation-works" aria-labelledby="works-title">
  <div class="wrap split split--text">
    <div><h2 id="works-title" class="section__title">What mediation is, and what the mediator does</h2></div>
    <div class="prose">
      <p>Mediation is a voluntary, structured negotiation guided by a neutral third party. The mediator helps the parties define the issues, exchange information, understand each other’s priorities, and develop options. The parties, not the mediator, decide whether to agree and on what terms.</p>
      <p>As a neutral, Sean does not represent either side, advocate for a particular result, or give legal advice. His job is to run a fair, efficient process: keeping discussions focused, making sure each person is heard, and helping everyone test whether a proposal will actually work in practice.</p>
      <p>Sessions are available in person in California and online by Zoom, which makes virtual mediation practical for parties in different cities or states.</p>
    </div>
  </div>
</section>

<section class="section section--ivory" id="comparison" aria-labelledby="compare-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="compare-title" class="section__title">Mediation versus litigation</h2>
      <p class="section__lede">A general comparison. Every matter is different, and results, timing, and costs vary.</p>
    </div>
    <div class="table-wrap">
      <table class="compare">
        <caption class="visually-hidden">Comparison of mediation and litigation across six factors</caption>
        <thead><tr><th scope="col">Factor</th><th scope="col">Mediation</th><th scope="col">Litigation</th></tr></thead>
        <tbody>
          ${comparison.map(([f, m, l]) => `<tr><th scope="row">${f}</th><td data-label="Mediation">${m}</td><td data-label="Litigation">${l}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" id="services" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="services-title" class="section__title">Mediation services</h2>
      <p class="section__lede">Family matters and civil or business disputes each call for different preparation. The approach stays the same: neutral, structured, and practical.</p>
    </div>
    <div class="service-detail-list">
      ${services
        .map(
          (s) => `<article class="service-detail" id="${s.id}" aria-labelledby="${s.id}-title">
        <h3 id="${s.id}-title" class="service-detail__title">${s.title}</h3>
        <div class="prose">${s.body}</div>
      </article>`
        )
        .join('')}
    </div>
    <div class="inline-cta">
      <p>Not sure which category your situation falls into? That is exactly what the consultation is for.</p>
      <a class="btn btn--primary" href="/consultation/">${CTA_PRIMARY}</a>
    </div>
  </div>
</section>

<section class="section section--ivory" id="process" aria-labelledby="process-title">
  <div class="wrap">
    <h2 id="process-title" class="section__title">The four-step process</h2>
    <ol class="steps">
      ${steps.map(([t, d]) => `<li class="step"><h3 class="step__title">${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" id="what-to-bring" aria-labelledby="bring-title">
  <div class="wrap split split--text">
    <div>
      <h2 id="bring-title" class="section__title">What to Bring</h2>
      <p class="section__lede">Required materials vary by case. Sean will tell you what is useful for yours.</p>
    </div>
    <ul class="checklist">
      ${checklist.map((c) => `<li>${c}</li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section--ivory" id="faq" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title" class="section__title">Questions about mediation</h2>
    ${faqList(faqs, { idPrefix: 'faq' })}
  </div>
</section>

${ctaBand({
  heading: 'Find Out Whether Mediation Fits Your Situation',
  text: 'Book a confidential consultation to talk through the issues, the format, and the next practical step.',
  secondary: { href: '/about/', label: 'Meet Sean Collinson' },
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema],
    bodyClass: 'page-mediation',
  });
}
