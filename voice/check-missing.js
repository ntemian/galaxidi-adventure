const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(__dirname + "/manifest.json", "utf8"));
let missing = [];
for (const [key, entry] of Object.entries(manifest)) {
  const path = __dirname + "/../voice/" + entry.file;
  if (!fs.existsSync(path)) {
    missing.push({ speaker: entry.speaker || "NARRATOR", file: entry.file, text: entry.text.substring(0, 60) });
  }
}
const bySpeaker = {};
missing.forEach(m => {
  bySpeaker[m.speaker] = (bySpeaker[m.speaker] || 0) + 1;
});
console.log("Missing files by speaker:");
Object.entries(bySpeaker).forEach(([s, c]) => console.log("  " + s + ": " + c));
console.log("Total missing:", missing.length);
console.log("\nMissing files:");
missing.forEach(m => console.log("  " + m.file + " | " + m.text));
