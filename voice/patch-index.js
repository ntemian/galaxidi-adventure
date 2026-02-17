// Patch index.html: replace VOICE_MAP and add missing portraits
const fs = require("fs");

let html = fs.readFileSync(__dirname + "/../index.html", "utf8");
const newMap = fs.readFileSync(__dirname + "/voice-map-export.js", "utf8");

// 1. Replace VOICE_MAP (from "const VOICE_MAP = {" to "};" at the end of the map)
const mapStart = html.indexOf("const VOICE_MAP = {");
if (mapStart === -1) { console.error("VOICE_MAP not found!"); process.exit(1); }

// Find the closing }; — it's the first "};" after the map starts on its own line
let mapEnd = mapStart;
let braceDepth = 0;
let inString = false;
let escapeNext = false;
for (let i = mapStart; i < html.length; i++) {
  const c = html[i];
  if (escapeNext) { escapeNext = false; continue; }
  if (c === '\\') { escapeNext = true; continue; }
  if (c === "'") { inString = !inString; continue; }
  if (inString) continue;
  if (c === '{') braceDepth++;
  if (c === '}') {
    braceDepth--;
    if (braceDepth === 0) {
      // Find the semicolon after
      mapEnd = html.indexOf(';', i) + 1;
      break;
    }
  }
}

const before = html.substring(0, mapStart);
const after = html.substring(mapEnd);
html = before + newMap.trim() + after;
console.log("Replaced VOICE_MAP (" + (mapEnd - mapStart) + " chars -> " + newMap.trim().length + " chars)");

// 2. Add portrait loading for ΠΑΠΑΣ and ΧΡΥΣΟΣΤΟΜΟΣ
const curatorLine = "loadImg('port-curator', 'assets/portrait-curator.webp').then(img => { PORTRAITS['ΕΠΙΜΕΛΗΤΗΣ'] = img; }),";
const curatorIdx = html.indexOf(curatorLine);
if (curatorIdx === -1) {
  console.error("Curator portrait line not found!");
} else {
  const insertAfter = curatorIdx + curatorLine.length;
  const newPortraits = "\n    loadImg('port-papas', 'assets/portrait-papas.webp').then(img => { PORTRAITS['ΠΑΠΑΣ'] = img; }),\n    loadImg('port-chrysostomos', 'assets/portrait-chrysostomos.webp').then(img => { PORTRAITS['ΧΡΥΣΟΣΤΟΜΟΣ'] = img; }),";

  // Check if already added
  if (html.includes("port-papas")) {
    console.log("Papas portrait already loaded — skipping");
  } else {
    html = html.substring(0, insertAfter) + newPortraits + html.substring(insertAfter);
    console.log("Added portrait loading for ΠΑΠΑΣ and ΧΡΥΣΟΣΤΟΜΟΣ");
  }
}

fs.writeFileSync(__dirname + "/../index.html", html);
console.log("index.html patched successfully!");
