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

### Image Quality — Canvas Downscaling
- **`imageSmoothingEnabled = false`** (nearest-neighbor) is for **upscaling** pixel art — keeps crisp edges
- **`imageSmoothingEnabled = true`** with `imageSmoothingQuality = 'high'` is for **downscaling** — preserves detail via bilinear interpolation
- 1024x1024 backgrounds drawn to 640x400 canvas: MUST use `true` or detail is destroyed
- 1024x1024 portraits drawn to 52x52 dialog box: MUST use `true` (20:1 reduction)
- After drawing backgrounds/portraits with smoothing, switch back to `false` for sprites/UI
- CSS `image-rendering: pixelated` handles the final browser upscale (canvas → screen) correctly
- **Never use JPG** for pixel art backgrounds — JPEG compression adds artifacts. Always PNG
- All scene backgrounds should be 1024x1024 PNG for consistent quality

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

### When Replacing a Background Image — Coordinate Update Checklist

When a scene's background image changes (e.g. `pixel-treasure-new.png`), hotspot coordinates WILL be wrong. Follow this procedure:

1. **Open the game in Chrome** and navigate to the scene
2. **Open console** → use mouse position to identify where objects are now:
   ```js
   // Add temporarily to drawGame() to see mouse coords in game space:
   ctx.fillStyle='#0f0'; ctx.font='10px monospace';
   ctx.fillText(`${Math.round(mouseGX)},${Math.round(mouseGY)}`, mouseGX+5, mouseGY-5);
   ```
3. **Update the calibration table** (search for `// Hotspot calibration per background`) — this overrides scene defaults:
   ```js
   sceneName: {
     objectId: { x:__, y:__, w:__, h:__ },
   }
   ```
4. **Check these properties** in the scene definition:
   - `charPos` — where characters stand (must match ground level)
   - `walkLine` — the walkable path points (y values = ground height)
   - `walkBounds` — left/right limits of walkable area
5. **Test every hotspot**: hover each object, check hover label appears correctly
6. **Test exits**: walk to left/right edges, verify scene transitions

**Key principle**: The calibration table at `(function calibrateHotspots(){...})()` is the SINGLE place to update coordinates. Don't edit the scene definition directly — the calibration table overrides it.

### Character Name Consistency
- Captain's name is **Λουκάς Βισβίκης** (Loukas Visvikis) everywhere
- "Λ.Β." = Λουκάς Βισβίκης — never Λεωνίδας, never Λεονάρδος
- When adding new dialogue mentioning the captain, grep for existing lines to match
