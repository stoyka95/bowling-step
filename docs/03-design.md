# Design brief — moderní web pro rok 2026

> Vizuální a interakční směrnice pro redesign bowling-step.cz. Barvy viz samostatný `04-barevne-schema.md`, obsah viz `01-content-audit.md`, funkční rozsah viz `02-zadani.md`.

## 1. Celková vize

Moderní, prémiový, "night-out" pocit — bowling bar jako místo pro zábavu, oslavy a firemní akce, ne suchá sportovní hala. Design má evokovat: elegantní bar/lounge atmosféru s hravým, energickým akcentem (kuželky, dráhy, světla). Inspirace: moderní hospitality weby (butikové hotely, cocktail bary, boutique zážitkové provozy) kombinované s hravostí herního/zábavního průmyslu.

Klíčová slova stylu: **prémiové, plynulé, hravé, prosvětlené, sebevědomé**.

## 2. Layout principy (2026 standard)

- **Bento-grid sekce** pro USP karty (dráhy, kapacita, kulečník, parkování atd.) — moderní alternativa k klasickým ikonovým řádkům
- **Velkoformátové vizuály** — hero na plnou výšku viewportu (nebo blízko), silné fotografie/ilustrace drah a interiéru
- **Asymetrické, ale vyvážené kompozice** — ne striktně centrovaný layout všude, prvky mírně přesazené, vrstvení (layering) obrázků a textu
- **Generous white space** — hodně vzduchu mezi sekcemi, žádný pocit "nacpaného" starého webu
- **Sticky/floating navigace** — minimalistická, průhledná nad hero, při scrollu se mění na pevnou lištu s blur pozadím (glassmorphism efekt)
- **Floating CTA button** — přetrvávající "Zarezervovat" tlačítko (např. dole vpravo na mobilu) pro maximální konverzi

## 3. Typografie

- **Display/nadpisové písmo:** výrazné, moderní serif nebo geometrický sans s charakterem (např. styl Fraunces, Instrument Serif, nebo Clash Display / Cabinet Grotesk pro sans variantu) — dodává prémiový, "bar/lounge" pocit
- **Textové písmo:** čistý neutrální grotesk pro čitelnost (např. Inter, General Sans, Satoshi)
- Velké, sebevědomé nadpisy (hero claim klidně 64–96px na desktopu), hodně tracking/letter-spacing na drobných labelech (např. "OTEVŘENO DENNĚ")
- Kombinace serif nadpisů + sans body textu pro kontrast "klasika × modernost"

## 4. Motion, přechody a animace

Web má působit **plynule a živě**, ne staticky — to je hlavní rozdíl oproti starému webu. Doporučené techniky:

### Scroll-driven animace
- Sekce se objevují s jemným fade-in + translate-y (16–24px) při vjezdu do viewportu (Intersection Observer / CSS `@scroll-timeline` kde podporováno)
- Parallax vrstvy v hero sekci (pozadí se hýbe pomaleji než popředí — např. siluety kuželek/koulí)
- Postupné odkrývání USP karet v bento gridu (staggered reveal, delay 60–100ms mezi kartami)

### Mikro-interakce
- Tlačítka: měkký scale (1.02–1.04) + posun stínu při hoveru, ne jen barva
- Karty (galerie, ceník): jemný tilt/lift efekt při hoveru (transform translateY + zvětšení stínu)
- Ikony USP: drobná smyčková animace při vjezdu do viewportu (např. kuželka se "kymácí", koule se "kutálí" jednou)
- Custom cursor v hero sekci volitelně (kulatý cursor s "Hrát" labelem při najetí na CTA)

### Přechody mezi sekcemi
- Plynulé barevné přechody pozadí mezi sekcemi (gradient morph, ne ostrý řez) — hodí se pro přechod ze zlato-tmavé hero sekce do světlé "O nás" sekce
- Volitelně: SVG/clip-path "wave" nebo diagonální dělítka mezi sekcemi místo rovných čar

### Rezervační flow (demo)
- Animovaný multi-step wizard: kroky se posouvají horizontálním slide transition (translateX), progress bar se plynule vyplňuje
- Success stav: konfetti/kuželky animace při potvrzení rezervace (lightweight, CSS/SVG based, ne těžká knihovna)

### Technický přístup
- Preferovat CSS animace a nativní scroll-driven API kde možné (výkon!)
- Framer Motion nebo GSAP jen pro komplexnější sekvence (hero, rezervační wizard) — importovat úsporně, ne celou knihovnu zbytečně
- Respektovat `prefers-reduced-motion` — pro uživatele s touto preferencí animace vypnout/zjednodušit

## 5. Obrazový styl

- Silné, kontrastní fotografie interiéru a drah (v ideálním případě nové profesionální foto, do té doby vysoce kvalitní stock/placeholder v odpovídající estetice — tmavý bar, teplá světla, lesklé dráhy)
- Detailní close-upy: koule, boty, kuželky — jako doplňkové vizuální akcenty (ne jen produktové foto, ale stylizované s dramatickým osvětlením)
- Volitelně: jemná grafická vrstva/texture (noise/grain overlay) pro "premium" hloubku, velmi subtilní
- Galerie jako moderní masonry/grid s lightbox náhledem (plynulé zoom transition, ne skokové)

## 6. Ikonografie a grafické prvky

- Lehce ilustrativní, linkové ikony (stroke style, ne plné) pro USP sekci — kuželka, koule, kulečník, stolní fotbal, auto/parkování, karta
- Jemné dekorativní grafické prvky evokující dráhu bowlingu (linky, čáry pohybu koule) jako pozadí/oddělovače sekcí
- Zlatý akcent (viz barevné schéma) použitý úsporně — na CTA, klíčových číslech (3 dráhy, 45 osob), hover stavech

## 7. Responzivita

- Mobile-first — velká část poptávek (rezervace na telefonu z baru/hospody) přijde z mobilu
- Touch-friendly velikosti tlačítek (min 44×44px)
- Na mobilu zjednodušit parallax/heavy motion efekty kvůli výkonu a battery

## 8. Reference / nálada (moodboard směr)

Pro inspiraci hledat vizuální reference u:
- moderní boutique hotelové a lounge/cocktail bary weby
- prémiové "experience" landing pages (escape roomy, herny, zážitkové centra) s dobrým motion designem
- Award-winning webdesign platformy (Awwwards, Land-book) pod tagy "hospitality", "nightlife", "entertainment venue"

Cíl: aby si návštěvník po prvních 3 vteřinách řekl "tohle vypadá jako místo, kam chci jít se skupinou přátel nebo firmou", ne "tohle je bowlingová herna z 90. let".
