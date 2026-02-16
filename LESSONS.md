# Galaxidi Adventure — Lessons Learned

## Animation

### Walk Animation — What Works
- **Procedural two-leg scissoring** is far better than frame-based walk cycles for pixel art sprites
- Split sprite at waist, draw lower body TWICE: back leg (70% alpha, shifted opposite, lifted) + front leg (full brightness, shifted forward)
- Per-scanline displacement in 2px bands creates natural foot movement
- `stride: 7` for adults, `stride: 6` for children looks good
- `waist: 0.58-0.62` depending on character proportions

### Walk Animation — What Doesn't Work
- **Frame-based cycling** (4 frames): even at 12fps, legs don't visibly move on small sprites
- **Crossfade blending** between frames: just makes it blurry, doesn't help leg visibility
- **Single-direction displacement** (all scanlines same way): looks like swaying, not walking — legs need to move OPPOSITE directions
- **Integer frame counters**: cause stepped motion. Use continuous float time (walkT or tick)
- **Math.round on position**: causes pixel-snapping jitter during walks. Use sub-pixel rendering

### Idle Animation
- Compound sine waves (`sin(t) + sin(t*0.6 + offset)`) look more organic than single sine
- Squash/stretch should be very subtle (0.005 factor) or it looks rubbery
- Different frameOffset per character prevents synchronized breathing

## Asset Management

### File Paths
- When moving HTML files to new directories, ALL relative asset paths break
- Always check: backgrounds, sprites, portraits, music, JSON data files
- Browser shows dark/black screen = images not loading = wrong paths

### Image Sizes
- Character sprites: ~50px wide works well at 640x400 resolution
- Backgrounds: exactly match canvas resolution (640x400)
- Portraits: ~200x200 is good for dialog box

## Architecture

### Monolith vs Split
- **Monolith wins** for this project size (~1000 lines of game logic)
- Split version (17 JS files) adds complexity without benefit at this scale
- Global scope `<script>` tags have load-order dependencies that are fragile
- Keep monolith as canonical, use split only if game grows past ~3000 lines

### State Management
- Per-character state objects (`chars.ntemis`, `chars.ajax`, etc.) are cleaner than single character state
- `walkT` (continuous time) is better than `walkFrame` (integer counter) for smooth animation
- easeInOutCubic for walk interpolation feels natural

## Development Process

### What Helps
- Always `open index.html` after every change — catches errors immediately
- Browser console is the debugger — check for image load failures
- Generate preview images (Python PIL) to test animation offline before putting in game
- Keep backups of working versions before major changes

### What Hurts
- Editing a 1000+ line HTML file blind (without testing) leads to broken states
- Assuming image paths are correct after moving files
- Trying to debug animation without visual feedback (need to see it in browser)

## Story & Design

### Greek Text
- Always use **Γαλαξειδίου** (with ει), not Γαλαξιδίου
- Dialog should feel natural in Greek — short sentences, character-appropriate vocabulary
- Ajax (child): enthusiastic, questions. Clio (child): observant, thoughtful. Ntemis: calm, warm

### Scene Design
- Each scene needs: 4-6 interactive objects, at least one with story progression
- Entry dialog establishes mood (2-4 lines)
- Verb responses should reveal character personality, not just describe objects
