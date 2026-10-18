// End-to-end API test. Starts PHP's built-in server on a temp SQLite DB.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = mkdtempSync(join(tmpdir(), 'tc-'));
const port = 8765;
const base = `http://127.0.0.1:${port}/api/index.php`;
const server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', join(root, 'public')], {
  env: { ...process.env, TC_DSN: `sqlite:${join(dir, 'test.db')}` }, stdio: 'ignore'
});
await new Promise((r) => setTimeout(r, 800));

const call = async (a, { method = 'GET', params = {}, body } = {}) => {
  const res = await fetch(`${base}?${new URLSearchParams({ a, ...params })}`, {
    method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined
  });
  return { status: res.status, data: await res.json() };
};
const quiz = (c) => Array(10).fill(c);
const portal = (fn) => Array.from({ length: 50 }, (_, i) => fn(i));

try {
  // Questions endpoint
  const qs = await call('questions', { params: { stage: 'portal' } });
  assert.equal(qs.data.questions.length, 50);

  // Stage 1
  const a = (await call('create', { method: 'POST', body: { name: 'Ana <b>x</b>' } })).data;
  let st = (await call('state', { params: { secret: a.secret } })).data;
  assert.equal(st.stage, 'quiz');
  assert.equal(st.name, 'Ana x');

  // Invite not ready until A finishes
  const early = await call('invite', { params: { token: 'a'.repeat(32) } });
  assert.equal(early.status, 404);

  // Bad submissions
  assert.equal((await call('submit', { method: 'POST', body: { secret: a.secret, stage: 'quiz', answers: ['gold'] } })).status, 400);
  assert.equal((await call('state', { params: { secret: 'nope' } })).status, 404);

  const mix = ['gold', 'gold', 'gold', 'gold', 'gold', 'blue', 'blue', 'green', 'orange', 'gold'];
  st = (await call('submit', { method: 'POST', body: { secret: a.secret, stage: 'quiz', answers: mix } })).data;
  assert.equal(st.stage, 'waiting_partner');
  assert.deepEqual(st.primary, ['gold']);
  assert.equal(st.profile.gold, 60);
  assert.match(st.invite, /^[a-f0-9]{32}$/);
  assert.equal((await call('submit', { method: 'POST', body: { secret: a.secret, stage: 'quiz', answers: mix } })).status, 409);

  // Stage 2: join, then pass
  const inv = (await call('invite', { params: { token: st.invite } })).data;
  assert.equal(inv.ready, true); assert.equal(inv.taken, false);
  const b = (await call('join', { method: 'POST', body: { invite: st.invite, name: 'Ben' } })).data;
  assert.equal((await call('join', { method: 'POST', body: { invite: st.invite, name: 'Eve' } })).status, 409);

  // Portal locked before match
  assert.equal((await call('submit', { method: 'POST', body: { secret: b.secret, stage: 'portal', answers: portal(() => 3) } })).status, 403);

  const bState = (await call('submit', { method: 'POST', body: { secret: b.secret, stage: 'quiz', answers: quiz('blue') } })).data;
  assert.equal(bState.stage, 'portal');
  assert.equal(bState.match.passed, true);
  const aState = (await call('state', { params: { secret: a.secret } })).data;
  assert.equal(aState.stage, 'portal');
  assert.equal(aState.match.score, bState.match.score);
  assert.equal(aState.partner_name, 'Ben');

  // Stage 3
  const pa = portal((i) => (i % 5) + 1);
  const pb = portal((i) => ((i + 1) % 5) + 1);
  let r = (await call('submit', { method: 'POST', body: { secret: a.secret, stage: 'portal', answers: pa } })).data;
  assert.equal(r.stage, 'portal_waiting');
  assert.equal(r.final, null);
  assert.equal((await call('submit', { method: 'POST', body: { secret: a.secret, stage: 'portal', answers: pa } })).status, 409);
  r = (await call('submit', { method: 'POST', body: { secret: b.secret, stage: 'portal', answers: pb } })).data;
  assert.equal(r.stage, 'complete');
  assert.ok(r.final.final > 0 && r.final.final < 100);
  assert.equal(r.final.scales.length, 6);
  const aDone = (await call('state', { params: { secret: a.secret } })).data;
  assert.deepEqual(aDone.final, r.final);
  // The other party's raw answers are never exposed.
  assert.equal(JSON.stringify(aDone).includes('portal_answers'), false);

  // Non-match path
  const g = (await call('create', { method: 'POST', body: { name: '' } })).data;
  const gs = (await call('submit', { method: 'POST', body: { secret: g.secret, stage: 'quiz', answers: quiz('gold') } })).data;
  const o = (await call('join', { method: 'POST', body: { invite: gs.invite } })).data;
  const os = (await call('submit', { method: 'POST', body: { secret: o.secret, stage: 'quiz', answers: quiz('orange') } })).data;
  assert.equal(os.stage, 'not_matched'); assert.equal(os.match.score, 45);
  assert.equal((await call('state', { params: { secret: g.secret } })).data.stage, 'not_matched');
  assert.equal((await call('submit', { method: 'POST', body: { secret: g.secret, stage: 'portal', answers: portal(() => 3) } })).status, 403);

  console.log('API e2e: all assertions passed');
} finally {
  server.kill();
  rmSync(dir, { recursive: true, force: true });
}
