# Galaxidi Adventure — Session Handoff

**Last updated**: 2026-02-16
**Last session**: Pilot storyboard + Game Bible

---

## Current State

- **Main game**: `index.html` — single monolithic file, fully working (3 scenes)
- **Pilot storyboard**: `storyboard.html` — the living pilot script, 8 scenes with art
- **Two story tracks**: MAIN (10-scene Game Bible) and PILOT (8-scene Visvikis treasure hunt)
- **Walk animation**: Procedural two-leg scissoring (no walk frame sprites needed)
- **Dialog system**: Typewriter text with portraits
- **Music**: scene1-music.mp3 plays on start

## What Was Done This Session (2026-02-16)

1. **Game Bible v3** — saved definitive 10-scene design doc as `GAME-BIBLE.md`
2. **Pilot story** — wrote 8-scene Captain Visvikis treasure hunt (`PILOT-STORY.md`)
3. **Storyboard** — built `storyboard.html` as living visual storyboard for the pilot:
   - All 8 scenes with dialog, gameplay notes, music direction
   - Scene backgrounds from `assets/` embedded (pixel-exterior, kitchen, port, cave, graveyard, church, boat)
   - Character sprites and portraits in hero section
   - Styled with gold/sea/stone palette, letter effects, ghost text, jade highlights
   - **This is the primary pilot reference — refine continuously**
4. **Historical research** — `inspiration/galaxidi-history.md` with verified timeline
5. **Title change** — everything renamed to "Το Μυστήριο του Γαλαξειδίου"

## What Works

- Title screen → intro sequence → gameplay
- Walking between 3 scenes (exterior ↔ terrace, exterior ↔ kitchen)
- Looking at/interacting with all objects
- Opening satchel → getting note
- Dolphin event on terrace (first look at harbor)
- Dialog with portraits and typewriter effect
- Family follows Ntemis when walking
- Background music

## Known Issues

- Walk frames (assets/walk-*.png) are unused — procedural animation replaced them
- Old 8-scene version (in backups/) has more content but different engine
- Only 1 puzzle implemented (satchel → note)
- No save/load in current version
- No sound effects (only music)

## Next Steps (Priority Order)

1. **Refine storyboard** — iterate on `storyboard.html` based on feedback
2. **Build pilot game** — implement 8 pilot scenes in `index.html`
3. **Generate missing art** — island scene background (Scene 8)
4. **Generate music** — per-scene tracks for the pilot
5. **NPC portraits** — Stavros, Papas, Chrysostomos, Ghost

## Key Documents

| File | Purpose |
|------|---------|
| `storyboard.html` | **Living pilot storyboard** — refine continuously |
| `PILOT-STORY.md` | Pilot story text (8 scenes) |
| `GAME-BIBLE.md` | Main version design doc (10 scenes) |
| `CLAUDE.md` | Project rules and architecture |
| `LESSONS.md` | Lessons learned |

## For Other Sessions

- Read `CLAUDE.md` for full project rules and architecture
- Read `LESSONS.md` before making animation or asset changes
- **Open `storyboard.html` in browser** to see pilot visual reference
- Game entity in LOSC: `thought:2026-02-15-galaxidi-adventure-game-the-se`
- Always test in browser after changes: `open index.html`
