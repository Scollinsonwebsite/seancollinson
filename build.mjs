// Static site build for the Mediation Office of S. Collinson.
//   node build.mjs             → production site in ./bluehost-upload (+ bluehost-upload.zip)
//   node build.mjs --draft     → draft preview with visible placeholders in ./preview-draft
// No dependencies. Output is plain HTML, CSS, JS, and images that run on any
// Apache host (Bluehost shared hosting) with no Node.js on the server.
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

import { ctx } from './src/lib/render.mjs';
import { site, contact, analytics, scheduler } from './src/config.mjs';
import * as home from './src/pages/home.mjs';
import * as about from './src/pages/about.mjs';
import * as mediation from './src/pages/mediation.mjs';
import * as consultation from './src/pages/consultation.mjs';
import * as videos from './src/pages/videos.mjs';
import * as masterclass from './src/pages/masterclass.mjs';
import * as contactPage from './src/pages/contact.mjs';
import * as notfound from './src/pages/notfound.mjs';
import { legalPages } from './src/pages/legal.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const draft = process.argv.includes('--draft');
const outDir = join(root, draft ? 'preview-draft' : 'bluehost-upload');
const srcDir = join(root, 'src');

ctx.mode = draft ? 'draft' : 'production';
ctx.srcDir = srcDir;
ctx.year = new Date().getFullYear();

const cssRaw = readFileSync(join(srcDir, 'assets/css/site.css'), 'utf8');
const jsRaw = readFileSync(join(srcDir, 'assets/js/site.js'), 'utf8');
ctx.version = createHash('sha256').update(cssRaw + jsRaw).digest('hex').slice(0, 10);

// Light, safe minification (comments and redundant whitespace only).
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
const minifyHtml = (html) =>
  html
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');

// ── Clean and copy static assets ────────────────────────────────────────────
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const copy = (from, to) => cpSync(join(srcDir, from), join(outDir, to), { recursive: true });
copy('assets/fonts', 'assets/fonts');
copy('assets/icons', 'assets/icons');
mkdirSync(join(outDir, 'assets/img'), { recursive: true });
for (const f of ['social-share.jpg', 'logo.png']) {
  if (existsSync(join(srcDir, 'assets/img', f))) copy(`assets/img/${f}`, `assets/img/${f}`);
}
if (existsSync(join(srcDir, 'assets/img/generated'))) copy('assets/img/generated', 'assets/img/generated');
copy('static/forms', 'forms');
cpSync(join(srcDir, 'assets/icons/favicon.ico'), join(outDir, 'favicon.ico'));

mkdirSync(join(outDir, 'assets/css'), { recursive: true });
mkdirSync(join(outDir, 'assets/js'), { recursive: true });
writeFileSync(join(outDir, 'assets/css/site.css'), minifyCss(cssRaw));
writeFileSync(join(outDir, 'assets/js/site.js'), jsRaw);

// ── Pages ───────────────────────────────────────────────────────────────────
const primary = [home, about, mediation, consultation, videos, masterclass, contactPage];
const all = [...primary, ...legalPages, notfound];
for (const p of all) {
  const html = minifyHtml(p.render());
  const file = join(outDir, p.meta.out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ── robots.txt and sitemap.xml ──────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const base = site.url.replace(/\/$/, '');
writeFileSync(
  join(outDir, 'robots.txt'),
  draft
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /forms/\n\nSitemap: ${base}/sitemap.xml\n`
);
const sitemapPages = [...primary, ...legalPages.filter((p) => !p.meta.noindex)];
writeFileSync(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPages
    .map((p) => `  <url><loc>${base}${p.meta.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);

// ── Web manifest ────────────────────────────────────────────────────────────
writeFileSync(
  join(outDir, 'site.webmanifest'),
  JSON.stringify(
    {
      name: site.name,
      short_name: site.shortName,
      start_url: '/',
      display: 'browser',
      background_color: '#F7F4EE',
      theme_color: '#0B1628',
      icons: [
        { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2
  )
);

// ── .htaccess ───────────────────────────────────────────────────────────────
const host = new URL(site.url).hostname.replace(/^www\./, '');
const canonicalHost = site.preferWww ? `www.${host}` : host;
const gaInline = analytics.ga4MeasurementId
  ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analytics.ga4MeasurementId}');`
  : '';
const gaHash = gaInline ? `'sha256-${createHash('sha256').update(gaInline).digest('base64')}'` : '';
const frameSrc = ["https://www.youtube-nocookie.com", "https://player.vimeo.com"];
if (scheduler.url) frameSrc.push(new URL(scheduler.url).origin);
if (contact.mapEmbedUrl) frameSrc.push(new URL(contact.mapEmbedUrl).origin);
const csp = [
  "default-src 'self'",
  `script-src 'self'${gaInline ? ` ${gaHash} https://www.googletagmanager.com` : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com https://i.vimeocdn.com" + (gaInline ? ' https://www.google-analytics.com https://www.googletagmanager.com' : ''),
  "font-src 'self'",
  "connect-src 'self'" + (gaInline ? ' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com' : ''),
  `frame-src ${frameSrc.join(' ')}`,
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
].join('; ');

const redirects = site.domainConfirmed
  ? `  # Force HTTPS and the canonical host (${canonicalHost}).
  RewriteCond %{HTTPS} !=on [OR]
  RewriteCond %{HTTP_HOST} !^${canonicalHost.replace(/\./g, '\\.')}$ [NC]
  RewriteRule ^ https://${canonicalHost}%{REQUEST_URI} [L,R=301]`
  : `  # HTTPS and canonical-host redirects are OFF until the production domain and
  # the www / non-www choice are confirmed. Set site.domainConfirmed = true in
  # src/config.mjs and rebuild to enable them. They will look like this:
  # RewriteCond %{HTTPS} !=on [OR]
  # RewriteCond %{HTTP_HOST} !^${canonicalHost.replace(/\./g, '\\.')}$ [NC]
  # RewriteRule ^ https://${canonicalHost}%{REQUEST_URI} [L,R=301]`;

writeFileSync(
  join(outDir, '.htaccess'),
  `# Mediation Office of S. Collinson: Apache configuration for Bluehost
# Generated by build.mjs on ${today}. Edit src/config.mjs and rebuild rather than editing here.

Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html
AddDefaultCharset utf-8
AddType image/svg+xml .svg
AddType font/woff2 .woff2
AddType application/manifest+json .webmanifest

<IfModule mod_rewrite.c>
  RewriteEngine On
${redirects}

  # Remove index.html from URLs: /about/index.html → /about/
  RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[\\s?] [NC]
  RewriteRule ^(.*/)?index\\.html$ /$1 [R=301,L]
</IfModule>

# Never serve hidden files (except Let’s Encrypt / .well-known) or source files.
RedirectMatch 404 /\\.(?!well-known/)
<FilesMatch "\\.(md|mjs|json|lock|log|sh|ini|env|bak|sql)$">
  Require all denied
</FilesMatch>
<Files "site.webmanifest">
  Require all granted
</Files>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  Header always set Content-Security-Policy "${csp}"
${site.domainConfirmed ? '  Header always set Strict-Transport-Security "max-age=31536000"' : '  # Strict-Transport-Security is added automatically once the domain is confirmed.'}
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "\\.(css|js|woff2|svg|png|jpg|jpeg|webp|avif|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 hour"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType application/xml "access plus 1 day"
  ExpiresByType text/plain "access plus 1 day"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>
`
);

// ── Package ─────────────────────────────────────────────────────────────────
function sizeOf(dir) {
  return readdirSync(dir).reduce((n, f) => {
    const p = join(dir, f);
    const s = statSync(p);
    return n + (s.isDirectory() ? sizeOf(p) : s.size);
  }, 0);
}
console.log(`Built ${all.length} pages (${draft ? 'draft' : 'production'}) → ${outDir} (${(sizeOf(outDir) / 1024).toFixed(0)} KB)`);

if (!draft && !process.argv.includes('--no-zip')) {
  const zip = join(root, 'bluehost-upload.zip');
  rmSync(zip, { force: true });
  // Zip the folder contents so index.html sits at the root of the archive,
  // ready to extract straight into public_html.
  execFileSync('zip', ['-r', '-q', '-X', zip, '.'], { cwd: outDir });
  console.log(`Packaged → ${zip} (${(statSync(zip).size / 1024).toFixed(0)} KB)`);
}
