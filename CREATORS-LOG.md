# Ntemis's Creator Log — Η Θάλασσα Θυμάται

*A personal journal on creating the Galaxidi Adventure game.*

---

## The Beginning — 16 February 2026

The game started on a Sunday morning. Not with a plan. Not with a design document. With a feeling.

I've always carried Galaxidi inside me — the light on the harbor, the smell of salt and old stone, the narrow streets where history breathes through the walls. When Ajax and Clio walk those paths, they walk through something real. The game was born from the desire to give them that — a version of Galaxidi that lives forever, that they can return to whenever they want.

The first commit landed at 10:23 AM on February 16, 2026. By the end of that day, we had a walking character, three scenes, and the skeleton of a SCUMM-style adventure. By nightfall, it already felt like something.

---

## How Development Runs

This is not a normal development process. It's a collaboration between a human with a vision and an AI that can execute at inhuman speed. The rhythm is:

- **Ntemis directs** — story, emotion, aesthetics, what feels right
- **Claude builds** — code, assets, systems, tests
- **We iterate in real-time** — sometimes 20+ commits in a single session

**149 commits in 3 days.** That's not a typo. The game went from nothing to a 13-scene playable adventure with full voice acting, an original soundtrack, anime cutscenes, a Ken Burns cinematic engine, 11 NPCs with portraits and dialog, a quest journal, a fast-travel map, and 202 automated tests — all in a weekend.

The tech is deliberately simple: a single HTML5 Canvas file, vanilla JavaScript, no frameworks. Everything procedural. The music is generated. The sound effects are synthesized in real-time via Web Audio API. The cutscenes use Ken Burns animation on anime stills. It runs in a browser. No install. No dependencies.

---

## The Timeline

### Day 1 — Sunday, Feb 16: Foundation
- Initial commit, SCUMM UI, title screen
- Game Bible v3, story structure locked
- Voice acting system (4 voices, 52 lines)
- Expanded to 11 playable locations
- Procedural ambient sounds
- Scene music system

### Day 2 — Monday, Feb 17: Characters & Cutscenes
- 11 NPC sprites and portraits
- Ken Burns cutscene engine built
- 7 anime cutscenes for major story beats
- Reunion, windmill, church, museum, liotrivi cutscenes
- Ghost and treasure cutscenes enhanced
- Complete pilot: 13 scenes, quest gating, save/load, epilogue
- Fast-travel map and help overlay
- Ship's journal (HMEROLOGIO) quest log
- Real Galaxidi map integrated, MI-style cursor
- 179 missing voice files generated — 100% voice coverage

### Day 3 — Tuesday, Feb 18: Polish & Emotion
- 16th-century Dutch atlas crawl map with medieval font
- Voice-text sync fixes (79 reused audio files caught by tests)
- 68 voice files regenerated to match displayed text
- Cave jade sequence completed
- Narration/mechanics overlap resolved
- Test suite expanded to 202 tests

---

## The Goosebumps Discovery — Feb 18

Something happened today that I need to document because it matters.

Even in this rough, unfinished state — with placeholder art in places, with story sequences that still need fixing, with edges everywhere that need sanding — **the game gave me goosebumps. Multiple times.**

This is unprecedented for me. I've played thousands of games. I've rarely felt this from a finished, polished product, let alone something still in development. But when the intro music plays over the title screen, when the story unfolds through those anime cutscenes with timed Greek dialogue, when my kids walk through a place I love — something happens. Something real.

**The intro music plays a critical role.** It sets the emotional tone before a single pixel of gameplay appears. It tells the player: *this matters. Pay attention. Something beautiful is about to happen.* That musical moment is sacred and must be protected as we develop further.

**What I believe is happening:** The game works because it's authentic. This isn't a fictional place researched on Wikipedia. This is Galaxidi through my eyes — a place my family knows, where my children have memories. That emotional truth transmits through the screen. You can't fake that. Studios spend millions trying to manufacture this feeling and fail. We found it in a weekend because the source material is real life.

**What needs work now:**
- The sequence of events needs fixing — story flow must feel inevitable, not jumpy
- The story structure needs tightening — every scene should earn its place
- But the emotional core? **Don't touch it.** Everything we add must serve it.

**My conviction:** People will feel this too. Games that make their creator feel something always translate. The passion is the product.

---

## Design Principles (Learned by Doing)

1. **Authenticity over polish.** A real place with real emotions beats a fictional world with perfect pixels.
2. **Music is half the experience.** The intro theme, the per-scene transitions — they carry the emotion the visuals set up.
3. **Ken Burns on anime stills > video.** Video models can't match the art style. Still images with slow camera movement and timed dialogue create intimacy that motion would destroy.
4. **Greek language adds soul.** Even for non-Greek speakers, the language grounds the game in its place.
5. **Simple tech, complex emotion.** Vanilla JS in a single HTML file. The constraints force creativity.
6. **Test everything.** 202 tests for a weekend project. Voice-text sync, scene transitions, quest gating. Tests caught 79 reused audio files we would have shipped broken.
7. **Never optimize the goosebumps away.** As features pile on, the emotional core is the compass.

---

## What's Next

The roadmap calls for 8 phases over 16 weeks. But the game is already further along than that plan anticipated. The immediate priorities:

1. **Story lock** — Fix the sequence, tighten the narrative arc
2. **Puzzle depth** — Branching dialog trees, more interactive objects
3. **Polish** — Micro-interactions, UI refinements, humor
4. **Ship it** — Bilingual QA, hosting, community launch

But above all: **protect the feeling.** Every commit, every feature, every line of dialogue must serve the goosebumps.

---

*— Ntemis, February 2026*
*Alimos, Athens*
