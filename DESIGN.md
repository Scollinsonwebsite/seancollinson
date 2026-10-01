---
name: Mediation Office of S. Collinson
description: Open daylight sky, frosted glass, and white bento tiles; two contrails that meet.
colors:
  sky-950: "#0c2244"
  sky-900: "#123366"
  sky-800: "#17407f"
  sky-700: "#1f4f96"
  sky-600: "#2b62b0"
  sky-500: "#3f7bc8"
  sky-300: "#9ec2ec"
  sky-200: "#c6dcf5"
  sky-100: "#e1ecfa"
  sky-50: "#f0f5fc"
  white: "#ffffff"
  ink: "#0e1b2e"
  muted: "#475569"
  on-sky-soft: "#dbe7f7"
  blue: "#2f6fe4"
  blue-ink: "#1d4fb8"
  violet: "#7c6cf0"
  violet-ink: "#5443c9"
  amber: "#f2a428"
  amber-ink: "#8f5600"
  green: "#1fa971"
  green-ink: "#12704b"
  error: "#b42318"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Manrope, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 1.6rem + 4.4vw, 4.9rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  heading:
    fontFamily: "Schibsted Grotesk, Manrope, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.6rem + 1.8vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.12rem + 0.3vw, 1.375rem)"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.02rem + 0.19vw, 1.1875rem)"
    fontWeight: 450
    lineHeight: 1.65
    letterSpacing: "normal"
rounded:
  sm: "12px"
  md: "16px"
  lg: "26px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  tile-gap: "16px"
  section: "clamp(4rem, 2.8rem + 4.5vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.sky-700}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.sky-800}"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.sky-900}"
    rounded: "{rounded.pill}"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.sky-800}"
    rounded: "{rounded.pill}"
  tile:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "30px"
  chip-blue:
    backgroundColor: "#e3edff"
    textColor: "{colors.blue-ink}"
    size: "46px"
  input:
    backgroundColor: "{colors.sky-50}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "52px"
---

# Design system

## Overview

A clear daylight sky carries every page top: deep cornflower at the upper left, opening into pale haze toward the lower right. Two white contrails enter from opposite edges, meet, and fly on as one line, which is the practice's convergence mark drawn at sky scale. Over the sky sit a heavy white grotesk headline and one frosted-glass panel; below it, a bento of white rounded tiles rises over the sky's edge onto a pale sky-tint ground. The world comes from the user's reference image (sky-blue photographic hero, glass card, white bento). The home hero is a full-bleed photograph of Sean (supplied 2026-10-01) under a deep-sky scrim on the left; interior pages keep the CSS-drawn sky.

The aim is calm, legible authority for people in a hard moment: bright and open rather than courthouse navy, with every claim factual.

## Colors

### Primary
`sky-700` (#1f4f96) is the action and identity color: primary buttons, the current-page state on solid headers, the lead service tile. The sky ramp `sky-950` → `sky-500` paints heroes, bands, and the footer.

### Secondary
Four category accents tag content, never decoration: **blue** (family, process, consultation), **violet** (parenting, format), **amber** (civil and business), **green** (outcomes and confirmation). Each appears as a tinted chip background with its darker `-ink` shade for the icon or text, so contrast holds.

### Neutral
`white` tiles on `sky-50` ground. Body text `ink`; secondary text `muted` on white, and `on-sky-soft` on sky.

### Named Rules
- **Text on sky is white or `on-sky-soft`, never gray.** Over pale haze, put text inside the dark-tinted glass panel.
- **Accents tag, they don't decorate.** An accent color always means a category.

## Typography

Schibsted Grotesk (variable, self-hosted) is the display voice: heavy (750–800), tight tracking (-0.02 to -0.035em), balanced lines. Manrope (variable, self-hosted) carries body, labels, and controls at 17–19px with 1.65 line height.

### Hierarchy
Display (hero H1, up to 4.9rem) → page H1 (`step-4`) → section heading (`step-3`, 800) → tile and card title (`step-1`/`step-2`, 750) → body. FAQ questions use Manrope 700 so long questions stay readable.

### Named Rules
- **No eyebrows or kickers above headings.** Supporting words go after the headline (the home hero's "Private — Practical — Solution-focused" route line).

## Layout

12-column logic expressed as CSS grid, max width 1240px with a fluid gutter. Heroes run full-bleed under a transparent sticky header. The home bento is 4 columns at 1100px or wider (route tile spans 3; consultation tile beside it; three service tiles and the "Who decides" tile below), 2 columns from 760px, 1 column on phones. Sections alternate white and `sky-50`.

## Elevation & Depth

One elevation per element: either a soft offset shadow or a tinted fill, never a border plus a wide shadow.

### Shadow Vocabulary
- `--lift`: `0 18px 40px -22px rgba(12,34,68,.28), 0 2px 6px -2px rgba(12,34,68,.08)` for tiles, cards, and forms.
- `--lift-hover`: a deeper version for linked tiles on hover (with a 3px rise).
- Glass: `0 30px 60px -30px rgba(8,24,52,.6)` plus inset 1px highlights; `backdrop-filter: blur(22px) saturate(1.3)`.

## Shapes

Tiles and major cards 26px; inner cards, list rows, and inputs 12–16px; buttons, chips, filters, and nav items are full pills. Icons are Lucide (ISC), 24px grid, 1.75 stroke, in circular chips.

## Components

### Buttons
Pills, 52px tall (44px small). Primary is `sky-700` on light grounds; on sky it becomes **white** (`btn--white`, and `.page-hero .btn--primary`). Glass buttons (`btn--glass`) are the secondary action on sky.

### Chips
46px circles in an accent tint holding one icon.

### Cards / Containers
White tiles with `--lift`, or `sky-50` fills where the section is already white. Linked tiles are whole-card links with a circular arrow button that fills on hover.

### Inputs / Fields
52px, `sky-50` fill, 1.5px #8c9cb3 border, 12px radius; on focus a white fill with a 4px `sky-200` ring. Errors use a red border, a red message prefixed "Error:", and a focused error summary.

### Navigation
A transparent header over the sky with white text and a white pill on the current page; after 24px of scroll (or with the mobile menu open) it becomes white glass with ink text. On mobile, a circular menu button opens a full-width list.

### Photo hero (home)
Full-bleed `<picture>` (`images.hero`) with `object-position: 70% 30%`; a left-to-right scrim from `sky-950` at 92% to transparent by 72% keeps white copy at AA contrast while Sean stays clear on the right. Credentials sit in a frosted four-column strip (`.hero__strip`) under the actions. On phones the photo crops to Sean at the top and fades into `sky-950` behind the copy.

### Contrails (signature)
`contrails()` in `src/lib/render.mjs`: an SVG with two converging paths and their joined continuation, each drawn twice (a 12px blurred haze and a 1.8px core). Used static in the closing CTA band; softened on narrow screens. A `.hero .trail` draw-in animation remains available for a sky-only hero.

## Do's and Don'ts

### Do:
- Keep every number, credential, and claim real (see PRODUCT.md).
- Put text over pale sky inside the dark glass panel.
- Use route lines with nodes for real sequences (the four-step process).

### Don't:
- Invent metrics, charts, or testimonials to fill tiles.
- Add eyebrow labels, gradient text, or colored side borders.
- Use gray text on sky, or brass and navy from the retired palette.

## Raster provenance

All shipping rasters are generated from code by `tools/images.mjs` (Chromium screenshots of authored HTML/SVG); there is no stock or AI imagery. Supplied photography: `src/assets/img/source/sean-collinson-hero.webp` (1672 × 941, provided by the user), resized to 480–1672 px WebP/JPEG in `assets/img/generated/`. Generated from code: `assets/img/social-share.jpg` (1200 × 630), `assets/img/logo.png` (600 × 600), and the favicon set in `assets/icons/`. Approved photos of Sean, when supplied, go in `src/assets/img/source/` and are resized by the same tool.
