// Renders brand images (favicons, logo, social share card) and optimises any
// approved photographs placed in src/assets/img/source/.
// Uses the Playwright Chromium already installed in this environment.
//   npm run images
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require('/opt/node22/lib/node_modules/playwright');
}

const src = join(root, 'src/assets');
const font = (f) => `data:font/woff2;base64,${readFileSync(join(src, 'fonts', f)).toString('base64')}`;
const iconsDir = join(src, 'icons');
const imgDir = join(src, 'img');
mkdirSync(iconsDir, { recursive: true });
mkdirSync(join(imgDir, 'generated'), { recursive: true });

const NAVY = '#0B1628', BRASS = '#B89B5E', IVORY = '#F7F4EE', SLATE = '#263548';

const fontCss = `
@font-face{font-family:C;src:url(${font('cormorant-garamond-latin-500-normal.woff2')})}
@font-face{font-family:C6;src:url(${font('cormorant-garamond-latin-600-normal.woff2')})}
@font-face{font-family:M;src:url(${font('manrope-var-latin.woff2')});font-weight:200 800}
html,body{margin:0;padding:0}`;

const markPath = (stroke, w = 1.6) =>
  `<path d="M1 3 C 14 3, 22 12, 39 12" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/><path d="M1 21 C 14 21, 22 12, 39 12" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;

// Square icon: navy tile, brass converging lines, ivory meeting point.
const iconSvg = (size, radius = 0.18) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
<rect width="64" height="64" rx="${64 * radius}" fill="${NAVY}"/>
<g transform="translate(10 18) scale(1.1)">${markPath(BRASS, 2.6)}<circle cx="39" cy="12" r="2.8" fill="${IVORY}"/></g>
</svg>`;

writeFileSync(join(iconsDir, 'favicon.svg'), iconSvg(64));

const socialHtml = `<!doctype html><html><head><style>${fontCss}
body{width:1200px;height:630px;background:${NAVY};color:${IVORY};font-family:M;position:relative;overflow:hidden}
svg.lines{position:absolute;inset:0}
.c{position:absolute;left:84px;top:96px;width:900px}
.n{font-family:C;font-size:104px;line-height:1;letter-spacing:-1px;margin:0 0 22px}
.o{font-family:M;font-weight:600;font-size:30px;margin:0 0 30px;color:${IVORY}}
.t{font-family:M;font-size:25px;line-height:1.5;color:#C9CFD8;margin:0;max-width:640px}
</style></head><body>
<svg class="lines" viewBox="0 0 1200 630" width="1200" height="630"><path d="M-10 452 C 420 452, 760 540, 1210 540" fill="none" stroke="#4A5A70" stroke-width="2"/><path d="M-10 628 C 420 628, 760 540, 1210 540" fill="none" stroke="${BRASS}" stroke-width="2.5"/></svg>
<div class="c"><p class="n">Sean Collinson</p><p class="o">Mediation Office of S. Collinson</p><p class="t">Family and civil mediation in Los Angeles, across California, and virtually nationwide.</p></div>
</body></html>`;

const logoHtml = `<!doctype html><html><head><style>${fontCss}
body{width:600px;height:600px;background:${IVORY};display:grid;place-items:center}
.w{text-align:center;color:${NAVY}}
.n{font-family:C6;font-size:68px;line-height:1;margin:26px 0 12px}
.s{font-family:M;font-weight:600;font-size:24px;color:#5C6673;margin:0}
</style></head><body><div class="w">
<svg viewBox="0 0 42 24" width="210" height="120" style="margin:0 auto;display:block">${markPath(BRASS, 1.4)}<circle cx="39" cy="12" r="1.6" fill="${NAVY}"/></svg>
<p class="n">Sean Collinson</p><p class="s">Mediation Office</p></div></body></html>`;

function ico(pngs) {
  // ICO container with embedded PNG images (supported by all modern browsers).
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const entries = []; const datas = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
    offset += buf.length; entries.push(e); datas.push(buf);
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

const browser = await playwright.chromium.launch();
const page = await browser.newPage();

async function shot(html, width, height, out) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png', omitBackground: false, clip: { x: 0, y: 0, width, height } });
  if (out) writeFileSync(out, buf);
  return buf;
}

const iconPage = (size) => `<!doctype html><html><head><style>html,body{margin:0;background:transparent}</style></head><body>${iconSvg(size)}</body></html>`;
const p16 = await shot(iconPage(16), 16, 16);
const p32 = await shot(iconPage(32), 32, 32);
const p48 = await shot(iconPage(48), 48, 48);
writeFileSync(join(iconsDir, 'favicon.ico'), ico([{ size: 16, buf: p16 }, { size: 32, buf: p32 }, { size: 48, buf: p48 }]));
// Apple and PWA icons: square, no transparency.
const fullIcon = (size) => `<!doctype html><html><head><style>html,body{margin:0}</style></head><body>${iconSvg(size, 0)}</body></html>`;
await shot(fullIcon(180), 180, 180, join(iconsDir, 'apple-touch-icon.png'));
await shot(fullIcon(192), 192, 192, join(iconsDir, 'icon-192.png'));
await shot(fullIcon(512), 512, 512, join(iconsDir, 'icon-512.png'));
await shot(socialHtml, 1200, 630, join(imgDir, 'social-share.png'));
await shot(logoHtml, 600, 600, join(imgDir, 'logo.png'));
console.log('Brand images rendered.');

// ── Optimise approved photographs ───────────────────────────────────────────
const sourceDir = join(imgDir, 'source');
if (existsSync(sourceDir)) {
  const files = readdirSync(sourceDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  for (const f of files) {
    const data = readFileSync(join(sourceDir, f)).toString('base64');
    const mime = { '.png': 'image/png', '.webp': 'image/webp' }[extname(f).toLowerCase()] || 'image/jpeg';
    await page.setContent('<html><body></body></html>');
    const results = await page.evaluate(
      async ({ data, mime }) => {
        const img = new Image();
        img.src = `data:${mime};base64,${data}`;
        await img.decode();
        const out = [];
        for (const w of [480, 800, 1200, 1600]) {
          if (w > img.naturalWidth && w !== 480) continue;
          const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          out.push({ w, h, webp: c.toDataURL('image/webp', 0.82), jpg: c.toDataURL('image/jpeg', 0.84) });
        }
        return { out, natural: [img.naturalWidth, img.naturalHeight] };
      },
      { data, mime }
    );
    const base = basename(f, extname(f));
    for (const r of results.out) {
      writeFileSync(join(imgDir, 'generated', `${base}-${r.w}.webp`), Buffer.from(r.webp.split(',')[1], 'base64'));
      writeFileSync(join(imgDir, 'generated', `${base}-${r.w}.jpg`), Buffer.from(r.jpg.split(',')[1], 'base64'));
    }
    console.log(`Optimised ${f} (${results.natural.join('×')}) → ${results.out.map((r) => r.w).join(', ')} px`);
  }
}

await browser.close();
