import { videos, videoCategories } from '../config.mjs';
import { layout, breadcrumbs, ctaBand, esc, isDraft, phBlock, slug } from '../lib/render.mjs';

export const meta = {
  path: '/videos/',
  out: 'videos/index.html',
  title: 'Mediation and Conflict Resolution Videos | Sean Collinson',
  description:
    'Watch Sean Collinson explain mediation, negotiation, de-escalation, divorce conflict, and practical strategies for resolving difficult disputes.',
  h1: 'Clear Guidance for Difficult Conversations',
};

const topicText = {
  family: 'How divorce mediation works, what to expect in a first session, preparing a parenting plan, and keeping children out of the middle.',
  conflict: 'Practical ways to lower the temperature of a disagreement and get to the issues that actually need solving.',
  negotiation: 'Interests versus positions, calibrated questions, and how to make proposals the other side can say yes to.',
  deescalation: 'Communication lessons from crisis negotiation: slowing down, listening for emotion, and staying steady under pressure.',
  workplace: 'Partnership disputes, conflict between colleagues, and how leaders can step in before a disagreement becomes a lawsuit.',
  media: 'Interviews and appearances in which Sean discusses mediation and negotiation.',
};

const complete = (v) =>
  v.title && v.platform && v.id && v.thumbnail && v.duration && v.uploadDate && v.summary && v.transcript;

const embedUrl = (v) =>
  v.platform === 'vimeo'
    ? `https://player.vimeo.com/video/${encodeURIComponent(v.id)}`
    : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}`;

const watchUrl = (v) =>
  v.platform === 'vimeo' ? `https://vimeo.com/${encodeURIComponent(v.id)}` : `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}`;

function card(v, { featured = false } = {}) {
  const cat = videoCategories.find((c) => c.id === v.category);
  const date = new Date(v.uploadDate + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  return `<article class="video${featured ? ' video--featured' : ''}" data-category="${esc(v.category)}" aria-labelledby="v-${slug(v.title)}">
  <div class="video__frame">
    <button class="video__play" type="button" data-embed="${esc(embedUrl(v))}" data-title="${esc(v.title)}">
      <img src="${esc(v.thumbnail)}" alt="" width="480" height="270" loading="lazy" decoding="async">
      <span class="video__icon" aria-hidden="true"></span>
      <span class="visually-hidden">Play video: ${esc(v.title)}</span>
    </button>
  </div>
  <div class="video__body">
    <p class="video__meta">${esc(cat ? cat.label : '')}<span class="video__sep" aria-hidden="true">/</span><span>${esc(v.durationLabel || '')}</span><span class="video__sep" aria-hidden="true">/</span><time datetime="${esc(v.uploadDate)}">${date}</time></p>
    <h3 class="video__title" id="v-${slug(v.title)}">${esc(v.title)}</h3>
    <p>${esc(v.summary)}</p>
    <details class="video__transcript"><summary>Read the transcript</summary><div class="prose">${esc(v.transcript)
      .split(/\n{2,}/)
      .map((p) => `<p>${p}</p>`)
      .join('')}</div></details>
    <p class="video__link"><a href="${esc(watchUrl(v))}" target="_blank" rel="noopener noreferrer">Watch on ${v.platform === 'vimeo' ? 'Vimeo' : 'YouTube'}<span class="visually-hidden"> (opens in a new tab)</span></a></p>
  </div>
</article>`;
}

function videoSchema(v) {
  return {
    '@type': 'VideoObject',
    name: v.title,
    description: v.summary,
    thumbnailUrl: v.thumbnail,
    uploadDate: v.uploadDate,
    duration: v.duration,
    embedUrl: embedUrl(v),
    contentUrl: watchUrl(v),
    transcript: v.transcript,
  };
}

export function render() {
  const crumbs = breadcrumbs([{ name: 'Videos', path: meta.path }]);
  const list = videos.filter(complete);
  const featured = list.find((v) => v.featured) || list[0];
  const usedCats = videoCategories.filter((c) => list.some((v) => v.category === c.id));

  let library;
  if (list.length) {
    library = `
<section class="section" aria-labelledby="featured-title">
  <div class="wrap">
    <h2 id="featured-title" class="section__title">Featured video</h2>
    ${card(featured, { featured: true })}
  </div>
</section>
<section class="section section--ivory" aria-labelledby="library-title">
  <div class="wrap">
    <h2 id="library-title" class="section__title">Video library</h2>
    <div class="filters" role="group" aria-label="Filter videos by topic" data-filters>
      <button type="button" class="filter" aria-pressed="true" data-filter="all">All videos</button>
      ${usedCats.map((c) => `<button type="button" class="filter" aria-pressed="false" data-filter="${c.id}">${c.label}</button>`).join('')}
    </div>
    <p class="visually-hidden" role="status" aria-live="polite" data-filter-status></p>
    <div class="video-grid" data-video-grid>
      ${list.filter((v) => v !== featured).map((v) => card(v)).join('') || '<p>More videos are on the way.</p>'}
    </div>
  </div>
</section>`;
  } else {
    library = `
<section class="section" aria-labelledby="library-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="library-title" class="section__title">What the video library covers</h2>
      <p class="section__lede">The first videos are being prepared. Each one will include a written summary or full transcript, so the guidance is useful whether you watch, listen, or read.</p>
    </div>
    <dl class="topics">
      ${videoCategories.map((c) => `<div class="topic"><dt>${c.label}</dt><dd>${topicText[c.id]}</dd></div>`).join('')}
    </dl>
    ${phBlock(
      'published videos',
      'Add real, published YouTube or Vimeo videos to the <code>videos</code> list in <code>src/config.mjs</code>. Each needs its video id, thumbnail URL, duration, upload date, summary, and transcript. The featured player, topic filters, and VideoObject structured data appear automatically. Nothing is invented in the meantime.'
    )}
    ${
      isDraft()
        ? `<div class="video-grid">${[1, 2, 3]
            .map(
              () => `<div class="video video--ph"><div class="video__frame img-ph" style="aspect-ratio:16/9"><span class="img-ph__label">Needed: video thumbnail, 1280 × 720</span></div><div class="video__body"><p><span class="ph">Needed: title, duration, date, summary, transcript</span></p></div></div>`
            )
            .join('')}</div>`
        : ''
    }
    <div class="inline-cta">
      <p>In the meantime, the <a href="/mediation/#faq">mediation questions and answers</a> cover many of the same topics in writing.</p>
    </div>
  </div>
</section>`;
  }

  const body = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="wrap">${crumbs.html}</div>
  <div class="wrap">
    <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
    <p class="page-hero__lede">Short, practical videos in which Sean Collinson explains how mediation works, how to prepare for a hard conversation, and what crisis negotiation teaches about listening, de-escalation, and moving a stalled discussion forward.</p>
  </div>
</section>
${library}
<section class="section" aria-labelledby="next-title">
  <div class="wrap two-col">
    <div class="panel">
      <h2 id="next-title" class="panel__title">Go deeper with the masterclass</h2>
      <p>Think Like a Hostage Negotiator turns these ideas into practical skills for leaders, teams, and professionals who manage high-conflict conversations.</p>
      <p><a class="text-link" href="/masterclass/">Explore the negotiation masterclass</a></p>
    </div>
    <div class="panel">
      <h2 class="panel__title">Facing a dispute of your own?</h2>
      <p>If you are dealing with a divorce, custody, business, or civil dispute, a private consultation is the fastest way to get specific guidance on the process.</p>
      <p><a class="text-link" href="/consultation/">Schedule a Confidential Consultation</a></p>
    </div>
  </div>
</section>
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [crumbs.schema, ...list.map(videoSchema)],
    bodyClass: 'page-videos',
  });
}
