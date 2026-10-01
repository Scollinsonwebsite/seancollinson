// Static QA for the production build. Run after `npm run build`.
//   node tests/qa.mjs [folder]
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const dir = process.argv[2] || 'bluehost-upload';
const results = [];
const fail = (msg) => results.push(['FAIL', msg]);
const pass = (msg) => results.push(['PASS', msg]);

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(dir);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const primary = ['/', '/about/', '/mediation/', '/consultation/', '/videos/', '/masterclass/', '/contact/'];
const pathOf = (f) => '/' + relative(dir, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const pages = Object.fromEntries(htmlFiles.map((f) => [pathOf(f), readFileSync(f, 'utf8')]));

const get = (html, re) => (html.match(re) || [])[1];
const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

// ── Per-page metadata ───────────────────────────────────────────────────────
const titles = {}, descs = {};
for (const [path, html] of Object.entries(pages)) {
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  h1s === 1 ? pass(`${path}: one H1`) : fail(`${path}: ${h1s} H1 elements`);
  const title = get(html, /<title>([^<]*)<\/title>/);
  const desc = get(html, /<meta name="description" content="([^"]*)"/);
  if (!title) fail(`${path}: missing <title>`);
  if (!desc) fail(`${path}: missing meta description`);
  titles[title] = (titles[title] || []).concat(path);
  descs[desc] = (descs[desc] || []).concat(path);
  if (path !== '/404.html') {
    const canonical = get(html, /<link rel="canonical" href="([^"]+)"/);
    canonical && canonical.endsWith(path) ? pass(`${path}: canonical ${canonical}`) : fail(`${path}: canonical missing or wrong (${canonical})`);
    for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!html.includes(`property="${p}"`)) fail(`${path}: missing ${p}`);
    if (!html.includes('name="twitter:card"')) fail(`${path}: missing twitter:card`);
  }
  if (/name="keywords"/i.test(html)) fail(`${path}: obsolete meta keywords tag`);
  if (!/<html lang="en">/.test(html)) fail(`${path}: missing lang attribute`);
  if (!html.includes('class="skip-link"')) fail(`${path}: missing skip link`);
  if (/lorem ipsum/i.test(html)) fail(`${path}: lorem ipsum found`);
  if (/class="ph|Needed:|draft-banner/.test(html)) fail(`${path}: draft placeholder rendered in production`);
  // Images and iframes
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) fail(`${path}: <img> without alt`);
    if (!/\swidth="\d+"/.test(m[0]) || !/\sheight="\d+"/.test(m[0])) fail(`${path}: <img> without width/height`);
  }
  for (const m of html.matchAll(/<iframe\b[^>]*>/g)) if (!/\stitle="/.test(m[0])) fail(`${path}: <iframe> without title`);
  // Positioning rules
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const re of [/\blaw firm\b/i, /\bEsq\.?\b/, /\battorney at law\b/i, /\b(best|top|leading|#1|number one)\s+(divorce\s+)?mediator\b/i, /\bguarantee(s|d)?\b(?! a particular| any| a similar| a result| a specific)/i]) {
    const hit = text.match(re);
    if (hit && !/no result is guaranteed/i.test(hit.input.slice(Math.max(0, hit.index - 30), hit.index + 40))) {
      // "best divorce mediator" is allowed only inside quotation marks in the how-to-choose FAQ
      const around = text.slice(Math.max(0, hit.index - 40), hit.index + 60);
      if (!/searching for the “best/i.test(around)) fail(`${path}: disallowed phrase "${hit[0]}" near "${around.trim()}"`);
    }
  }
  const attorneySelf = text.match(/Sean(?: Collinson)? (?:is|serves as) an? (?:attorney|lawyer)/i);
  if (attorneySelf) fail(`${path}: describes Sean as an attorney`);
  // Sensational claims must stay off unless verified in config
  for (const re of [/96\s?%/, /\b[78],000\b/, /\$3 billion/i]) if (re.test(text)) fail(`${path}: unverified claim ${re}`);
  if (/AggregateRating|"@type":"Review"/.test(html)) fail(`${path}: review/rating schema present`);
}
for (const [t, ps] of Object.entries(titles)) if (ps.length > 1) fail(`Duplicate title "${t}" on ${ps.join(', ')}`);
for (const [d, ps] of Object.entries(descs)) if (ps.length > 1) fail(`Duplicate description on ${ps.join(', ')}`);
pass(`Checked ${htmlFiles.length} HTML files for unique titles and descriptions`);

// ── JSON-LD ─────────────────────────────────────────────────────────────────
for (const [path, html] of Object.entries(pages)) {
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@context'] !== 'https://schema.org') fail(`${path}: JSON-LD missing @context`);
      for (const node of data['@graph'] || [data]) {
        if (!node['@type']) fail(`${path}: JSON-LD node without @type`);
        if (node['@type'] === 'BreadcrumbList') {
          node.itemListElement.forEach((li, i) => {
            if (li.position !== i + 1 || !li.name || !/^https:\/\//.test(li.item)) fail(`${path}: malformed breadcrumb item`);
          });
        }
        if (node['@type'] === 'VideoObject') {
          for (const k of ['name', 'description', 'thumbnailUrl', 'uploadDate', 'duration', 'embedUrl']) if (!node[k]) fail(`${path}: VideoObject missing ${k}`);
        }
        if (node['@type'] === 'Course') fail(`${path}: Course schema present without confirmed data`);
        if (node.address && !node.address.streetAddress) fail(`${path}: empty address in schema`);
      }
      pass(`${path}: JSON-LD parses (${(data['@graph'] || [data]).map((n) => n['@type']).join(', ')})`);
    } catch (e) {
      fail(`${path}: JSON-LD does not parse: ${e.message}`);
    }
  }
  if (path !== '/' && path !== '/404.html' && !html.includes('"BreadcrumbList"')) fail(`${path}: missing BreadcrumbList`);
}

// ── Internal links and anchors ──────────────────────────────────────────────
const resolve = (href) => {
  const [p] = href.split('#');
  const clean = p.split('?')[0];
  const target = join(dir, clean.endsWith('/') ? clean + 'index.html' : clean);
  return existsSync(target) ? target : null;
};
let linkCount = 0;
for (const [path, html] of Object.entries(pages)) {
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) {
      if (/^http:\/\//.test(href)) fail(`${path}: insecure http link ${href}`);
      continue;
    }
    linkCount++;
    if (href.startsWith('#')) {
      if (href.length > 1 && !idsIn(html).has(href.slice(1))) fail(`${path}: broken anchor ${href}`);
      continue;
    }
    const file = resolve(href);
    if (!file) { fail(`${path}: broken link ${href}`); continue; }
    const hash = href.split('#')[1];
    if (hash && file.endsWith('.html') && !idsIn(readFileSync(file, 'utf8')).has(hash)) fail(`${path}: broken anchor ${href}`);
  }
  for (const m of html.matchAll(/<a\b([^>]*)target="_blank"([^>]*)>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) fail(`${path}: target=_blank without rel=noopener`);
  }
}
pass(`Checked ${linkCount} internal links and anchors`);

// Orphans: every primary page is linked from the home page navigation.
for (const p of primary) {
  const linkedFrom = Object.entries(pages).filter(([path, html]) => path !== p && html.includes(`href="${p}"`)).length;
  linkedFrom > 0 ? pass(`${p}: linked from ${linkedFrom} pages`) : fail(`${p}: orphan page`);
}

// ── Sitemap and robots ──────────────────────────────────────────────────────
const sitemap = readFileSync(join(dir, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
for (const p of primary) locs.includes(p) ? pass(`sitemap lists ${p}`) : fail(`sitemap missing ${p}`);
for (const l of locs) {
  if (!pages[l]) fail(`sitemap lists missing page ${l}`);
  else if (/name="robots" content="noindex/.test(pages[l])) fail(`sitemap lists noindex page ${l}`);
}
const robots = readFileSync(join(dir, 'robots.txt'), 'utf8');
/Disallow:\s*\/\s*$/m.test(robots) ? fail('robots.txt blocks the whole site') : pass('robots.txt allows production pages');
robots.includes('Sitemap: https://') ? pass('robots.txt references the sitemap') : fail('robots.txt missing Sitemap line');
for (const p of primary) if (/name="robots" content="noindex/.test(pages[p])) fail(`${p}: primary page is noindex`);

// ── Package contents ────────────────────────────────────────────────────────
for (const f of files) {
  if (/node_modules|\.env$|\.map$|\.md$|\.mjs$|package(-lock)?\.json$/.test(f)) fail(`Upload folder contains dev file ${f}`);
}
if (!existsSync(join(dir, 'index.html'))) fail('index.html is not at the root of the upload folder');
if (existsSync('bluehost-upload.zip') && dir === 'bluehost-upload') {
  const list = execFileSync('unzip', ['-Z1', 'bluehost-upload.zip']).toString().split('\n').filter(Boolean);
  list.includes('index.html') ? pass('ZIP has index.html at its root') : fail('ZIP missing root index.html');
  const bad = list.filter((f) => /node_modules|\.env$|\.md$|\.mjs$|package\.json$/.test(f));
  bad.length ? fail(`ZIP contains dev files: ${bad.join(', ')}`) : pass(`ZIP contains ${list.length} deployable files only`);
}
for (const f of ['.htaccess', 'robots.txt', 'sitemap.xml', '404.html', 'favicon.ico', 'site.webmanifest', 'assets/img/social-share.jpg', 'assets/icons/apple-touch-icon.png', 'forms/submit.php']) {
  existsSync(join(dir, f)) ? pass(`${f} present`) : fail(`${f} missing`);
}

// ── Report ──────────────────────────────────────────────────────────────────
const failures = results.filter((r) => r[0] === 'FAIL');
if (process.argv.includes('--verbose')) results.forEach((r) => console.log(r.join('  ')));
failures.forEach((r) => console.log(r.join('  ')));
console.log(`\n${results.length - failures.length} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
