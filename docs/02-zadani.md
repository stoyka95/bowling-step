# Zadání projektu — Redesign webu Bowling bar Step

> Určeno jako vstupní brief pro Claude Code / vývojářský tým. Jde o **ukázkový/portfoliový redesign** webu bowling-step.cz, vytvořený proaktivně za účelem oslovení firmy s nabídkou nového webu. Zdrojová data viz `01-content-audit.md`, vizuální styl viz `03-design.md`, barvy viz `04-barevne-schema.md`.

## 1. Kontext a cíl

Současný web bowling-step.cz je zastaralý (statický HTML, netransparentní layout, není responzivní, chybí SEO). Cílem je vytvořit **moderní, rychlou, SEO-optimalizovanou ukázku nového webu**, kterou lze použít jako:

1. Demo/case study pro oslovení firmy Bowling bar Step s nabídkou spolupráce.
2. Referenční projekt do portfolia (SEMAKOD / stoyka.eu).

Web musí realisticky reprezentovat obsah a služby bowling baru, ale s naprosto novým vizuálním a technickým zpracováním.

## 2. Rozsah (scope)

### Stránky / sekce (jednostránkový web s kotvami, nebo více route — nech na architektuře, doporučen je rychlý jednostránkový landing s kotvami pro demo účely):

1. **Hero** — úvodní sekce s claimem, CTA na rezervaci, vizuál drah/interiéru
2. **O nás** — přepis textu z content auditu, USP boxy (3 dráhy, kapacita 45 osob, kulečník, stolní fotbal, parkování zdarma, půjčení bot, platba kartou)
3. **Služby / nabídka** — bowling, firemní akce, oslavy, rauty, občerstvení a nápoje
4. **Ceník** — přehledná tabulka/karty s cenami dle časového pásma (14–17h / 17–01h), boty zdarma
5. **Pravidla bowlingu** — přehledně, ideálně jako vizuální infografika/kartičky (strike, double, triple, spare) místo PDF
6. **Galerie** — grid fotek interiéru a drah (placeholder dokud nedodá klient vlastní fotky)
7. **Rezervace (demo)** — ukázkový rezervační flow: výběr data → čas → počet drah/osob → kontaktní údaje → potvrzení. Stačí frontendová simulace bez reálného backendu, ale musí vypadat a chovat se jako plně funkční produkt (mikro-animace, validace, potvrzovací stav).
8. **Kontakt** — adresa, telefon, e-mail, mapa (embed nebo statická ilustrace), doprava MHD, otvírací doba
9. **Patička** — kontakt, odkazy na sítě, odkaz na Wellness hotel Step, copyright

### Mimo rozsah (zatím)

- Reálná integrace platební brány
- Napojení na skutečný rezervační backend/CRM (SupersSaaS nebo jiný) — připravit rozhraní/strukturu dat tak, aby šlo napojit později
- Vícejazyčné verze (lze zmínit jako budoucí rozšíření — web je nyní jen v ČJ)

## 3. Technické požadavky

### Rychlost a výkon

- Cíl: Lighthouse Performance skóre 95+ na mobilu i desktopu
- Statický/pre-rendered přístup (např. Astro, Next.js se statickým exportem, nebo čistý optimalizovaný HTML/CSS/JS) — žádný zbytečný JS balík
- Obrázky ve formátu WebP/AVIF, lazy-loading, responsive `srcset`
- Fonty self-hosted nebo `font-display: swap`, minimum váh (2 řezy max)
- Critical CSS inline, zbytek async
- Core Web Vitals v zeleném pásmu (LCP < 2.5s, CLS < 0.1, INP < 200ms)

### SEO

- Sémantické HTML5 (correct heading hierarchy, `<main>`, `<nav>`, `<footer>`)
- Meta title/description pro každou sekci/stránku, unikátní a s klíčovými slovy ("bowling Praha 9", "bowling bar Praha", "firemní večírek bowling", "oslava narozenin bowling Praha")
- Structured data: `LocalBusiness` / `BowlingAlley` schema.org (adresa, otvírací doba, telefon, ceny)
- Open Graph + Twitter Card meta (pro sdílení na sítích)
- `sitemap.xml` a `robots.txt`
- Rychlé, čisté URL (bez zbytečných query parametrů)
- Alt texty u všech obrázků
- Mobile-first, plně responzivní (současný web není)

### Přístupnost (a11y)

- Kontrast textu dle WCAG AA (viz barevné schéma)
- Focus states pro klávesnicové ovládání
- ARIA popisky u interaktivních prvků rezervačního demo flow

### Stack (doporučení, upravit dle preferencí)

- Framework: Astro nebo Next.js (statický export) — Miky obvykle pracuje s Claude Code, Lovable, Supabase
- Styling: Tailwind CSS nebo vanilla CSS s custom properties (proměnné dle barevného schématu)
- Animace: Framer Motion / CSS scroll-driven animations / GSAP (lightweight) — viz `03-design.md`
- Hosting: statický (Vercel/Netlify) nebo sdílený hosting jako u semakod.cz — podle kontextu použití

## 4. Obsahová věrnost

- Fakta (adresa, telefon, e-mail, otvírací doba, počet drah, kapacita) přebírat z `01-content-audit.md` **beze změny**.
- Ceny v ceníku označit jako orientační/placeholder a při реálném nasazení ověřit s klientem (starý web je zastaralý, ceny pravděpodobně neaktuální).
- Texty lze přepsat modernějším, stručnějším a prodejnějším tónem (viz níže), ale fakta musí zůstat pravdivá.

### Tón komunikace

- Přátelský, energický, ale ne infantilní — cílovka: firmy hledající teambuilding/večírek + rodiny/skupiny přátel na zábavu
- Silné CTA: "Zarezervovat dráhu", "Naplánovat firemní akci", "Zjistit dostupnost"
- Vypíchnout diferenciátory: umístění u O2 areny, wellness hotel v zázemí, zkušenost s firemními akcemi, bezplatné parkování

## 5. Ukázka rezervace (demo reservation flow) — detail požadavku

Klíčový prvek zadání — má demonstrovat, jak by mohla vypadat moderní rezervace:

1. **Krok 1:** výběr data (kalendář) a času (sloty dle otvírací doby 14:00–01:00)
2. **Krok 2:** výběr počtu drah (1–3) a počtu hráčů (max 6/dráha)
3. **Krok 3:** doplňkové služby (občerstvení, raut — checkbox/toggle) pro firemní akce
4. **Krok 4:** kontaktní údaje (jméno, telefon, e-mail, poznámka)
5. **Krok 5:** shrnutí a potvrzení — animovaný success stav

Plynulé přechody mezi kroky (viz `03-design.md`), progress indikátor, možnost vrátit se zpět. Formulář validovat client-side. Data nikam neposílat (demo) nebo jen na testovací endpoint/console log — jasně okomentovat v kódu, že jde o demo bez reálného backendu.

## 6. Deliverables od Claude Code

- Kompletní zdrojový kód webu (repo)
- README s instrukcemi ke spuštění a buildu
- Optimalizované obrázkové assety nebo jasně označená placeholder složka
- Lighthouse report / potvrzení výkonu po dokončení
