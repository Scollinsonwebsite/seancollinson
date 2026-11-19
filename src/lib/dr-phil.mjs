// "As Seen on Dr. Phil" video section, used on the homepage (under the hero)
// and at the top of the Videos page. Uses the site's existing click-to-play
// player (.video__play in site.js), so YouTube loads only when played.
import { office } from '../config.mjs';
import { esc, bookingLink } from './render.mjs';

const ID = 'rKT61ILCxEc';
const embed = `https://www.youtube-nocookie.com/embed/${ID}?start=7`;
const title = 'Sean Collinson on Dr. Phil';
const tagline = 'Resolve Conflict Without Losing Control';

export const drPhilStyle = `<style>.dr-phil__head{text-align:center;max-width:46rem;margin:0 auto var(--space-4)}.dr-phil__head .section__lede{margin-inline:auto}.dr-phil__figure{max-width:980px;margin:0 auto}.dr-phil__figure .video__frame{box-shadow:0 24px 48px -28px rgba(11,22,38,.55)}.dr-phil__caption{margin-top:1rem;text-align:center;font-size:var(--step-0);color:var(--color-text-muted,#4a5568)}.dr-phil__caption strong{color:var(--sky-900)}.dr-phil .btn-row{justify-content:center;margin-top:var(--space-3)}.dr-phil__figure picture{display:block;width:100%;height:100%}.dr-phil + .bento-wrap{padding-top:var(--space-5)}.dr-phil + .bento-wrap .bento{margin-top:0}</style>`;

export const drPhilSection = ({ ivory = false } = {}) => `<section class="section${ivory ? ' section--ivory' : ''} dr-phil" id="as-seen-on-dr-phil" aria-labelledby="dr-phil-title">
  <div class="wrap">
    <div class="dr-phil__head">
      <h2 id="dr-phil-title" class="section__title">As Seen on Dr. Phil</h2>
      <p class="section__lede">When emotions run high, Sean brings calm to the room and helps people find a reset, so the conversation can move forward.</p>
    </div>
    <figure class="dr-phil__figure">
      <div class="video__frame">
        <button class="video__play" type="button" data-embed="${esc(embed)}" data-title="${esc(title)}">
          <picture><source type="image/webp" srcset="/assets/img/home/video-dr-phil-640.webp 640w, /assets/img/home/video-dr-phil-1280.webp 1280w" sizes="(min-width: 1060px) 980px, 92vw"><img src="/assets/img/home/video-dr-phil-1280.jpg" srcset="/assets/img/home/video-dr-phil-640.jpg 640w, /assets/img/home/video-dr-phil-1280.jpg 1280w" sizes="(min-width: 1060px) 980px, 92vw" alt="" width="1280" height="720" loading="lazy" decoding="async"></picture>
          <span class="video__icon" aria-hidden="true"></span>
          <span class="visually-hidden">Play video: ${esc(title)}</span>
        </button>
      </div>
      <figcaption class="dr-phil__caption"><strong>Sean Collinson on Dr. Phil.</strong> ${esc(tagline)}.</figcaption>
    </figure>
    <div class="btn-row">${bookingLink('btn btn--primary')}<a class="btn btn--secondary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a></div>
  </div>
</section>`;

export const drPhilSchema = () => ({
  '@type': 'VideoObject',
  name: title,
  description: 'Family and civil mediator Sean Collinson appears on Dr. Phil to help with a visitation dispute.',
  thumbnailUrl: 'https://seancollinson.com/assets/img/home/video-dr-phil-1280.jpg',
  uploadDate: '2018-01-31T09:21:18-08:00',
  embedUrl: `https://www.youtube-nocookie.com/embed/${ID}`,
  contentUrl: `https://www.youtube.com/watch?v=${ID}`,
});
