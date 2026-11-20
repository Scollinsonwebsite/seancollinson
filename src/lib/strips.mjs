// Shared bands used across pages: homepage stats band, compact review strip,
// checklist strip, and the "Training and Background" credentials list.
import { reviews } from '../config.mjs';
import { esc } from './render.mjs';

export const REVIEWS_LINE = `${reviews.rating} stars from ${reviews.count} Google reviews`;

export const statsItems = [
  ['22+ years', 'of mediation experience'],
  [`${reviews.rating} stars`, `from ${reviews.count} Google reviews`],
  ['Nearly 400,000', 'views on Dr. Phil'],
  ['FBI-trained', 'crisis negotiator'],
];

export const statsBand = () => `<section class="stats-band" aria-label="At a glance">
  <div class="wrap">
    <ul class="stats-band__list">${statsItems.map(([big, small]) => `<li class="stats-band__item"><strong>${esc(big)}</strong> <span>${esc(small)}</span></li>`).join('')}</ul>
  </div>
</section>`;

export const reviewStrip = () => `<section class="review-strip" aria-label="Client reviews">
  <div class="wrap review-strip__inner">
    <p class="review-strip__text"><span class="review-strip__stars" aria-hidden="true">★★★★★</span> <strong>${esc(reviews.rating)} stars</strong> from ${reviews.count} Google reviews</p>
    <a class="review-strip__link" href="/testimonials/">Read client reviews</a>
  </div>
</section>`;

export const checklistStrip = () => `<section class="ebook-strip checklist-strip" aria-labelledby="checklist-strip-title">
  <div class="wrap ebook-strip__inner">
    <span class="checklist-strip__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6v2.5H9z"/><path d="m8.5 11 1.5 1.5 3-3M8.5 16.5l1.5 1.5 3-3"/><path d="M15 11.5h1M15 17h1"/></svg></span>
    <div class="ebook-strip__text">
      <h2 id="checklist-strip-title" class="ebook-strip__title">Free Checklist: What to Bring to Divorce Mediation in California</h2>
      <p class="ebook-strip__line">Every document, parenting detail, and question to prepare before your first session. Free download.</p>
    </div>
    <a class="btn ebook-strip__btn" href="/divorce-mediation-checklist/">Get the Free Checklist</a>
  </div>
</section>`;

export const credentialItems = [
  'Harvard Program on Negotiation',
  'Loyola Law School, Mediating the Litigated Case',
  'Advanced family mediation training recognized by the Florida Supreme Court',
  'FBI-trained crisis negotiator, volunteer with the Los Angeles County Sheriff’s Department',
  'Author, RESET OR REPEAT: Break Your Patterns Before They Break You',
];

export const credentialsSection = ({ ivory = false } = {}) => `<section class="section${ivory ? ' section--ivory' : ''}" aria-labelledby="training-bg-title">
  <div class="wrap">
    <h2 id="training-bg-title" class="section__title">Training and Background</h2>
    <ul class="cred-list">${credentialItems.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    <p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>
  </div>
</section>`;

export const stripsStyle = `<style>
.stats-band{background:var(--n1);color:var(--t-head);border-top:1px solid rgba(238, 217, 164, 0.35);border-bottom:1px solid rgba(238, 217, 164, 0.35);padding:1.1rem 0}
.stats-band__list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:.9rem 1.25rem}
.stats-band__item{line-height:1.3;font-size:.95rem;color:var(--t-body)}
.stats-band__item strong{display:block;font-size:1.3rem;font-weight:800;color:var(--t-accent);letter-spacing:-.01em}
@media (min-width:900px){.stats-band__list{grid-template-columns:repeat(4,1fr)}.stats-band__item{padding-left:1rem;border-left:1px solid rgba(238, 217, 164, 0.35)}.stats-band__item:first-child{border-left:0;padding-left:0}}
.review-strip{background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:1rem 0}
.review-strip__inner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1.5rem}
.review-strip__text{margin:0;font-size:1.02rem;color:var(--t-head)}
.review-strip__stars{color:var(--t-accent);letter-spacing:2px;margin-right:.25rem}
.review-strip__link{font-weight:700;color:var(--t-accent)}
.checklist-strip{border-top:0}
.checklist-strip__icon{display:inline-grid;place-items:center;width:64px;height:64px;border-radius:12px;background:rgba(238, 217, 164, 0.14);color:var(--t-accent);flex-shrink:0}
.cred-list{margin:0;padding-left:1.2rem;display:grid;gap:.55rem;font-size:1.05rem;max-width:52rem}
</style>`;
