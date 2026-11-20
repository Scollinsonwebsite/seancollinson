// Engagement pop-up: once per browser session, after 30 seconds on a page.
// Not loaded on /contact/ or /think-like-a-hostage-negotiator/ (see layout()).
// A small non-blocking white card in the lower corner; no form, no email field.
(function () {
  var KEY = 'sc_engage_seen';
  var store = {
    get: function () { try { return window.sessionStorage.getItem(KEY); } catch (e) { return '1'; } },
    set: function () { try { window.sessionStorage.setItem(KEY, '1'); } catch (e) {} },
  };
  if (store.get()) return;

  var css = '' +
    '.engage{position:fixed;z-index:60;right:20px;bottom:20px;width:min(380px,calc(100vw - 32px));background:#ffffff;color:#111111;border-radius:14px;border-top:6px solid #c9a463;box-shadow:0 26px 60px -12px rgba(0,0,0,.55),0 4px 14px rgba(0,0,0,.18);padding:20px 22px 20px;font-family:inherit}' +
    '.engage[hidden]{display:none}' +
    '.engage__brand{margin:0 36px 6px 0;font-size:.74rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8a6a35}' +
    '.engage__title{margin:0 36px 8px 0;font-size:1.45rem;line-height:1.2;font-weight:900;color:#000000;letter-spacing:-.015em}' +
    '.engage__body{margin:0 0 16px;font-size:1rem;line-height:1.55;color:#111111}' +
    '.engage__actions{display:flex;flex-direction:column;gap:10px}' +
    '.engage__btn{display:block;text-align:center;border-radius:999px;font-weight:800;text-decoration:none;line-height:1.2}' +
    '.engage__btn--call{background:#0c2244;color:#ffffff;border:2px solid #c9a463;font-size:1.2rem;padding:14px 18px}' +
    '.engage__btn--call:hover,.engage__btn--call:focus-visible{background:#dcc08a;color:#0c2244;text-decoration:none}' +
    '.engage__btn--book{background:#0c2244;color:#ffffff;border:2px solid #c9a463;font-size:.95rem;padding:9px 16px}' +
    '.engage__btn--book:hover,.engage__btn--book:focus-visible{background:#dcc08a;color:#0c2244;text-decoration:none}' +
    '.engage__close{position:absolute;top:12px;right:10px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:#111111;font-size:1.7rem;line-height:1;cursor:pointer}' +
    '.engage__close:hover{background:#f1f1f1}' +
    '.engage a:focus-visible,.engage button:focus-visible{outline:3px solid #c9a463;outline-offset:2px}' +
    '@media (max-width:480px){.engage{right:16px;left:16px;bottom:16px;width:auto}}' +
    '@media (prefers-reduced-motion:no-preference){.engage{animation:engage-in .35s ease-out}@keyframes engage-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}}';

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var card = document.createElement('div');
    card.className = 'engage';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'false');
    card.setAttribute('aria-labelledby', 'engage-title');
    card.setAttribute('aria-describedby', 'engage-body');
    card.innerHTML =
      '<button class="engage__close" type="button" aria-label="Close">&times;</button>' +
      '<p class="engage__brand">Sean Collinson, The Mediator</p>' +
      '<p class="engage__title" id="engage-title">Are you still there?</p>' +
      '<p class="engage__body" id="engage-body">Your consultation is free, and one call can change how this goes. Tap to call and talk it through right now, or download my free e-book on handling a high-conflict ex.</p>' +
      '<div class="engage__actions">' +
      '<a class="engage__btn engage__btn--call" href="tel:+18184027500">Call (818) 402-7500</a>' +
      '<a class="engage__btn engage__btn--book" href="https://seancollinson.com/think-like-a-hostage-negotiator/">Download the Free E-Book</a>' +
      '</div>';
    document.body.appendChild(card);

    function dismiss() {
      store.set();
      card.hidden = true;
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') dismiss(); }
    card.querySelector('.engage__close').addEventListener('click', dismiss);
    card.querySelectorAll('.engage__btn').forEach(function (a) { a.addEventListener('click', store.set); });
    document.addEventListener('keydown', onKey);
  }

  function busy() {
    // Do not stack on top of an open dialog (consultation request) or the mobile menu.
    if (document.querySelector('dialog[open]')) return true;
    var menu = document.querySelector('[data-menu]');
    return Boolean(menu && !menu.hidden);
  }

  function show() {
    if (store.get()) return;
    if (busy()) { setTimeout(show, 5000); return; }
    store.set(); // once per session, even if it is ignored
    build();
  }

  setTimeout(show, 30000);
})();
