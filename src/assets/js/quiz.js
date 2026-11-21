// Narcissist or Negotiator? quiz. One question per screen, answers shuffled on
// every load, scoring in the browser only. Answers are never sent or stored;
// the only request is the email gate (first name and email) to forms/ebook.php.
(function () {
  var root = document.querySelector('[data-quiz]');
  var dataEl = document.getElementById('quiz-data');
  if (!root || !dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var Q = data.questions;
  var GATE_KEY = 'sc_quiz_gate';

  var hero = root.querySelector('[data-quiz-hero]');
  var screens = {};
  root.querySelectorAll('[data-screen]').forEach(function (el) { screens[el.getAttribute('data-screen')] = el; });
  var form = root.querySelector('[data-quiz-gate]');
  var answersBox = root.querySelector('[data-answers]');
  var legend = root.querySelector('[data-q-scenario]');
  var titleEl = root.querySelector('[data-q-title]');
  var countEl = root.querySelector('[data-count]');
  var progress = root.querySelector('[data-progress]');
  var nextBtn = root.querySelector('[data-next]');
  var backBtn = root.querySelector('[data-back]');
  var tpl = root.querySelector('[data-answer-template]');

  var order = [];    // order[q] = display order of answer indexes for question q
  var chosen = [];   // chosen[q] = index into Q[q].answers, or undefined
  var current = 0;

  function randInt(n) {
    if (window.crypto && window.crypto.getRandomValues) {
      var a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0] % n;
    }
    return Math.floor(Math.random() * n);
  }
  // Shuffle the 4 answers, never in the draft's scoring order or its exact reverse.
  function shuffled(n) {
    var idx, i, j, t, key;
    do {
      idx = []; for (i = 0; i < n; i++) idx.push(i);
      for (i = n - 1; i > 0; i--) { j = randInt(i + 1); t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
      key = idx.join('');
    } while (key === '0123' || key === '3210');
    return idx;
  }
  function reset() {
    order = Q.map(function (q) { return shuffled(q.answers.length); });
    chosen = [];
    current = 0;
  }

  function gatePassed() { try { return sessionStorage.getItem(GATE_KEY) === '1'; } catch (e) { return false; } }
  function markGate() { try { sessionStorage.setItem(GATE_KEY, '1'); } catch (e) { /* private mode: gate shows again next load */ } }

  function scrollToQuiz() {
    var header = document.querySelector('.site-header');
    var offset = header ? header.getBoundingClientRect().height : 0;
    var top = root.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' }); // jump, do not animate, between screens
  }
  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
    hero.hidden = name !== 'intro'; // the email screen carries its own copy of the title
    if (name !== 'intro') { root.querySelectorAll('[data-quiz-video]').forEach(function (v) { if (!v.paused) v.pause(); }); }
    var el = screens[name];
    if (name !== 'intro') { scrollToQuiz(); }
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }

  // ── Question screen ─────────────────────────────────────────────────────
  function renderQuestion() {
    var q = Q[current];
    countEl.textContent = 'Question ' + (current + 1) + ' of ' + Q.length;
    progress.style.width = ((current + 1) / Q.length * 100) + '%';
    titleEl.textContent = q.title;
    legend.textContent = q.scenario;
    backBtn.hidden = current === 0;
    answersBox.querySelectorAll('.quiz-answer').forEach(function (n) { n.remove(); });
    order[current].forEach(function (ai, pos) {
      var node = tpl.content.firstElementChild.cloneNode(true);
      var input = node.querySelector('input');
      input.id = 'quiz-a-' + current + '-' + pos;
      input.value = String(ai);
      node.setAttribute('for', input.id);
      node.querySelector('.quiz-answer__text').textContent = q.answers[ai].text;
      if (chosen[current] === ai) { input.checked = true; node.classList.add('is-selected'); }
      input.addEventListener('change', function () {
        chosen[current] = ai;
        answersBox.querySelectorAll('.quiz-answer').forEach(function (n) { n.classList.toggle('is-selected', n === node); });
        nextBtn.disabled = false;
      });
      answersBox.appendChild(node);
    });
    nextBtn.disabled = chosen[current] === undefined;
    show('question');
  }

  nextBtn.addEventListener('click', function () {
    if (chosen[current] === undefined) return;
    if (current < Q.length - 1) { current++; renderQuestion(); return; }
    show('calculating');
    setTimeout(showResults, 1200);
  });
  backBtn.addEventListener('click', function () {
    if (current > 0) { current--; renderQuestion(); }
  });

  // ── Results ─────────────────────────────────────────────────────────────
  function showResults() {
    var total = 0;
    Q.forEach(function (q, i) { total += q.answers[chosen[i]].value; });
    var band = data.bands.filter(function (b) { return total >= b.min && total <= b.max; })[0];
    var r = screens.results;
    r.querySelectorAll('[data-band-result]').forEach(function (el) { el.hidden = Number(el.getAttribute('data-band-result')) !== band.n; });
    r.querySelectorAll('[data-band-only]').forEach(function (el) { el.hidden = Number(el.getAttribute('data-band-only')) !== band.n; });
    r.querySelectorAll('[data-band-not]').forEach(function (el) { el.hidden = Number(el.getAttribute('data-band-not')) === band.n; });
    var abs = Math.abs(total);
    var neg = total < 0;
    r.querySelector('[data-sentence]').textContent = total === 0
      ? 'Your answers landed at 0, in the ' + band.name + ' zone, right in the middle.'
      : 'Your answers landed at ' + (neg ? 'minus ' : 'plus ') + abs + ' toward ' + (neg ? 'narcissist' : 'hostage negotiator') +
        ' thinking, in the ' + band.name + ' zone, ' + abs + (abs === 1 ? ' point' : ' points') + ' from the middle.';
    var marker = r.querySelector('[data-marker]');
    r.querySelector('[data-marker-score]').textContent = total === 0 ? '0' : (neg ? '-' : '+') + abs;
    r.setAttribute('data-score', String(total));
    r.setAttribute('data-band', String(band.n));
    marker.style.transition = 'none';
    marker.style.left = '50%';
    show('results');
    // Let the browser paint the middle position, then animate to the score.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        marker.style.transition = '';
        marker.style.left = ((total + 50) / 100 * 100) + '%';
      });
    });
  }

  root.querySelector('[data-restart]').addEventListener('click', function () {
    reset();
    renderQuestion();
  });

  // ── Start and email gate ────────────────────────────────────────────────
  root.querySelector('[data-quiz-start]').addEventListener('click', function () {
    if (gatePassed()) { renderQuestion(); return; }
    var stamp = form.querySelector('[data-timestamp]');
    stamp.value = String(Math.floor(Date.now() / 1000));
    show('gate');
    var first = form.querySelector('input[name="first_name"]');
    if (first) first.focus({ preventScroll: true });
  });

  var status = form.querySelector('[data-status]');
  function setError(name, msg) {
    var input = form.querySelector('[name="' + name + '"]');
    var err = input && document.getElementById(input.id + '-error');
    if (!input || !err) return;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg || '';
    err.hidden = !msg;
  }
  function say(type, msg) {
    status.className = 'form__status' + (type ? ' is-' + type : '');
    status.textContent = '';
    if (msg) { var p = document.createElement('p'); p.textContent = msg; status.appendChild(p); }
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = form.first_name.value.trim();
    var email = form.email.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError('first_name', first ? '' : 'Enter your first name.');
    setError('email', emailOk ? '' : 'Enter a valid email address.');
    if (!first) { form.first_name.focus(); return; }
    if (!emailOk) { form.email.focus(); return; }
    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    say('', '');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(function (res) { return res.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        if (res && res.ok) { markGate(); renderQuestion(); return; }
        var errs = (res && res.errors) || {};
        Object.keys(errs).forEach(function (k) { setError(k, errs[k]); });
        say('error', (res && res.message) || 'Something went wrong. Please try again in a moment.');
      })
      .catch(function () { say('error', 'A connection problem stopped the request. Please check your connection and try again.'); })
      .then(function () { button.disabled = false; button.textContent = label; });
  });

  reset();
})();
