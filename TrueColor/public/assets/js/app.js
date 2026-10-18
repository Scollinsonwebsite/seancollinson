(() => {
  'use strict';

  const API = 'api/index.php';
  const app = document.getElementById('app');
  const COLOR_NAMES = { gold: 'Gold', blue: 'Blue', green: 'Green', orange: 'Orange' };
  const COLOR_BLURB = {
    gold: 'Dependable, organized and loyal. Gold values structure, tradition and keeping your word.',
    blue: 'Warm, empathetic and relationship-first. Blue values authenticity, harmony and connection.',
    green: 'Analytical, curious and independent. Green values competence, logic and fresh ideas.',
    orange: 'Spontaneous, bold and action-oriented. Orange values freedom, variety and living in the moment.'
  };
  const LIKERT = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } }
  };

  let pollTimer = null;
  const stopPoll = () => { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function api(action, { method = 'GET', params = {}, body } = {}) {
    const qs = new URLSearchParams({ a: action, ...params });
    const res = await fetch(`${API}?${qs}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    let data = {};
    try { data = await res.json(); } catch { /* non-JSON error */ }
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    return data;
  }

  function render(html, focus = true) {
    stopPoll();
    app.innerHTML = html;
    if (focus) { app.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
  }

  function showError(err, back) {
    render(`<div class="card"><h2>We hit a snag</h2><p class="error">${esc(err.message)}</p>
      <div class="row"><button class="btn" id="retry">Try again</button><a class="btn ghost" href="./">Start over</a></div></div>`);
    document.getElementById('retry').onclick = back;
  }

  const baseUrl = () => location.origin + location.pathname;

  // ---------- Entry ----------
  async function route() {
    const q = new URLSearchParams(location.search);
    try {
      if (q.get('join')) return await joinView(q.get('join'));
      const secret = q.get('s') || store.get('tc_secret');
      if (secret) {
        try { return await resume(secret); } catch (e) {
          if (!q.get('s')) store.del('tc_secret'); else throw e;
        }
      }
      landing();
    } catch (e) { showError(e, route); }
  }

  function landing() {
    render(`
      <section class="card">
        <h1>Are you two a match?</h1>
        <p class="lead">A guided, three-stage compatibility experience built on the four True Colors temperaments: Gold, Blue, Green and Orange.</p>
        <ol class="steps">
          <li><b>1</b><span><strong>You answer 10 questions</strong> and get your color profile.</span></li>
          <li><b>2</b><span><strong>Send a private link</strong> to the other person. They answer 10 counter-questions to see whether you are an initial match.</span></li>
          <li><b>3</b><span><strong>If you match, you both unlock the 50-question portal</strong> and receive a final compatibility score with a full breakdown.</span></li>
        </ol>
        <form id="startForm">
          <label for="name">Your first name (optional)</label>
          <input id="name" type="text" maxlength="40" autocomplete="given-name" placeholder="e.g. Sam">
          <p class="muted" style="margin-top:8px">No email or account needed. Your answers are never shown to the other person.</p>
          <button class="btn" type="submit">Start my 10 questions</button>
        </form>
      </section>`);
    document.getElementById('startForm').onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true;
      try {
        const { secret } = await api('create', { method: 'POST', body: { name: document.getElementById('name').value } });
        store.set('tc_secret', secret);
        history.replaceState(null, '', `?s=${secret}`);
        await resume(secret);
      } catch (err) { btn.disabled = false; showError(err, landing); }
    };
  }

  async function joinView(token) {
    const info = await api('invite', { params: { token } });
    if (info.taken || !info.ready) {
      return render(`<div class="card"><h2>${info.taken ? 'This invitation has already been used' : 'This invitation is not ready yet'}</h2>
        <p>${info.taken ? 'Each invitation link works for one person.' : 'Ask the sender to finish their first 10 questions, then try the link again.'}</p>
        <a class="btn" href="./">Start your own</a></div>`);
    }
    render(`
      <section class="card">
        <h1>${esc(info.inviter)} invited you</h1>
        <p class="lead">Answer 10 quick questions to see whether the two of you are an initial match. If you are, you will both unlock a deeper 50-question assessment.</p>
        <form id="joinForm">
          <label for="name">Your first name (optional)</label>
          <input id="name" type="text" maxlength="40" autocomplete="given-name">
          <p class="muted" style="margin-top:8px">${esc(info.inviter)} will never see your individual answers.</p>
          <button class="btn" type="submit">Begin</button>
        </form>
      </section>`);
    document.getElementById('joinForm').onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true;
      try {
        const { secret } = await api('join', { method: 'POST', body: { invite: token, name: document.getElementById('name').value } });
        store.set('tc_secret', secret);
        history.replaceState(null, '', `?s=${secret}`);
        await resume(secret);
      } catch (err) { btn.disabled = false; showError(err, () => joinView(token)); }
    };
  }

  // ---------- State machine ----------
  async function resume(secret) {
    const state = await api('state', { params: { secret } });
    store.set('tc_secret', secret);
    if (new URLSearchParams(location.search).get('s') !== secret) history.replaceState(null, '', `?s=${secret}`);
    show(secret, state);
  }

  function show(secret, st) {
    switch (st.stage) {
      case 'quiz': return runQuiz(secret, st);
      case 'waiting_partner': return waitingPartner(secret, st);
      case 'not_matched': return notMatched(st);
      case 'portal': return portalIntro(secret, st);
      case 'portal_waiting': return portalWaiting(secret, st);
      case 'complete': return complete(st);
      default: landing();
    }
  }

  function poll(secret, stageNow) {
    pollTimer = setInterval(async () => {
      try {
        const st = await api('state', { params: { secret } });
        if (st.stage !== stageNow) show(secret, st);
      } catch { /* keep trying */ }
    }, 8000);
  }

  // ---------- Quiz (stage 1 and 2) ----------
  async function runQuiz(secret, st) {
    const bank = st.role === 'A' ? 'quiz1' : 'quiz2';
    const { questions } = await api('questions', { params: { stage: bank } });
    const key = `tc_draft_${secret}_quiz`;
    let answers = [];
    try { answers = JSON.parse(store.get(key) || '[]'); } catch { answers = []; }
    let i = Math.min(answers.length, questions.length - 1);
    // Per-question option order is shuffled once per page load.
    const order = questions.map((q) => q.o.map((_, n) => n).sort(() => Math.random() - 0.5));

    const draw = () => {
      const q = questions[i];
      const pct = Math.round((i / questions.length) * 100);
      render(`
        <section class="card">
          <div class="meta"><span>${st.role === 'A' ? 'Your color quiz' : 'Match check'}</span><span>${i + 1} of ${questions.length}</span></div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
          <form id="qForm">
            <fieldset>
              <legend>${esc(q.q)}</legend>
              ${order[i].map((n) => `<label class="opt"><input type="radio" name="a" value="${q.o[n].c}" ${answers[i] === q.o[n].c ? 'checked' : ''}><span>${esc(q.o[n].t)}</span></label>`).join('')}
            </fieldset>
            <p class="error" id="err" hidden>Please choose an answer.</p>
            <div class="row">
              ${i > 0 ? '<button type="button" class="btn ghost" id="back">Back</button>' : ''}
              <button class="btn" type="submit">${i === questions.length - 1 ? 'See my result' : 'Next'}</button>
            </div>
          </form>
        </section>`);
      document.getElementById('qForm').onsubmit = async (e) => {
        e.preventDefault();
        const picked = new FormData(e.target).get('a');
        if (!picked) { document.getElementById('err').hidden = false; return; }
        answers[i] = picked;
        store.set(key, JSON.stringify(answers));
        if (i < questions.length - 1) { i++; return draw(); }
        const btn = e.target.querySelector('button[type=submit]'); btn.disabled = true;
        try {
          const next = await api('submit', { method: 'POST', body: { secret, stage: 'quiz', answers } });
          store.del(key);
          if (next.role === 'A') quizResultA(secret, next); else show(secret, next);
        } catch (err) { btn.disabled = false; showError(err, draw); }
      };
      const back = document.getElementById('back');
      if (back) back.onclick = () => { i--; draw(); };
    };
    draw();
  }

  function profileBars(profile) {
    return Object.keys(COLOR_NAMES).map((c) => `
      <div class="bar"><span class="c-${c}">${COLOR_NAMES[c]}</span>
        <div class="track" aria-hidden="true"><div class="fill f-${c}" style="width:${profile[c]}%"></div></div>
        <span>${profile[c]}%</span></div>`).join('');
  }

  function primaryBlock(st) {
    return `<p>${st.primary.map((c) => `<span class="chip ${c}">${COLOR_NAMES[c]}</span>`).join(' ')}</p>
      ${st.primary.map((c) => `<p>${COLOR_BLURB[c]}</p>`).join('')}`;
  }

  function quizResultA(secret, st) {
    if (st.stage !== 'waiting_partner') return show(secret, st);
    render(`
      <section class="card">
        <h2>Your color profile${st.name ? `, ${esc(st.name)}` : ''}</h2>
        ${primaryBlock(st)}
        ${profileBars(st.profile)}
      </section>`);
    app.insertAdjacentHTML('beforeend', inviteCard(secret, st));
    wireInvite(secret, st);
  }

  function inviteCard(secret, st) {
    const link = `${baseUrl()}?join=${st.invite}`;
    return `
      <section class="card" id="inviteCard">
        <h2>Send the invitation</h2>
        <p>Share this link with the person you want to compare with. It works for one person only.</p>
        <div class="link-box">
          <input type="text" readonly id="inviteLink" value="${esc(link)}" aria-label="Invitation link">
          <button class="btn" id="copy">Copy link</button>
          ${navigator.share ? '<button class="btn ghost" id="share">Share…</button>' : ''}
        </div>
        <div class="note"><strong>Save your own private link</strong> so you can come back to your result:
          <br><span style="word-break:break-all">${esc(baseUrl() + '?s=' + secret)}</span></div>
        <p class="muted">We will check in automatically once they finish.</p>
      </section>`;
  }

  function wireInvite(secret, st) {
    const link = `${baseUrl()}?join=${st.invite}`;
    const copy = document.getElementById('copy');
    copy.onclick = async () => {
      try { await navigator.clipboard.writeText(link); copy.textContent = 'Copied!'; }
      catch { document.getElementById('inviteLink').select(); copy.textContent = 'Press Ctrl/Cmd+C'; }
    };
    const share = document.getElementById('share');
    if (share) share.onclick = () => navigator.share({ title: 'True Colors Compatibility', text: 'Take this short compatibility quiz with me:', url: link }).catch(() => {});
    poll(secret, 'waiting_partner');
  }

  function waitingPartner(secret, st) {
    quizResultA(secret, st);
  }

  // ---------- Match outcome ----------
  function notMatched(st) {
    const m = st.match;
    render(`
      <section class="card">
        <h1>Not an initial match</h1>
        <div class="score">${m.score}<small>% match</small></div>
        <p>You needed ${m.threshold}% to move on to the 50-question portal. Different temperaments are not a verdict on a person or a relationship. This quick check only reads how your styles overlap today.</p>
        ${st.profile ? `<h3>Your profile</h3>${profileBars(st.profile)}` : ''}
        <div class="row"><a class="btn" href="./" id="again">Take it again with someone else</a></div>
      </section>`);
    document.getElementById('again').onclick = () => store.del('tc_secret');
  }

  function matchSummary(st) {
    return `<div class="score">${st.match.score}<small>% initial match</small></div>`;
  }

  function portalIntro(secret, st) {
    render(`
      <section class="card">
        <h1>You're a match</h1>
        ${matchSummary(st)}
        <p class="lead">${esc(st.role === 'A' ? (st.partner_name || 'Your invitee') : (st.partner_name || 'Your inviter'))} and you passed the initial check (${st.match.threshold}% needed). Now for the deeper portal.</p>
        <ul>
          <li>50 statements. Choose how much you agree with each.</li>
          <li>Answer honestly and quickly. There are no right answers.</li>
          <li>One statement per page. You can pause and come back on this device, but you cannot go back once you answer.</li>
          <li>Neither of you sees the other's answers, only the final scores.</li>
        </ul>
        <button class="btn" id="go">Begin the 50-question portal</button>
      </section>`);
    document.getElementById('go').onclick = () => runPortal(secret, st);
  }

  async function runPortal(secret, st) {
    const { questions } = await api('questions', { params: { stage: 'portal' } });
    const key = `tc_draft_${secret}_portal`;
    let answers = [];
    try { answers = JSON.parse(store.get(key) || '[]'); } catch { answers = []; }
    let i = Math.min(answers.length, questions.length - 1);

    const draw = () => {
      const pct = Math.round((i / questions.length) * 100);
      render(`
        <section class="card">
          <div class="meta"><span>Compatibility portal</span><span>${i + 1} of ${questions.length}</span></div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
          <form id="pForm">
            <fieldset>
              <legend>${esc(questions[i].t)}</legend>
              <div class="likert">
                ${LIKERT.map((l, n) => `<label class="opt"><input type="radio" name="a" value="${n + 1}"><span>${l}</span></label>`).join('')}
              </div>
            </fieldset>
            <p class="error" id="err" hidden>Please choose an answer.</p>
            <button class="btn" type="submit">${i === questions.length - 1 ? 'Finish' : 'Next'}</button>
          </form>
        </section>`);
      document.getElementById('pForm').onsubmit = async (e) => {
        e.preventDefault();
        const v = new FormData(e.target).get('a');
        if (!v) { document.getElementById('err').hidden = false; return; }
        answers[i] = Number(v);
        store.set(key, JSON.stringify(answers));
        if (i < questions.length - 1) { i++; return draw(); }
        const btn = e.target.querySelector('button[type=submit]'); btn.disabled = true;
        try {
          const next = await api('submit', { method: 'POST', body: { secret, stage: 'portal', answers } });
          store.del(key);
          show(secret, next);
        } catch (err) { btn.disabled = false; showError(err, draw); }
      };
    };
    draw();
  }

  function portalWaiting(secret, st) {
    render(`
      <section class="card">
        <h1>You're done</h1>
        <p class="lead">Your answers are in. We'll reveal the final compatibility score as soon as ${esc(st.partner_name || 'the other person')} finishes.</p>
        <p class="muted">Keep your private link, or leave this page open. It updates by itself.</p>
        <div class="note" style="word-break:break-all">${esc(baseUrl() + '?s=' + secret)}</div>
      </section>`);
    poll(secret, 'portal_waiting');
  }

  function complete(st) {
    const f = st.final;
    render(`
      <section class="card">
        <h1>Your compatibility</h1>
        <div class="score">${f.final}<small>%</small></div>
        <p><span class="chip blue">${esc(f.band)}</span></p>
        <p class="muted">Blend of the 50-question portal (${f.portal}%) and your initial color match (${f.match}%).</p>
        ${f.low_variation ? '<div class="note">One of you chose almost the same answer all the way through. Treat this score as less reliable.</div>' : ''}
      </section>
      <section class="card">
        <h2>Where you align</h2>
        ${f.scales.map((s) => `
          <div class="bar" style="grid-template-columns:1fr 44px"><span>${esc(s.label)}</span><span>${s.score}%</span></div>
          <div class="track" style="height:12px;border-radius:99px;background:var(--line);overflow:hidden;margin-bottom:12px"><div class="fill f-blue" style="width:${s.score}%"></div></div>`).join('')}
        <p class="muted">Lower scores point to topics worth a kind, curious conversation, not a deal-breaker.</p>
      </section>
      ${st.profile ? `<section class="card"><h2>Your color profile</h2>${primaryBlock(st)}${profileBars(st.profile)}</section>` : ''}
      <p><a class="btn ghost" href="./" id="new">Start a new comparison</a></p>`);
    document.getElementById('new').onclick = () => store.del('tc_secret');
  }

  route();
})();
