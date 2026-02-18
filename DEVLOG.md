# Galaxidi Adventure — Development Log

## 2026-02-18 — Game Design Academy Update

**Session focus**: Update academy document to reflect pilot-complete state

- Updated outdated game state references (scenes 10-12 marked as TODO → now DONE)
- Added status annotations to Chapter X "Applied" recommendations (done/still TODO/P-level)
- Added "Progress Log" section with three expandable panels:
  - **Pilot Status (v0.1)** — complete feature table with all systems
  - **Academy Recommendations Tracker** — checklist of implemented vs TODO suggestions
  - **Session Log** — chronological table of all development sessions
- Added "Progress" link to sticky navigation bar
- Updated footer with last-updated date and version stamp

---

## 2026-02-17 — End-to-End Audit + Pilot Polish

**Session focus**: Full playtest audit, bug fixes, polish to pilot-ready

### Audit & Bug Fixes
- Traced full puzzle chain in code, verified all flag gates and inventory handoffs
- CRITICAL BUG FIX: Church candle was gated behind `ghost_summoned` — player could skip cave/graveyard entirely
- Fixed treasure scene music key (cave_final → treasure)
- Quest panel contrast WCAG fix (#4a3a20 → #8a7a50)
- Removed debug G-key warp
- Cleaned up backup asset files

### New Features
- Right-click default verb (SCUMM-style contextmenu handler)
- Church interior — dedicated `pixel-church-interior.webp` background
- Cat companion — orange tabby follows Clio in 10 outdoor scenes
- Cicadas ambient sound — wired `createCicadasLoop()` into 6 scenes
- Quest status panel (Q key) — 14 tracked steps with progress bar
- Custom cursor — canvas-drawn with verb-aware icons
- Y-depth sorting — characters + NPCs sorted by Y position
- Hotspot highlights — pulsing gold glow on hover
- Version stamp — v0.1-pilot on title screen

### Content
- All 13 scenes complete: treasure, new_era, epilogue finalized
- Interactive ledger object in New Era scene
- Epilogue: 4 pages, click-to-advance, returns to title

---

## 2026-02-16 — Content Expansion

**Session focus**: Expand from 8 to 13 scenes, add cutscenes and music

### Scenes
- Added 5 new scenes: church_interior, windmill, boat, treasure, new_era + epilogue
- All NPCs implemented with portraits and dialog
- Full puzzle chain from note to epilogue

### Cutscenes & Music
- 12 scripted cutscenes with Ken Burns animation on 26 anime stills
- 41 music tracks: 2 variants per scene + 6 title themes
- Cutscene pipeline: losc_imagine → loadImg → drawKenBurns → timed Greek dialog

---

## 2026-02-16 — Animation Overhaul + Project Reorganization

**Session focus**: Fix walk animation, organize project

### Animation
- Replaced frame-based walk (4 frames, choppy) with procedural two-leg scissoring
- Three iterations to get legs right:
  1. More walk frames (8) + crossfade → still not visible enough
  2. Per-scanline single-direction displacement → legs moved as one block
  3. Two-leg scissoring (draw legs twice, opposite directions) → works!
- Added compound sine idle animation (dual-frequency breathing + sway)
- Removed Math.round for sub-pixel rendering — smoother movement
- Walk phase uses continuous tick-based timing, not integer frame counter
- Parameters tuned: ntemis stride=7, ajax/clio stride=6

### Project Structure
- Moved from `~/Downloads/tides-game/` to `~/games/galaxidi-adventure/`
- Made `tides.html` → `index.html` (canonical version)
- Old split version (17 JS files) moved to `backups/js-split/`
- Created `inspiration/` folder for reference art
- Created project management docs (CLAUDE.md, HANDOFF.md, DEVLOG.md, LESSONS.md)

---

## 2026-02-15 — MI2 Graphics Overhaul + Walk Cycles

**Session focus**: Visual upgrade to Monkey Island 2 quality

### Graphics
- Generated pixel art backgrounds for 8 scenes (house, port, beach, town, cave, church, hilltop, boat)
- Generated character sprites (ntemis 50x118, ajax 42x84, clio 42x92)
- Generated portrait images for dialog system
- Created 4-frame walk cycle sprites for each character
- Added scene title/v2/v3 variants

### Engine
- Added Web Audio procedural sound engine
- Added iris wipe scene transitions
- Added speech bubble system with per-character colors
- Added Web Speech API Greek narration
- Added dynamic hint system
- Added save/load via localStorage

---

## 2026-02-15 — Initial Creation

**Session focus**: Build complete SCUMM-style adventure

- Created full game from scratch as single HTML file
- 8 scenes with puzzle chain (drawer → letter → compass → shell → map → lantern → treasure)
- SCUMM verb interface (9 verbs)
- Dialog system with NPC conversations
- Inventory system
- Mini-map
- Stored in LOSC as game entity
