// Blog: index page and post template.
//
// Nothing is built, linked, or added to the sitemap until `posts` has at
// least one entry, so the live site never shows an empty blog. To publish
// the first post, add an entry below with real, reviewed content; the build
// then creates /blog/ and /blog/<slug>/ and adds both to the sitemap.
import { site } from '../config.mjs';
import { layout, breadcrumbs, ctaBand, esc, abs } from '../lib/render.mjs';

export const posts = [
  // {
  //   slug: 'what-to-expect-in-divorce-mediation',
  //   title: 'What to Expect in Divorce Mediation',
  //   description: 'One or two sentences for search results and the blog index.',
  //   date: '2026-12-01',           // ISO date, shown and used in schema
  //   body: `<p>Post content as HTML…</p>`,
  //   related: ['/divorce-mediation/'], // optional links shown under the post
  // },
];

const fmt = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const sorted = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));

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
    const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${this.meta.h1}</h1>
    <p class="page-hero__lede">Practical guidance on mediation, written in plain language.</p>
  </div>
</section>
<section class="section" aria-label="Articles">
  <div class="wrap narrow prose">
    ${sorted()
      .map((p) => `<article>
      <h2><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
      <p><time datetime="${p.date}">${fmt(p.date)}</time></p>
      <p>${esc(p.description)}</p>
    </article>`)
      .join('\n')}
  </div>
</section>
${ctaBand({ heading: 'Talk Through Your Situation', text: 'Book a confidential consultation to discuss your next practical step.' })}
`;
    return layout({ path: this.meta.path, title: this.meta.title, description: this.meta.description, body, schema: [crumbs.schema], bodyClass: 'page-blog' });
  },
};

const postPage = (p) => ({
  meta: {
    path: `/blog/${p.slug}/`,
    out: `blog/${p.slug}/index.html`,
    title: `${p.title} | Sean Collinson`,
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
      author: { '@id': abs('/about/#sean-collinson') },
      publisher: { '@id': abs('/#organization') },
      mainEntityOfPage: abs(this.meta.path),
    };
    const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${esc(p.title)}</h1>
    <p class="page-hero__lede">By Sean Collinson · <time datetime="${p.date}">${fmt(p.date)}</time></p>
  </div>
</section>
<article class="section">
  <div class="wrap narrow prose">
    ${p.body}
    ${p.related && p.related.length ? `<p>Related: ${p.related.map((r) => `<a href="${r}">${r.replace(/\//g, ' ').trim().replace(/-/g, ' ')}</a>`).join(', ')}</p>` : ''}
    <p class="fine-print">This article is general information, not legal advice. ${esc(site.person)} is a neutral mediator and does not represent either party.</p>
  </div>
</article>
${ctaBand({ heading: 'Talk Through Your Situation', text: 'Book a confidential consultation to discuss your next practical step.' })}
`;
    return layout({ path: this.meta.path, title: this.meta.title, description: this.meta.description, body, schema: [crumbs.schema, article], bodyClass: 'page-blog-post' });
  },
});

// Pages to build: none until the first post exists.
export const blogPages = () => (posts.length ? [index, ...posts.map(postPage)] : []);
