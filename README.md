# JEFFERSON - Museum of Art

Marketing website for the Meridian Museum of Art, built from the pen.dev design
document. **Vite + React + TypeScript + Tailwind CSS v4.**

## How this was built (and why it is design-accurate)

Rather than re-authoring the design by hand from screenshots, the pages are
**generated mechanically** from pen.dev's own `html-tailwind` export.

pen.dev's exporter emits the exact Tailwind utility classes that reproduce the
design — the same pixel values, font weights, letter-spacing and radii that the
canvas uses. Converting that output programmatically means the layout,
typography and colour survive 1:1.

The converter is `tools/pen-to-jsx.mjs`. It rewrites only five things:

| # | Rewrite | Why |
|---|---------|-----|
| 1 | hex colours → `var(--color-*)` | single source of truth for the palette |
| 2 | font stacks → `.font-display` / `.font-body` | Tailwind v4 cannot put comma-separated stacks in a CSS variable |
| 3 | icon divs → inline SVG | pen.dev exports real vector paths; kept verbatim |
| 4 | SVG attrs → JSX camelCase | `stroke-width` → `strokeWidth` |
| 5 | artboard positioning dropped | `absolute left/top` is canvas layout, not web layout |

Everything else passes through untouched. The only intentional deviation is the
page root: the fixed `w-[1440px]` artboard becomes
`w-full max-w-[1440px] mx-auto relative` so the site is responsive — `relative`
is required to keep the absolutely-positioned children (hero artwork, scrim,
map) inside their containing block.

### Regenerating the pages

```bash
# 1. in pen.dev, export each screen as html-tailwind into C:/Users/M S I/_pen-probe
# 2. then:
node tools/pen-to-jsx.mjs
```

`NavBar.tsx` and `Footer.tsx` are hand-maintained (they carry the router links
and hover states). The generator leaves them alone once they exist — delete the
file first if you want a plain design-exact starting point back.

## Design tokens

All 21 variables from the pen.dev document live in `src/index.css` as CSS
custom properties. **Never hardcode a colour** — reference the token.

- Surfaces: `--color-bg`, `--color-surface`
- Ink: `--color-ink`, `--color-ink-2`, `--color-ink-3`
- Line: `--color-line`, `--color-line-dark`
- Accent: `--color-accent`, `--color-accent-soft`, `--color-accent-press`
- On dark: `--color-on-dark`, `--color-on-dark-2/3/4`
- Scrim: `--color-scrim-90/60/00`
- Motion: `--dur-fast/base/slow/veil`, `--ease-quiet`, `--ease-veil`, `--stagger-plate`

Fonts: **Cormorant Garamond** (display) + **Inter** (body), loaded via `<link>`
in `index.html` per Tailwind v4 guidance (never `@import` in CSS).

## The Veil Wipe

The museum's signature route transition. On navigation a warm paper sheet
sweeps up, the route swaps underneath, then the veil lifts and content settles:

```
0ms    click — the old page holds still
180ms  the veil sweeps up          (ease-veil)
540ms  screen is paper; route swaps
900ms  veil lifts; content settles
+120ms text rises last
```

Implemented in `App.tsx` (`VeilTransition`) with keyframes in `index.css`.
It honours `prefers-reduced-motion`. Note that `.pen` schema 2.19 has no
prototype/transition properties, so this transition is expressed in code rather
than in the design file.

## Structure

```
src/
├── App.tsx                 routes + the Veil Wipe transition
├── index.css               design tokens, fonts, keyframes
├── main.tsx                router bootstrap
├── components/
│   ├── NavBar.tsx          nav (lifted from the design)
│   └── Footer.tsx          footer (lifted from the design)
└── pages/                  generated from the pen.dev export
    ├── Home.tsx
    ├── Exhibitions.tsx
    ├── ExhibitionDetail.tsx
    ├── Collection.tsx
    ├── Visit.tsx
    ├── About.tsx
    └── HomeMobile.tsx      the 390px artboard
```

## Routes

| Path | Page |
|------|------|
| `/` | Home / Landing |
| `/exhibitions` | Exhibitions / Index |
| `/exhibitions/:slug` | Exhibition / Detail |
| `/collection` | Collection / Gallery |
| `/visit` | Visit |
| `/about` | About |
| `/mobile` | Home / Mobile 390 (reference artboard) |

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
```

Images live in `public/images/` — copied from the pen.dev document's asset
folder (`images/generated-*.png`).
