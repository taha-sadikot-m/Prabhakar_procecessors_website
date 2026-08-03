# Prabhakar Processors — Design Production Document
## Sections 04 – 10 | Complete Build & Image Specification

---

## HOW TO USE THIS DOCUMENT

This document is the single source of truth for building Sections 04 through 10 of the Prabhakar Processors website. Every section entry contains eight fields:

1. **Purpose** — Why this section exists in the narrative flow
2. **Storytelling Goal** — The emotional impression the visitor should leave with
3. **Layout** — Exact structure, proportions, and visual hierarchy
4. **Animation** — Specific scroll and interaction behaviours
5. **Content** — Final approved copy, word for word
6. **Image Assets** — File names, dimensions, and what each image shows
7. **AI Image Prompt** — Ready-to-use generation prompts calibrated to the existing visual system
8. **Developer Notes** — Component structure, CSS class naming, GSAP patterns, cross-references

---

## VISUAL SYSTEM REFERENCE

All new images must match the style of the three existing landing images (`hero-desktop.png`, `fabric-desktop.png`, `process-desktop.png`). Those images define the visual language:

- **Background:** Flat warm ivory-cream `#FAF0E6` — solid, no gradients on the background itself
- **Subject:** Indian textile fabric as the main visual element, with visible weave texture and Indian block-print motifs
- **Ghost elements:** Ultra-fine Mughal/Rajasthani architectural line-art at 8–10% opacity in warm sepia `#8B6914`; Indian floral outlines at 5–7% opacity in warm gold `#D4AF37`
- **Colour palette on fabric:** Saffron `#F7941D`, Crimson `#CC2936`, Indigo `#1A237E`, Fuchsia `#E0457B`, Peacock Teal `#168AAD`, Marigold `#FFB627`, Zari Gold `#D4AF37`
- **Style:** Editorial digital illustration — NOT photorealistic, NOT photography
- **Text zone:** Every image must reserve a deliberate CLEAN cream area where the website text will live. This zone must contain zero elements — no ghost motifs, no fabric edges, nothing

**Typography in code:**
- Display / headlines: `'Cormorant Garamond', serif` — weight 300
- Body / UI: `'DM Sans', sans-serif`
- Labels / data / mono: `'IBM Plex Mono', monospace`

---

---

# SECTION 04
## Precision Is Our Process. Excellence Is Our Standard.

---

### 1. Purpose

After showing how fabric physically moves through the factory (Section 03 — horizontal Process scroll), this section answers the question the visitor is now asking:

> "How do I know my fabric will come back perfect?"

This is not another process section. It is about the **standards** every metre must satisfy before it leaves Prabhakar Processors. It positions quality not as a feature but as a philosophy.

---

### 2. Storytelling Goal

Create the feeling of a master craftsman in a quiet room, examining every detail with total attention. Think of a luxury watchmaker. Everything is calm, precise, intentional. Nothing is rushed. The visitor should feel: *these people are obsessed with quality, and that obsession protects me.*

---

### 3. Layout

**Desktop:**
```
┌─────────────────────────────────────────────────────────────┐
│  LEFT 35%                  │  RIGHT 65%                     │
│  (cream, text)             │  (fabric image fills this)     │
│                            │                                │
│  OUR QUALITY               │  [Quality image]               │
│                            │                                │
│  Precision Is Our          │  Thin annotation lines float   │
│  Process.                  │  from left edge into image     │
│                            │  pointing to fabric details    │
│  Excellence Is Our         │                                │
│  Standard.                 │  • Colour Consistency ────     │
│                            │  • Print Precision ───────     │
│  [Body paragraph]          │  • Surface Finish ─────────    │
│                            │  • Quality Inspection ─────    │
│                            │  • Reliable Delivery ──────    │
└─────────────────────────────────────────────────────────────┘
```

- Section background: `#FAF0E6`
- Left column is pure text — no cards, no boxes, no icons
- Right column: the image fills the full height of the section, `object-fit: cover`, `object-position: left center`
- Annotation lines: thin SVG lines (`stroke: rgba(45,27,14,0.18)`, `stroke-width: 0.5px`) drawn from left text column into the right image
- Each annotation line ends in a small dot (`r: 3px`, fill: accent colour) and a label in IBM Plex Mono
- The lines must NOT look like UI cards or tooltips — they must look like engineering drawings or museum exhibit callouts

**Mobile:**
- Image becomes full-width at 55vh, sits above text
- Annotation lines collapse — indicators shown as a simple stacked list below the paragraph

---

### 4. Animation

- **Section entry:** When the section scrolls 20% into view, the left text block fades in and rises `translateY(24px → 0)` over 1s, ease-out-quart
- **Image:** Gently scales from `scale(0.98)` to `scale(1.0)` as it enters, over 1.4s — very subtle, not bouncy
- **Annotation lines:** SVG `stroke-dashoffset` animation — each line draws itself in sequence, 0.3s apart, starting 0.6s after section entry. Easein-out. Duration per line: 0.7s
- **Annotation dots:** Fade in at `opacity: 0 → 1` after their line finishes drawing
- **Hover on annotation label:** The connected fabric area (defined as a `clip-path` region over the image) brightens — achieved with a semi-transparent white overlay that fades from `opacity: 0.12 → 0` on hover. Transition: 0.3s ease

---

### 5. Content

```
LABEL:        OUR QUALITY

HEADLINE:     Precision Is Our Process.
              Excellence Is Our Standard.

BODY:         Every metre of fabric that leaves Prabhakar Processors
              carries more than colour and craftsmanship — it carries
              our commitment to consistency. From shade accuracy and
              print precision to surface finish and final inspection,
              every detail is carefully verified to ensure the fabric
              performs exactly as expected.

ANNOTATION 1: Colour Consistency
              Uniform shades engineered for repeatability across
              every production batch.

ANNOTATION 2: Print Precision
              Sharp motifs, clean registration and flawless
              pattern alignment.

ANNOTATION 3: Surface Finish
              Texture, softness and appearance perfected
              for every application.

ANNOTATION 4: Quality Inspection
              Every fabric roll undergoes thorough inspection
              before dispatch.

ANNOTATION 5: Reliable Delivery
              Processed, packed and delivered with
              consistency and care.
```

---

### 6. Image Assets

| File Name | Dimensions | Description |
|-----------|------------|-------------|
| `quality-hero-desktop.png` | 1920 × 1080 | Main quality image — right side of section |
| `quality-hero-mobile.png` | 1080 × 1920 | Portrait version for mobile — top of section |

**Text zone:**
- Desktop: LEFT 35% of frame (full height) — completely empty cream
- Mobile: TOP 40% of frame (full width) — completely empty cream

---

### 7. AI Image Prompt

**`quality-hero-desktop.png`** (1920 × 1080):

```
Editorial digital illustration for a premium Indian textile processing company website.
Warm flat ivory-cream background (#FAF0E6), perfectly solid, no gradient.

LEFT 35% of frame: COMPLETELY EMPTY — zero elements, no motifs, no fabric edges,
absolutely nothing. This area is reserved for overlaid website text.

RIGHT 65%: An ultra-close editorial composition of beautifully folded premium woven
fabric. The fabric is a rich blend featuring jacquard weave with subtle raised floral
and geometric patterns. Colours in the fabric: deep navy (#1A237E), warm ivory cream,
soft amber/saffron accents, with a delicate zari (gold thread) selvedge border catching
the light. The fabric is photographed at an angle that reveals its surface texture and
the depth of its weave — you can see individual threads. Multiple layers of fabric
fold over one another creating elegant shadow play.

Background behind fabric at 8% opacity: ultra-fine warm sepia (#8B6914) line-art of
a Mughal palace facade with ornate arched windows. At 5% opacity: scattered Indian
floral outline motifs in gold (#D4AF37).

Lighting: Soft directional light from upper-left creating gentle shadows that reveal
the fabric's surface texture. The fabric feels precious, handcrafted, controlled.

Mood: Precise, calm, museum-quality. The fabric is the subject. Its perfection is
the message.

No text. No people. No hands. No icons. No annotation lines (those are added in code).
1920×1080px landscape.
```

**`quality-hero-mobile.png`** (1080 × 1920):

```
Same visual style. TOP 40% of frame: COMPLETELY EMPTY clean cream.
BOTTOM 60%: the folded premium jacquard fabric fills the lower portion,
entering from the bottom edge, rising to approximately mid-frame.
Ghost Mughal architecture at 8% behind fabric in the mid-zone.
1080×1920px portrait.
```

---

### 8. Developer Notes

**Component:** `src/components/sections/QualitySection.jsx`

**Structure:**
```jsx
<div className="quality-section">
  <div className="quality-left">
    <p className="qs-eyebrow">OUR QUALITY</p>
    <h2 className="qs-headline">...</h2>
    <p className="qs-body">...</p>
  </div>
  <div className="quality-right">
    <picture>
      <source media="(max-width: 768px)" srcSet="..." />
      <img className="quality-img" src="..." />
    </picture>
    {/* SVG annotation overlay — positioned absolute over the image */}
    <svg className="quality-annotations">
      {ANNOTATIONS.map(a => (
        <g key={a.id}>
          <line className="annotation-line" x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} />
          <circle className="annotation-dot" cx={a.x2} cy={a.y2} r={3} />
        </g>
      ))}
    </svg>
    {/* Labels rendered as HTML positioned over the SVG */}
    {ANNOTATIONS.map(a => (
      <div className="annotation-label" style={{ left: a.labelX, top: a.labelY }}>
        <span className="al-title">{a.title}</span>
        <span className="al-desc">{a.desc}</span>
      </div>
    ))}
  </div>
</div>
```

**Key CSS:**
- `.quality-section` — `display: grid; grid-template-columns: 35% 65%; min-height: 100vh; background: #FAF0E6`
- `.quality-right` — `position: relative; overflow: hidden`
- `.quality-img` — `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: left center`
- `.quality-annotations` — `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2`
- `.annotation-line` — `stroke: rgba(45,27,14,0.2); stroke-width: 0.5; stroke-dasharray: 1000; stroke-dashoffset: 1000` (animate to 0)
- `.annotation-label` — `position: absolute; z-index: 3` — IBM Plex Mono for title, DM Sans for desc

**GSAP animation pattern:**
```js
// Lines draw in sequence
annotations.forEach((el, i) => {
  gsap.to(el, {
    strokeDashoffset: 0,
    duration: 0.7,
    ease: 'power2.inOut',
    delay: 0.6 + i * 0.3,
    scrollTrigger: { trigger: section, start: 'top 70%' }
  })
})
```

---

---

# SECTION 05
## More Than Processing. A Complete Textile Partner.

---

### 1. Purpose

Most competitors offer one or two processing services. This section communicates that Prabhakar manages the **entire journey** — from collecting raw grey fabric at the client's premises to delivering finished textiles back. It positions Prabhakar as a full manufacturing partner, not a vendor.

---

### 2. Storytelling Goal

The visitor should feel that *everything is taken care of*. The relief of not having to coordinate multiple vendors. One call, one relationship, one company that handles the entire chain. The journey metaphor makes this visceral rather than abstract.

---

### 3. Layout

**A vertical flowing journey on desktop; compact stacked on mobile.**

The section uses a central vertical path (a thin warm-gold line or thread) that flows from top to bottom. Eight illustrated milestones are positioned alternating left and right of the path.

```
                        [HEADER — centred]

Left                 Thread line                 Right
                          │
[Customer Image]          ●  Customer
                          │
          [Grey Fabric]   ●  Grey Collection
                          │
[Dyeing Image]            ●  Dyeing
                          │
            [Printing]    ●  Printing
                          │
[Finishing Image]         ●  Finishing
                          │
          [Inspection]    ●  Inspection
                          │
[Packing Image]           ●  Packing
                          │
           [Delivery]     ●  Delivery to You
```

- Background: `#FAF0E6`
- The thread line: 1px warm gold `#D4AF37`, drawn as an animated SVG path
- Each milestone dot: 10px circle, gold fill, with a pulse ring animation
- Milestone label: IBM Plex Mono, small caps, warm brown
- Illustration: positioned beside its milestone dot
- Short description text beneath each label

**Mobile:** Single column — image above, label and text below, thread runs down the centre

---

### 4. Animation

- **Thread line:** SVG path draws itself from top to bottom as user scrolls through the section. `stroke-dashoffset` animation tied to scroll progress (GSAP ScrollTrigger scrub)
- **Milestone illustrations:** Each fades in and rises `translateY(20px → 0)` when the thread reaches its dot
- **Milestone dots:** Pulse ring — a `box-shadow` or SVG circle that expands and fades, repeating every 2.5s on the active milestone
- **Section header:** Standard fade-in + rise on scroll entry

---

### 5. Content

```
LABEL:        OUR ECOSYSTEM

HEADLINE:     More Than Processing.
              A Complete Textile Partner.

BODY:         From collecting raw grey fabric to delivering finished
              textiles ready for production, every stage is managed
              with precision, reliability and transparency. Our
              integrated workflow simplifies operations, reduces
              coordination and ensures your fabric moves efficiently
              from start to finish.

MILESTONES:
  1. Customer          Your order starts with a conversation.
  2. Grey Collection   We collect raw fabric from your location or market.
  3. Dyeing            3,50,000 metres transformed daily.
  4. Printing          2,50,000 metres printed per day.
  5. Finishing         Surface perfected for every application.
  6. Inspection        Every roll checked before it leaves.
  7. Packing           Prepared securely for safe transport.
  8. Delivery          Back at your door, on time. Every time.
```

---

### 6. Image Assets

Eight editorial illustrations with transparent backgrounds so the thread line is visible behind them.

| File Name | Dimensions | Shows |
|-----------|------------|-------|
| `journey-01-customer.png` | 360 × 360 | Two hands exchanging a fabric swatch |
| `journey-02-grey-fabric.png` | 360 × 360 | Stacked grey fabric rolls |
| `journey-03-dyeing.png` | 360 × 360 | Fabric entering a dye vessel |
| `journey-04-printing.png` | 360 × 360 | Fabric running through a print roller |
| `journey-05-finishing.png` | 360 × 360 | Fabric flowing off a finishing frame |
| `journey-06-inspection.png` | 360 × 360 | A fabric roll under a quality light |
| `journey-07-packing.png` | 360 × 360 | Neatly wrapped fabric rolls with labels |
| `journey-08-delivery.png` | 360 × 360 | A fabric bolt being loaded, ready for dispatch |

**All 8 images share:**
- Transparent background (PNG with alpha)
- Same warm natural lighting from upper-left
- Same camera angle (slight elevated 3/4 view)
- Same visual weight and scale
- Indian illustrative editorial style — NOT photorealistic

---

### 7. AI Image Prompts

**Shared style prefix for all 8 images:**
```
Editorial digital illustration for a premium Indian textile processing company.
Transparent background (PNG). Warm natural light from upper-left. Indian illustrative
style — detailed, rich, editorial but not photorealistic. Consistent camera angle:
slight elevated 3/4 view. No text. No logos. Warm ivory and gold palette.
Square composition 360×360px. The subject should be centered with breathing room
on all sides. Sophisticated, clean, premium.
```

**Stage-specific subjects to append:**

1. `journey-01-customer.png` — *Two elegant hands gently exchanging a carefully folded swatch of premium Indian fabric. The fabric is ivory with a gold border. Warm, trusting mood.*

2. `journey-02-grey-fabric.png` — *Three to four neatly stacked rolls of unprocessed grey synthetic fabric (polyester/viscose weave). The fabric is silvery-grey, fine weave, unprinted. The rolls are arranged with care.*

3. `journey-03-dyeing.png` — *Flowing fabric entering a richly coloured dye environment — the fabric transitions from grey on one side to deep saffron on the other. The colour spread is organic, like ink in water. No machinery visible.*

4. `journey-04-printing.png` — *Fabric with a vivid Indian block-print floral pattern being laid flat, showing the precision of the print registration. Pattern in crimson and indigo on ivory fabric. Clean, precise.*

5. `journey-05-finishing.png` — *A length of deep peacock-teal fabric flowing smoothly, its suede-like surface catching the light. The fabric looks perfectly finished — silky, smooth, treated. No machinery visible.*

6. `journey-06-inspection.png` — *A tightly rolled fabric bolt positioned under a focused beam of warm light, as if being inspected. The light reveals the fabric's texture and uniform colour. No people.*

7. `journey-07-packing.png` — *Three finished fabric bolts of different colours — saffron, deep indigo, and crimson — neatly wrapped and stacked, with cream paper wrapping and gold labels. Ready for dispatch.*

8. `journey-08-delivery.png` — *Finished fabric bolts arranged as if being loaded, creating a sense of completion and departure. A warm sense of delivery fulfilled. No vehicles. The bolts are the subject.*

---

### 8. Developer Notes

**Component:** `src/components/sections/EcosystemSection.jsx`

**Key structure:**
```jsx
<div className="ecosystem-section">
  <div className="eco-header"> ... </div>
  <div className="eco-journey">
    {/* SVG thread line — full height of journey div */}
    <svg className="eco-thread">
      <path id="thread-path" d="M 50% 0 L 50% 100%" />
    </svg>
    {MILESTONES.map((m, i) => (
      <div className={`eco-milestone eco-milestone--${i % 2 === 0 ? 'left' : 'right'}`} key={m.id}>
        <img className="eco-illus" src={m.image} />
        <div className="eco-dot">
          <div className="eco-dot-ring" />
        </div>
        <div className="eco-label">
          <span className="eco-label-name">{m.name}</span>
          <span className="eco-label-desc">{m.desc}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

**GSAP thread animation:**
```js
gsap.to('#thread-path', {
  strokeDashoffset: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.eco-journey',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
  }
})
```

**CSS key points:**
- `.eco-journey` — `position: relative; display: flex; flex-direction: column; gap: 5rem; padding: 4rem 0`
- `.eco-thread` — `position: absolute; left: 50%; transform: translateX(-50%); width: 1px; height: 100%; z-index: 0`
- `.eco-milestone--left` — `flex-direction: row; justify-content: flex-end` (image right, dot centre, text left)
- `.eco-milestone--right` — `flex-direction: row` (text right, dot centre, image left)
- `.eco-dot` — `width: 10px; height: 10px; border-radius: 50%; background: #D4AF37; z-index: 2`
- `.eco-dot-ring` — `animation: dotPulse 2.5s ease-out infinite` (expanding ring effect)

---

---

# SECTION 06
## Crafted For Every Textile Business.

---

### 1. Purpose

Rather than listing industries generically, this section helps visitors immediately recognise themselves — whether they are a garment manufacturer, fashion brand, textile exporter, or home textile business. It demonstrates that Prabhakar's capabilities adapt to very different business needs.

---

### 2. Storytelling Goal

Each visitor sees their own world reflected back. A garment manufacturer sees reliability at scale. A fashion brand sees colour accuracy. An exporter sees international quality. A home textile business sees comfort and refinement. The section says: *we understand your specific business, not just fabric.*

---

### 3. Layout

**Full-screen editorial slider. One business category per slide.**

```
┌─────────────────────────────────────────────────────────────┐
│  LEFT 38%                    │  RIGHT 62%                   │
│  (cream, text)               │  (full-bleed category image) │
│                              │                              │
│  GARMENT MANUFACTURERS       │  [Category editorial image]  │
│                              │                              │
│  Consistency at Scale.       │                              │
│                              │                              │
│  Reliable production that    │                              │
│  keeps your manufacturing    │                              │
│  lines moving.               │                              │
│                              │                              │
│  ○ ● ○ ○  (slide indicators) │                              │
└─────────────────────────────────────────────────────────────┘
```

- Background: `#FAF0E6`
- Left column: text, navigation dots at bottom
- Right column: image fills full height, transitions between slides
- Category name: IBM Plex Mono, small, uppercase — above headline
- Headline: Cormorant Garamond, weight 300, large
- Body: DM Sans, small, muted
- Slide nav: four dots, gold active state
- Optional: small left/right arrows in the cream zone

---

### 4. Animation

- **Slide transition:** Horizontal slide with `translate(-100%, 0)` exiting left, new slide entering from right. Duration 0.6s, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Image transition:** Cross-dissolve (opacity 0→1) overlapping with slide movement, creating a fabric-morphing illusion
- **Text:** On each slide change, headline drops in from `translateY(-16px)` over 0.5s with 0.15s delay
- **Auto-advance:** Slides auto-advance every 5 seconds if user is not interacting
- **Scroll trigger:** Section activates (starts autoplaying) when 50% in view

---

### 5. Content

```
LABEL:    WHO WE SERVE

HEADLINE: Crafted For Every
          Textile Business.

SLIDES:

  SLIDE 1
  Category:    Garment Manufacturers
  Headline:    Consistency at Scale.
  Body:        Reliable production that keeps your manufacturing
               lines moving without compromise.

  SLIDE 2
  Category:    Fashion Brands
  Headline:    Colours That Stay True.
  Body:        Distinctive shades and premium finishes designed
               to elevate every collection.

  SLIDE 3
  Category:    Textile Exporters
  Headline:    Quality That Travels.
  Body:        Global-quality processing that meets demanding
               international expectations.

  SLIDE 4
  Category:    Home Textile Businesses
  Headline:    Crafted for Everyday Comfort.
  Body:        Soft textures, lasting colours and refined finishes
               built for modern living.
```

---

### 6. Image Assets

| File Name | Dimensions | Shows |
|-----------|------------|-------|
| `serve-01-garment.png` | 1920 × 1080 | Garment manufacturing context |
| `serve-02-fashion.png` | 1920 × 1080 | Fashion brand context |
| `serve-03-export.png` | 1920 × 1080 | Export quality context |
| `serve-04-home.png` | 1920 × 1080 | Home textile context |

**Text zone for all 4 images:** LEFT 38% of frame, full height — completely empty cream.

---

### 7. AI Image Prompts

**Shared prefix for all 4:**
```
Editorial digital illustration for a premium Indian textile company website.
Warm flat ivory-cream background (#FAF0E6), perfectly solid.
LEFT 38% of frame: COMPLETELY EMPTY clean cream — zero elements, reserved for text.
RIGHT 62%: the illustrated scene, richly detailed.
Ghost Mughal architectural line-art in background at 8% opacity, warm sepia.
Scattered Indian floral outline motifs at 5% opacity, warm gold.
Indian textile fabrics featured prominently in each scene.
No text. No people (unless specified). No logos.
Warm editorial illustration style, not photorealistic photography.
1920×1080px landscape.
```

**Stage-specific additions:**

`serve-01-garment.png` — *Neatly folded and stacked deep indigo and saffron garment fabrics arranged on a clean surface, suggesting a production environment. Precision and volume. Multiple folded lengths showing uniform colour across a large quantity.*

`serve-02-fashion.png` — *A single length of exquisitely printed Indian fabric — vivid crimson with delicate ivory floral motifs — draped artfully in a flowing sculptural arrangement. The fabric itself is the fashion statement. Elegant, aspirational.*

`serve-03-export.png` — *Multiple tightly rolled and individually labelled fabric bolts in different rich colours — deep navy, marigold, peacock teal — arranged as if ready for international dispatch. The labels are gold with cream paper wrapping. A sense of precision and global readiness.*

`serve-04-home.png` — *Soft, inviting fabric textures in warm ivory and sage tones, loosely draped as if in a refined home environment. The fabric feels comfortable and refined. One piece shows a delicate jacquard weave. Warm, domestic, quality.*

---

### 8. Developer Notes

**Component:** `src/components/sections/ServeSection.jsx`

**State management:**
```js
const [current, setCurrent] = useState(0)
const [direction, setDirection] = useState(1) // 1=forward, -1=back

const goTo = (idx) => {
  setDirection(idx > current ? 1 : -1)
  setCurrent(idx)
}
```

**Key structure:**
```jsx
<div className="serve-section">
  <div className="serve-left">
    <p className="serve-eyebrow">WHO WE SERVE</p>
    <h2 className="serve-master-headline">Crafted For Every<br/>Textile Business.</h2>
    <div className="serve-slide-text">
      <span className="serve-category">{SLIDES[current].category}</span>
      <h3 className="serve-slide-headline">{SLIDES[current].headline}</h3>
      <p className="serve-slide-body">{SLIDES[current].body}</p>
    </div>
    <div className="serve-dots">
      {SLIDES.map((_, i) => <button key={i} className={`serve-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />)}
    </div>
  </div>
  <div className="serve-right">
    {/* Images stack on top of each other, active one has opacity:1 */}
    {SLIDES.map((s, i) => (
      <img key={s.id} className={`serve-img ${i === current ? 'active' : ''}`} src={s.image} />
    ))}
  </div>
</div>
```

**CSS key points:**
- `.serve-section` — `display: grid; grid-template-columns: 38% 62%; min-height: 100vh; background: #FAF0E6`
- `.serve-right` — `position: relative; overflow: hidden`
- `.serve-img` — `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: left center; opacity: 0; transition: opacity 0.6s ease`
- `.serve-img.active` — `opacity: 1`
- `.serve-dot.active` — `background: #D4AF37; transform: scale(1.4)`
- Auto-advance: `useEffect` with `setInterval(5000)`, cleared on user interaction

---

---

# SECTION 07
## Built On Long-Term Partnerships.

---

### 1. Purpose

Replace generic star-rated testimonials with something that feels earned and authentic — the visual metaphor of woven fabric labels, each one representing a real, lasting relationship. This section builds trust not through quotes but through the texture of long-term commitment.

---

### 2. Storytelling Goal

The visitor should feel the weight of history and loyalty. Like walking through a room where every label on a garment is a story. These aren't just clients — they are partners who keep coming back. The message: *Prabhakar doesn't chase transactions. It builds relationships that outlast trends.*

---

### 3. Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER — left aligned, cream background]                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Full-width woven labels image as background]      │   │
│  │                                                     │   │
│  │  [Floating label cards — semi-transparent]          │   │
│  │    ┌─────────┐  ┌─────────┐  ┌─────────┐           │   │
│  │    │ Label 1 │  │ Label 2 │  │ Label 3 │           │   │
│  │    └─────────┘  └─────────┘  └─────────┘           │   │
│  │    ┌─────────┐  ┌─────────┐                         │   │
│  │    │ Label 4 │  │ Label 5 │                         │   │
│  │    └─────────┘  └─────────┘                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Body text — centred below image block]                    │
└─────────────────────────────────────────────────────────────┘
```

- Cream background section
- Full-width image panel (70vh) with the woven-labels texture
- Six floating label cards positioned irregularly over the image (slight varied rotations: -2° to +2°)
- Each card: `background: rgba(250,240,230,0.88); backdrop-filter: blur(4px); border: 1px solid rgba(212,175,55,0.3)`
- On hover: card expands to reveal partner story (Framer Motion `layoutId` animation)
- Collapsed card shows: category icon (fabric motif) + duration (e.g., "Since 2017")
- Expanded card shows: Business Type, Partnership Duration, one short quote

---

### 4. Animation

- **Background image:** Parallax scroll — moves at 0.6× scroll speed relative to the section, creating depth
- **Label cards:** Stagger fade-in on section entry — each card appears with `opacity: 0 → 1` and `translateY(12px → 0)`, 0.15s apart
- **Hover expand:** Framer Motion `AnimatePresence` with layout animation — card smoothly expands to show full content
- **Subtle float:** Each card has a very subtle `translateY` oscillation (2px range, 3–4s period, each card offset) using CSS `animation`

---

### 5. Content

```
LABEL:    TRUSTED BY

HEADLINE: Built On Long-Term
          Partnerships.

BODY:     Trusted by manufacturers, exporters and brands who value
          consistency, reliability and long-term collaboration.
          Every relationship begins with a single order and grows
          into something far more enduring.

PARTNER LABELS (6):

  1. Business Type: Garment Manufacturer
     Duration: 14 Years
     Quote: "Colour consistency that keeps our production on schedule."

  2. Business Type: Fashion Brand
     Duration: 9 Years
     Quote: "Every collection, the shades arrive exactly as specified."

  3. Business Type: Textile Exporter
     Duration: 11 Years
     Quote: "International quality without the complexity."

  4. Business Type: Home Textiles
     Duration: 7 Years
     Quote: "The finishing quality transformed our product line."

  5. Business Type: Wholesale Trader
     Duration: 6 Years
     Quote: "Volume, speed and quality — all three, consistently."

  6. Business Type: Premium Retailer
     Duration: 5 Years
     Quote: "Our customers notice the difference. That matters."
```

---

### 6. Image Assets

| File Name | Dimensions | Shows |
|-----------|------------|-------|
| `partnerships-bg.png` | 1920 × 700 | Woven fabric labels on textile surface |

---

### 7. AI Image Prompt

**`partnerships-bg.png`** (1920 × 700):

```
Editorial digital illustration for a premium Indian textile company website.
A rich, warm textile surface covered with dozens of small neatly stitched woven
fabric labels arranged in organic rows. The surface itself is a fine woven fabric
in warm ivory and champagne tones. Each label is a small rectangle of woven cloth
in various neutral tones — ivory, cream, warm grey, pale gold — with subtle woven
border patterns (no text, no logos on any label). The labels are stitched at
slight angles, creating an organic hand-assembled quality.

The overall image has depth — some labels are slightly blurred in the foreground,
creating a sense of a real textile surface. Warm soft directional light from the left.

This image will have floating card UI elements placed over it, so it should have
enough visual richness to be an interesting background but not so busy that it
overwhelms UI content.

Background at very low opacity: faint Indian architectural line-art in warm sepia.
No text. No logos. No numbers. Warm, premium, artisan. 1920×700px landscape.
```

---

### 8. Developer Notes

**Component:** `src/components/sections/PartnershipsSection.jsx`

**Requires:** `framer-motion` (already installed)

**Label card data structure:**
```js
const PARTNERS = [
  { id: 'P1', type: 'Garment Manufacturer', years: 14, quote: '...', x: '8%', y: '20%', rot: -1.5 },
  { id: 'P2', type: 'Fashion Brand', years: 9, quote: '...', x: '28%', y: '45%', rot: 1 },
  // ... etc
]
```

**Hover expansion using Framer Motion:**
```jsx
<motion.div
  className={`partner-label ${expanded === p.id ? 'expanded' : ''}`}
  layoutId={p.id}
  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
  style={{ left: p.x, top: p.y, rotate: p.rot }}
>
  {expanded === p.id ? <ExpandedContent p={p} /> : <CollapsedContent p={p} />}
</motion.div>
```

---

---

# SECTION 08
## Built For Tomorrow.

---

### 1. Purpose

Demonstrate that Prabhakar is not static. It invests in technology, refines its processes continuously, and operates with an awareness of its environmental responsibility. This counters any perception of being a traditional, unchanging industrial operation.

---

### 2. Storytelling Goal

Confidence in the future. The visitor should feel that working with Prabhakar is not just about today's order — it is about a partner who will still be excellent five years from now. Modern, thoughtful, forward-moving.

---

### 3. Layout

**Three-panel horizontal layout on desktop, stacked on mobile:**

```
┌──────────────┬──────────────┬──────────────┐
│  PANEL 1     │  PANEL 2     │  PANEL 3     │
│  [Image]     │  [Image]     │  [Image]     │
│              │              │              │
│  Modern      │  Continuous  │  Responsible │
│  Technology  │  Innovation  │  Manufacturing│
│              │              │              │
│  [body text] │  [body text] │  [body text] │
└──────────────┴──────────────┴──────────────┘
```

- Background: `#1A237E` (deep indigo) — dark, confident contrast after the light sections
- All text in cream `#FFF8F0`
- Images sit at the top of each panel, full width of panel, 55% of panel height
- Gold accent rules between headline and body
- Panel borders: 1px `rgba(212,175,55,0.15)` vertical lines

---

### 4. Animation

- **Section entry:** Panels stagger in from `translateY(36px)`, 0.2s apart
- **Panel images:** Subtle scale `0.97 → 1.0` on scroll entry
- **Gold rule under headline:** Draws in left-to-right on entry, `scaleX(0 → 1)`, 0.8s

---

### 5. Content

```
LABEL:    BUILT FOR TOMORROW

HEADLINE: Innovation In Every Thread.

PANELS:

  PANEL 1
  Title:   Modern Technology
  Body:    Advanced equipment delivering precision at every stage
           of production — from dye liquor preparation to final
           fabric inspection.

  PANEL 2
  Title:   Continuous Innovation
  Body:    Refining processes, adopting new techniques and
           improving efficiency — so that every batch is better
           than the last.

  PANEL 3
  Title:   Responsible Manufacturing
  Body:    Thoughtful production practices focused on resource
           efficiency and long-term sustainability for every
           stakeholder.
```

---

### 6. Image Assets

| File Name | Dimensions | Shows |
|-----------|------------|-------|
| `future-01-technology.png` | 640 × 480 | Precision textile technology |
| `future-02-innovation.png` | 640 × 480 | Water and fabric — resource elegance |
| `future-03-responsible.png` | 640 × 480 | Modern industrial textile environment |

---

### 7. AI Image Prompts

**Shared prefix for all 3** (for the dark indigo-background section):
```
Editorial digital illustration for a premium Indian textile technology company.
Deep warm dark background in deep indigo (#1A237E), not black.
Warm gold (#D4AF37) and ivory (#FFF8F0) accents in the illustration.
Indian illustrative style — detailed and editorial, not photorealistic.
Clean minimal composition. No text. No logos. 640×480px landscape.
Square-ish crop, generous breathing room around subject.
```

`future-01-technology.png` — *Abstract representation of precision measurement — delicate calibration instruments, fine threads, and precise fabric selvedge edges. The mood is scientific and controlled. Gold thread details and measured precision.*

`future-02-innovation.png` — *Water interacting elegantly with fine fabric threads — droplets beading on a water-repellent surface, showing both craft and science. The water forms perfect spheres, revealing the fabric's treated surface. Poetic and precise.*

`future-03-responsible.png` — *Abstract aerial view of orderly textile production — neatly ordered fabric rolls, clean floor patterns, organised workflow suggested through form and arrangement rather than machinery. Serene, efficient, modern.*

---

### 8. Developer Notes

**Component:** `src/components/sections/FutureSection.jsx`

**CSS:**
- `.future-section` — `background: #1A237E; padding: 8rem 6vw; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: linear-gradient(#1A237E, #1A237E)` (use gap background trick for dividers)
- `.future-panel` — `background: #1A237E; padding: 3rem 2.5rem; display: flex; flex-direction: column`
- `.future-panel-img` — `width: 100%; aspect-ratio: 4/3; object-fit: cover; margin-bottom: 2rem`
- `.future-panel-title` — Cormorant Garamond, weight 400, 1.6rem, color `#FFF8F0`
- `.future-rule` — `width: 28px; height: 1px; background: #D4AF37; margin: 0.8rem 0 1rem`
- `.future-panel-body` — DM Sans, 0.84rem, `rgba(255,248,240,0.55)`, line-height 1.8

---

---

# SECTION 09
## Meet The People Behind Every Metre.

---

### 1. Purpose

Humanise the company. Behind every processing standard is a person who set it. Behind every on-time delivery is someone who ensured it. This section introduces the leadership and their philosophy, transforming Prabhakar from a factory into a team of people who take pride in their work.

---

### 2. Storytelling Goal

Trust through humanity. The visitor should feel that real, thoughtful, committed people are responsible for their fabric. Not a faceless industrial operation. The philosophy quote should feel like something the founders genuinely believe — because it shapes every decision.

---

### 3. Layout

**Two-column: left text, right image. Full viewport height.**

```
┌──────────────────────────┬──────────────────────────────────┐
│  LEFT 45%                │  RIGHT 55%                       │
│  (cream)                 │  (leadership image)              │
│                          │                                  │
│  OUR PEOPLE              │  [Leadership editorial image]    │
│                          │                                  │
│  Meet The People         │                                  │
│  Behind Every Metre.     │                                  │
│                          │                                  │
│  [Philosophy quote —     │                                  │
│   large italic, spanning │                                  │
│   most of left column]   │                                  │
│                          │                                  │
│  — Founder, Prabhakar    │                                  │
│    Processors            │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

- Background: `#FAF0E6`
- Left column: eyebrow, headline, large philosophy quote in italic Cormorant, attribution
- Right column: image fills full height, `object-fit: cover`, `object-position: center`

---

### 4. Animation

- **Left column:** Fades in and rises on scroll entry
- **Quote:** Appears word by word using a text-reveal clip animation (words slide up from below a hidden overflow container, staggered 0.04s per word)
- **Image:** Subtle parallax — moves at 0.8× scroll speed

---

### 5. Content

```
LABEL:    OUR PEOPLE

HEADLINE: Meet The People Behind
          Every Metre.

PHILOSOPHY QUOTE:
          "For us, textile processing isn't simply manufacturing.
          It is the responsibility of transforming every metre
          entrusted to us into something our customers can
          confidently build their products upon."

ATTRIBUTION: — Founder, Prabhakar Processors Pvt Ltd
```

---

### 6. Image Assets

| File Name | Dimensions | Shows |
|-----------|------------|-------|
| `team-leadership.png` | 1920 × 1080 | Leadership editorial composition |

**Text zone:** LEFT 45% of frame, full height — completely clean cream.

---

### 7. AI Image Prompt

**`team-leadership.png`** (1920 × 1080):

```
Editorial digital illustration for a premium Indian corporate textile company website.
Warm flat ivory-cream background (#FAF0E6), perfectly solid.

LEFT 45% of frame: COMPLETELY EMPTY clean cream — zero elements.

RIGHT 55%: An elegant editorial composition featuring two or three professionally
dressed Indian business figures standing in a refined setting. They are depicted
in a sophisticated illustrative style — not photorealistic portraits, but editorial
illustrations similar to luxury brand catalogues.

The figures are dressed in subtle, refined business attire — warm neutral tones,
well-fitted. Their posture is confident, calm, and professional.

Behind them at 8% opacity: ultra-fine sepia line-art of a Mughal architectural
interior — arched doorways, ornate columns. At 5% opacity: scattered Indian
floral outline motifs in warm gold.

The overall mood is: trustworthy, established, confident, human.
No text. No logos. 1920×1080px.
```

---

### 8. Developer Notes

**Component:** `src/components/sections/TeamSection.jsx`

**Word-reveal animation:**
```js
// Split quote into words, animate each
const words = quote.split(' ')
words.forEach((word, i) => {
  gsap.from(wordRefs[i], {
    yPercent: 110,
    opacity: 0,
    duration: 0.5,
    delay: 0.3 + i * 0.04,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 65%' }
  })
})
```

**CSS for word-reveal:**
```css
.quote-word-wrapper {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
}
.quote-word {
  display: inline-block;
}
```

---

---

# SECTION 10
## Let's Build Something Exceptional Together.

---

### 1. Purpose

The closing section. The narrative has moved from raw grey fabric → process → quality → partnership → future → people. Now it ends with an invitation. This is not a generic contact form — it is the culmination of the story, a moment that says: *we've shown you who we are. Now let's begin.*

---

### 2. Storytelling Goal

The emotional tone shifts from informational to personal and warm. The visitor should feel a sense of arrival — the journey from the Hero section's "Where Grey Becomes Brilliant" has arrived at its conclusion: *you, choosing to begin a partnership that will produce something exceptional.*

---

### 3. Layout

**Full-viewport centred composition with a cinematic closing image:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Cinematic closing image — full bleed background]         │
│  [Warm dark overlay at 40%]                                 │
│                                                             │
│             LET'S BEGIN                                     │
│                                                             │
│      Let's Build Something                                  │
│      Exceptional Together.                                  │
│                                                             │
│      [Short body paragraph]                                 │
│                                                             │
│      +91 99099 70505                                        │
│      prabhakardyeing@gmail.com                              │
│      prabhakarprocessors.com                                │
│                                                             │
│      [Contact Us →]  (minimal text button, gold)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Full viewport height
- Background image fills entire section
- Warm semi-transparent dark overlay (`rgba(20, 10, 4, 0.55)`) — lets image show but text reads clearly
- All text in `#FFF8F0` cream
- Headline: Cormorant Garamond, large, italic, weight 300
- Contact details: IBM Plex Mono, small, with generous letter-spacing
- CTA button: text-only with gold underline, no box, no background

---

### 4. Animation

- **Background image:** Very slow Ken Burns effect — `scale(1.0 → 1.06)` over the time the section is in view, GSAP ScrollTrigger scrub
- **Content block:** Fades in as section enters, `opacity: 0 → 1`, `translateY(20px → 0)`, 1.2s
- **Contact items:** Stagger in one by one, 0.2s apart, after main content appears
- **CTA button:** Gold underline animates in `scaleX(0 → 1)` after 1s delay

---

### 5. Content

```
LABEL:    LET'S BEGIN

HEADLINE: Let's Build Something
          Exceptional Together.

BODY:     Grey fabric in. Exceptional cloth out. One company,
          one commitment, every time. Let's start with a conversation.

CONTACT:
  Phone:   +91 99099 70505
  Email:   prabhakardyeing@gmail.com
  Web:     prabhakarprocessors.com

CTA:      Contact Us →

ADDRESS:
  Plot No. 13/14, Block No. 296
  Village Tatithaiyya, Opp. Hotel Horizon Kadodara
  Surat – Bardoli Road · Gujarat – 394327
```

---

### 6. Image Assets

| File Name | Dimensions | Shows |
|-----------|------------|-------|
| `closing-hero-desktop.png` | 1920 × 1080 | Cinematic closing fabric image |
| `closing-hero-mobile.png` | 1080 × 1920 | Portrait version |

---

### 7. AI Image Prompt

**`closing-hero-desktop.png`** (1920 × 1080):

```
Cinematic editorial digital illustration for the closing section of a premium Indian
textile company website. Warm ivory-cream background (#FAF0E6).

A single flowing premium fabric ribbon in deep navy (#1A237E), warm saffron (#F7941D),
rich crimson (#CC2936) and ivory — beautifully draped and flowing, entering the
composition from the BOTTOM-RIGHT corner and sweeping upward and left across the
frame. The fabric carries subtle Indian block-print floral patterns. The drape creates
a sense of movement, continuation, and arrival — as if the fabric has completed its
journey and is now presented.

The fabric fills the right half and bottom of the frame. The UPPER-LEFT portion of
the frame is more open — not completely empty, but less dense — allowing for overlay
of text content with a dark overlay in CSS.

Background at 8% opacity: ultra-fine sepia Mughal architectural line-art.
At 5% opacity: scattered gold Indian floral outlines.

This image will have a warm dark CSS overlay (rgba(20,10,4,0.55)) applied,
so the image should be colourful and rich enough to show through the overlay.

No text. No people. No logos. Cinematic, warm, complete. 1920×1080px.
```

**`closing-hero-mobile.png`** (1080 × 1920):

```
Same style. The fabric enters from the BOTTOM-RIGHT and sweeps up.
UPPER 50% of frame: less dense fabric — the overlay text will sit here.
LOWER 50%: rich fabric composition filling the frame. 1080×1920px portrait.
```

---

### 8. Developer Notes

**Component:** `src/components/sections/ClosingSection.jsx` (replaces current ContactSection)

**Ken Burns animation:**
```js
gsap.to('.closing-bg-img', {
  scale: 1.06,
  ease: 'none',
  scrollTrigger: {
    trigger: '.closing-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
})
```

**CSS:**
- `.closing-section` — `position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center`
- `.closing-bg-img` — `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: center center`
- `.closing-overlay` — `position: absolute; inset: 0; background: rgba(20,10,4,0.55)`
- `.closing-content` — `position: relative; z-index: 2; text-align: center; max-width: 680px; padding: 2rem`
- `.closing-cta-btn` — `background: none; border: none; color: #D4AF37; font-family: 'DM Sans'; font-size: 0.9rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; border-bottom: 1px solid currentColor; padding-bottom: 2px`

---

---

# IMAGE GENERATION MASTER CHECKLIST

Generate all images in the order listed. Check the ✓ box when each is complete.

## Existing Images — DO NOT REGENERATE

- ✅ `landing/hero-desktop.png` + mobile/tablet
- ✅ `landing/fabric-desktop.png` + mobile
- ✅ `landing/process-desktop.png` + mobile
- ✅ `main-process-01` through `main-process-05` (desktop + mobile)
- ✅ `main-brand-story-threads.png`
- ✅ `swatch-01` through `swatch-12`
- ✅ `hero-dye-bloom.mp4`

## New Images to Generate — Sections 04–10

### Section 04 — Quality
- [ ] `quality-hero-desktop.png` — 1920 × 1080 — Folded jacquard fabric, LEFT 35% empty
- [ ] `quality-hero-mobile.png` — 1080 × 1920 — Same, TOP 40% empty

### Section 05 — Ecosystem
- [ ] `journey-01-customer.png` — 360 × 360 — Transparent BG — Two hands, fabric swatch
- [ ] `journey-02-grey-fabric.png` — 360 × 360 — Transparent BG — Grey fabric rolls
- [ ] `journey-03-dyeing.png` — 360 × 360 — Transparent BG — Fabric entering dye
- [ ] `journey-04-printing.png` — 360 × 360 — Transparent BG — Printed fabric flat
- [ ] `journey-05-finishing.png` — 360 × 360 — Transparent BG — Finished teal fabric flowing
- [ ] `journey-06-inspection.png` — 360 × 360 — Transparent BG — Fabric roll under quality light
- [ ] `journey-07-packing.png` — 360 × 360 — Transparent BG — Wrapped fabric bolts ready
- [ ] `journey-08-delivery.png` — 360 × 360 — Transparent BG — Fabric bolts arranged for dispatch

### Section 06 — Who We Serve
- [ ] `serve-01-garment.png` — 1920 × 1080 — Stacked garment fabrics, LEFT 38% empty
- [ ] `serve-02-fashion.png` — 1920 × 1080 — Flowing fashion fabric, LEFT 38% empty
- [ ] `serve-03-export.png` — 1920 × 1080 — Labelled export bolts, LEFT 38% empty
- [ ] `serve-04-home.png` — 1920 × 1080 — Soft home textiles, LEFT 38% empty

### Section 07 — Partnerships
- [ ] `partnerships-bg.png` — 1920 × 700 — Woven labels on textile surface

### Section 08 — Future
- [ ] `future-01-technology.png` — 640 × 480 — Precision/calibration, dark indigo bg
- [ ] `future-02-innovation.png` — 640 × 480 — Water beading on fabric, dark indigo bg
- [ ] `future-03-responsible.png` — 640 × 480 — Orderly aerial production, dark indigo bg

### Section 09 — Team
- [ ] `team-leadership.png` — 1920 × 1080 — Leadership figures, LEFT 45% empty

### Section 10 — Closing CTA
- [ ] `closing-hero-desktop.png` — 1920 × 1080 — Cinematic fabric ribbon, bottom-right entry
- [ ] `closing-hero-mobile.png` — 1080 × 1920 — Portrait version

---

**TOTAL NEW IMAGES: 22**

---

## DELIVERY INSTRUCTIONS FOR GENERATED IMAGES

Place all new images in:
```
D:\Holoncode\Prabhakar_Processors\DOCS\Images\sections\
```

Then copy them to:
```
D:\Holoncode\Prabhakar_Processors\DOCS\website\public\assets\
```

File naming is exact — do not rename. The coding agent will reference these exact paths.

---

*End of Design Production Document — Sections 04–10*
*Prabhakar Processors Pvt Ltd · Surat, Gujarat*
