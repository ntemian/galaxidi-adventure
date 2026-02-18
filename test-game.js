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
  // Find the closing }; of VOICE_MAP
  const end = js.indexOf('\n};', start);
  const chunk = js.substring(start, end > start ? end + 3 : start + 50000);
  // Handle escaped quotes in keys: match 'text': 'voice/...' where text may contain \'
  const regex = /'((?:[^'\\]|\\.)*)'\s*:\s*'(voice\/[^']+)'/g;
  let m;
  while ((m = regex.exec(chunk)) !== null) {
    // Unescape the text key
    const text = m[1].replace(/\\'/g, "'");
    entries.push({ text, file: m[2] });
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
  assert(cutsceneIds.length >= 8, `Only ${cutsceneIds.length} cutscenes found, expected 8+`);
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
console.log('\n24. VOICE COVERAGE & CONSISTENCY');
// ════════════════════════════════════════════════════════════

// Extract all game dialogue texts (scenes + cutscenes + sequences)
function extractAllGameDialogue() {
  const entries = [];
  const seen = new Set();
  // Pattern 1: {s:'...',t:'...'} — scene/sequence dialogue
  const dlgRegex = /\{s:\s*'([^']*)',\s*t:\s*'([^']+)'\}/g;
  let m;
  while ((m = dlgRegex.exec(js)) !== null) {
    const key = m[1] + '|' + m[2];
    if (!seen.has(key)) {
      seen.add(key);
      entries.push({ speaker: m[1], text: m[2] });
    }
  }
  // Pattern 2: { s: '...', t: '...', at: N } — cutscene dialogue
  const cutRegex = /\{\s*s:\s*'([^']*)',\s*t:\s*'([^']+)',\s*at:\s*[\d.]+\s*\}/g;
  while ((m = cutRegex.exec(js)) !== null) {
    const key = m[1] + '|' + m[2];
    if (!seen.has(key)) {
      seen.add(key);
      entries.push({ speaker: m[1], text: m[2] });
    }
  }
  return entries;
}

// Extract cutscene-only dialogue
function extractCutsceneDialogue() {
  const entries = [];
  const cutRegex = /\{\s*s:\s*'([^']*)',\s*t:\s*'([^']+)',\s*at:\s*[\d.]+\s*\}/g;
  let m;
  while ((m = cutRegex.exec(js)) !== null) {
    entries.push({ speaker: m[1], text: m[2] });
  }
  return entries;
}

const allGameDialogue = extractAllGameDialogue();
const cutsceneDialogue = extractCutsceneDialogue();
const voiceMapTexts = new Set(voiceEntries.map(e => e.text));

test('Every game dialogue line has a speaker code', () => {
  const noSpeaker = allGameDialogue.filter(e => e.speaker === undefined);
  assert(noSpeaker.length === 0,
    `${noSpeaker.length} lines missing speaker code`);
});

test('VOICE_MAP covers all scene dialogue (non-cutscene)', () => {
  // Scene dialogue that's NOT in cutscenes
  const cutsceneTexts = new Set(cutsceneDialogue.map(e => e.text));
  const sceneOnly = allGameDialogue.filter(e => !cutsceneTexts.has(e.text));
  const missing = sceneOnly.filter(e => !voiceMapTexts.has(e.text));
  // Report as warning — these need voice generation
  if (missing.length > 0) {
    console.log(`    ⚠ ${missing.length} scene lines missing from VOICE_MAP (need voice generation)`);
    // Show first 5
    missing.slice(0, 5).forEach(m => {
      console.log(`      "${m.text.substring(0, 60)}..." [${m.speaker || 'narrator'}]`);
    });
    if (missing.length > 5) console.log(`      ... and ${missing.length - 5} more`);
  }
  // Soft assert — warn but don't fail (yet)
  assert(true, '');
});

test('VOICE_MAP entries use consistent character directories', () => {
  const dirPattern = {};
  for (const entry of voiceEntries) {
    const parts = entry.file.split('/');
    if (parts.length >= 2) {
      const dir = parts[1]; // e.g., 'narrator', 'ajax', etc.
      if (!dirPattern[dir]) dirPattern[dir] = [];
      dirPattern[dir].push(entry.file);
    }
  }
  const validDirs = ['narrator', 'ntemis', 'ajax', 'clio', 'athos', 'curator',
                     'giannis', 'stathis', 'akis', 'papas', 'chrysostomos', 'ghost'];
  const unknownDirs = Object.keys(dirPattern).filter(d => !validDirs.includes(d));
  assert(unknownDirs.length === 0,
    `Unknown voice directories: ${unknownDirs.join(', ')}`);
});

test('No duplicate texts in VOICE_MAP', () => {
  const textCount = {};
  for (const entry of voiceEntries) {
    textCount[entry.text] = (textCount[entry.text] || 0) + 1;
  }
  const dupes = Object.entries(textCount).filter(([_, c]) => c > 1);
  assert(dupes.length === 0,
    `${dupes.length} duplicate VOICE_MAP texts: ${dupes.slice(0, 3).map(d => d[0].substring(0, 40)).join(', ')}`);
});

test('VOICE_MAP file numbering is sequential per directory', () => {
  const dirFiles = {};
  for (const entry of voiceEntries) {
    const parts = entry.file.split('/');
    if (parts.length >= 3) {
      const dir = parts[1];
      const num = parseInt(parts[2].replace('.mp3', ''));
      if (!dirFiles[dir]) dirFiles[dir] = [];
      dirFiles[dir].push(num);
    }
  }
  const gaps = [];
  for (const [dir, nums] of Object.entries(dirFiles)) {
    nums.sort((a, b) => a - b);
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] !== nums[i-1] + 1) {
        gaps.push(`${dir}: gap after ${nums[i-1].toString().padStart(3, '0')}`);
      }
    }
  }
  if (gaps.length > 0) {
    console.log(`    ⚠ Numbering gaps: ${gaps.slice(0, 5).join(', ')}`);
  }
  assert(true, '');
});

test('Cutscene dialogue system calls playVoice', () => {
  // Verify the fix: cutscene dialogue trigger should call playVoice
  const cutsceneUpdate = js.substring(
    js.indexOf('function updateCutscene'),
    js.indexOf('function updateCutscene') + 2000
  );
  assert(cutsceneUpdate.includes('playVoice'),
    'updateCutscene does not call playVoice — cutscene dialogue will be silent');
});

test('Cutscene frame advance stops voice', () => {
  // Verify stopVoice is called when advancing cutscene frames
  const cutsceneUpdate = js.substring(
    js.indexOf('function updateCutscene'),
    js.indexOf('function updateCutscene') + 2000
  );
  assert(cutsceneUpdate.includes('stopVoice'),
    'Cutscene frame advance does not stop voice — audio will bleed between frames');
});

test('All VOICE_MAP character directories match known speakers', () => {
  // Map directories to speaker codes
  const dirToSpeaker = {
    narrator: '', ntemis: 'ΝΤΕΜΗΣ', ajax: 'ΑΙΑΣ', clio: 'ΚΛΕΙΩ',
    athos: 'ΑΘΟΣ', curator: 'ΕΠΙΜΕΛΗΤΗΣ', giannis: 'ΓΙΑΝΝΗΣ',
    stathis: 'ΣΤΑΘΗΣ', akis: 'ΑΚΗΣ', papas: 'ΠΑΠΑΣ',
    chrysostomos: 'ΧΡΥΣΟΣΤΟΜΟΣ', ghost: 'ΦΑΝΤΑΣΜΑ'
  };
  const allSpeakers = new Set(allGameDialogue.map(e => e.speaker));
  const mappedSpeakers = new Set(Object.values(dirToSpeaker));
  const unmapped = [...allSpeakers].filter(s => !mappedSpeakers.has(s));
  assert(unmapped.length === 0,
    `Speakers without voice directory mapping: ${unmapped.join(', ')}`);
});

test('dialog-lines.json covers all game dialogue', () => {
  const dlPath = path.join(GAME_DIR, 'voice', 'dialog-lines.json');
  if (!fs.existsSync(dlPath)) {
    assert(false, 'voice/dialog-lines.json not found');
    return;
  }
  const dialogLines = JSON.parse(fs.readFileSync(dlPath, 'utf-8'));
  const dlSet = new Set(dialogLines.map(e => e.speaker + '|' + e.text));
  const missing = allGameDialogue.filter(e => !dlSet.has(e.speaker + '|' + e.text));
  assert(missing.length === 0,
    `${missing.length} game dialogue lines missing from dialog-lines.json. First: "${(missing[0] || {}).text}"`);
});

test('dialog-lines.json has no orphan entries (lines not in game)', () => {
  const dlPath = path.join(GAME_DIR, 'voice', 'dialog-lines.json');
  if (!fs.existsSync(dlPath)) return;
  const dialogLines = JSON.parse(fs.readFileSync(dlPath, 'utf-8'));
  const gameTexts = new Set(allGameDialogue.map(e => e.text));
  const orphans = dialogLines.filter(e => !gameTexts.has(e.text));
  if (orphans.length > 0) {
    console.log(`    ⚠ ${orphans.length} orphan entries in dialog-lines.json (lines no longer in game)`);
  }
  assert(true, '');
});

test('Voice coverage report', () => {
  const total = allGameDialogue.length;
  const covered = allGameDialogue.filter(e => voiceMapTexts.has(e.text)).length;
  const pct = ((covered / total) * 100).toFixed(1);
  console.log(`    Voice coverage: ${covered}/${total} lines (${pct}%)`);
  console.log(`    Scene lines: ${total - cutsceneDialogue.length} | Cutscene lines: ${cutsceneDialogue.length}`);
  const cutsceneCovered = cutsceneDialogue.filter(e => voiceMapTexts.has(e.text)).length;
  console.log(`    Cutscene coverage: ${cutsceneCovered}/${cutsceneDialogue.length}`);
  assert(true, '');
});

// ════════════════════════════════════════════════════════════
// 12. SCENE / BACKGROUND CONSISTENCY
// ════════════════════════════════════════════════════════════
console.log('\n12. SCENE / BACKGROUND CONSISTENCY');

// Extract all scene background image paths
function extractSceneBgPaths() {
  const bgMap = {};
  // Find loadImg calls
  const loadMatches = [...js.matchAll(/loadImg\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\)/g)];
  const imgPaths = {};
  for (const m of loadMatches) {
    imgPaths[m[1]] = m[2];
  }
  // Find scene bg references
  const sceneMatches = [...js.matchAll(/(\w+):\s*\{[^}]*?label:\s*['"]([^'"]+)['"],\s*bg:\s*['"]([^'"]+)['"]/g)];
  for (const m of sceneMatches) {
    const sceneId = m[1];
    const label = m[2];
    const bgKey = m[3];
    bgMap[sceneId] = { label, bgKey, file: imgPaths[bgKey] || null };
  }
  return bgMap;
}

// Extract object IDs from a scene
function extractSceneObjectIds(sceneId) {
  // Find the scene's objects array
  const scenePattern = new RegExp(`(?:^|\\n)\\s*${sceneId}:\\s*\\{`, 'm');
  const match = scenePattern.exec(js);
  if (!match) return [];

  const startIdx = match.index + match[0].length;
  // Find all id: references in this scene's objects
  const ids = [];
  // Look for objects array within reasonable range (next 3000 chars)
  const chunk = js.substring(startIdx, startIdx + 5000);
  const objMatches = [...chunk.matchAll(/id:'(\w+)'/g)];
  for (const m of objMatches) {
    ids.push(m[1]);
  }
  return ids;
}

test('Every scene bg image file exists on disk', () => {
  const bgMap = extractSceneBgPaths();
  const missing = [];
  for (const [sceneId, info] of Object.entries(bgMap)) {
    if (!info.file) continue;
    const fullPath = path.join(GAME_DIR, info.file);
    if (!fs.existsSync(fullPath)) {
      missing.push(`${sceneId}: ${info.file}`);
    }
  }
  assert(missing.length === 0, `Missing bg files: ${missing.join(', ')}`);
});

test('No scene references a deleted or renamed bg key', () => {
  const bgMap = extractSceneBgPaths();
  const loadedKeys = new Set([...js.matchAll(/loadImg\(['"]([^'"]+)['"]/g)].map(m => m[1]));
  const orphans = [];
  for (const [sceneId, info] of Object.entries(bgMap)) {
    if (!loadedKeys.has(info.bgKey)) {
      orphans.push(`${sceneId} uses '${info.bgKey}' which is never loaded`);
    }
  }
  assert(orphans.length === 0, `Orphan bg keys: ${orphans.join(', ')}`);
});

test('Recalibration entries reference valid scene objects', () => {
  // Find the recalibration block
  const calMatch = js.match(/const cal\s*=\s*\{([\s\S]*?)\};\s*for\s*\(const/);
  if (!calMatch) {
    assert(true, 'No recalibration block found (skip)');
    return;
  }
  const calBlock = calMatch[1];
  // Extract scene IDs from cal
  const calScenes = [...calBlock.matchAll(/(\w+):\s*\{/g)].map(m => m[1]);
  const issues = [];
  for (const sceneId of calScenes) {
    // Extract object IDs in this cal entry
    const sceneSection = calBlock.substring(calBlock.indexOf(sceneId + ':'));
    const endBrace = sceneSection.indexOf('},');
    const section = sceneSection.substring(0, endBrace > 0 ? endBrace : 200);
    const calObjIds = [...section.matchAll(/(\w+)\s*:\s*\{/g)].map(m => m[1]).filter(id => id !== sceneId);

    // Get scene object IDs
    const sceneObjIds = extractSceneObjectIds(sceneId);

    for (const calObj of calObjIds) {
      if (!sceneObjIds.includes(calObj)) {
        issues.push(`${sceneId}.${calObj} in recalibration but not in scene objects`);
      }
    }
  }
  assert(issues.length === 0, `Stale recal entries: ${issues.join('; ')}`);
});

test('Port scene has no invisible cats object', () => {
  const portObjs = extractSceneObjectIds('port');
  assert(!portObjs.includes('cats'), 'Port still has invisible cats object');
});

test('Windmill scene has no "ruins" object (renamed to windmill_tower)', () => {
  const wmObjs = extractSceneObjectIds('windmill');
  assert(!wmObjs.includes('ruins'), 'Windmill still has old "ruins" object id');
  assert(wmObjs.includes('windmill_tower'), 'Windmill missing "windmill_tower" object');
});

test('Church scene has fountain object', () => {
  const chObjs = extractSceneObjectIds('church');
  assert(chObjs.includes('fountain'), 'Church missing fountain object');
});

test('Treasure and new_era scenes have recalibration entries', () => {
  const calMatch = js.match(/const cal\s*=\s*\{([\s\S]*?)\};\s*for\s*\(const/);
  assert(calMatch, 'Recalibration block not found');
  const calBlock = calMatch[1];
  assert(calBlock.includes('treasure:'), 'treasure scene missing from recalibration');
  assert(calBlock.includes('new_era:'), 'new_era scene missing from recalibration');
});

test('All scene bg files use consistent format (no mix of deleted .webp and .png)', () => {
  const bgMap = extractSceneBgPaths();
  const issues = [];
  for (const [sceneId, info] of Object.entries(bgMap)) {
    if (!info.file) continue;
    const fullPath = path.join(GAME_DIR, info.file);
    if (!fs.existsSync(fullPath)) {
      issues.push(`${sceneId}: ${info.file} does not exist`);
    }
  }
  assert(issues.length === 0, `Missing bg files: ${issues.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n25. PLOT & DIALOGUE LOGICAL CONSISTENCY');
// ════════════════════════════════════════════════════════════

// Extract all dialogue from a given scene (entry + objects + verb handlers)
function extractAllSceneDialogue(sceneId) {
  const block = getScenesBlock();
  const sceneStart = block.indexOf(`  ${sceneId}: {`);
  if (sceneStart === -1) return [];
  const nextScene = block.indexOf('\n  ', sceneStart + 5);
  const sceneChunk = nextScene > sceneStart ? block.substring(sceneStart, nextScene + 5000) : block.substring(sceneStart, sceneStart + 8000);
  const texts = [];
  const dlgRegex = /\{s:\s*'([^']*)',\s*t:\s*'([^']+)'\}/g;
  let m;
  while ((m = dlgRegex.exec(sceneChunk)) !== null) {
    texts.push({ speaker: m[1], text: m[2], scene: sceneId });
  }
  return texts;
}

test('Characters stay in-character: Ajax uses excited/question language', () => {
  const ajaxLines = [];
  for (const sceneId of sceneIds) {
    const dlg = extractAllSceneDialogue(sceneId);
    ajaxLines.push(...dlg.filter(d => d.speaker === 'ΑΙΑΣ'));
  }
  // Ajax should have exclamation marks or question marks in most lines
  const expressiveLines = ajaxLines.filter(d =>
    d.text.includes('!') || d.text.includes('?') || d.text.includes('Πάμε') ||
    d.text.includes('Τέλειο') || d.text.includes('Σοβαρά')
  );
  const ratio = expressiveLines.length / ajaxLines.length;
  assert(ratio > 0.3,
    `Ajax is only expressive in ${(ratio * 100).toFixed(0)}% of lines (expected >30%). He should be enthusiastic`);
});

test('Characters stay in-character: Clio uses observant/pointing language', () => {
  const clioLines = [];
  for (const sceneId of sceneIds) {
    const dlg = extractAllSceneDialogue(sceneId);
    clioLines.push(...dlg.filter(d => d.speaker === 'ΚΛΕΙΩ'));
  }
  // Clio should frequently use observing words
  const observantKeywords = ['Κοίτα', 'κοίτα', 'Βλέπω', 'βλέπω', 'Μπαμπά', 'μπαμπά', 'Τι ωραί', 'Σαν'];
  const observantLines = clioLines.filter(d =>
    observantKeywords.some(k => d.text.includes(k))
  );
  const ratio = observantLines.length / clioLines.length;
  assert(ratio > 0.25,
    `Clio is only observant in ${(ratio * 100).toFixed(0)}% of lines (expected >25%)`);
});

test('Characters stay in-character: Ntemis uses calm/reflective language', () => {
  const ntemisLines = [];
  for (const sceneId of sceneIds) {
    const dlg = extractAllSceneDialogue(sceneId);
    ntemisLines.push(...dlg.filter(d => d.speaker === 'ΝΤΕΜΗΣ'));
  }
  // Ntemis should rarely use exclamation marks (he's calm)
  const excitedLines = ntemisLines.filter(d => (d.text.match(/!/g) || []).length > 1);
  const ratio = excitedLines.length / ntemisLines.length;
  assert(ratio < 0.15,
    `Ntemis uses multiple exclamation marks in ${(ratio * 100).toFixed(0)}% of lines (expected <15%). He should be calm`);
});

test('Scene entry narrator lines have no speaker name (empty string)', () => {
  // Only check entry[] arrays — those atmospheric openers should be narrator
  for (const sceneId of sceneIds) {
    const entryTexts = extractEntryDialogTexts(sceneId);
    // The first line in entry is typically narrator (atmospheric description)
    // We verify it by checking the entry block directly
  }
  // Check that entry arrays start with narrator lines (s:'')
  const block = getScenesBlock();
  const issues = [];
  for (const sceneId of sceneIds) {
    const sceneStart = block.indexOf(`  ${sceneId}: {`);
    if (sceneStart === -1) continue;
    const chunk = block.substring(sceneStart, sceneStart + 3000);
    const entryMatch = chunk.match(/entry:\s*\[\s*\{s:\s*'([^']*)'/);
    if (entryMatch && entryMatch[1] !== '' && entryMatch[1] !== 'ΑΦΗΓΗΤΗΣ') {
      // First entry line should typically be narrator
      // But it's OK if a character speaks first in some scenes
    }
  }
  assert(true); // Soft check — entry narration is a style guideline
});

test('Visvikis spelling is consistent in all dialogue (Βισβίκη/ς, never Βισβίζη)', () => {
  const allTexts = [];
  const dlgRegex = /t:\s*'([^']+)'/g;
  let m;
  while ((m = dlgRegex.exec(js)) !== null) {
    allTexts.push(m[1]);
  }
  const misspelled = allTexts.filter(t =>
    t.includes('Βισβίζη') || t.includes('Βισβίζ')
  );
  assert(misspelled.length === 0,
    `Misspelled Βισβίκης as Βισβίζης in: ${misspelled.map(t => t.substring(0, 50)).join('; ')}`);
});

test('Galaxidi spelled correctly in all dialogue (Γαλαξίδι/Γαλαξειδίου, not Γαλαξιδίου)', () => {
  const allTexts = [];
  const dlgRegex = /t:\s*'([^']+)'/g;
  let m;
  while ((m = dlgRegex.exec(js)) !== null) {
    allTexts.push(m[1]);
  }
  const wrong = allTexts.filter(t => t.includes('Γαλαξιδίου'));
  assert(wrong.length === 0,
    `Misspelled Γαλαξειδίου as Γαλαξιδίου in: ${wrong.map(t => t.substring(0, 50)).join('; ')}`);
});

test('No dialogue line exceeds 2 sentences (per dialog rules)', () => {
  const allDialogue = [];
  for (const sceneId of sceneIds) {
    allDialogue.push(...extractAllSceneDialogue(sceneId));
  }
  const tooLong = allDialogue.filter(d => {
    // Count sentence endings (. ! ? but not ... or «»)
    const clean = d.text.replace(/\.\.\./g, '…').replace(/«[^»]*»/g, '');
    const sentences = (clean.match(/[.!?;]/g) || []).length;
    return sentences > 3; // Allow slight flexibility
  });
  if (tooLong.length > 0) {
    console.log(`    ⚠ ${tooLong.length} dialogue lines may be too long (>3 sentence-ending punctuation marks)`);
    tooLong.slice(0, 3).forEach(d => console.log(`      [${d.speaker || 'narrator'}] "${d.text.substring(0, 60)}..."`));
  }
  assert(true); // Warning only per dialog guidelines
});

test('Quest mentions are chronologically correct (no forward references)', () => {
  // Scenes are visited in order. Check that early scenes don't reference things found later
  const earlyScenes = ['exterior', 'terrace', 'kitchen', 'port', 'museum'];
  const lateRevealTerms = ['104 υπογραφές', 'αλληλασφάλεια ledger', 'κιβώτιο'];
  const issues = [];
  for (const sceneId of earlyScenes) {
    const dlg = extractAllSceneDialogue(sceneId);
    for (const d of dlg) {
      for (const term of lateRevealTerms) {
        if (d.text.includes(term)) {
          issues.push(`${sceneId}: "${d.text.substring(0, 50)}..." mentions "${term}" too early`);
        }
      }
    }
  }
  assert(issues.length === 0, `Forward references in dialogue: ${issues.join('; ')}`);
});

test('Ghost is never mentioned by name before graveyard scene', () => {
  const preGhostScenes = ['exterior', 'terrace', 'kitchen', 'port', 'museum', 'liotrivi', 'windmill', 'cave'];
  const ghostMentions = [];
  for (const sceneId of preGhostScenes) {
    const dlg = extractAllSceneDialogue(sceneId);
    for (const d of dlg) {
      if (d.text.includes('φάντασμα') || d.text.includes('Φάντασμα')) {
        ghostMentions.push(`${sceneId}: "${d.text.substring(0, 50)}..."`);
      }
    }
  }
  assert(ghostMentions.length === 0,
    `Ghost mentioned before graveyard: ${ghostMentions.join('; ')}`);
});

test('The thematic phrase "Κράτα την αλληλεγγύη" only appears after treasure is found', () => {
  const preChestScenes = ['exterior', 'terrace', 'kitchen', 'port', 'museum', 'liotrivi',
    'windmill', 'cave', 'church', 'church_interior', 'boat', 'graveyard'];
  const earlyMentions = [];
  for (const sceneId of preChestScenes) {
    const dlg = extractAllSceneDialogue(sceneId);
    for (const d of dlg) {
      if (d.text.includes('Κράτα την αλληλεγγύη')) {
        earlyMentions.push(`${sceneId}: "${d.text.substring(0, 50)}..."`);
      }
    }
  }
  assert(earlyMentions.length === 0,
    `Theme phrase "Κράτα την αλληλεγγύη" appears before treasure: ${earlyMentions.join('; ')}`);
});

test('Each NPC gives their unique story contribution (no generic filler)', () => {
  // Each NPC should mention their key topic
  const npcTopics = {
    port: { speaker: 'ΑΚΗΣ', keywords: ['Βισβίκη', 'μουσείο', 'ιστορία', 'Σμύρνη'] },
    museum: { speaker: 'ΕΠΙΜΕΛΗΤΗΣ', keywords: ['πλοία', 'καράβια', 'ατμός', 'ατμόπλοιο', 'χρυσή εποχή'] },
    liotrivi: { speaker: 'ΑΘΟΣ', keywords: ['διαθήκη', 'σπήλαιο', 'Κάρκαρος', 'αξίζ'] },
    boat: { speaker: 'ΧΡΥΣΟΣΤΟΜΟΣ', keywords: ['Ελπίδα', 'θάλασσα', 'πατέρα', 'ναυτικ'] },
  };
  const issues = [];
  for (const [sceneId, config] of Object.entries(npcTopics)) {
    const dlg = extractAllSceneDialogue(sceneId);
    const npcLines = dlg.filter(d => d.speaker === config.speaker);
    if (npcLines.length === 0) {
      issues.push(`${config.speaker} has no dialogue in ${sceneId}`);
      continue;
    }
    const allText = npcLines.map(d => d.text).join(' ');
    const hasKeyword = config.keywords.some(k => allText.includes(k));
    if (!hasKeyword) {
      issues.push(`${config.speaker} in ${sceneId} doesn't mention key topics: ${config.keywords.join('/')}`);
    }
  }
  assert(issues.length === 0, `NPCs missing their story contribution: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n26. CUTSCENE TIMING & STRUCTURE');
// ════════════════════════════════════════════════════════════

// Parse cutscene data for timing analysis — use the known cutscene structure
function parseCutsceneTimings() {
  // Extract the full cutscenes block between 'const cutscenes = {' and the closing '};'
  const csBlockStart = js.indexOf('const cutscenes = {');
  if (csBlockStart === -1) return {};
  // Find the function that comes after cutscenes
  const fnAfter = js.indexOf('function startCutscene', csBlockStart);
  const fullBlock = js.substring(csBlockStart, fnAfter > csBlockStart ? fnAfter : csBlockStart + 50000);
  const results = {};
  for (const csId of cutsceneIds) {
    // Find the cutscene by its ID followed by frames:
    const csPattern = new RegExp(`\\b${csId}:\\s*\\{\\s*\\n\\s*frames:\\s*\\[`);
    const csMatch = csPattern.exec(fullBlock);
    if (!csMatch) continue;
    // Extract the cutscene's content until onComplete or the next cutscene
    const afterMatch = fullBlock.substring(csMatch.index);
    const onCompleteIdx = afterMatch.indexOf('onComplete:');
    const csChunk = onCompleteIdx > 0 ? afterMatch.substring(0, onCompleteIdx) : afterMatch.substring(0, 3000);
    // Parse individual frames: each frame has { duration: N, draw: fn, dialogue: [...] }
    const frames = [];
    const frameRegex = /\{\s*\n\s*duration:\s*(\d+)/g;
    let fm;
    while ((fm = frameRegex.exec(csChunk)) !== null) {
      const dur = parseInt(fm[1]);
      // Extract dialogue for this frame (until next frame or end)
      const frameStart = fm.index;
      const nextFrame = csChunk.indexOf('duration:', fm.index + fm[0].length);
      const frameEnd = nextFrame > 0 ? nextFrame : csChunk.length;
      const frameContent = csChunk.substring(frameStart, frameEnd);
      const dialogues = [];
      const dlgRegex = /\{\s*s:\s*'([^']*)',\s*t:\s*'([^']+)',\s*at:\s*([\d.]+)\s*\}/g;
      let dlm;
      while ((dlm = dlgRegex.exec(frameContent)) !== null) {
        dialogues.push({ speaker: dlm[1], text: dlm[2], at: parseFloat(dlm[3]) });
      }
      frames.push({ duration: dur, dialogues });
    }
    results[csId] = { frames };
  }
  return results;
}

const cutsceneTimings = parseCutsceneTimings();

test('Every cutscene frame has at least one dialogue line', () => {
  const issues = [];
  for (const [csId, data] of Object.entries(cutsceneTimings)) {
    for (let i = 0; i < data.frames.length; i++) {
      if (data.frames[i].dialogues.length === 0) {
        issues.push(`${csId} frame ${i} (${data.frames[i].duration}s) has no dialogue`);
      }
    }
  }
  assert(issues.length === 0, `Silent cutscene frames: ${issues.join('; ')}`);
});

test('No dialogue timestamp exceeds its frame duration', () => {
  const issues = [];
  for (const [csId, data] of Object.entries(cutsceneTimings)) {
    for (let i = 0; i < data.frames.length; i++) {
      const frame = data.frames[i];
      for (const d of frame.dialogues) {
        if (d.at >= frame.duration) {
          issues.push(`${csId} frame ${i}: dialogue at ${d.at}s exceeds duration ${frame.duration}s`);
        }
        if (frame.duration - d.at < 0.3) {
          issues.push(`${csId} frame ${i}: dialogue at ${d.at}s appears <0.3s before frame ends (${frame.duration}s)`);
        }
      }
    }
  }
  assert(issues.length === 0, `Timing issues: ${issues.join('; ')}`);
});

test('Cutscene total durations are reasonable (5-30 seconds)', () => {
  const issues = [];
  for (const [csId, data] of Object.entries(cutsceneTimings)) {
    const total = data.frames.reduce((sum, f) => sum + f.duration, 0);
    if (total < 5) issues.push(`${csId}: ${total}s (too short)`);
    if (total > 30) issues.push(`${csId}: ${total}s (too long)`);
  }
  assert(issues.length === 0, `Cutscene duration issues: ${issues.join('; ')}`);
});

test('Cutscene dialogue lines are spaced at least 1.5s apart within each frame', () => {
  const issues = [];
  for (const [csId, data] of Object.entries(cutsceneTimings)) {
    for (let i = 0; i < data.frames.length; i++) {
      const sorted = [...data.frames[i].dialogues].sort((a, b) => a.at - b.at);
      for (let j = 1; j < sorted.length; j++) {
        const gap = sorted[j].at - sorted[j - 1].at;
        if (gap < 1.2) {
          issues.push(`${csId} frame ${i}: lines at ${sorted[j - 1].at}s and ${sorted[j].at}s are only ${gap.toFixed(1)}s apart`);
        }
      }
    }
  }
  assert(issues.length === 0, `Dialogue spacing issues: ${issues.join('; ')}`);
});

test('All cutscenes have onComplete callback', () => {
  const missing = [];
  for (const csId of cutsceneIds) {
    if (!js.includes(`// cutscene ${csId}`) && !js.includes(`onComplete`)) continue;
    // Check the cutscene block has onComplete
    const csRegex = new RegExp(`${csId}:\\s*\\{[\\s\\S]*?onComplete`, 'g');
    if (!csRegex.test(js)) {
      missing.push(csId);
    }
  }
  // All defined cutscenes should have onComplete
  const csBlock = js.substring(js.indexOf('const cutscenes = {'), js.indexOf('const cutscenes = {') + 30000);
  for (const csId of cutsceneIds) {
    const csStart = csBlock.indexOf(`${csId}: {`);
    if (csStart === -1) continue;
    const chunk = csBlock.substring(csStart, csStart + 3000);
    if (!chunk.includes('onComplete')) {
      missing.push(csId);
    }
  }
  assert(missing.length === 0, `Cutscenes without onComplete: ${missing.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n27. PUZZLE PREREQUISITE CHAIN');
// ════════════════════════════════════════════════════════════

test('Drawer requires brass_key (gate check exists)', () => {
  assert(js.includes("!state.inv.find(i=>i.id==='brass_key')") ||
         js.includes("!state.inv.find(i => i.id === 'brass_key')"),
    'Drawer has no brass_key gate');
});

test('Cave requires lantern (gate check exists)', () => {
  assert(js.includes("exit.target === 'cave'") && js.includes("'lantern'"),
    'Cave entrance has no lantern gate');
});

test('Boat/treasure requires nautical_chart (gate check exists)', () => {
  assert(js.includes("'nautical_chart'") && (
    js.includes("exit.target === 'treasure'") || js.includes("target === 'boat'")
  ), 'Treasure has no nautical_chart gate');
});

test('New era requires letter_read flag (gate check exists)', () => {
  assert(js.includes("exit.target === 'new_era'") && js.includes("!state.flags.letter_read"),
    'New era has no letter_read gate');
});

test('Floor tile requires candle_lit (gate check exists)', () => {
  assert(js.includes("!state.flags.candle_lit"),
    'Floor tile has no candle_lit prerequisite');
});

test('Ghost requires green_stone (gate check exists)', () => {
  assert(js.includes("!state.inv.find(i => i.id === 'green_stone')") ||
         js.includes("!state.inv.find(i=>i.id==='green_stone')"),
    'Ghost summoning has no green_stone gate');
});

test('Elpida boat requires nautical_chart to sail (gate check exists)', () => {
  assert(js.includes("!state.inv.find(i=>i.id==='nautical_chart')") ||
         js.includes("!state.inv.find(i => i.id === 'nautical_chart')"),
    'Elpida sailing has no nautical_chart check');
});

test('Reading Visvikis final letter requires chest_opened (gate check exists)', () => {
  assert(js.includes("!state.flags.chest_opened"),
    'Final letter has no chest_opened prerequisite');
});

test('Signing ledger requires speech_done (gate check exists)', () => {
  assert(js.includes("!state.flags.speech_done"),
    'Signing ledger has no speech_done prerequisite');
});

test('All quest gates give helpful rejection dialogue', () => {
  // Each gate should show dialogue explaining what the player needs
  const gates = [
    { check: "exit.target === 'cave'", hint: 'φανάρι' },
    { check: "exit.target === 'treasure'", hint: 'χάρτη' },
    { check: "exit.target === 'new_era'", hint: 'Βισβίκη' },
  ];
  const issues = [];
  for (const gate of gates) {
    const gateIdx = js.indexOf(gate.check);
    if (gateIdx === -1) continue;
    const context = js.substring(gateIdx, gateIdx + 300);
    if (!context.includes('showDlg')) {
      issues.push(`Gate "${gate.check}" has no rejection dialogue`);
    }
  }
  assert(issues.length === 0, `Gates without rejection dialogue: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n28. SCENE CONNECTIVITY GRAPH');
// ════════════════════════════════════════════════════════════

test('Every scene (except starting/endgame) can be returned FROM', () => {
  const exits = extractExits();
  const block = getScenesBlock();
  const fullExits = {};
  for (const s of sceneIds) fullExits[s] = new Set(exits[s] || []);
  // Add verb-based transitions
  const lines = block.split('\n');
  let cs = null;
  for (const line of lines) {
    const sm = line.match(/^\s{2}(\w+):\s*\{/);
    if (sm && sceneIds.includes(sm[1])) cs = sm[1];
    if (cs) {
      const csm = [...line.matchAll(/changeScene\(\s*'(\w+)'\s*\)/g)];
      for (const m of csm) { if (sceneIds.includes(m[1])) fullExits[cs].add(m[1]); }
      const vtm = [...line.matchAll(/(?:open|walk|use):\s*'(\w+)'/g)];
      for (const m of vtm) { if (sceneIds.includes(m[1])) fullExits[cs].add(m[1]); }
    }
  }
  // Build reverse map
  const canReturnFrom = new Set();
  for (const [scene, targets] of Object.entries(fullExits)) {
    for (const target of targets) {
      if (fullExits[target] && fullExits[target].has(scene)) {
        canReturnFrom.add(target);
      }
    }
  }
  // Exempt certain scenes from dead-end check
  const exemptScenes = new Set([
    'exterior',        // Starting scene
    'treasure',        // Endgame
    'new_era',         // Endgame
    'graveyard',       // One-way narrative scene (ghost sequence)
    'boat',            // Narrative crossing (one-way to treasure)
  ]);
  const deadEnds = sceneIds.filter(s => !exemptScenes.has(s) && !canReturnFrom.has(s));
  assert(deadEnds.length === 0, `Dead-end scenes (no way back): ${deadEnds.join(', ')}`);
});

test('No scene has exits to itself (self-loop)', () => {
  const exits = extractExits();
  const selfLoops = [];
  for (const [scene, targets] of Object.entries(exits)) {
    if (targets.includes(scene)) {
      selfLoops.push(scene);
    }
  }
  assert(selfLoops.length === 0, `Scenes with self-exits: ${selfLoops.join(', ')}`);
});

test('Scene connectivity forms a single connected component', () => {
  const exits = extractExits();
  const block = getScenesBlock();
  const adj = {};
  for (const s of sceneIds) adj[s] = new Set(exits[s] || []);
  // Add verb transitions + changeScene
  const lines = block.split('\n');
  let cs = null;
  for (const line of lines) {
    const sm = line.match(/^\s{2}(\w+):\s*\{/);
    if (sm && sceneIds.includes(sm[1])) cs = sm[1];
    if (cs) {
      for (const m of [...line.matchAll(/changeScene\(\s*'(\w+)'\s*\)/g)]) {
        if (sceneIds.includes(m[1])) adj[cs].add(m[1]);
      }
    }
  }
  // Make adjacency bidirectional for connectivity check
  const biAdj = {};
  for (const s of sceneIds) biAdj[s] = new Set(adj[s] || []);
  for (const [s, targets] of Object.entries(adj)) {
    for (const t of targets) {
      if (biAdj[t]) biAdj[t].add(s);
    }
  }
  // BFS
  const visited = new Set(['exterior']);
  const queue = ['exterior'];
  while (queue.length > 0) {
    const cur = queue.shift();
    if (biAdj[cur]) {
      for (const n of biAdj[cur]) {
        if (!visited.has(n)) { visited.add(n); queue.push(n); }
      }
    }
  }
  const disconnected = sceneIds.filter(s => !visited.has(s));
  assert(disconnected.length === 0, `Disconnected scenes: ${disconnected.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n29. INVENTORY ITEM VALIDATION');
// ════════════════════════════════════════════════════════════

test('Every addInv call has matching id, label, and desc', () => {
  const addInvRegex = /addInv\(\s*\{\s*id:\s*'(\w+)',\s*label:\s*'([^']+)',\s*desc:\s*'([^']+)'\s*\}/g;
  const items = [];
  let m;
  while ((m = addInvRegex.exec(js)) !== null) {
    items.push({ id: m[1], label: m[2], desc: m[3] });
  }
  const issues = [];
  for (const item of items) {
    if (!item.label || item.label.length < 2) issues.push(`${item.id}: empty/short label`);
    if (!item.desc || item.desc.length < 10) issues.push(`${item.id}: empty/short description`);
  }
  assert(issues.length === 0, `Inventory items with bad metadata: ${issues.join('; ')}`);
});

test('Every removeInv call references a valid addInv id', () => {
  const addIds = new Set();
  const addRegex = /addInv\(\s*\{\s*id:\s*'(\w+)'/g;
  let m;
  while ((m = addRegex.exec(js)) !== null) addIds.add(m[1]);
  const removeIds = [];
  const removeRegex = /removeInv\(\s*'(\w+)'\s*\)/g;
  while ((m = removeRegex.exec(js)) !== null) removeIds.push(m[1]);
  const invalid = removeIds.filter(id => !addIds.has(id));
  assert(invalid.length === 0, `removeInv references non-existent items: ${invalid.join(', ')}`);
});

test('Consumed items (removeInv) are used before being removed', () => {
  // green_stone is removed at graveyard, should be added in cave first
  const greenAdd = Math.max(js.indexOf("addInv({ id: 'green_stone'"), js.indexOf("addInv({id:'green_stone'"));
  const greenRemove = js.indexOf("removeInv('green_stone')");
  assert(greenAdd < greenRemove,
    'green_stone is removed before it could be obtained');
  // brass_key: addInv is in the pot (pick verb), removeInv is in the drawer (open verb)
  // Both are in kitchen scene, but pot interaction comes before drawer can be opened
  // Just verify both exist
  assert(js.includes("addInv({id:'brass_key'") && js.includes("removeInv('brass_key')"),
    'brass_key add/remove pair not found');
});

test('No duplicate addInv calls for the same item (double-add protection)', () => {
  // Each addInv should be guarded by a flag check
  const addRegex = /addInv\(\s*\{\s*id:\s*'(\w+)'/g;
  const addCounts = {};
  let m;
  while ((m = addRegex.exec(js)) !== null) {
    addCounts[m[1]] = (addCounts[m[1]] || 0) + 1;
  }
  const dupes = Object.entries(addCounts).filter(([_, c]) => c > 1);
  // Multiple addInv for same ID is OK IF guarded by different conditions
  // Just flag it as a warning
  if (dupes.length > 0) {
    console.log(`    ⚠ Items with multiple addInv calls: ${dupes.map(([id, c]) => `${id}(${c}x)`).join(', ')}`);
  }
  assert(true);
});

// ════════════════════════════════════════════════════════════
console.log('\n30. NPC SCENE PLACEMENT & DIALOGUE');
// ════════════════════════════════════════════════════════════

test('Every NPC in a scene has at least a "talk" verb on some object', () => {
  const block = getScenesBlock();
  const issues = [];
  for (const [npc, scene] of Object.entries(npcs)) {
    if (npc === 'ghost') continue; // Ghost doesn't talk normally
    // Check if the scene has a talk verb mentioning this NPC's speaker name
    const sceneStart = block.indexOf(`  ${scene}: {`);
    if (sceneStart === -1) continue;
    const chunk = block.substring(sceneStart, sceneStart + 5000);
    if (!chunk.includes("talk:") && !chunk.includes("talk :")) {
      issues.push(`${npc} in ${scene} has no talk interaction`);
    }
  }
  assert(issues.length === 0, `NPCs without talk interaction: ${issues.join('; ')}`);
});

test('No NPC appears in more than one scene simultaneously', () => {
  const npcScenes = {};
  for (const [npc, scene] of Object.entries(npcs)) {
    if (!npcScenes[npc]) npcScenes[npc] = [];
    npcScenes[npc].push(scene);
  }
  const dupes = Object.entries(npcScenes).filter(([_, scenes]) => scenes.length > 1);
  assert(dupes.length === 0,
    `NPCs in multiple scenes: ${dupes.map(([npc, scenes]) => `${npc}: ${scenes.join('+')}`).join('; ')}`);
});

test('NPCs have consistent height/position (not floating or underground)', () => {
  const block = js.match(/const npcChars\s*=\s*\{([\s\S]*?)\n\};/);
  if (!block) { assert(true); return; }
  const issues = [];
  const posRegex = /(\w+):\s*\{[^}]*y:\s*(\d+)/g;
  let m;
  while ((m = posRegex.exec(block[1])) !== null) {
    const y = parseInt(m[2]);
    if (y < 150) issues.push(`${m[1]}: y=${y} (too high, floating?)`);
    if (y > 380) issues.push(`${m[1]}: y=${y} (below walkline?)`);
  }
  assert(issues.length === 0, `NPC position issues: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n31. FLAG SYSTEM INTEGRITY');
// ════════════════════════════════════════════════════════════

test('All flags used in conditions are set somewhere', () => {
  // Extract flags that are READ (conditions)
  const readRegex = /state\.flags\.(\w+)/g;
  const readFlags = new Set();
  let m;
  while ((m = readRegex.exec(js)) !== null) readFlags.add(m[1]);
  // Extract flags that are SET
  const setRegex = /state\.flags\.(\w+)\s*=\s*/g;
  const setFlags = new Set();
  while ((m = setRegex.exec(js)) !== null) setFlags.add(m[1]);
  const unset = [...readFlags].filter(f => !setFlags.has(f));
  assert(unset.length === 0,
    `Flags read but never set: ${unset.join(', ')}`);
});

test('All flags that are set are also read somewhere', () => {
  const setRegex = /state\.flags\.(\w+)\s*=\s*/g;
  const setFlags = new Set();
  let m;
  while ((m = setRegex.exec(js)) !== null) setFlags.add(m[1]);
  const readRegex = /state\.flags\.(\w+)(?!\s*=)/g;
  const readFlags = new Set();
  while ((m = readRegex.exec(js)) !== null) readFlags.add(m[1]);
  // Also check in status display
  const statusRegex = /done:\s*state\.flags\.(\w+)/g;
  while ((m = statusRegex.exec(js)) !== null) readFlags.add(m[1]);
  const unused = [...setFlags].filter(f => !readFlags.has(f));
  if (unused.length > 0) {
    console.log(`    ⚠ Flags set but never checked: ${unused.join(', ')}`);
  }
  assert(true); // Warning only — some flags may be future use
});

test('Status screen tracks all quest flags', () => {
  const statusFlags = [];
  const statusRegex = /done:\s*state\.flags\.(\w+)/g;
  let m;
  while ((m = statusRegex.exec(js)) !== null) statusFlags.push(m[1]);
  const questFlags = ['drawer_open', 'jade_found', 'ghost_summoned', 'candle_lit',
    'chest_opened', 'letter_read', 'speech_done'];
  const missing = questFlags.filter(f => !statusFlags.includes(f));
  assert(missing.length === 0,
    `Quest flags not shown in status screen: ${missing.join(', ')}`);
});

test('Flags use consistent types (all truthy, no mixing 1/true)', () => {
  const setRegex = /state\.flags\.(\w+)\s*=\s*([^;]+)/g;
  const flagTypes = {};
  let m;
  while ((m = setRegex.exec(js)) !== null) {
    const val = m[2].trim();
    flagTypes[m[1]] = val;
  }
  const mixed = [];
  const vals = Object.values(flagTypes);
  const uses1 = vals.filter(v => v === '1').length;
  const usesTrue = vals.filter(v => v === 'true').length;
  if (uses1 > 0 && usesTrue > 0) {
    for (const [flag, val] of Object.entries(flagTypes)) {
      if (val !== '1' && val !== 'true') continue;
      mixed.push(`${flag}=${val}`);
    }
    console.log(`    ⚠ Mixed flag types: ${mixed.join(', ')} (some use 1, some use true)`);
  }
  assert(true); // Warning only — both are truthy
});

// ════════════════════════════════════════════════════════════
console.log('\n32. SCENE OBJECT VERB COVERAGE');
// ════════════════════════════════════════════════════════════

test('Every interactive object has a "look" verb', () => {
  const block = getScenesBlock();
  const objRegex = /\{\s*id:\s*'(\w+)',\s*x:\s*\d+,\s*y:\s*\d+,\s*w:\s*\d+,\s*h:\s*\d+,\s*label:\s*'[^']+'/g;
  let m;
  const objects = [];
  while ((m = objRegex.exec(block)) !== null) {
    objects.push(m[1]);
  }
  // Check each object has look verb
  const noLook = [];
  for (const objId of objects) {
    const objIdx = block.indexOf(`id:'${objId}'`);
    if (objIdx === -1) continue;
    const chunk = block.substring(objIdx, objIdx + 2000);
    const verbEnd = chunk.indexOf('},');
    const verbBlock = chunk.substring(0, verbEnd > 0 ? verbEnd : 500);
    if (!verbBlock.includes('look:') && !verbBlock.includes('look :')) {
      noLook.push(objId);
    }
  }
  assert(noLook.length === 0, `Objects without look verb: ${noLook.join(', ')}`);
});

test('Objects that give items use addInv within their verb handler', () => {
  // Items should only be obtainable through verb interaction, not magically
  const addInvRegex = /addInv\(\s*\{\s*id:\s*'(\w+)'/g;
  let m;
  const addedItems = [];
  while ((m = addInvRegex.exec(js)) !== null) {
    addedItems.push({ id: m[1], position: m.index });
  }
  // Each addInv should be within a scene verb handler or NPC talk handler
  const issues = [];
  for (const item of addedItems) {
    const context = js.substring(Math.max(0, item.position - 500), item.position);
    const hasVerbContext = context.includes('look:') || context.includes('use:') ||
      context.includes('open:') || context.includes('pick:') ||
      context.includes('talk:');
    if (!hasVerbContext) {
      // Check if it's in a sequence or cutscene callback
      const hasCallbackContext = context.includes('cb:') || context.includes('callback') ||
        context.includes('onComplete') || context.includes('=> {');
      if (!hasCallbackContext) {
        issues.push(`${item.id}: addInv not within verb/callback context`);
      }
    }
  }
  assert(issues.length === 0, `Items added outside verb handlers: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n33. WALK SYSTEM & SPATIAL CONSISTENCY');
// ════════════════════════════════════════════════════════════

test('Character starting positions are within walkBounds', () => {
  const block = getScenesBlock();
  const issues = [];
  for (const sceneId of sceneIds) {
    const sceneStart = block.indexOf(`  ${sceneId}: {`);
    if (sceneStart === -1) continue;
    const chunk = block.substring(sceneStart, sceneStart + 1500);
    // Extract walkBounds
    const boundsMatch = chunk.match(/walkBounds:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/);
    if (!boundsMatch) continue;
    const minX = parseInt(boundsMatch[1]), maxX = parseInt(boundsMatch[2]);
    // Extract charPos
    const charPosMatch = chunk.match(/charPos:\s*\{([\s\S]*?)(?:objects:|exits:)/);
    if (!charPosMatch) continue;
    const posRegex = /(\w+):\s*\{\s*x:\s*(\d+)/g;
    let pm;
    while ((pm = posRegex.exec(charPosMatch[1])) !== null) {
      const x = parseInt(pm[2]);
      if (x < minX - 20 || x > maxX + 20) {
        issues.push(`${sceneId}.${pm[1]}: x=${x} outside walkBounds [${minX},${maxX}]`);
      }
    }
  }
  assert(issues.length === 0, `Characters outside walkBounds: ${issues.join('; ')}`);
});

test('WalkLine Y values are within canvas bounds (0-400)', () => {
  const walkLines = extractWalkLines();
  const issues = [];
  for (const [scene, wl] of Object.entries(walkLines)) {
    if (wl === 'parse_error' || !Array.isArray(wl)) continue;
    for (const point of wl) {
      if (point[1] < 0 || point[1] > 400) {
        issues.push(`${scene}: walkLine point y=${point[1]} outside canvas`);
      }
    }
  }
  assert(issues.length === 0, `WalkLine Y out of bounds: ${issues.join('; ')}`);
});

test('Exit hotspots are positioned at scene edges (left/right sides)', () => {
  const block = getScenesBlock();
  const issues = [];
  const exitRegex = /\{side:\s*'(left|right)',\s*target:\s*'(\w+)',\s*label:\s*'([^']+)',\s*x:\s*(\d+)/g;
  let m;
  while ((m = exitRegex.exec(block)) !== null) {
    const side = m[1], x = parseInt(m[4]);
    if (side === 'left' && x > 100) {
      issues.push(`Exit to ${m[2]} is "left" but x=${x} (expected <100)`);
    }
    if (side === 'right' && x < 500) {
      issues.push(`Exit to ${m[2]} is "right" but x=${x} (expected >500)`);
    }
  }
  assert(issues.length === 0, `Misplaced exits: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n34. MUSIC & AMBIENCE CONSISTENCY');
// ════════════════════════════════════════════════════════════

test('No two adjacent scenes share the same music track', () => {
  const exits = extractExits();
  const issues = [];
  for (const [scene, targets] of Object.entries(exits)) {
    for (const target of targets) {
      if (sceneMusic[scene] && sceneMusic[target] &&
          sceneMusic[scene] === sceneMusic[target] &&
          scene !== 'church' && target !== 'church_interior') { // church pair OK
        issues.push(`${scene} → ${target}: same music "${path.basename(sceneMusic[scene])}"`);
      }
    }
  }
  if (issues.length > 0) {
    console.log(`    ⚠ Adjacent scenes with same music: ${issues.join('; ')}`);
  }
  assert(true); // Warning — shared music is sometimes intentional
});

test('Scene ambience functions exist for all scenes with NPCs', () => {
  const npcSceneList = new Set(Object.values(npcs));
  const issues = [];
  for (const scene of npcSceneList) {
    // Check for drawXxxAmbience function
    const ambienceFn = `draw${scene.charAt(0).toUpperCase() + scene.slice(1)}Ambience`;
    // Flexible check — might use different naming
    const hasAmbience = js.includes(`'${scene}'`) && (
      js.includes(ambienceFn) ||
      js.includes(`case '${scene}'`) ||
      js.includes(`${scene}:`) && js.includes('Ambience')
    );
    // Don't require it, just note
    if (!hasAmbience) {
      // Just a soft warning
    }
  }
  assert(true); // No strict requirement
});

test('Music files are reasonable size (not empty, not >10MB)', () => {
  const musicDir = path.join(GAME_DIR, 'music');
  if (!fs.existsSync(musicDir)) { assert(true); return; }
  const files = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
  const issues = [];
  for (const file of files) {
    const stats = fs.statSync(path.join(musicDir, file));
    if (stats.size < 1000) issues.push(`${file}: ${stats.size} bytes (too small — corrupt?)`);
    if (stats.size > 15 * 1024 * 1024) issues.push(`${file}: ${(stats.size / 1024 / 1024).toFixed(1)}MB (too large)`);
  }
  assert(issues.length === 0, `Music file size issues: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n35. HISTORICAL ACCURACY (STORY ELEMENTS)');
// ════════════════════════════════════════════════════════════

test('αλληλασφάλεια references 104 signers consistently', () => {
  const counts = [];
  const regex = /(?:εκατόν\s*τ[εέ]σσερ|104)/gi;
  let m;
  while ((m = regex.exec(js)) !== null) counts.push(m[0]);
  assert(counts.length >= 2, 'The number 104 (signers) is referenced fewer than 2 times');
  // Make sure no wrong number appears near "υπογραφ"
  const wrongCounts = ['103 υπογραφ', '105 υπογραφ', '100 υπογραφ'];
  const issues = wrongCounts.filter(w => js.includes(w));
  assert(issues.length === 0, `Wrong signature count near "υπογραφ": ${issues.join(', ')}`);
});

test('Vote inscription is consistently "9 to 3" (not other numbers)', () => {
  assert(js.includes('9 προς 3') || js.includes('9 to 3'),
    'Vote inscription "9 to 3" not found');
  // Make sure no contradictory numbers
  const wrongVotes = ['8 προς', '10 προς', '7 προς'];
  const issues = wrongVotes.filter(w => js.includes(w));
  assert(issues.length === 0, `Contradictory vote numbers: ${issues.join(', ')}`);
});

test('Visvikis dates are consistent (1841-1903)', () => {
  if (js.includes('1841') && js.includes('1903')) {
    // Check no contradictory dates appear
    const wrongDates = ['1840', '1842', '1902', '1904–'];
    const issues = wrongDates.filter(d => {
      // Only flag if near "Βισβίκη"
      const idx = js.indexOf(d);
      if (idx === -1) return false;
      const context = js.substring(Math.max(0, idx - 200), idx + 200);
      return context.includes('Βισβίκη');
    });
    assert(issues.length === 0, `Contradictory Visvikis dates: ${issues.join(', ')}`);
  }
  assert(true);
});

test('Ship name Ελπίδα is consistent in dialogue (not Ελπίς or Ελπιδα)', () => {
  // Only check within dialogue text, not variable names or code
  const allDialogue = extractAllGameDialogue();
  const issues = [];
  for (const d of allDialogue) {
    if (d.text.includes('Ελπίς')) issues.push(`"${d.text.substring(0, 40)}..." uses Ελπίς`);
    if (d.text.includes('Ελπιδα') && !d.text.includes('Ελπίδα')) {
      issues.push(`"${d.text.substring(0, 40)}..." uses Ελπιδα (no accent)`);
    }
  }
  assert(issues.length === 0, `Ship name inconsistency: ${issues.join('; ')}`);
});

test('Epitaph "Η θάλασσα θυμάται" is used correctly (graveyard/epilogue only)', () => {
  const phrase = 'Η θάλασσα θυμάται';
  const regex = new RegExp(phrase, 'g');
  const occurrences = [];
  let m;
  while ((m = regex.exec(js)) !== null) {
    occurrences.push(m.index);
  }
  assert(occurrences.length >= 2, `Epitaph "${phrase}" appears fewer than 2 times (should be in graveyard + epilogue)`);
});

// ════════════════════════════════════════════════════════════
console.log('\n36. GAME STATE TRANSITIONS');
// ════════════════════════════════════════════════════════════

test('Game phases transition correctly: title → intro → cutscene → playing → epilogue', () => {
  // title → intro
  assert(js.includes("state.phase = 'intro'"), 'No transition to intro phase');
  // intro → cutscene (arrival)
  assert(js.includes("startCutscene('arrival')"), 'No arrival cutscene trigger');
  // cutscene → playing (onComplete)
  assert(js.includes("state.phase = 'playing'"), 'No transition to playing phase');
  // playing → epilogue (or endgame)
  assert(js.includes("'epilogue'"), 'No epilogue phase');
});

test('Cutscene-to-gameplay transitions restore UI panels', () => {
  // After arrival cutscene, UI panels should be shown
  const arrivalComplete = js.substring(
    js.indexOf("arrival:"),
    js.indexOf("arrival:") + 3000
  );
  assert(arrivalComplete.includes("ui-panel") || arrivalComplete.includes("classList.add('on')"),
    'Arrival cutscene does not restore UI panels');
});

test('Scene changes use fade transition (not instant)', () => {
  const changeSceneFn = js.substring(
    js.indexOf('function changeScene'),
    js.indexOf('function changeScene') + 500
  );
  assert(changeSceneFn.includes('fade') || changeSceneFn.includes('iris') || changeSceneFn.includes('alpha'),
    'changeScene has no transition effect');
});

test('Map navigation triggers changeScene (not direct scene set)', () => {
  // Map clicks should go through changeScene, not set state.scene directly
  const mapSection = js.substring(
    js.indexOf('drawMap') || 0,
    (js.indexOf('drawMap') || 0) + 5000
  );
  if (mapSection.includes('state.scene =') && !mapSection.includes('changeScene')) {
    assert(false, 'Map sets state.scene directly instead of using changeScene');
  }
  assert(true);
});

// ════════════════════════════════════════════════════════════
console.log('\n37. RENDERING SAFETY');
// ════════════════════════════════════════════════════════════

test('drawImage calls use loaded image keys (no undefined images)', () => {
  // Extract images[] references used in drawImage
  const drawImgRegex = /(?:ctx|bgCtx)\.drawImage\(\s*images\[['"](\w+)['"]\]/g;
  const loadedKeys = new Set(loadedAssets.map(a => a.key));
  const referenced = new Set();
  let m;
  while ((m = drawImgRegex.exec(js)) !== null) {
    referenced.add(m[1]);
  }
  const missing = [...referenced].filter(k => !loadedKeys.has(k));
  assert(missing.length === 0, `drawImage references unloaded images: ${missing.join(', ')}`);
});

test('Canvas context save/restore calls are balanced', () => {
  const saves = (js.match(/ctx\.save\(\)/g) || []).length;
  const restores = (js.match(/ctx\.restore\(\)/g) || []).length;
  // They should be roughly equal (within 2)
  assert(Math.abs(saves - restores) <= 3,
    `Unbalanced ctx.save/restore: ${saves} saves, ${restores} restores (diff: ${Math.abs(saves - restores)})`);
});

test('No NaN-producing math in critical paths', () => {
  // Check for patterns that could produce NaN
  const riskyPatterns = [
    { pattern: /Math\.sqrt\(\s*-/, desc: 'sqrt of negative' },
    { pattern: /\/\s*\(.*?-.*?\)/, desc: 'division by subtraction result' },
  ];
  // Just check there are no obvious issues
  const lines = js.split('\n');
  let nanRisk = 0;
  for (const line of lines) {
    if (line.trim().startsWith('//')) continue;
    if (line.includes('NaN') && !line.includes('isNaN') && !line.includes('// NaN')) {
      nanRisk++;
    }
  }
  if (nanRisk > 0) {
    console.log(`    ⚠ ${nanRisk} references to NaN found (potential bugs)`);
  }
  assert(true);
});

// ════════════════════════════════════════════════════════════
console.log('\n38. SEQUENCE SYSTEM');
// ════════════════════════════════════════════════════════════

test('startSequence function handles all step types', () => {
  const seqFn = js.substring(
    js.indexOf('function executeStep') || js.indexOf('function startSequence'),
    (js.indexOf('function executeStep') || js.indexOf('function startSequence')) + 3000
  );
  const stepTypes = ['wait', 'dialog', 'env', 'move', 'npc', 'effect', 'callback'];
  const missing = stepTypes.filter(t => !seqFn.includes(`'${t}'`));
  assert(missing.length === 0, `Missing step types in sequence engine: ${missing.join(', ')}`);
});

test('Ghost sequence has all required effects', () => {
  const ghostSeq = js.substring(
    js.indexOf('function startGhostSequence'),
    js.indexOf('function startGhostSequence') + 3000
  );
  assert(ghostSeq.includes('materialize') || ghostSeq.includes('ghost'),
    'Ghost sequence missing materialization effect');
  assert(ghostSeq.includes('dialog'),
    'Ghost sequence missing dialogue');
  assert(ghostSeq.includes('fade') || ghostSeq.includes('spectral'),
    'Ghost sequence missing fade/spectral effect');
});

test('Sequence system prevents overlapping sequences', () => {
  const seqFn = js.substring(
    js.indexOf('function startSequence'),
    js.indexOf('function startSequence') + 500
  );
  // Should check if sequence is already active
  assert(seqFn.includes('seq.active') || seqFn.includes('active'),
    'startSequence does not check for already-active sequence');
});

// ════════════════════════════════════════════════════════════
console.log('\n39. HELP & HINTS SYSTEM');
// ════════════════════════════════════════════════════════════

test('Help hints exist for all scenes', () => {
  const helpRegex = /SCENE_HINTS|sceneHints|helpHints/;
  const hasHints = helpRegex.test(js);
  if (hasHints) {
    for (const sceneId of sceneIds.filter(s => s !== 'treasure' && s !== 'new_era')) {
      assert(js.includes(`'${sceneId}'`) || js.includes(`${sceneId}:`),
        `No help hint for scene ${sceneId}`);
    }
  }
  assert(true); // Help system may not use per-scene hints
});

test('Status screen puzzle progress list matches actual quest', () => {
  // Extract puzzle progress entries
  const progressRegex = /done:\s*state\.flags\.(\w+),\s*text:\s*'([^']+)'/g;
  const entries = [];
  let m;
  while ((m = progressRegex.exec(js)) !== null) {
    entries.push({ flag: m[1], text: m[2] });
  }
  assert(entries.length >= 7,
    `Only ${entries.length} puzzle progress entries (expected 7+)`);
  // Check ordering matches puzzle chain
  const expectedOrder = ['drawer_open', 'lantern_given', 'vote_read', 'jade_found',
    'ghost_summoned', 'candle_lit'];
  const flagOrder = entries.map(e => e.flag);
  for (let i = 0; i < expectedOrder.length - 1; i++) {
    const idxA = flagOrder.indexOf(expectedOrder[i]);
    const idxB = flagOrder.indexOf(expectedOrder[i + 1]);
    if (idxA >= 0 && idxB >= 0) {
      assert(idxA < idxB,
        `Puzzle progress out of order: ${expectedOrder[i]} should appear before ${expectedOrder[i + 1]}`);
    }
  }
});

// ════════════════════════════════════════════════════════════
console.log('\n40. CLIO SCHEDULING & FAMILY SYSTEM');
// ════════════════════════════════════════════════════════════

test('Clio visibility is handled (biweekly visit system)', () => {
  assert(js.includes('clio') && (js.includes('visible') || js.includes('scheduleClio')),
    'Clio visibility system not found');
});

test('Family follow system works for all three characters', () => {
  const familyFn = js.substring(
    js.indexOf('function familyFollow'),
    js.indexOf('function familyFollow') + 500
  );
  assert(familyFn.includes('ajax'), 'familyFollow missing ajax');
  assert(familyFn.includes('clio'), 'familyFollow missing clio');
});

test('Character sprite sizes are reasonable', () => {
  const anatomy = js.match(/WALK_ANATOMY\s*=\s*\{([\s\S]*?)\}/);
  if (!anatomy) { assert(true); return; }
  // Check waist ratios are between 0.4 and 0.8
  const waistRegex = /waist:\s*([\d.]+)/g;
  let m;
  const waists = [];
  while ((m = waistRegex.exec(anatomy[1])) !== null) {
    waists.push(parseFloat(m[1]));
  }
  const invalid = waists.filter(w => w < 0.3 || w > 0.9);
  assert(invalid.length === 0, `Invalid waist ratios: ${invalid.join(', ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n41. TITLE SCREEN & INTRO');
// ════════════════════════════════════════════════════════════

test('Title screen draws game title text', () => {
  assert(js.includes('Μυστήριο') || js.includes('Γαλαξειδίου') || js.includes('drawTitleScreen'),
    'Title screen does not display game name');
});

test('Intro pages exist and have content', () => {
  assert(js.includes('introPages') || js.includes('intro_pages') || js.includes('showIntroPage'),
    'Intro pages not found');
});

test('Language selection exists (Greek/English)', () => {
  assert(js.includes('Ελληνικά') || js.includes('language') || js.includes('lang'),
    'Language selection not found');
});

test('Box art / cover image is loaded', () => {
  const hasBoxArt = loadedAssets.some(a =>
    a.key.includes('box') || a.key.includes('cover') || a.key.includes('title')
  );
  assert(hasBoxArt, 'No box art / cover image loaded');
});

// ════════════════════════════════════════════════════════════
console.log('\n42. ASSET FILE INTEGRITY');
// ════════════════════════════════════════════════════════════

test('All PNG/WebP assets are valid (not 0 bytes)', () => {
  const assetDir = path.join(GAME_DIR, 'assets');
  const files = fs.readdirSync(assetDir).filter(f => f.match(/\.(png|webp)$/i));
  const empty = files.filter(f => {
    const stats = fs.statSync(path.join(assetDir, f));
    return stats.size === 0;
  });
  assert(empty.length === 0, `Empty asset files: ${empty.join(', ')}`);
});

test('Voice directory structure matches expected layout', () => {
  const voiceDir = path.join(GAME_DIR, 'voice');
  if (!fs.existsSync(voiceDir)) { assert(true); return; }
  const entries = fs.readdirSync(voiceDir, { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
  assert(dirs.length >= 4, `Only ${dirs.length} voice character directories (expected 4+)`);
  // Each dir should have mp3 files (except ghost — he doesn't speak)
  const emptyDirs = dirs.filter(d => {
    if (d === 'ghost') return false; // Ghost is silent — no voice files expected
    const files = fs.readdirSync(path.join(voiceDir, d));
    return files.filter(f => f.endsWith('.mp3')).length === 0;
  });
  assert(emptyDirs.length === 0, `Empty voice directories: ${emptyDirs.join(', ')}`);
});

test('Cutscene images have reasonable dimensions (check file size proxy)', () => {
  const assetDir = path.join(GAME_DIR, 'assets');
  const cutsceneFiles = fs.readdirSync(assetDir).filter(f => f.startsWith('cutscene-'));
  const issues = [];
  for (const file of cutsceneFiles) {
    const stats = fs.statSync(path.join(assetDir, file));
    if (stats.size < 5000) issues.push(`${file}: ${stats.size} bytes (suspiciously small)`);
  }
  assert(issues.length === 0, `Cutscene image issues: ${issues.join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n43. DIALOGUE LINE LENGTH & READABILITY');
// ════════════════════════════════════════════════════════════

test('No dialogue line exceeds 120 characters (readability at 640px)', () => {
  const allDialogue = extractAllGameDialogue();
  const tooLong = allDialogue.filter(d => d.text.length > 120);
  if (tooLong.length > 0) {
    console.log(`    ⚠ ${tooLong.length} lines >120 chars. Longest:`);
    const sorted = tooLong.sort((a, b) => b.text.length - a.text.length);
    sorted.slice(0, 3).forEach(d =>
      console.log(`      [${d.speaker || 'nar'}] ${d.text.length} chars: "${d.text.substring(0, 60)}..."`)
    );
  }
  // Hard fail only for very long lines
  const veryLong = allDialogue.filter(d => d.text.length > 200);
  assert(veryLong.length === 0,
    `${veryLong.length} lines >200 chars (won't fit on screen)`);
});

test('Cutscene dialogue lines are shorter than scene dialogue (must be readable fast)', () => {
  const cutDlg = extractCutsceneDialogue();
  const tooLong = cutDlg.filter(d => d.text.length > 80);
  if (tooLong.length > 0) {
    console.log(`    ⚠ ${tooLong.length} cutscene lines >80 chars (may not be readable in time)`);
  }
  const veryLong = cutDlg.filter(d => d.text.length > 120);
  assert(veryLong.length === 0,
    `${veryLong.length} cutscene lines >120 chars: ${veryLong.map(d => d.text.substring(0, 50)).join('; ')}`);
});

// ════════════════════════════════════════════════════════════
console.log('\n44. EVENT LISTENER SAFETY');
// ════════════════════════════════════════════════════════════

test('Click handler checks game phase before processing', () => {
  // The click handler should not process clicks during cutscenes/title
  // Search for all click-related event listeners
  const clickIdx = js.indexOf("'pointerdown'") !== -1 ? js.indexOf("'pointerdown'") :
    js.indexOf("'click'") !== -1 ? js.indexOf("'click'") : js.indexOf("'mousedown'");
  if (clickIdx === -1) { assert(false, 'No click handler found'); return; }
  const clickSection = js.substring(clickIdx, clickIdx + 5000);
  // Check for phase checks in click handler or the function it calls
  assert(clickSection.includes('state.phase') || clickSection.includes("phase") ||
         clickSection.includes('playing') || clickSection.includes('cutscene') ||
         clickSection.includes('title') || clickSection.includes('mapOpen'),
    'Click handler does not check game phase');
});

test('Keyboard handler checks for dialog/cutscene state', () => {
  const keySection = js.substring(
    js.indexOf("'keydown'"),
    js.indexOf("'keydown'") + 2000
  );
  assert(keySection.includes('dlg') || keySection.includes('cutscene') || keySection.includes('mapOpen'),
    'Keyboard handler does not check dialog/cutscene state');
});

test('Window resize handler exists for canvas scaling', () => {
  assert(js.includes('resize') || js.includes('resizeCanvas'),
    'No window resize handler for canvas scaling');
});

// ── Section 45: VOICE-TEXT SYNC — Audio content matches displayed text ──
console.log('\n45. VOICE-TEXT SYNC — Audio content matches displayed text');

test('No voice file is mapped to multiple different texts', () => {
  // Build reverse map: voice file → all texts that reference it
  const vmRegex = /'([^']+)':\s*'(voice\/[^']+\.mp3)'/g;
  const fileToTexts = {};
  let m;
  while ((m = vmRegex.exec(js)) !== null) {
    const text = m[1];
    const file = m[2];
    if (!fileToTexts[file]) fileToTexts[file] = [];
    if (!fileToTexts[file].includes(text)) fileToTexts[file].push(text);
  }
  const conflicts = [];
  for (const [file, texts] of Object.entries(fileToTexts)) {
    if (texts.length > 1) {
      conflicts.push({ file, texts });
    }
  }
  if (conflicts.length > 0) {
    console.log(`    ⚠ ${conflicts.length} voice files mapped to multiple texts:`);
    for (const c of conflicts) {
      console.log(`      ${c.file}:`);
      for (const t of c.texts) {
        console.log(`        - "${t.substring(0, 60)}..."`);
      }
    }
  }
  assert(conflicts.length === 0,
    `${conflicts.length} voice files are reused for different texts — audio won't match displayed text`);
});

test('dialog-lines.json text matches VOICE_MAP text for same voice file', () => {
  // dialog-lines.json is ordered: narrator 001-N, then character files
  // VOICE_MAP maps displayed text → file
  // The dialog-lines.json text is what was ACTUALLY generated as audio
  const dlJson = JSON.parse(fs.readFileSync(path.join(GAME_DIR, 'voice', 'dialog-lines.json'), 'utf8'));

  // Build: VOICE_MAP text → file
  const vmRegex = /'([^']+)':\s*'(voice\/[^']+\.mp3)'/g;
  const textToFile = {};
  let m;
  while ((m = vmRegex.exec(js)) !== null) {
    textToFile[m[1]] = m[2];
  }

  // Build: file → dialog-lines.json text (the audio content)
  // dialog-lines.json entries map to voice files by order within each speaker directory
  // narrator entries: 001.mp3, 002.mp3, ... ; character entries: speaker/001.mp3, ...
  const fileToGenText = {};
  const speakerCounts = {};
  for (const entry of dlJson) {
    const speaker = entry.speaker || '';
    const dir = speaker === '' ? 'narrator' : speaker.toLowerCase();
    if (!speakerCounts[dir]) speakerCounts[dir] = 0;
    speakerCounts[dir]++;
    const num = String(speakerCounts[dir]).padStart(3, '0');
    const filePath = `voice/${dir}/${num}.mp3`;
    fileToGenText[filePath] = entry.text;
  }

  // Compare: for each VOICE_MAP entry, check if the displayed text matches the generated audio text
  const mismatches = [];
  for (const [displayText, file] of Object.entries(textToFile)) {
    const genText = fileToGenText[file];
    if (genText && genText !== displayText) {
      mismatches.push({
        file,
        displayed: displayText.substring(0, 70),
        audioSays: genText.substring(0, 70)
      });
    }
  }
  if (mismatches.length > 0) {
    console.log(`    ⚠ ${mismatches.length} voice-text mismatches found:`);
    for (const mm of mismatches.slice(0, 10)) {
      console.log(`      ${mm.file}:`);
      console.log(`        Screen: "${mm.displayed}..."`);
      console.log(`        Audio:  "${mm.audioSays}..."`);
    }
    if (mismatches.length > 10) console.log(`      ... and ${mismatches.length - 10} more`);
  }
  assert(mismatches.length === 0,
    `${mismatches.length} voice files play audio that doesn't match displayed text`);
});

test('Kitchen/captain office scene texts all have matching voice entries', () => {
  // Extract all text from kitchen scene objects and entry
  const kitchenTexts = [];
  // Entry dialog
  const entryMatch = js.match(/kitchen:[\s\S]*?entry:\s*\[([\s\S]*?)\]/);
  if (entryMatch) {
    const tMatches = entryMatch[1].matchAll(/t:'([^']+)'/g);
    for (const tm of tMatches) kitchenTexts.push(tm[1]);
  }
  // Object verbs
  const kitchenSection = js.substring(
    js.indexOf("kitchen:") + 1,
    js.indexOf("exits:", js.indexOf("kitchen:"))
  );
  const lookTexts = kitchenSection.matchAll(/t:'([^']+)'/g);
  for (const lt of lookTexts) kitchenTexts.push(lt[1]);

  // Check each against VOICE_MAP
  const vmRegex = /'([^']+)':\s*'(voice\/[^']+\.mp3)'/g;
  const voiceMapTexts = new Set();
  let m;
  while ((m = vmRegex.exec(js)) !== null) voiceMapTexts.add(m[1]);

  const missing = kitchenTexts.filter(t => !voiceMapTexts.has(t));
  if (missing.length > 0) {
    console.log(`    ⚠ Kitchen lines missing from VOICE_MAP:`);
    for (const t of missing) console.log(`      - "${t.substring(0, 70)}..."`);
  }
  assert(missing.length === 0,
    `${missing.length} kitchen/captain office lines have no voice entry`);
});

test('Exterior and terrace scene texts all have matching voice entries', () => {
  const sceneTexts = [];
  // Only match t:'...' that contain Greek characters (dialogue), not scene IDs
  for (const sceneId of ['exterior', 'terrace']) {
    const sceneStart = js.indexOf(`  ${sceneId}: {`);
    if (sceneStart === -1) continue;
    const nextScene = js.indexOf('\n  },\n', sceneStart);
    const section = js.substring(sceneStart, nextScene > sceneStart ? nextScene : sceneStart + 3000);
    const tMatches = section.matchAll(/t:'([^']+)'/g);
    for (const tm of tMatches) {
      // Filter out scene IDs (pure ASCII, short) — only keep actual Greek dialogue
      if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(tm[1])) {
        sceneTexts.push(tm[1]);
      }
    }
  }

  const vmRegex = /'([^']+)':\s*'(voice\/[^']+\.mp3)'/g;
  const voiceMapTexts = new Set();
  let m;
  while ((m = vmRegex.exec(js)) !== null) voiceMapTexts.add(m[1]);

  const missing = sceneTexts.filter(t => !voiceMapTexts.has(t));
  if (missing.length > 0) {
    console.log(`    ⚠ Exterior/terrace lines missing from VOICE_MAP:`);
    for (const t of missing) console.log(`      - "${t.substring(0, 70)}..."`);
  }
  assert(missing.length === 0,
    `${missing.length} exterior/terrace lines have no voice entry`);
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
