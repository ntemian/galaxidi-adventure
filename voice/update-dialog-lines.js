#!/usr/bin/env node
/**
 * Scans index.html for ALL dialogue lines and adds missing ones to dialog-lines.json
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Load existing dialog-lines
const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'dialog-lines.json'), 'utf-8'));
const existingSet = new Set(existing.map(e => e.speaker + '|' + e.text));

// Extract all dialogue texts from the game
const seen = new Set();
const allEntries = [];

// Pattern 1: {s:'...',t:'...'} — compact scene dialogue
const dlgRegex = /\{s:\s*'([^']*)',\s*t:\s*'([^']+)'\}/g;
let m;
while ((m = dlgRegex.exec(script)) !== null) {
  const key = m[1] + '|' + m[2];
  if (!seen.has(key)) {
    seen.add(key);
    allEntries.push({ speaker: m[1], text: m[2] });
  }
}

// Pattern 2: { s: '...', t: '...', at: N } — cutscene dialogue with timestamps
const cutRegex = /\{\s*s:\s*'([^']*)',\s*t:\s*'([^']+)',\s*at:\s*[\d.]+\s*\}/g;
while ((m = cutRegex.exec(script)) !== null) {
  const key = m[1] + '|' + m[2];
  if (!seen.has(key)) {
    seen.add(key);
    allEntries.push({ speaker: m[1], text: m[2] });
  }
}

// Find entries missing from dialog-lines.json
const missing = allEntries.filter(e => !existingSet.has(e.speaker + '|' + e.text));

console.log('Existing entries:', existing.length);
console.log('Total unique game entries:', allEntries.length);
console.log('Missing entries to add:', missing.length);

if (missing.length > 0) {
  const updated = [...existing, ...missing];
  fs.writeFileSync(path.join(__dirname, 'dialog-lines.json'), JSON.stringify(updated, null, 2));
  console.log('Updated dialog-lines.json:', updated.length, 'entries');

  // Show summary by speaker
  const bySpeaker = {};
  for (const e of missing) {
    const key = e.speaker || '(narrator)';
    bySpeaker[key] = (bySpeaker[key] || 0) + 1;
  }
  console.log('\nMissing by speaker:');
  Object.entries(bySpeaker).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
    console.log(`  ${s}: ${c}`);
  });
} else {
  console.log('All entries present — nothing to add.');
}
