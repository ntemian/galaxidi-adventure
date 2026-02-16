const fs = require("fs");
const lines = JSON.parse(fs.readFileSync(__dirname + "/dialog-lines.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync(__dirname + "/manifest.json", "utf8"));

const missing = [];
for (const line of lines) {
  const key = (line.speaker || "") + "|" + line.text;
  if (manifest[key] === undefined) {
    missing.push(line);
  }
}

console.log("Total lines in game:", lines.length);
console.log("Lines with voice:", lines.length - missing.length);
console.log("Lines MISSING voice:", missing.length);
console.log("");

const bySpeaker = {};
missing.forEach(l => {
  const s = l.speaker || "NARRATOR";
  if (!bySpeaker[s]) bySpeaker[s] = [];
  bySpeaker[s].push(l.text);
});

Object.entries(bySpeaker).sort((a, b) => b[1].length - a[1].length).forEach(([s, texts]) => {
  console.log(s + " (" + texts.length + " missing):");
  texts.forEach(t => console.log("  - " + t));
  console.log("");
});

// Also save missing lines for reference
fs.writeFileSync(__dirname + "/needs-generation.json", JSON.stringify(missing, null, 2));
console.log("Saved to needs-generation.json");
