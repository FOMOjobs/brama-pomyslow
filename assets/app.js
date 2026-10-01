/* Brama Pomysłów - nawigacja i interakcje prototypu.
   Jedyna zależność: Leaflet (assets/vendor/leaflet) do mapy w panelu. */
(function () {
  'use strict';

  var DEMO_TEXT = 'Ławki i kwietniki przy naszym bloku w Bieńczycach. Sąsiedzi pomogą sadzić.';

  /* ---------- Dane demonstracyjne panelu (nie są prawdziwymi zgłoszeniami) ---------- */

  var DZIELNICE = [
    ['XVI Bieńczyce', 21],
    ['XIII Podgórze', 18],
    ['VIII Dębniki', 16],
    ['IV Prądnik Biały', 14],
    ['XVIII Nowa Huta', 13],
    ['II Grzegórzki', 11],
    ['V Krowodrza', 9],
    ['XII Bieżanów-Prokocim', 8]
  ];

  var SCIEZKI = [
    ['Inicjatywa lokalna', 41],
    ['Budżet obywatelski', 32],
    ['Zgłoszenie do urzędu', 23],
    ['Rada dzielnicy', 19],
    ['Organizacja pozarządowa', 8],
    ['Małopolska Lokalnie', 5]
  ];

  // status: wsparcie | przygotowanie | realizacja; fix = usterka (nie trafia na mapę).
  var POMYSLY = [
    { id: 1, idea: 'Ławki i kwietniki przy bloku', dz: 'XVI Bieńczyce', path: 'Inicjatywa lokalna', when: 'dziś',
      status: 'wsparcie', needs: '6 osób do sadzenia i własne narzędzia', lat: 50.0862, lng: 20.0247 },
    { id: 2, idea: 'Plac zabaw dostępny dla dzieci z niepełnosprawnościami', dz: 'VIII Dębniki', path: 'Budżet obywatelski', when: 'dziś',
      status: 'przygotowanie', needs: 'konsultacja z fizjoterapeutą i podpisy poparcia', lat: 50.0447, lng: 19.9213 },
    { id: 3, idea: 'Warsztaty ze smartfona dla seniorów', dz: 'XIII Podgórze', path: 'Małopolska Lokalnie', when: 'wczoraj',
      status: 'wsparcie', needs: 'wolontariusze IT na 4 spotkania', lat: 50.0442, lng: 19.9530 },
    { id: 4, idea: 'Wspólne sprzątanie brzegu Wisły', dz: 'VII Zwierzyniec', path: 'Inicjatywa lokalna', when: 'wczoraj',
      status: 'realizacja', needs: 'worki, rękawice i odbiór odpadów', lat: 50.0540, lng: 19.9165 },
    { id: 5, idea: 'Lodówka społeczna przy domu kultury', dz: 'XVIII Nowa Huta', path: 'Organizacja pozarządowa', when: '2 dni temu',
      status: 'wsparcie', needs: 'osoba do codziennego sprawdzania lodówki', lat: 50.0730, lng: 20.0400 },
    { id: 6, idea: 'Dziura w chodniku przy przystanku', dz: 'II Grzegórzki', path: 'Zgłoszenie do urzędu', when: '3 dni temu',
      fix: true },
    { id: 7, idea: 'Ogród społeczny na skwerze', dz: 'XIV Czyżyny', path: 'Inicjatywa lokalna', when: '4 dni temu',
      status: 'przygotowanie', needs: 'zgoda zarządcy terenu i 10 osób do pracy', lat: 50.0735, lng: 20.0060 },
    { id: 8, idea: 'Biblioteczka sąsiedzka przy przystanku', dz: 'IV Prądnik Biały', path: 'Rada dzielnicy', when: '5 dni temu',
      status: 'realizacja', needs: 'książki dla dzieci', lat: 50.0930, lng: 19.9270 },
    { id: 9, idea: 'Bezpieczne przejście przy szkole', dz: 'XII Bieżanów-Prokocim', path: 'Budżet obywatelski', when: 'tydzień temu',
      status: 'przygotowanie', needs: 'pomiar ruchu i podpisy rodziców', lat: 50.0225, lng: 20.0115 },
    { id: 10, idea: 'Zajęcia ruchowe dla seniorów w parku', dz: 'XV Mistrzejowice', path: 'Rada dzielnicy', when: 'tydzień temu',
      status: 'wsparcie', needs: 'trener na 2 zajęcia w tygodniu', lat: 50.0985, lng: 20.0095 },
    { id: 11, idea: 'Łąka kwietna zamiast trawnika', dz: 'V Krowodrza', path: 'Inicjatywa lokalna', when: '8 dni temu',
      status: 'wsparcie', needs: 'nasiona i 8 osób do siewu', lat: 50.0740, lng: 19.9150 },
    { id: 12, idea: 'Odrabianie lekcji z sąsiadami', dz: 'XI Podgórze Duchackie', path: 'Organizacja pozarządowa', when: '9 dni temu',
      status: 'realizacja', needs: 'wolontariusze do matematyki i polskiego', lat: 50.0170, lng: 19.9580 },
    { id: 13, idea: 'Mural o historii osiedla', dz: 'XVII Wzgórza Krzesławickie', path: 'Małopolska Lokalnie', when: '10 dni temu',
      status: 'przygotowanie', needs: 'artysta i zgoda wspólnoty mieszkaniowej', lat: 50.0960, lng: 20.0640 }
  ];

  var STATUS = {
    wsparcie: 'Szuka wsparcia',
    przygotowanie: 'W przygotowaniu',
    realizacja: 'W realizacji'
  };

  var KRAKOW = [50.0614, 19.9383];
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function plural(n, one, few, many) {
    if (n === 1) return one;
    var lastDigit = n % 10;
    var lastTwo = n % 100;
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
    return many;
  }

  /* ---------- Grupy przycisków (chipy, przykłady, test BO) ---------- */

  document.querySelectorAll('[data-group]').forEach(function (group) {
    group.addEventListener('click', function (event) {
      var button = event.target.closest('button[aria-pressed]');
      if (!button || !group.contains(button)) return;
      group.querySelectorAll('button[aria-pressed]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });
      group.dispatchEvent(new CustomEvent('wybor', {
        bubbles: true,
        detail: { value: button.dataset.value, button: button }
      }));
    });
  });

  /* ---------- Większa czcionka ---------- */

  var aPlus = $('wiekszy-tekst');
  aPlus.addEventListener('click', function () {
    var on = document.documentElement.classList.toggle('duzy-tekst');
    aPlus.setAttribute('aria-pressed', String(on));
    if (map) map.invalidateSize();
  });

  /* ---------- Start: pomysł i przykłady ---------- */

  var idea = $('pomysl');
  var examples = $('przyklady');

  examples.addEventListener('wybor', function (event) {
    idea.value = event.detail.button.dataset.text;
  });

  idea.addEventListener('input', function () {
    examples.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
    });
  });

  /* ---------- Start: dyktowanie głosem (Web Speech API) ---------- */

  var mic = $('mikrofon');
  var micStatus = $('mikrofon-status');
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = null;
  var listening = false;

  function showMicStatus(text, isInfo) {
    micStatus.textContent = text;
    micStatus.classList.toggle('is-info', Boolean(isInfo));
    micStatus.hidden = false;
  }

  function setListening(on) {
    listening = on;
    mic.setAttribute('aria-pressed', String(on));
    if (on) {
      showMicStatus('Słucham… Mów spokojnie, zapiszemy to za Ciebie.', false);
    } else if (!micStatus.classList.contains('is-info')) {
      micStatus.hidden = true;
    }
  }

  mic.addEventListener('click', function () {
    if (!Recognition) {
      showMicStatus('Dyktowanie nie działa w tej przeglądarce. Wpisz pomysł w polu powyżej.', true);
      return;
    }
    if (listening && recognition) {
      recognition.stop();
      return;
    }
    var before = idea.value.trim() ? idea.value.trim() + ' ' : '';
    recognition = new Recognition();
    recognition.lang = 'pl-PL';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = function (event) {
      var text = '';
      for (var i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      idea.value = before + text;
    };
    recognition.onerror = function () {
      showMicStatus('Nie udało się nagrać. Sprawdź dostęp do mikrofonu albo wpisz pomysł.', true);
    };
    recognition.onend = function () {
      setListening(false);
    };
    micStatus.classList.remove('is-info');
    setListening(true);
    try {
      recognition.start();
    } catch (err) {
      setListening(false);
    }
  });

  /* ---------- Pytania: podsumowanie pomysłu ---------- */

  var recap = $('recap');
  var recapNote = $('recap-note');

  function updateRecap() {
    var text = idea.value.trim();
    recap.textContent = text || DEMO_TEXT;
    recapNote.hidden = !text || text === DEMO_TEXT;
  }

  /* ---------- Szkic wniosku: kopiowanie i druk ---------- */

  var draft = $('formularz-wniosku');
  var copyLabel = $('kopiuj-tekst');
  var copyStatus = $('kopiuj-status');

  function draftText() {
    return Array.prototype.map.call(draft.querySelectorAll('.field'), function (field) {
      var label = field.querySelector('label').textContent.trim();
      var value = field.querySelector('textarea').value.trim();
      return label + ': ' + value;
    }).join('\n\n');
  }

  $('kopiuj').addEventListener('click', function () {
    var done = function (ok) {
      copyLabel.textContent = ok ? 'Skopiowano' : 'Kopiuj tekst';
      copyStatus.textContent = ok
        ? 'Skopiowano tekst wniosku.'
        : 'Nie udało się skopiować. Zaznacz tekst i skopiuj go ręcznie.';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(draftText()).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });

  draft.addEventListener('input', function () {
    copyLabel.textContent = 'Kopiuj tekst';
  });

  window.addEventListener('beforeprint', function () {
    draft.querySelectorAll('.field').forEach(function (field) {
      field.querySelector('.print-value').textContent = field.querySelector('textarea').value;
    });
  });

  $('drukuj').addEventListener('click', function () {
    window.print();
  });

  /* ---------- Projekt z BO nie wygrał ---------- */

  $('znajdz').addEventListener('click', function () {
    var target = $('drogi');
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  });

  var test = $('test-bo');
  var riskBadge = $('ryzyko');
  var riskTip = $('ryzyko-rada');

  function updateRisk() {
    var answers = {};
    test.querySelectorAll('[data-group]').forEach(function (group) {
      var on = group.querySelector('[aria-pressed="true"]');
      answers[group.dataset.group] = on ? on.dataset.value : 'niewiem';
    });
    var notYes = Object.keys(answers).filter(function (key) {
      return answers[key] !== 'tak';
    }).length;

    var level = 'niskie';
    var css = 'risk-low';
    var tip = 'Wygląda dobrze. Możesz zgłosić projekt w kolejnej edycji.';
    if (answers.teren === 'nie' || notYes >= 3) {
      level = 'wysokie';
      css = 'risk-high';
      tip = 'Duże ryzyko. Najpierw ustal, czyj jest teren, albo wybierz inną drogę.';
    } else if (notYes >= 1) {
      level = 'średnie';
      css = 'risk-mid';
      tip = 'Wyjaśnij punkty z odpowiedzią „Nie” albo „Nie wiem”, zanim zgłosisz projekt.';
    }
    riskBadge.textContent = level;
    riskBadge.className = 'risk ' + css;
    riskTip.textContent = tip;
  }

  test.addEventListener('wybor', updateRisk);
  updateRisk();

  /* ---------- Panel: filtry i wspólne elementy ---------- */

  var filterDz = $('f-dz');
  var filterPath = $('f-sc');
  var helped = {};

  function matchesFilters(p) {
    return (filterDz.value === 'all' || p.dz === filterDz.value) &&
      (filterPath.value === 'all' || p.path === filterPath.value);
  }

  // Przycisk "Chcę pomóc" - ten sam stan w tabeli i w dymku na mapie.
  function helpButton(p, onToggle) {
    var button = el('button', 'btn-help');
    var label = el('span', '', helped[p.id] ? 'Zgłoszono chęć pomocy' : 'Chcę pomóc');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(Boolean(helped[p.id])));
    button.appendChild(label);
    button.appendChild(el('span', 'sr-only', ': ' + p.idea));
    button.addEventListener('click', function () {
      helped[p.id] = !helped[p.id];
      button.setAttribute('aria-pressed', String(helped[p.id]));
      label.textContent = helped[p.id] ? 'Zgłoszono chęć pomocy' : 'Chcę pomóc';
      if (onToggle) onToggle();
    });
    return button;
  }

  /* ---------- Panel: wykresy ---------- */

  function renderBars(listId, data) {
    var list = $(listId);
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; }));
    data.forEach(function (d) {
      var row = el('li', 'bar-row');
      var track = el('span', 'bar-track');
      var fill = el('span', 'bar-fill');
      track.setAttribute('aria-hidden', 'true');
      fill.style.width = Math.round((d[1] / max) * 100) + '%';
      track.appendChild(fill);
      row.appendChild(el('span', 'bar-name', d[0]));
      row.appendChild(track);
      row.appendChild(el('span', 'bar-n', String(d[1])));
      list.appendChild(row);
    });
  }

  renderBars('wykres-dzielnice', DZIELNICE);
  renderBars('wykres-sciezki', SCIEZKI);

  /* ---------- Panel: najnowsze pomysły ---------- */

  var ideasList = $('lista-pomyslow');

  function renderIdeas() {
    ideasList.textContent = '';
    var rows = POMYSLY.filter(matchesFilters).slice(0, 6);

    if (!rows.length) {
      ideasList.appendChild(el('li', 'ideas-empty', 'Brak pomysłów dla tych filtrów. Zmień dzielnicę albo ścieżkę.'));
      return;
    }

    rows.forEach(function (p) {
      var row = el('li', 'idea-row');
      row.appendChild(el('span', 'idea-name', p.idea));
      row.appendChild(el('span', 'idea-dz', p.dz));
      row.appendChild(el('span', 'tag', p.path));
      row.appendChild(el('span', 'idea-when', p.when));
      var action = el('span', 'idea-action');
      if (p.fix) {
        action.appendChild(el('span', 'idea-fix', 'Przekazano do Krakowskiego Centrum Kontaktu'));
      } else {
        action.appendChild(helpButton(p));
      }
      row.appendChild(action);
      ideasList.appendChild(row);
    });
  }

  /* ---------- Panel: mapa inicjatyw (Leaflet) ---------- */

  var mapItems = POMYSLY.filter(function (p) { return !p.fix; });
  mapItems.forEach(function (p, i) { p.nr = i + 1; });

  var map = null;
  var markers = {};
  var activeId = null;
  var mapList = $('lista-mapy');
  var mapWrap = mapList.parentElement;
  var mapSummary = $('mapa-podsumowanie');
  var onlyHelp = $('tylko-wsparcie');

  function visibleMapItems() {
    return mapItems.filter(function (p) {
      return matchesFilters(p) && (!onlyHelp.checked || p.status === 'wsparcie');
    });
  }

  function summaryText(n, k) {
    if (!n) return 'Brak inicjatyw dla tych filtrów.';
    var text = n + ' ' + plural(n, 'inicjatywa', 'inicjatywy', 'inicjatyw') + ' na mapie';
    if (!k) return text + '.';
    return text + ', ' + k + ' ' + plural(k, 'szuka', 'szukają', 'szuka') + ' wsparcia.';
  }

  function popupContent(p) {
    var box = el('div', 'popup');
    var status = el('span', 'popup__status');
    var dot = el('span', 'pin pin--mini pin--' + p.status);
    dot.setAttribute('aria-hidden', 'true');
    status.appendChild(dot);
    status.appendChild(document.createTextNode(STATUS[p.status]));
    box.appendChild(el('span', 'popup__title', p.nr + '. ' + p.idea));
    box.appendChild(el('span', 'popup__meta', p.dz + ', ' + p.path));
    box.appendChild(status);
    box.appendChild(el('span', 'popup__needs', 'Potrzebne: ' + p.needs));
    box.appendChild(helpButton(p, renderIdeas));
    return box;
  }

  function setActive(id) {
    activeId = id;
    mapList.querySelectorAll('.map-item').forEach(function (button) {
      button.setAttribute('aria-current', String(Number(button.dataset.id) === id));
    });
    Object.keys(markers).forEach(function (key) {
      var node = markers[key].getElement();
      if (node) node.classList.toggle('is-active', Number(key) === id);
    });
    var item = mapList.querySelector('.map-item[data-id="' + id + '"]');
    if (item && mapWrap.scrollHeight > mapWrap.clientHeight) {
      var top = item.offsetTop;
      var bottom = top + item.offsetHeight;
      if (top < mapWrap.scrollTop || bottom > mapWrap.scrollTop + mapWrap.clientHeight) {
        mapWrap.scrollTop = Math.max(0, top - 8);
      }
    }
  }

  var pendingOpen = null;

  function showOnMap(p, moveFocus) {
    setActive(p.id);
    if (!map) return;
    var marker = markers[p.id];
    if (pendingOpen) map.off('moveend', pendingOpen);
    pendingOpen = function () {
      pendingOpen = null;
      marker.openPopup();
      if (moveFocus) {
        var popupNode = marker.getPopup().getElement();
        var button = popupNode && popupNode.querySelector('.btn-help');
        if (button) button.focus();
      }
    };
    // Dymek otwieramy dopiero po zakończeniu ruchu mapy, żeby się nie ucinał.
    map.once('moveend', pendingOpen);
    map.setView([p.lat, p.lng], Math.max(map.getZoom(), 14), { animate: !reducedMotion });
  }

  function renderMapList(items) {
    mapList.textContent = '';
    if (!items.length) {
      mapList.appendChild(el('li', 'map-empty', 'Brak inicjatyw dla tych filtrów.'));
      return;
    }
    items.forEach(function (p) {
      var li = el('li');
      var button = el('button', 'map-item');
      var pin = el('span', 'pin pin--' + p.status, String(p.nr));
      var body = el('span', 'map-item__body');
      button.type = 'button';
      button.dataset.id = String(p.id);
      button.setAttribute('aria-current', String(p.id === activeId));
      pin.setAttribute('aria-hidden', 'true');
      body.appendChild(el('span', 'map-item__title', p.idea));
      body.appendChild(el('span', 'map-item__meta', p.dz + ', ' + p.path));
      body.appendChild(el('span', 'map-item__status', STATUS[p.status]));
      button.appendChild(pin);
      button.appendChild(body);
      button.addEventListener('click', function (event) {
        // event.detail === 0 oznacza klawiaturę: wtedy przenosimy fokus do dymka.
        showOnMap(p, event.detail === 0);
      });
      li.appendChild(button);
      mapList.appendChild(li);
    });
  }

  function fitTo(items) {
    var options = { animate: !reducedMotion };
    if (items.length > 1) {
      map.fitBounds(L.latLngBounds(items.map(function (p) { return [p.lat, p.lng]; })), {
        padding: [40, 40], maxZoom: 14, animate: !reducedMotion
      });
    } else if (items.length === 1) {
      map.setView([items[0].lat, items[0].lng], 14, options);
    } else {
      map.setView(KRAKOW, 12, options);
    }
  }

  function updateMap(fit) {
    var items = visibleMapItems();
    var visible = {};
    items.forEach(function (p) { visible[p.id] = true; });
    if (activeId && !visible[activeId]) activeId = null;

    renderMapList(items);
    mapSummary.textContent = summaryText(items.length, items.filter(function (p) {
      return p.status === 'wsparcie';
    }).length);

    if (!map) return;
    Object.keys(markers).forEach(function (key) {
      var marker = markers[key];
      if (visible[key]) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else if (map.hasLayer(marker)) {
        marker.closePopup();
        map.removeLayer(marker);
      }
    });
    if (fit) fitTo(items);
    setActive(activeId);
  }

  function ensureMap() {
    if (map) {
      map.invalidateSize();
      return;
    }
    var container = $('mapa');
    if (!window.L) {
      if (!container.firstChild) {
        container.appendChild(el('p', 'map-fallback', 'Mapa nie wczytała się. Wszystkie inicjatywy są na liście obok.'));
      }
      return;
    }

    map = L.map(container, {
      center: KRAKOW,
      zoom: 12,
      minZoom: 11,
      maxZoom: 18,
      maxBounds: [[49.95, 19.72], [50.17, 20.27]],
      maxBoundsViscosity: 0.8,
      scrollWheelZoom: false,
      zoomAnimation: !reducedMotion,
      fadeAnimation: !reducedMotion,
      markerZoomAnimation: !reducedMotion
    });

    // Jasny podkład CARTO na danych OpenStreetMap. Zamiennik bez CARTO:
    // https://tile.openstreetmap.org/{z}/{x}/{y}.png (atrybucja: OpenStreetMap).
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    mapItems.forEach(function (p) {
      var marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: 'pin-icon',
          html: '<span class="pin pin--' + p.status + '">' + p.nr + '</span>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        }),
        title: p.nr + '. ' + p.idea,
        keyboard: true,
        riseOnHover: true
      });
      marker.bindPopup(function () { return popupContent(p); }, { maxWidth: 280 });
      marker.on('click', function () { setActive(p.id); });
      marker.on('add', function () {
        var node = marker.getElement();
        if (node) node.setAttribute('aria-label', p.nr + '. ' + p.idea + ', ' + STATUS[p.status]);
      });
      markers[p.id] = marker;
    });

    updateMap(true);
  }

  function onFiltersChange() {
    renderIdeas();
    updateMap(true);
  }

  filterDz.addEventListener('change', onFiltersChange);
  filterPath.addEventListener('change', onFiltersChange);
  onlyHelp.addEventListener('change', function () { updateMap(true); });

  renderIdeas();
  updateMap(false);

  $('eksport').addEventListener('click', function () {
    var lines = [['Pomysł', 'Dzielnica', 'Ścieżka', 'Kiedy', 'Status', 'Potrzebne']]
      .concat(POMYSLY.map(function (p) {
        return [p.idea, p.dz, p.path, p.when, p.fix ? 'Usterka' : STATUS[p.status], p.needs || ''];
      }))
      .map(function (row) {
        return row.map(function (value) {
          return '"' + String(value).replace(/"/g, '""') + '"';
        }).join(';');
      });
    var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'brama-pomyslow-dane-demo.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  /* ---------- Nawigacja między ekranami (#/nazwa) ---------- */

  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen[data-route]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var routes = screens.map(function (s) { return s.dataset.route; });

  function routeFromHash() {
    var match = location.hash.match(/^#\/([\w-]+)/);
    return match && routes.indexOf(match[1]) !== -1 ? match[1] : null;
  }

  function show(route, moveFocus) {
    var active = null;
    screens.forEach(function (screen) {
      var isActive = screen.dataset.route === route;
      screen.hidden = !isActive;
      if (isActive) active = screen;
    });
    navLinks.forEach(function (link) {
      if (link.dataset.nav === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = active.dataset.title + ' · Brama Pomysłów';
    document.body.dataset.route = route;
    if (route === 'pytania') updateRecap();
    if (route === 'panel') ensureMap();
    window.scrollTo(0, 0);
    if (moveFocus) {
      var heading = active.querySelector('h1');
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  window.addEventListener('hashchange', function () {
    var route = routeFromHash();
    if (route) show(route, true);
  });

  show(routeFromHash() || 'start', false);
})();
