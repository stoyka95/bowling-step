# Barevné schéma — bílá / zlatá / zelená

> Doprovodný dokument k `03-design.md`. Definuje konkrétní barevnou paletu, poměry použití a kontrastní pravidla pro redesign webu Bowling bar Step.

## 1. Koncept

Kombinace **bílá – zlatá – zelená** evokuje prémiový, klubový/lounge feel s odkazem na herní prostředí (zelená = plocha dráhy/kulečníkové sukno, zlatá = luxus, trofej, výhra, bílá = čistota, prostor, moderní minimalismus). Paleta má fungovat v light módu jako primární téma; dark mode (viz níže) je doporučené volitelné rozšíření pro hero/night-life atmosféru.

## 2. Primární paleta

| Role | Název | Hex | Použití |
|---|---|---|---|
| Základní pozadí | Off-White / Ivory | `#FBF9F4` | hlavní pozadí sekcí, karty |
| Čistá bílá | Pure White | `#FFFFFF` | karty, pozadí formulářů, kontrastní bloky |
| Primární tmavá (text) | Deep Forest | `#0F2B22` | hlavní text, tmavá pozadí (hero, footer) |
| Akcentová zelená | Bowling Green | `#1F5D3C` | sekundární plochy, ikony, odkazy, sukno efekt |
| Světlejší zelená | Sage Tint | `#E4EDE6` | pozadí sekcí pro odlišení, badge pozadí |
| Zlatý akcent | Champagne Gold | `#C9A24B` | CTA tlačítka, klíčová čísla, hover stavy, dekorativní linky |
| Zlatý světlý tón | Soft Gold | `#E8D9B5` | jemné highlighty, gradienty, ozdobné prvky |
| Tmavý zlatý tón | Deep Gold | `#9C7A2E` | text na světlém pozadí vyžadující zlatý akcent s dobrým kontrastem |

## 3. Neutrální / podpůrné odstíny

| Role | Hex | Použití |
|---|---|---|
| Text sekundární / muted | `#5B6B62` | popisky, méně důležitý text na světlém pozadí |
| Linky / oddělovače | `#D9D2C2` | jemné hairline oddělovače na světlém pozadí |
| Stín (pro karty) | `rgba(15, 43, 34, 0.12)` | box-shadow na kartách a CTA |

## 4. Sémantické/stavové barvy (pro rezervační demo formulář)

| Stav | Hex | Poznámka |
|---|---|---|
| Success | `#2E7D4F` | potvrzení rezervace — laděno do zelené rodiny |
| Error | `#B3453A` | chyba validace — teplý terakotový tón, ne ostrá červená, aby ladil s paletou |
| Focus ring | `#C9A24B` (Champagne Gold, 40% opacity) | focus states pro accessibility |

## 5. Poměr použití (60-30-10 princip)

- **60 % Bílá/Ivory** (`#FBF9F4`, `#FFFFFF`) — dominantní pozadí, prostor, čistota
- **30 % Zelená** (`#0F2B22`, `#1F5D3C`, `#E4EDE6`) — strukturální bloky, tmavé sekce (hero, footer), text
- **10 % Zlatá** (`#C9A24B`, `#9C7A2E`) — akcent, CTA, detaily — **úsporně**, aby si udržela punc luxusu a neomrzela

## 6. Doporučené kombinace sekcí

- **Hero sekce:** tmavě zelené pozadí (`#0F2B22`) → bílý/ivory text → zlaté CTA tlačítko (`#C9A24B` s tmavým textem `#0F2B22`)
- **"O nás" / USP sekce:** ivory pozadí (`#FBF9F4`) → tmavě zelený text → zlaté ikony/akcenty
- **Ceník / karty:** bílé karty na sage tint pozadí (`#E4EDE6`), zlatý rámeček/badge na doporučené variantě
- **Galerie:** tmavé pozadí (`#0F2B22`) pro dramatický kontrast fotografií
- **Footer:** tmavě zelená (`#0F2B22`) s ivory textem a zlatými odkazy při hoveru

## 7. Gradienty (pro plynulé přechody dle design briefu)

- **Hero glow gradient:** `linear-gradient(135deg, #0F2B22 0%, #1F5D3C 60%, #2A4A38 100%)` s jemným zlatým radiálním highlightem v rohu (`radial-gradient` s `#C9A24B` při 8–12% opacity)
- **Sekce-na-sekci přechod:** plynulý morph z `#0F2B22` (tmavá hero) do `#FBF9F4` (světlá sekce) přes mezikrok `#1F5D3C` → `#E4EDE6`, ne ostrý řez
- **Zlatý CTA hover gradient:** `linear-gradient(90deg, #C9A24B 0%, #E8D9B5 100%)`

## 8. Přístupnost / kontrast (WCAG AA)

- Text `#0F2B22` na pozadí `#FBF9F4` → kontrastní poměr vysoko nad AA (vhodné pro běžný i malý text)
- Bílý text `#FFFFFF` na `#0F2B22` → splňuje AA i AAA pro běžný text
- **Pozor:** zlatá `#C9A24B` na bílém pozadí má nižší kontrast (~2.3:1) — **nepoužívat jako barvu běžného textu**, pouze pro velké nadpisy, ikony, ohraničení nebo v kombinaci s tmavým podkladem. Pro zlatý text na světlém pozadí použít tmavší variantu `#9C7A2E` (kontrast ~4.6:1, vyhovuje AA pro běžný text)
- Tlačítka: zlaté CTA (`#C9A24B`) vždy s tmavým textem (`#0F2B22`), ne bílým, kvůli kontrastu

## 9. CSS custom properties (návrh pro implementaci)

```css
:root {
  --color-bg: #FBF9F4;
  --color-bg-alt: #FFFFFF;
  --color-bg-sage: #E4EDE6;
  --color-text: #0F2B22;
  --color-text-muted: #5B6B62;
  --color-green: #1F5D3C;
  --color-green-dark: #0F2B22;
  --color-gold: #C9A24B;
  --color-gold-soft: #E8D9B5;
  --color-gold-deep: #9C7A2E;
  --color-divider: #D9D2C2;
  --color-success: #2E7D4F;
  --color-error: #B3453A;
  --shadow-card: 0 8px 24px rgba(15, 43, 34, 0.12);
}
```

## 10. Volitelný dark mode (rozšíření)

Pokud bude implementován přepínač light/dark (např. pro noční atmosféru baru):

| Role | Light | Dark |
|---|---|---|
| Pozadí | `#FBF9F4` | `#0B1A14` |
| Text | `#0F2B22` | `#F2EFE6` |
| Karty | `#FFFFFF` | `#132A20` |
| Zlatý akcent | `#C9A24B` | `#D9B968` (zesvětlená varianta pro lepší čitelnost na tmavém) |
