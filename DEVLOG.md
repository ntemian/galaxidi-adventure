# Galaxidi Adventure — Development Log

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
