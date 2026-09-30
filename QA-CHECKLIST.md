# QA checklist

Results from the final production build (`npm run build`), checked with `npm test` (static QA, 63 checks), `npm run test:browser` (Chromium, 3 viewports × 12 URLs, axe-core, interaction tests), Lighthouse, and a manual visual review of screenshots. `[x]` means checked and passing, `[ ]` means it can only be done after launch or with information not yet supplied.

## Mobile responsiveness
- [x] Every page rendered at 375 px (mobile), 820 px (tablet), and 1440 px (desktop); full-page screenshots reviewed
- [x] No horizontal overflow on any page at any of the three widths
- [x] Mobile menu below 1180 px; full navigation above
- [x] Comparison table becomes stacked cards below 720 px
- [x] Form fields single-column on mobile, two-column from 700 px
- [x] Touch targets at least 24 × 24 px (WCAG 2.2 AA 2.5.8); buttons and menu items 44 to 50 px tall
- [x] Mobile Call/Consultation bar built; it appears only once a real phone number is configured (none yet, so it is not shown)

## Accessibility (target: WCAG 2.2 AA)
- [x] axe-core (WCAG 2.0/2.1/2.2 A and AA, plus best practices): 0 violations on all 12 URLs, mobile and desktop, in both production and draft builds
- [x] Lighthouse Accessibility 100 on all seven primary pages (mobile and desktop)
- [x] One H1 per page; logical heading order; header, nav, main, and footer landmarks
- [x] Skip link is the first focusable element and moves to `<main>`
- [x] Visible focus ring on every interactive element (navy on light, ivory on dark)
- [x] Mobile menu: opens by keyboard, moves focus in, keeps focus inside, Escape closes and returns focus to the toggle, `aria-expanded` kept in sync
- [x] FAQ accordions use native `<details>`/`<summary>` and open with the keyboard
- [x] Forms: visible labels (no placeholder-only labels), required and optional marked in text, hints and errors linked with `aria-describedby`, `aria-invalid` on errors, a focused error summary with links to each field, and success/error messages in a live region
- [x] Color contrast meets AA (axe and Lighthouse); brass is used only for lines and marks on light backgrounds, and as text only on navy
- [x] `prefers-reduced-motion`: the one hero animation and smooth scrolling are turned off (verified in the browser)
- [x] No autoplaying audio or video; video players load only when a visitor presses play
- [x] Icon-only controls have accessible names (menu toggle, video play buttons)
- [x] Decorative graphics are `aria-hidden`; image placeholders are decorative
- [ ] Alt text for real photographs: update `images.*.alt` in `src/config.mjs` when approved photos are added
- [ ] Captions/transcripts: required for each video when videos are added (the page requires a transcript field)
- [ ] Manual screen-reader pass (VoiceOver/NVDA) recommended before launch

## Forms
- [x] Forms never pretend to send: until they are configured, each shows a notice and a disabled submit button
- [x] Client-side validation: required fields, email format, phone characters, length limits; tested in the browser
- [x] Success state tested (mocked 200): the consultation message states that the request is **not yet an appointment**
- [x] Error state tested (mocked 503): shows the server's message
- [x] PHP handler tested with PHP 8.4 (`php -S`): unconfigured → 503; GET → 405; submitted too fast → 400; honeypot → silent 200 with nothing sent; invalid fields → 422 with per-field errors; header-injection attempt → rejected; cross-origin POST → 403; valid submission reaches `mail()` (502 here only because this container has no mail server)
- [x] The non-confidential-information warning appears above the summary and message fields (Consultation, Contact)
- [x] Consent checkbox with a link to the Privacy Policy on every form
- [x] No Social Security numbers, bank details, medical records, or evidence requested
- [x] No API keys or secrets in browser code; `forms/config.php` returns settings only and is blocked from direct access by `.htaccess`
- [ ] Live test on Bluehost after setting the recipient in `forms/config.php` (check the inbox and the spam folder)

## Links
- [x] All internal links and in-page anchors resolve (static QA crawl of every page)
- [x] All seven primary pages are linked from every page (header and footer): no orphans
- [x] Descriptive anchor text; no "click here" or "learn more"
- [x] External links opening in a new tab use `rel="noopener noreferrer"` and say so to screen readers
- [x] No `http://` (mixed-content) references
- [x] Unknown URLs return the branded 404 page with status 404 (verified on the local preview server)
- [x] No phone, email, or social links are shown, because none have been supplied yet

## Metadata
- [x] Unique `<title>` and meta description on every page (verified by script)
- [x] Canonical URL on every page, matching its path under `https://seancollinson.com`
- [x] Open Graph and X/Twitter card tags with a 1200 × 630 social image
- [x] No meta keywords tag
- [x] `lang="en"`, viewport, theme color, favicon set (ICO, SVG, Apple touch icon, 192/512 manifest icons)
- [x] Draft build is `noindex` with `robots.txt` set to `Disallow: /`; production primary pages are indexable
- [x] Legal drafts are `noindex` and left out of the sitemap until professionally reviewed

## Schema validation
- [x] All JSON-LD parses and has `@context` and `@type` (script-checked)
- [x] Home: `WebSite`, `ProfessionalService` (service-area model, no invented address), `Person`
- [x] About: `Person`; every interior page: `BreadcrumbList` with absolute URLs and positions
- [x] No `AggregateRating`, `Review`, awards, `Course`, or `VideoObject` (no verified data yet)
- [x] No telephone, email, or address in schema until supplied
- [ ] Run Google's Rich Results Test and the Schema.org validator on the live URLs after launch (external validators could not be reached from this build environment)

## Sitemap and robots
- [x] `sitemap.xml` lists exactly the seven canonical primary pages with absolute URLs
- [x] No `noindex` page is in the sitemap
- [x] `robots.txt` allows all pages, disallows only `/forms/`, and references the sitemap
- [ ] Submit the sitemap in Google Search Console after launch

## Performance
- [x] Lighthouse (local preview, placeholder imagery), all seven pages:
  - Mobile: Performance 99–100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7–2.1 s; CLS 0; TBT 0 ms
  - Desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.4–0.5 s; CLS 0; TBT 0 ms
- [x] Total production site about 394 KB; zip about 238 KB
- [x] Self-hosted fonts (4 WOFF2 files, about 95 KB), with the two main faces preloaded and `font-display: swap`
- [x] One CSS file and one small deferred JS file; no frameworks or animation libraries
- [x] Width and height, or an aspect ratio, on every image, placeholder, and video frame (CLS 0)
- [x] Hero image is not lazy-loaded (`fetchpriority="high"`); below-the-fold images and video embeds are lazy
- [x] Photo pipeline tested: an approved photo becomes 480/800/1200/1600 px WebP and JPEG in a responsive `<picture>`
- [x] `.htaccess`: gzip (mod_deflate), long-lived caching for versioned assets, `no-cache` for HTML, security headers, and a Content-Security-Policy
- [ ] Re-run Lighthouse after real photos are added and the site is live on Bluehost
- [ ] Field Core Web Vitals (75th percentile): check the Search Console report about 28 days after launch

## Browser testing
- [x] Chromium (Playwright): all pages at three widths, with no console errors or failed requests
- [ ] Safari (macOS and iOS), Firefox, and Edge: only Chromium was available in this build environment. The code uses widely supported features (CSS grid, `clamp()`, `aspect-ratio`, native `<details>`); `backdrop-filter` and `:has()` degrade gracefully. Please check on an iPhone and in Safari and Firefox before launch.

## Content and compliance
- [x] No lorem ipsum anywhere
- [x] No placeholder shown as real information in production (script check for draft markers)
- [x] No fake testimonials, stock-person identities, rankings, awards, or case results
- [x] The 96%, 7,000/8,000-case, and $3 billion claims are absent (script check)
- [x] Sean is never called an attorney, lawyer, or law firm; the site states he is a neutral who does not represent either party or give legal advice
- [x] No "best" or "top" self-description ("best divorce mediator" appears only in quotation marks, in the FAQ on how to choose a mediator)
- [x] Confidentiality described with a California-specific qualifier and a recommendation to ask one's own attorney
- [x] No FBI or Sheriff's Department endorsement implied (explicit statements on About, Masterclass, and Disclaimer)
- [x] Contact page emergency notice without law-enforcement language
- [x] Upload ZIP contains only deployable files (no `node_modules`, `.env`, source maps, Markdown, or build scripts), with `index.html` at its root
