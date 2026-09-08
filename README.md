# Bowling bar Step — redesign (ukázka)

Moderní, rychlý a SEO-optimalizovaný redesign webu [bowling-step.cz](https://www.bowling-step.cz).
Jde o **portfoliovou ukázku** vytvořenou proaktivně jako podklad pro nabídku spolupráce — nejde
o oficiální web provozovatele.

---

## Co web obsahuje

Jednostránkový landing s kotvami:

| Sekce | Kotva | Obsah |
|---|---|---|
| Hero | `#top` | claim, dvě CTA, klíčová čísla (3 dráhy / 45 míst / 6 hráčů) |
| O nás | `#o-nas` | bento grid s USP (dráhy, kapacita, kulečník, parkování, boty, platba kartou) |
| Služby | `#sluzby` | bowling, firemní akce, oslavy, občerstvení a rauty |
| Ceník | `#cenik` | dvě cenová pásma + poznámka o orientačních cenách |
| Pravidla | `#pravidla` | strike / double / triple / spare jako karty místo PDF |
| Galerie | `#galerie` | masonry grid s lightboxem (klávesnice: ←, →, Esc) |
| Rezervace | `#rezervace` | **demo** 5krokový rezervační wizard |
| Kontakt | `#kontakt` | adresa, telefon, e-mail, otevírací doba, doprava, mapa |
| Patička | — | kontakt, odkazy, Wellness hotel Step |

## Stack

Záměrně **bez build stepu a bez frameworku** — statické HTML + CSS + vanilla JS.
Pro rozsah tohoto webu je to nejrychlejší možná varianta (žádný framework bundle,
žádná hydratace) a zároveň nejlevnější na údržbu a hosting.

- **HTML5**, sémantické, s JSON-LD (`BowlingAlley` / `LocalBusiness` + `FAQPage` + `WebSite`)
- **CSS** s custom properties přesně dle `docs/04-barevne-schema.md`
- **JS**: ~7 kB nekomprimovaně ve dvou souborech, bez závislostí
- **Fonty**: self-hosted Fraunces 600 (nadpisy) + Inter 400/600 (text), pouze subsety
  `latin` a `latin-ext`, `font-display: swap`, preload kritických řezů
- **Obrázky**: vektorové SVG ilustrace (viz níže), `loading="lazy"`, pevné `width`/`height` kvůli CLS
- **Hosting**: Vercel (statický output, konfigurace v `vercel.json`)

## Spuštění

Není co buildit — stačí naservírovat složku `public/`:

```bash
# libovolný statický server, např.
npx serve public
# nebo
python3 -m http.server 4173 --directory public
```

Web pak běží na `http://localhost:4173`.

### Deploy

```bash
npx vercel deploy --prod
```

`vercel.json` nastavuje `outputDirectory: public`, `cleanUrls` a cache hlavičky
pro statické assety.

## Struktura

```
public/
  index.html            # celá stránka
  css/style.css         # design systém + komponenty (vč. @font-face)
  js/main.js            # navigace, scroll reveal, parallax, lightbox
  js/booking.js         # DEMO rezervační wizard
  fonts/                # self-hosted woff2 (latin + latin-ext)
  img/
    og-image.png        # Open Graph náhled 1200×630
    apple-touch-icon.png
    placeholder/        # ILUSTRAČNÍ vizuály — nahradit fotkami klienta
  favicon.svg
  robots.txt
  sitemap.xml
  site.webmanifest
docs/                   # zadání, content audit, design a barevný brief
tools/generate-placeholders.py   # generátor SVG placeholderů
vercel.json
```

## Demo rezervace — jak to funguje

`public/js/booking.js` obsahuje pětikrokový wizard:

1. datum + časový slot (sloty 14:00–24:00 dle otevírací doby)
2. počet drah (1–3) a hráčů (max. 6 na dráhu, validováno)
3. doplňkové služby (občerstvení, raut, nápoje, pronájem baru)
4. kontaktní údaje s client-side validací
5. shrnutí s orientační cenou + animovaný success stav

**Data se nikam neodesílají.** Po potvrzení se payload pouze vypíše do konzole
prohlížeče (`console.info`) ve tvaru, který odpovídá budoucímu API požadavku.
Napojení na reálný systém stačí doplnit do funkce `submitReservation()` —
struktura dat je připravená:

```js
{
  datum: "2026-09-08", cas: "19:00", delkaHodin: 2,
  pocetDrah: 2, pocetHracu: 8,
  doplnkoveSluzby: ["Raut na míru"],
  kontakt: { jmeno, telefon, email, poznamka },
  orientacniCenaKc: 1800
}
```

Dostupnost slotů je v ukázce simulovaná deterministickou funkcí `isSoldOut()`,
aby web působil jako živý rezervační systém.

## Obrázky

Všechny vizuály ve složce `public/img/placeholder/` jsou **vlastní vektorové
ilustrace**, ne fotografie — vygenerované skriptem `tools/generate-placeholders.py`
v barevné paletě webu. Slouží jako dočasná náhrada, dokud klient nedodá
profesionální fotografie interiéru, drah a baru. Výměna = nahradit soubory
a upravit `src` / `alt` v `index.html`.

```bash
python3 tools/generate-placeholders.py   # spouštět z kořene repa
```

## Přístupnost a výkon

- kontrast dle WCAG AA (zlatá se nikde nepoužívá jako barva běžného textu na světlém
  pozadí — pro to slouží tmavší `#9C7A2E`)
- viditelné focus stavy, skip-link, ARIA popisky u wizardu a lightboxu, `role="progressbar"`
- kompletní ovládání klávesnicí (menu, wizard, galerie)
- `prefers-reduced-motion` vypíná všechny animace i parallax
- žádný render-blocking JS (`defer`), preload kritických fontů a hero vizuálu
- pevné rozměry obrázků → prakticky nulový CLS

## Obsahová věrnost

Fakta (adresa, telefon, e-mail, otevírací doba, počet drah, kapacita, pravidla)
odpovídají `docs/01-content-audit.md`. Texty jsou přepsané do modernějšího tónu.

⚠️ **Ceny (360 / 450 Kč za dráhu a hodinu) jsou převzaté ze starého webu a mohou být
neaktuální.** Web je označuje jako orientační; před ostrým nasazením je nutné je
ověřit s klientem. Stejně tak doporučujeme dohledat aktuální profil na sociálních
sítích — odkazovaná FB skupina je stará.

## Co je mimo rozsah ukázky

- reálný rezervační backend / napojení na SuperSaaS
- platební brána
- jazykové mutace (web je pouze v ČJ)
