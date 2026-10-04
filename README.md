# Mediation Office of S. Collinson — website

A fast, fully static website for Sean Collinson's mediation practice. Every page is plain HTML at its own URL, so it runs on Bluehost shared hosting with no Node.js, database, or server-side rendering. Node.js is used only on your own computer to build the site.

- **Pages:** Home, About, Mediation, Consultation, Videos, Masterclass, Contact, plus Privacy Policy, Terms of Use, Accessibility Statement, Disclaimer, and a custom 404 page.
- **Deployable output:** `bluehost-upload/` (the folder) and `bluehost-upload.zip` (the same files, with `index.html` at the root of the archive).
- **Before launch:** work through [`CONTENT-NEEDED.md`](CONTENT-NEEDED.md).
- **Design system:** [`DESIGN.md`](DESIGN.md) (visual rules), [`PRODUCT.md`](PRODUCT.md) (product facts and constraints), and [`docs/brand-guidelines.md`](docs/brand-guidelines.md) (voice, logo, imagery).
- **Brand files (not uploaded to the site):** `assets/brand/` (logo mark SVG, horizontal lockups) and `assets/banners/` (social card options, LinkedIn and X headers). Rebuild banners with `node tools/banners.mjs`.

## Project layout

```
src/config.mjs        ← every business fact, contact detail, and placeholder lives here
src/pages/*.mjs       ← page content (one file per page)
src/lib/render.mjs    ← shared header, footer, metadata, structured data
src/lib/forms.mjs     ← accessible form fields
src/assets/css/       ← site.css (design tokens at the top)
src/assets/js/        ← site.js (menu, forms, video embeds; no libraries)
src/assets/fonts/     ← self-hosted Schibsted Grotesk and Manrope (SIL Open Font License)
src/assets/img/       ← logo, social image; approved photos go in img/source/
src/static/forms/     ← PHP form handler for Bluehost
build.mjs             ← builds bluehost-upload/ and the zip
tools/images.mjs      ← renders favicons, logo, social image; optimises photos
tools/serve.mjs       ← local preview server that behaves like Apache
tests/qa.mjs          ← static QA (metadata, links, schema, sitemap, wording)
tests/browser.mjs     ← browser QA (layouts, console, overflow, axe, forms, keyboard)
```

## Local preview

Requires Node.js 18 or newer.

```bash
npm run build          # production site → bluehost-upload/ and bluehost-upload.zip
npm run preview        # http://localhost:8080/

npm run build:draft    # draft preview → preview-draft/ with every missing item tagged "Needed"
npm run preview:draft
```

The draft build shows yellow "Needed: …" tags wherever content is missing, and it is set to `noindex`. The production build never shows placeholders: anything missing is simply left out.

## Build

```bash
npm run images   # only after changing brand images or adding photos (uses Playwright Chromium)
npm run build
npm test         # static QA on bluehost-upload/
AXE_PATH=/path/to/axe-core/axe.min.js npm run test:browser   # browser QA, optional
```

## Upload to Bluehost

1. Build the site (`npm run build`).
2. In Bluehost, open **Advanced → File Manager** and go to `public_html` (or the folder for this domain).
3. **Back up and remove the current WordPress site first** if this site is replacing it. At minimum, move WordPress's own `index.php` and `.htaccess` out of the way, or Apache will keep serving WordPress. Keep a full backup (Bluehost → Backups) before deleting anything.
4. Upload `bluehost-upload.zip` to `public_html` and choose **Extract**. `index.html`, `.htaccess`, and the page folders should now be directly inside `public_html`.
5. Turn on **Show hidden files** in File Manager and confirm `.htaccess` is present.
6. Visit each page and confirm the 404 page works (for example `/nothing-here/`).
7. After confirming the domain and your choice of `www` or non-`www`, set `site.domainConfirmed = true` (and `site.preferWww` if needed) in `src/config.mjs`, rebuild, and re-upload `.htaccess`. That switches on the HTTPS redirect, the canonical-host redirect, and HSTS. Make sure Bluehost's free SSL certificate is active first.

## Forms

The Consultation, Contact, and Masterclass forms post to `forms/submit.php`, a small PHP script included in the upload. It validates every field on the server, uses a hidden honeypot field, a minimum fill time, a per-IP rate limit (5 per hour), and a same-origin check, and sends a plain-text email. Visitor input never goes into email headers except a validated Reply-To address.

Forms ship **disabled**: they show a notice and a disabled Send button, and they never pretend to send. To enable them:

1. In Bluehost **Email**, create a sending address on your domain, such as `no-reply@seancollinson.com`.
2. Edit `forms/config.php` (in `src/static/forms/` before building, or directly on the server): set `recipient` to the inbox that should receive requests, `from` to the address from step 1, a random `salt`, and `enabled` to `true`.
3. In `src/config.mjs`, set `forms.enabled = true`, rebuild, and upload.
4. Send a test from each form and confirm it arrives (check spam as well).

**Using a form service instead:** if you prefer Formspree, Basin, or a similar provider, set `forms.endpoint` to its URL. The front end expects a JSON response of `{ "ok": true }` on success, so choose a provider that supports AJAX/JSON submissions, and turn on that provider's spam filtering. Never put an API secret in the site's JavaScript.

## Scheduler

Add the approved Calendly, Acuity, or other scheduler link to `scheduler.url` (and `scheduler.provider`) in `src/config.mjs`. The Consultation page then shows a scheduling section that links to it, and the site's security policy is updated automatically to allow it.

## Analytics and Search Console

- **Google Analytics 4:** set `analytics.ga4MeasurementId` (for example `G-XXXXXXXXXX`) in `src/config.mjs` and rebuild. The tag is added to every page and the Content Security Policy is updated with a hash of the inline snippet. Update the Privacy Policy before enabling analytics.
- **Google Search Console:** add a Domain property for `seancollinson.com` and verify with a DNS TXT record in Bluehost (preferred), or set `analytics.googleSiteVerification` to the meta-tag value Google gives you. Then submit `https://seancollinson.com/sitemap.xml`.
- No IDs or verification codes are included until real ones are supplied.

## Updating content

| To change | Edit |
| --- | --- |
| Phone, email, office hours, address, social links | `contact` and `social` in `src/config.mjs` |
| Page text | the matching file in `src/pages/` |
| Titles and meta descriptions | the `meta` object at the top of each page file |
| Testimonials | `testimonials` in `src/config.mjs` (written permission required) |
| Videos | `videos` in `src/config.mjs`: id, thumbnail, duration, upload date, summary, transcript |
| Masterclass CALM framework, availability, pricing | `masterclass` in `src/config.mjs` |
| Verified statistics (such as a settlement rate) | `claims` in `src/config.mjs`, including the explanatory note |
| Colors, type, spacing | tokens at the top of `src/assets/css/site.css` |

Phone and email links, the mobile Call/Consultation bar, and the `telephone`/`email` fields in structured data appear automatically once real contact details are entered. A street address, map, and address schema appear only if `contact.address` is filled in for a verified office where clients are received.

### Photographs

Put approved originals in `src/assets/img/source/` using these names, then run `npm run images && npm run build`:

| File | Use | Recommended size |
| --- | --- | --- |
| `sean-collinson-hero.webp` (supplied) | Home page hero, full width | 2560 × 1440 px ideal, Sean on the right |
| `sean-collinson-portrait.jpg` | About header, Masterclass instructor | 1200 × 1500 px or larger, vertical 4:5 |
| `sean-collinson-at-desk.jpg` | Home "about Sean" section | 1600 × 900 px or larger, horizontal 16:9 |

The tool creates 480, 800, 1200, and 1600 px WebP and JPEG versions and the pages switch from the designed placeholders to responsive `<picture>` elements. Update the `alt` text for each image in `src/config.mjs` so it describes the actual photograph. Two likely candidates already exist in the current WordPress media library (`Sean.pic44-1.png`, 995 × 1074, and `sean.picdesk-2.png`, 1736 × 974); confirm they are approved before using them.

## Google Business Profile launch checklist

Do not create or claim a profile until the details below are confirmed. This project does not create one.

- [ ] Decide whether the practice qualifies: Google requires in-person contact with customers during stated hours. A virtual-only practice may not be eligible.
- [ ] If clients are received at an office, use that exact address; if Sean travels to clients or works virtually, set up a **service-area business** and hide the address.
- [ ] Use the real business name exactly as it appears elsewhere ("Mediation Office of S. Collinson"), with no added keywords.
- [ ] Primary category: **Mediation service**. Add secondary categories only if accurate.
- [ ] Add the same phone number and website URL used on the site (`https://seancollinson.com/`).
- [ ] Service areas: Los Angeles and other California areas actually served.
- [ ] Hours that match the website.
- [ ] Description consistent with the site: neutral mediator, not legal representation.
- [ ] Add the approved portrait and genuine office or workplace photos only.
- [ ] Complete verification (postcard, phone, or video) as Google requests.
- [ ] Ask satisfied clients for reviews only in ways that comply with Google's policies (no incentives, no gating).
- [ ] Keep name, phone, and address identical across the website, the profile, and any directories.

## SEO notes

- Unique title, description, canonical URL, Open Graph and X/Twitter tags, and one H1 on every page. See [`SEO-MAP.md`](SEO-MAP.md).
- JSON-LD: `WebSite`, `ProfessionalService`, and `Person` on Home; `Person` on About; `BreadcrumbList` on interior pages; `VideoObject` only for complete, real videos. No ratings, reviews, `Course`, or address data until verified.
- `robots.txt` and `sitemap.xml` are generated on each build. Legal pages stay `noindex` and out of the sitemap until `legal.<page>.reviewed` is set to `true`.
- No ranking promises. The site is built on Google Search Essentials and people-first content.
