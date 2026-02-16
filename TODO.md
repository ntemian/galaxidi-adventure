# Galaxidi Adventure — TODO

Priority: P0 = must have, P1 = important, P2 = nice to have, P3 = future

## P0 — Core Game (make it playable end-to-end)

- [ ] **Port scene** — harbor at night, meet the mysterious "Γ.", fisherman NPC
- [ ] **Town scene** — old town square, shops, clues about the sea's secret
- [ ] **Beach scene** — rocky shore, tide pools, something the sea left behind
- [ ] **Cave scene** — the climax location, what the sea remembers
- [ ] **Puzzle chain** — complete 5-6 puzzles linking all scenes to ending
- [ ] **Win screen** — ending sequence with emotional payoff
- [ ] **Save/load** — localStorage, at least 1 save slot

## P1 — Polish

- [ ] **Sound effects** — footsteps (sand/stone/wood), door, item pickup, sea ambience, gulls
- [ ] **Scene-specific music** — different track per location (port=bouzouki, cave=tension, beach=waves)
- [ ] **Ambient particles** — fireflies (exterior), dust motes (kitchen), sea spray (port/beach)
- [ ] **Scene transitions** — iris wipe or fade between locations
- [ ] **More NPC interactions** — fisherman, monk, old woman, mysterious stranger "Γ."
- [ ] **Dialog trees** — branching conversation with NPCs (not just linear)
- [ ] **Hotspot highlights** — subtle glow on hover for interactive objects
- [ ] **Right-click default verb** — like real SCUMM games

## P2 — Content & Depth

- [ ] **Church scene** — Byzantine church, monk with cryptic hints
- [ ] **Hilltop scene** — panoramic view, telescope, Parnassus
- [ ] **Boat scene** — fishing boat, sea exploration
- [ ] **More inventory puzzles** — combine items, use items on objects
- [ ] **Character-specific actions** — Ajax can reach small spaces, Clio reads ancient Greek
- [ ] **Flashback scenes** — the sea's memories (sepia tone, different era)
- [ ] **Map screen** — Galaxidi overview to fast-travel between visited scenes
- [ ] **Multiple endings** — based on choices and puzzle solutions

## P3 — Future

- [ ] **Mobile touch support** — touch-friendly verb selection, pinch zoom
- [ ] **Multiple acts** — Act 2 "Η Αναζήτηση", Act 3 "Η Αλήθεια"
- [ ] **Animated cutscenes** — key story moments with cinematic framing
- [ ] **Voice acting** — recorded Greek dialog (or AI TTS)
- [ ] **Day/night cycle** — affects puzzles, NPC availability, mood
- [ ] **Minigames** — fishing, boat sailing, constellation finding
- [ ] **Trailer** — cinematic trailer for sharing
- [ ] **Soundtrack album** — full original score

## Technical Debt

- [ ] Clean up unused walk-frames-b64.json loading (procedural animation replaced it)
- [ ] Add error handling for failed image loads (show placeholder)
- [ ] Consider splitting index.html if it exceeds ~2000 lines
- [ ] Add versioning (show build date on title screen)

## Art Assets Needed

| Scene | Background | Status |
|-------|-----------|--------|
| exterior | pixel-exterior.png | Done |
| terrace | pixel-terrace.png | Done |
| kitchen | pixel-kitchen.png | Done |
| port | — | Need (night harbor, warm lights) |
| town | — | Need (old town square, lanterns) |
| beach | — | Need (rocky shore, moonlit) |
| cave | — | Need (dark entrance, mysterious glow) |
| church | — | Need (Byzantine, candlelit) |
| hilltop | — | Need (panorama, starry sky) |

Note: Old scene backgrounds exist in `inspiration/` (scene-*.png) but are for the previous version's style. May need new art matching current warm Mediterranean aesthetic.
