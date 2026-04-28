# Plan: Quadra Design System — HTML Documentado (v10)

## Context
El equipo tiene 25 archivos HTML separados en `quadra-DS/preview/` y un CSS de tokens (`colors_and_type.css`) pero no existe un documento único y navegable que consolide todo el sistema. El objetivo es crear `quadra-ds-v10.html` — un único HTML autocontenido que sirva como referencia canónica del DS para cualquier persona que trabaje en Quadra.

---

## Archivo a crear
**`/Users/CJ/Desktop/UOC/2 Semestre/TFM/R3/DS/quadra-ds-v10.html`**

Fuentes de verdad a usar:
- `quadra-DS/colors_and_type.css` — todos los CSS custom properties
- `quadra-DS/preview/*.html` — ejemplos vivos de cada componente
- `quadra-app/src/styles/tokens.css` — tokens de la app producción
- `tokens/quadra-ds-v9.json` — token JSON master

---

## Estructura del documento

### Arquitectura
- **Un solo `.html` autocontenido** — sin dependencias externas salvo Google Fonts (`Satoshi` via CDN y `DM Sans`)
- **Sidebar de navegación** fija a la izquierda con secciones colapsables y scroll-spy
- **Toggle Light/Dark Mode** en el header
- **Search/filter** rápido por nombre de token o componente
- **Copy-to-clipboard** en cada token de color y CSS variable
- Layout: sidebar 260px fija + contenido con max-width 1200px

### Secciones (en orden de aparición)

#### 1. Intro / Header
- Logo Quadra + versión "v10 · 2026-04-27"
- Descripción breve del DS
- Links rápidos a secciones

#### 2. Colores
- **2.1 Brand** — Volt (#BDF300), volt-on, volt-text, volt-dim, volt-border + dark variants
- **2.2 Financiero** — income, deduct, reserve, available + dim/border variants + dark
- **2.3 Superficies** — bg, bg-subtle, surf-1/2/3, surf-inv + dark
- **2.4 Texto** — txt, txt-2, txt-m, txt-f, txt-inv + dark
- **2.5 Bordes** — border, border-s, border-m + dark

Formato: grid de swatches con nombre de var, hex, descripción, badge de contraste AA/AAA, botón copiar

#### 3. Tipografía
- **3.1 Familias** — Satoshi (display) + DM Sans (body) + Courier New (mono), con pesos disponibles
- **3.2 Escala de tamaños** — t-xs → t-hero con clamp values y uso recomendado
- **3.3 Roles semánticos** — h1→h3, body, label, caption, num, eyebrow, code con ejemplo en vivo
- **3.4 Números financieros** — tabular-nums, peso 900, ejemplos con cifras

#### 4. Espaciado
- **4.1 Escala base** — s1 (4px) → s20 (80px), visual con barra proporcional
- **4.2 Espaciado semántico** — space-section, space-card, space-form-gap, space-field-gap, screen-px/pb
- **4.3 Compact Row tokens** — gap, padding-y, icon-size, amount-width

#### 5. Radios de borde
- r-xs (4px) → r-full (9999px), visualización con rectángulos

#### 6. Sombras
- shadow-xs → shadow-xl, visualización con cards flotantes, light + dark

#### 7. Movimiento / Motion
- **7.1 Duraciones** — motion-instant (80ms) → motion-settle (600ms), barra de duración visual
- **7.2 Easings** — ease-out, ease-in-out, ease-spring, ease-spring-gentle, etc., con demo animado al hover

#### 8. Componentes

##### 8.1 Botones
- Primary, Secondary, Ghost
- Tamaños: default (52px), sm (36px)
- Estados: Default, Hover, Loading (spinner), Success, Disabled
- Con y sin icono

##### 8.2 Cards
- Base card
- Hero/KPI card (con número grande y breakdown)
- List card

##### 8.3 Formularios
- Input: Default, Focus, Error, Valid
- Select: Default, Focus
- Field label + helper text
- Amount Field (numpad style)

##### 8.4 Badges y Tags
- Status badges: Pagado, Pendiente, Vencido, Activo, Borrador
- Currency chips: MXN, COP, USD
- Filter chips: Todo, Ingresos, Gastos, Reserva
- Eyebrow tag

##### 8.5 Navegación
- Bottom nav (4 ítems, estado activo)
- Segmented control (Semana/Mes/Año)

##### 8.6 Toggles y Switches
- Toggle row (On/Off)
- Standalone switch

##### 8.7 Progreso
- Progress bars (volt, income, deduct, reserve)
- Step indicator (3 pasos, estados)

##### 8.8 Banners y Alertas
- Info (volt), Warning (reserve), Error (deduct), Success (income)

##### 8.9 Diálogos
- Confirmation dialog con backdrop
- Destructive variant

##### 8.10 Toasts
- Success, Error, Info (con auto-dismiss visual)

##### 8.11 Skeleton / Loading
- Shimmer animation en card, texto, avatar

##### 8.12 Data Components
- KPI row (3 cards)
- Breakdown table
- Trend list row
- Compact payment row

---

## Implementación técnica

### CSS
- Todo el CSS dentro de `<style>` en el `<head>`
- Todas las variables CSS del DS definidas en `:root` y `[data-theme="dark"]`
- Clases `.ds-*` para elementos del documento en sí (no confundir con clases de la app)
- Sidebar con `position: sticky`, scroll en el contenido principal

### JS (inline `<script>`)
- Dark mode toggle: alterna `data-theme="dark"` en `<html>`
- Copy to clipboard: `navigator.clipboard.writeText(value)`
- Scroll-spy: `IntersectionObserver` para highlight del nav item activo
- Motion demo: resetea animación al hover en el ítem de easing

### Fuentes
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```
Satoshi: `https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap`

---

## Verificación
1. Abrir el HTML en Safari y Chrome — verificar que todos los swatches renderizan
2. Toggle dark mode — verificar contraste en todas las secciones
3. Copiar un token — verificar clipboard
4. Resize a 375px — verificar que el layout no rompe (sidebar colapsa o se oculta)
5. Comparar colores contra `colors_and_type.css` para confirmar exactitud
