/* =====================================================
   BODA DANIEL & MÍRIAM  ·  res/js/main.js
   ===================================================== */

/* ══════════════════════
   CAROUSEL
══════════════════════ */
(function initCarousel() {
  const TOTAL       = 13;
  const BASE_URL    = 'https://raw.githubusercontent.com/danielymiriam/danielymiriam.github.io/refs/heads/main/res/img/';
  const INTERVAL_MS = 5000;   // ms between auto-advances
  const FADE_MS     = 1600;   // must match CSS transition duration

  const carouselEl  = document.getElementById('carousel');
  const dotsEl      = document.getElementById('carouselDots');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  let current      = 0;
  let transitioning = false;
  let timer        = null;

  // ── Build slides & dots ────────────────────────────
  const slides = [];
  const dots   = [];

  for (let i = 1; i <= TOTAL; i++) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const img = document.createElement('img');
    img.src     = `${BASE_URL}${i}.jpeg`;
    img.alt     = `Foto ${i} de Daniel y Míriam`;
    img.loading = i === 1 ? 'eager' : 'lazy';
    img.decoding = 'async';

    slide.appendChild(img);
    carouselEl.appendChild(slide);
    slides.push(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Foto ${i}`);
    dot.addEventListener('click', () => goTo(i - 1));
    dotsEl.appendChild(dot);
    dots.push(dot);
  }

  // ── Navigation ─────────────────────────────────────
  function activate(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + TOTAL) % TOTAL;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function goTo(index) {
    if (transitioning) return;
    transitioning = true;
    activate(index);
    setTimeout(() => { transitioning = false; }, FADE_MS);
  }

  function next() { goTo(current + 1); resetTimer(); }
  function prev() { goTo(current - 1); resetTimer(); }

  function startTimer() {
    timer = setInterval(() => goTo(current + 1), INTERVAL_MS);
  }
  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  // ── Init ───────────────────────────────────────────
  activate(0);   // show first slide immediately
  startTimer();

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); }
    if (e.key === 'ArrowRight') { next(); }
  });

  // Touch / swipe
  let touchStartX = 0;
  carouselEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  carouselEl.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 45) { dx > 0 ? next() : prev(); }
  }, { passive: true });

  // Pause on hover / focus
  carouselEl.addEventListener('mouseenter', () => clearInterval(timer));
  carouselEl.addEventListener('mouseleave', startTimer);
})();


/* ══════════════════════
   COUNTDOWN
══════════════════════ */
(function initCountdown() {
  // 7 Nov 2026 · 13:00 h CET (UTC+1 — winter time in Spain)
  const TARGET = new Date('2026-11-07T13:00:00+01:00');

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  function pad(n, len) { return String(n).padStart(len, '0'); }

  function animateTick(el, newVal) {
    if (el.textContent === newVal) return;
    el.style.transform = 'scale(.85)';
    el.style.opacity   = '.4';
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.textContent     = newVal;
        el.style.transform = '';
        el.style.opacity   = '';
        el.style.transition = 'transform .15s ease, opacity .15s ease';
      }, 80);
    });
  }

  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      [elDays, elHours, elMinutes, elSeconds].forEach(el => {
        el.textContent = el === elDays ? '000' : '00';
      });
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days    = Math.floor(totalSec / 86400);
    const hours   = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    animateTick(elDays,    pad(days,    3));
    animateTick(elHours,   pad(hours,   2));
    animateTick(elMinutes, pad(minutes, 2));
    animateTick(elSeconds, pad(seconds, 2));
  }

  tick();
  setInterval(tick, 1000);
})();


/* ══════════════════════
   SCROLL REVEAL
══════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // stagger siblings slightly
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay    = siblings.indexOf(entry.target) * 120;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();
