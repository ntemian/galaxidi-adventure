# ROADMAP — Το Μυστήριο του Γαλαξειδίου

### From Prototype to Captivating Adventure
### Version 1.0 — February 2026

---

## Current State (Baseline)

| Area | Done | Remaining |
|------|------|-----------|
| **Scenes** | 3 of 10+1 (exterior, terrace, kitchen) | 7 scenes + epilogue |
| **Code** | ~2,500 lines, monolith | Target ~6,000-8,000 lines |
| **Backgrounds** | 3 in-game + 10 generated (not integrated) | Island scene, epilogue festival, some need PNG conversion |
| **Characters** | 3 sprites (Ntemis, Ajax, Clio) | 7 NPC sprites + Ghost sprite |
| **Portraits** | 3 (family) | 7 NPC portraits (Stavros, Curator, Fotini, Eirini, Papas, Chrysostomos, Ghost) |
| **Music** | Title themes + arrival theme + scene1 | 9 scene-specific tracks needed |
| **Puzzles** | 1 (satchel/note) | 11 more puzzles + mini-games |
| **Dialog** | Linear speech queues | Branching dialog trees needed |
| **Animation** | Walk + idle | Cutscenes, expressions, ghost FX, environment |
| **Systems** | Basic verb/inventory | Save/load, bilingual, notebook, encyclopedia, token counter |
| **SFX** | None | Footsteps, ambient, UI, puzzle, water |

---

## PHASE 1: STORY LOCK (1 week)
**"Know what you're building before you build it"**

### 1.1 Resolve Story Track
The project currently has TWO story versions:
- **Game Bible** (10 scenes): 12 captain tokens, αλληλεγγύη theme, community-focused
- **Pilot** (8 scenes): Visvikis treasure hunt, family-focused, green stone

**Decision needed:** Merge or choose. The Pilot has stronger emotional momentum and a clearer treasure-hunt arc. The Game Bible has richer educational depth and more scenes.

**Recommendation:** Use the **Pilot** as the playable story (8 scenes), enriched with Game Bible elements (the museum lesson, the vote inscription, Eirini's future voice). This gives:
- Tighter narrative (8 scenes, not 10)
- Clear treasure-hunt arc (letter → stone → ghost → map → treasure)
- The emotional punches from both versions
- Educational depth woven in naturally rather than front-loaded

### 1.2 Scene Timing & Pacing
Add estimated playtime per scene to control the game's rhythm:

| Scene | Target Duration | Pacing |
|-------|----------------|--------|
| 1. Harbor Arrival | 5-8 min | **Gentle** — tutorial, mood-setting, wonder |
| 2. Grandfather's House | 8-10 min | **Building** — discovery, the letter, quest begins |
| 3. Harbor (Stavros) | 6-8 min | **Engaging** — NPCs, humor, direction |
| 4. Cave (Green Stone) | 8-10 min | **Tense** — dark, mysterious, the find |
| 5. Graveyard (Ghost) | 10-12 min | **Emotional peak** — ghost encounter, silence |
| 6. Church (Map) | 6-8 min | **Warm** — sacred, family, puzzle |
| 7. Boat (Crossing) | 8-10 min | **Beautiful** — scenic, stories, perspective |
| 8. Treasure | 10-12 min | **Climax** — reveal, letter, resolution |
| **Total** | **~70-80 min** | A complete, satisfying session |

### 1.3 Dialog Polish Pass
For each scene, write/refine:
- **Entry dialog** (2-4 lines establishing mood)
- **Object responses** (for Look, Use, Talk verbs — show character personality)
- **Key story beats** (word-for-word, both languages)
- **Comedy beats** (at least 1 per scene — levity between heavy moments)
- **Clio lines** (her observations are the game's secret weapon)
- **Three-option dialogs** for Ntemis at key moments (careful/clever/kids-talked-him-into)

### 1.4 Finalize Storyboard
Update `storyboard.html` to reflect the merged story with:
- Scene-by-scene layout with backgrounds, dialog, music direction
- Timing markers (entry → exploration → puzzle → story beat → exit)
- Transition notes between scenes
- Cutscene placement markers
- Emotional arc graph (visual)

**Deliverables:**
- [ ] Merged story decision documented
- [ ] Scene timing table finalized
- [ ] All dialog written (Greek primary, English translation)
- [ ] `storyboard.html` updated with merged story
- [ ] Emotional arc validated (wonder → mystery → tension → emotion → beauty → catharsis)

---

## PHASE 2: WORLD BUILDING (2-3 weeks)
**"Every scene is a place you want to stay in"**

### 2.1 Scene Implementation (7 new scenes)
For each scene, implement in order:

```
Scene object → Background integration → Objects → Exits → Entry dialog → Test
```

**Scene implementation order** (narrative sequence):

| Order | Scene ID | Background Asset | Status |
|-------|----------|-----------------|--------|
| 1 | `harbor` | pixel-port.jpg → needs PNG conversion 640x400 | Asset exists |
| 2 | `captain_house` | NEW — dark interior, shutters, captain's artifacts | Need to generate |
| 3 | `harbor_evening` | pixel-port.jpg palette swap (warmer, lantern lights) | Derive from port |
| 4 | `cave` | pixel-cave.png | Asset exists |
| 5 | `graveyard` | pixel-graveyard.png | Asset exists |
| 6 | `church` | pixel-church.jpg → needs PNG 640x400 | Asset exists |
| 7 | `boat` | pixel-boat.png | Asset exists |
| 8 | `island` | NEW — rocky islet, chapel, morning light | Need to generate |
| END | `ending` | NEW — harbor with lights, festival | Need to generate |

### 2.2 Interactive Objects Per Scene
Each scene needs 4-6 clickable objects with responses for Look/Use/Talk:

**Scene 1 (Harbor Arrival):**
- Bollards (oversized — "These were built for warships, not dinghies")
- Fishing boats
- Cat (follows Clio)
- Warehouse doors (locked, peeling paint)
- Taverna (not yet — evening)
- Exit to grandfather's house

**Scene 2 (Grandfather's House):**
- Shutters (open them one by one — light floods in)
- Captain's photograph
- Model ships on shelves
- Nautical instruments
- Locked desk drawer → key in copper pot
- Letter inside drawer

**Scene 3 (Harbor Evening):**
- Stavros (main NPC dialog tree)
- 2-3 NPCs at taverna (comic non-answers)
- Fishing nets
- Cat leading toward Plateia Mama
- Stavros's boat

**Scene 4 (Cave):**
- Wall markings ("Λ.Β. 1887")
- Captain initials scratched in stone
- Green stone in wall crack (Clio finds it)
- Echo (use Talk verb → voice echoes)
- Dripping water

**Scene 5 (Graveyard):**
- 3-4 captain headstones with bios
- Visvikis's grave (use stone on headstone → ghost)
- Cypress trees
- Gulf view
- Wild thyme

**Scene 6 (Church):**
- Papas (NPC)
- Icons
- Iconostasis (carved wooden templon)
- Floor tile with "Λ.Β." (Clio spots it)
- Candles (Clio can light one)
- Nautical chart underneath

**Scene 7 (Boat Crossing):**
- Clickable landmarks (Galaxidi, mountains, islands)
- Chrysostomos (NPC dialog)
- Water/wake effects
- Island approaching

**Scene 8 (Treasure):**
- Sea chest
- Gold coins
- Jade necklace
- Ledger (104 signatures)
- Letter

### 2.3 Background Art Quality
Current JPG assets (port, church, windmill) need conversion to proper 640x400 PNG with pixel art consistency. All backgrounds should share:
- Warm Mediterranean palette (gold, terracotta, sea blue, stone grey)
- Consistent pixel density
- Clear walkable area (bottom 40% of frame)
- Interactive object hotspots visible but not glowing

**Art pipeline:**
1. Generate via `losc_imagine` with detailed scene descriptions
2. Resize to exactly 640x400
3. Save as PNG (no compression artifacts)
4. Test in-game for walkability and hotspot placement

**Deliverables:**
- [ ] All 8 scenes playable with navigation
- [ ] 4-6 interactive objects per scene with Look/Use/Talk responses
- [ ] All backgrounds at 640x400 PNG quality
- [ ] Captain's house + island + festival backgrounds generated
- [ ] Scene exits connect properly (bidirectional)

---

## PHASE 3: CHARACTERS & ANIMATION (2 weeks)
**"Every character should feel alive, even when standing still"**

### 3.1 NPC Sprites
Generate pixel-art idle sprites for each NPC at consistent scale:

| NPC | Scene | Visual Description | Priority |
|-----|-------|--------------------|----------|
| **Stavros** | Harbor | Old fisherman, cap, mending nets, weathered face | P0 |
| **Papas** | Church | Orthodox priest, black robes, white beard, warm eyes | P0 |
| **Chrysostomos** | Boat | Old sailor, captain's cap, pipe, tanned | P0 |
| **Ghost** | Graveyard | Translucent captain, formal coat, white beard, proud | P0 |
| **Comic NPCs** | Harbor | 2-3 generic townspeople (taverna customers, shopkeeper) | P1 |

Sprite specs: ~50px wide, transparent PNG, facing right (flip for left), same style as family sprites.

### 3.2 NPC Portraits
For dialog box display. Match the style of existing family portraits:

| NPC | Style Notes |
|-----|------------|
| **Stavros** | Weathered, kind eyes, slight frown, fisherman's cap |
| **Papas** | Warm smile, round face, clerical hat, white beard |
| **Chrysostomos** | Deeply tanned, squint lines, pipe smoke, captain's wisdom |
| **Ghost Visvikis** | Translucent, formal, proud but sad, eyes that have seen everything |

### 3.3 Animation Improvements

**Character expressions:**
- Add expression variants to sprite system: neutral, surprised, thinking, happy, sad
- Implement via overlay or sprite swap at key dialog moments
- Clio: wide eyes when discovering, hand to mouth when surprised
- Ajax: crossed arms when skeptical, leaning forward when excited
- Ghost: gradual fade-in/fade-out with particle trail

**Environmental animation:**
- Water shimmer (harbor, boat scenes) — animated sine wave overlay
- Candle flicker (church, cave) — randomized light radius
- Dust motes (house, cave) — floating particles
- Seagulls (harbor, boat) — simple sprite animation
- Cat walk cycle (follows Clio between scenes)
- Boat rocking (gentle sine on boat scene)
- Cypress sway (graveyard, gentle)

**Ghost special effects:**
- Translucent rendering (40-60% alpha)
- Slight glow aura (white/blue radial gradient)
- Particle trail when moving
- Vision sequence: sepia overlay for flashback imagery
- Fade-to-peace: alpha decreasing over 3 seconds with rising particles

### 3.4 Walk Animation Enhancement
- Add walking sound sync (footstep type changes per scene: stone, wood, sand, marble)
- Family formation: Ntemis leads, Ajax ranges, Clio between them
- NPC walk capability (Stavros shuffles, Papas walks with dignity)
- Ghost float (no legs, hover movement)

**Deliverables:**
- [ ] 4 primary NPC sprites (Stavros, Papas, Chrysostomos, Ghost)
- [ ] 4 NPC portraits for dialog
- [ ] 2-3 generic NPC sprites for background population
- [ ] Ghost rendering with translucency and particles
- [ ] Environmental animations for at least 4 scenes
- [ ] Cat companion sprite + walk cycle

---

## PHASE 4: PUZZLES & SYSTEMS (2-3 weeks)
**"Every puzzle teaches something, every solution reveals story"**

### 4.1 Puzzle Implementation

| # | Scene | Puzzle | Mechanic | Teaches |
|---|-------|--------|----------|---------|
| 1 | House | Find key in copper pot → open drawer | Item search → use | Tutorial: find + use |
| 2 | Harbor | Show letter to NPCs | Use item on NPC | Not everyone knows |
| 3 | Harbor | Find Stavros (he's not obvious) | Exploration | Patience, attention |
| 4 | Cave | Search wall for "Λ.Β. 1887" | Observation | Captain's mark |
| 5 | Cave | Clio finds green stone (only she looks up) | Character-specific | Each person sees differently |
| 6 | Graveyard | Find Visvikis's specific grave | Read headstones | Captain biographies |
| 7 | Graveyard | Use green stone on headstone | Item + location | The ghost trigger |
| 8 | Church | Ask Papas to enter | Dialog | Warmth, trust |
| 9 | Church | Clio spots "Λ.Β." floor tile | Observation | Connection to cave mark |
| 10 | Church | Open tile → nautical chart | Physical puzzle | The map to treasure |
| 11 | Island | Follow chart directions (rock, cross, steps) | Navigation | Visvikis's precision |
| 12 | Island | Dig at correct spot | Action | The reveal |

### 4.2 Branching Dialog Trees
Replace linear speech queues with proper branching:

```
NPC greeting →
  ├── Option A (ask about history) → response → follow-up
  ├── Option B (show item) → recognition or rejection
  └── Option C (humor) → comedy beat → continue
```

Key branching dialogs:
- **Stavros**: 3 topics (Visvikis, the cave, the decline)
- **Papas**: 2 topics (church history, letting them search)
- **Chrysostomos**: 2 topics (Visvikis stories, the sea's lessons)
- **Generic NPCs**: 1-2 comic dead-ends each

### 4.3 Core Systems

**Clio's Notebook (Journal + Inventory):**
- Opens as overlay (tab key or click)
- Left page: inventory items drawn in child's art style
- Right page: clues and observations in Clio's handwriting
- Auto-updates when items found or story beats hit
- Shows task hints if player is stuck ("Ο Σταύρος είπε για σπηλιά...")
- Drawings evolve: the ghost appears after Scene 5, etc.

**Token/Progress Counter:**
- Instead of 12 tokens (Game Bible), the Pilot uses key items:
  - Letter → Green Stone → Ghost encounter → Nautical Chart → Treasure
- Visual progress indicator: 5 objects on a shelf/string, greyed until found
- Each acquisition has a satisfying click + Clio drawing animation

**Save/Load System:**
- localStorage with JSON state
- Auto-save at scene transitions
- 1 manual save slot
- Save includes: scene, inventory, flags, dialog progress
- Load screen shows: scene name, playtime, last item found

**Bilingual System:**
- Language toggle (GR/EN) accessible from pause menu
- All text stored as `{gr: "...", en: "..."}` objects
- Historical documents shown in Greek with English subtitle overlay
- NPC names always in Greek (Σταύρος, not Stavros) regardless of language
- Captain's letter always shows both languages simultaneously

**Encyclopedia (Unlockable):**
- Accessible from pause menu after finding the book in Scene 2
- Entries unlock as player discovers history through gameplay
- Categories: Ships, Captains, Places, The Pact, The Decline
- Each entry: title, image (if available), text (bilingual)
- Marked: VERIFIED / BASED ON / DRAMATIZED

**Deliverables:**
- [ ] All 12 puzzles implemented and tested
- [ ] Branching dialog for 4 NPCs
- [ ] Clio's Notebook system
- [ ] Progress indicator UI
- [ ] Save/load with auto-save
- [ ] Bilingual text system (GR/EN toggle)
- [ ] Encyclopedia system (basic, 10+ entries)

---

## PHASE 5: AUDIO (1-2 weeks)
**"The ear believes before the eye"**

### 5.1 Scene Music
Generate via Suno (`music_suno`) with detailed style prompts:

| Scene | Style | Instruments | Mood | Duration |
|-------|-------|-------------|------|----------|
| 1. Harbor Arrival | Mediterranean folk | Acoustic guitar, bouzouki, cicadas | Warm wonder | 3-4 min loop |
| 2. Captain's House | Mystery/discovery | Piano, soft strings, dust-in-sunbeams | Mysterious warmth | 3-4 min loop |
| 3. Harbor Evening | Taverna atmosphere | Bouzouki, murmur, clinking glasses | Lively, then shifts | 3-4 min loop |
| 4. Cave | Underground echo | Dripping water FX, low drone, resonant tones | Tense wonder | 3-4 min loop |
| 5. Graveyard | Ghost's theme | **Solo Greek lyra** — melancholy → warm → peaceful | Emotional peak | 4-5 min (no loop) |
| 6. Church | Sacred | Choral tones, deep reverb, organ hint | Sacred warmth | 3-4 min loop |
| 7. Boat Crossing | **THE MOST BEAUTIFUL** | Guitar + lyra, sunrise strings, gentle waves | Aching beauty | 4-5 min (no loop) |
| 8. Treasure | Building revelation | Silence → piano → strings → full theme | Catharsis | 5-6 min (no loop) |
| End | Festival | All themes converging, celebration | Joy, completion | 3-4 min |

### 5.2 Sound Effects
Layer ambient audio per scene:

**Environmental:**
- Cicadas (exterior scenes — volume varies)
- Waves (harbor, boat, graveyard — always present)
- Wind (terrace, windmill, boat)
- Seagulls (harbor, boat — occasional)
- Dripping water (cave)
- Church bell (distant, church scene entry)
- Boat creaking (boat scene)

**Interactive:**
- Footsteps: stone (harbor, church), wood (house), gravel (graveyard), sand (island)
- Door open/close (house entry)
- Item pickup (satisfying "tink")
- Drawer open (wooden slide + click)
- Paper unfold (letter, chart)
- Stone scrape (moving tile, finding green stone)
- Shovel hitting wood (treasure reveal)
- Chest open (iron creak)
- Dialog advance (soft click)
- Menu sounds (subtle)

**Special:**
- Ghost appearance (low ethereal tone + wind)
- Ghost fade (ascending chime, peaceful)
- Green stone glow (warm resonance)
- Vision flashback (sepia swoosh)
- Token/progress sound (satisfying click + chime)

### 5.3 Voice Acting (Optional — Phase 8)
- AI TTS for key lines (narrator, letter reading)
- Greek voices with character-appropriate tone
- Only for cinematic moments, not all dialog
- ElevenLabs via `elevenlabs_tts`

**Deliverables:**
- [ ] 9 scene music tracks generated and integrated
- [ ] Ambient audio layers for each scene
- [ ] 15+ sound effects implemented
- [ ] Music crossfade system between scenes
- [ ] Volume controls in pause menu

---

## PHASE 6: CUTSCENES (1-2 weeks)
**"The moments the player will remember forever"**

### 6.1 Key Cinematic Moments

These are NOT pre-rendered videos — they're scripted in-engine sequences with camera movement, timed dialog, special effects, and music sync.

| # | Scene | Moment | Duration | Elements |
|---|-------|--------|----------|----------|
| 1 | House | **Letter Reading** | 45 sec | Zoom on letter, Ntemis voice, children react, music swells |
| 2 | Graveyard | **Ghost Appears** | 60 sec | Green stone glows, air shimmers, ghost fades in, silence, music enters |
| 3 | Graveyard | **Ghost's Vision** | 90 sec | Sepia overlay, harbor full of ships, ships leaving one by one, harbor empties |
| 4 | Graveyard | **Ghost Fades** | 30 sec | Clio waves, ghost waves back, particles rise, lyra resolves to peace |
| 5 | Boat | **The Crossing** | 60 sec | Pan across gulf, landmarks highlighted, Chrysostomos speaks, sunset |
| 6 | Treasure | **Chest Opens** | 45 sec | Items revealed one by one, each with music build, silence before letter |
| 7 | Treasure | **Captain's Letter** | 90 sec | Full text scroll, bilingual, music climax, family reactions interspersed |
| 8 | Ending | **Festival** | 60 sec | Harbor with lights, all NPCs gathered, dolphins, final text |

### 6.2 Cutscene Engine
Build a simple cutscene system:

```javascript
cutscene = [
  { type: 'camera', target: {x: 320, y: 200}, zoom: 1.5, duration: 1000 },
  { type: 'dialog', who: 'ntemis', text: '...', portrait: true },
  { type: 'wait', ms: 500 },
  { type: 'effect', name: 'ghost-appear', duration: 2000 },
  { type: 'music', track: 'ghost-theme', fade: 1000 },
  { type: 'overlay', image: 'sepia-harbor', alpha: 0.8, duration: 5000 },
  { type: 'dialog', who: 'clio', text: '...', portrait: true },
  { type: 'effect', name: 'ghost-fade', duration: 3000 },
];
```

Features needed:
- Camera pan/zoom (smooth, eased)
- Timed dialog with auto-advance
- Music triggers (play, fade, stop)
- Visual overlays (sepia, darken, lighten)
- Particle effects
- Character movement scripting
- Input disabled during cutscene (with skip option)
- Skip button (press ESC or click "Skip" — never force-watch)

### 6.3 Transition Effects Between Scenes
Replace hard-cut scene changes with:
- **Iris wipe** (classic SCUMM style — circle closes/opens)
- **Fade to black** (for emotional transitions: graveyard → church)
- **Fade through white** (for the ghost's vision)
- **Dissolve** (boat crossing scenic moments)
- Duration: 500-800ms per transition

**Deliverables:**
- [ ] Cutscene engine (timeline-based scripting)
- [ ] 8 key cutscenes scripted and tested
- [ ] Scene transition effects (iris, fade, dissolve)
- [ ] Skip functionality for all cutscenes
- [ ] Ghost vision sequence (sepia flashback)

---

## PHASE 7: CAPTIVATION POLISH (1-2 weeks)
**"The difference between a good game and one people tell their friends about"**

### 7.1 Environmental Storytelling
Every scene should tell its story even without dialog:

- **Harbor**: Oversized bollards with tiny boats = decline without a word
- **Captain's House**: Dust, covered furniture, then light = awakening
- **Cave**: Marks on walls = generations of captains
- **Graveyard**: Ships carved in marble = lives defined by the sea
- **Church**: Layers visible in architecture = time itself
- **Boat**: Galaxidi shrinking in the distance = perspective

### 7.2 Micro-Interactions (Polish Details)
Small touches that make the world feel alive:

- **Clio's cat companion** follows between scenes, sits on specific objects, reacts to events
- **Dolphins** visible in harbor water at key moments (callback to opening)
- **Time of day** shifts as story progresses (golden hour → evening → dusk → night → dawn → morning)
- **Clio randomly comments** on things the player hasn't clicked ("Μπαμπά, κοίτα εκεί!")
- **Ajax picks up extra items** not in the puzzle chain (shells, rocks — adds character)
- **Weather subtle changes**: wind picks up at emotional moments, calms for peaceful ones
- **Stars appear** in evening/night scenes (graveyard, church)
- **Fireflies** in garden and graveyard scenes
- **Sepia photograph overlay** when examining old photos (compare past/present)

### 7.3 UI/UX Polish

**Verb bar redesign:**
- Classic SCUMM-style bottom bar: Give | Open | Close | Pick Up | Look At | Talk To | Push | Pull | Use
- Simplified for this game: Look | Use | Talk | Walk (+ cursor change)
- Active verb highlighted, cursor changes to match

**Hotspot feedback:**
- Objects glow subtly on mouseover (outline highlight)
- Cursor changes to magnifying glass (Look), hand (Use), speech bubble (Talk)
- Object name appears in small text near cursor

**Inventory improvements:**
- Drag-and-drop items onto scene objects
- Item descriptions on hover
- Clio's drawings appear as item icons

**Scene header:**
- Scene name fades in when entering ("ΤΟ ΛΙΜΑΝΙ / THE PORT")
- Subtitle: ("Η θάλασσα θυμάται / The sea remembers")
- Fades out after 3 seconds

### 7.4 Humor
The game needs levity to balance the emotional weight:

**Running gags:**
- Cat follows Clio everywhere — increasingly improbable (in the cave? in the church?)
- Ajax's phone: gives wrong but funny answers, autocorrects Greek history
- Ntemis's espresso count (mentioned in dialog, increases across scenes)
- Clio's "Σας το είπα" (I told you so) — each time more justified

**Comedy beats per scene:**
| Scene | Beat |
|-------|------|
| House | Clio: "Θα έχει φαντάσματα;" Ntemis: "...Θα έχει σκόνη." |
| Harbor | NPCs give increasingly absurd responses to the letter |
| Cave | Echo gag — Ajax yells, his echo comes back in ancient Greek |
| Graveyard | "Μόλις μας έδωσε οδηγίες ένα φάντασμα." |
| Church | Ajax tries to climb iconostasis, Papas stops him |
| Boat | Chrysostomos tells a "fish that got away" story |
| Treasure | Ajax: "Αξίζει κάτι;" (after finding actual gold) |

### 7.5 Emotional Pacing Map

```
Scene 1: WONDER ████████░░ (arrival warmth)
Scene 2: MYSTERY ██████████ (letter, quest begins)
Scene 3: HUMOR ████████░░ (NPCs, Stavros)
Scene 4: TENSION ██████████ (dark cave, discovery)
Scene 5: EMOTION ████████████ (ghost — PEAK)
Scene 6: WARMTH ██████░░░░ (church, candle, relief)
Scene 7: BEAUTY ██████████ (boat — MOST BEAUTIFUL)
Scene 8: CATHARSIS ████████████ (treasure — CLIMAX)
Ending: JOY ██████████ (festival, resolution)
```

The rhythm: build → release → build higher → release deeper. Never two heavy scenes in a row. After the ghost (emotional peak), the church provides warmth and relief before the boat's beauty and the treasure's catharsis.

**Deliverables:**
- [ ] Environmental storytelling elements in all scenes
- [ ] 8+ micro-interactions (cat, dolphins, time of day, random comments)
- [ ] UI polish: hotspot highlights, cursor changes, verb bar, scene headers
- [ ] 7+ comedy beats implemented
- [ ] Emotional pacing validated through playtest

---

## PHASE 8: SHIP IT (1 week)
**"A gift to Galaxidi and the world"**

### 8.1 Bilingual Completeness
- All text in both GR and EN
- Language selector on title screen
- Historical documents show Greek original + translation
- Captain's letter always bilingual

### 8.2 Testing
- **Full playthrough** start to finish, both languages
- **Puzzle logic** — no dead ends, no pixel hunting
- **Edge cases** — clicking everything, wrong item combinations
- **Performance** — smooth 60fps on mid-range hardware
- **Browser compatibility** — Chrome, Firefox, Safari, Edge
- **Mobile** — basic touch support (tap = click, drag = walk)

### 8.3 Title Screen & Credits
- Title screen with animated harbor background
- "ΤΟ ΜΥΣΤΗΡΙΟ ΤΟΥ ΓΑΛΑΞΕΙΔΙΟΥ" in gold
- "THE MYSTERY OF GALAXIDI" subtitle
- "New Game" / "Continue" / "Language: GR|EN"
- Credits: created by, historical sources, music credits, acknowledgments
- "A gift to Galaxidi and the world."
- Post-credits: "Chapter 2: Amfissa — Coming soon..."

### 8.4 Hosting
- Static HTML — host anywhere (GitHub Pages, Netlify, custom domain)
- Domain: galaxidi-adventure.gr or similar
- Open source: MIT license
- Share with Galaxidi community

**Deliverables:**
- [ ] All text bilingual (GR/EN)
- [ ] Full playthrough tested in 2 languages
- [ ] No dead-end bugs
- [ ] Title screen + credits
- [ ] Hosted online, shareable link
- [ ] Shared with Galaxidi community for feedback

---

## PHASE 9: IMMERSION & PSYCHOLOGY (from Game Design Academy Audit)
**"The difference between a game people play and a game people feel"**

**Source:** `AUDIT.md` — systematic audit of all 10 Academy chapters against actual game code.
**Overall score:** 68/100 — strong soul, needs responsive nerves.

### 9.0 Tier 1 — Highest Impact, Lowest Effort (Do First)

These 5 changes deliver the most immersion improvement for the least work:

| # | Change | Effort | Impact | Academy Chapter |
|---|--------|--------|--------|-----------------|
| 1 | **Variable typewriter speed** — fast for Ajax excitement (0.02s), slow for final letter (0.06s), flickering for ghost (0.08s) | 1 hour | Very High | IX. Neuroscience — Emotional Contagion |
| 2 | **2-3 seconds total silence before ghost** — cut ALL ambient sound before swirl particles begin | 15 min | High | VII. Sound — Strategic Silence |
| 3 | **Character-voiced verb defaults** — replace generic "Δεν γίνεται" with Ajax/Clio/Ntemis personality lines, rotated | 2 hours | High | IV. Dialog — Verb Responses |
| 4 | **5 NPC cross-reference lines** — Athos: "Ο επιμελητής μου τηλεφώνησε", Giannis: "Ο Άθος είπε ότι θα ερχόσασταν" etc. | 30 min | High | VI. World — Connected World |
| 5 | **20 wrong-verb comedy lines** — "Use fish on ghost" → Ajax: "Δεν νομίζω ότι πεινάει, μπαμπά" | 2 hours | High | II. Emotions — Humor |

### 9.1 Tier 2 — High Impact, Medium Effort

| # | Change | Effort | Impact | Academy Chapter |
|---|--------|--------|--------|-----------------|
| 6 | **Eureka character reactions** — when jade found: Ajax jumps, Clio says "Αυτό είναι! Το πράσινο πέτρωμα!" When chart found: Clio voices "Λ.Β. = Λουκάς Βισβίκης!" | 2 hours | High | II. Emotions — Eureka |
| 7 | **Populate "Look Twice" for all major objects** — system exists, needs content. 1st look = description, 2nd = character memory/joke | 3 hours | High | IV. Dialog — Look Twice Rule |
| 8 | **2 background Zeigarnik loops** — (a) Why does the cat follow Clio specifically? Resolved: cat belonged to Visvikis's daughter who looked like Clio. (b) Chrysostomos knew Ntemis's father: "Ήταν ο τελευταίος που επισκέφθηκε ο πατέρας σου πριν..." Resolved in epilogue | 1 hour | Medium | VIII. Psychology — Zeigarnik Effect |
| 9 | **Differentiated character reactions at peaks** — Ghost appears: Ajax freezes (fear), Clio steps forward (fascination), Ntemis whispers "Παππού;" (recognition). Treasure: Ajax cheers, Clio examines, Ntemis reads alone | 2 hours | High | IX. Neuroscience — Mirror Neurons |
| 10 | **Three Clue Rule fixes** — Copper pot: add visual wobble + Clio "Ακούς αυτό;" on entry. Church tile: Papas says "Σημάδεψε κάθε πέτρα αυτής της εκκλησίας" | 1 hour | Medium | III. Puzzles — Three Clue Rule |

### 9.2 Tier 3 — Medium Impact, Higher Effort

| # | Change | Effort | Impact | Academy Chapter |
|---|--------|--------|--------|-----------------|
| 11 | **1 unremarkable detail per scene** — objects with NO gameplay purpose that reward looking: date carved in door frame (1887), chalk drawing on quay, guest book in museum, fossil in cave wall, fresh flower on unmarked grave, carved name on mast | 3 hours | Medium | I. Immersion — Environmental Storytelling |
| 12 | **10-15 "surprise" Look responses** — scattered across scenes. Objects that reveal unexpected character memories, jokes, or historical details. Creates explorer's dopamine loop (variable reward schedule) | 3 hours | Medium | IX. Neuroscience — Dopamine |
| 13 | **Visvikis leitmotif** — simple 4-6 note nautical melody: faint in museum bg (unconscious), full at graveyard ghost (recognition), final in epilogue on Stathis's guitar (the dead captain's melody, carried by the living) | 4 hours | High | VII. Sound — Music as Narrative |
| 14 | **Epilogue obsessive polish** — per Peak-End Rule, this scene determines how the ENTIRE game is remembered. Slow typewriter (0.07s), unique music, longer pauses, 104-signature ceremony must echo across 170 years | 3 hours | Very High | VIII. Psychology — Peak-End Rule |
| 15 | **Terrace reflection scene** — after graveyard/church, family returns at dusk. No puzzle. Ajax talks about cave fear, Clio about αλληλεγγύη, Ntemis about his father. The game's campfire moment | 2 hours | Medium | V. Pacing — Campfire Moment |

### 9.3 Tier 4 — Lower Priority

| # | Change | Effort | Impact | Academy Chapter |
|---|--------|--------|--------|-----------------|
| 16 | **Item combinations** (3-4): lantern + matches → lit lantern, chart + compass → marked route | 4 hours | Medium | I. Immersion — Systemic Layer |
| 17 | **Port scene mini-puzzle** — break three-breather stretch. Akis won't talk until you Look at his flute, or a locked warehouse needs fisherman's key | 2 hours | Medium | III. Puzzles — Difficulty Curve |
| 18 | **Museum dialog restructure** — break curator info dump into 2-fact chunks separated by player interaction (Cognitive Load Theory: max 4 items in working memory) | 2 hours | Medium | IV. Dialog — Double Duty |
| 19 | **Flow channel fix for breather stretch** — Port → Museum → Liotrivi are 3 consecutive breathers. Add challenge to at least one | 2 hours | Medium | VIII. Psychology — Flow State |

### 9.4 Psychology Principles Checklist

Per-scene verification checklist (from Academy Chapters VIII-IX):

- [ ] At least 3 Zeigarnik loops open at any time (main mystery + current puzzle + background question)
- [ ] Peak moment (ghost) and End moment (epilogue) get 30% of emotional design effort
- [ ] Typewriter speed varies by emotional context (not constant 0.03s)
- [ ] Variable reward: 20% of Look responses are unexpectedly rewarding
- [ ] DMN breathing room exists after every emotional peak (no puzzles immediately after ghost)
- [ ] Characters react DIFFERENTLY to same events (3-channel emotional bandwidth)
- [ ] Mere exposure: key words/melodies recur 3+ times across game (αλληλεγγύη, leitmotif)
- [ ] No info dump exceeds 4 facts without player interaction break
- [ ] Loss aversion leveraged: ghost's 120-year wait framed as loss prevention, not treasure gain

### 9.5 Per-Scene Immersion Checklist

For EVERY scene, verify all boxes:

- [ ] At least ONE thing is moving (particles, light, water, wind)
- [ ] Ambient sound matches what the player sees
- [ ] Entry dialog establishes mood in 2-3 lines
- [ ] 4-6 interactive objects minimum
- [ ] At least one object rewards "Look" with character personality
- [ ] At least one object has no puzzle purpose (environmental storytelling)
- [ ] Wrong verbs give funny or character-driven responses (not "Δεν γίνεται")
- [ ] NPCs reference events from other scenes
- [ ] Music matches the emotional tone
- [ ] Second "Look" gives a different response for key objects
- [ ] Characters react to the scene, not just to objects
- [ ] Exit transitions feel natural

**Deliverables:**
- [ ] Tier 1 changes (5 items) — implemented and tested
- [ ] Tier 2 changes (5 items) — implemented and tested
- [ ] Per-scene immersion checklist passes for all 13 scenes
- [ ] Psychology checklist all boxes checked
- [ ] Full playthrough validates emotional arc with new changes
- [ ] `AUDIT.md` score updated from 68/100 to target 85+/100

---

## TIMELINE OVERVIEW

```
Week 1       PHASE 1: Story Lock
             ├── Merge story tracks
             ├── Scene timing
             ├── Dialog polish
             └── Storyboard update

Weeks 2-4    PHASE 2: World Building
             ├── 7 new scenes implemented
             ├── Background art finalized
             └── Interactive objects

Weeks 5-6    PHASE 3: Characters & Animation
             ├── NPC sprites + portraits
             ├── Ghost effects
             └── Environmental animation

Weeks 7-9    PHASE 4: Puzzles & Systems
             ├── All puzzles
             ├── Dialog trees
             ├── Save/load
             └── Bilingual + notebook

Weeks 10-11  PHASE 5: Audio
             ├── Scene music (Suno)
             ├── Sound effects
             └── Ambient layers

Weeks 12-13  PHASE 6: Cutscenes
             ├── Cutscene engine
             ├── 8 cinematic moments
             └── Scene transitions

Weeks 14-15  PHASE 7: Polish
             ├── Micro-interactions
             ├── UI polish
             ├── Humor beats
             └── Playtesting

Week 16      PHASE 8: Ship It
             ├── Bilingual QA
             ├── Hosting
             └── Community launch

Week 17-18   PHASE 9: Immersion & Psychology (Academy Audit)
             ├── Tier 1: Variable typewriter, silence, verb comedy (3 days)
             ├── Tier 2: Eureka reactions, Look Twice, Zeigarnik loops (4 days)
             ├── Tier 3: Unremarkable details, leitmotif, epilogue polish (5 days)
             └── Per-scene immersion checklist validation
```

---

## PRINCIPLES

1. **Story first.** Every feature serves the story. If it doesn't teach history or build emotion, cut it.
2. **Warm, never dark.** This is a family game. Mystery, not horror. Wonder, not danger. Melancholy, not despair.
3. **Show, don't tell.** Environmental storytelling over exposition. The oversized bollards say more than a paragraph.
4. **Earn the emotion.** The ghost scene works because 4 scenes of discovery precede it. The letter works because the whole game leads to it.
5. **Clio is the compass.** When in doubt about tone, ask: would a seven-year-old feel safe? Would she notice this? Would she draw it?
6. **Humor is oxygen.** Every heavy scene needs a release valve. The cat. Ajax's phone. Ntemis's espresso.
7. **Greek-first.** The game is in Greek first, for Greek players, about a Greek town. The English is a gift to the world, not the primary audience.
8. **Κρατήστε το σύμφωνο. Αλλάξτε το πλοίο.** This is both the game's message and its development philosophy. Build with solidarity. Don't be afraid to change course.

---

*Roadmap v1.0 — February 2026*
*For Ajax and Clio, and for every child who will learn this story.*
