// E-book opt-in: posts to /forms/ebook.php and, on success, shows the
// thank-you panel with the download button. No third-party scripts.
(function () {
  var form = document.querySelector('form[data-ebook]');
  if (!form) return;
  var stamp = form.querySelector('[data-timestamp]');
  if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));
  var status = form.querySelector('[data-status]');
  var thanks = document.querySelector('[data-ebook-thanks]');

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
    setError('first_name', first ? '' : 'Enter your first name.');
    setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.');
    if (!first) { form.first_name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.focus(); return; }

    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    say('', '');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(function (res) { return res.json().catch(function () { return { ok: false }; }); })
      .then(function (data) {
        if (data && data.ok && data.download) {
          var link = thanks.querySelector('[data-download]');
          link.href = data.download;
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
