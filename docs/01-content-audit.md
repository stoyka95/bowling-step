# Content Audit — bowling-step.cz (současný web)

Zdroj: https://www.bowling-step.cz/index.html (stav ke dni 2026-09-08, prohlédnuto přes prohlížeč, statický HTML web bez robots.txt omezení, ale s pomalou/starou strukturou — pravděpodobně z r. 2011–2013, footer "2024 bowling-step").

Tento dokument je surový výpis obsahu starého webu, který slouží jako **zdrojová databáze textů, faktů a assetů** pro nový redesign. Texty lze v novém webu přepsat/zkrátit, ale fakta (ceny, adresa, telefon, otvírací doba) musí zůstat přesná — je třeba je před spuštěním nového webu ověřit přímo s klientem/firmou.

## Struktura webu (menu)

Statické stránky, žádný SPA routing:

- `index.html` — O nás (homepage)
- `pravidla.html` — Pravidla bowlingu
- `cenik.html` — Ceník
- `galerie.html` — Galerie
- `kontakt.html` — Kontakt

## Základní identita

- **Název:** Bowling bar Step
- **Claim/pozicionování:** Bowling bar ve wellness hotelu poblíž O2 areny, ideální na firemní večírky, párty a oslavy
- **Rok založení webu (patička):** © 2024 bowling-step (kopírováno, web samotný vypadá starší)

## Kontaktní údaje

- **Adresa:** Malletova 1141/4, 190 00 Praha 9 – Libeň
- **Telefon:** +420 296 786 330
- **E-mail:** info@bowling-step.cz
- **Facebook:** facebook.com/group.php?gid=117300318285708 (stará skupina, doporučuji při redesignu dohledat aktuální FB/Instagram profil)
- **Součást:** Wellness hotel Step **** (www.wellness-hotel-step.cz)

### Doprava / dostupnost (stránka Kontakt)

- metro B – Palmovka, pěšky cca 8–10 minut
- metro B – Vysočanská + bus č. 136, zastávka Skloněná
- metro A – Flora + bus č. 136, zastávka Skloněná
- Bezproblémové parkování přímo před areálem, zdarma

## Otevírací doba

Shodná každý den v týdnu:

| Den | Hodiny |
|---|---|
| Pondělí | 14:00–01:00 |
| Úterý | 14:00–01:00 |
| Středa | 14:00–01:00 |
| Čtvrtek | 14:00–01:00 |
| Pátek | 14:00–01:00 |
| Sobota | 14:00–01:00 |
| Neděle | 14:00–01:00 |

## Homepage — text (O nás)

> Bowling bar se nachází na Praze 9 v prostorách WELLNESS HOTELU STEP **** poblíž O2 areny. Stylová atmosféra baru v přízemí hotelu s kapacitou pro až 45 osob nabízí 3 bowlingové dráhy s elektronickými stavěči značky Vollmer. Na jedné dráze může hrát až 6 osob. K dispozici je také kulečník a stolní fotbal. Bezproblémové parkování přímo před areálem je zdarma. Bowlingové boty Vám také rádi zdarma zapůjčíme. Můžete u nás zaplatit i kartou.
>
> Jedná se o ideální místo pro pořádání večírků, párty a oslav. Rádi pro Vás připravíme lehké občerstvení či raut. Samozřejmostí je široká nabídka alkoholických i nealkoholických nápojů. Máme několikaleté zkušenosti s pořádáním firemních večírků a rautů!
>
> Pro rezervaci doporučujeme využít náš intuitivní online rezervační systém. Případně nás kontaktujte telefonicky na +420 296 786 330 nebo emailem info@bowling-step.cz.
>
> Těšíme se na Vaší návštěvu!

### Klíčová fakta k vypíchnutí v novém designu (hero / USP sekce)

- 3 bowlingové dráhy, elektronické stavěče Vollmer
- kapacita až 45 osob v baru, max. 6 hráčů na jedné dráze
- kulečník + stolní fotbal
- parkování zdarma přímo před areálem
- zapůjčení bot zdarma
- platba kartou
- firemní akce, večírky, oslavy, rauty — víceletá zkušenost
- online rezervační systém

## Pravidla bowlingu (stránka `pravidla.html`)

Web odkazuje i na PDF ke stažení: "Pravidla bowlingu (359.5 KB)" — v novém webu doporučuji nahradit přehlednou infografikou/vizuálem místo PDF.

> Hra se skládá z deseti částí. Hráč hází vždy dva hody. Jen v desáté, poslední části, má možnost až tří hodů. Pokud jsou prvním hodem poraženy všechny kuželky, pak se druhý hod již nehází.
>
> **Strike** = všechny kuželky jsou shozeny prvním hodem. Počítání pro jeden strike je 10 bodů + počet kuželek shozených v následujících dvou hodech.
> **Double** = 2 po sobě jdoucí striky. Počítá se pro první strike 20 bodů + počet kuželek sražených v první následující části po druhém striku.
> **Triple** = 3 po sobě jdoucí striky. Počítá se pro první strike 30 bodů.
> **Spare** = pokud neporažené kuželky po prvním hodu jsou při následujícím druhém hodu sraženy. Počítání pro spare je 10 bodů + počet kuželek shozených při hráčově následujícím hodu.
>
> Pro dosažení maximálního skóre 300 bodů musí hráč naházet 12 striků za sebou.

## Ceník (stránka `cenik.html`)

| Časové pásmo | Cena |
|---|---|
| 14:00–17:00 | 360 Kč / dráha / 60 min |
| 17:00–01:00 | 450 Kč / dráha / 60 min |

- Boty k zapůjčení zdarma
- Odkaz na ONLINE rezervační systém
- Rezervace i telefonicky (+420 296 786 330) nebo e-mailem (info@bowling-step.cz)

⚠️ **Poznámka pro redesign:** ceny jsou pravděpodobně neaktuální (web vypadá staře, ceny za bowling v Praze v roce 2026 budou jiné) — je nutné si aktuální ceník ověřit s klientem před spuštěním nového webu, nepřebírat čísla automaticky.

## Rezervační systém

Aktuálně řešeno přes externí SaaS: **SupersSaaS**
`http://www.supersaas.cz/schedule/bowling-step/dráhy`

Pro nový web je zadání vytvořit **vlastní ukázku/mockup rezervačního flow** (viz `02-zadani.md`) — buď jako vylepšené UI nad stejným API/systémem, nebo jako čistě vizuální demo (frontend-only), podle toho, co bude v dané fázi možné.

## Galerie — dostupné obrázky (assets)

Zdrojové fotky (nízké rozlišení, staré, ke zvážení jen jako referenční materiál — ne k přímému použití ve finálním designu):

- `https://www.bowling-step.cz/images/image1.jpg`
- `https://www.bowling-step.cz/images/P4030603.jpg`
- `https://www.bowling-step.cz/images/P4030600.jpg`
- `https://www.bowling-step.cz/images/P4030578.jpg`
- `https://www.bowling-step.cz/images/P4030577.jpg`

Doporučení: pro nový redesign použít nové profesionální fotografie (interiér, dráhy, bar, hosté) nebo kvalitní stock/AI-generated placeholder fotky v odpovídajícím stylu, dokud klient nedodá vlastní fotobanku.

## Technické poznámky ke starému webu

- Statický HTML, patrně tabulkový/frame layout (obsah čten přes `<table>` elementy)
- Není responzivní / mobile-first
- Žádné zjevné SEO meta tagy, žádná strukturovaná data (schema.org LocalBusiness chybí)
- Rychlost/UX zastaralé — hlavní důvod redesignu
- robots.txt při prvním pokusu o fetch timeoutoval — doporučeno u nového webu mít funkční, jednoduchý `robots.txt` a `sitemap.xml`
