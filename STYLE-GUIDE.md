# Galaxidi Adventure — Visual Style Guide

## The Galaxidi Look

**One-line summary**: VGA-era 16-bit adventure game pixel art — Monkey Island 2 meets the Greek Mediterranean.

This is a **SCUMM-style point-and-click adventure**. The visual heritage is LucasArts and Sierra VGA/EGA classics. Every background should feel like it could sit next to a Monkey Island 2 scene or an Indiana Jones and the Fate of Atlantis location.

---

## Heritage — The Games That Define Our Style

These are the visual ancestors. Study them. Match their energy.

| Game | Era | What to Take |
|------|-----|-------------|
| **Monkey Island 2: LeChuck's Revenge** | 1991, VGA | THE gold standard. Lush Caribbean pixel art. Warm docks, moonlit swamps, candlelit interiors. Rich color gradients within pixel constraints. Steve Purcell backgrounds |
| **Indiana Jones and the Fate of Atlantis** | 1992, VGA | Mediterranean locations — Greek ruins, Cretan caves, Algerian markets. Warm stone, dramatic lighting. Closest to our setting |
| **The Secret of Monkey Island** | 1990, VGA/EGA | Iconic compositions — the lookout point, the SCUMM Bar, the ghost ship. Mood through limited palette |
| **Day of the Tentacle** | 1993, VGA | Bold, saturated colors. Every scene has personality. Exaggerated but beautiful |
| **Loom** | 1990, VGA/EGA | Atmospheric, moody. Beautiful use of light and shadow in pixel art |
| **King's Quest V/VI** | 1990-92, VGA | Detailed, painterly pixel art. Rich landscapes, fairy-tale quality |
| **Broken Sword** | 1996 | Later evolution — hand-painted backgrounds with adventure game composition. Our upper quality bound |

---

## Core Style DNA

| Attribute | Rule |
|-----------|------|
| **Foundation** | 16-bit VGA pixel art — visible pixel structure, limited but vivid palette, hand-crafted feel |
| **Resolution feel** | 640x400 native (our actual canvas). Backgrounds should feel designed for this resolution |
| **Colors** | Vivid, saturated, carefully chosen — like a 256-color VGA palette. Bold color choices, not muddy blends |
| **Dithering** | Subtle pixel dithering for gradients (sky, water, stone) — a hallmark of VGA art |
| **Detail** | Dense but readable. Classic adventure games packed scenes with interactive objects that were visually distinct |
| **Lighting** | Dramatic and scene-defining. VGA artists were masters of mood with limited tools — strong directional light, deep shadows |
| **Atmosphere** | **Default mood is HAPPINESS** — joyful, bright, warm, alive, like a beautiful Greek summer day. Exceptions: **graveyard** and **cave** radiate mystery and fear. Every scene tells a story — backgrounds aren't backdrops, they're characters |
| **Composition** | SCUMM-standard: action area fills the frame, walkable ground at bottom, verb/inventory UI below (handled by engine) |
| **Characters** | NEVER in backgrounds — game engine renders characters separately |
| **Text** | NEVER in backgrounds — no signs, labels, or readable writing |

---

## What Makes VGA Adventure Art Special

The magic of Monkey Island / Fate of Atlantis backgrounds:

1. **Limited palette, maximum impact** — 256 colors forced smart color choices. Warm and cool tones carefully balanced. Skin tones, stone tones, sky tones all harmonize
2. **Pixel-level craftsmanship** — every pixel placed with intention. Textures built through careful dithering patterns, not smooth gradients
3. **Scene = mood** — walk into Woodtick in MI2 and you FEEL the swamp. Walk into the Phatt Island library and you FEEL the dust. Each Galaxidi scene must have that
4. **Interactive storytelling** — objects that matter are visually interesting. A clickable door looks like a door worth clicking. A hidden passage has subtle visual hints
5. **Depth through layers** — foreground silhouettes, midground action, background vistas. Even in 320x200, these games had cinematic depth
6. **Color temperature tells the story** — warm amber for safe/cozy, cool blue for mysterious/dangerous, golden for adventure/discovery

---

## Scene Mood Map (MANDATORY)

**The rule**: Happiness is the default. Fear/mystery is the exception.

| Mood | Scenes | Feel |
|------|--------|------|
| **HAPPINESS** | Exterior, Kitchen, Terrace, Port, Museum, Liotrivi, Windmill, Church (ext+int), Boat, Treasure, New Era | Bright, warm, joyful, alive. Blue sky, golden light, flowers, sparkling water. The feeling of a perfect Greek summer day with your family |
| **MYSTERY / FEAR** | Cave (Karkaros), Graveyard | Dark, atmospheric, eerie. Moonlight, shadows, glowing eyes, cold stone, supernatural tension. The thrill of adventure danger |

Even the mystery scenes must be **beautiful** — scary-beautiful like LeChuck's fortress in MI2, not ugly-scary. The beauty never drops, only the mood shifts.

---

## Canonical Reference Scenes

Our 9 best scenes — the standard all new backgrounds must match:

| Scene | File | Pixel Art Qualities |
|-------|------|-------------------|
| **Title Screen** | `title-bg.webp` | Best pixel art reference. Vivid harbor panorama, sparkling water pixels, terracotta/blue/green palette. Feels like MI2 Scabb Island establishing shot |
| **Exterior** | `pixel-exterior-new.png` | Captain's house. Stone wall texture, blue shutters, bougainvillea. Sea vista. Like MI2 Woodtick buildings |
| **Kitchen** | `pixel-kitchen-new.png` | Dense interior. Ship models, captain portrait, fireplace glow. Like Fate of Atlantis — Barnett College office |
| **Terrace** | `pixel-terrace-new.png` | Panoramic elevated view. Sunset sky gradient, harbor below, mountains. Like MI1 lookout point |
| **Liotrivi** | `pixel-liotrivi-new.png` | Warm interior, stone arches, night through window. Like SCUMM Bar interior |
| **Karkaros Cave** | `pixel-cave-new2.png` | Teal water, light shafts, mossy stone, narrow path. Like Fate of Atlantis — Cretan labyrinth |
| **Windmill** | `pixel-windmill-new.png` | Hilltop sunset, dramatic sky. Like MI2 lookout at Booty Island |
| **Graveyard** | `pixel-graveyard-new.png` | Moonlit, cypresses, fireflies, marble grave. Like MI1 — ghost ship / LeChuck's fortress mood |
| **Treasure Island** | `pixel-treasure-new2.png` | Rocky island, sunset, chapel on cliff, dug treasure. Like MI2 — Big Whoop dig site |

---

## Color Palette (VGA Adventure Style)

### The Galaxidi VGA Palette Philosophy
Like classic VGA games, we use **bold, committed color zones** — not smooth photographic gradients. A sunset sky has 4-5 distinct color bands, not infinite blending. Water sparkles with bright pixel highlights against deep blue. Stone has warm and shadow tones that dither together.

### Daytime Exteriors
- **Sky**: Bold blue with distinct cloud shapes (not photo-blur)
- **Sea**: Turquoise-to-deep-blue with visible white sparkle pixels on the surface
- **Stone**: Warm cream/gold with visible texture pattern (not smooth)
- **Terracotta**: Orange-brown rooftiles with individual tile structure visible
- **Bougainvillea**: Bold fuchsia/pink — saturated, not pastel
- **Vegetation**: Rich greens, dark cypress silhouettes
- **Mountains**: Purple-blue distance, flattened to 2-3 tones

### Sunset / Golden Hour
- **Sky**: Distinct bands — orange → coral → pink → purple (like MI2 sunsets)
- **Water**: Golden highlight streaks on dark blue
- **Everything warm-lit**: Golden rim light on stone edges, warm glow on surfaces

### Night
- **Sky**: Deep blue-violet with pixel stars
- **Moon**: Bright, with visible moonpath on water
- **Warm light sources**: Candles, lanterns — amber pools of light against cool blue
- **Fireflies**: Scattered bright pixels
- **Cypress silhouettes**: Near-black against blue sky

### Interiors
- **Warm amber glow** radiating from fire/lamp source
- **Dark wood** with rich brown tones
- **Stone walls** with warm highlight and cool shadow
- **Floor**: Visible tile/stone pattern — individual tiles readable

### Cave / Underground
- **Water**: Bold teal/turquoise — the MI1 underground cavern color
- **Stone**: Grey-blue with green moss accents
- **Light shafts**: Bright, defined beams (not soft diffusion)

---

## Lighting (VGA Adventure Game Style)

VGA artists made lighting dramatic because they HAD to — limited palette meant every bright pixel counted.

1. **ONE dominant light source per scene** — clearly identifiable. Sun, moon, fire, candles
2. **Light shafts are SHARP** — defined beams with visible edges, not soft diffusion. Dust particles as bright pixels in the beam
3. **Cast shadows are BOLD** — distinct shadow shapes, not soft gradients
4. **Rim lighting on edges** — bright pixel outlines on stone, wood, and foliage facing the light
5. **Water reflects everything** — sparkling pixel highlights (day), golden/silver streaks (sunset/night)
6. **Interiors glow** — warm light fades into shadow at the edges of the room
7. **Color temperature contrast** — warm light vs cool shadow. This is how VGA artists created depth

---

## Composition (SCUMM Adventure Standard)

```
┌──────────────────────────────────────┐
│  SKY / CEILING (top 20-25%)          │ ← atmospheric: clouds, stars, arches
│                                      │
│  MAIN SCENE (middle 50-60%)          │ ← buildings, cave walls, furniture
│  Interactive objects here             │ ← visually distinct, clickable-looking
│  Layered depth: FG → MG → BG        │
│                                      │
│  WALKABLE GROUND (bottom 20-25%)     │ ← stone path, tiles, dirt
│  ← exit left          exit right →   │ ← visible path/opening at edges
└──────────────────────────────────────┘
```

- **Walk area** at bottom must be clear enough for character sprites
- **Exits** visually obvious — paths leading off-screen, doorways, archways
- **Interactive objects** should look interesting/clickable — slightly brighter, more detailed, or contrasting with surroundings
- **Depth layers** — foreground elements (planters, railings), midground (main scene), background (sky, sea, mountains)

---

## Prompt Engineering Template

When generating backgrounds with `losc_imagine`:

```
Pixel art [scene description in Galaxidi, Greece]. 16-bit retro pixel art, 320x200
resolution aesthetic, visible square pixels, chunky pixel textures like Monkey Island 2
VGA backgrounds. [Scene layout details]. Limited 256-color VGA palette. Dithering
patterns for gradients. Every surface has pixel-level texture. [Lighting description —
sharp, not soft]. [Mood — happy/sacred/mysterious]. Classic point-and-click adventure
game background art. Retro gaming pixel art. 16-bit era. No smooth gradients, no
anti-aliasing, no photorealism. Pure pixel art.
No people, no characters, no text, no labels, no writing anywhere in the image.
```

**Key phrases that FORCE pixel art** (always include):
- "visible square pixels"
- "chunky pixel textures"
- "320x200 resolution aesthetic"
- "No smooth gradients, no anti-aliasing, no photorealism. Pure pixel art."

**Preset**: `anime`
**Backend**: `openai`
**Mood**: Match scene emotion — happy by default, mystery/fear for cave+graveyard only

---

## What NOT To Do

- No smooth painterly/photorealistic rendering — this is PIXEL ART heritage
- No muted, desaturated, or washed-out colors — VGA games were VIVID
- No soft-focus or blurry lighting — VGA light is sharp and defined
- No generic/empty compositions — classic adventure scenes were DENSE with detail and personality
- No characters or people in backgrounds (game renders them separately)
- No text, signs, or readable writing
- No modern elements — 19th century Galaxidi or timeless Greek
- No dark/depressing mood without beauty — even LeChuck's fortress looked amazing
- No cold grey color grading — always vivid, always committed to a color temperature

---

## Scenes That Need Restyling

When regenerating backgrounds, prioritize scenes that drifted furthest from the VGA pixel art DNA:

| Scene | Current State | Issue |
|-------|--------------|-------|
| **Church Interior** | `pixel-church-interior.png` | Nano-banana render, too chunky, wrong style entirely |
| **Museum** | `pixel-museum-new.png` | Too watercolor/flat, lacks VGA richness |
| **New Era** | `pixel-new-era-new.png` | Check against style guide |

---

## Filename Convention

- Scene backgrounds: `pixel-{scene}-new.png`
- When replacing: new overwrites `-new.png`, old file kept as backup
