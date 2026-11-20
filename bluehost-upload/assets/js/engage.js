// Engagement pop-up: once per browser session, after 15 seconds on a page.
// Not loaded on /contact/ or /think-like-a-hostage-negotiator/ (see layout()).
// A small non-blocking card in the lower corner; never a second form.
(function () {
  var KEY = 'sc_engage_seen';
  var store = {
    get: function () { try { return window.sessionStorage.getItem(KEY); } catch (e) { return '1'; } },
    set: function () { try { window.sessionStorage.setItem(KEY, '1'); } catch (e) {} },
  };
  if (store.get()) return;

  var css = '' +
    '.engage{position:fixed;z-index:60;right:20px;bottom:20px;width:min(360px,calc(100vw - 32px));background:#0c2244;color:#fff;border-radius:14px;border:1px solid rgba(225,198,144,.45);box-shadow:0 24px 60px -20px rgba(0,0,0,.6);padding:22px 22px 20px;font-family:inherit}' +
    '.engage[hidden]{display:none}' +
    '.engage__title{margin:0 36px 8px 0;font-size:1.25rem;line-height:1.25;font-weight:800;color:#e1c690;letter-spacing:-.01em}' +
    '.engage__body{margin:0 0 16px;font-size:.98rem;line-height:1.55;color:rgba(255,255,255,.88)}' +
    '.engage__actions{display:flex;flex-direction:column;gap:10px}' +
    '.engage__btn{display:block;text-align:center;padding:12px 16px;border-radius:999px;font-weight:700;font-size:.95rem;text-decoration:none;line-height:1.2}' +
    '.engage__btn--primary{background:linear-gradient(135deg,#c9a463,#a8844c);color:#0c2244}' +
    '.engage__btn--primary:hover{background:linear-gradient(135deg,#d6b373,#b8945a);color:#0c2244;text-decoration:none}' +
    '.engage__btn--secondary{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55)}' +
    '.engage__btn--secondary:hover{box-shadow:inset 0 0 0 1.5px #fff;color:#fff;text-decoration:none}' +
    '.engage__close{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:#fff;font-size:1.6rem;line-height:1;cursor:pointer}' +
    '.engage__close:hover{background:rgba(255,255,255,.12)}' +
    '.engage a:focus-visible,.engage button:focus-visible{outline:3px solid #e1c690;outline-offset:2px}' +
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
      '<p class="engage__title" id="engage-title">Are you still there?</p>' +
      '<p class="engage__body" id="engage-body">If you would like a free consultation, reach out now. Send the contact form and we will get back to you, or tap to call and talk it through.</p>' +
      '<div class="engage__actions">' +
      '<a class="engage__btn engage__btn--primary" href="/contact/#contact-form-title">Send the Contact Form</a>' +
      '<a class="engage__btn engage__btn--secondary" href="tel:+18184027500">Call (818) 402-7500</a>' +
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

  setTimeout(show, 15000);
})();
