// Ask Sean form: posts to /forms/ask.php and, on success, replaces the form with
// the confirmation message. No third-party scripts.
(function () {
  var form = document.querySelector('form[data-ask]');
  if (!form) return;
  var stamp = form.querySelector('[data-timestamp]');
  if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));
  var status = form.querySelector('[data-status]');
  var thanks = document.querySelector('[data-ask-thanks]');

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
    var checks = [
      ['first_name', form.first_name.value.trim() ? '' : 'Enter a first name or a nickname.'],
      ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()) ? '' : 'Enter a valid email address.'],
      ['stage', form.stage.value ? '' : 'Choose where you are in it.'],
      ['situation', form.situation.value.trim() ? '' : 'Tell Sean the situation in a few lines.'],
      ['consent', form.consent.checked ? '' : 'Please confirm you understand how Ask Sean works.'],
    ];
    var firstBad = null;
    checks.forEach(function (c) { setError(c[0], c[1]); if (c[1] && !firstBad) firstBad = c[0]; });
    if (firstBad) { form.querySelector('[name="' + firstBad + '"]').focus(); return; }

    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    say('', '');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(function (res) { return res.json().catch(function () { return { ok: false }; }); })
      .then(function (data) {
        if (data && data.ok) {
          form.hidden = true;
          thanks.hidden = false;
          thanks.focus();
          return;
        }
        var errs = (data && data.errors) || {};
        Object.keys(errs).forEach(function (k) { setError(k, errs[k]); });
        say('error', (data && data.message) || 'Something went wrong. Please try again in a moment.');
      })
      .catch(function () { say('error', 'A connection problem stopped the request. Please check your connection and try again.'); })
      .then(function () { button.disabled = false; button.textContent = label; });
  });
})();
