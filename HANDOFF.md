# Galaxidi Adventure — Session Handoff

**Last updated**: 2026-02-17
**Last session**: End-to-end audit, bug fixes, polish pass

---

## Current State

- **Main game**: `index.html` — 6,050+ line single monolithic file, **feature-complete for pilot**
- **Scenes**: 13 fully playable (exterior, terrace, kitchen, port, museum, liotrivi, cave, church, church_interior, windmill, boat, graveyard, treasure, new_era + epilogue)
- **NPCs**: 8 with portraits, dialog, and scene integration
- **Puzzle chain**: Complete and verified — note → museum → liotrivi → windmill (lantern) → cave (jade) → graveyard (ghost) → church_interior (chart) → boat → treasure → new_era → epilogue
- **Cutscenes**: 12 scripted with Ken Burns animation on 26 anime stills
- **Walk animation**: Procedural two-leg scissoring (no sprites needed)
- **Dialog system**: Typewriter with portraits, voice acting via VOICE_MAP
- **Music**: 40+ scene-specific tracks with per-scene music map
- **Ambient sound**: Procedural Web Audio — waves, wind, seagulls, cave drips, church bell, cicadas
- **Visual ambience**: Per-scene effects (kitchen steam, museum dust, liotrivi god-rays, windmill shadows, graveyard fireflies, church candles, boat spray, cave formations, heat haze, light shafts, petals)
- **Save/load**: Auto-save on scene change, manual save (S key), Continue on title
- **Map**: Fast-travel (M key) to visited locations
- **Help**: Context-sensitive hints (H key)
- **Cat companion**: Pixel-art orange tabby follows Clio across all outdoor scenes

## What Was Done This Session (2026-02-17)

1. **End-to-end playtest audit** — traced full puzzle chain in code, verified all flag gates and inventory handoffs
2. **CRITICAL BUG FIX**: Church candle gated behind `ghost_summoned` flag — previously player could skip cave/graveyard/ghost entirely by entering church_interior early and getting nautical chart
3. **Right-click default verb** — added SCUMM-style `contextmenu` handler (Look for objects, Talk for NPCs, Open for doors/containers)
4. **Church interior background** — generated dedicated `pixel-church-interior.png` art (was reusing exterior bg)
5. **Cat follows between scenes** — extended `catScenePos` config so the orange tabby appears in 10 scenes, not just exterior
6. **Cicadas ambient sound** — wired existing `createCicadasLoop()` into `startSceneAmbience()` for exterior, terrace, liotrivi, windmill, graveyard, church

## What Works

- Full game flow: title → intro cutscene → 13 scenes → epilogue → title
- All puzzle gates verified (ghost_summoned → candle, nautical_chart → boat, letter_read → new_era)
- Walking, dialog, inventory, save/load, cutscenes, ambient sound
- Ghost sequence with environmental effects
- Voice acting for all dialog lines
- Right-click default verbs
- Map fast-travel and help system
- Debug: G key warps to graveyard with green stone (remove before release)

## Known Issues / TODO

### P0 (Must Fix)
- [ ] **Full playthrough test in browser** — code audit complete, needs hands-on play
- [ ] **Remove debug G-key warp** before sharing

### P1 (Polish)
- [ ] Bilingual system (Greek/English toggle)
- [ ] Sound effects: footsteps, door, item pickup (currently only procedural ambient)
- [ ] Clio's notebook / journal UI
- [ ] NPC dialog branching
- [ ] Comedy beats (Ajax autocorrect, cave echo)

### P2 (Content Depth)
- [ ] Character-specific puzzle actions
- [ ] Item combinations
- [ ] Historical accuracy tags
- [ ] Encyclopedia system

## Key Documents

| File | Purpose |
|------|---------|
| `storyboard.html` | **Living pilot storyboard** — visual reference |
| `STORY.md` | Story bible (aligned with storyboard) |
| `ROADMAP.md` | 8-phase development plan |
| `TODO.md` | Detailed task tracking |
| `CLAUDE.md` | Project rules and architecture |
| `CHARACTER-LORE.md` | Deep character profiles |
| `CHARACTER-VISUAL-GUIDE.md` | Visual appearance specs |
| `LESSONS.md` | Lessons learned |
| `DEVLOG.md` | Development log |

## For Other Sessions

- Read `CLAUDE.md` for full project rules and architecture
- Read `LESSONS.md` before making animation or asset changes
- **Open `storyboard.html` in browser** to see pilot visual reference
- Game entity in LOSC: `thought:2026-02-16-galaxidi-adventure-game-the-se`
- Always test in browser after changes: `open -a "Google Chrome" index.html`
- **GAME-BIBLE.md is OBSOLETE** — do not use for new work
