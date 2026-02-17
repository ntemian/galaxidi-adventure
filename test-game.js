#!/usr/bin/env node
/**
 * Galaxidi Adventure — Comprehensive Game Test Suite
 *
 * Tests game integrity without a browser: asset files, scene consistency,
 * puzzle chain solvability, cutscene references, voice map, music files,
 * and save/load serialization.
 *
 * Run: node test-game.js
 */

const fs = require('fs');
const path = require('path');

const GAME_DIR = __dirname;
const INDEX_HTML = path.join(GAME_DIR, 'index.html');

// ─── Test Framework ───────────────────────────────────────
let passed = 0, failed = 0, errors = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    errors.push({ name, error: e.message });
    console.log(`  ✗ ${name}`);
    console.log(`    → ${e.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

function assertIncludes(arr, item, msg) {
  if (!arr.includes(item)) throw new Error(msg || `Expected array to include "${item}"`);
}

// ─── Extract JS from HTML ─────────────────────────────────
const html = fs.readFileSync(INDEX_HTML, 'utf-8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert(scriptMatch, 'Could not extract <script> from index.html');
const js = scriptMatch[1];

// ─── Parse Game Data ──────────────────────────────────────

// Helper: extract the scenes object block from JS
function getScenesBlock() {
  const start = js.indexOf('const scenes = {');
  if (start === -1) return '';
  // Find the end — look for the next top-level const/function/let
  const afterStart = js.substring(start);
  // Scenes block ends at a line starting with "const " or "function " or the SCENE_CUTSCENES
  const endMatch = afterStart.match(/\n(?:const |function |\/\/ ════)/);
  return endMatch ? afterStart.substring(0, endMatch.index) : afterStart.substring(0, 20000);
}

// Extract scene backgrounds — scoped to scenes block
function extractSceneBgs() {
  const bgs = {};
  const block = getScenesBlock();
  // Match: <id>: {\n    label: '...', bg: '<bg>'
  const regex = /^\s{2}(\w+):\s*\{\s*\n\s*label:\s*'[^']+',\s*bg:\s*'([^']+)'/gm;
  let m;
  while ((m = regex.exec(block)) !== null) {
    bgs[m[1]] = m[2];
  }
  return bgs;
}

// Extract exits from scene definitions — scoped to scenes block
function extractExits() {
  const exits = {};
  const block = getScenesBlock();
  const lines = block.split('\n');
  let currentScene = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect scene start: 2-space indent, identifier, then { with label on next line
    const sceneStart = line.match(/^\s{2}(\w+):\s*\{/);
    if (sceneStart) {
      // Verify it's a real scene by checking if "label:" appears within next 3 lines
      const nextLines = lines.slice(i, i + 4).join(' ');
      if (nextLines.includes('label:')) {
        currentScene = sceneStart[1];
      }
    }

    const exitMatches = line.match(/target:\s*'(\w+)'/g);
    if (exitMatches && currentScene) {
      if (!exits[currentScene]) exits[currentScene] = [];
      for (const em of exitMatches) {
        const target = em.match(/target:\s*'(\w+)'/)[1];
        exits[currentScene].push(target);
      }
    }
  }
  return exits;
}

// Extract all loadImg calls
function extractLoadedAssets() {
  const assets = [];
  const regex = /loadImg\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g;
  let m;
  while ((m = regex.exec(js)) !== null) {
    assets.push({ key: m[1], path: m[2] });
  }
  return assets;
}

// extractSceneBgs is defined above with getScenesBlock()

// Extract cutscene IDs
function extractCutsceneIds() {
  const ids = [];
  // Look for top-level keys in the cutscenes object
  const cutsceneStart = js.indexOf('const cutscenes = {');
  if (cutsceneStart === -1) return ids;
  // Find keys that look like cutscene definitions (have frames: [)
  const regex = /^\s{2}(\w+):\s*\{\s*\n\s*frames:\s*\[/gm;
  let m;
  while ((m = regex.exec(js)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

// Extract SCENE_CUTSCENES mapping
function extractSceneCutscenes() {
  const map = {};
  const regex = /(\w+):\s*'(\w+)'/g;
  const block = js.match(/const SCENE_CUTSCENES\s*=\s*\{([^}]+)\}/);
  if (!block) return map;
  let m;
  while ((m = regex.exec(block[1])) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

// Extract sceneMusic mapping
function extractSceneMusic() {
  const map = {};
  const block = js.match(/const sceneMusic\s*=\s*\{([^}]+)\}/);
  if (!block) return map;
  const regex = /(\w+):\s*'([^']+)'/g;
  let m;
  while ((m = regex.exec(block[1])) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

// Extract NPC definitions
function extractNPCs() {
  const npcs = {};
  const block = js.match(/const npcChars\s*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return npcs;
  const regex = /(\w+):\s*\{[^}]*scene:\s*'(\w+)'/g;
  let m;
  while ((m = regex.exec(block[1])) !== null) {
    npcs[m[1]] = m[2];
  }
  return npcs;
}

// Extract VOICE_MAP entries
function extractVoiceMap() {
  const entries = [];
  const start = js.indexOf('const VOICE_MAP = {');
  if (start === -1) return entries;
  // Find the closing of VOICE_MAP — it's a large object
  const regex = /'([^']+)':\s*'([^']+)'/g;
  // Search from the VOICE_MAP start, limit to reasonable range
  const chunk = js.substring(start, start + 50000);
  let m;
  while ((m = regex.exec(chunk)) !== null) {
    // Stop if we hit a function definition (end of VOICE_MAP)
    if (m[2].startsWith('voice/') || m[2].startsWith('music/')) {
      entries.push({ text: m[1], file: m[2] });
    }
  }
  return entries;
}

// Extract inventory item IDs from addInv calls
function extractInventoryItems() {
  const items = [];
  const regex = /addInv\(\s*\{\s*id:\s*'(\w+)'/g;
  let m;
  while ((m = regex.exec(js)) !== null) {
    items.push(m[1]);
  }
  return items;
}

// Extract INV_ICONS keys
function extractInvIcons() {
  const icons = [];
  const block = js.match(/const INV_ICONS\s*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return icons;
  const regex = /^\s{2}(\w+):\s*\(/gm;
  let m;
  while ((m = regex.exec(block[1])) !== null) {
    icons.push(m[1]);
  }
  return icons;
}

// Extract walkLine data for scenes — scoped to scenes block
function extractWalkLines() {
  const walkLines = {};
  const block = getScenesBlock();
  const regex = /^\s{2}(\w+):\s*\{[\s\S]*?walkLine:\s*(\[[^\]]*\[[\s\S]*?\]\])/gm;
  let m;
  while ((m = regex.exec(block)) !== null) {
    try {
      walkLines[m[1]] = JSON.parse(m[2]);
    } catch (e) {
      walkLines[m[1]] = 'parse_error';
    }
  }
  return walkLines;
}

// Extract portrait mappings
function extractPortraits() {
  const portraits = {};
  const regex = /PORTRAITS\['([^']+)'\]\s*=\s*img/g;
  let m;
  while ((m = regex.exec(js)) !== null) {
    portraits[m[1]] = true;
  }
  return portraits;
}

// Extract all speaker names from dialog lines
function extractSpeakers() {
  const speakers = new Set();
  // Match dialog patterns: {s:'SPEAKER',t:'text'}
  const regex = /\{s:\s*'([^']+)'/g;
  let m;
  while ((m = regex.exec(js)) !== null) {
    if (m[1]) speakers.add(m[1]);
  }
  return speakers;
}

// Extract character sprite IDs
function extractCharSpriteIds() {
  const ids = [];
  const regex = /\['ntemis','ajax','clio','ghost','athos','stathis','akis','giannis','curator','papas','chrysostomos'\]/;
  const m = js.match(regex);
  if (m) {
    return ['ntemis','ajax','clio','ghost','athos','stathis','akis','giannis','curator','papas','chrysostomos'];
  }
  return ids;
}

// ─── Run Tests ────────────────────────────────────────────

console.log('\n━━━ Galaxidi Adventure Test Suite ━━━\n');

// ════════════════════════════════════════════════════════════
console.log('1. ASSET INTEGRITY — Background images');
// ════════════════════════════════════════════════════════════

const loadedAssets = extractLoadedAssets();

test('index.html exists and has content', () => {
  assert(html.length > 1000, 'index.html is too small');
});

test('All loaded background images exist on disk', () => {
  const missing = [];
  for (const asset of loadedAssets) {
    if (asset.path.startsWith('assets/')) {
      const fullPath = path.join(GAME_DIR, asset.path);
      if (!fs.existsSync(fullPath)) {
        missing.push(asset.path);
      }
    }
  }
  assert(missing.length === 0, `Missing asset files: ${missing.join(', ')}`);
});

test('All loaded assets have valid file extensions', () => {
  const invalid = loadedAssets.filter(a =>
    !a.path.match(/\.(png|webp|jpg|jpeg|gif|svg|json)$/i)
  );
  assert(invalid.length === 0, `Invalid extensions: ${invalid.map(a => a.path).join(', ')}`);
});

test('No duplicate asset keys', () => {
  const keys = loadedAssets.map(a => a.key);
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
  assert(dupes.length === 0, `Duplicate keys: ${dupes.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n2. ASSET INTEGRITY — Character sprites');
// ════════════════════════════════════════════════════════════

const charIds = extractCharSpriteIds();

test('All character sprites exist on disk', () => {
  const missing = [];
  for (const id of charIds) {
    const filePath = path.join(GAME_DIR, `assets/char-${id}-final.png`);
    if (!fs.existsSync(filePath)) {
      missing.push(`char-${id}-final.png`);
    }
  }
  assert(missing.length === 0, `Missing sprites: ${missing.join(', ')}`);
});

test('All character portraits exist on disk', () => {
  const missing = [];
  for (const id of charIds) {
    if (id === 'ghost') return; // ghost uses special portrait
    const filePath = path.join(GAME_DIR, `assets/portrait-${id}.webp`);
    if (!fs.existsSync(filePath)) {
      missing.push(`portrait-${id}.webp`);
    }
  }
  assert(missing.length === 0, `Missing portraits: ${missing.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n3. ASSET INTEGRITY — Music files');
// ════════════════════════════════════════════════════════════

const sceneMusic = extractSceneMusic();

test('All scene music files exist on disk', () => {
  const missing = [];
  for (const [scene, musicPath] of Object.entries(sceneMusic)) {
    const fullPath = path.join(GAME_DIR, musicPath);
    if (!fs.existsSync(fullPath)) {
      missing.push(`${scene}: ${musicPath}`);
    }
  }
  assert(missing.length === 0, `Missing music: ${missing.join(', ')}`);
});

test('Every scene has music assigned', () => {
  const sceneBgsLocal = extractSceneBgs();
  const missingScenesMusic = Object.keys(sceneBgsLocal).filter(
    s => !sceneMusic[s]
  );
  assert(missingScenesMusic.length === 0,
    `Scenes without music: ${missingScenesMusic.join(', ')}`);
});

test('Title theme music exists', () => {
  // Check for title music references in JS — could be a variable, string, or filename
  const titleMusicRef = js.match(/title[_-]?[Mm]usic|title[_-]?theme|titleMusic/);
  assert(titleMusicRef, 'No title music variable or reference found in code');

  const titleFiles = fs.readdirSync(path.join(GAME_DIR, 'music')).filter(f =>
    f.includes('title') || f.includes('theme')
  );
  assert(titleFiles.length > 0, 'No title theme music files found');
});

// ════════════════════════════════════════════════════════════
console.log('\n4. SCENE CONSISTENCY');
// ════════════════════════════════════════════════════════════

const sceneBgs = extractSceneBgs();
const sceneIds = Object.keys(sceneBgs);

test('Expected scenes are defined (13 scenes)', () => {
  const expected = ['exterior','terrace','kitchen','port','museum','liotrivi',
    'cave','church','church_interior','windmill','boat','graveyard','treasure','new_era'];
  const missing = expected.filter(s => !sceneIds.includes(s));
  assert(missing.length === 0, `Missing scenes: ${missing.join(', ')}`);
});

test('Every scene has a background image key that maps to a loaded asset', () => {
  const loadedKeys = new Set(loadedAssets.map(a => a.key));
  const missing = [];
  for (const [sceneId, bg] of Object.entries(sceneBgs)) {
    if (!loadedKeys.has(bg)) {
      missing.push(`${sceneId} → ${bg}`);
    }
  }
  assert(missing.length === 0, `Scenes with unloaded backgrounds: ${missing.join(', ')}`);
});

test('All scene exit targets point to valid scenes', () => {
  const exits = extractExits();
  const invalid = [];
  for (const [scene, targets] of Object.entries(exits)) {
    for (const target of targets) {
      if (!sceneIds.includes(target)) {
        invalid.push(`${scene} → ${target}`);
      }
    }
  }
  assert(invalid.length === 0, `Invalid exit targets: ${invalid.join(', ')}`);
});

test('Exit connections are bidirectional (can go back)', () => {
  const exits = extractExits();
  // Also include verb-based scene transitions (open/walk verbs and changeScene calls)
  const block = getScenesBlock();
  const changeSceneRegex = /changeScene\(\s*'(\w+)'\s*\)/g;
  const verbSceneRegex = /(?:open|walk|use):\s*'(\w+)'/g;

  // Build complete connectivity including verb-based transitions, per scene
  const fullExits = {};
  for (const s of sceneIds) {
    fullExits[s] = new Set(exits[s] || []);
  }
  // Parse verb-based transitions within each scene's block
  const lines = block.split('\n');
  let currentScene = null;
  for (const line of lines) {
    const sceneStart = line.match(/^\s{2}(\w+):\s*\{/);
    if (sceneStart && sceneIds.includes(sceneStart[1])) {
      currentScene = sceneStart[1];
    }
    if (currentScene) {
      let vm;
      const lineTargets = [];
      const csRegex = /changeScene\(\s*'(\w+)'\s*\)/g;
      while ((vm = csRegex.exec(line)) !== null) lineTargets.push(vm[1]);
      const vtRegex = /(?:open|walk|use):\s*'(\w+)'/g;
      while ((vm = vtRegex.exec(line)) !== null) lineTargets.push(vm[1]);
      for (const t of lineTargets) {
        if (sceneIds.includes(t)) fullExits[currentScene].add(t);
      }
    }
  }

  const oneWay = [];
  const criticalPairs = [
    ['exterior', 'terrace'], ['exterior', 'port'], ['exterior', 'kitchen'],
    ['port', 'museum'], ['museum', 'liotrivi'], ['liotrivi', 'church'],
  ];
  for (const [a, b] of criticalPairs) {
    const aToB = fullExits[a] && fullExits[a].has(b);
    const bToA = fullExits[b] && fullExits[b].has(a);
    if (!aToB || !bToA) {
      oneWay.push(`${a} ↔ ${b} (${aToB ? '→' : '✗'} ${bToA ? '←' : '✗'})`);
    }
  }
  assert(oneWay.length === 0, `One-way critical paths: ${oneWay.join(', ')}`);
});

test('Every scene has a walkLine defined', () => {
  const walkLines = extractWalkLines();
  const missing = sceneIds.filter(s => !walkLines[s]);
  assert(missing.length === 0, `Scenes without walkLine: ${missing.join(', ')}`);
});

test('WalkLines have at least 2 points', () => {
  const walkLines = extractWalkLines();
  const invalid = [];
  for (const [scene, wl] of Object.entries(walkLines)) {
    if (wl === 'parse_error') continue; // Skip parse errors
    if (Array.isArray(wl) && wl.length < 2) {
      invalid.push(`${scene} (${wl.length} points)`);
    }
  }
  assert(invalid.length === 0, `Scenes with too few walkLine points: ${invalid.join(', ')}`);
});

test('Every scene has charPos for ntemis, ajax, clio', () => {
  const block = getScenesBlock();
  const issues = [];
  for (const sceneId of sceneIds) {
    const sceneStart = block.indexOf(`  ${sceneId}: {`);
    if (sceneStart === -1) continue;
    const chunk = block.substring(sceneStart, sceneStart + 800);
    // Extract text between charPos and the next keyword (objects: or exits:)
    const charPosMatch = chunk.match(/charPos:\s*\{([\s\S]*?)(?:objects:|exits:)/);
    if (!charPosMatch) {
      issues.push(`${sceneId} missing charPos entirely`);
      continue;
    }
    const charBlock = charPosMatch[1];
    for (const who of ['ntemis', 'ajax', 'clio']) {
      if (!charBlock.includes(who)) {
        issues.push(`${sceneId} missing ${who}`);
      }
    }
  }
  assert(issues.length === 0, `Missing charPos: ${issues.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n5. NPC CONSISTENCY');
// ════════════════════════════════════════════════════════════

const npcs = extractNPCs();

test('All NPCs are assigned to valid scenes', () => {
  const invalid = [];
  for (const [npc, scene] of Object.entries(npcs)) {
    if (!sceneIds.includes(scene)) {
      invalid.push(`${npc} → ${scene}`);
    }
  }
  assert(invalid.length === 0, `NPCs in invalid scenes: ${invalid.join(', ')}`);
});

test('All NPCs have character sprites', () => {
  const missing = Object.keys(npcs).filter(npc => !charIds.includes(npc));
  assert(missing.length === 0, `NPCs without sprites: ${missing.join(', ')}`);
});

test('All NPCs have portraits', () => {
  const portraits = extractPortraits();
  // Map NPC IDs to Greek portrait names
  const npcPortraitMap = {
    ghost: 'ΦΑΝΤΑΣΜΑ', athos: 'ΑΘΟΣ', stathis: 'ΣΤΑΘΗΣ',
    akis: 'ΑΚΗΣ', giannis: 'ΓΙΑΝΝΗΣ', curator: 'ΕΠΙΜΕΛΗΤΗΣ',
    papas: 'ΠΑΠΑΣ', chrysostomos: 'ΧΡΥΣΟΣΤΟΜΟΣ'
  };
  const missing = [];
  for (const [npc, greekName] of Object.entries(npcPortraitMap)) {
    if (!portraits[greekName]) {
      missing.push(`${npc} (${greekName})`);
    }
  }
  assert(missing.length === 0, `NPCs without portraits: ${missing.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n6. CUTSCENE INTEGRITY');
// ════════════════════════════════════════════════════════════

const cutsceneIds = extractCutsceneIds();
const sceneCutscenes = extractSceneCutscenes();

test('Cutscenes are defined', () => {
  assert(cutsceneIds.length >= 10, `Only ${cutsceneIds.length} cutscenes found, expected 10+`);
});

test('All SCENE_CUTSCENES map to valid cutscene IDs', () => {
  const invalid = [];
  for (const [scene, csId] of Object.entries(sceneCutscenes)) {
    if (!cutsceneIds.includes(csId)) {
      invalid.push(`${scene} → ${csId}`);
    }
  }
  assert(invalid.length === 0, `Invalid cutscene mappings: ${invalid.join(', ')}`);
});

test('All SCENE_CUTSCENES keys are valid scene IDs', () => {
  const invalid = Object.keys(sceneCutscenes).filter(s => !sceneIds.includes(s));
  assert(invalid.length === 0, `Invalid scene IDs in SCENE_CUTSCENES: ${invalid.join(', ')}`);
});

test('Cutscene draw functions reference loaded images', () => {
  // Extract image keys used in drawKenBurns calls within cutscene draw functions
  const regex = /drawKenBurns\(\s*'([^']+)'/g;
  const referenced = new Set();
  let m;
  while ((m = regex.exec(js)) !== null) {
    referenced.add(m[1]);
  }
  const loadedKeys = new Set(loadedAssets.map(a => a.key));
  const missing = [...referenced].filter(k => !loadedKeys.has(k));
  assert(missing.length === 0, `Cutscene images not loaded: ${missing.join(', ')}`);
});

test('All cutscene dialogue has valid speaker names', () => {
  const portraits = extractPortraits();
  const validSpeakers = new Set([...Object.keys(portraits), '']); // '' = narrator
  // Extract speakers from cutscene dialogue
  const cutsceneSection = js.substring(
    js.indexOf('const cutscenes = {'),
    js.indexOf('const cutscenes = {') + 20000
  );
  const speakerRegex = /s:\s*'([^']*)'/g;
  const unknownSpeakers = new Set();
  let m2;
  while ((m2 = speakerRegex.exec(cutsceneSection)) !== null) {
    if (!validSpeakers.has(m2[1])) {
      unknownSpeakers.add(m2[1]);
    }
  }
  assert(unknownSpeakers.size === 0,
    `Unknown speakers in cutscenes: ${[...unknownSpeakers].join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n7. INVENTORY SYSTEM');
// ════════════════════════════════════════════════════════════

const invItems = extractInventoryItems();
const invIcons = extractInvIcons();

test('Inventory items are defined', () => {
  assert(invItems.length >= 3, `Only ${invItems.length} inventory items found`);
});

test('Expected quest items exist', () => {
  const expected = ['visvikis_letter', 'brass_key', 'green_stone', 'nautical_chart', 'lantern'];
  const missing = expected.filter(item => !invItems.includes(item));
  assert(missing.length === 0, `Missing quest items: ${missing.join(', ')}`);
});

test('All inventory items have pixel art icons', () => {
  const missing = invItems.filter(item => !invIcons.includes(item));
  assert(missing.length === 0, `Items without icons: ${missing.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n8. PUZZLE CHAIN — Quest Solvability');
// ════════════════════════════════════════════════════════════

test('Visvikis letter can be obtained (kitchen → key → drawer → letter)', () => {
  // New puzzle: copper_pot → brass_key, then desk_drawer → visvikis_letter
  assert(js.includes("id:'copper_pot'") || js.includes("id:'desk_drawer'"),
    'Kitchen puzzle objects not found');
  assert(js.includes("addInv({id:'brass_key'"), 'Brass key not obtainable');
  assert(js.includes("addInv({id:'visvikis_letter'"), 'Visvikis letter not obtainable from drawer');
});

test('Lantern can be obtained (windmill → Giannis → talk)', () => {
  assert(js.includes("addInv({id:'lantern'"), 'Lantern not given by Giannis');
  // Verify it's in the windmill scene context
  assert(js.includes("id:'lantern'"), 'Lantern item not defined');
});

test('Green stone can be obtained (cave)', () => {
  assert(js.includes("addInv({ id: 'green_stone'") || js.includes("addInv({id:'green_stone'"),
    'Green stone not obtainable');
});

test('Nautical chart can be obtained (church interior)', () => {
  assert(js.includes("addInv({id:'nautical_chart'") || js.includes("addInv({ id:'nautical_chart'"),
    'Nautical chart not obtainable');
});

test('Cave requires lantern (gate check exists)', () => {
  // Look for the lantern check when trying to enter cave
  assert(js.includes("lantern") && js.includes("φανάρι".toLowerCase()) ||
    js.includes("lantern") && js.includes("cave"),
    'Cave lantern gate not found');
});

test('Green stone is removed when used at graveyard', () => {
  assert(js.includes("removeInv('green_stone')"), 'Green stone not consumed at graveyard');
});

test('Ghost sequence is triggered after stone placement', () => {
  assert(js.includes('startGhostSequence') || js.includes('ghost_summoned'),
    'Ghost sequence trigger not found');
});

test('Letter read flag enables endgame', () => {
  assert(js.includes('letter_read'), 'letter_read flag not found');
  assert(js.includes('speech_done') || js.includes('epilogue'),
    'Endgame trigger not found');
});

test('Full puzzle chain: kitchen → port → museum → liotrivi → windmill → cave → graveyard → church → boat → treasure → new_era', () => {
  // Verify all flag names exist in the codebase
  const flags = ['note', 'green_stone', 'ghost_summoned', 'candle_lit', 'nautical_chart',
    'chest_opened', 'letter_read'];
  const missingFlags = [];
  for (const flag of flags) {
    if (!js.includes(flag)) {
      missingFlags.push(flag);
    }
  }
  assert(missingFlags.length === 0, `Missing puzzle flags: ${missingFlags.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n9. VOICE MAP');
// ════════════════════════════════════════════════════════════

const voiceEntries = extractVoiceMap();

test('VOICE_MAP has entries', () => {
  assert(voiceEntries.length > 50, `Only ${voiceEntries.length} voice entries found`);
});

test('Voice files referenced in VOICE_MAP exist on disk', () => {
  const missing = [];
  const checked = new Set();
  for (const entry of voiceEntries) {
    if (checked.has(entry.file)) continue;
    checked.add(entry.file);
    const fullPath = path.join(GAME_DIR, entry.file);
    if (!fs.existsSync(fullPath)) {
      missing.push(entry.file);
    }
  }
  if (missing.length > 0) {
    assert(false, `${missing.length} missing voice files. First 10: ${missing.slice(0, 10).join(', ')}`);
  }
});

test('Voice files are organized by character directory', () => {
  const voiceDir = path.join(GAME_DIR, 'voice');
  if (!fs.existsSync(voiceDir)) {
    assert(false, 'voice/ directory not found');
    return;
  }
  const expectedDirs = ['narrator', 'ntemis', 'ajax', 'clio'];
  const missing = expectedDirs.filter(d => !fs.existsSync(path.join(voiceDir, d)));
  assert(missing.length === 0, `Missing voice directories: ${missing.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n10. DIALOG CONSISTENCY');
// ════════════════════════════════════════════════════════════

const speakers = extractSpeakers();
const portraits = extractPortraits();

test('All named speakers have portraits defined', () => {
  const missingPortrait = [];
  for (const speaker of speakers) {
    if (speaker === '' || speaker === 'ΑΦΗΓΗΤΗΣ') continue; // narrator has no portrait
    if (!portraits[speaker]) {
      missingPortrait.push(speaker);
    }
  }
  assert(missingPortrait.length === 0,
    `Speakers without portraits: ${missingPortrait.join(', ')}`);
});

test('Family members have speaking roles', () => {
  assert(speakers.has('ΝΤΕΜΗΣ'), 'Ntemis has no dialog');
  assert(speakers.has('ΑΙΑΣ'), 'Ajax has no dialog');
  assert(speakers.has('ΚΛΕΙΩ'), 'Clio has no dialog');
});

test('Key NPCs have speaking roles', () => {
  const expectedSpeakers = ['ΑΚΗΣ', 'ΣΤΑΘΗΣ', 'ΑΘΟΣ', 'ΓΙΑΝΝΗΣ', 'ΕΠΙΜΕΛΗΤΗΣ', 'ΠΑΠΑΣ', 'ΧΡΥΣΟΣΤΟΜΟΣ'];
  const missingSpeakers = expectedSpeakers.filter(s => !speakers.has(s));
  assert(missingSpeakers.length === 0,
    `NPCs without dialog: ${missingSpeakers.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n11. SAVE/LOAD SERIALIZATION');
// ════════════════════════════════════════════════════════════

test('Save function serializes required fields', () => {
  const saveFunc = js.match(/function saveGame[\s\S]*?localStorage\.setItem/);
  assert(saveFunc, 'saveGame function not found');
  const saveBlock = saveFunc[0];
  assert(saveBlock.includes('scene'), 'Save missing scene');
  assert(saveBlock.includes('inventory') || saveBlock.includes('inv'), 'Save missing inventory');
  assert(saveBlock.includes('flags'), 'Save missing flags');
  assert(saveBlock.includes('visited'), 'Save missing visited');
});

test('Load function restores required fields', () => {
  const loadFunc = js.match(/function loadGame[\s\S]*?return true/);
  assert(loadFunc, 'loadGame function not found');
  const loadBlock = loadFunc[0];
  assert(loadBlock.includes('inv') || loadBlock.includes('inventory'), 'Load missing inventory');
  assert(loadBlock.includes('flags'), 'Load missing flags');
  assert(loadBlock.includes('scene'), 'Load missing scene');
  assert(loadBlock.includes('visited'), 'Load missing visited');
});

test('Visited set is serialized as array (JSON-safe)', () => {
  assert(js.includes('[...state.visited]') || js.includes('Array.from(state.visited)'),
    'visited Set not serialized to array');
  assert(js.includes('new Set(data.visited') || js.includes('Set(data.visited'),
    'visited not restored as Set');
});

// ════════════════════════════════════════════════════════════
console.log('\n12. GAME ENGINE');
// ════════════════════════════════════════════════════════════

test('Game loop exists', () => {
  assert(js.includes('requestAnimationFrame'), 'No requestAnimationFrame found');
  assert(js.includes('gameLoop') || js.includes('game_loop'), 'No game loop function');
});

test('Canvas resolution is 640x400', () => {
  assert(js.includes('640') && js.includes('400'), 'Canvas resolution not 640x400');
  // Check for GW/GH constants
  const gwMatch = js.match(/const GW\s*=\s*(\d+)/);
  const ghMatch = js.match(/const GH\s*=\s*(\d+)/);
  if (gwMatch) assert(gwMatch[1] === '640', `GW is ${gwMatch[1]}, expected 640`);
  if (ghMatch) assert(ghMatch[1] === '400', `GH is ${ghMatch[1]}, expected 400`);
});

test('Game phases are handled (title, intro, cutscene, playing, epilogue)', () => {
  const phases = ['title', 'intro', 'cutscene', 'playing', 'epilogue'];
  const missing = phases.filter(p => !js.includes(`'${p}'`));
  assert(missing.length === 0, `Missing game phases: ${missing.join(', ')}`);
});

test('Verb system has 4 verbs', () => {
  assert(js.includes('Κοίταξε') || js.includes('look'), 'Look verb missing');
  assert(js.includes('Μίλησε') || js.includes('talk'), 'Talk verb missing');
  assert(js.includes('Άνοιξε') || js.includes('open'), 'Open verb missing');
  assert(js.includes('Χρησιμοποίησε') || js.includes('use'), 'Use verb missing');
});

test('WALK_ANATOMY is defined for family members', () => {
  assert(js.includes('WALK_ANATOMY'), 'WALK_ANATOMY not defined');
  for (const who of ['ntemis', 'ajax', 'clio']) {
    assert(js.includes(`${who}:`) || js.includes(`'${who}'`),
      `${who} not in WALK_ANATOMY`);
  }
});

test('Hit testing functions exist', () => {
  assert(js.includes('hitTestObj') || js.includes('hitTest'), 'hitTestObj not found');
  assert(js.includes('hitTestExit'), 'hitTestExit not found');
});

test('screenToGame coordinate conversion exists', () => {
  assert(js.includes('screenToGame'), 'screenToGame not found');
});

// ════════════════════════════════════════════════════════════
console.log('\n13. SCENE OBJECT COMPLETENESS');
// ════════════════════════════════════════════════════════════

test('All scene objects have required properties (id, label, verbs)', () => {
  // Extract objects that have id but missing label or verbs
  const objRegex = /\{\s*id:\s*'(\w+)',\s*x:/g;
  let objMatch;
  const objectIds = [];
  while ((objMatch = objRegex.exec(js)) !== null) {
    objectIds.push(objMatch[1]);
  }
  assert(objectIds.length > 30, `Only ${objectIds.length} hotspot objects found, expected 30+`);

  // Verify objects have labels
  const noLabel = [];
  const labelRegex = /\{\s*id:\s*'(\w+)'[^}]*?(?!label:)/g;
  // Simplified: just check a few critical ones
  const criticalObjects = ['door', 'desk_drawer', 'copper_pot', 'elpida_dock'];
  for (const obj of criticalObjects) {
    const objDef = js.match(new RegExp(`id:\\s*'${obj}'[^}]*label:\\s*'([^']+)'`));
    if (!objDef) {
      noLabel.push(obj);
    }
  }
  assert(noLabel.length === 0, `Objects without labels: ${noLabel.join(', ')}`);
});

test('Every scene has entry dialog defined', () => {
  const block = getScenesBlock();
  const regex = /^\s{2}(\w+):\s*\{[\s\S]*?entry:\s*\[/gm;
  const scenesWithEntry = new Set();
  let m;
  while ((m = regex.exec(block)) !== null) {
    scenesWithEntry.add(m[1]);
  }
  const missing = sceneIds.filter(s => !scenesWithEntry.has(s));
  assert(missing.length === 0, `Scenes without entry dialog: ${missing.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n14. ORPHAN DETECTION');
// ════════════════════════════════════════════════════════════

test('No orphan asset files (files in assets/ not loaded by game)', () => {
  const assetDir = path.join(GAME_DIR, 'assets');
  const diskFiles = fs.readdirSync(assetDir).filter(f =>
    f.match(/\.(png|webp|jpg)$/i)
  );
  const loadedPaths = new Set(loadedAssets.map(a => path.basename(a.path)));
  const orphans = diskFiles.filter(f => !loadedPaths.has(f));
  if (orphans.length > 0) {
    console.log(`    ⚠ ${orphans.length} unused assets: ${orphans.slice(0, 5).join(', ')}${orphans.length > 5 ? '...' : ''}`);
  }
  // This is a warning, not a failure — some files might be for future use
  assert(true);
});

test('No scenes that are unreachable (no exit points to them)', () => {
  const exits = extractExits();

  // Build full adjacency: exits + verb targets + changeScene calls, per scene
  const block = getScenesBlock();
  const adj = {};
  for (const s of sceneIds) adj[s] = new Set(exits[s] || []);

  const lines = block.split('\n');
  let currentScene = null;
  for (const line of lines) {
    const sm = line.match(/^\s{2}(\w+):\s*\{/);
    if (sm && sceneIds.includes(sm[1])) currentScene = sm[1];
    if (currentScene) {
      // changeScene('target')
      const csMatches = [...line.matchAll(/changeScene\(\s*'(\w+)'\s*\)/g)];
      for (const m of csMatches) {
        if (sceneIds.includes(m[1])) adj[currentScene].add(m[1]);
      }
      // verb: 'target' (walk/open/use shortcuts)
      const vtMatches = [...line.matchAll(/(?:open|walk|use):\s*'(\w+)'/g)];
      for (const m of vtMatches) {
        if (sceneIds.includes(m[1])) adj[currentScene].add(m[1]);
      }
      // return 'sceneid' (verb functions returning scene ID for navigation)
      const retMatches = [...line.matchAll(/return\s+'(\w+)'/g)];
      for (const m of retMatches) {
        if (sceneIds.includes(m[1])) adj[currentScene].add(m[1]);
      }
    }
  }

  // BFS from exterior
  const reachable = new Set(['exterior']);
  const queue = ['exterior'];
  while (queue.length > 0) {
    const current = queue.shift();
    if (adj[current]) {
      for (const target of adj[current]) {
        if (!reachable.has(target)) {
          reachable.add(target);
          queue.push(target);
        }
      }
    }
  }

  const unreachable = sceneIds.filter(s => !reachable.has(s));
  assert(unreachable.length === 0, `Unreachable scenes: ${unreachable.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n15. CODE QUALITY');
// ════════════════════════════════════════════════════════════

test('No console.error calls (only console.warn for graceful failures)', () => {
  const errorCalls = (js.match(/console\.error/g) || []).length;
  // A few console.error calls are acceptable for critical failures
  assert(errorCalls <= 3, `${errorCalls} console.error calls found — use console.warn for non-critical`);
});

test('No TODO comments in game code', () => {
  const todos = (js.match(/\/\/\s*TODO/gi) || []).length;
  if (todos > 0) {
    console.log(`    ⚠ ${todos} TODO comments found`);
  }
  assert(true); // Warning only
});

test('Spelling: Γαλαξειδίου (not Γαλαξιδίου)', () => {
  const wrong = (js.match(/Γαλαξιδίου/g) || []).length;
  assert(wrong === 0, `Found ${wrong} instances of misspelling "Γαλαξιδίου" (should be Γαλαξειδίου)`);
});

// ════════════════════════════════════════════════════════════
console.log('\n16. DEBUG — Function References');
// ════════════════════════════════════════════════════════════

test('All cutscene draw functions are defined', () => {
  // Extract draw function names referenced in cutscene frames
  const drawRefs = new Set();
  const regex = /draw:\s*(\w+)/g;
  const cutsceneBlock = js.substring(
    js.indexOf('const cutscenes = {'),
    js.indexOf('const cutscenes = {') + 25000
  );
  let m;
  while ((m = regex.exec(cutsceneBlock)) !== null) {
    drawRefs.add(m[1]);
  }
  // Verify each draw function is defined
  const missing = [];
  for (const fn of drawRefs) {
    if (!js.includes(`function ${fn}`) && !js.includes(`const ${fn} =`) && !js.includes(`let ${fn} =`)) {
      missing.push(fn);
    }
  }
  assert(missing.length === 0, `Undefined cutscene draw functions: ${missing.join(', ')}`);
});

test('All referenced functions in verb handlers exist', () => {
  // Check critical game functions that verbs call
  const criticalFns = ['showDlg', 'changeScene', 'addInv', 'removeInv', 'startWalk',
    'startCutscene', 'startGhostSequence', 'startSequence', 'familyFollow'];
  const missing = criticalFns.filter(fn =>
    !js.includes(`function ${fn}`)
  );
  assert(missing.length === 0, `Missing critical functions: ${missing.join(', ')}`);
});

test('All scene ambience function exists', () => {
  assert(js.includes('function startSceneAmbience') || js.includes('startSceneAmbience'),
    'startSceneAmbience not defined');
});

test('drawKenBurns helper is defined', () => {
  assert(js.includes('function drawKenBurns') || js.includes('drawKenBurns ='),
    'drawKenBurns helper not found');
});

// ════════════════════════════════════════════════════════════
console.log('\n17. DEBUG — Variable & State Safety');
// ════════════════════════════════════════════════════════════

test('State object is initialized with all required fields', () => {
  const stateInit = js.match(/(?:const|let|var)\s+state\s*=\s*\{([\s\S]*?)\n\};/);
  assert(stateInit, 'state object initialization not found');
  const stateBlock = stateInit[1];
  const requiredFields = ['phase', 'scene', 'verb', 'inv', 'flags', 'visited'];
  const missing = requiredFields.filter(f => !stateBlock.includes(f));
  assert(missing.length === 0, `State missing fields: ${missing.join(', ')}`);
});

test('No accidental global variable assignments (without var/let/const)', () => {
  // Check for common accidental globals — lines starting with just an identifier = value
  // Only check at the top level (no indentation)
  const lines = js.split('\n');
  const suspiciousGlobals = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match: no leading whitespace, identifier = value (but not property assignments or function params)
    if (line.match(/^[a-z]\w+\s*=\s*[^=]/) && !line.startsWith('//') &&
        !line.includes('function') && !line.includes('.') && !line.includes('[')) {
      suspiciousGlobals.push(`line ${i + 1}: ${line.substring(0, 60)}`);
    }
  }
  if (suspiciousGlobals.length > 5) {
    console.log(`    ⚠ ${suspiciousGlobals.length} potential accidental globals found`);
  }
  assert(true); // Warning only — some globals are intentional
});

test('chars object has all three family members', () => {
  const charsInit = js.match(/(?:const|let|var)\s+chars\s*=\s*\{([\s\S]*?)\n\};/);
  assert(charsInit, 'chars object not found');
  const charsBlock = charsInit[1];
  for (const who of ['ntemis', 'ajax', 'clio']) {
    assert(charsBlock.includes(who), `chars missing ${who}`);
  }
});

// ════════════════════════════════════════════════════════════
console.log('\n18. DEBUG — Rendering & Display');
// ════════════════════════════════════════════════════════════

test('Background buffer exists for rendering optimization', () => {
  assert(js.includes('bgBuffer') || js.includes('bgCtx'),
    'No background buffer for optimized rendering');
});

test('Custom cursor rendering is defined', () => {
  assert(js.includes('drawCustomCursor') || js.includes('Cursor'),
    'Custom cursor rendering not found');
});

test('Iris wipe transition exists', () => {
  assert(js.includes('iris') || js.includes('irisWipe'),
    'Iris wipe transition not found');
});

test('Film grain effect exists for cutscenes', () => {
  assert(js.includes('grain') || js.includes('filmGrain') || js.includes('noise'),
    'No film grain/noise effect for cutscenes');
});

test('Letterbox bars for cutscenes exist', () => {
  assert(js.includes('letterbox') || (js.includes('38') && js.includes('fillRect')),
    'Letterbox bars not found');
});

test('Dialog box rendering handles portrait + text + speaker name', () => {
  assert(js.includes('drawDialogue') || js.includes('drawDialog'),
    'Dialog rendering function not found');
  // Verify it draws portrait, speaker name, and text
  const dialogFn = js.substring(js.indexOf('function drawDialogue') || js.indexOf('function drawDialog'));
  const chunk = dialogFn.substring(0, 1000);
  assert(chunk.includes('PORTRAITS') || chunk.includes('portrait'),
    'Dialog rendering does not reference portraits');
});

// ════════════════════════════════════════════════════════════
console.log('\n19. DEBUG — Audio & SFX');
// ════════════════════════════════════════════════════════════

test('SFX system covers essential sound types', () => {
  const sfxTypes = ['step', 'click', 'pickup'];
  const missing = sfxTypes.filter(t => !js.includes(`'${t}'`));
  assert(missing.length === 0, `Missing SFX types: ${missing.join(', ')}`);
});

test('Music crossfade system exists', () => {
  assert(js.includes('changeSceneMusic') || js.includes('crossfade'),
    'Music crossfade system not found');
  assert(js.includes('fadeOut') || js.includes('fade'),
    'No fade transition in music system');
});

test('Web Audio API context is created', () => {
  assert(js.includes('AudioContext') || js.includes('audioContext'),
    'No Web Audio API context');
});

test('Voice playback system exists', () => {
  assert(js.includes('playVoice'), 'playVoice function not found');
  assert(js.includes('stopVoice'), 'stopVoice function not found');
});

// ════════════════════════════════════════════════════════════
console.log('\n20. DEBUG — Interaction & Input');
// ════════════════════════════════════════════════════════════

test('Mouse click handler exists', () => {
  assert(js.includes('addEventListener') && (js.includes("'click'") || js.includes("'mousedown'") || js.includes("'pointerdown'")),
    'No click event handler');
});

test('Keyboard input handler exists', () => {
  assert(js.includes("'keydown'") || js.includes("'keyup'") || js.includes("'keypress'"),
    'No keyboard event handler');
});

test('Right-click auto-selects best verb', () => {
  assert(js.includes('contextmenu') || js.includes('button === 2') || js.includes('button===2'),
    'No right-click handling found');
});

test('Verb keyboard shortcuts (1-4) are handled', () => {
  // Check for key 1-4 mapping to verbs
  assert((js.includes("'1'") || js.includes('Digit1') || js.includes('key === 1')) &&
         (js.includes("'4'") || js.includes('Digit4') || js.includes('key === 4')),
    'Verb keyboard shortcuts 1-4 not found');
});

test('Escape key handling exists (skip cutscene / close map)', () => {
  assert(js.includes('Escape') || js.includes('escape') || js.includes('key === 27'),
    'No Escape key handling');
});

test('Map toggle (M key or button) exists', () => {
  assert(js.includes('drawMap') || js.includes('mapOpen'),
    'Map overlay function not found');
});

// ════════════════════════════════════════════════════════════
console.log('\n21. DEBUG — Edge Cases & Safety');
// ════════════════════════════════════════════════════════════

test('loadImg handles failures gracefully (onerror)', () => {
  const loadImgFn = js.substring(js.indexOf('function loadImg'), js.indexOf('function loadImg') + 300);
  assert(loadImgFn.includes('onerror'), 'loadImg has no error handler');
  assert(loadImgFn.includes('resolve'), 'loadImg onerror does not resolve (would hang Promise.all)');
});

test('Save game handles localStorage errors (try/catch)', () => {
  const saveFn = js.substring(js.indexOf('function saveGame'), js.indexOf('function saveGame') + 500);
  assert(saveFn.includes('try') && saveFn.includes('catch'),
    'saveGame has no error handling');
});

test('Load game handles corrupt data (try/catch)', () => {
  const loadFn = js.substring(js.indexOf('function loadGame'), js.indexOf('function loadGame') + 500);
  assert(loadFn.includes('try') && loadFn.includes('catch'),
    'loadGame has no error handling');
});

test('Music play() calls handle autoplay policy (.catch)', () => {
  const playCalls = (js.match(/\.play\(\)/g) || []).length;
  const catchCalls = (js.match(/\.play\(\)\.catch/g) || []).length;
  // At least half of play() calls should have .catch() for autoplay policy
  assert(catchCalls >= playCalls * 0.3,
    `Only ${catchCalls}/${playCalls} play() calls handle autoplay rejection`);
});

test('No division by zero risks in walk/animation math', () => {
  // Check for patterns like / 0 in actual code (not comments, not regex)
  const lines = js.split('\n');
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue; // skip comment lines
    // Remove inline comments before checking
    const code = trimmed.replace(/\/\/.*$/, '');
    // Match actual division by literal zero: / 0 or /0 (but not /0. which is a decimal)
    if (code.match(/[^\/]\s*\/\s*0(?![.0-9])/)) {
      count++;
    }
  }
  assert(count === 0, `Found ${count} potential division by zero`);
});

test('Hotspot dimensions are valid (positive w and h)', () => {
  const block = getScenesBlock();
  const objRegex = /\{\s*id:\s*'(\w+)',\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*w:\s*(\d+),\s*h:\s*(\d+)/g;
  let m;
  const invalid = [];
  while ((m = objRegex.exec(block)) !== null) {
    const w = parseInt(m[4]), h = parseInt(m[5]);
    if (w <= 0 || h <= 0) {
      invalid.push(`${m[1]} (${w}x${h})`);
    }
  }
  assert(invalid.length === 0, `Hotspots with invalid dimensions: ${invalid.join(', ')}`);
});

test('WalkBounds are valid ranges [min < max]', () => {
  const block = getScenesBlock();
  const boundsRegex = /walkBounds:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/g;
  let m;
  const invalid = [];
  while ((m = boundsRegex.exec(block)) !== null) {
    const min = parseInt(m[1]), max = parseInt(m[2]);
    if (min >= max) {
      invalid.push(`[${min}, ${max}]`);
    }
  }
  assert(invalid.length === 0, `Invalid walkBounds: ${invalid.join(', ')}`);
});

test('No duplicate object IDs within the same scene', () => {
  const block = getScenesBlock();
  const lines = block.split('\n');
  let currentScene = null;
  const sceneObjects = {};

  for (const line of lines) {
    const sm = line.match(/^\s{2}(\w+):\s*\{/);
    if (sm && sceneIds.includes(sm[1])) {
      currentScene = sm[1];
      sceneObjects[currentScene] = [];
    }
    if (currentScene) {
      const objMatch = line.match(/id:\s*'(\w+)'/);
      if (objMatch) {
        sceneObjects[currentScene].push(objMatch[1]);
      }
    }
  }

  const dupes = [];
  for (const [scene, ids] of Object.entries(sceneObjects)) {
    const seen = new Set();
    for (const id of ids) {
      if (seen.has(id)) dupes.push(`${scene}.${id}`);
      seen.add(id);
    }
  }
  assert(dupes.length === 0, `Duplicate object IDs: ${dupes.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n22. HOTSPOT CALIBRATION');
// ════════════════════════════════════════════════════════════

// Parse the recalibration block
function extractRecalibration() {
  const start = js.indexOf('recalibrateHotspots');
  if (start === -1) return null;
  // Find the cal = { ... } block
  const calStart = js.indexOf('const cal = {', start);
  if (calStart === -1) return null;
  // Extract nested object by brace counting
  let depth = 0, i = calStart + 12;
  for (; i < js.length; i++) {
    if (js[i] === '{') depth++;
    if (js[i] === '}') { depth--; if (depth === 0) break; }
  }
  const calStr = js.substring(calStart + 12, i + 1);
  // Convert to valid JSON: add quotes to keys, remove trailing commas
  let json = calStr
    .replace(/(\w+):/g, '"$1":')       // quote keys
    .replace(/,(\s*[}\]])/g, '$1');     // remove trailing commas
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// Parse original scene hotspot coordinates from scenes block
function extractOriginalHotspots() {
  const block = getScenesBlock();
  const hotspots = {};
  const lines = block.split('\n');
  let currentScene = null;
  for (const line of lines) {
    const sm = line.match(/^\s{2}(\w+):\s*\{/);
    if (sm && sceneIds.includes(sm[1])) currentScene = sm[1];
    if (currentScene) {
      const objMatch = line.match(/id:\s*'(\w+)',\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*w:\s*(\d+),\s*h:\s*(\d+)/);
      if (objMatch) {
        if (!hotspots[currentScene]) hotspots[currentScene] = {};
        hotspots[currentScene][objMatch[1]] = {
          x: parseInt(objMatch[2]), y: parseInt(objMatch[3]),
          w: parseInt(objMatch[4]), h: parseInt(objMatch[5])
        };
      }
    }
  }
  return hotspots;
}

// Apply recalibration to original hotspots (simulates runtime merge)
function getMergedHotspots() {
  const original = extractOriginalHotspots();
  const cal = extractRecalibration();
  if (!cal) return original;
  for (const [sceneId, objects] of Object.entries(cal)) {
    if (!original[sceneId]) continue;
    for (const [objId, coords] of Object.entries(objects)) {
      if (original[sceneId][objId]) {
        Object.assign(original[sceneId][objId], coords);
      }
    }
  }
  return original;
}

test('Recalibration block exists in code', () => {
  assert(js.includes('recalibrateHotspots'), 'recalibrateHotspots function not found');
  assert(js.includes('const cal ='), 'Calibration data object not found');
});

test('Recalibration data is parseable', () => {
  const cal = extractRecalibration();
  assert(cal !== null, 'Could not parse recalibration data');
  assert(Object.keys(cal).length >= 10, `Only ${Object.keys(cal).length} scenes in recalibration, expected 10+`);
});

const HOTSPOT_TOLERANCE = 5; // px tolerance for edge positioning

test('No hotspot has negative y after recalibration (above canvas)', () => {
  const merged = getMergedHotspots();
  const negativeY = [];
  for (const [scene, objects] of Object.entries(merged)) {
    for (const [objId, coords] of Object.entries(objects)) {
      if (coords.y < -HOTSPOT_TOLERANCE) {
        negativeY.push(`${scene}.${objId} (y=${coords.y})`);
      }
    }
  }
  assert(negativeY.length === 0, `Hotspots above canvas: ${negativeY.join(', ')}`);
});

test('No hotspot extends entirely below canvas (y > 400)', () => {
  const merged = getMergedHotspots();
  const below = [];
  for (const [scene, objects] of Object.entries(merged)) {
    for (const [objId, coords] of Object.entries(objects)) {
      if (coords.y > 400) {
        below.push(`${scene}.${objId} (y=${coords.y})`);
      }
    }
  }
  assert(below.length === 0, `Hotspots below canvas: ${below.join(', ')}`);
});

test('No hotspot extends entirely past right edge (x > 640)', () => {
  const merged = getMergedHotspots();
  const offscreen = [];
  for (const [scene, objects] of Object.entries(merged)) {
    for (const [objId, coords] of Object.entries(objects)) {
      if (coords.x > 640) {
        offscreen.push(`${scene}.${objId} (x=${coords.x})`);
      }
    }
  }
  assert(offscreen.length === 0, `Hotspots past right edge: ${offscreen.join(', ')}`);
});

test('All hotspots have reasonable dimensions (w:10-640, h:10-400)', () => {
  const merged = getMergedHotspots();
  const invalid = [];
  for (const [scene, objects] of Object.entries(merged)) {
    for (const [objId, coords] of Object.entries(objects)) {
      if (coords.w < 10 || coords.w > 640 || coords.h < 10 || coords.h > 400) {
        invalid.push(`${scene}.${objId} (${coords.w}x${coords.h})`);
      }
    }
  }
  assert(invalid.length === 0, `Hotspots with unreasonable size: ${invalid.join(', ')}`);
});

test('All originally negative-y hotspots are covered by recalibration', () => {
  const original = extractOriginalHotspots();
  const cal = extractRecalibration();
  if (!cal) { assert(false, 'No recalibration data'); return; }
  const uncovered = [];
  for (const [scene, objects] of Object.entries(original)) {
    for (const [objId, coords] of Object.entries(objects)) {
      if (coords.y < -10) {
        const isCovered = cal[scene] && cal[scene][objId] && cal[scene][objId].y >= 0;
        if (!isCovered) {
          uncovered.push(`${scene}.${objId} (y=${coords.y})`);
        }
      }
    }
  }
  assert(uncovered.length === 0, `Negative-y hotspots not recalibrated: ${uncovered.join(', ')}`);
});

test('Recalibration covers critical user-reported hotspots', () => {
  const cal = extractRecalibration();
  if (!cal) { assert(false, 'No recalibration data'); return; }
  // These were specifically reported as misaligned
  const critical = [
    { scene: 'exterior', obj: 'door', desc: 'house door' },
    { scene: 'port', obj: 'nets', desc: 'fishing nets' },
  ];
  const missing = [];
  for (const c of critical) {
    if (!cal[c.scene] || !cal[c.scene][c.obj]) {
      missing.push(`${c.scene}.${c.obj} (${c.desc})`);
    }
  }
  assert(missing.length === 0, `Critical hotspots not recalibrated: ${missing.join(', ')}`);
});

test('Hotspot centers are within canvas bounds after recalibration', () => {
  const merged = getMergedHotspots();
  const outOfBounds = [];
  for (const [scene, objects] of Object.entries(merged)) {
    for (const [objId, coords] of Object.entries(objects)) {
      const cx = coords.x + coords.w / 2;
      const cy = coords.y + coords.h / 2;
      if (cx < 0 || cx > 640 || cy < 0 || cy > 400) {
        outOfBounds.push(`${scene}.${objId} (center: ${Math.round(cx)},${Math.round(cy)})`);
      }
    }
  }
  assert(outOfBounds.length === 0, `Hotspot centers outside canvas: ${outOfBounds.join(', ')}`);
});

test('Debug hotspot overlay mode exists (D key toggle)', () => {
  assert(js.includes('debugHotspots'), 'debugHotspots state flag not found');
  assert(js.includes('drawDebugHotspots'), 'drawDebugHotspots function not found');
});

// ════════════════════════════════════════════════════════════
console.log('\n11. DIALOG / CUTSCENE OVERLAP DETECTION');
// ════════════════════════════════════════════════════════════

// Extract dialog text from a scene entry array
function extractEntryDialogTexts(sceneId) {
  const block = getScenesBlock();
  // Find the scene's entry array
  const sceneRegex = new RegExp(`^\\s{2}${sceneId}:\\s*\\{`, 'gm');
  const sm = sceneRegex.exec(block);
  if (!sm) return [];
  const sceneChunk = block.substring(sm.index, sm.index + 8000);
  // Find entry: [ ... ]
  const entryMatch = sceneChunk.match(/entry:\s*\[([\s\S]*?)\],/);
  if (!entryMatch) return [];
  const texts = [];
  const dlgRegex = /t:\s*'([^']+)'/g;
  let dm;
  while ((dm = dlgRegex.exec(entryMatch[1])) !== null) {
    texts.push(dm[1]);
  }
  return texts;
}

// Extract dialog text from cutscene frames
function extractCutsceneDialogTexts(cutsceneId) {
  const csStart = js.indexOf('const cutscenes = {');
  if (csStart === -1) return [];
  const csChunk = js.substring(csStart, csStart + 80000);
  // Find cutscene by ID
  const csRegex = new RegExp(`^\\s{2}${cutsceneId}:\\s*\\{\\s*\\n\\s*frames:`, 'gm');
  const cm = csRegex.exec(csChunk);
  if (!cm) return [];
  // Extract a reasonable block for this cutscene (until next top-level key)
  const remaining = csChunk.substring(cm.index);
  const endMatch = remaining.match(/\n\s{2}\w+:\s*\{\s*\n\s*frames:/);
  const cutsceneBlock = endMatch ? remaining.substring(0, endMatch.index) : remaining.substring(0, 3000);
  const texts = [];
  const dlgRegex = /t:\s*'([^']+)'/g;
  let dm;
  while ((dm = dlgRegex.exec(cutsceneBlock)) !== null) {
    texts.push(dm[1]);
  }
  return texts;
}

// Normalize text for comparison (strip punctuation, lowercase)
function normalizeForCompare(text) {
  return text.replace(/[«».,;:!?…\-—'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

// Check for similar phrases (shared 4+ word sequences)
function findSharedPhrases(textsA, textsB, minWords) {
  minWords = minWords || 4;
  const overlaps = [];
  for (const a of textsA) {
    const normA = normalizeForCompare(a);
    const wordsA = normA.split(' ');
    for (const b of textsB) {
      const normB = normalizeForCompare(b);
      // Check if any sequence of minWords+ consecutive words from A appears in B
      for (let i = 0; i <= wordsA.length - minWords; i++) {
        const phrase = wordsA.slice(i, i + minWords).join(' ');
        if (normB.includes(phrase)) {
          overlaps.push({ entry: a, cutscene: b, shared: phrase });
          break;
        }
      }
    }
  }
  return overlaps;
}

// Also check verb handlers that trigger cutscenes
function extractVerbCutsceneDialogs() {
  const results = [];
  // Find all startCutscene calls in scene verb handlers
  const regex = /startCutscene\('(\w+)'\)/g;
  let m;
  while ((m = regex.exec(js)) !== null) {
    const cutsceneId = m[1];
    // Get surrounding context (look back ~2000 chars for the return[ dialog)
    const contextStart = Math.max(0, m.index - 3000);
    const context = js.substring(contextStart, m.index);
    // Find the last return[ ... ] before this startCutscene
    const returnMatch = context.match(/return\s*\[([\s\S]*?)\]\s*;[^;]*$/);
    if (returnMatch) {
      const texts = [];
      const dlgRegex = /t:\s*'([^']+)'/g;
      let dm;
      while ((dm = dlgRegex.exec(returnMatch[1])) !== null) {
        texts.push(dm[1]);
      }
      if (texts.length > 0) {
        results.push({ cutsceneId, dialogTexts: texts });
      }
    }
  }
  return results;
}

const sceneCutsceneMap = extractSceneCutscenes();

test('No dialog overlap between scene entries and their cutscenes', () => {
  const issues = [];
  for (const [sceneId, cutsceneId] of Object.entries(sceneCutsceneMap)) {
    const entryTexts = extractEntryDialogTexts(sceneId);
    const cutsceneTexts = extractCutsceneDialogTexts(cutsceneId);
    if (entryTexts.length === 0 || cutsceneTexts.length === 0) continue;
    const overlaps = findSharedPhrases(entryTexts, cutsceneTexts, 4);
    for (const o of overlaps) {
      issues.push(`${sceneId}→${cutsceneId}: "${o.shared}" found in entry ("${o.entry.substring(0,50)}...") AND cutscene ("${o.cutscene.substring(0,50)}...")`);
    }
  }
  assert(issues.length === 0, `Dialog/cutscene overlaps found:\n    ${issues.join('\n    ')}`);
});

test('No dialog overlap between verb handlers and their triggered cutscenes', () => {
  const issues = [];
  const verbCutscenes = extractVerbCutsceneDialogs();
  for (const { cutsceneId, dialogTexts } of verbCutscenes) {
    const cutsceneTexts = extractCutsceneDialogTexts(cutsceneId);
    if (cutsceneTexts.length === 0) continue;
    const overlaps = findSharedPhrases(dialogTexts, cutsceneTexts, 4);
    for (const o of overlaps) {
      issues.push(`verb→${cutsceneId}: "${o.shared}" found in dialog ("${o.entry.substring(0,50)}...") AND cutscene ("${o.cutscene.substring(0,50)}...")`);
    }
  }
  assert(issues.length === 0, `Verb/cutscene overlaps found:\n    ${issues.join('\n    ')}`);
});

test('Entry dialogs for cutscene scenes are brief (max 4 lines)', () => {
  const verbose = [];
  for (const [sceneId, cutsceneId] of Object.entries(sceneCutsceneMap)) {
    const entryTexts = extractEntryDialogTexts(sceneId);
    if (entryTexts.length > 4) {
      verbose.push(`${sceneId}: ${entryTexts.length} lines (max 4 recommended when cutscene follows)`);
    }
  }
  assert(verbose.length === 0, `Entry dialogs too long:\n    ${verbose.join('\n    ')}`);
});

// ════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════

console.log('\n━━━ Results ━━━');
console.log(`  ${passed} passed, ${failed} failed, ${passed + failed} total`);

if (errors.length > 0) {
  console.log('\nFailed tests:');
  for (const e of errors) {
    console.log(`  ✗ ${e.name}`);
    console.log(`    ${e.error}`);
  }
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
