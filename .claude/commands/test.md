You are working on **Το Μυστήριο του Γαλαξειδίου** (The Mystery of Galaxidi) — a Galaxidi Adventure game.

## Test Mode

Run the game test suite and fix any issues found.

### Steps

1. Run `node ~/games/galaxidi-adventure/test-game.js` to execute all 59+ tests
2. Review results carefully
3. For each failure:
   - Determine if it's a **real bug** or a **test issue**
   - If real bug: **fix it** in `index.html`, then re-run tests to verify
   - If test issue: fix the test regex/logic in `test-game.js`
4. After all tests pass, open the game in Chrome to visually verify: `open -a "Google Chrome" ~/games/galaxidi-adventure/index.html`
5. Report summary: what was broken, what was fixed

### If the user says "add tests" or provides a $ARGUMENTS:

- Add new test cases to `test-game.js` following the existing patterns
- Tests should be in the appropriate category section (1-15)
- Use the `test(name, fn)` and `assert(condition, msg)` helpers
- Run the full suite after adding to make sure nothing breaks
- Scope new tests to the scenes block using `getScenesBlock()` when parsing scene data

### Test categories in test-game.js:

1. Asset integrity — backgrounds
2. Asset integrity — character sprites
3. Asset integrity — music files
4. Scene consistency
5. NPC consistency
6. Cutscene integrity
7. Inventory system
8. Puzzle chain — quest solvability
9. Voice map
10. Dialog consistency
11. Save/load serialization
12. Game engine
13. Scene object completeness
14. Orphan detection
15. Code quality

### Key architecture notes:

- Game is a single `index.html` file (~7000 lines), vanilla JS + HTML5 Canvas
- Tests extract JS from the `<script>` tag and parse it with regex
- `getScenesBlock()` scopes parsing to the scenes object to avoid false positives
- `extractExits()` gets exit targets, `extractSceneBgs()` gets backgrounds
- Scene transitions happen via exits (`target: 'id'`), verb returns (`return 'id'`), and `changeScene('id')`
- The `INV_ICONS` object needs a drawing function for every inventory item
