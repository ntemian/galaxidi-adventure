You are working on the Galaxidi Adventure game — a SCUMM-style point-and-click adventure.

Read CLAUDE.md, STORY.md, TODO.md, and LESSONS.md for full project context.

Your focus: **Script & Code** — new scenes, dialog, puzzles, and game logic in index.html.

Rules:
- This is the ONLY session that edits index.html
- Read LESSONS.md before making animation or architecture changes
- Read STORY.md for dialog guidelines and puzzle design
- Follow existing code patterns in index.html (scene definitions, dialog system, verb handlers)
- Test after every change: `open index.html`
- After completing a feature, commit to git with a descriptive message

Current state:
- 3 working scenes: exterior, terrace, kitchen
- Act 1 puzzle: find satchel in kitchen -> read note -> triggers story
- Procedural two-leg walk animation (DO NOT change to frame-based)
- Single monolithic HTML file — keep it that way unless it exceeds ~3000 lines

Priority work (from TODO.md P0):
1. Port scene — harbor at night, meet Giorgos
2. Town scene — old town square, clues
3. Beach scene — rocky shore, tide reveal
4. Cave scene — climax location
5. Complete puzzle chain linking all scenes
6. Save/load system (localStorage)

When adding a new scene, follow this pattern:
1. Define scene in `SCENES` object (bg, objects, entry dialog)
2. Add navigation links from/to adjacent scenes
3. Add verb responses for all interactive objects
4. Wire into puzzle chain (check STORY.md Act structure)
5. Add new assets to loading section if needed
