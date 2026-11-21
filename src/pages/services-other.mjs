// Civil, workplace, and guide pages built on the shared service-page template.
import { servicePage, costAnswer, timingAnswer } from '../lib/service-page.mjs';
import { services } from '../lib/render.mjs';

const page = (cfg) => ({ meta: cfg.meta, render: () => servicePage(cfg) });

export const business = page({
  meta: {
    path: '/business-mediation/',
    out: 'business-mediation/index.html',
    title: 'Civil and Business Mediator in Los Angeles | Sean Collinson',
    description: 'Private civil and business mediation in Los Angeles: partnership, contract, landlord-tenant, and commercial disputes, with mediator Sean Collinson.',
    h1: 'Civil and Business Mediator in Los Angeles',
  },
  crumb: 'Civil and Business Mediation',
  lede: 'Business disputes cost more than legal fees. They drain time, attention, and relationships you may still need. Mediation gives the people involved a private, structured way to settle the dispute and get back to work.',
  sections: [
    {
      id: 'disputes',
      title: 'Disputes Sean mediates',
      html: `<ul>
      <li>Partnership and shareholder disagreements, including business breakups</li>
      <li>Contract disputes between companies, vendors, and clients</li>
      <li>Landlord and tenant disputes over rent, repairs, deposits, and lease terms</li>
      <li>Neighbor, association, and community disputes</li>
      <li>Civil disputes before or during litigation</li>
    </ul>
    <p>For conflict between employers and employees or within teams, see <a href="/workplace-mediation/">workplace mediation</a>.</p>`,
    },
    {
      id: 'how-it-works',
      title: 'How business mediation works',
      jump: 'How it works',
      html: `<p>The parties, often with their attorneys, meet with the mediator to clarify the dispute, share perspectives, and explore settlement options. Sessions frequently mix joint discussion with private caucuses, where each side can speak candidly with the mediator. If an agreement is reached, the key terms are written down so counsel can prepare final documents.</p>`,
    },
    {
      id: 'why-mediate',
      title: 'Why mediate instead of litigate',
      jump: 'Why mediate',
      html: `<ul>
      <li><strong>Privacy:</strong> court filings are public; mediation happens in a confidential setting</li>
      <li><strong>Control:</strong> the parties decide the outcome instead of a judge or jury</li>
      <li><strong>Speed and cost:</strong> many disputes resolve in a single, well-prepared session</li>
      <li><strong>Creative terms:</strong> payment plans, future business, and other options a court cannot order</li>
      <li><strong>Relationships:</strong> a better chance of preserving what can be preserved</li>
    </ul>`,
    },
    {
      id: 'preparing',
      title: 'Preparing for the session',
      jump: 'Preparing',
      html: `<p>Come with the key documents, a clear sense of what you need from a resolution and why, and someone with authority to settle. A short written summary for the mediator in advance helps the session move faster. Sean will tell you what is useful for your matter.</p>`,
    },
  ],
  faqTitle: 'Questions about civil and business mediation',
  faqs: [
    { q: 'How long does business mediation take?', a: timingAnswer('how complex the facts and documents are'), open: true },
    { q: 'How much does business mediation cost?', a: costAnswer() },
    { q: 'What if we can’t reach a settlement?', a: `<p>Even without a full settlement, mediation often narrows the dispute and clarifies the real issues, which makes any remaining litigation shorter and cheaper. Litigation remains available for anything mediation does not resolve.</p>` },
    { q: 'Can a business settlement be changed later?', a: `<p>A signed settlement is generally binding, so changes usually require both parties to agree in writing. That is why the terms are reviewed carefully, often by counsel, before anyone signs.</p>` },
  ],
  seanTopic: 'high-stakes business negotiations',
  consultText: 'A private first conversation about the dispute, the parties involved, the format, and fees.',
  cta: { heading: 'Settle the Dispute and Get Back to Business', text: 'Book a confidential consultation to talk through the dispute and the next practical step.', secondary: { href: '/mediation/', label: 'Explore Mediation Services' } },
});

export const workplace = page({
  meta: {
    path: '/workplace-mediation/',
    out: 'workplace-mediation/index.html',
    title: 'Workplace Mediator in Los Angeles | Sean Collinson',
    description: 'Private workplace mediation in Los Angeles for conflict between coworkers, managers, and teams, and employer-employee disputes, with Sean Collinson.',
    h1: 'Workplace Mediator in Los Angeles',
  },
  crumb: 'Workplace Mediation',
  lede: 'Workplace conflict rarely stays between two people. It spreads to teams, productivity, and turnover. Mediation gives coworkers, managers, and organizations a confidential way to address the problem directly and agree on how to move forward.',
  sections: [
    {
      id: 'situations',
      title: 'Situations workplace mediation helps with',
      jump: 'Situations',
      html: `<ul>
      <li>Ongoing conflict between coworkers or within a team</li>
      <li>Breakdowns between managers and the people they supervise</li>
      <li>Disagreements between business partners or executives</li>
      <li>Employment disputes, including separations, before or during litigation</li>
      <li>Rebuilding working relationships after a complaint or investigation</li>
    </ul>
    <p>Mediation is not a substitute for a required investigation of harassment, discrimination, or safety complaints. Employers should follow their legal obligations and policies first.</p>`,
    },
    {
      id: 'process',
      title: 'What the process looks like',
      jump: 'The process',
      html: `<p>Sean usually meets with each person separately first, to understand the issues and make sure everyone is willing to participate. Joint sessions then focus on specific problems and practical changes: communication, responsibilities, schedules, and how future disagreements will be handled. Agreed points are written down so everyone knows what was decided.</p>`,
    },
    {
      id: 'confidential',
      title: 'Confidential and voluntary',
      html: `<p>People speak more openly when they know the conversation is private. Sean explains the confidentiality terms at the start, including any limits, and no one is forced to agree to anything. Employees and employers can both request mediation, and either side may consult an attorney.</p>`,
    },
    {
      id: 'training',
      title: 'Training for leaders and teams',
      html: `<p>Sean also teaches the communication skills behind crisis negotiation to leaders and teams in the <a href="/masterclass/">Think Like a Hostage Negotiator masterclass</a>, which can complement mediation when a team needs new habits, not just a resolution.</p>`,
    },
  ],
  faqTitle: 'Questions about workplace mediation',
  faqs: [
    { q: 'How long does workplace mediation take?', a: timingAnswer('how many people are involved'), open: true },
    { q: 'How much does workplace mediation cost?', a: costAnswer() },
    { q: 'What if the parties can’t agree?', a: `<p>Even partial agreements, such as how two people will communicate going forward, can make a real difference. Anything left unresolved can still be handled through the organization’s own processes or the courts.</p>` },
    { q: 'Can a workplace agreement be changed later?', a: `<p>Yes, if the people involved agree. Many workplace agreements include a check-in date to review what is working. Formal settlement agreements in employment disputes are generally binding once signed, so review them carefully, often with counsel.</p>` },
  ],
  seanTopic: 'tense workplace conversations',
  consultText: 'A private first conversation about the conflict, the people involved, the format, and fees.',
  cta: { heading: 'Resolve the Conflict and Get the Team Working Again', text: 'Book a confidential consultation to talk through the situation and the next practical step.', secondary: { href: '/masterclass/', label: 'Explore the Masterclass' } },
});

export const howItWorks = page({
  meta: {
    path: '/how-mediation-works/',
    out: 'how-mediation-works/index.html',
    title: 'How Mediation Works | Sean Collinson, Los Angeles Mediator',
    description: 'How mediation works, step by step: the consultation, preparation, sessions, confidentiality, and written terms, explained by Los Angeles mediator Sean Collinson.',
    h1: 'How Mediation Works',
  },
  crumb: 'How Mediation Works',
  lede: 'Mediation is a structured conversation with a neutral in the room. You and the other party make the decisions; the mediator keeps the process organized, fair, and moving. Here is what to expect, step by step.',
  sections: [
    {
      id: 'steps',
      title: 'The process, step by step',
      jump: 'Step by step',
      html: `<h3>1. Consultation</h3>
    <p>A private first conversation about your dispute, the format, and fees, so you know what to expect before you commit. See <a href="/mediation-cost/">what mediation costs</a>.</p>
    <h3>2. Preparation</h3>
    <p>You list the issues to decide and gather the information you need to decide them. Sean will tell you what is useful for your matter. See the <a href="/mediation/#what-to-bring">what to bring checklist</a>.</p>
    <h3>3. Sessions</h3>
    <p>Sessions can be joint, separate, or both. In private caucuses, each side can speak candidly with the mediator. You work through each issue in an order that makes sense.</p>
    <h3>4. Written terms</h3>
    <p>Agreed points are written down so each party can review them, with independent counsel if they choose, before anything is final. Family matters then move through the court process that finalizes them.</p>`,
    },
    {
      id: 'what-to-bring',
      title: 'What to bring to your first session',
      jump: 'What to bring',
      html: `<ul>
      <li><strong>Financial documents:</strong> tax returns, pay stubs, bank, retirement, mortgage, and loan statements</li>
      <li><strong>Parenting information:</strong> school calendars, current schedules, health needs, and childcare costs</li>
      <li><strong>Legal papers:</strong> any court orders, filed papers, and prenuptial or written agreements</li>
      <li><strong>Your goals in writing:</strong> your top priorities, the points you can trade, and your questions</li>
    </ul>
    <p>Get the full list: <a href="/divorce-mediation-checklist/">free checklist, What to Bring to Divorce Mediation in California</a>.</p>`,
    },
    {
      id: 'how-long',
      title: 'How long mediation takes',
      jump: 'How long it takes',
      html: `<p>Some matters settle in a single session. Others take several sessions over a few weeks. That is still far faster than a court case, which can run many months or longer. Every matter is different, so timelines vary.</p>`,
    },
    {
      id: 'mediator-role',
      title: 'What the mediator does, and does not do',
      jump: 'The mediator’s role',
      html: `<p>Sean is a neutral. He manages the process, helps each side understand the issues, and helps turn interests into specific, workable terms. He does not take sides, decide the outcome, represent either party, or give legal advice. Many people consult their own attorneys before, during, or after mediation.</p>`,
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality',
      html: `<p>Sessions are private, and California has statutes that generally protect what is said in mediation, subject to specific exceptions. How those rules apply depends on your situation, so it is worth asking your own attorney. Sean explains the confidentiality terms at the start of every matter.</p>`,
    },
    {
      id: 'format',
      title: 'In person or online',
      html: `<p>Sessions can be held in person at the Sherman Oaks office or by Zoom, for parties throughout California and nationwide. Virtual sessions can use private breakout rooms, which many people find easier than sitting across the table.</p>`,
    },
    {
      id: 'not-appropriate',
      title: 'When mediation is not appropriate',
      jump: 'When it is not right',
      html: `<p>Mediation depends on both parties being able to participate safely and freely. If there is a history of abuse, threats, or intimidation, mediation may not be appropriate, or may need special safeguards. Raise any safety concern during the consultation, and consider speaking with an attorney or advocate.</p>
    <p>Explore the services: ${services.map((s) => `<a href="${s.path}">${s.label.toLowerCase()}</a>`).join(', ')}.</p>`,
    },
  ],
  faqTitle: 'Questions about the process',
  faqs: [
    { q: 'How long does mediation take?', a: timingAnswer('how complex the finances or facts are'), open: true },
    { q: 'How much does mediation cost?', a: costAnswer() },
    { q: 'What if we can’t agree on everything?', a: `<p>That is common, and it is not a failure. Whatever you agree on can be written down, and anything left unresolved can still go to court. Mediation does not take away your right to go to court.</p>` },
    { q: 'Can a mediated agreement be changed later?', a: `<p>It depends on the terms. In family matters, custody, parenting time, and child support can usually be revisited when circumstances change, while property division is generally final once a judgment is entered. Business settlements are generally binding once signed. Ask your attorney how this applies before you sign.</p>` },
  ],
  seanTopic: 'every mediation',
  cta: { heading: 'Find Out Whether Mediation Fits Your Situation', text: 'Book a confidential consultation to talk through the issues, the format, and the next practical step.', secondary: { href: '/faq/', label: 'Read the FAQ' } },
});

export const faq = page({
  meta: {
    path: '/faq/',
    out: 'faq/index.html',
    title: 'Mediation FAQ | Sean Collinson, Los Angeles Mediator',
    description: 'Answers to common questions about mediation in Los Angeles: cost, timing, confidentiality, attorneys, online sessions, and what happens if you cannot agree.',
    h1: 'Mediation Questions and Answers',
  },
  crumb: 'FAQ',
  lede: 'Straight answers to the questions people ask most before they start mediation. If yours is not here, ask during the consultation.',
  sections: [
    {
      id: 'topics',
      title: 'Questions by topic',
      jump: 'By topic',
      html: `<p>Each service page has its own questions and answers:</p>
    <ul>
      ${services.map((s) => `<li><a href="${s.path}#faq">${s.label}</a></li>`).join('\n      ')}
    </ul>
    <p>For the full process, see <a href="/how-mediation-works/">how mediation works</a>. To compare the two paths, see <a href="/mediation-vs-litigation/">mediation vs. litigation</a>.</p>`,
    },
  ],
  faqTitle: 'Common questions about mediation',
  faqs: [
    { q: 'How much does mediation cost?', a: costAnswer(), open: true },
    { q: 'How long does mediation take?', a: timingAnswer('how complex the finances or facts are') },
    { q: 'What is the difference between mediation and court?', a: `<p>In mediation, you and the other party decide the outcome together, in private. In court, a judge decides the contested issues, and the proceedings are public. Mediation is more private, more flexible, and less adversarial. Court remains available if mediation does not resolve everything.</p>` },
    { q: 'Is mediation confidential?', a: `<p>Sessions are private, and California has statutes that generally protect what is said in mediation, subject to specific exceptions. How those rules apply depends on your situation, so it is worth asking your own attorney. Sean explains the confidentiality terms at the start of every matter.</p>` },
    { q: 'Do we still need attorneys if we use a mediator?', a: `<p>Sean is a neutral mediator; he does not represent either party or provide legal advice. Many people consult their own attorneys before, during, or after mediation, especially before signing a final agreement. Whether and how to involve an attorney is your choice.</p>` },
    { q: 'What if we can’t agree on everything?', a: `<p>That is common, and it is not a failure. Whatever you agree on can be written down, and anything left unresolved can still go to court. Mediation does not take away your right to go to court.</p>` },
    { q: 'Can a mediated agreement be changed later?', a: `<p>It depends on the terms. In family matters, custody, parenting time, and child support can usually be revisited when circumstances change, while property division is generally final once a judgment is entered. Business settlements are generally binding once signed. Ask your attorney how this applies before you sign.</p>` },
    { q: 'Can mediation be done online?', a: `<p>Yes. Mediation by Zoom is available for parties throughout California and nationwide. Virtual sessions can use private breakout rooms. Sessions are also available in person at the Sherman Oaks office.</p>` },
    { q: 'When is mediation not appropriate?', a: `<p>Mediation depends on both parties being able to participate safely and freely. If there is a history of abuse, threats, or intimidation, mediation may not be appropriate, or may need special safeguards. Raise any safety concern during the consultation.</p>` },
  ],
  seanTopic: 'every mediation',
  cta: { heading: 'Still Have Questions?', text: 'Book a confidential consultation and ask them directly.', secondary: { href: '/how-mediation-works/', label: 'How Mediation Works' } },
});
