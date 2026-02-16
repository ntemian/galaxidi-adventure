# Το Μυστήριο του Γαλαξειδίου — TODO

Priority: P0 = must have, P1 = important, P2 = nice to have, P3 = future

## P0 — Story Implementation (Game Bible scenes)

### Scene 1: ΤΟ ΣΠΙΤΙ (The House) — PARTIALLY DONE
- [x] Exterior sub-scene with background, objects, exits
- [x] Terrace sub-scene with harbor view, dolphin event
- [x] Kitchen sub-scene with satchel puzzle
- [ ] **Rework to match Game Bible**: old photograph discovery (harbor 1870 packed with ships)
- [ ] **Token #1**: Clio finds loose terrace tile → captain's token (ΑΛΛΗΛΕΓΓΥΗ coin)
- [ ] **Encyclopedia book**: Clio finds the Galaxidi book left by house owner
- [ ] **Key dialog**: "Πού πήγαν όλα;" / "Τι σημαίνει αλληλεγγύη;"
- [ ] **Clio's notebook**: first drawing (the coin) — inventory/journal system

### Scene 2: ΤΟ ΛΙΜΑΝΙ (The Port)
- [ ] Background art: crescent harbor at golden hour, oversized bollards, warehouses
- [ ] Stavros NPC: fisherman mending nets, quest hook, steamship story
- [ ] Interactive harbor objects with micro-histories (bollards, dry dock, warehouses)
- [ ] Ajax diving off wall → finds old ship timber
- [ ] Clio befriends harbor cats
- [ ] NPCs on benches and at cafés
- [ ] Token #2 (from Stavros quest chain)
- [ ] Music: harbor bouzouki, shifts to minor key for decline talk

### Scene 3: ΤΟ ΝΑΥΤΙΚΟ ΜΟΥΣΕΙΟ (The Nautical Museum)
- [ ] Background art: museum interior, model ships in glass cases, steamship corner
- [ ] Curator NPC: passionate, detailed, honest tour
- [ ] Interactive exhibits: ships, photos, instruments (bilingual text)
- [ ] Captain portrait gallery with real names/bios
- [ ] The steamship corner — pivotal narrative turn
- [ ] Model ship puzzle → find key → Token #3
- [ ] Ajax's "Can being the best hurt you?" moment
- [ ] Music: reflective piano/strings → minor key shift at steamship corner

### Scene 4: ΛΙΟΤΡΙΒΙ (Liotrivi Bar)
- [ ] Background art: stone walls, olive press, amber lighting
- [ ] Fotini NPC: captain's descendant, history test dialogue puzzle
- [ ] Eirini NPC (outside): tech entrepreneur, future voice
- [ ] Clio hiding — fact-vs-fiction mini-game
- [ ] Token #4 from Fotini
- [ ] Comedy beat: "Πόση ώρα είσαι εδώ;" / "Από το τσίπουρο."
- [ ] Music: rebetiko warmth, electronic shift for Eirini

### Scene 5: ΤΟ ΣΠΗΛΑΙΟ (The Cave — Plateia Mama)
- [ ] Background art: cave interior, stone door with 12 indentations
- [ ] Captain's marks on walls (interactive)
- [ ] Token door mechanism — place tokens, visual flash per captain
- [ ] Vote inscription discovery: "Rejected 9 to 3"
- [ ] Clio's devastating question: "Γιατί δεν τους άκουσαν;"
- [ ] Music: underground wonder, silence at vote inscription

### Scene 6: ΑΓΙΟΣ ΝΙΚΟΛΑΟΣ (Church)
- [ ] Background art: church interior, icons, candles, light through windows
- [ ] Papas NPC: warm, mischievous, church history
- [ ] Architecture puzzle → Token #5
- [ ] Clio lights a candle for the captains
- [ ] Music: sacred warmth, choral tones

### Scene 7: Ο ΜΥΛΟΣ (The Windmill)
- [ ] Background art: windmill terrace, panoramic view
- [ ] Map puzzle: connect token locations → ship pattern eureka
- [ ] Telescope mini-game (Clio spots harbor marking)
- [ ] Ntemis's reflection: "It needs to become what it can be"
- [ ] Music: soaring vista theme

### Scene 8: ΤΟ ΚΑΡΑΒΙ (The Boat)
- [ ] Background art: boat on gulf, sunset, coastal chapel
- [ ] Chrysostomos NPC: old sailor, stories, wisdom about change
- [ ] Scenic boat ride with clickable landmarks
- [ ] Token at coastal chapel + logbook page
- [ ] Return sequence: sunset, sleeping Clio, Ajax's realization
- [ ] Music: THE most beautiful — guitar and lyra, sunset, aching nostalgia

### Scene 9: ΤΟ ΝΕΚΡΟΤΑΦΕΙΟ (The Graveyard)
- [ ] Background art: old cemetery, marble headstones, sea views, dusk
- [ ] Interactive headstones with captain biographies
- [ ] Ghost encounter: gentle, proud, sad, NOT scary
- [ ] Ghost's vision: golden age → decline (wordless)
- [ ] Token from headstone base
- [ ] Clio draws the ghost, waves goodbye
- [ ] Music: solo lyra — ghost's theme, most memorable in game

### Scene 10: ΤΟ ΣΠΗΛΑΙΟ — ΤΕΛΙΚΗ (Cave — Final Return)
- [ ] 12-token placement cinematic sequence
- [ ] Door opens → sea chest → ledger + letter
- [ ] Captain's letter read aloud (bilingual)
- [ ] Family reaction: Clio's final line, Ajax's "Τότε ας το κάνουμε"
- [ ] Music: building from silence, each token adds instrument, new melody at end

### Epilogue: Η ΓΙΟΡΤΗ (The Festival)
- [ ] Festival scene: harbor with lights, all NPCs gathered
- [ ] Eirini's "New Pact" book
- [ ] Clio's drawing hung in museum
- [ ] Final text: "Η θάλασσα θυμάται. Εμείς επίσης."
- [ ] Post-credits: real Galaxidi acknowledgment, Chapter 2 tease

## P0 — Systems

- [ ] **Bilingual system**: Greek/English toggle, parallel text for all content
- [ ] **Token counter**: UI showing collected/12 tokens
- [ ] **Clio's notebook**: journal/inventory hybrid — she draws items and clues
- [ ] **NPC dialog trees**: branching conversation system (not just linear)
- [ ] **Save/load**: localStorage, at least 1 save slot
- [ ] **Encyclopedia**: historical reference accessible from menu

## P1 — Polish

- [ ] Sound effects: footsteps (sand/stone/wood), door, item pickup, sea ambience, gulls
- [ ] Scene-specific music for each location
- [ ] Ambient particles: fireflies, dust motes, sea spray per scene
- [ ] Scene transitions: iris wipe or fade
- [ ] Hotspot highlights on hover
- [ ] Right-click default verb (SCUMM-style)

## P2 — Content Depth

- [ ] Character-specific actions: Ajax reaches small spaces, Clio reads ancient Greek
- [ ] Combine items in inventory
- [ ] Flashback scenes (sepia tone, captain era)
- [ ] Map screen for fast-travel
- [ ] Multiple endings based on choices
- [ ] Historical accuracy tags (VERIFIED / BASED ON / DRAMATIZED)

## P3 — Future / Saga

- [ ] Mobile touch support
- [ ] Chapter 2: Amfissa
- [ ] Chapter 3: Delphi
- [ ] Community expansion framework
- [ ] Voice acting / AI TTS
- [ ] Day/night cycle
- [ ] Animated cutscenes
- [ ] Full soundtrack album

## Technical Debt

- [ ] Clean up unused walk-frames-b64.json loading
- [ ] Add error handling for failed image loads
- [ ] Consider splitting index.html if it exceeds ~2000 lines
- [ ] Add versioning (show build date on title screen)

## Art Assets Needed

| Scene | Background | Style Notes |
|-------|-----------|-------------|
| house (exterior) | pixel-exterior.png | Done |
| house (terrace) | pixel-terrace.png | Done |
| house (kitchen) | pixel-kitchen.png | Done |
| port | — | Golden hour, crescent harbor, oversized infrastructure |
| museum | — | Interior, model ships in glass, steamship corner |
| liotrivi | — | Stone walls, olive press, amber lighting, bar |
| cave | — | Natural chamber, stone door, captain marks on walls |
| church | — | Icons, candles, light through windows, dust motes |
| windmill | — | Panoramic terrace, town/harbor/gulf/mountains below |
| boat | — | Gulf at sunset, Elpida boat, coastal chapel |
| graveyard | — | Marble headstones, sea views, wild thyme, dusk |
| cave_final | — | Same cave, door open, revealed chamber |
| epilogue | — | Harbor with lights, festival, fireworks |

## Music Needed

| Scene | Style | Existing? |
|-------|-------|-----------|
| House | Warm acoustic guitar, main theme simple, cicadas | scene1-music.mp3 (partial) |
| Port | Harbor bouzouki, shifts to minor for decline | — |
| Museum | Piano/strings → minor key at steamship | — |
| Liotrivi | Rebetiko warmth, electronic shift for Eirini | — |
| Cave | Underground wonder, resonant tokens, silence at vote | — |
| Church | Sacred warmth, choral, warm reverb | — |
| Windmill | Soaring vista, strings + guitar, full theme | — |
| Boat | Guitar + lyra, sunset, aching nostalgia — MOST BEAUTIFUL | — |
| Graveyard | Solo lyra, ghost's theme — MOST MEMORABLE | — |
| Cave Final | Building from silence, each token = instrument | — |
| Epilogue | Celebration, all themes converging | — |
| Title | Title theme | the-sea-remembers-title-theme-1/2.mp3 |

## Reference Links

- https://galaxidi.eu/ — Official Galaxidi info
- https://syngalax.gr/ — Σύνδεσμος Γαλαξειδιωτών history timeline
