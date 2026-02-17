# Το Μυστήριο του Γαλαξειδίου — TODO

Priority: P0 = must have for pilot, P1 = important polish, P2 = nice to have, P3 = future

**Last audit: 2026-02-17 (post-swarm)**

---

## Current State Summary

| Area | Status | Details |
|------|--------|---------|
| **Scenes** | 13 of 13 (ALL DONE) | exterior, terrace, kitchen, port, museum, liotrivi, cave, church, church_interior, windmill, boat, graveyard, treasure, new_era + epilogue |
| **Code** | 6,011 lines | Single monolithic index.html |
| **Backgrounds** | 13 webp files | All scenes covered (treasure + new_era generated) |
| **Character Sprites** | 11 (3 family + 8 NPC) | All with idle animation |
| **Portraits** | 8 NPC + 3 family | All dialog portraits exist |
| **Music** | 40+ tracks | 2 variants per scene + title themes |
| **Cutscenes** | 12 scripted | arrival, letter, reunion, museum, liotrivi, windmill, cave_enter, ghost, church_tile, crossing, treasure, epilogue |
| **Cutscene Images** | 26 anime stills | Ken Burns rendering |
| **Ghost Sequence** | DONE | Full environmental effects, arm raise, wave, fade |
| **Dialog** | All 13 scenes | Entry + 4-8 objects with verb responses each |
| **Save/Load** | DONE | Auto-save on scene change, manual save (S key), Continue on title |
| **Quest Gating** | DONE | Jade→ghost, candle→tile, chart→boat, letter→new_era |
| **Epilogue** | DONE | 4 pages, click-to-advance, returns to title |

---

## P0 — MUST HAVE FOR FIRST PILOT

### Story Alignment Issues — ALL FIXED

- [x] ~~**Cave puzzle mismatch**~~: Reworked — vote inscription "9 to 3", jade stone discovery, lantern-lit, "Λ.Β. 1887" markings
- [x] ~~**Church scene is EXTERIOR**~~: Added `church_interior` sub-scene with icons, candles, iconostasis, Papas NPC, floor tile "Λ.Β." puzzle, nautical chart
- [x] ~~**Navigation routing**~~: Full quest path verified: exterior→port→museum→liotrivi→church→cave→windmill→graveyard→(ghost)→church_interior→port/dock→boat→treasure→new_era→epilogue
- [x] ~~**Windmill → lantern**~~: Giannis gives lantern with `addInv()` + `lantern_given` flag
- [x] ~~**Green stone inventory**~~: Cave adds `green_stone` to inventory (Clio's discovery)
- [x] ~~**Quest chain gating**~~: Jade required for ghost, candle required for floor tile, nautical chart required for boat (via dock object), letter required for new_era exit

### Missing Scenes — ALL ADDED

- [x] ~~**Treasure scene**~~: Sea chest opening, final letter "Κράτα την αλληλεγγύη. Άλλαξε το πλοίο.", family reactions
- [x] ~~**New Era scene**~~: Crowd, podium speech, Akis documentary, signing sequence (104th signature), "ΕΛΠΙΔΑ"
- [x] ~~**Epilogue**~~: 4-page narration, "Η θάλασσα θυμάται. Κι εμείς τώρα, αλλάζουμε μαζί της.", returns to title

### Critical Systems — ALL DONE

- [x] ~~NPC portraits~~ — All 8 NPCs have portraits
- [x] ~~Scene-specific music~~ — 40+ tracks exist
- [x] ~~Ghost sequence~~ — Fully implemented
- [x] ~~Cutscene engine~~ — Timeline-based, working
- [x] ~~Walk animation~~ — Procedural two-leg, working
- [x] ~~Dialog system~~ — Typewriter with portraits, working
- [x] ~~Save/load~~ — Auto-save at scene transitions + manual save (S key) + Continue on title
- [ ] **End-to-end playthrough**: Verify full game flow start → treasure → epilogue without bugs

---

## P1 — Important Polish (After Pilot Plays Through)

- [ ] **Bilingual system**: Greek/English toggle for all text
- [ ] Sound effects: footsteps (sand/stone/wood), door, item pickup, sea ambience
- [ ] Hotspot highlights on hover
- [ ] Clio's notebook: journal/inventory hybrid
- [ ] NPC dialog trees: branching conversations (currently linear)
- [ ] Cat companion: follows Clio between scenes
- [ ] Comedy beats: Ajax's phone autocorrect, echo gag in cave
- [ ] Right-click default verb (SCUMM-style)
- [ ] Church interior needs its own background image (currently reuses exterior bg)

---

## P2 — Content Depth

- [ ] Character-specific puzzle actions (Ajax climbs, Clio observes)
- [ ] Item combinations in inventory
- [ ] Map screen for fast-travel between visited scenes
- [ ] Historical accuracy tags (VERIFIED / BASED ON / DRAMATIZED)
- [ ] Encyclopedia system (unlockable entries)

---

## P3 — Future / Saga

- [ ] Mobile touch support
- [ ] Voice acting / AI TTS for key moments
- [ ] Chapter 2: Amfissa
- [ ] Chapter 3: Delphi
- [ ] Day/night visual cycle
- [ ] Full soundtrack album release

---

## Technical Debt

- [ ] Clean up unused walk-frames-b64.json loading
- [ ] Add error handling for failed image loads
- [ ] File is 6,011 lines — consider modular structure if it grows past 8K
- [ ] Add version/build date on title screen
- [ ] Church interior reuses `bg-church` (exterior) background — needs dedicated interior art

---

## Assets Status

### Backgrounds (All Done)
| Scene | File | Format |
|-------|------|--------|
| exterior | pixel-exterior.webp | Done |
| terrace | pixel-terrace.webp | Done |
| kitchen | pixel-kitchen.webp | Done |
| port | pixel-port.webp | Done |
| museum | pixel-museum.webp | Done |
| liotrivi | pixel-liotrivi.webp | Done |
| cave | pixel-cave.webp | Done |
| church | pixel-church.webp | Done |
| windmill | pixel-windmill.webp | Done |
| boat | pixel-boat.webp | Done |
| graveyard | pixel-graveyard.webp | Done |
| treasure | pixel-treasure.webp | Done |
| new_era | pixel-new-era.webp | Done |

### Music (Mostly Done)
| Scene | Tracks | Status |
|-------|--------|--------|
| Title | galaxidi-title-theme, the-sea-remembers-title-theme, the-mystery-of-galaxidi | Done (6 variants) |
| Arrival | arrival-at-galaxidi, scene1-music, sun-arrives-in-chora | Done |
| Harbor/Friends | the-harbor-at-dusk | Done (2 variants) |
| Museum | the-maritime-museum | Done (2 variants) |
| Liotrivi | the-old-olive-press | Done (2 variants) |
| Windmill | the-view-from-the-windmill | Done (2 variants) |
| Cave | the-cave-of-karkaros | Done (2 variants) |
| Graveyard | graveyard-veil, the-captain-s-rest, the-ghost-of-captain-visvikis | Done (6 variants) |
| Church | the-map-in-the-church | Done (2 variants) |
| Boat/Crossing | the-crossing, the-sea-remembers | Done (4 variants) |
| Treasure | the-treasure | Done (2 variants) |
| Festival | the-festival | Done (1 variant) |
| Main Theme | the-mystery-of-galaxidi-main-theme | Done (2 variants) |

### Character Sprites (All Done)
All 11 characters have final sprites in `assets/char-*-final.png`

### Cutscene Images (All Done)
26 cutscene PNGs in `assets/cutscene-*.png`
