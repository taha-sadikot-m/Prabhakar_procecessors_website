# Image Generation Specification
### Prabhakar Processors Website — Complete Asset Plan
---

## What You Already Have (Generate Nothing New For These)

### Landing Page — All 7 images already exist in `dist/` folder

| Image | File | Used For |
|-------|------|----------|
| Flowing fabric (grey → vivid) | `dist/hero_section_image/desktop.png` | Landing · Moment 1 · Desktop |
| Same · tablet crop | `dist/hero_section_image/tablet_version.png` | Landing · Moment 1 · Tablet |
| Same · portrait | `dist/hero_section_image/mobile_version.png` | Landing · Moment 1 · Mobile |
| Grey draped fabric | `dist/second_section/desktop.png` | Landing · Moment 2 · Desktop |
| Same · portrait | `dist/second_section/mobile.png` | Landing · Moment 2 · Mobile |
| Three ribbon waves | `dist/third_section/desktop.png` | Landing · Moment 3 · Desktop |
| Same · portrait | `dist/third_section/mobile.png` | Landing · Moment 3 · Mobile |

### Swatch Book — All 12 texture images already exist, keep all

`swatch-01-piece-dyeing.png` through `swatch-12-foil-jari-print.png`
These are solid close-up fabric textures. They work exactly right as the face of the swatch cards. Do not regenerate.

### Video — Keep

`hero-dye-bloom.mp4` — Used as hero background on the main website homepage.

---

## What Needs To Be Generated

The 5 existing process images (`process-00` through `process-04`) are industrial photography with dark machinery and metal equipment. They completely break the visual language established by the landing page images. All 5 must be replaced. Additionally, 1 new image is needed for the Brand Story section.

**Total new images: 11**
- 6 desktop landscape images (1920 × 1080 · 16:9)
- 5 mobile portrait images (1080 × 1920 · 9:16) — for process stages only

---

## THE STYLE SYSTEM — Read This Before Generating Anything

Every new image must follow the same visual system used in the three landing page images. Refer to those images (in `dist/`) constantly while generating.

**Background:**
Flat, solid warm ivory-cream. Hex: `#FAF0E6`. No gradients, no texture, no vignette on the background itself. The fabric IS the visual subject — the background is the canvas, not a mood.

**Fabric:**
Indian textile. Synthetic or silk blend. Fine weave. Visible texture. Indian block-print patterns on the fabric: floral (butidar), geometric, ikat, paisley. Fabric should drape, fold, wave — never lie flat. Fabric has physical weight and translucency.

**Ghost elements (in background, very low opacity):**
- Indian architectural line-art (Mughal gateway, haveli facade, temple arch) at 8–10% opacity in warm sepia/brown (`#8B6914`)
- Indian floral outline motifs and rangoli patterns at 5–7% opacity in warm gold (`#D4AF37`)
These ghost elements are barely visible. They are atmospheric, not decorative. The eye should feel them before noticing them.

**Indian colour palette for fabrics:**
- Saffron: `#F7941D`
- Crimson/Sindoor: `#CC2936`
- Deep Indigo: `#1A237E`
- Rani Pink/Fuchsia: `#E0457B`
- Royal Purple: `#6A0572`
- Peacock Teal: `#168AAD`
- Marigold Gold: `#FFB627`
- Zari Gold: `#D4AF37`

**What must NEVER appear:**
- People, faces, hands, bodies
- Machinery, rollers, industrial equipment, pipes, tanks
- Text of any kind
- Dark or black backgrounds
- Photorealistic industrial settings
- Stock-photo aesthetics

**The negative space rule:**
Each process image must have a deliberately clean cream area — specified for each image below — where the text overlay will live. This zone must have ZERO elements: no ghost motifs, no fabric edge, nothing. That area is the typographic canvas. If it has any visual noise, the text and image will fight each other. Think of it as a reserved column in the composition.

---

## NEW IMAGES TO GENERATE

---

### IMAGE 01 — Process Stage: Grey Fabric Intake
**Filename:** `main-process-01-intake-desktop.png`
**Size:** 1920 × 1080 px (16:9 landscape)
**Used for:** Process section · Stage 0 · Desktop

**What this image shows:**
The raw unprocessed fabric — before anything has happened to it. This is the beginning of the journey. The fabric is grey, undyed, woven but unfinished. It should feel like potential — like something waiting to become something.

**Composition:**
- Right half and bottom-right: a large bolt or roll of unprocessed grey synthetic fabric, dramatically draped or partially unrolled, falling in elegant folds. Fabric is cool grey, fine weave (viscose/polyester), with the woven structure visible as texture. No pattern, no colour — pure grey. The fabric's weave detail is its beauty.
- Background at 8% opacity: sepia line-art of a Surat/Mughal architectural gateway — arched entrance with ornate pilasters
- Background upper-right at 6% opacity: scattered Indian floral outlines in warm gold
- **CLEAN ZONE (text area): Bottom-left quadrant, approximately 42% width × 38% height from the bottom-left corner. Completely empty cream. Not even the ghost motifs enter this zone.**

**Mood:** Still, patient, full of potential. Before the story begins.

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6), perfectly solid, no gradient. Centre-right and bottom-right: a large bolt of unprocessed synthetic grey fabric (viscose/polyester, fine plain weave), partially unrolled, draped in soft sculptural folds falling naturally. The fabric is cool grey, raw, unprinted — its beauty is the visible woven texture of individual threads. Ghost elements behind the fabric at 8% opacity: ultra-fine warm sepia (#8B6914) line-art of a Mughal arched gateway. Upper area at 6% opacity: scattered Indian floral outline motifs in gold (#D4AF37). Lower-left quadrant (42% of width × 38% of height from bottom-left) is COMPLETELY EMPTY clean cream — no elements whatsoever. No people, no hands, no machinery. Still, poetic mood. 1920×1080px."

---

### IMAGE 01M — Process Stage: Grey Fabric Intake (Mobile)
**Filename:** `main-process-01-intake-mobile.png`
**Size:** 1080 × 1920 px (9:16 portrait)

**Composition change for mobile:**
- Top 38% of frame: COMPLETELY CLEAN cream — empty zone for text
- Bottom 62% of frame: the grey fabric rolls in from the bottom edge, filling the lower portion
- Ghost architecture appears in the middle zone, behind the fabric transition

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Top 38% of frame: completely clean empty cream — no elements, no motifs, nothing. Bottom 62%: unprocessed grey synthetic fabric (fine plain weave, viscose/polyester) draped and folded, entering from the bottom edge, rising to approximately mid-frame. Ghost elements at 8% opacity in the mid-zone behind fabric: sepia line-art of Mughal archway. No people, no hands, no machinery. 1080×1920px portrait."

---

### IMAGE 02 — Process Stage: Dyeing
**Filename:** `main-process-02-dyeing-desktop.png`
**Size:** 1920 × 1080 px (16:9 landscape)
**Used for:** Process section · Stage 1 · Desktop

**What this image shows:**
The transformation moment. Dye meeting fabric. Grey becoming colour. This is the emotional heart of what Prabhakar does — the exact second colour enters the cloth. It should feel like magic, not industry.

**Composition:**
- Centre and right: a flowing length of fabric caught in mid-transformation — the left part of the fabric still grey and undyed, the right side exploding in deep saffron (#F7941D) and rich crimson (#CC2936). The colour transition is organic, diffusion-like — not a hard edge, more like ink blooming in water. On the dyed portion of the fabric, Indian block-print floral patterns appear (as if the dyeing reveals the pattern that was always latent in the weave).
- The fabric flows and waves — it is in motion, being transformed
- Background at 8% opacity: sepia line-art of temple or palace architecture
- Upper area at 6% opacity: Indian floral outline motifs in gold
- **CLEAN ZONE (text area): Left side, top 55% of the left 40% of the frame. Completely empty cream.**

**Mood:** Transformative, joyful, the moment of becoming.

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Centre and right: a dramatically flowing piece of fine fabric in mid-transformation — left half still grey/undyed, right half blooming into deep saffron (#F7941D) fading into crimson (#CC2936), the colour spreading organically through the weave like natural dye diffusing, with Indian block-print floral butidar patterns emerging on the dyed portion. The fabric waves and flows naturally, not flat. Background at 8% opacity: ultra-fine sepia line-art of Mughal palace or temple facade. Upper background at 6% opacity: scattered Indian floral outline motifs in gold. Left side, top 55%, within the left 40% of frame: COMPLETELY CLEAN cream — zero elements. No machinery, no equipment, no vats, no people, no hands. Joyful, transformative mood. 1920×1080px."

---

### IMAGE 02M — Process Stage: Dyeing (Mobile)
**Filename:** `main-process-02-dyeing-mobile.png`
**Size:** 1080 × 1920 px (9:16 portrait)

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Top 38% of frame: COMPLETELY CLEAN empty cream. Bottom 62%: flowing fabric in mid-dye transformation — entering from bottom-right, left edge still grey, right and bottom edge blooming in saffron (#F7941D) and crimson (#CC2936) with Indian block-print florals appearing on the dyed zone. Colour spreads organically like ink in water. Ghost sepia architecture line-art at 8% opacity in mid-zone. No machinery, no people, no hands. 1080×1920px portrait."

---

### IMAGE 03 — Process Stage: Printing
**Filename:** `main-process-03-printing-desktop.png`
**Size:** 1920 × 1080 px (16:9 landscape)
**Used for:** Process section · Stage 2 · Desktop

**What this image shows:**
Pattern has been applied. Multiple fabrics, each with a different Indian print, showing the variety and richness of what printing can achieve. The image should feel like abundance — the astonishing range of patterns Prabhakar can produce.

**Composition:**
- Centre and right: multiple flowing fabric pieces overlapping in layers, each with a distinct Indian print:
  - One with dense floral butidar in fuchsia-pink and crimson on cream base
  - One with ikat-inspired geometric pattern in deep indigo and teal
  - One with discharge-print effect — navy base with white/cream Indian florals
  - One with a lighter floral in marigold and rose
  The fabrics overlap and weave around each other, creating depth and layering
- Background at 8% opacity: sepia line-art of an ornate Indian haveli facade with jali lattice windows
- Background at 5% opacity: very scattered floral outlines in gold
- **CLEAN ZONE (text area): Left 38% of frame (full height, left side). Completely empty cream.**

**Mood:** Abundant, skilled, endlessly varied. The richness of Indian pattern.

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Centre and right: multiple flowing fabric lengths overlapping in elegant layers — one with dense Indian butidar floral print in fuchsia (#E0457B) and crimson on cream; one with ikat geometric pattern in deep indigo (#1A237E) and peacock teal (#168AAD); one with discharge print effect in dark navy with white Indian floral outlines; one with marigold (#FFB627) florals on light rose base. Fabrics flow and drape with natural translucency allowing layering to be visible. Background at 8% opacity: sepia line-art of Indian haveli facade with jali lattice windows. Background at 5% opacity: sparse gold floral outline motifs. LEFT 38% of frame (full height): COMPLETELY EMPTY clean cream — zero elements. No screen printing equipment, no people, no hands. Rich, abundant mood. 1920×1080px."

---

### IMAGE 03M — Process Stage: Printing (Mobile)
**Filename:** `main-process-03-printing-mobile.png`
**Size:** 1080 × 1920 px (9:16 portrait)

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Top 38%: COMPLETELY CLEAN empty cream. Bottom 62%: multiple richly printed Indian fabric lengths flowing and overlapping — butidar floral in fuchsia and crimson, ikat geometric in indigo and teal, discharge-print navy with white florals, marigold floral on rose. Fabrics layered with natural translucency. Ghost sepia haveli line-art at 8% behind fabric. No equipment, no people, no hands. 1080×1920px portrait."

---

### IMAGE 04 — Process Stage: Finishing
**Filename:** `main-process-04-finishing-desktop.png`
**Size:** 1920 × 1080 px (16:9 landscape)
**Used for:** Process section · Stage 3 · Desktop

**What this image shows:**
The surface has been perfected. Finishing treatments — sueding, water repellency, shearing — create a fabric whose surface is its beauty. This image should feel like the difference between rough and smooth, between ordinary and exceptional. Deep, jewel-toned fabric with a flawless surface.

**Composition:**
- Centre-right: one or two pieces of deep-coloured finished fabric in sculptural arrangement — the surface is the point. One in deep peacock teal (#168AAD) with a suede-like matte finish. One in deep indigo (#1A237E) with a silken sheen. The fabric edges show a fine gold selvedge/zari border running along them — a detail of quality. The folds of the fabric reveal the surface quality through how light falls on it.
- Background at 8% opacity: sepia line-art of a Mughal arch or garden gateway
- Background at 6% opacity: very subtle rangoli dot patterns in gold
- **CLEAN ZONE (text area): Lower-left area — bottom 45% of the left 42% of frame. Completely empty cream.**

**Mood:** Precise, refined, perfect. The finishing touch that makes ordinary fabric exceptional.

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Centre and right: one to two pieces of superbly finished deep-toned fabric arranged in sculptural, light-catching folds. Primary fabric: deep peacock teal (#168AAD) with a silky matte surface finish (like sueded georgette). Secondary fabric: deep indigo (#1A237E) with subtle sheen. Both fabrics have a fine gold/zari selvedge border running along one edge — a quality detail. The folded fabric reveals the perfect surface through the play of light — smooth, flawless, treated. Background at 8% opacity: ultra-fine sepia line-art of Mughal archway with column detail. Background at 6% opacity: very subtle rangoli dot pattern in gold. Bottom-left area (bottom 45% × left 42% of frame): COMPLETELY EMPTY clean cream. No people, no hands, no finishing equipment. Refined, precise mood. 1920×1080px."

---

### IMAGE 04M — Process Stage: Finishing (Mobile)
**Filename:** `main-process-04-finishing-mobile.png`
**Size:** 1080 × 1920 px (9:16 portrait)

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Top 38%: COMPLETELY CLEAN empty cream. Bottom 62%: deep peacock teal (#168AAD) and deep indigo (#1A237E) finished fabric in sculptural folds, with fine gold zari selvedge border visible. Surface quality (smooth, perfected finish) is visible through light play on the folds. Ghost sepia Mughal arch at 8% behind fabric. No people, no hands, no equipment. 1080×1920px portrait."

---

### IMAGE 05 — Process Stage: Delivery
**Filename:** `main-process-05-delivery-desktop.png`
**Size:** 1920 × 1080 px (16:9 landscape)
**Used for:** Process section · Stage 4 · Desktop

**What this image shows:**
Completion. The fabric is finished, quality-checked, and ready. Multiple bolts of beautifully processed fabric in different colours, neatly rolled, carrying a sense of abundance and fulfilment. The promise kept.

**Composition:**
- Centre and right: five to seven neatly rolled fabric bolts arranged in a sculptural, slightly organic composition (not machine-stacked, but arranged with care). Each bolt shows a different colour of finished fabric: deep saffron, rich crimson with a small floral print, deep indigo plain, peacock teal, rich fuchsia with ikat print. Each bolt has a warm cream/ivory selvedge end visible, with a suggestion of a quality label. The rolls feel full, heavy, complete.
- Background at 8% opacity: sepia line-art of an Indian marketplace gateway or warehouse entrance
- Background at 5% opacity: scattered floral motifs in gold
- **CLEAN ZONE (text area): Left third of frame (full height, left 35%). Completely empty cream.**

**Mood:** Abundant, accomplished, warm. The satisfaction of work complete and promise delivered.

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Centre and right: five to seven neatly rolled fabric bolts arranged in an organic sculptural group — each showing a different colour of finished Indian textile: deep saffron (#F7941D) plain, rich crimson (#CC2936) with subtle floral print, deep indigo (#1A237E) plain, peacock teal (#168AAD) plain, fuchsia (#E0457B) with ikat pattern, marigold (#FFB627) with delicate floral. Bolts have cream selvedge ends visible, quality is evident in their finish. Background at 8% opacity: sepia line-art of an Indian marketplace gate or godown entrance. Background at 5% opacity: scattered gold floral outlines. Left 35% of frame (full height): COMPLETELY EMPTY clean cream — no elements. No people, no hands, no vehicles, no forklifts. Warm, fulfilled, abundant mood. 1920×1080px."

---

### IMAGE 05M — Process Stage: Delivery (Mobile)
**Filename:** `main-process-05-delivery-mobile.png`
**Size:** 1080 × 1920 px (9:16 portrait)

**Prompt:**
"Editorial digital illustration, Indian luxury textile style. Warm flat ivory-cream background (#FAF0E6). Top 38%: COMPLETELY CLEAN empty cream. Bottom 62%: neatly rolled fabric bolts in multiple Indian colours (saffron, crimson, indigo, teal, fuchsia) arranged in a sculptural group, photographed from a slight angle, entering from the bottom half of the frame. Ghost sepia marketplace gateway line-art at 8%. No people, no hands, no machinery. Warm, accomplished mood. 1080×1920px portrait."

---

### IMAGE 06 — Brand Story Section Background
**Filename:** `main-brand-story-threads.png`
**Size:** 1920 × 1080 px (16:9 landscape)
**Used for:** Brand Story section · Full-bleed background

**Special note:** Unlike the process images, this image does NOT need a specific clean text zone — the section will use a colour gradient overlay on top of this image, so text readability is handled by CSS. This image should have visual interest throughout the entire frame.

**What this image shows:**
The loom. The fundamental act of weaving — warp threads running vertically, a weft thread crossing horizontally. But shown as abstract art, not documentary photography. This is craft reduced to its essence: thread and tension.

**Composition:**
- Full frame: dozens of taut warp threads running vertically across the entire image, in warm ivory, champagne, and gold tones (#FAF0E6, #F5E6C8, #D4AF37 variations). The threads have fine texture visible — individual fibres catching light. Some threads carry traces of saffron and deep indigo colour, as if recently dyed.
- A single weft thread weaves horizontally across the frame in the middle-lower third — warm marigold (#FFB627), slightly thicker than the warp threads.
- The threads have a subtle translucency — light comes from behind them.
- Background (barely visible through the threads): flat warm cream. At 5% opacity behind the threads: very delicate floral outline motifs in gold.
- The overall image is tight enough that the loom structure itself is not visible — just the threads and the act of weaving.

**Mood:** Ancient, meditative, craft as philosophy. The 17 years of this company reduced to a single image of threads working together.

**Prompt:**
"Editorial digital illustration, abstract textile art. Dozens of fine taut warp threads running vertically across the entire frame — warm ivory (#FAF0E6), champagne, and zari-gold (#D4AF37) tones, with subtle variation between threads. Individual thread fibres visible under soft studio lighting from behind. Some warp threads carry faint traces of saffron (#F7941D) and indigo (#1A237E) colour — as if they've been through the dye process. One marigold-gold weft thread (#FFB627) weaves horizontally across the frame at approximately 60% from the top, slightly undulating where it passes over and under warp threads. Behind the threads at 5% opacity: very delicate outline Indian floral motifs in warm gold. Background: flat warm cream (#FAF0E6), barely visible through the density of threads. Close enough that no loom machinery is visible — only threads. No people, no hands, no equipment. Meditative, craft-focused, timeless. 1920×1080px."

---

## Complete Image Checklist

### Generate these 11 new images:

**Desktop Process Images (all 1920×1080, 16:9):**
- [ ] `main-process-01-intake-desktop.png` — Grey fabric intake
- [ ] `main-process-02-dyeing-desktop.png` — Dye transformation
- [ ] `main-process-03-printing-desktop.png` — Printed fabrics
- [ ] `main-process-04-finishing-desktop.png` — Finished surface
- [ ] `main-process-05-delivery-desktop.png` — Completed bolts

**Mobile Process Images (all 1080×1920, 9:16):**
- [ ] `main-process-01-intake-mobile.png`
- [ ] `main-process-02-dyeing-mobile.png`
- [ ] `main-process-03-printing-mobile.png`
- [ ] `main-process-04-finishing-mobile.png`
- [ ] `main-process-05-delivery-mobile.png`

**Brand Story Section (1920×1080, 16:9):**
- [ ] `main-brand-story-threads.png` — Loom warp threads

**Total: 11 new images**

---

## Images That Are ALREADY DONE — Do Not Regenerate

**Landing Page (7 images — use from `dist/` folder):**
- ✅ `dist/hero_section_image/desktop.png`
- ✅ `dist/hero_section_image/tablet_version.png`
- ✅ `dist/hero_section_image/mobile_version.png`
- ✅ `dist/second_section/desktop.png`
- ✅ `dist/second_section/mobile.png`
- ✅ `dist/third_section/desktop.png`
- ✅ `dist/third_section/mobile.png`

**Swatch Book (12 images — keep from existing assets):**
- ✅ `swatch-01-piece-dyeing.png` through `swatch-12-foil-jari-print.png`

**Video (1 file — keep):**
- ✅ `hero-dye-bloom.mp4` — Main website hero background

---

## Delivery Format

When you have generated the 11 images, place them in:
```
D:\Holoncode\Prabhakar_Processors\DOCS\Images\new\
```

With the exact filenames listed above. Once delivered, the build can begin immediately.

---

## Consistency Check Before Delivering

Hold each generated image next to `dist/hero_section_image/desktop.png` and ask:

1. Is the background the same warm ivory-cream tone? ✓/✗
2. Does the fabric have visible Indian textile patterns/weave? ✓/✗
3. Are the ghost architectural elements barely visible (not dominant)? ✓/✗
4. Is the specified clean zone truly empty? ✓/✗
5. Does this feel like it belongs in the same visual family as the landing page images? ✓/✗

If any answer is ✗, regenerate before delivering. The most common failure will be #4 — AI tools tend to fill negative space. Be explicit in your prompt that the clean zone must remain empty.
