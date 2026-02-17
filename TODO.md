# Το Μυστήριο του Γαλαξειδίου — TODO

Priority: P0 = must have for pilot, P1 = important polish, P2 = nice to have, P3 = future

**Last audit: 2026-02-17 (evening)**

---

## Current State Summary

| Area | Status | Details |
|------|--------|---------|
| **Scenes** | 13 of 13 (ALL DONE) | exterior, terrace, kitchen, port, museum, liotrivi, cave, church, church_interior, windmill, boat, graveyard, treasure, new_era + epilogue |
| **Code** | 6,875 lines | Single monolithic index.html |
| **Backgrounds** | 14 webp files | All scenes covered incl. church interior |
| **Character Sprites** | 11 (3 family + 8 NPC) | All with idle animation + Chrysostomos added |
| **Portraits** | 8 NPC + 3 family | All dialog portraits exist |
| **Music** | 41 tracks | 2 variants per scene + title themes |
| **Cutscenes** | 12 scripted | arrival, letter, reunion, museum, liotrivi, windmill, cave_enter, ghost, church_tile, crossing, treasure, epilogue |
| **Cutscene Images** | 26 anime stills | Ken Burns rendering |
| **Ghost Sequence** | DONE | Full environmental effects, arm raise, wave, fade |
| **Dialog** | All 13 scenes | Entry + 4-8 objects with verb responses each |
| **Save/Load** | DONE | Auto-save on scene change, manual save (S key), Continue on title |
| **Quest Gating** | DONE | Jade→ghost, candle→tile, chart→boat, letter→new_era |
| **Epilogue** | DONE | 4 pages, click-to-advance, returns to title |
| **Quest Status** | DONE | Q key panel, 14 tracked steps, progress bar |
| **Map** | DONE | M key fast-travel between visited scenes |
| **Custom Cursor** | DONE | Canvas-drawn cursor with verb-aware icons |
| **Y-Depth Sorting** | DONE | Characters + NPCs sorted by Y for proper overlap |
| **Version Stamp** | DONE | v0.1-pilot on title screen |

---

## P0 — MUST HAVE FOR FIRST PILOT — ALL COMPLETE

All P0 items resolved. Game is pilot-ready pending hands-on browser playtest.

- [x] Story alignment (cave puzzle, church interior, navigation routing)
- [x] All 13 scenes implemented with objects, NPCs, dialog
- [x] Quest chain gating (jade→ghost, candle→tile, chart→boat, letter→new_era)
- [x] Treasure + New Era + Epilogue scenes
- [x] All critical systems (portraits, music, ghost sequence, cutscenes, walk animation, dialog, save/load)
- [x] Church candle puzzle ungated from ghost_summoned
- [x] Debug G-key warp removed
- [x] Treasure scene music key fixed (cave_final → treasure)
- [x] Quest panel contrast WCAG fix (#4a3a20 → #8a7a50)
- [x] Interactive ledger object in New Era scene
- [x] Backup asset files cleaned up

---

## P1 — Important Polish (After Pilot Plays Through)

- [ ] **Bilingual system**: Greek/English toggle for all text
- [ ] Sound effects: footsteps (sand/stone/wood), door, item pickup
- [ ] Clio's notebook: journal/inventory hybrid
- [ ] NPC dialog trees: branching conversations (currently linear)
- [ ] Comedy beats: Ajax's phone autocorrect, echo gag in cave
- [x] ~~Hotspot highlights on hover~~ (pulsing gold glow)
- [x] ~~Cat companion~~ (catScenePos in 10 scenes)
- [x] ~~Right-click default verb (SCUMM-style)~~ (contextmenu handler)
- [x] ~~Church interior background~~ (pixel-church-interior.webp)
- [x] ~~Cicadas ambient sound~~ (createCicadasLoop in 6 scenes)

---

## P2 — Content Depth

- [ ] Character-specific puzzle actions (Ajax climbs, Clio observes)
- [ ] Item combinations in inventory
- [x] ~~Map screen for fast-travel~~ (M key, implemented)
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

- [x] ~~Clean up unused walk-frames-b64.json loading~~ (removed)
- [x] ~~Add error handling for failed image loads~~ (onerror handlers on img, audio, voice)
- [ ] File is 6,875 lines — consider modular structure if it grows past 8K
- [x] ~~Add version/build date on title screen~~ (v0.1-pilot stamp)
- [x] ~~Church interior background~~ (pixel-church-interior.webp)
- [x] ~~Debug console.log in cutscene chain~~ (removed)

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
| church_interior | pixel-church-interior.webp | Done |
| windmill | pixel-windmill.webp | Done |
| boat | pixel-boat.webp | Done |
| graveyard | pixel-graveyard.webp | Done |
| treasure | pixel-treasure.webp | Done |
| new_era | pixel-new-era.webp | Done |

### Music (All Done)
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
