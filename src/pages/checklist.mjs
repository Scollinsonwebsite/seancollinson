// Free checklist landing page (/divorce-mediation-checklist/). Same opt-in
// flow as the e-book: forms/ebook.php with offer=checklist adds the visitor to
// the MailerLite "Mediation Checklist" group; the PDF is delivered by email.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { office } from '../config.mjs';
import { layout, breadcrumbs, esc, bookingLink, ctx } from '../lib/render.mjs';
import { field } from '../lib/forms.mjs';

const meta = {
  path: '/divorce-mediation-checklist/',
  out: 'divorce-mediation-checklist/index.html',
  title: 'Free Checklist: What to Bring to Divorce Mediation in California | Sean Collinson',
  description: 'Free checklist from Los Angeles mediator Sean Collinson: the documents, parenting details, and questions to bring to divorce mediation in California.',
  h1: 'Free Checklist: What to Bring to Divorce Mediation in California',
};

const preview = [
  ['Money and property documents', ['Tax returns, last 2 years', 'Bank statements, last 3 months', 'Retirement and investment account statements']],
  ['Parenting documents', ['Children’s school information and school calendar', 'The current custody or visitation schedule, if any']],
  ['Legal documents', ['Any existing court orders', 'Prenuptial or postnuptial agreement, if any']],
  ['Come in ready', ['Your top 3 goals, written down', 'Your questions for the mediator, written down']],
];

const style = `<style>.cl-preview{display:grid;gap:1rem;margin-top:1rem}@media (min-width:760px){.cl-preview{grid-template-columns:1fr 1fr}}.cl-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1.1rem 1.25rem}.cl-card h3{margin:0 0 .5rem;font-size:1.05rem}.cl-card ul{margin:0;padding-left:1.1rem}.cl-more{margin-top:1rem;color:var(--t-muted)}.ebook-card{max-width:640px;background:var(--surface);border-radius:var(--radius-lg);padding:clamp(1.4rem,3vw,2.4rem);box-shadow:var(--lift);margin:0 auto}.ebook-card .form{background:none;box-shadow:none;border:0;padding:0;margin:0;max-width:none}.ebook-card .form__title{font-size:var(--step-2);margin-top:0}.ebook-card .form__grid{grid-template-columns:1fr}@media (min-width:700px){.ebook-card .form__grid{grid-template-columns:1fr 1fr}}.ebook-nospam{margin:.9rem 0 0;font-size:.9rem;color:var(--t-muted)}.ebook-thanks:focus{outline:none}.ebook-thanks h2{font-size:var(--step-2);margin:0 0 .5rem}</style>`;

export const checklistPage = {
  meta,
  render() {
    const crumbs = breadcrumbs([{ name: 'Free Checklist', path: meta.path }]);
    const f = (o) => field({ ...o, required: true, idPrefix: 'cl' });
    const body = `
<section class="page-hero page-hero--dark" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title" style="max-width:22ch">${esc(meta.h1)}</h1>
    <p class="page-hero__lede">Walking into mediation prepared saves time, money, and stress. This free checklist from Sean Collinson lists the documents, parenting details, and questions to bring, so your first session can focus on decisions instead of paperwork.</p>
    <div class="btn-row"><a class="btn btn--primary" href="#get-the-checklist">Get the free checklist</a></div>
  </div>
</section>

<section class="section" aria-labelledby="preview-title">
  <div class="wrap narrow">
    <h2 id="preview-title" class="section__title">A preview of the checklist</h2>
    <div class="cl-preview">${preview.map(([h, items]) => `<div class="cl-card"><h3>${esc(h)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>
    <p class="cl-more">The full checklist covers every item, from pay stubs and vehicle titles to childcare costs and the points you can trade.</p>
  </div>
</section>

<section class="section section--ivory" id="get-the-checklist" aria-labelledby="cl-form-title">
  <div class="wrap">
    <div class="ebook-card">
      <form class="form" data-ebook action="/forms/ebook.php" method="post" novalidate aria-labelledby="cl-form-title">
        <h2 class="form__title" id="cl-form-title">Get the free checklist</h2>
        <input type="hidden" name="offer" value="checklist">
        <input type="hidden" name="_t" value="" data-timestamp>
        <div class="hp" aria-hidden="true"><label for="cl-website">Leave this field empty</label><input id="cl-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
        <div class="form__grid">
          ${f({ name: 'first_name', label: 'First name', autocomplete: 'given-name', maxlength: 80 })}
          ${f({ name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', maxlength: 160 })}
        </div>
        <div class="form__actions"><button class="btn btn--primary" type="submit">Send Me the Free Checklist</button></div>
        <p class="ebook-nospam">No spam. Unsubscribe anytime.</p>
        <div class="form__status" role="status" aria-live="polite" data-status></div>
      </form>
      <div class="ebook-thanks" data-ebook-thanks tabindex="-1" role="status" hidden>
        <h2>Check your email to download your free checklist.</h2>
        <p>The download link is on its way to your inbox. If you don’t see it in a few minutes, check your spam or promotions folder.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="cl-help-title">
  <div class="wrap narrow prose">
    <h2 id="cl-help-title" class="section__title">Want help preparing?</h2>
    <p>Sean Collinson is a Los Angeles divorce and family mediator with 22+ years of experience. Your first consultation is free.</p>
    <div class="btn-row"><a class="btn btn--primary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a>${bookingLink('btn btn--secondary')}</div>
  </div>
</section>
`;
    const v = createHash('sha256').update(readFileSync(join(ctx.srcDir, 'assets/js/ebook.js'))).digest('hex').slice(0, 10);
    return layout({ path: meta.path, title: meta.title, description: meta.description, body, schema: [crumbs.schema], bodyClass: 'page-checklist', headExtra: style, bodyEnd: `<script src="/assets/js/ebook.js?v=${v}" defer></script>` });
  },
};
