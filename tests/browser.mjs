// Browser QA: renders every page at mobile, tablet, and desktop widths in
// Chromium; checks console errors, horizontal overflow, failed requests,
// axe-core accessibility rules (WCAG 2.2 A/AA), menu keyboard behaviour,
// form validation, and saves screenshots.
//   AXE_PATH=/path/to/axe.min.js node tests/browser.mjs [folder] [screenshotDir]
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const dir = process.argv[2] || 'bluehost-upload';
const shotDir = process.argv[3] || 'qa-screenshots';
const port = 8123;
const base = `http://localhost:${port}`;
const axePath = process.env.AXE_PATH || 'node_modules/axe-core/axe.min.js';
const axeSource = existsSync(axePath) ? readFileSync(axePath, 'utf8') : null;

const pages = ['/', '/about/', '/mediation/', '/consultation/', '/videos/', '/masterclass/', '/contact/', '/privacy-policy/', '/terms-of-use/', '/accessibility/', '/disclaimer/', '/does-not-exist/'];
const widths = [
  ['mobile', 375, 812],
  ['tablet', 820, 1180],
  ['desktop', 1440, 900],
];

mkdirSync(shotDir, { recursive: true });
const server = spawn(process.execPath, ['tools/serve.mjs', dir, String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));

const browser = await playwright.chromium.launch();
const problems = [];
const notes = [];

for (const [name, w, h] of widths) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  for (const path of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('requestfailed', (r) => errors.push('request failed: ' + r.url()));
    page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('does-not-exist')) errors.push(`HTTP ${r.status()} ${r.url()}`); });
    const res = await page.goto(base + path, { waitUntil: 'networkidle' });
    if (path === '/does-not-exist/' && res.status() !== 404) problems.push(`${path}: expected 404, got ${res.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`${name} ${path}: horizontal overflow of ${overflow}px`);
    if (errors.length) problems.push(`${name} ${path}: ${errors.join(' | ')}`);
    const file = `${shotDir}/${name}${path === '/' ? '-home' : path.replace(/\//g, '-').replace(/-$/, '')}.png`;
    await page.screenshot({ path: file, fullPage: true });

    if (axeSource && name !== 'tablet') {
      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(async () =>
        // eslint-disable-next-line no-undef
        (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => ({
          id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
        }))
      );
      for (const v of axe) problems.push(`${name} ${path}: axe ${v.impact} ${v.id}: ${v.help} → ${v.nodes.join(', ')}`);
    }
    // Touch targets on mobile: interactive elements at least 24×24 (WCAG 2.2 AA 2.5.8)
    if (name === 'mobile') {
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('a, button, input, select, textarea, summary')]
          .filter((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && s.visibility !== 'hidden' && !el.closest('.hp') && (r.height < 24 || r.width < 24) && !el.closest('p, li, dd, td, figcaption'); })
          .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.name || '').trim().slice(0, 30)}"`)
      );
      if (small.length) problems.push(`mobile ${path}: small targets ${small.slice(0, 5).join(', ')}`);
    }
    await page.close();
  }
  await context.close();
}

// ── Interaction checks ──────────────────────────────────────────────────────
{
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  // Skip link is first focusable
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement.className);
  first.includes('skip-link') ? notes.push('Skip link is the first focusable element') : problems.push('Skip link is not first in tab order');
  // Mobile menu: open with keyboard, focus moves in, Escape closes and returns focus
  await page.focus('[data-menu-toggle]');
  await page.keyboard.press('Enter');
  const menuOpen = await page.evaluate(() => !document.querySelector('[data-menu]').hidden && document.activeElement.closest('[data-menu]') !== null);
  menuOpen ? notes.push('Mobile menu opens by keyboard and moves focus into the menu') : problems.push('Mobile menu did not open or focus did not move');
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  const trapped = await page.evaluate(() => document.activeElement.closest('[data-menu]') !== null || document.activeElement.matches('[data-menu-toggle]'));
  trapped ? notes.push('Focus stays within the open mobile menu') : problems.push('Focus escaped the open mobile menu');
  await page.keyboard.press('Escape');
  const closed = await page.evaluate(() => document.querySelector('[data-menu]').hidden && document.activeElement.matches('[data-menu-toggle]'));
  closed ? notes.push('Escape closes the menu and returns focus to the toggle') : problems.push('Escape did not close the menu or return focus');
  await page.screenshot({ path: `${shotDir}/mobile-menu-closed.png` });
  await page.click('[data-menu-toggle]');
  await page.screenshot({ path: `${shotDir}/mobile-menu-open.png` });

  // FAQ disclosure toggles with keyboard
  await page.goto(base + '/mediation/', { waitUntil: 'networkidle' });
  const summary = page.locator('.faq__item').nth(1).locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  (await page.locator('.faq__item').nth(1).evaluate((d) => d.open)) ? notes.push('FAQ items open with the keyboard') : problems.push('FAQ item did not open with keyboard');

  // Forms: when disabled, the submit button is disabled and the notice is shown
  await page.goto(base + '/consultation/', { waitUntil: 'networkidle' });
  const disabled = await page.evaluate(() => document.querySelector('form[data-form]').hasAttribute('data-disabled'));
  if (disabled) {
    const btnDisabled = await page.locator('form[data-form] button[type=submit]').isDisabled();
    btnDisabled ? notes.push('Forms are clearly marked as not yet accepting submissions; submit is disabled') : problems.push('Disabled form still has an active submit button');
  }
  await context.close();
}

// Form validation and states, exercised on a copy of the page with the form enabled
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.route('**/forms/submit.php', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
  await page.goto(base + '/consultation/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const f = document.querySelector('form[data-form]');
    f.removeAttribute('data-disabled');
    const b = f.querySelector('button[type=submit]');
    b.disabled = false; b.removeAttribute('aria-disabled');
  });
  await page.click('form[data-form] button[type=submit]');
  const summaryVisible = await page.locator('[data-error-summary]').isVisible();
  const summaryFocused = await page.evaluate(() => document.activeElement.matches('[data-error-summary]'));
  const invalidCount = await page.locator('[aria-invalid="true"]').count();
  summaryVisible && summaryFocused && invalidCount > 0
    ? notes.push(`Empty submission shows a focused error summary and marks ${invalidCount} fields invalid`)
    : problems.push('Error summary not shown/focused on invalid submit');
  await page.screenshot({ path: `${shotDir}/form-errors.png`, fullPage: false });
  await page.fill('#f-name', 'Test Person');
  await page.fill('#f-email', 'not-an-email');
  await page.click('form[data-form] button[type=submit]');
  const emailErr = await page.locator('#f-email-error').textContent();
  /format/.test(emailErr) ? notes.push('Invalid email gets a specific message') : problems.push('Invalid email message missing');
  await page.fill('#f-email', 'test@example.com');
  await page.check('input[name=contact_method][value=Email]');
  await page.selectOption('#f-dispute_type', { index: 1 });
  await page.fill('#f-other_party', 'Other Person');
  await page.selectOption('#f-session_format', { index: 2 });
  await page.fill('#f-summary', 'General summary for testing.');
  await page.check('#f-consent');
  await page.click('form[data-form] button[type=submit]');
  await page.waitForSelector('.form__status.is-success');
  const msg = await page.locator('.form__status').textContent();
  /not yet an appointment/.test(msg) ? notes.push('Successful submission shows a success message that does not claim an appointment is booked') : problems.push('Success message wrong: ' + msg);
  await page.screenshot({ path: `${shotDir}/form-success.png` });

  // Error state from the server
  await page.unroute('**/forms/submit.php');
  await page.route('**/forms/submit.php', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false, message: 'Online forms are not accepting submissions yet. Please check back soon.' }) }));
  await page.fill('#f-name', 'Test Person'); await page.fill('#f-email', 'test@example.com');
  await page.check('input[name=contact_method][value=Email]');
  await page.selectOption('#f-dispute_type', { index: 1 }); await page.fill('#f-other_party', 'X');
  await page.selectOption('#f-session_format', { index: 2 }); await page.fill('#f-summary', 'Test'); await page.check('#f-consent');
  await page.click('form[data-form] button[type=submit]');
  await page.waitForSelector('.form__status.is-error');
  notes.push('Server error shows an error state with the server’s message');
  await context.close();
}

// Reduced motion: hero lines must not animate
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.hero__line')).animationName);
  anim === 'none' ? notes.push('Hero animation is disabled when reduced motion is requested') : problems.push('Hero animates despite reduced motion: ' + anim);
  await context.close();
}

await browser.close();
server.kill();

notes.forEach((n) => console.log('PASS  ' + n));
problems.forEach((p) => console.log('FAIL  ' + p));
console.log(`\n${axeSource ? 'axe-core checks ran' : 'axe-core not found (set AXE_PATH) — accessibility rules skipped'}; screenshots in ${shotDir}/`);
console.log(`${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
