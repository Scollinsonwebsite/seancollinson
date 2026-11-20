// Blog: index page and the reusable post template.
//
// Nothing is built, linked, or added to the sitemap until `posts` has at
// least one entry. To publish a post, add its Markdown body under
// src/content/blog/<slug>.md and an entry below; the build creates
// /blog/<slug>/ and adds it to the index and the sitemap.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { site, office } from '../config.mjs';
import { layout, breadcrumbs, esc, abs, ctx, bookingLink, officeAddress, faqSchema, ids } from '../lib/render.mjs';
import { markdown } from '../lib/markdown.mjs';
import { ebookReady, EBOOK_ANCHOR, ebookStripStyle } from './ebook.mjs';
import { ebook } from '../config.mjs';

export const posts = [
  {
    slug: 'high-conflict-custody-mediation-los-angeles',
    title: 'High-Conflict Custody in Los Angeles: What Actually Works When You Can\'t Agree on Anything',
    metaTitle: 'High-Conflict Custody in Los Angeles | Sean Collinson',
    description: 'Can\'t agree on custody? Los Angeles mediator and FBI-trained crisis negotiator Sean Collinson explains what actually works in high-conflict custody cases.',
    date: '2026-11-19',
    // No featured image supplied: the post uses the standard content-page hero band.
    image: null,
    ebookLink: true,
    faqs: [
      { q: "Can custody mediation work if we can\'t be in the same room?", a: "Yes. Mediation does not require you to sit together. Sessions can run with each parent in a separate room while the mediator moves between you, or by Zoom. The structure is built for exactly that situation." },
      { q: "What if my co-parent won\'t compromise on anything?", a: "You do not need to agree on everything, or even like each other, to settle a parenting plan. Mediation works on one issue at a time and focuses on your child\'s needs and each parent\'s real interests underneath the positions. Most high-conflict parents are surprised by what moves once the conversation is structured." },
      { q: "How long does custody mediation take compared to going to court?", a: "Court custody cases commonly run through multiple hearings spread over months, on the court\'s schedule. Mediation is scheduled around your life and usually works through a parenting plan in a small number of focused sessions. Every case is different, and timing is covered in the consultation." },
      { q: "Is a mediated parenting plan enforceable?", a: "Yes. Once your agreement is written up, signed, and filed with and approved by the court, it becomes a court order with the same force as one a judge imposed — except you built it yourselves, around your child\'s actual life." },
      { q: "How much does child custody mediation cost?", a: "Cost depends on the number of sessions and the preparation your case needs, and fees are explained fully in the consultation before you commit to anything. What mediation does not carry is the cost structure of two attorneys litigating against each other through repeated court hearings." },
    ],
  },
];

export const AUTHOR_LINE = 'By Sean Collinson, The Mediator — The Mediation Office of Sean Collinson';

const relatedServices = [
  ['/mediator-los-angeles/', 'Mediator Los Angeles'],
  ['/divorce-mediation/', 'Divorce mediation'],
  ['/child-custody-mediation/', 'Child custody mediation'],
  ['/holiday-parenting-schedules/', 'Holiday parenting schedules'],
  ['/high-conflict-settlement-officer/', 'High-conflict settlement officer'],
  ['/how-mediation-works/', 'How mediation works'],
  ['/faq/', 'Mediation FAQ'],
];

const fmt = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const sorted = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
const body = (p) => markdown(readFileSync(join(ctx.srcDir, 'content', 'blog', `${p.slug}.md`), 'utf8'));

const blogStyle = `<style>.post-list{list-style:none;margin:0;padding:0;display:grid;gap:var(--space-3)}.post-card{background:var(--white);border-radius:var(--radius);padding:1.5rem 1.6rem;box-shadow:var(--lift)}.post-card__title{font-size:var(--step-2);line-height:1.2;margin:0 0 .4rem}.post-card__date{margin:0 0 .6rem;font-size:.9rem;color:var(--color-text-muted,#4a5568)}.post-card__more{margin:.6rem 0 0;font-weight:600}.post-byline{margin:1rem 0 0;font-size:var(--step-0);color:var(--on-sky-soft)}.post-byline time{display:block;margin-top:.25rem}.post-related{margin-top:var(--space-4);padding:1.4rem 1.6rem;border-radius:var(--radius);background:var(--sky-50)}.post-related h2{font-size:var(--step-1);margin:0 0 .6rem}.post-related ul{margin:0;padding-left:1.1rem}.post-cta .btn-row{margin-top:1rem}</style>`;

// The call to action at the end of every post: booking, tap-to-call, office.
const postCta = () => `<section class="section section--ivory post-cta" aria-labelledby="post-cta-title">
  <div class="wrap narrow prose">
    <h2 id="post-cta-title" class="section__title">Book a consultation</h2>
    <p>A private first conversation about your situation, the format, and fees.</p>
    <address style="font-style:normal">${officeAddress()}</address>
    <div class="btn-row">${bookingLink('btn btn--primary')}<a class="btn btn--secondary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a></div>
  </div>
</section>`;

const index = {
  meta: {
    path: '/blog/',
    out: 'blog/index.html',
    title: 'Mediation Blog | Sean Collinson, Los Angeles Mediator',
    description: 'Practical articles about divorce, custody, support, and business mediation from Los Angeles mediator Sean Collinson.',
    h1: 'Mediation Blog',
  },
  render() {
    const crumbs = breadcrumbs([{ name: 'Blog', path: this.meta.path }]);
    const html = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${this.meta.h1}</h1>
    <p class="page-hero__lede">Practical guidance on mediation, written in plain language.</p>
  </div>
</section>
<section class="ebook-strip newsletter-strip" aria-label="Newsletter">
  <div class="wrap ebook-strip__inner">
    <div class="ebook-strip__text"><p class="ebook-strip__title" style="margin:0">Get Think Like a Hostage Negotiator, Sean\u2019s weekly newsletter.</p></div>
    <a class="btn ebook-strip__btn" href="/newsletter/">Subscribe free</a>
  </div>
</section>
<section class="section" aria-label="Articles">
  <div class="wrap narrow">
    <ul class="post-list">
    ${sorted()
      .map((p) => `<li class="post-card">
      <h2 class="post-card__title"><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
      <p class="post-card__date"><time datetime="${p.date}">${fmt(p.date)}</time></p>
      <p>${esc(p.description)}</p>
      <p class="post-card__more"><a href="/blog/${p.slug}/" aria-hidden="true" tabindex="-1">Read the article</a></p>
    </li>`)
      .join('\n')}
    </ul>
  </div>
</section>
${postCta()}
`;
    const list = {
      '@type': 'Blog',
      name: 'Mediation Blog',
      url: abs(this.meta.path),
      publisher: { '@id': ids.organization },
      blogPost: sorted().map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(`/blog/${p.slug}/`), datePublished: p.date })),
    };
    return layout({ path: this.meta.path, title: this.meta.title, description: this.meta.description, body: html, schema: [crumbs.schema, list], bodyClass: 'page-blog', headExtra: blogStyle + ebookStripStyle });
  },
};

const postPage = (p) => ({
  meta: {
    path: `/blog/${p.slug}/`,
    out: `blog/${p.slug}/index.html`,
    title: p.metaTitle || `${p.title} | Sean Collinson`,
    description: p.description,
    h1: p.title,
  },
  render() {
    const crumbs = breadcrumbs([{ name: 'Blog', path: '/blog/' }, { name: p.title, path: this.meta.path }]);
    const article = {
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.modified || p.date,
      url: abs(this.meta.path),
      mainEntityOfPage: abs(this.meta.path),
      author: { '@type': 'Person', '@id': ids.person, name: site.person, url: abs('/about/') },
      publisher: { '@type': 'Organization', '@id': ids.organization, name: site.name, logo: { '@type': 'ImageObject', url: abs('/assets/img/logo.png') } },
      ...(p.image ? { image: abs(p.image.src) } : {}),
    };
    const figure = p.image
      ? `<figure class="post-figure"><img src="${esc(p.image.src)}" alt="${esc(p.image.alt)}" width="${p.image.width}" height="${p.image.height}"></figure>`
      : '';
    const html = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title" style="max-width:24ch">${esc(p.title)}</h1>
    <p class="post-byline">${esc(AUTHOR_LINE)}<time datetime="${p.date}">${fmt(p.date)}</time></p>
  </div>
</section>
<article class="section" aria-labelledby="page-title">
  <div class="wrap narrow prose">
    ${figure}
    ${body(p)}
    ${p.ebookLink && ebookReady() ? `<p class="post-ebook">Want the scripts? Download the <a href="${ebook.path}">${EBOOK_ANCHOR}</a>.</p>` : ''}
    <nav class="post-related" aria-labelledby="related-title">
      <h2 id="related-title">Related services</h2>
      <ul>${relatedServices.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
    </nav>
  </div>
</article>
${postCta()}
`;
    const schema = [crumbs.schema, article];
    if (p.faqs && p.faqs.length) schema.push(faqSchema(p.faqs.map((f) => ({ q: f.q, a: `<p>${esc(f.a)}</p>` }))));
    return layout({ path: this.meta.path, title: this.meta.title, description: this.meta.description, body: html, schema, bodyClass: 'page-blog-post', headExtra: blogStyle });
  },
});

// Pages to build: none until the first post exists.
export const blogPages = () => (posts.length ? [index, ...posts.map(postPage)] : []);
