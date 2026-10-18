// Browser smoke test: two people walk the whole flow. Needs Playwright (global or local).
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = mkdtempSync(join(tmpdir(), 'tc-ui-'));
const port = 8766;
const url = `http://127.0.0.1:${port}/`;
const server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', join(root, 'public')], {
  env: { ...process.env, TC_DSN: `sqlite:${join(dir, 'ui.db')}` }, stdio: 'ignore'
});
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch();

async function runQuiz(page, count) {
  for (let i = 0; i < count; i++) {
    await page.locator('input[name=a]').first().check();
    await page.getByRole('button', { name: /Next|See my result/ }).click();
  }
}
async function runPortal(page, count) {
  for (let i = 0; i < count; i++) {
    await page.locator('input[name=a]').nth(i % 5).check();
    await page.getByRole('button', { name: /Next|Finish/ }).click();
  }
}

try {
  const errors = [];
  const ctxA = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const A = await ctxA.newPage();
  A.on('pageerror', (e) => errors.push(e.message));
  A.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await A.goto(url);
  await A.fill('#name', 'Ana');
  await A.getByRole('button', { name: 'Start my 10 questions' }).click();
  await runQuiz(A, 10);
  await A.waitForSelector('#inviteLink');
  const invite = await A.inputValue('#inviteLink');
  assert.match(invite, /\?join=[a-f0-9]{32}$/);
  assert.ok(await A.locator('.bar').count() >= 4);

  // Reload resumes via stored secret
  await A.reload();
  await A.waitForSelector('#inviteLink');

  const ctxB = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const B = await ctxB.newPage();
  B.on('pageerror', (e) => errors.push(e.message));
  await B.goto(invite);
  assert.ok(await B.getByRole('heading', { name: /Ana invited you/ }).isVisible());
  await B.fill('#name', 'Ben');
  await B.getByRole('button', { name: 'Begin' }).click();
  await runQuiz(B, 10);
  await B.getByRole('heading', { name: "You're a match" }).waitFor();

  // Second use of the invitation is refused
  const ctxC = await browser.newContext();
  const C = await ctxC.newPage();
  await C.goto(invite);
  await C.getByRole('heading', { name: /already been used/ }).waitFor();

  await B.getByRole('button', { name: /Begin the 50-question portal/ }).click();
  await runPortal(B, 50);
  await B.getByRole('heading', { name: "You're done" }).waitFor();

  await A.reload();
  await A.getByRole('heading', { name: "You're a match" }).waitFor();
  await A.getByRole('button', { name: /Begin the 50-question portal/ }).click();
  await runPortal(A, 50);
  await A.getByRole('heading', { name: 'Your compatibility' }).waitFor();
  await B.reload();
  await B.getByRole('heading', { name: 'Your compatibility' }).waitFor();
  assert.equal(await A.locator('.score').first().innerText().then((t) => /\d+/.test(t)), true);

  // No horizontal scroll on phone width
  const overflow = await A.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  assert.equal(overflow, false);
  assert.deepEqual(errors, []);
  await A.screenshot({ path: process.env.TC_SHOT || join(dir, 'result.png'), fullPage: true });
  console.log('UI e2e: full two-person flow passed');
} finally {
  await browser.close();
  server.kill();
  rmSync(dir, { recursive: true, force: true });
}
