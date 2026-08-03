# THE CLOTH — Landing Page Design Concept
### Prabhakar Processors Pvt Ltd · New Landing Page
---

## The Problem This Document Solves

Every version built so far commits the same fundamental error: **images and text are two independent layers placed on top of each other.** The image sits as a CSS `background-image` and text is absolutely positioned to float above it. They are negotiating for the same space rather than being designed together.

The result feels like a presentation slide — content box on a wallpaper.

This document defines a completely different architecture: **image and text as co-equal elements within a single shared coordinate system.** The images used for these three sections already have the solution built into them — their compositions deliberately leave specific cream-coloured negative space. That space is not emptiness; it is the designed zone for typography. The moment we honour that, everything clicks into place.

---

## Core Philosophy: One Cloth, Three Moments

The landing page is not a website. It is not a brochure. It is a **cinematic experience** — specifically, it is a bolt of cloth being slowly unrolled in front of the visitor.

Each scroll "moment" is one section of that cloth being revealed:
- **Moment 1:** The cloth in its brilliance — the transformation, the promise
- **Moment 2:** The cloth at its origin — raw, grey, full of possibility
- **Moment 3:** The cloth in its becoming — the dye meeting the fabric

The landing page has **one purpose only:** to make the visitor feel what Prabhakar does before they know anything about Prabhakar. Understanding comes later, on other pages. The landing page sells the emotion of transformation.

**Therefore — and this is absolute — the landing page contains:**
- Zero navigation bars
- Zero hamburger menus
- Zero "About Us", "Services", "Contact" sections
- Zero CTA buttons ("Get a Quote", "Learn More", "Call Now")
- Zero statistics grids
- Zero footer links
- Zero social media icons
- Zero forms
- Zero testimonials

All of that lives on the website. The landing page is the door.

---

## The Integrated Image + Text System

### Why Current Approaches Fail

```
❌  WRONG approach:
    .section { background-image: url(hero.png); }
    .headline { position: absolute; top: 20%; left: 5%; }

    Result: Two layers. The image is a wallpaper.
            The text is an afterthought placed wherever it fits.
            They share no relationship.
```

```
✅  RIGHT approach:
    <div class="moment"> ← shared coordinate parent
      <figure class="moment-image">  ← image at full dimensions
        <img src="hero.png" />
      </figure>
      <div class="moment-text" style="
        left: 5.5%;   ← coordinates that match the image's designed cream zone
        top: 12%;     ← not guessed — measured from the image composition
        width: 38%;   ← matches exactly the width of the cream zone
      ">
        <h1>Where Grey Becomes Brilliant.</h1>
      </div>
    </div>

    Result: Image and text share a coordinate system.
            The cream zone in the image and the text div are the same rectangle.
            They were always designed together. Now they ARE together.
```

### The Coordinate Grid

Each image has been studied to identify the precise cream zone percentages:

**Hero Image (flowing fabric — grey to vivid):**
```
Image aspect ratio: 16:9 (landscape)

Cream zone (text territory):
  Left edge:    0%
  Right edge:   42%
  Top edge:     0%
  Bottom edge:  60%

The fabric begins entering from bottom-left around x:0%, y:55%
The fabric fills right half completely
Top-left quadrant (0-42% × 0-60%) = clean cream — this is the canvas
```

**Grey Fabric Image (raw undyed fabric):**
```
Image aspect ratio: 4:3 approximately

Cream zone (text territory):
  Left edge:    0%
  Right edge:   46%
  Top edge:     10%
  Bottom edge:  72%

The grey fabric mass occupies right 55% from approximately mid-height down
Small ghost architecture appears at x:0%, y:70% — does not obstruct text
```

**Process Ribbons Image (dye transformation):**
```
Image aspect ratio: 4:3 approximately

Text zone — between the three ribbon waves:
  Between wave 1 (grey) and wave 2 (saffron dye cloud):
    x: 25-55%, y: 28-42%  ← the open cream space where the dye cloud lives
    
  The dye cloud occupies x: 10-32%, y: 28-50%
  Clean cream between-ribbon bands: x: 35-65% of each gap
```

---

## The Five Moments

The landing page is exactly **five scroll moments.** Nothing more.

### Moment 0 — The Label (Entry)
**Scroll position:** 0 to 50vh (no scroll needed — it is the initial state)

**What the visitor sees:**
- Pure cream `#FAF0E6` fill — the entire viewport
- A single centred typographic element:
  ```
  PRABHAKAR
  PROCESSORS PVT LTD
  ─────────────────
  SURAT, GUJARAT
  ```
  In Cormorant Garamond, weight 300, extremely large (clamp(4rem, 8vw, 7rem) for top line)
  Colour: `#2D1B0E` (warm dark brown)
  The horizontal rule is a thin 0.5px gold line

- Below this, after a 2.5 second delay, a small animated indicator appears:
  A single vertical line that elongates downward, with a faint "↓" at the tip
  This is the only instruction the page ever gives

**What happens:**
After the visitor begins to scroll (or after 4 seconds automatically), this label slides upward and disappears — like a title card at the start of a film.

**Why:**
Every great experience begins with a moment of stillness. The name is stated, then the story begins. No hero text. No subheadline. Just the name and the invitation to proceed.

---

### Moment 1 — The Brilliant (Hero)
**Scroll position:** 50vh to 250vh (pinned for 200vh of scroll travel)

**What the visitor sees:**
The hero image: flowing fabric transitioning from undyed greige (bottom-left entry) through saffron → fuchsia → deep indigo (flowing toward upper-right). Ghost Mughal architecture and rangoli line-work as atmospheric context.

**Text placed in the designed cream zone (top-left, 0–42% × 0–60%):**

```
Placement: left: 6%, top: 14%, width: 34%

Text content:
  [Line 1 — very small mono, gold]
  WHERE GREY BECOMES BRILLIANT
  
  [Line 2 — very large, Cormorant Garamond 300, dark brown]
  Seventeen
  years of
  colour.

No CTA. No button. Nothing else.
```

**Animation sequence (tied to scroll position, not time):**
- At scroll entry (0% through this section): cream zone text at opacity 0
- At scroll 20%: "WHERE GREY BECOMES BRILLIANT" label fades in at opacity 0.5
- At scroll 35%: "Seventeen years of colour." slides up and fades in
- At scroll 75%: both text elements gently fade to 0 as the next moment begins
- At scroll 100%: cross-dissolve to Moment 2

**The image:**
Not a background. An `<img>` element sized to `width: 100%; height: 100vh; object-fit: cover; object-position: center center`. The section is `position: relative; height: 100vh; overflow: hidden`. The text div is absolutely positioned within this same section, at the coordinates specified above.

**Result:** Image and text are in the same container. Moving one moves both. They are one element.

---

### Moment 2 — The Origin (Grey Fabric)
**Scroll position:** 250vh to 450vh (pinned for 200vh of scroll travel)

**What the visitor sees:**
The grey fabric image. Raw, undyed, woven cloth draped in sculptural folds against cream. Ghost Mughal architecture at bottom-left (small, atmospheric). The right half is entirely filled with the soft grey fabric. The left half is cream.

**Text placed in the designed cream zone (left, 0–46% × 10–72%):**

```
Placement: left: 6%, top: 18%, width: 36%

Text content:
  [Micro label, gold mono]
  THE FABRIC, BEFORE.

  [Large, Cormorant Garamond 300, dark brown]
  Every metre
  of grey fabric
  holds a colour
  it has not yet
  become.

  [Small, DM Sans, muted brown at 55% opacity]
  — Surat, Gujarat · Est. 2009
```

**Animation:**
- At scroll entry: text at opacity 0, translateX(-20px)
- At scroll 20%: micro label fades in
- At scroll 35%: poem text slides in line by line (stagger: 80ms each line)
- At scroll 60%: sub-attribution fades in
- At scroll 85%: all text gently fades as cross-dissolve begins

**Why this text:**
This is not a company description. It is an observation — almost poetic. It earns the company's identity as someone who truly understands fabric. No features list. No "we offer 12 services." Just the truth of what grey fabric is, and the implicit promise of what Prabhakar does with it.

---

### Moment 3 — The Process (Transformation Ribbons)
**Scroll position:** 450vh to 650vh (pinned for 200vh of scroll travel)

**What the visitor sees:**
The three horizontal ribbon waves. Grey fabric entering from the right at top. The saffron dye cloud exploding on the left in the middle band. Printed pink and purple fabric filling the lower band.

**Text:**
This moment has the least text of all. The image is already the most narrative-rich of the three — the process is happening visually. We do not explain what we are seeing. We only give scale.

```
Placement of the only text:
  Positioned in the cream space BETWEEN wave 1 and the dye cloud:
  left: 38%, top: 30%, 

  Text content (single element):
  [Very large, Cormorant Garamond 200 italic, saffron #F7941D]
  350,000
  [Small mono below, dark brown at 40% opacity]
  METRES TRANSFORMED · EVERY DAY
```

No other text. The three fabric waves tell the story.

**Animation:**
- At scroll 30%: "350,000" counts up from 0 (easeOutCubic, 1.8s)
- At scroll 45%: unit label fades in
- At scroll 85%: fade to Moment 4

---

### Moment 4 — The Invitation (Exit)
**Scroll position:** 650vh to 750vh

**What the visitor sees:**
The page returns to pure cream `#FAF0E6`.

Two elements appear in sequence:

```
First (at scroll 20% through this section):
  [Small, Cormorant Garamond 400 italic, dark brown at 60%]
  "From grey to brilliant — since 2009."

Then (at scroll 50%):
  [Navigation prompt — bottom-centre of screen]

  A thin horizontal gold line (52px wide)
  Then below it:
  EXPLORE THE FULL STORY  →
  
  In IBM Plex Mono, 0.58rem, letter-spacing 0.28em
  Colour: #2D1B0E at 70% opacity
  On hover: the line extends to full width of the viewport (1.2s ease transition)
             text shifts slightly right (+8px)
             colour goes to full 100% opacity
```

Clicking "EXPLORE THE FULL STORY" takes the visitor to the main website homepage — which is where all the conventional web content lives (navigation, services, process, scale, contact, footer).

**Why this matters:**
The landing page is the experience. The website is the information. By keeping them separate, both are better at what they do. The landing page doesn't apologise for not having a nav — it's deliberate. The visitor who has scrolled through all four moments arrives at the invitation having already felt the company's identity. They are ready to learn, not just browse.

---

## Technical Architecture

### Section Structure (for each pinned moment)

```html
<div class="cloth-moment" data-moment="1">
  <!-- The image — not a background, a real element -->
  <figure class="moment-figure">
    <img
      src="/images/hero-flowing-fabric.png"
      alt=""
      aria-hidden="true"
    />
  </figure>

  <!-- The text — same coordinate parent, precisely placed -->
  <div class="moment-text" data-zone="top-left">
    <span class="moment-eyebrow">WHERE GREY BECOMES BRILLIANT</span>
    <h2 class="moment-headline">
      Seventeen<br />years of<br />colour.
    </h2>
  </div>
</div>
```

```css
.cloth-moment {
  position: relative;    /* shared coordinate system */
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.moment-figure {
  position: absolute;
  inset: 0;
  margin: 0;
}

.moment-figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Text lives in the same coordinate space as the image */
.moment-text[data-zone="top-left"] {
  position: absolute;
  left: 6%;
  top: 14%;
  width: 34%;
  /* No z-index battles. Both elements are peers in the same stacking context. */
}
```

### Scroll Pinning

Use GSAP ScrollTrigger with `pin: true` on each `.cloth-moment`:

```javascript
STAGES.forEach((moment, i) => {
  ScrollTrigger.create({
    trigger: moment.element,
    start: 'top top',
    end: '+=200vh',
    pin: true,
    scrub: false,          // NOT scrub — text animates on thresholds, not continuously
    onEnter: () => moment.animateIn(),
    onLeave: () => moment.animateOut(),
    onEnterBack: () => moment.animateIn(),
    onLeaveBack: () => moment.animateOut(),
  })
})
```

Text entrance/exit are **threshold-based** (triggered at specific scroll percentages through each pinned section), not scrub-based. This means text appears with its own animation timing — a clean fade-in with upward drift — rather than being dragged mechanically by scroll position.

### The Cross-Dissolve

Between each moment, as the pinned section exits:
- Outgoing text: opacity 0 over 600ms
- Outgoing image: opacity fade to 0 over 900ms (delayed 200ms after text)
- Incoming image: fade in from 0 over 900ms
- Incoming text: opacity 0 → 1 over 700ms (delayed 400ms after image begins appearing)

The cream background is always underneath everything. The cross-dissolve always passes through cream — the cloth's consistent ground.

### Image Strategy (critical for integration)

The images must be:
- **Sized to match the viewport** — not scaled/zoomed arbitrarily. `object-fit: cover` with `object-position` tuned to keep the cream zone visible
- **Never used as `background-image`** — they are `<img>` elements, positioned elements with real dimensions
- **Loaded with `fetchpriority="high"`** on the first two images, `loading="lazy"` on Moments 3 and 4
- **Pre-loaded via `<link rel="preload">`** for the first two

For different screen ratios, each image has a designated `object-position` value:
```css
/* Hero image — keep cream zone visible on wide and tall screens */
.moment[data-moment="1"] img {
  object-position: 60% center;  /* pushes fabric right, preserves cream left */
}

/* Grey fabric image — fabric on right, cream on left preserved */
.moment[data-moment="2"] img {
  object-position: 70% 40%;
}

/* Process ribbons — keep all three waves visible */
.moment[data-moment="3"] img {
  object-position: center 45%;
}
```

---

## Typography System (Landing Page Only)

The landing page uses a deliberately minimal typographic palette. Maximum 3 typographic roles:

| Role | Font | Weight | Size | Colour | Usage |
|------|------|--------|------|--------|-------|
| Eyebrow | IBM Plex Mono | 400 | 0.58rem, tracking 0.28em | Gold `#D4AF37` | Section micro-labels |
| Headline | Cormorant Garamond | 300 | clamp(2.8rem, 5.5vw, 5rem) | Dark Brown `#2D1B0E` | The main statement per moment |
| Data | Cormorant Garamond | 200, italic | clamp(5rem, 11vw, 9rem) | Saffron `#F7941D` | The 350,000 number only |
| Attribution | DM Sans | 400 | 0.78rem | `#2D1B0E` at 52% opacity | Est. 2009 line only |

**Rules:**
- Never bold
- Never underlined
- Never centred (always left-aligned within its zone, because the zone is already on the left)
- No colour other than what is listed above
- Line height: 1.05–1.1 for headlines (tight, like print typography)
- No text-shadow, no drop-shadow, no backdrop blur — these are signs that text and image weren't designed together

---

## Colour System (Landing Page Only)

The images already define the palette. The landing page inherits it, never adds to it.

| Surface | Hex | Role |
|---------|-----|------|
| Cream | `#FAF0E6` | Page background, all negative space, Moment 0 and 4 |
| Dark Brown | `#2D1B0E` | All text |
| Gold | `#D4AF37` | Eyebrow labels, horizontal rules, scroll indicator |
| Saffron | `#F7941D` | The 350,000 number in Moment 3 only |

No other colours appear on the landing page. The saffron, pink, magenta, indigo, and purple exist inside the fabric illustrations only — they are not used in UI elements.

---

## Mobile Behaviour

Mobile requires rethinking the coordinate system because portrait images behave differently than landscape.

**The mobile versions of the images (portrait ratio) are already provided** — and they are beautifully composed for portrait. The grey fabric fills the lower 60% of the mobile hero. The cream zone occupies the upper 40%.

For mobile:

```
Cream zone (mobile hero):
  Top: 0%
  Bottom: 38%
  Full width

Text positioned:
  top: 12%
  left: 6%
  right: 6%
  (full width within the cream zone)
```

```css
@media (max-width: 768px) {
  .moment-text[data-zone="top-left"] {
    left: 6%;
    right: 6%;
    top: 12%;
    width: auto;   /* full width within cream zone */
  }

  .moment-figure img {
    object-position: center 30%;  /* push fabric to lower portion */
  }

  /* For moment 2 (grey fabric) — fabric fills lower frame on mobile */
  .moment[data-moment="2"] img {
    object-position: 65% 60%;
  }
}
```

On mobile, `pinning` is replaced with a **snap-scroll** approach:
- `scroll-snap-type: y mandatory` on the page
- Each `.cloth-moment` is `scroll-snap-align: start`
- Text animations trigger on `IntersectionObserver` (threshold 0.6) instead of ScrollTrigger
- This is simpler, more performant, and feels natural on touch devices

---

## What Lives on Other Pages

To be absolutely clear — everything removed from the landing page is not deleted, it moves to the **main website** (the experience after clicking "Explore the Full Story"):

**Main Website Homepage:**
- Full navigation
- Brand story section with "17 years" detail
- Process conveyor (GSAP horizontal scroll)
- Scale statistics (animated counters)
- Services swatch book
- Trust section
- CTA section
- Footer

The landing page is the *entrance.* The website is the *building.* They serve different purposes and should be designed separately.

---

## The "One System" Test

To verify that a design feels like one integrated system rather than image + text layers, apply this test:

**If you removed the image, would the text make visual sense on the cream background alone?**
Yes → the text is self-contained, the image is a background. ❌ Not integrated.

**If you removed the text, would the image composition still feel intentionally designed with negative space?**
Yes → the image was designed to contain the text. ✅ Integrated.

**If you moved the text 100px in any direction, would it break something?**
Yes → the text is anchored to a designed zone. ✅ Integrated.
No → the text is floating. ❌ Not integrated.

In the correct implementation, the text div occupies the precise cream rectangle of the image. Moving either one breaks the visual logic. They are one design.

---

## Implementation Checklist

- [ ] Section `position: relative` as shared coordinate parent for image + text
- [ ] Image as `<img>` element (not `background-image`), absolute inset-0
- [ ] Text div absolutely positioned with coordinates measured from image composition
- [ ] `object-position` tuned per moment to preserve cream zones at all viewport ratios
- [ ] GSAP ScrollTrigger pinning for desktop (200vh per moment)
- [ ] `scroll-snap-type: y mandatory` for mobile
- [ ] Text animation: threshold-based IntersectionObserver (not scrub)
- [ ] Cross-dissolve between moments: 900ms opacity transitions through cream
- [ ] `<link rel="preload">` for Moment 1 and 2 images
- [ ] Mobile portrait images used on screens <768px
- [ ] Zero navigation elements on this page
- [ ] "Explore the Full Story" link at Moment 4 routes to `/home` (main website)
- [ ] Page URL: `/` (landing) vs `/home` (main website)

---

## Summary

| | Old Approach | The Cloth |
|--|--|--|
| Image role | Background wallpaper | Co-equal layout element |
| Text placement | Absolute position, guessed | Coordinates matching designed cream zone |
| Coordinate system | Two separate layers | One shared parent |
| Scroll mechanic | Section-by-section | Cinematic pinned moments with cross-dissolve |
| Content on page | Everything | 5 text lines across 5 moments |
| Navigation | Present | Absent |
| First emotion | "This is a website" | "This is something else" |
| Purpose | Inform | Feel |

The landing page does not try to be a website. It tries to be the first five seconds of understanding why Prabhakar Processors exists.
