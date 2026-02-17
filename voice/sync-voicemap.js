#!/usr/bin/env node
/**
 * Syncs VOICE_MAP in index.html with manifest.json
 * Adds all manifest entries that are missing from VOICE_MAP
 */
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const manifestPath = path.join(__dirname, 'manifest.json');

const html = fs.readFileSync(indexPath, 'utf-8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Find VOICE_MAP boundaries
const mapStart = html.indexOf('const VOICE_MAP = {');
if (mapStart === -1) { console.error('VOICE_MAP not found'); process.exit(1); }
const mapEnd = html.indexOf('\n};', mapStart);
if (mapEnd === -1) { console.error('VOICE_MAP end not found'); process.exit(1); }

// Extract existing entries
const mapBlock = html.substring(mapStart, mapEnd + 3);
const existingTexts = new Set();
const entryRegex = /'((?:[^'\\]|\\.)*)'\s*:\s*'(voice\/[^']+)'/g;
let m;
while ((m = entryRegex.exec(mapBlock)) !== null) {
  existingTexts.add(m[1].replace(/\\'/g, "'"));
}

console.log('Existing VOICE_MAP entries:', existingTexts.size);

// Build new entries from manifest
const newEntries = [];
for (const [key, entry] of Object.entries(manifest)) {
  const text = entry.text;
  if (!text || text.trim() === '') continue;
  // Check if file exists
  const filePath = path.join(__dirname, entry.file);
  if (!fs.existsSync(filePath)) continue;
  // Skip if already in VOICE_MAP
  if (existingTexts.has(text)) continue;
  newEntries.push({ text, file: 'voice/' + entry.file });
}

console.log('New entries to add:', newEntries.length);

if (newEntries.length === 0) {
  console.log('VOICE_MAP is already in sync.');
  process.exit(0);
}

// Build the new lines to insert before the closing };
const newLines = newEntries.map(e => {
  const escaped = e.text.replace(/'/g, "\\'");
  return `  '${escaped}': '${e.file}'`;
});

// Find the last entry line (line before };)
const beforeEnd = html.substring(0, mapEnd);
const lastNewline = beforeEnd.lastIndexOf('\n');
const lastLine = beforeEnd.substring(lastNewline + 1);

// Check if last existing line has trailing comma
const hasTrailingComma = lastLine.trimEnd().endsWith(',');

// Build replacement
let insertion = '';
if (!hasTrailingComma) {
  // Add comma to last existing line
  insertion = ',\n';
} else {
  insertion = '\n';
}
insertion += newLines.join(',\n');

// Insert before the closing };
const updated = html.substring(0, mapEnd) + insertion + '\n};' + html.substring(mapEnd + 3);

fs.writeFileSync(indexPath, updated);

console.log('Updated VOICE_MAP: total', existingTexts.size + newEntries.length, 'entries');

// Summary by directory
const byDir = {};
for (const e of newEntries) {
  const dir = e.file.split('/')[1];
  byDir[dir] = (byDir[dir] || 0) + 1;
}
console.log('\nAdded by character:');
for (const [dir, count] of Object.entries(byDir).sort((a, b) => b - a)) {
  console.log(`  ${dir}: ${count}`);
}
