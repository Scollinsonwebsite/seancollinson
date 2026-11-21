// Narcissist or Negotiator? quiz (/narcissist-or-negotiator-quiz/).
// Every visible line of quiz copy is read at build time from
// src/content/quiz/narcissist-vs-negotiator-quiz-draft.md, exactly as written.
// The build fails if any expected part of the draft is missing or malformed.
// Scoring runs in the browser (assets/js/quiz.js). Answers are never sent or
// stored; only the email gate (first name, email) posts to forms/ebook.php
// with offer=quiz.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { office } from '../config.mjs';
import { layout, breadcrumbs, esc, ctx } from '../lib/render.mjs';
import { field } from '../lib/forms.mjs';

const PATH = '/narcissist-or-negotiator-quiz/';
const EBOOK_URL = 'https://seancollinson.com/think-like-a-hostage-negotiator/';
const BOOK_URL = 'https://tidycal.com/mediation/consul';
const PRIVACY_LINE = 'Your answers stay on your device. We only receive your name and email from the start screen.';

// Lines from the draft that are deliberately NOT shown, because they promise
// an emailed result or breakdown that is not sent (no new MailerLite
// automation, and answers never leave the device). Reported to Sean; restore
// them here once a breakdown email exists.
const WITHHELD = [
  'Enter your first name and email to start, and your result and full breakdown are yours on screen and by email.',
  'Your name and email are collected at the start, only so your result and full breakdown can be sent to you.',
  'Where should we send your result?',
  'Your graph and your full breakdown are shown at the end and sent to this email.',
];

const src = readFileSync(new URL('../content/quiz/narcissist-vs-negotiator-quiz-draft.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const lines = src.split('\n');
const fail = (msg) => { throw new Error(`Quiz draft: ${msg}`); };
const idx = (re, from = 0) => {
  for (let i = from; i < lines.length; i++) if (re.test(lines[i])) return i;
  return fail(`could not find ${re}`);
};
// Non-empty lines strictly between two marker lines.
const between = (startRe, endRe, from = 0) => {
  const a = idx(startRe, from);
  const b = idx(endRe, a + 1);
  return lines.slice(a + 1, b).map((l) => l.trim()).filter(Boolean);
};
const withhold = (text) => {
  let out = text;
  for (const w of WITHHELD) if (out.includes(w)) out = out.replace(w, '').replace(/\s{2,}/g, ' ').trim();
  return out;
};
const quoted = (line, label) => {
  const m = line.match(new RegExp(`${label}\\s*"([^"]+)"`));
  return m ? m[1] : fail(`no quoted text after ${label}`);
};
const num = (s) => {
  const m = s.trim().match(/^(minus|plus)\s+(\d+)$/);
  if (!m) fail(`bad number "${s}"`);
  return (m[1] === 'minus' ? -1 : 1) * Number(m[2]);
};

// Section 2: meta
const metaTitle = lines[idx(/^Meta title draft: /)].replace(/^Meta title draft: /, '').trim();
const metaDescription = lines[idx(/^Meta description draft: /)].replace(/^Meta description draft: /, '').trim();

// Section 3: intro
const s3 = idx(/^3\. Intro copy for the page/);
const h1 = lines[idx(/^Headline$/, s3) + 1].trim();
const subhead = lines[idx(/^Subhead$/, s3) + 1].trim();
const opening = between(/^Opening copy$/, /^Disclaimer box/, s3).map(withhold).filter(Boolean);
const disclaimer = between(/^Disclaimer box/, /^Instruction copy$/, s3);
const instructions = between(/^Instruction copy$/, /^Who this quiz is for/, s3).map(withhold).filter(Boolean);
const whoFor = between(/^Who this quiz is for/, /^The flow/, s3);
const gateLine = lines[idx(/^2\. Email capture screen:/, s3)];
const gateCopy = withhold(quoted(gateLine, 'Copy on the screen:'));
const gateButton = quoted(gateLine, 'button').replace(/\.$/, '');
const calculating = quoted(lines[idx(/^4\. Brief calculating screen:/, s3)], 'screen:');
if (disclaimer.length !== 2 || !/^Please read this first\./.test(disclaimer[0])) fail('disclaimer box changed shape');
if (whoFor.length !== 1) fail('who this quiz is for line changed shape');

// Section 1: footer line
const footerLine = quoted(lines[idx(/^Footer line for the page/)], 'draft:');

// Section 5: questions
const s5 = idx(/^5\. The 25 questions$/);
const s6 = idx(/^6\. Scoring bands$/, s5);
const questions = [];
for (let i = s5 + 1; i < s6; i++) {
  const m = lines[i].match(/^Question (\d+)\. (.+)$/);
  if (!m) continue;
  let j = i + 1;
  while (!lines[j].trim()) j++;
  const scenario = lines[j].trim();
  const answers = [];
  for (let k = j + 1; k < s6 && !/^Question \d+\./.test(lines[k]); k++) {
    const a = lines[k].match(/^\* (Minus|Plus) (\d): (.+)$/);
    if (a) answers.push({ text: a[3].trim(), value: (a[1] === 'Minus' ? -1 : 1) * Number(a[2]) });
  }
  const vals = answers.map((a) => a.value).sort((x, y) => x - y).join(',');
  if (answers.length !== 4 || vals !== '-2,-1,1,2') fail(`question ${m[1]} must have answers worth -2, -1, +1, +2`);
  questions.push({ n: Number(m[1]), title: m[2].trim(), scenario, answers });
}
if (questions.length !== 25 || questions.some((q, i) => q.n !== i + 1)) fail(`expected questions 1 to 25, found ${questions.length}`);

// Section 6: bands
const bands = [];
for (let i = s6 + 1; i < lines.length && !/^7\. /.test(lines[i]); i++) {
  const m = lines[i].match(/^\* Band (\d): (minus|plus) (\d+) to (minus|plus) (\d+)\. "(.+)"$/);
  if (m) bands.push({ n: Number(m[1]), min: num(`${m[2]} ${m[3]}`), max: num(`${m[4]} ${m[5]}`), name: m[6] });
}
if (bands.length !== 4 || bands[0].min !== -50 || bands[3].max !== 50) fail('scoring bands changed shape');
for (let i = 1; i < 4; i++) if (bands[i].min !== bands[i - 1].max + 1) fail('scoring bands must be contiguous');

// Section 7: results
const s7 = idx(/^7\. Results copy by band$/);
const sharedHeader = lines[idx(/^Shared results header/, s7) + 1].trim();
for (const b of bands) {
  const start = idx(new RegExp(`^Band ${b.n}: .*"${b.name}"$`), s7);
  const end = idx(new RegExp(`^Funnel for Band ${b.n}, in this order:$`), start);
  const block = lines.slice(start + 1, end).map((l) => l.trim()).filter(Boolean);
  const nextAt = block.indexOf('What to do next:');
  if (nextAt < 1) fail(`band ${b.n} has no "What to do next:" list`);
  b.paras = block.slice(0, nextAt);
  b.steps = block.slice(nextAt + 1).map((l) => {
    const m = l.match(/^\d+\. (.+)$/);
    return m ? m[1] : fail(`band ${b.n} next step not numbered: ${l}`);
  });
  if (b.steps.length !== 3) fail(`band ${b.n} should have 3 next steps`);
}
const afterLine = lines[idx(/^The email gate sits at the start \(Section 3\), so the results screen/, s7)];
const ebookCopy = quoted(afterLine, 'Copy:');
const ebookButton = quoted(afterLine, 'Button:').replace(/,$/, '');

// Section 8: meter
const s8 = idx(/^8\. Graph spec: the Spectrum Meter$/);
const shareLine = quoted(lines[idx(/share line:/, s8)], 'share line:');
const ctaLine = lines[idx(/^\* CALL TO ACTION at the graph/, s8)];
const brandLine = quoted(ctaLine, 'Headline line:');
const bookButton = quoted(ctaLine, 'Big navy button:').replace(/,$/, '');

// Section 9: safety note
const safety = between(/^9\. Safety note/, /^10\. Notes/);
if (safety.length !== 2) fail('safety note changed shape');

// Every withheld line must have been found, so a draft edit cannot silently re-show one.
for (const w of WITHHELD) if (!src.includes(w)) fail(`withheld line no longer in draft: ${w}`);

// Tap links inside the safety note (text unchanged).
const safetyHtml = (p) =>
  esc(p)
    .replace('call 911', 'call <a href="tel:911">911</a>')
    .replace('1-800-799-7233', '<a href="tel:+18007997233">1-800-799-7233</a>')
    .replace('text START to 88788', '<a href="sms:88788?body=START">text START to 88788</a>');
const leadBold = (p) => {
  const m = p.match(/^(What this usually means:|The honest part:)(.*)$/);
  return m ? `<strong>${esc(m[1])}</strong>${esc(m[2])}` : esc(p);
};
const disclaimerHtml = (linkSafety) => `<div class="quiz-disclaimer" role="note">
  <p><strong>${esc(disclaimer[0].match(/^Please read this first\./)[0])}</strong>${esc(disclaimer[0].replace(/^Please read this first\./, ''))}</p>
  <p>${linkSafety ? esc(disclaimer[1]).replace('go to the safety note', 'go to <a href="#quiz-safety">the safety note</a>') : esc(disclaimer[1])}</p>
</div>`;
const safetyBox = (id) => `<aside class="quiz-safety"${id ? ` id="${id}"` : ''} aria-label="Safety note">
  <h2 class="quiz-safety__title">Safety note</h2>
  ${safety.map((p) => `<p>${safetyHtml(p)}</p>`).join('\n  ')}
</aside>`;

// Data for the browser: questions with their hidden values, bands, and the meter sentence parts.
const data = {
  questions: questions.map((q) => ({ n: q.n, title: q.title, scenario: q.scenario, answers: q.answers })),
  bands: bands.map(({ n, min, max, name }) => ({ n, min, max, name })),
  calculating,
};
const dataJson = JSON.stringify(data).replace(/</g, '\\u003c');

// Spectrum zone widths on a -50..+50 scale, split halfway between whole-number band edges.
const zoneEdges = [-50, ...bands.slice(0, 3).map((b) => b.max + 0.5), 50];
const zones = bands.map((b, i) => ({ ...b, width: zoneEdges[i + 1] - zoneEdges[i] }));

const meta = {
  path: PATH,
  out: 'narcissist-or-negotiator-quiz/index.html',
  title: metaTitle,
  description: metaDescription,
  h1,
};

const style = `<style>
.page-quiz main{background:#fff}
.quiz{padding-block:clamp(2rem,5vw,3.5rem) 0}
.quiz .wrap{max-width:calc(760px + 2 * var(--gutter))}
.quiz-hero h1{font-size:clamp(2.1rem,1.5rem + 3vw,3.4rem);font-weight:800;letter-spacing:-.03em;line-height:1.04;margin:0 0 .6rem}
.quiz-sub{font-size:var(--step-1);line-height:1.5;font-weight:600;margin:0 0 1.75rem;max-width:36em}
.quiz-hero .breadcrumbs ol{margin-bottom:1.25rem}
.quiz-video{margin:0 auto 2rem;max-width:640px}
.quiz-video video{display:block;width:100%;height:auto;aspect-ratio:16/9;border-radius:var(--radius);background:#0A1B31;box-shadow:0 18px 40px -24px rgba(10,27,49,.55)}
.quiz-copy p{max-width:40em}
.quiz-disclaimer{margin:1.75rem 0;padding:1.25rem 1.35rem;border:2px solid #0A1B31;border-radius:var(--radius);background:rgba(238,217,164,.32);color:#0A1B31;font-size:1.0625rem;line-height:1.6}
.quiz-disclaimer p{margin:0 0 .75rem}.quiz-disclaimer p:last-child{margin:0}
.quiz-disclaimer a,.quiz-safety a,.quiz a:not(.btn){color:#0A1B31;font-weight:700;text-decoration:underline;text-underline-offset:.2em}
.quiz-start{margin:1.75rem 0 .75rem}
.quiz-who{font-size:.95rem;color:#34435A;max-width:38em;margin:0 0 2.25rem}
.quiz-safety{margin:2rem 0;padding:1.25rem 1.35rem;border-left:4px solid #EED9A4;background:#fff;box-shadow:0 0 0 1px rgba(10,27,49,.16);border-radius:var(--radius-sm);color:#0A1B31}
.quiz-safety__title{font-size:var(--step-1);margin:0 0 .5rem}
.quiz-safety p{margin:0 0 .75rem}.quiz-safety p:last-child{margin:0}
.quiz-footer-line{font-size:.875rem;color:#34435A;margin:2rem 0 0;padding-bottom:clamp(2rem,5vw,3.5rem)}
.quiz .btn-big{min-height:58px;padding:1rem 1.75rem;font-size:1.0625rem;width:100%;max-width:420px}
.quiz-gate{max-width:560px}
.quiz-gate__title{font-size:clamp(2.1rem,1.5rem + 3vw,3.4rem);font-weight:800;letter-spacing:-.03em;line-height:1.04;margin:0 0 1rem;color:#0A1B31}
.quiz-gate__lead{font-size:var(--step-1);font-weight:650;margin:0 0 1.25rem}
.section--ivory .quiz-gate .form{background:none;box-shadow:none;padding:0;color:#0A1B31;--t-head:#0A1B31;--t-body:#0A1B31;--t-muted:#34435A}
.section--ivory .quiz-gate .field__label{color:#0A1B31}
.section--ivory .quiz-gate .field__req{color:#34435A}
.section--ivory .quiz-gate .field__error,.section--ivory .quiz-gate .form__status.is-error{color:var(--error)}
.section--ivory .quiz-gate .form__status.is-error{background:var(--red-50);box-shadow:inset 0 0 0 1.5px var(--error)}
.quiz-gate .form__grid{grid-template-columns:1fr}
.quiz-gate .field input{border-color:rgba(10,27,49,.45)!important}
.quiz-privacy{font-size:.9rem;color:#34435A;margin:1rem 0 0}
.quiz-q{padding-bottom:0}
.quiz-progress{position:sticky;top:var(--header-h);z-index:5;height:5px;background:rgba(10,27,49,.1);margin:0 calc(var(--gutter) * -1)}
.quiz-progress__bar{display:block;height:100%;width:0;background:#0A1B31;transition:width .3s var(--ease)}
.quiz-q__top{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:44px;margin:1rem 0 .5rem}
.quiz-q__count{font-size:.875rem;font-weight:700;color:#34435A;margin:0}
.quiz-back{min-height:44px;padding:.4rem .9rem;border:1.5px solid rgba(10,27,49,.35);border-radius:999px;background:#fff;color:#0A1B31;font:700 .9375rem/1 var(--sans);cursor:pointer}
.quiz-back:hover{border-color:#0A1B31}
.quiz-q__title{font-size:.875rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5E5639;margin:.25rem 0 .5rem}
.quiz-q__scenario{font-family:var(--display);font-size:clamp(1.3rem,1.1rem + 1vw,1.75rem);font-weight:750;line-height:1.3;letter-spacing:-.015em;color:#0A1B31;margin:0 0 1.25rem}
.quiz-answers{display:grid;gap:12px;margin:0;padding:0;border:0}
.quiz-answer{position:relative;display:flex;align-items:center;gap:1rem;min-height:64px;padding:1rem 1.1rem;border:1.5px solid rgba(10,27,49,.28);border-radius:var(--radius);background:#fff;color:#0A1B31;font-size:1.0625rem;line-height:1.45;cursor:pointer;transition:background-color .15s,border-color .15s}
.quiz-answer:hover{border-color:#0A1B31}
.quiz-answer input{position:absolute;opacity:0;width:1px;height:1px}
.quiz-answer__text{flex:1}
.quiz-answer__radio{flex:none;width:26px;height:26px;border-radius:50%;border:2px solid rgba(10,27,49,.5);display:grid;place-items:center;background:#fff}
.quiz-answer__radio svg{width:15px;height:15px;opacity:0;stroke:#fff}
.quiz-answer.is-selected{background:rgba(238,217,164,.55);border-color:#0A1B31;box-shadow:0 0 0 1px #0A1B31}
.quiz-answer.is-selected .quiz-answer__radio{background:#0A1B31;border-color:#0A1B31}
.quiz-answer.is-selected .quiz-answer__radio svg{opacity:1}
.quiz-answer:has(input:focus-visible){outline:3px solid #0A1B31;outline-offset:3px}
.quiz-nextbar{position:sticky;bottom:0;z-index:5;margin:1.5rem calc(var(--gutter) * -1) 0;padding:12px var(--gutter) calc(12px + env(safe-area-inset-bottom));background:#fff;box-shadow:0 -10px 24px -18px rgba(10,27,49,.45)}
.quiz-next{display:block;width:100%;min-height:58px;border:0;border-radius:999px;background:#0A1B31;color:#fff;font:750 1.0625rem/1 var(--sans);cursor:pointer}
.quiz-next:hover:not([disabled]){background:#060D1A}
.quiz-next[disabled]{opacity:.38;cursor:not-allowed}
.quiz-next:focus-visible{outline:3px solid #EED9A4;outline-offset:3px}
.quiz-calc{min-height:50vh;display:grid;place-items:center;text-align:center}
.quiz-calc p{font-family:var(--display);font-size:var(--step-2);font-weight:750;color:#0A1B31}
.quiz-results{padding-bottom:clamp(2rem,5vw,3.5rem)}
.quiz-results__header{font-size:var(--step-1);line-height:1.55;font-weight:600;margin:1.5rem 0 0}
.quiz-meter{margin:2rem 0 1rem;padding:1.4rem 1.1rem 1.1rem;border-radius:var(--radius);box-shadow:0 0 0 1px rgba(10,27,49,.16);background:#fff}
.quiz-meter__ends{display:flex;justify-content:space-between;gap:1rem;font-size:.8125rem;font-weight:800;color:#0A1B31;margin:0 0 2.6rem}
.quiz-meter__ends span:last-child{text-align:right}
.quiz-meter__track{position:relative;display:flex;height:18px;border-radius:999px;overflow:visible}
.quiz-meter__zone{height:100%}
.quiz-meter__zone:first-child{border-radius:999px 0 0 999px}.quiz-meter__zone:last-child{border-radius:0 999px 999px 0}
.quiz-meter__zone--1{background:#0A1B31}.quiz-meter__zone--2{background:rgba(10,27,49,.45)}.quiz-meter__zone--3{background:rgba(238,217,164,.7)}.quiz-meter__zone--4{background:#EED9A4}
.quiz-meter__marker{position:absolute;top:50%;left:50%;width:0;height:0;transition:left 1.5s cubic-bezier(.22,1,.36,1)}
.quiz-meter__pin{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;background:#fff;border:4px solid #0A1B31;box-shadow:0 4px 10px rgba(10,27,49,.35)}
.quiz-meter__score{position:absolute;bottom:20px;left:0;transform:translateX(-50%);padding:.15rem .5rem;border-radius:6px;background:#0A1B31;color:#fff;font-size:.875rem;font-weight:800;white-space:nowrap}
.quiz-meter__scale{display:flex;justify-content:space-between;font-size:.8125rem;font-weight:700;color:#34435A;margin:.55rem 0 .35rem}
.quiz-meter__labels{display:flex;font-size:.75rem;font-weight:700;line-height:1.25;color:#0A1B31;text-align:center}
.quiz-meter__labels span{padding:0 2px}
.quiz-meter__sentence{font-size:1.0625rem;font-weight:650;margin:1rem 0 0}
.quiz-share{font-size:.95rem;color:#34435A;margin:.75rem 0 0}
.quiz-band h2{font-size:var(--step-3);margin:2rem 0 .75rem}
.quiz-band h3{font-size:var(--step-1);margin:1.5rem 0 .5rem}
.quiz-band ol{padding-left:1.3rem}.quiz-band li{margin-bottom:.6rem}
.quiz-cta{margin:2.25rem 0 0;padding:1.6rem 1.35rem;border-radius:var(--radius);background:#0A1B31;color:#fff;text-align:center}
.quiz-cta__brand{font-family:var(--display);font-size:var(--step-2);font-weight:800;color:#fff;margin:0 0 1rem}
.quiz-cta .btn-big{max-width:520px}
.quiz-ebook{margin:1.5rem 0 0;padding:1.35rem;border-radius:var(--radius);box-shadow:0 0 0 1px rgba(10,27,49,.16);border-top:4px solid #EED9A4}
.quiz-ebook p{font-weight:600;margin:0 0 1rem}
.quiz-end{display:flex;flex-wrap:wrap;gap:.75rem;margin:1.5rem 0 0}
.quiz-restart{min-height:52px;padding:.8rem 1.6rem;border:1.5px solid #0A1B31;border-radius:999px;background:#fff;color:#0A1B31;font:700 1rem/1.2 var(--sans);cursor:pointer}
.quiz-restart:hover{background:rgba(238,217,164,.45)}
.quiz [hidden]{display:none!important}
.quiz-screen:focus{outline:none}
@media (min-width:700px){.quiz-answer{padding:1.1rem 1.3rem}.quiz-meter{padding:1.6rem 1.5rem 1.3rem}.quiz-meter__labels{font-size:.8125rem}}
@media (prefers-reduced-motion:reduce){.quiz-meter__marker,.quiz-progress__bar{transition:none}}
</style>`;

const check = '<svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

export const quizPage = {
  meta,
  data: { questions, bands, withheld: WITHHELD },
  render() {
    const crumbs = breadcrumbs([{ name: 'Narcissist or Negotiator Quiz', path: PATH }]);
    const f = (o) => field({ ...o, required: true, idPrefix: 'quiz' });
    const bandResults = bands
      .map(
        (b) => `<div class="quiz-band" data-band-result="${b.n}" hidden>
      <h2>${esc(b.name)}</h2>
      ${b.paras.map((p) => `<p>${leadBold(p)}</p>`).join('\n      ')}
      <h3>What to do next:</h3>
      <ol>${b.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    </div>`
      )
      .join('\n    ');
    const body = `
<section class="quiz section--ivory" data-quiz aria-labelledby="page-title">
  <div class="wrap">
    <div class="quiz-hero" data-quiz-hero>
      ${crumbs.html}
      <h1 id="page-title">${esc(h1)}</h1>
      <p class="quiz-sub">${esc(subhead)}</p>
      <figure class="quiz-video">
        <video controls playsinline preload="metadata" width="1280" height="720" aria-label="Quiz introduction video" data-quiz-video><source src="/assets/video/quiz-intro-video-web.mp4#t=0.1" type="video/mp4"></video>
      </figure>
    </div>

    <div class="quiz-screen" data-screen="intro" tabindex="-1">
      <div class="quiz-copy">${opening.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}</div>
      ${disclaimerHtml(true)}
      <div class="quiz-copy">${instructions.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <p class="quiz-start"><button class="btn btn--primary btn-big" type="button" data-quiz-start>Start</button></p>
      <p class="quiz-who">${esc(whoFor[0])}</p>
      ${safetyBox('quiz-safety')}
      <p class="quiz-footer-line">${esc(footerLine)}</p>
    </div>

    <div class="quiz-screen quiz-gate" data-screen="gate" tabindex="-1" hidden>
      <h2 class="quiz-gate__title" id="quiz-gate-title">${esc(h1)}</h2>
      <p class="quiz-gate__lead">${esc(gateCopy)}</p>
      <form class="form" data-quiz-gate action="/forms/ebook.php" method="post" novalidate aria-labelledby="quiz-gate-title">
        <input type="hidden" name="offer" value="quiz">
        <input type="hidden" name="_t" value="" data-timestamp>
        <div class="hp" aria-hidden="true"><label for="quiz-website">Leave this field empty</label><input id="quiz-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
        <div class="form__grid">
          ${f({ name: 'first_name', label: 'First name', autocomplete: 'given-name', maxlength: 80 })}
          ${f({ name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', maxlength: 160 })}
        </div>
        <div class="form__actions"><button class="btn btn--primary btn-big" type="submit">${esc(gateButton)}</button></div>
        <div class="form__status" role="status" aria-live="polite" data-status></div>
      </form>
      <p class="quiz-privacy">${esc(PRIVACY_LINE)}</p>
    </div>

    <div class="quiz-screen quiz-q" data-screen="question" tabindex="-1" hidden>
      <div class="quiz-progress" aria-hidden="true"><span class="quiz-progress__bar" data-progress></span></div>
      <div class="quiz-q__top">
        <p class="quiz-q__count" data-count aria-live="polite"></p>
        <button class="quiz-back" type="button" data-back>Back</button>
      </div>
      <p class="quiz-q__title" data-q-title></p>
      <fieldset class="quiz-answers" data-answers>
        <legend class="quiz-q__scenario" data-q-scenario></legend>
      </fieldset>
      <div class="quiz-nextbar"><button class="quiz-next" type="button" data-next disabled>Next</button></div>
      <template data-answer-template><label class="quiz-answer"><input type="radio" name="quiz-answer"><span class="quiz-answer__text"></span><span class="quiz-answer__radio" aria-hidden="true">${check}</span></label></template>
    </div>

    <div class="quiz-screen quiz-calc" data-screen="calculating" tabindex="-1" hidden>
      <p role="status">${esc(calculating)}</p>
    </div>

    <div class="quiz-screen quiz-results" data-screen="results" tabindex="-1" hidden>
      <div data-band-only="1" hidden>${safetyBox('')}</div>
      <p class="quiz-results__header">${esc(sharedHeader)}</p>
      ${disclaimerHtml(false)}
      <figure class="quiz-meter">
        <div class="quiz-meter__ends" aria-hidden="true"><span>Narcissist thinking</span><span>Hostage negotiator thinking</span></div>
        <div class="quiz-meter__track" aria-hidden="true">
          ${zones.map((z) => `<span class="quiz-meter__zone quiz-meter__zone--${z.n}" style="width:${z.width}%"></span>`).join('')}
          <span class="quiz-meter__marker" data-marker><span class="quiz-meter__score" data-marker-score></span><span class="quiz-meter__pin"></span></span>
        </div>
        <div class="quiz-meter__scale" aria-hidden="true"><span>-50</span><span>0</span><span>+50</span></div>
        <div class="quiz-meter__labels" aria-hidden="true">${zones.map((z) => `<span style="width:${z.width}%">${esc(z.name)}</span>`).join('')}</div>
        <figcaption class="quiz-meter__sentence" id="quiz-meter-sentence" data-sentence></figcaption>
      </figure>
      <p class="quiz-share">${esc(shareLine)}</p>
    ${bandResults}
      <div class="quiz-cta">
        <p class="quiz-cta__brand">${esc(brandLine)}</p>
        <a class="btn btn--primary btn-big" href="${BOOK_URL}" target="_blank" rel="noopener">${esc(bookButton)}</a>
      </div>
      <div class="quiz-ebook">
        <p>${esc(ebookCopy)}</p>
        <a class="btn btn--primary" href="${EBOOK_URL}">${esc(ebookButton)}</a>
      </div>
      <div class="quiz-end">
        <a class="btn btn--primary" href="tel:${esc(office.phone)}">Call ${esc(office.phoneDisplay)}</a>
        <button class="quiz-restart" type="button" data-restart>Take it again.</button>
      </div>
      <div data-band-not="1">${safetyBox('')}</div>
      <p class="quiz-privacy">${esc(PRIVACY_LINE)}</p>
    </div>
  </div>
  <script type="application/json" id="quiz-data">${dataJson}</script>
</section>
`;
    const v = createHash('sha256').update(readFileSync(join(ctx.srcDir, 'assets/js/quiz.js'))).digest('hex').slice(0, 10);
    return layout({ path: PATH, title: meta.title, description: meta.description, body, schema: [crumbs.schema], bodyClass: 'page-quiz', headExtra: style, bodyEnd: `<script src="/assets/js/quiz.js?v=${v}" defer></script>` });
  },
};
