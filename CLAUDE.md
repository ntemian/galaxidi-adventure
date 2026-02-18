# Το Μυστήριο του Γαλαξειδίου / The Mystery of Galaxidi — Project Instructions

## What This Is

**"Το Μυστήριο του Γαλαξειδίου"** (The Mystery of Galaxidi) — an Indiana Jones × Monkey Island style point-and-click adventure game built entirely in vanilla HTML5 Canvas + JavaScript. No frameworks, no bundler, no dependencies. Single HTML file that runs by opening `index.html`.

Family adventure starring Ntemis, Ajax, and Clio in Galaxidi, Greece. A gift to Galaxidi and the world — free, bilingual (Greek/English), historically accurate. Chapter 1 of an expandable saga.

**Definitive design document**: `storyboard.html` — the visual pilot storyboard. Open in browser to review. 12 scenes + epilogue, full dialog, all puzzles, NPCs, music direction. `STORY.md` is the text companion (aligned with storyboard). `GAME-BIBLE.md` is **obsolete** (old 12-token version, do NOT use).

**Core mystery**: Find Captain Visvikis's green jade stone in the Karkaros cave, summon his ghost at the graveyard, discover the nautical chart in Agios Nikolaos church, cross to Agios Georgios island, and unearth the treasure — the original αλληλασφάλεια ledger and Visvikis's final letter.

**Two lessons**: (1) The power of solidarity — αλληλεγγύη. (2) The danger of not adapting — the captains who mastered sail but refused steam. **Κράτα την αλληλεγγύη. Άλλαξε το πλοίο.**

## Critical Rules

1. **Spelling**: Always **Γαλαξειδίου** (with ει), never Γαλαξιδίου
2. **Single file**: `index.html` is the complete game. No build step, no modules
3. **Canvas**: Native resolution **640x400**, scaled to fill browser window. CSS `image-rendering: pixelated`
4. **Art style**: **16-bit VGA pixel art adventure game** — Monkey Island 2 / Fate of Atlantis heritage. Vivid saturated colors, bold lighting, rich pixel-level detail. See `STYLE-GUIDE.md` for full rules. MANDATORY for all background generation
5. **Language**: Bilingual Greek/English. Player selects at start. Greek is primary. Code comments in English
6. **Test after changes**: Always `open index.html` in browser after edits. Check console for errors
7. **Assets are external**: Images in `assets/`, music in `music/`. Referenced by relative path from index.html

## File Structure

```
galaxidi-adventure/
├── index.html              # THE game (single monolithic file)
├── assets/                 # Images: backgrounds, sprites, portraits, walk frames
│   ├── pixel-exterior.png  # Scene 1 background
│   ├── pixel-terrace.png   # Scene 2 background
│   ├── pixel-kitchen.png   # Scene 3 background
│   ├── char-*-final.png    # Character idle sprites (ntemis, ajax, clio)
│   ├── portrait-*.png      # Dialog portraits
│   └── walk-*.png          # Walk frame references (unused — procedural now)
├── music/                  # Audio files
│   ├── scene1-music.mp3    # Background music
│   ├── sun-arrives-in-chora-1.mp3
│   └── sun-arrives-in-chora-2.mp3
├── inspiration/            # Reference art, mood boards, style guides
├── backups/                # Old versions, dev artifacts
│   ├── galaxidi-adventure.html       # Old 8-scene monolith
│   ├── index-split.html              # Modular version entry point
│   ├── js-split/                     # Split JS modules (17 files)
│   └── dev-assets/                   # Test images, base64 text files
├── CLAUDE.md               # This file — project instructions
├── HANDOFF.md              # Session handoff state
├── DEVLOG.md               # Development log
└── LESSONS.md              # Lessons learned
```

## Architecture (inside index.html)

The game is one `<script>` block with these sections (in order):

| Section | What It Does |
|---------|-------------|
| **Canvas + State** | Canvas setup (640x400), game state object, character state |
| **Image Loading** | `loadImg()`, `loadAllAssets()` — loads PNGs from `assets/` |
| **WALK_ANATOMY** | Per-character waist ratio & stride config |
| **drawSprite()** | Two-leg procedural walk + compound sine idle animation |
| **drawCharacter()** | Renders one character with fade-in |
| **Walking System** | `startWalk()`, `updateWalking()`, `familyFollow()` |
| **Scenes Data** | Scene definitions: objects, verbs, exits, entry dialog |
| **Intro Pages** | Story intro text sequence |
| **Dialog System** | Typewriter text, portraits, speech queuing |
| **Inventory** | `addInv()`, `removeInv()`, UI rendering |
| **Verb System** | Click handling, verb+object interaction |
| **Rendering** | `drawGame()` — background, characters, particles, UI |
| **Game Loop** | `requestAnimationFrame` loop with delta time |
| **Title/Intro** | Title screen, intro sequence, game start |

## Game Scenes (12 + epilogue — 10 implemented, 2 + epilogue remaining)

See `storyboard.html` (open in browser) and `STORY.md` for full scene details.

| # | Scene ID | Label | Status | Notes |
|---|----------|-------|--------|-------|
| 1 | **exterior** | ΤΟ ΣΠΙΤΙ — ΓΑΛΑΞΙΔΙ | Done | + terrace + kitchen sub-scenes |
| 2 | **port** | ΤΟ ΛΙΜΑΝΙ | Done | Akis & Stathis NPCs, 8 objects |
| 3 | **museum** | ΤΟ ΝΑΥΤΙΚΟ ΜΟΥΣΕΙΟ | Done | Curator NPC, steamship corner |
| 4 | **liotrivi** | ΛΙΟΤΡΙΒΙ | Done | Athos NPC, 7 objects |
| 5 | **windmill** | Ο ΜΥΛΟΣ | Done | Giannis NPC, telescope, lantern |
| 6 | **cave** | ΤΟ ΣΠΗΛΑΙΟ ΤΟΥ ΚΑΡΚΑΡΟΥ | Done | **Needs rework**: still has old 12-token stone door |
| 7 | **church** | ΑΓΙΟΣ ΝΙΚΟΛΑΟΣ | Done | **EXTERIOR only** — needs interior sub-scene |
| 8 | **graveyard** | ΤΟ ΝΕΚΡΟΤΑΦΕΙΟ | Done | Ghost sequence fully implemented |
| 9 | **boat** | ΤΟ ΚΑΡΑΒΙ — ΕΛΠΙΔΑ | Done | Scenic, 6 objects |
| 10 | **treasure** | Ο ΘΗΣΑΥΡΟΣ | **TODO** | Chest opening, final letter |
| 11 | **new_era** | Η ΝΕΑ ΕΠΟΧΗ | **TODO** | Harbor celebration, 104 signatures |
| E | **epilogue** | ΕΠΙΛΟΓΟΣ | **TODO** | Final narration + credits |

## Puzzle Chain (Visvikis treasure hunt)

```
Scene 2 (house): open shutters → find locked drawer → key in pot → Visvikis's letter (quest hook)
Scene 3 (harbor): reunion with Akis & Stathis → Akis tells Visvikis legend + points to museum, Stathis points to Athos
Scene 4 (museum): curator explains golden age + decline → learn αλληλασφάλεια history
Scene 5 (liotrivi): Athos confirms cave, reveals will → challenges family ("ατμόπλοιο σήμερα;")
Scene 6 (windmill): Giannis shows cave entrance from above → gives brass LANTERN
Scene 7 (cave): Ajax climbs, discovers "9 to 3" VOTE inscription → Clio finds GREEN STONE (jade)
Scene 8 (graveyard): place stone on Visvikis's grave → GHOST appears → points to church
Scene 9 (church): candle scene → Clio finds floor tile "Λ.Β." → NAUTICAL CHART (X marks Agios Georgios)
Scene 10 (boat): Chrysostomos on the Ελπίδα crosses to island → find rock → cross → 5 steps → dig
Scene 11 (treasure): open chest → gold + jade necklace + αλληλασφάλεια ledger + final letter
Scene 12 (harbor): Ntemis's speech → Akis's documentary → new αλληλασφάλεια signing → 104 signatures again
```

## NPCs

| NPC | Scene | Role |
|-----|-------|------|
| **Άκης / Akis** | Harbor + New Era | Flute player (φλογέρα) AND documentarist (filmed Amfissa, mountain villages, etc.), friend of Ntemis. Tells Visvikis legend. Points to museum. Scene 12: directs Galaxidi documentary |
| **Στάθης / Stathis** | Harbor | Guitar player, friend of Ntemis. Sailors' melody. Points to Athos at Liotrivi |
| **Επιμελητής / Curator** | Museum | ~55, passionate educator. Golden age, 300 ships, fatal refusal of steam |
| **Άθος / Athos** | Liotrivi | 50, brown hair, lawyer and owner. Read Visvikis's will. Challenges family |
| **Γιάννης / Giannis** | Windmill | Owner of old windmill. Quiet, sees everything from above. Gives lantern |
| **Παπάς / Papas** | Church | ~65, warm, mischievous. Visvikis was greatest benefactor |
| **Χρυσόστομος / Chrysostomos** | Boat | ~70, old sailor. Sails the Ελπίδα (Visvikis's ship). Knew Ntemis's father |
| **Ghost of Visvikis** | Graveyard | Silent, weathered, proud. Waited 120 years. Points to church |

## Art Style Rules (MANDATORY — Read STYLE-GUIDE.md for full details)

**Heritage**: LucasArts SCUMM games — Monkey Island 2, Fate of Atlantis, Day of the Tentacle, Loom, King's Quest V/VI.

**When generating ANY background image (`losc_imagine`):**
1. ALWAYS use this prompt structure: `"Pixel art [scene]. 16-bit retro pixel art, 320x200 resolution aesthetic, visible square pixels, chunky pixel textures like Monkey Island 2 VGA backgrounds. [layout]. Limited 256-color VGA palette. Dithering patterns for gradients. Every surface has pixel-level texture. [lighting — sharp, not soft]. [mood]. Classic point-and-click adventure game background art. No smooth gradients, no anti-aliasing, no photorealism. Pure pixel art. No people, no text."`
2. ALWAYS: `preset: "anime"`, `backend: "openai"`
3. NEVER generate smooth painterly/photorealistic art — this is pixel art heritage
4. NEVER muted/desaturated colors — VGA games were VIVID
5. NEVER soft-focus lighting — VGA light is sharp, defined, dramatic
6. **Lighting is THE signature** — every scene has ONE bold light source with visible shafts and cast shadows
7. **Color temperature contrast** — warm light vs cool shadow, always
8. **Title screen** (`title-bg.webp`) is the pixel art quality benchmark — match its level
9. **Default mood is HAPPINESS** — joyful, bright, warm, alive. Like a perfect Greek summer day
10. **Only exceptions**: Cave (Karkaros) and Graveyard = mystery/fear. Everything else = happiness
11. Even mystery scenes must be BEAUTIFUL — scary-beautiful, not ugly-scary

**Canonical reference scenes** (the 9 that define our look):
`title-bg.webp`, `pixel-exterior-new.png`, `pixel-kitchen-new.png`, `pixel-terrace-new.png`, `pixel-liotrivi-new.png`, `pixel-cave-new2.png`, `pixel-windmill-new.png`, `pixel-graveyard-new.png`, `pixel-treasure-new2.png`

---

## Historical Research

- Primary reference: `inspiration/galaxidi-history.md` (verified timeline 3000 BC–2025)
- Web sources: https://galaxidi.eu/ and https://syngalax.gr/
- Key date: 1860 — αλληλασφάλεια founded, 104 signers, Agia Paraskevi church
- Key fact: 300 ships at peak, 6,000 residents (1870)
- Key symbol: schooner "Chrysoula" (1904) — last sailing ship launched

## Key Globals

- `state` — game state (phase, scene, verb, inventory, flags, dialog)
- `chars` — per-character state: `{ ntemis, ajax, clio }` each with x, y, dir, walking, frame...
- `ctx` — canvas 2D context
- `GW`, `GH` — game resolution (640, 400)
- `CHAR_IMGS` — character idle sprite Image objects
- `PORTRAITS` — portrait Image objects for dialog
- `scenes` — scene definitions (objects, verbs, exits, entry)
- `images` — all loaded Image objects by key

## Animation System

### Walk Animation (Procedural Two-Leg)
- Splits character sprite at waist line (`WALK_ANATOMY[who].waist`)
- Draws legs TWICE: back leg (70% alpha, shifted opposite, lifted 3px) + front leg (full brightness, shifted forward)
- Per-scanline progressive displacement in 2px bands
- Upper body has counter-sway
- Walk phase is tick-based (`tick * 0.15`) for smooth continuous motion
- Parameters: ntemis `{waist: 0.62, stride: 7}`, ajax `{waist: 0.58, stride: 6}`, clio `{waist: 0.60, stride: 6}`

### Idle Animation
- Compound sine breathing: `sin(bp) * 1.0 + sin(bp*0.6 + 0.5) * 0.4`
- Dual-frequency sway rotation
- Subtle squash/stretch

### Walking System
- `startWalk(who, targetX, cb)` — initiates walk
- `familyFollow(targetX)` — Ajax and Clio follow Ntemis with delays
- easeInOutCubic interpolation
- Sub-pixel rendering (no Math.round on positions)

## Adding a New Scene

1. Add scene object to `scenes` in the Scenes Data section
2. Include: `label`, `bg` (image key), `charPos`, `objects` array, `exits` array, `entry` dialog
3. Create/add background image to `assets/` and load in `loadAllAssets()`
4. Add exit hotspots in connecting scenes
5. Test navigation both directions

## Art Asset Specs

- **Backgrounds**: PNG, ~640x400, pixel art style with warm colors
- **Character sprites**: Idle pose, transparent background, ~50px wide
  - ntemis: 50x97, ajax: 42x68, clio: 42x75
- **Portraits**: ~200x200 PNG for dialog display

## LOSC Integration

- Game entity: `thought:2026-02-15-galaxidi-adventure-game-the-se`
- Game file: `file:2026-02-15-galaxidi-adventure`
- Always fetch latest context from LOSC when resuming work on this game

## Key Documents

- **`storyboard.html`** — **THE definitive design document** — visual pilot storyboard, single source of truth. Open in browser to review
- **`STORY.md`** — Story bible (text companion, aligned with storyboard)
- **`ROADMAP.md`** — Development roadmap — 8-phase plan from prototype to release (LOSC: `thought:2026-02-16-galaxidi-adventure-game-develo`)
- `CHARACTER-LORE.md` — Deep character profiles (Ntemis, Ajax, Clio) — personality, voice, relationships, arcs
- `CHARACTER-VISUAL-GUIDE.md` — **Canonical visual appearance** for all characters (outfits, colors, hex palettes). Source of truth for sprites, portraits, cutscenes
- `GAME-BIBLE.md` — **OBSOLETE** (old 12-token version, do NOT use for new work)
- `PILOT-STORY.md` — **OBSOLETE** (old 8-scene version)
- `inspiration/galaxidi-history.md` — Verified Galaxidi history timeline
- `HANDOFF.md` — Session handoff state
- `DEVLOG.md` — Development log
- `LESSONS.md` — Lessons learned
- `TODO.md` — Task tracking
