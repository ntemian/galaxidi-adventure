const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../index.html", "utf8");

// Extract VOICE_MAP keys
const mapMatch = html.match(/const VOICE_MAP = \{([\s\S]*?)\n\};/);
const mapContent = mapMatch[1];
const voiceKeys = new Set();
const keyRegex = /'([^']+)':\s*'voice\//g;
let m;
while ((m = keyRegex.exec(mapContent)) !== null) {
  voiceKeys.add(m[1]);
}
console.log("VOICE_MAP has", voiceKeys.size, "entries");

// Find all dialogue lines in showDlg calls
const dlgRegex = /\{s:'([^']*)',t:'([^']+)'/g;
const missing = [];
const seen = new Set();
while ((m = dlgRegex.exec(html)) !== null) {
  const speaker = m[1];
  const text = m[2];
  if (speaker === 'ΦΑΝΤΑΣΜΑ') continue;
  if (seen.has(text)) continue;
  seen.add(text);
  if (!voiceKeys.has(text)) {
    missing.push({ speaker, text });
  }
}

console.log("Missing voice lines:", missing.length);
missing.forEach((l, i) => {
  console.log((i+1) + ". [" + (l.speaker || "NARRATOR") + "] " + l.text.substring(0, 80));
});

fs.writeFileSync(__dirname + "/remaining-missing.json", JSON.stringify(missing, null, 2));
