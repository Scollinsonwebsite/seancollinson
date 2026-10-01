/* Mediation Office of S. Collinson: minimal, dependency-free behaviour.
   Menu, form validation and submission, lightweight video embeds, filters. */
(function () {
  'use strict';

  // ── Footer year ───────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // ── Header: transparent over the sky, solid once the page scrolls ─────────
  var header = document.querySelector('[data-header]');
  var setSolid = function () {
    if (!header) return;
    var open = header.querySelector('[data-menu-toggle]');
    var solid = window.scrollY > 24 || (open && open.getAttribute('aria-expanded') === 'true');
    header.classList.toggle('is-solid', Boolean(solid));
  };
  window.addEventListener('scroll', setSolid, { passive: true });
  setSolid();

  // ── Mobile menu ───────────────────────────────────────────────────────────
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    var focusables = function () {
      return [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])')));
    };
    var open = function () {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      setSolid();
      var first = menu.querySelector('a');
      if (first) first.focus();
      document.addEventListener('keydown', onKey);
    };
    var close = function (returnFocus) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      setSolid();
      document.removeEventListener('keydown', onKey);
      if (returnFocus) toggle.focus();
    };
    var onKey = function (e) {
      if (e.key === 'Escape') { close(true); return; }
      if (e.key !== 'Tab') return;
      var items = focusables();
      var firstEl = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') close(false); else open();
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    window.matchMedia('(min-width: 1180px)').addEventListener('change', function (mq) { if (mq.matches) close(false); });
  }

  // ── Forms ─────────────────────────────────────────────────────────────────
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function labelText(control) {
    var fieldset = control.closest('fieldset');
    if (control.type === 'radio' && fieldset) return fieldset.querySelector('legend').firstChild.textContent.trim();
    if (control.type === 'checkbox') return 'Consent';
    var label = control.form.querySelector('label[for="' + control.id + '"]');
    return label ? label.firstChild.textContent.trim() : control.name;
  }

  function errorEl(control) {
    var wrap = control.closest('.field');
    return wrap ? wrap.querySelector('.field__error') : null;
  }

  function setError(control, message) {
    var el = errorEl(control);
    var targets = control.type === 'radio' ? control.form.querySelectorAll('[name="' + control.name + '"]') : [control];
    Array.prototype.forEach.call(targets, function (t) {
      if (message) t.setAttribute('aria-invalid', 'true'); else t.removeAttribute('aria-invalid');
    });
    if (el) { el.textContent = message || ''; el.hidden = !message; }
  }

  function messageFor(c) {
    var form = c.form;
    var value = (c.value || '').trim();
    var name = labelText(c);
    if (c.type === 'radio') {
      return c.required && !form.querySelector('[name="' + c.name + '"]:checked') ? 'Choose your ' + name.toLowerCase() + '.' : '';
    }
    if (c.type === 'checkbox') return c.required && !c.checked ? 'Please confirm the consent statement before sending.' : '';
    if (c.required && !value) {
      return c.tagName === 'SELECT' ? 'Choose an option for ' + name.toLowerCase() + '.' : 'Enter your ' + name.toLowerCase() + '.';
    }
    if (value && c.type === 'email' && !EMAIL.test(value)) return 'Enter an email address in the format name@example.com.';
    if (value && c.type === 'tel' && !/^[0-9+().\-\s]{7,}$/.test(value)) return 'Enter a phone number using digits, spaces, and ( ) + - only.';
    if (c.maxLength > 0 && value.length > c.maxLength) return name + ' must be ' + c.maxLength + ' characters or fewer.';
    return '';
  }

  function validate(form) {
    var errors = [];
    var seenRadio = {};
    Array.prototype.forEach.call(form.elements, function (c) {
      if (!c.name || c.type === 'hidden' || c.closest('.hp') || c.tagName === 'BUTTON') return;
      if (c.type === 'radio') {
        if (seenRadio[c.name]) return;
        seenRadio[c.name] = true;
      }
      var msg = messageFor(c);
      setError(c, msg);
      if (msg) errors.push({ control: c, message: msg });
    });
    return errors;
  }

  function showSummary(form, errors) {
    var summary = form.querySelector('[data-error-summary]');
    var list = summary.querySelector('ul');
    list.innerHTML = '';
    errors.forEach(function (err) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var target = err.control.type === 'radio' ? form.querySelector('[name="' + err.control.name + '"]') : err.control;
      a.href = '#' + (target.id || '');
      a.textContent = err.message;
      a.addEventListener('click', function (e) { e.preventDefault(); target.focus(); });
      li.appendChild(a);
      list.appendChild(li);
    });
    summary.hidden = errors.length === 0;
    if (errors.length) summary.focus();
  }

  function setStatus(form, type, message) {
    var status = form.querySelector('[data-status]');
    status.className = 'form__status' + (type ? ' is-' + type : '');
    status.innerHTML = '';
    if (message) {
      var p = document.createElement('p');
      p.textContent = message;
      status.appendChild(p);
    }
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var stamp = form.querySelector('[data-timestamp]');
    if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));

    // Clear a field's error as soon as it is corrected (never add new errors
    // while someone is still typing).
    var clearIfFixed = function (e) {
      var c = e.target;
      if (!c.name || c.getAttribute('aria-invalid') !== 'true') return;
      if (!messageFor(c)) setError(c, '');
    };
    form.addEventListener('input', clearIfFixed);
    form.addEventListener('change', clearIfFixed);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.hasAttribute('data-disabled')) {
        setStatus(form, 'error', 'This form is not accepting submissions yet. Please check back soon.');
        return;
      }
      setStatus(form, '', '');
      var errors = validate(form);
      showSummary(form, errors);
      if (errors.length) return;

      var button = form.querySelector('button[type="submit"]');
      form.classList.add('is-sending');
      button.disabled = true;
      var original = button.textContent;
      button.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: false }; }).then(function (data) {
            return { status: res.status, data: data };
          });
        })
        .then(function (r) {
          if (r.data && r.data.ok) {
            form.reset();
            if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));
            setStatus(form, 'success', form.getAttribute('data-success'));
            form.querySelector('[data-status]').setAttribute('tabindex', '-1');
            form.querySelector('[data-status]').focus();
            return;
          }
          var serverErrors = (r.data && r.data.errors) || {};
          var mapped = Object.keys(serverErrors).map(function (name) {
            var c = form.querySelector('[name="' + name + '"]');
            if (c) setError(c, serverErrors[name]);
            return c ? { control: c, message: serverErrors[name] } : null;
          }).filter(Boolean);
          if (mapped.length) showSummary(form, mapped);
          setStatus(form, 'error', (r.data && r.data.message) || 'Your message could not be sent. Please try again in a few minutes, or use another way to reach the office listed on the contact page.');
        })
        .catch(function () {
          setStatus(form, 'error', 'Your message could not be sent because of a connection problem. Please check your connection and try again.');
        })
        .then(function () {
          form.classList.remove('is-sending');
          button.disabled = false;
          button.textContent = original;
        });
    });
  });

  // ── Lightweight video embeds (player loads only when activated) ──────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.video__play');
    if (!btn) return;
    var iframe = document.createElement('iframe');
    var src = btn.getAttribute('data-embed');
    iframe.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&rel=0';
    iframe.title = btn.getAttribute('data-title');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    btn.replaceWith(iframe);
    iframe.focus();
  });

  // ── Video filters ─────────────────────────────────────────────────────────
  var filters = document.querySelector('[data-filters]');
  if (filters) {
    var grid = document.querySelector('[data-video-grid]');
    var statusEl = document.querySelector('[data-filter-status]');
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      var cat = b.getAttribute('data-filter');
      filters.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var shown = 0;
      grid.querySelectorAll('.video').forEach(function (v) {
        var match = cat === 'all' || v.getAttribute('data-category') === cat;
        v.hidden = !match;
        if (match) shown++;
      });
      if (statusEl) statusEl.textContent = shown + (shown === 1 ? ' video' : ' videos') + ' shown';
    });
  }
})();
