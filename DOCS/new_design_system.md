# Prabhakar Processors — Brand Design System
**Version 1.1 · August 2026 — Light Theme Update**

---

## 1. Brand Identity Overview

**Company:** Prabhakar Processors Pvt Ltd
**Industry:** Textile Processing (Dyeing, Printing, Finishing)
**Location:** Surat, Gujarat · Est. 2009
**Tagline:** Where Grey Becomes Brilliant.

### Brand Personality
Precision · Heritage · Trust · Craft · Reliability

---

## 2. Logo

### 2.1 Logo Mark — Anatomy

The Prabhakar Processors logo consists of two elements:

1. **The Mark** — A sewing needle (vertical) combined with a curved thread that forms the letter **"P"**. The needle is drawn in Dark Navy; the thread curve is drawn in Warm Mahogany.
2. **The Wordmark** — Two-line stacked text:
   - `PRABHAKAR` in **Dark Navy** (`#20222D`)
   - `PROCESSORS` in **Warm Mahogany** (`#674438`)

Both the needle and the P-curve share the same visual weight, creating a unified icon that communicates craft (the needle), continuity (thread), and identity (the letter P).

### 2.2 Logo Colours (Exact SVG Values)

| Token | Name | Hex | RGB |
|---|---|---|---|
| `--logo-navy` | Dark Navy | `#20222D` | `rgb(32, 34, 45)` |
| `--logo-mahogany` | Warm Mahogany | `#674438` | `rgb(103, 68, 56)` |
| `--logo-white` | White | `#FFFFFF` | `rgb(255, 255, 255)` |

### 2.3 Logo Versions

| Version | When to Use |
|---|---|
| **Full Logo** (Mark + Wordmark) | Primary usage — print, website header, documents |
| **Mark Only** (Needle + P) | Favicon, app icon, social avatar, embossing |
| **Wordmark Only** (Text only) | When mark is too small to read clearly (<16px) |
| **Reversed** (White on Light) | Use only when logo sits on a coloured accent element (e.g. mahogany `#674438` chip) |

### 2.4 Clear Space

Minimum clear space around the full logo = **1× the height of the "P" letterform** on all four sides. Never crowd the logo with other elements.

### 2.5 Minimum Sizes

| Format | Minimum Width |
|---|---|
| Digital (screen) | 120px |
| Print | 30mm |
| Favicon / App icon | 32px (mark only) |

### 2.6 Logo Don'ts

- Do not rotate the logo
- Do not stretch or distort proportions
- Do not recolour with colours outside the brand palette
- Do not apply drop shadows or outer glows
- Do not place on busy photographic backgrounds without a clear zone
- Do not outline or stroke the letterforms
- Do not use the mark alone at small sizes where the needle detail disappears

---

## 3. Colour Palette

### 3.1 Primary Brand Colours

These are the two colours extracted directly from the logo SVG. They are the authoritative brand colours.

```css
--brand-navy:     #20222D;   /* Dark Navy — primary identity colour */
--brand-mahogany: #674438;   /* Warm Mahogany — secondary identity colour */
```

| Swatch | Name | Hex | Usage |
|---|---|---|---|
| ■ | Dark Navy | `#20222D` | Logo, all headings, primary text, nav, borders |
| ■ | Warm Mahogany | `#674438` | Logo secondary, sub-headings, warm text accents |

### 3.2 Website Extended Palette — Full Light Theme

The website is entirely light theme. There are no dark section backgrounds. All surfaces are warm light tones derived from natural textile materials: ivory, parchment, and warm white.

```css
/* ─── Light Surfaces (section backgrounds) ─── */
--surface-primary:   #FAF0E6;   /* Warm Cream — main background, most sections */
--surface-secondary: #FFF8F2;   /* Near-white warm — alternating/proof sections */
--surface-tertiary:  #F2E8D8;   /* Parchment — subtle depth, partnerships section */
--surface-accent:    #F0F2F8;   /* Light indigo tint — innovation/future section */

/* ─── Accent / Textile Heritage (used as highlights only, never as BG) ─── */
--color-mahogany: #674438;   /* Warm Mahogany — rules, CTA underlines, dots, arcs */
--color-saffron:  #F7941D;   /* Saffron — warm accent, process stage tags */
--color-crimson:  #CC2936;   /* Crimson — strong accent, dyeing stage */
--color-marigold: #FFB627;   /* Marigold — warm yellow, printing stage */
--color-indigo:   #1A237E;   /* Deep Indigo — text accent ONLY, never as background */
--color-teal:     #168AAD;   /* Peacock Teal — cool accent, finishing stage */

/* ─── Text (all on light surfaces) ─── */
--color-text-heading:   #20222D;              /* Dark Navy — all headings */
--color-text-primary:   #2D1B0E;              /* Warm dark brown — body text */
--color-text-secondary: rgba(45,27,14,0.55);  /* Muted body text */
--color-text-ghost:     rgba(45,27,14,0.12);  /* Disabled / decorative text */
--color-text-mahogany:  #674438;              /* Warm Mahogany — sub-labels */
```

### 3.3 Section Background Map

Every section on the website uses a light surface. The table below is the definitive mapping.

| Section | Background Token | Hex | Notes |
|---|---|---|---|
| Hero | Image | — | Full-bleed illustration; cream zone for text |
| Story | Image | — | Full-bleed illustration; cream zone for text |
| Process | Image | — | Full-bleed horizontal scroll; cream zones |
| Capabilities | `--surface-primary` | `#FAF0E6` | Cream — three editorial columns |
| Proof / Trust | `--surface-secondary` | `#FFF8F2` | Near-white; threads image at 10% opacity texture |
| Contact | `--surface-primary` | `#FAF0E6` | Cream — three-column contact grid |
| S04 Quality | `--surface-primary` | `#FAF0E6` | Cream — split layout |
| S05 Ecosystem | `--surface-primary` | `#FAF0E6` | Cream — vertical journey |
| S06 Who We Serve | `--surface-primary` | `#FAF0E6` | Cream — image slider |
| S07 Partnerships | `--surface-tertiary` | `#F2E8D8` | Parchment — label card grid |
| S08 Future / Innovation | `--surface-accent` | `#F0F2F8` | Light indigo tint — three panels |
| S09 Leadership | `--surface-primary` | `#FAF0E6` | Cream — split layout |
| S10 Closing CTA | Image | — | Closing fabric image; warm cream overlay at 65% |
| Footer | `--surface-tertiary` | `#F2E8D8` | Parchment — grounds the page |

### 3.4 Light Theme — Section-Specific Treatment

**Proof / Trust section (replaces dark treatment):**
```css
background: #FFF8F2;
/* Threads image sits behind at 10% opacity as subtle texture */
.proof-bg-img { opacity: 0.1; mix-blend-mode: multiply; }
/* All text switches to dark */
.proof-quote   { color: #20222D; }
.proof-num     { color: #20222D; }
.proof-sectors { color: rgba(45,27,14,0.6); }
/* Mahogany rule — full strength for short accent rules */
.proof-rule    { background: #674438; }
```

**S08 Future / Innovation section (replaces deep indigo dark treatment):**
```css
background: #F0F2F8;   /* Barely-there indigo tint — sophisticated, not dark */
/* Panel titles */
.future-panel-title { color: #20222D; }
/* Panel body */
.future-panel-body  { color: rgba(45,27,14,0.6); }
/* Mahogany rule — full strength for short accent rules */
.future-rule        { background: #674438; }
/* Panel dividers — very subtle */
.future-panel + .future-panel {
  border-left: 1px solid rgba(32,34,45,0.08);
}
/* Images need updating — regenerate without dark indigo background */
/* See Image Prompt Updates section below */
```

**S10 Closing CTA section (replaces dark overlay):**
```css
/* Replace dark overlay rgba(20,10,4,0.55) with warm cream overlay */
.closing-overlay { background: rgba(250,240,230,0.65); }
/* All text switches to dark navy */
.closing-eyebrow  { color: #674438; }
.closing-headline { color: #20222D; }
.closing-body     { color: rgba(45,27,14,0.7); }
.closing-phone,
.closing-email    { color: #20222D; }
.closing-cta-btn  { color: #20222D; border-bottom-color: #674438; }
```

### 3.5 Colour Contrast (WCAG AA — Light Theme Only)

| Text Colour | Background | Ratio | Pass? |
|---|---|---|---|
| `#20222D` on `#FAF0E6` | Navy on Cream | ~12:1 | ✅ AAA |
| `#20222D` on `#FFF8F2` | Navy on Near-white | ~12.4:1 | ✅ AAA |
| `#20222D` on `#F2E8D8` | Navy on Parchment | ~11.2:1 | ✅ AAA |
| `#20222D` on `#F0F2F8` | Navy on Light Indigo | ~11.8:1 | ✅ AAA |
| `#674438` on `#FAF0E6` | Mahogany on Cream | ~5.8:1 | ✅ AA |
| `#2D1B0E` on `#FAF0E6` | Dark on Cream | ~13.1:1 | ✅ AAA |

> **Rule:** Warm Mahogany (`#674438`) is the site accent for rules, underlines, dots, and arcs. Use full strength for deliberate accents (CTA underlines, diamonds, short label rules, label text). Soften long hairlines and long arcs to ~20–50% opacity so decoration stays subtle. Mahogany meets AA on cream and may be used for accent text.

---

## 4. Typography

### 4.1 Type System — Three Fonts

```css
/* Display — Headlines, pull quotes, hero text */
--font-display: 'Cormorant Garamond', Georgia, serif;

/* Body — All UI text, paragraphs, navigation */
--font-body: 'DM Sans', system-ui, sans-serif;

/* Mono — Labels, data, eyebrows, counters, technical info */
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

**Google Fonts import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 4.2 Type Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `ist-h1` — Hero Headline | Cormorant Garamond | `clamp(3rem, 7vw, 6.5rem)` | 300 | 1.0 | -0.02em |
| `ist-h2` — Section Headline | Cormorant Garamond | `clamp(2.4rem, 5vw, 4.5rem)` | 300 | 1.05 | -0.015em |
| `ist-h3` — Sub-headline | Cormorant Garamond | `clamp(1.6rem, 3vw, 2.8rem)` | 300 | 1.15 | -0.01em |
| `ist-eyebrow` — Eyebrow label | IBM Plex Mono | `0.68rem` | 400 | 1 | 0.18em |
| `ist-body` — Body copy | DM Sans | `clamp(0.9rem, 1.2vw, 1.05rem)` | 300 | 1.75 | 0 |
| `ist-meta` — Stat/data line | IBM Plex Mono | `0.75rem` | 400 | 1.4 | 0.1em |
| `ist-stat-num` — Counters | Cormorant Garamond | `clamp(2.8rem, 5vw, 4.5rem)` | 300 | 1 | -0.02em |

### 4.3 Typography Rules

- Headlines use Cormorant Garamond weight **300** (light) — never bold
- Italic `<em>` in headlines creates visual emphasis within the light-weight style
- Eyebrow labels are ALWAYS uppercase, IBM Plex Mono, generous letter-spacing
- Never set body text in Cormorant Garamond
- Never set headlines in DM Sans
- No bold (`font-weight: 700`) anywhere in the typographic system

---

## 5. Spacing & Grid

### 5.1 Base Unit

```css
--spacing-unit: 8px;   /* All spacing is a multiple of 8 */
```

### 5.2 Common Spacings

```css
--space-xs:  8px;    /* 1× */
--space-sm:  16px;   /* 2× */
--space-md:  24px;   /* 3× */
--space-lg:  40px;   /* 5× */
--space-xl:  64px;   /* 8× */
--space-2xl: 96px;   /* 12× */
--space-3xl: 128px;  /* 16× */
```

### 5.3 Section Padding

```css
--section-pad-v: clamp(4rem, 8vh, 7rem);    /* Vertical */
--section-pad-h: clamp(1.5rem, 6vw, 8rem);  /* Horizontal */
```

### 5.4 Layout Grid

| Breakpoint | Columns | Gutter | Max Content Width |
|---|---|---|---|
| Mobile `< 768px` | 1 col | 24px | 100% |
| Tablet `768px – 1199px` | 2 col | 32px | 100% |
| Desktop `≥ 1200px` | 12 col | 40px | 1440px |

---

## 6. Iconography & Motifs

### 6.1 Ghost Architecture Motifs

Used as background texture across all light surfaces. Because the entire site is light theme, these motifs are the primary source of visual warmth and cultural depth — they become more important, not less.

```css
/* Mughal architectural line-art — sepia (on cream surfaces) */
opacity: 0.08;
color: #8B6914;   /* Warm sepia */

/* Indian floral outlines — mahogany (on cream surfaces) */
opacity: 0.05;
color: #674438;   /* Warm mahogany */

/* Textile weave grid (on cream surfaces) */
opacity: 0.03;
color: #F5E6C8;

/* On #F0F2F8 light indigo surface (S08 Future section) */
/* Increase sepia layer slightly for visibility on cooler tone */
opacity: 0.10;
color: #6B5A3E;   /* Slightly darker warm sepia — reads better on indigo tint */
```

### 6.2 Rules & Dividers

```css
/* Mahogany accent rule (beneath eyebrows, between sections) */
.accent-rule {
  width: 28px;
  height: 1px;
  background: #674438;
  margin: 0.8rem 0 1rem;
}

/* Full-width section divider */
.section-rule {
  width: 100%;
  height: 0.5px;
  background: rgba(45,27,14,0.12);
}
```

### 6.3 Decorative Glyph

```css
/* Traditional Indian floral marker used as eyebrow prefix */
content: '❁';
color: #674438;
margin-right: 0.5em;
```

---

## 7. Motion & Animation

### 7.1 Easing Tokens

```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-reveal:    cubic-bezier(0.16, 1, 0.3, 1);
```

### 7.2 Standard Durations

```css
--duration-fast:   0.3s;   /* Hover states, micro-interactions */
--duration-mid:    0.6s;   /* Element reveals, transitions */
--duration-slow:   1.0s;   /* Section entries, image loads */
--duration-crawl:  1.4s;   /* Parallax, cinematic effects */
```

### 7.3 Scroll Animation Pattern

```js
// Standard section reveal — use IntersectionObserver
{
  threshold: 0.2,          // Trigger at 20% in view
  translateY: '24px → 0',  // Rise from below
  opacity: '0 → 1',
  duration: '1s',
  ease: '--ease-out-quart'
}
```

### 7.4 GSAP Patterns (Horizontal Scroll)

```js
// Process section — horizontal pin scroll
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    pin: true,
    scrub: 1.2,
    anticipatePin: 1,
    invalidateOnRefresh: true,  // REQUIRED for resize
  }
})
// NOTE: parent wrapper must NOT have overflow:hidden
```

---

## 8. Component Patterns

### 8.1 Image + Text System (`.img-section`)

Full-bleed editorial image with text in the deliberate cream zone:

```css
.img-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.img-section__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.img-section__text {
  position: absolute;
  z-index: 2;
  /* Position varies per image — place in the clean cream zone */
}
```

### 8.2 Eyebrow + Headline Stack

```html
<p class="ist-eyebrow">SECTION LABEL</p>
<h2 class="ist-h2">
  Headline First Line<br/>
  <em>Second Line Italic.</em>
</h2>
<div class="accent-rule"></div>
<p class="ist-body">Body copy...</p>
```

### 8.3 Stat Block

```html
<div class="ist-stats">
  <div class="ist-stat">
    <span class="ist-stat-num">700<sup>+</sup></span>
    <span class="ist-stat-lbl">clients</span>
  </div>
  <div class="ist-stat-divider"></div>
  <!-- ... -->
</div>
```

---

## 9. Custom Cursor

A custom dot cursor replaces the browser default across the entire site:

```css
/* Hide all cursors — must target every interactive element */
*, *::before, *::after,
html, body, a, button, label,
input, select, textarea,
[role="button"], [tabindex] {
  cursor: none !important;
}
```

The custom cursor (`CustomCursor.jsx`) renders:
- **Outer ring** — 32px, `border: 1px solid rgba(103,68,56,0.5)`, transitions to pointer position with 80ms lag
- **Inner dot** — 6px, `background: #674438`, snaps to cursor position

---

## 10. Asset Naming Conventions

### Image Files

```
[section]-[descriptor]-[variant].png

Examples:
  hero-desktop.png
  hero-mobile.png
  main-process-01-intake-desktop.png
  quality-hero-desktop.png
  journey-03-dyeing.png
  serve-02-fashion.png
```

### Variants

| Suffix | Size | Notes |
|---|---|---|
| `-desktop` | 1920 × 1080 | Landscape, primary |
| `-mobile` | 1080 × 1920 | Portrait, `<768px` |
| `-tablet` | 1024 × 1366 | Portrait tablet |
| *(no suffix)* | 360 × 360 | Square icon/illustration |

### File Locations

```
website/public/assets/
  landing/          ← Hero, Story, Process intro images
  assets/           ← All other section images (flat, no subfolders)

DOCS/Images/        ← Master image archive
```

---

## 11. Light Theme — Image Prompt Updates

The S08 Future/Innovation section images (`future-01-technology.png`, `future-02-innovation.png`, `future-03-responsible.png`) were originally specified with a **deep indigo dark background**. For the light theme, regenerate all three with the updated background below.

**Updated shared prefix for S08 images:**

```
Editorial digital illustration for a premium Indian textile technology company.
Background: Very light warm-cool tint — #F0F2F8 (pale indigo-white, barely perceptible colour).
Absolutely not dark. The background reads as nearly white with the faintest blue-indigo whisper.

Foreground illustrations in warm mahogany (#674438), warm ivory (#FFF8F0), and
deep navy (#20222D) as primary illustration colours.

Ghost Mughal architectural line-art in warm sepia at 10% opacity behind the subject.
Scattered mahogany Indian floral outlines at 5% opacity.

Indian illustrative editorial style — NOT photorealistic. Clean, minimal.
640×480px landscape. No text. No logos.
```

Keep the individual subject descriptions from the original image prompts — only the background changes.

---

## 12. Technology Stack

| Layer | Technology |
|---|---|
| **Theme** | **Full light — no dark section backgrounds anywhere** |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + custom `index.css` |
| Animation — scroll | GSAP + ScrollTrigger |
| Animation — UI | Framer Motion |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans, IBM Plex Mono) |
| Icons | Inline SVG only — no icon library |
| Build | Vite (`npm run build`) |

---

*Prabhakar Processors Pvt Ltd · Brand Design System v1.1 · August 2026 — Light Theme*