// Pricing, testimonials, mediation vs. litigation, and neighborhood pages.
import { office, reviews } from '../config.mjs';
import { servicePage } from '../lib/service-page.mjs';
import { layout, breadcrumbs, esc, bookingLink, ctaBand } from '../lib/render.mjs';

const tel = `tel:${office.phone}`;
const actions = () => `${bookingLink('btn btn--primary')}<a class="btn btn--secondary" href="${esc(tel)}">Call ${esc(office.phoneDisplay)}</a>`;
const ctaFree = (heading, text) => ({ heading, text, secondary: { href: tel, label: `Call ${office.phoneDisplay}` } });
const page = (cfg) => ({ meta: cfg.meta, render: () => servicePage({ consultActions: actions(), ...cfg }) });

const tableStyle = `<style>.price-table,.vs-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:1rem 0 .75rem;background:var(--surface)}.price-table th,.price-table td,.vs-table th,.vs-table td{padding:14px 18px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line)}.price-table tr:last-child th,.price-table tr:last-child td,.vs-table tr:last-child th,.vs-table tr:last-child td{border-bottom:0}.price-table thead th,.vs-table thead th{background:var(--n1);color:var(--t-accent);font-size:.8rem;letter-spacing:.12em;text-transform:uppercase}.price-table td.price{font-weight:800;font-size:1.15rem;color:var(--t-head);white-space:nowrap}.vs-table tbody th{width:22%;color:var(--t-head)}.table-source{font-size:.9rem;color:var(--t-muted)}@media (max-width:640px){.vs-table thead{position:absolute;left:-9999px}.vs-table,.vs-table tbody,.vs-table tr,.vs-table th,.vs-table td{display:block;width:auto}.vs-table tr{border-bottom:1px solid var(--line);padding:6px 0}.vs-table th,.vs-table td{border:0;padding:6px 16px}.vs-table td::before{content:attr(data-label);display:block;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t-muted);font-weight:700}}</style>`;

// ── Part 1: pricing ─────────────────────────────────────────────────────────
export const mediationCost = page({
  meta: {
    path: '/mediation-cost/',
    out: 'mediation-cost/index.html',
    title: 'What Does Mediation Cost in Los Angeles? | Sean Collinson',
    description: 'Mediation rates with Los Angeles mediator Sean Collinson: $425 per hour, $1,750 half day, $3,600 full day. Sliding scale and payment plans available.',
    h1: 'What Does Mediation Cost in Los Angeles?',
  },
  crumb: 'Mediation Cost',
  lede: 'Clear, published rates for mediation with Sean Collinson. Your first consultation is free, a sliding scale is available, and payment plans can be worked out.',
  sections: [
    {
      id: 'rates',
      title: 'Sean’s mediation rates',
      jump: 'Rates',
      html: `<table class="price-table"><caption class="visually-hidden">Mediation rates for The Mediation Office of Sean Collinson</caption><thead><tr><th scope="col">Option</th><th scope="col">Rate</th></tr></thead><tbody>
      <tr><th scope="row">Hourly</th><td class="price">$425 per hour</td></tr>
      <tr><th scope="row">Half day</th><td class="price">$1,750</td></tr>
      <tr><th scope="row">Full day</th><td class="price">$3,600</td></tr>
    </tbody></table>
    <p><strong>A sliding scale is available.</strong> Sean sets it case by case, so ask about it during your free consultation.</p>`,
    },
    {
      id: 'included',
      title: 'What the rate includes',
      jump: 'What is included',
      html: `<ul>
      <li>Your mediation sessions</li>
      <li>Your written agreement, prepared when the mediation is complete</li>
    </ul>`,
    },
    {
      id: 'payment',
      title: 'How payment works',
      jump: 'Payment',
      html: `<p>Payment plans are available. Start with 50% down, and the remaining 50% is due when your agreement is complete.</p>
    <p>Have questions about which option fits your situation? Ask during your free consultation, before you commit to anything.</p>`,
    },
    {
      id: 'not-paying-for',
      title: 'What you are not paying for',
      jump: 'What you are not paying for',
      html: `<ul>
      <li><strong>No two attorneys</strong> billing against each other to argue your case.</li>
      <li><strong>No court battles</strong>, with hearing after hearing on the court’s calendar.</li>
      <li><strong>No years of billable hours</strong> spent building a case against the other side.</li>
    </ul>
    <p>See how the two paths compare: <a href="/mediation-vs-litigation/">mediation vs. litigation</a>. You can still consult your own attorney at any point; mediation does not replace legal advice.</p>`,
    },
  ],
  faqTitle: 'Questions about cost',
  faqs: [
    { q: 'How much does mediation with Sean cost?', a: '<p>Sean’s rates are $425 per hour, $1,750 for a half day, and $3,600 for a full day. A sliding scale is available, and your first consultation is free.</p>', open: true },
    { q: 'What does the rate include?', a: '<p>Your mediation sessions, and your written agreement, prepared when the mediation is complete.</p>' },
    { q: 'Can I pay over time?', a: '<p>Yes. Payment plans are available. Start with 50% down, and the remaining 50% is due when your agreement is complete.</p>' },
    { q: 'Is there a sliding scale?', a: '<p>Yes. Sean works on a sliding scale and sets it case by case. Ask about it during your free consultation.</p>' },
  ],
  seanTopic: 'every mediation',
  consultText: 'A free first conversation about your situation, the format, and which rate fits.',
  cta: ctaFree('Start With a Free Consultation', 'Talk through your situation and your options before you commit to anything.'),
  headExtra: tableStyle,
});

// ── Part 3: mediation vs. litigation ───────────────────────────────────────
const vsRows = [
  ['Cost', 'A mediated divorce typically runs about $3,000 to $8,000 total.', 'A contested litigated divorce typically runs about $15,000 to $50,000 or more per case.'],
  ['Time', 'Scheduled around you. Some matters settle in a single session; others take several sessions over a few weeks.', 'Runs on the court’s calendar. Contested cases can run many months or longer.'],
  ['Who decides', 'You and the other party decide together.', 'A judge decides the contested issues.'],
  ['Privacy', 'Private, in a confidential setting.', 'Court proceedings and most filings are public.'],
  ['Effect on co-parenting', 'You practice making decisions together, which carries into co-parenting.', 'Each side builds a case against the other, which can harden the conflict.'],
  ['Court appearances', 'Few or none. Agreed terms are submitted to the court to finalize.', 'Multiple hearings, and possibly a trial.'],
];
export const mediationVsLitigation = page({
  meta: {
    path: '/mediation-vs-litigation/',
    out: 'mediation-vs-litigation/index.html',
    title: 'Mediation vs. Litigation: Cost, Time, and Control Compared | Sean Collinson',
    description: 'Mediation vs. litigation for divorce and family disputes: cost ranges, time, who decides, privacy, co-parenting, and court appearances compared side by side.',
    h1: 'Mediation vs. Litigation: Cost, Time, and Control Compared',
  },
  crumb: 'Mediation vs. Litigation',
  lede: 'Both paths can end a dispute. They get there very differently: in what you pay, how long it takes, and who makes the final decisions.',
  sections: [
    {
      id: 'comparison',
      title: 'Side by side',
      jump: 'Comparison',
      html: `<table class="vs-table"><caption class="visually-hidden">Mediation compared with litigation</caption><thead><tr><th scope="col">Factor</th><th scope="col">Mediation</th><th scope="col">Litigation</th></tr></thead><tbody>
      ${vsRows.map(([f, m, l]) => `<tr><th scope="row">${f}</th><td data-label="Mediation">${m}</td><td data-label="Litigation">${l}</td></tr>`).join('\n      ')}
    </tbody></table>
    <p class="table-source">Ranges: Divorce.com divorce cost calculator, accessed November 2026.</p>
    <p>These are general ranges, not a quote. Every case is different. See <a href="/mediation-cost/">Sean’s published rates</a>.</p>`,
    },
    {
      id: 'control',
      title: 'You keep control',
      html: `<p>In litigation, a judge who has never met your family decides the issues you cannot settle. In mediation, the decisions stay with the two of you. You shape terms that fit your schedules, your finances, and your children, with a neutral keeping the conversation structured and fair.</p>`,
    },
    {
      id: 'private',
      title: 'It is private',
      html: `<p>Court proceedings and most filings are public. Mediation happens in a confidential setting, so your finances and family details stay in the room instead of in a public file.</p>`,
    },
    {
      id: 'kids',
      title: 'It protects the kids from the fight',
      jump: 'Protecting the kids',
      html: `<p>Children feel the conflict long before a judge rules on it. Mediation lowers the temperature and keeps the focus on the children’s actual week, so you can build a parenting plan together instead of fighting over one. Read about <a href="/child-custody-mediation/">child custody mediation</a>.</p>`,
    },
  ],
  faqTitle: 'Questions about mediation and court',
  faqs: [
    { q: 'Can we still go to court if mediation does not work?', a: '<p>Yes. Mediation does not take away your right to go to court. Anything you do not resolve in mediation can still be decided by a judge.</p>', open: true },
    { q: 'Is a mediated agreement binding?', a: '<p>Once your written agreement is signed and submitted to the court for approval, it becomes part of your court judgment or order. Ask your own attorney how this applies to your situation.</p>' },
  ],
  seanTopic: 'every mediation',
  cta: ctaFree('Choose the Path That Keeps Control With You', 'Book a free consultation to find out whether mediation fits your situation.'),
  headExtra: tableStyle,
});

// ── Part 2: testimonials ───────────────────────────────────────────────────
export const testimonialsPage = {
  meta: {
    path: '/testimonials/',
    out: 'testimonials/index.html',
    title: 'Client Reviews, The Mediation Office of Sean Collinson',
    description: `${reviews.rating} stars from ${reviews.count} Google reviews. Read client reviews of Los Angeles mediator Sean Collinson on Google, or leave your own.`,
    h1: 'Client Reviews, The Mediation Office of Sean Collinson',
  },
  render() {
    const crumbs = breadcrumbs([{ name: 'Testimonials', path: this.meta.path }]);
    const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title" style="max-width:22ch">${esc(this.meta.h1)}</h1>
    <p class="page-hero__lede"><span aria-hidden="true" style="color:var(--t-accent);letter-spacing:2px">★★★★★</span> <strong>${esc(reviews.rating)} stars from ${reviews.count} Google reviews</strong></p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(reviews.url)}" target="_blank" rel="noopener">Read our Google reviews<span class="visually-hidden"> (opens in a new tab)</span></a>
      <a class="btn btn--glass" href="${esc(reviews.url)}" target="_blank" rel="noopener">Leave a review<span class="visually-hidden"> (opens in a new tab)</span></a>
    </div>
  </div>
</section>
${ctaBand({ heading: 'Talk With Sean About Your Situation', text: 'Book a free consultation, or call the office.', secondary: { href: tel, label: `Call ${office.phoneDisplay}` } })}
`;
    return layout({ path: this.meta.path, title: this.meta.title, description: this.meta.description, body, schema: [crumbs.schema], bodyClass: 'page-testimonials' });
  },
};

// ── Part 4: neighborhood pages ─────────────────────────────────────────────
const coreServices = `<ul>
      <li><a href="/divorce-mediation/">Divorce mediation</a></li>
      <li><a href="/child-custody-mediation/">Child custody and parenting plans</a></li>
      <li><a href="/child-support-mediation/">Child support</a></li>
      <li><a href="/spousal-support-mediation/">Spousal support</a> and <a href="/property-division-mediation/">property division</a></li>
      <li><a href="/holiday-parenting-schedules/">Holiday parenting schedules</a></li>
      <li><a href="/high-conflict-settlement-officer/">High-conflict settlement conferences</a></li>
    </ul>`;
const court = (area, extra) => `<p>Family law cases for ${area} residents are filed with the Superior Court of California, County of Los Angeles. ${extra}</p>`;
export const neighborhoods = [
  {
    slug: 'sherman-oaks', name: 'Sherman Oaks',
    lede: 'The Mediation Office of Sean Collinson is in Sherman Oaks, at 15301 Ventura Blvd. If you live or work nearby, you can mediate your divorce or parenting plan in person, close to home, in a calm private office.',
    who: '<p>Sherman Oaks families come to mediation for many of the same reasons: they want the decisions to stay with them, they want to keep their finances and family details out of a public file, and they want a co-parenting relationship that still works after the paperwork is done. Sean also mediates for couples who are separating amicably and simply want a neutral to keep the process organized.</p>',
    courtExtra: 'Mediation happens outside the courtroom, at the Sherman Oaks office. When you reach agreement, your written terms are submitted to the court to finalize.',
    travel: '<p>The office is at 15301 Ventura Blvd, Sherman Oaks, CA 91403, by appointment only. If meeting in the same room is hard, sessions can run in separate rooms, or by Zoom from home.</p>',
    faqs: [
      { q: 'Where is the office?', a: '<p>15301 Ventura Blvd, Sherman Oaks, CA 91403. Sessions are by appointment only, Monday to Friday 9.30am to 7.30pm and Saturday 2pm to 5pm.</p>' },
      { q: 'Can we meet in separate rooms?', a: '<p>Yes. Sean can work with each of you in a separate room and move between you, or run the session by Zoom.</p>' },
    ],
  },
  {
    slug: 'encino', name: 'Encino',
    lede: 'Encino is next door to the Sherman Oaks office along Ventura Boulevard, which makes in-person mediation easy to fit into a workday. Sean helps Encino families settle divorce, custody, and support in private, without handing the decisions to a judge.',
    who: '<p>Mediation fits Encino parents who want a detailed parenting plan built around school, activities, and two busy work schedules, and couples who need to divide a home, retirement accounts, or a business with the numbers on the table. It also fits people who simply want the process to be quieter and less expensive than a contested case.</p>',
    courtExtra: 'The mediation itself does not happen at the courthouse. Once you agree, the written terms go to the court for approval.',
    travel: '<p>The Sherman Oaks office at 15301 Ventura Blvd is a short trip east along Ventura Boulevard from Encino. Prefer to stay home? Sessions are also available by Zoom.</p>',
    faqs: [
      { q: 'Do you have an office in Encino?', a: '<p>The office is in neighboring Sherman Oaks, at 15301 Ventura Blvd. Encino clients meet there in person, or by Zoom.</p>' },
      { q: 'Can you help divide a business or retirement accounts?', a: '<p>Yes. Property and finances are a regular part of divorce mediation. Couples often bring in a neutral appraiser or financial professional when values are complicated. <a href="/property-division-mediation/">Read about property division</a>.</p>' },
    ],
  },
  {
    slug: 'burbank', name: 'Burbank',
    lede: 'For Burbank families, the Sherman Oaks office is a short drive across the Valley, and Zoom is always an option. Sean mediates divorce, custody, and child support so you can settle the issues together instead of in a courtroom.',
    who: '<p>Many Burbank parents work long or irregular hours, and a court order written for the general case rarely fits that kind of schedule. Mediation lets you build a parenting plan around how your family actually lives: work shifts, school pickups, weekends, and holidays, written in enough detail to follow without arguing over what it means.</p>',
    courtExtra: 'You do not need to be in a courtroom to reach an agreement. Mediated terms are written up and submitted to the court to make them official.',
    travel: '<p>Meet in person at 15301 Ventura Blvd in Sherman Oaks, or by Zoom from home or work. Many parents with demanding schedules find Zoom sessions the easiest to fit in.</p>',
    faqs: [
      { q: 'Can mediation work around shift work or travel schedules?', a: '<p>Yes. A mediated parenting plan can be built around rotating shifts, travel, and changing work hours, with a clear process for requesting changes.</p>' },
      { q: 'Do I have to drive to Sherman Oaks?', a: '<p>No. Sessions can be held by Zoom. In-person sessions are at the Sherman Oaks office.</p>' },
    ],
  },
  {
    slug: 'beverly-hills', name: 'Beverly Hills',
    lede: 'Sean Collinson mediates divorce and family matters for Beverly Hills clients who value discretion. Mediation keeps your finances and family details in a confidential setting, not in a public court file.',
    who: '<p>Privacy is often the deciding factor. Court filings are generally public, and a contested divorce can put income, property, and family matters on the record. Mediation lets you work through property division, support, and parenting in private, with a neutral who keeps the conversation structured and fair. Sean also serves as a <a href="/high-conflict-settlement-officer/">high-conflict settlement officer</a> for cases that have stalled.</p>',
    courtExtra: 'Your negotiations stay in a confidential setting. Only the final agreed terms are submitted to the court to finalize.',
    travel: '<p>In-person sessions are at the Sherman Oaks office, 15301 Ventura Blvd, over the hill from Beverly Hills. Confidential Zoom sessions are available for clients who prefer not to travel.</p>',
    faqs: [
      { q: 'How private is mediation?', a: '<p>Sessions are private, and California has statutes that generally protect what is said in mediation, subject to specific exceptions. Ask your own attorney how they apply to you.</p>' },
      { q: 'Can our attorneys be involved?', a: '<p>Yes. Many clients consult their own attorneys before or during mediation, and attorneys can attend sessions. Sean is a neutral and does not represent either party.</p>' },
    ],
  },
  {
    slug: 'santa-monica', name: 'Santa Monica',
    lede: 'Sean Collinson works with Santa Monica families by Zoom and in person at the Sherman Oaks office. Settle your divorce, custody schedule, or child support privately, at a pace you can manage.',
    who: '<p>For Westside families, the biggest cost of a court battle is often time: hearing dates, traffic, and months of uncertainty. Mediation is scheduled around you, and Zoom sessions mean you can make real progress without crossing town. It suits parents who want a workable plan for school weeks, weekends, and holidays, and couples who want to reach fair terms without a fight.</p>',
    courtExtra: 'Most of the work happens in mediation sessions, not at the courthouse. When you are done, the agreed terms are submitted to the court for approval.',
    travel: '<p>Zoom is the simplest option for many Santa Monica clients. In-person sessions are at 15301 Ventura Blvd in Sherman Oaks, by appointment.</p>',
    faqs: [
      { q: 'Can the whole mediation be done by Zoom?', a: '<p>Yes. Sessions can be held entirely by Zoom, including private breakout rooms when you want to talk with the mediator separately.</p>' },
      { q: 'How long does it take?', a: '<p>It depends on how many issues are in dispute and how prepared both sides are. Some matters settle in a single session; others take several sessions over a few weeks.</p>' },
    ],
  },
].map((n) => page({
  meta: {
    path: `/mediator-${n.slug}/`,
    out: `mediator-${n.slug}/index.html`,
    title: `Divorce and Family Mediator in ${n.name} | Sean Collinson`,
    description: `Divorce, custody, and child support mediation for ${n.name} families with Sean Collinson. Office at 15301 Ventura Blvd, Sherman Oaks, plus Zoom sessions.`.slice(0, 160),
    h1: `Divorce and Family Mediator in ${n.name}`,
  },
  crumb: `Mediator in ${n.name}`,
  lede: n.lede,
  sections: [
    { id: 'services', title: `Mediation services for ${n.name} families`, jump: 'Services', html: coreServices },
    { id: 'who', title: 'Who it helps', html: n.who },
    { id: 'court', title: `Family court for ${n.name}`, jump: 'Family court', html: court(n.name, n.courtExtra) },
    { id: 'getting-here', title: 'In person or by Zoom', jump: 'Location and Zoom', html: `${n.travel}\n    <p>See all <a href="/mediator-los-angeles/">areas Sean serves across Los Angeles</a>.</p>` },
  ],
  faqTitle: `Questions from ${n.name} clients`,
  faqs: n.faqs.map((f, i) => (i === 0 ? { ...f, open: true } : f)),
  seanTopic: 'every mediation',
  consultText: 'A free first conversation about your situation, the format, and fees.',
  cta: ctaFree(`Book a Free Consultation From ${n.name}`, 'Talk through your situation and the next practical step, in person or by Zoom.'),
}));

export const areaLinks = () => `<ul>
      ${neighborhoods.map((p) => `<li><a href="${p.meta.path}">${p.meta.h1.replace('Divorce and Family Mediator in ', '')}</a></li>`).join('\n      ')}
      <li><a href="/mediator-los-angeles/">Los Angeles</a></li>
    </ul>`;
