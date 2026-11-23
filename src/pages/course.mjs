// Sales and signup page for the paid course
// "Think Like a Hostage Negotiator: The Family Case Course"
// (/think-like-a-hostage-negotiator-course/). Copy supplied by Sean as final
// (Nov 23, 2026): do not rewrite it, add em dashes, or change prices.
import { office } from '../config.mjs';
import { layout, esc, abs } from '../lib/render.mjs';

const PATH = '/think-like-a-hostage-negotiator-course/';
const COURSE = 'Think Like a Hostage Negotiator: The Family Case Course';
const BOOK_URL = 'https://tidycal.com/mediation/consul';
const EBOOK_URL = 'https://seancollinson.com/think-like-a-hostage-negotiator/';

// Payment links. Paste each live checkout URL here; until then the button
// renders as a dimmed, non-working button so no one is sent to a dead link.
//   core: [CORE CHECKOUT LINK]
//   plus: [PLUS CHECKOUT LINK]
//   vip:  [VIP CHECKOUT LINK]
export const CHECKOUT = { core: null, plus: null, vip: null };
// Live taping seats: no dedicated booking page yet, so this uses the general
// consultation link. Swap in the taping booking link when it exists.
const TAPING_URL = BOOK_URL;

const meta = {
  path: PATH,
  out: 'think-like-a-hostage-negotiator-course/index.html',
  title: `${COURSE} | Sean Collinson`,
  description: 'A complete video course for people in divorce, custody, and paternity cases, taught by an FBI-trained crisis negotiator and family mediator with 22+ years in the room where these cases settle.',
};

const phoneLink = (text = office.phoneDisplay) => `<a href="tel:${esc(office.phone)}">${esc(text)}</a>`;

const stats = [
  ['$15,000 to $50,000+', 'What a contested divorce commonly costs each side in attorney fees and litigation costs. (Source: Divorce.com figures, as cited on our Mediation vs Litigation page.)'],
  ['$425', 'One hour of Sean\'s mediation time. One hour.'],
  ['$297', 'The founding price of this entire course, while the founding cohort is open.'],
];

const cards = [
  ['The 11 p.m. bait text.', 'It lands right before you sleep, it is built to ruin your night, and your reply decides whether it works. There is a negotiator\'s answer to this.'],
  ['The exchange that turns into a fight.', 'Pickup and drop-off keep becoming the battleground, in front of the kids. There is a negotiator\'s answer to this.'],
  ['The money argument that never ends.', 'Support, bills, and "you owe me" on a loop, with nothing ever settled in writing. There is a negotiator\'s answer to this.'],
  ['The court date you are dreading.', 'You are rehearsing speeches at 2 a.m. and walking in flooded. There is a negotiator\'s answer to this.'],
];

const reset = [
  ['R', 'Recognize', 'Name the pattern before you answer it.'],
  ['E', 'Evaluate', 'Know your real interests: time, money, the kids, your peace.'],
  ['S', 'Slow', 'Slow the moment down. Urgency is a weapon. Do not hand it back.'],
  ['E', 'Engage', 'Tactical empathy that lowers the temperature without giving in.'],
  ['T', 'Trade', 'Trade on interests, close in writing, and make it hold.'],
];

const modules = [
  [0, 'Start Here', ['Welcome, meet your mediator.', 'Your quiz result, decoded.', 'The ground rules: what this course is and is not.']],
  [1, 'The Hostage Mindset', ['Why a high-conflict person negotiates like a hostage-taker.', 'Slow is fast.', 'Their volume is not your emergency.', 'Trade on interests, and every message is a move.', 'You are negotiating with the pattern, not the person you remember.']],
  [2, 'Know the Pattern Across the Table', ['The five patterns that show up in family cases.', 'The three drivers underneath every blowup.', 'Reading a text like a negotiator.', 'Predicting the next move.', 'Your own pattern check.']],
  [3, 'RESET, The Method', ['Recognize.', 'Evaluate your real interests.', 'Slow the moment down.', 'Engage with tactical empathy, without giving in.', 'Trade and close.']],
  [4, 'The Script Vault', ['The anatomy of a negotiator\'s message.', 'Scripts for the bait text and the late-night ambush.', 'Scripts for money fights.', 'Scripts for exchange day and schedule changes.', 'Scripts for the meeting.', 'The Rewrite Lab: your hardest message, rebuilt.'], 'MOST POPULAR'],
  [5, 'The Divorce Track', ['How divorce actually settles.', 'Property and money without torching value in fees.', 'Support without the war.', 'Building an offer the other side can say yes to.', 'Vague agreements are future fights.']],
  [6, 'The Custody and Paternity Track', ['Parenting plans that survive real life.', 'Custody negotiations when trust is gone.', 'Paternity cases without a war.', 'Co-parenting communication systems.', 'When the kids are being pulled in.']],
  [7, 'Staying Out of the Drag', ['Mediation, explained by a mediator.', 'Working with your lawyer like a negotiator.', 'Court days and declarations.', 'The long game.']],
  [8, 'The 7-Day Reset and What Comes Next', ['The 7-Day Reset plan.', 'Your 90-day communication reset.', 'Safety and escalation: when negotiation is not the tool.', 'Graduation: your negotiator\'s checklist.']],
];

const tiers = [
  ['Core', ['The full course, all 8 modules and 40 lessons.', 'The course workbook.', 'The complete Script Vault downloads.', 'The 7-Day Reset plan.', 'The negotiator\'s checklist.', 'Lifetime access, learn at your pace.']],
  ['Plus', ['Everything in Core.', 'A live group session with Sean every month, including the Rewrite Lab run live on real messages.', 'The private Reset Room community.', 'New script drops as Sean adds them.']],
  ['VIP', ['Everything in Plus.', 'One private 60-minute strategy session with Sean on Zoom.', 'Priority review of one real message thread a month for three months.', 'First access to live taping seats.']],
];

const prices = [
  { key: 'core', name: 'CORE', price: '$297', sub: 'founding price (regular $397)', pay: 'One payment.', button: 'Enroll in Core' },
  { key: 'plus', name: 'PLUS', price: '$497', pay: 'One payment, or 3 monthly payments of $175.', button: 'Enroll in Plus', tag: 'MOST POPULAR' },
  { key: 'vip', name: 'VIP', price: '$997', pay: 'One payment, or 3 monthly payments of $349.', note: 'Includes a private 60-minute strategy session with Sean.', button: 'Apply for VIP' },
];

const faqs = [
  ['Is this legal advice?', 'No. This course teaches negotiation and communication strategy. It is education, not legal advice and not therapy. Sean is a mediator, not a lawyer, and a mediator is neutral and does not represent either side. For advice about your rights, consult a licensed attorney in your state. The course itself teaches you exactly when a lawyer and the court are the right tools, including a full lesson on safety and escalation.'],
  ['Will this work if the other side will not cooperate?', 'The course is built for exactly that. Every method here assumes a high-conflict pattern across the table: baiting, scorekeeping, deadline pressure. You do not need their cooperation to change your moves, your messages, and your record.'],
  ['I already have a lawyer. Is this still useful?', 'Yes. Lesson 7.2 is devoted to working with your lawyer like a negotiator: how to brief them, how to read a bill, and how to keep your strategy and your spending aligned. Prepared clients cost themselves less.'],
  ['Does this replace mediation?', 'No. Mediation is where many of these cases settle, and Module 7 explains how it works and how to walk in ready. Many students use the course to prepare for a mediation with Sean or with a mediator in their own state.'],
  ['How long do I keep access?', 'Core, Plus, and VIP all include lifetime access to the course lessons. Plus community and live sessions run while your Plus enrollment is active.'],
  ['What if it is not for me?', 'The 14-day guarantee in Section 8 applies to every tier.'],
  ['My situation involves safety concerns. Should I take this course?', 'If there is any concern for physical safety, threats, stalking, or coercive control, start with Lesson 8.3, which is free to watch first inside the course preview, and with a licensed attorney and local support resources. If you are ever in immediate danger, call 911. In the United States, the National Domestic Violence Hotline is 1-800-799-7233.'],
];
// Tap links inside answers, text unchanged.
const faqHtml = (a) =>
  esc(a)
    .replace('Section 8', '<a href="#pricing">Section 8</a>')
    .replace('call 911', 'call <a href="tel:911">911</a>')
    .replace('1-800-799-7233', '<a href="tel:+18007997233">1-800-799-7233</a>');

const checkoutButton = (p) => {
  const url = CHECKOUT[p.key];
  return url
    ? `<a class="btn btn--primary btn-big" href="${esc(url)}">${esc(p.button)}</a>`
    : `<span class="btn btn--primary btn-big course-btn--pending" aria-disabled="true" data-checkout="${p.key}">${esc(p.button)}</span>`;
};

const settlementPhoto = `<picture class="hero__photo">
<source type="image/webp" srcset="/assets/img/settlement/sean-collinson-settlement-480.webp?v=20261118 480w, /assets/img/settlement/sean-collinson-settlement-800.webp?v=20261118 800w, /assets/img/settlement/sean-collinson-settlement-1200.webp?v=20261118 1200w, /assets/img/settlement/sean-collinson-settlement-1600.webp?v=20261118 1600w" sizes="(min-width: 820px) 62vw, 100vw">
<img src="/assets/img/settlement/sean-collinson-settlement-800.jpg?v=20261118" srcset="/assets/img/settlement/sean-collinson-settlement-480.jpg?v=20261118 480w, /assets/img/settlement/sean-collinson-settlement-800.jpg?v=20261118 800w, /assets/img/settlement/sean-collinson-settlement-1200.jpg?v=20261118 1200w, /assets/img/settlement/sean-collinson-settlement-1600.jpg?v=20261118 1600w" sizes="(min-width: 820px) 62vw, 100vw" width="1600" height="852" alt="Sean Collinson, mediator, seated in a conference room" fetchpriority="high">
</picture>`;
const mediatorPhoto = `<picture>
<source type="image/webp" srcset="/assets/img/mediation/sean-collinson-mediation-480.webp 480w, /assets/img/mediation/sean-collinson-mediation-800.webp 800w, /assets/img/mediation/sean-collinson-mediation-1118.webp 1118w" sizes="(min-width: 960px) 45vw, 100vw">
<img src="/assets/img/mediation/sean-collinson-mediation-800.jpg" srcset="/assets/img/mediation/sean-collinson-mediation-480.jpg 480w, /assets/img/mediation/sean-collinson-mediation-800.jpg 800w, /assets/img/mediation/sean-collinson-mediation-1118.jpg 1118w" sizes="(min-width: 960px) 45vw, 100vw" width="1118" height="636" alt="Sean Collinson, smiling, in a navy suit in a conference room" loading="lazy" decoding="async">
</picture>`;

const style = `<style>
.course-hero{padding-bottom:clamp(4rem,8vw,7rem)}
.course-eyebrow{margin:0 0 1rem;font-size:.8rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#EED9A4}
.course-hero h1{font-size:clamp(2.1rem,1.4rem + 3vw,3.6rem);font-weight:800;line-height:1.05;letter-spacing:-.03em;color:#fff;max-width:17ch;margin:0 0 1rem}
.course-hero .course-sub{font-size:var(--step-1);font-weight:700;line-height:1.45;color:#fff;max-width:34em;margin:0 0 1rem}
.course-hero .course-body{color:#fff;max-width:36em;margin:0 0 1.5rem}
.course-hero .btn-row{align-items:center;gap:1rem 1.5rem}
.course-hero .course-free{color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:.2em}
.course-hero .course-free:hover{color:#EED9A4}
.course-section h2{font-size:var(--step-3);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin:0 0 1.5rem;max-width:24ch}
.course-stats{display:grid;gap:14px;margin:0 0 1.5rem}
.course-stat{padding:1.5rem 1.35rem;border-radius:var(--radius);background:#fff;box-shadow:0 0 0 1px rgba(10,27,49,.16);border-top:4px solid #EED9A4}
.course-stat strong{display:block;font-family:var(--display);font-size:clamp(1.9rem,1.5rem + 1.6vw,2.6rem);font-weight:800;letter-spacing:-.02em;color:#0A1B31;line-height:1.1;margin-bottom:.5rem}
.course-stat p{margin:0;color:#34435A}
.course-lead{font-size:var(--step-1);font-weight:650;line-height:1.5;max-width:40em;margin:0 0 1.5rem}
.course-cards{display:grid;gap:14px}
.course-card{padding:1.4rem 1.35rem;border-radius:var(--radius);background:#0A1B31;color:#fff}
.course-card h3{color:#fff;font-size:var(--step-1);margin:0 0 .5rem}
.course-card p{margin:0;color:#fff}
.course-reset{list-style:none;margin:1.75rem 0;padding:0;display:grid;gap:12px}
.course-reset li{display:grid;grid-template-columns:3rem 1fr;gap:1rem;align-items:start;padding:1rem 1.1rem;border-radius:var(--radius);background:rgba(238,217,164,.08);box-shadow:inset 0 0 0 1px rgba(238,217,164,.22)}
.course-reset__letter{display:grid;place-items:center;width:3rem;height:3rem;border-radius:50%;background:#EED9A4;color:#0A1428;font-family:var(--display);font-size:1.4rem;font-weight:800}
.course-reset strong{display:block;color:#fff;font-size:1.1rem}
.course-reset p{margin:.15rem 0 0;color:#fff}
.course-tagline{font-family:var(--display);font-size:var(--step-2);font-weight:750;color:#EED9A4;margin:0}
.course-intro{font-size:var(--step-1);line-height:1.5;max-width:40em;color:#fff}
.course-meet{display:grid;gap:var(--space-4);align-items:center}
.course-meet picture img{border-radius:var(--radius-lg);width:100%;height:auto}
.course-meet p{max-width:40em}
.course-modules{display:grid;gap:10px}
.course-module{border-radius:var(--radius);background:#0A1B31;color:#fff}
.course-module summary{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.3rem;cursor:pointer;list-style:none;border-radius:var(--radius)}
.course-module summary::-webkit-details-marker{display:none}
.course-module summary h3{margin:0;font-family:var(--sans);font-size:var(--step-1);font-weight:700;letter-spacing:0;line-height:1.35;color:#fff}
.course-module summary h3 > span:first-child{color:#EED9A4}
.course-module summary h3 .course-tag{color:#0A1428}
.course-tag{display:inline-block;margin-left:.5rem;padding:.15rem .55rem;border-radius:999px;background:#EED9A4;color:#0A1428;font-size:.72rem;font-weight:800;letter-spacing:.08em;vertical-align:middle}
.course-module .faq__icon{flex:none}
.course-module ol{list-style:none;margin:0;padding:0 1.3rem 1.3rem;display:grid;gap:.5rem}
.course-module li{display:grid;grid-template-columns:2.6rem 1fr;color:#fff}
.course-module li span{color:#EED9A4;font-weight:700}
.course-module[open] .faq__icon{background:#EED9A4}
.course-module[open] .faq__icon::before,.course-module[open] .faq__icon::after{background:#0A1428}
.course-module[open] .faq__icon::after{transform:translate(-50%,-50%) rotate(0)}
.course-tiers{display:grid;gap:14px}
.course-tier{padding:1.5rem 1.35rem;border-radius:var(--radius);background:#fff;box-shadow:0 0 0 1px rgba(10,27,49,.16);border-top:4px solid #0A1B31}
.course-tier h3{font-size:var(--step-2);margin:0 0 .75rem}
.course-tier ul{margin:0;padding-left:1.2rem}.course-tier li{margin-bottom:.45rem}
.course-prices{display:grid;gap:16px;align-items:stretch}
.course-price{position:relative;display:flex;flex-direction:column;padding:1.75rem 1.4rem 1.5rem;border-radius:var(--radius-lg);background:#fff;color:#0A1B31}
.course-price h3{font-family:var(--sans);font-size:1rem;font-weight:800;letter-spacing:.14em;color:#0A1B31;margin:0 0 .75rem}
.course-price__amount{font-family:var(--display);font-size:clamp(2.4rem,2rem + 1.5vw,3rem);font-weight:800;letter-spacing:-.02em;line-height:1;margin:0}
.course-price__sub{font-weight:700;margin:.4rem 0 0;color:#0A1B31}
.course-price__pay{margin:.75rem 0 0;color:#34435A}
.course-price__note{margin:.75rem 0 0;font-weight:650;color:#0A1B31}
.course-price .btn{margin-top:auto;width:100%;max-width:none}
.course-price__cta{margin-top:auto;padding-top:1.5rem}
.course-price--featured{box-shadow:0 0 0 3px #EED9A4}
.course-price__tag{position:absolute;top:-.8rem;left:1.4rem;padding:.25rem .7rem;border-radius:999px;background:#EED9A4;color:#0A1428;font-size:.75rem;font-weight:800;letter-spacing:.08em}
.course-btn--pending{opacity:.5;cursor:not-allowed}
.course-refund{margin:1.75rem 0 0;padding:1.4rem 1.35rem;border-radius:var(--radius);background:#EFE3B8;color:#0A1428}
.course-refund p{margin:0;color:#0A1428}
.course-refund strong{color:#0A1428}
.course-refund a{color:#0A1428;font-weight:700}
.course-final{text-align:center}
.course-final h2{margin-left:auto;margin-right:auto}
.course-final p{margin-left:auto;margin-right:auto;max-width:36em}
.course-final .btn-row{justify-content:center}
.course-final .course-call a{color:#fff;font-weight:700}
.course-boiler ul{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:.4rem}
.course-boiler address{font-style:normal}
.course-disclaimer{font-size:.875rem;color:#34435A;max-width:62em;margin:1.5rem 0 0}
@media (min-width:820px){.course-hero .course-sub,.course-hero .course-body{max-width:30rem}.course-hero h1{max-width:15ch}}
@media (min-width:760px){.course-stats,.course-tiers,.course-prices{grid-template-columns:repeat(3,1fr)}.course-cards{grid-template-columns:repeat(2,1fr)}}
@media (min-width:960px){.course-meet{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(3rem,5vw,5rem)}}
</style>`;

export const coursePage = {
  meta,
  render() {
    const body = `
<section class="page-hero page-hero--photo course-hero" aria-labelledby="page-title">
  <div class="hero__media">${settlementPhoto}</div>
  <div class="wrap">
    <p class="course-eyebrow">SEAN COLLINSON, THE MEDIATOR</p>
    <h1 id="page-title">Your case is a negotiation, not a war. Learn to negotiate it like a hostage negotiator.</h1>
    <p class="course-sub">The other side treats your divorce like a hostage situation. Start negotiating like the person trained to end one.</p>
    <p class="course-body">A complete video course for people in divorce, custody, and paternity cases, taught by an FBI-trained crisis negotiator and family mediator with 22+ years in the room where these cases settle.</p>
    <div class="btn-row">
      <a class="btn btn--primary btn-big" href="#curriculum">See the Course</a>
      <a class="course-free" href="${EBOOK_URL}">New to this? Start with the free e-book</a>
    </div>
  </div>
</section>

<section class="section section--ivory course-section" aria-labelledby="cost-title">
  <div class="wrap">
    <h2 id="cost-title">First, look at what the fight costs.</h2>
    <div class="course-stats">
      ${stats.map(([n, l]) => `<div class="course-stat"><strong>${esc(n)}</strong><p>${esc(l)}</p></div>`).join('\n      ')}
    </div>
    <p class="course-lead">This course costs less than one hour with the mediator who teaches it. The fight costs more than both, and it bills you for years.</p>
    <a class="btn btn--primary" href="#pricing">See the pricing</a>
  </div>
</section>

<section class="section section--ivory course-section" aria-labelledby="you-title">
  <div class="wrap">
    <h2 id="you-title">If any of these live on your phone, this course was built for you.</h2>
    <div class="course-cards">
      ${cards.map(([t, d]) => `<div class="course-card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section course-section" aria-labelledby="reset-title">
  <div class="wrap">
    <h2 id="reset-title">The RESET method</h2>
    <p class="course-intro">Hostage negotiators do not win arguments. They run a discipline. RESET is that discipline, adapted for a family case, from Sean's book RESET OR REPEAT.</p>
    <ol class="course-reset">
      ${reset.map(([l, w, d]) => `<li><span class="course-reset__letter" aria-hidden="true">${l}</span><div><strong>${l}, ${esc(w)}</strong><p>${esc(d)}</p></div></li>`).join('\n      ')}
    </ol>
    <p class="course-tagline">The book teaches the mindset. This course trains the skill.</p>
  </div>
</section>

<section class="section section--ivory course-section" aria-labelledby="meet-title">
  <div class="wrap course-meet">
    <div>${mediatorPhoto}</div>
    <div>
      <h2 id="meet-title">Taught by the mediator attorneys call when a case is stuck.</h2>
      <p>Sean Collinson is a Los Angeles family court, divorce and civil mediator and settlement neutral with more than 22 years of experience. His training includes the Harvard Program on Negotiation, Loyola Law School's Mediating the Litigated Case, and advanced family mediation recognized by the Florida Supreme Court. He is an FBI-trained crisis negotiator who has volunteered with the Los Angeles County Sheriff's Department, and a High-Conflict Settlement Officer: the strategist attorneys call when parties are locked and a case needs to settle. His appearance on Dr. Phil as a family mediator has been viewed nearly 400,000 times. He is the author of RESET OR REPEAT: Break Your Patterns Before They Break You.</p>
      <p><strong>Helping attorneys and their clients navigate difficult negotiations, overcome settlement impasses, and find practical pathways to resolution. Now he teaches the same discipline to the people living the case.</strong></p>
    </div>
  </div>
</section>

<section class="section section--ivory course-section" id="curriculum" aria-labelledby="curriculum-title">
  <div class="wrap">
    <h2 id="curriculum-title">Inside the course: 8 modules, 40 lessons, about 6 to 7 hours.</h2>
    <p class="course-lead">Every module ends with a field assignment and a script or template download. This is training, not television.</p>
    <div class="course-modules">
      ${modules.map(([n, t, lessons, tag]) => `<details class="course-module">
        <summary><h3><span>Module ${n},</span> ${esc(t)}${tag ? `<span class="course-tag">${esc(tag)}</span>` : ''}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
        <ol>${lessons.map((l, i) => `<li><span>${n}.${i + 1}</span>${esc(l)}</li>`).join('')}</ol>
      </details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--ivory course-section" aria-labelledby="get-title">
  <div class="wrap">
    <h2 id="get-title">Three ways in. One discipline.</h2>
    <div class="course-tiers">
      ${tiers.map(([n, items]) => `<div class="course-tier"><h3>${esc(n)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section course-section" id="pricing" aria-labelledby="pricing-title">
  <div class="wrap">
    <h2 id="pricing-title">Founding pricing. When the founding cohort closes, Core goes to $397.</h2>
    <div class="course-prices">
      ${prices.map((p) => `<div class="course-price${p.tag ? ' course-price--featured' : ''}">
        ${p.tag ? `<span class="course-price__tag">${esc(p.tag)}</span>` : ''}
        <h3>${esc(p.name)}</h3>
        <p class="course-price__amount">${esc(p.price)}</p>
        ${p.sub ? `<p class="course-price__sub">${esc(p.sub)}</p>` : ''}
        <p class="course-price__pay">${esc(p.pay)}</p>
        ${p.note ? `<p class="course-price__note">${esc(p.note)}</p>` : ''}
        <div class="course-price__cta">${checkoutButton(p)}</div>
      </div>`).join('\n      ')}
    </div>
    <div class="course-refund">
      <p><strong>The 14-day guarantee.</strong> Take the course for 14 days. Do the first two modules and one field assignment. If you do not feel calmer, clearer, and better armed for your next conversation, email us through the <a href="/contact/">contact form</a> within 14 days of enrolling and we will refund you in full. No forms to fight, no hard feelings.</p>
    </div>
  </div>
</section>

<section class="section section--ivory course-section" aria-labelledby="taping-title">
  <div class="wrap">
    <h2 id="taping-title">Founding launch event: Think Like a Hostage Negotiator, Live.</h2>
    <p class="course-lead" style="font-weight:450">The course launches with a live taping in front of a small audience: $150 a seat, 10 seats only. Sean teaches the Hostage Mindset live and runs the Rewrite Lab on real messages from the room. The taping is recorded and becomes part of the course. Every seat includes a $150 credit toward Plus or VIP enrollment, so your seat pays for itself the day you enroll.</p>
    <a class="btn btn--primary" href="${TAPING_URL}" target="_blank" rel="noopener">Book a seat</a>
  </div>
</section>

<section class="section section--ivory course-section" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title">Straight answers.</h2>
    <div class="faq">
      ${faqs.map(([q, a]) => `<details class="faq__item">
        <summary class="faq__q"><h3>${esc(q)}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
        <div class="faq__a"><p>${faqHtml(a)}</p></div>
      </details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section course-section course-final" aria-labelledby="final-title">
  <div class="wrap narrow">
    <h2 id="final-title">Stop reacting. Start resetting.</h2>
    <p class="course-intro">Every week this case drags on costs you money, sleep, and time with your kids that you do not get back. The pattern across the table is not going to change its moves. Yours can change this week.</p>
    <div class="btn-row"><a class="btn btn--primary btn-big" href="#pricing">Enroll in the founding cohort</a></div>
    <p class="course-call">Questions first? Call ${phoneLink()}.</p>
  </div>
</section>

<section class="section section--ivory section--tight course-boiler" aria-label="More from Sean Collinson">
  <div class="wrap">
    <ul>
      <li>Free e-book: <a href="/think-like-a-hostage-negotiator/">Think Like a Hostage Negotiator</a></li>
      <li><a href="/divorce-mediation-checklist/">The Mediation Checklist</a></li>
      <li><a href="/newsletter/">The weekly newsletter</a></li>
      <li>The book: RESET OR REPEAT</li>
      <li>The podcast: <a href="/videos/">The Mediator with Sean Collinson</a></li>
      <li><a href="/mediation/">Mediation services</a></li>
    </ul>
    <address>The Mediation Office of Sean Collinson, 15301 Ventura Blvd, Sherman Oaks, CA 91403</address>
    <p>Phone ${phoneLink()}</p>
    <p>Book a consultation: <a href="${BOOK_URL}" target="_blank" rel="noopener">${BOOK_URL}</a></p>
    <p class="course-disclaimer">Think Like a Hostage Negotiator: The Family Case Course is an educational program in negotiation and communication strategy. It is not legal advice, legal services, or therapy, and enrolling does not create a mediator-client relationship. Sean Collinson is a mediator, not an attorney.</p>
  </div>
</section>
`;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
        { '@type': 'ListItem', position: 2, name: COURSE, item: abs(PATH) },
      ],
    };
    return layout({ path: PATH, title: meta.title, description: meta.description, body, schema: [schema], bodyClass: 'page-course', headExtra: style });
  },
};
