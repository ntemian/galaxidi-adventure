# Το Μυστήριο του Γαλαξειδίου / The Mystery of Galaxidi — Project Instructions

## What This Is

**"Το Μυστήριο του Γαλαξειδίου"** (The Mystery of Galaxidi) — an Indiana Jones × Monkey Island style point-and-click adventure game built entirely in vanilla HTML5 Canvas + JavaScript. No frameworks, no bundler, no dependencies. Single HTML file that runs by opening `index.html`.

Family adventure starring Ntemis, Ajax, and Clio in Galaxidi, Greece. A gift to Galaxidi and the world — free, bilingual (Greek/English), historically accurate. Chapter 1 of an expandable saga.

**Definitive design document**: `GAME-BIBLE.md` — 10 scenes + epilogue, full story, all puzzles, NPCs, music direction.

**Core mystery**: Find 12 captain's tokens hidden across Galaxidi to unlock the original αλληλασφάλεια ledger and a letter from the founding captains.

**Two lessons**: (1) The power of solidarity — αλληλεγγύη. (2) The danger of not adapting — the captains who mastered sail but refused steam. **Κράτα την αλληλεγγύη. Άλλαξε το πλοίο.**

## Critical Rules

1. **Spelling**: Always **Γαλαξειδίου** (with ει), never Γαλαξιδίου
2. **Single file**: `index.html` is the complete game. No build step, no modules
3. **Canvas**: Native resolution **640x400**, scaled to fill browser window. CSS `image-rendering: pixelated`
4. **Art style**: Warm Mediterranean — golden hour exterior, cozy kitchen, sea views. NOT dark/night
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

## Game Scenes (10 planned, 3 implemented)

See `GAME-BIBLE.md` for full scene details.

| # | Scene | Label | Status |
|---|-------|-------|--------|
| 1 | **house** (exterior/terrace/kitchen) | ΤΟ ΣΠΙΤΙ | Done (3 sub-scenes) |
| 2 | **port** | ΤΟ ΛΙΜΑΝΙ | TODO |
| 3 | **museum** | ΤΟ ΝΑΥΤΙΚΟ ΜΟΥΣΕΙΟ | TODO |
| 4 | **liotrivi** | ΛΙΟΤΡΙΒΙ | TODO |
| 5 | **cave** | ΤΟ ΣΠΗΛΑΙΟ (ΠΛΑΤΕΙΑ ΜΑΜΑ) | TODO |
| 6 | **church** | ΑΓΙΟΣ ΝΙΚΟΛΑΟΣ | TODO |
| 7 | **windmill** | Ο ΜΥΛΟΣ | TODO |
| 8 | **boat** | ΤΟ ΚΑΡΑΒΙ | TODO |
| 9 | **graveyard** | ΤΟ ΝΕΚΡΟΤΑΦΕΙΟ | TODO |
| 10 | **cave_final** | ΤΟ ΣΠΗΛΑΙΟ — ΤΕΛΙΚΗ ΕΠΙΣΤΡΟΦΗ | TODO |
| E | **epilogue** | Η ΓΙΟΡΤΗ | TODO |

## Puzzle Chain (12 captain's tokens)

```
Scene 1 (house): find loose terrace tile → first captain's token
Scene 2 (port): talk to Stavros → quest hook, explore harbor
Scene 3 (museum): model ship puzzle → second token
Scene 4 (liotrivi): Fotini's history test → third token
Scene 5 (cave): place tokens, discover vote inscription
Scene 6 (church): architecture puzzle → token
Scene 7 (windmill): map puzzle → ship pattern eureka
Scene 8 (boat): coastal chapel → token + logbook
Scene 9 (graveyard): find captain's grave → ghost encounter → token
Scene 10 (cave): place all 12 → open door → ledger + letter
```

## NPCs

| NPC | Scene | Role |
|-----|-------|------|
| **Σταύρος / Stavros** | Port | Fisherman, quest hook, grandfather's bitterness |
| **Επιμελητής / Curator** | Museum | Educator, the big history lesson |
| **Φωτεινή / Fotini** | Liotrivi | Bartender, captain's descendant, token test |
| **Ειρήνη / Eirini** | Liotrivi (outside) | Tech entrepreneur, future voice |
| **Παπάς / Papas** | Church | Warm, mischievous, faith+maritime link |
| **Χρυσόστομος / Chrysostomos** | Boat | Old sailor, wisdom about change |
| **Ghost Captain** | Graveyard | Silent, shows visions, finds peace |

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
  - ntemis: 50x118, ajax: 42x84, clio: 42x92
- **Portraits**: ~200x200 PNG for dialog display

## LOSC Integration

- Game entity: `thought:2026-02-15-galaxidi-adventure-game-the-se`
- Game file: `file:2026-02-15-galaxidi-adventure`
- Always fetch latest context from LOSC when resuming work on this game

## Key Documents

- `GAME-BIBLE.md` — Definitive game bible (v3, 10 scenes + epilogue, full story)
- `inspiration/galaxidi-history.md` — Verified Galaxidi history timeline
- `HANDOFF.md` — Session handoff state
- `DEVLOG.md` — Development log
- `LESSONS.md` — Lessons learned
- `TODO.md` — Task tracking
