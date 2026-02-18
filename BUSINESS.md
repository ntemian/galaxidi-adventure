# Galaxidi Studios — Local Heritage Games Business Plan

## The Concept

A repeatable format for turning real Greek towns and their history into bilingual (Greek/English) point-and-click adventure games. Built on a proven HTML5 Canvas engine that runs in any browser — no app store, no install, no dependencies.

The Galaxidi Adventure is not just a game — it's a **template**. The episode structure from the Jade Stone Saga can be applied to ANY Greek town or region with deep history.

## The Engine & The Model

**A unique game engine** — purpose-built for blending real local elements with fiction. Real places, real history, real people woven into handcrafted point-and-click adventures. No generic templates. Every game is a love letter to its town.

**Specialist team, local roots.** Everywhere we go, we hire a local team:
- **Curators** — local historians and archivists who know the stories no book contains
- **Artists** — local painters, illustrators, photographers, musicians — authentic visuals and local music
- **Actors** — local voices for characters, dialect-accurate narration
- **Historians** — academic verification, oral history collection
- **Community guides** — people who know where the real magic is hidden

**This is handcrafted local art**, not mass-produced content. Each game supports the community it portrays. The locals aren't subjects — they're co-creators.

**50-50 revenue split with the local community.** Half of all revenue from each episode goes directly back to the town — its people, its cultural organizations, its preservation efforts. We don't extract stories. We partner with the people who live them.

This makes every game a genuine collaboration. The town promotes it because they own half of it. The players feel it because it's real. The business scales because every new town brings its own built-in audience and marketing force.

## Why It Works

**The demand exists but nobody's serving it:**
- Greek municipalities spend money on tourism promotion (brochures, websites, festivals) — all forgettable
- Schools need engaging history material — textbooks aren't cutting it
- Cultural tourism is booming — people want depth, not selfie spots
- No one is making adventure games about real Greek places with real history

**Unfair advantages:**
- Working engine (vanilla HTML5 Canvas — runs everywhere)
- Proven format (episode structure, puzzle design, character templates)
- Research infrastructure (LOSC)
- Bilingual from day one — Greek diaspora + international tourism
- The family story — a father making games with his kids about real places they visit together

## Revenue Streams

### 1. Municipal Commissions (Δήμοι)
Pitch directly to municipalities. Every mayor wants to put their town on the map.

- Deliverable: bilingual HTML5 game, playable on any browser, embeddable on the town's website
- Price: €5,000–15,000 per episode depending on scope
- They get: tourism tool, educational resource, cultural preservation, press coverage
- Pitch: Show the Galaxidi game. Say "we do this for your town."

### 2. School Licensing
Greek schools (Δημοτικά, Γυμνάσια) need digital history resources.

- Package episodes as educational tools with teacher guides
- Align with curriculum (Messolonghi episode = 6th grade history)
- Ministry of Education digital content programs
- Per-school or per-district licensing

### 3. Direct Sales / Freemium
- Episode 1 free (Galaxidi) — the demo that sells everything
- Episodes 2–8: €3–5 each on itch.io or own site
- Bundle: "The Jade Stone Saga" complete series
- Physical collector's edition (printed box art, USB stick, €25–30)

### 4. Cultural Organization Partnerships
- Ίδρυμα Σταύρος Νιάρχος
- Ωνάσειο Ίδρυμα
- Ίδρυμα Αικατερίνης Λασκαρίδη (maritime history — perfect fit)
- They fund cultural projects. A bilingual adventure game series about Greek maritime history is exactly their thing.

### 5. Tourism Boards / Regions
- Περιφέρεια Στερεάς Ελλάδας covers Galaxidi, Amfissa, Delphi, Messolonghi — the first 5 episodes
- One region, one contract, multiple episodes
- "Play before you visit" campaign

## The Family Project

This is a Latsoudis family venture:
- **Ntemis** — creative direction, story, research, game design
- **Apollo** — business development, legal structure, partnerships, pitching
- **Ajax** — playtesting, youth perspective, social media, the target audience voice
- **Clio** — inspiration, the heart of the story, art direction feedback

The game is ABOUT a family. The business IS a family. That's not marketing — it's the truth.

## Business Structure

**Start lean:**
1. Finish Episode 1 (Galaxidi) — portfolio piece, demo, proof of concept
2. Show it to Δήμος Δελφών (covers Galaxidi). Free. "Look what we made about your town."
3. Get press — Greek family making Monkey Island-style games about real Greek history
4. Pitch Episode 2 (Amfissa) as commission to Δήμος Αμφίσσης
5. Register business when first commission arrives — not before

**Company:** Galaxidi Studios (or Ελπίδα Games)

## What Makes This Defensible

- **The format is the moat.** A tested, repeatable format for turning real places into adventure games.
- **The research pipeline.** LOSC + historical methodology + local connections = unmatched content quality.
- **The family story.** Unbeatable authenticity.
- **Bilingual.** Greek + English = diaspora market (millions) + international tourism market.

## Post-AGI Positioning

In a post-AGI world, this business gets STRONGER, not weaker:
- AI makes game production faster and cheaper (art generation, music, voice acting)
- But AI cannot replace LOCAL KNOWLEDGE, RELATIONSHIPS, and AUTHENTIC STORIES
- The value is in the curation, the research, the family connection to each place
- As AI commoditizes generic content, authentic local content becomes MORE valuable
- The "context moat" from the Grand Synthesis applies directly: deep knowledge of specific Greek places and their stories is impossible to replicate without being there
- Every episode deepens the moat — more relationships, more local knowledge, more trust

This is a Macrohard-proof business: it runs on relationship capital, cultural depth, and family authenticity — the three things AI cannot fake.

---

## In-Game Features & Monetization Roadmap

### 1. Feedback Form

Collect player feedback directly from the game using **EmailJS** (no backend required).

- **Fields**: Name (optional), Feedback Type (bug / suggestion / praise), Message (textarea)
- **Screenshot capture**: Auto-attach canvas screenshot with each submission
- **Recipient**: elatsoudis@latsoudislaw.com
- **Thank you screen**: Animated response after successful submission
- **Access points**:
  - Toolbar icon (always available during gameplay)
  - Post-epilogue screen ("Tell us what you thought!")

### 2. Scoring & Achievements

Track player performance throughout the game.

**Score Components:**
- **Time tracking** — total play time, per-scene time
- **Puzzles solved** — count and difficulty weighting
- **Secrets found** — hidden items, Easter eggs, lore fragments

**Achievements** (~10 total, 50–500 pts each):

| Achievement | Points | Condition |
|-------------|--------|-----------|
| TBD | 50–500 | Define during implementation |

Design achievements to reward exploration, speed, completionism, and creative solutions.

### 3. Leaderboard

**Backend**: Firebase Realtime Database (free tier — 1GB storage, 10GB/month transfer).

- **Display**: Top 20 scores with player name and achievement count
- **Access points**:
  - Title screen ("Leaderboard" button)
  - Post-epilogue screen (with player's rank highlighted)
- **Anti-cheat**: Basic client-side validation (max possible score cap, time sanity checks)

### 4. Monetization (Detailed)

**Hint Tokens:**
- Price: EUR 0.99 for a pack of hints
- Mechanic: subtle nudges, not full solutions — preserve the puzzle experience

**Premium Episodes:**
- Platform: itch.io
- Price: EUR 3–5 per episode
- Episode 1: Free (current game — the demo that sells everything)
- Episodes 2–8: Paid releases expanding the Galaxidi saga

**Collector Items:**
- Physical merchandise tied to game lore
- Box art print — framed game artwork
- Jade replica — miniature of the in-game jade stone
- USB treasure chest — EUR 25–30, contains game files + bonus content + digital art book

### 5. Advertising Policy

**Hard rules:**
- **NO banners, popups, or video ads** — ever
- Only tasteful, context-appropriate sponsor placements

**Approved formats:**
- Epilogue credits — "Sponsored by [Partner]" in the credits roll
- Loading screen logo — small partner logo during scene transitions
- Real Galaxidi business partnerships — authentic to the setting

**Ideal partners:**
- Galaxidi local businesses (tourism, culture, food)
- Greek indie game community sponsors
- Educational / cultural organizations

### 6. Implementation Priority

| Phase | Feature | Effort | Dependencies |
|-------|---------|--------|--------------|
| 1 | Feedback Form | Low | EmailJS account setup |
| 2 | Scoring & Achievements | Medium | Game loop instrumentation |
| 3 | Leaderboard | Medium | Firebase project, scoring system |
| 4 | Monetization Hooks | High | itch.io account, payment integration |

Feedback form first — get player input to guide everything else.
