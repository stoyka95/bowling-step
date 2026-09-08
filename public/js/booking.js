/* =========================================================
   Bowling bar Step — DEMO rezervační flow
   ---------------------------------------------------------
   POZOR: Jde o čistě frontendovou ukázku. Data se NEODESÍLAJÍ
   na žádný server — po potvrzení se pouze vypíšou do konzole
   ve tvaru, který odpovídá budoucímu API požadavku.
   Napojení na reálný rezervační systém stačí doplnit do
   funkce submitReservation() níže.
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('booking-form');
  if (!form) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Konfigurace provozu (zdroj: content audit) ---------- */
  var CONFIG = {
    openHour: 14,          // otevřeno denně od 14:00
    lastStartHour: 24,     // poslední možný start hry
    lanes: 3,              // 3 dráhy Vollmer
    playersPerLane: 6,     // max 6 hráčů na dráhu
    priceDay: 360,         // 14:00–17:00 Kč / dráha / 60 min
    priceEvening: 450,     // 17:00–01:00 Kč / dráha / 60 min
    eveningFrom: 17
  };

  var state = { datum: '', cas: '', drahy: 1, hraci: 4, delka: 2, doplnky: [] };

  var steps = Array.prototype.slice.call(form.querySelectorAll('.step'));
  var LAST_INPUT_STEP = 5;      // krok 5 = shrnutí, krok 6 = potvrzení
  var currentStep = 1;

  var progressBar = document.getElementById('progress-bar');
  var progress = document.getElementById('progress');
  var stepLabel = document.querySelector('.wizard__step-label');
  var btnBack = document.getElementById('btn-back');
  var btnNext = document.getElementById('btn-next');
  var nav = document.getElementById('wizard-nav');

  /* ---------- Krok 1: datum + časové sloty ---------- */
  var dateInput = document.getElementById('datum');
  var today = new Date();
  var iso = function (d) { return d.toISOString().slice(0, 10); };
  dateInput.min = iso(today);
  dateInput.value = iso(today);
  state.datum = dateInput.value;

  var slotsWrap = document.getElementById('cas-slots');

  function slotLabel(h) { return (h % 24 < 10 ? '0' : '') + (h % 24) + ':00'; }

  /* Demo dostupnost: deterministicky "obsazené" sloty podle data,
     aby ukázka působila jako živý rezervační systém. */
  function isSoldOut(dateStr, hour) {
    var seed = 0;
    for (var i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 9973;
    return ((seed + hour * 7) % 11) < 2;
  }

  function renderSlots() {
    slotsWrap.innerHTML = '';
    state.cas = '';
    for (var h = CONFIG.openHour; h <= CONFIG.lastStartHour; h++) {
      var label = slotLabel(h);
      var out = isSoldOut(state.datum, h);
      var el = document.createElement('label');
      el.className = 'chip' + (out ? ' chip--soldout' : '');
      el.innerHTML = '<input type="radio" name="cas" value="' + label + '"' +
        (out ? ' disabled' : '') + ' aria-label="Začátek v ' + label + (out ? ', obsazeno' : '') + '"><span>' + label + '</span>';
      slotsWrap.appendChild(el);
    }
  }
  renderSlots();

  dateInput.addEventListener('change', function () {
    state.datum = dateInput.value;
    renderSlots();
  });
  slotsWrap.addEventListener('change', function (e) {
    if (e.target.name === 'cas') {
      state.cas = e.target.value;
      clearError('cas');
    }
  });

  /* ---------- Krok 2: countery ---------- */
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function syncCounters() {
    document.getElementById('drahy').textContent = String(state.drahy);
    document.getElementById('hraci').textContent = String(state.hraci);
    document.querySelectorAll('[data-counter]').forEach(function (btn) {
      var key = btn.dataset.counter;
      var delta = Number(btn.dataset.delta);
      var max = key === 'drahy' ? CONFIG.lanes : CONFIG.lanes * CONFIG.playersPerLane;
      var next = state[key] + delta;
      btn.disabled = next < 1 || next > max;
    });
  }
  form.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-counter]');
    if (!btn) return;
    var key = btn.dataset.counter;
    var max = key === 'drahy' ? CONFIG.lanes : CONFIG.lanes * CONFIG.playersPerLane;
    state[key] = clamp(state[key] + Number(btn.dataset.delta), 1, max);
    if (key === 'hraci' && state.hraci <= state.drahy * CONFIG.playersPerLane) clearError('hraci');
    syncCounters();
  });
  syncCounters();

  document.getElementById('delka').addEventListener('change', function (e) {
    state.delka = Number(e.target.value);
  });

  /* ---------- Cena ---------- */
  function priceFor(startLabel, hours, lanes) {
    var start = parseInt(startLabel.slice(0, 2), 10);
    if (start < CONFIG.openHour) start += 24; // 00:00 = 24
    var total = 0;
    for (var i = 0; i < hours; i++) {
      var h = start + i;
      total += (h >= CONFIG.eveningFrom ? CONFIG.priceEvening : CONFIG.priceDay);
    }
    return total * lanes;
  }
  function czk(n) { return n.toLocaleString('cs-CZ') + ' Kč'; }

  /* ---------- Validace ---------- */
  function setError(id, on) {
    var field = document.getElementById(id + '-error');
    if (!field) return;
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('field--error', !!on);
  }
  function clearError(id) { setError(id, false); }

  function validateStep(n) {
    var ok = true;
    if (n === 1) {
      var validDate = !!dateInput.value && dateInput.value >= dateInput.min;
      setError('datum', !validDate); if (!validDate) ok = false;
      setError('cas', !state.cas); if (!state.cas) ok = false;
    }
    if (n === 2) {
      var fits = state.hraci <= state.drahy * CONFIG.playersPerLane;
      setError('hraci', !fits); if (!fits) ok = false;
    }
    if (n === 4) {
      var jmeno = document.getElementById('jmeno');
      var telefon = document.getElementById('telefon');
      var email = document.getElementById('email');
      var jmenoOk = jmeno.value.trim().length >= 2;
      var telOk = /^[+]?[\d\s()-]{9,}$/.test(telefon.value.trim());
      var mailOk = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.value.trim());
      setError('jmeno', !jmenoOk); setError('telefon', !telOk); setError('email', !mailOk);
      ok = jmenoOk && telOk && mailOk;
      if (!ok) (jmenoOk ? (telOk ? email : telefon) : jmeno).focus();
    }
    return ok;
  }

  /* ---------- Shrnutí ---------- */
  function collect() {
    state.doplnky = Array.prototype.slice
      .call(form.querySelectorAll('input[name="doplnky"]:checked'))
      .map(function (i) { return i.value; });
    return {
      datum: state.datum,
      cas: state.cas,
      delkaHodin: state.delka,
      pocetDrah: state.drahy,
      pocetHracu: state.hraci,
      doplnkoveSluzby: state.doplnky,
      kontakt: {
        jmeno: document.getElementById('jmeno').value.trim(),
        telefon: document.getElementById('telefon').value.trim(),
        email: document.getElementById('email').value.trim(),
        poznamka: document.getElementById('poznamka').value.trim()
      },
      orientacniCenaKc: priceFor(state.cas, state.delka, state.drahy)
    };
  }

  function formatDate(value) {
    var d = new Date(value + 'T12:00:00');
    return d.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderSummary() {
    var data = collect();
    var dl = document.getElementById('summary-list');
    var rows = [
      ['Termín', formatDate(data.datum)],
      ['Začátek', data.cas + ' · ' + data.delkaHodin + ' h'],
      ['Dráhy', data.pocetDrah + '×'],
      ['Hráči', String(data.pocetHracu)],
      ['Doplňky', data.doplnkoveSluzby.length ? data.doplnkoveSluzby.join(', ') : 'žádné'],
      ['Jméno', data.kontakt.jmeno],
      ['Telefon', data.kontakt.telefon],
      ['E-mail', data.kontakt.email]
    ];
    if (data.kontakt.poznamka) rows.push(['Poznámka', data.kontakt.poznamka]);
    dl.innerHTML = rows.map(function (r) {
      return '<dt>' + r[0] + '</dt><dd>' + escapeHtml(r[1]) + '</dd>';
    }).join('');
    document.getElementById('summary-total').textContent = czk(data.orientacniCenaKc);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Navigace mezi kroky ---------- */
  function goTo(n, back, focusHeading) {
    steps.forEach(function (s) {
      s.classList.remove('is-active', 'is-back');
    });
    var target = steps[n - 1];
    target.classList.add('is-active');
    if (back) target.classList.add('is-back');
    currentStep = n;

    var pct = Math.round(Math.min(n, LAST_INPUT_STEP) / LAST_INPUT_STEP * 100);
    progressBar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
    if (stepLabel) {
      stepLabel.innerHTML = n > LAST_INPUT_STEP
        ? 'Hotovo'
        : 'Krok <span id="step-now">' + n + '</span> z ' + LAST_INPUT_STEP;
    }

    btnBack.disabled = n === 1;
    btnNext.textContent = n === LAST_INPUT_STEP ? 'Odeslat rezervaci' : 'Pokračovat';
    nav.hidden = n > LAST_INPUT_STEP;

    if (focusHeading !== false) {
      var heading = target.querySelector('h3');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    }
  }

  btnNext.addEventListener('click', function () {
    if (!validateStep(currentStep)) return;
    if (currentStep === 4) renderSummary();
    if (currentStep === LAST_INPUT_STEP) { submitReservation(); return; }
    goTo(currentStep + 1, false);
  });
  btnBack.addEventListener('click', function () {
    if (currentStep > 1) goTo(currentStep - 1, true);
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); btnNext.click(); });
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); btnNext.click(); }
  });

  /* ---------- Odeslání (DEMO) ---------- */
  function submitReservation() {
    var data = collect();

    /* --- DEMO --- Zde by proběhlo volání reálného API, např.:
       fetch('/api/rezervace', { method: 'POST', headers: {'Content-Type':'application/json'},
                                 body: JSON.stringify(data) })
       V této ukázce pouze logujeme payload do konzole. */
    console.info('[DEMO] Rezervace by se odeslala s tímto payloadem:', data);

    document.getElementById('success-text').textContent =
      'Díky, ' + data.kontakt.jmeno.split(' ')[0] + '! Termín ' + formatDate(data.datum) +
      ' od ' + data.cas + ' držíme. Potvrzení pošleme na ' + data.kontakt.email + '.';

    btnNext.disabled = true;
    goTo(6, false);
    if (!reduceMotion) confetti();
    window.setTimeout(function () { btnNext.disabled = false; }, 600);
  }

  /* ---------- Konfety (lehké, čisté CSS/DOM) ---------- */
  function confetti() {
    var host = document.querySelector('.step[data-step="6"] .success');
    if (!host) return;
    var layer = document.createElement('div');
    layer.className = 'confetti';
    layer.setAttribute('aria-hidden', 'true');
    var colors = ['#C9A24B', '#E8D9B5', '#1F5D3C', '#F2EFE6'];
    for (var i = 0; i < 34; i++) {
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
      layer.appendChild(p);
    }
    host.appendChild(layer);
    window.setTimeout(function () { layer.remove(); }, 3600);
  }

  goTo(1, false, false);
})();
