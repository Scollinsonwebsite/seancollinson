import { layout } from '../lib/render.mjs';

export const meta = {
  path: '/404.html',
  out: '404.html',
  title: 'Page Not Found | Mediation Office of S. Collinson',
  description: 'The page you were looking for could not be found.',
  h1: 'This page could not be found',
  noindex: true,
};

export function render() {
  const body = `
<section class="page-hero page-hero--compact notfound" aria-labelledby="page-title">
  <div class="wrap narrow">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">The link may be out of date, or the address may have been typed incorrectly. These pages are a good place to continue:</p>
    <ul class="notfound__links">
      <li><a href="/">Return to the home page</a></li>
      <li><a href="/mediation/">Explore mediation services</a></li>
      <li><a href="/contact/">Contact the office</a></li>
    </ul>
  </div>
</section>`;
  return layout({ path: '/404.html', title: meta.title, description: meta.description, body, noindex: true, bodyClass: 'page-404' });
}
