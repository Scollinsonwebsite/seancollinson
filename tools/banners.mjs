// Social banners built with the banner-design skill workflow: HTML/CSS art
// directions over the supplied hero photo, exported at exact platform sizes.
//   node tools/banners.mjs
// Writes three Open Graph options to assets/banners/social-share/ and the chosen
// direction (photo-scrim) to src/assets/img/social-share.jpg, plus LinkedIn and
// X/Twitter headers. No AI imagery: the only photograph is the supplied one.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const asset = (p, mime) => `data:${mime};base64,${readFileSync(join(root, p)).toString('base64')}`;
const photo = asset('src/assets/img/source/sean-collinson-hero.webp', 'image/webp');
const G = asset('src/assets/fonts/schibsted-grotesk-var-latin.woff2', 'font/woff2');
const M = asset('src/assets/fonts/manrope-var-latin.woff2', 'font/woff2');

const base = `@font-face{font-family:G;src:url(${G});font-weight:400 900}@font-face{font-family:M;src:url(${M});font-weight:200 800}
*{box-sizing:border-box}html,body{margin:0}body{font-family:M;color:#fff;position:relative;overflow:hidden;background:#0c2244}
.mark{display:inline-grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#fff}
.mark svg{width:34px;height:20px;fill:none;stroke:#1f4f96;stroke-width:2.4;stroke-linecap:round}
.name{font-family:G;font-weight:800;letter-spacing:-.035em;line-height:.98;margin:0}
.pill{display:inline-flex;align-items:center;height:56px;padding:0 28px;border-radius:999px;background:#fff;color:#123366;font-weight:700;font-size:22px}`;
const mark = `<span class="mark"><svg viewBox="0 0 42 24"><path d="M1 3 C 14 3, 22 12, 39 12"/><path d="M1 21 C 14 21, 22 12, 39 12"/><circle cx="39" cy="12" r="1.8" fill="#123366" stroke="none"/></svg></span>`;

// Direction A — Photo + scrim (the site hero, condensed). Chosen for Open Graph.
const photoScrim = (w, h, { title = 'Resolve Conflict Without Losing Control', compact = false } = {}) => `<!doctype html><html><head><style>${base}
body{width:${w}px;height:${h}px}
.bg{position:absolute;inset:0;background:url(${photo}) ${compact ? '78% 28%' : '72% 30%'}/cover}
.bg::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.2)}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,34,68,.95) 0%,rgba(12,34,68,.82) ${compact ? 34 : 38}%,rgba(12,34,68,.2) ${compact ? 55 : 62}%,rgba(12,34,68,0) 75%)}
.c{position:absolute;left:${compact ? 72 : 72}px;top:50%;transform:translateY(-50%);width:${compact ? Math.round(w * 0.5) : 640}px}
.brand{display:flex;align-items:center;gap:14px;margin-bottom:${compact ? 18 : 30}px;font-weight:700;font-size:${compact ? 20 : 22}px}
.name{font-size:${compact ? 52 : 74}px;margin-bottom:${compact ? 14 : 22}px}
.sub{font-size:${compact ? 20 : 24}px;line-height:1.45;color:#dbe7f7;margin:0 0 ${compact ? 0 : 30}px}
</style></head><body><div class="bg"></div><div class="scrim"></div>
<div class="c"><div class="brand">${mark}<span>Sean Collinson, Mediator</span></div>
<p class="name">${title}</p>
<p class="sub">Family and civil mediation in Los Angeles, across California, and by Zoom nationwide.</p>
${compact ? '' : '<span class="pill">seancollinson.com</span>'}</div></body></html>`;

// Direction B — Glassmorphism: photo full-bleed with a frosted credentials card.
const glass = (w, h) => `<!doctype html><html><head><style>${base}
body{width:${w}px;height:${h}px}
.bg{position:absolute;inset:0;background:url(${photo}) 70% 30%/cover}
.card{position:absolute;left:64px;top:64px;bottom:64px;width:560px;padding:44px;border-radius:30px;background:linear-gradient(160deg,rgba(18,51,102,.72),rgba(18,51,102,.5));backdrop-filter:blur(22px);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 0 0 1px rgba(255,255,255,.16)}
.name{font-size:60px;margin:26px 0 18px}
ul{list-style:none;margin:0;padding:0;font-size:22px;color:#dbe7f7}li{padding:10px 0;border-top:1px solid rgba(255,255,255,.2)}li b{color:#fff;font-family:G}
</style></head><body><div class="bg"></div><div class="card">${mark}<p class="name">Sean Collinson</p>
<ul><li><b>22+ years</b> of mediation</li><li><b>Harvard and Loyola</b> trained</li><li><b>FBI-trained</b> crisis negotiator</li></ul></div></body></html>`;

// Direction C — Bold type on sky with converging contrails (no photo).
const boldType = (w, h) => `<!doctype html><html><head><style>${base}
body{width:${w}px;height:${h}px;background:radial-gradient(55% 60% at 88% 4%,rgba(255,255,255,.34),transparent 62%),linear-gradient(158deg,#123366 0%,#1f4f96 40%,#2b62b0 70%,#5b92d6 100%)}
svg.t{position:absolute;inset:0}
.c{position:absolute;left:72px;top:70px;width:900px}
.name{font-size:112px;margin:30px 0 18px}
.sub{font-size:26px;color:#dbe7f7;margin:0}
</style></head><body><svg class="t" viewBox="0 0 1200 630" width="1200" height="630" fill="none" stroke="#fff" stroke-linecap="round"><g opacity=".3" stroke-width="12" style="filter:blur(5px)"><path d="M700 -20 C 820 150, 930 300, 1040 380"/><path d="M820 650 C 900 540, 980 440, 1040 380"/></g><g stroke-width="2"><path d="M700 -20 C 820 150, 930 300, 1040 380"/><path d="M820 650 C 900 540, 980 440, 1040 380"/><path d="M1040 380 C 1110 372, 1160 366, 1220 360"/></g></svg>
<div class="c">${mark}<p class="name">Resolve conflict.<br>Keep control.</p><p class="sub">Sean Collinson, family and civil mediator</p></div></body></html>`;

const browser = await playwright.chromium.launch();
const page = await browser.newPage();
async function shot(html, w, h, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, await page.screenshot({ type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: w, height: h } }));
  console.log('wrote', out.replace(root + '/', ''));
}
const dir = join(root, 'assets/banners/social-share');
await shot(photoScrim(1200, 630), 1200, 630, join(dir, 'photo-scrim-1200x630.jpg'));
await shot(glass(1200, 630), 1200, 630, join(dir, 'glass-1200x630.jpg'));
await shot(boldType(1200, 630), 1200, 630, join(dir, 'bold-type-1200x630.jpg'));
await shot(photoScrim(1200, 630), 1200, 630, join(root, 'src/assets/img/social-share.jpg'));
await shot(photoScrim(1584, 396, { compact: true, title: 'Resolve Conflict Without Losing Control' }), 1584, 396, join(root, 'assets/banners/linkedin/photo-scrim-1584x396.jpg'));
await shot(photoScrim(1500, 500, { compact: true }), 1500, 500, join(root, 'assets/banners/x-twitter/photo-scrim-1500x500.jpg'));
await browser.close();
