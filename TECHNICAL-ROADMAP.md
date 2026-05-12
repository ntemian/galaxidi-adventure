# TECHNICAL ROADMAP — Thalassa Engine

### From Prototype to Commercial Game Engine
### February 2026

---

## Vision

Build a **standalone, reusable point-and-click adventure game engine** — capable of powering not just "Το Μυστήριο του Γαλαξειδίου" but an entire franchise of SCUMM-style adventures. Data-driven, editor-friendly, commercially distributable.

**Engine name**: **Thalassa Engine** (Η Θάλασσα — The Sea)

**Location**: `~/Projects/thalassa-engine/` (independent repo, NOT inside galaxidi-adventure)

**Target**: Any creator can build a point-and-click adventure without writing code. Developers extend via plugins. Stories ship as data packs.

## Development Strategy

The engine is built **independently** of the Galaxidi Adventure game.

- `~/Projects/thalassa-engine/` — the engine (this roadmap)
- `~/games/galaxidi-adventure/` — the game (stays untouched, continues development on its own)

The engine uses the Galaxidi monolith as **reference** for porting proven systems (procedural walk, particles, transitions), but the game code is never modified during engine development. When the engine reaches feature parity, the game migrates to it as a data pack — that's a separate project.

---

## Current Architecture (What We're Migrating From)

```
index.html (9,000 lines)
├── Canvas setup + state          ← hardcoded
├── Image loading                 ← hardcoded paths
├── Walk anatomy constants        ← hardcoded per-character
├── drawSprite() procedural walk  ← REUSABLE ✓
├── Walking system                ← REUSABLE ✓
├── Scene definitions (1,000 ln)  ← hardcoded JS objects with functions
├── Cutscene definitions (350 ln) ← hardcoded draw functions
├── Dialog system                 ← REUSABLE ✓
├── Inventory system              ← REUSABLE ✓
├── Verb/interaction system       ← partially reusable
├── Particle system               ← REUSABLE ✓
├── Fade/transition system        ← REUSABLE ✓
├── Audio system                  ← REUSABLE ✓
├── Save/load (localStorage)      ← needs upgrade
├── Game loop                     ← REUSABLE ✓
└── Title/intro screens           ← hardcoded
```

**Key problem**: Game content (scenes, puzzles, dialogs, cutscenes) is inseparable from engine code. Everything lives in one file. Adding content means writing JavaScript.

---

## Target Architecture

```
thalassa-engine/
├── engine/                        # Core engine (game-agnostic)
│   ├── core/
│   │   ├── game-loop.ts           # RAF loop, delta time, tick counter
│   │   ├── renderer.ts            # Canvas management, scaling, layers
│   │   ├── input.ts               # Mouse, keyboard, touch, gamepad
│   │   ├── state.ts               # Reactive game state machine
│   │   ├── events.ts              # Event bus (pub/sub)
│   │   └── config.ts              # Engine configuration
│   │
│   ├── systems/                   # Pluggable game systems
│   │   ├── scene-manager.ts       # Load, enter, exit scenes from data
│   │   ├── character.ts           # Character registry, state, positioning
│   │   ├── walk.ts                # Procedural walk animation engine
│   │   ├── dialog.ts              # Typewriter, portraits, branching trees
│   │   ├── inventory.ts           # Item management, combinations
│   │   ├── verb.ts                # Verb bar, cursor modes, interaction
│   │   ├── puzzle.ts              # Action executor (data-driven puzzles)
│   │   ├── cutscene.ts            # Composable cutscene player
│   │   ├── particle.ts            # Particle emitter system
│   │   ├── transition.ts          # Fade, iris, dissolve, wipe
│   │   ├── audio.ts               # Music, SFX, voice, crossfade
│   │   ├── save.ts                # Save/load with versioning + cloud
│   │   ├── i18n.ts                # Multi-language text management
│   │   ├── camera.ts              # Pan, zoom, shake, follow
│   │   └── lighting.ts            # Dynamic lighting, time-of-day
│   │
│   ├── rendering/                 # Render pipeline
│   │   ├── sprite.ts              # Sprite sheet + procedural rendering
│   │   ├── background.ts          # Parallax layers, animated BGs
│   │   ├── ui.ts                  # Verb bar, inventory panel, HUD
│   │   ├── text.ts                # Bitmap fonts, text layout
│   │   └── effects.ts             # Screen-space effects (sepia, blur, vignette)
│   │
│   ├── assets/                    # Asset pipeline
│   │   ├── loader.ts              # Async asset loading with progress
│   │   ├── manifest.ts            # Asset manifest parser
│   │   ├── sprite-sheet.ts        # Sprite atlas unpacking
│   │   ├── audio-pool.ts          # Audio instance pooling
│   │   └── cache.ts               # Asset caching layer
│   │
│   └── plugins/                   # Extension points
│       ├── plugin-api.ts          # Plugin interface
│       ├── voice-plugin.ts        # ElevenLabs / TTS integration
│       ├── analytics-plugin.ts    # Playtime, heatmaps, completion
│       └── achievements-plugin.ts # Achievement system
│
├── data/                          # Game content (DATA, not code)
│   ├── manifest.json              # Master manifest — all assets, scenes, chapters
│   │
│   ├── scenes/                    # One JSON per scene
│   │   ├── exterior.json          # Scene definition
│   │   ├── port.json
│   │   ├── cave.json
│   │   └── ...
│   │
│   ├── characters/                # One JSON per character
│   │   ├── ntemis.json            # Sprites, walk anatomy, voice, portraits
│   │   ├── ajax.json
│   │   ├── clio.json
│   │   ├── ghost.json
│   │   └── ...
│   │
│   ├── dialogs/                   # Dialog trees
│   │   ├── akis-harbor.json       # Branching dialog with conditions
│   │   ├── ghost-graveyard.json
│   │   └── ...
│   │
│   ├── puzzles/                   # Puzzle definitions
│   │   ├── drawer-puzzle.json     # Item requirements, actions, flags
│   │   ├── stone-puzzle.json
│   │   └── ...
│   │
│   ├── cutscenes/                 # Cutscene timelines
│   │   ├── arrival.json           # Composable frames (pan-zoom, dialog, effects)
│   │   ├── ghost-appear.json
│   │   └── ...
│   │
│   ├── items/                     # Inventory item definitions
│   │   ├── items.json             # ID, name (i18n), icon, description, combinable
│   │   └── combinations.json      # Item A + Item B = Item C + action
│   │
│   ├── music/                     # Music assignment config
│   │   └── music.json             # Scene → track mapping, crossfade rules
│   │
│   ├── i18n/                      # Translations
│   │   ├── el.json                # Greek strings
│   │   ├── en.json                # English strings
│   │   └── ...                    # Future: fr, de, it, es, jp
│   │
│   └── config.json                # Game-level config (resolution, title, credits)
│
├── assets/                        # Binary assets
│   ├── backgrounds/               # Scene backgrounds (PNG, 640x400)
│   ├── sprites/                   # Character sprite sheets
│   ├── portraits/                 # Dialog portraits
│   ├── cutscenes/                 # Cutscene images (Ken Burns stills)
│   ├── ui/                        # UI elements (verb icons, cursors, frames)
│   ├── music/                     # Music tracks (MP3/OGG)
│   ├── sfx/                       # Sound effects (MP3/OGG)
│   ├── voice/                     # Voice lines (organized by character)
│   └── fonts/                     # Bitmap fonts
│
├── editor/                        # Visual content creation tools
│   ├── scene-editor/              # Place objects, draw walk lines, set exits
│   ├── dialog-editor/             # Visual branching dialog tree builder
│   ├── cutscene-editor/           # Timeline-based cutscene composer
│   ├── puzzle-editor/             # Action/condition puzzle builder
│   ├── character-editor/          # Character config (sprites, walk, voice)
│   ├── asset-manager/             # Import, tag, organize assets
│   └── playtester/                # In-editor play mode with debug overlay
│
├── tools/                         # CLI & build tools
│   ├── build.ts                   # Bundle game for distribution
│   ├── pack.ts                    # Pack game data into .thalassa archive
│   ├── validate.ts                # Validate all data files for integrity
│   ├── voice-gen.ts               # Batch voice generation pipeline
│   ├── sprite-gen.ts              # AI sprite generation pipeline
│   ├── export-web.ts              # Export as static web build
│   ├── export-electron.ts         # Export as desktop app
│   ├── export-mobile.ts           # Export as Capacitor mobile app
│   └── migrate.ts                 # Save file migration between versions
│
├── games/                         # Game projects using the engine
│   ├── galaxidi-ch1/              # Chapter 1: The Mystery of Galaxidi
│   │   ├── data/                  # Chapter 1 data files
│   │   ├── assets/                # Chapter 1 assets
│   │   └── game.json              # Chapter manifest
│   ├── galaxidi-ch2/              # Chapter 2: Amfissa (future)
│   └── template/                  # Blank starter project
│
├── docs/                          # Documentation
│   ├── getting-started.md         # 5-minute quickstart
│   ├── engine-api.md              # Engine API reference
│   ├── data-formats.md            # JSON schema documentation
│   ├── editor-guide.md            # Editor user guide
│   ├── plugin-guide.md            # How to write plugins
│   └── migration-guide.md         # Migrating from monolith
│
├── tests/                         # Test suite
│   ├── engine/                    # Engine unit tests
│   ├── systems/                   # System integration tests
│   ├── data/                      # Data validation tests
│   └── e2e/                       # End-to-end playthroughs
│
├── package.json
├── tsconfig.json
├── vite.config.ts                 # Build config (Vite)
└── README.md
```

---

## Data Format Specifications

### Scene Definition (`data/scenes/port.json`)

```json
{
  "id": "port",
  "label": { "el": "ΤΟ ΛΙΜΑΝΙ", "en": "THE PORT" },
  "background": "backgrounds/pixel-port.png",
  "music": "port-theme",
  "ambience": ["waves-gentle", "seagulls-distant"],
  "lighting": { "time": "golden-hour", "warmth": 0.7 },

  "walkLine": [[30, 378], [200, 370], [420, 372], [610, 378]],
  "walkSurface": "stone",

  "charPositions": {
    "ntemis": { "x": 350, "y": 375 },
    "ajax": { "x": 400, "y": 377 },
    "clio": { "x": 310, "y": 376 }
  },

  "npcs": [
    {
      "character": "akis",
      "x": 480, "y": 370,
      "facing": "left",
      "dialog": "dialogs/akis-harbor",
      "conditions": { "require": [], "hide_after": "flag:akis_talked_twice" }
    }
  ],

  "objects": [
    {
      "id": "fishing_nets",
      "x": 100, "y": 340, "w": 80, "h": 50,
      "label": { "el": "Δίχτυα", "en": "Fishing Nets" },
      "hotspot": "polygon:[[100,340],[180,340],[175,390],[105,390]]",
      "verbs": {
        "look": { "dialog": "dlg:port.nets.look" },
        "use": { "dialog": "dlg:port.nets.use" },
        "pickup": {
          "conditions": [{ "flag": "nets_loosened", "value": true }],
          "actions": [
            { "type": "inv_add", "item": "fishing_net" },
            { "type": "sfx", "sound": "cloth-rustle" },
            { "type": "dialog", "key": "dlg:port.nets.pickup" },
            { "type": "object_hide", "target": "fishing_nets" }
          ],
          "else": { "dialog": "dlg:port.nets.stuck" }
        }
      }
    }
  ],

  "exits": [
    {
      "side": "left",
      "target": "exterior",
      "label": { "el": "← Σπίτι", "en": "← House" },
      "transition": "fade-black",
      "conditions": []
    },
    {
      "side": "right",
      "target": "museum",
      "label": { "el": "Μουσείο →", "en": "Museum →" },
      "transition": "iris",
      "conditions": [{ "flag": "talked_to_akis", "value": true }],
      "locked_dialog": "dlg:port.museum_locked"
    }
  ],

  "entry": {
    "first_visit": { "dialog": "dlg:port.entry.first" },
    "revisit": { "dialog": "dlg:port.entry.revisit" },
    "with_item:green_stone": { "dialog": "dlg:port.entry.stone" }
  },

  "ambient_animations": [
    { "type": "particle", "preset": "seagulls", "zone": [0, 0, 640, 100] },
    { "type": "sprite_loop", "sprite": "cat-idle", "x": 520, "y": 365, "conditions": ["flag:clio_present"] },
    { "type": "water_shimmer", "y_start": 300, "y_end": 400, "intensity": 0.3 }
  ]
}
```

### Character Definition (`data/characters/ntemis.json`)

```json
{
  "id": "ntemis",
  "name": { "el": "Ντέμης", "en": "Ntemis" },
  "role": "playable",

  "sprites": {
    "idle": "sprites/char-ntemis-final.png",
    "dimensions": { "w": 50, "h": 97 },
    "expressions": {
      "neutral": "sprites/ntemis-neutral.png",
      "thinking": "sprites/ntemis-thinking.png",
      "surprised": "sprites/ntemis-surprised.png"
    }
  },

  "portraits": {
    "default": "portraits/portrait-ntemis.png",
    "happy": "portraits/portrait-ntemis-happy.png",
    "serious": "portraits/portrait-ntemis-serious.png"
  },

  "walk": {
    "anatomy": { "waist": 0.62, "stride": 7 },
    "speed": 120,
    "footstep_interval": 0.4
  },

  "idle_animation": {
    "type": "compound_sine",
    "breathe_speed": 0.04,
    "breathe_amp": 1.0,
    "secondary_amp": 0.4,
    "squash_factor": 0.005
  },

  "voice": {
    "elevenlabs_id": "pqHfZKP75CvOlQylNhV4",
    "stability": 0.6,
    "similarity_boost": 0.8,
    "style": "warm, thoughtful, 40s Greek male"
  },

  "dialog_color": "#FFD700",
  "follow_offset": 0,
  "z_order": "y_sort"
}
```

### Dialog Tree (`data/dialogs/akis-harbor.json`)

```json
{
  "id": "akis-harbor",
  "character": "akis",
  "entry": "greeting",

  "nodes": {
    "greeting": {
      "speaker": "akis",
      "text": { "el": "Ντέμη! Πόσο καιρό!", "en": "Ntemis! It's been ages!" },
      "portrait": "happy",
      "then": "choices"
    },

    "choices": {
      "type": "choice",
      "prompt": { "el": "Τι θες να ρωτήσεις;", "en": "What do you want to ask?" },
      "options": [
        {
          "text": { "el": "Ξέρεις τον Βισβίκη;", "en": "Do you know Visvikis?" },
          "goto": "visvikis_topic",
          "conditions": [{ "item": "visvikis_letter" }],
          "once": true
        },
        {
          "text": { "el": "Τι κάνεις εδώ;", "en": "What are you doing here?" },
          "goto": "akis_doing"
        },
        {
          "text": { "el": "Τα λέμε αργότερα.", "en": "Talk later." },
          "goto": "goodbye"
        }
      ]
    },

    "visvikis_topic": {
      "speaker": "akis",
      "text": { "el": "Ο Βισβίκης! Ο θρύλος του Γαλαξειδίου...", "en": "Visvikis! The legend of Galaxidi..." },
      "portrait": "excited",
      "actions": [
        { "type": "flag", "set": "akis_told_visvikis" },
        { "type": "journal", "entry": "visvikis_legend" }
      ],
      "then": "visvikis_detail"
    },

    "visvikis_detail": {
      "speaker": "akis",
      "text": { "el": "Λένε ότι είχε κρύψει κάτι στο νησί...", "en": "They say he hid something on the island..." },
      "then": {
        "if": { "flag": "visited_museum" },
        "true": "akis_museum_done",
        "false": "akis_suggest_museum"
      }
    },

    "akis_suggest_museum": {
      "speaker": "akis",
      "text": { "el": "Πήγαινε στο μουσείο. Η επιμελήτρια ξέρει τα πάντα.", "en": "Go to the museum. The curator knows everything." },
      "actions": [
        { "type": "flag", "set": "talked_to_akis" },
        { "type": "unlock_exit", "scene": "port", "exit": "museum" }
      ],
      "then": "choices"
    },

    "goodbye": {
      "speaker": "akis",
      "text": { "el": "Τα λέμε, φίλε!", "en": "See you, friend!" },
      "end": true
    }
  }
}
```

### Cutscene Definition (`data/cutscenes/ghost-appear.json`)

```json
{
  "id": "ghost-appear",
  "skip_allowed": true,
  "lock_input": true,

  "frames": [
    {
      "duration": 3.0,
      "layers": [
        { "type": "current_scene" },
        { "type": "effect", "name": "darken", "from": 0.0, "to": 0.4, "ease": "ease-in" }
      ],
      "audio": [
        { "type": "sfx", "sound": "wind-eerie", "at": 0.0, "volume": 0.6 },
        { "type": "music_fade", "to": 0.0, "duration": 2.0 }
      ],
      "dialog": [
        { "speaker": "clio", "text": "dlg:ghost.clio_scared", "at": 1.0, "portrait": "scared" }
      ]
    },
    {
      "duration": 5.0,
      "layers": [
        { "type": "current_scene" },
        { "type": "effect", "name": "darken", "value": 0.4 },
        {
          "type": "character_appear",
          "character": "ghost",
          "x": 320, "y": 280,
          "style": "fade_glow",
          "alpha": { "from": 0.0, "to": 0.6 },
          "glow": { "color": "#88AAFF", "radius": 30, "pulse": true }
        },
        { "type": "particles", "preset": "ghost_mist", "zone": [280, 250, 360, 310] }
      ],
      "audio": [
        { "type": "music", "track": "ghost-theme", "at": 1.0, "fade_in": 2.0 }
      ],
      "dialog": [
        { "speaker": "narrator", "text": "dlg:ghost.appear_narration", "at": 2.0 },
        { "speaker": "ajax", "text": "dlg:ghost.ajax_react", "at": 4.0, "portrait": "shocked" }
      ]
    },
    {
      "duration": 4.0,
      "layers": [
        { "type": "current_scene" },
        { "type": "character", "id": "ghost", "alpha": 0.6, "glow": true },
        {
          "type": "character_gesture",
          "character": "ghost",
          "gesture": "point",
          "direction": "right",
          "at": 1.5
        }
      ],
      "dialog": [
        { "speaker": "ntemis", "text": "dlg:ghost.ntemis_understand", "at": 0.5 },
        { "speaker": "clio", "text": "dlg:ghost.clio_church", "at": 2.5 }
      ]
    }
  ],

  "on_complete": {
    "actions": [
      { "type": "flag", "set": "ghost_appeared" },
      { "type": "flag", "set": "church_unlocked" },
      { "type": "journal", "entry": "ghost_pointed_church" },
      { "type": "unlock_exit", "scene": "graveyard", "exit": "church" }
    ]
  }
}
```

### Puzzle Definition (`data/puzzles/drawer-puzzle.json`)

```json
{
  "id": "drawer-puzzle",
  "scene": "kitchen",
  "description": "Find the key in the copper pot, use it to unlock the desk drawer",

  "steps": [
    {
      "id": "find_key",
      "trigger": { "verb": "use", "object": "copper_pot" },
      "conditions": [{ "not_flag": "key_found" }],
      "actions": [
        { "type": "sfx", "sound": "metal-clink" },
        { "type": "inv_add", "item": "brass_key" },
        { "type": "flag", "set": "key_found" },
        { "type": "dialog", "key": "dlg:kitchen.key_found" },
        { "type": "object_update", "target": "copper_pot", "verb_override": {
          "use": { "dialog": "dlg:kitchen.pot_empty" }
        }}
      ]
    },
    {
      "id": "unlock_drawer",
      "trigger": { "verb": "use", "item": "brass_key", "object": "desk_drawer" },
      "conditions": [{ "flag": "key_found" }, { "not_flag": "drawer_open" }],
      "actions": [
        { "type": "sfx", "sound": "key-turn" },
        { "type": "sfx", "sound": "drawer-slide", "delay": 500 },
        { "type": "flag", "set": "drawer_open" },
        { "type": "inv_remove", "item": "brass_key" },
        { "type": "inv_add", "item": "visvikis_letter" },
        { "type": "dialog", "key": "dlg:kitchen.letter_found" },
        { "type": "cutscene", "play": "letter-reading" },
        { "type": "object_update", "target": "desk_drawer", "sprite": "drawer-open" }
      ]
    }
  ],

  "hints": [
    {
      "after_minutes": 3,
      "condition": { "not_flag": "key_found" },
      "speaker": "clio",
      "text": "dlg:kitchen.hint_pot"
    },
    {
      "after_minutes": 2,
      "condition": { "flag": "key_found", "not_flag": "drawer_open" },
      "speaker": "ajax",
      "text": "dlg:kitchen.hint_drawer"
    }
  ]
}
```

### Item Definition (`data/items/items.json`)

```json
{
  "items": [
    {
      "id": "brass_key",
      "name": { "el": "Μπρούτζινο Κλειδί", "en": "Brass Key" },
      "description": { "el": "Ένα παλιό κλειδί...", "en": "An old key..." },
      "icon": "ui/items/brass-key.png",
      "combinable": false,
      "usable_on": ["desk_drawer"],
      "examine_dialog": "dlg:items.brass_key.examine"
    },
    {
      "id": "visvikis_letter",
      "name": { "el": "Γράμμα Βισβίκη", "en": "Visvikis Letter" },
      "description": { "el": "Το τελευταίο γράμμα...", "en": "The final letter..." },
      "icon": "ui/items/letter.png",
      "combinable": false,
      "usable_on": ["akis", "athos", "papas"],
      "examine_dialog": "dlg:items.letter.examine",
      "examine_cutscene": "letter-reading"
    },
    {
      "id": "green_stone",
      "name": { "el": "Πράσινο Πετράδι", "en": "Green Jade Stone" },
      "description": { "el": "Νεφρίτης που λάμπει...", "en": "Glowing jade..." },
      "icon": "ui/items/jade-stone.png",
      "combinable": false,
      "usable_on": ["visvikis_grave"],
      "special_render": { "glow": true, "color": "#44FF88", "pulse": 0.5 }
    }
  ],

  "combinations": [
    {
      "item_a": "lantern",
      "item_b": "matches",
      "result": "lit_lantern",
      "dialog": "dlg:items.light_lantern",
      "sfx": "match-strike"
    }
  ]
}
```

---

## Asset Library System

### Asset Types & Pipeline

```
Source Assets (high-res originals)
    ↓ asset pipeline (tools/build.ts)
Game Assets (optimized for runtime)
    ↓ manifest generation
Asset Manifest (JSON index)
    ↓ loader at runtime
In-Memory Cache
```

### Asset Manifest (`data/manifest.json`)

```json
{
  "version": "1.0.0",
  "game": "galaxidi-ch1",
  "resolution": { "w": 640, "h": 400 },

  "backgrounds": {
    "exterior": { "file": "backgrounds/pixel-exterior.png", "size": [640, 400] },
    "port": { "file": "backgrounds/pixel-port.png", "size": [640, 400] },
    "cave": { "file": "backgrounds/pixel-cave.png", "size": [640, 400] }
  },

  "sprites": {
    "ntemis-idle": { "file": "sprites/char-ntemis-final.png", "size": [50, 97] },
    "ajax-idle": { "file": "sprites/char-ajax-final.png", "size": [42, 68] },
    "cat-idle": {
      "file": "sprites/cat-sheet.png",
      "type": "sprite_sheet",
      "frame_size": [24, 16],
      "frames": 4,
      "fps": 6,
      "animations": {
        "idle": [0, 1],
        "walk": [2, 3],
        "sit": [0]
      }
    }
  },

  "portraits": {
    "ntemis-default": { "file": "portraits/portrait-ntemis.png" },
    "ntemis-happy": { "file": "portraits/portrait-ntemis-happy.png" }
  },

  "music": {
    "title-theme": { "file": "music/title-theme.mp3", "loop": true },
    "port-theme": { "file": "music/harbor-at-dusk.mp3", "loop": true, "loop_start": 2.1 },
    "ghost-theme": { "file": "music/ghost-lyra.mp3", "loop": false }
  },

  "sfx": {
    "door-open": { "file": "sfx/door-creak.mp3" },
    "key-turn": { "file": "sfx/key-turn.mp3" },
    "footstep-stone": { "file": "sfx/step-stone.mp3", "variants": 3 }
  },

  "voice": {
    "ntemis": { "dir": "voice/ntemis/", "manifest": "voice/ntemis/manifest.json" },
    "ajax": { "dir": "voice/ajax/", "manifest": "voice/ajax/manifest.json" }
  },

  "fonts": {
    "game-ui": { "file": "fonts/pixel-greek.png", "metrics": "fonts/pixel-greek.json" },
    "dialog": { "file": "fonts/dialog-font.png", "metrics": "fonts/dialog-font.json" }
  },

  "ui": {
    "cursor-look": { "file": "ui/cursor-look.png", "hotspot": [8, 8] },
    "cursor-use": { "file": "ui/cursor-hand.png", "hotspot": [4, 0] },
    "cursor-talk": { "file": "ui/cursor-talk.png", "hotspot": [8, 8] },
    "verb-bar": { "file": "ui/verb-bar.png" },
    "inventory-frame": { "file": "ui/inv-frame.png" }
  }
}
```

### Asset Generation Pipelines

| Asset Type | Source | Pipeline | Output |
|------------|--------|----------|--------|
| **Backgrounds** | `losc_imagine` (anime/pixel presets) | Generate → Resize 640x400 → PNG optimize | `assets/backgrounds/` |
| **Sprites** | `losc_imagine` or hand-drawn | Generate → Remove BG → Resize → Sheet pack | `assets/sprites/` |
| **Portraits** | `losc_imagine` (portrait preset) | Generate → Crop → Consistent style | `assets/portraits/` |
| **Music** | `music_suno` (custom mode) | Generate → Trim → Normalize → Loop point | `assets/music/` |
| **SFX** | Web Audio API or Freesound | Generate/download → Normalize → Trim | `assets/sfx/` |
| **Voice** | ElevenLabs (`elevenlabs_tts`) | Extract text → Batch generate → Map to manifest | `assets/voice/` |
| **Fonts** | BMFont or custom | Design → Export bitmap + metrics JSON | `assets/fonts/` |
| **Cutscene Art** | `losc_imagine` (anime preset) | Generate → Ken Burns sizing → PNG optimize | `assets/cutscenes/` |

### Asset Library (Reusable Across Games)

```
thalassa-assets/                  # Shared asset library (separate repo)
├── palettes/                     # Color palettes
│   ├── mediterranean.json        # Warm golds, sea blues, terracotta
│   ├── gothic.json               # Dark greys, purples, moonlight
│   ├── tropical.json             # Bright greens, turquoise, coral
│   └── nordic.json               # Cold blues, snow whites, pine green
│
├── particles/                    # Particle presets
│   ├── dust-motes.json
│   ├── fireflies.json
│   ├── snow.json
│   ├── rain.json
│   ├── petals.json
│   ├── ghost-mist.json
│   ├── sparkle.json
│   └── embers.json
│
├── transitions/                  # Scene transition presets
│   ├── fade-black.json
│   ├── fade-white.json
│   ├── iris-in.json
│   ├── iris-out.json
│   ├── dissolve.json
│   ├── wipe-left.json
│   └── pixelate.json
│
├── ui-themes/                    # Complete UI skin sets
│   ├── scumm-classic/            # Classic SCUMM blue verb bar
│   ├── parchment/                # Warm paper/scroll theme
│   ├── modern-minimal/           # Clean, minimal UI
│   └── retro-pixel/              # Chunky pixel art UI
│
├── sfx-library/                  # Categorized sound effects
│   ├── doors/
│   ├── footsteps/
│   ├── nature/
│   ├── water/
│   ├── ui/
│   └── magic/
│
├── ambient-loops/                # Ambient audio loops
│   ├── waves-gentle.mp3
│   ├── cicadas.mp3
│   ├── wind-light.mp3
│   ├── rain-soft.mp3
│   ├── tavern-murmur.mp3
│   └── church-reverb.mp3
│
└── templates/                    # Starter templates
    ├── character-template.json
    ├── scene-template.json
    ├── dialog-template.json
    └── puzzle-template.json
```

---

## Engine Systems — Detailed Specs

### 1. Scene Manager

```typescript
interface Scene {
  id: string;
  label: I18nString;
  background: string;           // Asset key
  music?: string;               // Music track key
  ambience?: string[];          // Ambient audio layer keys
  lighting?: LightingConfig;
  walkLine: [number, number][]; // Ground plane spline
  walkSurface: string;          // Footstep type
  charPositions: Record<string, Position>;
  npcs: NPCPlacement[];
  objects: SceneObject[];
  exits: Exit[];
  entry: EntryConfig;
  ambientAnimations: AmbientAnimation[];
}

class SceneManager {
  loadScene(id: string): Promise<Scene>;
  enterScene(id: string, fromExit?: string): void;
  getCurrentScene(): Scene;
  getObject(id: string): SceneObject | null;
  updateObject(id: string, patch: Partial<SceneObject>): void;
  hideObject(id: string): void;
  showObject(id: string): void;
}
```

**Key features:**
- Scenes loaded from JSON at runtime (not compiled in)
- Hot-reload in dev mode (edit JSON, see changes instantly)
- Scene validation on load (missing assets, broken exits, unreachable objects)
- Conditional object visibility (based on flags, items, story progress)
- Walk line interpolation with Y-sorting for depth

### 2. Character System

```typescript
interface CharacterDef {
  id: string;
  name: I18nString;
  role: 'playable' | 'npc' | 'companion' | 'ghost';
  sprites: SpriteConfig;
  portraits: Record<string, string>;
  walk: WalkConfig;
  idle: IdleAnimConfig;
  voice: VoiceConfig;
  dialogColor: string;
  zOrder: 'y_sort' | 'fixed';
  special?: {
    transparent?: number;    // Alpha (ghost = 0.6)
    glow?: GlowConfig;      // Aura effect
    float?: boolean;         // Hover instead of walk
    particles?: string;      // Trail particle preset
  };
}

class CharacterManager {
  register(def: CharacterDef): void;
  spawn(id: string, scene: string, x: number, y: number): void;
  despawn(id: string): void;
  walkTo(id: string, x: number, callback?: () => void): void;
  setExpression(id: string, expression: string): void;
  setFacing(id: string, direction: -1 | 1): void;
  getPosition(id: string): Position;
  isWalking(id: string): boolean;
}
```

**Key features:**
- Characters defined in JSON, loaded dynamically
- Procedural walk animation preserved (the crown jewel)
- Expression system (swap sprite overlays for emotions)
- Companion AI (Ajax/Clio follow Ntemis with offsets)
- Ghost rendering (transparency, glow, particle trail)
- NPC scheduling (appear/disappear based on story progress)

### 3. Dialog Engine

```typescript
interface DialogNode {
  id: string;
  type: 'speech' | 'choice' | 'branch' | 'action';
  speaker?: string;
  text?: I18nString;
  portrait?: string;
  options?: DialogOption[];    // For choice nodes
  conditions?: Condition[];    // Branch conditions
  actions?: Action[];          // Side effects
  then?: string | BranchDef;  // Next node
  end?: boolean;
}

class DialogEngine {
  startDialog(treeId: string): void;
  advanceDialog(): void;
  selectOption(index: number): void;
  isActive(): boolean;
  getCurrentNode(): DialogNode;
  onDialogEnd(callback: () => void): void;
}
```

**Key features:**
- Branching dialog trees loaded from JSON
- Conditional options (show/hide based on flags, items, visited scenes)
- "Once" options (disappear after selection)
- Actions triggered by dialog (set flags, add items, unlock exits)
- Typewriter text with per-character speed
- Portrait expressions change mid-dialog
- Voice playback synced to text
- Dialog memory (NPCs remember previous conversations)

### 4. Puzzle/Action Engine

```typescript
type Action =
  | { type: 'flag'; set: string; value?: any }
  | { type: 'inv_add'; item: string }
  | { type: 'inv_remove'; item: string }
  | { type: 'sfx'; sound: string; delay?: number }
  | { type: 'dialog'; key: string }
  | { type: 'cutscene'; play: string }
  | { type: 'object_hide'; target: string }
  | { type: 'object_show'; target: string }
  | { type: 'object_update'; target: string; sprite?: string }
  | { type: 'unlock_exit'; scene: string; exit: string }
  | { type: 'journal'; entry: string }
  | { type: 'walk'; character: string; x: number }
  | { type: 'camera'; pan?: Position; zoom?: number }
  | { type: 'wait'; ms: number }
  | { type: 'achievement'; id: string };

interface Condition {
  flag?: string;
  not_flag?: string;
  item?: string;
  not_item?: string;
  visited?: string;
  not_visited?: string;
  value?: any;
}

class PuzzleEngine {
  executeActions(actions: Action[]): Promise<void>;  // Sequential
  checkConditions(conditions: Condition[]): boolean;
  registerHint(hint: HintDef): void;
  checkHints(elapsed: number): void;  // Time-based hints
}
```

**Key features:**
- All puzzle logic is data, not code
- Actions execute sequentially (wait for each to complete)
- Conditions check game state (flags, inventory, visited scenes)
- Hint system triggers after configurable time (prevents stuck players)
- Item combinations defined in data
- Custom action types via plugin API

### 5. Cutscene Compositor

```typescript
type CutsceneLayer =
  | { type: 'current_scene' }
  | { type: 'image'; src: string; position?: Position; alpha?: Tween }
  | { type: 'ken_burns'; src: string; zoom: Tween; pan: Tween }
  | { type: 'effect'; name: string; params: Record<string, any> }
  | { type: 'character'; id: string; alpha?: number }
  | { type: 'character_appear'; character: string; style: string }
  | { type: 'character_walk'; character: string; from: number; to: number }
  | { type: 'particles'; preset: string; zone: number[] }
  | { type: 'color_overlay'; color: string; alpha: Tween };

interface CutsceneFrame {
  duration: number;
  layers: CutsceneLayer[];
  audio: CutsceneAudio[];
  dialog: CutsceneDialog[];
}

class CutscenePlayer {
  play(id: string): Promise<void>;
  skip(): void;
  isPlaying(): boolean;
  getCurrentFrame(): number;
  getProgress(): number;      // 0.0 - 1.0
}
```

**Built-in composable types:**
- `ken_burns` — zoom/pan on still images (most common)
- `character_appear` — fade/glow/slide character in
- `character_walk` — scripted character movement
- `effect` — darken, lighten, sepia, blur, vignette, pixelate
- `particles` — any particle preset (ghost mist, petals, dust)
- `color_overlay` — tinted screen overlay with alpha tween
- `camera_shake` — configurable intensity + duration

**No custom draw functions needed.** New cutscenes = new JSON files.

### 6. Camera System

```typescript
class Camera {
  panTo(x: number, y: number, duration: number, ease?: EaseFunction): Promise<void>;
  zoomTo(level: number, duration: number, ease?: EaseFunction): Promise<void>;
  shake(intensity: number, duration: number): void;
  follow(characterId: string, offset?: Position): void;
  unfollow(): void;
  reset(duration?: number): void;
  getTransform(): { x: number; y: number; zoom: number };
}
```

### 7. Save System

```typescript
interface SaveData {
  version: string;          // Schema version for migration
  game: string;             // Game ID
  chapter: string;          // Chapter ID
  timestamp: number;
  playtime: number;         // Seconds
  scene: string;
  characters: Record<string, CharacterState>;
  inventory: string[];
  flags: Record<string, any>;
  visited: string[];
  dialogs_completed: string[];
  journal_entries: string[];
  achievements: string[];
  screenshot?: string;      // Base64 thumbnail
}

class SaveManager {
  save(slot: string): SaveData;
  load(slot: string): void;
  autoSave(): void;
  listSlots(): SaveSlot[];
  deleteSave(slot: string): void;
  exportSave(): string;           // For cloud sync / sharing
  importSave(data: string): void;
  migrate(data: SaveData): SaveData;  // Version migration
}
```

**Key features:**
- Unlimited save slots (not just 3)
- Auto-save at scene transitions + before cutscenes
- Save file versioning with automatic migration
- Screenshot thumbnails in save list
- Export/import for cloud sync or device transfer
- Playtime tracking per save

### 8. Plugin API

```typescript
interface ThalassaPlugin {
  id: string;
  name: string;
  version: string;
  init(engine: ThalassaEngine): void;
  destroy(): void;
}

// Example: Analytics plugin
class AnalyticsPlugin implements ThalassaPlugin {
  init(engine) {
    engine.on('scene:enter', (scene) => this.trackSceneVisit(scene));
    engine.on('puzzle:solved', (puzzle) => this.trackPuzzleSolved(puzzle));
    engine.on('dialog:choice', (node, option) => this.trackChoice(node, option));
    engine.on('game:save', () => this.trackCheckpoint());
  }
}

// Example: Voice plugin (ElevenLabs)
class VoicePlugin implements ThalassaPlugin {
  init(engine) {
    engine.on('dialog:text', async (speaker, text) => {
      const audio = await this.getVoiceLine(speaker, text);
      if (audio) engine.audio.playVoice(audio);
    });
  }
}
```

---

## Editor Suite — The Content Creation Platform

### Scene Editor

```
┌─────────────────────────────────────────────────────────┐
│ Scene Editor: port                          [Save] [Play]│
├──────────────────────────────┬──────────────────────────┤
│                              │ Properties               │
│   [Scene Canvas 640x400]     │                          │
│                              │ Selected: fishing_nets    │
│   • Drag objects             │ ├ x: 100  y: 340         │
│   • Draw walk lines          │ ├ w: 80   h: 50          │
│   • Place NPCs               │ ├ label.el: Δίχτυα       │
│   • Set exit zones           │ ├ label.en: Fishing Nets  │
│   • Preview hotspots         │ ├ verbs:                  │
│                              │ │  look: [dialog ref]     │
│                              │ │  use:  [action list]    │
│                              │ └ conditions: [...]       │
├──────────────────────────────┤                          │
│ Objects  NPCs  Exits  Walk   │                          │
│ [+] fishing_nets             │                          │
│ [+] bollards                 │                          │
│ [+] taverna_door             │                          │
└──────────────────────────────┴──────────────────────────┘
```

### Dialog Editor

```
┌─────────────────────────────────────────────────────────┐
│ Dialog Editor: akis-harbor                  [Save] [Test]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [greeting] ──→ [choices] ──┬──→ [visvikis_topic]      │
│                             │         ↓                 │
│                             ├──→ [akis_doing]           │
│                             │                           │
│                             └──→ [goodbye]              │
│                                                         │
│  Visual node graph — drag to connect, click to edit     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Node: visvikis_topic                                    │
│ Speaker: Akis          Portrait: excited                │
│ Text (EL): Ο Βισβίκης! Ο θρύλος του Γαλαξειδίου...    │
│ Text (EN): Visvikis! The legend of Galaxidi...          │
│ Actions: [+ flag: akis_told_visvikis] [+ journal entry] │
│ Then: visvikis_detail    Conditions: [item: letter]     │
└─────────────────────────────────────────────────────────┘
```

### Cutscene Editor

```
┌─────────────────────────────────────────────────────────┐
│ Cutscene Editor: ghost-appear               [Save] [▶]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Preview Canvas — real-time playback]                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Timeline:                                    00:12.0    │
│                                                         │
│ Frame 1 ████████░░░░ Frame 2 ████████████████ Frame 3   │
│                                                         │
│ Layers:  ▼ current_scene  ████████████████████████████  │
│          ▼ darken         ▓▓▓▓▓▓▓▓████████████████████  │
│          ▼ ghost_appear   ░░░░░░░░▓▓▓▓████████████████  │
│          ▼ particles      ░░░░░░░░░░▓▓▓▓▓▓████████████  │
│                                                         │
│ Dialog:  ○ Clio 1.0s     ○ Narrator 5.0s  ○ Ajax 7.0s  │
│ Audio:   ♪ wind 0.0s     ♪ ghost-theme 4.0s             │
│                                                         │
│ [+ Layer] [+ Dialog] [+ Audio] [+ Effect]               │
└─────────────────────────────────────────────────────────┘
```

### Puzzle Editor

```
┌─────────────────────────────────────────────────────────┐
│ Puzzle Editor: drawer-puzzle                [Save] [Test]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 1: find_key                                       │
│  ┌─────────────┐    ┌──────────────────────────┐       │
│  │ Trigger:     │ →  │ Actions:                  │       │
│  │ USE on       │    │ • Play SFX: metal-clink   │       │
│  │ copper_pot   │    │ • Add item: brass_key     │       │
│  │              │    │ • Set flag: key_found      │       │
│  │ Requires:    │    │ • Show dialog: key_found   │       │
│  │ (none)       │    │                            │       │
│  └─────────────┘    └──────────────────────────┘       │
│                           ↓                             │
│  Step 2: unlock_drawer                                  │
│  ┌─────────────┐    ┌──────────────────────────┐       │
│  │ Trigger:     │ →  │ Actions:                  │       │
│  │ USE brass_key│    │ • Play SFX: key-turn      │       │
│  │ ON desk_     │    │ • Set flag: drawer_open    │       │
│  │ drawer       │    │ • Remove: brass_key        │       │
│  │              │    │ • Add: visvikis_letter     │       │
│  │ Requires:    │    │ • Play cutscene: letter    │       │
│  │ flag:key_    │    │                            │       │
│  │ found        │    │                            │       │
│  └─────────────┘    └──────────────────────────┘       │
│                                                         │
│ Hints:                                                  │
│ • After 3min (no key): Clio says "check the pots"      │
│ • After 2min (key, no drawer): Ajax says "try drawer"  │
└─────────────────────────────────────────────────────────┘
```

---

## Build & Distribution

### Export Targets

| Target | Tool | Output | Distribution |
|--------|------|--------|-------------|
| **Web** | Vite build | Static HTML/JS/CSS bundle | itch.io, own domain, CDN |
| **Desktop** | Tauri | macOS .dmg, Windows .exe, Linux .AppImage | Steam, itch.io, direct |
| **Mobile** | Capacitor | iOS .ipa, Android .apk | App Store, Play Store |
| **Embedded** | Single-file build | One HTML file (original format) | Email, USB, offline |

### Build Pipeline

```bash
# Development
npm run dev              # Vite dev server with hot reload

# Validate game data
npm run validate         # Check all JSON files for integrity

# Build for web
npm run build:web        # → dist/web/

# Build for desktop
npm run build:desktop    # → dist/desktop/ (Tauri)

# Build for mobile
npm run build:mobile     # → dist/mobile/ (Capacitor)

# Package game data
npm run pack             # → dist/galaxidi-ch1.thalassa (data archive)

# Generate voice lines
npm run voice:generate   # Batch ElevenLabs generation
npm run voice:validate   # Check all dialog has voice coverage
```

### Game Data Packs

```
galaxidi-ch1.thalassa          # Compressed game data archive
├── manifest.json              # Asset + scene index
├── data/                      # All JSON game data
├── assets/                    # All binary assets
└── meta.json                  # Title, author, version, thumbnail
```

Games ship as `.thalassa` data packs loaded by the engine. The engine itself is the runtime. This enables:
- **Chapters as DLC**: Ship ch2, ch3 as separate data packs
- **Community content**: Anyone can create a `.thalassa` pack
- **Mod support**: Override assets/data without touching engine

---

## Implementation Phases

### PHASE 0: Foundation (Week 1-2)
**"Set up the project structure and build system"**

- [ ] Initialize TypeScript project with Vite
- [ ] Set up project structure (`engine/`, `data/`, `assets/`, `tools/`)
- [ ] Configure ESLint, Prettier, tsconfig
- [ ] Set up test framework (Vitest)
- [ ] Create engine entry point and game loop
- [ ] Implement asset loader with progress callback
- [ ] Create dev server with hot reload
- [ ] Port canvas setup and scaling from monolith
- [ ] Write `manifest.json` schema + validator

**Deliverables:** Project builds, empty canvas renders, assets load from manifest.

---

### PHASE 1: Core Engine Extract (Week 3-5)
**"Pull the reusable engine out of the monolith"**

Extract these systems from `index.html` into TypeScript modules:

- [ ] **Renderer** — canvas management, layer compositing, scaling
- [ ] **Game State** — reactive state with event emission
- [ ] **Input System** — mouse/touch/keyboard with cursor modes
- [ ] **Game Loop** — RAF with delta time, fixed update step
- [ ] **Particle System** — emitter + presets (dust, sparkle, mist)
- [ ] **Transition System** — fade, iris, dissolve
- [ ] **Camera** — pan, zoom, shake

Write tests for each system. Verify 60fps performance.

**Deliverables:** Engine renders background + particles + transitions. No game content yet.

---

### PHASE 2: Character & Walk System (Week 5-7)
**"The procedural walk is the crown jewel — port it carefully"**

- [ ] **Character Manager** — register characters from JSON definitions
- [ ] **Procedural Walk** — port two-leg scissoring algorithm to TypeScript
- [ ] **Idle Animation** — compound sine breathing
- [ ] **Walk System** — `startWalk()`, path interpolation, easing
- [ ] **Companion Follow** — Ajax/Clio follow logic with offsets
- [ ] **Expression System** — sprite overlay swaps for emotions
- [ ] **Ghost Rendering** — transparency, glow, particle trail, float
- [ ] **Y-Sorting** — depth ordering by character Y position
- [ ] **Character JSON loader** — parse character definitions from data files

Create test scene with all 3 family members walking, idling, expressing.

**Deliverables:** Characters load from JSON, walk procedurally, follow leader, show expressions.

---

### PHASE 3: Scene System (Week 7-9)
**"Scenes are data, not code"**

- [ ] **Scene JSON schema** — define and validate scene format
- [ ] **Scene Loader** — parse scene JSON, resolve asset references
- [ ] **Scene Renderer** — background + objects + characters + ambient
- [ ] **Walk Line System** — spline-based ground plane, Y interpolation
- [ ] **Object System** — clickable hotspots with polygon/rect detection
- [ ] **Exit System** — scene transitions with configurable effects
- [ ] **Ambient Animations** — particle zones, sprite loops, water shimmer
- [ ] **NPC Placement** — position NPCs from scene data, conditional visibility
- [ ] **Entry System** — first visit / revisit / conditional entry dialogs

Extract all 10 existing scenes from `index.html` → individual JSON files.

**Deliverables:** All 10 existing scenes playable from JSON. Navigate between scenes. Objects clickable.

---

### PHASE 4: Dialog Engine (Week 9-11)
**"From linear queues to branching trees"**

- [ ] **Dialog Tree Parser** — load branching dialog from JSON
- [ ] **Dialog Renderer** — typewriter text, portraits, speaker names
- [ ] **Choice System** — display options, handle selection
- [ ] **Conditional Options** — show/hide based on flags, items, state
- [ ] **Dialog Actions** — execute side effects (flags, items, unlocks)
- [ ] **Dialog Memory** — track completed trees, "once" options
- [ ] **Voice Integration** — play voice lines synced to text
- [ ] **Multi-language** — switch language mid-game, fallback to primary

Convert all existing linear dialogs to tree format. Add branching to key NPCs.

**Deliverables:** All dialog plays from JSON trees. At least 3 NPCs have branching conversations.

---

### PHASE 5: Puzzle & Interaction Engine (Week 11-13)
**"Puzzles are data, not functions"**

- [ ] **Action Executor** — sequential action pipeline (flag, item, sfx, dialog, cutscene...)
- [ ] **Condition Checker** — evaluate flag/item/visited conditions
- [ ] **Verb System** — look/use/talk/pickup with cursor modes
- [ ] **Item-on-Object** — use inventory item on scene object
- [ ] **Item Combinations** — combine items in inventory
- [ ] **Puzzle Definitions** — load multi-step puzzles from JSON
- [ ] **Hint System** — time-based progressive hints
- [ ] **Inventory UI** — drag-drop, examine, combine

Convert all existing verb functions to data-driven actions. No more JS in scene definitions.

**Deliverables:** All puzzles work from JSON data. No JavaScript in any scene/puzzle file.

---

### PHASE 6: Cutscene Compositor (Week 13-15)
**"Composable visual storytelling"**

- [ ] **Cutscene Player** — timeline-based frame sequencer
- [ ] **Ken Burns Layer** — zoom/pan on still images (most common)
- [ ] **Effect Layers** — darken, lighten, sepia, blur, vignette
- [ ] **Character Layers** — appear, walk, gesture within cutscenes
- [ ] **Particle Layers** — ghost mist, petals, sparkle overlays
- [ ] **Dialog Timing** — timed speech bubbles within cutscene frames
- [ ] **Audio Sync** — music triggers, SFX cues, voice playback
- [ ] **Skip System** — ESC to skip, smooth exit to game state
- [ ] **Tween Engine** — easing functions for all animated properties

Convert all 20+ existing cutscenes from custom draw functions to JSON definitions.

**Deliverables:** All cutscenes play from JSON. No custom draw functions. New cutscenes = new JSON.

---

### PHASE 7: Audio System (Week 15-16)
**"Layered soundscapes"**

- [ ] **Music Manager** — play, stop, crossfade, loop with configurable loop points
- [ ] **SFX Pool** — pre-loaded sound effect instances with variants
- [ ] **Ambient Layers** — per-scene ambient audio (waves, cicadas, wind)
- [ ] **Voice Manager** — queue voice lines, duck music during speech
- [ ] **Procedural SFX** — port Web Audio API generation for footsteps, drips
- [ ] **Audio Config** — volume controls (master, music, sfx, voice, ambient)
- [ ] **Spatial Audio** — basic left/right panning based on sound source position

**Deliverables:** Full audio system with crossfade, ambient layers, voice ducking.

---

### PHASE 8: Save System & i18n (Week 16-17)
**"Never lose progress, play in any language"**

- [ ] **Save Manager** — save/load with versioning
- [ ] **Auto-Save** — scene transitions, before cutscenes
- [ ] **Save Migration** — automatic schema upgrades between versions
- [ ] **Save Slots UI** — screenshot thumbnails, playtime, chapter info
- [ ] **Export/Import** — JSON export for cloud sync / device transfer
- [ ] **i18n System** — string table loading, runtime language switching
- [ ] **Translation Files** — Greek + English complete
- [ ] **RTL Support** — foundation for future Arabic/Hebrew (if needed)

**Deliverables:** Robust save/load with migration. Full bilingual support.

---

### PHASE 9: Editor Suite (Week 17-23)
**"The tool that makes the engine a business"**

- [ ] **Editor Framework** — Vite + React/Svelte app, reads/writes game JSON
- [ ] **Scene Editor** — visual object placement, walk line drawing, exit zones
- [ ] **Dialog Editor** — node graph for branching conversations
- [ ] **Cutscene Editor** — timeline with layers, real-time preview
- [ ] **Puzzle Editor** — trigger → condition → action builder
- [ ] **Character Editor** — configure sprites, walk anatomy, voice
- [ ] **Asset Manager** — import, tag, organize, preview assets
- [ ] **Playtester** — in-editor play mode with debug overlay (flags, state, hotspots)
- [ ] **Validation** — real-time warnings for broken references, missing assets
- [ ] **Undo/Redo** — full history for all editor operations

**Deliverables:** Complete editor suite. Non-coders can create full adventure games.

---

### PHASE 10: Distribution & Polish (Week 23-25)
**"Ship it everywhere"**

- [ ] **Web Export** — optimized Vite build, asset bundling, lazy loading
- [ ] **Desktop Export** — Tauri packaging (macOS, Windows, Linux)
- [ ] **Mobile Export** — Capacitor packaging (iOS, Android)
- [ ] **Data Pack System** — `.thalassa` archive format for game content
- [ ] **Chapter System** — load chapters as separate data packs
- [ ] **Achievement System** — plugin-based, syncs across platforms
- [ ] **Analytics** — playtime heatmaps, puzzle completion rates, drop-off points
- [ ] **Performance** — asset lazy loading, sprite atlas packing, audio streaming
- [ ] **Accessibility** — keyboard navigation, screen reader hints, colorblind mode
- [ ] **Documentation** — getting started, API reference, editor guide, plugin guide

**Deliverables:** Game ships on web, desktop, mobile. Documentation complete. Community template available.

---

## Timeline Overview

```
Weeks 1-2    PHASE 0: Foundation
             ├── TypeScript + Vite project setup
             ├── Build system + testing framework
             └── Asset loader + manifest schema

Weeks 3-5    PHASE 1: Core Engine Extract
             ├── Renderer, state, input, game loop
             ├── Particle system
             └── Transition system + camera

Weeks 5-7    PHASE 2: Character & Walk System
             ├── Procedural walk port (the crown jewel)
             ├── Character JSON definitions
             └── Companion follow + ghost rendering

Weeks 7-9    PHASE 3: Scene System
             ├── Scene JSON schema + loader
             ├── Object/exit/walk line systems
             └── Extract 10 existing scenes to JSON

Weeks 9-11   PHASE 4: Dialog Engine
             ├── Branching tree parser + renderer
             ├── Conditional options + dialog memory
             └── Voice integration + i18n

Weeks 11-13  PHASE 5: Puzzle & Interaction Engine
             ├── Action executor + condition checker
             ├── Data-driven verb system
             └── Item combinations + hints

Weeks 13-15  PHASE 6: Cutscene Compositor
             ├── Timeline player + composable layers
             ├── Ken Burns, effects, character layers
             └── Convert 20+ cutscenes to JSON

Weeks 15-16  PHASE 7: Audio System
             ├── Music crossfade + ambient layers
             ├── SFX pool + procedural generation
             └── Voice manager + spatial audio

Weeks 16-17  PHASE 8: Save System & i18n
             ├── Versioned saves + migration
             ├── Auto-save + export/import
             └── Full bilingual string tables

Weeks 17-23  PHASE 9: Editor Suite
             ├── Scene editor (visual)
             ├── Dialog editor (node graph)
             ├── Cutscene editor (timeline)
             ├── Puzzle editor (flow builder)
             └── Asset manager + playtester

Weeks 23-25  PHASE 10: Distribution & Polish
             ├── Web + Desktop + Mobile export
             ├── Data pack system (.thalassa)
             ├── Analytics + achievements
             └── Documentation + community template
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Language** | TypeScript | Type safety, IDE support, refactoring confidence |
| **Bundler** | Vite | Fast dev server, optimized builds, plugin ecosystem |
| **Rendering** | Canvas 2D | Proven, performant, no WebGL complexity needed |
| **Audio** | Web Audio API + Howler.js | Procedural SFX + reliable playback |
| **Editor UI** | Svelte | Lightweight, reactive, perfect for tools |
| **Desktop** | Tauri | Tiny binary, native performance, Rust backend |
| **Mobile** | Capacitor | Web-first, native bridge, standard tooling |
| **Testing** | Vitest + Playwright | Unit + E2E |
| **Voice** | ElevenLabs API | Best quality, character voice cloning |
| **Music** | Suno API | AI-generated scene-specific tracks |
| **Art** | OpenAI DALL-E via `losc_imagine` | Consistent anime/pixel style |
| **CI/CD** | GitHub Actions | Automated builds, validation, deployment |

---

## Migration Strategy (Monolith → Engine)

The engine and the game are **separate projects** developed in parallel.

```
~/Projects/thalassa-engine/     — Engine development (this roadmap)
~/games/galaxidi-adventure/     — Game development (ROADMAP.md, continues independently)
```

**Phase A: Engine Development** (Phases 0-10 below)
- Build engine with test scenes and demo content
- Use Galaxidi monolith as REFERENCE only (read, don't modify)
- Engine has its own demo game for testing each system

**Phase B: Game Migration** (separate project, AFTER engine is ready)
- Extract Galaxidi scenes → JSON data files
- Extract Galaxidi assets → engine asset library
- Port all dialog, puzzles, cutscenes to engine data formats
- Verify feature parity: engine game plays identically to monolith
- Archive monolith to `backups/`

**Rule:** The Galaxidi Adventure game is NEVER broken. It continues shipping from `index.html` until the engine version is 100% ready. Migration is a big-bang switch, not incremental.

---

## Business Model Considerations

| Revenue Stream | Model | Notes |
|----------------|-------|-------|
| **Galaxidi Ch1** | Free | Brand builder, community gift |
| **Galaxidi Ch2-5** | Paid chapters ($4.99 each) | DLC data packs |
| **Galaxidi Full Saga** | Bundle ($14.99) | All chapters |
| **Thalassa Engine** | Open source (MIT) | Community adoption |
| **Thalassa Editor** | Freemium | Free for personal, paid for commercial ($29/mo) |
| **Asset Packs** | Marketplace | Mediterranean, Gothic, Sci-Fi, etc. ($9.99 each) |
| **Voice Pack Service** | Per-character | ElevenLabs voice generation as service |
| **Custom Games** | Commission | Build adventure games for clients on Thalassa |

---

## Success Metrics

| Metric | Ch1 Launch | 6 Months | 12 Months |
|--------|-----------|----------|-----------|
| **Players** | 500 | 5,000 | 25,000 |
| **Completion rate** | 40% | 50% | 60% |
| **Avg playtime** | 45 min | 60 min | 80 min |
| **Engine GitHub stars** | — | 200 | 1,000 |
| **Games built on Thalassa** | 1 | 5 | 20 |
| **Revenue** | $0 | $5K (Ch2) | $25K (saga + editor) |

---

## Principles

1. **Data over code.** If a content creator needs to write JavaScript to add content, the engine has failed.
2. **Playable at every step.** Never break the game during migration. Ship increments.
3. **The walk is sacred.** The procedural two-leg animation is the engine's signature. Port it perfectly.
4. **Editor is the product.** The engine is infrastructure. The editor is what people pay for.
5. **Warm by default.** The engine's aesthetic DNA is Mediterranean warmth. Dark themes are plugins, not defaults.
6. **Greek-first, world-ready.** Built for Greek stories, but i18n-native from day one.
7. **Community creates.** The best games on Thalassa will be made by people we've never met.

---

*Technical Roadmap v1.0 — February 2026*
*Thalassa Engine: Η Θάλασσα Θυμάται — The Sea Remembers*
