/* Bowling bar Step — UI interakce
   Vanilla JS, bez závislostí. Vše respektuje prefers-reduced-motion. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header + floating CTA ---------- */
  var header = document.getElementById('site-header');
  var floating = document.getElementById('floating-cta');
  var hero = document.querySelector('.hero');

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-stuck', y > 40);
    if (floating) floating.classList.toggle('is-visible', y > (hero ? hero.offsetHeight * 0.6 : 400));
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobilní menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobilni-menu');

  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Zavřít menu');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otevřít menu');
    document.body.style.overflow = '';
    window.setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduceMotion ? 0 : 360);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') closeMenu(); else openMenu();
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
    });
  }

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  var revealables = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Aktivní položka navigace ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Jemný parallax v hero sekci ---------- */
  var heroVisual = document.querySelector('.hero__visual img');
  var heroGlow = document.querySelector('.hero__glow');
  if (heroVisual && !reduceMotion && window.matchMedia('(min-width: 900px)').matches) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroVisual.style.transform = 'translate3d(0,' + (y * -0.06) + 'px,0)';
        if (heroGlow) heroGlow.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Živý stav otevřeno / zavřeno (denně 14:00–01:00) ---------- */
  function isOpenNow(date) {
    var h = date.getHours();
    return h >= 14 || h < 1;
  }
  var openNow = isOpenNow(new Date());

  var status = document.getElementById('status');
  if (status) {
    document.getElementById('status-text').textContent = openNow
      ? 'Právě otevřeno — zavíráme v 01:00'
      : 'Právě zavřeno — otevíráme ve 14:00';
    status.classList.toggle('status--closed', !openNow);
    status.hidden = false;
  }

  var badgeText = document.getElementById('hero-badge-text');
  if (badgeText) {
    badgeText.textContent = openNow ? 'Právě otevřeno do 01:00' : 'Dnes otevíráme ve 14:00';
    document.getElementById('hero-badge').classList.toggle('is-closed', !openNow);
  }
  var rok = document.getElementById('rok');
  if (rok) rok.textContent = String(new Date().getFullYear());

  /* ---------- V rezervační sekci uvolnit spodní hranu sticky souhrnu ---------- */
  var bookingSection = document.getElementById('rezervace');
  if (bookingSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('is-booking-view', entries[0].isIntersecting);
    }, { rootMargin: '-30% 0px -20% 0px' }).observe(bookingSection);
  }

  /* ---------- Upozornění na ukázkový web (minimalizovatelné) ---------- */
  var demoFlag = document.getElementById('demo-flag');
  if (demoFlag) {
    var demoMin = document.getElementById('demo-flag-min');
    var demoOpen = document.getElementById('demo-flag-open');
    var STORE_KEY = 'bs-demo-flag';

    function readPref() {
      try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
    }
    function savePref(value) {
      try { window.localStorage.setItem(STORE_KEY, value); } catch (e) { /* private mode – nevadí */ }
    }
    function setDemoNote(minimized) {
      demoFlag.classList.toggle('is-min', minimized);
      demoOpen.hidden = !minimized;
      demoOpen.setAttribute('aria-expanded', String(!minimized));
      document.getElementById('demo-flag-panel').setAttribute('aria-hidden', String(minimized));
    }

    setDemoNote(readPref() === 'min');
    demoMin.addEventListener('click', function () { setDemoNote(true); savePref('min'); demoOpen.focus(); });
    demoOpen.addEventListener('click', function () { setDemoNote(false); savePref('open'); demoMin.focus(); });
  }

  /* ---------- Lightbox galerie ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var current = 0, lastFocused = null;

  function showItem(i) {
    current = (i + items.length) % items.length;
    var btn = items[current];
    var img = btn.querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt');
    lbCaption.textContent = btn.dataset.caption || '';
  }
  function openLightbox(i) {
    lastFocused = document.activeElement;
    showItem(i);
    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () { lightbox.hidden = true; }, reduceMotion ? 0 : 360);
    if (lastFocused) lastFocused.focus();
  }
  items.forEach(function (btn, i) { btn.addEventListener('click', function () { openLightbox(i); }); });
  if (lightbox) {
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', function () { showItem(current - 1); });
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', function () { showItem(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showItem(current - 1);
      if (e.key === 'ArrowRight') showItem(current + 1);
    });
  }
})();
