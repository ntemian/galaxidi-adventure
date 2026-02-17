#!/usr/bin/env node
/**
 * Voice-Text Sync Test Suite
 * Validates that every dialog line in the game has a matching voice file,
 * and every voice file has a matching dialog line.
 *
 * Run: node voice/test-voice-sync.js
 */
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf-8');

let passed = 0;
let failed = 0;
let warnings = 0;

function pass(msg) { passed++; console.log(`  ✅ ${msg}`); }
function fail(msg) { failed++; console.log(`  ❌ ${msg}`); }
function warn(msg) { warnings++; console.log(`  ⚠️  ${msg}`); }
function section(title) { console.log(`\n━━━ ${title} ━━━`); }

// ── Extract VOICE_MAP ──
section('1. VOICE_MAP Extraction');

const mapStart = html.indexOf('const VOICE_MAP = {');
const mapEnd = html.indexOf('\n};', mapStart);
const mapBlock = html.substring(mapStart, mapEnd + 3);

const voiceMap = {};
const entryRegex = /'((?:[^'\\]|\\.)*)'\s*:\s*'(voice\/[^']+)'/g;
let m;
while ((m = entryRegex.exec(mapBlock)) !== null) {
  const text = m[1].replace(/\\'/g, "'");
  voiceMap[text] = m[2];
}

const voiceMapCount = Object.keys(voiceMap).length;
if (voiceMapCount > 0) pass(`VOICE_MAP has ${voiceMapCount} entries`);
else fail('VOICE_MAP is empty');

// ── Extract ALL dialog text from scenes ──
section('2. Dialog Text Extraction (All Scenes)');

// Pattern 1: {s:'SPEAKER',t:'text'} — covers entry arrays and verb response arrays
const dialogRegex = /\{s:'([^']*)',t:'((?:[^'\\]|\\')*)'\}/g;
const allDialogTexts = new Set();
const dialogByScene = {};
let currentScene = null;

// Split by scene boundaries to track per-scene
const sceneRegex = /^\s*(exterior|terrace|kitchen|port|museum|liotrivi|windmill|cave|church|graveyard|boat|treasure|new_era):\s*\{/gm;
const scenePositions = [];
while ((m = sceneRegex.exec(html)) !== null) {
  scenePositions.push({ name: m[1], pos: m.index });
}

// Extract all dialog lines
let dm;
while ((dm = dialogRegex.exec(html)) !== null) {
  const text = dm[2].replace(/\\'/g, "'");
  if (text.trim() === '') continue;
  allDialogTexts.add(text);

  // Find which scene this belongs to
  let scene = 'unknown';
  for (let i = scenePositions.length - 1; i >= 0; i--) {
    if (dm.index >= scenePositions[i].pos) {
      scene = scenePositions[i].name;
      break;
    }
  }
  if (!dialogByScene[scene]) dialogByScene[scene] = [];
  dialogByScene[scene].push({ speaker: dm[1], text });
}

pass(`Found ${allDialogTexts.size} unique dialog lines across ${Object.keys(dialogByScene).length} scenes`);

// ── Per-scene report ──
section('3. Per-Scene Voice Coverage');

const sceneNames = ['exterior', 'terrace', 'kitchen', 'port', 'museum', 'liotrivi',
                     'windmill', 'cave', 'church', 'graveyard', 'boat', 'treasure', 'new_era'];

const missingByScene = {};

for (const scene of sceneNames) {
  const lines = dialogByScene[scene] || [];
  const missing = lines.filter(l => !voiceMap[l.text]);
  const covered = lines.length - missing.length;
  const pct = lines.length > 0 ? Math.round((covered / lines.length) * 100) : 100;

  if (missing.length === 0) {
    pass(`${scene.padEnd(12)} — ${covered}/${lines.length} lines covered (100%)`);
  } else {
    fail(`${scene.padEnd(12)} — ${covered}/${lines.length} lines covered (${pct}%) — ${missing.length} MISSING`);
    missingByScene[scene] = missing;
  }
}

// ── Check voice files exist on disk ──
section('4. Voice File Existence');

let filesExist = 0;
let filesMissing = 0;
const missingFiles = [];

for (const [text, filePath] of Object.entries(voiceMap)) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    filesExist++;
  } else {
    filesMissing++;
    missingFiles.push({ text: text.substring(0, 50), file: filePath });
  }
}

if (filesMissing === 0) {
  pass(`All ${filesExist} voice files exist on disk`);
} else {
  fail(`${filesMissing} voice files missing from disk (${filesExist} exist)`);
  missingFiles.slice(0, 10).forEach(f => warn(`  Missing: ${f.file} | "${f.text}..."`));
  if (missingFiles.length > 10) warn(`  ... and ${missingFiles.length - 10} more`);
}

// ── Check for orphaned voice files (files with no VOICE_MAP entry) ──
section('5. Orphaned Voice Files');

const voiceDir = path.join(__dirname);
const voiceFilesOnDisk = new Set();
const speakerDirs = fs.readdirSync(voiceDir).filter(d => {
  const p = path.join(voiceDir, d);
  return fs.statSync(p).isDirectory() && !d.startsWith('.');
});

for (const dir of speakerDirs) {
  const dirPath = path.join(voiceDir, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mp3'));
  files.forEach(f => voiceFilesOnDisk.add(`voice/${dir}/${f}`));
}

const mappedFiles = new Set(Object.values(voiceMap));
const orphaned = [...voiceFilesOnDisk].filter(f => !mappedFiles.has(f));

if (orphaned.length === 0) {
  pass(`No orphaned voice files (all ${voiceFilesOnDisk.size} files are mapped)`);
} else {
  warn(`${orphaned.length} orphaned voice files (exist on disk but not in VOICE_MAP)`);
  orphaned.slice(0, 5).forEach(f => warn(`  Orphan: ${f}`));
  if (orphaned.length > 5) warn(`  ... and ${orphaned.length - 5} more`);
}

// ── Check voice sync mechanism in code ──
section('6. Voice-Text Sync Mechanism');

if (html.includes('voiceFinished')) {
  pass('voiceFinished flag exists — dialog waits for voice to end');
} else {
  fail('voiceFinished flag MISSING — voice and text will overlap');
}

if (html.includes('voiceAudio.onended')) {
  pass('voiceAudio.onended handler exists — voice completion tracked');
} else {
  fail('voiceAudio.onended MISSING — voice completion not tracked');
}

if (html.includes('utter.onend')) {
  pass('TTS fallback onend handler exists');
} else {
  fail('TTS fallback onend MISSING — TTS completion not tracked');
}

// Check advanceDlg waits for voice
const advanceDlgStart = html.indexOf('function advanceDlg()');
const advanceDlgEnd = advanceDlgStart > -1 ? html.indexOf('\n}', advanceDlgStart + 50) : -1;
const advanceDlgBody = advanceDlgStart > -1 ? html.substring(advanceDlgStart, advanceDlgEnd + 2) : '';
if (advanceDlgBody.includes('voiceFinished')) {
  pass('advanceDlg() checks voiceFinished before advancing');
} else {
  fail('advanceDlg() does NOT check voiceFinished — lines will overlap');
}

// ── Print missing lines detail ──
if (Object.keys(missingByScene).length > 0) {
  section('7. Missing Voice Lines (Detail)');
  for (const [scene, lines] of Object.entries(missingByScene)) {
    console.log(`\n  Scene: ${scene}`);
    lines.forEach(l => {
      const speaker = l.speaker || 'NARRATOR';
      console.log(`    [${speaker}] "${l.text.substring(0, 70)}${l.text.length > 70 ? '...' : ''}"`);
    });
  }
}

// ── Summary ──
section('SUMMARY');
console.log(`  Passed:   ${passed}`);
console.log(`  Failed:   ${failed}`);
console.log(`  Warnings: ${warnings}`);
console.log(`  Total dialog lines: ${allDialogTexts.size}`);
console.log(`  VOICE_MAP entries:  ${voiceMapCount}`);
console.log(`  Voice files on disk: ${voiceFilesOnDisk.size}`);
console.log(`  Coverage: ${Math.round((voiceMapCount / allDialogTexts.size) * 100)}%`);
console.log('');

if (failed > 0) {
  console.log('  ❌ TESTS FAILED');
  process.exit(1);
} else {
  console.log('  ✅ ALL TESTS PASSED');
  process.exit(0);
}
