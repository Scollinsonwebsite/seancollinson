# Content needed before launch

Everything below is a placeholder in `src/config.mjs` (or a page file). The production build hides each missing item rather than inventing it. Run `npm run build:draft` and `npm run preview:draft` to see every gap tagged "Needed" in context.

## Required before launch

| # | Item | Where | Notes |
| --- | --- | --- | --- |
| 1 | **Confirm the production domain** | `site.url` | Set to `https://seancollinson.com`, taken from the current WordPress site settings. Confirm it is correct. |
| 2 | **`www` or non-`www`** | `site.preferWww`, then `site.domainConfirmed = true` | Turns on HTTPS, canonical-host redirects, and HSTS in `.htaccess`. |
| 3 | **Office phone number** | `contact.phone` (E.164, e.g. `+13105550100`) and `contact.phoneDisplay` | Enables phone links, the mobile Call bar, and `telephone` in schema. |
| 4 | **Office email address** | `contact.email` | Enables email links and `email` in schema. |
| 5 | **Form recipient and sending address** | `src/static/forms/config.php`, then `forms.enabled = true` | Forms stay disabled, with a notice, until this is done and tested. |
| 5b | ~~Home page hero photo~~ **Supplied 2026-10-01** (1672 × 941) | `src/assets/img/source/sean-collinson-hero.webp` | In place. A 2560 × 1440 original would look sharper on large high-resolution screens. |
| 6 | **Approved portrait of Sean** | `src/assets/img/source/sean-collinson-portrait.jpg` | Vertical 4:5, at least 1200 × 1500 px. Candidate in WordPress media: `Sean.pic44-1.png` (995 × 1074, slightly small). Update `images.portrait.alt`. |
| 7 | **Approved environmental photo** | `src/assets/img/source/sean-collinson-at-desk.jpg` | Horizontal 16:9, at least 1600 × 900 px. Candidate in WordPress media: `sean.picdesk-2.png` (1736 × 974). Update `images.office.alt`. |
| 8 | **Professional review of legal pages** | `src/pages/legal.mjs`, then `legal.<page>.reviewed = true` | Privacy Policy, Terms of Use, Accessibility Statement, and Disclaimer are starter drafts, marked as drafts, `noindex`, and excluded from the sitemap until reviewed. |
| 9 | **Fees and payment terms** | Consultation page copy (currently "explained during the consultation") | Optional: add only if Sean wants fees published. |

## Recommended

| # | Item | Where | Notes |
| --- | --- | --- | --- |
| 10 | Office hours | `contact.officeHours` | Shown on Contact once supplied. |
| 11 | Response-time standard | `contact.responseTime` | Only if Sean commits to one. |
| 12 | Office address | `contact.address` | Only for a verified public office where clients are received. Adds the address, optional map (`contact.mapEmbedUrl`), and `PostalAddress` schema. |
| 13 | Online scheduler link | `scheduler.url`, `scheduler.provider` | Calendly, Acuity, or similar. |
| 14 | Social profiles | `social` | Real, active profiles only (LinkedIn, YouTube, etc.). |
| 15 | Google Analytics 4 ID | `analytics.ga4MeasurementId` | Update the Privacy Policy first. |
| 16 | Search Console verification | `analytics.googleSiteVerification`, or DNS verification | |
| 17 | Logo decision | `src/assets/img/logo.png` and header wordmark | A new text wordmark with a converging-lines mark was created. The existing WordPress logo (`Sean-Collinson-9.png`, 400 × 160) was not used because it is too small to stay sharp; send a vector (SVG or PDF) version if it should be kept. |

## Videos page

| # | Item | Where |
| --- | --- | --- |
| 18 | Published videos: platform (YouTube/Vimeo), video id, thumbnail URL, duration (ISO 8601 and label), upload date, category, summary, and transcript or detailed text summary | `videos` in `src/config.mjs` |

Until at least one complete video is added, the page shows the topics the library will cover and no player, filters, or `VideoObject` schema.

## Masterclass page

| # | Item | Where |
| --- | --- | --- |
| 19 | CALM framework: the approved word for each letter, with a one-sentence explanation | `masterclass.calm` |
| 20 | Availability for keynote, workshop, team training, digital masterclass | `masterclass.formats.*.availability` |
| 21 | Pricing (if it should be published) | `masterclass.formats.*.price` |
| 22 | Digital masterclass enrollment link, and payment provider if applicable | `masterclass.formats.digital.enrollUrl` |
| 23 | Whether completion certificates are issued | `masterclass.certificates` (no certificate FAQ is shown until true) |

`Course` structured data is intentionally not generated. Add it only once real course details, provider information, availability, and offers are confirmed and visible on the page.

## Claims that stay off the site until documented

| # | Claim | Where | What is needed |
| --- | --- | --- | --- |
| 24 | 96% settlement rate | `claims.settlementRate` | Documentation, plus a note stating which matters were counted, the date range, and how "success" was defined. |
| 25 | 7,000 or 8,000+ cases | `claims.caseCount` | Documentation and definition. |
| 26 | $3 billion+ in settlements | `claims.settlementValue` | Documentation and definition. |
| 27 | Client testimonials | `testimonials` | Real reviews with written permission to publish (`permissionOnFile: true`). |
| 28 | Awards or media appearances | not yet modelled | Provide details and documentation first. |

When a claim is enabled with its note, it appears in the Home page statement band with the note and a statement that past results do not guarantee future outcomes.

## Facts to double-check

These are published as supplied in the brief. Please confirm the wording is exactly right:

- "More than 22 years of mediation experience."
- "Harvard Program on Negotiation" training (wording: "Harvard's Program on Negotiation").
- "Loyola Law School, Mediating the Litigated Case."
- "Advanced family mediation training recognized by the Florida Supreme Court."
- "FBI-trained crisis negotiator serving in a volunteer capacity with the Los Angeles County Sheriff's Department crisis-negotiation function."
- Service model: California-focused, with virtual sessions by Zoom available nationwide.
