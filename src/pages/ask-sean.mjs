// Ask Sean (/ask-sean/). Copy supplied by Sean (Nov 24, 2026), used exactly.
// The form posts to forms/ask.php: the full submission is emailed to the office
// inbox, and first name and email only go to the MailerLite group "Ask Sean".
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { layout, breadcrumbs, esc, ctx } from '../lib/render.mjs';
import { field } from '../lib/forms.mjs';

const PATH = '/ask-sean/';
const meta = {
  path: PATH,
  out: 'ask-sean/index.html',
  title: 'Ask Sean | Sean Collinson',
  description: 'Ask Sean. Send the situation. Get the negotiator\'s read.',
  h1: 'Ask Sean',
};

const intro = [
  'Every Thursday on the show, Sean takes one real situation from this page and works it the way he works it in the mediation room: what the fight is actually about, where the emotion is blocking movement, and the exact words that lower the temperature.',
  'Send yours in a few lines. No names, no case details, nothing that could identify anybody. Sean answers patterns, not people, and submissions are blended and stripped of detail before anything airs, so what goes on the show helps thousands of people in your situation without ever pointing at you.',
  'Members of The Reset Community jump the queue and get their situations worked live with Sean every Wednesday. Everyone else, send it here and watch Thursday\'s episode.',
];
const safety = 'If you or your children are in danger, if there is abuse, or if you need an emergency court order, do not wait on a show. Call 911 in an emergency, and talk to a family law attorney in your state right away. Sean is a mediator, not your lawyer or therapist, and Ask Sean is education about communication patterns, never advice about your specific case. Real danger goes to a lawyer and the court, first and fast.';
const stages = ['Divorce in progress', 'Custody or co-parenting', 'Child support or money', 'Just separated, figuring it out', 'Other family conflict'];
const situationGuide = 'Tell it like you would tell a friend. What happened, what keeps repeating, and what you wish would change. Please leave out real names, your children\'s names, court dates, and anything that could identify you or your case.';
const questionGuide = 'If Sean could answer one question about this, what is it?';
const consent = 'I understand Ask Sean is education about patterns, not legal advice about my case, and that my situation may be blended with others and answered in general terms on the show, in the newsletter, or in the community.';
const smallPrint = 'How your situation is handled: names, dates, places, and identifying details are removed, and details from more than one submission are blended together before anything is answered in public. Sean never uses situations from his own mediation cases. If a situation is too specific to answer safely in public, it will not air, and we will point you toward a private consultation instead.';
const EBOOK_URL = 'https://seancollinson.com/think-like-a-hostage-negotiator/';

const style = `<style>
.ask-sub{font-size:var(--step-1);font-weight:700;line-height:1.45;color:#fff;max-width:34em;margin:0}
.ask-intro p{max-width:42em}
.ask-safety{margin:2rem 0;padding:1.25rem 1.35rem;border:2px solid #0A1B31;border-radius:var(--radius);background:#EFE3B8;color:#0A1428}
.ask-safety p{margin:0;color:#0A1428}
.ask-safety a{color:#0A1428;font-weight:700}
.ask-card{max-width:760px}
.ask-card .form__grid{grid-template-columns:1fr}
.ask-card textarea::placeholder,.ask-card input::placeholder{color:#5B6678;opacity:1}
.ask-thanks{padding:clamp(1.4rem,3vw,2.4rem);border-radius:var(--radius-lg);background:#0A1B31;color:#fff;max-width:760px}
.ask-thanks:focus{outline:none}
.ask-thanks p{color:#fff;margin:0 0 1rem}.ask-thanks p:last-child{margin:0}
.ask-thanks p:first-child{font-family:var(--display);font-size:var(--step-2);font-weight:800;line-height:1.2}
.ask-thanks a{color:#EED9A4;font-weight:700;overflow-wrap:anywhere}
.ask-small{font-size:.875rem;color:#34435A;max-width:62em;margin:2.5rem 0 0}
</style>`;

export const askSeanPage = {
  meta,
  render() {
    const crumbs = breadcrumbs([{ name: 'Ask Sean', path: PATH }]);
    const f = (o) => field({ ...o, idPrefix: 'ask' });
    const body = `
<section class="page-hero page-hero--dark" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${esc(meta.h1)}</h1>
    <p class="ask-sub">Send the situation. Get the negotiator's read.</p>
  </div>
</section>

<section class="section section--ivory" aria-label="Send your situation">
  <div class="wrap">
    <div class="ask-intro">${intro.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}</div>
    <div class="ask-safety" role="note"><p>${esc(safety).replace('Call 911', 'Call <a href="tel:911">911</a>')}</p></div>
    <div class="ask-card">
      <form class="form" data-ask action="/forms/ask.php" method="post" novalidate aria-label="Ask Sean">
        <input type="hidden" name="_t" value="" data-timestamp>
        <div class="hp" aria-hidden="true"><label for="ask-website">Leave this field empty</label><input id="ask-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
        <div class="form__grid">
          ${f({ name: 'first_name', label: 'First name or a nickname', required: true, autocomplete: 'given-name', maxlength: 80 })}
          ${f({ name: 'email', label: 'Email address', type: 'email', required: true, autocomplete: 'email', maxlength: 160 })}
          ${f({ name: 'stage', label: 'Where are you in it?', type: 'select', required: true, options: stages })}
          ${f({ name: 'situation', label: 'Your situation, in a few lines', type: 'textarea', required: true, rows: 7, maxlength: 4000 }).replace('<textarea ', `<textarea placeholder="${esc(situationGuide)}" `)}
          ${f({ name: 'question', label: 'The one thing you want Sean\'s read on', maxlength: 300 }).replace('<input ', `<input placeholder="${esc(questionGuide)}" `)}
          ${f({ name: 'consent', label: esc(consent), type: 'checkbox', required: true })}
        </div>
        <div class="form__actions"><button class="btn btn--primary" type="submit">Send My Situation</button></div>
        <div class="form__status" role="status" aria-live="polite" data-status></div>
      </form>
      <div class="ask-thanks" data-ask-thanks tabindex="-1" role="status" hidden>
        <p>Got it. Your situation is in the queue.</p>
        <p>Watch Thursday's episode, one situation gets worked every week. Members of The Reset Community jump the queue and get theirs worked live with Sean every Wednesday.</p>
        <p>Want the free e-book while you wait? How to Think Like a Hostage Negotiator When You Are Dealing with a Narcissist, free here: <a href="${EBOOK_URL}">${EBOOK_URL}</a></p>
      </div>
    </div>
    <p class="ask-small">${esc(smallPrint)}</p>
  </div>
</section>
`;
    const v = createHash('sha256').update(readFileSync(join(ctx.srcDir, 'assets/js/ask.js'))).digest('hex').slice(0, 10);
    return layout({ path: PATH, title: meta.title, description: meta.description, body, schema: [crumbs.schema], bodyClass: 'page-ask-sean', headExtra: style, bodyEnd: `<script src="/assets/js/ask.js?v=${v}" defer></script>` });
  },
};
