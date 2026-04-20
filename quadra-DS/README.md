# Quadra Design System

**Version:** v7  
**Sources:**
- Codebase: `DS/quadra-ds-v7.html` (attached via File System Access API at `DS/`)
- GitHub: https://github.com/ivanse22/Quadra (branch: `main`, file: `quadra-ds-v7.html`)
- Logo assets: `uploads/Group 26–34.svg` → copied to `assets/`

---

## Product Context

**Quadra** is a fintech mobile application targeting freelancers and small businesses in Latin America. It is a **payment/invoicing tool** — think Wise meets Nubank for the LATAM independent worker. Core flows include:

- Creating invoices with big Wise-style amount inputs
- Selecting clients via autocomplete
- Setting payment dates
- Viewing transaction history with income/deduction breakdowns
- Onboarding (profile type selection, currency preferences)

The product is mobile-first (375px baseline) with a responsive desktop sidebar layout. It ships with native **Light Mode** and **Dark Mode**.

---

## CONTENT FUNDAMENTALS

**Language:** The codebase is written in Spanish (UI labels, comments, variable names like `--fin-income`, section titles). Copy is direct, financial-professional, and concise. No fluff.

**Tone:** Clean, confident, trustworthy. Similar to Wise or Nubank — no jargon, no corporate speak. Straightforward and action-oriented.

**Casing:** Section eyebrows/labels are ALL CAPS with wide letter-spacing (e.g. `DISPONIBLE REAL`, `INGRESO`, `GASTO`). Headings use sentence case. Buttons use sentence case (not Title Case).

**Numerics:** Tabular numerals throughout. Two-tone decimals (main integer full opacity, decimals at ~22% opacity). Currency codes shown as pills (USD, MXN, etc.).

**Voice:** Third-person numbers, second-person instructions. "Ingresa el monto" (Enter the amount). Direct imperatives for CTAs.

**Emoji:** Not used in UI. No emoji in copy.

**Terminology:**
- `Volt` = the lime accent color (internal design term)
- `Disponible Real` = available balance
- `Ingreso` = income
- `Gasto` / `Deducción` = expense/deduction
- `Reservado` = reserved/pending

---

## VISUAL FOUNDATIONS

### Colors
- **Volt** `#BDF300` — electric lime-yellow. The brand accent. Used for CTAs, active states, key numbers, progress fills. Hard rule: max 10% of any viewport.
- **Volt Dark** `#3D5200` — volt on white, AA accessible. Used for volt-colored text in light mode.
- **Background Light** `#FFFFFF` → subtle `#F8F9F8` → surface `#F3F4F2` → `#ECEEED` → `#E4E6E3`
- **Background Dark** `#090D0B` — near-black with a warm green undertone. Not pure black.
- **Dark surfaces**: `#111810` → `#172014` → `#1E2B1A` (each with a slight green cast)
- **Dark borders**: Volt-tinted `rgba(189,243,0, 0.06–0.16)` — subtle glow effect
- **Semantic**: Income `#16A34A` / `#4ADE80` dark; Deduct `#DC2626` / `#F87171` dark; Reserve `#B45309` / `#FBBF24` dark

### Typography
- **Satoshi** (via Fontshare CDN): Display font. Used for all headings, hero numbers, amounts, button labels. Weights: 400, 500, 700, 900.
- **DM Sans** (Google Fonts): Body font. Used for body copy, labels, helper text, metadata. Weights: 400, 500.
- Type scale is clamp-based (fluid). Hero numbers reach 56–80px. Body sits at 13–14px.
- Letter-spacing: tightly negative on headings (`-0.05em`); slightly negative on body (`-0.01em`).
- Line-height: 1.0 on display numbers; 1.6–1.7 on body copy.
- `font-variant-numeric: tabular-nums` on all financial numbers.

### Spacing
- 4px base grid. Scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80px.
- Screen horizontal padding: 20px mobile, 24px tablet+.
- Card internal padding: 24px standard, 16px compact.
- Form field gap: 24px between groups; 8px label-to-input.

### Backgrounds & Texture
- No background images or illustrations.
- No gradients on surfaces (exception: subtle radial volt glow on hero cards).
- Elevation via shadows only (not color fills or borders alone).
- Light mode: clean white, very subtle warm-gray surfaces.
- Dark mode: atmospheric near-black with a warm green undertone.

### Borders & Shadows
- Borders: 1px solid, very low opacity (0.07–0.18). In dark mode, tinted with volt.
- Input borders: 1.5px, focused = volt color + volt-dim box-shadow ring.
- Shadow system: xs, sm, md, lg, xl — all multi-layer, clean. Dark mode adds volt-tinted 1px border as part of shadow.
- Border radii: from 4px (xs) to 32px (3xl) to 9999px (pill/full). Buttons are pill-shaped by default.

### Cards
- White bg, 1px border, `border-radius: 24px` (r-2xl), `box-shadow: shadow-sm`.
- Dark mode: slight volt border tint + heavier shadow.
- Hero cards: `shadow-lg` + subtle radial volt glow in bottom-right corner.
- No colored left-border accent. No aggressive rounding with accent borders.

### Animation & Motion
- Durations: 80ms instant, 160ms fast, 260ms base, 400ms slow, 580ms xslow.
- Easing: `ease-out` cubic-bezier for most transitions; `ease-spring` (overshoot) for celebrate/success states.
- Hover: `translateY(-1px)` + lighter shadow on primary buttons. Background color shift on interactive elements.
- Press/active: `transform: none` (snap back), slightly darker background.
- Success state: spring-pop keyframe animation (`scale 0.95 → 1.03 → 1.0`).
- Theme switch: 300ms ease-out background/color transition.

### Imagery
- No photography used in the design system.
- Placeholder states use dashed border + centered text (not illustrations).
- No custom SVG illustrations drawn.

### Hover & Press States
- Hover: subtle background shift to next surface level + border color to volt.
- Nav links hover: volt-dim background + volt-text color.
- Inputs hover/focus: volt border + volt-dim glow ring (3px).
- Buttons: primary uses translateY(-1px) + green glow shadow.
- Cards/rows: bg-subtle background shift only.

### Corner Radii
- 4px, 6px, 10px, 14px, 18px, 24px, 32px, pill(9999px).
- Default card: 24px. Default input: 14px. Default button: pill. Chips: pill. Badges: pill. Bottom nav items: 14px.

### Icon Usage
- Icons: Lucide-style outline SVGs (22px in nav, 16px inline). Neutral color (`--txt-m`), volt when active.
- Transaction icons: 38px circle, neutral surface bg + 1px border. No colored fills in circles.
- No emoji. No unicode icon substitutes.

---

## ICONOGRAPHY

**Approach:** Lucide-style stroke icons (2px stroke, rounded joins). No icon font bundled — icons are inline SVG snippets throughout the DS file. No external icon CDN linked.

**Logo mark:** A geometric Q formed from 4 rectangular blocks arranged in a 2×2 grid with a gap. The bottom-right block uses Volt (#BDF300); remaining blocks use the background's contrasting color. The diagonal "tail" of the Q is cut from the volt block.

**Logo variants (in `assets/`):**
- `logo-wide-dark.svg` — full wordmark, dark green bg (#062517)
- `logo-wide-light.svg` — full wordmark, off-white bg (#F1F2EF)
- `logo-wide-navy.svg` — full wordmark, navy dark bg (#0B1118)
- `logo-icon-navy.svg` — icon only, navy dark bg
- `logo-icon-light.svg` — icon only, off-white bg
- `logo-icon-dark.svg` — icon only, dark green bg

**Substitution note:** For the UI kit, Lucide icons are loaded via CDN (`https://unpkg.com/lucide@latest`) as this matches the stroke weight and style of the inline icons in the DS.

---

## FILE INDEX

```
README.md                      — This file
SKILL.md                       — Agent skill definition
colors_and_type.css            — All CSS custom properties (tokens)

assets/
  logo-wide-dark.svg           — Full wordmark on dark green
  logo-wide-light.svg          — Full wordmark on off-white
  logo-wide-navy.svg           — Full wordmark on navy
  logo-icon-navy.svg           — Icon mark on navy
  logo-icon-light.svg          — Icon mark on off-white
  logo-icon-dark.svg           — Icon mark on dark green

preview/
  colors-brand.html            — Volt + brand palette
  colors-surfaces.html         — Surface/background hierarchy
  colors-semantic.html         — Financial semantic colors
  colors-darkmode.html         — Dark mode surface system
  type-display.html            — Satoshi display scale
  type-body.html               — DM Sans body scale
  type-financial.html          — Tabular numeric specimens
  spacing-tokens.html          — Spacing scale tokens
  spacing-radii.html           — Border radii scale
  spacing-shadows.html         — Shadow elevation system
  spacing-motion.html          — Motion tokens
  components-buttons.html      — Button states
  components-inputs.html       — Form input states
  components-cards.html        — Card variants
  components-badges.html       — Badges, chips, tags
  components-nav.html          — Bottom nav + segmented control
  brand-logos.html             — Logo variants

ui_kits/app/
  index.html                   — Interactive mobile app prototype
  AppShell.jsx                 — Phone frame + nav
  HomeScreen.jsx               — Dashboard/balance screen
  InvoiceScreen.jsx            — New invoice flow
  TransactionScreen.jsx        — Transaction list + detail
  OnboardingScreen.jsx         — Onboarding flow
```
