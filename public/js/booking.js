/* =========================================================
   Bowling bar Step — booking grid (DEMO)
   ---------------------------------------------------------
   POZOR: Jde o čistě frontendovou ukázku. Data se NEODESÍLAJÍ
   na žádný server — po odeslání se pouze vypíšou do konzole
   ve tvaru, který odpovídá budoucímu API požadavku.

   Struktura souboru:
   - CONFIG        — provozní parametry (otvírací doba, ceník)
   - Availability   — mock zdroj dostupnosti drah (nahraditelné API)
   - state          — centralizovaný stav vybraných slotů
   - BookingCalendar, BookingGrid (LaneRow, TimeSlot), BookingSummary,
     BookingForm    — render funkce jednotlivých částí UI
   ========================================================= */
(function () {
  'use strict';

  var app = document.getElementById('booking-app');
  if (!app) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Konfigurace provozu ---------- */
  var CONFIG = {
    openHour: 14,        // první slot začíná ve 14:00
    lastStartHour: 24,   // poslední slot začíná ve 24:00 (= 00:00)
    lanes: [
      { id: 1, name: 'Dráha 1' },
      { id: 2, name: 'Dráha 2' },
      { id: 3, name: 'Dráha 3' }
    ],
    minHoursForToday: 4, // pod tolik zbývajících hodin se rovnou nabídne další den
    priceDay: 360,       // Kč / hod / dráha, 14:00–17:00
    priceEvening: 450,   // Kč / hod / dráha, 17:00–00:00
    eveningFrom: 17,
    daysAhead: 14         // kolik dní dopředu lze vybrat
  };

  var HOURS = [];
  for (var h = CONFIG.openHour; h <= CONFIG.lastStartHour; h++) HOURS.push(h);

  /* ---------- Mock dostupnost (odděleno od UI, snadné napojit API) ---------- */
  var Availability = (function () {
    function hash(str) {
      var s = 0;
      for (var i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
      return s;
    }
    // Deterministická, ale rozmanitá "obsazenost" podle data + dráhy + hodiny.
    function isBooked(dateStr, laneId, hour) {
      var s = hash(dateStr + '#' + laneId);
      return ((s + hour * 13 + laneId * 7) % 9) < 2;
    }
    return { isBooked: isBooked };
  })();

  /* ---------- Pomocné funkce ---------- */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function laneById(id) {
    for (var i = 0; i < CONFIG.lanes.length; i++) if (CONFIG.lanes[i].id === id) return CONFIG.lanes[i];
    return { id: id, name: 'Dráha ' + id };
  }
  function slotLabel(hour) { return pad2(hour % 24) + ':00'; }
  function priceForHour(hour) { return hour >= CONFIG.eveningFrom ? CONFIG.priceEvening : CONFIG.priceDay; }
  function czk(n) { return n.toLocaleString('cs-CZ') + ' Kč'; }
  function iso(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function formatDateHuman(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isPastSlot(dateStr, hour) {
    var now = new Date();
    var today = startOfToday();
    var d = new Date(dateStr + 'T00:00:00');
    if (d.getTime() < today.getTime()) return true;
    if (d.getTime() > today.getTime()) return false;
    return hour <= now.getHours();
  }

  /* ---------- Centralizovaný stav ---------- */
  var today = startOfToday();
  var dateList = [];
  for (var i = 0; i < CONFIG.daysAhead; i++) dateList.push(iso(addDays(today, i)));

  // Výchozí den: dnešek, ale jen dokud na něj zbývá co rezervovat.
  // Večer už je většina slotů v minulosti, takže se rovnou nabídne další den
  // (dnešek zůstává na jedno kliknutí vlevo).
  function bookableHoursLeft(dateStr) {
    var count = 0;
    for (var i = 0; i < HOURS.length; i++) if (!isPastSlot(dateStr, HOURS[i])) count++;
    return count;
  }
  var defaultDate = dateList[0];
  if (dateList.length > 1 && bookableHoursLeft(dateList[0]) < CONFIG.minHoursForToday) {
    defaultDate = dateList[1];
  }

  var state = {
    date: defaultDate,
    selected: {} // klíč "laneId-hour" -> { laneId, hour }
  };

  /* ---------- DOM reference ---------- */
  var datePrev = document.getElementById('date-prev');
  var dateNext = document.getElementById('date-next');
  var dateDays = document.getElementById('date-days');
  var grid = document.getElementById('booking-grid');
  var summaryDate = document.getElementById('summary-date');
  var summaryCompact = document.getElementById('summary-compact');
  var summaryToggle = document.getElementById('summary-toggle');
  var summaryBox = document.getElementById('booking-summary');
  var summaryEmpty = document.getElementById('summary-empty');
  var summaryLanes = document.getElementById('summary-lanes');
  var summaryTotal = document.getElementById('summary-total');
  var btnContinue = document.getElementById('btn-continue');

  var formPanel = document.getElementById('booking-form-panel');
  var formWrap = document.getElementById('booking-form-wrap');
  var btnFormBack = document.getElementById('btn-form-back');
  var form = document.getElementById('booking-form');
  var formSummaryDate = document.getElementById('form-summary-date');
  var formSummaryLanes = document.getElementById('form-summary-lanes');
  var formSummaryTotal = document.getElementById('form-summary-total');
  var successBox = document.getElementById('booking-success');

  /* ================= BookingCalendar ================= */
  function renderBookingCalendar() {
    dateDays.innerHTML = dateList.map(function (dateStr) {
      var d = new Date(dateStr + 'T12:00:00');
      var selected = dateStr === state.date;
      return '<button type="button" class="date-chip' + (selected ? ' is-selected' : '') + '" ' +
        'role="option" aria-selected="' + selected + '" data-date="' + dateStr + '">' +
        '<span class="date-chip__dow">' + d.toLocaleDateString('cs-CZ', { weekday: 'short' }) + '</span>' +
        '<span class="date-chip__num">' + d.getDate() + '</span>' +
        '<span class="date-chip__mon">' + d.toLocaleDateString('cs-CZ', { month: 'short' }) + '</span>' +
        '</button>';
    }).join('');

    var idx = dateList.indexOf(state.date);
    datePrev.disabled = idx <= 0;
    dateNext.disabled = idx >= dateList.length - 1;

    var activeChip = dateDays.querySelector('.date-chip.is-selected');
    if (activeChip) activeChip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function setDate(dateStr) {
    if (dateList.indexOf(dateStr) === -1) return;
    state.date = dateStr;
    state.selected = {};
    renderBookingCalendar();
    renderBookingGrid();
    renderBookingSummary();
  }

  dateDays.addEventListener('click', function (e) {
    var chip = e.target.closest('.date-chip');
    if (chip) setDate(chip.dataset.date);
  });
  datePrev.addEventListener('click', function () {
    var idx = dateList.indexOf(state.date);
    if (idx > 0) setDate(dateList[idx - 1]);
  });
  dateNext.addEventListener('click', function () {
    var idx = dateList.indexOf(state.date);
    if (idx < dateList.length - 1) setDate(dateList[idx + 1]);
  });

  /* ================= TimeSlot ================= */
  function slotStatus(laneId, hour) {
    if (isPastSlot(state.date, hour)) return 'past';
    if (state.selected[laneId + '-' + hour]) return 'selected';
    if (Availability.isBooked(state.date, laneId, hour)) return 'full';
    return 'free';
  }

  function renderTimeSlot(laneId, hour) {
    var status = slotStatus(laneId, hour);
    var price = priceForHour(hour);
    var disabled = status === 'full' || status === 'past';
    var body = status === 'full'
      ? '<span class="time-slot__note">Obsazeno</span>'
      : status === 'past'
        ? '<span class="time-slot__note">Minulé</span>'
        : '<span class="time-slot__price">' + price + ' Kč</span>';

    // Přístupné jméno musí obsahovat viditelný text tlačítka (WCAG 2.5.3),
    // proto se do něj cena / "obsazeno" / "minulé" propisuje doslova.
    var laneName = laneById(laneId).name;
    var stateText = status === 'full' ? 'obsazeno'
      : status === 'past' ? 'minulé'
      : (status === 'selected' ? 'vybráno, ' : 'volné, ') + price + ' Kč';
    var label = laneName + ', ' + slotLabel(hour) + '–' + slotLabel(hour + 1) + ', ' + stateText;

    return '<div class="time-slot time-slot--' + status + '">' +
      '<button type="button" class="time-slot__btn" data-lane="' + laneId + '" data-hour="' + hour + '"' +
      (disabled ? ' disabled' : '') +
      ' aria-pressed="' + (status === 'selected') + '"' +
      ' aria-label="' + escapeHtml(label) + '">' +
      body +
      '</button></div>';
  }

  /* ================= LaneRow ================= */
  function renderLaneRow(lane) {
    return '<div class="lane-row__label">' + escapeHtml(lane.name) + '</div>' +
      HOURS.map(function (hour) { return renderTimeSlot(lane.id, hour); }).join('');
  }

  /* ================= BookingGrid ================= */
  function renderBookingGrid() {
    var header = '<div class="booking-grid__corner"></div>' +
      HOURS.map(function (hour) { return '<div class="booking-grid__hour">' + slotLabel(hour) + '</div>'; }).join('');
    var rows = CONFIG.lanes.map(renderLaneRow).join('');
    grid.innerHTML = header + rows;
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.time-slot__btn');
    if (!btn || btn.disabled) return;
    var laneId = Number(btn.dataset.lane);
    var hour = Number(btn.dataset.hour);
    var key = laneId + '-' + hour;
    if (state.selected[key]) delete state.selected[key];
    else state.selected[key] = { laneId: laneId, hour: hour };
    renderBookingGrid();
    renderBookingSummary();
  });

  /* ================= BookingSummary ================= */
  function buildLaneSegments() {
    return CONFIG.lanes.map(function (lane) {
      var hours = Object.keys(state.selected)
        .map(function (k) { return state.selected[k]; })
        .filter(function (s) { return s.laneId === lane.id; })
        .map(function (s) { return s.hour; })
        .sort(function (a, b) { return a - b; });
      if (!hours.length) return null;

      var segments = [];
      var segStart = hours[0], prev = hours[0], segPrice = priceForHour(hours[0]);
      for (var i = 1; i < hours.length; i++) {
        var hh = hours[i], p = priceForHour(hh);
        if (hh === prev + 1 && p === segPrice) { prev = hh; }
        else { segments.push({ start: segStart, end: prev, price: segPrice }); segStart = hh; prev = hh; segPrice = p; }
      }
      segments.push({ start: segStart, end: prev, price: segPrice });

      return { lane: lane, segments: segments, hoursCount: hours.length };
    }).filter(Boolean);
  }

  function segmentTotal(seg) { return (seg.end - seg.start + 1) * seg.price; }

  function renderLaneSummaryHtml(laneData) {
    var rows = laneData.segments.map(function (seg) {
      var count = seg.end - seg.start + 1;
      return '<div class="summary-lane__row"><span>' + slotLabel(seg.start) + '–' + slotLabel(seg.end + 1) +
        ' · ' + count + ' × ' + seg.price + ' Kč</span><b>' + czk(segmentTotal(seg)) + '</b></div>';
    }).join('');
    return '<div><p class="summary-lane__title">' + escapeHtml(laneData.lane.name) + '</p>' + rows + '</div>';
  }

  function compactSummaryText(lanesData) {
    if (!lanesData.length) return 'Zatím nic nevybráno';
    var hours = lanesData.reduce(function (n, l) { return n + l.hoursCount; }, 0);
    var lanes = lanesData.map(function (l) { return l.lane.name; }).join(', ');
    return lanes + ' · ' + hours + '\u00A0h';
  }

  function renderBookingSummary() {
    summaryDate.textContent = formatDateHuman(state.date);
    var lanesData = buildLaneSegments();
    var hasSelection = lanesData.length > 0;

    if (summaryCompact) summaryCompact.textContent = compactSummaryText(lanesData);
    summaryEmpty.hidden = hasSelection;
    summaryLanes.innerHTML = hasSelection ? lanesData.map(renderLaneSummaryHtml).join('') : '';

    var total = lanesData.reduce(function (sum, laneData) {
      return sum + laneData.segments.reduce(function (s, seg) { return s + segmentTotal(seg); }, 0);
    }, 0);
    summaryTotal.textContent = czk(total);
    btnContinue.disabled = !hasSelection;
    if (!hasSelection && summaryBox) {
      summaryBox.classList.remove('is-expanded');
      if (summaryToggle) summaryToggle.setAttribute('aria-expanded', 'false');
    }

    return { lanesData: lanesData, total: total };
  }

  if (summaryToggle) {
    summaryToggle.addEventListener('click', function () {
      var open = summaryBox.classList.toggle('is-expanded');
      summaryToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ================= BookingForm ================= */
  function showFormPanel() {
    var data = renderBookingSummary();
    formSummaryDate.textContent = formatDateHuman(state.date);
    formSummaryLanes.innerHTML = data.lanesData.map(renderLaneSummaryHtml).join('');
    formSummaryTotal.textContent = czk(data.total);

    app.hidden = true;
    formPanel.hidden = false;
    formWrap.hidden = false;
    successBox.hidden = true;
    form.reset();
    ['jmeno', 'telefon', 'email'].forEach(clearError);
    formPanel.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function hideFormPanel() {
    formPanel.hidden = true;
    app.hidden = false;
    app.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  btnContinue.addEventListener('click', function () {
    if (btnContinue.disabled) return;
    showFormPanel();
  });
  btnFormBack.addEventListener('click', hideFormPanel);

  function setError(id, on) {
    var field = document.getElementById(id + '-error');
    if (!field) return;
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('field--error', !!on);
  }
  function clearError(id) { setError(id, false); }

  function validateForm() {
    var jmeno = document.getElementById('jmeno');
    var telefon = document.getElementById('telefon');
    var email = document.getElementById('email');
    var jmenoOk = jmeno.value.trim().length >= 2;
    var telOk = /^[+]?[\d\s()-]{9,}$/.test(telefon.value.trim());
    var mailOk = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.value.trim());
    setError('jmeno', !jmenoOk); setError('telefon', !telOk); setError('email', !mailOk);
    if (!jmenoOk) jmeno.focus(); else if (!telOk) telefon.focus(); else if (!mailOk) email.focus();
    return jmenoOk && telOk && mailOk;
  }

  function collectPayload() {
    var data = renderBookingSummary();
    var vyber = [];
    data.lanesData.forEach(function (laneData) {
      laneData.segments.forEach(function (seg) {
        vyber.push({
          draha: laneData.lane.name,
          od: slotLabel(seg.start),
          do: slotLabel(seg.end + 1),
          hodin: seg.end - seg.start + 1,
          cenaZaHodinuKc: seg.price,
          cenaCelkemKc: segmentTotal(seg)
        });
      });
    });
    return {
      datum: state.date,
      vyber: vyber,
      celkovaCenaKc: data.total,
      kontakt: {
        jmeno: document.getElementById('jmeno').value.trim(),
        telefon: document.getElementById('telefon').value.trim(),
        email: document.getElementById('email').value.trim(),
        poznamka: document.getElementById('poznamka').value.trim()
      }
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;
    var payload = collectPayload();

    /* --- DEMO --- Zde by proběhlo volání reálného API, např.:
       fetch('/api/rezervace', { method: 'POST', headers: {'Content-Type':'application/json'},
                                 body: JSON.stringify(payload) })
       V této ukázce pouze logujeme payload do konzole. */
    console.info('[DEMO] Rezervace by se odeslala s tímto payloadem:', payload);

    document.getElementById('success-text').textContent =
      'Díky, ' + payload.kontakt.jmeno.split(' ')[0] + '! Termín ' + formatDateHuman(payload.datum) +
      ' držíme. Potvrzení pošleme na ' + payload.kontakt.email + '.';

    formWrap.hidden = true;
    successBox.hidden = false;
    if (!reduceMotion) confetti();
  });

  /* ---------- Konfety (lehké, čisté CSS/DOM) ---------- */
  function confetti() {
    var host = successBox;
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
    host.style.position = 'relative';
    host.appendChild(layer);
    window.setTimeout(function () { layer.remove(); }, 3600);
  }

  /* ---------- Init ----------
     Rezervační sekce je hluboko pod foldem, proto se mřížka (3 × 11 tlačítek)
     a kalendář staví až když se k nim návštěvník blíží. Šetří to hlavní vlákno
     při načtení stránky. Bez IntersectionObserveru se vykreslí rovnou. */
  function initBooking() {
    renderBookingCalendar();
    renderBookingGrid();
    renderBookingSummary();
  }

  var section = document.getElementById('rezervace');
  if (section && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      initBooking();
    }, { rootMargin: '600px 0px' });
    io.observe(section);
  } else {
    initBooking();
  }
})();
