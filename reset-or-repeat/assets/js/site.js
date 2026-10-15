(() => {
  const header = document.getElementById('site-header');
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');

  // Header turns solid after the hero starts to scroll away
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (open) header.classList.add('is-solid');
    else onScroll();
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Current-page state follows the section in view
  const links = [...nav.querySelectorAll('a')];
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = map.get(en.target.id);
      if (a) a.setAttribute('aria-current', 'page');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'book', 'speaking', 'audiobook', 'podcast', 'masterclass', 'challenge', 'about', 'contact']
    .forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

  // Waveforms: deterministic bars so the layout never shifts between loads
  const bars = 56;
  document.querySelectorAll('.player').forEach((p, n) => {
    const wave = p.querySelector('.wave');
    let s = 11 + n * 17;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < bars; i++) {
      const b = document.createElement('i');
      const env = 0.35 + 0.65 * Math.abs(Math.sin((i / bars) * Math.PI * (2 + n)));
      b.style.height = `${Math.round(18 + 82 * env * (0.45 + rnd() * 0.55))}%`;
      wave.appendChild(b);
    }
  });

  // Audio previews. No audio files are wired up yet, so Play says so instead of faking playback.
  // To enable: add data-src="assets/audio/introduction.mp3" to the matching .player in index.html.
  const toast = document.getElementById('toast');
  let current = null;
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const stop = (p) => {
    if (!p || !p._audio) return;
    p._audio.pause();
    p.classList.remove('is-playing');
    p.querySelector('.player__play use').setAttribute('href', '#i-play');
  };
  document.querySelectorAll('.player').forEach((p) => {
    const btn = p.querySelector('.player__play');
    const bar = p.querySelectorAll('.wave i');
    const now = p.querySelector('.now');
    btn.addEventListener('click', () => {
      const src = p.dataset.src;
      if (!src) {
        toast.hidden = false;
        clearTimeout(toast._t);
        toast._t = setTimeout(() => { toast.hidden = true; }, 3200);
        return;
      }
      if (current && current !== p) stop(current);
      if (!p._audio) {
        p._audio = new Audio(src);
        p._audio.addEventListener('timeupdate', () => {
          const d = p._audio.duration || Number(p.dataset.duration) || 1;
          const upto = Math.floor((p._audio.currentTime / d) * bar.length);
          bar.forEach((b, i) => b.classList.toggle('on', i < upto));
          now.textContent = fmt(p._audio.currentTime);
        });
        p._audio.addEventListener('ended', () => stop(p));
      }
      if (p._audio.paused) {
        p._audio.play();
        p.classList.add('is-playing');
        btn.querySelector('use').setAttribute('href', '#i-pause');
        current = p;
      } else stop(p);
    });
  });

  // Previous / next buttons scroll the preview row when it overflows (tablet and phone)
  const row = document.getElementById('players');
  document.querySelectorAll('[data-scroll]').forEach((b) => {
    b.addEventListener('click', () => {
      row.scrollBy({ left: Number(b.dataset.scroll) * (row.clientWidth * 0.8), behavior: 'smooth' });
    });
  });
})();
