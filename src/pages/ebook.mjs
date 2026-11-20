// Free e-book landing page with the MailerLite opt-in (forms/ebook.php).
import { ebook, office } from '../config.mjs';
import { layout, breadcrumbs, esc, bookingLink } from '../lib/render.mjs';
import { field } from '../lib/forms.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { ctx } from '../lib/render.mjs';

export const EBOOK_TITLE = 'How to Think Like a Hostage Negotiator When You’re Dealing with a Narcissist';
export const EBOOK_ANCHOR = 'free e-book: Think Like a Hostage Negotiator';
export const ebookReady = () => Boolean(ebook.cover && ebook.pdf);

const meta = {
  path: ebook.path,
  out: 'think-like-a-hostage-negotiator/index.html',
  title: 'Think Like a Hostage Negotiator | Free E-Book | Sean Collinson, Los Angeles Mediator',
  description: 'Free e-book from Los Angeles mediator and FBI-trained crisis negotiator Sean Collinson: the mindset and word-for-word scripts for high-conflict divorce and custody.',
  h1: EBOOK_TITLE,
};

const learn = [
  'Why facts and logic never win with a high-conflict person, and what actually moves them',
  'The 5 mindset shifts hostage negotiators use that work in divorce and custody',
  'The RESET framework applied to a live negotiation',
  'Word-for-word scripts for the baited insult, the midnight demand, the moved goalpost, and the custody threat',
  'Divorce money talks: negotiating property and support without negotiating the story',
  'Custody language that protects your parenting time, and holiday schedules that hold',
  'The red flags that mean stop negotiating alone and get help',
];

export const coverImg = (cls, sizes, loading = 'eager') =>
  `<img class="${cls}" src="${esc(ebook.cover.src)}" width="${ebook.cover.width}" height="${ebook.cover.height}" alt="Cover of the e-book ${esc(EBOOK_TITLE)} by Sean Collinson" loading="${loading}" decoding="async" sizes="${sizes}">`;

const style = `<style>.ebook-hero__grid{display:grid;gap:var(--space-4);align-items:center}.ebook-hero__sub{font-size:var(--step-1);line-height:1.55;color:var(--on-sky-soft);max-width:36em}.ebook-hero__cover{justify-self:center;width:min(320px,70vw);height:auto;border-radius:6px;box-shadow:0 28px 60px -24px rgba(0,0,0,.65)}@media (min-width:900px){.ebook-hero__grid{grid-template-columns:minmax(0,7fr) minmax(0,4fr)}.ebook-hero__cover{justify-self:end}}.ebook-card{margin-top:var(--space-4);max-width:640px;background:var(--white);color:var(--ink,#0f172a);border-radius:var(--radius-lg);padding:clamp(1.4rem,3vw,2.2rem);box-shadow:0 30px 60px -30px rgba(0,0,0,.55)}.ebook-card .form{background:none;box-shadow:none;border:0;padding:0;margin:0;max-width:none}.ebook-card h2,.page-hero .ebook-card h2{color:var(--sky-950)}.ebook-card .form__title{font-size:var(--step-2);margin-top:0}.page-hero .ebook-card .btn--primary{background:var(--sky-700);color:#fff;box-shadow:none}.page-hero .ebook-card .btn--primary:hover{background:var(--sky-800)}.page-hero .ebook-card p{color:var(--ink,#1f2937)}.page-hero .ebook-card .ebook-nospam{color:var(--muted)}.ebook-card .form__grid{grid-template-columns:1fr}@media (min-width:700px){.ebook-card .form__grid{grid-template-columns:1fr 1fr}}.ebook-card .ebook-nospam{margin:.9rem 0 0;font-size:.9rem;color:var(--muted)}.ebook-thanks:focus{outline:none}.ebook-thanks h2{font-size:var(--step-2);margin:0 0 .5rem}.ebook-learn li{margin-bottom:.6rem}.ebook-about .btn-row{margin-top:1rem}</style>`;

export const ebookPage = {
  meta,
  render() {
    const crumbs = breadcrumbs([{ name: 'Free E-Book', path: meta.path }]);
    const f = (o) => field({ ...o, required: true, idPrefix: 'eb' });
    const body = `
<section class="page-hero page-hero--dark ebook-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <div class="ebook-hero__grid">
      <div>
        <h1 id="page-title" class="page-hero__title" style="max-width:20ch">${esc(EBOOK_TITLE)}</h1>
        <p class="ebook-hero__sub">A free e-book from Los Angeles mediator and FBI-trained crisis negotiator Sean Collinson, the mindset and word-for-word scripts he uses to settle high-conflict divorce and custody cases.</p>
      </div>
      ${coverImg('ebook-hero__cover', '(min-width: 900px) 320px, 70vw')}
    </div>
    <div class="ebook-card" id="get-the-ebook">
      <form class="form" data-ebook action="/forms/ebook.php" method="post" novalidate aria-labelledby="ebook-form-title">
        <h2 class="form__title" id="ebook-form-title">Get the free e-book</h2>
        <input type="hidden" name="_t" value="" data-timestamp>
        <div class="hp" aria-hidden="true"><label for="eb-website">Leave this field empty</label><input id="eb-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
        <div class="form__grid">
          ${f({ name: 'first_name', label: 'First name', autocomplete: 'given-name', maxlength: 80 })}
          ${f({ name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', maxlength: 160 })}
        </div>
        <div class="form__actions"><button class="btn btn--primary" type="submit">Send Me the Free E-Book</button></div>
        <p class="ebook-nospam">No spam. Unsubscribe anytime.</p>
        <div class="form__status" role="status" aria-live="polite" data-status></div>
      </form>
      <div class="ebook-thanks" data-ebook-thanks tabindex="-1" hidden>
        <h2>Thank you. Your e-book is ready.</h2>
        <p>Download it now. You do not need to wait for an email.</p>
        <p><a class="btn btn--primary" href="#" data-download download>Download the E-Book</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="learn-title">
  <div class="wrap narrow prose">
    <h2 id="learn-title" class="section__title">What you’ll learn</h2>
    <ul class="ebook-learn">${learn.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    <p><a href="#get-the-ebook">Get the free e-book</a></p>
  </div>
</section>

<section class="section section--ivory ebook-about" aria-labelledby="about-title">
  <div class="wrap narrow prose">
    <h2 id="about-title" class="section__title">About Sean Collinson</h2>
    <p>Sean Collinson is a Los Angeles divorce and family mediator with 22+ years of experience, trained at the Harvard Program on Negotiation and as an FBI-trained crisis negotiator. As seen on Dr. Phil.</p>
    <div class="btn-row"><a class="btn btn--primary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a>${bookingLink('btn btn--secondary')}</div>
  </div>
</section>
`;
    const book = {
      '@type': 'Book',
      name: EBOOK_TITLE,
      author: { '@type': 'Person', name: 'Sean Collinson' },
      bookFormat: 'https://schema.org/EBook',
      isAccessibleForFree: true,
      image: `https://seancollinson.com${ebook.cover.src}`,
      url: `https://seancollinson.com${meta.path}`,
    };
    return layout({
      path: meta.path,
      title: meta.title,
      description: meta.description,
      body,
      schema: [crumbs.schema, book],
      bodyClass: 'page-ebook',
      headExtra: style,
      bodyEnd: `<script src="/assets/js/ebook.js?v=${createHash('sha256').update(readFileSync(join(ctx.srcDir, 'assets/js/ebook.js'))).digest('hex').slice(0, 10)}" defer></script>`,
    });
  },
};
