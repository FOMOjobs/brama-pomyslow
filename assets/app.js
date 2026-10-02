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
      status: 'realizacja', needs: 'ludzie do sprzątania i druga osoba z kajakiem', lat: 50.0520, lng: 19.9182 },
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

  // Strony inicjatyw (też przykładowe). Klucz = id z POMYSLY.
  // date/start/end: jednorazowe wydarzenie; cycle: stałe działanie bez jednej daty.
  // points: dodatkowe punkty na mapie, jak waypointy w geocachingu.
  var SZCZEGOLY = {
    1: {
      org: 'Sąsiedzi z os. Kalinowego',
      date: '2026-10-24', start: '10:00', end: '14:00',
      place: 'Os. Kalinowe, podwórko za blokiem nr 4',
      desc: [
        'Zamieniamy zaniedbany trawnik za blokiem w miejsce, gdzie da się usiąść. Posadzimy byliny i krzewy, a miasto w ramach inicjatywy lokalnej kupi rośliny, ziemię i dwie ławki.',
        'Jesień to dobry czas na sadzenie, więc ruszamy, jak tylko przyjdzie zgoda. Potrzebujemy rąk do kopania rabat i kogoś, kto później pomoże podlewać.'
      ],
      spots: 12, going: 6,
      attrs: ['dzieci', 'seniorzy', 'wlasne', 'mpk'],
      partners: [
        { who: 'Rada Dzielnicy XVI Bieńczyce', what: 'opinia do wniosku o inicjatywę lokalną', state: 'ok' },
        { who: 'Spółdzielnia mieszkaniowa', what: 'zgoda na zagospodarowanie terenu przy bloku', state: 'czeka' }
      ],
      logs: [
        { type: 'ogloszenie', author: 'Sąsiedzi z os. Kalinowego', date: '2026-09-30', text: 'Wniosek o inicjatywę lokalną złożony. Czekamy na odpowiedź z urzędu, a w międzyczasie zbieramy podpisy. Lista poparcia leży u gospodarza domu.' },
        { type: 'bede', author: 'Jurek z czwórki', date: '2026-10-01', text: 'Mam taczkę i dwie łopaty, przyniosę.' },
        { type: 'komentarz', author: 'Ania M.', date: '2026-10-02', text: 'Może dosadzimy coś dla pszczół? Lawenda albo kocimiętka dobrze znoszą suche miejsca.' }
      ]
    },
    2: {
      org: 'Rodzice z Dębnik',
      place: 'Skwer przy szkole podstawowej',
      desc: [
        'Chcemy zgłosić do budżetu obywatelskiego plac zabaw, na którym dzieci na wózkach i bez bawią się razem: huśtawka-gniazdo, piaskownica na wysokości stołu i bezpieczna nawierzchnia.',
        'Zanim zgłosimy projekt, prosimy fizjoterapeutę o opinię, a sąsiadów o podpisy poparcia.'
      ],
      attrs: ['dzieci', 'wozki'],
      partners: [
        { who: 'Fizjoterapeuta dziecięcy', what: 'konsultacja projektu placu', state: 'szukamy' }
      ],
      logs: [
        { type: 'komentarz', author: 'Marta, mama Kuby', date: '2026-10-02', text: 'Podpisuję się obiema rękami. Mogę zebrać podpisy w przedszkolu.' }
      ]
    },
    3: {
      org: 'Grupa „Cyfrowi Sąsiedzi”',
      date: '2026-11-05', start: '17:00', end: '18:30',
      place: 'Świetlica sąsiedzka na Zabłociu',
      desc: [
        'Cztery spotkania dla seniorów: wiadomości i zdjęcia, rozmowy wideo z rodziną, bankowość bez stresu i jak rozpoznać oszustwo w telefonie.',
        'Szukamy wolontariuszy, którzy usiądą z jedną albo dwiema osobami i spokojnie pokażą, co gdzie kliknąć. Nie trzeba być informatykiem, wystarczy cierpliwość.'
      ],
      spots: 4, going: 1,
      attrs: ['seniorzy', 'wozki', 'mpk', 'bezdosw'],
      partners: [
        { who: 'Świetlica sąsiedzka', what: 'sala i wi-fi za darmo', state: 'ok' },
        { who: 'Wolontariusze IT', what: '3 osoby na 4 spotkania', state: 'szukamy' }
      ]
    },
    4: {
      org: 'Czysta Wisła na Zwierzyńcu',
      date: '2026-10-17', start: '10:00', end: '13:00',
      place: 'Bulwar Rodła, zejście naprzeciwko przystanku Salwator',
      desc: [
        'Sprzątamy brzeg Wisły wzdłuż Bulwaru Rodła na Zwierzyńcu. Po sezonie przy wodzie zostaje sporo butelek, puszek i folii, które przy wyższym stanie rzeki trafiają prosto do nurtu.',
        'Spotykamy się przy schodach na bulwar. Dostaniecie worki i rękawice, podzielimy się na grupy po 4–5 osób. Pełne worki zostawiamy w punkcie odbioru zaznaczonym na mapie, a MPO zabiera je w poniedziałek rano.',
        'Zapraszamy całe rodziny. Dzieci sprzątają na górze bulwaru, przy samej wodzie pracują tylko dorośli, zawsze w parach. Na koniec ciepła herbata.'
      ],
      spots: 30, going: 14,
      attrs: ['dzieci', 'psy', 'mpk', 'sprzet', 'bezdosw'],
      partners: [
        { who: 'MPO Kraków', what: 'odbiór pełnych worków z punktu przy bulwarze, poniedziałek rano', state: 'ok' },
        { who: 'Rada Dzielnicy VII Zwierzyniec', what: 'worki i rękawice dla 30 osób', state: 'ok' },
        { who: 'Druga osoba z kajakiem', what: 'asekuracja przy zbieraniu śmieci z szuwarów', state: 'szukamy' }
      ],
      points: [
        { code: 'M', name: 'Odbiór worków przez MPO', note: 'Pełne worki zostawiamy przy wejściu na bulwar, tu podjedzie śmieciarka.', lat: 50.0529, lng: 19.9237 },
        { code: 'T', name: 'Przystanek Salwator', note: 'Tramwaj, ok. 2 minuty pieszo do zbiórki.', lat: 50.0527, lng: 19.9150 }
      ],
      logs: [
        { type: 'bede', author: 'kajakiem_po_krakowie', date: '2026-09-28', text: 'Popłynę kajakiem i zbiorę to, co utknęło w szuwarach. Przyda się druga osoba do asekuracji.' },
        { type: 'bede', author: 'Basia z Salwatora', date: '2026-09-29', text: 'Dołączę koło 11.' },
        { type: 'ogloszenie', author: 'Czysta Wisła na Zwierzyńcu', date: '2026-09-30', text: 'MPO potwierdziło odbiór worków w poniedziałek 19 października rano. Worki i rękawice odbieramy z rady dzielnicy w piątek, więc w sobotę wszystko będzie na miejscu.' },
        { type: 'komentarz', author: 'Tomek K.', date: '2026-10-01', text: 'Czy przy samej wodzie też sprzątamy? Mam wodery, mogę wejść tam, gdzie inni nie dojdą.' },
        { type: 'komentarz', author: 'Czysta Wisła na Zwierzyńcu', date: '2026-10-01', text: 'Tomek, super! Przy wodzie pracujemy tylko w parach, zgłoś się na zbiórce.' },
        { type: 'bede', author: 'Ola spod Kopca', date: '2026-10-02', text: 'Będę z dwójką dzieci (8 i 11 lat). Weźmiemy własne rękawice.' }
      ]
    },
    5: {
      org: 'Stowarzyszenie „Dzielimy się”',
      cycle: 'Codziennie, dyżur 18:00–18:30',
      place: 'Przed wejściem do domu kultury',
      desc: [
        'Lodówka, do której każdy może zostawić nadmiar jedzenia, a każdy, kto potrzebuje, może je wziąć. Lodówka stoi, prąd jest.',
        'Brakuje osób, które raz w tygodniu sprawdzą daty, wyrzucą to, co się zepsuło, i przetrą półki. Jeden dyżur to około 20 minut.'
      ],
      spots: 7, going: 3,
      attrs: ['mpk', 'bezdosw'],
      partners: [
        { who: 'Dom kultury', what: 'miejsce i prąd dla lodówki', state: 'ok' }
      ],
      logs: [
        { type: 'komentarz', author: 'Renata', date: '2026-09-30', text: 'Mogę brać czwartki. Czy jest gdzieś grafik?' }
      ]
    },
    7: {
      org: 'Ogrodnicy z Czyżyn',
      date: '2026-11-14', start: '10:00', end: '13:00',
      place: 'Skwer między blokami',
      desc: [
        'Chcemy założyć ogród społeczny: kilka podwyższonych grządek, kompostownik i ławka. Każdy może przyjść, posadzić coś swojego i zabrać plony.',
        'Czekamy na zgodę zarządcy terenu. Jeśli przyjdzie na czas, 14 listopada budujemy grządki i sadzimy cebulki na wiosnę.'
      ],
      spots: 10, going: 4,
      attrs: ['dzieci', 'psy', 'wlasne'],
      partners: [
        { who: 'Zarządca terenu', what: 'zgoda na ogród na skwerze', state: 'czeka' }
      ]
    },
    8: {
      org: 'Sąsiedzi z Prądnika Białego',
      cycle: 'Dostępna przez całą dobę',
      place: 'Przystanek autobusowy przy skwerze',
      desc: [
        'Szafka na książki przy przystanku już stoi. Zasada jest prosta: weź książkę, zostaw książkę.',
        'Najbardziej brakuje książek dla dzieci. Jeśli masz w domu takie, z których dzieci już wyrosły, zostaw je w szafce.'
      ],
      attrs: ['dzieci', 'wozki', 'mpk'],
      partners: [
        { who: 'Rada Dzielnicy IV Prądnik Biały', what: 'szafka i montaż', state: 'ok' }
      ],
      logs: [
        { type: 'komentarz', author: 'Kasia', date: '2026-09-27', text: 'Zostawiłam 12 książek z serii o Mikołajku. Zniknęły w dwa dni!' }
      ]
    },
    9: {
      org: 'Rodzice uczniów SP na Prokocimiu',
      date: '2026-10-20', start: '07:30', end: '08:30',
      place: 'Przejście dla pieszych przed szkołą',
      desc: [
        'Przez przejście przed szkołą codziennie rano idzie kilkaset dzieci, a samochody jeżdżą tu szybko. Chcemy zgłosić do budżetu obywatelskiego wyniesione przejście i lepsze oświetlenie.',
        'Najpierw liczymy: ile aut przejeżdża, ile dzieci przechodzi i jak długo czekają. Wyniki dołączymy do projektu razem z podpisami rodziców.'
      ],
      spots: 6, going: 2,
      attrs: ['bezdosw'],
      partners: [
        { who: 'Dyrekcja szkoły', what: 'zgoda na zbieranie podpisów przy wejściu', state: 'ok' }
      ]
    },
    10: {
      org: 'Klub Seniora z Mistrzejowic',
      cycle: 'Wtorki i czwartki, 10:00–11:00',
      place: 'Park osiedlowy, polana przy placu zabaw',
      desc: [
        'Gimnastyka dla seniorów na świeżym powietrzu: rozciąganie, ćwiczenia równowagi i marsz z kijkami. Rada dzielnicy może sfinansować zajęcia, jeśli znajdziemy prowadzącego.'
      ],
      attrs: ['seniorzy', 'mpk', 'bezdosw'],
      partners: [
        { who: 'Trener albo fizjoterapeuta', what: '2 zajęcia w tygodniu', state: 'szukamy' }
      ]
    },
    11: {
      org: 'Sąsiedzi z Krowodrzy',
      date: '2026-10-10', start: '10:00', end: '12:00',
      place: 'Trawnik między blokami',
      desc: [
        'Zamiast trawnika koszonego co dwa tygodnie chcemy wysiać łąkę kwietną. Jesień to dobry moment na siew, a wiosną łąka zakwitnie dla pszczół i motyli.',
        'Miasto w ramach inicjatywy lokalnej kupi nasiona, my przygotujemy glebę i wysiejemy.'
      ],
      spots: 8, going: 3,
      attrs: ['dzieci', 'psy', 'sprzet'],
      partners: [
        { who: 'Zarząd Zieleni Miejskiej', what: 'zgoda na zmianę sposobu koszenia', state: 'czeka' }
      ]
    },
    12: {
      org: 'Fundacja „Sąsiedzka Ławka”',
      cycle: 'Poniedziałki i środy, 16:00–18:00',
      place: 'Świetlica osiedlowa',
      desc: [
        'Pomagamy dzieciom z osiedla w lekcjach: matematyka, polski, angielski. Jeden wolontariusz pracuje z dwójką albo trójką dzieci.',
        'Szukamy osób, które mogą przyjść choć raz w tygodniu. Studenci mile widziani.'
      ],
      spots: 6, going: 4,
      attrs: ['mpk', 'wozki']
    },
    13: {
      org: 'Pracownia Sąsiedzka ze Wzgórz',
      place: 'Ściana garaży przy wjeździe na osiedle',
      desc: [
        'Chcemy namalować na ścianie garaży mural o historii osiedla: od pól i wsi po budowę bloków. Zbieramy od mieszkańców stare zdjęcia, z których powstanie projekt.',
        'Szukamy artysty, który poprowadzi malowanie z sąsiadami, i czekamy na zgodę wspólnoty.'
      ],
      attrs: ['dzieci'],
      partners: [
        { who: 'Wspólnota mieszkaniowa', what: 'zgoda na mural na ścianie garaży', state: 'czeka' },
        { who: 'Artysta albo artystka', what: 'projekt i prowadzenie malowania', state: 'szukamy' }
      ]
    }
  };

  POMYSLY.forEach(function (p) {
    var extra = SZCZEGOLY[p.id] || {};
    Object.keys(extra).forEach(function (key) { p[key] = extra[key]; });
    p.demo = true;
  });

  var UDOGODNIENIA = {
    dzieci: 'Dla dzieci',
    seniorzy: 'Dla seniorów',
    wozki: 'Dostępne dla wózków',
    psy: 'Psy mile widziane',
    mpk: 'Blisko komunikacji miejskiej',
    sprzet: 'Sprzęt na miejscu',
    wlasne: 'Weź własne narzędzia',
    bezdosw: 'Bez doświadczenia'
  };

  var PARTNER_STAN = {
    ok: 'Potwierdzone',
    czeka: 'Do potwierdzenia',
    szukamy: 'Szukamy'
  };

  // Przybliżone środki dzielnic: startowa pozycja pinezki przy dodawaniu inicjatywy.
  var SRODKI_DZIELNIC = {
    'I Stare Miasto': [50.0614, 19.9383],
    'II Grzegórzki': [50.0590, 19.9620],
    'III Prądnik Czerwony': [50.0880, 19.9700],
    'IV Prądnik Biały': [50.0950, 19.9250],
    'V Krowodrza': [50.0760, 19.9200],
    'VI Bronowice': [50.0800, 19.8850],
    'VII Zwierzyniec': [50.0550, 19.8800],
    'VIII Dębniki': [50.0300, 19.9050],
    'IX Łagiewniki-Borek Fałęcki': [50.0230, 19.9330],
    'X Swoszowice': [49.9950, 19.9450],
    'XI Podgórze Duchackie': [50.0150, 19.9600],
    'XII Bieżanów-Prokocim': [50.0200, 20.0150],
    'XIII Podgórze': [50.0400, 19.9750],
    'XIV Czyżyny': [50.0700, 20.0050],
    'XV Mistrzejowice': [50.0970, 20.0050],
    'XVI Bieńczyce': [50.0860, 20.0250],
    'XVII Wzgórza Krzesławickie': [50.0950, 20.0650],
    'XVIII Nowa Huta': [50.0700, 20.0800]
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

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // Same daty (RRRR-MM-DD) czytamy w południe, żeby strefa czasowa nie przesunęła dnia.
  function toDate(iso) {
    return new Date(iso.length > 10 ? iso : iso + 'T12:00:00');
  }

  function longDate(iso) {
    return toDate(iso).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function shortDate(iso) {
    return toDate(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function relativeDay(iso) {
    var today = new Date();
    var day = toDate(iso);
    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    var days = Math.round((today - day) / 86400000);
    if (days <= 0) return 'dziś';
    if (days === 1) return 'wczoraj';
    if (days < 7) return days + ' dni temu';
    if (days < 14) return 'tydzień temu';
    return shortDate(iso);
  }

  // Współrzędne w stopniach i minutach, jak na stronach skrzynek w geocachingu.
  function ddm(value, pos, neg, degDigits) {
    var abs = Math.abs(value);
    var deg = String(Math.floor(abs));
    var min = (abs - Math.floor(abs)) * 60;
    while (deg.length < degDigits) deg = '0' + deg;
    return (value < 0 ? neg : pos) + ' ' + deg + '° ' + (min < 10 ? '0' : '') + min.toFixed(3) + '′';
  }

  function coords(lat, lng) {
    return ddm(lat, 'N', 'S', 2) + ' ' + ddm(lng, 'E', 'W', 3);
  }

  function showMessage(node, text) {
    node.textContent = text || '';
    node.hidden = !text;
  }

  function selectedValue(group) {
    var on = group.querySelector('[aria-pressed="true"]');
    return on ? on.dataset.value : null;
  }

  function selectValue(group, value) {
    group.querySelectorAll('button[aria-pressed]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.value === value));
    });
  }

  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  }

  /* ---------- Pamięć przeglądarki (prototyp nie ma serwera) ---------- */

  // Dodane inicjatywy, wpisy ze zdjęciami i kliknięcia „Chcę pomóc” widzi tylko ta przeglądarka.
  var STORE_KEY = 'brama-pomyslow:v1';

  function loadStore() {
    var data = null;
    try {
      data = JSON.parse(localStorage.getItem(STORE_KEY));
    } catch (err) {
      data = null;
    }
    data = data && typeof data === 'object' ? data : {};
    return {
      added: Array.isArray(data.added) ? data.added : [],
      logs: data.logs && typeof data.logs === 'object' ? data.logs : {},
      helped: data.helped && typeof data.helped === 'object' ? data.helped : {},
      author: typeof data.author === 'string' ? data.author : ''
    };
  }

  var store = loadStore();

  function saveStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      return true;
    } catch (err) {
      return false;
    }
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
    copyText(draftText(), function (ok) {
      copyLabel.textContent = ok ? 'Skopiowano' : 'Kopiuj tekst';
      copyStatus.textContent = ok
        ? 'Skopiowano tekst wniosku.'
        : 'Nie udało się skopiować. Zaznacz tekst i skopiuj go ręcznie.';
    });
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
  var helped = store.helped;

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
      saveStore();
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
      if (p.fix) {
        row.appendChild(el('span', 'idea-name', p.idea));
      } else {
        var name = el('a', 'idea-name', p.idea);
        name.href = '#/inicjatywa/' + p.id;
        row.appendChild(name);
      }
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

  // Nowe inicjatywy dostają kolejne numery, żeby numery przykładowych się nie przesuwały.
  function addToMap(p) {
    p.nr = mapItems.length + 1;
    mapItems.push(p);
    if (map) createMarker(p);
  }

  store.added.forEach(function (p) {
    p.when = relativeDay(p.created);
    POMYSLY.unshift(p);
    addToMap(p);
  });
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
    if (p.needs) box.appendChild(el('span', 'popup__needs', 'Potrzebne: ' + p.needs));
    var actions = el('span', 'popup__actions');
    var link = el('a', 'popup__link', 'Szczegóły');
    link.href = '#/inicjatywa/' + p.id;
    link.appendChild(el('span', 'sr-only', ': ' + p.idea));
    actions.appendChild(helpButton(p, renderIdeas));
    actions.appendChild(link);
    box.appendChild(actions);
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

  // Wspólne ustawienia wszystkich map: panel, strona inicjatywy i formularz.
  function createMap(container, options) {
    var settings = {
      minZoom: 11,
      maxZoom: 18,
      maxBounds: [[49.95, 19.72], [50.17, 20.27]],
      maxBoundsViscosity: 0.8,
      scrollWheelZoom: false,
      zoomAnimation: !reducedMotion,
      fadeAnimation: !reducedMotion,
      markerZoomAnimation: !reducedMotion
    };
    Object.keys(options).forEach(function (key) { settings[key] = options[key]; });
    var m = L.map(container, settings);

    // Podkład OpenStreetMap. Podkład CARTO wymaga teraz klucza API.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(m);
    return m;
  }

  function mapFallback(container, text) {
    if (!container.firstChild) container.appendChild(el('p', 'map-fallback', text));
  }

  function pinIcon(className, label) {
    return L.divIcon({
      className: 'pin-icon',
      html: '<span class="pin ' + className + '">' + label + '</span>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  function createMarker(p) {
    var marker = L.marker([p.lat, p.lng], {
      icon: pinIcon('pin--' + p.status, p.nr),
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
  }

  function ensureMap() {
    if (map) {
      map.invalidateSize();
      return;
    }
    var container = $('mapa');
    if (!window.L) {
      mapFallback(container, 'Mapa nie wczytała się. Wszystkie inicjatywy są na liście obok.');
      return;
    }

    map = createMap(container, { center: KRAKOW, zoom: 12 });
    mapItems.forEach(createMarker);
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
    var lines = [['Pomysł', 'Dzielnica', 'Ścieżka', 'Kiedy', 'Status', 'Potrzebne', 'Organizuje', 'Termin']]
      .concat(POMYSLY.map(function (p) {
        return [p.idea, p.dz, p.path, p.when, p.fix ? 'Usterka' : STATUS[p.status], p.needs || '',
          p.org || '', p.date || p.cycle || ''];
      }))
      .map(function (row) {
        return row.map(function (value) {
          return '"' + String(value).replace(/"/g, '""') + '"';
        }).join(';');
      });
    var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'brama-pomyslow-dane-demo.csv');
  });

  /* ---------- Strona inicjatywy (#/inicjatywa/<id>) ---------- */

  var SVG_OPEN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0047BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">';
  var IKONY = {
    kiedy: SVG_OPEN + '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
    godziny: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    gdzie: SVG_OPEN + '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    org: SVG_OPEN + '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/></svg>',
    check: SVG_OPEN.replace('width="20" height="20"', 'width="18" height="18"') + '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  function icon(name) {
    var span = el('span', 'ico');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = IKONY[name];
    return span;
  }

  var current = null;
  var detailMap = null;
  var detailLayer = null;
  var detailMarkers = [];

  var logForm = $('wpis-form');
  var logType = logForm.querySelector('[data-group="wpis-typ"]');
  var logAuthor = $('wpis-autor');
  var logText = $('wpis-tresc');
  var logPhotoInput = $('wpis-zdjecie');
  var logError = $('wpis-blad');
  var evStatus = $('ev-status');
  var logPhoto = null;

  function findIdea(id) {
    for (var i = 0; i < mapItems.length; i += 1) {
      if (String(mapItems[i].id) === String(id)) return mapItems[i];
    }
    return null;
  }

  function isPast(p) {
    return Boolean(p.date) && p.date < todayIso();
  }

  // Wydarzenie z datą: „Będę”. Stałe działanie (lodówka, biblioteczka): „Dołączam”.
  function joinLabel(p) {
    return p.date ? 'Będę' : 'Dołączam';
  }

  function logLabel(type, p) {
    if (type === 'bede') return joinLabel(p);
    return { bylem: 'Byłem/am', komentarz: 'Komentarz', ogloszenie: 'Ogłoszenie organizatora' }[type] || 'Wpis';
  }

  function userLogs(p) {
    return store.logs[p.id] || [];
  }

  function allLogs(p) {
    return (p.logs || []).concat(userLogs(p)).sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1;
    });
  }

  function renderDetail(id) {
    var p = findIdea(id);
    var badges = $('ev-odznaki');
    if (p !== current) {
      logText.value = '';
      setLogPhoto(null);
    }
    current = p;
    $('ev').hidden = !p;
    $('ev-brak').hidden = Boolean(p);
    badges.textContent = '';
    if (!p) {
      $('h-inicjatywa').textContent = 'Nie ma takiej inicjatywy';
      $('ev-meta').textContent = '';
      return;
    }
    document.title = p.idea + ' · Brama Pomysłów';

    var status = el('span', 'ev-status');
    var dot = el('span', 'pin pin--mini pin--' + p.status);
    dot.setAttribute('aria-hidden', 'true');
    status.appendChild(dot);
    status.appendChild(document.createTextNode(STATUS[p.status]));
    badges.appendChild(status);
    badges.appendChild(el('span', 'tag', p.path));
    if (p.demo) badges.appendChild(el('span', 'badge-gold', 'Dane demonstracyjne'));
    $('h-inicjatywa').textContent = p.idea;
    $('ev-meta').textContent = p.dz + ' · nr ' + p.nr + ' na mapie · dodano ' + p.when;

    // Kiedy i gdzie
    var facts = $('ev-fakty');
    facts.textContent = '';
    var fact = function (name, label, value) {
      var li = el('li');
      var text = el('span');
      text.appendChild(el('strong', '', label + ': '));
      text.appendChild(document.createTextNode(value));
      li.appendChild(icon(name));
      li.appendChild(text);
      facts.appendChild(li);
    };
    fact('kiedy', 'Kiedy', p.date ? longDate(p.date) : (p.cycle || 'termin do ustalenia'));
    if (p.date && p.start) fact('godziny', 'Godziny', p.start + (p.end ? '–' + p.end : ''));
    fact('gdzie', 'Gdzie', p.place || p.dz);
    fact('org', 'Organizuje', p.org || 'mieszkańcy');
    $('ev-po').hidden = !isPast(p);
    $('ev-dolacz').hidden = isPast(p);
    $('ev-dolacz-tekst').textContent = joinLabel(p);
    $('ev-kalendarz').hidden = !p.date;
    $('ev-link-tekst').textContent = 'Skopiuj link';

    // Opis
    var desc = $('ev-opis');
    var paragraphs = [].concat(p.desc || []);
    desc.textContent = '';
    if (!paragraphs.length) paragraphs = ['Organizator nie dodał jeszcze opisu.'];
    paragraphs.forEach(function (text) { desc.appendChild(el('p', '', text)); });

    // Czego potrzeba i kto pomaga (np. MPO odbiera worki po sprzątaniu)
    showMessage($('ev-potrzeby'), p.needs ? 'Potrzebne: ' + p.needs : '');
    var partners = $('ev-partnerzy');
    partners.textContent = '';
    (p.partners || []).forEach(function (partner) {
      var li = el('li', 'partner');
      var body = el('span', 'partner__body');
      body.appendChild(el('strong', '', partner.who));
      if (partner.what) body.appendChild(el('span', '', partner.what));
      li.appendChild(body);
      if (PARTNER_STAN[partner.state]) {
        li.appendChild(el('span', 'state state--' + partner.state, PARTNER_STAN[partner.state]));
      }
      partners.appendChild(li);
    });
    partners.hidden = !partners.firstChild;
    var help = $('ev-pomoc');
    help.textContent = '';
    help.appendChild(helpButton(p, renderIdeas));

    // Udogodnienia
    var attrs = $('ev-udogodnienia');
    attrs.textContent = '';
    (p.attrs || []).forEach(function (key) {
      if (!UDOGODNIENIA[key]) return;
      var li = el('li', 'attr');
      li.appendChild(icon('check'));
      li.appendChild(document.createTextNode(UDOGODNIENIA[key]));
      attrs.appendChild(li);
    });
    $('ev-udogodnienia-karta').hidden = !attrs.firstChild;

    // Formularz wpisu
    $('wpis-typ-bede').textContent = joinLabel(p);
    $('wpis-typ-bylem').hidden = !p.date;
    selectValue(logType, isPast(p) ? 'bylem' : 'bede');
    updateLogPlaceholder();
    if (!logAuthor.value) logAuthor.value = store.author;
    showMessage(logError, '');

    renderPlaces(p);
    renderActivity(p);
  }

  /* Mapa i punkty: miejsce inicjatywy plus dodatkowe punkty (np. odbiór worków przez MPO). */

  function placesOf(p) {
    return [{
      code: String(p.nr),
      name: p.date ? 'Miejsce zbiórki' : 'Miejsce inicjatywy',
      note: p.place || '',
      lat: p.lat,
      lng: p.lng,
      main: true
    }].concat(p.points || []);
  }

  function renderPlaces(p) {
    var places = placesOf(p);
    var list = $('ev-punkty');
    list.textContent = '';
    places.forEach(function (pt, i) {
      var li = el('li');
      var button = el('button', 'waypoint');
      var pin = el('span', 'pin ' + (pt.main ? 'pin--' + p.status : 'pin--wp'), pt.code);
      var body = el('span', 'waypoint__body');
      button.type = 'button';
      pin.setAttribute('aria-hidden', 'true');
      body.appendChild(el('span', 'waypoint__name', pt.name));
      if (pt.note) body.appendChild(el('span', 'waypoint__note', pt.note));
      body.appendChild(el('span', 'waypoint__coords', coords(pt.lat, pt.lng)));
      button.appendChild(pin);
      button.appendChild(body);
      button.addEventListener('click', function () { focusPlace(i); });
      li.appendChild(button);
      list.appendChild(li);
    });
    $('ev-trasa').href = 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng;

    var container = $('mapa-inicjatywy');
    if (!window.L) {
      mapFallback(container, 'Mapa nie wczytała się. Punkty są na liście poniżej.');
      return;
    }
    if (!detailMap) {
      detailMap = createMap(container, { center: [p.lat, p.lng], zoom: 15 });
      detailLayer = L.layerGroup().addTo(detailMap);
    }
    detailMap.invalidateSize();
    detailLayer.clearLayers();
    detailMarkers = places.map(function (pt) {
      var popup = el('div', 'popup');
      popup.appendChild(el('span', 'popup__title', pt.name));
      if (pt.note) popup.appendChild(el('span', 'popup__meta', pt.note));
      var marker = L.marker([pt.lat, pt.lng], {
        icon: pinIcon(pt.main ? 'pin--' + p.status : 'pin--wp', pt.code),
        title: pt.name,
        keyboard: true
      }).bindPopup(popup, { maxWidth: 260 });
      detailLayer.addLayer(marker);
      return marker;
    });
    if (places.length > 1) {
      detailMap.fitBounds(L.latLngBounds(places.map(function (pt) { return [pt.lat, pt.lng]; })), {
        padding: [36, 36], maxZoom: 17, animate: false
      });
    } else {
      detailMap.setView([p.lat, p.lng], 16, { animate: false });
    }
  }

  function focusPlace(i) {
    var marker = detailMarkers[i];
    if (!marker) return;
    detailMap.setView(marker.getLatLng(), Math.max(detailMap.getZoom(), 16), { animate: false });
    marker.openPopup();
  }

  /* Chętni, zdjęcia i wpisy */

  function renderActivity(p) {
    var logs = allLogs(p);
    var going = (p.going || 0) + userLogs(p).filter(function (log) { return log.type === 'bede'; }).length;

    var counter = $('ev-licznik');
    $('ev-zapisy').hidden = !p.spots && !going;
    $('ev-miernik').hidden = !p.spots;
    if (p.spots) {
      counter.textContent = 'Chętnych: ' + going + ' z ' + p.spots + (going >= p.spots ? '. Komplet, dziękujemy!' : '');
      $('ev-pasek').style.width = Math.min(100, Math.round((going / p.spots) * 100)) + '%';
    } else {
      counter.textContent = 'Chętnych: ' + going;
    }

    var photos = logs.filter(function (log) { return log.photo; });
    var gallery = $('ev-galeria');
    $('h-ev-galeria').textContent = photos.length ? 'Zdjęcia (' + photos.length + ')' : 'Zdjęcia';
    gallery.textContent = '';
    if (!photos.length) {
      gallery.appendChild(el('li', 'gallery-empty', 'Nikt jeszcze nie dodał zdjęć. Dodaj pierwsze razem z wpisem.'));
    }
    photos.forEach(function (log) {
      var li = el('li');
      li.appendChild(photoButton(log, 'gallery__item'));
      gallery.appendChild(li);
    });

    var counts = {};
    logs.forEach(function (log) { counts[log.type] = (counts[log.type] || 0) + 1; });
    $('h-ev-wpisy').textContent = logs.length ? 'Wpisy (' + logs.length + ')' : 'Wpisy';
    $('ev-wpisy-podsumowanie').textContent = ['bede', 'bylem', 'komentarz', 'ogloszenie']
      .filter(function (type) { return counts[type]; })
      .map(function (type) { return logLabel(type, p) + ': ' + counts[type]; })
      .join(' · ') || 'Na razie pusto. Twój wpis będzie pierwszy.';

    var list = $('ev-wpisy');
    list.textContent = '';
    logs.forEach(function (log) { list.appendChild(logItem(log, p)); });
  }

  function photoButton(log, className) {
    var button = el('button', className);
    var img = document.createElement('img');
    button.type = 'button';
    img.src = log.photo;
    img.alt = 'Zdjęcie od: ' + log.author;
    img.loading = 'lazy';
    button.appendChild(img);
    button.addEventListener('click', function () {
      openPhoto(log.photo, 'Zdjęcie od: ' + log.author + (log.text ? '. ' + log.text : ''));
    });
    return button;
  }

  function logItem(log, p) {
    var li = el('li', 'log' + (log.type === 'ogloszenie' ? ' log--org' : '') + (log.author === p.org ? ' log--owner' : ''));
    var avatar = el('span', 'log__avatar', Array.from(log.author)[0].toUpperCase());
    var body = el('div', 'log__body');
    var top = el('div', 'log__top');
    var when = shortDate(log.date);
    if (log.date.length > 10) {
      when += ', ' + toDate(log.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    }
    var time = el('time', 'log__date', when);
    time.dateTime = log.date;
    avatar.setAttribute('aria-hidden', 'true');
    top.appendChild(el('strong', 'log__author', log.author));
    top.appendChild(el('span', 'log-tag log-tag--' + log.type, logLabel(log.type, p)));
    top.appendChild(time);
    body.appendChild(top);
    if (log.text) body.appendChild(el('p', 'log__text', log.text));
    if (log.photo) body.appendChild(photoButton(log, 'log__photo'));

    // Własne wpisy (z tej przeglądarki) można usunąć.
    if (userLogs(p).indexOf(log) !== -1) {
      var remove = el('button', 'link-btn', 'Usuń mój wpis');
      remove.type = 'button';
      remove.addEventListener('click', function () {
        if (!window.confirm('Usunąć ten wpis?')) return;
        var mine = userLogs(p);
        mine.splice(mine.indexOf(log), 1);
        saveStore();
        renderActivity(p);
        evStatus.textContent = 'Usunięto wpis.';
        $('h-ev-wpisy').focus();
      });
      body.appendChild(remove);
    }
    li.appendChild(avatar);
    li.appendChild(body);
    return li;
  }

  /* Podgląd zdjęcia */

  var lightbox = $('podglad');

  function openPhoto(src, caption) {
    var img = $('podglad-img');
    img.src = src;
    img.alt = caption;
    $('podglad-opis').textContent = caption;
    lightbox.showModal();
  }

  // Klik w tło poza zdjęciem zamyka podgląd.
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) lightbox.close();
  });

  /* Akcje: dołącz, kalendarz, link */

  $('ev-dolacz').addEventListener('click', function () {
    selectValue(logType, 'bede');
    updateLogPlaceholder();
    logForm.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    (logAuthor.value ? logText : logAuthor).focus({ preventScroll: true });
  });

  $('ev-link').addEventListener('click', function () {
    copyText(location.href, function (ok) {
      $('ev-link-tekst').textContent = ok ? 'Skopiowano' : 'Skopiuj link';
      evStatus.textContent = ok
        ? 'Skopiowano link do inicjatywy.'
        : 'Nie udało się skopiować. Skopiuj adres z paska przeglądarki.';
    });
  });

  $('ev-kalendarz').addEventListener('click', function () {
    if (current && current.date) downloadIcs(current);
  });

  function icsText(value) {
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  // Linia pliku .ics może mieć najwyżej 75 bajtów, dłuższe zawijamy.
  function icsFold(line) {
    var encoder = new TextEncoder();
    var parts = [];
    var part = '';
    var bytes = 0;
    var limit = 75;
    Array.from(line).forEach(function (ch) {
      var size = encoder.encode(ch).length;
      if (bytes + size > limit) {
        parts.push(part);
        part = '';
        bytes = 0;
        limit = 74;
      }
      part += ch;
      bytes += size;
    });
    parts.push(part);
    return parts.join('\r\n ');
  }

  function icsDate(date, time) {
    return date.replace(/-/g, '') + (time ? 'T' + time.replace(':', '') + '00' : '');
  }

  function downloadIcs(p) {
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Brama Pomyslow//Prototyp//PL',
      'BEGIN:VEVENT',
      'UID:inicjatywa-' + p.id + '@brama-pomyslow',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
    ];
    if (p.start) {
      // Czas bez strefy: kalendarz pokaże go jako lokalny, a dla Krakowa to właściwa godzina.
      lines.push('DTSTART:' + icsDate(p.date, p.start));
      if (p.end) lines.push('DTEND:' + icsDate(p.date, p.end));
    } else {
      lines.push('DTSTART;VALUE=DATE:' + icsDate(p.date));
    }
    lines.push(
      'SUMMARY:' + icsText(p.idea),
      'LOCATION:' + icsText((p.place ? p.place + ', ' : '') + 'Kraków'),
      'GEO:' + p.lat + ';' + p.lng,
      'DESCRIPTION:' + icsText([].concat(p.desc || []).join('\n\n') + '\n\n' + location.href),
      'URL:' + location.href,
      'END:VEVENT',
      'END:VCALENDAR'
    );
    downloadBlob(new Blob([lines.map(icsFold).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }),
      'inicjatywa-' + p.id + '.ics');
  }

  /* Formularz wpisu */

  function updateLogPlaceholder() {
    logText.placeholder = {
      bede: 'Np. Będę z dziećmi, weźmiemy własne rękawice.',
      bylem: 'Jak poszło? Co się udało?',
      komentarz: 'Pytanie albo pomysł do organizatora.'
    }[selectedValue(logType)] || '';
  }

  logType.addEventListener('wybor', updateLogPlaceholder);

  function setLogPhoto(dataUrl) {
    var thumb = $('wpis-miniatura');
    logPhoto = dataUrl;
    if (dataUrl) thumb.src = dataUrl;
    else thumb.removeAttribute('src');
    $('wpis-podglad').hidden = !dataUrl;
  }

  // Zdjęcie zmniejszamy przed zapisem, żeby zmieściło się w pamięci przeglądarki.
  function shrinkImage(file, done) {
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      done(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      done(null);
    };
    img.src = url;
  }

  logPhotoInput.addEventListener('change', function () {
    var file = logPhotoInput.files[0];
    if (!file) return;
    shrinkImage(file, function (dataUrl) {
      logPhotoInput.value = '';
      showMessage(logError, dataUrl ? '' : 'Nie udało się wczytać zdjęcia. Spróbuj z plikiem JPG albo PNG.');
      if (dataUrl) setLogPhoto(dataUrl);
    });
  });

  $('wpis-usun-zdjecie').addEventListener('click', function () {
    setLogPhoto(null);
    logPhotoInput.focus();
  });

  logForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!current) return;
    var type = selectedValue(logType) || 'komentarz';
    var author = logAuthor.value.trim();
    var text = logText.value.trim();
    if (!author) {
      showMessage(logError, 'Podpisz wpis imieniem albo nickiem.');
      logAuthor.focus();
      return;
    }
    if (type !== 'bede' && !text && !logPhoto) {
      showMessage(logError, 'Napisz kilka słów albo dodaj zdjęcie.');
      logText.focus();
      return;
    }

    var entry = { type: type, author: author, text: text, date: new Date().toISOString() };
    if (logPhoto) entry.photo = logPhoto;
    if (!store.logs[current.id]) store.logs[current.id] = [];
    store.logs[current.id].push(entry);
    store.author = author;

    var problem = '';
    if (!saveStore()) {
      problem = 'Wpis dodany, ale przeglądarka go nie zapamięta. Zniknie po odświeżeniu strony.';
      if (entry.photo) {
        delete entry.photo;
        if (saveStore()) problem = 'Wpis dodany bez zdjęcia: w pamięci przeglądarki zabrakło miejsca.';
      }
    }

    logText.value = '';
    setLogPhoto(null);
    showMessage(logError, problem);
    renderActivity(current);
    evStatus.textContent = problem ? '' : 'Dodano wpis.';
  });

  /* ---------- Dodaj inicjatywę (#/dodaj, #/dodaj/wniosek) ---------- */

  var newForm = $('nowa-form');
  var newStatus = newForm.querySelector('[data-group="n-status"]');
  var newDz = $('n-dz');
  var newPath = $('n-sc');
  var newError = $('nowa-blad');
  var newMap = null;
  var newMarker = null;
  var newPinMoved = false;

  newDz.innerHTML = $('dzielnica').innerHTML;
  Array.prototype.forEach.call(filterPath.options, function (option) {
    // Usterki nie trafiają na mapę inicjatyw.
    if (option.value !== 'all' && option.value !== 'Zgłoszenie do urzędu') {
      newPath.appendChild(new Option(option.value));
    }
  });

  Object.keys(UDOGODNIENIA).forEach(function (key) {
    var label = el('label', 'check');
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.value = key;
    label.appendChild(box);
    label.appendChild(document.createTextNode(UDOGODNIENIA[key]));
    $('n-udogodnienia').appendChild(label);
  });

  function newPinPosition() {
    return SRODKI_DZIELNIC[newDz.value] || KRAKOW;
  }

  function refreshNewPin() {
    if (!newMarker) return;
    newMarker.setIcon(pinIcon('pin--' + (selectedValue(newStatus) || 'wsparcie'), mapItems.length + 1));
    var pos = newMarker.getLatLng();
    $('n-wspolrzedne').textContent = newPinMoved
      ? 'Wybrane miejsce: ' + coords(pos.lat, pos.lng) + '.'
      : 'Pinezka stoi w środku dzielnicy. Kliknij na mapie albo przeciągnij ją w dokładne miejsce.';
  }

  function resetNewPin() {
    if (!newMarker || newPinMoved) return;
    newMarker.setLatLng(newPinPosition());
    newMap.setView(newPinPosition(), 14, { animate: false });
  }

  function ensureNewMap() {
    var container = $('mapa-nowa');
    if (!window.L) {
      mapFallback(container, 'Mapa nie wczytała się. Inicjatywa trafi do środka wybranej dzielnicy.');
      return;
    }
    if (newMap) {
      newMap.invalidateSize();
      return;
    }
    newMap = createMap(container, { center: newPinPosition(), zoom: 14 });
    newMarker = L.marker(newPinPosition(), {
      icon: pinIcon('pin--wsparcie', ''),
      draggable: true,
      keyboard: true,
      title: 'Miejsce inicjatywy'
    }).addTo(newMap);
    newMarker.on('dragend', function () {
      newPinMoved = true;
      refreshNewPin();
    });
    newMap.on('click', function (event) {
      newMarker.setLatLng(event.latlng);
      newPinMoved = true;
      refreshNewPin();
    });
  }

  newDz.addEventListener('change', resetNewPin);
  newStatus.addEventListener('wybor', refreshNewPin);

  // Z ekranu szkicu wniosku: przenosimy tytuł, opis i dzielnicę, jeśli pola są puste.
  function prefillFromDraft() {
    if (!$('n-tytul').value.trim()) $('n-tytul').value = $('w-tytul').value.trim();
    if (!$('n-opis').value.trim()) $('n-opis').value = $('w-opis').value.trim();
    newDz.value = $('dzielnica').value;
    newPath.value = 'Inicjatywa lokalna';
  }

  function showNewForm(param) {
    if (param === 'wniosek') prefillFromDraft();
    showMessage(newError, '');
    ensureNewMap();
    resetNewPin();
    refreshNewPin();
  }

  function linesOf(text) {
    return text.split(/\n+/).map(function (line) { return line.trim(); }).filter(Boolean);
  }

  function failNew(text, field) {
    showMessage(newError, text);
    field.focus();
  }

  newForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var title = $('n-tytul').value.trim();
    var org = $('n-org').value.trim();
    var date = $('n-data').value;
    var start = date ? $('n-od').value : '';
    var end = date ? $('n-do').value : '';
    if (!title) return failNew('Wpisz nazwę inicjatywy.', $('n-tytul'));
    if (!org) return failNew('Napisz, kto organizuje, np. „Sąsiedzi z ul. Lipowej”.', $('n-org'));
    if (start && end && end <= start) return failNew('Koniec musi być później niż początek.', $('n-do'));

    var pos = newMarker ? newMarker.getLatLng() : { lat: newPinPosition()[0], lng: newPinPosition()[1] };
    var spots = parseInt($('n-miejsca').value, 10);
    var p = {
      id: Math.max.apply(null, POMYSLY.map(function (item) { return item.id; })) + 1,
      idea: title,
      dz: newDz.value,
      path: newPath.value,
      status: selectedValue(newStatus) || 'wsparcie',
      needs: $('n-potrzeby').value.trim(),
      lat: Math.round(pos.lat * 1e5) / 1e5,
      lng: Math.round(pos.lng * 1e5) / 1e5,
      org: org,
      place: $('n-miejsce').value.trim(),
      date: date || undefined,
      start: start || undefined,
      end: end || undefined,
      desc: linesOf($('n-opis').value),
      spots: spots > 0 ? spots : undefined,
      attrs: Array.prototype.map.call($('n-udogodnienia').querySelectorAll('input:checked'), function (box) {
        return box.value;
      }),
      partners: linesOf($('n-partnerzy').value).map(function (line) { return { who: line }; }),
      created: new Date().toISOString()
    };
    p.when = relativeDay(p.created);

    store.added.push(p);
    var saved = saveStore();
    POMYSLY.unshift(p);
    addToMap(p);
    renderIdeas();
    updateMap(false);

    newForm.reset();
    selectValue(newStatus, 'wsparcie');
    newPinMoved = false;
    location.hash = '#/inicjatywa/' + p.id;
    if (!saved) {
      window.alert('Inicjatywa jest na mapie, ale przeglądarka jej nie zapamięta. Zniknie po odświeżeniu strony.');
    }
  });

  /* ---------- Nawigacja między ekranami (#/nazwa albo #/nazwa/parametr) ---------- */

  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen[data-route]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var routes = screens.map(function (s) { return s.dataset.route; });
  var lastRoute = null;

  function parseHash() {
    var match = location.hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/);
    if (!match || routes.indexOf(match[1]) === -1) return null;
    return { route: match[1], param: match[2] || null };
  }

  function show(route, param, moveFocus) {
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
    if (route === 'inicjatywa') renderDetail(param);
    if (route === 'dodaj') showNewForm(param);
    if (lightbox.open) lightbox.close();

    // Powrót ze strony inicjatywy: od razu do mapy, a nie na górę panelu.
    if (route === 'panel' && lastRoute === 'inicjatywa') {
      $('mapa').closest('.map-card').scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
    lastRoute = route;

    if (moveFocus) {
      var heading = active.querySelector('h1');
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  window.addEventListener('hashchange', function () {
    var target = parseHash();
    if (target) show(target.route, target.param, true);
  });

  var initial = parseHash() || { route: 'start', param: null };
  show(initial.route, initial.param, false);
})();
