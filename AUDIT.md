# Game Design Academy Audit — Η Θάλασσα Θυμάται

**Audited**: 2026-02-18
**Game version**: v0.1-pilot (2026-02-17)
**File**: index.html (~9000 lines)
**Method**: Every principle from `game-design-academy.html` checked against actual code

---

## Scorecard

| # | Chapter | Score | Verdict |
|---|---------|-------|---------|
| I | Immersion | **8/10** | Strong sensory layer. Systemic layer needs depth. |
| II | Emotions | **7/10** | Wonder, tension, bittersweet present. Humor and eureka under-exploited. |
| III | Puzzles | **7/10** | Fair and logical chain. Three Clue Rule partially applied. No item combos. |
| IV | Dialog | **6/10** | Character voices exist but verb responses are often generic. No "Look Twice" consistency. |
| V | Pacing | **7/10** | Good sawtooth curve. Three-breather stretch is a risk. Campfire moment exists on boat. |
| VI | World Building | **7/10** | Real-place iceberg is powerful. NPC cross-references are minimal. |
| VII | Sound | **8/10** | Music + Ambience excellent. SFX layer exists but thin. No leitmotif system. |
| VIII | Psychology | **6/10** | Flow channel works. Zeigarnik loops are thin. Peak-End needs more investment. |
| IX | Neuroscience | **5/10** | Typewriter speed is constant (misses emotional contagion). No variable reward. DMN moments exist but unintentional. |

**Overall: 68/100 — Strong foundation, specific gaps to close.**

---

## Chapter I: Immersion — 8/10

### What's Working

**Sensory layer: EXCELLENT**
- 13 unique scenes with distinct visual identity
- Per-scene ambient sound (waves, cicadas, wind, drips, seagulls, taverna crowd, church bell)
- Per-scene visual effects (god-rays, dust motes, fireplace glow, water sparkles, fog, candle flicker)
- Every scene has movement (particles, light shifts) — passes "Never a Still Frame" test

**Narrative layer: GOOD**
- Visvikis treasure hunt creates genuine forward momentum
- Entry dialog establishes mood in 2-4 lines per scene
- Multiple open loops running (main mystery + per-scene questions)

**First 30 Seconds Rule: PASSES**
- Movement: Yes (ambient particles in every scene)
- Sound: Yes (ambient starts immediately)
- Response: Yes (hover highlights, entry dialog auto-plays)
- Density: Yes (4-6+ objects per scene)

### Gaps Found

**Systemic layer: THIN**
- Only 4 verbs (Look, Talk, Open, Use) — no Pick Up, Push, Pull, Give
- No item combination system at all
- Items are used individually on scene objects or as gate keys
- No character-specific puzzle actions (any character can do anything)

**Environmental Storytelling: PARTIAL**
- Kitchen is strong (model ships, instruments, old photos = "who lived here")
- But most scenes lack "what happened recently" or "what might happen next" objects
- Very few objects with NO puzzle purpose (the "unremarkable detail" principle)

### Specific Suggestions

1. **Add 1 "unremarkable detail" per scene** — objects with no gameplay purpose that reward looking:
   - Exterior: A date carved in the door frame (1887)
   - Port: A chalk drawing on the quay wall (child's boat)
   - Museum: A guest book with signatures from around the world
   - Liotrivi: A cat sleeping on the warm stone press
   - Windmill: A notch in the wall measuring a child's height
   - Cave: A fossil in the rock wall
   - Church: A candle that's been burning for years ("Πάντα αναμμένο")
   - Graveyard: A fresh flower on an unmarked grave
   - Boat: A carved name on the mast ("ΕΛΠΙΣ" — misspelling of ΕΛΠΙΔΑ)
   - Treasure: A bird's nest in the rock above the chest

2. **Add item combinations** (even 3-4 would deepen the systemic layer):
   - Lantern + matches → lit lantern (for cave)
   - Chart + compass → marked route (for boat)
   - Letter + photo → Ntemis realizes connection

---

## Chapter II: Emotions — 7/10

### Emotion Audit

| Emotion | Present? | Strength | Notes |
|---------|----------|----------|-------|
| Wonder | Yes | Medium | Cave jade discovery, telescope scene. Could be amplified with sound. |
| Nostalgia | Yes | Strong | Real place, family dynamics, VGA art style = multi-layer nostalgia. |
| Humor | Weak | Low | Some Ajax one-liners. No running gags. Wrong-verb comedy barely exists. |
| Tension | Yes | Strong | Cave, graveyard, ghost sequence all deliver. Silence moments present. |
| Eureka | Partial | Medium | Puzzle solutions unlock scenes (good feedback) but no character celebration. |
| Bittersweet | Yes | Strong | Ghost waiting 120 years, final letter, αλληλεγγύη themes. Core emotional strength. |

### Gaps Found

**Humor is the weakest emotion.** The game has:
- A few Ajax wisecracks scattered in dialog
- No running gags
- No "wrong verb comedy" system — most invalid actions return generic "You can't do that"
- No absurd item-on-object responses

**Eureka needs amplification.** When puzzles are solved:
- New scenes open (good)
- But characters don't celebrate together
- No unique "solve" musical phrase
- No character voicing the player's realization ("Wait... 9 to 3... that's the museum vote!")

### Specific Suggestions

3. **Write 20 wrong-verb comedy lines** — the highest-value humor investment:
   - `Use fish on ghost` → Ajax: "Δεν νομίζω ότι πεινάει, μπαμπά."
   - `Talk to barrel` → Ntemis: "...Δεν απαντάει."  Ajax: "Ίσως δεν μιλάει ελληνικά."
   - `Open the sea` → Clio: "Μπαμπά, η θάλασσα δεν ανοίγει. Μόνο υποκλίνεται."
   - `Use lantern on Akis` → Akis: "Ευχαριστώ, αλλά βλέπω μια χαρά."
   - `Push the ghost` → Ajax: "ΟΧΙ! Εγώ σίγουρα δεν θα ακουμπήσω φάντασμα."

4. **Add eureka character reactions:**
   - When jade stone found: Ajax jumps, Clio says "Αυτό είναι! Το πράσινο πέτρωμα από το γράμμα!"
   - When chart found: Clio connects the dots verbally: "Λ.Β. — Λουκάς Βισβίκης!"
   - Play unique `fanfare` SFX variant for each major discovery

---

## Chapter III: Puzzles — 7/10

### Three Laws Check

| Law | Status | Details |
|-----|--------|---------|
| Fairness | PASS | Museum teaches history before it's needed. NPCs point to next location. All info available before puzzles. |
| Logic | PASS | Every step follows cause → effect. Key → drawer, stone → grave → ghost, chart → boat. No moon logic. |
| Reward | PARTIAL | Scene transitions are strong rewards. But no character celebration, no unique solve sounds. |

### Three Clue Rule Check

| Puzzle | Clues Given | Verdict |
|--------|-------------|---------|
| Key in copper pot | 1: "Something rattles inside" | FAIL — only 1 clue. Need: visual cue (pot lid ajar) + Ajax saying "I hear something" |
| Drawer needs key | 2: Locked message + Clio's "search around" | BORDERLINE — add visual: keyhole visible |
| Jade stone location | 3: Letter says "πράσινο πέτρωμα", Athos confirms cave, Giannis shows entrance | PASS |
| Ghost summoning | 2: Stone + grave connection | BORDERLINE — add: Papas mentioning "he always wanted to come home" |
| Church floor tile | 2: Ghost points to church, tile has "Λ.Β." | BORDERLINE — add: Papas saying "he left his mark everywhere in this church" |
| Nautical chart use | 3: X marks island, Chrysostomos has boat, chart in inventory | PASS |

### Difficulty Curve

```
Exterior (easy) → Port (breather) → Museum (breather) → Liotrivi (breather)
→ Windmill (easy) → Cave (hard) → Graveyard (medium) → Church (medium)
→ Boat (breather) → Treasure (payoff)
```

**Problem: Three consecutive breathers (Port → Museum → Liotrivi).** The player gets better at the verb system but the game doesn't challenge them for 3 scenes. Risk: boredom, disengagement, lost flow state.

### Specific Suggestions

5. **Add a mini-puzzle to the Port scene:**
   - Akis won't talk until you Look at his flute first (establishes "observe before talking" as a pattern)
   - Or: a locked warehouse door that the fisherman has the key to (teaches "talk to NPCs for solutions")

6. **Strengthen Three Clue Rule on weak puzzles:**
   - Copper pot: Add visual wobble animation + Clio saying "Μπαμπά, ακούς αυτό;" on room entry
   - Church tile: Have Papas say "Ο Βισβίκης σημάδεψε κάθε πέτρα αυτής της εκκλησίας" in his dialog

---

## Chapter IV: Dialog — 6/10

### Character Voice Test

Can you tell who's speaking without the name? **Partially.**

| Character | Distinctive Traits Found | Consistency |
|-----------|-------------------------|-------------|
| Ntemis | Warm, calm, uses metaphors | Medium — sometimes just describes |
| Ajax | Excited, questions, modern kid | Good — mostly consistent |
| Clio | Observant, bookish, gentle | Good — strongest voice |
| Curator | Passionate educator | Medium — some info dumps |
| Athos | Dry, challenging | Good — brief but distinct |
| Chrysostomos | Nautical metaphors | Too few lines to judge |

### Dialog Double Duty Check

**Academy principle**: Every line serves 2+ purposes (character, plot, puzzle info, emotion, humor).

**Findings:**
- Entry dialogs are generally strong (mood + character + world)
- NPC exposition scenes (museum, liotrivi) trend toward info dumps
- Many Look responses are pure description (single purpose)

### "Look Twice" System

The code has `look_alt` arrays but they are **sparsely populated**. Most objects only have one Look response. The system exists but isn't consistently used.

### Verb Responses as Character

**Generic defaults are too common.** When a verb doesn't match, the game returns flat responses like "Δεν γίνεται" (Can't do that). These should be character-voiced.

### Specific Suggestions

7. **Populate "Look Twice" for ALL major objects** (the system exists — just needs content):
   - First look: Description
   - Second look: Character memory, opinion, or joke
   - Example: Boat ropes — 1st: "Thick hemp ropes." 2nd: Ntemis: "My father used to tie knots like these. He taught me the bowline before I could read."

8. **Replace ALL generic verb defaults with character lines:**
   ```
   Current: "Δεν γίνεται."
   Better:  Ajax: "Δεν νομίζω ότι αυτό δουλεύει, μπαμπά."
            Clio: "Ίσως πρέπει να δοκιμάσουμε κάτι άλλο."
            Ntemis: "Αυτό δεν βγάζει νόημα."
   ```
   Rotate based on current verb + random family member.

9. **Break museum/curator info dump into interactive dialog:**
   - Current: Long curator monologue
   - Better: Curator says 2 facts → Ajax asks "Why?" → 2 more → Clio observes something → 2 more
   - Follows Cognitive Load Theory (max 4 items in working memory)

---

## Chapter V: Pacing — 7/10

### Tension/Release Analysis

| Phase | Scene | Type | Notes |
|-------|-------|------|-------|
| Build | Exterior | Easy entry | Establishes world, opens mystery |
| Breathe | Terrace | Beauty scene | Strong — view, dolphins, warmth |
| Breathe | Kitchen | Easy puzzle | Key → drawer → letter. Good first puzzle. |
| Breathe | Port | Story/NPC | Good NPC introductions |
| Breathe | Museum | Info/story | Risk: three breathers in a row |
| Breathe | Liotrivi | Info/story | Risk continues |
| Build | Windmill | Minor puzzle | Lantern acquisition |
| Peak | Cave | Hard puzzle | Jade stone, inscription |
| Peak | Graveyard | Emotional peak | Ghost sequence — game's best moment |
| Release | Church | Medium puzzle | Chart discovery |
| DMN | Boat | Reflection | "Κανείς δεν μιλάει" — perfect |
| Climax | Treasure | Story payoff | Final letter |
| Resolution | New Era | Celebration | 104 signatures again |

### Campfire Moment

The boat scene IS a campfire moment — "No one speaks. Not needed." — but it's late in the game. The terrace could serve as an earlier campfire moment, especially after the cave/graveyard.

### Specific Suggestions

10. **Add a terrace reflection scene** — After graveyard/church, the family returns to the terrace at dusk. No puzzle. Ajax talks about being scared in the cave. Clio talks about what αλληλεγγύη means. Ntemis thinks about his father. This becomes the emotional anchor before the boat crossing.

11. **Add a small challenge to the Port/Museum stretch** to maintain flow channel (see suggestion #5).

---

## Chapter VI: World Building — 7/10

### Iceberg Check

**Strong.** The game has 3000 years of Galaxidi history researched (`inspiration/galaxidi-history.md`). Only ~10% surfaces in dialog. The depth is felt in every NPC line's specificity (300 ships, 104 signatures, Agia Paraskevi church, the Chrysoula schooner).

### Consistency Check

| Element | Consistent? | Notes |
|---------|-------------|-------|
| Art style | Yes | VGA pixel art throughout |
| Time of day | Yes | Afternoon/sunset consistent |
| Character memory | Partial | Characters don't reference earlier scenes much |
| NPC cross-references | Weak | Stathis mentions Athos and Chrysostomos. That's about it. |
| Music genre | Yes | Greek-Mediterranean throughout |

### NPC Cross-References — The Biggest Gap

**Current state:** Stathis at the port mentions Athos (liotrivi) and Chrysostomos (boat). Akis mentions the museum. That's it.

**Missing connections that would make Galaxidi feel alive:**
- Athos should mention: "The curator called me. Said a family was asking about Visvikis."
- Giannis should mention: "Athos sent word you'd be coming up."
- Papas should mention: "Chrysostomos told me about your crossing."
- Chrysostomos should mention: "The Papas blessed this voyage before you arrived."
- Curator should mention: "The fishermen at the port still tell Visvikis stories."

### Specific Suggestions

12. **Add 5 NPC cross-reference lines** (one per NPC after the port). Each NPC acknowledges the player's journey by referencing another NPC. This costs 5 dialog lines but creates the illusion of a living community.

---

## Chapter VII: Sound — 8/10

### Three Layers Check

| Layer | Status | Quality |
|-------|--------|---------|
| Music | 40+ scene-specific tracks | Excellent |
| Ambience | 6 procedural generators (waves, cicadas, wind, drips, gulls, taverna) | Excellent |
| SFX | 15+ procedural sounds (footsteps, door, key, drawer, pickup, etc.) | Good but thin |

### Missing SFX

The game has footsteps, door, key, drawer, pickup, chest, dig, ghost, candle, stone, fanfare, metallic hit. What's missing:

- **Scene transition whoosh** — exists but not used consistently
- **Puzzle-solve musical sting** — fanfare exists but no per-puzzle variants
- **UI sounds** — inventory open/close, verb select click
- **Paper/scroll** — exists (letter) but not used for chart discovery
- **Water splash** — for boat boarding

### Leitmotif System

**Does not exist.** No recurring musical themes tied to characters or concepts. Music changes per scene but doesn't carry thematic threads.

### Strategic Silence

**Present but underused.** The boat scene has a deliberate silence moment ("No one speaks"). The ghost sequence has a brief pause. But there's no silence BEFORE the ghost appears (the most powerful tension tool).

### Specific Suggestions

13. **Add 2-3 seconds of total silence before ghost materialization.** Cut ALL ambient sound (wind, cicadas, everything) for 2-3 seconds before the swirl particles begin. The player's body will physically tense.

14. **Create a Visvikis leitmotif** — a simple nautical melody (4-6 notes):
   - First heard: Faintly in museum background (player doesn't notice consciously)
   - Second: Graveyard ghost sequence (full arrangement, recognition clicks)
   - Third: Epilogue, played by Stathis on guitar (the dead captain's melody, carried by the living)

---

## Chapter VIII: Psychology — 6/10

### Flow State Analysis

**Flow channel**: Generally good. Early scenes teach mechanics, mid-game requires NPC info gathering, late game chains inventory across scenes. The three-breather stretch (Port → Museum → Liotrivi) drops below the flow channel — player skill exceeds challenge.

### Zeigarnik Effect (Open Loops)

| Loop | Type | Duration | Status |
|------|------|----------|--------|
| Who is Visvikis? What's the treasure? | Main mystery | Full game | Strong |
| How do I get into the cave? | Current puzzle | 1-3 scenes | Strong |
| Why does the cat follow Clio? | Background | Unresolved | NOT EXPLOITED |
| What happened to Ntemis's father here? | Background | Unresolved | NOT EXPLOITED |
| Why did Chrysostomos look sad? | Character tease | Brief | DOESN'T EXIST YET |

**Problem: Only 1-2 loops running at any time.** The game should always have 3+ open questions. Background loops about the cat, Ntemis's father, and Chrysostomos's past would run cheaply (a few dialog lines each) but keep the Zeigarnik effect active.

### Peak-End Rule

- **Peak**: Ghost sequence — well-executed, clearly the emotional high point
- **End**: Epilogue/New Era scene — exists but needs to be EXTRAORDINARY

**Problem**: The epilogue (the most important scene per Kahneman) gets less design attention than the ghost sequence. This is backwards. The epilogue should be the single most polished scene in the game.

### IKEA Effect

**Good.** The puzzle chain makes players earn every revelation. The letter is found through exploration, not handed in a cutscene. The chart is discovered by the player's own deduction. The ghost appears because the player placed the stone.

**One violation**: The cave inscription "9 to 3" could be told TO the player rather than discovered BY them. Make sure the player reads it themselves before any character explains it.

### Loss Aversion

**Underused.** The ghost represents loss (120 years of waiting, a broken promise), but this is stated, not felt. Adding a ticking clock to the boat crossing ("the tide won't wait") or making the ghost fade if you don't act quickly enough would engage loss aversion more directly.

### Specific Suggestions

15. **Add 2 background Zeigarnik loops:**
   - Why does the cat follow specifically Clio? (Resolved: the cat belonged to Visvikis's daughter, who looked like Clio. Reveal in church or graveyard.)
   - Chrysostomos knew Ntemis's father — "He was the last person your father visited before..." (trails off). Resolved in epilogue.

16. **Invest heavily in epilogue polish.** Per Peak-End Rule, this scene determines how the ENTIRE game is remembered. The 104-signature ceremony should feel like it echoes across 170 years. Slow typewriter speed, unique music, longer pauses between lines.

---

## Chapter IX: Neuroscience — 5/10 (Biggest Opportunity)

### Dopamine Loops

**Novel stimuli**: Excellent — 13 unique scenes = 13 dopamine hits.
**Pattern recognition**: Good — clue connections across scenes.
**Uncertain reward**: Weak — most "Look" responses are predictable descriptions. No variable reward system.
**Near-miss**: Absent — no progressive hint system that feeds the "almost there" feeling.

### Variable Reward (Explorer's Dopamine Loop)

**Not implemented.** Currently, looking at objects gives predictable descriptions. There's no chance of an unexpected reward — a hidden joke, a personal memory, a secret detail. The player quickly learns that most objects just describe themselves, and stops exploring.

**Fix:** Make 20% of Look responses unexpectedly rewarding (a joke, a character memory, a historical detail that isn't plot-relevant but is fascinating). The player should never know which object will surprise them.

### Typewriter Speed as Emotional Contagion

**Constant at 0.03s/char.** This misses the single cheapest emotional tool available: variable typewriter speed.

**Fix:**
- Excited Ajax: 0.02s/char (faster = excitement)
- Grave Chrysostomos: 0.05s/char (slower = weight)
- Final letter reading: 0.06s/char with 800ms sentence pauses (slowest = most important)
- Ghost dialog: 0.08s/char with flickering (supernatural)

### Default Mode Network (Breathing Room)

**Present but accidental.** The boat crossing IS a DMN moment. Walking between objects IS processing time. But these aren't designed — they're side effects of the game structure.

**Fix:** Make the boat crossing deliberately longer. Add 1-2 Chrysostomos stories during the crossing. Don't add puzzles — let the brain consolidate. This is the game's "shower moment" where players connect earlier clues.

### Mere Exposure Effect

**Partially used.** "Αλληλασφάλεια/αλληλεγγύη" appears multiple times across scenes. The schooner image recurs. But there's no systematic leitmotif repetition.

### Mirror Neurons / Three-Character Emotional Bandwidth

**Underexploited.** You have three emotional channels (Ajax = primary emotions, Clio = cognitive, Ntemis = complex) but characters often react similarly. When the ghost appears, all three should react DIFFERENTLY:
- Ajax: Freezes, grabs Ntemis's arm (fear)
- Clio: Steps forward, fascinated (curiosity)
- Ntemis: Recognizes something (recognition, loss)

### Specific Suggestions

17. **Implement variable typewriter speed** — a single code change with massive emotional impact:
   ```javascript
   // In dialog update, replace constant 0.03 with:
   const speed = state.dlg.speed || 0.03;
   // Then set speed per dialog line:
   {s:'ΑΙΑΣ', t:'ΚΟΙΤΑΞΤΕ! ΒΡΗΚΑ!', speed: 0.02}  // excited
   {s:'ΧΡΥΣΟΣΤΟΜΟΣ', t:'Ο πατέρας σου...', speed: 0.05}  // heavy
   {s:'', t:'Η θάλασσα θυμάται.', speed: 0.07}  // the game's title line
   ```

18. **Add 10-15 "surprise" Look responses** scattered randomly across scenes. Objects that reveal something unexpected — a hidden story, a joke, a character memory. The variable reward schedule keeps players exploring.

19. **Differentiate character reactions to key moments:**
   - Ghost appears: Ajax clings to Ntemis (fear), Clio leans forward (fascination), Ntemis whispers "Παππού;" (recognition)
   - Treasure found: Ajax screams with joy, Clio carefully examines each item, Ntemis reads the letter alone
   - Final ceremony: Ajax proudly signs, Clio cries, Ntemis speaks to the crowd

---

## Priority Implementation Order

### Tier 1 — Highest Impact, Lowest Effort (Do This Week)

| # | Suggestion | Effort | Impact | Academy Chapter |
|---|-----------|--------|--------|-----------------|
| 17 | Variable typewriter speed | 1 hour | Very High | IX. Neuroscience |
| 13 | Silence before ghost | 15 min | High | VII. Sound |
| 8 | Character-voiced verb defaults | 2 hours | High | IV. Dialog |
| 12 | NPC cross-reference lines (5 lines) | 30 min | High | VI. World |
| 3 | Wrong-verb comedy (20 lines) | 2 hours | High | II. Emotions |

### Tier 2 — High Impact, Medium Effort

| # | Suggestion | Effort | Impact | Academy Chapter |
|---|-----------|--------|--------|-----------------|
| 4 | Eureka character reactions | 2 hours | High | II. Emotions |
| 7 | Populate "Look Twice" for major objects | 3 hours | High | IV. Dialog |
| 15 | Background Zeigarnik loops (cat, father) | 1 hour | Medium | VIII. Psychology |
| 19 | Differentiated character reactions to peaks | 2 hours | High | IX. Neuroscience |
| 6 | Three Clue Rule fixes | 1 hour | Medium | III. Puzzles |

### Tier 3 — Medium Impact, Higher Effort

| # | Suggestion | Effort | Impact | Academy Chapter |
|---|-----------|--------|--------|-----------------|
| 1 | Unremarkable details (1 per scene) | 3 hours | Medium | I. Immersion |
| 18 | Variable reward Look responses | 3 hours | Medium | IX. Neuroscience |
| 14 | Visvikis leitmotif (3 scenes) | 4 hours | High | VII. Sound |
| 16 | Epilogue polish pass | 3 hours | Very High | VIII. Psychology |
| 10 | Terrace reflection scene | 2 hours | Medium | V. Pacing |

### Tier 4 — Lower Priority

| # | Suggestion | Effort | Impact | Academy Chapter |
|---|-----------|--------|--------|-----------------|
| 2 | Item combinations (3-4) | 4 hours | Medium | I. Immersion |
| 5 | Port scene mini-puzzle | 2 hours | Medium | III. Puzzles |
| 9 | Museum dialog restructure | 2 hours | Medium | IV. Dialog |
| 11 | Flow channel fix for breather stretch | 2 hours | Medium | V. Pacing |

---

## The One-Line Summary

**Your game's soul is strong (story, emotions, family, real place) — its body needs more responsive nerves (variable speed, character reactions, surprise details, humor).** The fixes are mostly content, not code.
