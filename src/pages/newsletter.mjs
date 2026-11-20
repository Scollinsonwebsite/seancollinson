// Weekly newsletter signup (/newsletter/). Same opt-in handler as the e-book:
// forms/ebook.php with offer=newsletter adds the visitor to the MailerLite
// "Think Like a Hostage Negotiator Newsletter" group (double opt-in), and the
// "Newsletter welcome" automation sends the welcome email once they confirm.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { office } from '../config.mjs';
import { layout, breadcrumbs, esc, ctx } from '../lib/render.mjs';
import { field } from '../lib/forms.mjs';

const meta = {
  path: '/newsletter/',
  out: 'newsletter/index.html',
  title: 'Think Like a Hostage Negotiator | Weekly Newsletter | Sean Collinson',
  description: 'The weekly newsletter from Los Angeles mediator and FBI-trained crisis negotiator Sean Collinson. One email every Wednesday morning. Free.',
  h1: 'Think Like a Hostage Negotiator',
};

const bullets = [
  'One negotiator move a week, explained the way Sean teaches it in the mediation room',
  'Word-for-word scripts for the texts, emails, and conversations you are dreading',
  'What actually works in high-conflict divorce and custody, from 22+ years of cases (names changed)',
  'The Reset practice Sean gives his own clients',
];
const creds = ['22+ years of mediation experience', 'Harvard Program on Negotiation', 'FBI-trained crisis negotiator', 'Author of RESET OR REPEAT'];

const style = `<style>.nl-sub{font-size:var(--step-1);line-height:1.5;color:var(--on-sky-soft);max-width:36em}.nl-get li{margin-bottom:.6rem}.ebook-card{max-width:640px;background:var(--white);border-radius:var(--radius-lg);padding:clamp(1.4rem,3vw,2.4rem);box-shadow:var(--lift);margin:0 auto}.ebook-card .form{background:none;box-shadow:none;border:0;padding:0;margin:0;max-width:none}.ebook-card .form__title{font-size:var(--step-2);margin-top:0}.ebook-card .form__grid{grid-template-columns:1fr}@media (min-width:700px){.ebook-card .form__grid{grid-template-columns:1fr 1fr}}.ebook-nospam{margin:.9rem 0 0;font-size:.9rem;color:var(--muted)}.ebook-thanks:focus{outline:none}.ebook-thanks h2{font-size:var(--step-2);margin:0 0 .5rem}.nl-ebook{margin:1.25rem auto 0;max-width:640px;text-align:center}.nl-creds{margin:0 0 1rem;padding-left:1.2rem}</style>`;

export const newsletterPage = {
  meta,
  render() {
    const crumbs = breadcrumbs([{ name: 'Newsletter', path: meta.path }]);
    const f = (o) => field({ ...o, required: true, idPrefix: 'nl' });
    const body = `
<section class="page-hero page-hero--dark" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${esc(meta.h1)}</h1>
    <p class="nl-sub">The weekly newsletter from Sean Collinson, Los Angeles mediator and FBI-trained crisis negotiator.</p>
    <p class="page-hero__lede">One email a week, every Wednesday morning. No noise. The negotiator mindset and the exact words to use when you are dealing with a narcissist or a high-conflict person, at home, in custody, or at the settlement table.</p>
    <div class="btn-row"><a class="btn btn--primary" href="#subscribe">Subscribe free</a></div>
  </div>
</section>

<section class="section" aria-labelledby="get-title">
  <div class="wrap narrow prose">
    <h2 id="get-title" class="section__title">What you get</h2>
    <ul class="nl-get">${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>
</section>

<section class="section section--ivory" id="subscribe" aria-labelledby="nl-form-title">
  <div class="wrap">
    <div class="ebook-card">
      <form class="form" data-ebook action="/forms/ebook.php" method="post" novalidate aria-labelledby="nl-form-title">
        <h2 class="form__title" id="nl-form-title">Subscribe free</h2>
        <input type="hidden" name="offer" value="newsletter">
        <input type="hidden" name="_t" value="" data-timestamp>
        <div class="hp" aria-hidden="true"><label for="nl-website">Leave this field empty</label><input id="nl-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
        <div class="form__grid">
          ${f({ name: 'first_name', label: 'First name', autocomplete: 'given-name', maxlength: 80 })}
          ${f({ name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', maxlength: 160 })}
        </div>
        <div class="form__actions"><button class="btn btn--primary" type="submit">Subscribe</button></div>
        <p class="ebook-nospam">One email a week. Unsubscribe anytime.</p>
        <div class="form__status" role="status" aria-live="polite" data-status></div>
      </form>
      <div class="ebook-thanks" data-ebook-thanks tabindex="-1" role="status" hidden>
        <h2>Check your email to confirm your subscription.</h2>
      </div>
    </div>
    <p class="nl-ebook">New here? <a href="/think-like-a-hostage-negotiator/">Start with the free e-book.</a></p>
  </div>
</section>

<section class="section" aria-labelledby="nl-about-title">
  <div class="wrap narrow prose">
    <h2 id="nl-about-title" class="section__title">About Sean Collinson</h2>
    <ul class="nl-creds">${creds.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    <div class="btn-row"><a class="btn btn--primary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a></div>
  </div>
</section>
`;
    const v = createHash('sha256').update(readFileSync(join(ctx.srcDir, 'assets/js/ebook.js'))).digest('hex').slice(0, 10);
    return layout({ path: meta.path, title: meta.title, description: meta.description, body, schema: [crumbs.schema], bodyClass: 'page-newsletter', headExtra: style, bodyEnd: `<script src="/assets/js/ebook.js?v=${v}" defer></script>` });
  },
};
