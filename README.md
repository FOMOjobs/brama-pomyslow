# Brama Pomysłów

**Router pomysłów mieszkańców Krakowa.** Opisz pomysł na swoją okolicę zwykłymi słowami, a Brama Pomysłów wskaże właściwą drogę w Krakowie i przygotuje szkic wniosku.

> EN: A civic idea router for Kraków. Residents describe an idea in plain words and get the right official path (local initiative, participatory budget, district council, micro-grant, NGO or a city service report) plus a draft application.

Projekt na HackYeah 2026, zadanie HubMI.pl: jak sprawić, by dobre pomysły na rozwiązywanie problemów społecznych nie pozostawały niezauważone.

## Problem

| | |
|---|---|
| **821 → 424** | projektów zgłoszonych i pozytywnie ocenionych w 13. edycji budżetu obywatelskiego Krakowa ([ZDMK](https://zdmk.krakow.pl/dzialania/budzet-obywatelski/)) |
| **27** | wniosków o inicjatywę lokalną wpłynęło w 2023 r. na cały Kraków ([krakow.pl](https://www.krakow.pl/aktualnosci/278957,26,komunikat,zglos_projekt_w_ramach_inicjatywy_lokalnej.html)) |
| **NIK, 2019** | inicjatywa lokalna jest mało znana, a gminom zdarza się mylić ją z budżetem obywatelskim i funduszem sołeckim ([nik.gov.pl](https://www.nik.gov.pl/najnowsze-informacje-o-wynikach-kontroli/malo-znana-inicjatywa-lokalna.html)) |

Pomysły są. Brakuje drogowskazu.

## Jak to działa

1. Mieszkaniec opisuje pomysł tekstem albo głosem.
2. Odpowiada na 3 krótkie pytania: dzielnica, kto będzie działać, czy może dać własną pracę.
3. Dostaje najlepszą drogę z uzasadnieniem, checklistą i ostrzeżeniami oraz 1-2 alternatywy.
4. Dostaje szkic wniosku do poprawienia, skopiowania albo wydruku.

Dodatkowo:

- **Projekt z BO nie wygrał?** Podpowiedzi, jak zrobić go inną drogą, i test ryzyka odrzucenia przed kolejnym zgłoszeniem.
- **Panel dla miasta i organizacji.** Co zgłaszają mieszkańcy, w których dzielnicach i dokąd trafiają pomysły. Organizacje mogą kliknąć „Chcę pomóc”.
- **Mapa inicjatyw.** Wszystkie inicjatywy na mapie Krakowa z podziałem na status (szuka wsparcia, w przygotowaniu, w realizacji), z filtrem „Tylko szukające wsparcia” i listą obok mapy. Klik w pinezkę pokazuje, czego brakuje i pozwala zgłosić chęć pomocy.

## Ścieżki w Krakowie

| Ścieżka | Kiedy pasuje | Gdzie |
|---|---|---|
| Inicjatywa lokalna | mieszkańcy dają własną pracę, a miasto kupuje materiały albo użycza sprzętu; wnioski przez cały rok do wyczerpania puli | [obywatelski.krakow.pl](https://obywatelski.krakow.pl) |
| Budżet obywatelski | projekty dzielnicowe i ogólnomiejskie na terenie miasta; zgłoszenia na początku roku, głosowanie jesienią | [budzet.krakow.pl](https://budzet.krakow.pl) |
| Rada dzielnicy | małe lokalne potrzeby, wsparcie i opinia do inicjatywy lokalnej | strona dzielnicy |
| Małopolska Lokalnie | mikrodotacja do 6000 zł dla mieszkańców, grup nieformalnych i małych organizacji | [malopolskalokalnie.pl](https://malopolskalokalnie.pl) |
| Organizacja pozarządowa | gdy potrzebny jest stały program albo partner z osobowością prawną | [ngo.krakow.pl](https://ngo.krakow.pl) |
| Zgłoszenie do urzędu | to nie pomysł, tylko usterka | [Krakowskie Centrum Kontaktu](https://kontakt.krakow.pl/krakowskie-centrum-kontaktu) |

## Wygląd

- Barwy Krakowa: biel i błękit (Pantone 2728, ok. `#0047BB`), granat `#0B1F4D` do tekstu.
- Akcenty z herbu: czerwień `#B3261E` tylko przy ostrzeżeniach, złoto `#C9A227` przy najlepszej ścieżce.
- Font Ubuntu i falista linia jak Wisła. Bez herbu i logo miasta, bo ich użycie reguluje miasto.

## Uruchomienie

Statyczna strona bez budowania. Jedyna biblioteka to [Leaflet](https://leafletjs.com) 1.9.4, dołączony w `assets/vendor/leaflet`, więc mapa nie zależy od zewnętrznego CDN.

- **Lokalnie:** otwórz `index.html` w przeglądarce.
- **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / `(root)`.

Dyktowanie głosem działa w przeglądarkach z Web Speech API (np. Chrome). W pozostałych działa pole tekstowe.

Podkład mapy: © [OpenStreetMap](https://www.openstreetmap.org/copyright), © [CARTO](https://carto.com/attributions). Bez internetu mapa pokazuje pinezki na pustym tle, a lista inicjatyw działa normalnie.

## Status

Klikalny prototyp z jednym scenariuszem demo (ławki i kwietniki w Bieńczycach). Dane w panelu, inicjatywy na mapie i ich lokalizacje są przykładowe.

Do sprawdzenia:

- kto obecnie przyjmuje wnioski o inicjatywę lokalną (Biuro MOWIS czy Wydział Polityki Społecznej i Zdrowia),
- terminy kolejnej edycji budżetu obywatelskiego i naboru Małopolska Lokalnie.

## Struktura

```
index.html               wszystkie ekrany
assets/styles.css        wygląd
assets/app.js            nawigacja, interakcje, mapa i dane demo
assets/favicon.svg       ikona
assets/vendor/leaflet/   biblioteka mapy (licencja BSD-2-Clause w LICENSE)
```
