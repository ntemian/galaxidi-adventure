#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf-8'));
const missing = [];
for (const [key, entry] of Object.entries(manifest)) {
  const filePath = path.join(__dirname, entry.file);
  if (!fs.existsSync(filePath)) {
    missing.push(entry);
  }
}
// Group by speaker/directory
const bySpeaker = {};
for (const entry of missing) {
  const dir = entry.file.split('/')[0];
  if (!bySpeaker[dir]) bySpeaker[dir] = [];
  bySpeaker[dir].push(entry);
}
console.log(`Missing: ${missing.length} files`);
for (const [dir, entries] of Object.entries(bySpeaker).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${dir}: ${entries.length}`);
}
fs.writeFileSync(path.join(__dirname, 'missing-voices.json'), JSON.stringify(missing, null, 2));
